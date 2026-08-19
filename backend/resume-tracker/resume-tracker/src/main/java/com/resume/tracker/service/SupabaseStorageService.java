// package com.resume.tracker.service;

// import org.springframework.beans.factory.annotation.Value;
// import org.springframework.http.HttpHeaders;
// import org.springframework.http.HttpStatusCode;
// import org.springframework.http.MediaType;
// import org.springframework.stereotype.Service;
// import org.springframework.web.client.RestClient;
// import org.springframework.web.multipart.MultipartFile;

// import java.io.IOException;
// import java.nio.charset.StandardCharsets;

// @Service
// public class SupabaseStorageService {

//     @Value("${supabase.url}")
//     private String supabaseUrl;

//     @Value("${supabase.service-key}")
//     private String supabaseServiceKey;

//     @Value("${supabase.bucket}")
//     private String bucket;

//     private final RestClient restClient;

//     public SupabaseStorageService() {
//         this.restClient = RestClient.create();
//     }

//     // =========================================================
//     // GET BUCKET
//     // =========================================================

//     public String getBucket() {
//         return bucket;
//     }

//     // =========================================================
//     // CHECK CONFIGURATION
//     // =========================================================

//     public boolean isConfigured() {

//         return supabaseUrl != null
//                 && !supabaseUrl.isBlank()
//                 && supabaseServiceKey != null
//                 && !supabaseServiceKey.isBlank()
//                 && bucket != null
//                 && !bucket.isBlank();
//     }

//     // =========================================================
//     // CLEAN BASE URL
//     // =========================================================

//     private String getBaseUrl() {

//         String baseUrl = supabaseUrl.trim();

//         while (baseUrl.endsWith("/")) {
//             baseUrl = baseUrl.substring(
//                     0,
//                     baseUrl.length() - 1
//             );
//         }

//         return baseUrl;
//     }

//     // =========================================================
//     // CLEAN STORAGE PATH
//     // =========================================================

//     private String cleanStoragePath(String storagePath) {

//         if (storagePath == null) {
//             throw new IllegalArgumentException(
//                     "Storage path cannot be null."
//             );
//         }

//         String path = storagePath.trim();

//         while (path.startsWith("/")) {
//             path = path.substring(1);
//         }

//         if (path.isBlank()) {
//             throw new IllegalArgumentException(
//                     "Storage path cannot be empty."
//             );
//         }

//         return path;
//     }

//     // =========================================================
//     // TEST BUCKET CONNECTION
//     // =========================================================

//     public boolean testBucketConnection() {

//         if (!isConfigured()) {

//             System.out.println(
//                     "SUPABASE CONFIGURATION IS INCOMPLETE"
//             );

//             return false;
//         }

//         String url =
//                 getBaseUrl()
//                         + "/storage/v1/bucket/"
//                         + bucket;

//         System.out.println(
//                 "SUPABASE BUCKET TEST URL = " + url
//         );

//         try {

//             restClient.get()
//                     .uri(url)
//                     .header(
//                             "apikey",
//                             supabaseServiceKey
//                     )
//                     .header(
//                             HttpHeaders.AUTHORIZATION,
//                             "Bearer " + supabaseServiceKey
//                     )
//                     .accept(
//                             MediaType.APPLICATION_JSON
//                     )
//                     .retrieve()
//                     .onStatus(
//                             HttpStatusCode::isError,
//                             (request, response) -> {

//                                 String errorBody =
//                                         new String(
//                                                 response.getBody()
//                                                         .readAllBytes(),
//                                                 StandardCharsets.UTF_8
//                                         );

//                                 throw new RuntimeException(
//                                         "Supabase HTTP "
//                                                 + response
//                                                 .getStatusCode()
//                                                 .value()
//                                                 + ": "
//                                                 + errorBody
//                                 );
//                             }
//                     )
//                     .toBodilessEntity();

//             System.out.println(
//                     "SUPABASE BUCKET CONNECTION SUCCESS"
//             );

//             return true;

//         } catch (Exception e) {

//             System.out.println(
//                     "SUPABASE BUCKET CONNECTION FAILED"
//             );

//             System.out.println(
//                     e.getMessage()
//             );

//             return false;
//         }
//     }

