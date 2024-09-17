package au.edu.sydney.elec5619.tue0508g2.project.controller;

import au.edu.sydney.elec5619.tue0508g2.project.entity.ScriptScenes;
import au.edu.sydney.elec5619.tue0508g2.project.repository.ScriptRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(path = "/scripts")
public class ScriptsController {

    @Autowired
    private ScriptRepository scriptRepository;

    // 调AI生成Script

    // save AI生成的Script

    // update 我的Script

}
