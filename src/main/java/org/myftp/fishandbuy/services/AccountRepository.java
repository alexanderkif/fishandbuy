package org.myftp.fishandbuy.services;


import org.myftp.fishandbuy.entities.Account;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Set;
import java.util.stream.Stream;

public interface AccountRepository extends MongoRepository<Account, String> {

    Account findByEmail(String email);
    Stream<Account> findAllByPlaceContaining(String place);

}
