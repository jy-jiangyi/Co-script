package au.edu.sydney.elec5619.tue0508g2.project.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class Tools {

    @GetMapping("/about")
    public String about(@RequestParam(value = "group") String group) {
        return "About page: "+group;
    }

}
