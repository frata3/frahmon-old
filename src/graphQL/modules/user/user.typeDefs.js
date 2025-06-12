const userTypeDefs = `
  type User {
    username: String
    fullname: String
    joined: String
  }

  type UpdateResponse {
    success: Boolean!
    message: String!
  }
    type ConnectionStatus {
    success: Boolean!
    message: String!
  }

  type UserConnection {
    followers: [User]
    followings: [User]
  }
  type Query {
    _dummy: String
    getFollowers(userId: ID!): [User]
    getFollowings(userId: ID!): [User]
    getConnectionStatus(userId: ID!, targetId: ID!): String
  }
  
  type Mutation {
    updatePersonalInfo(field: String!, value: String!): UpdateResponse!
    followUser(targetId: ID!): ConnectionStatus!
    unfollowUser(targetId: ID!): ConnectionStatus!
    acceptFollowRequest(requesterId: ID!): ConnectionStatus!
    rejectFollowRequest(requesterId: ID!): ConnectionStatus!
  }
`;

module.exports = userTypeDefs;
