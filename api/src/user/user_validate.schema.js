const Joi = require('joi');

const userSchema = Joi.object({
  id: Joi.number().optional(),
  name: Joi.string().max(100).required(),
  email: Joi.string()
    .max(80)
    .email({ tlds: { allow: false } })
    .required(),
  fone: Joi.string().max(32).required(),
}).options({ allowUnknown: false });

module.exports = { userSchema };
