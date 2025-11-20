package com.devbuild.inscriptionservice.dto;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum UserRole {
    DOCTORANT,
    DIRECTEUR,
    ADMIN;

    // Permet à Jackson de transformer un String en enum
    @JsonCreator
    public static UserRole from(String value) {
        return UserRole.valueOf(value.toUpperCase());
    }

    // Permet à Jackson de sérialiser l'enum en String
    @JsonValue
    public String toValue() {
        return this.name();
    }
}