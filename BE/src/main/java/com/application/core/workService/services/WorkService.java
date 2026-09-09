package com.application.core.workService.services;

import com.application.core.workService.dto.TopWorkDTO;
import com.application.core.workService.entities.Work;
import com.application.core.workService.repository.WorkRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class WorkService {
    private final WorkRepository workRepository;

    @Autowired
    public WorkService(WorkRepository workRepository) {
        this.workRepository = workRepository;
    }

    public List<Work> findAll() {
        return workRepository.findAllActive();
    }

    public Page<Work> findAll(Pageable pageable) {
        return workRepository.findAllActive(pageable);
    }

    public Work findById(Long id) {
        return workRepository.findById(id).get();
    }

    public Work save(Work product) {
        return workRepository.save(product);
    }

    public Page<TopWorkDTO> findTopRequestedService(Pageable pageable) {
        return workRepository.findTopRequestedService(pageable);
    }
}
