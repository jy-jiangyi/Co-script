package au.edu.sydney.elec5619.tue0508g2.project.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
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
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.RestTemplate;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class ContextMvcTests {

    @LocalServerPort
    private int port;

    @Autowired
    private MvcTools mvcTools;

    private static final Logger logger = LoggerFactory.getLogger(ContextMvcTests.class);

    private RestTemplate restTemplate;

    @BeforeEach
    public void env_init(){
        mvcTools.setPort(port);
        restTemplate = mvcTools.getRestTemplate();
    }

    @Test
    public void contextCreateAndDelete() {
        mvcTools.login(restTemplate);
        String result = restTemplate.getForObject(mvcTools.path("/context/all"), String.class);
        assertNotNull(result);
    }

    @Test
    public void contextNonLoginSafetyTest(){
        try {
            ResponseEntity<String> response = restTemplate.getForEntity(mvcTools.path("/context/all"), String.class);
            fail("Not pass context fetch only login");
        }catch(HttpStatusCodeException e){
            assertEquals(HttpStatus.UNAUTHORIZED.value(), e.getStatusCode().value(), "Failed to check status code of unauthed");
        }
    }

}
