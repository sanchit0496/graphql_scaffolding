const Joi = require('joi');

const addUserSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required()
  // add other fields as necessary
});

module.exports = {
  addUserSchema
};