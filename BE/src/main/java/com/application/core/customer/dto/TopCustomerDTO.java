package com.application.core.customer.dto;

import lombok.Data;

import java.util.Date;

@Data
public class TopCustomerDTO {

    private Long customerId;
    private String customerName;
    private Long totalOperations;
    private double totalPayments;
    private Date lastOperationDate;
    private boolean hasLoyaltyCard;

    public TopCustomerDTO(
        Long customerId,
        String customerName,
        Long totalOperations,
        double totalPayments,
        Date lastOperationDate,
        boolean hasLoyaltyCard
    ) {
        this.customerId = customerId;
        this.customerName = customerName;
        this.totalOperations = totalOperations;
        this.totalPayments = totalPayments;
        this.lastOperationDate = lastOperationDate;
        this.hasLoyaltyCard = hasLoyaltyCard;
    }
}