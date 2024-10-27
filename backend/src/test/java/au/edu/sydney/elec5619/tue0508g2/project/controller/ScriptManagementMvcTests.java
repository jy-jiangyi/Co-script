package au.edu.sydney.elec5619.tue0508g2.project.controller;

import au.edu.sydney.elec5619.tue0508g2.project.dto.ScriptSummaryDTO;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.junit.jupiter.api.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.*;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class ScriptManagementMvcTests {

    @LocalServerPort
    private int port;

    private static final Logger logger = LoggerFactory.getLogger(ScriptManagementMvcTests.class);

    private String path(String uri) {
        return "http://localhost:" + port + uri;
    }

    private RestTemplate getRestTemplate() {
        return new RestTemplate();
    }

    private HttpHeaders login(RestTemplate restTemplate) {
        // 创建登录请求体
        ObjectMapper objectMapper = new ObjectMapper();
        ObjectNode loginNode = objectMapper.createObjectNode();
        loginNode.put("email", "test1@gmail.com");
        loginNode.put("password_hash", "123");

        // 登录路径应为 /users/login
        String loginUrl = path("/users/login");
        ResponseEntity<String> loginResponse = restTemplate.postForEntity(loginUrl, loginNode, String.class);

        // 验证登录是否成功
        assertEquals(HttpStatus.OK, loginResponse.getStatusCode(), "Login should be successful");
        logger.info("成功登录");

        // 设置包含会话的请求头
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Cookie", "userId=1"); // 假设会话中设置了 userId 为 1

        return headers;
    }

    @Test
    public void testGetScriptScenesSummaryShort() {
        RestTemplate restTemplate = getRestTemplate();

        // 登录并获取请求头
        HttpHeaders headers = login(restTemplate);

        // 构建路径
        String url = path("/api/script_management/1/scenes/summary/short");

        // 发送 GET 请求
        ResponseEntity<String> response = restTemplate.exchange(
                url, HttpMethod.GET, new HttpEntity<>(headers), String.class);

        // 验证响应状态码
        assertEquals(HttpStatus.OK, response.getStatusCode());

        // 验证响应体
        String responseBody = response.getBody();
        assertNotNull(responseBody);
        int wordCount = responseBody.split("\\s+").length;
        assertTrue(wordCount < 30, "Response should contain fewer than 30 words, but found: " + wordCount);

        logger.info("Short Summary Response: {}", responseBody);
    }

    @Test
    public void testGetScriptScenesSummaryLong() {
        RestTemplate restTemplate = getRestTemplate();

        // 登录并获取请求头
        HttpHeaders headers = login(restTemplate);

        // 构建路径
        String url = path("/api/script_management/scripts/1/scenes/summary/long");

        // 发送 GET 请求
        ResponseEntity<String> response = restTemplate.exchange(
                url, HttpMethod.GET, new HttpEntity<>(headers), String.class);

        // 验证响应状态码
        assertEquals(HttpStatus.OK, response.getStatusCode());

        // 验证响应体
        String responseBody = response.getBody();
        assertNotNull(responseBody);
        int wordCount = responseBody.split("\\s+").length;
        assertTrue(wordCount < 500, "Response should contain fewer than 500 words, but found: " + wordCount);

        logger.info("Long Summary Response: {}", responseBody);
    }

    @Test
    public void testFindAllScripts_Unauthorized() {
        RestTemplate restTemplate = getRestTemplate();

        // 构建请求 URL
        String url = path("/api/script_management/findAllScripts");

        // 构建请求头
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        // 构建 HttpEntity
        HttpEntity<String> entity = new HttpEntity<>(null, headers);

        try {
            // 发送 POST 请求
            restTemplate.postForEntity(url, entity, String.class);
            fail("Expected HttpClientErrorException to be thrown");
        } catch (HttpClientErrorException ex) {
            // 验证返回状态码是否为 401
            assertEquals(HttpStatus.UNAUTHORIZED, ex.getStatusCode(), "Expected 401 Unauthorized");
            logger.info("Unauthorized Access Test Passed with Status: {}", ex.getStatusCode());
        }
    }
}
