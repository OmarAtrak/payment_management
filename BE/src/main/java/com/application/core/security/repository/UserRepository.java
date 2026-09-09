package com.application.core.security.repository;

import com.application.core.security.entities.User;
import com.application.core.security.models.CountName;
import com.application.core.security.models.NamesOnly;
import com.application.core.shared.entities.Person;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Collection;
import java.util.List;


public interface UserRepository extends JpaRepository<User, Long> {
    Page<User> findAll(Pageable pageable);
    User findByEmailIgnoreCase(String email);
    User findByEmailIgnoreCaseAndPassword(String email, String oldPassword);

    Collection<NamesOnly> findByLastName(String lastname);

    //  @Query("SELECT u.lastName FROM User AS u")
    @Query("SELECT u.lastName AS lastName , COUNT(u.lastName) AS countName  FROM User AS u GROUP BY u.lastName ORDER BY u.lastName DESC")
    List<CountName> countTotal();

    User findOneById(Long valueOf);


    User findTopByOrderByIdDesc();
}