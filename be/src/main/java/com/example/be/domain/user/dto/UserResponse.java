package com.example.be.domain.user.dto;

import com.example.be.domain.user.User;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class UserResponse {

    private Long id;
    private String email;
    private String nickname;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public UserResponse(User user){
        this.id=user.getId();
        this.email=user.getEmail();
        this.nickname=user.getNickname();
        this.createdAt=user.getCreatedAt();
        this.updatedAt=user.getUpdatedAt();
    }
}
