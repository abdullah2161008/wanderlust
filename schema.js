const Joi = require("joi");

const listingSchema = Joi.object({
    title:       Joi.string().required(),
    description: Joi.string().required(),
    price:       Joi.number().required().min(0),
    location:    Joi.string().required(),
    country:     Joi.string().required(),
    image:       Joi.string().uri().allow("", null),
});

module.exports = listingSchema;