package au.edu.sydney.elec5619.tue0508g2.project.repository;

import au.edu.sydney.elec5619.tue0508g2.project.entity.ScriptScenes;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface ScriptScenesRepository extends CrudRepository<ScriptScenes, Long> {
    List<ScriptScenes> findByScriptId(Long scriptId);
}
