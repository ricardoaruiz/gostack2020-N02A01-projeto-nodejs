export default {
  jwt: {
    secret: process.env.APP_SECRET || 'secret-for-tests',
    expiresIn: '1d',
  },
};
