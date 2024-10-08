package au.edu.sydney.elec5619.tue0508g2.project.controller;

import au.edu.sydney.elec5619.tue0508g2.project.entity.Context;
import au.edu.sydney.elec5619.tue0508g2.project.repository.ContextRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@RequestMapping(path="/context")
public class ContextController {

    @Autowired
    private ContextRepository contextRepository;

    @GetMapping(path="/all")
    public @ResponseBody Iterable<Context> getAllContext() {
        return contextRepository.findAll();
    }
}
