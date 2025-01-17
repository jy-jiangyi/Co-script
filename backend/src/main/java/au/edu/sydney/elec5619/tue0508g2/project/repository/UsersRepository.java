package au.edu.sydney.elec5619.tue0508g2.project.repository;

import au.edu.sydney.elec5619.tue0508g2.project.entity.Users;
import org.springframework.data.repository.CrudRepository;

public interface UsersRepository extends CrudRepository<Users, Long> {

    // exists emails or not?
    boolean existsByEmail(String email);

    // according to email return users
    Users findByEmail(String email);
}
