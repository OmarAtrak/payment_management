package com.application.core.security;

import com.application.core.security.encoder.BCryptPassword;
import com.application.core.security.entities.Log;
import com.application.core.security.entities.Role;
import com.application.core.security.entities.User;
import com.application.core.security.models.AuthenticationRequest;
import com.application.core.security.models.AuthenticationResponse;
import com.application.core.security.repository.RoleRepository;
import com.application.core.security.repository.UserRepository;
import com.application.core.security.services.UserService;
import com.application.core.security.utils.JwtUtil;
import com.application.core.shared.entities.File;
import com.application.core.shared.models.ErrorCodes;
import com.application.core.shared.models.Level;
import com.application.core.shared.repository.FileRepository;
import com.application.core.shared.repository.PersonRepository;
import com.application.core.shared.services.EmailSenderService;
import com.application.core.shared.utils.UrlUtil;
import com.fasterxml.jackson.databind.JsonNode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.MessageSource;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Random;

@RestController
@RequestMapping("/api/security")
@Validated
public class SecurityResource {
    private static final Logger log = LoggerFactory.getLogger(SecurityResource.class);

    private AuthenticationManager authenticationManager;
    private UserService userService;
    private JwtUtil jwtTokenUtil;
    private UserRepository userRepository;
    private FileRepository fileRepository;
    private EmailSenderService emailSenderService;
    private final BCryptPassword passwordEncoder = new BCryptPassword();
    private final RoleRepository roleRepository;


    private MessageSource messages;
    @Autowired
    public SecurityResource(AuthenticationManager authenticationManager, UserService userService, JwtUtil jwtTokenUtil, UserRepository userRepository, FileRepository fileRepository , PersonRepository personRepository, EmailSenderService emailSenderService, MessageSource messages, RoleRepository roleRepository) {
        this.authenticationManager = authenticationManager;
        this.userService = userService;
        this.jwtTokenUtil = jwtTokenUtil;
        this.userRepository = userRepository;
        this.fileRepository =  fileRepository;
        this.emailSenderService = emailSenderService;
        this.messages = messages;
        this.roleRepository = roleRepository;
    }

    @Value("${spring.mail.username}")
    private String mail;



    @RequestMapping("/about")
    public ResponseEntity<?> about() {
        return new ResponseEntity<>("about", HttpStatus.OK);
    }
    /**/

