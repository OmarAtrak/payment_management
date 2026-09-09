package com.application.core.security.encoder;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class BCryptPassword {
    final   BCryptPasswordEncoder bCryptPasswordEncoder = new BCryptPasswordEncoder(12);
    public String encode(String plainPassword) {
        return bCryptPasswordEncoder.encode(plainPassword);
    }

    public boolean matches(String password_1, String password_2) {
        return  bCryptPasswordEncoder.matches(password_1,password_2);

    }



}

