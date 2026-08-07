package com.trainingplatform.lesson.entity;

import com.trainingplatform.chapter.entity.Chapter;
import com.trainingplatform.common.entity.BaseEntity;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.*;

@Entity
@Table(
        name = "lessons",
        indexes = {
                @Index(name = "idx_lesson_chapter", columnList = "chapter_id")
        }
)
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Lesson extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(max = 200)
    @Column(nullable = false)
    private String title;

    @Size(max = 1000)
    @Column(length = 1000)
    private String description;

    @Column(nullable = false, length = 500)
    private String videoUrl;

    @Column(length = 255)
    private String videoPublicId;

    @Positive
    @Column(nullable = false)
    private Integer duration;

    @Builder.Default
    @Column(nullable = false)
    private Boolean preview = false;

    @Positive
    @Column(nullable = false)
    private Integer position;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "chapter_id",
            nullable = false,
            foreignKey = @ForeignKey(name = "fk_lesson_chapter")
    )
    private Chapter chapter;

}