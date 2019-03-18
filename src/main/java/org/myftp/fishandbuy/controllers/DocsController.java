package org.myftp.fishandbuy.controllers;

import com.mongodb.BasicDBObject;
import com.mongodb.DBObject;
import com.mongodb.gridfs.GridFSDBFile;
import org.myftp.fishandbuy.entities.Account;
import org.myftp.fishandbuy.entities.Doc;
import org.myftp.fishandbuy.services.AccountRepository;
import org.myftp.fishandbuy.services.DocRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.gridfs.GridFsOperations;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.ui.Model;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.security.Principal;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("doc")
public class DocsController {

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private DocRepository docRepository;

    private String find = "";
    private String place = "";
    final int docsOnPage = 3;

    public DocsController() {
    }

    @GetMapping
    public List list(@ModelAttribute("page") String p,
                        @ModelAttribute("find") String find,
                        @ModelAttribute("place") String place,
                        @ModelAttribute("mylots") String mylots,
                        Principal principal) {
        Integer page;
        List<Doc> all;
        Long pages = 1L;
        if (Objects.equals(p, "")) page=1;
        else page = Integer.valueOf(p);

        if (!Objects.equals(find, "") && !Objects.equals(find, "undefined"))this.find = find;
        if (!Objects.equals(place, "") && !Objects.equals(place, "undefined"))this.place = place;
        if (Objects.equals(place, "everywhere"))this.place = "";

        PageRequest pageRequest = new PageRequest(page-1, docsOnPage, Sort.Direction.DESC, "date");
        if (Objects.equals(mylots, "true")) {
            all = docRepository.findByEmail(principal.getName(), pageRequest);
            pages = Math.round(Math.ceil(1.0 * docRepository
                    .findByEmailAndPlaceContainsAndTitleContainsIgnoreCaseOrEmailAndPlaceContainsAndTextContainsIgnoreCase(
                            principal.getName(), this.place, this.find,
                            principal.getName(), this.place, this.find).size() / docsOnPage));
        } else {
            all = docRepository
                    .findByPlaceContainsAndTitleContainsIgnoreCaseOrPlaceContainsAndTextContainsIgnoreCase(this.place,
                            this.find, this.place, this.find, pageRequest);
            pages = Math.round(Math.ceil(1.0 * docRepository
                    .findByPlaceContainsAndTitleContainsIgnoreCaseOrPlaceContainsAndTextContainsIgnoreCase(this.place,
                            this.find, this.place, this.find).size() / docsOnPage));
        }

        Set places = docRepository.findByPlaceContaining("")
                .map(Doc::getPlace)
                .collect(Collectors.toSet());

        if (pages==0) pages=1L;

        List list = new ArrayList();
        list.add(all);
        list.add(places);
        list.add(pages);
        return list;
    }

    @GetMapping("{id}")
    public Doc getDoc(@PathVariable String id) {
        return docRepository.findById(id);
    }

//    @RequestMapping("/edit")
//    public String edit(Model model, @ModelAttribute("title") String title, Principal principal) {
//        Doc doc = Doc.builder()
//                .title("")
//                .text("")
//                .place("")
//                .build();
//        if (title!=null){
//            Doc tmp = docRepository.findByTitle(title);
//            if (tmp!=null && tmp.getEmail().equals(principal.getName())){
//                doc = tmp;
//            }
//        }
//        model.addAttribute("doc", doc);
//        return "edit";
//    }

//    @PostMapping
//    public String saveDoc(@RequestBody Map<String, String> payload, Principal principal) {
//        System.out.println("");
//        return "";
//    }

    @PostMapping
    public String adddoc(Model model, @ModelAttribute("id") String id,
                         @ModelAttribute("title") String title,
                         @ModelAttribute("text") String text,
                         @ModelAttribute("place") String place,
                         @ModelAttribute("price") String price,
                         @ModelAttribute("imgFileIds") String imgFileIds,
                         Principal principal) {

        System.out.println("post here");
        try {
//            List<Doc> docs = docRepository.findByEmail(principal.getName());
//            Doc doc = docs.stream()
//                    .filter(d -> d.getTitle().equals(title))
//                    .findFirst()
//                    .orElse(new Doc());
            Doc doc = Doc.builder()
                    .email(principal.getName())
                    .date(new Date())
                    .title(title)
                    .text(text)
                    .place(place)
                    .price(price)
                    .imgFileIds(imgFileIds.split(","))
                    .build();
                docRepository.save(doc);
        } catch (Exception e){
            return "error";
        }
        return "saved";
    }

//    @RequestMapping("/list")
//    public String list(Model model, Principal principal) {
//        List<Doc> docs = docRepository.findByEmail(principal.getName());
//        model.addAttribute("docs", docs);
//        return "list";
//    }
//
//    @RequestMapping("/register")
//    public String register(Model model, Principal principal) {
//        String phone = "";
//        try{
//            Account account = accountRepository.findByEmail(principal.getName());
////            phone = account.getPhone();
//        }catch(Exception e){
//            System.out.println("No user in repository "+e);
//        }
//        model.addAttribute("phone", phone);
//        return "register";
//    }


}
