package au.edu.sydney.elec5619.tue0508g2.project.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ScriptScenesDTO {

    private Long id;
    private String content;

    public ScriptScenesDTO(Long id, String content) {
        this.id = id;
        this.content = content;
    }
}
