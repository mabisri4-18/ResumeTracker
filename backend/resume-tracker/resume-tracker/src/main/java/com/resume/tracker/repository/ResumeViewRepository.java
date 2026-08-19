package com.resume.tracker.repository;

import com.resume.tracker.entity.Resume;
import com.resume.tracker.entity.ResumeView;

import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface ResumeViewRepository
        extends JpaRepository<ResumeView, Long> {

    // =========================================================
    // GET VIEWS FOR ONE RESUME
    // =========================================================

    List<ResumeView> findByResumeOrderByViewedAtDesc(
            Resume resume
    );

    // =========================================================
    // COUNT VIEWS
    // =========================================================

    long countByResume(
            Resume resume
    );

    // =========================================================
    // COUNT VIEWS SINCE DATE
    // =========================================================

    long countByResumeAndViewedAtGreaterThanEqual(
            Resume resume,
            LocalDateTime startDate
    );

    // =========================================================
    // DUPLICATE VIEW CHECK
    // =========================================================

    Optional<ResumeView>
    findFirstByResumeAndIpAddressAndUserAgentAndViewedAtBetweenOrderByViewedAtDesc(
            Resume resume,
            String ipAddress,
            String userAgent,
            LocalDateTime startTime,
            LocalDateTime endTime
    );

    // =========================================================
    // DELETE ALL VIEWS FOR A RESUME
    // =========================================================

    void deleteByResume(
            Resume resume
    );
}