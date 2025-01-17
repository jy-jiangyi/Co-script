package au.edu.sydney.elec5619.tue0508g2.project.ai;

import au.edu.sydney.elec5619.tue0508g2.project.config.GeminiConfig;
import au.edu.sydney.elec5619.tue0508g2.project.entity.gemini.TextGenerationRequest;
import au.edu.sydney.elec5619.tue0508g2.project.entity.gemini.TextGenerationResponse;
import au.edu.sydney.elec5619.tue0508g2.project.entity.request.AITestRequestBody;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.CoreSubscriber;
import reactor.core.publisher.Mono;

import java.util.HashMap;
import java.util.Map;


@Service

public class AIGeminiImpl implements AIAgent{

    private final WebClient webClient;
    private final GeminiConfig geminiConfig;

    public AIGeminiImpl(WebClient.Builder webClientBuilder, GeminiConfig geminiConfig) {
        this.geminiConfig = geminiConfig;
        webClient = webClientBuilder.baseUrl(geminiConfig.getUrl())
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .defaultUriVariables(Map.of("key", geminiConfig.getApikey()))
                .build();
    }

    public Mono<String> textGeneration(AITestRequestBody body) {
        return webClient.post()
                .uri(":generateContent?key={key}")
                .bodyValue(
                        TextGenerationRequest.build_by_parts(
                                body.getPromot()
                        )
                )
                .retrieve()
                .bodyToMono(TextGenerationResponse.class)
                .map(response -> {
                    return response.getCandidates().getFirst()
                            .getContent().getParts()
                            .getFirst().getText();

                })
                .retry(5)
                .onErrorResume(e -> {
                    return Mono.just(e.toString());
                });


    }

}
