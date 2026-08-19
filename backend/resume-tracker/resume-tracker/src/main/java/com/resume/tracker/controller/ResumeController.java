package com.resume.tracker.controller;

import com.resume.tracker.entity.User;
import com.resume.tracker.repository.UserRepository;
import com.resume.tracker.service.ResumeService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/resumes")
public class ResumeController {

    private static final long MAX_FILE_SIZE =
            10 * 1024 * 1024; // 10 MB

    private final UserRepository userRepository;
    private final ResumeService resumeService;

    public ResumeController(
            UserRepository userRepository,
            ResumeService resumeService) {

        this.userRepository = userRepository;
        this.resumeService = resumeService;
    }

    // =========================================================
    // UPLOAD NEW RESUME
    // =========================================================

    @PostMapping("/upload")
    public ResponseEntity<?> uploadResume(
            @RequestParam("file") MultipartFile file,
            Authentication authentication) {

        try {

            // =================================================
            // 1. CHECK LOGIN
            // =================================================

            if (authentication == null
                    || !authentication.isAuthenticated()) {

                return ResponseEntity
                        .status(HttpStatus.UNAUTHORIZED)
                        .body(
                                Map.of(
                                        "success",
                                        false,
                                        "error",
                                        "User not authenticated."
                                )
                        );
            }

            // =================================================
            // 2. CHECK FILE
            // =================================================

            if (file == null || file.isEmpty()) {

                return ResponseEntity
                        .badRequest()
                        .body(
                                Map.of(
                                        "success",
                                        false,
                                        "error",
                                        "Please select a PDF file."
                                )
                        );
            }

            // =================================================
            // 3. CHECK FILE SIZE
            // =================================================

            if (file.getSize() > MAX_FILE_SIZE) {

                return ResponseEntity
                        .status(HttpStatus.PAYLOAD_TOO_LARGE)
                        .body(
                                Map.of(
                                        "success",
                                        false,
                                        "error",
                                        "File size must be less than 10 MB."
                                )
                        );
            }

            // =================================================
            // 4. GET ORIGINAL FILE NAME
            // =================================================

            String originalFileName =
                    file.getOriginalFilename();

            if (originalFileName == null
                    || originalFileName.isBlank()) {

                return ResponseEntity
                        .badRequest()
                        .body(
                                Map.of(
                                        "success",
                                        false,
                                        "error",
                                        "Invalid filename."
                                )
                        );
            }

            // =================================================
            // 5. CHECK PDF
            // =================================================

            if (!originalFileName
                    .toLowerCase()
                    .endsWith(".pdf")) {

                return ResponseEntity
                        .badRequest()
                        .body(
                                Map.of(
                                        "success",
                                        false,
                                        "error",
                                        "Only PDF files are allowed."
                                )
                        );
            }

            // =================================================
            // 6. GET LOGGED-IN USERNAME
            // =================================================

            String username =
                    authentication.getName();

            // =================================================
            // 7. FIND USER
            // =================================================

            User user =
                    userRepository
                            .findByUsername(username)
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "Authenticated user not found."
                                    )
                            );

            // =================================================
            // 8. GENERATE UNIQUE RESUME SLUG
            // =================================================

            String resumeSlug =
                    UUID.randomUUID().toString();

            // =================================================
            // 9. CREATE STORAGE PATH
            // =================================================

            String storagePath =
                    username
                            + "/"
                            + resumeSlug
                            + ".pdf";

            System.out.println();
            System.out.println(
                    "======================================"
            );
            System.out.println(
                    "RESUME UPLOAD REQUEST"
            );
            System.out.println(
                    "USERNAME : " + username
            );
            System.out.println(
                    "FILE     : " + originalFileName
            );
            System.out.println(
                    "SIZE     : " + file.getSize()
            );
            System.out.println(
                    "SLUG     : " + resumeSlug
            );
            System.out.println(
                    "PATH     : " + storagePath
            );
            System.out.println(
                    "======================================"
            );

            // =================================================
            // 10. UPLOAD + SAVE RESUME
            // =================================================

            String uploadedPath =
                    resumeService.uploadResume(
                            user,
                            file,
                            originalFileName,
                            storagePath,
                            resumeSlug
                    );

            // =================================================
            // 11. CREATE RESPONSE
            // =================================================

            Map<String, Object> response =
                    new HashMap<>();

            response.put(
                    "success",
                    true
            );

            response.put(
                    "message",
                    "Resume uploaded successfully."
            );

            response.put(
                    "originalFileName",
                    originalFileName
            );

            response.put(
                    "resumeSlug",
                    resumeSlug
            );

            response.put(
                    "storagePath",
                    uploadedPath
            );

            response.put(
                    "publicUrl",
                    "/r/" + resumeSlug
            );

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(response);

        } catch (RuntimeException e) {

            e.printStackTrace();

            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(
                            Map.of(
                                    "success",
                                    false,
                                    "error",
                                    "Resume upload failed.",
                                    "message",
                                    e.getMessage() != null
                                            ? e.getMessage()
                                            : "Unknown error."
                            )
                    );

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(
                            Map.of(
                                    "success",
                                    false,
                                    "error",
                                    "Unable to upload resume.",
                                    "message",
                                    e.getMessage() != null
                                            ? e.getMessage()
                                            : "Unknown error."
                            )
                    );
        }
    }

    // =========================================================
    // DELETE RESUME
    // =========================================================

    @DeleteMapping("/{resumeId}")
    public ResponseEntity<?> deleteResume(
            @PathVariable Long resumeId,
            Authentication authentication) {

        try {

            // =================================================
            // 1. CHECK LOGIN
            // =================================================

            if (authentication == null
                    || !authentication.isAuthenticated()) {

                return ResponseEntity
                        .status(HttpStatus.UNAUTHORIZED)
                        .body(
                                Map.of(
                                        "success",
                                        false,
                                        "error",
                                        "User not authenticated."
                                )
                        );
            }

            // =================================================
            // 2. GET LOGGED-IN USERNAME
            // =================================================

            String username =
                    authentication.getName();

            // =================================================
            // 3. FIND USER
            // =================================================

            User user =
                    userRepository
                            .findByUsername(username)
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "Authenticated user not found."
                                    )
                            );

            // =================================================
            // 4. DELETE RESUME
            // =================================================

            resumeService.deleteResume(
                    resumeId,
                    user
            );

            // =================================================
            // 5. SUCCESS RESPONSE
            // =================================================

            Map<String, Object> response =
                    new HashMap<>();

            response.put(
                    "success",
                    true
            );

            response.put(
                    "message",
                    "Resume deleted successfully."
            );

            response.put(
                    "resumeId",
                    resumeId
            );

            return ResponseEntity.ok(
                    response
            );

        } catch (RuntimeException e) {

            e.printStackTrace();

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(
                            Map.of(
                                    "success",
                                    false,
                                    "error",
                                    e.getMessage() != null
                                            ? e.getMessage()
                                            : "Resume not found."
                            )
                    );

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity
                    .status(
                            HttpStatus.INTERNAL_SERVER_ERROR
                    )
                    .body(
                            Map.of(
                                    "success",
                                    false,
                                    "error",
                                    "Unable to delete resume.",
                                    "message",
                                    e.getMessage() != null
                                            ? e.getMessage()
                                            : "Unknown error."
                            )
                    );
        }
    }
}