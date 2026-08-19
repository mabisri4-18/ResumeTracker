package com.resume.tracker.dto;

import java.util.List;

public class DashboardResponse {

    private String username;

    private String resumeSlug;

    private long totalViews;

    private List<ViewResponse> views;

    public DashboardResponse() {
    }

    public DashboardResponse(
            String username,
            String resumeSlug,
            long totalViews,
            List<ViewResponse> views) {

        this.username = username;
        this.resumeSlug = resumeSlug;
        this.totalViews = totalViews;
        this.views = views;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getResumeSlug() {
        return resumeSlug;
    }

    public void setResumeSlug(String resumeSlug) {
        this.resumeSlug = resumeSlug;
    }

    public long getTotalViews() {
        return totalViews;
    }

    public void setTotalViews(long totalViews) {
        this.totalViews = totalViews;
    }

    public List<ViewResponse> getViews() {
        return views;
    }

    public void setViews(List<ViewResponse> views) {
        this.views = views;
    }
}