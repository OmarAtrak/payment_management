package com.application.core.security.models;

public class GenericResponse {
  private final String message;
  private String error;

  public GenericResponse(String message) {
    super();
    this.message = message;
  }

  public GenericResponse(String message, String error) {
    super();
    this.message = message;
    this.error = error;
  }
    }
