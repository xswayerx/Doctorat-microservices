import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiConfigService {
  // Gateway service URL - routes via Eureka to microservices
  private readonly baseUrl = 'http://localhost:8080';

  // Service endpoints via gateway
  readonly usersUrl = `${this.baseUrl}/users`;
  readonly inscriptionsUrl = `${this.baseUrl}/inscriptions`;

  constructor() { }
}

