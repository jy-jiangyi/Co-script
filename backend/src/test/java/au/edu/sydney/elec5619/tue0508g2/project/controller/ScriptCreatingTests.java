package au.edu.sydney.elec5619.tue0508g2.project.controller;

import au.edu.sydney.elec5619.tue0508g2.project.dto.EmulateRequestDTO;
import au.edu.sydney.elec5619.tue0508g2.project.entity.Script;
import au.edu.sydney.elec5619.tue0508g2.project.dto.GenerateRequestDTO;
import au.edu.sydney.elec5619.tue0508g2.project.repository.ScriptRepository;
import au.edu.sydney.elec5619.tue0508g2.project.repository.ScriptScenesRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import reactor.core.publisher.Mono;
import reactor.test.StepVerifier;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.mockito.Mockito;
import java.util.Arrays;

@SpringBootTest
public class ScriptCreatingTests {

    @Autowired
    private ScriptRepository scriptRepository;

    @Autowired
    private ScriptScenesRepository scriptScenesRepository;

    @Autowired
    private ScriptsController scriptsController;

//    @BeforeEach
//    public void setUp() {
//        // 在每次测试之前清空数据库，或者初始化测试数据
//        scriptRepository.deleteAll();
//        scriptScenesRepository.deleteAll();
//    }

    @Test
    public void testGenerateScript_Success() {
        // 创建请求 DTO
        GenerateRequestDTO requestBody = new GenerateRequestDTO();
        requestBody.setName("Test Script");
        requestBody.setContextList(Arrays.asList("Love", "Peace"));
        requestBody.setPositive("Positive Scenario");
        requestBody.setNegative("Negative Scenario");

        // 使用 Mockito 模拟 HttpServletRequest 和 HttpSession
        HttpServletRequest request = Mockito.mock(HttpServletRequest.class);
        HttpSession session = Mockito.mock(HttpSession.class);

        // 模拟 session 中的 userId
        Mockito.when(request.getSession()).thenReturn(session);
        Mockito.when(session.getAttribute("userId")).thenReturn(1L);

        // 调用控制器方法并传递模拟的 HttpServletRequest
        Mono<String> result = scriptsController.generateScript(requestBody, request);

        // 验证返回的响应结构
        StepVerifier.create(result)
                .expectNextMatches(response -> {
                    // 验证返回的 JSON 字符串是否包含 "Generated script with ID: "
                    assertTrue(response.contains("\"message\": \"Generated script with ID: "));
                    return true;
                })
                .verifyComplete();

    }

}
