package com.example.be.domain.user;


import com.example.be.domain.user.dto.UserCreateRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
}
