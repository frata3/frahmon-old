import { mergeResolvers } from '@graphql-tools/merge';
import userResolvers from './modules/user/user.resolvers.js';

const resolvers = mergeResolvers([userResolvers]);

export default resolvers;
