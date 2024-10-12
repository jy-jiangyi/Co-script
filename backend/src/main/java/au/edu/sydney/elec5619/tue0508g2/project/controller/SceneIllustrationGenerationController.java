package au.edu.sydney.elec5619.tue0508g2.project.controller;

import au.edu.sydney.elec5619.tue0508g2.project.utils.SceneIllustrationGeneration;
import au.edu.sydney.elec5619.tue0508g2.project.entity.ScriptScenes;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.util.List;

@RestController
@RequestMapping("/scene_illustration_generation")
@RequiredArgsConstructor
public class SceneIllustrationGenerationController {

    private final SceneIllustrationGeneration sceneIllustrationGeneration;

    // 生成单个场景的图像
    @PostMapping("/generate_scene_image")
    public Mono<String> generateSceneImage(@RequestParam Long sceneId) {
        return sceneIllustrationGeneration.generateSceneIllustrationBySceneId(sceneId);
    }

    // 生成整个剧本的所有场景图像
    @PostMapping("/generate_script_images")
    public Mono<List<String>> generateScriptImages(@RequestParam Long scriptId) {
        return sceneIllustrationGeneration.generateSceneIllustrationsByScriptId(scriptId);
    }
}
