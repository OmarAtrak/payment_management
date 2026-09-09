package com.application.core.security.repository;

import com.application.core.security.entities.PasswordResetToken;
import com.application.core.security.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;




public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {
    PasswordResetToken findByToken(String token);
    PasswordResetToken findByTokenAndUser(String token, User user);
}