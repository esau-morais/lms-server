import dotenv from 'dotenv';
import Joi from 'joi';
import path from 'path';

export const loadConfig = () => {
  const envPath = path.join(__dirname, '..', '..', '.env');

  const result = dotenv.config({ path: envPath });
  if (result.error) {
    throw new Error(
      `Failed to load .env file from path ${envPath}: ${result.error.message}`,
    );
  }

  const schema = Joi.object({
    API_HOST: Joi.string().required(),
    API_PORT: Joi.string().required(),
    DATABASE_URL: Joi.string().required(),
    LOG_LEVEL: Joi.string()
      .valid('debug', 'info', 'warn', 'error', 'fatal')
      .required(),
  }).unknown(true);

  const { error } = schema.validate(process.env, { abortEarly: false });
  if (error) {
    throw new Error(`Config validation error: ${error.message}`);
  }
};
