package com.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserStatistics {
    // For DOCTORANT
    private Integer totalInscriptions;
    private Integer pendingDefenses;
    private Integer completedDefenses;

    // For DIRECTEUR_THESE
    private Integer totalDoctorants;
    private Integer activeSupervisions;

    // For PERSONNEL_ADMIN
    private Integer totalValidations;
    private Integer pendingRequests;
}
