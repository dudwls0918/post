package com.example.be.domain.comment;

import com.example.be.domain.comment.dto.CommentCreateRequest;
import com.example.be.domain.comment.dto.CommentResponse;
import com.example.be.domain.comment.dto.CommentUpdateRequest;
import com.example.be.domain.post.Post;
import com.example.be.domain.post.PostRepository;
import com.example.be.domain.user.User;
import com.example.be.domain.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class CommentService {

    private final CommentRepository commentRepository;
    private final PostRepository postRepository;
    private final UserRepository userRepository;

    public Long createComment(Long postId,CommentCreateRequest request){
        Post post=postRepository.findById(postId)
                .orElseThrow(()->new IllegalArgumentException("게시글이 존재하지 않습니다"));

        User user=userRepository.findById(request.getUserId())
                .orElseThrow(()->new IllegalArgumentException("회원이 존재하지 않습니다."));

        Comment comment=new Comment(
                request.getContent(),
                post,
                user
        );

        Comment savedComment=commentRepository.save(comment);

        return savedComment.getId();
    }

    @Transactional(readOnly = true)
    public List<CommentResponse> getComments(Long postId){
        return commentRepository.findByPostId(postId)
                .stream()
                .map(CommentResponse::new)
                .toList();
    }

    public Long updateComment(Long commentId, CommentUpdateRequest request){
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(()->new IllegalArgumentException("댓글이 존재하지 않습니다."));

        comment.update(request.getContent());

        return comment.getId();
    }

    public void deleteComment(Long commentId){
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(()->new IllegalArgumentException(("댓글이 존재하지 않습니다.")));

        commentRepository.delete(comment);
    }
}
