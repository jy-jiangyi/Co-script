package au.edu.sydney.elec5619.tue0508g2.project.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@Setter
@Getter
@ConfigurationProperties("app.ai.openai")
public class OpenAIConfig {

    private String apikey;
    private String url;
}
