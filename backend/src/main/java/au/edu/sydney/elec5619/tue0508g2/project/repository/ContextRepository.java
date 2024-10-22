package au.edu.sydney.elec5619.tue0508g2.project.repository;

import au.edu.sydney.elec5619.tue0508g2.project.entity.Context;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ContextRepository extends JpaRepository<Context, Long> {

    @Query("SELECT c FROM Context c WHERE c.title LIKE %:key% OR c.description LIKE %:key%")
    Page<Context> findPageByKey(@Param("key") String key, Pageable pageable);

}
