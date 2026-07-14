package com.example.be.domain.user;

import com.example.be.domain.user.dto.UserCreateRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping
    public ResponseEntity<Long> createUser(@RequestBody @Valid UserCreateRequest request){
        Long userId = userService.createUser(request);
        return ResponseEntity.ok(userId);
    }
}
