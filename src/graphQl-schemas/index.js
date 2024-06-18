// type definitions are the schmas for grapql

const { mergeTypeDefs } = require("@graphql-tools/merge");

// here import all type defintions
const userTypeDef = require("./users/user_typedefs");
const domainTypeDef = require("./domain/domain_typedefs");
// here import all type defintions

const rootTypeDefinition = mergeTypeDefs([userTypeDef, domainTypeDef]);

module.exports = rootTypeDefinition;
