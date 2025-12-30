import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { InscriptionService } from '../../services/inscription.service';
import { Inscription } from '../../models/inscription.model';
import { InscriptionValidationComponent } from '../inscription-validation/inscription-validation.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-inscription-detail',
  template: `
    <div class="container">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
        <h1>Détails de l'inscription</h1>
        <div>
          <button mat-button routerLink="/inscriptions">
            <mat-icon>arrow_back</mat-icon>
            Retour
          </button>
          <button mat-raised-button color="primary" (click)="openValidationDialog()" *ngIf="canValidate()">
            <mat-icon>check_circle</mat-icon>
            Valider
          </button>
        </div>
      </div>

      <div *ngIf="loading" style="text-align: center; padding: 20px;">
        <mat-spinner diameter="50"></mat-spinner>
      </div>

      <div *ngIf="!loading && inscription">
        <mat-card style="margin-bottom: 20px;">
          <mat-card-header>
            <mat-card-title>Informations générales</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
              <div>
                <strong>Doctorant:</strong> {{ inscription.doctorantName || inscription.doctorantId }}
              </div>
              <div>
                <strong>Directeur de thèse:</strong> {{ inscription.directeurName || inscription.directeurId }}
              </div>
              <div>
                <strong>Type:</strong> {{ getTypeLabel(inscription.type) }}
              </div>
              <div>
                <strong>Statut:</strong>
                <span [class]="'status-badge status-' + getStatusClass(inscription.status)" style="margin-left: 10px;">
                  {{ getStatusLabel(inscription.status) }}
                </span>
              </div>
              <div>
                <strong>Année académique:</strong> {{ getAnneeLabel(inscription.anneeAcademique) }}
              </div>
              <div *ngIf="inscription.coDirecteurName">
                <strong>Co-directeur:</strong> {{ inscription.coDirecteurName }}
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card style="margin-bottom: 20px;">
          <mat-card-header>
            <mat-card-title>Informations académiques</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
              <div style="grid-column: 1 / -1;">
                <strong>Sujet de thèse:</strong>
                <p>{{ inscription.sujetThese }}</p>
              </div>
              <div>
                <strong>Laboratoire:</strong> {{ inscription.laboratoire }}
              </div>
              <div>
                <strong>Spécialité:</strong> {{ inscription.specialite }}
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card style="margin-bottom: 20px;" *ngIf="inscription.commentaireDirecteur || inscription.commentaireAdmin">
          <mat-card-header>
            <mat-card-title>Commentaires</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div *ngIf="inscription.commentaireDirecteur">
              <strong>Commentaire directeur:</strong>
              <p>{{ inscription.commentaireDirecteur }}</p>
            </div>
            <div *ngIf="inscription.commentaireAdmin">
              <strong>Commentaire admin:</strong>
              <p>{{ inscription.commentaireAdmin }}</p>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card>
          <mat-card-header>
            <mat-card-title>Dates</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
              <div *ngIf="inscription.dateCreation">
                <strong>Date de création:</strong> {{ formatDate(inscription.dateCreation) }}
              </div>
              <div *ngIf="inscription.dateModification">
                <strong>Dernière modification:</strong> {{ formatDate(inscription.dateModification) }}
              </div>
              <div *ngIf="inscription.dateValidation">
                <strong>Date de validation:</strong> {{ formatDate(inscription.dateValidation) }}
              </div>
            </div>
          </mat-card-content>
          <mat-card-actions>
            <button mat-raised-button color="primary" [routerLink]="['/inscriptions/edit', inscription.id]">
              <mat-icon>edit</mat-icon>
              Modifier
            </button>
          </mat-card-actions>
        </mat-card>
      </div>
    </div>
  `,
  styles: []
})
export class InscriptionDetailComponent implements OnInit {
  inscription: Inscription | null = null;
  loading = false;

  constructor(
    private inscriptionService: InscriptionService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadInscription(id);
    }
  }

  loadInscription(id: string): void {
    this.loading = true;
    this.inscriptionService.getInscriptionById(id).subscribe({
      next: (response) => {
        this.inscription = response.data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading inscription:', err);
        this.snackBar.open('Erreur lors du chargement de l\'inscription', 'Fermer', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  canValidate(): boolean {
    if (!this.inscription) return false;
    return this.inscription.status === 'EN_ATTENTE_DIRECTEUR' || 
           this.inscription.status === 'APPROUVEE_DIRECTEUR' ||
           this.inscription.status === 'EN_ATTENTE_ADMIN';
  }

  openValidationDialog(): void {
    if (!this.inscription) return;

    const dialogRef = this.dialog.open(InscriptionValidationComponent, {
      width: '500px',
      data: { inscription: this.inscription }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadInscription(this.inscription!.id!);
      }
    });
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

  getStatusClass(status: string): string {
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

  formatDate(date: string): string {
    if (!date) return '';
    return new Date(date).toLocaleString('fr-FR');
  }
}

