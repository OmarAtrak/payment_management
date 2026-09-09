package com.application.core.customer.services;

import com.application.core.customer.entities.Vehicle;
import com.application.core.customer.repository.VehicleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VehicleService {
    private final VehicleRepository vehicleRepository;

    @Autowired
    public VehicleService(VehicleRepository vehicleRepository) {
        this.vehicleRepository = vehicleRepository;
    }

    public List<Vehicle> findAll() {
        return this.vehicleRepository.findAllActive();
    }

    public Page<Vehicle> findAll(Pageable pageable) {
        return this.vehicleRepository.findAllActive(pageable);
    }

    public Vehicle findById(Long id) {
        return this.vehicleRepository.findById(id).get();
    }

    public Vehicle save(Vehicle vehicle) {
        return this.vehicleRepository.save(vehicle);
    }
}
