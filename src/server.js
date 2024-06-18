const { ApolloServer } = require("@apollo/server");
const { graphqlUploadExpress } = require("graphql-upload");
const { makeExecutableSchema } = require("@graphql-tools/schema");

const express = require("express");
const cors = require("cors");
const passport = require("passport");
const connectDB = require("../src/db/congoConnect");
const passportJWT = require("./config/passport-jwt-strategy");
const { expressMiddleware } = require("@apollo/server/express4");
const axios = require('axios');
require("dotenv").config();

const app = express();
connectDB();

const typeDefs = require("./graphQl-schemas/index");
const resolvers = require("./resolvers/index");
const authenticate = require("./config/auth");

// Middleware setup
app.use(passport.initialize());
app.use(express.json());
app.use(cors());
app.use(graphqlUploadExpress());

const getContext = async ({ req }) => {
  console.log("giigi");
  const user = await authenticate(req);
  return { user };
};

const main = async () => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    csrfPrevention: false,
    cache: "bounded",
  });

  await server.start();

  // Integrating GraphQL and Apollo Server in Express app,
  // all requests with route /graphql will be handled by GraphQL
  app.use(
    "/graphql",
    express.json(),
    expressMiddleware(server, { context: getContext })
  );

  // Create a keep-alive endpoint
  app.get("/keep-alive", (req, res) => {
    res.status(200).send("Server is alive");
  });

  // Start the Express server
  const PORT = process.env.PORT || 8000;
  app.listen(PORT, (err) => {
    if (err) {
      console.log("Error in starting Node.js server");
    } else {
      console.log(`Server is running on port ${PORT}`);

      // Set up keep-alive ping
      setInterval(() => {
        axios.get(`http://localhost:${PORT}/keep-alive`)
          .then(response => {
            console.log("Keep-alive ping successful:", response.data);
          })
          .catch(error => {
            console.error("Keep-alive ping failed:", error);
          });
      }, 300000); // Ping every 5 minutes
    }
  });
};

main().catch(err => console.error("Error in server setup:", err));
