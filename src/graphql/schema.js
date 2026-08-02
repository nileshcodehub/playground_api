import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLBoolean,
  GraphQLList,
  GraphQLNonNull,
  GraphQLID
} from 'graphql';

import * as overlayService from '../services/overlayService.js';
import { signAccessToken, signRefreshToken, verifyToken } from '../utils/jwtUtils.js';

// Address & Geo Types for User
const GeoType = new GraphQLObjectType({
  name: 'Geo',
  fields: {
    lat: { type: GraphQLString },
    lng: { type: GraphQLString }
  }
});

const AddressType = new GraphQLObjectType({
  name: 'Address',
  fields: {
    street: { type: GraphQLString },
    suite: { type: GraphQLString },
    city: { type: GraphQLString },
    zipcode: { type: GraphQLString },
    geo: { type: GeoType }
  }
});

const CompanyType = new GraphQLObjectType({
  name: 'Company',
  fields: {
    name: { type: GraphQLString },
    catchPhrase: { type: GraphQLString },
    bs: { type: GraphQLString }
  }
});

// Object Types forward declaration
let UserType;
let PostType;
let CommentType;
let TodoType;

const AuthPayloadType = new GraphQLObjectType({
  name: 'AuthPayload',
  fields: () => ({
    access_token: { type: GraphQLString },
    refresh_token: { type: GraphQLString },
    token_type: { type: GraphQLString },
    expires_in: { type: GraphQLInt },
    user: { type: UserType }
  })
});

UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    username: { type: GraphQLString },
    email: { type: GraphQLString },
    phone: { type: GraphQLString },
    website: { type: GraphQLString },
    address: { type: AddressType },
    company: { type: CompanyType },
    posts: {
      type: new GraphQLList(PostType),
      resolve: async (user, _args, context) => {
        const res = await overlayService.getPaginatedResource(context.identityId, 'posts', {
          limit: 100,
          filters: { user_id: user.id }
        });
        return res.data;
      }
    },
    todos: {
      type: new GraphQLList(TodoType),
      resolve: async (user, _args, context) => {
        const res = await overlayService.getPaginatedResource(context.identityId, 'todos', {
          limit: 100,
          filters: { user_id: user.id }
        });
        return res.data;
      }
    }
  })
});

PostType = new GraphQLObjectType({
  name: 'Post',
  fields: () => ({
    id: { type: GraphQLID },
    user_id: {
      type: GraphQLID,
      resolve: (post) => post.user_id ?? post.userId
    },
    userId: {
      type: GraphQLID,
      resolve: (post) => post.user_id ?? post.userId
    },
    title: { type: GraphQLString },
    body: { type: GraphQLString },
    user: {
      type: UserType,
      resolve: async (post, _args, context) => {
        const uid = post.user_id ?? post.userId;
        if (!uid) return null;
        return await overlayService.getSingleResource(context.identityId, 'users', uid);
      }
    },
    comments: {
      type: new GraphQLList(CommentType),
      resolve: async (post, _args, context) => {
        const res = await overlayService.getPaginatedResource(context.identityId, 'comments', {
          limit: 100,
          filters: { post_id: post.id }
        });
        return res.data;
      }
    }
  })
});

CommentType = new GraphQLObjectType({
  name: 'Comment',
  fields: () => ({
    id: { type: GraphQLID },
    post_id: {
      type: GraphQLID,
      resolve: (comment) => comment.post_id ?? comment.postId
    },
    postId: {
      type: GraphQLID,
      resolve: (comment) => comment.post_id ?? comment.postId
    },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    body: { type: GraphQLString },
    post: {
      type: PostType,
      resolve: async (comment, _args, context) => {
        const pid = comment.post_id ?? comment.postId;
        if (!pid) return null;
        return await overlayService.getSingleResource(context.identityId, 'posts', pid);
      }
    }
  })
});

TodoType = new GraphQLObjectType({
  name: 'Todo',
  fields: () => ({
    id: { type: GraphQLID },
    user_id: {
      type: GraphQLID,
      resolve: (todo) => todo.user_id ?? todo.userId
    },
    userId: {
      type: GraphQLID,
      resolve: (todo) => todo.user_id ?? todo.userId
    },
    title: { type: GraphQLString },
    completed: { type: GraphQLBoolean },
    user: {
      type: UserType,
      resolve: async (todo, _args, context) => {
        const uid = todo.user_id ?? todo.userId;
        if (!uid) return null;
        return await overlayService.getSingleResource(context.identityId, 'users', uid);
      }
    }
  })
});

