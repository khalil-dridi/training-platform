package com.trainingplatform.auth.service;

import com.trainingplatform.auth.repository.VerificationTokenRepository;
import com.trainingplatform.auth.token.VerificationToken;
import com.trainingplatform.common.exception.ResourceNotFoundException;
import com.trainingplatform.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
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

    @Transactional(readOnly = true)
    public VerificationToken getByToken(String token) {

        return verificationTokenRepository.findByToken(token)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Verification token not found.")
                );
    }

    @Transactional(readOnly = true)
    public VerificationToken getByUser(User user) {

        return verificationTokenRepository.findByUser(user)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Verification token not found.")
                );
    }

    public VerificationToken save(VerificationToken verificationToken) {
        return verificationTokenRepository.save(verificationToken);
    }

}