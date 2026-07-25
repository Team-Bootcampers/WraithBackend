import { Observable } from 'rxjs';

export interface GetUserByIdRequest {
  id: string;
}

export interface ListUsersRequest {}

export interface ListUsersResponse {
  users: UserResponse[];
  total: number;
}

export interface UpdateUserRequest {
  id: string;
  displayName: string;
}

export interface DeleteUserRequest {
  id: string;
}

export interface DeleteUserResponse {
  success: boolean;
}

export interface UserResponse {
  id: string;
  firebaseUid: string;
  email: string;
  displayName: string;
  isActive: boolean;
  createdAt: string;
}

export interface UserServiceGrpcClient {
  getUserById(data: GetUserByIdRequest): Observable<UserResponse>;
  listUsers(data: ListUsersRequest): Observable<ListUsersResponse>;
  updateUser(data: UpdateUserRequest): Observable<UserResponse>;
  deleteUser(data: DeleteUserRequest): Observable<DeleteUserResponse>;
}
