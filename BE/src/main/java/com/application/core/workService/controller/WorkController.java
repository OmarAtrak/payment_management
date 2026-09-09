package com.application.core.workService.controller;

import com.application.core.workService.dto.TopWorkDTO;
import com.application.core.workService.entities.Work;
import com.application.core.workService.services.WorkService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/services")
public class WorkController {
    private final WorkService workService;

    @Autowired
    public WorkController(WorkService workService) {
        this.workService = workService;
    }

    @GetMapping("/index")
    public Page<Work> getAll(@RequestParam(defaultValue = "0") int page,
                             @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = org.springframework.data.domain.PageRequest.of(page, size);
        return workService.findAll(pageable);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Work> getById(@PathVariable Long id) {
        Work work = workService.findById(id);
        if (work == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(work);
    }

    @PostMapping("/save")
    public Work create(@RequestBody Work work) {
        return workService.save(work);
    }

    @PutMapping("/update")
    public ResponseEntity<Work> update(@RequestBody Work work) {
        Work updatedWork = workService.findById(work.getId());
        if (updatedWork == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(workService.save(work));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Work> delete(@PathVariable Long id) {
        Work work = workService.findById(id);
        if (work == null) {
            return ResponseEntity.notFound().build();
        }
        work.setActive(false);
        Work updatedTax = workService.save(work);
        return ResponseEntity.ok(updatedTax);
    }

    @GetMapping("/top-requested")
    public Page<TopWorkDTO> topRequested(@RequestParam(defaultValue = "0") int page,
                                         @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = org.springframework.data.domain.PageRequest.of(page, size);
        return workService.findTopRequestedService(pageable);
    }
}
