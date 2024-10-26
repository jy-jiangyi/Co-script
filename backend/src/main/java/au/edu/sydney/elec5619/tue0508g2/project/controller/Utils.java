package au.edu.sydney.elec5619.tue0508g2.project.controller;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
public class Utils {

    public Long getLoginUser(HttpServletRequest request){
        HttpSession session = request.getSession();
        Long userId = (Long) session.getAttribute("userId");
        if (userId == null) {
            throw new UnauthException("login required");
        }
        return userId;
    }
}