//     // =========================================================
//     // UPLOAD PDF
//     // =========================================================

//     public String uploadFile(
//             MultipartFile file,
//             String storagePath
//     ) throws IOException {

//         if (!isConfigured()) {

//             throw new RuntimeException(
//                     "Supabase Storage is not configured."
//             );
//         }

//         if (file == null || file.isEmpty()) {

//             throw new IllegalArgumentException(
//                     "File is empty."
//             );
//         }

//         String cleanPath =
//                 cleanStoragePath(storagePath);

//         String url =
//                 getBaseUrl()
//                         + "/storage/v1/object/"
//                         + bucket
//                         + "/"
//                         + cleanPath;

//         System.out.println();
//         System.out.println(
//                 "======================================"
//         );
//         System.out.println(
//                 "SUPABASE FILE UPLOAD"
//         );
//         System.out.println(
//                 "BASE URL : " + getBaseUrl()
//         );
//         System.out.println(
//                 "BUCKET   : " + bucket
//         );
//         System.out.println(
//                 "PATH     : " + cleanPath
//         );
//         System.out.println(
//                 "FILE     : " + file.getOriginalFilename()
//         );
//         System.out.println(
//                 "SIZE     : " + file.getSize()
//         );
//         System.out.println(
//                 "URL      : " + url
//         );
//         System.out.println(
//                 "======================================"
//         );

//         try {

//             restClient.post()
//                     .uri(url)

//                     .header(
//                             "apikey",
//                             supabaseServiceKey
//                     )

//                     .header(
//                             HttpHeaders.AUTHORIZATION,
//                             "Bearer " + supabaseServiceKey
//                     )

//                     .header(
//                             "x-upsert",
//                             "false"
//                     )

//                     .contentType(
//                             MediaType.APPLICATION_PDF
//                     )

//                     .body(
//                             file.getBytes()
//                     )

//                     .retrieve()

//                     .onStatus(
//                             HttpStatusCode::isError,
//                             (request, response) -> {

//                                 String errorBody =
//                                         new String(
//                                                 response.getBody()
//                                                         .readAllBytes(),
//                                                 StandardCharsets.UTF_8
//                                         );

//                                 throw new RuntimeException(
//                                         "Supabase HTTP "
//                                                 + response
//                                                 .getStatusCode()
//                                                 .value()
//                                                 + ": "
//                                                 + errorBody
//                                 );
//                             }
//                     )

//                     .toBodilessEntity();

//             System.out.println(
//                     "SUPABASE FILE UPLOAD SUCCESS"
//             );

//             return cleanPath;

//         } catch (Exception e) {

//             throw new RuntimeException(
//                     "Supabase file upload failed: "
//                             + e.getMessage(),
//                     e
//             );
//         }
//     }

//     // =========================================================
//     // CREATE SIGNED URL
//     // =========================================================

//     public String createSignedUrl(
//             String storagePath
//     ) {

//         if (!isConfigured()) {

//             throw new RuntimeException(
//                     "Supabase Storage is not configured."
//             );
//         }

//         String cleanPath =
//                 cleanStoragePath(storagePath);

//         String url =
//                 getBaseUrl()
//                         + "/storage/v1/object/sign/"
//                         + bucket
//                         + "/"
//                         + cleanPath;

//         System.out.println();
//         System.out.println(
//                 "======================================"
//         );
//         System.out.println(
//                 "SUPABASE SIGNED URL"
//         );
//         System.out.println(
//                 "URL = " + url
//         );
//         System.out.println(
//                 "PATH = " + cleanPath
//         );
//         System.out.println(
//                 "======================================"
//         );

//         try {

//             String requestBody =
//                     "{\"expiresIn\":3600}";

//             String response =
//                     restClient.post()
//                             .uri(url)

//                             .header(
//                                     "apikey",
//                                     supabaseServiceKey
//                             )

//                             .header(
//                                     HttpHeaders.AUTHORIZATION,
//                                     "Bearer "
//                                             + supabaseServiceKey
//                             )

//                             .contentType(
//                                     MediaType.APPLICATION_JSON
//                             )

//                             .body(requestBody)

//                             .retrieve()

//                             .onStatus(
//                                     HttpStatusCode::isError,
//                                     (request, responseMessage) -> {

