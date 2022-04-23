require("dotenv").config();
import { ApolloServer } from "apollo-server-express";
import schema, { typeDefs, resolvers } from "./schema";
import { getUser, protectResolver } from "./users/users.utils";
import { graphqlUploadExpress } from "graphql-upload";
import express from "express";
import logger from "morgan";

const PORT = process.env.PORT;

const startServer = async () => {
  const server = new ApolloServer({
    resolvers,
    typeDefs,
    context: async ({ req }) => {
      return {
        loggedInUser: await getUser(req.headers.authorization),
        protectResolver,
      };
    },
  });
  
  await server.start();
  const app = express();
  app.use(graphqlUploadExpress());
  app.use(logger('tiny'));
  app.use("/static", express.static('uploads'));
  server.applyMiddleware({ app });
  await new Promise((func) => app.listen({ port: PORT }, func));
  console.log(`server: http://localhost:${PORT}${server.graphqlPath}`);
};

startServer();
