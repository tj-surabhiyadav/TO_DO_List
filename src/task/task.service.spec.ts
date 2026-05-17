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
    softRemove: jest.fn(),
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

  it('should default task status to TODO when status is not provided', async () => {
    const dto = {
      title: 'Design API',
      description: 'Define task management endpoints',
      userId: 'b657a7d2-b9f6-4c11-844a-d46f0cf7298a',
    };
    const task = { id: 'task-id', ...dto, status: TaskStatus.TODO };

    userService.findOne.mockResolvedValue({ id: dto.userId });
    taskRepository.create.mockReturnValue(task);
    taskRepository.save.mockResolvedValue(task);

    await expect(service.create(dto)).resolves.toEqual(task);
    expect(taskRepository.create).toHaveBeenCalledWith({
      ...dto,
      status: TaskStatus.TODO,
    });
  });

  it('should filter and paginate tasks', async () => {
    taskRepository.find.mockResolvedValue([]);

    await expect(
      service.findAll({ status: TaskStatus.TODO, limit: '10', offset: '5' }),
    ).resolves.toEqual([]);
    expect(taskRepository.find).toHaveBeenCalledWith({
      where: { status: TaskStatus.TODO },
      relations: { user: true },
      order: { createdAt: 'DESC' },
      take: 10,
      skip: 5,
    });
  });

  it('should update only task status', async () => {
    const task = {
      id: 'task-id',
      status: TaskStatus.TODO,
    };

    taskRepository.findOne.mockResolvedValue(task);
    taskRepository.save.mockResolvedValue({
      ...task,
      status: TaskStatus.DONE,
    });

    await expect(
      service.updateStatus('task-id', { status: TaskStatus.DONE }),
    ).resolves.toEqual({
      ...task,
      status: TaskStatus.DONE,
    });
    expect(taskRepository.save).toHaveBeenCalledWith({
      ...task,
      status: TaskStatus.DONE,
    });
  });

  it('should soft delete tasks', async () => {
    const task = {
      id: 'task-id',
      status: TaskStatus.TODO,
    };

    taskRepository.findOne.mockResolvedValue(task);
    taskRepository.softRemove.mockResolvedValue(task);

    await expect(service.remove('task-id')).resolves.toBeUndefined();
    expect(taskRepository.softRemove).toHaveBeenCalledWith(task);
  });
});
