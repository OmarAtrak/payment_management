package com.application.core.customer.controller;

import com.application.core.customer.entities.Vehicle;
import com.application.core.customer.services.VehicleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/vehicles")
public class VehicleController {
    private final VehicleService vehicleService;

    @Autowired
    public VehicleController(VehicleService vehicleService) {
        this.vehicleService = vehicleService;
    }

    @GetMapping("/index")
    public Page<Vehicle> getAll(@RequestParam(defaultValue = "0") int page,
                                @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = org.springframework.data.domain.PageRequest.of(page, size);
        return vehicleService.findAll(pageable);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Vehicle> getById(@PathVariable Long id) {
        Vehicle vehicle = vehicleService.findById(id);
        if (vehicle == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(vehicle);
    }

    @PostMapping("/save")
    public Vehicle create(@RequestBody Vehicle vehicle) {
        return vehicleService.save(vehicle);
    }

    @PutMapping("/update")
    public ResponseEntity<Vehicle> update(@RequestBody Vehicle vehicle) {
        Vehicle updatedVehicle = vehicleService.findById(vehicle.getId());
        if (updatedVehicle == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(vehicleService.save(vehicle));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Vehicle> delete(@PathVariable Long id) {
        Vehicle vehicle = vehicleService.findById(id);
        if (vehicle == null) {
            return ResponseEntity.notFound().build();
        }
        vehicle.setActive(false);
        Vehicle updatedTax = vehicleService.save(vehicle);
        return ResponseEntity.ok(updatedTax);
    }
}
