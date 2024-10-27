package au.edu.sydney.elec5619.tue0508g2.project.controller;

import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.http.HttpStatus;

@ResponseStatus(HttpStatus.UNAUTHORIZED)
public class UnauthException extends RuntimeException{
    public UnauthException(String msg){
        super(msg);
    }
}
