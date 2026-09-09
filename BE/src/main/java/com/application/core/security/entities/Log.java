package com.application.core.security.entities;

import com.application.core.shared.models.Level;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import javax.persistence.*;
import java.util.Date;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "security__logs")
public class Log {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private Long id;


    @ManyToOne( cascade = CascadeType.ALL )
    @JoinColumn( name="user_id" )
    @JsonBackReference
    private User user;



    private String message;


    @Enumerated(EnumType.STRING)
    private Level level;

    @CreationTimestamp
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "create_date", updatable = false)
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss")
    private Date createDate;

    public Log(String message, Level level) {
        this.message = message;
        this.level = level;
    }
}
