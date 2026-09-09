package com.application.core.shared.repository;

import com.application.core.shared.entities.File;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FileRepository extends JpaRepository<File, Long> {
    File findOneById(Long id);

     // find file where vehicle .file_id =  id


}