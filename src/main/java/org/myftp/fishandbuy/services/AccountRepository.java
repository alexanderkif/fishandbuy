package org.myftp.fishandbuy.services;


import org.myftp.fishandbuy.entities.Account;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface AccountRepository extends MongoRepository<Account, String> {

    Account findByEmail(String email);

}
