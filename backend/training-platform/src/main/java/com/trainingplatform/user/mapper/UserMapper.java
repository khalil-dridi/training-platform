package com.trainingplatform.user.mapper;

import com.trainingplatform.auth.dto.response.UserResponse;
import com.trainingplatform.user.entity.User;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserMapper {

    UserResponse toUserResponse(User user);

}