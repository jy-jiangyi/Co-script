package au.edu.sydney.elec5619.tue0508g2.project.utils;

import au.edu.sydney.elec5619.tue0508g2.project.ai.AIGeminiImpl;
import au.edu.sydney.elec5619.tue0508g2.project.ai.AIOpenAIImpl;
import au.edu.sydney.elec5619.tue0508g2.project.entity.Script;
import au.edu.sydney.elec5619.tue0508g2.project.entity.ScriptScenes;
import au.edu.sydney.elec5619.tue0508g2.project.entity.request.AIImageRequestBody;
import au.edu.sydney.elec5619.tue0508g2.project.entity.request.AITestRequestBody;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;
import java.util.List;

@Service
@RequiredArgsConstructor

public class ScriptGeneration {

    private final AIGeminiImpl aiGemini;

    private final AIOpenAIImpl aiOpenAI;

    // simple generation
    public Mono<String> generateScript(String name, List<String> contextList, String positive, String negative) {

        String context = String.join(", ", contextList);

        String prompt = "Name: " + name + "\n"
                + "Context: " + context + "\n"
                + "Positive: " + positive + "\n"
                + "Negative: " + negative + "\n";

        AITestRequestBody requestBody = new AITestRequestBody();
        requestBody.setPromot("Please generate a detailed script based on the following information:\n" + prompt);

        return aiGemini.textGeneration(requestBody);
    }

    // emulation
    public Mono<String> emulateScript(String name, List<String> contextList, String positive, String negative, String emulateScript) {

        String context = String.join(", ", contextList);

        String prompt = "Script Name: " + name + "\n"
                + "Script Context: " + context + "\n"
                + "Positive Aspects: " + positive + "\n"
                + "Negative Aspects: " + negative + "\n"
                + "Existing Script: " + emulateScript + "\n";

        AITestRequestBody requestBody = new AITestRequestBody();

        requestBody.setPromot("Please emulate the following script based on the given details and generate an enhanced version:\n" + prompt);

        return aiGemini.textGeneration(requestBody);
    }

    // rewrite
    public Mono<String> rewriteScript(String name, List<String> contextList, String positive, String negative, String rewriteScript) {

        String context = String.join(", ", contextList);

        String prompt = "Script Name: " + name + "\n"
                + "Script Context: " + context + "\n"
                + "Positive Aspects: " + positive + "\n"
                + "Negative Aspects: " + negative + "\n"
                + "Existing Script: " + rewriteScript + "\n";

        AITestRequestBody requestBody = new AITestRequestBody();

        requestBody.setPromot("Please rewrite the following script, improving upon the positive aspects and avoiding the negative aspects where possible:\n" + prompt);

        return aiGemini.textGeneration(requestBody);
    }

    // translate
    public Mono<String> translateScript(String name, List<String> contextList, String positive, String negative, String translateScript, String language) {

        String context = String.join(", ", contextList);

        String prompt = "Script Name: " + name + "\n"
                + "Script Context: " + context + "\n"
                + "Positive Aspects: " + positive + "\n"
                + "Negative Aspects: " + negative + "\n"
                + "Existing Script: " + translateScript + "\n";

        AITestRequestBody requestBody = new AITestRequestBody();

        requestBody.setPromot("Please translate the following script into " + language + "\n" + prompt);


        return aiGemini.textGeneration(requestBody);
    }


}
