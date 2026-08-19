package com.resume.tracker.repository;

import com.resume.tracker.entity.Resume;
import com.resume.tracker.entity.User;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ResumeRepository
        extends JpaRepository<Resume, Long> {

    // Find a resume using its public slug
    Optional<Resume> findByResumeSlug(String resumeSlug);

    // Get all resumes belonging to a user
    List<Resume> findByUser(User user);

    // Check whether a public slug already exists
    boolean existsByResumeSlug(String resumeSlug);

    // Get the latest uploaded resume for a username
    Optional<Resume> findTopByUserUsernameOrderByUploadedAtDesc(
            String username
    );

    // Find a specific resume only if it belongs to the user
    Optional<Resume> findByIdAndUser(Long id, User user);

    // Check whether a specific resume belongs to a user
    boolean existsByIdAndUser(Long id, User user);
}