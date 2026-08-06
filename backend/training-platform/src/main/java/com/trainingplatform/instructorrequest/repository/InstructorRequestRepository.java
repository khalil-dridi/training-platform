package com.trainingplatform.instructorrequest.repository;

import com.trainingplatform.instructorrequest.entity.InstructorRequest;
import com.trainingplatform.instructorrequest.enums.InstructorRequestStatus;
import com.trainingplatform.user.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface InstructorRequestRepository
        extends JpaRepository<InstructorRequest, Long> {

    /**
     * Returns the latest request of the authenticated user.
     */
    Optional<InstructorRequest> findFirstByUserOrderByCreatedAtDesc(User user);

    /**
     * Checks if the user already has a pending request.
     */
    boolean existsByUserAndStatus(
            User user,
            InstructorRequestStatus status
    );

    /**
     * Returns all requests by status (Admin).
     */
    Page<InstructorRequest> findByStatus(
            InstructorRequestStatus status,
            Pageable pageable
    );

    Page<InstructorRequest> findAllByStatus(
            InstructorRequestStatus status,
            Pageable pageable
    );

}