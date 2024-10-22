package au.edu.sydney.elec5619.tue0508g2.project.controller;

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
import org.apache.hc.core5.http.HttpEntity;
import org.apache.hc.core5.http.io.entity.EntityUtils;
import org.apache.hc.client5.http.cookie.CookieStore;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.web.client.RestTemplate;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class ContextMvcTests {

    @LocalServerPort
    private int port;

    private static final Logger logger = LoggerFactory.getLogger(ContextMvcTests.class);

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

    @Test
    public void contextCreateFetchUpdateDelete() {
        RestTemplate restTemplate = getRestTemplate();
        // login first
        ObjectMapper objectMapper = new ObjectMapper();
        ObjectNode loginNode = objectMapper.createObjectNode();
        loginNode.put("username", "admin");
        assertEquals("{\"username\":\"admin\"}", loginNode.toString());
        loginNode.removeAll();
        loginNode.put("email", "test1@gmail.com");
        loginNode.put("password_hash", "123");
        String response = restTemplate.postForObject(path("/users/login"), loginNode, String.class);
        assertEquals("test1", response);
        response = restTemplate.getForObject(path("/users/name"), String.class);
        assertEquals("test1", response);
    }

}
