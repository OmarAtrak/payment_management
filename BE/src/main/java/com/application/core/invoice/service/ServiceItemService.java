package com.application.core.invoice.service;

import com.application.core.invoice.entity.ServiceItem;
import com.application.core.invoice.repository.ServiceItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ServiceItemService {
    private final ServiceItemRepository serviceItemRepository;

    @Autowired
    public ServiceItemService(ServiceItemRepository serviceItemRepository) {
        this.serviceItemRepository = serviceItemRepository;
    }

    public List<ServiceItem> findAll() {
        return this.serviceItemRepository.findAllActive();
    }

    public Page<ServiceItem> findAll(Pageable pageable) {
        return this.serviceItemRepository.findAll(pageable);
    }

    public ServiceItem findById(Long id) {
        return this.serviceItemRepository.findById(id).get();
    }

    public ServiceItem save(ServiceItem serviceItem) {
        return this.serviceItemRepository.save(serviceItem);
    }
}
