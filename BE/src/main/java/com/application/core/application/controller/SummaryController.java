package com.application.core.application.controller;

import com.application.core.application.dto.SummaryBalance;
import com.application.core.application.service.SummaryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

@RestController
@RequestMapping("/api/summary")
public class SummaryController {
    private final SummaryService summaryService;

    @Autowired
    public SummaryController(SummaryService summaryService) {
        this.summaryService = summaryService;
    }

    @GetMapping("/balance")
    public ResponseEntity<SummaryBalance> getBalance(
        @RequestParam(value = "startDate", required = false) String startDate,
        @RequestParam(value = "endDate", required = false) String endDate
    ) {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        if (startDate != null && endDate != null) {
            try {
                Date start = sdf.parse(startDate);
                Date end = sdf.parse(endDate);
                SummaryBalance summaryBalance = this.summaryService.getSummaryByDateRange(start, end);
                return ResponseEntity.ok(summaryBalance);
            } catch (ParseException e) {
                return ResponseEntity.badRequest().build();
            }
        }
        SummaryBalance summaryBalance = this.summaryService.getDetailsSummary();
        return ResponseEntity.ok(summaryBalance);
    }
}
