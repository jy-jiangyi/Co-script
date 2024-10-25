package au.edu.sydney.elec5619.tue0508g2.project.controller;
import au.edu.sydney.elec5619.tue0508g2.project.dto.GenerateRequestDTO;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.junit.jupiter.api.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.apache.hc.client5.http.classic.methods.HttpGet;
import org.apache.hc.client5.http.classic.methods.HttpPost;
import org.apache.hc.client5.http.impl.classic.CloseableHttpClient;
import org.apache.hc.client5.http.impl.classic.CloseableHttpResponse;
import org.apache.hc.client5.http.cookie.BasicCookieStore;
import org.apache.hc.client5.http.impl.classic.HttpClients;
import org.apache.hc.core5.http.io.entity.StringEntity;
import org.apache.hc.core5.http.ParseException;

import org.apache.hc.core5.http.io.entity.EntityUtils;
import org.apache.hc.client5.http.cookie.CookieStore;
import org.springframework.http.HttpStatus;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.http.*;
import org.springframework.http.HttpEntity;
import org.springframework.web.client.RestTemplate;

import java.util.Arrays;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class ScriptCreatingMvcTests {
    @LocalServerPort
    private int port;

    private static final Logger logger = LoggerFactory.getLogger(ScriptCreatingMvcTests.class);

    private String path(String uri){
        return "http://localhost:" + port + uri;
    }

    private RestTemplate getRestTemplate(){
        CookieStore cookieStore = new BasicCookieStore();

        // 2. 创建 HttpClient，并配置 CookieStore
        CloseableHttpClient httpClient = HttpClients.custom()
                .setDefaultCookieStore(cookieStore)
                .build();

        // 3. 将 HttpClient 与 RestTemplate 结合
        HttpComponentsClientHttpRequestFactory factory = new HttpComponentsClientHttpRequestFactory(httpClient);
        return new RestTemplate(factory);
    }

    private void login(RestTemplate restTemplate) {
        ObjectMapper objectMapper = new ObjectMapper();
        ObjectNode loginNode = objectMapper.createObjectNode();
        loginNode.put("email", "test1@gmail.com");
        loginNode.put("password_hash", "123");
        String response = restTemplate.postForObject(path("/users/login"), loginNode, String.class);
        assertEquals("test1", response);
        logger.info("成功登录");
    }

    @Test
    public void testGenerateScript_Success() {
        RestTemplate restTemplate = getRestTemplate();

        // 登录步骤
        ObjectMapper objectMapper = new ObjectMapper();
        ObjectNode loginNode = objectMapper.createObjectNode();
        loginNode.put("email", "test1@gmail.com");
        loginNode.put("password_hash", "123");
        String loginResponse = restTemplate.postForObject(path("/users/login"), loginNode, String.class);
        assertEquals("test1", loginResponse);
        logger.info("成功登录");

        // 构建请求 URL
        String url = path("/scripts/generate");

        // 构建请求体
        GenerateRequestDTO requestBody = new GenerateRequestDTO();
        requestBody.setName("Test Script");
        requestBody.setContextList(Arrays.asList("Love", "Peace"));
        requestBody.setPositive("Positive Scenario");
        requestBody.setNegative("Negative Scenario");

        // 设置请求头
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        // 构建 HttpEntity
        HttpEntity<GenerateRequestDTO> entity = new HttpEntity<>(requestBody, headers);

        // 发送 POST 请求
        ResponseEntity<String> response = restTemplate.postForEntity(url, entity, String.class);

        // 验证响应状态码
        assertEquals(HttpStatus.OK, response.getStatusCode());

        // 打印响应内容
        logger.info("Response: {}", response.getBody());

        // 验证响应体包含预期的字段
        assertNotNull(response.getBody());
        assertTrue(response.getBody().contains("\"message\": \"Generated script with ID:"));
    }



}
