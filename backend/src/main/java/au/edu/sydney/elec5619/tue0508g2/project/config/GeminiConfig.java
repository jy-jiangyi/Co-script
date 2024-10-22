package au.edu.sydney.elec5619.tue0508g2.project.config;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@Data
@ConfigurationProperties("app.ai.gemini")
public class GeminiConfig {

    private String apikey;

    private String url;

}
