import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUsersService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;

  beforeEach(async () => {
    // create a fake users service
    const users: User[] = [];
    fakeUsersService = {
      findOne: (id: number) => {
        const user = users.find((user) => user.id === id);
        return Promise.resolve(user);
      },
      find: (email: string) => {
        const filteredUsers = users.filter((user) => user.email === email);
        return Promise.resolve(filteredUsers);
      },
      create: (email: string, password: string) => {
        const user = {
          id: Math.floor(Math.random() * 999999),
          email,
          password,
        } as User;

        users.push(user);
        return Promise.resolve(user);
      },
      // remove: (id: number) => {
      //   const index = users.findIndex((user) => user.id === id);
      //   if (index >= 0) {
      //     const [user] = users.splice(index, 1);
      //     return Promise.resolve(user);
      //   }
      //   return Promise.resolve(null);
      // },
      // update: (id: number, attrs: Partial<User>) => {
      //   const user = users.find((user) => user.id === id);
      //   if (user) {
      //     Object.assign(user, attrs);
      //     return Promise.resolve(user);
      //   }
      //   return Promise.resolve(null);
      // },
    };

    // create a fake auth service
    fakeAuthService = {
      signin: async (email: string) => {
        const [user] = await fakeUsersService.find(email);
        return Promise.resolve(user);
      },
      // signup: (email: string, password: string) => {
      //   return fakeUsersService.create(email, password);
      // },
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: UsersService, useValue: fakeUsersService },
        { provide: AuthService, useValue: fakeAuthService },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('findAll returns a list of users with a given email', async () => {
    const user = await fakeUsersService.create('abc@test.com', 'pass');
    const users = await controller.findAllUsers(user.email);

    expect(users).toHaveLength(1);
    expect(users[0].email).toEqual(user.email);
  });

  it('findUser returns a single user with a given id', async () => {
    const user = await fakeUsersService.create('abc@test.com', 'pass');
    const foundUser = await controller.findUser(user.id.toString());

    expect(foundUser).toBeDefined();
  });

  it('findUser throws an error if user with given id is not found', async () => {
    fakeUsersService.findOne = () => null;
    await expect(controller.findUser('1')).rejects.toThrow(NotFoundException);
  });

  it('signin updates session object and returns user', async () => {
    const user = await fakeUsersService.create('abc@test.com', 'pass');
    const session = { userId: 0 };
    const returnedUser = await controller.signin(
      { email: user.email } as CreateUserDto,
      session,
    );

    expect(returnedUser.id).toEqual(user.id);
    expect(session.userId).toEqual(user.id);
  });
});
