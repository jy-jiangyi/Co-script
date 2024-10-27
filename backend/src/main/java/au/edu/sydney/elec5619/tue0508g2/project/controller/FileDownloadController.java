package au.edu.sydney.elec5619.tue0508g2.project.controller;

import au.edu.sydney.elec5619.tue0508g2.project.entity.ScriptScenes;
import au.edu.sydney.elec5619.tue0508g2.project.repository.ScriptScenesRepository;
import jakarta.annotation.Resource;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.font.PDType0Font;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.apache.pdfbox.pdmodel.font.PDFont;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Optional;
import java.util.List;

@RestController
@RequestMapping("/download_control")
public class FileDownloadController {

    @Resource
    private ScriptScenesRepository scriptSceneRepository;

    @GetMapping("/download/{scriptId}")
    public ResponseEntity<InputStreamResource> downloadScript(@PathVariable Long scriptId, @RequestParam int format) {

        // get content
        String scriptContent = getScriptContentById(scriptId);

        // make file
        byte[] data = generateFileBasedOnFormat(scriptContent, format);
        String filename = "script." + getExtension(format);

        // pass content
        InputStreamResource resource = new InputStreamResource(new ByteArrayInputStream(data));

        // return
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .contentType(getMediaType(format))  // 设置正确的 Content-Type
                .contentLength(data.length)  // 设置文件长度
                .body(resource);
    }

    // get media type
    private MediaType getMediaType(int format) {
        return switch (format) {
            case 1 -> MediaType.APPLICATION_PDF;
            case 2 -> MediaType.IMAGE_JPEG;
            case 3 -> MediaType.TEXT_PLAIN;
            default -> MediaType.APPLICATION_OCTET_STREAM;
        };
    }

    private byte[] generateFileBasedOnFormat(String scriptContent, int format) {
        try {
            return switch (format) {
                case 1 -> generatePdf(scriptContent);
                case 2 -> generateJpeg(scriptContent);
                case 3 -> generateTxt(scriptContent);
                default -> throw new IllegalArgumentException("Unsupported format");
            };
        } catch (IOException e) {
            throw new RuntimeException("Error generating file", e);
        }
    }

    private byte[] generatePdf(String content) throws IOException {
        try (PDDocument document = new PDDocument()) {
            PDPage page = new PDPage();
            document.addPage(page);

            PDFont font = PDType1Font.HELVETICA;
            float fontSize = 12;
            float margin = 25;
            float leading = 1.5f * fontSize;

            float startX = margin;
            float startY = page.getMediaBox().getHeight() - margin;
            float maxWidth = page.getMediaBox().getWidth() - 2 * margin;

            try (PDPageContentStream contentStream = new PDPageContentStream(document, page)) {
                contentStream.setFont(font, fontSize);
                contentStream.beginText();
                contentStream.newLineAtOffset(startX, startY);

                String[] lines = content.split("\n");
                for (String line : lines) {
                    while (line.length() > 0) {
                        int breakIndex = findBreakIndex(font, line, fontSize, maxWidth);
                        String subLine = line.substring(0, breakIndex);
                        contentStream.showText(subLine);
                        contentStream.newLineAtOffset(0, -leading);

                        line = line.substring(breakIndex);
                    }
                }

                contentStream.endText();
            }

            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            document.save(outputStream);
            return outputStream.toByteArray();
        }
    }

//    change line
    private int findBreakIndex(PDFont font, String text, float fontSize, float maxWidth) throws IOException {
        int length = text.length();
        for (int i = 0; i < length; i++) {
            String subString = text.substring(0, i + 1);
            float width = font.getStringWidth(subString) / 1000 * fontSize;
            if (width > maxWidth) {
                return i;
            }
        }
        return length;
    }


    // JPEG
    private byte[] generateJpeg(String scriptContent) throws IOException {
        BufferedImage image = new BufferedImage(800, 600, BufferedImage.TYPE_INT_RGB);
        Graphics2D g2d = image.createGraphics();
        g2d.setColor(Color.WHITE);
        g2d.fillRect(0, 0, 800, 600);
        g2d.setColor(Color.BLACK);

        g2d.drawString(scriptContent, 50, 100);
        g2d.dispose();

        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        ImageIO.write(image, "jpeg", outputStream);
        return outputStream.toByteArray();
    }

    // TXT
    private byte[] generateTxt(String scriptContent) {
        return scriptContent.getBytes(StandardCharsets.UTF_8);
    }

    private String getScriptContentById(Long scriptId) {
        List<ScriptScenes> scenes = scriptSceneRepository.findByScriptId(scriptId);

        // no found
        if (scenes.isEmpty()) {
            return "Can't find the content of script: " + scriptId ;
        }

        // get in one
        StringBuilder contentBuilder = new StringBuilder();
        for (ScriptScenes scene : scenes) {
            contentBuilder.append(scene.getContent()).append("\n");
        }

        return contentBuilder.toString();
    }


    private String getExtension(int format) {
        return switch (format) {
            case 1 -> "pdf";
            case 2 -> "jpeg";
            case 3 -> "txt";
            default -> throw new IllegalArgumentException("Unsupported format");
        };
    }

}