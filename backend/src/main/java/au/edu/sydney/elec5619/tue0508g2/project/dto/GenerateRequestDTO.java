package au.edu.sydney.elec5619.tue0508g2.project.dto;

import lombok.Data;
import lombok.Getter;

import java.util.List;

@Getter
public class GenerateRequestDTO {

    private String name;
    private List<String> contextList;
    private String positive;
    private String negative;
}

