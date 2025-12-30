import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from '../../services/user.service';
import { User, UpdateStatusRequest, UserStatus } from '../../models/user.model';

@Component({
  selector: 'app-user-edit',
  template: `
    <div class="container">
      <h1>Modifier l'utilisateur</h1>
      
      <div *ngIf="loading" style="text-align: center; padding: 20px;">
        <mat-spinner diameter="50"></mat-spinner>
      </div>

      <mat-card *ngIf="!loading && user">
        <mat-card-content>
          <form [formGroup]="userForm" (ngSubmit)="onSubmit()">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
              <mat-form-field appearance="outline">
                <mat-label>Email</mat-label>
                <input matInput [value]="user.email" disabled>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Rôle</mat-label>
                <input matInput [value]="getRoleLabel(user.role)" disabled>
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

              <mat-form-field appearance="outline">
                <mat-label>Statut</mat-label>
                <mat-select formControlName="status">
                  <mat-option value="ACTIF">Actif</mat-option>
                  <mat-option value="INACTIF">Inactif</mat-option>
                  <mat-option value="SUSPENDU">Suspendu</mat-option>
                </mat-select>
              </mat-form-field>
            </div>

            <div style="margin-top: 20px; display: flex; gap: 10px;">
              <button mat-raised-button color="primary" type="submit" [disabled]="userForm.invalid || saving">
                <mat-icon *ngIf="!saving">save</mat-icon>
                <mat-spinner *ngIf="saving" diameter="20" style="display: inline-block;"></mat-spinner>
                Enregistrer
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
export class UserEditComponent implements OnInit {
  userForm!: FormGroup;
  user: User | null = null;
  loading = false;
  saving = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadUser(id);
    }

    this.userForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phone: [''],
      specialty: [''],
      laboratory: [''],
      status: ['']
    });
  }

  loadUser(id: string): void {
    this.loading = true;
    this.userService.getUserById(id).subscribe({
      next: (response) => {
        this.user = response.data;
        this.userForm.patchValue({
          firstName: this.user.firstName,
          lastName: this.user.lastName,
          phone: this.user.phone || '',
          specialty: this.user.specialty || '',
          laboratory: this.user.laboratory || '',
          status: this.user.status
        });
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading user:', err);
        this.snackBar.open('Erreur lors du chargement de l\'utilisateur', 'Fermer', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  isDirecteur(): boolean {
    return this.user?.role === 'DIRECTEUR_THESE';
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

  onSubmit(): void {
    if (this.userForm.valid && this.user) {
      this.saving = true;
      const updateRequest = {
        firstName: this.userForm.value.firstName,
        lastName: this.userForm.value.lastName,
        phone: this.userForm.value.phone,
        specialty: this.userForm.value.specialty,
        laboratory: this.userForm.value.laboratory
      };

      this.userService.updateUser(this.user.id!, updateRequest).subscribe({
        next: () => {
          if (this.userForm.value.status !== this.user!.status) {
            const statusRequest: UpdateStatusRequest = { status: this.userForm.value.status as UserStatus };
            this.userService.updateUserStatus(this.user!.id!, statusRequest).subscribe({
              next: () => {
                this.snackBar.open('Utilisateur mis à jour avec succès', 'Fermer', { duration: 3000 });
                this.router.navigate(['/users']);
              },
              error: (err) => {
                console.error('Error updating status:', err);
                this.snackBar.open('Erreur lors de la mise à jour du statut', 'Fermer', { duration: 3000 });
                this.saving = false;
              }
            });
          } else {
            this.snackBar.open('Utilisateur mis à jour avec succès', 'Fermer', { duration: 3000 });
            this.router.navigate(['/users']);
          }
        },
        error: (err) => {
          console.error('Error updating user:', err);
          this.snackBar.open('Erreur lors de la mise à jour', 'Fermer', { duration: 3000 });
          this.saving = false;
        }
      });
    }
  }
}