// Root Query
const RootQuery = new GraphQLObjectType({
  name: 'Query',
  fields: {
    users: {
      type: new GraphQLList(UserType),
      args: {
        page: { type: GraphQLInt },
        limit: { type: GraphQLInt },
        q: { type: GraphQLString },
        _sort: { type: GraphQLString },
        _order: { type: GraphQLString }
      },
      resolve: async (_, args, context) => {
        const res = await overlayService.getPaginatedResource(context.identityId, 'users', args);
        return res.data;
      }
    },
    user: {
      type: UserType,
      args: { id: { type: new GraphQLNonNull(GraphQLID) } },
      resolve: async (_, { id }, context) => {
        return await overlayService.getSingleResource(context.identityId, 'users', id);
      }
    },
    me: {
      type: UserType,
      resolve: async (_, _args, context) => {
        let userId = context.req?.userJwt?.userId;
        if (!userId && context.req?.headers?.authorization?.startsWith('Bearer ')) {
          const token = context.req.headers.authorization.split(' ')[1];
          const decoded = verifyToken(token);
          if (decoded) userId = decoded.userId;
        }
        if (!userId) return null;
        return await overlayService.getSingleResource(context.identityId, 'users', userId);
      }
    },

    posts: {
      type: new GraphQLList(PostType),
      args: {
        page: { type: GraphQLInt },
        limit: { type: GraphQLInt },
        user_id: { type: GraphQLID },
        q: { type: GraphQLString },
        _sort: { type: GraphQLString },
        _order: { type: GraphQLString }
      },
      resolve: async (_, args, context) => {
        const { user_id, ...rest } = args;
        const filters = user_id ? { user_id } : {};
        const res = await overlayService.getPaginatedResource(context.identityId, 'posts', {
          ...rest,
          filters
        });
        return res.data;
      }
    },
    post: {
      type: PostType,
      args: { id: { type: new GraphQLNonNull(GraphQLID) } },
      resolve: async (_, { id }, context) => {
        return await overlayService.getSingleResource(context.identityId, 'posts', id);
      }
    },

    comments: {
      type: new GraphQLList(CommentType),
      args: {
        page: { type: GraphQLInt },
        limit: { type: GraphQLInt },
        post_id: { type: GraphQLID },
        q: { type: GraphQLString },
        _sort: { type: GraphQLString },
        _order: { type: GraphQLString }
      },
      resolve: async (_, args, context) => {
        const { post_id, ...rest } = args;
        const filters = post_id ? { post_id } : {};
        const res = await overlayService.getPaginatedResource(context.identityId, 'comments', {
          ...rest,
          filters
        });
        return res.data;
      }
    },
    comment: {
      type: CommentType,
      args: { id: { type: new GraphQLNonNull(GraphQLID) } },
      resolve: async (_, { id }, context) => {
        return await overlayService.getSingleResource(context.identityId, 'comments', id);
      }
    },

    todos: {
      type: new GraphQLList(TodoType),
      args: {
        page: { type: GraphQLInt },
        limit: { type: GraphQLInt },
        user_id: { type: GraphQLID },
        completed: { type: GraphQLBoolean },
        q: { type: GraphQLString },
        _sort: { type: GraphQLString },
        _order: { type: GraphQLString }
      },
      resolve: async (_, args, context) => {
        const { user_id, completed, ...rest } = args;
        const filters = {};
        if (user_id !== undefined) filters.user_id = user_id;
        if (completed !== undefined) filters.completed = completed;
        const res = await overlayService.getPaginatedResource(context.identityId, 'todos', {
          ...rest,
          filters
        });
        return res.data;
      }
    },
    todo: {
      type: TodoType,
      args: { id: { type: new GraphQLNonNull(GraphQLID) } },
      resolve: async (_, { id }, context) => {
        return await overlayService.getSingleResource(context.identityId, 'todos', id);
      }
    }
  }
});

