package com.trainingplatform.security.oauth;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.trainingplatform.auth.dto.response.AuthenticationResponse;
import com.trainingplatform.common.dto.response.ApiResponse;
import com.trainingplatform.common.exception.ResourceNotFoundException;
import com.trainingplatform.security.JwtService;
import com.trainingplatform.user.entity.User;
import com.trainingplatform.user.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
public class OAuth2AuthenticationSuccessHandler implements AuthenticationSuccessHandler {

    private final JwtService jwtService;
    private final UserRepository userRepository;
    private final ObjectMapper objectMapper;

    @Override
    public void onAuthenticationSuccess(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication
    ) throws IOException {



        System.out.println("========== OAuth2 ==========");
        System.out.println("authentication.getName() = " + authentication.getName());

        Object principal = authentication.getPrincipal();
        System.out.println("Principal class = " + principal.getClass());

        if (principal instanceof org.springframework.security.oauth2.core.user.OAuth2User oauth2User) {
            System.out.println("Attributes = " + oauth2User.getAttributes());
        }
        System.out.println("============================");




        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() ->
                        new ResourceNotFoundException("OAuth2 user not found.")
                );

        String accessToken = jwtService.generateToken(user);

        AuthenticationResponse authenticationResponse =
                AuthenticationResponse.builder()
                        .accessToken(accessToken)
                        .tokenType("Bearer")
                        .expiresIn(jwtService.getExpiration())
                        .build();

        ApiResponse<AuthenticationResponse> apiResponse =
                ApiResponse.<AuthenticationResponse>builder()
                        .success(true)
                        .message("OAuth2 login successful.")
                        .data(authenticationResponse)
                        .timestamp(LocalDateTime.now())
                        .build();

        response.setStatus(HttpServletResponse.SC_OK);
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);

        objectMapper.writeValue(response.getOutputStream(), apiResponse);
    }
}