export const getAuthEndpoints = () => {
  return [
    {
      method: 'POST',
      path: '/auth/login',
      summary: 'Authenticate user with username/email & password to receive signed JWT access and refresh tokens.',
      bodyExample: JSON.stringify(
        {
          username: 'Bret',
          password: 'password123'
        },
        null,
        2
      )
    },
    {
      method: 'POST',
      path: '/auth/register',
      summary: 'Register a new session user and immediately receive signed JWT tokens.',
      bodyExample: JSON.stringify(
        {
          name: 'Alice Smith',
          username: 'alice',
          email: 'alice@example.com',
          password: 'password123'
        },
        null,
        2
      )
    },
    {
      method: 'POST',
      path: '/auth/refresh',
      summary: 'Exchange a valid refresh token for a fresh 15-minute JWT access token.',
      bodyExample: JSON.stringify(
        {
          refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6...'
        },
        null,
        2
      )
    },
    {
      method: 'GET',
      path: '/auth/me',
      summary: 'Retrieve current authenticated user profile using Authorization: Bearer <access_token>.'
    },
    {
      method: 'PATCH',
      path: '/auth/me',
      summary: 'Update current authenticated user profile in the session sandbox using Authorization: Bearer <access_token>.',
      bodyExample: JSON.stringify(
        {
          name: 'Bret - Updated Profile',
          email: 'bret.new@example.com'
        },
        null,
        2
      )
    }
  ];
};
