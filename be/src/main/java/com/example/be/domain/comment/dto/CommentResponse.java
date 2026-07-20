package com.example.be.domain.comment.dto;

import com.example.be.domain.comment.Comment;
import lombok.Getter;
import org.springframework.cglib.core.Local;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
public class CommentResponse {
    private Long id;
    private String content;

    private Long postId;

    private Long userId;
    private String nickname;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public CommentResponse(Comment comment) {
        this.id = comment.getId();
        this.content = comment.getContent();

        this.postId = comment.getPost().getId();

        this.userId = comment.getUser().getId();
        this.nickname = comment.getUser().getNickname();

        this.createdAt = comment.getCreatedAt();
        this.updatedAt = comment.getUpdatedAt();
    }
}


