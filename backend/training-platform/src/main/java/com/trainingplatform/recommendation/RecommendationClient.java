package com.trainingplatform.recommendation;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

@Service
public class RecommendationClient {

    private final RestClient restClient;

    public RecommendationClient() {
        this.restClient = RestClient.builder()
                .baseUrl("http://localhost:8000")
                .build();
    }

    public RecommendationResponse getRecommendations(Long learnerId, int topN) {

        return restClient.get()
                .uri("/api/recommendations/{learnerId}?top_n={topN}", learnerId, topN)
                .retrieve()
                .body(RecommendationResponse.class);
    }
}