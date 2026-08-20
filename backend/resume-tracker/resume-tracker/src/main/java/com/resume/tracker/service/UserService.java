// package com.resume.tracker.service;

// import com.resume.tracker.dto.RegisterRequest;
// import com.resume.tracker.entity.User;
// import com.resume.tracker.repository.UserRepository;
// import org.springframework.security.crypto.password.PasswordEncoder;
// import org.springframework.stereotype.Service;

// @Service
// public class UserService {

//     private final UserRepository userRepository;
//     private final PasswordEncoder passwordEncoder;
//     private final JwtService jwtService;

//     public UserService(
//         UserRepository userRepository,
//         PasswordEncoder passwordEncoder,
//         JwtService jwtService) {

//     this.userRepository = userRepository;
//     this.passwordEncoder = passwordEncoder;
//     this.jwtService = jwtService;
// }

//     public User register(RegisterRequest request) {

//         if (userRepository.findByUsername(request.getUsername()).isPresent()) {
//             throw new RuntimeException("Username already exists");
//         }

//         if (userRepository.findByEmail(request.getEmail()).isPresent()) {
//             throw new RuntimeException("Email already exists");
//         }

//         String hashedPassword =
//                 passwordEncoder.encode(request.getPassword());

//         User user = new User(
//                 request.getUsername(),
//                 request.getEmail(),
//                 hashedPassword
//         );

//         return userRepository.save(user);
//     }


//     public String login(String username, String password) {

//     User user = userRepository
//             .findByUsername(username)
//             .orElseThrow(() ->
//                     new RuntimeException("Invalid username or password"));

//     if (!passwordEncoder.matches(
//             password,
//             user.getPassword())) {

//         throw new RuntimeException(
//                 "Invalid username or password");
//     }

//     return jwtService.generateToken(user.getUsername());
// }
// }





package com.resume.tracker.service;

import com.resume.tracker.dto.RegisterRequest;
import com.resume.tracker.entity.User;
import com.resume.tracker.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public UserService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    // =========================================================
    // REGISTER
    // =========================================================

    public User register(RegisterRequest request) {

        // Check username
        if (userRepository
                .findByUsername(request.getUsername())
                .isPresent()) {

            throw new RuntimeException(
                    "Username already exists"
            );
        }

        // Check email
        if (userRepository
                .findByEmail(request.getEmail())
                .isPresent()) {

            throw new RuntimeException(
                    "Email already exists"
            );
        }

        // Hash password
        String hashedPassword =
                passwordEncoder.encode(
                        request.getPassword()
                );

        // Create user
        User user = new User(
                request.getUsername(),
                request.getEmail(),
                hashedPassword
        );

        return userRepository.save(user);
    }


    // =========================================================
    // LOGIN USING EMAIL
    // =========================================================

    public String login(
            String email,
            String password) {

        User user = userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Invalid email or password"
                        )
                );

        // Compare entered password with hashed password
        if (!passwordEncoder.matches(
                password,
                user.getPassword())) {

            throw new RuntimeException(
                    "Invalid email or password"
            );
        }

        // IMPORTANT:
        // Keep generating JWT using username.
        // This does NOT mean login uses username.
        // The username is simply stored as the JWT subject.
        return jwtService.generateToken(
                user.getUsername()
        );
    }
}