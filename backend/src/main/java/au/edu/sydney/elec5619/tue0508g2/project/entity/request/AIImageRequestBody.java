package au.edu.sydney.elec5619.tue0508g2.project.entity.request;

import lombok.Data;

@Data
public class AIImageRequestBody {

    private String prompt;
    private int n;
    private String size;
}
