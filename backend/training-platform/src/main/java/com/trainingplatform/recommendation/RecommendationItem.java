package com.trainingplatform.recommendation;

import lombok.Data;

@Data
public class RecommendationItem {

    private Long courseId;
    private String title;
    private String language;
    private String level;
    private Double price;
    private String category;
    private Integer score;
}