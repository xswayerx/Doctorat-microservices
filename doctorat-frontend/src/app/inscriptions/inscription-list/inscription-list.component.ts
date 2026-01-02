import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import { InscriptionService } from '../../services/inscription.service';
import { Inscription, InscriptionListResponse, InscriptionStatus } from '../../models/inscription.model';

@Component({
  selector: 'app-inscription-list',
  template: `
    <div class="container">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
        <h1>Liste des inscriptions</h1>
        <button mat-raised-button color="primary" routerLink="/inscriptions/create">
          <mat-icon>add</mat-icon>
          Nouvelle inscription
        </button>
      </div>

      <mat-card>
        <div style="margin-bottom: 20px;">
          <mat-form-field appearance="outline" style="margin-right: 10px;">
            <mat-label>Filtrer par statut</mat-label>
            <mat-select [(ngModel)]="selectedStatus" (selectionChange)="filterByStatus()">
              <mat-option value="">Tous</mat-option>
              <mat-option value="BROUILLON">Brouillon</mat-option>
              <mat-option value="SOUMISE">Soumise</mat-option>
              <mat-option value="EN_ATTENTE_DIRECTEUR">En attente directeur</mat-option>
              <mat-option value="APPROUVEE_DIRECTEUR">Approuvée directeur</mat-option>
              <mat-option value="EN_ATTENTE_ADMIN">En attente admin</mat-option>
              <mat-option value="VALIDEE">Validée</mat-option>
              <mat-option value="REJETEE">Rejetée</mat-option>
            </mat-select>
          </mat-form-field>
          <button mat-button (click)="loadInscriptions()">
            <mat-icon>refresh</mat-icon>
            Actualiser
          </button>
        </div>

        <div *ngIf="loading" style="text-align: center; padding: 20px;">
          <mat-spinner diameter="50"></mat-spinner>
        </div>

        <table mat-table [dataSource]="dataSource" matSort class="mat-elevation-z8" *ngIf="!loading">
          <ng-container matColumnDef="doctorantName">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Doctorant</th>
            <td mat-cell *matCellDef="let inscription">{{ inscription.doctorantName || inscription.doctorantId }}</td>
          </ng-container>

          <ng-container matColumnDef="directeurName">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Directeur</th>
            <td mat-cell *matCellDef="let inscription">{{ inscription.directeurName || inscription.directeurId }}</td>
          </ng-container>

          <ng-container matColumnDef="sujetThese">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Sujet de thèse</th>
            <td mat-cell *matCellDef="let inscription">{{ inscription.sujetThese }}</td>
          </ng-container>

          <ng-container matColumnDef="type">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Type</th>
            <td mat-cell *matCellDef="let inscription">{{ getTypeLabel(inscription.type) }}</td>
          </ng-container>

          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Statut</th>
            <td mat-cell *matCellDef="let inscription">
              <span [class]="'status-badge status-' + getStatusClass(inscription.status)">
                {{ getStatusLabel(inscription.status) }}
              </span>
            </td>
          </ng-container>

          <ng-container matColumnDef="anneeAcademique">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Année académique</th>
            <td mat-cell *matCellDef="let inscription">{{ getAnneeLabel(inscription.anneeAcademique) }}</td>
          </ng-container>

          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>Actions</th>
            <td mat-cell *matCellDef="let inscription">
              <button mat-icon-button (click)="viewDetail(inscription.id!)" matTooltip="Voir les détails">
                <mat-icon>visibility</mat-icon>
              </button>
              <button mat-icon-button (click)="editInscription(inscription.id!)" matTooltip="Modifier">
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
    .mat-column-sujetThese {
      max-width: 300px;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  `]
})
export class InscriptionListComponent implements OnInit {
  displayedColumns: string[] = ['doctorantName', 'directeurName', 'sujetThese', 'type', 'status', 'anneeAcademique', 'actions'];
  dataSource = new MatTableDataSource<Inscription>([]);
  loading = false;
  selectedStatus: string = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private inscriptionService: InscriptionService,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadInscriptions();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadInscriptions(): void {
    this.loading = true;
    if (this.selectedStatus) {
      this.inscriptionService.getInscriptionsByStatus(this.selectedStatus as InscriptionStatus).subscribe({
        next: (response: InscriptionListResponse) => {
          this.dataSource.data = response.data || [];
          this.loading = false;
        },
        error: (err) => {
          console.error('Error loading inscriptions:', err);
          this.snackBar.open('Erreur lors du chargement des inscriptions', 'Fermer', { duration: 3000 });
          this.loading = false;
        }
      });
    } else {
      this.inscriptionService.getAllInscriptions().subscribe({
        next: (response: InscriptionListResponse) => {
          this.dataSource.data = response.data || [];
          this.loading = false;
        },
        error: (err) => {
          console.error('Error loading inscriptions:', err);
          this.snackBar.open('Erreur lors du chargement des inscriptions', 'Fermer', { duration: 3000 });
          this.loading = false;
        }
      });
    }
  }

  filterByStatus(): void {
    this.loadInscriptions();
  }

  viewDetail(id: string): void {
    this.router.navigate(['/inscriptions/detail', id]);
  }

  editInscription(id: string): void {
    this.router.navigate(['/inscriptions/edit', id]);
  }

  getTypeLabel(type: string): string {
    return type === 'INSCRIPTION_INITIALE' ? 'Initiale' : 'Réinscription';
  }

  getStatusLabel(status: string): string {
    const labels: { [key: string]: string } = {
      'BROUILLON': 'Brouillon',
      'SOUMISE': 'Soumise',
      'EN_ATTENTE_DIRECTEUR': 'En attente directeur',
      'APPROUVEE_DIRECTEUR': 'Approuvée directeur',
      'EN_ATTENTE_ADMIN': 'En attente admin',
      'VALIDEE': 'Validée',
      'REJETEE': 'Rejetée'
    };
    return labels[status] || status;
  }

  getStatusClass(status: string | null | undefined): string {
    if (!status) {
      return 'inconnu';
    }
    if (status.includes('ATTENTE')) return 'en-attente';
    if (status === 'VALIDEE' || status === 'APPROUVEE_DIRECTEUR') return 'approuvee';
    if (status === 'REJETEE') return 'rejetee';
    if (status === 'BROUILLON') return 'brouillon';
    if (status === 'SOUMISE') return 'soumise';
    return '';
  }

  getAnneeLabel(annee: string): string {
    const labels: { [key: string]: string } = {
      'ANNEE_2023_2024': '2023-2024',
      'ANNEE_2024_2025': '2024-2025',
      'ANNEE_2025_2026': '2025-2026'
    };
    return labels[annee] || annee;
  }
}

