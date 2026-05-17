import { Controller, Get, Param, ParseUUIDPipe, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { QueryTasksDto } from './dto/query-tasks.dto';
import { TaskStatus } from './entities/task-status.enum';
import { TaskService } from './task.service';

@ApiTags('Users')
@Controller('users/:id/tasks')
export class UserTasksController {
  constructor(private readonly taskService: TaskService) {}

  @Get()
  @ApiOperation({ summary: 'Retrieve tasks assigned to a specific user' })
  @ApiQuery({ name: 'status', enum: TaskStatus, required: false })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiQuery({ name: 'offset', required: false, example: 0 })
  @ApiResponse({
    status: 200,
    description: 'User tasks retrieved successfully',
  })
  @ApiResponse({ status: 400, description: 'Invalid UUID' })
  @ApiResponse({ status: 404, description: 'User not found' })
  findByUser(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Query() query: QueryTasksDto,
  ) {
    return this.taskService.findByUser(id, query);
  }
}
