package com.trainingplatform.instructorrequest.service;

import com.trainingplatform.common.exception.ResourceNotFoundException;
import com.trainingplatform.instructorrequest.dto.response.InstructorRequestResponse;
import com.trainingplatform.instructorrequest.entity.InstructorRequest;
import com.trainingplatform.instructorrequest.enums.InstructorRequestStatus;
import com.trainingplatform.instructorrequest.mapper.InstructorRequestMapper;
import com.trainingplatform.instructorrequest.repository.InstructorRequestRepository;
import com.trainingplatform.storage.dto.CloudinaryResponse;
import com.trainingplatform.storage.service.CloudinaryService;
import com.trainingplatform.user.entity.User;
import com.trainingplatform.user.enums.Role;
import com.trainingplatform.user.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.io.IOException;

@Service
@RequiredArgsConstructor
public class InstructorRequestService {

    private final InstructorRequestRepository instructorRequestRepository;
    private final InstructorRequestMapper instructorRequestMapper;
    private final UserRepository userRepository;
    private final CloudinaryService cloudinaryService;

    private User getAuthenticatedUser(Authentication authentication) {

        return userRepository.findByEmail(authentication.getName())
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found.")
                );
    }

    @Transactional
    public InstructorRequestResponse createRequest(
            Authentication authentication,
            MultipartFile cv
    ) throws IOException {

        User user = getAuthenticatedUser(authentication);

        if (user.getRole() != Role.LEARNER) {
            throw new IllegalStateException(
                    "Only learners can submit an instructor request."
            );
        }

        if (cv == null || cv.isEmpty()) {
            throw new IllegalArgumentException("CV is required.");
        }

        if (instructorRequestRepository
                .findFirstByUserOrderByCreatedAtDesc(user)
                .isPresent()) {

            throw new IllegalStateException(
                    "You have already submitted an instructor request."
            );
        }

        CloudinaryResponse cvResponse =
                cloudinaryService.uploadDocument(
                        cv,
                        "training-platform/instructor-requests/cv"
                );

        InstructorRequest instructorRequest = InstructorRequest.builder()
                .user(user)
                .cvUrl(cvResponse.getUrl())
                .cvPublicId(cvResponse.getPublicId())
                .status(InstructorRequestStatus.PENDING)
                .build();

        instructorRequestRepository.save(instructorRequest);

        return instructorRequestMapper.toResponse(instructorRequest);
    }


    @Transactional
    public Page<InstructorRequestResponse> getAllRequests(
            InstructorRequestStatus status,
            Pageable pageable
    ) {

        Page<InstructorRequest> requests;

        if (status == null) {
            requests = instructorRequestRepository.findAll(pageable);
        } else {
            requests = instructorRequestRepository.findAllByStatus(
                    status,
                    pageable
            );
        }

        return requests.map(instructorRequestMapper::toResponse);
    }


    @Transactional
    public InstructorRequestResponse approveRequest(Long id) {

        InstructorRequest instructorRequest = instructorRequestRepository
                .findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Instructor request not found.")
                );

        if (instructorRequest.getStatus() != InstructorRequestStatus.PENDING) {
            throw new IllegalStateException(
                    "Only pending requests can be approved."
            );
        }

        User user = instructorRequest.getUser();

        user.setRole(Role.TRAINER);

        instructorRequest.setStatus(InstructorRequestStatus.APPROVED);

        userRepository.save(user);
        instructorRequestRepository.save(instructorRequest);

        return instructorRequestMapper.toResponse(instructorRequest);
    }

    @Transactional
    public InstructorRequestResponse rejectRequest(Long id) {

        InstructorRequest instructorRequest = instructorRequestRepository
                .findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Instructor request not found.")
                );

        if (instructorRequest.getStatus() != InstructorRequestStatus.PENDING) {
            throw new IllegalStateException(
                    "Only pending requests can be rejected."
            );
        }

        instructorRequest.setStatus(InstructorRequestStatus.REJECTED);

        instructorRequestRepository.save(instructorRequest);

        return instructorRequestMapper.toResponse(instructorRequest);
    }




}