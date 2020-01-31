import Joi from '@hapi/joi'
import { ConfigModuleOptions } from '@nestjs/config/dist/interfaces'

const configModuleOptions: ConfigModuleOptions = {
  isGlobal: true,
  ignoreEnvFile: process.env.NODE_ENV !== 'development',
  validationSchema: Joi.object({
    NODE_ENV: Joi.string()
      .valid('development', 'production')
      .default('development'),
    PORT: Joi.number().default(3000),
    TELEGRAM_TOKEN: Joi.string().required(),
    DB_CONNECTION_STRING: Joi.string().required(),
    PARSING_SITE_URL: Joi.string().required()
  }),
  validationOptions: {
    allowUnknown: true,
    abortEarly: true
  }
}

export default configModuleOptions
