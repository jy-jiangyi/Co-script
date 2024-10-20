package au.edu.sydney.elec5619.tue0508g2.project.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ScriptScenesDTO {

    private int scene;
    private String title;
    private String content;

    public ScriptScenesDTO(int scene, String title, String content) {
        this.scene = scene;
        this.title = title;
        this.content = content;
    }

}
