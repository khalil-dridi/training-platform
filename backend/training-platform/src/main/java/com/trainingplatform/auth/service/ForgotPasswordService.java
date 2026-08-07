package com.trainingplatform.auth.service;

import com.trainingplatform.auth.dto.request.ForgotPasswordRequest;
import com.trainingplatform.auth.repository.PasswordResetTokenRepository;
import com.trainingplatform.auth.token.PasswordResetToken;
import com.trainingplatform.common.exception.ResourceNotFoundException;
import com.trainingplatform.user.entity.User;
import com.trainingplatform.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class ForgotPasswordService {

    private final UserRepository userRepository;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final EmailService emailService;

    public void sendResetPasswordEmail(ForgotPasswordRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found.")
                );

        PasswordResetToken passwordResetToken = PasswordResetToken.builder()
                .user(user)
                .used(false)
                .build();

        passwordResetToken.initialize();

        passwordResetTokenRepository.save(passwordResetToken);

        String resetLink =
                "http://localhost:4200/reset-password?token="
                        + passwordResetToken.getToken();

        emailService.sendEmail(
                user.getEmail(),
                "Reset your password",
                """
                Hello,

                You requested to reset your password.

                Click the link below to choose a new password:

                %s

                This link expires in 1 hour.

                If you did not request this, simply ignore this email.
                """.formatted(resetLink)
        );
    }
}