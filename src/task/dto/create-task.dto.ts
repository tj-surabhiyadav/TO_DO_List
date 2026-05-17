import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { TaskStatus } from '../entities/task-status.enum';

export class CreateTaskDto {
  @ApiProperty({ example: 'Build task API' })
  @IsNotEmpty()
  @IsString()
  title!: string;

  @ApiProperty({ example: 'Implement CRUD endpoints with validation' })
  @IsNotEmpty()
  @IsString()
  description!: string;

  @ApiPropertyOptional({ enum: TaskStatus, default: TaskStatus.TODO })
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @ApiProperty({ example: 'b657a7d2-b9f6-4c11-844a-d46f0cf7298a' })
  @IsNotEmpty()
  @IsUUID()
  userId!: string;
}