//                                         String errorBody =
//                                                 new String(
//                                                         responseMessage
//                                                                 .getBody()
//                                                                 .readAllBytes(),
//                                                         StandardCharsets.UTF_8
//                                                 );

//                                         throw new RuntimeException(
//                                                 "Supabase signed URL failed. HTTP "
//                                                         + responseMessage
//                                                                 .getStatusCode()
//                                                                 .value()
//                                                         + ": "
//                                                         + errorBody
//                                         );
//                                     }
//                             )

//                             .body(String.class);

//             System.out.println(
//                     "SIGNED URL RESPONSE = " + response
//             );

//             if (response == null
//                     || response.isBlank()) {

//                 throw new RuntimeException(
//                         "Supabase returned empty response."
//                 );
//             }

//             /*
//              * Supabase response:
//              *
//              * {
//              *   "signedURL": "/storage/v1/object/sign/..."
//              * }
//              */

//             String marker =
//                     "\"signedURL\":\"";

//             int start =
//                     response.indexOf(marker);

//             if (start == -1) {

//                 throw new RuntimeException(
//                         "signedURL not found in response: "
//                                 + response
//                 );
//             }

//             start += marker.length();

//             int end =
//                     response.indexOf(
//                             "\"",
//                             start
//                     );

//             if (end == -1) {

//                 throw new RuntimeException(
//                         "Invalid signed URL response: "
//                                 + response
//                 );
//             }

//             String signedPath =
//                     response.substring(
//                             start,
//                             end
//                     );

//             String finalUrl;

//           if (signedPath.startsWith("http://")
//         || signedPath.startsWith("https://")) {

//     finalUrl = signedPath;

// } else if (signedPath.startsWith("/storage/v1/")) {

//     finalUrl =
//             getBaseUrl()
//                     + signedPath;

// } else if (signedPath.startsWith("/object/")) {

//     finalUrl =
//             getBaseUrl()
//                     + "/storage/v1"
//                     + signedPath;

// } else {

//     finalUrl =
//             getBaseUrl()
//                     + "/storage/v1/"
//                     + signedPath;
// }
//             System.out.println(
//                     "FINAL SIGNED URL = " + finalUrl
//             );

//             return finalUrl;

//         } catch (Exception e) {

//             throw new RuntimeException(
//                     "Failed to create Supabase signed URL: "
//                             + e.getMessage(),
//                     e
//             );
//         }
//     }
// }





package com.resume.tracker.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.MediaType;
import org.springframework.http.client.JdkClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.http.HttpClient;
import java.nio.charset.StandardCharsets;
import java.time.Duration;

@Service
public class SupabaseStorageService {

    @Value("${supabase.url}")
    private String supabaseUrl;

    @Value("${supabase.service-key}")
    private String supabaseServiceKey;

    @Value("${supabase.bucket}")
    private String bucket;

    private final RestClient restClient;

    // =========================================================
    // CONSTRUCTOR
    // =========================================================

    public SupabaseStorageService() {

        /*
         * Force HTTP/1.1.
         *
         * This avoids connection-reset problems that can sometimes
         * occur while uploading request bodies through the default
         * JDK HTTP client configuration.
         */

        HttpClient httpClient = HttpClient.newBuilder()
                .version(HttpClient.Version.HTTP_1_1)
                .connectTimeout(Duration.ofSeconds(30))
                .build();

        JdkClientHttpRequestFactory requestFactory =
                new JdkClientHttpRequestFactory(httpClient);

        requestFactory.setReadTimeout(
                Duration.ofSeconds(60)
        );

        this.restClient = RestClient.builder()
                .requestFactory(requestFactory)
                .build();
    }

    // =========================================================
    // GET BUCKET
    // =========================================================

    public String getBucket() {
        return bucket;
    }

    // =========================================================
    // CHECK CONFIGURATION
    // =========================================================

    public boolean isConfigured() {

        return supabaseUrl != null
                && !supabaseUrl.isBlank()
                && supabaseServiceKey != null
                && !supabaseServiceKey.isBlank()
                && bucket != null
                && !bucket.isBlank();
    }

    // =========================================================
    // CLEAN BASE URL
    // =========================================================

