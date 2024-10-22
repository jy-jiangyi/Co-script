package au.edu.sydney.elec5619.tue0508g2.project.controller;

import au.edu.sydney.elec5619.tue0508g2.project.entity.ScriptsRelations;
import au.edu.sydney.elec5619.tue0508g2.project.repository.ScriptsRelationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@RequestMapping(path="/scriptsrelations")
public class ScriptsRelationController {

    @Autowired
    private ScriptsRelationRepository scriptsRelationRepository;

    @GetMapping(path="/all")
    public @ResponseBody Iterable<ScriptsRelations> getAllScriptsRelations() {
        return scriptsRelationRepository.findAll();
    }
}
