require("dotenv").config();
import { ApolloServer } from "apollo-server-express";
import schema, { typeDefs, resolvers } from "./schema";
import { getUser, protectResolver } from "./users/users.utils";
import { graphqlUploadExpress } from "graphql-upload";
import express from "express";
import logger from "morgan";
import pubsub from "./pubsub";
import { createServer, Server } from "http";
import { WebSocketServer } from "ws";
import { ApolloServerPluginDrainHttpServer } from "apollo-server-core";
import { useServer } from "graphql-ws/lib/use/ws";

const PORT = process.env.PORT;
const startServer = async () => {
  const app = express();
  const httpServer = createServer(app);
  app.use(graphqlUploadExpress());
  app.use("/static", express.static("uploads"));
  app.use(logger("tiny"));

  const wsServer = new WebSocketServer({
    server: httpServer,
    path: "/graphql",
  });

  const serverCleanup = useServer({ typeDefs, resolvers }, wsServer);

  const server = new ApolloServer({
    resolvers,
    typeDefs,
    context: async ({ req }) => {
      if (req) {
        return {
          loggedInUser: await getUser(req.headers.authorization),
          protectResolver,
        };
      }
    },
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),

      {
        async serverWillstart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          };
        },
      },
    ],
  });
  await server.start();

  server.applyMiddleware({ app });

  httpServer.listen(PORT, () => {
    console.log(
      `Server is now running on http://localhost:${PORT}${server.graphqlPath}`
    );
  });
  // await new Promise((func) => app.listen({ port: PORT }, func));
  // console.log(`server: http://localhost:${PORT}${server.graphqlPath}`);
};

startServer();
