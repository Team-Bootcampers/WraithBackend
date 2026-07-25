import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';

export interface CreateUserParams {
  firebaseUid: string;
  email: string;
  displayName?: string;
}

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async createUser(params: CreateUserParams): Promise<UserEntity> {
    const existing = await this.userRepository.findOne({ where: { firebaseUid: params.firebaseUid } });
    if (existing) {
      throw new ConflictException(`User with firebaseUid ${params.firebaseUid} already exists`);
    }

    const user = this.userRepository.create(params);
    return this.userRepository.save(user);
  }

  async getUserByFirebaseUid(firebaseUid: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne({ where: { firebaseUid } });
    if (!user) {
      throw new NotFoundException(`User with firebaseUid ${firebaseUid} not found`);
    }
    return user;
  }
}
