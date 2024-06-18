const { ApolloServer } = require("@apollo/server");
const { graphqlUploadExpress } = require("graphql-upload");
const { makeExecutableSchema } = require("@graphql-tools/schema");

const express = require("express");
const cors = require("cors");
const app = express();
const passport = require("passport");
const connectDB = require("../src/db/congoConnect");

const passportJWT = require("./config/passport-jwt-strategy");

const { expressMiddleware } = require("@apollo/server/express4");

const { startStandaloneServer } = require("@apollo/server/standalone");
connectDB();

const typeDefs = require("./graphQl-schemas/index");

const resolvers = require("./resolvers/index");

const authenticate = require("./config/auth");

//
app.use(passport.initialize());
app.use(express.json());
app.use(cors());
app.use(graphqlUploadExpress());
const getContext = async ({ req }) => {
  console.log("giigi");
  const user = await authenticate(req);

  return {
    user,
  };
};
const main = async () => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    csrfPrevention: false,
    cache: "bounded",
  });

  await server.start();
  //integrating graphql and apollo server in express app,

  //all request with route/graphql will wi handled by graphql
  app.use(
    "/graphql",
    express.json(),
    expressMiddleware(server, { context: getContext })
  );
};

main();

app.listen(process.env.PORT, (err) => {
  if (err) {
    console.log("error in starting nodejs server");
  }
  console.log("server is running on port", 8000);
});
