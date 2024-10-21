package au.edu.sydney.elec5619.tue0508g2.project.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name="script_scenes")
@Getter
@Setter
public class ScriptScenes {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;
    //场次
    private int scene;

    @Column(columnDefinition = "mediumtext")
    private String content;

    private String title;

    private LocalDateTime create_time;

    private LocalDateTime update_time;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "script_id")
    private Script script;

}
