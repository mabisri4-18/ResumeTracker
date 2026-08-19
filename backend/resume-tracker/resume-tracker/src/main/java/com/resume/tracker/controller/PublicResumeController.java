package com.resume.tracker.controller;

import com.resume.tracker.entity.Resume;
import com.resume.tracker.repository.ResumeRepository;
import com.resume.tracker.service.ResumeViewService;
import com.resume.tracker.service.SupabaseStorageService;

import jakarta.servlet.http.HttpServletRequest;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.Optional;

@RestController
@RequestMapping("/r")
public class PublicResumeController {

    private final ResumeRepository resumeRepository;
    private final ResumeViewService resumeViewService;
    private final SupabaseStorageService supabaseStorageService;

    public PublicResumeController(
            ResumeRepository resumeRepository,
            ResumeViewService resumeViewService,
            SupabaseStorageService supabaseStorageService) {

        this.resumeRepository = resumeRepository;
        this.resumeViewService = resumeViewService;
        this.supabaseStorageService = supabaseStorageService;
    }

    // =========================================================
    // PUBLIC RESUME
    //
    // Example:
    //
    // http://localhost:8080/r/550e8400-e29b-41d4-a716-446655440000
    //
    // IMPORTANT:
    // The URL uses resumeSlug, NOT username.
    //
    // This allows one user to have multiple public resumes.
    // =========================================================

    @GetMapping("/{resumeSlug}")
    public ResponseEntity<?> viewResume(
            @PathVariable String resumeSlug,
            @RequestHeader(
                    value = "User-Agent",
                    required = false
            ) String userAgent,
            @RequestHeader(
                    value = "Referer",
                    required = false
            ) String referrer,
            HttpServletRequest request) {

        try {

            // =================================================
            // 1. FIND SPECIFIC RESUME
            // =================================================

            Optional<Resume> resumeOptional =
                    resumeRepository.findByResumeSlug(
                            resumeSlug
                    );

            if (resumeOptional.isEmpty()) {

                return ResponseEntity
                        .status(HttpStatus.NOT_FOUND)
                        .body(
                                "Resume not found."
                        );
            }

            Resume resume =
                    resumeOptional.get();

            // =================================================
            // 2. GET VISITOR IP
            // =================================================

            String ipAddress =
                    getClientIpAddress(request);

            // =================================================
            // 3. RECORD VIEW
            //
            // IMPORTANT:
            // The view is attached to THIS resume.
            // =================================================

            resumeViewService.recordView(
                    resume,
                    ipAddress,
                    userAgent,
                    referrer
            );

            // =================================================
            // 4. CREATE SUPABASE SIGNED URL
            // =================================================

            String signedUrl =
                    supabaseStorageService
                            .createSignedUrl(
                                    resume.getStoragePath()
                            );

            // =================================================
            // 5. REDIRECT TO PDF
            // =================================================

            HttpHeaders headers =
                    new HttpHeaders();

            headers.setLocation(
                    URI.create(signedUrl)
            );

            return ResponseEntity
                    .status(HttpStatus.FOUND)
                    .headers(headers)
                    .build();

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity
                    .status(
                            HttpStatus.INTERNAL_SERVER_ERROR
                    )
                    .body(
                            "Unable to open resume: "
                                    + e.getMessage()
                    );
        }
    }

    // =========================================================
    // GET CLIENT IP ADDRESS
    // =========================================================

    private String getClientIpAddress(
            HttpServletRequest request) {

        String ipAddress =
                request.getHeader("X-Forwarded-For");

        if (ipAddress == null
                || ipAddress.isBlank()
                || "unknown".equalsIgnoreCase(ipAddress)) {

            ipAddress =
                    request.getHeader(
                            "Proxy-Client-IP"
                    );
        }

        if (ipAddress == null
                || ipAddress.isBlank()
                || "unknown".equalsIgnoreCase(ipAddress)) {

            ipAddress =
                    request.getHeader(
                            "WL-Proxy-Client-IP"
                    );
        }

        if (ipAddress == null
                || ipAddress.isBlank()
                || "unknown".equalsIgnoreCase(ipAddress)) {

            ipAddress =
                    request.getRemoteAddr();
        }

        // =====================================================
        // X-Forwarded-For can contain multiple IP addresses.
        //
        // Example:
        // 192.168.1.10, 10.0.0.1
        //
        // Take the first address.
        // =====================================================

        if (ipAddress != null
                && ipAddress.contains(",")) {

            ipAddress =
                    ipAddress
                            .split(",")[0]
                            .trim();
        }

        return ipAddress;
    }
}