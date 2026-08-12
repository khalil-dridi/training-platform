export interface RecommendationItem {
  courseId: number;
  title: string;
  language: string;
  level: string;
  price: number;
  category: string;
  score: number;
}

export interface RecommendationResponse {
  learnerId: number;
  recommendations: RecommendationItem[];
}
