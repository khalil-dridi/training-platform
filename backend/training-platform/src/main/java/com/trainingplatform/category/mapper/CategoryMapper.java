package com.trainingplatform.category.mapper;

import com.trainingplatform.category.dto.response.CategoryResponse;
import com.trainingplatform.category.entity.Category;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface CategoryMapper {

    CategoryResponse toResponse(Category category);

}
