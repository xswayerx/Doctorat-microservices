export enum UserRole {
  CANDIDAT = 'CANDIDAT',
  DOCTORANT = 'DOCTORANT',
  DIRECTEUR_THESE = 'DIRECTEUR_THESE',
  PERSONNEL_ADMIN = 'PERSONNEL_ADMIN'
}

export enum UserStatus {
  ACTIF = 'ACTIF',
  INACTIF = 'INACTIF',
  SUSPENDU = 'SUSPENDU'
}

export interface User {
  id?: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: UserRole;
  status: UserStatus;
  studentId?: string;
  specialty?: string;
  laboratory?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateUserRequest {
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: UserRole;
  specialty?: string;
  laboratory?: string;
}

export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  phone?: string;
  specialty?: string;
  laboratory?: string;
}

export interface UpdateStatusRequest {
  status: UserStatus;
}

export interface UserResponseWrapper {
  success: boolean;
  message: string;
  data: User;
}

export interface UserListResponse {
  success: boolean;
  message: string;
  data: User[];
}

export interface UserStatistics {
  totalInscriptions?: number;
  pendingDefenses?: number;
  completedDefenses?: number;
  totalDoctorants?: number;
  activeSupervisions?: number;
  totalValidations?: number;
  pendingRequests?: number;
}

export interface UserProfile {
  user: User;
  statistics: UserStatistics;
}

