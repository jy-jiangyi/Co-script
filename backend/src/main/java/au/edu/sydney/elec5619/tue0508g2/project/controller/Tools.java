package au.edu.sydney.elec5619.tue0508g2.project.controller;
import au.edu.sydney.elec5619.tue0508g2.project.ai.AIGeminiImpl;
import au.edu.sydney.elec5619.tue0508g2.project.ai.AIOpenAIImpl;
import au.edu.sydney.elec5619.tue0508g2.project.entity.request.AITestRequestBody;
import au.edu.sydney.elec5619.tue0508g2.project.entity.request.AIImageRequestBody;
import au.edu.sydney.elec5619.tue0508g2.project.ext.X;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

@RestController
@RequiredArgsConstructor
public class Tools {

    private final AIGeminiImpl aiGemini;
    private final AIOpenAIImpl aiOpenAI;
    private final X x;

    @Autowired
    private Utils utils;

    @GetMapping("/about")
    public String about(@RequestParam(value = "group") String group) {
        return "About page: "+group;
    }

    @PostMapping("/ai_test")
    public Mono<String> ai_test(@RequestBody AITestRequestBody body) {
        return aiGemini.textGeneration(body);
    }

    @GetMapping("/tweet")
    public String tweet_test(@RequestParam(value = "content") String content, HttpServletRequest request){
        utils.getLoginUser(request);
        return x.tweet(content);
    }


    @PostMapping(value = "/ai_test_json", produces = MediaType.APPLICATION_JSON_VALUE)
    public Mono<String> ai_test_json(@RequestBody AITestRequestBody body) {
        return aiGemini.textGeneration(body).map(
                original ->original.trim()
                        .replaceFirst("```json", "")
                        .replace("```", "")
                        .trim()
        );

    }


    @PostMapping("/ai_image_test")
    public Mono<String> aiImageTest(@RequestBody AIImageRequestBody body) {
        return aiOpenAI.imageGeneration(body);
    }


}
