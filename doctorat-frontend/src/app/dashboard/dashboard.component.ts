import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UserService } from '../services/user.service';
import { InscriptionService } from '../services/inscription.service';
import { UserListResponse } from '../models/user.model';
import { InscriptionListResponse } from '../models/inscription.model';

@Component({
  selector: 'app-dashboard',
  template: `
    <div class="container">
      <h1>Tableau de bord</h1>
      
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-top: 20px;">
        <mat-card>
          <mat-card-header>
            <mat-card-title>Utilisateurs</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <h2 style="margin: 0; color: #3f51b5;">{{ totalUsers }}</h2>
            <p>Total utilisateurs</p>
          </mat-card-content>
          <mat-card-actions>
            <button mat-button routerLink="/users">Voir tous</button>
          </mat-card-actions>
        </mat-card>

        <mat-card>
          <mat-card-header>
            <mat-card-title>Doctorants</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <h2 style="margin: 0; color: #3f51b5;">{{ totalDoctorants }}</h2>
            <p>Total doctorants</p>
          </mat-card-content>
          <mat-card-actions>
            <button mat-button routerLink="/users">Voir tous</button>
          </mat-card-actions>
        </mat-card>

        <mat-card>
          <mat-card-header>
            <mat-card-title>Inscriptions</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <h2 style="margin: 0; color: #3f51b5;">{{ totalInscriptions }}</h2>
            <p>Total inscriptions</p>
          </mat-card-content>
          <mat-card-actions>
            <button mat-button routerLink="/inscriptions">Voir toutes</button>
          </mat-card-actions>
        </mat-card>

        <mat-card>
          <mat-card-header>
            <mat-card-title>En attente</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <h2 style="margin: 0; color: #ff9800;">{{ pendingInscriptions }}</h2>
            <p>Inscriptions en attente</p>
          </mat-card-content>
          <mat-card-actions>
            <button mat-button routerLink="/inscriptions">Voir toutes</button>
          </mat-card-actions>
        </mat-card>
      </div>

      <div style="margin-top: 30px;">
        <mat-card>
          <mat-card-header>
            <mat-card-title>Actions rapides</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <button mat-raised-button color="primary" routerLink="/users/create" style="margin-right: 10px;">
              <mat-icon>person_add</mat-icon>
              Nouvel utilisateur
            </button>
            <button mat-raised-button color="primary" routerLink="/inscriptions/create">
              <mat-icon>add_circle</mat-icon>
              Nouvelle inscription
            </button>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: []
})
export class DashboardComponent implements OnInit {
  totalUsers = 0;
  totalDoctorants = 0;
  totalInscriptions = 0;
  pendingInscriptions = 0;

  constructor(
    private userService: UserService,
    private inscriptionService: InscriptionService
  ) { }

  ngOnInit(): void {
    this.loadStatistics();
  }

  loadStatistics(): void {
    this.userService.getAllUsers().subscribe({
      next: (response: UserListResponse) => {
        this.totalUsers = response.data?.length || 0;
      },
      error: (err) => console.error('Error loading users:', err)
    });

    this.userService.getAllDoctorants().subscribe({
      next: (response: UserListResponse) => {
        this.totalDoctorants = response.data?.length || 0;
      },
      error: (err) => console.error('Error loading doctorants:', err)
    });

    this.inscriptionService.getAllInscriptions().subscribe({
      next: (response: InscriptionListResponse) => {
        this.totalInscriptions = response.data?.length || 0;
        this.pendingInscriptions = response.data?.filter(
          i => i.status === 'EN_ATTENTE_DIRECTEUR' || i.status === 'EN_ATTENTE_ADMIN'
        ).length || 0;
      },
      error: (err) => console.error('Error loading inscriptions:', err)
    });
  }
}

