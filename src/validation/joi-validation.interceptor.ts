
import { Injectable, NestInterceptor, ExecutionContext, CallHandler, BadRequestException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import * as Joi from 'joi';
import { JOI_SCHEMA_KEY } from './joi-schema.decorator';

@Injectable()
export class JoiValidationInterceptor implements NestInterceptor {
  constructor(private reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const handler = context.getHandler();
    const classType = context.getClass();
    const schema: Joi.ObjectSchema | undefined = this.reflector.getAllAndOverride< Joi.ObjectSchema >(JOI_SCHEMA_KEY, [handler, classType]);
    if (!schema) {
      return next.handle();
    }
    const req = context.switchToHttp().getRequest();
    const body = req.body;
    const { error, value } = schema.validate(body, { abortEarly: false, stripUnknown: true });
    if (error) {
      throw new BadRequestException(error.details.map(d => d.message).join(', '));
    }
    req.body = value;
    return next.handle();
  }
}
