package com.trainingplatform.instructorrequest.entity;

import com.trainingplatform.common.entity.BaseEntity;
import com.trainingplatform.instructorrequest.enums.InstructorRequestStatus;
import com.trainingplatform.user.entity.User;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

@Entity
@Table(
        name = "instructor_requests",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_request_user",
                        columnNames = "user_id"
                )
        },
        indexes = {
                @Index(name = "idx_request_status", columnList = "status")
        }
)
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InstructorRequest extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "user_id",
            nullable = false,
            foreignKey = @ForeignKey(name = "fk_request_user")
    )
    private User user;



    @Column(length = 500)
    private String cvUrl;

    @Column(length = 255)
    private String cvPublicId;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    @Column(nullable = false, length = 20)
    private InstructorRequestStatus status =
            InstructorRequestStatus.PENDING;

    @Column(length = 1000)
    private String adminComment;

}