import Joi from 'joi';

// Output-boundary schemas (US-001-ac-5, T005/T009). Responses that do not match are never sent.

export const userDtoSchema = Joi.object({
  id: Joi.string().required(),
  name: Joi.string().required(),
  email: Joi.string().required(),
  is_verified: Joi.boolean().strict().required(),
  account_status: Joi.string().required(),
  created_at: Joi.string().isoDate().required(),
});

export const dashboardResponseSchema = Joi.object({
  user: userDtoSchema.required(),
  features: Joi.object({
    delete_account_visible: Joi.boolean().strict().valid(true).required(),
  }).required(),
});

export const profileResponseSchema = Joi.object({ user: userDtoSchema.required() });

export const errorResponseSchema = Joi.object({
  code: Joi.string().required(),
  message: Joi.string().required(),
  correlationId: Joi.string().required(),
});
