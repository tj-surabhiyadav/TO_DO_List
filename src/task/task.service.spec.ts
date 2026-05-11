import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserService } from '../user/user.service';
import { TaskStatus } from './entities/task-status.enum';
import { Task } from './entities/task.entity';
import { TaskService } from './task.service';

describe('TaskService', () => {
  let service: TaskService;

  const taskRepository = {
    create: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
    save: jest.fn(),
  };

  const userService = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskService,
        {
          provide: getRepositoryToken(Task),
          useValue: taskRepository,
        },
        {
          provide: UserService,
          useValue: userService,
        },
      ],
    }).compile();

    service = module.get<TaskService>(TaskService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should verify the user exists before creating a task', async () => {
    const dto = {
      title: 'Design API',
      description: 'Define task management endpoints',
      status: TaskStatus.TODO,
      userId: 'b657a7d2-b9f6-4c11-844a-d46f0cf7298a',
    };
    const task = { id: 'task-id', ...dto };

    userService.findOne.mockResolvedValue({ id: dto.userId });
    taskRepository.create.mockReturnValue(task);
    taskRepository.save.mockResolvedValue(task);

    await expect(service.create(dto)).resolves.toEqual(task);
    expect(userService.findOne).toHaveBeenCalledWith(dto.userId);
    expect(taskRepository.save).toHaveBeenCalledWith(task);
  });
});
