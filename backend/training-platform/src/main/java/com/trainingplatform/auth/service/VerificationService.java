package com.trainingplatform.auth.service;

import com.trainingplatform.auth.token.VerificationToken;
import com.trainingplatform.common.exception.AccountAlreadyVerifiedException;
import com.trainingplatform.common.exception.TokenAlreadyUsedException;
import com.trainingplatform.common.exception.TokenExpiredException;
import com.trainingplatform.user.entity.User;
import com.trainingplatform.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class VerificationService {

    private final VerificationTokenService verificationTokenService;
    private final UserRepository userRepository;

    public void verifyEmail(String token) {

        VerificationToken verificationToken =
                verificationTokenService.getByToken(token);

        if (Boolean.TRUE.equals(verificationToken.getUsed())) {
            throw new TokenAlreadyUsedException(
                    "Verification link has already been used."
            );
        }

        if (verificationToken.isExpired()) {
            throw new TokenExpiredException(
                    "Verification link has expired."
            );
        }

        User user = verificationToken.getUser();

        if (Boolean.TRUE.equals(user.getEnabled())) {
            throw new AccountAlreadyVerifiedException(
                    "Account is already verified."
            );
        }

        user.setEnabled(true);
        verificationToken.setUsed(true);

        userRepository.save(user);
        verificationTokenService.save(verificationToken);
    }
}