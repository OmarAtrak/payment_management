package com.application.core.shared.entities;

import com.application.core.shared.models.Gender;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.*;
import javax.validation.constraints.NotNull;

@Entity
@Inheritance(strategy = InheritanceType.JOINED)
@ToString
@Getter
@Setter
public class Person {

  @Id
  @GeneratedValue
  @Column(name = "id", nullable = false)
  public Long id;

  @NotNull(message = "firstName is mandatory")
  public String firstName;

  @NotNull(message = "firstName is mandatory")
  public String lastName;


  public String firstNameArb;
  public String lastNameArb;


  @Enumerated(EnumType.STRING)
  @Column(length = 10)
  public Gender gender;

  @Version
  private  int version;



  public JsonNode toJson() {
    ObjectMapper objectMapper = new ObjectMapper();
    JsonNode jsonNode = objectMapper.valueToTree(this);
    return jsonNode;
  }

}
