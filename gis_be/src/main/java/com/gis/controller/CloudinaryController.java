package com.gis.controller;

import com.gis.dto.ApiResponse;
import com.gis.service.CloudinaryService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/uploads")

public class CloudinaryController {
    CloudinaryService cloudinaryService;
    @PostMapping("/image")
    ApiResponse<Object> uploadImage(
            @RequestBody MultipartFile file
    ) throws IOException {
        return ApiResponse.builder()
                .code("upload-s-01")
                .message("User upload image success")
                .data(cloudinaryService.uploadImg(file))
                .build();
    }

    @PostMapping("/images")
    ApiResponse<Object> uploadImages(
            @ModelAttribute("file") List<MultipartFile> files
    ) throws IOException {
        return ApiResponse.builder()
                .code("upload-s-02")
                .message("User upload images success")
                .data(cloudinaryService.uploadMultiImg(files))
                .build();
    }

    @PostMapping("/video")
    ApiResponse<Object> uploadVideos(
            @ModelAttribute("file") MultipartFile file
    ) throws IOException {
        return ApiResponse.builder()
                .code("upload-s-03")
                .message("User upload video success")
                .data(cloudinaryService.uploadMultiVideos(file))
                .build();
    }

    @DeleteMapping("/image")
    ApiResponse<Object> deleteImage(@RequestParam("url") String url) {
        Map<String, Object> deleteResult = cloudinaryService.deleteImg(url);
        if ("ok".equals(deleteResult.get("result"))) {
            return ApiResponse.builder()
                    .code("upload-s-04")
                    .message("Image deleted successfully")
                    .build();
        } else {
            return ApiResponse.builder()
                    .code("upload-e-01")
                    .message("Failed to delete image")
                    .data(deleteResult)
                    .build();
        }
    }
    @DeleteMapping("/video")
    ApiResponse<Object> deleteVideo(@RequestParam("url") String url) {
        Map<String, Object> deleteResult = cloudinaryService.deleteVideo(url);

        if ("ok".equals(deleteResult.get("result"))) {
            return ApiResponse.builder()
                    .code("upload-s-05")
                    .message("Video deleted successfully")
                    .build();
        } else {
            return ApiResponse.builder()
                    .code("upload-e-02")
                    .message("Failed to delete video")
                    .data(deleteResult)
                    .build();
        }
    }
}
