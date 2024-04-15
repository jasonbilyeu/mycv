import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UpdateUserDto } from './dtos/update-user.dto';

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

  async findOne(id: number): Promise<User> {
    if (!id) return null;
    const user = await this.repo.findOneBy({ id });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  find(email: string): Promise<User[]> {
    return this.repo.find({ where: { email } });
  }

  async update(id: number, attrs: UpdateUserDto): Promise<User> {
    const user = await this.repo.findOneBy({ id });
    if (!user) throw new NotFoundException('User not found');
    Object.assign(user, attrs);
    return this.repo.save(user);
  }

  async remove(id: number): Promise<User> {
    const user = await this.repo.findOneBy({ id });
    if (!user) throw new NotFoundException('User not found');
    return this.repo.remove(user);
  }
}
