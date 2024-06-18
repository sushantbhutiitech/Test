const { GraphQLError } = require('graphql');

class CustomGraphQLError extends GraphQLError {
  constructor(message,extensions) {
    console.log("mes",message,extensions)
    super(message);
    this.extensions = extensions;
    GraphQLError.captureStackTrace(this, this.constructor);

  }

}

module.exports = CustomGraphQLError;
