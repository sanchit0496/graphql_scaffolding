// schema/queries.js
const { GraphQLObjectType, GraphQLList, GraphQLInt } = require('graphql');
const UserType = require('./types/UserType');
const User = require('../models/User');

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    users: {
      type: new GraphQLList(UserType),
      resolve(parent, args) {
        // Here, we find all users using our Sequelize User model
        return User.findAll();
      },
    },
    user: {
      type: UserType,
      args: { id: { type: GraphQLInt } },
      resolve(parent, args) {
        // Here, we find a single user by its id
        return User.findByPk(args.id);
      },
    },
    // You can add more root-level queries here
  },
});

module.exports = RootQuery;
