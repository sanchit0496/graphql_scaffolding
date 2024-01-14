const { GraphQLObjectType, GraphQLString, GraphQLInt } = require('graphql');

const AdminType = new GraphQLObjectType({
  name: 'Admin',
  fields: () => ({
    id: { type: GraphQLInt },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    // Add other fields corresponding to your Sequelize model
  }),
});

module.exports = AdminType;