// Root Mutations
const RootMutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    login: {
      type: AuthPayloadType,
      args: {
        username: { type: GraphQLString },
        email: { type: GraphQLString },
        password: { type: GraphQLString }
      },
      resolve: async (_, { username, email }, context) => {
        const users = await overlayService.getAllMergedRecords(context.identityId, 'users');
        let user = null;
        if (username) user = users.find(u => u.username && u.username.toLowerCase() === String(username).toLowerCase());
        if (!user && email) user = users.find(u => u.email && u.email.toLowerCase() === String(email).toLowerCase());
        if (!user) user = users.find(u => String(u.id) === '1') || users[0];
        const payload = { userId: user.id, identityId: context.identityId, username: user.username || 'user' };
        return {
          access_token: signAccessToken(payload, '15m'),
          refresh_token: signRefreshToken(payload, '7d'),
          token_type: 'Bearer',
          expires_in: 900,
          user
        };
      }
    },
    register: {
      type: AuthPayloadType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        username: { type: new GraphQLNonNull(GraphQLString) },
        email: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: GraphQLString }
      },
      resolve: async (_, { name, username, email }, context) => {
        const userData = {
          name,
          username,
          email,
          company: { name: 'Playground Sandbox Inc.', catchPhrase: 'Developer First API' },
          address: { street: '123 Tech Lane', city: 'Dev City', zipcode: '90210' }
        };
        const newUser = await overlayService.createOverlayRecord(context.identityId, 'users', userData);
        const payload = { userId: newUser.id, identityId: context.identityId, username: newUser.username };
        return {
          access_token: signAccessToken(payload, '15m'),
          refresh_token: signRefreshToken(payload, '7d'),
          token_type: 'Bearer',
          expires_in: 900,
          user: newUser
        };
      }
    },
    createUser: {
      type: UserType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        username: { type: GraphQLString },
        email: { type: GraphQLString },
        phone: { type: GraphQLString },
        website: { type: GraphQLString }
      },
      resolve: async (_, args, context) => {
        return await overlayService.createOverlayRecord(context.identityId, 'users', args);
      }
    },
    updateUser: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        name: { type: GraphQLString },
        username: { type: GraphQLString },
        email: { type: GraphQLString },
        phone: { type: GraphQLString },
        website: { type: GraphQLString }
      },
      resolve: async (_, { id, ...payload }, context) => {
        return await overlayService.updateOverlayRecord(context.identityId, 'users', id, payload, true);
      }
    },
    deleteUser: {
      type: GraphQLBoolean,
      args: { id: { type: new GraphQLNonNull(GraphQLID) } },
      resolve: async (_, { id }, context) => {
        await overlayService.deleteOverlayRecord(context.identityId, 'users', id);
        return true;
      }
    },

    createPost: {
      type: PostType,
      args: {
        user_id: { type: new GraphQLNonNull(GraphQLID) },
        title: { type: new GraphQLNonNull(GraphQLString) },
        body: { type: GraphQLString }
      },
      resolve: async (_, { user_id, title, body }, context) => {
        return await overlayService.createOverlayRecord(context.identityId, 'posts', {
          userId: Number(user_id) || user_id,
          user_id: Number(user_id) || user_id,
          title,
          body: body || ''
        });
      }
    },
    updatePost: {
      type: PostType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        title: { type: GraphQLString },
        body: { type: GraphQLString }
      },
      resolve: async (_, { id, ...payload }, context) => {
        return await overlayService.updateOverlayRecord(context.identityId, 'posts', id, payload, true);
      }
    },
    deletePost: {
      type: GraphQLBoolean,
      args: { id: { type: new GraphQLNonNull(GraphQLID) } },
      resolve: async (_, { id }, context) => {
        await overlayService.deleteOverlayRecord(context.identityId, 'posts', id);
        return true;
      }
    },

    createComment: {
      type: CommentType,
      args: {
        post_id: { type: new GraphQLNonNull(GraphQLID) },
        name: { type: new GraphQLNonNull(GraphQLString) },
        email: { type: new GraphQLNonNull(GraphQLString) },
        body: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve: async (_, { post_id, name, email, body }, context) => {
        return await overlayService.createOverlayRecord(context.identityId, 'comments', {
          postId: Number(post_id) || post_id,
          post_id: Number(post_id) || post_id,
          name,
          email,
          body
        });
      }
    },
    updateComment: {
      type: CommentType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        body: { type: GraphQLString }
      },
      resolve: async (_, { id, ...payload }, context) => {
        return await overlayService.updateOverlayRecord(context.identityId, 'comments', id, payload, true);
      }
    },
    deleteComment: {
      type: GraphQLBoolean,
      args: { id: { type: new GraphQLNonNull(GraphQLID) } },
      resolve: async (_, { id }, context) => {
        await overlayService.deleteOverlayRecord(context.identityId, 'comments', id);
        return true;
      }
    },

    createTodo: {
      type: TodoType,
      args: {
        user_id: { type: new GraphQLNonNull(GraphQLID) },
        title: { type: new GraphQLNonNull(GraphQLString) },
        completed: { type: GraphQLBoolean }
      },
      resolve: async (_, { user_id, title, completed }, context) => {
        return await overlayService.createOverlayRecord(context.identityId, 'todos', {
          userId: Number(user_id) || user_id,
          user_id: Number(user_id) || user_id,
          title,
          completed: completed ?? false
        });
      }
    },
    updateTodo: {
      type: TodoType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        title: { type: GraphQLString },
        completed: { type: GraphQLBoolean }
      },
      resolve: async (_, { id, ...payload }, context) => {
        return await overlayService.updateOverlayRecord(context.identityId, 'todos', id, payload, true);
      }
    },
    deleteTodo: {
      type: GraphQLBoolean,
      args: { id: { type: new GraphQLNonNull(GraphQLID) } },
      resolve: async (_, { id }, context) => {
        await overlayService.deleteOverlayRecord(context.identityId, 'todos', id);
        return true;
      }
    }
  }
});

export const schema = new GraphQLSchema({
  query: RootQuery,
  mutation: RootMutation
});
