package com.application.core.security.services;

import com.application.core.security.encoder.BCryptPassword;
import com.application.core.security.entities.PasswordResetToken;
import com.application.core.security.repository.PasswordResetTokenRepository;
import com.application.core.security.repository.UserRepository;
import com.application.core.shared.entities.File;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;

@Service
public class UserService implements UserDetailsService {

    private UserRepository userRepository;
    private PasswordResetTokenRepository passwordResetTokenRepository;

    @Autowired
    public UserService(UserRepository userRepository, PasswordResetTokenRepository passwordResetTokenRepository) {
        this.userRepository = userRepository;
        this.passwordResetTokenRepository = passwordResetTokenRepository;
    }

    private static final Logger log = LoggerFactory.getLogger(UserDetailsService.class);
    private final BCryptPassword passwordEncoder = new BCryptPassword();

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        com.application.core.security.entities.User dbUser =
                userRepository.findByEmailIgnoreCase(username);
        return new User(dbUser.getEmail(), dbUser.getPassword(), new ArrayList<>());
    }

    public void createPasswordResetTokenForUser(com.application.core.security.entities.User user, String token) {
        PasswordResetToken passwordResetToken = new PasswordResetToken(token, user, addHoursToJavaUtilDate(new Date(), 12));
        passwordResetTokenRepository.save(passwordResetToken);
    }


    private Date addHoursToJavaUtilDate(Date date, int hours) {
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(date);
        calendar.add(Calendar.HOUR_OF_DAY, hours);
        return calendar.getTime();
    }


    public Boolean validatePasswordResetToken(String token, String email) {

        com.application.core.security.entities.User user = userRepository.findByEmailIgnoreCase(email);

        final PasswordResetToken passToken = passwordResetTokenRepository.findByTokenAndUser(token, user);

        return isTokenFound(passToken) && !isTokenExpired(passToken);

    }

    private boolean isTokenFound(PasswordResetToken passToken) {
        return passToken != null;
    }

    private boolean isTokenExpired(PasswordResetToken passToken) {
        final Calendar cal = Calendar.getInstance();
        return passToken.getExpiryDate().before(cal.getTime());
    }

    public boolean changePassword(String oldPassword, String newPassword, String email) {
        com.application.core.security.entities.User user = userRepository.findByEmailIgnoreCase(email);
        boolean passwordIsOk = passwordEncoder.matches(oldPassword, user.getPassword());
        if (passwordIsOk) {
            user.setPassword(passwordEncoder.encode(newPassword));
            userRepository.save(user);
            return true;
        }
        return false;
    }

    @Transactional
    public boolean updateUser(com.application.core.security.entities.User user) throws Exception {
        /// TODO no find  a logic
        com.application.core.security.entities.User localUser =  userRepository.findByEmailIgnoreCase(user.getEmail());
        localUser.setPhoneNumber(user.getPhoneNumber());
        localUser.setFirstName(user.getFirstName());
        localUser.setLastName(user.getLastName());
        localUser.setRoles(user.getRoles());
        try {
            userRepository.save(localUser);
            return true;
        } catch (Exception e) {
            throw new Exception("Could not save file" + e.getMessage() );
        }
    }

    public com.application.core.security.entities.User savePhoto(MultipartFile file, com.application.core.security.entities.User user) throws Exception {
        String fileName = StringUtils.cleanPath(file.getOriginalFilename());
        try {
            if (fileName.contains("..")) {
                throw  new Exception("file name contains invalid path sequence " + fileName);
            }

            File photo = new File(fileName,file.getContentType(),file.getBytes());
            user.setPhoto(photo);
            return userRepository.save(user);
        }catch (Exception e) {
            throw new Exception("Could not save file" + e.getMessage() );
        }
    }

    /*
    *
    * public FileProd saveFileProd(MultipartFile file, Product product) throws Exception {
        String fileName = StringUtils.cleanPath(file.getOriginalFilename());
        try {
            if (fileName.contains("..")) {
                throw  new Exception("file name contains invalid path sequence " + fileName);
            }
            FileProd fileProd = new FileProd(file,product);
            fileProd.setActive(true);
            return fileProdRepository.save(fileProd);
        }catch (Exception e) {
            throw new Exception("Could not save file" + fileName );
        }
    }
    *
    * */
}
