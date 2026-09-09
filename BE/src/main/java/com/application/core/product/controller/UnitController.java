package com.application.core.product.controller;

import com.application.core.product.entities.Unit;
import com.application.core.product.services.UnitService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/units")
public class UnitController {
    private final UnitService unitService;

    @Autowired
    public UnitController(UnitService unitService) {
        this.unitService = unitService;
    }

    @GetMapping("/index")
    public Page<Unit> getAll(@RequestParam(defaultValue = "0") int page,
                             @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = org.springframework.data.domain.PageRequest.of(page, size);
        return unitService.findAll(pageable);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Unit> getById(@PathVariable Long id) {
        Unit unit = unitService.findById(id);
        if (unit == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(unit);
    }

    @PostMapping("/save")
    public Unit save(@RequestBody Unit unit) {
        return unitService.save(unit);
    }

    @PutMapping("/update")
    public ResponseEntity<Unit> update(@RequestBody Unit unit) {
        Unit updatedUnit = unitService.findById(unit.getId());
        if (updatedUnit == null) {
            return ResponseEntity.notFound().build();
        }
        updatedUnit.setName(unit.getName());
        updatedUnit.setName(unit.getName());
        updatedUnit.setAbbreviation(unit.getAbbreviation());
        updatedUnit.setActive(unit.getActive());
        return ResponseEntity.ok(unitService.save(updatedUnit));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Unit> delete(@PathVariable Long id) {
        Unit unit = unitService.findById(id);
        if (unit == null) {
            return ResponseEntity.notFound().build();
        }
        unit.setActive(false);
        Unit updatedUnit = unitService.save(unit);
        return ResponseEntity.ok(updatedUnit);
    }
}
