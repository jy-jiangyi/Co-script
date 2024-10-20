package au.edu.sydney.elec5619.tue0508g2.project.entity.openai;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

import java.util.List;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class ImageGenerationResponse {

    private long created;
    private List<DataItem> data;

    @Data
    public static class DataItem {
        private String url;
    }
}
