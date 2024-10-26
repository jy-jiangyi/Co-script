package au.edu.sydney.elec5619.tue0508g2.project.dto;

import org.springframework.http.ResponseEntity;
import reactor.core.publisher.Mono;

public class ScriptSummaryDTO {
    private Long id;
    private String name;
    private String summary;

    // 正确的构造函数
    public ScriptSummaryDTO(Long id, String name, String summary) {
        this.id = id;
        this.name = name;
        this.summary = summary;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSummary() {
        return summary;
    }

    public void setSummary(String summary) {
        this.summary = summary;
    }
}
