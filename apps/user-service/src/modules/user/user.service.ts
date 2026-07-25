import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';

export interface CreateUserParams {
  firebaseUid: string;
  email: string;
  displayName?: string;
}

export interface UpdateUserParams {
  displayName: string;
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

  async listUsers(): Promise<UserEntity[]> {
    return this.userRepository.find({ where: { isActive: true }, order: { createdAt: 'DESC' } });
  }

  async getUserById(id: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne({ where: { id, isActive: true } });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }

  async updateUser(id: string, params: UpdateUserParams): Promise<UserEntity> {
    const user = await this.getUserById(id);
    user.displayName = params.displayName;
    return this.userRepository.save(user);
  }

  async softDeleteUser(id: string): Promise<void> {
    const user = await this.getUserById(id);
    user.isActive = false;
    await this.userRepository.save(user);
  }

  async updateOnboardingAnswers(userId: string, answers: Record<string, unknown>): Promise<UserEntity> {
    const user = await this.getUserById(userId);
    user.onboardingAnswers = answers;
    user.isOnboarded = true;
    return this.userRepository.save(user);
  }

  async getOnboardingAnswers(userId: string): Promise<Record<string, unknown> | null> {
    const user = await this.getUserById(userId);
    return user.onboardingAnswers ?? null;
  }
}
