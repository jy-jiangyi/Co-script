package au.edu.sydney.elec5619.tue0508g2.project.controller;

import au.edu.sydney.elec5619.tue0508g2.project.ai.AIGeminiImpl;
import au.edu.sydney.elec5619.tue0508g2.project.dto.ScriptSummaryDTO;
import au.edu.sydney.elec5619.tue0508g2.project.entity.Script;
import au.edu.sydney.elec5619.tue0508g2.project.entity.request.AITestRequestBody;
import au.edu.sydney.elec5619.tue0508g2.project.repository.ScriptRepository;
import au.edu.sydney.elec5619.tue0508g2.project.repository.ScriptScenesRepository;

import au.edu.sydney.elec5619.tue0508g2.project.utils.ScriptManagement;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.nio.file.FileStore;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

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

    // short summary
    @GetMapping("/{scriptId}/scenes/summary/short")
    public Mono<ResponseEntity<String>> getScriptScenesSummaryShort(@PathVariable Long scriptId) {
        return scriptManagement.getScriptScenesContentAsString(scriptId)
                .flatMap(this::summaryShort)
                .map(ResponseEntity::ok)
                .onErrorResume(e -> {
                    return Mono.just(ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                            .body("Error: " + e.getMessage()));
                });
    }

    //long summary
    @GetMapping("/scripts/{scriptId}/scenes/summary/long")
    public Mono<ResponseEntity<String>> getScriptScenesSummaryLong(@PathVariable Long scriptId) {
//        test
//        scriptId=1L;
        return scriptManagement.getScriptScenesContentAsString(scriptId)
                .flatMap(this::summaryLong)
                .map(ResponseEntity::ok)
                .onErrorResume(e -> {
                    return Mono.just(ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                            .body("Error: " + e.getMessage()));
                });
    }


    private Mono<String> summaryShort(String text) {
        String prompt = "Please summarize the provided text to less than 20 words: " + text;

        AITestRequestBody requestBody = new AITestRequestBody();
        requestBody.setPromot(prompt);

        return aiGemini.textGeneration(requestBody);
    }

    private Mono<String> summaryLong(String text) {
        String prompt = "Please summarize the provided text to less than 500 words: " + text;

        AITestRequestBody requestBody = new AITestRequestBody();
        requestBody.setPromot(prompt);

        return aiGemini.textGeneration(requestBody);
    }

    // get scripts by user id
    @PostMapping("/findAllScripts")
    public ResponseEntity<List<ScriptSummaryDTO>> findAllScripts(HttpServletRequest request) {
        HttpSession session = request.getSession();
        Long userId = (Long) session.getAttribute("userId");
//        System.out.println("userId: " + userId);
//        userId=1L;

        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        List<ScriptSummaryDTO> scripts = scriptManagement.findAllScriptsByUserId(userId);
        return ResponseEntity.ok(scripts);
    }

    @PostMapping("/search")
    public ResponseEntity<List<Long>> searchScript(@RequestBody Map<String, String> request, HttpSession session) {
        String text = request.get("text");

        Long userId = (Long) session.getAttribute("userId");

        if (userId == null) {
            return ResponseEntity.status(401).body(null);
        }

        System.out.println("Received search text: " + text);
        System.out.println("User ID: " + userId);

        List<Script> scripts = scriptRepository.findByCreatorAndNameContaining(userId, text);

        List<Long> scriptIds = scripts.stream()
                .map(Script::getId)
                .collect(Collectors.toList());

        System.out.println("Found script IDs: " + scriptIds);

        return ResponseEntity.ok(scriptIds);
    }


}