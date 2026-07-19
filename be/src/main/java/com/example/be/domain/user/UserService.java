package com.example.be.domain.user;


import com.example.be.domain.user.dto.UserCreateRequest;
import com.example.be.domain.user.dto.UserResponse;
import com.example.be.domain.user.dto.UserUpdateRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class UserService {

    private final UserRepository userRepository;

    public Long createUser(UserCreateRequest request){
        if (userRepository.existsByEmail(request.getEmail())){
            throw new IllegalArgumentException("이미 사용 중인 이메일입니다.");
        }

        User user= new User(
                request.getEmail(),
                request.getPassword(),
                request.getNickname()
        );

        User savedUser=userRepository.save(user);

        return savedUser.getId();

    }

    @Transactional(readOnly = true)
    public List<UserResponse> getUsers(){
        return userRepository.findAll().
                stream().
                map(UserResponse::new).
                toList();

    }

    @Transactional(readOnly = true)
    public UserResponse getUser(Long id){
        User user=userRepository.findById(id)
                .orElseThrow(()->new IllegalArgumentException("회원이 존재하지 않습니다."));

        return new UserResponse(user);
    }

    public Long updateUser(Long id, UserUpdateRequest request){
        User user=userRepository.findById(id)
                .orElseThrow(()->new IllegalArgumentException("회원이 존재하지 않습니다."));

        user.updateNickname(request.getNickname());

        return user.getId();
    }

    public void deleteUser(Long id){
        User user= userRepository.findById(id)
                .orElseThrow(()->new IllegalArgumentException("회원이 존재하지 않습니다."));

        userRepository.delete(user);
    }
}
