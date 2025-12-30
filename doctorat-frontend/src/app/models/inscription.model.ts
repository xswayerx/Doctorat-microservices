export enum InscriptionType {
  INSCRIPTION_INITIALE = 'INSCRIPTION_INITIALE',
  REINSCRIPTION = 'REINSCRIPTION'
}

export enum InscriptionStatus {
  BROUILLON = 'BROUILLON',
  SOUMISE = 'SOUMISE',
  EN_ATTENTE_DIRECTEUR = 'EN_ATTENTE_DIRECTEUR',
  APPROUVEE_DIRECTEUR = 'APPROUVEE_DIRECTEUR',
  EN_ATTENTE_ADMIN = 'EN_ATTENTE_ADMIN',
  VALIDEE = 'VALIDEE',
  REJETEE = 'REJETEE'
}

export enum AnneeAcademique {
  ANNEE_2023_2024 = 'ANNEE_2023_2024',
  ANNEE_2024_2025 = 'ANNEE_2024_2025',
  ANNEE_2025_2026 = 'ANNEE_2025_2026'
}

export interface Inscription {
  id?: string;
  doctorantId: string;
  doctorantEmail?: string;
  doctorantName?: string;
  directeurId: string;
  directeurName?: string;
  type: InscriptionType;
  status: InscriptionStatus;
  anneeAcademique: AnneeAcademique;
  sujetThese: string;
  laboratoire: string;
  specialite: string;
  coDirecteurId?: string;
  coDirecteurName?: string;
  documentsIds?: string[];
  commentaireDirecteur?: string;
  commentaireAdmin?: string;
  dateCreation?: string;
  dateModification?: string;
  dateValidation?: string;
}

export interface CreateInscriptionRequest {
  doctorantId: string;
  directeurId: string;
  type: InscriptionType;
  anneeAcademique: AnneeAcademique;
  sujetThese: string;
  laboratoire: string;
  specialite: string;
  coDirecteurId?: string;
}

export interface UpdateInscriptionRequest {
  sujetThese?: string;
  laboratoire?: string;
  specialite?: string;
  coDirecteurId?: string;
}

export interface ValidateInscriptionRequest {
  approved: boolean;
  commentaire: string;
}

export interface ReinscriptionRequest {
  doctorantId: string;
  previousInscriptionId: string;
  nouvelleAnnee: AnneeAcademique;
  sujetTheseMisAJour?: string;
}

export interface InscriptionResponse {
  success: boolean;
  message: string;
  data: Inscription;
  timestamp?: string;
}

export interface InscriptionListResponse {
  success: boolean;
  message: string;
  data: Inscription[];
  total: number;
  timestamp?: string;
}

export interface InscriptionStatusDTO {
  id: string;
  status: InscriptionStatus;
  lastUpdate?: string;
}

