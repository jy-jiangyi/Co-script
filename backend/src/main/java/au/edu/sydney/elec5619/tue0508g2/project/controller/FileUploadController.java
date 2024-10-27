package au.edu.sydney.elec5619.tue0508g2.project.controller;

import au.edu.sydney.elec5619.tue0508g2.project.entity.Script;
import au.edu.sydney.elec5619.tue0508g2.project.entity.ScriptScenes;
import au.edu.sydney.elec5619.tue0508g2.project.repository.ScriptRepository;
import au.edu.sydney.elec5619.tue0508g2.project.repository.ScriptScenesRepository;
import jakarta.annotation.Resource;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/upload")
public class FileUploadController {

    @Resource
    private ScriptRepository scriptRepository;

    @Resource
    private ScriptScenesRepository scriptSceneRepository;

    @PostMapping("/saveFile")
    public ResponseEntity<String> saveFile(@RequestBody Map<String, String> request, HttpSession session) {
        String fileName = request.get("fileName");
        String content = request.get("content");

        // get userid
        Long userId = (Long) session.getAttribute("userId");
        if (userId == null) {
            return ResponseEntity.badRequest().body("Need Login！");
        }

        Script script = new Script();
        script.setName(fileName);
        script.setCreator(userId);
        scriptRepository.save(script);

        ScriptScenes scene = new ScriptScenes();
        scene.setScene(1);
        scene.setContent(content);
        scene.setTitle(fileName);
        scene.setScript(script);
        scriptSceneRepository.save(scene);


        return ResponseEntity.ok("saved successfully！");
    }
}
