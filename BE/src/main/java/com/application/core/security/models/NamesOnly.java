package com.application.core.security.models;

import com.application.core.security.entities.Log;

import java.util.Set;
//// https://www.baeldung.com/jpa-queries-custom-result-with-aggregation-functions
public interface NamesOnly {
    String getFirstName();
    String getLastName();

    Set<Log> getLogs();




      default String getFullName(){
        return this.getFirstName() + " " + this.getLastName() ;
    }



}
