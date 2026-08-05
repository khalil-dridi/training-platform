package com.trainingplatform.auth.repository;

import com.trainingplatform.auth.token.VerificationToken;
import com.trainingplatform.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface VerificationTokenRepository
        extends JpaRepository<VerificationToken, Long> {

    @Query("""
            SELECT vt
            FROM VerificationToken vt
            JOIN FETCH vt.user
            WHERE vt.token = :token
            """)
    Optional<VerificationToken> findByToken(String token);

    Optional<VerificationToken> findByUser(User user);

}