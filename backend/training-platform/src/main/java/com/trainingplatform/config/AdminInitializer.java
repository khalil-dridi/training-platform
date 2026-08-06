package com.trainingplatform.config;

import com.trainingplatform.user.entity.User;
import com.trainingplatform.user.enums.AuthProvider;
import com.trainingplatform.user.enums.Role;
import com.trainingplatform.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class AdminInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {

        if (userRepository.existsByEmail("admin@trainingplatform.com")) {
            return;
        }

        User admin = User.builder()
                .firstName("System")
                .lastName("Administrator")
                .email("admin@trainingplatform.com")
                .password(passwordEncoder.encode("Admin@123"))
                .role(Role.ADMIN)
                .provider(AuthProvider.LOCAL)
                .enabled(true)
                .build();

        userRepository.save(admin);
    }
}
