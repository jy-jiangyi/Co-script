package au.edu.sydney.elec5619.tue0508g2.project.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class AIContinuationDTO {

    // scene name
    private long script_id; //script_id
    private int scene_id; //previous id
    private String name; //scene name
    private List<String> contextList; // context list
    private String positive; // positive prompt
    private String negative; // negative prompt
}
