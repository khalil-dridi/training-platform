package com.trainingplatform.auth.repository;

import com.trainingplatform.auth.token.PasswordResetToken;
import com.trainingplatform.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface PasswordResetTokenRepository
        extends JpaRepository<PasswordResetToken, Long> {

    @Query("""
            SELECT prt
            FROM PasswordResetToken prt
            JOIN FETCH prt.user
            WHERE prt.token = :token
            """)
    Optional<PasswordResetToken> findByToken(String token);

    Optional<PasswordResetToken> findByUser(User user);

}