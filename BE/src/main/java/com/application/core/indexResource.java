package com.application.core;


import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.MessageSource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import java.io.File;
import java.util.Locale;


/**
 * The HelloWorld program implements an application that
 * simply displays "Hello World!" to the standard output.
 *
 * @author  Fayssal BenMoussa
 * @version 1.0
 * @since   2023-03-31
 */

@RestController
@RequestMapping("/")
@Validated
public class indexResource {

  @Value("${spring.mail.username}")
  private String mail;

  @Value("${build.version}")
  private String buildVersion;

  @Value("${application.name}")
  private String applicationName;

  @Value("${build.description}")
  private String buildDescription;


  private MessageSource messages;

  @Autowired
  public indexResource(MessageSource messages) {
    this.messages = messages;
  }

  @RequestMapping(value = "/", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity<?> index(Locale locale,  HttpServletRequest request) throws JSONException {

    //repository.save(new Exam(new Date(),"pratique",34.00));

    JSONObject information = new JSONObject();
    information.put("buildVersion",buildVersion);
    information.put("mail",mail);
    information.put("applicationName",applicationName);
    information.put("buildDescription",buildDescription);
    information.put("locale",locale.toString());

  //  information.put( "", messages.getMessage("token.valid", null, locale));

    File root = new File("/");

    information.put("Total space", String.format("%.2f GB", (double)root.getTotalSpace() /1073741824));
    information.put("Free space", String.format("%.2f GB",  (double)root.getFreeSpace() /1073741824));

    String ipAddress = request.getHeader("X-Forwarded-For");
    if (ipAddress == null || ipAddress.isEmpty() || "unknown".equalsIgnoreCase(ipAddress)) {
      information.put("ipAddress",request.getRemoteAddr());
    }





    return new ResponseEntity<>(information.toString(), HttpStatus.OK);
  }




}



