package com.resume.tracker.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(
    name = "resumes",
    uniqueConstraints = {
        @UniqueConstraint(columnNames = "resume_slug")
    }
)
public class Resume {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /*
     * Many resumes can belong to one user.
     *
     * Example:
     *
     * User: Abisri
     *   ├── Java Resume
     *   ├── React Resume
     *   └── Data Science Resume
     */
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String originalFileName;

    @Column(nullable = false)
    private String storagePath;

    @Column(
        name = "resume_slug",
        nullable = false,
        unique = true
    )
    private String resumeSlug;

    @Column(nullable = false)
    private LocalDateTime uploadedAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    public Resume() {
    }

    public Resume(
            User user,
            String originalFileName,
            String storagePath,
            String resumeSlug
    ) {
        this.user = user;
        this.originalFileName = originalFileName;
        this.storagePath = storagePath;
        this.resumeSlug = resumeSlug;
        this.uploadedAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getOriginalFileName() {
        return originalFileName;
    }

    public void setOriginalFileName(String originalFileName) {
        this.originalFileName = originalFileName;
    }

    public String getStoragePath() {
        return storagePath;
    }

    public void setStoragePath(String storagePath) {
        this.storagePath = storagePath;
    }

    public String getResumeSlug() {
        return resumeSlug;
    }

    public void setResumeSlug(String resumeSlug) {
        this.resumeSlug = resumeSlug;
    }

    public LocalDateTime getUploadedAt() {
        return uploadedAt;
    }

    public void setUploadedAt(LocalDateTime uploadedAt) {
        this.uploadedAt = uploadedAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}