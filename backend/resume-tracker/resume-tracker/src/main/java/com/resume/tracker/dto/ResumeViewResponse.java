package com.resume.tracker.dto;

import java.time.LocalDateTime;

public class ResumeViewResponse {

    private LocalDateTime viewedAt;
    private String ipAddress;
    private String userAgent;
    private String referrer;

    public ResumeViewResponse() {
    }

    public ResumeViewResponse(
            LocalDateTime viewedAt,
            String ipAddress,
            String userAgent,
            String referrer) {

        this.viewedAt = viewedAt;
        this.ipAddress = ipAddress;
        this.userAgent = userAgent;
        this.referrer = referrer;
    }

    public LocalDateTime getViewedAt() {
        return viewedAt;
    }

    public void setViewedAt(LocalDateTime viewedAt) {
        this.viewedAt = viewedAt;
    }

    public String getIpAddress() {
        return ipAddress;
    }

    public void setIpAddress(String ipAddress) {
        this.ipAddress = ipAddress;
    }

    public String getUserAgent() {
        return userAgent;
    }

    public void setUserAgent(String userAgent) {
        this.userAgent = userAgent;
    }

    public String getReferrer() {
        return referrer;
    }

    public void setReferrer(String referrer) {
        this.referrer = referrer;
    }
}