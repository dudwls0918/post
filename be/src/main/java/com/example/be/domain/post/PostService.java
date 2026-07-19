package com.example.be.domain.post;

import com.example.be.domain.post.dto.PostCreateRequest;
import com.example.be.domain.post.dto.PostResponse;
import com.example.be.domain.post.dto.PostUpdateRequest;
import com.example.be.domain.user.User;
import com.example.be.domain.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class PostService {

    private final PostRepository postRepository;
    private final UserRepository userRepository;

    public Long createPost(PostCreateRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("회원이 존재하지 않습니다."));

        Post post = new Post(
                request.getTitle(),
                request.getContent(),
                user
        );

        Post savedPost = postRepository.save(post);

        return savedPost.getId();
    }

    @Transactional(readOnly = true)
    public List<PostResponse> getPosts() {
        return postRepository.findAll()
                .stream()
                .map(PostResponse::new)
                .toList();
    }

    @Transactional(readOnly = true)
    public PostResponse getPost(Long id) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("게시글이 존재하지 않습니다."));

        return new PostResponse(post);
    }

    public Long updatePost(Long id, PostUpdateRequest request) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("게시글이 존재하지 않습니다."));

        post.update(request.getTitle(), request.getContent());

        return post.getId();
    }

    public void deletePost(Long id) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("게시글이 존재하지 않습니다."));

        postRepository.delete(post);
    }
}