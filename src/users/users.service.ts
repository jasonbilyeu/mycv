import { Injectable } from '@nestjs/common';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private repo: Repository<User>,
  ) {}

  create(email: string, password: string): Promise<User> {
    const user = this.repo.create({ email, password });
    return this.repo.save(user);
  }

  findOne(id: number): Promise<User> {
    return this.repo.findOneBy({ id });
  }

  find(email: string): Promise<User[]> {
    return this.repo.find({ where: { email } });
  }

  update(id: number, attrs: Partial<User>): Promise<UpdateResult> {
    return this.repo.update(id, attrs);
  }

  remove(id: number): Promise<DeleteResult> {
    return this.repo.delete(id);
  }
}
