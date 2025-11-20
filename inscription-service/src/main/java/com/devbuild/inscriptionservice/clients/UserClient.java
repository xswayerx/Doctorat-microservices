package com.devbuild.inscriptionservice.clients;


import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.devbuild.inscriptionservice.dto.UserResponseWrapper;
import com.github.andrewoma.dexx.collection.List;

@FeignClient(name = "user-service", path = "/users")
public interface UserClient {

    @GetMapping("/{id}")
    UserResponseWrapper getUserById(@PathVariable("id") String id);
    @GetMapping
    List<UserResponseWrapper> getAllUsers();
}

