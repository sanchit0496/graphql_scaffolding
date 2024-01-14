// schema/queries.js
const { GraphQLObjectType, GraphQLList, GraphQLInt, GraphQLNonNull } = require('graphql');
const UserType = require('./types/UserType');
const User = require('../models/User');
const redisClient = require('../config/redisClient');

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
      args: { id: { type: new GraphQLNonNull(GraphQLInt) } },
      async resolve(parent, args) {
        const cacheKey = `user:${args.id}`;
        const cachedUser = await redisClient.get(cacheKey);

        if (cachedUser) {
          console.log('from cache')
          return JSON.parse(cachedUser);
        } else {
          console.log('from db')
          const user = await User.findByPk(args.id);
          if (user) {
            console.log('inside if')
            await redisClient.setex(cacheKey, 3600, JSON.stringify(user)); // Cache for 1 hour
          }
          return user;
        }
      },
    },
    // You can add more root-level queries here
  },
});

module.exports = RootQuery;
