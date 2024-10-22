package au.edu.sydney.elec5619.tue0508g2.project.controller;

import au.edu.sydney.elec5619.tue0508g2.project.entity.Users;
import au.edu.sydney.elec5619.tue0508g2.project.entity.request.UserLoginRequestBody;
import au.edu.sydney.elec5619.tue0508g2.project.repository.UsersRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.net.ssl.HandshakeCompletedEvent;
import java.time.LocalDateTime;

@RestController
@RequestMapping(path="/users")
public class UserController {

    @Autowired
    private UsersRepository usersRepository;

    @GetMapping(path="/all")
    public @ResponseBody Iterable<Users> getAllUsers() {
        // This returns a JSON or XML with the users
        return usersRepository.findAll();
    }

    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@RequestBody Users user) {

        if (usersRepository.existsByEmail(user.getEmail())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Email already in use, please choose another one.");
        }
        // add hash password function
        user.setPassword_hash(user.getPassword_hash());

        // create create_time and update_time
        LocalDateTime now = LocalDateTime.now();
        user.setCreate_time(now);
        user.setUpdate_time(now);

        try {
            // save user data
            Users savedUser = usersRepository.save(user);

            // return 201 status code and created succesfully msg
            return ResponseEntity.status(HttpStatus.CREATED).body("User created successfully.");
        } catch (Exception e) {
            // return bad request status code and possible error msg
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Registration failed: " + e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<String> loginUser(@RequestBody UserLoginRequestBody user, HttpServletRequest request) {
        // 检查用户是否存在
        Users existingUser = usersRepository.findByEmail(user.getEmail());
        if (existingUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid email or password.");
        }

        // compared password directly, configure security configuration in future
        if (!existingUser.getPassword_hash().equals(user.getPassword_hash())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid email or password.");
        }

        // set session
        HttpSession session = request.getSession();
        session.setAttribute("userId", existingUser.getId());

        // 登录成功，返回 200 状态码和成功消息
        return ResponseEntity.status(HttpStatus.OK).body(existingUser.getName());
    }

    @GetMapping("/logout")
    public ResponseEntity<String> logoutUser(HttpServletRequest request) {
        HttpSession session = request.getSession();
        session.removeAttribute("userId");
        return ResponseEntity.status(HttpStatus.OK).body("Logout successful.");
    }

    @GetMapping("/name")
    public ResponseEntity<String> getUserName(HttpServletRequest request) {
        HttpSession session = request.getSession();
        Long userId = (Long) session.getAttribute("userId");
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("");
        }else{
            Users user = usersRepository.findById(userId).orElse(null);
            if (user == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("");
            }else{
                return ResponseEntity.status(HttpStatus.OK).body(user.getName());
            }
        }
    }

}
