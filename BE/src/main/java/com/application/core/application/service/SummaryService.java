package com.application.core.application.service;

import com.application.core.application.dto.SummaryBalance;
import com.application.core.expense.repository.ExpenseRepository;
import com.application.core.invoice.repository.PaymentRepository;
import com.application.core.invoice.repository.ProductItemRepository;
import com.application.core.invoice.repository.ServiceItemRepository;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
public class SummaryService {
    private final ExpenseRepository expenseRepository;
    private final PaymentRepository paymentRepository;
    private final ProductItemRepository productItemRepository;
    private final ServiceItemRepository serviceItemRepository;

    public SummaryService(
            ExpenseRepository expenseRepository,
            PaymentRepository paymentRepository,
            ProductItemRepository productItemRepository, ServiceItemRepository serviceItemRepository) {
        this.expenseRepository = expenseRepository;
        this.paymentRepository = paymentRepository;
        this.productItemRepository = productItemRepository;
        this.serviceItemRepository = serviceItemRepository;
    }

    public SummaryBalance getDetailsSummary() {
        Double totalExpenseHT = expenseRepository.sumTotalExpenseHT();
        Double totalExpenseTTC = expenseRepository.sumTotalExpenseTTC();
        Double totalPayment = paymentRepository.sumTotalPayment();
        Double totalProductItemHtToPay = productItemRepository.sumTotalVAT();
        Double totalServiceItemHtToPay = serviceItemRepository.sumTotalVAT();
        Double totalHtToPay = totalProductItemHtToPay + totalServiceItemHtToPay;
        Double totalInvoiceRevenue = productItemRepository.sumTotalHT() + serviceItemRepository.sumTotalHT();

        return new SummaryBalance(totalExpenseHT, totalExpenseTTC, totalPayment, totalHtToPay, totalInvoiceRevenue);
    }

    public SummaryBalance getSummaryByDateRange(Date startDate, Date endDate) {
        Double totalExpenseHT = expenseRepository.sumTotalExpenseHT(startDate, endDate);
        Double totalExpenseTTC = expenseRepository.sumTotalExpenseTTC(startDate, endDate);
        Double totalPayment = paymentRepository.sumTotalPayment(startDate, endDate);
        Double totalProductItemHtToPay = productItemRepository.sumTotalVAT(startDate, endDate);
        Double totalServiceItemHtToPay = serviceItemRepository.sumTotalVAT(startDate, endDate);
        Double totalHtToPay = totalProductItemHtToPay + totalServiceItemHtToPay;
        Double totalInvoiceRevenue = productItemRepository.sumTotalHT(startDate, endDate) + serviceItemRepository.sumTotalHT(startDate, endDate);

        return new SummaryBalance(totalExpenseHT, totalExpenseTTC, totalPayment, totalHtToPay, totalInvoiceRevenue);
    }
}
