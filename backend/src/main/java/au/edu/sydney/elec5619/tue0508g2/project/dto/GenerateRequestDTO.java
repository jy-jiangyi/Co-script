package au.edu.sydney.elec5619.tue0508g2.project.dto;

import lombok.Data;


import java.util.List;

@Data
public class GenerateRequestDTO {

    private String name;
    private List<String> contextList;
    private String positive;
    private String negative;
}

