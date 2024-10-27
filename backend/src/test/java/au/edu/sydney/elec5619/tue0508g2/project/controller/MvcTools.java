package au.edu.sydney.elec5619.tue0508g2.project.controller;

import org.apache.hc.client5.http.cookie.BasicCookieStore;
import org.apache.hc.client5.http.cookie.CookieStore;
import org.apache.hc.client5.http.impl.classic.CloseableHttpClient;
import org.apache.hc.client5.http.impl.classic.HttpClients;
import org.springframework.boot.test.context.TestComponent;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import static org.junit.jupiter.api.Assertions.*;

@Component
public class MvcTools {

    private final String loginUser = "test1@gmail.com";
    private final String loginPass = "123";

    private int port;

    public void setPort(int port) {
        this.port = port;
    }

    public String path(String uri){
        return "http://localhost:" + port + uri;
    }

    public RestTemplate getRestTemplate(){
        CookieStore cookieStore = new BasicCookieStore();

        // 2. 创建 HttpClient，并配置 CookieStore
        CloseableHttpClient httpClient = HttpClients.custom()
                .setDefaultCookieStore(cookieStore)
                .build();

        // 3. 将 HttpClient 与 RestTemplate 结合
        HttpComponentsClientHttpRequestFactory factory = new HttpComponentsClientHttpRequestFactory(httpClient);
        return new RestTemplate(factory);
    }

    public void login(RestTemplate restTemplate){
        JSONHelper.EasyJSON json = new JSONHelper.EasyJSON();
        json.streamPut("email", loginUser)
                .streamPut("password_hash", loginPass);
        String response = restTemplate.postForObject(
                path("/users/login"),
                json.root, String.class);
        assertEquals("test1", response);
    }

    public String logout(RestTemplate restTemplate){
        String response = restTemplate.getForObject(
                path("/users/logout"), String.class
        );
        return response;
    }

}
