// schema/queries.js
const { GraphQLObjectType, GraphQLList, GraphQLInt, GraphQLNonNull } = require('graphql');
const AdminType = require('./types/AdminType');
const Admin = require('../models/Admin');
const redisClient = require('../config/redisClient');

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    admins: {
      type: new GraphQLList(AdminType),
      resolve(parent, args) {
        // Here, we find all admins using our Sequelize Admin model
        return Admin.findAll();
      },
    },
    admin: {
      type: AdminType,
      args: { id: { type: new GraphQLNonNull(GraphQLInt) } },
      async resolve(parent, args) {
        const cacheKey = `admin:${args.id}`;
        const cachedAdmin = await redisClient.get(cacheKey);

        if (cachedAdmin) {
          console.log('from cache')
          return JSON.parse(cachedAdmin);
        } else {
          console.log('from db')
          const admin = await Admin.findByPk(args.id);
          if (admin) {
            console.log('inside if')
            await redisClient.setex(cacheKey, 3600, JSON.stringify(admin)); // Cache for 1 hour
          }
          return admin;
        }
      },
    },
    // You can add more root-level queries here
  },
});

module.exports = RootQuery;
