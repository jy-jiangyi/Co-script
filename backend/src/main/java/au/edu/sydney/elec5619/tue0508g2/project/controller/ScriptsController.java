package au.edu.sydney.elec5619.tue0508g2.project.controller;

import au.edu.sydney.elec5619.tue0508g2.project.entity.ScriptScenes;
import au.edu.sydney.elec5619.tue0508g2.project.repository.ScriptRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import au.edu.sydney.elec5619.tue0508g2.project.entity.Script;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping(path = "/scripts")
public class ScriptsController {

    @Autowired
    private ScriptRepository scriptRepository;

    // get specific scene

    // 调AI生成Script

    // save AI生成的Script

    // update 我的Script

    //return script content
    @GetMapping("/{id}")
    public ResponseEntity<Script> getScriptById(@PathVariable Long id) {
        Optional<Script> scriptOptional = scriptRepository.findById(id);
        if (scriptOptional.isPresent()) {
            return ResponseEntity.ok(scriptOptional.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

}
