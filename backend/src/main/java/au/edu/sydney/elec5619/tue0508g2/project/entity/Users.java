package au.edu.sydney.elec5619.tue0508g2.project.entity;

import jakarta.persistence.*;
import org.springframework.cglib.core.Local;

import java.time.LocalDateTime;

@Entity
@Table(name = "users")
public class Users {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;

    private String email;

    private String name;

    private int role;

    private String password_hash;

    private LocalDateTime create_time;

    private LocalDateTime update_time;

    public void setId(long id) {
        this.id = id;
    }

    public void setEmail(String email) {
        this.email = email;
    }
    public void setName(String name) {
        this.name = name;
    }
    public void setRole(int role) {
        this.role = role;
    }
    public void setPassword_hash(String password_hash) {
        this.password_hash = password_hash;
    }

    public long getId() {
        return id;
    }

    public String getEmail() {
        return email;
    }
    public String getName() {
        return name;
    }
    public int getRole() {
        return role;
    }
    public String getPassword_hash() {
        return password_hash;
    }
    public LocalDateTime getCreate_time() {
        return create_time;
    }
    public void setCreate_time(LocalDateTime create_time) {
        this.create_time = create_time;
    }
    public LocalDateTime getUpdate_time() {
        return update_time;
    }
}
