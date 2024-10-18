package au.edu.sydney.elec5619.tue0508g2.project.entity.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
public class AIImageRequestBody {

    @Schema(defaultValue = "A woman with long straight hair is having breakfast.")
    private String prompt;
    @Schema(description = "Image number must be 1. ", defaultValue = "1")
    private int n=1;
    @Schema(description = "size", defaultValue = "1024x1024")
    private String size = "1024x1024";
    @Schema(description = "Choosing model.", defaultValue = "dall-e-3")
    private String model="dall-e-3";
}
