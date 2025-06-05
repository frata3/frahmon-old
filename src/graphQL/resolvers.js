const { mergeResolvers } = require("@graphql-tools/merge");
const userResolvers = require("./modules/user/user.resolvers");

const resolvers = mergeResolvers([userResolvers]);

module.exports = resolvers;
