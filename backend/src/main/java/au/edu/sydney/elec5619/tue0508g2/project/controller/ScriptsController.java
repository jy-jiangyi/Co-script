package au.edu.sydney.elec5619.tue0508g2.project.controller;

import au.edu.sydney.elec5619.tue0508g2.project.dto.ScriptScenesDTO;
import au.edu.sydney.elec5619.tue0508g2.project.entity.Script;
import au.edu.sydney.elec5619.tue0508g2.project.repository.ScriptScenesRepository;
import au.edu.sydney.elec5619.tue0508g2.project.utils.ScriptGeneration;
import au.edu.sydney.elec5619.tue0508g2.project.entity.ScriptScenes;
import au.edu.sydney.elec5619.tue0508g2.project.repository.ScriptRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cglib.core.Local;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping(path = "/scripts")
public class ScriptsController {

    private final ScriptRepository scriptRepository;
    private final ScriptGeneration scriptGeneration;
    private final ScriptScenesRepository scriptScenesRepository;

    @Autowired
    public ScriptsController(ScriptRepository scriptRepository, ScriptGeneration scriptGeneration, ScriptScenesRepository scriptScenesRepository) {
        this.scriptRepository = scriptRepository;
        this.scriptGeneration = scriptGeneration;
        this.scriptScenesRepository = scriptScenesRepository;
    }

    // generate
    @PostMapping("/generate")
    public Mono<String> generateScript(@RequestParam String name,
                                       @RequestParam List<String> contextList,
                                       @RequestParam String positive,
                                       @RequestParam String negative,
                                       HttpServletRequest request) {

        HttpSession session = request.getSession();
        Long userId = (Long) session.getAttribute("userId");

        if (userId == null) {
            return Mono.just("User not authorized.");
        }

        return scriptGeneration.generateScript(name, contextList, positive, negative)
                .flatMap(generatedScript -> {
                    // 创建新的 Script 对象并保存到数据库
                    Script script = new Script();
                    script.setCreator(userId);  // 直接设置创建者ID
//                    script.setCreator(1L);  // test
                    script.setName(name);       // 设置脚本名称
                    script.setCreateTime(LocalDateTime.now());
                    scriptRepository.save(script);

                    // 保存生成的内容到 ScriptScenes 表
                    ScriptScenes scriptScenes = new ScriptScenes();
                    scriptScenes.setScript(script);  // 关联 Script 对象
                    scriptScenes.setScene(1);  // 设置场次编号
                    scriptScenes.setTitle(name);  // 设置场景标题
                    scriptScenes.setContent(generatedScript);  // 设置生成的内容
                    scriptScenes.setCreate_time(LocalDateTime.now());  // 创建时间
                    scriptScenesRepository.save(scriptScenes);

                    // 返回生成的脚本ID
                    return Mono.just("Script generated with ID: " + script.getId());
                });
    }

    @PostMapping("/emulate")
    public Mono<String> emulateScript(@RequestParam String name,
                                      @RequestParam List<String> contextList,
                                      @RequestParam String positive,
                                      @RequestParam String negative,
                                      @RequestParam String existingScript,
                                      HttpServletRequest request) {

        HttpSession session = request.getSession();
        Long userId = (Long) session.getAttribute("userId");

        // For testing, set a default userId if it's not available
        // if (userId == null) {
        //     return Mono.just("User not authorized.");
        // }

        return scriptGeneration.emulateScript(name, contextList, positive, negative, existingScript)
                .flatMap(emulatedScript -> {
                    // 创建新的 Script 对象并保存到数据库
                    Script script = new Script();
                    // script.setCreator(userId);  // 直接设置创建者ID
                    script.setCreator(1L);  // test
                    script.setName(name);       // 设置脚本名称
                    script.setCreateTime(LocalDateTime.now());
                    scriptRepository.save(script);

                    // 保存生成的内容到 ScriptScenes 表
                    ScriptScenes scriptScenes = new ScriptScenes();
                    scriptScenes.setScript(script);  // 关联 Script 对象
                    scriptScenes.setScene(1);  // 设置场次编号
                    scriptScenes.setTitle(name);  // 设置场景标题
                    scriptScenes.setContent(emulatedScript);  // 设置生成的内容
                    scriptScenes.setCreate_time(LocalDateTime.now());  // 创建时间
                    scriptScenesRepository.save(scriptScenes);

                    // 返回生成的脚本ID
                    return Mono.just("Emulated script generated with ID: " + script.getId());
                });
    }


    // rewrite
    @PostMapping("/rewrite")
    public Mono<String> rewriteScript(@RequestParam String name,
                                      @RequestParam List<String> contextList,
                                      @RequestParam String positive,
                                      @RequestParam String negative,
                                      @RequestParam String existingScript) {

        return scriptGeneration.rewriteScript(name, contextList, positive, negative, existingScript);
    }

    // translate
    @PostMapping("/translate")
    public Mono<String> translateScript(@RequestParam String name,
                                        @RequestParam List<String> contextList,
                                        @RequestParam String positive,
                                        @RequestParam String negative,
                                        @RequestParam String existingScript,
                                        @RequestParam String language) {

        return scriptGeneration.translateScript(name, contextList, positive, negative, existingScript, language);
    }



    // update 我的Script

    //return script content
    @GetMapping("/{id}")
    public ResponseEntity<String> getScriptNameById(@PathVariable Long id) {
        String scriptName = scriptRepository.getScriptNameById(id);
        if (scriptName != null) {
            return ResponseEntity.ok(scriptName);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // 根据 scriptId 获取所有场景
    @GetMapping("/{id}/scenes")
    public ResponseEntity<List<ScriptScenesDTO>> getScenesByScriptId(@PathVariable("id") Long scriptId) {
        List<ScriptScenes> scenes = scriptScenesRepository.findByScriptId(scriptId);

        // 将 ScriptScenes 转换为 ScriptScenesDTO
        List<ScriptScenesDTO> sceneDTOs = scenes.stream()
                .map(scene -> new ScriptScenesDTO(scene.getScene(), scene.getTitle(), scene.getContent())) // 确保传递所有字段
                .collect(Collectors.toList());

        return ResponseEntity.ok(sceneDTOs); // 返回 200 OK 和 DTO 列表
    }

}
