package com.example.boardbackend.domain.post;

import jakarta.persistence.*; //JPA 관련 어노테이션을 쓰기 위함
import lombok.AccessLevel; //롬복 기능을 쓰기 위함
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime; //시간 지정을 위한 자바 클래스


@Entity
@Getter
@NoArgsConstructor(access=AccessLevel.PROTECTED)
public class Post {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @Column(nullable = false)
    private String author;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    public Post(String title, String content, String author){
        this.title=title;
        this.content=content;
        this.author=author;
        this.createdAt=LocalDateTime.now();
        this.updatedAt=LocalDateTime.now();
    }

    public void update(String title, String content){
        this.title=title;
        this.content=content;
        this.updatedAt=LocalDateTime.now();
    }

}
