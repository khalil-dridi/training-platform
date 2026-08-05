package com.trainingplatform.user.service;

import com.trainingplatform.common.exception.InvalidCredentialsException;
import com.trainingplatform.common.exception.ResourceNotFoundException;
import com.trainingplatform.user.dto.request.ChangePasswordRequest;
import com.trainingplatform.user.dto.request.UpdateProfileRequest;
import com.trainingplatform.user.dto.response.UserResponse;
import com.trainingplatform.user.entity.User;
import com.trainingplatform.user.mapper.UserMapper;
import com.trainingplatform.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.trainingplatform.storage.dto.CloudinaryResponse;
import com.trainingplatform.storage.service.CloudinaryService;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final CloudinaryService cloudinaryService;
    private static final String DEFAULT_AVATAR_URL =
            "https://res.cloudinary.com/dqrtwfpbq/image/upload/v1785902252/avatar_jbenlj.png";

    public UserResponse getCurrentUser(Authentication authentication) {

        User user = getAuthenticatedUser(authentication);

        return userMapper.toUserResponse(user);
    }

    @Transactional
    public UserResponse updateProfile(
            Authentication authentication,
            UpdateProfileRequest request
    ) {

        User user = getAuthenticatedUser(authentication);

        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setPhone(request.getPhone());

        userRepository.save(user);

        return userMapper.toUserResponse(user);
    }

    @Transactional
    public void changePassword(
            Authentication authentication,
            ChangePasswordRequest request
    ) {

        User user = getAuthenticatedUser(authentication);

        if (!passwordEncoder.matches(
                request.getCurrentPassword(),
                user.getPassword())) {

            throw new InvalidCredentialsException(
                    "Current password is incorrect."
            );
        }

        if (!request.getNewPassword()
                .equals(request.getConfirmPassword())) {

            throw new IllegalArgumentException(
                    "New password and confirmation password do not match."
            );
        }

        if (passwordEncoder.matches(
                request.getNewPassword(),
                user.getPassword())) {

            throw new IllegalArgumentException(
                    "New password must be different from the current password."
            );
        }

        user.setPassword(
                passwordEncoder.encode(request.getNewPassword())
        );

        userRepository.save(user);
    }

    /**
     * Returns the authenticated user.
     */
    private User getAuthenticatedUser(Authentication authentication) {

        return userRepository.findByEmail(authentication.getName())
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found.")
                );
    }

    @Transactional
    public UserResponse uploadAvatar(
            Authentication authentication,
            MultipartFile file
    ) throws IOException {

        User user = getAuthenticatedUser(authentication);

        // Si l'utilisateur possède déjà un avatar Cloudinary,
        // on le supprime avant d'uploader le nouveau.
        if (user.getAvatarPublicId() != null
                && !user.getAvatarPublicId().isBlank()) {

            cloudinaryService.deleteImage(user.getAvatarPublicId());
        }

        CloudinaryResponse response =
                cloudinaryService.uploadImage(
                        file,
                        "training-platform/users/avatars"
                );

        user.setAvatarUrl(response.getUrl());
        user.setAvatarPublicId(response.getPublicId());

        userRepository.save(user);

        return userMapper.toUserResponse(user);
    }

    @Transactional
    public UserResponse deleteAvatar(
            Authentication authentication
    ) throws IOException {

        User user = getAuthenticatedUser(authentication);

        if (user.getAvatarPublicId() != null
                && !user.getAvatarPublicId().isBlank()) {

            cloudinaryService.deleteImage(user.getAvatarPublicId());
        }

        user.setAvatarUrl(DEFAULT_AVATAR_URL);
        user.setAvatarPublicId(null);

        userRepository.save(user);

        return userMapper.toUserResponse(user);
    }

}