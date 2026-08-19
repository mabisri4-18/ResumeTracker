package com.resume.tracker.controller;

import com.resume.tracker.service.SupabaseStorageService;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/supabase")
public class SupabaseTestController {

    private final SupabaseStorageService supabaseStorageService;

    public SupabaseTestController(
            SupabaseStorageService supabaseStorageService) {

        this.supabaseStorageService =
                supabaseStorageService;
    }

    @GetMapping("/test")
    public String test() {

        if (!supabaseStorageService.isConfigured()) {

            return "Supabase is NOT configured";
        }

        boolean connected =
                supabaseStorageService
                        .testBucketConnection();

        if (connected) {

            return "Supabase bucket connection SUCCESS: "
                    + supabaseStorageService.getBucket();
        }

        return "Supabase bucket connection FAILED";
    }
}