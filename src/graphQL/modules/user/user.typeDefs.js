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

  type Query {
    _dummy: String
  }

  type Mutation {
    updatePersonalInfo(field: String!, value: String!): UpdateResponse!
  }
`;

module.exports = userTypeDefs;
