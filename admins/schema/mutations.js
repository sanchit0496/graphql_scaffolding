// schema/mutations.js
const { GraphQLObjectType, GraphQLNonNull, GraphQLString, GraphQLInt } = require('graphql');
const AdminType = require('./types/AdminType');
const Admin = require('../models/Admin');
const { addAdminSchema } = require('../validations/adminValidation');
const redisClient = require('../config/redisClient');

const addAdmin = {
  type: AdminType,
  args: {
    name: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: new GraphQLNonNull(GraphQLString) },
  },
  resolve(parent, args) {
    const { error } = addAdminSchema.validate(args);
    if (error) {
      throw new Error(`Validation error: ${error.details.map(x => x.message).join(', ')}`);
    }
    return Admin.create({
      name: args.name,
      email: args.email
    });
  },
};

const updateAdmin = {
  type: AdminType,
  args: {
    id: { type: new GraphQLNonNull(GraphQLInt) },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    // include other fields that can be updated
  },
  async resolve(parent, args) {
    const admin = await Admin.findByPk(args.id);
    if (!admin) {
      throw new Error('Admin not found');
    }

    await admin.update(args);

    // Update the cache with the new data
    const cacheKey = `admin:${args.id}`;
    const updatedAdmin = await Admin.findByPk(args.id); // Fetch updated Admin data
    await redisClient.setex(cacheKey, 3600, JSON.stringify(updatedAdmin)); // Refresh cache

    return updatedAdmin;
  },
};


const deleteAdmin = {
  type: AdminType,
  args: {
    id: { type: new GraphQLNonNull(GraphQLInt) },
  },
  resolve(parent, args) {
    return Admin.findByPk(args.id).then(admin => {
      if (!admin) {
        throw new Error('Admin not found');
      }
      return admin.destroy();
    });
  },
};

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addAdmin: addAdmin,
    updateAdmin: updateAdmin,
    deleteAdmin: deleteAdmin
  }
});

module.exports = Mutation;
