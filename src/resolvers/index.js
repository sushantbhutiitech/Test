// graphql-tools use for merging multiple graphql schemas into one and multiple resolvers into one
const { mergeResolvers } = require("@graphql-tools/merge");

// here import all resolvers
const userResolver = require("./users/user_resolvers");
const domainResolver = require("./domain/domain_resolver");
// here import all resolvers
const rootResolver = mergeResolvers([userResolver, domainResolver]);

module.exports = rootResolver;
