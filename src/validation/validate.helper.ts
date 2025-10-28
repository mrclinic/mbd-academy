
import { Reflector } from '@nestjs/core';
import { JOI_SCHEMA_KEY } from './joi-schema.decorator';
import * as Joi from 'joi';
import { BadRequestException } from '@nestjs/common';

export function validateRouteBody(reflector: Reflector, handler: any, body: any) {
  const schema: Joi.ObjectSchema | undefined = reflector.get(JOI_SCHEMA_KEY, handler);
  if (!schema) return body;
  const { error, value } = schema.validate(body, { abortEarly: false, stripUnknown: true });
  if (error) throw new BadRequestException(error.details.map(d => d.message).join(', '));
  return value;
}
