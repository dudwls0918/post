package com.example.be.domain.user;

import com.example.be.domain.user.dto.UserCreateRequest;
import com.example.be.domain.user.dto.UserResponse;
import com.example.be.domain.user.dto.UserUpdateRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

    @GetMapping
    public ResponseEntity<List<UserResponse>>getUsers(){
        List<UserResponse> users=userService.getUsers();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getUser(@PathVariable Long id){
        UserResponse user = userService.getUser(id);
        return ResponseEntity.ok(user);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Long> updateUser(@PathVariable Long id, @RequestBody @Valid UserUpdateRequest request){
        Long userId= userService.updateUser(id,request);
        return ResponseEntity.ok(userId);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id){
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

}
