package au.edu.sydney.elec5619.tue0508g2.project.entity.gemini;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

import java.util.List;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class TextGenerationResponse {

    private List<Candidate> candidates;

    @Data
    public static class Candidate{
        private String finishReason;
        private int index;

        private Content content;

    }

    @Data
    public static class Content{
        private String role;

        private List<Part> parts;
    }

    @Data
    public static class Part{
        public String text;
    }

}
