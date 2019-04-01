package org.myftp.fishandbuy.controllers;

import org.myftp.fishandbuy.entities.Account;
import org.myftp.fishandbuy.services.AccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Objects;

@RestController
@RequestMapping("account")
public class AccountController {

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private PasswordEncoder encoder;

    @GetMapping("{email}")
    public Account getuser(@PathVariable String email) {
        return accountRepository.findByEmail(email.replace("((at))", "."));
    }

    @PostMapping
    public ResponseEntity adduser(@RequestBody Map<String, String> payload) {
        if (Objects.equals(accountRepository.findByEmail(payload.get("email")), null)){
            return ResponseEntity.ok(accountRepository.save(Account.builder()
                    .email(payload.get("email"))
                    .password(encoder.encode(payload.get("pass")))
                    .role("USER")
                    .phone(payload.get("phone"))
                    .enabled(true)
                    .build())
            );
        }
        else {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }
    }
}
