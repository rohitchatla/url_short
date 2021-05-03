module.exports = {
  uriMongo: process.env.URI_MONGO || 'mongodb://localhost/freeCodeCamp',
  domain:
    process.env.DOMAIN ||
    'https://magicshorturl.herokuapp.com' ||
    'localhost:3000',
};
