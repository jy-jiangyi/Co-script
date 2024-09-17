package au.edu.sydney.elec5619.tue0508g2.project.entity.gemini;

import lombok.Data;
import lombok.RequiredArgsConstructor;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Data
public class TextGenerationRequest {

    private final List<Content> contents = new ArrayList<>();

    public static TextGenerationRequest build_by_parts(String... parts){
        TextGenerationRequest request = new TextGenerationRequest();
        request.contents.add(new Content(
            Arrays.stream(parts)
                    .map(Part::new)
                    .collect(Collectors.toList())
        ));
        return request;
    }

    @Data
    public static class Content {
        private final List<Part> parts;
    }

    @Data
    public static class Part {
        private final String text;
    }
}
