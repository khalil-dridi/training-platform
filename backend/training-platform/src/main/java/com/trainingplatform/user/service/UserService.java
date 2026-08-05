package com.trainingplatform.user.service;

import com.trainingplatform.common.exception.ResourceNotFoundException;
import com.trainingplatform.user.dto.response.UserResponse;
import com.trainingplatform.user.entity.User;
import com.trainingplatform.user.mapper.UserMapper;
import com.trainingplatform.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import com.trainingplatform.user.dto.request.UpdateProfileRequest;
import org.springframework.transaction.annotation.Transactional;
@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;

    public UserResponse getCurrentUser(Authentication authentication) {

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found.")
                );

        return userMapper.toUserResponse(user);
    }

    @Transactional
    public UserResponse updateProfile(
            Authentication authentication,
            UpdateProfileRequest request
    ) {

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found.")
                );

        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setPhone(request.getPhone());

        userRepository.save(user);

        return userMapper.toUserResponse(user);
    }

}