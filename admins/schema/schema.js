// schema/schema.js
const { GraphQLSchema } = require('graphql');
const RootQueryType = require('./queries');
const MutationType = require('./mutations');

module.exports = new GraphQLSchema({
  query: RootQueryType,
  mutation: MutationType
});
