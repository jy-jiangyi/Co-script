package au.edu.sydney.elec5619.tue0508g2.project.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ScriptScenesDTO {

    private long id;
    private int scene;
    private String title;
    private String content;

    public ScriptScenesDTO(long id, int scene, String title, String content) {
        this.id = id;
        this.scene = scene;
        this.title = title;
        this.content = content;
    }

}
