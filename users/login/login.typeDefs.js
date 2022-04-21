import { gql } from "apollo-server";

export default gql`
  type LoginResult {
    ok: Boolean!
    Authorization: String
    error: String
  }

  type Mutation {
    login(userName: String!, password: String!): LoginResult!
  }
`;
