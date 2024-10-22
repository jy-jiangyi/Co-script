package au.edu.sydney.elec5619.tue0508g2.project.entity;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Entity
@Table(name = "context")
public class Context {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @JsonSerialize(using = ToStringSerializer.class)
    @Column(insertable = false)
    private long id;

    @Column(length = 50, nullable = false)
    private String title;

    @Column(length = 50, nullable = false)
    private String description;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String positive;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String negative;

    @Column(name="creator", updatable = false)
    private Long creator;
    // @ManyToOne
    // @JoinColumn(name = "creator", nullable = false)
    // private Users creator;  // Assuming you have a User entity that links to the 'users' table

    // Getters and Setters

}
