package com.resume.tracker.controller;

import com.resume.tracker.dto.ResumeViewResponse;
import com.resume.tracker.entity.Resume;
import com.resume.tracker.entity.ResumeView;
import com.resume.tracker.entity.User;
import com.resume.tracker.repository.ResumeRepository;
import com.resume.tracker.repository.UserRepository;
import com.resume.tracker.service.ResumeViewService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final UserRepository userRepository;
    private final ResumeRepository resumeRepository;
    private final ResumeViewService resumeViewService;

    /*
     * ISO-8601 formatter with timezone/offset.
     *
     * Example:
     *
     * 2026-08-20T09:52:09Z
     *
     * or
     *
     * 2026-08-20T15:22:09+05:30
     *
     * The browser can correctly convert this to the user's
     * local timezone.
     */
    private static final DateTimeFormatter VIEWED_AT_FORMATTER =
            DateTimeFormatter.ISO_OFFSET_DATE_TIME;

    public DashboardController(
            UserRepository userRepository,
            ResumeRepository resumeRepository,
            ResumeViewService resumeViewService) {

        this.userRepository = userRepository;
        this.resumeRepository = resumeRepository;
        this.resumeViewService = resumeViewService;
    }

    // =========================================================
    // FORMAT VIEWED TIME WITH TIMEZONE
    // =========================================================

    private String formatViewedAt(
            LocalDateTime viewedAt) {

        if (viewedAt == null) {
            return null;
        }

        /*
         * LocalDateTime.now() is generated using the backend
         * server's timezone.
         *
         * Therefore we attach the same server timezone here.
         *
         * On Render, if the server runs in UTC:
         *
         * 2026-08-20T09:52:09
         *
         * becomes:
         *
         * 2026-08-20T09:52:09Z
         *
         * The React browser will then automatically convert
         * it to the user's local timezone.
         *
         * For India:
         *
         * 09:52 UTC
         *
         * becomes:
         *
         * 15:22 IST
         */
        return viewedAt
                .atZone(ZoneId.systemDefault())
                .format(VIEWED_AT_FORMATTER);
    }


    // =========================================================
    // DASHBOARD
    // =========================================================

    @GetMapping
    public ResponseEntity<?> getDashboard(
            Authentication authentication) {

        try {

            if (authentication == null) {

                return ResponseEntity
                        .status(HttpStatus.UNAUTHORIZED)
                        .body(
                                Map.of(
                                        "error",
                                        "User not authenticated"
                                )
                        );
            }

            String username =
                    authentication.getName();

            User user =
                    userRepository
                            .findByUsername(username)
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "Authenticated user not found"
                                    )
                            );


            // -------------------------------------------------
            // GET ALL RESUMES OF USER
            // -------------------------------------------------

            List<Resume> resumes =
                    resumeRepository.findByUser(user);


            // -------------------------------------------------
            // NO RESUMES
            // -------------------------------------------------

            if (resumes.isEmpty()) {

                Map<String, Object> response =
                        new HashMap<>();

                response.put(
                        "username",
                        user.getUsername()
                );

                response.put(
                        "email",
                        user.getEmail()
                );

                response.put(
                        "hasResume",
                        false
                );

                response.put(
                        "resumeCount",
                        0
                );

                response.put(
                        "totalViews",
                        0
                );

                response.put(
                        "todayViews",
                        0
                );

                response.put(
                        "weekViews",
                        0
                );

                response.put(
                        "monthViews",
                        0
                );

                response.put(
                        "resumes",
                        List.of()
                );

                return ResponseEntity.ok(response);
            }


            // -------------------------------------------------
            // DATE RANGES
            // -------------------------------------------------

            LocalDate today =
                    LocalDate.now();

            LocalDateTime startOfToday =
                    today.atStartOfDay();

            LocalDate startOfWeek =
                    today.with(
                            DayOfWeek.MONDAY
                    );

            LocalDateTime startOfThisWeek =
                    startOfWeek.atStartOfDay();

            LocalDate startOfMonth =
                    today.withDayOfMonth(1);

            LocalDateTime startOfThisMonth =
                    startOfMonth.atStartOfDay();


            // -------------------------------------------------
            // TOTAL ANALYTICS
            // -------------------------------------------------

            long totalViews = 0;
            long todayViews = 0;
            long weekViews = 0;
            long monthViews = 0;


            List<Map<String, Object>> resumeResponses =
                    new ArrayList<>();


            // -------------------------------------------------
            // PROCESS EACH RESUME
            // -------------------------------------------------

            for (Resume resume : resumes) {

                long resumeTotalViews =
                        resumeViewService.getViewCount(
                                resume
                        );

                long resumeTodayViews =
                        resumeViewService.getViewCountSince(
                                resume,
                                startOfToday
                        );

                long resumeWeekViews =
                        resumeViewService.getViewCountSince(
                                resume,
                                startOfThisWeek
                        );

                long resumeMonthViews =
                        resumeViewService.getViewCountSince(
                                resume,
                                startOfThisMonth
                        );


                totalViews += resumeTotalViews;
                todayViews += resumeTodayViews;
                weekViews += resumeWeekViews;
                monthViews += resumeMonthViews;


                // -------------------------------------------------
                // RESUME DATA
                // -------------------------------------------------

                Map<String, Object> resumeData =
                        new HashMap<>();

                resumeData.put(
                        "id",
                        resume.getId()
                );

                resumeData.put(
                        "resumeId",
                        resume.getId()
                );

                resumeData.put(
                        "originalFileName",
                        resume.getOriginalFileName()
                );

                resumeData.put(
                        "resumeSlug",
                        resume.getResumeSlug()
                );

                resumeData.put(
                        "uploadedAt",
                        resume.getUploadedAt()
                );

                resumeData.put(
                        "updatedAt",
                        resume.getUpdatedAt()
                );

                resumeData.put(
                        "totalViews",
                        resumeTotalViews
                );

                resumeData.put(
                        "todayViews",
                        resumeTodayViews
                );

                resumeData.put(
                        "weekViews",
                        resumeWeekViews
                );

                resumeData.put(
                        "monthViews",
                        resumeMonthViews
                );


                // -------------------------------------------------
                // RECENT VIEWS
                // -------------------------------------------------

                List<ResumeView> views =
                        resumeViewService.getViews(
                                resume
                        );


                List<ResumeViewResponse> viewResponses =
                        views.stream()
                                .limit(5)
                                .map(view ->
                                        new ResumeViewResponse(
                                                formatViewedAt(
                                                        view.getViewedAt()
                                                ),
                                                view.getIpAddress(),
                                                view.getUserAgent(),
                                                view.getReferrer()
                                        )
                                )
                                .toList();


                resumeData.put(
                        "views",
                        viewResponses
                );


                resumeResponses.add(
                        resumeData
                );
            }


            // -------------------------------------------------
            // FINAL DASHBOARD RESPONSE
            // -------------------------------------------------

            Map<String, Object> response =
                    new HashMap<>();

            response.put(
                    "username",
                    user.getUsername()
            );

            response.put(
                    "email",
                    user.getEmail()
            );

            response.put(
                    "hasResume",
                    true
            );

            response.put(
                    "resumeCount",
                    resumes.size()
            );


            // -------------------------------------------------
            // OVERALL STATISTICS
            // -------------------------------------------------

            response.put(
                    "totalViews",
                    totalViews
            );

            response.put(
                    "todayViews",
                    todayViews
            );

            response.put(
                    "weekViews",
                    weekViews
            );

            response.put(
                    "monthViews",
                    monthViews
            );


            // -------------------------------------------------
            // ALL RESUMES
            // -------------------------------------------------

            response.put(
                    "resumes",
                    resumeResponses
            );


            return ResponseEntity.ok(response);

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity
                    .status(
                            HttpStatus.INTERNAL_SERVER_ERROR
                    )
                    .body(
                            Map.of(
                                    "error",
                                    "Unable to load dashboard",
                                    "message",
                                    e.getMessage()
                            )
                    );
        }
    }


    // =========================================================
    // GET ALL RESUME VIEWS
    // =========================================================

    @GetMapping("/views")
    public ResponseEntity<?> getDashboardViews(
            Authentication authentication) {

        try {

            if (authentication == null) {

                return ResponseEntity
                        .status(HttpStatus.UNAUTHORIZED)
                        .body(
                                Map.of(
                                        "error",
                                        "User not authenticated"
                                )
                        );
            }


            String username =
                    authentication.getName();


            User user =
                    userRepository
                            .findByUsername(username)
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "User not found"
                                    )
                            );


            List<Resume> resumes =
                    resumeRepository.findByUser(user);


            List<Map<String, Object>> response =
                    new ArrayList<>();


            // -------------------------------------------------
            // GET VIEWS FOR EVERY RESUME
            // -------------------------------------------------

            for (Resume resume : resumes) {

                List<ResumeView> views =
                        resumeViewService.getViews(
                                resume
                        );


                for (ResumeView view : views) {

                    Map<String, Object> viewData =
                            new HashMap<>();


                    viewData.put(
                            "resumeId",
                            resume.getId()
                    );


                    viewData.put(
                            "resumeSlug",
                            resume.getResumeSlug()
                    );


                    viewData.put(
                            "resumeFileName",
                            resume.getOriginalFileName()
                    );


                    /*
                     * IMPORTANT:
                     *
                     * Previously this returned LocalDateTime
                     * without timezone information.
                     *
                     * Now it returns an ISO-8601 timestamp
                     * containing the backend timezone/offset.
                     */
                    viewData.put(
                            "viewedAt",
                            formatViewedAt(
                                    view.getViewedAt()
                            )
                    );


                    viewData.put(
                            "ipAddress",
                            view.getIpAddress()
                    );


                    viewData.put(
                            "userAgent",
                            view.getUserAgent()
                    );


                    viewData.put(
                            "referrer",
                            view.getReferrer()
                    );


                    response.add(viewData);
                }
            }


            return ResponseEntity.ok(response);

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity
                    .status(
                            HttpStatus.INTERNAL_SERVER_ERROR
                    )
                    .body(
                            Map.of(
                                    "error",
                                    "Unable to load resume views",
                                    "message",
                                    e.getMessage()
                            )
                    );
        }
    }


    // =========================================================
    // DASHBOARD STATISTICS
    // =========================================================

    @GetMapping("/stats")
    public ResponseEntity<?> getDashboardStats(
            Authentication authentication) {

        try {

            if (authentication == null) {

                return ResponseEntity
                        .status(HttpStatus.UNAUTHORIZED)
                        .body(
                                Map.of(
                                        "error",
                                        "User not authenticated"
                                )
                        );
            }


            String username =
                    authentication.getName();


            User user =
                    userRepository
                            .findByUsername(username)
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "User not found"
                                    )
                            );


            List<Resume> resumes =
                    resumeRepository.findByUser(user);


            // -------------------------------------------------
            // DATE RANGES
            // -------------------------------------------------

            LocalDate today =
                    LocalDate.now();

            LocalDateTime startOfToday =
                    today.atStartOfDay();

            LocalDate startOfWeek =
                    today.with(
                            DayOfWeek.MONDAY
                    );

            LocalDateTime startOfThisWeek =
                    startOfWeek.atStartOfDay();

            LocalDate startOfMonth =
                    today.withDayOfMonth(1);

            LocalDateTime startOfThisMonth =
                    startOfMonth.atStartOfDay();


            // -------------------------------------------------
            // CALCULATE TOTALS
            // -------------------------------------------------

            long totalViews = 0;
            long todayViews = 0;
            long weekViews = 0;
            long monthViews = 0;


            for (Resume resume : resumes) {

                totalViews +=
                        resumeViewService.getViewCount(
                                resume
                        );

                todayViews +=
                        resumeViewService.getViewCountSince(
                                resume,
                                startOfToday
                        );

                weekViews +=
                        resumeViewService.getViewCountSince(
                                resume,
                                startOfThisWeek
                        );

                monthViews +=
                        resumeViewService.getViewCountSince(
                                resume,
                                startOfThisMonth
                        );
            }


            Map<String, Object> response =
                    new HashMap<>();


            response.put(
                    "totalViews",
                    totalViews
            );

            response.put(
                    "todayViews",
                    todayViews
            );

            response.put(
                    "weekViews",
                    weekViews
            );

            response.put(
                    "monthViews",
                    monthViews
            );

            response.put(
                    "resumeCount",
                    resumes.size()
            );


            return ResponseEntity.ok(response);

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity
                    .status(
                            HttpStatus.INTERNAL_SERVER_ERROR
                    )
                    .body(
                            Map.of(
                                    "error",
                                    "Unable to load dashboard statistics",
                                    "message",
                                    e.getMessage()
                            )
                    );
        }
    }
}