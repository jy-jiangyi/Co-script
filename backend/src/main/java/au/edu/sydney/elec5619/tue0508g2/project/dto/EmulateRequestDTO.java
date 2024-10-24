package au.edu.sydney.elec5619.tue0508g2.project.dto;

import lombok.Data;


import java.util.List;
@Data
public class EmulateRequestDTO {
    private String name;
    private List<String> contextList;
    private String positive;
    private String negative;
    private String existingScript;
}
