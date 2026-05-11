import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';

describe('UserController', () => {
  let controller: UserController;

  const userService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
    update: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: userService,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should delegate user creation to the service', async () => {
    const dto = { name: 'Ada Lovelace', email: 'ada@example.com' };
    const user = { id: 'user-id', ...dto };

    userService.create.mockResolvedValue(user);

    await expect(controller.create(dto)).resolves.toEqual(user);
    expect(userService.create).toHaveBeenCalledWith(dto);
  });
});
