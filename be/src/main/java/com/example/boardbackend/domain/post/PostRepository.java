package com.example.boardbackend.domain.post;

//JpaRepository를 쓰기 위함 -> Spring Data Jpa가 제공하는 기본 DB기능 모음
import org.springframework.data.jpa.repository.JpaRepository;

public interface PostRepository extends JpaRepository<Post,Long> {
}
