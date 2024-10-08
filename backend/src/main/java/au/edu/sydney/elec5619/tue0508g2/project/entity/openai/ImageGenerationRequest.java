package au.edu.sydney.elec5619.tue0508g2.project.entity.openai;

import lombok.Data;

@Data
public class ImageGenerationRequest {

    private String prompt;
    private int n;
    private String size;
    private String model;

    public static ImageGenerationRequest build(String prompt, int n, String size, String model) {
        ImageGenerationRequest request = new ImageGenerationRequest();
        request.setPrompt(prompt);
        request.setN(n);
        request.setSize(size);
        request.setModel(model);
        return request;
    }
}
