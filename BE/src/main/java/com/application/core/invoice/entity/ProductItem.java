package com.application.core.invoice.entity;

import com.application.core.product.entities.Product;
import com.application.core.product.entities.Tax;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.Data;
import lombok.ToString;

import javax.persistence.*;

@Entity
@Data
@ToString
public class ProductItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Boolean active;

    @ManyToOne
    private Product product;
    private Integer quantity;
    private Double discount;
    private Double priceHt;
    private Double priceTtc;
    private Integer ranking = 0;

    @ManyToOne
    private Tax tax;

    @ManyToOne
    @JsonIgnore
    private Invoice invoice;



    public JsonNode toJson() {
        ObjectMapper objectMapper = new ObjectMapper();
        return objectMapper.valueToTree(this);
    }
}
