import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth/auth.service';
import { TaskStatus } from './entities/task-status.enum';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';

describe('TaskController', () => {
  let controller: TaskController;

  const taskService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
    update: jest.fn(),
    updateStatus: jest.fn(),
  };

  const authService = {
    verifyToken: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaskController],
      providers: [
        {
          provide: TaskService,
          useValue: taskService,
        },
        {
          provide: AuthService,
          useValue: authService,
        },
      ],
    }).compile();

    controller = module.get<TaskController>(TaskController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should delegate task creation to the service', async () => {
    const dto = {
      title: 'Design API',
      description: 'Define task management endpoints',
      status: TaskStatus.TODO,
      userId: 'b657a7d2-b9f6-4c11-844a-d46f0cf7298a',
    };
    const task = { id: 'task-id', ...dto };

    taskService.create.mockResolvedValue(task);

    await expect(controller.create(dto)).resolves.toEqual(task);
    expect(taskService.create).toHaveBeenCalledWith(dto);
  });
});
