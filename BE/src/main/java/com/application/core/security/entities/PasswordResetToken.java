package com.application.core.security.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.util.Date;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "security__password_reset_token")
public class PasswordResetToken {


    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private Long id;

    private String token;

    @OneToOne(targetEntity = User.class, fetch = FetchType.EAGER)
    @JoinColumn(nullable = false, name = "user_id")
    @JsonBackReference
    private User user;

    private Date expiryDate;
    @Version
    private  int version;
    public PasswordResetToken(String token, User user ,Date expiryDate ) {
        this.user = user;
        this.token = token;
        this.expiryDate = expiryDate;
    }
}
