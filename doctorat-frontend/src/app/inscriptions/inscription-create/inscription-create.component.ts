import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { InscriptionService } from '../../services/inscription.service';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-inscription-create',
  template: `
    <div class="container">
      <h1>Créer une nouvelle inscription</h1>
      
      <mat-card>
        <mat-card-content>
          <form [formGroup]="inscriptionForm" (ngSubmit)="onSubmit()">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
              <mat-form-field appearance="outline">
                <mat-label>Doctorant *</mat-label>
                <mat-select formControlName="doctorantId" required>
                  <mat-option *ngFor="let doctorant of doctorants" [value]="doctorant.id">
                    {{ doctorant.firstName }} {{ doctorant.lastName }} ({{ doctorant.email }})
                  </mat-option>
                </mat-select>
                <mat-error *ngIf="inscriptionForm.get('doctorantId')?.hasError('required')">Doctorant requis</mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Directeur de thèse *</mat-label>
                <mat-select formControlName="directeurId" required>
                  <mat-option *ngFor="let directeur of directeurs" [value]="directeur.id">
                    {{ directeur.firstName }} {{ directeur.lastName }} ({{ directeur.email }})
                  </mat-option>
                </mat-select>
                <mat-error *ngIf="inscriptionForm.get('directeurId')?.hasError('required')">Directeur requis</mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Type *</mat-label>
                <mat-select formControlName="type" required>
                  <mat-option value="INSCRIPTION_INITIALE">Inscription initiale</mat-option>
                  <mat-option value="REINSCRIPTION">Réinscription</mat-option>
                </mat-select>
                <mat-error *ngIf="inscriptionForm.get('type')?.hasError('required')">Type requis</mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Année académique *</mat-label>
                <mat-select formControlName="anneeAcademique" required>
                  <mat-option value="ANNEE_2023_2024">2023-2024</mat-option>
                  <mat-option value="ANNEE_2024_2025">2024-2025</mat-option>
                  <mat-option value="ANNEE_2025_2026">2025-2026</mat-option>
                </mat-select>
                <mat-error *ngIf="inscriptionForm.get('anneeAcademique')?.hasError('required')">Année académique requise</mat-error>
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
                <mat-label>Co-directeur (optionnel)</mat-label>
                <mat-select formControlName="coDirecteurId">
                  <mat-option value="">Aucun</mat-option>
                  <mat-option *ngFor="let directeur of directeurs" [value]="directeur.id">
                    {{ directeur.firstName }} {{ directeur.lastName }} ({{ directeur.email }})
                  </mat-option>
                </mat-select>
              </mat-form-field>
            </div>

            <div style="margin-top: 20px; display: flex; gap: 10px;">
              <button mat-raised-button color="primary" type="submit" [disabled]="inscriptionForm.invalid || loading">
                <mat-icon *ngIf="!loading">save</mat-icon>
                <mat-spinner *ngIf="loading" diameter="20" style="display: inline-block;"></mat-spinner>
                Créer
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
export class InscriptionCreateComponent implements OnInit {
  inscriptionForm!: FormGroup;
  doctorants: User[] = [];
  directeurs: User[] = [];
  loading = false;

  constructor(
    private fb: FormBuilder,
    private inscriptionService: InscriptionService,
    private userService: UserService,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.inscriptionForm = this.fb.group({
      doctorantId: ['', Validators.required],
      directeurId: ['', Validators.required],
      type: ['', Validators.required],
      anneeAcademique: ['', Validators.required],
      sujetThese: ['', Validators.required],
      laboratoire: ['', Validators.required],
      specialite: ['', Validators.required],
      coDirecteurId: ['']
    });

    this.loadDoctorants();
    this.loadDirecteurs();
  }

  loadDoctorants(): void {
    this.userService.getAllDoctorants().subscribe({
      next: (response) => {
        this.doctorants = response.data || [];
      },
      error: (err) => {
        console.error('Error loading doctorants:', err);
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

  onSubmit(): void {
    if (this.inscriptionForm.valid) {
      this.loading = true;
      this.inscriptionService.createInscription(this.inscriptionForm.value).subscribe({
        next: (response) => {
          this.snackBar.open('Inscription créée avec succès', 'Fermer', { duration: 3000 });
          this.router.navigate(['/inscriptions']);
        },
        error: (err) => {
          console.error('Error creating inscription:', err);
          this.snackBar.open('Erreur lors de la création de l\'inscription', 'Fermer', { duration: 3000 });
          this.loading = false;
        }
      });
    }
  }
}

