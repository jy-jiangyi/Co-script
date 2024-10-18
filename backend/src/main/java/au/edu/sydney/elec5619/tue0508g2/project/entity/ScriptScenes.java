//package au.edu.sydney.elec5619.tue0508g2.project.entity;
//
//import jakarta.persistence.*;
//
//import java.time.LocalDateTime;
//
//@Entity
//@Table(name="script_scenes")
//public class ScriptScenes {
//
//    @Id
//    @GeneratedValue(strategy = GenerationType.AUTO)
//    private long id;
//
////    NOTE: delete it due to it cause problem: Column 'script_id' is duplicated in mapping for entity Script Scene
////     long script_id;  // 用于存储 script_id 的字段
//
//    private int scene;
//
//    private String content;
//
//    private String title;
//
//    private LocalDateTime create_time;
//
//    private LocalDateTime update_time;
//
//    @ManyToOne(fetch = FetchType.LAZY)
//    @JoinColumn(name = "script_id")
//    private Script script;
//
//    public Script getScript() {
//        return script;
//    }
//
//    public void setScript(Script script) {
//        this.script = script;
//    }
//
//    // Getters and Setters
//    public long getId() {
//        return id;
//    }
//
//    public void setId(long id) {
//        this.id = id;
//    }
//
////    public long getScript_id() {
////        return script_id;
////    }
////
////    public void setScript_id(long script_id) {
////        this.script_id = script_id;
////    }
//
//    public int getScene() {
//        return scene;
//    }
//
//    public void setScene(int scene) {
//        this.scene = scene;
//    }
//
//    public String getContent() {
//        return content;
//    }
//
//    public void setContent(String content) {
//        this.content = content;
//    }
//
//    public String getTitle() {
//        return title;
//    }
//
//    public void setTitle(String title) {
//        this.title = title;
//    }
//
//    public LocalDateTime getCreate_time() {
//        return create_time;
//    }
//
//    public void setCreate_time(LocalDateTime create_time) {
//        this.create_time = create_time;
//    }
//
//    public LocalDateTime getUpdate_time() {
//        return update_time;
//    }
//
//    public void setUpdate_time(LocalDateTime update_time) {
//        this.update_time = update_time;
//    }
//}


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

    private String content;

    private String title;

    private LocalDateTime create_time;

    private LocalDateTime update_time;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "script_id")
    private Script script;

}
