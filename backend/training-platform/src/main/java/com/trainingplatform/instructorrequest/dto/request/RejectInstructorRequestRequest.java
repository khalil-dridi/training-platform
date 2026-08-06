package com.trainingplatform.instructorrequest.dto.request;


import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RejectInstructorRequestRequest {

    @NotBlank
    @Size(max = 1000)
    private String adminComment;

}