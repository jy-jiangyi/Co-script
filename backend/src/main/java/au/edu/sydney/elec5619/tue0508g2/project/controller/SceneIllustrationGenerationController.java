package au.edu.sydney.elec5619.tue0508g2.project.controller;

import au.edu.sydney.elec5619.tue0508g2.project.entity.Script;
import au.edu.sydney.elec5619.tue0508g2.project.entity.ScriptScenes;
import au.edu.sydney.elec5619.tue0508g2.project.repository.ScriptRepository;
import au.edu.sydney.elec5619.tue0508g2.project.repository.ScriptScenesRepository;
import au.edu.sydney.elec5619.tue0508g2.project.utils.SceneIllustrationGeneration;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/scene_illustration_generation")
@RequiredArgsConstructor
public class SceneIllustrationGenerationController {

    private final SceneIllustrationGeneration sceneIllustrationGeneration;
    private final ScriptRepository scriptRepository;
    private final ScriptScenesRepository scriptScenesRepository;

    // 生成单个场景的图像
    @GetMapping("/generate_scene_image")
    public Mono<String> generateSceneImage(@RequestParam Long sceneId) {
        return sceneIllustrationGeneration.generateSceneIllustrationBySceneId(sceneId);
    }

    // 生成整个剧本的所有场景图像
    @GetMapping("/generate_script_images")
    public Mono<List<String>> generateScriptImages(@RequestParam Long scriptId) {
        return sceneIllustrationGeneration.generateSceneIllustrationsByScriptId(scriptId);
    }

    // 页面初始化
    @GetMapping("/get_details")
    public Mono<ScriptDetailsDTO> getScriptDetails(@RequestParam Long scriptId) {
        System.out.println("scriptId: " + scriptId);
        return Mono.justOrEmpty(scriptRepository.findById(scriptId))
                .flatMap(script -> {
                    String scriptName = script.getName();
                    List<SceneInfoDTO> scenes = scriptScenesRepository.findByScriptId(scriptId)
                            .stream()
                            .map(scene -> new SceneInfoDTO(scene.getId(), scene.getScene(), scene.getTitle(), scene.getContent()))
                            .collect(Collectors.toList());
                    ScriptDetailsDTO dto = new ScriptDetailsDTO(scriptName, scenes);
                    return Mono.just(dto);
                })
                .switchIfEmpty(Mono.error(new RuntimeException("Script not found")));
    }
//    {
//        "scriptName": "My Awesome Script",
//            "scenes": [
//        {
//            "scene": 1,
//                "title": "Opening Scene"
//        },
//        {
//            "scene": 2,
//                "title": "The Conflict"
//        }
//        // More scenes...
//  ]
//    }


    // DTO classes
    @Setter
    @Getter
    public static class ScriptDetailsDTO {
        // Getters and setters
        private String scriptName;
        private List<SceneInfoDTO> scenes;

        public ScriptDetailsDTO(String scriptName, List<SceneInfoDTO> scenes) {
            this.scriptName = scriptName;
            this.scenes = scenes;
        }

    }

    @Setter
    @Getter
    public static class SceneInfoDTO {
        // Getters and setters
        private Long id;
        private int scene;
        private String title;
        private String content;

        public SceneInfoDTO(Long id, int scene, String title, String content) {
            this.id = id;
            this.scene = scene;
            this.title = title;
            this.content = content;
        }

    }
}
