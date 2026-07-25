import { ConflictException, Controller, NotFoundException } from '@nestjs/common';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';
import { UserEntity } from './entities/user.entity';
import { UserService } from './user.service';

interface CreateUserRequest {
  firebaseUid: string;
  email: string;
  displayName?: string;
}

interface GetUserByFirebaseUidRequest {
  firebaseUid: string;
}

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @GrpcMethod('UserService', 'CreateUser')
  async createUser(data: CreateUserRequest) {
    try {
      const user = await this.userService.createUser(data);
      return this.toResponse(user);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw new RpcException({ code: status.ALREADY_EXISTS, message: error.message });
      }
      throw new RpcException({ code: status.INTERNAL, message: error.message });
    }
  }

  @GrpcMethod('UserService', 'GetUserByFirebaseUid')
  async getUserByFirebaseUid(data: GetUserByFirebaseUidRequest) {
    try {
      const user = await this.userService.getUserByFirebaseUid(data.firebaseUid);
      return this.toResponse(user);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new RpcException({ code: status.NOT_FOUND, message: error.message });
      }
      throw new RpcException({ code: status.INTERNAL, message: error.message });
    }
  }

  private toResponse(user: UserEntity) {
    return {
      id: user.id,
      firebaseUid: user.firebaseUid,
      email: user.email,
      displayName: user.displayName ?? '',
      createdAt: user.createdAt.toISOString(),
    };
  }
}
