package au.edu.sydney.elec5619.tue0508g2.project.utils;

import au.edu.sydney.elec5619.tue0508g2.project.ai.AIGeminiImpl;
import au.edu.sydney.elec5619.tue0508g2.project.controller.ScriptManagementController;
import au.edu.sydney.elec5619.tue0508g2.project.dto.ScriptSummaryDTO;
import au.edu.sydney.elec5619.tue0508g2.project.entity.Script;
import au.edu.sydney.elec5619.tue0508g2.project.entity.ScriptScenes;
import au.edu.sydney.elec5619.tue0508g2.project.entity.request.AITestRequestBody;
import au.edu.sydney.elec5619.tue0508g2.project.repository.ScriptRepository;
import au.edu.sydney.elec5619.tue0508g2.project.repository.ScriptScenesRepository;
import au.edu.sydney.elec5619.tue0508g2.project.repository.UsersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.io.*;
import java.util.Arrays;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;
import reactor.core.publisher.Flux;

@Service
public class ScriptManagement {

    private final ScriptScenesRepository scriptScenesRepository;
    private final ScriptRepository scriptRepository;
    private final AIGeminiImpl aiGemini;
    private final UsersRepository usersRepository;

    @Autowired
    public ScriptManagement(ScriptScenesRepository scriptScenesRepository, ScriptRepository scriptRepository, AIGeminiImpl aiGemini, UsersRepository usersRepository) {
        this.scriptScenesRepository = scriptScenesRepository;
        this.scriptRepository = scriptRepository;
        this.aiGemini = aiGemini;
        this.usersRepository = usersRepository;
    }

//    get content by script id as file
    public Mono<File> getScriptScenesContentAsFile(Long scriptId) {
        return Mono.fromCallable(() -> {

            List<ScriptScenes> scriptScenes = scriptScenesRepository.findByScriptId(scriptId);

            StringBuilder contentBuilder = new StringBuilder();
            for (ScriptScenes scene : scriptScenes) {
                contentBuilder.append(scene.getContent()).append("\n");
            }

            File file = new File("script_scenes_content.txt");
            try (BufferedWriter writer = new BufferedWriter(new FileWriter(file))) {
                writer.write(contentBuilder.toString());
            }

            return file;
        });
    }

    // trans file to string
    public Mono<String> getScriptScenesContentAsString(Long scriptId) {
        return getScriptScenesContentAsFile(scriptId)
                .flatMap(file -> {
                    return Mono.fromCallable(() -> {
                        try {
                            return readFileToString(file);
                        } catch (IOException e) {
                            throw new RuntimeException("Failed to read file content", e);
                        }
                    });
                });
    }

    // assist trans file to string
    private String readFileToString(File file) throws IOException {
        StringBuilder stringBuilder = new StringBuilder();
        try (BufferedReader reader = new BufferedReader(new FileReader(file))) {
            String line;
            while ((line = reader.readLine()) != null) {
                stringBuilder.append(line).append("\n");
            }
        }
        return stringBuilder.toString();
    }



    public Mono<List<Long>> findSimilarScripts(Long userId, String text) {
        return Mono.fromCallable(() -> usersRepository.findById(userId)
                        .orElseThrow(() -> new RuntimeException("User not found")))
                .flatMapMany(user -> Flux.fromIterable(scriptRepository.findByCreator(userId))) // 将List转换为Flux
                .flatMap(script -> {
                    Long scriptId = script.getId(); // 获取script ID
                    return getScriptScenesContentAsString(scriptId)
                            .map(content -> new ScriptContent(scriptId, content)); // 创建ScriptContent对象
                })
                .collectList()
                .flatMap(scriptContents -> {

                    String combinedText = combineTextWithScripts(text, scriptContents);

                    return callAIForMultipleMatches(combinedText);
                });
    }

    private String combineTextWithScripts(String text, List<ScriptContent> scriptContents) {
        StringBuilder combinedText = new StringBuilder("Input Text: ");
        combinedText.append(text).append("\n");

        for (ScriptContent scriptContent : scriptContents) {
            combinedText.append("Script ID: ").append(scriptContent.getScriptId()).append("\n");
            combinedText.append("Content: ").append(scriptContent.getContent()).append("\n");
        }

        return combinedText.toString();
    }

    private Mono<List<Long>> callAIForMultipleMatches(String combinedText) {
        String prompt = "Compare the following script contents with the provided text and return the IDs of all similar scripts.\n" + combinedText;

        AITestRequestBody requestBody = new AITestRequestBody();
        requestBody.setPromot(prompt);

        return aiGemini.textGeneration(requestBody)
                .flatMap(response -> {
                    try {
                        List<Long> matchedScriptIds = parseMatchedScriptIds(response);
                        return Mono.just(matchedScriptIds);
                    } catch (Exception e) {
                        return Mono.error(new RuntimeException("Failed to parse AI response: " + response));
                    }
                });
    }

    private List<Long> parseMatchedScriptIds(String response) {
        return Arrays.stream(response.split(","))
                .map(Long::parseLong)
                .collect(Collectors.toList());
    }

    private static class ScriptContent {
        private final Long scriptId;
        private final String content;

        public ScriptContent(Long scriptId, String content) {
            this.scriptId = scriptId;
            this.content = content;
        }

        public Long getScriptId() {
            return scriptId;
        }

        public String getContent() {
            return content;
        }
    }

    public List<ScriptSummaryDTO> findAllScriptsByUserId(Long userId) {
        List<Script> scripts = scriptRepository.findByCreator(userId);

        return scripts.stream().map(script -> {
            Mono<ResponseEntity<String>> summaryMono = getScriptScenesContentAsString(script.getId())
                    .flatMap(this::summaryShort)
                    .map(ResponseEntity::ok)
                    .onErrorResume(e -> Mono.just(ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                            .body("Error: " + e.getMessage())));

            ResponseEntity<String> summaryResponse = summaryMono.block();
            String summary = (summaryResponse != null && summaryResponse.getBody() != null)
                    ? summaryResponse.getBody()
                    : "Error generating summary";

            return new ScriptSummaryDTO(script.getId(), script.getName(), summary);
        }).collect(Collectors.toList());
    }


    private Mono<String> summaryShort(String text) {
        String prompt = "Please summarize the provided text to less than 20 words: " + text;
//        System.out.println("Generated Prompt: " + prompt);

        AITestRequestBody requestBody = new AITestRequestBody();
        requestBody.setPromot(prompt);

        return aiGemini.textGeneration(requestBody)
                .doOnNext(response -> System.out.println("AI Response: " + response))
                .onErrorResume(e -> {
                    System.err.println("Error in summaryShort: " + e.getMessage());
                    return Mono.just("Error in summary generation");
                });
    }
}