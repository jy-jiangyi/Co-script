package au.edu.sydney.elec5619.tue0508g2.project.controller;

import au.edu.sydney.elec5619.tue0508g2.project.ai.AIGeminiImpl;
import au.edu.sydney.elec5619.tue0508g2.project.entity.request.AITestRequestBody;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

@RestController
@RequiredArgsConstructor
public class Tools {

    private final AIGeminiImpl aiGemini;

    @GetMapping("/about")
    public String about(@RequestParam(value = "group") String group) {
        return "About page: "+group;
    }

    @PostMapping("/ai_test")
    public Mono<String> ai_test(@RequestBody AITestRequestBody body) {
        return aiGemini.textGeneration(body);
    }


    @PostMapping(value = "/ai_test_json", produces = MediaType.APPLICATION_JSON_VALUE)
    public Mono<String> ai_test_json(@RequestBody AITestRequestBody body) {
        return aiGemini.textGeneration(body).map(
                original -> original.trim()
                            .replaceFirst("```json", "")
                            .replace("```", "")
                            .trim()
        );
    }



}
