package au.edu.sydney.elec5619.tue0508g2.project.ai;

import au.edu.sydney.elec5619.tue0508g2.project.config.OpenAIConfig;
import au.edu.sydney.elec5619.tue0508g2.project.entity.openai.ImageGenerationRequest;
import au.edu.sydney.elec5619.tue0508g2.project.entity.openai.ImageGenerationResponse;
import au.edu.sydney.elec5619.tue0508g2.project.entity.request.AIImageRequestBody;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@Service
public class AIOpenAIImpl {

    private final WebClient webClient;
    private final OpenAIConfig openAIConfig;

    public AIOpenAIImpl(WebClient.Builder webClientBuilder, OpenAIConfig openAIConfig) {
        this.openAIConfig = openAIConfig;
        this.webClient = webClientBuilder.baseUrl(openAIConfig.getUrl())
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .defaultHeader(HttpHeaders.AUTHORIZATION, "Bearer " + openAIConfig.getApikey())
                .build();
    }

    public Mono<String> imageGeneration(AIImageRequestBody body) {
        return webClient.post()
                .uri("/v1/images/generations")
                .bodyValue(
                        ImageGenerationRequest.build(
                                body.getPrompt(),
                                body.getN(),
                                body.getSize(),
                                body.getModel()
                        )
                )
                .retrieve()
                .bodyToMono(ImageGenerationResponse.class)
                .map(response -> {
                    // 提取第一个生成的图像URL
                    return response.getData().get(0).getUrl();
                })
                .onErrorResume(e -> {
                    // 错误处理
                    return Mono.just("Error: " + e.getMessage());
                });
    }
}
