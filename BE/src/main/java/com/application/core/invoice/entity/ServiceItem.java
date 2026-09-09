package com.application.core.invoice.entity;

import com.application.core.customer.entities.Vehicle;
import com.application.core.product.entities.Tax;
import com.application.core.workService.entities.Work;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.Data;
import lombok.ToString;

import javax.persistence.*;

@Entity
@Data
@ToString
public class ServiceItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Boolean active;

    @ManyToOne
    private Work service;
    private Double discount;
    private Double price;
    private Double priceTtc;
    private Integer ranking = 0;

    @ManyToOne
    @JsonIgnore
    private Invoice invoice;

    @ManyToOne
    private Vehicle vehicle;

    @ManyToOne
    private Tax tax;



    public JsonNode toJson() {
        ObjectMapper objectMapper = new ObjectMapper();
        return objectMapper.valueToTree(this);
    }
}
