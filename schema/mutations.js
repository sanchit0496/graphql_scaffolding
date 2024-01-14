const { GraphQLObjectType, GraphQLString } = require('graphql');
const UserType = require('./types/UserType');
const User = require('../models/User');

const UserMutations = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addUser: {
      type: UserType,
      args: {
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        // Define other arguments
      },
      resolve(_, args) {
        return User.create(args);
      },
    },
    // Define other mutation fields
  },
});

module.exports = UserMutations
