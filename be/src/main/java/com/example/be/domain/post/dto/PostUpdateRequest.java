package com.example.be.domain.post.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class PostUpdateRequest {

    @NotBlank
    private String title;

    @NotBlank
    private String content;
}

