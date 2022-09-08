import * as Joi from 'joi';

export const JoiValidationSchema = Joi.object({
    MONGODB: Joi.required(),
    PORT: Joi.number().default(3002),
    PREFIX_API: Joi.required(),
    DEFAULT_LIMIT: Joi.number().default(10),
    DEFAULT_OFFSET: Joi.number().default(0),
});