package au.edu.sydney.elec5619.tue0508g2.project.repository;
import au.edu.sydney.elec5619.tue0508g2.project.entity.Script;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

public interface ScriptRepository extends CrudRepository<Script, Long> {

    @Query(value = "SELECT name FROM scripts WHERE id = :id", nativeQuery = true)
    String getScriptNameById(@Param("id") Long id);

    @Query("SELECT s FROM Script s WHERE s.id = :scriptId")
    Script findByScriptId(@Param("scriptId") Long scriptId);
}
