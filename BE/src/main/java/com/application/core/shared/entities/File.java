package com.application.core.shared.entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Entity
@Data
@NoArgsConstructor
@Inheritance(strategy = InheritanceType.JOINED)
@JsonIgnoreProperties({ "data"})
public class File {

  @Id
  @GeneratedValue(strategy = GenerationType.SEQUENCE)
  private Long id;
  private String fileName;
  private String fileType;
  @Lob private byte[] data;

  @Column(columnDefinition = "tinyint(1) default 1")
  private Boolean active = true;


  public File(String fileName, String fileType, byte[] data  ) {
    this.fileName = fileName;
    this.fileType = fileType;
    this.data = data;
  }


    public JsonNode toJson( ) {
    ObjectMapper objectMapper = new ObjectMapper();
    JsonNode jsonNode = objectMapper.valueToTree(this);
    return jsonNode;
  }
}
