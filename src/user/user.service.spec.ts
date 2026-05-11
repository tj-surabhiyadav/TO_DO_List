import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { User } from './entities/user.entity';

describe('UserService', () => {
  let service: UserService;

  const userRepository = {
    create: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: userRepository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a user when email is unique', async () => {
    const dto = { name: 'Ada Lovelace', email: 'ada@example.com' };
    const user = { id: 'user-id', ...dto };

    userRepository.findOne.mockResolvedValue(null);
    userRepository.create.mockReturnValue(user);
    userRepository.save.mockResolvedValue(user);

    await expect(service.create(dto)).resolves.toEqual(user);
    expect(userRepository.findOne).toHaveBeenCalledWith({
      where: { email: dto.email },
    });
    expect(userRepository.save).toHaveBeenCalledWith(user);
  });
});
