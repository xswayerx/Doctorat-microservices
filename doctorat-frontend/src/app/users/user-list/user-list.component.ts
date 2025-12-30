import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from '../../services/user.service';
import { User, UserListResponse, UserRole, UserStatus } from '../../models/user.model';

@Component({
  selector: 'app-user-list',
  template: `
    <div class="container">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
        <h1>Liste des utilisateurs</h1>
        <button mat-raised-button color="primary" routerLink="/users/create">
          <mat-icon>add</mat-icon>
          Nouvel utilisateur
        </button>
      </div>

      <mat-card>
        <div style="margin-bottom: 20px;">
          <mat-form-field appearance="outline" style="margin-right: 10px;">
            <mat-label>Filtrer par rôle</mat-label>
            <mat-select [(ngModel)]="selectedRole" (selectionChange)="filterByRole()">
              <mat-option value="">Tous</mat-option>
              <mat-option value="CANDIDAT">Candidat</mat-option>
              <mat-option value="DOCTORANT">Doctorant</mat-option>
              <mat-option value="DIRECTEUR_THESE">Directeur de thèse</mat-option>
              <mat-option value="PERSONNEL_ADMIN">Personnel admin</mat-option>
            </mat-select>
          </mat-form-field>
          <button mat-button (click)="loadUsers()">
            <mat-icon>refresh</mat-icon>
            Actualiser
          </button>
        </div>

        <div *ngIf="loading" style="text-align: center; padding: 20px;">
          <mat-spinner diameter="50"></mat-spinner>
        </div>

        <table mat-table [dataSource]="dataSource" matSort class="mat-elevation-z8" *ngIf="!loading">
          <ng-container matColumnDef="email">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Email</th>
            <td mat-cell *matCellDef="let user">{{ user.email }}</td>
          </ng-container>

          <ng-container matColumnDef="firstName">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Prénom</th>
            <td mat-cell *matCellDef="let user">{{ user.firstName }}</td>
          </ng-container>

          <ng-container matColumnDef="lastName">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Nom</th>
            <td mat-cell *matCellDef="let user">{{ user.lastName }}</td>
          </ng-container>

          <ng-container matColumnDef="role">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Rôle</th>
            <td mat-cell *matCellDef="let user">{{ getRoleLabel(user.role) }}</td>
          </ng-container>

          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Statut</th>
            <td mat-cell *matCellDef="let user">
              <span [class]="'status-badge status-' + user.status.toLowerCase()">
                {{ user.status }}
              </span>
            </td>
          </ng-container>

          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>Actions</th>
            <td mat-cell *matCellDef="let user">
              <button mat-icon-button (click)="viewProfile(user.id!)" matTooltip="Voir le profil">
                <mat-icon>visibility</mat-icon>
              </button>
              <button mat-icon-button (click)="editUser(user.id!)" matTooltip="Modifier">
                <mat-icon>edit</mat-icon>
              </button>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>

        <mat-paginator [pageSizeOptions]="[5, 10, 20, 50]" showFirstLastButtons></mat-paginator>
      </mat-card>
    </div>
  `,
  styles: [`
    table {
      width: 100%;
    }
    .mat-column-actions {
      width: 120px;
    }
  `]
})
export class UserListComponent implements OnInit {
  displayedColumns: string[] = ['email', 'firstName', 'lastName', 'role', 'status', 'actions'];
  dataSource = new MatTableDataSource<User>([]);
  loading = false;
  selectedRole: string = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private userService: UserService,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadUsers(): void {
    this.loading = true;
    if (this.selectedRole) {
      this.userService.getUsersByRole(this.selectedRole as UserRole).subscribe({
        next: (response: UserListResponse) => {
          this.dataSource.data = response.data || [];
          this.loading = false;
        },
        error: (err) => {
          console.error('Error loading users:', err);
          this.snackBar.open('Erreur lors du chargement des utilisateurs', 'Fermer', { duration: 3000 });
          this.loading = false;
        }
      });
    } else {
      this.userService.getAllUsers().subscribe({
        next: (response: UserListResponse) => {
          this.dataSource.data = response.data || [];
          this.loading = false;
        },
        error: (err) => {
          console.error('Error loading users:', err);
          this.snackBar.open('Erreur lors du chargement des utilisateurs', 'Fermer', { duration: 3000 });
          this.loading = false;
        }
      });
    }
  }

  filterByRole(): void {
    this.loadUsers();
  }

  viewProfile(id: string): void {
    this.router.navigate(['/users/profile', id]);
  }

  editUser(id: string): void {
    this.router.navigate(['/users/edit', id]);
  }

  getRoleLabel(role: UserRole): string {
    const labels: { [key: string]: string } = {
      'CANDIDAT': 'Candidat',
      'DOCTORANT': 'Doctorant',
      'DIRECTEUR_THESE': 'Directeur de thèse',
      'PERSONNEL_ADMIN': 'Personnel admin'
    };
    return labels[role] || role;
  }
}

