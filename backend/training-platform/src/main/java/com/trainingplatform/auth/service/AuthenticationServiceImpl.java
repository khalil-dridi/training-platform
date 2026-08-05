package com.trainingplatform.auth.service;

import com.trainingplatform.auth.dto.request.LoginRequest;
import com.trainingplatform.auth.dto.request.RegisterRequest;
import com.trainingplatform.auth.dto.response.AuthenticationResponse;
import com.trainingplatform.auth.dto.response.UserResponse;
import com.trainingplatform.auth.service.AuthenticationService;
import com.trainingplatform.common.exception.EmailAlreadyExistsException;
import com.trainingplatform.common.exception.InvalidCredentialsException;
import com.trainingplatform.security.JwtService;
import com.trainingplatform.user.entity.User;
import com.trainingplatform.user.enums.Role;
import com.trainingplatform.user.mapper.UserMapper;
import com.trainingplatform.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthenticationServiceImpl implements AuthenticationService {

    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

    private final JwtService jwtService;

    private final AuthenticationManager authenticationManager;

    private final UserMapper userMapper;

    @Override
    public UserResponse register(RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new EmailAlreadyExistsException("Email already exists.");
        }

        User user = User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .phone(request.getPhone())
                .role(Role.LEARNER)
                .enabled(true)
                .build();

        userRepository.save(user);

        return userMapper.toUserResponse(user);
    }

    @Override
    public AuthenticationResponse login(LoginRequest request) {

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new InvalidCredentialsException("Invalid email or password."));

        String token = jwtService.generateToken(user);

        return AuthenticationResponse.builder()
                .accessToken(token)
                .tokenType("Bearer")
                .expiresIn(86400000L)
                .build();
    }
}