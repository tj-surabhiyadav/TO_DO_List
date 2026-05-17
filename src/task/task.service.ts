import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { UserService } from '../user/user.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { QueryTasksDto } from './dto/query-tasks.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskStatus } from './entities/task-status.enum';
import { Task } from './entities/task.entity';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    private readonly userService: UserService,
  ) {}

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    await this.userService.findOne(createTaskDto.userId);

    const task = this.taskRepository.create({
      ...createTaskDto,
      status: createTaskDto.status ?? TaskStatus.TODO,
    });
    return this.taskRepository.save(task);
  }

  async findAll(query: QueryTasksDto = {}): Promise<Task[]> {
    return this.taskRepository.find({
      where: this.buildWhere(query),
      relations: { user: true },
      order: { createdAt: 'DESC' },
      take: this.parseLimit(query.limit),
      skip: this.parseOffset(query.offset),
    });
  }

  async findByUser(userId: string, query: QueryTasksDto = {}): Promise<Task[]> {
    await this.userService.findOne(userId);

    return this.taskRepository.find({
      where: {
        ...this.buildWhere(query),
        userId,
      },
      relations: { user: true },
      order: { createdAt: 'DESC' },
      take: this.parseLimit(query.limit),
      skip: this.parseOffset(query.offset),
    });
  }

  async findOne(id: string): Promise<Task> {
    const task = await this.taskRepository.findOne({
      where: { id },
      relations: { user: true },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return task;
  }

  async update(id: string, updateTaskDto: UpdateTaskDto): Promise<Task> {
    const task = await this.findOne(id);

    if (updateTaskDto.userId && updateTaskDto.userId !== task.userId) {
      await this.userService.findOne(updateTaskDto.userId);
    }

    Object.assign(task, updateTaskDto);
    return this.taskRepository.save(task);
  }

  async updateStatus(
    id: string,
    updateTaskStatusDto: UpdateTaskStatusDto,
  ): Promise<Task> {
    const task = await this.findOne(id);
    task.status = updateTaskStatusDto.status;

    return this.taskRepository.save(task);
  }

  async remove(id: string): Promise<void> {
    const task = await this.findOne(id);
    await this.taskRepository.softRemove(task);
  }

  private buildWhere(query: QueryTasksDto): FindOptionsWhere<Task> {
    return query.status ? { status: query.status } : {};
  }

  private parseLimit(limit?: string): number | undefined {
    if (!limit) {
      return undefined;
    }

    const parsedLimit = Number(limit);

    if (parsedLimit <= 0) {
      return undefined;
    }

    return Math.min(parsedLimit, 100);
  }

  private parseOffset(offset?: string): number | undefined {
    if (!offset) {
      return undefined;
    }

    const parsedOffset = Number(offset);

    if (parsedOffset < 0) {
      return undefined;
    }

    return parsedOffset;
  }
}
