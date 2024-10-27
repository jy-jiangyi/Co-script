package au.edu.sydney.elec5619.tue0508g2.project.controller;

import au.edu.sydney.elec5619.tue0508g2.project.dto.GenerateRequestDTO;
import au.edu.sydney.elec5619.tue0508g2.project.repository.ScriptRepository;
import au.edu.sydney.elec5619.tue0508g2.project.repository.ScriptScenesRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.ResponseEntity;
import reactor.core.publisher.Mono;
import reactor.test.StepVerifier;

import java.util.Arrays;

import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class ScriptManagementTests {

    @Autowired
    private ScriptRepository scriptRepository;

    @Autowired
    private ScriptScenesRepository scriptScenesRepository;

    @Autowired
    private ScriptManagementController scriptManagementController;

    @Autowired
    private ScriptsController scriptsController;

    @Test
    public void test_getScriptScenesSummaryShort() {
        // 模拟请求体
        Long requestBody = 125L;

        // 使用 Mockito 模拟 HttpServletRequest 和 HttpSession
//        HttpServletRequest request = Mockito.mock(HttpServletRequest.class);
//        HttpSession session = Mockito.mock(HttpSession.class);
//
//        // 模拟 session 中的 userId
//        Mockito.when(request.getSession()).thenReturn(session);
//        Mockito.when(session.getAttribute("userId")).thenReturn(3L);

        // 调用控制器方法并传递模拟的 HttpServletRequest
        Mono<ResponseEntity<String>> result = scriptManagementController.getScriptScenesSummaryShort(requestBody);

        // 验证返回的响应结构
        StepVerifier.create(result)
                .expectNextMatches(responseEntity -> {
                    // 验证响应是否为 200 OK
                    assertTrue(responseEntity.getStatusCode().is2xxSuccessful());

                    // 获取响应体并计算单词数
                    String responseBody = responseEntity.getBody();
                    int wordCount = responseBody.split("\\s+").length; // 按空格分割计算单词数

                    // 验证单词数是否小于 20
                    assertTrue(wordCount < 20, "Response should contain fewer than 20 words, but found: " + wordCount);
                    return true;
                })
                .verifyComplete();
    }

    // 使用 Mockito 模拟 HttpServletRequest 和 HttpSession
//        HttpServletRequest request = Mockito.mock(HttpServletRequest.class);
//        HttpSession session = Mockito.mock(HttpSession.class);

    // 模拟 session 中的 userId
//        Mockito.when(request.getSession()).thenReturn(session);
//        Mockito.when(session.getAttribute("userId")).thenReturn(3L);

    // 调用控制器方法并传递模拟的 HttpServletRequest
//        Mono<String> result = scriptManagementController.getScriptScenesSummaryShort(requestBody);

    // 验证返回的响应结构
//        StepVerifier.create(result)
//                .expectNextMatches(response -> {
//                    // 验证返回的 JSON 字符串是否包含 "Generated script with ID: "
//                    assertTrue(response.contains("\"message\": \"Generated script with ID: "));
//                    return true;
//                })
//                .verifyComplete();


//    @Test
//    public void test_getScriptScenesSummaryLong() {}
//
//    @Test
//    public void test_findAllScripts() {}
//
//    @Test
//    public void test_searchScript() {}

}