const {
  createDomain,
  getDomains,
  updateDomain,
  deleteDomain,
  getDomain,
} = require("../../services/domain_servises");
const CustomGraphQLError = require("../../handlers/AppError");

const domainResolver = {
  Query: {
    getDomains: async (parent, args) => {
      const domains = await getDomains(parent, args);
      if (!domains) {
        throw new CustomGraphQLError("Domains not fetched", {
          extensions: { code: "NOT_Found" },
        });
      }

      return domains;
    },
    getDomain: async (parent, args) => {
      const domain = await getDomain(args);
      if (!domain) {
        throw new CustomGraphQLError("Domain not fetched", {
          extensions: { code: "NOT_Found" },
        });
      }

      return domain;
    },
  },
  Mutation: {
    createDomain: async (parent, args) => {
      const created = await createDomain(args);
      if (!created) {
        throw new CustomGraphQLError("Domain not created", {
          extensions: { code: "NOT_Found" },
        });
      }

      return created;
    },
    editDomain: async (parent, args) => {
      // console.log(args);
      const updated = await updateDomain(args);
      if (!updated) {
        throw new CustomGraphQLError("Domain not updated", {
          extensions: { code: "NOT_Found" },
        });
      }

      return updated;
    },
    deleteDomain: async (parent, args) => {
      const deleted = await deleteDomain(args);
      if (!deleted) {
        throw new CustomGraphQLError("Domain not deleted", {
          extensions: { code: "NOT_Found" },
        });
      }

      return deleted;
    },
  },
};

module.exports = domainResolver;
