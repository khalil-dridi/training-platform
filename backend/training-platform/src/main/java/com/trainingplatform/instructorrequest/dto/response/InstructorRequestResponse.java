package com.trainingplatform.instructorrequest.dto.response;

import com.trainingplatform.instructorrequest.enums.InstructorRequestStatus;
import com.trainingplatform.user.dto.response.UserResponse;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class InstructorRequestResponse {

    private Long id;

    private UserResponse user;


    private String cvUrl;

    private InstructorRequestStatus status;

    private String adminComment;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

}
