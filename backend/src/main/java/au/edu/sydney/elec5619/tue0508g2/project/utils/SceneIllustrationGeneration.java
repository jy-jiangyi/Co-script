package au.edu.sydney.elec5619.tue0508g2.project.utils;

import au.edu.sydney.elec5619.tue0508g2.project.ai.AIGeminiImpl;
import au.edu.sydney.elec5619.tue0508g2.project.ai.AIOpenAIImpl;
import au.edu.sydney.elec5619.tue0508g2.project.entity.Script;
import au.edu.sydney.elec5619.tue0508g2.project.entity.ScriptScenes;
import au.edu.sydney.elec5619.tue0508g2.project.entity.request.AIImageRequestBody;
import au.edu.sydney.elec5619.tue0508g2.project.entity.request.AITestRequestBody;
import au.edu.sydney.elec5619.tue0508g2.project.repository.ScriptScenesRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SceneIllustrationGeneration {

    private final AIGeminiImpl aiGemini;
    private final AIOpenAIImpl aiOpenAI;
    private final ScriptScenesRepository scriptScenesRepository;

    // Generate image for a scene by its ID
    public Mono<String> generateSceneIllustrationBySceneId(Long sceneId) {
        return Mono.fromCallable(() -> {
                    System.out.println("Fetching scene from database for ID: " + sceneId);
                    return scriptScenesRepository.findById(sceneId).orElse(null);
                })
                .flatMap(scene -> {
                    if (scene != null) {
                        System.out.println("Scene found for ID: " + sceneId);
                        return generateSceneIllustration(scene);
                    } else {
                        System.out.println("Scene not found for ID: " + sceneId);
                        return Mono.error(new IllegalArgumentException("Scene not found for id: " + sceneId));
                    }
                })
                .doOnError(error -> {
                    System.err.println("An error occurred: " + error.getMessage());
                });
    }

    // Generate images for all scenes in a script
    public Mono<List<String>> generateSceneIllustrationsByScriptId(Long scriptId) {
        return Mono.fromCallable(() -> scriptScenesRepository.findByScriptId(scriptId))
                .flatMapMany(Flux::fromIterable)
                .concatMap(this::generateSceneIllustration) // Use concatMap to maintain order
                .collectList();
    }

    // Internal method: Generate image for a single scene
    private Mono<String> generateSceneIllustration(ScriptScenes currentScene) {
        Script script = currentScene.getScript();
        int currentSceneNumber = currentScene.getScene();

        // Fetch all previous scenes up to the current scene
        return Mono.fromCallable(() -> scriptScenesRepository.findByScriptAndSceneLessThanOrderBySceneAsc(script, currentSceneNumber))
                .flatMap(previousScenes -> {
                    // Concatenate previous scenes' content
                    StringBuilder previousContentBuilder = new StringBuilder();
                    for (ScriptScenes scene : previousScenes) {
                        previousContentBuilder.append(scene.getContent()).append("\n");
                    }
                    String previousContent = previousContentBuilder.toString();

                    // Generate summary if needed
                    return generateSummaryIfNeeded(previousContent)
                            .flatMap(summary -> {
                                // Combine summary and current scene content for the prompt
                                String combinedPrompt = createImageGenerationPrompt(summary, currentScene.getContent());
                                // Check length and generate image
                                return generateImageWithPrompt(combinedPrompt);
                            });
                });
    }

    // Generate summary if text exceeds 3000 characters
    private Mono<String> generateSummaryIfNeeded(String text) {
        if (text.length() > 3000) {
            // Text too long, generate summary
            return summarizeText(text);
        } else {
            // Text length acceptable, return as is
            return Mono.just(text);
        }
    }

    // Call Gemini API to summarize text
    private Mono<String> summarizeText(String text) {
        String prompt = "Please provide a concise summary highlighting the main characters, settings, " +
                "and elements relevant for image generation. The summary will be used as context for " +
                "generating images of subsequent scenes.\n\n" + text;

        AITestRequestBody requestBody = new AITestRequestBody();
        requestBody.setPromot(prompt);

        return aiGemini.textGeneration(requestBody);
    }

    // Create prompt for image generation by combining summary and current scene
    private String createImageGenerationPrompt(String summary, String currentSceneContent) {
        return "Use the following context to generate an image for the current scene. " +
                "Note that the if Context Summary exists, only use it as a reference information. " +
                "Do NOT generate the image for the scenes in the Context Summary.\n\n"
                + "Context Summary:\n" + summary + "\n\n"
                + "Current Scene Description:\n" + currentSceneContent;
    }

    // Generate image, summarizing the prompt if necessary
    private Mono<String> generateImageWithPrompt(String prompt) {
        if (prompt.length() > 3000) {
            // Prompt too long, summarize
            return summarizeText(prompt)
                    .flatMap(this::generateImageWithDalle);
        } else {
            // Prompt length acceptable, generate image directly
            return generateImageWithDalle(prompt);
        }
    }

    // Call DALL·E API to generate image
    private Mono<String> generateImageWithDalle(String prompt) {
        AIImageRequestBody requestBody = new AIImageRequestBody();
        requestBody.setPrompt(prompt);
        requestBody.setN(1);
        requestBody.setSize("1024x1024");

        return aiOpenAI.imageGeneration(requestBody);
    }
}
