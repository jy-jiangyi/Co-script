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
    private ScriptRepository scriptRepository; // 脚本表的仓库

    @Resource
    private ScriptScenesRepository scriptSceneRepository; // 场景表的仓库

    @PostMapping("/saveFile")
    public ResponseEntity<String> saveFile(@RequestBody Map<String, String> request, HttpSession session) {
        String fileName = request.get("fileName"); // 文件名
        String content = request.get("content"); // 文件内容

        // Step 1: 从 HttpSession 中获取 userId
        Long userId = (Long) session.getAttribute("userId");
        if (userId == null) {
            return ResponseEntity.badRequest().body("用户未登录！");
        }

        // Step 2: 在 scripts 表中创建新脚本记录
        Script script = new Script();
        script.setName(fileName);
        script.setCreator(userId); // 设置创建者ID
        scriptRepository.save(script); // 保存脚本记录

        // Step 3: 在 script_scenes 表中创建对应的场景记录
        ScriptScenes scene = new ScriptScenes();
        scene.setScene(1); // 场次设置为1
        scene.setContent(content); // 场景内容为上传的文件内容
        scene.setTitle(fileName); // 标题为上传的文件名
        scene.setScript(script); // 关联 Script 对象
        scriptSceneRepository.save(scene); // 保存场景记录


        return ResponseEntity.ok("文件内容和脚本已成功保存！");
    }
}
