package com.application.core.shared.entities;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import javax.validation.constraints.NotNull;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Inheritance(strategy = InheritanceType.JOINED)

public class Address {
  @Id
  @GeneratedValue(strategy = GenerationType.SEQUENCE)
  private Long id;
  private String address;
  private String addressArabic;
  private String city;

  @Column(columnDefinition = "tinyint(1) default 1")
  private boolean active;



  public JsonNode toJson() {
    ObjectMapper objectMapper = new ObjectMapper();
    return objectMapper.valueToTree(this);
  }
}
