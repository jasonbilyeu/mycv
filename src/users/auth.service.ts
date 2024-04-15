import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from './users.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signup(email: string, password: string) {
    // see iff email is in use
    const users = await this.usersService.find(email);
    if (users.length) throw new BadRequestException('Email in use');

    // hash the users password
    // generate a salt
    const salt = randomBytes(8).toString('hex');

    // hash salt and password together
    const hash = (await scrypt(password, salt, 32)) as Buffer;

    // join hashed result and salt together
    const password_hash = salt + '.' + hash.toString('hex');

    // create a new user and save it
    const user = await this.usersService.create(email, password_hash);

    return user;
  }

  async signin(email: string, password: string) {
    // see if email exists
    const [user] = await this.usersService.find(email);
    if (!user) throw new BadRequestException('Invalid credentials');

    // hash the password and compare it to the password in the database
    const [salt, storedHash] = user.password.split('.');
    // if it matches, return the user
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    if (hash.toString('hex') !== storedHash) {
      throw new BadRequestException('Invalid credentials');
    }

    return user;
  }
}
