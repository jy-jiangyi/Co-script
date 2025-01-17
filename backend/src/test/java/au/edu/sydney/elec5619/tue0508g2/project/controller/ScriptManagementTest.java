package au.edu.sydney.elec5619.tue0508g2.project.controller;

import au.edu.sydney.elec5619.tue0508g2.project.dto.ScriptSummaryDTO;
import au.edu.sydney.elec5619.tue0508g2.project.repository.ScriptRepository;
import au.edu.sydney.elec5619.tue0508g2.project.repository.ScriptScenesRepository;
import au.edu.sydney.elec5619.tue0508g2.project.utils.ScriptManagement;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import reactor.core.publisher.Mono;
import reactor.test.StepVerifier;

import java.util.*;

import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class ScriptManagementTest {

    @Autowired
    private ScriptRepository scriptRepository;

    @Autowired
    private ScriptScenesRepository scriptScenesRepository;

    @Autowired
    private ScriptManagementController scriptManagementController;

    @Autowired
    private ScriptManagement scriptManagement;

    @Autowired
    private ScriptsController scriptsController;

    @Test
    public void test_getScriptScenesSummaryShort() {
        Long requestBody = 125L;

        Mono<ResponseEntity<String>> result = scriptManagementController.getScriptScenesSummaryShort(requestBody);

        StepVerifier.create(result)
                .expectNextMatches(responseEntity -> {
                    assertTrue(responseEntity.getStatusCode().is2xxSuccessful());

                    String responseBody = responseEntity.getBody();
                    int wordCount = responseBody.split("\\s+").length;

                    assertTrue(wordCount < 30, "Response should contain fewer than 20 words, but found: " + wordCount);
                    return true;
                })
                .verifyComplete();
    }


    @Test
    public void test_getScriptScenesSummaryLong() {
        Long requestBody = 125L;

        Mono<ResponseEntity<String>> result = scriptManagementController.getScriptScenesSummaryShort(requestBody);

        StepVerifier.create(result)
                .expectNextMatches(responseEntity -> {

                    assertTrue(responseEntity.getStatusCode().is2xxSuccessful());

                    String responseBody = responseEntity.getBody();
                    int wordCount = responseBody.split("\\s+").length; // 按空格分割计算单词数

                    assertTrue(wordCount < 500, "Response should contain fewer than 500 words, but found: " + wordCount);
                    return true;
                })
                .verifyComplete();
    }

    @Test
    public void test_findAllScripts() {
        HttpServletRequest request = Mockito.mock(HttpServletRequest.class);
        HttpSession session = Mockito.mock(HttpSession.class);

        Mockito.when(request.getSession()).thenReturn(session);
        Mockito.when(session.getAttribute("userId")).thenReturn(null);

        ResponseEntity<List<ScriptSummaryDTO>> response = scriptManagementController.findAllScripts(request);

        Assertions.assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode(), "状态码应为 401 Unauthorized");
    }

}