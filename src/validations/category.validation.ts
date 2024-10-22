import Joi from 'joi'
import CategoryType from '../type/category.type'

export const CategoryValidation = (payload: CategoryType) => {
  const schema = Joi.object({
    id: Joi.number().required(),
    category_name: Joi.string().required()
  })

  return schema.validate(payload)
}
