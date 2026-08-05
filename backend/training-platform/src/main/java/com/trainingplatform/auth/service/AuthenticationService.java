package com.trainingplatform.auth.service;

import com.trainingplatform.auth.dto.request.LoginRequest;
import com.trainingplatform.auth.dto.request.RegisterRequest;
import com.trainingplatform.auth.dto.response.AuthenticationResponse;
import com.trainingplatform.user.dto.response.UserResponse;

public interface AuthenticationService {
    UserResponse register(RegisterRequest request);

    AuthenticationResponse login(LoginRequest request);
}
