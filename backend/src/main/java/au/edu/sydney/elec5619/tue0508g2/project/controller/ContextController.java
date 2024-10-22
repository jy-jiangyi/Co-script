package au.edu.sydney.elec5619.tue0508g2.project.controller;

import au.edu.sydney.elec5619.tue0508g2.project.entity.Context;
import au.edu.sydney.elec5619.tue0508g2.project.repository.ContextRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@Controller
@RequestMapping(path="/context")
public class ContextController {

    @Autowired
    private ContextRepository contextRepository;

    @GetMapping(path="/all")
    public @ResponseBody Iterable<Context> getAllContext() {
        return contextRepository.findAll();
    }

    @PostMapping(path="/")
    public @ResponseBody ResponseEntity<String> addContext(@RequestBody Context context, HttpServletRequest request) {
        // replace creator
        HttpSession session = request.getSession();
        Long userId = (Long) session.getAttribute("userId");
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
        context.setCreator(userId);
        contextRepository.save(context);
        return ResponseEntity.status(HttpStatus.CREATED).body(""+context.getId());
    }

    @GetMapping(path="/search")
    public @ResponseBody ResponseEntity<Page<Context>> searchContext(@RequestParam String keyword, @RequestParam Integer offset, @RequestParam Integer amount, HttpServletRequest request) {
        // simulate page request
        int page = offset / amount;
        Pageable pageable = PageRequest.of(page, amount);
        return ResponseEntity.status(HttpStatus.OK).body(contextRepository.findPageByKey(keyword, pageable));
    }

    @GetMapping(path="/{id}")
    public @ResponseBody ResponseEntity<Context> getContext(@PathVariable String id, HttpServletRequest request) {
        Optional<Context> contextOpt = contextRepository.findById(Long.parseLong(id));
        return contextOpt.map(value ->
                    ResponseEntity.status(HttpStatus.OK).body(value))
                .orElseGet(() ->
                    ResponseEntity.status(HttpStatus.NOT_FOUND).body(null));
    }

    @PutMapping(path="/{id}")
    public @ResponseBody ResponseEntity<Context> updateContext(@PathVariable String id, @RequestBody Context contextUpdate, HttpServletRequest request) {
        Optional<Context> contextOpt = contextRepository.findById(Long.parseLong(id));
        if(contextOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
        Context context = contextOpt.get();
        context.setTitle(contextUpdate.getTitle());
        context.setDescription(contextUpdate.getDescription());
        context.setPositive(contextUpdate.getPositive());
        context.setNegative(contextUpdate.getNegative());
        contextRepository.save(context);
        return ResponseEntity.status(HttpStatus.OK).body(context);
    }

    @DeleteMapping(path="/{id}")
    public @ResponseBody ResponseEntity<String> deleteContext(@PathVariable String id, HttpServletRequest request) {
        Long contextId = Long.parseLong(id);
        if(contextRepository.existsById(contextId)) {
            contextRepository.deleteById(contextId);
            return ResponseEntity.status(HttpStatus.OK).body(id);
        }else{
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(id);
        }
    }
}
