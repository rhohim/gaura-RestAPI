import Joi from 'joi'
import PortfolioType from '../type/portfolio.type'

export const PortofolioValidation = (payload: PortfolioType) => {
  const schema = Joi.object({
    id: Joi.number().required(),
    location: Joi.string().required(),
    area: Joi.string().required(),
    year: Joi.number().required(),
    slug: Joi.string().required(),
    cover: Joi.string().required(),
    highlight: Joi.number().required(),
    copy_1: Joi.string().required(),
    copy_2: Joi.string().required(),
    copy_3: Joi.string().required(),
    copy_4: Joi.string().required(),
    copy_5: Joi.string().required(),
    copy_6: Joi.string().required(),
    image_1: Joi.string().uri().allow('').optional(),
    image_2: Joi.string().uri().allow('').optional(),
    image_3: Joi.string().uri().allow('').optional(),
    image_4: Joi.string().uri().allow('').optional(),
    image_5: Joi.string().uri().allow('').optional(),
    image_6: Joi.string().uri().allow('').optional(),
    image_7: Joi.string().uri().allow('').optional(),
    image_8: Joi.string().uri().allow('').optional(),
    image_9: Joi.string().uri().allow('').optional(),
    image_10: Joi.string().uri().allow('').optional(),
    image_11: Joi.string().uri().allow('').optional(),
    image_12: Joi.string().uri().allow('').optional(),
    category_1_id: Joi.number().allow(null).optional(),
    category_2_id: Joi.number().allow(null).optional(),
    category_3_id: Joi.number().allow(null).optional(),
    client_id: Joi.number().required(),
    client_name: Joi.string(),
    category_name_1: Joi.string().allow(null).optional(),
    category_name_2: Joi.string().allow(null).optional(),
    category_name_3: Joi.string().allow(null).optional()
  })
  return schema.validate(payload)
}
