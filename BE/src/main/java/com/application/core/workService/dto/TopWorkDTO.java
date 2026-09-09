package com.application.core.workService.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TopWorkDTO {
    private Long id;
    private String name;
    private String code;
    private Long totalRequests;
}
