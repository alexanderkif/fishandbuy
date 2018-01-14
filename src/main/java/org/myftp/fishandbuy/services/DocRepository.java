package org.myftp.fishandbuy.services;

import org.myftp.fishandbuy.entities.Doc;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.stream.Stream;

public interface DocRepository extends MongoRepository<Doc, String> {

    List<Doc> findByOwner(String docowner);
    List<Doc> findAll();
    Page<Doc> findAll(Pageable pageable);
    Stream<Doc> findByTitleContainsIgnoreCaseOrTextContainsIgnoreCase(String title, String text, Pageable pageable);
//    List<Doc> findByTitleContainsOrTextContains(String title, String text, Pageable pageable);
    Doc findByTitle(String title);

}
