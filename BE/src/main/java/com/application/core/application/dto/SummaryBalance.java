package com.application.core.application.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SummaryBalance {
    private Double totalExpenseHT;
    private Double totalExpenseTTC;
    private Double totalPayment;
    private Double totalHtToPay;
    private Double totalInvoiceRevenue;
}
