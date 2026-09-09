package com.application.core.customer.entities;

import com.application.core.shared.entities.Address;
import com.application.core.shared.entities.Contact;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.Data;
import lombok.ToString;

import javax.persistence.*;
import java.util.List;

@Entity
@Data
@ToString
public class Customer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String code;
    private String name;

    @Column(columnDefinition = "tinyint(1) default 1")
    private boolean active;

    @OneToOne(cascade = CascadeType.ALL)
    private Address address;
    @OneToOne(cascade = CascadeType.ALL)
    private Contact contact;

    @OneToMany(mappedBy = "customer")
    @JsonManagedReference
    private List<Vehicle> vehicles;

    @Column(columnDefinition = "tinyint(1) default 0")
    private boolean hasLoyaltyCard;



    public JsonNode toJson() {
        ObjectMapper objectMapper = new ObjectMapper();
        return objectMapper.valueToTree(this);
    }
}
