package au.edu.sydney.elec5619.tue0508g2.project.controller;

import au.edu.sydney.elec5619.tue0508g2.project.entity.ScriptScenes;
import au.edu.sydney.elec5619.tue0508g2.project.repository.ScriptScenesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(path="/script_scenes")
public class ScriptScenesController {

    @Autowired
    private ScriptScenesRepository scriptScenesRepository;

    // get all scene in a script_id
    @GetMapping(path="/script/{scriptId}")
    public @ResponseBody List<ScriptScenes> getScenesByScriptId(@PathVariable Long scriptId) {
        return scriptScenesRepository.findByScriptId(scriptId);
    }

    // get specific scene
    @GetMapping(path="/{id}")
    public @ResponseBody ScriptScenes getScriptSceneById(@PathVariable Long id) {
        return scriptScenesRepository.findById(id).orElse(null);
    }

    // add new scene
    @PostMapping(path="/add")
    public @ResponseBody String addNewScriptScene(@RequestBody ScriptScenes scriptScene) {
        scriptScenesRepository.save(scriptScene);
        return "Saved";
    }

    // update scene
    @PutMapping(path="/update/{id}")
    public @ResponseBody String updateScriptScene(@PathVariable Long id, @RequestBody ScriptScenes scriptSceneDetails) {
        ScriptScenes scriptScene = scriptScenesRepository.findById(id).orElse(null);
        if (scriptScene == null) {
            return "ScriptScene not found";
        }
//        scriptScene.setScript_id(scriptSceneDetails.getScript_id());
        scriptScene.setScene(scriptSceneDetails.getScene());
        scriptScene.setContent(scriptSceneDetails.getContent());
        scriptScene.setTitle(scriptSceneDetails.getTitle());
        scriptScenesRepository.save(scriptScene);
        return "Updated";
    }

    // delete scene
    @DeleteMapping(path="/delete/{id}")
    public @ResponseBody String deleteScriptScene(@PathVariable Long id) {
        scriptScenesRepository.deleteById(id);
        return "Deleted";
    }
}
