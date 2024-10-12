package au.edu.sydney.elec5619.tue0508g2.project.utils;

import au.edu.sydney.elec5619.tue0508g2.project.ai.AIGeminiImpl;
import au.edu.sydney.elec5619.tue0508g2.project.ai.AIOpenAIImpl;
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

    // 根据场景ID生成图像
    public Mono<String> generateSceneIllustrationBySceneId(Long sceneId) {
        // 从数据库获取场景信息
        return Mono.fromCallable(
                        () -> {
                            System.out.println("Fetching scene from database for ID: " + sceneId);
                            return scriptScenesRepository.findById(sceneId).orElse(null);
                        })
//                .subscribeOn(Schedulers.boundedElastic())
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

    // 根据剧本ID生成所有场景的图像
    public Mono<List<String>> generateSceneIllustrationsByScriptId(Long scriptId) {
        // 从数据库获取所有场景信息
        return Mono.fromCallable(() -> scriptScenesRepository.findByScriptId(scriptId))
                .flatMapMany(Flux::fromIterable)
                .flatMap(this::generateSceneIllustration)
                .collectList();
    }

    // 内部方法：生成单个场景的图像
    private Mono<String> generateSceneIllustration(ScriptScenes scriptScenes) {
        String sceneText = scriptScenes.getContent();
        int sceneLength = sceneText.length();

        if (sceneLength < 3000) {
            // 直接调用DALL·E生成图像
            return generateImageWithDalle(sceneText);
        } else {
            // 先调用Gemini进行摘要，然后调用DALL·E
            return summarizeSceneWithGemini(sceneText)
                    .flatMap(this::generateImageWithDalle);
        }
    }

    // 调用DALL·E生成图像
    private Mono<String> generateImageWithDalle(String prompt) {
        AIImageRequestBody requestBody = new AIImageRequestBody();
        requestBody.setPrompt(prompt);
        requestBody.setN(1);
        requestBody.setSize("1024x1024");

        return aiOpenAI.imageGeneration(requestBody);
    }

    // 调用Gemini进行摘要
    private Mono<String> summarizeSceneWithGemini(String sceneText) {
        AITestRequestBody requestBody = new AITestRequestBody();
        requestBody.setPromot("Please summarize the following scene to a short description suitable for image generation:\n" + sceneText);

        return aiGemini.textGeneration(requestBody);
    }
}