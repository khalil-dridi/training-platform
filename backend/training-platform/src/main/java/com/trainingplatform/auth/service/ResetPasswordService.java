package com.trainingplatform.auth.service;

import com.trainingplatform.auth.repository.PasswordResetTokenRepository;
import com.trainingplatform.auth.dto.request.ResetPasswordRequest;
import com.trainingplatform.auth.token.PasswordResetToken;
import com.trainingplatform.common.exception.TokenAlreadyUsedException;
import com.trainingplatform.common.exception.TokenExpiredException;
import com.trainingplatform.user.entity.User;
import com.trainingplatform.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class ResetPasswordService {

    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;

    public void resetPassword(ResetPasswordRequest request) {

        PasswordResetToken passwordResetToken =
                passwordResetTokenRepository.findByToken(request.getToken())
                        .orElseThrow(() ->
                                new TokenExpiredException("Invalid reset token.")
                        );

        if (Boolean.TRUE.equals(passwordResetToken.getUsed())) {
            throw new TokenAlreadyUsedException(
                    "Reset password link has already been used."
            );
        }

        if (passwordResetToken.isExpired()) {
            throw new TokenExpiredException(
                    "Reset password link has expired."
            );
        }

        User user = passwordResetToken.getUser();

        user.setPassword(
                passwordEncoder.encode(request.getNewPassword())
        );

        passwordResetToken.setUsed(true);

        userRepository.save(user);
        passwordResetTokenRepository.save(passwordResetToken);
    }

}