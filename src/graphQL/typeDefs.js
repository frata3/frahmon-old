import { mergeTypeDefs } from '@graphql-tools/merge';
import userTypeDefs from './modules/user/user.typeDefs.js';

const typeDefs = mergeTypeDefs([
  userTypeDefs,
]);

export default typeDefs;
