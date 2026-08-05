package com.trainingplatform.auth.service;

import com.trainingplatform.auth.token.VerificationToken;
import com.trainingplatform.common.exception.AccountAlreadyVerifiedException;
import com.trainingplatform.common.exception.ResourceNotFoundException;
import com.trainingplatform.user.entity.User;
import com.trainingplatform.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class ResendVerificationService {

    private final UserRepository userRepository;
    private final VerificationTokenService verificationTokenService;
    private final EmailService emailService;

    public void resendVerificationEmail(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found.")
                );

        if (Boolean.TRUE.equals(user.getEnabled())) {
            throw new AccountAlreadyVerifiedException(
                    "Account is already verified."
            );
        }

        VerificationToken verificationToken =
                verificationTokenService.createVerificationToken(user);

        String verificationLink =
                "http://localhost:8080/api/auth/verify?token="
                        + verificationToken.getToken();

        emailService.sendEmail(
                user.getEmail(),
                "Verify your account",
                """
                Welcome back!

                Please verify your account by clicking the link below:

                %s

                This link expires in 24 hours.
                """.formatted(verificationLink)
        );
    }
}