    private String getBaseUrl() {

        if (supabaseUrl == null
                || supabaseUrl.isBlank()) {

            throw new IllegalStateException(
                    "supabase.url is not configured."
            );
        }

        String baseUrl = supabaseUrl.trim();

        while (baseUrl.endsWith("/")) {

            baseUrl = baseUrl.substring(
                    0,
                    baseUrl.length() - 1
            );
        }

        return baseUrl;
    }

    // =========================================================
    // CLEAN STORAGE PATH
    // =========================================================

    private String cleanStoragePath(
            String storagePath) {

        if (storagePath == null) {

            throw new IllegalArgumentException(
                    "Storage path cannot be null."
            );
        }

        String path = storagePath.trim();

        while (path.startsWith("/")) {

            path = path.substring(1);
        }

        if (path.isBlank()) {

            throw new IllegalArgumentException(
                    "Storage path cannot be empty."
            );
        }

        return path;
    }

    // =========================================================
    // TEST BUCKET CONNECTION
    // =========================================================

    public boolean testBucketConnection() {

        if (!isConfigured()) {

            System.out.println(
                    "SUPABASE CONFIGURATION IS INCOMPLETE"
            );

            return false;
        }

        String url =
                getBaseUrl()
                        + "/storage/v1/bucket/"
                        + bucket;

        System.out.println();
        System.out.println(
                "======================================"
        );
        System.out.println(
                "SUPABASE BUCKET TEST"
        );
        System.out.println(
                "URL = " + url
        );
        System.out.println(
                "======================================"
        );

        try {

            restClient.get()
                    .uri(url)

                    .header(
                            "apikey",
                            supabaseServiceKey
                    )

                    .header(
                            HttpHeaders.AUTHORIZATION,
                            "Bearer "
                                    + supabaseServiceKey
                    )

                    .accept(
                            MediaType.APPLICATION_JSON
                    )

                    .retrieve()

                    .onStatus(
                            HttpStatusCode::isError,
                            (request, response) -> {

                                String errorBody =
                                        new String(
                                                response
                                                        .getBody()
                                                        .readAllBytes(),
                                                StandardCharsets.UTF_8
                                        );

                                throw new RuntimeException(
                                        "Supabase HTTP "
                                                + response
                                                        .getStatusCode()
                                                        .value()
                                                + ": "
                                                + errorBody
                                );
                            }
                    )

                    .toBodilessEntity();

            System.out.println(
                    "SUPABASE BUCKET CONNECTION SUCCESS"
            );

            return true;

        } catch (Exception e) {

            System.out.println(
                    "SUPABASE BUCKET CONNECTION FAILED"
            );

            System.out.println(
                    "ERROR: " + e.getMessage()
            );

            return false;
        }
    }

    // =========================================================
    // UPLOAD FILE
    // =========================================================

