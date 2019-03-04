package org.myftp.fishandbuy.services;

import org.myftp.fishandbuy.entities.Account;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("account")
public class AccountController {

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private PasswordEncoder encoder;

    @GetMapping("{email}")
    public ResponseEntity getuser(@PathVariable String email) {
        return ResponseEntity.ok(accountRepository.findByEmail(email));
    }

    @PostMapping
    public ResponseEntity adduser(@RequestBody Map<String, String> payload) {
        String email = payload.get("email");
        String password = payload.get("pass");
        String phone = payload.get("phone");
        return ResponseEntity.ok(accountRepository.save(Account.builder()
                .email(email)
                .password(encoder.encode(password))
                .role("USER")
                .phone(phone)
                .enabled(true)
                .build()
            )
        );
    }
}
