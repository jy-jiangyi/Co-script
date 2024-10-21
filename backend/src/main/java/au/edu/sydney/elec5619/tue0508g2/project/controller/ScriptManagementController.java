package au.edu.sydney.elec5619.tue0508g2.project.controller;

import au.edu.sydney.elec5619.tue0508g2.project.ai.AIGeminiImpl;
import au.edu.sydney.elec5619.tue0508g2.project.entity.request.AITestRequestBody;
import au.edu.sydney.elec5619.tue0508g2.project.repository.ScriptRepository;
import au.edu.sydney.elec5619.tue0508g2.project.repository.ScriptScenesRepository;

import au.edu.sydney.elec5619.tue0508g2.project.utils.ScriptManagement;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.util.List;

@RestController
@RequestMapping("/api/script_management")

public class ScriptManagementController {

    private final ScriptRepository scriptRepository;
    private final ScriptScenesRepository scriptScenesRepository;
    private final ScriptManagement scriptManagement;
    private final AIGeminiImpl aiGemini;

    @Autowired
    public ScriptManagementController(ScriptRepository scriptRepository, ScriptScenesRepository scriptScenesRepository, ScriptManagement scriptManagement, AIGeminiImpl aiGemini) {
        this.scriptRepository = scriptRepository;
        this.scriptScenesRepository = scriptScenesRepository;
        this.scriptManagement = scriptManagement;
        this.aiGemini = aiGemini;
    }

    //get scripts short summary
    @GetMapping("/{scriptId}/scenes/summary")
    public Mono<ResponseEntity<String>> getScriptScenesSummaryShort(@PathVariable Long scriptId) {
        return scriptManagement.getScriptScenesContentAsString(scriptId)
                .flatMap(this::summaryShort)
                .map(ResponseEntity::ok)
                .onErrorResume(e -> {
                    // 在出现错误时返回500状态码
                    return Mono.just(ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                            .body("Error: " + e.getMessage()));
                });
    }

    //get scripts long summary
    @GetMapping("/{scriptId}/scenes/summary")
    public Mono<ResponseEntity<String>> getScriptScenesSummaryLong(@PathVariable Long scriptId) {
        return scriptManagement.getScriptScenesContentAsString(scriptId)
                .flatMap(this::summaryLong)
                .map(ResponseEntity::ok)
                .onErrorResume(e -> {
                    // 在出现错误时返回500状态码
                    return Mono.just(ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                            .body("Error: " + e.getMessage()));
                });
    }

    //get short summary for script management page
    private Mono<String> summaryShort(String text) {
        String prompt = "please summarize the providing text to less than 20 words." + text;

        AITestRequestBody requestBody = new AITestRequestBody();
        requestBody.setPromot(prompt);

        return aiGemini.textGeneration(requestBody);
    }

    //get long summary for scripts
    private Mono<String> summaryLong(String text) {
        String prompt = "please summarize the providing text to less than 500 words." + text;

        AITestRequestBody requestBody = new AITestRequestBody();
        requestBody.setPromot(prompt);

        return aiGemini.textGeneration(requestBody);
    }

    //search scripts
    @PostMapping("/findSimilarScripts")
    public Mono<ResponseEntity<List<Long>>> findSimilarScripts(@RequestParam Long userId, @RequestBody String text) {
        return scriptManagement.findSimilarScripts(userId, text)
                .map(scriptIds -> {
                    if (scriptIds.isEmpty()) {
                        // 如果没有匹配的scriptId，返回204状态码
                        return ResponseEntity.noContent().<List<Long>>build();
                    } else {
                        // 返回匹配的scriptId列表，状态码为200
                        return ResponseEntity.ok(scriptIds);
                    }
                })
                .onErrorResume(e -> {
                    // 处理错误，返回500状态码
                    return Mono.just(ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                            .<List<Long>>body(null));
                });
    }


}
