package com.application.core.expense.entities;

import com.application.core.invoice.entity.PaymentMethod;
import com.application.core.product.entities.Tax;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.Data;
import lombok.ToString;

import javax.persistence.*;
import java.util.Date;

@Entity
@Data
@ToString
public class Expense {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String code;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date date;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date createdDate;
    private PaymentMethod method;
    private Double amount;
    @Lob
    private String notes;
    private Boolean active;

    @ManyToOne()
    private ExpenseType expenseType;

    @ManyToOne()
    private Tax tax;

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
