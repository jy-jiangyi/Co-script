package au.edu.sydney.elec5619.tue0508g2.project.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.*;

@Entity
public class ScriptsRelations {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;

    private long parent_id;

    private long child_id;

    @Column(length = 50)
    private String relation;

    public void setId(long id) {
        this.id = id;
    }

    public void setParent_id(long parent_id) {
        this.parent_id = parent_id;
    }
    public void setChild_id(long child_id) {
        this.child_id = child_id;
    }
    public void setRelation(String relation) {
        this.relation = relation;
    }


    public long getId() {
        return id;
    }
    public long getParent_id() {
        return parent_id;
    }
    public long getChild_id() {
        return child_id;
    }
    public String getRelation() {
        return relation;
    }


}
