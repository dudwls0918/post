package com.example.be.domain.post.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class PostCreateRequest {
    @NotBlank
    private String title;

    @NotBlank
    private String content;

    @NotNull
    private Long userId;
}
