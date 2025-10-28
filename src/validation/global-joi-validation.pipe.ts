
import { Injectable, PipeTransform, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import * as Joi from 'joi';
import { JOI_SCHEMA_KEY } from './joi-schema.decorator';

@Injectable()
export class GlobalJoiValidationPipe implements PipeTransform {
  constructor(private reflector: Reflector) {}

  transform(value: any, metadata: ArgumentMetadata) {
    // Determine the schema for the current handler + class
    const handler = metadata?.metatype;
    // We can't get handler here directly; instead, use reflector to get schema for the current context via metadata per request
    // NOTE: In Nest, to access handler/class-level metadata we need to use the reflector in the pipe but we need the execution context,
    // which pipes don't expose. Therefore we'll rely on metadata attached to the function via reflector when pipe is instantiated in main.ts
    return value;
  }

  validateWithSchema(value: any, schema: Joi.ObjectSchema | undefined) {
    if (!schema) return value;
    const { error, value: validated } = schema.validate(value, { abortEarly: false, stripUnknown: true });
    if (error) throw new BadRequestException(error.details.map(d => d.message).join(', '));
    return validated;
  }
}
