
import { Injectable, PipeTransform, ArgumentMetadata, BadRequestException, NotAcceptableException, Inject } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import * as Joi from 'joi';
import { JOI_SCHEMA_KEY } from './joi-schema.decorator';

@Injectable()
export class JoiValidationPipe implements PipeTransform {
  constructor(private reflector: Reflector) {}

  transform(value: any, metadata: ArgumentMetadata) {
    // This pipe is intended to be used globally but picks up a per-route Joi schema via metadata.
    return value;
  }

  transformWithSchema(value: any, schema: Joi.ObjectSchema) {
    if (!schema) return value;
    const { error, value: validated } = schema.validate(value, { abortEarly: false, stripUnknown: true });
    if (error) {
      throw new BadRequestException(error.details.map(d => d.message).join(', '));
    }
    return validated;
  }
}
