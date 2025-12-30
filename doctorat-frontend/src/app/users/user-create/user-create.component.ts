import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from '../../services/user.service';
import { UserRole } from '../../models/user.model';

@Component({
  selector: 'app-user-create',
  template: `
    <div class="container">
      <h1>Créer un nouvel utilisateur</h1>
      
      <mat-card>
        <mat-card-content>
          <form [formGroup]="userForm" (ngSubmit)="onSubmit()">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
              <mat-form-field appearance="outline">
                <mat-label>Email *</mat-label>
                <input matInput formControlName="email" type="email" required>
                <mat-error *ngIf="userForm.get('email')?.hasError('required')">Email requis</mat-error>
                <mat-error *ngIf="userForm.get('email')?.hasError('email')">Email invalide</mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Rôle *</mat-label>
                <mat-select formControlName="role" required>
                  <mat-option value="CANDIDAT">Candidat</mat-option>
                  <mat-option value="DOCTORANT">Doctorant</mat-option>
                  <mat-option value="DIRECTEUR_THESE">Directeur de thèse</mat-option>
                  <mat-option value="PERSONNEL_ADMIN">Personnel admin</mat-option>
                </mat-select>
                <mat-error *ngIf="userForm.get('role')?.hasError('required')">Rôle requis</mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Prénom *</mat-label>
                <input matInput formControlName="firstName" required>
                <mat-error *ngIf="userForm.get('firstName')?.hasError('required')">Prénom requis</mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Nom *</mat-label>
                <input matInput formControlName="lastName" required>
                <mat-error *ngIf="userForm.get('lastName')?.hasError('required')">Nom requis</mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Téléphone</mat-label>
                <input matInput formControlName="phone" type="tel">
              </mat-form-field>

              <mat-form-field appearance="outline" *ngIf="isDirecteur()">
                <mat-label>Spécialité</mat-label>
                <input matInput formControlName="specialty">
              </mat-form-field>

              <mat-form-field appearance="outline" *ngIf="isDirecteur()">
                <mat-label>Laboratoire</mat-label>
                <input matInput formControlName="laboratory">
              </mat-form-field>
            </div>

            <div style="margin-top: 20px; display: flex; gap: 10px;">
              <button mat-raised-button color="primary" type="submit" [disabled]="userForm.invalid || loading">
                <mat-icon *ngIf="!loading">save</mat-icon>
                <mat-spinner *ngIf="loading" diameter="20" style="display: inline-block;"></mat-spinner>
                Créer
              </button>
              <button mat-button type="button" routerLink="/users">Annuler</button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: []
})
export class UserCreateComponent implements OnInit {
  userForm!: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.userForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phone: [''],
      role: ['', Validators.required],
      specialty: [''],
      laboratory: ['']
    });
  }

  isDirecteur(): boolean {
    return this.userForm.get('role')?.value === 'DIRECTEUR_THESE';
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      this.loading = true;
      this.userService.createUser(this.userForm.value).subscribe({
        next: (response) => {
          this.snackBar.open('Utilisateur créé avec succès', 'Fermer', { duration: 3000 });
          this.router.navigate(['/users']);
        },
        error: (err) => {
          console.error('Error creating user:', err);
          this.snackBar.open('Erreur lors de la création de l\'utilisateur', 'Fermer', { duration: 3000 });
          this.loading = false;
        }
      });
    }
  }
}

