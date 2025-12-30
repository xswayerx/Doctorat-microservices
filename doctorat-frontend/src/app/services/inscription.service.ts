import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiConfigService } from './api-config.service';
import {
  Inscription,
  CreateInscriptionRequest,
  UpdateInscriptionRequest,
  ValidateInscriptionRequest,
  ReinscriptionRequest,
  InscriptionResponse,
  InscriptionListResponse,
  InscriptionStatus,
  InscriptionStatusDTO
} from '../models/inscription.model';

@Injectable({
  providedIn: 'root'
})
export class InscriptionService {
  constructor(
    private http: HttpClient,
    private apiConfig: ApiConfigService
  ) { }

  getAllInscriptions(): Observable<InscriptionListResponse> {
    return this.http.get<InscriptionListResponse>(this.apiConfig.inscriptionsUrl);
  }

  getInscriptionById(id: string): Observable<InscriptionResponse> {
    return this.http.get<InscriptionResponse>(`${this.apiConfig.inscriptionsUrl}/${id}`);
  }

  createInscription(request: CreateInscriptionRequest): Observable<InscriptionResponse> {
    return this.http.post<InscriptionResponse>(this.apiConfig.inscriptionsUrl, request);
  }

  updateInscription(id: string, request: UpdateInscriptionRequest): Observable<InscriptionResponse> {
    return this.http.put<InscriptionResponse>(`${this.apiConfig.inscriptionsUrl}/${id}`, request);
  }

  deleteInscription(id: string): Observable<any> {
    return this.http.delete(`${this.apiConfig.inscriptionsUrl}/${id}`);
  }

  validateByDirecteur(id: string, request: ValidateInscriptionRequest): Observable<InscriptionResponse> {
    return this.http.put<InscriptionResponse>(
      `${this.apiConfig.inscriptionsUrl}/${id}/validate/directeur`,
      request
    );
  }

  validateByAdmin(id: string, request: ValidateInscriptionRequest): Observable<InscriptionResponse> {
    return this.http.put<InscriptionResponse>(
      `${this.apiConfig.inscriptionsUrl}/${id}/validate/admin`,
      request
    );
  }

  getInscriptionStatus(id: string): Observable<InscriptionStatusDTO> {
    return this.http.get<InscriptionStatusDTO>(`${this.apiConfig.inscriptionsUrl}/${id}/status`);
  }

  getInscriptionsByDoctorant(doctorantId: string): Observable<InscriptionListResponse> {
    return this.http.get<InscriptionListResponse>(
      `${this.apiConfig.inscriptionsUrl}/doctorant/${doctorantId}`
    );
  }

  getInscriptionsByStatus(status: InscriptionStatus): Observable<InscriptionListResponse> {
    return this.http.get<InscriptionListResponse>(
      `${this.apiConfig.inscriptionsUrl}/status/${status}`
    );
  }

  createReinscription(request: ReinscriptionRequest): Observable<InscriptionResponse> {
    return this.http.post<InscriptionResponse>(
      `${this.apiConfig.inscriptionsUrl}/reinscriptions`,
      request
    );
  }

  healthCheck(): Observable<any> {
    return this.http.get(`${this.apiConfig.inscriptionsUrl}/health`);
  }
}

