import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  template: `
    <mat-toolbar color="primary" style="position: fixed; top: 0; z-index: 1000; width: 100%;">
      <mat-icon style="margin-right: 10px;">school</mat-icon>
      <span>Gestion Doctorat</span>
      <span style="flex: 1 1 auto;"></span>
      <button mat-button routerLink="/dashboard">
        <mat-icon>dashboard</mat-icon>
        Tableau de bord
      </button>
      <button mat-button routerLink="/users">
        <mat-icon>people</mat-icon>
        Utilisateurs
      </button>
      <button mat-button routerLink="/inscriptions">
        <mat-icon>assignment</mat-icon>
        Inscriptions
      </button>
    </mat-toolbar>
  `,
  styles: [`
    mat-toolbar {
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    button {
      margin-left: 10px;
    }
  `]
})
export class HeaderComponent {
}

