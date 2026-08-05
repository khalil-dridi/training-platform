package com.trainingplatform.auth.service;

import com.trainingplatform.auth.repository.VerificationTokenRepository;
import com.trainingplatform.auth.token.VerificationToken;
import com.trainingplatform.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class VerificationTokenService {

    private final VerificationTokenRepository verificationTokenRepository;

    public VerificationToken createVerificationToken(User user) {

        VerificationToken verificationToken = VerificationToken.builder()
                .user(user)
                .token(UUID.randomUUID().toString())
                .expiresAt(LocalDateTime.now().plusHours(24))
                .used(false)
                .build();

        return verificationTokenRepository.save(verificationToken);
    }

    public VerificationToken getByToken(String token) {

        return verificationTokenRepository.findByToken(token)
                .orElseThrow(() -> new RuntimeException("Verification token not found."));
    }

    public void save(VerificationToken verificationToken) {
        verificationTokenRepository.save(verificationToken);
    }

}