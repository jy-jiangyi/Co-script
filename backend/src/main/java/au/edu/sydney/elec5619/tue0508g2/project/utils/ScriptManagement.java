package au.edu.sydney.elec5619.tue0508g2.project.utils;

import au.edu.sydney.elec5619.tue0508g2.project.ai.AIGeminiImpl;
import au.edu.sydney.elec5619.tue0508g2.project.entity.ScriptScenes;
import au.edu.sydney.elec5619.tue0508g2.project.entity.request.AITestRequestBody;
import au.edu.sydney.elec5619.tue0508g2.project.repository.ScriptRepository;
import au.edu.sydney.elec5619.tue0508g2.project.repository.ScriptScenesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.io.*;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ScriptManagement {

    private final ScriptScenesRepository scriptScenesRepository;
    private final ScriptRepository scriptRepository;
    private final AIGeminiImpl aiGemini;

    @Autowired
    public ScriptManagement(ScriptScenesRepository scriptScenesRepository, ScriptRepository scriptRepository, AIGeminiImpl aiGemini) {
        this.scriptScenesRepository = scriptScenesRepository;
        this.scriptRepository = scriptRepository;
        this.aiGemini = aiGemini;
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
                    // 在flatMap中使用Mono.fromCallable来处理文件读取
                    return Mono.fromCallable(() -> {
                        try {
                            return readFileToString(file);
                        } catch (IOException e) {
                            // 将IOException转换为RuntimeException
                            throw new RuntimeException("Failed to read file content", e);
                        }
                    });
                });
    }

//    assist trans file to string
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



    // 通过userId查找对应scripts，并与text进行比对
    public Mono<List<Long>> findSimilarScripts(Long userId, String text) {
        return Mono.fromCallable(() -> scriptRepository.findByCreator(userId))
                .flatMapMany(Flux::fromIterable)  // 将List<Script>转换为Flux<Script>
                .flatMap(script -> {
                    Long scriptId = script.getId();  // 获取script ID
                    return getScriptScenesContentAsString(scriptId)
                            .map(content -> new ScriptContent(scriptId, content)); // 创建ScriptContent对象
                })
                .collectList()
                .flatMap(scriptContents -> {
                    // Step 3: 将text和获取的所有scripts内容组合
                    String combinedText = combineTextWithScripts(text, scriptContents);

                    // Step 4: 调用AI接口进行比对
                    return callAIForMultipleMatches(combinedText);
                });
    }

    // 新增方法：将输入的text与所有scriptContents的内容组合
    private String combineTextWithScripts(String text, List<ScriptContent> scriptContents) {
        StringBuilder combinedText = new StringBuilder("Input Text: ");
        combinedText.append(text).append("\n");

        for (ScriptContent scriptContent : scriptContents) {
            combinedText.append("Script ID: ").append(scriptContent.getScriptId()).append("\n");
            combinedText.append("Content: ").append(scriptContent.getContent()).append("\n");
        }

        return combinedText.toString();
    }

    // 调用AI接口进行多重匹配
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

    // 定义ScriptContent类用于封装脚本ID和内容
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
}