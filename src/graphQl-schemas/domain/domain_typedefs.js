const domainTypeDef = `#graphql


type Query {
    getDomains:[Domain],
    getDomain(id:ID!):Domain
}
type Mutation {
    createDomain(body:domainInput):Domain,
    editDomain(id:ID!,body:domainInput):Domain
    deleteDomain(id:ID!):Domain
}

type Domain {
    _id:ID!
    name:String!
    isDisabled:Boolean 
}

input domainInput {
    name:String!
}
`;

module.exports = domainTypeDef;
