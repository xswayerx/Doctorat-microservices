import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiConfigService } from './api-config.service';
import {
  User,
  CreateUserRequest,
  UpdateUserRequest,
  UpdateStatusRequest,
  UserResponseWrapper,
  UserListResponse,
  UserProfile,
  UserRole
} from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(
    private http: HttpClient,
    private apiConfig: ApiConfigService
  ) { }

  getAllUsers(): Observable<UserListResponse> {
    return this.http.get<UserListResponse>(this.apiConfig.usersUrl);
  }

  getUserById(id: string): Observable<UserResponseWrapper> {
    return this.http.get<UserResponseWrapper>(`${this.apiConfig.usersUrl}/${id}`);
  }

  getUserByEmail(email: string): Observable<UserResponseWrapper> {
    const params = new HttpParams().set('email', email);
    return this.http.get<UserResponseWrapper>(`${this.apiConfig.usersUrl}/search`, { params });
  }

  createUser(request: CreateUserRequest): Observable<UserResponseWrapper> {
    return this.http.post<UserResponseWrapper>(this.apiConfig.usersUrl, request);
  }

  updateUser(id: string, request: UpdateUserRequest): Observable<UserResponseWrapper> {
    return this.http.put<UserResponseWrapper>(`${this.apiConfig.usersUrl}/${id}`, request);
  }

  updateUserStatus(id: string, request: UpdateStatusRequest): Observable<UserResponseWrapper> {
    return this.http.put<UserResponseWrapper>(`${this.apiConfig.usersUrl}/${id}/status`, request);
  }

  getUsersByRole(role: UserRole): Observable<UserListResponse> {
    return this.http.get<UserListResponse>(`${this.apiConfig.usersUrl}/role/${role}`);
  }

  getAllDoctorants(): Observable<UserListResponse> {
    return this.http.get<UserListResponse>(`${this.apiConfig.usersUrl}/doctorants`);
  }

  getAllCandidats(): Observable<UserListResponse> {
    return this.http.get<UserListResponse>(`${this.apiConfig.usersUrl}/candidats`);
  }

  getAllDirecteurs(): Observable<UserListResponse> {
    return this.http.get<UserListResponse>(`${this.apiConfig.usersUrl}/directeurs`);
  }

  getAllAdmins(): Observable<UserListResponse> {
    return this.http.get<UserListResponse>(`${this.apiConfig.usersUrl}/admin`);
  }

  getUserProfile(id: string): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.apiConfig.usersUrl}/${id}/profile`);
  }
}

