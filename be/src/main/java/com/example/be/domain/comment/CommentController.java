package com.example.be.domain.comment;

import com.example.be.domain.comment.dto.CommentCreateRequest;
import com.example.be.domain.comment.dto.CommentResponse;
import com.example.be.domain.comment.dto.CommentUpdateRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;

    @PostMapping("api/posts/{postId}/comments")
    public ResponseEntity<Long> createComment(@PathVariable Long postId, @RequestBody @Valid CommentCreateRequest request){

        Long commentId = commentService.createComment(postId,request);

        return ResponseEntity.ok(commentId);
    }

    @GetMapping("/api/posts/{postId}/comments")
    public ResponseEntity<List<CommentResponse>> getComments(@PathVariable Long postId){
        List<CommentResponse> comments=commentService.getComments(postId);

        return ResponseEntity.ok(comments);
    }

    @PutMapping("/api/comments/{commentId}")
    public ResponseEntity<Long> updateComment(@PathVariable Long commentId, @RequestBody @Valid  CommentUpdateRequest request){
        Long updatedCommentId = commentService.updateComment(commentId, request);

        return ResponseEntity.ok(updatedCommentId);
    }

    @DeleteMapping("/api/comments/{commentId}")
    public ResponseEntity<Void> deleteComment(@PathVariable Long commentId){
        commentService.deleteComment(commentId);

        return ResponseEntity.noContent().build();
    }
}