    public String uploadFile(
            MultipartFile file,
            String storagePath
    ) throws IOException {

        // -----------------------------------------------------
        // 1. Check configuration
        // -----------------------------------------------------

        if (!isConfigured()) {

            throw new RuntimeException(
                    "Supabase Storage is not configured."
            );
        }

        // -----------------------------------------------------
        // 2. Check file
        // -----------------------------------------------------

        if (file == null || file.isEmpty()) {

            throw new IllegalArgumentException(
                    "File is empty."
            );
        }

        // -----------------------------------------------------
        // 3. Clean storage path
        // -----------------------------------------------------

        String cleanPath =
                cleanStoragePath(storagePath);

        // -----------------------------------------------------
        // 4. Create upload URL
        // -----------------------------------------------------

        String url =
                getBaseUrl()
                        + "/storage/v1/object/"
                        + bucket
                        + "/"
                        + cleanPath;

        // -----------------------------------------------------
        // 5. Read file bytes
        // -----------------------------------------------------

        byte[] fileBytes =
                file.getBytes();

        // -----------------------------------------------------
        // 6. Debug information
        // -----------------------------------------------------

        System.out.println();

        System.out.println(
                "======================================"
        );

        System.out.println(
                "SUPABASE FILE UPLOAD"
        );

        System.out.println(
                "BASE URL : "
                        + getBaseUrl()
        );

        System.out.println(
                "BUCKET   : "
                        + bucket
        );

        System.out.println(
                "PATH     : "
                        + cleanPath
        );

        System.out.println(
                "FILE     : "
                        + file.getOriginalFilename()
        );

        System.out.println(
                "SIZE     : "
                        + fileBytes.length
        );

        System.out.println(
                "URL      : "
                        + url
        );

        System.out.println(
                "======================================"
        );

        // -----------------------------------------------------
        // 7. Upload to Supabase
        // -----------------------------------------------------

        try {

            restClient.post()
                    .uri(url)

                    // Supabase API key
                    .header(
                            "apikey",
                            supabaseServiceKey
                    )

                    // Service-role authorization
                    .header(
                            HttpHeaders.AUTHORIZATION,
                            "Bearer "
                                    + supabaseServiceKey
                    )

                    // Do not overwrite existing file
                    .header(
                            "x-upsert",
                            "false"
                    )

                    // Explicit content length
                    .header(
                            HttpHeaders.CONTENT_LENGTH,
                            String.valueOf(
                                    fileBytes.length
                            )
                    )

                    // PDF content type
                    .contentType(
                            MediaType.APPLICATION_PDF
                    )

                    // File bytes
                    .body(fileBytes)

                    .retrieve()

                    .onStatus(
                            HttpStatusCode::isError,
                            (request, response) -> {

                                String errorBody =
                                        new String(
                                                response
                                                        .getBody()
                                                        .readAllBytes(),
                                                StandardCharsets.UTF_8
                                        );

                                throw new RuntimeException(
                                        "Supabase HTTP "
                                                + response
                                                        .getStatusCode()
                                                        .value()
                                                + ": "
                                                + errorBody
                                );
                            }
                    )

                    .toBodilessEntity();

            // -------------------------------------------------
            // 8. Upload successful
            // -------------------------------------------------

            System.out.println();

            System.out.println(
                    "======================================"
            );

            System.out.println(
                    "SUPABASE FILE UPLOAD SUCCESS"
            );

            System.out.println(
                    "STORAGE PATH = "
                            + cleanPath
            );

            System.out.println(
                    "======================================"
            );

            return cleanPath;

        } catch (Exception e) {

            System.out.println();

            System.out.println(
                    "SUPABASE FILE UPLOAD FAILED"
            );

            System.out.println(
                    "ERROR = "
                            + e.getMessage()
            );

            throw new RuntimeException(
                    "Supabase file upload failed: "
                            + e.getMessage(),
                    e
            );
        }
    }

    // =========================================================
    // CREATE SIGNED URL
    // =========================================================

