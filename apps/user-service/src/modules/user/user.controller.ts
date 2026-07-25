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

interface GetUserByIdRequest {
  id: string;
}

interface UpdateUserRequest {
  id: string;
  displayName: string;
}

interface DeleteUserRequest {
  id: string;
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

  @GrpcMethod('UserService', 'GetUserById')
  async getUserById(data: GetUserByIdRequest) {
    try {
      const user = await this.userService.getUserById(data.id);
      return this.toResponse(user);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new RpcException({ code: status.NOT_FOUND, message: error.message });
      }
      throw new RpcException({ code: status.INTERNAL, message: error.message });
    }
  }

  @GrpcMethod('UserService', 'ListUsers')
  async listUsers() {
    const users = await this.userService.listUsers();
    return {
      users: users.map((user) => this.toResponse(user)),
      total: users.length,
    };
  }

  @GrpcMethod('UserService', 'UpdateUser')
  async updateUser(data: UpdateUserRequest) {
    try {
      const user = await this.userService.updateUser(data.id, { displayName: data.displayName });
      return this.toResponse(user);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new RpcException({ code: status.NOT_FOUND, message: error.message });
      }
      throw new RpcException({ code: status.INTERNAL, message: error.message });
    }
  }

  @GrpcMethod('UserService', 'DeleteUser')
  async deleteUser(data: DeleteUserRequest) {
    try {
      await this.userService.softDeleteUser(data.id);
      return { success: true };
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
      isActive: user.isActive,
      createdAt: user.createdAt.toISOString(),
    };
  }
}
