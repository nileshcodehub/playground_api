import * as overlayService from '../services/overlayService.js';
import { signAccessToken, signRefreshToken, verifyToken } from '../utils/jwtUtils.js';
import { AppError } from '../middleware/errorHandler.js';

export const authController = {
  /**
   * POST /auth/login
   */
  login: async (req, res, next) => {
    try {
      const { username, email, password } = req.body || {};
      const users = await overlayService.getAllMergedRecords(req.identityId, 'users');

      let user = null;
      if (username) {
        user = users.find(u => u.username && u.username.toLowerCase() === String(username).toLowerCase());
      }
      if (!user && email) {
        user = users.find(u => u.email && u.email.toLowerCase() === String(email).toLowerCase());
      }
      // If no specific match found, fallback to User 1 (Bret) for easy developer prototyping
      if (!user) {
        user = users.find(u => String(u.id) === '1') || users[0];
      }

      if (!user) {
        throw new AppError('No user accounts available.', 404);
      }

      const userId = user.id;
      const payload = { userId, identityId: req.identityId, username: user.username || 'user' };

      const accessToken = signAccessToken(payload, '15m');
      const refreshToken = signRefreshToken(payload, '7d');

      res.status(200).json({
        access_token: accessToken,
        refresh_token: refreshToken,
        token_type: 'Bearer',
        expires_in: 900,
        user
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * POST /auth/register
   */
  register: async (req, res, next) => {
    try {
      const { name, username, email, password, company, address, phone, website } = req.body || {};

      if (!name || !username || !email) {
        throw new AppError('Name, username, and email are required for registration.', 400);
      }

      const userData = {
        name,
        username,
        email,
        company: company || { name: 'Playground Sandbox Inc.', catchPhrase: 'Developer First API' },
        address: address || { street: '123 Tech Lane', city: 'Dev City', zipcode: '90210' },
        phone: phone || '555-0199',
        website: website || 'playground.api'
      };

      const newUser = await overlayService.createOverlayRecord(req.identityId, 'users', userData);
      const userId = newUser.id;
      const payload = { userId, identityId: req.identityId, username: newUser.username };

      const accessToken = signAccessToken(payload, '15m');
      const refreshToken = signRefreshToken(payload, '7d');

      res.status(201).json({
        access_token: accessToken,
        refresh_token: refreshToken,
        token_type: 'Bearer',
        expires_in: 900,
        user: newUser
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * POST /auth/refresh
   */
  refreshToken: async (req, res, next) => {
    try {
      const { refreshToken } = req.body || {};

      if (!refreshToken) {
        throw new AppError('Refresh token is required.', 400);
      }

      const decoded = verifyToken(refreshToken);
      if (!decoded || decoded.token_type !== 'refresh') {
        throw new AppError('Invalid or expired refresh token.', 401);
      }

      const payload = {
        userId: decoded.userId,
        identityId: decoded.identityId || req.identityId,
        username: decoded.username
      };

      const newAccessToken = signAccessToken(payload, '15m');

      res.status(200).json({
        access_token: newAccessToken,
        token_type: 'Bearer',
        expires_in: 900
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /auth/me
   */
  getMe: async (req, res, next) => {
    try {
      let userId = req.userJwt ? req.userJwt.userId : null;

      if (!userId && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = verifyToken(token);
        if (decoded) {
          userId = decoded.userId;
        }
      }

      if (!userId) {
        throw new AppError('Unauthorized. Please provide a valid Bearer access token in the Authorization header.', 401);
      }

      const user = await overlayService.getSingleResource(req.identityId, 'users', userId);
      if (!user) {
        throw new AppError('Authenticated user profile not found.', 404);
      }

      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  },

  /**
   * PATCH /auth/me
   */
  updateMe: async (req, res, next) => {
    try {
      let userId = req.userJwt ? req.userJwt.userId : null;

      if (!userId && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = verifyToken(token);
        if (decoded) {
          userId = decoded.userId;
        }
      }

      if (!userId) {
        throw new AppError('Unauthorized. Please provide a valid Bearer access token in the Authorization header.', 401);
      }

      const updatedUser = await overlayService.updateOverlayRecord(req.identityId, 'users', userId, req.body, false);
      res.status(200).json(updatedUser);
    } catch (error) {
      next(error);
    }
  }
};
