package com.example.boardbackend.domain.post;

import com.example.boardbackend.domain.post.dto.PostCreateRequest;
import com.example.boardbackend.domain.post.dto.PostResponse;
import com.example.boardbackend.domain.post.dto.PostUpdateRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;

    @PostMapping
    public ResponseEntity<Long> createPost(@RequestBody @Valid PostCreateRequest request){
        Long postId = postService.createPost(request);
        return ResponseEntity.ok(postId);
    }

    @GetMapping
    public ResponseEntity<List<PostResponse>> getPosts(){
        List<PostResponse> posts=postService.getPosts();
        return ResponseEntity.ok(posts);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PostResponse> getPost(@PathVariable Long id){
        PostResponse post = postService.getPost(id);

        return ResponseEntity.ok(post);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Long> updatePost(@PathVariable Long id, @RequestBody @Valid PostUpdateRequest request){
        Long postId=postService.updatePost(id, request);
        return ResponseEntity.ok(postId);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePost(@PathVariable Long id){
        postService.deletePost(id);
        return ResponseEntity.noContent().build();
    }
}
