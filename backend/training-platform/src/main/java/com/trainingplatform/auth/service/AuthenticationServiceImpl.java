package com.trainingplatform.auth.service;

import com.trainingplatform.auth.dto.request.LoginRequest;
import com.trainingplatform.auth.dto.request.RegisterRequest;
import com.trainingplatform.auth.dto.response.AuthenticationResponse;
import com.trainingplatform.user.dto.response.UserResponse;
import com.trainingplatform.auth.token.VerificationToken;
import com.trainingplatform.common.exception.AccountNotVerifiedException;
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
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
@Service
@RequiredArgsConstructor
public class AuthenticationServiceImpl implements AuthenticationService {

    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

    private final JwtService jwtService;

    private final AuthenticationManager authenticationManager;

    private final UserMapper userMapper;

    private final VerificationTokenService verificationTokenService;

    private final EmailService emailService;

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
                .enabled(false)
                .build();

        userRepository.save(user);
        VerificationToken verificationToken =
                verificationTokenService.createVerificationToken(user);

        String verificationLink =
                "http://localhost:8080/api/auth/verify?token="
                        + verificationToken.getToken();

        emailService.sendEmail(
                user.getEmail(),
                "Verify your account",
                """
                Welcome to Training Platform!
        
                Please verify your email by clicking the link below:
        
                %s
        
                This link expires in 24 hours.
                """.formatted(verificationLink)
        );

        return userMapper.toUserResponse(user);
    }

    @Override
    public AuthenticationResponse login(LoginRequest request) {

        try {

            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(),
                            request.getPassword()
                    )
            );

        } catch (DisabledException ex) {

            throw new AccountNotVerifiedException(
                    "Please verify your email before logging in."
            );

        } catch (BadCredentialsException ex) {

            throw new InvalidCredentialsException(
                    "Invalid email or password."
            );
        }

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new InvalidCredentialsException(
                                "Invalid email or password."
                        )
                );

        String token = jwtService.generateToken(user);

        return AuthenticationResponse.builder()
                .accessToken(token)
                .tokenType("Bearer")
                .expiresIn(jwtService.getExpiration())
                .build();
    }
}