package au.edu.sydney.elec5619.tue0508g2.project.controller;

import au.edu.sydney.elec5619.tue0508g2.project.dto.*;
import au.edu.sydney.elec5619.tue0508g2.project.entity.Script;
import au.edu.sydney.elec5619.tue0508g2.project.repository.ScriptScenesRepository;
import au.edu.sydney.elec5619.tue0508g2.project.utils.ScriptGeneration;
import au.edu.sydney.elec5619.tue0508g2.project.entity.ScriptScenes;
import au.edu.sydney.elec5619.tue0508g2.project.repository.ScriptRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

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
    public Mono<String> generateScript(@RequestBody GenerateRequestDTO requestBody, HttpServletRequest request) {
        // 打印收到的请求体内容
//        System.out.println("Received request body: ");
//        System.out.println("Name: " + requestBody.getName());
//        System.out.println("ContextList: " + requestBody.getContextList());
//        System.out.println("Positive: " + requestBody.getPositive());
//        System.out.println("Negative: " + requestBody.getNegative());

        HttpSession session = request.getSession();
        Long userId = (Long) session.getAttribute("userId");

    if (userId == null) {
        return Mono.just("{\"message\": \"User not authorized.\"}");
    }


        return scriptGeneration.generateScript(requestBody.getName(), requestBody.getContextList(),
                        requestBody.getPositive(), requestBody.getNegative())
                .flatMap(generatedScript -> {
                    Script script = new Script();
                    script.setCreator(userId);
//                    script.setCreator(1L);  // test
                    script.setName(requestBody.getName());
                    script.setCreateTime(LocalDateTime.now());
                    scriptRepository.save(script);

                    ScriptScenes scriptScenes = new ScriptScenes();
                    scriptScenes.setScript(script);
                    scriptScenes.setScene(1);
                    scriptScenes.setTitle(requestBody.getName());
                    scriptScenes.setContent(generatedScript);
                    scriptScenes.setCreate_time(LocalDateTime.now());
                    scriptScenesRepository.save(scriptScenes);

                    // 返回生成的脚本内容以及脚本 ID
                    return Mono.just("{\"message\": \"Generated script with ID: " + script.getId() + "\"}");
                });
    }

    // emulate
    @PostMapping("/emulate")
    public Mono<String> emulateScript(@RequestBody EmulateRequestDTO requestBody, HttpServletRequest request) {
//        // 打印收到的请求体内容
//        System.out.println("Received Emulate request body: ");
//        System.out.println("Name: " + requestBody.getName());
//        System.out.println("ContextList: " + requestBody.getContextList());
//        System.out.println("Positive: " + requestBody.getPositive());
//        System.out.println("Negative: " + requestBody.getNegative());
//        System.out.println("ExistingScript: " + requestBody.getExistingScript());

        HttpSession session = request.getSession();
        Long userId = (Long) session.getAttribute("userId");

        if (userId == null) {
            return Mono.just("{\"message\": \"User not authorized.\"}");
        }

        return scriptGeneration.emulateScript(requestBody.getName(), requestBody.getContextList(),
                        requestBody.getPositive(), requestBody.getNegative(), requestBody.getExistingScript())
                .flatMap(emulatedScript -> {
                    Script script = new Script();
                    script.setCreator(userId);
//                    script.setCreator(1L);  // test
                    script.setName(requestBody.getName());
                    script.setCreateTime(LocalDateTime.now());
                    scriptRepository.save(script);

                    ScriptScenes scriptScenes = new ScriptScenes();
                    scriptScenes.setScript(script);
                    scriptScenes.setScene(1);
                    scriptScenes.setTitle(requestBody.getName());
                    scriptScenes.setContent(emulatedScript);
                    scriptScenes.setCreate_time(LocalDateTime.now());
                    scriptScenesRepository.save(scriptScenes);

                    // 直接返回脚本 ID 的 JSON 字符串
                    return Mono.just("{\"message\": \"Emulated script generated with ID: " + script.getId() + "\"}");
                });
    }

    // rewrite
    @PostMapping("/rewrite")
    public Mono<String> rewriteScript(@RequestBody RewriteRequestDTO requestBody, HttpServletRequest request) {
        // 打印收到的请求体内容
//        System.out.println("Received Rewrite request body: ");
//        System.out.println("Name: " + requestBody.getName());
//        System.out.println("ContextList: " + requestBody.getContextList());
//        System.out.println("Positive: " + requestBody.getPositive());
//        System.out.println("Negative: " + requestBody.getNegative());
//        System.out.println("ExistingScript: " + requestBody.getExistingScript());

        HttpSession session = request.getSession();
        Long userId = (Long) session.getAttribute("userId");

        // 如果 userId 为空，返回未授权的响应
        if (userId == null) {
            return Mono.just("{\"message\": \"User not authorized.\"}");
        }

        return scriptGeneration.rewriteScript(requestBody.getName(), requestBody.getContextList(),
                        requestBody.getPositive(), requestBody.getNegative(), requestBody.getExistingScript())
                .flatMap(rewrittenScript -> {
                    Script script = new Script();
                    script.setCreator(userId);
//                    script.setCreator(1L);  // test
                    script.setName(requestBody.getName());
                    script.setCreateTime(LocalDateTime.now());
                    scriptRepository.save(script);

                    ScriptScenes scriptScenes = new ScriptScenes();
                    scriptScenes.setScript(script);
                    scriptScenes.setScene(1);
                    scriptScenes.setTitle(requestBody.getName());
                    scriptScenes.setContent(rewrittenScript);
                    scriptScenes.setCreate_time(LocalDateTime.now());
                    scriptScenesRepository.save(scriptScenes);

                    // 直接返回脚本 ID 的 JSON 字符串
                    return Mono.just("{\"message\": \"Rewritten script generated with ID: " + script.getId() + "\"}");
                });
    }

    // translate
    @PostMapping("/translate")
    public Mono<String> translateScript(@RequestBody TranslateRequestDTO requestBody, HttpServletRequest request) {
        // 打印收到的请求体内容
//        System.out.println("Received Translate request body: ");
//        System.out.println("Name: " + requestBody.getName());
//        System.out.println("ContextList: " + requestBody.getContextList());
//        System.out.println("Positive: " + requestBody.getPositive());
//        System.out.println("Negative: " + requestBody.getNegative());
//        System.out.println("ExistingScript: " + requestBody.getExistingScript());
//        System.out.println("Language: " + requestBody.getLanguage());

        HttpSession session = request.getSession();
        Long userId = (Long) session.getAttribute("userId");

        // 如果 userId 为空，返回未授权的响应
        if (userId == null) {
            return Mono.just("{\"message\": \"User not authorized.\"}");
        }

        return scriptGeneration.translateScript(requestBody.getName(), requestBody.getContextList(),
                        requestBody.getPositive(), requestBody.getNegative(), requestBody.getExistingScript(), requestBody.getLanguage())
                .flatMap(translatedScript -> {
                    Script script = new Script();
                    script.setCreator(userId);
//                    script.setCreator(1L); // test
                    script.setName(requestBody.getName());
                    script.setCreateTime(LocalDateTime.now());
                    scriptRepository.save(script);

                    ScriptScenes scriptScenes = new ScriptScenes();
                    scriptScenes.setScript(script);
                    scriptScenes.setScene(1);
                    scriptScenes.setTitle(requestBody.getName());
                    scriptScenes.setContent(translatedScript);
                    scriptScenes.setCreate_time(LocalDateTime.now());
                    scriptScenesRepository.save(scriptScenes);

                    // 直接返回脚本 ID 的 JSON 字符串
                    return Mono.just("{\"message\": \"Translated script generated with ID: " + script.getId() + "\"}");
                });
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
                .map(scene -> new ScriptScenesDTO(scene.getId(), scene.getScene(), scene.getTitle(), scene.getContent())) // 确保传递所有字段
                .collect(Collectors.toList());

        return ResponseEntity.ok(sceneDTOs); // 返回 200 OK 和 DTO 列表
    }

}
