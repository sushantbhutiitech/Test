const { ApolloServer } = require("@apollo/server");
const { graphqlUploadExpress } = require("graphql-upload");
const express = require("express");
const cors = require("cors");
const passport = require("passport");
const axios = require("axios"); // for keep-alive pings
const connectDB = require("../src/db/congoConnect");
const passportJWT = require("./config/passport-jwt-strategy");
const { expressMiddleware } = require("@apollo/server/express4");
const typeDefs = require("./graphQl-schemas/index");
const resolvers = require("./resolvers/index");
const authenticate = require("./config/auth");

const app = express();
connectDB();

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
    plugins: [
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await new Promise(resolve => setTimeout(resolve, 1000));
            },
          };
        },
      },
    ],
  });

  await server.start();

  // Integrating Apollo Server with Express app
  app.use(
    "/graphql",
    express.json(),
    expressMiddleware(server, { context: getContext })
  );

  // Keep-alive endpoint
  app.get("/keep-alive", (req, res) => {
    res.status(200).send("Server is alive");
  });

  const PORT = process.env.PORT || 8000;
  app.listen(PORT, (err) => {
    if (err) {
      console.log("Error in starting Node.js server:", err);
    } else {
      console.log(`Server is running on port ${PORT}`);

      // Keep-alive pings to prevent idling
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

main().catch(err => {
  console.error("Error in main function:", err);
});
