package com.resume.tracker.service;

import com.resume.tracker.entity.Resume;
import com.resume.tracker.entity.User;
import com.resume.tracker.repository.ResumeRepository;
import com.resume.tracker.repository.ResumeViewRepository;

import java.time.LocalDateTime;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ResumeService {

    private final ResumeRepository resumeRepository;
    private final ResumeViewRepository resumeViewRepository;
    private final SupabaseStorageService supabaseStorageService;

    public ResumeService(
            ResumeRepository resumeRepository,
            ResumeViewRepository resumeViewRepository,
            SupabaseStorageService supabaseStorageService) {

        this.resumeRepository = resumeRepository;
        this.resumeViewRepository = resumeViewRepository;
        this.supabaseStorageService = supabaseStorageService;
    }

    // =========================================================
    // DELETE RESUME SAFELY
    // =========================================================

    @Transactional
    public void deleteResume(
            Long resumeId,
            User user) {

        // =====================================================
        // 1. FIND RESUME ONLY IF IT BELONGS TO LOGGED-IN USER
        // =====================================================

        Resume resume =
                resumeRepository
                        .findByIdAndUser(
                                resumeId,
                                user
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Resume not found or you do not have permission to delete it."
                                )
                        );

        // =====================================================
        // 2. GET SUPABASE STORAGE PATH
        // =====================================================

        String storagePath =
                resume.getStoragePath();

        // =====================================================
        // 3. DELETE PDF FROM SUPABASE STORAGE
        // =====================================================

        if (storagePath != null
                && !storagePath.isBlank()) {

            supabaseStorageService.deleteFile(
                    storagePath
            );
        }

        // =====================================================
        // 4. DELETE RESUME VIEW / ANALYTICS HISTORY
        // =====================================================

        resumeViewRepository.deleteByResume(
                resume
        );

        // =====================================================
        // 5. DELETE RESUME FROM DATABASE
        // =====================================================

        resumeRepository.delete(
                resume
        );
    }

    public String uploadResume(
        User user,
        MultipartFile file,
        String originalFileName,
        String storagePath,
        String resumeSlug
) throws IOException {

    String uploadedPath =
            supabaseStorageService.uploadFile(
                    file,
                    storagePath
            );

    LocalDateTime now =
            LocalDateTime.now();

    Resume resume =
            new Resume(
                    user,
                    originalFileName,
                    uploadedPath,
                    resumeSlug
            );

    resume.setUploadedAt(now);
    resume.setUpdatedAt(now);

    resumeRepository.save(resume);

    return uploadedPath;
}
}