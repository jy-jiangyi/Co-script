package au.edu.sydney.elec5619.tue0508g2.project.controller;

import jakarta.annotation.Resource;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;

@RestController
public class FileDownloadController {

    @GetMapping("/download/{scriptId}")
    public ResponseEntity<InputStreamResource> downloadScript(@PathVariable Long scriptId, @RequestParam int format) {
        byte[] data = generateFileBasedOnFormat(scriptId, format);
        String filename = "script." + getExtension(format);

        InputStreamResource resource = new InputStreamResource(new ByteArrayInputStream(data));

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .contentType(getMediaType(format))
                .body(resource);
    }

    private byte[] generateFileBasedOnFormat(Long scriptId, int format) {
        try {
            return switch (format) {
                case 1 -> // PDF
                        generatePdf(scriptId);
                case 2 -> // JPEG
                        generateJpeg(scriptId);
                case 3 -> // TXT
                        generateTxt(scriptId);
                default -> throw new IllegalArgumentException("Unsupported format");
            };
        } catch (IOException e) {
            throw new RuntimeException("Error generating file", e);
        }
    }

    // PDF生成
    private byte[] generatePdf(Long scriptId) throws IOException {
        // 模拟脚本内容
        String content = "This is the content for script ID: " + scriptId;

        try (PDDocument document = new PDDocument()) {
            PDPage page = new PDPage();
            document.addPage(page);

            try (PDPageContentStream contentStream = new PDPageContentStream(document, page)) {
                contentStream.setFont(PDType1Font.HELVETICA, 12);
                contentStream.beginText();
                contentStream.setLeading(14.5f);
                contentStream.newLineAtOffset(25, 750);
                contentStream.showText(content);
                contentStream.endText();
            }

            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            document.save(outputStream);
            return outputStream.toByteArray();
        }
    }

    // JPEG生成
    private byte[] generateJpeg(Long scriptId) throws IOException {
        // 创建一个简单的JPEG图像
        BufferedImage image = new BufferedImage(300, 200, BufferedImage.TYPE_INT_RGB);
        Graphics2D g2d = image.createGraphics();
        g2d.setColor(Color.WHITE);
        g2d.fillRect(0, 0, 300, 200);
        g2d.setColor(Color.BLACK);
        g2d.drawString("Script ID: " + scriptId, 50, 100);
        g2d.dispose();

        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        ImageIO.write(image, "jpeg", outputStream);
        return outputStream.toByteArray();
    }

    // TXT生成
    private byte[] generateTxt(Long scriptId) {
        // 模拟脚本内容
        String content = "This is the content for script ID: " + scriptId;
        return content.getBytes();
    }

    private String getExtension(int format) {
        return switch (format) {
            case 1 -> "pdf";
            case 2 -> "jpeg";
            case 3 -> "txt";
            default -> throw new IllegalArgumentException("Unsupported format");
        };
    }

    private MediaType getMediaType(int format) {
        return switch (format) {
            case 1 -> MediaType.APPLICATION_PDF;
            case 2 -> MediaType.IMAGE_JPEG;
            case 3 -> MediaType.TEXT_PLAIN;
            default -> throw new IllegalArgumentException("Unsupported format");
        };
    }
}