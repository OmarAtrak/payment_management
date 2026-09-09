package com.application.core.workService.entities;

import com.application.core.product.entities.Tax;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.Data;
import lombok.ToString;

import javax.persistence.*;

@Entity
@Data
@ToString
public class Work {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String code;
    private String name;
    @Lob
    private String description;
    @Lob
    private String descriptionHtml;
    private Double price;
    private Boolean active;

    @ManyToOne
    private Tax tax;



    public JsonNode toJson() {
        ObjectMapper objectMapper = new ObjectMapper();
        return objectMapper.valueToTree(this);
    }
}
