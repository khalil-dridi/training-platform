package com.trainingplatform.lesson.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CreateLessonRequest {

    @NotBlank
    @Size(max = 200)
    private String title;

    @Size(max = 1000)
    private String description;

    @NotNull
    private Long chapterId;

    @NotNull
    @Positive
    private Integer duration;

    @NotNull
    private Boolean preview;

    @NotNull
    @Positive
    private Integer position;

}
