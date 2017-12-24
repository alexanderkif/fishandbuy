package org.myftp.fishandbuy.services;

import org.myftp.fishandbuy.entities.Account;
import org.myftp.fishandbuy.entities.Docs;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface DocsRepository extends MongoRepository<Docs, String> {

    List<Docs> findByOwner(Account docowner);
    List<Docs> findAll();
//    Docs findByTitledoc(String titledoc);

}
