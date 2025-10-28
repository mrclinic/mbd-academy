
import { SetMetadata } from '@nestjs/common';
import * as Joi from 'joi';

export const JOI_SCHEMA_KEY = 'joi_schema';
export const JoiSchema = (schema: Joi.ObjectSchema) => SetMetadata(JOI_SCHEMA_KEY, schema);
