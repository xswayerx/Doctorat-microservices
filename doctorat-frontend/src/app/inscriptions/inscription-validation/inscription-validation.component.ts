import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { InscriptionService } from '../../services/inscription.service';
import { Inscription } from '../../models/inscription.model';

@Component({
  selector: 'app-inscription-validation',
  template: `
    <h2 mat-dialog-title>Valider l'inscription</h2>
    <mat-dialog-content>
      <form [formGroup]="validationForm">
        <mat-form-field appearance="outline" style="width: 100%;">
          <mat-label>Décision</mat-label>
          <mat-select formControlName="approved" required>
            <mat-option [value]="true">Approuver</mat-option>
            <mat-option [value]="false">Rejeter</mat-option>
          </mat-select>
          <mat-error *ngIf="validationForm.get('approved')?.hasError('required')">Décision requise</mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" style="width: 100%;">
          <mat-label>Commentaire</mat-label>
          <textarea matInput formControlName="commentaire" rows="4" required></textarea>
          <mat-error *ngIf="validationForm.get('commentaire')?.hasError('required')">Commentaire requis</mat-error>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Annuler</button>
      <button mat-raised-button color="primary" (click)="onSubmit()" [disabled]="validationForm.invalid || loading">
        <mat-icon *ngIf="!loading">check</mat-icon>
        <mat-spinner *ngIf="loading" diameter="20" style="display: inline-block;"></mat-spinner>
        Valider
      </button>
    </mat-dialog-actions>
  `,
  styles: []
})
export class InscriptionValidationComponent implements OnInit {
  validationForm!: FormGroup;
  loading = false;
  inscription!: Inscription;

  constructor(
    private fb: FormBuilder,
    private inscriptionService: InscriptionService,
    private dialogRef: MatDialogRef<InscriptionValidationComponent>,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: { inscription: Inscription }
  ) {
    this.inscription = data.inscription;
  }

  ngOnInit(): void {
    this.validationForm = this.fb.group({
      approved: [true, Validators.required],
      commentaire: ['', Validators.required]
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.validationForm.valid) {
      this.loading = true;
      const request = {
        approved: this.validationForm.value.approved,
        commentaire: this.validationForm.value.commentaire
      };

      // Determine which validation endpoint to call based on status
      const isDirecteurValidation = this.inscription.status === 'EN_ATTENTE_DIRECTEUR';
      const validationCall = isDirecteurValidation
        ? this.inscriptionService.validateByDirecteur(this.inscription.id!, request)
        : this.inscriptionService.validateByAdmin(this.inscription.id!, request);

      validationCall.subscribe({
        next: () => {
          this.snackBar.open('Validation effectuée avec succès', 'Fermer', { duration: 3000 });
          this.dialogRef.close(true);
        },
        error: (err) => {
          console.error('Error validating inscription:', err);
          this.snackBar.open('Erreur lors de la validation', 'Fermer', { duration: 3000 });
          this.loading = false;
        }
      });
    }
  }
}

