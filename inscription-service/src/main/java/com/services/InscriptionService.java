package com.services;

import java.util.List;

import com.dto.CreateInscriptionRequest;
import com.dto.InscriptionDTO;
import com.dto.InscriptionStatusDTO;
import com.dto.ReinscriptionRequest;
import com.dto.UpdateInscriptionRequest;
import com.dto.ValidateInscriptionRequest;
import com.enums.InscriptionStatus;

public interface InscriptionService {

    List<InscriptionDTO> getAllInscriptions();
    InscriptionDTO getInscriptionById(String id);
    InscriptionDTO createInscription(CreateInscriptionRequest request);
    InscriptionDTO updateInscription(String id, UpdateInscriptionRequest request);
    void deleteInscription(String id);
    InscriptionDTO validateByDirecteur(String id, ValidateInscriptionRequest request);
    InscriptionDTO validateByAdmin(String id, ValidateInscriptionRequest request);
    InscriptionStatusDTO getInscriptionStatus(String id);
    List<InscriptionDTO> getInscriptionsByDoctorant(String doctorantId);
    List<InscriptionDTO> getInscriptionsByStatus(InscriptionStatus status);
    InscriptionDTO createReinscription(ReinscriptionRequest request);
}