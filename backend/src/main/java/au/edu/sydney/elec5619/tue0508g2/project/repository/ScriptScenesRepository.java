package au.edu.sydney.elec5619.tue0508g2.project.repository;

import au.edu.sydney.elec5619.tue0508g2.project.entity.Script;
import au.edu.sydney.elec5619.tue0508g2.project.entity.ScriptScenes;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface ScriptScenesRepository extends CrudRepository<ScriptScenes, Long> {

    // 已有的方法
    List<ScriptScenes> findByScriptId(Long scriptId);

    // 新添加的方法，根据 Script 对象和 scene 字段查询
    List<ScriptScenes> findByScriptAndSceneLessThanOrderBySceneAsc(Script script, int scene);
}
