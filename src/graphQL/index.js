const { makeExecutableSchema } = require('@graphql-tools/schema');
const { mergeTypeDefs } = require('@graphql-tools/merge');
const { mergeResolvers } = require('@graphql-tools/merge');

const userTypeDefs = require('./modules/user/user.typeDefs');
const userResolvers = require('./modules/user/user.resolvers');

const typeDefs = mergeTypeDefs([userTypeDefs]);
const resolvers = mergeResolvers([userResolvers]);

const schema = makeExecutableSchema({ typeDefs, resolvers });

module.exports = schema;
