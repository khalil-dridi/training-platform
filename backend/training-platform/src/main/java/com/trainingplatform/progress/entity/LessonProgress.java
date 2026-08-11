package com.trainingplatform.progress.entity;

import com.trainingplatform.common.entity.BaseEntity;
import com.trainingplatform.lesson.entity.Lesson;
import com.trainingplatform.user.entity.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "lesson_progress",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_lesson_progress_learner_lesson",
                        columnNames = {"learner_id", "lesson_id"}
                )
        },
        indexes = {
                @Index(
                        name = "idx_lesson_progress_learner",
                        columnList = "learner_id"
                ),
                @Index(
                        name = "idx_lesson_progress_lesson",
                        columnList = "lesson_id"
                )
        }
)
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LessonProgress extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "learner_id",
            nullable = false,
            foreignKey = @ForeignKey(name = "fk_lesson_progress_learner")
    )
    private User learner;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "lesson_id",
            nullable = false,
            foreignKey = @ForeignKey(name = "fk_lesson_progress_lesson")
    )
    private Lesson lesson;

    @Builder.Default
    @Column(nullable = false)
    private Boolean completed = false;

    private LocalDateTime completedAt;
}