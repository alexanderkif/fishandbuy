package org.myftp.fishandbuy.services;

import org.myftp.fishandbuy.entities.Doc;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.stream.Stream;

public interface DocRepository extends MongoRepository<Doc, String> {

    List<Doc> findByEmail(String email);
    List<Doc> findByEmail(String email, Pageable pageable);
    List<Doc> findAll();
    Page<Doc> findAll(Pageable pageable);
    Doc findById(String id);
    List<Doc> findByPlaceContainsAndTitleContainsIgnoreCaseOrPlaceContainsAndTextContainsIgnoreCase(String place1, String title, String place2, String text, Pageable pageable);
    List<Doc> findByPlaceContainsAndTitleContainsIgnoreCaseOrPlaceContainsAndTextContainsIgnoreCase(String place1, String title, String place2, String text);
    List<Doc>  findByEmailAndPlaceContainsAndTitleContainsIgnoreCaseOrEmailAndPlaceContainsAndTextContainsIgnoreCase(String email1, String place1, String title, String email2, String place2, String text);
    Doc findByTitle(String title);

    Stream<Doc> findByPlaceContaining(String place);
}
