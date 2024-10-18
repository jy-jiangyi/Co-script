package au.edu.sydney.elec5619.tue0508g2.project.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "context")
public class Context {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;

    @Column(length = 50, nullable = false)
    private String title;

    @Column(length = 50, nullable = false)
    private String description;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String positive;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String negative;

    @ManyToOne
    @JoinColumn(name = "creator", nullable = false)
    private Users creator;  // Assuming you have a User entity that links to the 'users' table

    // Getters and Setters

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getPositive() {
        return positive;
    }

    public void setPositive(String positive) {
        this.positive = positive;
    }

    public String getNegative() {
        return negative;
    }

    public void setNegative(String negative) {
        this.negative = negative;
    }

    public Users getCreator() {
        return creator;
    }

    public void setCreator(Users creator) {
        this.creator = creator;
    }
}
