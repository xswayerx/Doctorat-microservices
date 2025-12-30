import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from '../../services/user.service';
import { UserProfile } from '../../models/user.model';

@Component({
  selector: 'app-user-profile',
  template: `
    <div class="container">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
        <h1>Profil utilisateur</h1>
        <button mat-button routerLink="/users">
          <mat-icon>arrow_back</mat-icon>
          Retour
        </button>
      </div>

      <div *ngIf="loading" style="text-align: center; padding: 20px;">
        <mat-spinner diameter="50"></mat-spinner>
      </div>

      <div *ngIf="!loading && profile">
        <mat-card style="margin-bottom: 20px;">
          <mat-card-header>
            <mat-card-title>Informations personnelles</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
              <div>
                <strong>Email:</strong> {{ profile.user.email }}
              </div>
              <div>
                <strong>Nom complet:</strong> {{ profile.user.firstName }} {{ profile.user.lastName }}
              </div>
              <div>
                <strong>Téléphone:</strong> {{ profile.user.phone || 'N/A' }}
              </div>
              <div>
                <strong>Rôle:</strong> {{ getRoleLabel(profile.user.role) }}
              </div>
              <div>
                <strong>Statut:</strong>
                <span [class]="'status-badge status-' + profile.user.status.toLowerCase()" style="margin-left: 10px;">
                  {{ profile.user.status }}
                </span>
              </div>
              <div *ngIf="profile.user.studentId">
                <strong>Numéro étudiant:</strong> {{ profile.user.studentId }}
              </div>
              <div *ngIf="profile.user.specialty">
                <strong>Spécialité:</strong> {{ profile.user.specialty }}
              </div>
              <div *ngIf="profile.user.laboratory">
                <strong>Laboratoire:</strong> {{ profile.user.laboratory }}
              </div>
            </div>
          </mat-card-content>
          <mat-card-actions>
            <button mat-raised-button color="primary" [routerLink]="['/users/edit', profile.user.id]">
              <mat-icon>edit</mat-icon>
              Modifier
            </button>
          </mat-card-actions>
        </mat-card>

        <mat-card *ngIf="profile.statistics">
          <mat-card-header>
            <mat-card-title>Statistiques</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px;">
              <div *ngIf="profile.statistics.totalInscriptions !== undefined">
                <strong>Total inscriptions:</strong> {{ profile.statistics.totalInscriptions }}
              </div>
              <div *ngIf="profile.statistics.pendingDefenses !== undefined">
                <strong>Défenses en attente:</strong> {{ profile.statistics.pendingDefenses }}
              </div>
              <div *ngIf="profile.statistics.completedDefenses !== undefined">
                <strong>Défenses complétées:</strong> {{ profile.statistics.completedDefenses }}
              </div>
              <div *ngIf="profile.statistics.totalDoctorants !== undefined">
                <strong>Total doctorants:</strong> {{ profile.statistics.totalDoctorants }}
              </div>
              <div *ngIf="profile.statistics.activeSupervisions !== undefined">
                <strong>Supervisions actives:</strong> {{ profile.statistics.activeSupervisions }}
              </div>
              <div *ngIf="profile.statistics.totalValidations !== undefined">
                <strong>Total validations:</strong> {{ profile.statistics.totalValidations }}
              </div>
              <div *ngIf="profile.statistics.pendingRequests !== undefined">
                <strong>Demandes en attente:</strong> {{ profile.statistics.pendingRequests }}
              </div>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: []
})
export class UserProfileComponent implements OnInit {
  profile: UserProfile | null = null;
  loading = false;

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadProfile(id);
    }
  }

  loadProfile(id: string): void {
    this.loading = true;
    this.userService.getUserProfile(id).subscribe({
      next: (response) => {
        this.profile = response;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading profile:', err);
        this.snackBar.open('Erreur lors du chargement du profil', 'Fermer', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  getRoleLabel(role: string): string {
    const labels: { [key: string]: string } = {
      'CANDIDAT': 'Candidat',
      'DOCTORANT': 'Doctorant',
      'DIRECTEUR_THESE': 'Directeur de thèse',
      'PERSONNEL_ADMIN': 'Personnel admin'
    };
    return labels[role] || role;
  }
}

