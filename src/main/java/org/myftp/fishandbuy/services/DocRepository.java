package org.myftp.fishandbuy.services;

import org.myftp.fishandbuy.entities.Account;
import org.myftp.fishandbuy.entities.Doc;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface DocRepository extends MongoRepository<Doc, String> {

    List<Doc> findByOwner(String docowner);
    List<Doc> findAll();
    Doc findByTitle(String title);

}
