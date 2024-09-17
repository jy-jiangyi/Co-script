package au.edu.sydney.elec5619.tue0508g2.project.controller;

import au.edu.sydney.elec5619.tue0508g2.project.ai.AIAgent;
import au.edu.sydney.elec5619.tue0508g2.project.ai.AIGeminiImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

@RestController
@RequiredArgsConstructor
public class Tools {

    private final AIGeminiImpl aiGemini;

    @GetMapping("/about")
    public String about(@RequestParam(value = "group") String group) {
        return "About page: "+group;
    }

    @GetMapping("/ai_test")
    public Mono<String> ai_test() {
        return aiGemini.textGeneration("hello");
    }



}
