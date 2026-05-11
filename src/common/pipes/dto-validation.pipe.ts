import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { validate } from 'class-validator';

@Injectable()
export class DtoValidationPipe implements PipeTransform {
  private readonly primitiveTypes = [
    String,
    Boolean,
    Number,
    Array,
    Object,
  ] as const;

  async transform(value: unknown, metadata: ArgumentMetadata) {
    const { metatype } = metadata;

    if (
      !metatype ||
      this.primitiveTypes.some((primitiveType) => primitiveType === metatype)
    ) {
      return value;
    }

    const dto = Object.assign(new metatype(), value);
    const errors = await validate(dto, {
      forbidNonWhitelisted: true,
      forbidUnknownValues: false,
      whitelist: true,
    });

    if (errors.length > 0) {
      const messages = errors.flatMap((error) =>
        error.constraints ? Object.values(error.constraints) : [],
      );
      throw new BadRequestException(messages);
    }

    return dto;
  }
}
