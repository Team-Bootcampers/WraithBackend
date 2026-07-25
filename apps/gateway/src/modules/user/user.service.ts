import { Inject, Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { status } from '@grpc/grpc-js';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { USER_PACKAGE } from '../user-client/user-client.module';
import { UserResponse, UserServiceGrpcClient } from '../user-client/user-service.interface';

@Injectable()
export class UserService implements OnModuleInit {
  private userClient: UserServiceGrpcClient;

  constructor(@Inject(USER_PACKAGE) private readonly userClientProxy: ClientGrpc) {}

  onModuleInit() {
    this.userClient = this.userClientProxy.getService<UserServiceGrpcClient>('UserService');
  }

  async listUsers(): Promise<UserResponse[]> {
    const response = await firstValueFrom(this.userClient.listUsers({}));
    return response.users;
  }

  getUserById(id: string): Promise<UserResponse> {
    return this.callAndMapErrors(() => firstValueFrom(this.userClient.getUserById({ id })));
  }

  updateUser(id: string, displayName: string): Promise<UserResponse> {
    return this.callAndMapErrors(() => firstValueFrom(this.userClient.updateUser({ id, displayName })));
  }

  async deleteUser(id: string): Promise<void> {
    await this.callAndMapErrors(() => firstValueFrom(this.userClient.deleteUser({ id })));
  }

  private async callAndMapErrors<T>(call: () => Promise<T>): Promise<T> {
    try {
      return await call();
    } catch (error) {
      const grpcError = error as { code?: number; details?: string };
      if (grpcError.code === status.NOT_FOUND) {
        throw new NotFoundException(grpcError.details ?? 'Kullanıcı bulunamadı');
      }
      throw error;
    }
  }
}
