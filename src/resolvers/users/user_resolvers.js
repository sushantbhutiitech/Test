const { GraphQLUpload } = require("graphql-upload");

const {
  getUserDetail,
  getJob,
  createUser,
  loginManualy,
  generateOtp,
  submitOtp,
  changePassword,
  setupUserProfile,
  addInterestedDomains,
  updateUserProfile,
  getUser,
} = require("../../services/user_services");

const CustomGraphQLError = require("../../handlers/AppError");

const userResolver = {
  Upload: GraphQLUpload,
  Query: {
    users: getUserDetail,
    getUser: async (parent, { userId }) => {
      const user = await getUser(userId);
      return { data: user };
    },
  },
  Mutation: {
    signUp: async (parent, args) => {
      const endUser = await createUser(parent, args);
      if (!endUser) {
        throw new CustomGraphQLError("user not created", {
          extensions: { code: "NOT_Found" },
        });
      }
      const {
        data,
        token: { token },
      } = endUser;
      console.log("data and token", data, token);
      return {
        token,
        data,
      };
    },
    Login: async (parent, { body }) => {
      let endUser = await loginManualy(parent, body);
      const {
        data,
        token: { token },
      } = endUser;
      return {
        token,
        data,
      };
    },

    forgetPassword: async (parent, { body }) => {
      let data = await generateOtp(parent, body);
      const { message, success } = data;
      return {
        message,
        success,
      };
    },

    submitOtp: async (parent, { body }) => {
      let data = await submitOtp(parent, body);
      console.log("dadadata", data);
      const { message, success } = data;

      return {
        message,
        success,
      };
    },
    changePassword: async (parent, { body }) => {
      console.log("body", body);
      try {
        result = await changePassword(body);
        const { message, success } = result;
        return {
          message,
          success,
        };
      } catch (error) {
        throw new CustomGraphQLError(error.message, {
          extensions: { code: "403" },
        });
      }
    },

    setupUserProfile: async (parent, { body, file }, context) => {
      return {
        message,
        success,
      };
    },
    changePassword: async (parent, { body }) => {
      console.log("body", body);
      try {
        result = await changePassword(body);
        const { message, success } = result;
        return {
          message,
          success,
        };
      } catch (error) {
        throw new CustomGraphQLError(error.message, {
          extensions: { code: "403" },
        });
      }
    },
    setupUserProfile: async (parent, { body, file }, context) => {
      let userId = context?.user._id;
      let endUser = await setupUserProfile(parent, { body, file }, userId);
      const { data } = endUser;
      return {
        data,
      };
    },
    addInterestedDomains: async (_, { body: { domains } }, context) => {
      try {
        console.log(domains);
        // Verification
        const userId = context?.user._id;

        // Ensuring the userID matches the authenticated user
        if (!userId) {
          throw new CustomGraphQLError("Unauthorized", {
            extentions: { code: "UNAUTHORIZED" },
          });
        }

        // Add interested domains
        const updateUser = await addInterestedDomains(domains, userId);
        console.log(updateUser);
        return {
          data: updateUser,
        };
      } catch (error) {
        throw new CustomGraphQLError(error.message, {
          extensions: { code: "403" },
        });
      }
    },

    updateUserProfile: async (_, { body, file }, context) => {
      try {
        const userId = context?.user._id;
        if (!userId) {
          throw new CustomGraphQLError("Unauthorized", {
            extensions: { code: "UNAUTHORIZED" },
          });
        }
        const updatedUser = await updateUserProfile({ body, file }, userId);

        return {
          data: updatedUser,
        };
      } catch (error) {
        throw new CustomGraphQLError(error.message, {
          extensions: { code: "403" },
        });
      }
    },
  },
};

module.exports = userResolver;
