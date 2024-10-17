package au.edu.sydney.elec5619.tue0508g2.project.controller;

import au.edu.sydney.elec5619.tue0508g2.project.utils.ScriptGeneration;
import au.edu.sydney.elec5619.tue0508g2.project.entity.Script;
import au.edu.sydney.elec5619.tue0508g2.project.repository.ScriptRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.util.List;

@RestController
@RequestMapping(path = "/scripts")
public class ScriptsController {

    private final ScriptRepository scriptRepository;
    private final ScriptGeneration scriptGeneration;

    @Autowired
    public ScriptsController(ScriptRepository scriptRepository, ScriptGeneration scriptGeneration) {
        this.scriptRepository = scriptRepository;
        this.scriptGeneration = scriptGeneration;
    }

    // generate
    @PostMapping("/generate")
    public Mono<String> generateScript(@RequestParam String name,
                                       @RequestParam List<String> contextList,
                                       @RequestParam String positive,
                                       @RequestParam String negative) {

        return scriptGeneration.generateScript(name, contextList, positive, negative);
    }

    // emulate
    @PostMapping("/emulate")
    public Mono<String> emulateScript(@RequestParam String name,
                                      @RequestParam List<String> contextList,
                                      @RequestParam String positive,
                                      @RequestParam String negative,
                                      @RequestParam String existingScript) {

        return scriptGeneration.emulateScript(name, contextList, positive, negative, existingScript);
    }

    // rewrite
    @PostMapping("/rewrite")
    public Mono<String> rewriteScript(@RequestParam String name,
                                      @RequestParam List<String> contextList,
                                      @RequestParam String positive,
                                      @RequestParam String negative,
                                      @RequestParam String existingScript) {

        return scriptGeneration.rewriteScript(name, contextList, positive, negative, existingScript);
    }

    // translate
    @PostMapping("/translate")
    public Mono<String> translateScript(@RequestParam String name,
                                        @RequestParam List<String> contextList,
                                        @RequestParam String positive,
                                        @RequestParam String negative,
                                        @RequestParam String existingScript,
                                        @RequestParam String language) {

        return scriptGeneration.translateScript(name, contextList, positive, negative, existingScript, language);
    }

    // save AI生成的Script

    // update 我的Script

}
