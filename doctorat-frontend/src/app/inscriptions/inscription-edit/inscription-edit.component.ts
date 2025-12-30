import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { InscriptionService } from '../../services/inscription.service';
import { UserService } from '../../services/user.service';
import { Inscription } from '../../models/inscription.model';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-inscription-edit',
  template: `
    <div class="container">
      <h1>Modifier l'inscription</h1>
      
      <div *ngIf="loading" style="text-align: center; padding: 20px;">
        <mat-spinner diameter="50"></mat-spinner>
      </div>

      <mat-card *ngIf="!loading && inscription">
        <mat-card-content>
          <form [formGroup]="inscriptionForm" (ngSubmit)="onSubmit()">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
              <mat-form-field appearance="outline">
                <mat-label>Doctorant</mat-label>
                <input matInput [value]="inscription.doctorantName || inscription.doctorantId" disabled>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Directeur de thèse</mat-label>
                <input matInput [value]="inscription.directeurName || inscription.directeurId" disabled>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Type</mat-label>
                <input matInput [value]="getTypeLabel(inscription.type)" disabled>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Année académique</mat-label>
                <input matInput [value]="getAnneeLabel(inscription.anneeAcademique)" disabled>
              </mat-form-field>

              <mat-form-field appearance="outline" style="grid-column: 1 / -1;">
                <mat-label>Sujet de thèse *</mat-label>
                <textarea matInput formControlName="sujetThese" rows="3" required></textarea>
                <mat-error *ngIf="inscriptionForm.get('sujetThese')?.hasError('required')">Sujet de thèse requis</mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Laboratoire *</mat-label>
                <input matInput formControlName="laboratoire" required>
                <mat-error *ngIf="inscriptionForm.get('laboratoire')?.hasError('required')">Laboratoire requis</mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Spécialité *</mat-label>
                <input matInput formControlName="specialite" required>
                <mat-error *ngIf="inscriptionForm.get('specialite')?.hasError('required')">Spécialité requise</mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Co-directeur</mat-label>
                <mat-select formControlName="coDirecteurId">
                  <mat-option value="">Aucun</mat-option>
                  <mat-option *ngFor="let directeur of directeurs" [value]="directeur.id">
                    {{ directeur.firstName }} {{ directeur.lastName }} ({{ directeur.email }})
                  </mat-option>
                </mat-select>
              </mat-form-field>
            </div>

            <div style="margin-top: 20px; display: flex; gap: 10px;">
              <button mat-raised-button color="primary" type="submit" [disabled]="inscriptionForm.invalid || saving">
                <mat-icon *ngIf="!saving">save</mat-icon>
                <mat-spinner *ngIf="saving" diameter="20" style="display: inline-block;"></mat-spinner>
                Enregistrer
              </button>
              <button mat-button type="button" routerLink="/inscriptions">Annuler</button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: []
})
export class InscriptionEditComponent implements OnInit {
  inscriptionForm!: FormGroup;
  inscription: Inscription | null = null;
  directeurs: User[] = [];
  loading = false;
  saving = false;

  constructor(
    private fb: FormBuilder,
    private inscriptionService: InscriptionService,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadInscription(id);
    }

    this.inscriptionForm = this.fb.group({
      sujetThese: ['', Validators.required],
      laboratoire: ['', Validators.required],
      specialite: ['', Validators.required],
      coDirecteurId: ['']
    });

    this.loadDirecteurs();
  }

  loadInscription(id: string): void {
    this.loading = true;
    this.inscriptionService.getInscriptionById(id).subscribe({
      next: (response) => {
        this.inscription = response.data;
        this.inscriptionForm.patchValue({
          sujetThese: this.inscription.sujetThese,
          laboratoire: this.inscription.laboratoire,
          specialite: this.inscription.specialite,
          coDirecteurId: this.inscription.coDirecteurId || ''
        });
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading inscription:', err);
        this.snackBar.open('Erreur lors du chargement de l\'inscription', 'Fermer', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  loadDirecteurs(): void {
    this.userService.getAllDirecteurs().subscribe({
      next: (response) => {
        this.directeurs = response.data || [];
      },
      error: (err) => {
        console.error('Error loading directeurs:', err);
      }
    });
  }

  getTypeLabel(type: string): string {
    return type === 'INSCRIPTION_INITIALE' ? 'Initiale' : 'Réinscription';
  }

  getAnneeLabel(annee: string): string {
    const labels: { [key: string]: string } = {
      'ANNEE_2023_2024': '2023-2024',
      'ANNEE_2024_2025': '2024-2025',
      'ANNEE_2025_2026': '2025-2026'
    };
    return labels[annee] || annee;
  }

  onSubmit(): void {
    if (this.inscriptionForm.valid && this.inscription) {
      this.saving = true;
      this.inscriptionService.updateInscription(this.inscription.id!, this.inscriptionForm.value).subscribe({
        next: () => {
          this.snackBar.open('Inscription mise à jour avec succès', 'Fermer', { duration: 3000 });
          this.router.navigate(['/inscriptions']);
        },
        error: (err) => {
          console.error('Error updating inscription:', err);
          this.snackBar.open('Erreur lors de la mise à jour', 'Fermer', { duration: 3000 });
          this.saving = false;
        }
      });
    }
  }
}

