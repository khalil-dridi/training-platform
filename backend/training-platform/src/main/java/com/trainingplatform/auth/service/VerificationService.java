package com.trainingplatform.auth.service;

import com.trainingplatform.auth.token.VerificationToken;
import com.trainingplatform.common.exception.ResourceNotFoundException;
import com.trainingplatform.user.entity.User;
import com.trainingplatform.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class VerificationService {

    private final VerificationTokenService verificationTokenService;
    private final UserRepository userRepository;

    public void verifyEmail(String token) {

        VerificationToken verificationToken =
                verificationTokenService.getByToken(token);

        if (verificationToken.getUsed()) {
            throw new RuntimeException("Verification link has already been used.");
        }

        if (verificationToken.isExpired()) {
            throw new RuntimeException("Verification link has expired.");
        }

        User user = verificationToken.getUser();

        user.setEnabled(true);

        verificationToken.setUsed(true);

        userRepository.save(user);

        verificationTokenService.save(verificationToken);
    }
}