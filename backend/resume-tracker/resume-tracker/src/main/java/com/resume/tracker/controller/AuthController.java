// package com.resume.tracker.controller;

// import com.resume.tracker.dto.LoginRequest;
// import com.resume.tracker.dto.LoginResponse;
// import com.resume.tracker.dto.RegisterRequest;
// import com.resume.tracker.service.UserService;

// import org.springframework.http.ResponseEntity;
// import org.springframework.web.bind.annotation.*;

// @RestController
// @RequestMapping("/api/auth")
// public class AuthController {

//     private final UserService userService;

//     public AuthController(UserService userService) {
//         this.userService = userService;
//     }

//     @PostMapping("/register")
//     public ResponseEntity<String> register(
//             @RequestBody RegisterRequest request) {

//         userService.register(request);

//         return ResponseEntity.ok(
//                 "User registered successfully"
//         );
//     }

//     @PostMapping("/login")
//     public LoginResponse login(
//             @RequestBody LoginRequest request) {

//         String token = userService.login(
//                 request.getUsername(),
//                 request.getPassword()
//         );

//         return new LoginResponse(token);
//     }
// }










package com.resume.tracker.controller;

import com.resume.tracker.dto.LoginRequest;
import com.resume.tracker.dto.LoginResponse;
import com.resume.tracker.dto.RegisterRequest;
import com.resume.tracker.service.UserService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(
            @RequestBody RegisterRequest request) {

        userService.register(request);

        return ResponseEntity.ok(
                "User registered successfully"
        );
    }

    @PostMapping("/login")
    public LoginResponse login(
            @RequestBody LoginRequest request) {

        String token = userService.login(
                request.getEmail(),
                request.getPassword()
        );

        return new LoginResponse(token);
    }
}