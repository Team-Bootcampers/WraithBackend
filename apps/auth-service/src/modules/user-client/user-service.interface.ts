import { Observable } from 'rxjs';

export interface CreateUserRequest {
  firebaseUid: string;
  email: string;
  displayName?: string;
}

export interface GetUserByFirebaseUidRequest {
  firebaseUid: string;
}

export interface UserResponse {
  id: string;
  firebaseUid: string;
  email: string;
  displayName: string;
  createdAt: string;
}

export interface UserServiceGrpcClient {
  createUser(data: CreateUserRequest): Observable<UserResponse>;
  getUserByFirebaseUid(data: GetUserByFirebaseUidRequest): Observable<UserResponse>;
}
