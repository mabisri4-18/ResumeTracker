package com.resume.tracker.service;

import com.resume.tracker.entity.Resume;
import com.resume.tracker.entity.ResumeView;
import com.resume.tracker.repository.ResumeViewRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ResumeViewService {

    private final ResumeViewRepository resumeViewRepository;

    /*
     * Prevent accidental duplicate requests
     * from the same visitor within 5 seconds.
     */
    private static final int DUPLICATE_WINDOW_SECONDS = 5;

    public ResumeViewService(
            ResumeViewRepository resumeViewRepository) {

        this.resumeViewRepository =
                resumeViewRepository;
    }

    // =========================================================
    // RECORD VIEW
    // =========================================================

    public ResumeView recordView(
            Resume resume,
            String ipAddress,
            String userAgent,
            String referrer) {

        LocalDateTime now =
                LocalDateTime.now();

        LocalDateTime startTime =
                now.minusSeconds(
                        DUPLICATE_WINDOW_SECONDS
                );

        Optional<ResumeView> recentView =
                resumeViewRepository
                        .findFirstByResumeAndIpAddressAndUserAgentAndViewedAtBetweenOrderByViewedAtDesc(
                                resume,
                                ipAddress,
                                userAgent,
                                startTime,
                                now
                        );

        // =====================================================
        // DUPLICATE VIEW
        // =====================================================

        if (recentView.isPresent()) {

            System.out.println(
                    "Duplicate resume view ignored. "
                            + "Resume ID: "
                            + resume.getId()
                            + ", IP: "
                            + ipAddress
            );

            return recentView.get();
        }

        // =====================================================
        // CREATE VIEW
        // =====================================================

        ResumeView view =
                new ResumeView();

        view.setResume(resume);
        view.setViewedAt(now);
        view.setIpAddress(ipAddress);
        view.setUserAgent(userAgent);
        view.setReferrer(referrer);

        return resumeViewRepository.save(view);
    }

    // =========================================================
    // GET VIEWS
    // =========================================================

    public List<ResumeView> getViews(
            Resume resume) {

        return resumeViewRepository
                .findByResumeOrderByViewedAtDesc(
                        resume
                );
    }

    // =========================================================
    // TOTAL VIEWS
    // =========================================================

    public long getViewCount(
            Resume resume) {

        return resumeViewRepository
                .countByResume(resume);
    }

    // =========================================================
    // VIEWS SINCE DATE
    // =========================================================

    public long getViewCountSince(
            Resume resume,
            LocalDateTime startDate) {

        return resumeViewRepository
                .countByResumeAndViewedAtGreaterThanEqual(
                        resume,
                        startDate
                );
    }

    // =========================================================
    // DELETE ALL VIEWS FOR RESUME
    // =========================================================

    @Transactional
    public void deleteViewsForResume(
            Resume resume) {

        resumeViewRepository
                .deleteByResume(resume);
    }
}