    @RequestMapping(value = "/current_user", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> index(Locale locale, HttpServletRequest request) {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();
        User current_user = userRepository.findByEmailIgnoreCase(username);
        return new ResponseEntity<>(current_user.toJson(), HttpStatus.OK);
    }



    @RequestMapping(value = "/authenticate", method = RequestMethod.POST)
    public ResponseEntity<?> createAuthenticationToken(@RequestBody AuthenticationRequest authenticationRequest) throws Exception {
        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(authenticationRequest.getUsername(), authenticationRequest.getPassword()));
        } catch (BadCredentialsException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.UNAUTHORIZED);
        }
        final UserDetails userDetails = userService.loadUserByUsername(authenticationRequest.getUsername());
        final User user = userRepository.findByEmailIgnoreCase(authenticationRequest.getUsername());


        if (!user.isEnabled()) {
            return new ResponseEntity<>("User account is disabled.", HttpStatus.UNAUTHORIZED);
        }

        // user.getLogs().add(new Log("SecurityResource authentication", Level.INFO));
        userRepository.save(user);
        final String jwt = jwtTokenUtil.generateToken(userDetails);
        return new ResponseEntity<>(new AuthenticationResponse(jwt), HttpStatus.OK);
    }

    @RequestMapping(
            value = "/signup",
            method = RequestMethod.POST,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<?> createUser(@Valid @RequestBody User userRequest, BindingResult result) {
        User registeredEmail = userRepository.findByEmailIgnoreCase(userRequest.getEmail());
        if (registeredEmail != null) {
            return new ResponseEntity<>(ErrorCodes.EMAIL_ALREADY_EXISTS.toString(), HttpStatus.NOT_ACCEPTABLE);
        }
        // add trace
        userRequest.initLogs(new Log("SecurityResource createUser", Level.INFO));
        userRequest.setEnabled(false);
        userRequest.setPassword(passwordEncoder.encode(userRequest.getPassword()));
        User userResponse = userRepository.save(userRequest);
        userResponse.setPassword("");
        return new ResponseEntity<>(userResponse.toJson().toString(), HttpStatus.OK);
    }

    @PostMapping("/reset_password")
    public ResponseEntity resetPassword(
            HttpServletRequest request, @RequestParam("email") String userEmail) {
        User user = userRepository.findByEmailIgnoreCase(userEmail);
        log.info(user.toJson().toString());
        if (user == null) {
            return new ResponseEntity<>(ErrorCodes.USER_NOT_FOUND.toString(), HttpStatus.NOT_ACCEPTABLE);
        }
        String token = this.getRandomToken();

        userService.createPasswordResetTokenForUser(user, token);
        emailSenderService.sendEmail(constructResetTokenEmail(UrlUtil.getBaseUrl(request), request.getLocale(), token, user));
        return new ResponseEntity<>(messages.getMessage("message.check_mail", new Object[]{userEmail}, request.getLocale()), HttpStatus.OK);
    }

    @PostMapping("/validate_change_password")
    public ResponseEntity validateChangePassword(
            Locale locale,
            @RequestParam("token") String token,
            @RequestParam("password") String password,
            @RequestParam("email") String email
    ) {

        if (userService.validatePasswordResetToken(token, email)) {
            User user = userRepository.findByEmailIgnoreCase(email);
            user.setPassword(passwordEncoder.encode(password));
            user.getLogs().add(new Log("SecurityResource validateChangePassword", Level.WARN));
            userRepository.save(user);
            return new ResponseEntity<>(messages.getMessage("message.token_valid", null, locale), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(messages.getMessage("message.token_invalid", null, locale), HttpStatus.NOT_ACCEPTABLE);
        }

    }

    @PostMapping("/check_token")
    public ResponseEntity checkToken(
            Locale locale,
            @RequestParam("token") String token,
            @RequestParam("email") String email
    ) {

        if (userService.validatePasswordResetToken(token, email)) {
            return new ResponseEntity<>(messages.getMessage("message.token_valid", null, locale), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(messages.getMessage("message.token_invalid", null, locale), HttpStatus.NOT_ACCEPTABLE);
        }

    }

    @PostMapping("/change_password")
    public ResponseEntity changePassword(Locale locale,
                                         @RequestParam("oldPassword") String oldPassword,
                                         @RequestParam("newPassword") String newPassword,
                                         @RequestParam("email") String email) {
        if (userService.changePassword(oldPassword, newPassword, email)) {
            User user = userRepository.findByEmailIgnoreCase(email);
            emailSenderService.sendEmail(passwordChangedEmail(locale,  user));
            return new ResponseEntity<>(messages.getMessage("message.change_password.valid", null, locale), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(messages.getMessage("message.change_password.invalid", null, locale), HttpStatus.NOT_ACCEPTABLE);
        }
    }


    @PostMapping("/update_user")
    public ResponseEntity update(Locale locale,@RequestBody  User user) throws Exception {
        log.info(user.toJson().toString());
        if (userService.updateUser(user)) {
            return new ResponseEntity<>(user.toJson().toString(), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(messages.getMessage("message.change_password.invalid", null, locale), HttpStatus.NOT_ACCEPTABLE);
        }
    }


    @PostMapping(value = "/user/upload_photo", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity uploadFile(HttpServletRequest request ,@RequestParam("file") MultipartFile file, @RequestParam("email") String email)  {

        log.info(request.toString());
        log.info(email);
        log.info(file.getName());
        User user = userRepository.findByEmailIgnoreCase(email);
        try {
            userService.savePhoto(file, user);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        String downloadURL = "";
        downloadURL = ServletUriComponentsBuilder.fromCurrentContextPath().path("/api/security/user/photo/").path(String.valueOf(user.getPhoto().getId())).toUriString();
        return ResponseEntity.ok(downloadURL);
    }

   @GetMapping("/user/photo/{id}")
    public ResponseEntity<Resource> downloadFile(@PathVariable Long id) throws Exception {
        File file = fileRepository.findOneById(id);
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(file.getFileType()))
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        "attachement;filename \"" + file.getFileName() + "\"")
                .body(new ByteArrayResource(file.getData()));
    }

    @GetMapping("/user/authorisation")
    public ResponseEntity<List<Object>> authorisation(Pageable pageable) {
        Page<com.application.core.security.entities.User> userPage = userRepository.findAll(pageable);
        List<com.application.core.security.entities.User> userList = userPage.getContent();
        List<Object> userJsons = new ArrayList<>();
        for (com.application.core.security.entities.User user : userList) {
            userJsons.add(user.toJson());
        }

        // Create headers with pagination information
        HttpHeaders headers = new HttpHeaders();
        headers.add("currentPage", String.valueOf(userPage.getNumber()));
        headers.add("totalItems", String.valueOf(userPage.getTotalElements()));
        headers.add("totalPages", String.valueOf(userPage.getTotalPages()));

        return new ResponseEntity<>(userJsons, headers, HttpStatus.OK);
    }

    @GetMapping("/user/{email}")
    public ResponseEntity<?> userDetails(@PathVariable("email") String email) {
        com.application.core.security.entities.User user = userRepository.findByEmailIgnoreCase(email);
        return new ResponseEntity<>(user.toJson(), HttpStatus.OK);
    }

    @PostMapping("/user/changeStatus")
    public ResponseEntity<?> changeStatus(@RequestBody com.application.core.security.entities.User user, Locale locale) {
        com.application.core.security.entities.User requestedUser = userRepository.findByEmailIgnoreCase(user.getEmail());
        if(requestedUser == null)
            throw new RuntimeException(messages.getMessage("message.item_not_found", new Object[] { "User id :" +  user.getId()}, locale));
        requestedUser.setEnabled(!user.isEnabled());
        com.application.core.security.entities.User updatedUser = userRepository.save(requestedUser);
        return new ResponseEntity<>(updatedUser.toJson(), HttpStatus.OK);
    }

    @GetMapping("/roles")
    public ResponseEntity<?> roles(Locale locale) {
        List<Role> roles = roleRepository.findAll();
        List<JsonNode> roleJsons = new ArrayList<>();
        for (Role role : roles ) {
            roleJsons.add(role.toJson());
        }
        return new ResponseEntity<>(roleJsons, HttpStatus.OK);
    }

    @PostMapping("/create_new_user")
    public ResponseEntity<?> createNewUser(@Valid @RequestBody User userRequest, Locale locale) {
        User registeredEmail = userRepository.findByEmailIgnoreCase(userRequest.getEmail());
        if (registeredEmail != null) {
            return new ResponseEntity<>(ErrorCodes.EMAIL_ALREADY_EXISTS.toString(), HttpStatus.NOT_ACCEPTABLE);
        }
        // add trace
        userRequest.initLogs(new Log("SecurityResource createUser", Level.INFO));
        userRequest.setEnabled(false);
        userRequest.setPassword(passwordEncoder.encode(userRequest.getPassword()));
        User userResponse = userRepository.save(userRequest);
        userResponse.setPassword("");
        return new ResponseEntity<>(userResponse.toJson().toString(), HttpStatus.OK);
    }

    @PostMapping("/candidate_to_user")
    public ResponseEntity<?> candidateToUser(@Valid @RequestBody User userRequest, Locale locale) {
        User registeredEmail = userRepository.findByEmailIgnoreCase(userRequest.getEmail());
        if (registeredEmail != null) {
            return new ResponseEntity<>(ErrorCodes.EMAIL_ALREADY_EXISTS.toString(), HttpStatus.NOT_ACCEPTABLE);
        }
        // add trace
        userRequest.initLogs(new Log("SecurityResource createUser", Level.INFO));
        userRequest.setEnabled(false);
        userRequest.setPassword(passwordEncoder.encode(userRequest.getPassword()));
        User userResponse = userRepository.save(userRequest);
        userResponse.setPassword("");
        return new ResponseEntity<>(userResponse.toJson().toString(), HttpStatus.OK);
    }


    public static String getRandomToken() {
        // It will generate 6 digit random Number.
        // from 0 to 999999
        Random rnd = new Random();
        int number = rnd.nextInt(999999);
        // this will convert any number sequence into 6 character.
        return String.format("%06d", number);
    }

    private SimpleMailMessage constructResetTokenEmail(String contextPath, Locale locale, String token, User user) {
        String url = contextPath + "/change_password?token=" + token;
        String message = messages.getMessage("message.reset_password", null , locale);
        return constructEmail("Reset Password", message + " \r\n" + url, user);
    }

    private SimpleMailMessage passwordChangedEmail( Locale locale , User user) {
        String message = messages.getMessage("message.password_changed", new Object[]{user.getFirstName()}, locale);
        return constructEmail( messages.getMessage("message.password_changed", new Object[]{user.getFirstName()}, locale), message  , user);
    }



    private SimpleMailMessage constructEmail(String subject, String body, User user) {
        SimpleMailMessage email = new SimpleMailMessage();
        email.setSubject(subject);
        email.setText(body);
        email.setTo(user.getEmail());
        email.setFrom(mail);
        return email;
    }
}
