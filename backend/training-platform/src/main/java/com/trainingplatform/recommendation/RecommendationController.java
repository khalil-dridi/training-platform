package com.trainingplatform.recommendation;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/recommendations")
public class RecommendationController {

    private final RecommendationClient recommendationClient;

    public RecommendationController(RecommendationClient recommendationClient) {
        this.recommendationClient = recommendationClient;
    }

    @GetMapping("/{learnerId}")
    public RecommendationResponse getRecommendations(
            @PathVariable Long learnerId,
            @RequestParam(defaultValue = "5") int topN) {

        return recommendationClient.getRecommendations(learnerId, topN);
    }
}