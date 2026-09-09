package com.application.core.shared.entities;

import com.application.core.shared.models.MetaType;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.*;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Getter
@Setter
@Inheritance(strategy = InheritanceType.JOINED)

public class MetaData {
  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  private Long id;
  @NotBlank(message = "code is mandatory")
  private String code;
  @NotBlank(message = "Label is mandatory")
  private String label;
  @Enumerated(EnumType.STRING)
  @Column(length = 30)
  private MetaType type;
  @Column(columnDefinition = "tinyint(1) default 1")
  private Boolean active;
  @Column(columnDefinition = "tinyint(1) default 1")
  private boolean required;
  private String dataSource;
  private String defaultValue;


  public MetaData(String code, String label, MetaType type, Boolean active, boolean required, String dataSource, String defaultValue) {
    this.code = code;
    this.label = label;
    this.type = type;
    this.active = active;
    this.required = required;
    this.dataSource = dataSource;
    this.defaultValue = defaultValue;
  }

  public JsonNode toJson( ) {
    ObjectMapper objectMapper = new ObjectMapper();
    JsonNode jsonNode = objectMapper.valueToTree(this);
    return jsonNode;
  }

}
