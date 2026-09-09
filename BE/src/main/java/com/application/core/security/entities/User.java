package com.application.core.security.entities;

import com.application.core.shared.entities.File;
import com.application.core.shared.entities.Person;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.util.HashSet;
import java.util.Set;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "security__users")
@DiscriminatorValue("USER")
//@JsonIgnoreProperties({ "password","tokens"})
@PrimaryKeyJoinColumn(name = "id")
public class User extends Person {
    @NotEmpty
    @NotNull
    @Email
    private String email;
    @NotEmpty
    @NotNull
    //@Pattern(regexp = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#&()–[{}]:;',?/*~$^+=<>]).{8,20}$")
    private String password;


    private boolean enabled;
    private boolean emailVerified;
    private String phoneNumber;
    private boolean disabled;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "photo_id")
    private File photo;

    @JoinColumn(name = "user_id")
    @OneToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private Set<Log> logs;

    @JoinColumn(name = "user_id")
    @OneToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @JsonManagedReference
    private Set<PasswordResetToken> tokens;


    public void initLogs(Log log) {
        this.logs = new HashSet<>();
        this.getLogs().add(log);
    }

    public User(String firstName, String lastName, String email, String password ) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
    }

    @ManyToMany(cascade = CascadeType.PERSIST, fetch = FetchType.EAGER)
    @JoinTable(
            name = "security__users_roles",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "role_id"))
    private Set<Role> roles = new HashSet<>();

    public JsonNode toJson() {
        ObjectMapper objectMapper = new ObjectMapper();
        JsonNode jsonNode = objectMapper.valueToTree(this);
       // ((ObjectNode) jsonNode).remove("password");
       // ((ObjectNode) jsonNode).remove("tokens");


        return jsonNode;
    }

    public JsonNode toJsonTest() {
        ObjectMapper objectMapper = new ObjectMapper();
        JsonNode jsonNode = objectMapper.valueToTree(this);
        ((ObjectNode) jsonNode).remove("photo");
        return jsonNode;
    }
}
