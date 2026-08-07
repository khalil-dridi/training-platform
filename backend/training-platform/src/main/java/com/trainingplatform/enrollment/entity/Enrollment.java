package com.trainingplatform.enrollment.entity;

import com.trainingplatform.common.entity.BaseEntity;
import com.trainingplatform.course.entity.Course;
import com.trainingplatform.user.entity.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "enrollments",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_enrollment_learner_course",
                        columnNames = {"learner_id", "course_id"}
                )
        }
)
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Enrollment extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "learner_id",
            nullable = false,
            foreignKey = @ForeignKey(name = "fk_enrollment_learner")
    )
    private User learner;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "course_id",
            nullable = false,
            foreignKey = @ForeignKey(name = "fk_enrollment_course")
    )
    private Course course;

    @Builder.Default
    @Column(nullable = false)
    private Integer progress = 0;

    @Builder.Default
    @Column(nullable = false)
    private Boolean completed = false;

    private LocalDateTime enrolledAt;

    private LocalDateTime completedAt;

}