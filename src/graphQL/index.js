import { makeExecutableSchema } from '@graphql-tools/schema';
import { mergeTypeDefs } from '@graphql-tools/merge';
import { mergeResolvers } from '@graphql-tools/merge';
import userTypeDefs from './modules/user/user.typeDefs.js';
import userResolvers from './modules/user/user.resolvers.js';

const typeDefs = mergeTypeDefs([userTypeDefs]);
const resolvers = mergeResolvers([userResolvers]);

const schema = makeExecutableSchema({ typeDefs, resolvers });

export default schema;
