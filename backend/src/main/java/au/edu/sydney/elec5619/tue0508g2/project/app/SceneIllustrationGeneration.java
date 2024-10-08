package au.edu.sydney.elec5619.tue0508g2.project.app;

import au.edu.sydney.elec5619.tue0508g2.project.ai.AIGeminiImpl;
import au.edu.sydney.elec5619.tue0508g2.project.ai.AIOpenAIImpl;
import au.edu.sydney.elec5619.tue0508g2.project.entity.ScriptScenes;
import au.edu.sydney.elec5619.tue0508g2.project.entity.request.AIImageRequestBody;
import au.edu.sydney.elec5619.tue0508g2.project.entity.request.AITestRequestBody;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

@Service
@RequiredArgsConstructor
public class SceneIllustrationGeneration {

    private final AIGeminiImpl aiGemini;
//    private final AIAgent aiOpenAI;
    private final AIOpenAIImpl aiOpenAI;

    public Mono<String> generateSceneIllustration(ScriptScenes scriptScenes) {
        String sceneText = scriptScenes.getContent();
        int sceneLength = sceneText.length();

        if (sceneLength < 3000) {
            // dall-e directly
            return generateImageWithDalle(sceneText);
        } else {
            // Gemini summarize + dall-e
            return summarizeSceneWithGemini(sceneText)
                    .flatMap(summary -> generateImageWithDalle(summary));
        }
    }


    private Mono<String> generateImageWithDalle(String prompt) {
        AIImageRequestBody requestBody = new AIImageRequestBody();
        requestBody.setPrompt(prompt);
        requestBody.setN(1);
        requestBody.setSize("1024x1024");

        return aiOpenAI.imageGeneration(requestBody);
    }


    private Mono<String> summarizeSceneWithGemini(String sceneText) {
        AITestRequestBody requestBody = new AITestRequestBody();
        requestBody.setPromot("Please summarize the following scene to a short description suitable for image generation:\n" + sceneText);

        return aiGemini.textGeneration(requestBody);
    }
}
