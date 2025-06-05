const { mergeTypeDefs } = require('@graphql-tools/merge');
const userTypeDefs = require('./modules/user/user.typeDefs');

const typeDefs = mergeTypeDefs([
  userTypeDefs,
]);

module.exports = typeDefs;