    public String createSignedUrl(
            String storagePath) {

        // -----------------------------------------------------
        // 1. Check configuration
        // -----------------------------------------------------

        if (!isConfigured()) {

            throw new RuntimeException(
                    "Supabase Storage is not configured."
            );
        }

        // -----------------------------------------------------
        // 2. Clean path
        // -----------------------------------------------------

        String cleanPath =
                cleanStoragePath(storagePath);

        // -----------------------------------------------------
        // 3. Signed URL endpoint
        // -----------------------------------------------------

        String url =
                getBaseUrl()
                        + "/storage/v1/object/sign/"
                        + bucket
                        + "/"
                        + cleanPath;

        System.out.println();

        System.out.println(
                "======================================"
        );

        System.out.println(
                "SUPABASE SIGNED URL"
        );

        System.out.println(
                "URL = "
                        + url
        );

        System.out.println(
                "PATH = "
                        + cleanPath
        );

        System.out.println(
                "======================================"
        );

        try {

            // -------------------------------------------------
            // Request body
            // -------------------------------------------------

            String requestBody =
                    "{\"expiresIn\":3600}";

            // -------------------------------------------------
            // Request
            // -------------------------------------------------

            String response =
                    restClient.post()

                            .uri(url)

                            .header(
                                    "apikey",
                                    supabaseServiceKey
                            )

                            .header(
                                    HttpHeaders.AUTHORIZATION,
                                    "Bearer "
                                            + supabaseServiceKey
                            )

                            .contentType(
                                    MediaType.APPLICATION_JSON
                            )

                            .body(
                                    requestBody
                            )

                            .retrieve()

                            .onStatus(
                                    HttpStatusCode::isError,
                                    (request,
                                     responseMessage) -> {

                                        String errorBody =
                                                new String(
                                                        responseMessage
                                                                .getBody()
                                                                .readAllBytes(),
                                                        StandardCharsets.UTF_8
                                                );

                                        throw new RuntimeException(
                                                "Supabase signed URL failed. HTTP "
                                                        + responseMessage
                                                                .getStatusCode()
                                                                .value()
                                                        + ": "
                                                        + errorBody
                                        );
                                    }
                            )

                            .body(
                                    String.class
                            );

            System.out.println(
                    "SIGNED URL RESPONSE = "
                            + response
            );

            // -------------------------------------------------
            // Check response
            // -------------------------------------------------

            if (response == null
                    || response.isBlank()) {

                throw new RuntimeException(
                        "Supabase returned empty response."
                );
            }

            // -------------------------------------------------
            // Extract signedURL
            // -------------------------------------------------

            String marker =
                    "\"signedURL\":\"";

            int start =
                    response.indexOf(marker);

            if (start == -1) {

                throw new RuntimeException(
                        "signedURL not found in response: "
                                + response
                );
            }

            start += marker.length();

            int end =
                    response.indexOf(
                            "\"",
                            start
                    );

            if (end == -1) {

                throw new RuntimeException(
                        "Invalid signed URL response: "
                                + response
                );
            }

            String signedPath =
                    response.substring(
                            start,
                            end
                    );

            // -------------------------------------------------
            // Build final URL
            // -------------------------------------------------

            String finalUrl;

            if (signedPath.startsWith(
                    "http://")
                    || signedPath.startsWith(
                            "https://")) {

                finalUrl =
                        signedPath;

            } else if (signedPath.startsWith(
                    "/storage/v1/")) {

                finalUrl =
                        getBaseUrl()
                                + signedPath;

            } else if (signedPath.startsWith(
                    "/object/")) {

                finalUrl =
                        getBaseUrl()
                                + "/storage/v1"
                                + signedPath;

            } else {

                finalUrl =
                        getBaseUrl()
                                + "/storage/v1/"
                                + signedPath;
            }

            System.out.println(
                    "FINAL SIGNED URL = "
                            + finalUrl
            );

            return finalUrl;

        } catch (Exception e) {

            throw new RuntimeException(
                    "Failed to create Supabase signed URL: "
                            + e.getMessage(),
                    e
            );
        }
    }


    





    // =========================================================
// DELETE FILE
// =========================================================

public void deleteFile(String storagePath) {

    if (!isConfigured()) {

        throw new RuntimeException(
                "Supabase Storage is not configured."
        );
    }

    String cleanPath =
            cleanStoragePath(storagePath);

    String url =
            getBaseUrl()
                    + "/storage/v1/object/"
                    + bucket
                    + "/"
                    + cleanPath;

    System.out.println();
    System.out.println(
            "======================================"
    );
    System.out.println(
            "SUPABASE FILE DELETE"
    );
    System.out.println(
            "BUCKET = " + bucket
    );
    System.out.println(
            "PATH   = " + cleanPath
    );
    System.out.println(
            "URL    = " + url
    );
    System.out.println(
            "======================================"
    );

    try {

        restClient.delete()
                .uri(url)

                .header(
                        "apikey",
                        supabaseServiceKey
                )

                .header(
                        HttpHeaders.AUTHORIZATION,
                        "Bearer "
                                + supabaseServiceKey
                )

                .retrieve()

                .onStatus(
                        HttpStatusCode::isError,
                        (request, response) -> {

                            String errorBody =
                                    new String(
                                            response
                                                    .getBody()
                                                    .readAllBytes(),
                                            StandardCharsets.UTF_8
                                    );

                            throw new RuntimeException(
                                    "Supabase delete failed. HTTP "
                                            + response
                                                    .getStatusCode()
                                                    .value()
                                            + ": "
                                            + errorBody
                            );
                        }
                )

                .toBodilessEntity();

        System.out.println(
                "SUPABASE FILE DELETE SUCCESS"
        );

    } catch (Exception e) {

        System.out.println(
                "SUPABASE FILE DELETE FAILED"
        );

        System.out.println(
                "ERROR = " + e.getMessage()
        );

        throw new RuntimeException(
                "Supabase file deletion failed: "
                        + e.getMessage(),
                e
        );
    }
}



}