package au.edu.sydney.elec5619.tue0508g2.project.entity.request;

import lombok.Data;

@Data
public class UserLoginRequestBody {

    private String email;

    private String password_hash;

}
