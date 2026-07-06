package com.example.boardbackend.domain.post;

import com.example.boardbackend.domain.post.dto.PostCreateRequest;
import com.example.boardbackend.domain.post.dto.PostResponse;
import com.example.boardbackend.domain.post.dto.PostUpdateRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class PostService {

    private final PostRepository postRepository;

    public Long createPost(PostCreateRequest request){
        Post post = new Post(
                request.getTitle(),
                request.getContent(),
                request.getAuthor()
        );

        Post savedPost = postRepository.save(post);

        return savedPost.getId();
    }

    @Transactional(readOnly = true)
    public List<PostResponse> getPosts(){
        return postRepository.findAll()
                .stream()
                .map(PostResponse::new)
                .toList();

    }

    @Transactional(readOnly = true)
    public PostResponse getPost(Long id){
        Post post= postRepository.findById(id)
                .orElseThrow(()-> new IllegalArgumentException("게시글이 존재하지 않습니다."));

        return new PostResponse(post);
    }

    public Long updatePost(Long id, PostUpdateRequest request){
        Post post = postRepository.findById(id)
                .orElseThrow(()->new IllegalArgumentException("게시글이 존재하지 않습니다."));
        post.update(request.getTitle(), request.getContent());

        return post.getId();
    }

    public void deletePost(Long id) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("게시글이 존재하지 않습니다."));

        postRepository.delete(post);
    }
}
