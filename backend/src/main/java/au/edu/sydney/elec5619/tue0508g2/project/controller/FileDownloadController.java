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

//    @GetMapping("/download/{scriptId}")
//    public ResponseEntity<InputStreamResource> downloadScript(
//            @PathVariable Long scriptId, @RequestParam("format") int format) {
//
//        // 打印接收到的参数
//        System.out.println("New download function called!");
//        System.out.println("Received scriptId: " + scriptId);
//        System.out.println("Received format: " + format);
//
//        // 返回简单的响应以测试
//        return ResponseEntity.status(HttpStatus.OK)
//                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"test.txt\"")
//                .contentType(MediaType.TEXT_PLAIN)
//                .body(new InputStreamResource(new ByteArrayInputStream("This is a test.".getBytes())));
//    }
    @Resource
    private ScriptScenesRepository scriptSceneRepository; // 注入 ScriptSceneRepository

    @GetMapping("/download/{scriptId}")
    public ResponseEntity<InputStreamResource> downloadScript(@PathVariable Long scriptId, @RequestParam int format) {

        // 从数据库获取指定 scriptId 的内容
        String scriptContent = getScriptContentById(scriptId);

        // 根据 scriptId 和格式生成对应的文件数据
        byte[] data = generateFileBasedOnFormat(scriptContent, format);
        String filename = "script." + getExtension(format);

        // 创建 InputStreamResource 来传递文件内容
        InputStreamResource resource = new InputStreamResource(new ByteArrayInputStream(data));

        // 返回下载的 ResponseEntity
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .contentType(getMediaType(format))  // 设置正确的 Content-Type
                .contentLength(data.length)  // 设置文件长度
                .body(resource);
    }

    // 获取对应格式的 MediaType
    private MediaType getMediaType(int format) {
        return switch (format) {
            case 1 -> MediaType.APPLICATION_PDF;
            case 2 -> MediaType.IMAGE_JPEG;
            case 3 -> MediaType.TEXT_PLAIN;
            default -> MediaType.APPLICATION_OCTET_STREAM; // 默认二进制流类型
        };
    }

    private byte[] generateFileBasedOnFormat(String scriptContent, int format) {
        try {
            return switch (format) {
                case 1 -> generatePdf(scriptContent); // PDF
                case 2 -> generateJpeg(scriptContent); // JPEG
                case 3 -> generateTxt(scriptContent); // TXT
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

            PDFont font = PDType1Font.HELVETICA; // 使用默认字体
            float fontSize = 12;
            float margin = 25;
            float leading = 1.5f * fontSize; // 设置行距

            float startX = margin;
            float startY = page.getMediaBox().getHeight() - margin;
            float maxWidth = page.getMediaBox().getWidth() - 2 * margin;

            try (PDPageContentStream contentStream = new PDPageContentStream(document, page)) {
                contentStream.setFont(font, fontSize);
                contentStream.beginText();
                contentStream.newLineAtOffset(startX, startY);

                // 分割文本并处理自动换行
                String[] lines = content.split("\n"); // 按行分割
                for (String line : lines) {
                    while (line.length() > 0) {
                        int breakIndex = findBreakIndex(font, line, fontSize, maxWidth);
                        String subLine = line.substring(0, breakIndex);
                        contentStream.showText(subLine); // 显示文本
                        contentStream.newLineAtOffset(0, -leading); // 换行

                        // 处理剩余部分
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

    // 计算在给定宽度内的换行位置
    private int findBreakIndex(PDFont font, String text, float fontSize, float maxWidth) throws IOException {
        int length = text.length();
        for (int i = 0; i < length; i++) {
            String subString = text.substring(0, i + 1);
            float width = font.getStringWidth(subString) / 1000 * fontSize;
            if (width > maxWidth) {
                return i; // 返回换行位置
            }
        }
        return length;
    }


    // JPEG生成
    private byte[] generateJpeg(String scriptContent) throws IOException {
        BufferedImage image = new BufferedImage(800, 600, BufferedImage.TYPE_INT_RGB);
        Graphics2D g2d = image.createGraphics();
        g2d.setColor(Color.WHITE);
        g2d.fillRect(0, 0, 800, 600);
        g2d.setColor(Color.BLACK);

        g2d.drawString(scriptContent, 50, 100);  // 只在图像上绘制前几行
        g2d.dispose();

        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        ImageIO.write(image, "jpeg", outputStream);
        return outputStream.toByteArray();
    }

    // TXT生成
    private byte[] generateTxt(String scriptContent) {
        return scriptContent.getBytes(StandardCharsets.UTF_8);  // 确保使用UTF-8编码
    }

    private String getScriptContentById(Long scriptId) {
        // 查询 ScriptScene 表中所有对应 scriptId 的场景
        List<ScriptScenes> scenes = scriptSceneRepository.findByScriptId(scriptId);

        // 如果没有找到对应的场景
        if (scenes.isEmpty()) {
            return "未找到指定 scriptId 为 " + scriptId + " 的脚本内容。";
        }

        // 将所有场景内容合并为一个完整的字符串
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