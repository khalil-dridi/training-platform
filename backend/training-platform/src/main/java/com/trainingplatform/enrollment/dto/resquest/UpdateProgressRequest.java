package com.trainingplatform.enrollment.dto.resquest;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.Data;

@Data
public class UpdateProgressRequest {

    @Min(0)
    @Max(100)
    private Integer progress;

}