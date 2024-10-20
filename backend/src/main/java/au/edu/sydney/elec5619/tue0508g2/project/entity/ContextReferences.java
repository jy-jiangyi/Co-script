package au.edu.sydney.elec5619.tue0508g2.project.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import org.springframework.cglib.core.Local;

import jakarta.persistence.Column;
@Entity
public class ContextReferences {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;

    private long script_id;

    private long context_id;

    public void setId(long id) {
        this.id = id;
    }
    public void setScript_id(long script_id) {
        this.script_id = script_id;
    }
    public void setContext_id(long context_id) {
        this.context_id = context_id;
    }

    public long getId() {
        return id;
    }
    public long getScript_id() {
        return script_id;
    }
    public long getContext_id() {
        return context_id;
    }
}
