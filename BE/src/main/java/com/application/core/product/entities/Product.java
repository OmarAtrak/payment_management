package com.application.core.product.entities;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.Data;
import lombok.ToString;

import javax.persistence.*;

@Entity
@Data
@ToString
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String code;
    private String name;
    @Lob
    private String description;
    @Lob
    private String descriptionHtml;
    private Double priceMin;
    private Double price;
    private Boolean active;
    @ManyToOne
    private Tax tax;
    @ManyToOne
    private Unit unit;
    @ManyToOne
    private Category category;



    public JsonNode toJson() {
        ObjectMapper objectMapper = new ObjectMapper();
        return objectMapper.valueToTree(this);
    }
}
