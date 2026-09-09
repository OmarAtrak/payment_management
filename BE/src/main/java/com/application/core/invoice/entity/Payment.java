package com.application.core.invoice.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.Data;
import lombok.ToString;

import javax.persistence.*;
import java.util.Date;

@Entity
@Data
@ToString
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String code;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date date;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date createdDate;
    private PaymentMethod paymentMethod;
    private Double amount;
    private PaymentStatus status;
    @Lob
    private String notes;
    private Boolean active;

    @ManyToOne
    @JsonIgnore
    private Invoice invoice;

    @PrePersist
    protected void onCreate() {
        if (this.id == null) {
            this.createdDate = new Date();
        }
    }



    public JsonNode toJson() {
        ObjectMapper objectMapper = new ObjectMapper();
        return objectMapper.valueToTree(this);
    }
}
