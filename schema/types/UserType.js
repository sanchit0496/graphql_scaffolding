const { GraphQLObjectType, GraphQLString, GraphQLInt } = require('graphql');

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: GraphQLInt },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    // Add other fields corresponding to your Sequelize model
  }),
});

module.exports = UserType;
