package com.application.core.company.entity;


import com.application.core.shared.entities.Contact;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.Data;
import lombok.ToString;

import javax.persistence.*;

@Entity
@Data
@ToString
public class Company {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false)
    private String rc;
    @Column(nullable = false)
    private String name;
    @Column(length = 15, nullable = false)
    private String ice;
    private String ifu;
    private String cnss;
    private String tp;
    private Boolean active;
    private String siteWeb;

    @OneToOne(cascade = CascadeType.ALL)
    private Contact contact;



    public JsonNode toJson() {
        ObjectMapper objectMapper = new ObjectMapper();
        return objectMapper.valueToTree(this);
    }
}