export default {
  jwt: {
    secret: process.env.APP_SECRET || 'secret-para-ambiente-dev',
    expiresIn: '1d',
  },
};
