// schema/mutations.js
const { GraphQLObjectType, GraphQLNonNull, GraphQLString, GraphQLInt } = require('graphql');
const UserType = require('./types/UserType');
const User = require('../models/User');

const addUser = {
  type: UserType,
  args: {
    name: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: new GraphQLNonNull(GraphQLString) },
  },
  resolve(parent, args) {
    return User.create({
      name: args.name,
      email: args.email
    });
  },
};

const updateUser = {
  type: UserType,
  args: {
    id: { type: new GraphQLNonNull(GraphQLInt) },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
  },
  resolve(parent, args) {
    return User.findByPk(args.id).then(user => {
      if (!user) {
        throw new Error('User not found');
      }
      return user.update({
        name: args.name || user.name,
        email: args.email || user.email
      });
    });
  },
};

const deleteUser = {
  type: UserType,
  args: {
    id: { type: new GraphQLNonNull(GraphQLInt) },
  },
  resolve(parent, args) {
    return User.findByPk(args.id).then(user => {
      if (!user) {
        throw new Error('User not found');
      }
      return user.destroy();
    });
  },
};

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addUser: addUser,
    updateUser: updateUser,
    deleteUser: deleteUser
  }
});

module.exports = Mutation;
