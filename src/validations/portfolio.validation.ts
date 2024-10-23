import Joi from 'joi'
import PortfolioType from '../type/portfolio.type'

export const PortofolioValidation = (payload: PortfolioType) => {
  const schema = Joi.object({
    id: Joi.number().required(),
    location: Joi.string().required(),
    area: Joi.string().required(),
    cover: Joi.string().required(),
    highlight: Joi.number().required(),
    copy_1: Joi.string().required(),
    copy_2: Joi.string().required(),
    copy_3: Joi.string().required(),
    copy_4: Joi.string().required(),
    copy_5: Joi.string().required(),
    copy_6: Joi.string().required(),
    image_1: Joi.array().items(Joi.string().uri()).required(),
    category_id: Joi.number().required(),
    client_id: Joi.number().required()
  })
}
