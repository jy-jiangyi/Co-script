package au.edu.sydney.elec5619.tue0508g2.project.controller;

import au.edu.sydney.elec5619.tue0508g2.project.entity.ContextReferences;
import au.edu.sydney.elec5619.tue0508g2.project.repository.ContextReferenceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@RequestMapping(path="/contextreferences")
public class ContextReference {

    @Autowired
    private ContextReferenceRepository contextReferenceRepository;

    @GetMapping(path="/all")
    public @ResponseBody Iterable<ContextReferences> getAllContextReferences() {
        return contextReferenceRepository.findAll();
    }
}
