package au.edu.sydney.elec5619.tue0508g2.project.repository;
import au.edu.sydney.elec5619.tue0508g2.project.entity.Script;
import au.edu.sydney.elec5619.tue0508g2.project.entity.Users;
import org.apache.catalina.User;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import reactor.core.publisher.Flux;

import java.util.List;

public interface ScriptRepository extends CrudRepository<Script, Long> {

    @Query(value = "SELECT name FROM scripts WHERE id = :id", nativeQuery = true)
    String getScriptNameById(@Param("id") Long id);

    List<Script> findByCreator(Long creatorId);

    List<Script> findByCreatorAndNameContaining(Long creator, String text);
}
