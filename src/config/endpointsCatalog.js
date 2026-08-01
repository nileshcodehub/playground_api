import { getUsersEndpoints } from './catalog/users.js';
import { getPostsEndpoints } from './catalog/posts.js';
import { getCommentsEndpoints } from './catalog/comments.js';
import { getTodosEndpoints } from './catalog/todos.js';

export const getEndpointsForResource = (resource, sampleRecord = null) => {
  switch (resource) {
    case 'users':
      return getUsersEndpoints(sampleRecord);
    case 'posts':
      return getPostsEndpoints(sampleRecord);
    case 'comments':
      return getCommentsEndpoints(sampleRecord);
    case 'todos':
      return getTodosEndpoints(sampleRecord);
    default:
      return [];
  }
};
