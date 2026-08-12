package com.trainingplatform.recommendation;

import lombok.Data;

import java.util.List;

@Data
public class RecommendationResponse {

    private Long learnerId;
    private List<RecommendationItem> recommendations;
}