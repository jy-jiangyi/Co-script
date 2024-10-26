package au.edu.sydney.elec5619.tue0508g2.project.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class SceneIllustrationGenerationMvcTests {

    @LocalServerPort
    private int port;

    @Autowired
    private MvcTools mvcTools;

    private final ObjectMapper objectMapper = new ObjectMapper();
    private RestTemplate restTemplate;

    @BeforeEach
    public void setup() {
        mvcTools.setPort(port);
        restTemplate = mvcTools.getRestTemplate();
        mvcTools.login(restTemplate); // 登录并设置cookie
    }

    @Test
    public void testGenerateSceneImage() {
        // Assuming you have a valid scene ID in your database
        Long sceneId = 1L;  // Replace with an actual scene ID
        ResponseEntity<String> response = restTemplate.getForEntity(mvcTools.path("/api/scene_illustration_generation/generate_scene_image?sceneId=" + sceneId), String.class);

        assertEquals(200, response.getStatusCodeValue());
        assertNotNull(response.getBody());
        // Further validation based on your response structure
    }

    @Test
    public void testGenerateScriptImages() {
        // Assuming you have a valid script ID in your database
        Long scriptId = 1L;  // Replace with an actual script ID
        ResponseEntity<String[]> response = restTemplate.getForEntity(mvcTools.path("/api/scene_illustration_generation/generate_script_images?scriptId=" + scriptId), String[].class);

        assertEquals(200, response.getStatusCodeValue());
        assertNotNull(response.getBody());
        assertTrue(response.getBody().length > 0);
    }

    @Test
    public void testGetScriptDetails() throws Exception {
        // Assuming you have a valid script ID in your database
        Long scriptId = 1L;  // Replace with an actual script ID
        ResponseEntity<String> response = restTemplate.getForEntity(mvcTools.path("/api/scene_illustration_generation/get_details?scriptId=" + scriptId), String.class);

        assertEquals(200, response.getStatusCodeValue());
        assertNotNull(response.getBody());

        // Parse the JSON response and validate fields
        JsonNode jsonNode = objectMapper.readTree(response.getBody());
        assertNotNull(jsonNode.get("scriptName"));
        assertTrue(jsonNode.get("scenes").isArray());
        assertTrue(jsonNode.get("scenes").size() > 0);
    }
}
