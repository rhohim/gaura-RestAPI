import Joi from 'joi'
import ClientType from '../type/client.type'

export const ClientValidation = (payload: ClientType) => {
  const schema = Joi.object({
    id: Joi.number().required(),
    client_name: Joi.string().required(),
    client_image: Joi.string().allow(null, '').optional()
  })

  return schema.validate(payload)
}
