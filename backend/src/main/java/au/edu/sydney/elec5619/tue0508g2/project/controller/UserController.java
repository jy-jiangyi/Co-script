package au.edu.sydney.elec5619.tue0508g2.project.controller;

import au.edu.sydney.elec5619.tue0508g2.project.entity.Users;
import au.edu.sydney.elec5619.tue0508g2.project.repository.UsersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@Controller
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
        // hash password but do not write unill now
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

}
