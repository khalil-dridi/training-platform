package com.trainingplatform.user.dto.response;

import com.trainingplatform.user.enums.Role;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserResponse {

    private Long id;

    private String firstName;

    private String lastName;

    private String email;

    private String phone;

    private String avatarUrl;

    private Role role;

    private Boolean enabled;

}