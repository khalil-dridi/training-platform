package com.trainingplatform.lesson.service;

import com.cloudinary.utils.ObjectUtils;
import com.trainingplatform.chapter.entity.Chapter;
import com.trainingplatform.chapter.repository.ChapterRepository;
import com.trainingplatform.common.exception.ResourceNotFoundException;
import com.trainingplatform.lesson.dto.request.CreateLessonRequest;
import com.trainingplatform.lesson.dto.request.UpdateLessonRequest;
import com.trainingplatform.lesson.dto.response.LessonResponse;
import com.trainingplatform.lesson.entity.Lesson;
import com.trainingplatform.lesson.mapper.LessonMapper;
import com.trainingplatform.lesson.repository.LessonRepository;
import com.trainingplatform.storage.dto.CloudinaryResponse;
import com.trainingplatform.storage.service.CloudinaryService;
import com.trainingplatform.user.entity.User;
import com.trainingplatform.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class LessonService {

    private final LessonRepository lessonRepository;
    private final LessonMapper lessonMapper;
    private final ChapterRepository chapterRepository;
    private final UserRepository userRepository;
    private final CloudinaryService cloudinaryService;



    @Transactional
    public LessonResponse createLesson(
            Authentication authentication,
            CreateLessonRequest request,
            MultipartFile video
    ) throws IOException {

        User trainer = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found.")
                );

        Chapter chapter = chapterRepository.findById(request.getChapterId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Chapter not found.")
                );

        if (!chapter.getCourse().getTrainer().getId().equals(trainer.getId())) {
            throw new IllegalStateException(
                    "You are not allowed to add lessons to this chapter."
            );
        }

        if (lessonRepository.existsByChapterAndPosition(
                chapter,
                request.getPosition()
        )) {
            throw new IllegalArgumentException(
                    "A lesson with position "
                            + request.getPosition()
                            + " already exists."
            );
        }

        if (video == null || video.isEmpty()) {
            throw new IllegalArgumentException(
                    "Lesson video is required."
            );
        }

        CloudinaryResponse response =
                cloudinaryService.uploadVideo(
                        video,
                        "training-platform/lessons/videos"
                );

        Lesson lesson = Lesson.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .videoUrl(response.getUrl())
                .videoPublicId(response.getPublicId())
                .duration(request.getDuration())
                .preview(request.getPreview())
                .position(request.getPosition())
                .chapter(chapter)
                .build();

        lessonRepository.save(lesson);

        return lessonMapper.toResponse(lesson);
    }

    @Transactional(readOnly = true)
    public List<LessonResponse> getChapterLessons(
            Authentication authentication,
            Long chapterId
    ) {

        User trainer = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found.")
                );

        Chapter chapter = chapterRepository.findById(chapterId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Chapter not found.")
                );

        if (!chapter.getCourse().getTrainer().getId().equals(trainer.getId())) {
            throw new IllegalStateException(
                    "You are not allowed to access this chapter."
            );
        }

        return lessonRepository.findByChapterOrderByPositionAsc(chapter)
                .stream()
                .map(lessonMapper::toResponse)
                .toList();
    }

    @Transactional
    public LessonResponse updateLesson(
            Authentication authentication,
            Long id,
            UpdateLessonRequest request,
            MultipartFile video
    ) throws IOException {

        User trainer = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found.")
                );

        Lesson lesson = lessonRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Lesson not found.")
                );

        Chapter chapter = lesson.getChapter();

        if (!chapter.getCourse().getTrainer().getId().equals(trainer.getId())) {
            throw new IllegalStateException(
                    "You are not allowed to update this lesson."
            );
        }

        if (!lesson.getPosition().equals(request.getPosition())
                && lessonRepository.existsByChapterAndPosition(
                chapter,
                request.getPosition()
        )) {

            throw new IllegalArgumentException(
                    "A lesson with position "
                            + request.getPosition()
                            + " already exists."
            );
        }

        lesson.setTitle(request.getTitle());
        lesson.setDescription(request.getDescription());
        lesson.setDuration(request.getDuration());
        lesson.setPreview(request.getPreview());
        lesson.setPosition(request.getPosition());

        if (video != null && !video.isEmpty()) {

            cloudinaryService.deleteVideo(
                    lesson.getVideoPublicId()
            );

            CloudinaryResponse response =
                    cloudinaryService.uploadVideo(
                            video,
                            "training-platform/lessons/videos"
                    );

            lesson.setVideoUrl(response.getUrl());
            lesson.setVideoPublicId(response.getPublicId());
        }

        lessonRepository.save(lesson);

        return lessonMapper.toResponse(lesson);
    }

    @Transactional
    public void deleteLesson(
            Authentication authentication,
            Long id
    ) throws IOException {

        User trainer = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found.")
                );

        Lesson lesson = lessonRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Lesson not found.")
                );

        if (!lesson.getChapter().getCourse().getTrainer().getId().equals(trainer.getId())) {
            throw new IllegalStateException(
                    "You are not allowed to delete this lesson."
            );
        }

        cloudinaryService.deleteVideo(
                lesson.getVideoPublicId()
        );

        lessonRepository.delete(lesson);
    }

}
