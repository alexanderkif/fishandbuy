package org.myftp.fishandbuy.controllers;

import com.mongodb.BasicDBObject;
import com.mongodb.DBObject;
import com.mongodb.gridfs.GridFSDBFile;
import org.myftp.fishandbuy.entities.Account;
import org.myftp.fishandbuy.entities.Doc;
import org.myftp.fishandbuy.services.AccountRepository;
import org.myftp.fishandbuy.services.DocRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.gridfs.GridFsOperations;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.security.Principal;
import java.util.*;
import java.util.stream.Collectors;

@Controller
public class IndexController {

    @Autowired
    GridFsOperations gridOperations;
    // this variable is used to store ImageId for other actions like: findOne or delete
    private String imageFileId = "";

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private DocRepository docRepository;

    @Autowired
    PasswordEncoder encoder;

    private String titl;
    private String li;
    final Integer docsOnPage = 3;

    public IndexController() {
    }

    @RequestMapping(value = "/")
    public String home(Model model) {
        return "redirect:/index?page=1";
    }


    @RequestMapping(value = "/index")
    public String index(Model model, @RequestParam("page") String p) {
        Integer page;
        if (Objects.equals(p, "")){
            page=1;
        } else{
            page = Integer.valueOf(p); }
        List<Doc> all = docRepository.findAll();
        Long pages = Math.round(Math.ceil(1.0 * all.size() / docsOnPage));
        Map maps = new HashMap();
//        List docs =
        all.stream()
                .sorted(Comparator.comparing(Doc::getDate).reversed())
                .skip((page-1)*docsOnPage)
                .limit(docsOnPage)
//                .collect(Collectors.toList());
                .forEach((d)->maps.put(d, accountRepository.findByEmail(d.getOwner())));
        li = "index";
        titl = "Index";
        model.addAttribute("links", li);
        model.addAttribute("titl", titl);
        model.addAttribute("docs", maps);
        model.addAttribute("pages", pages);
        model.addAttribute("page", page);
        return "index";
    }

    @RequestMapping("/login")
    public String login(Model model) {
        li = "login";
        titl = "Login";
        model.addAttribute("links", li);
        model.addAttribute("titl", titl);
        return "login";
    }

    @RequestMapping("/edit")
    public String edit(Model model, @ModelAttribute("title") String title, Principal principal) {
        Doc doc = Doc.builder()
                .title("Title (max 150 simbols)")
                .text("Enter new title and new text to add.\nEnter old title and new text to edit.\n" +
                        "Enter old title and 'delete' as text to delete.\n(max 700 simbols)")
                .build();
        if (title!=null){
            Doc tmp = docRepository.findByTitle(title);
            if (tmp!=null && tmp.getOwner().equals(principal.getName())){ //accountRepository.findByEmail(tmp.getOwner()).getEmail().equals(principal.getName())
                doc = tmp;
            }
        }
        li = "edit";
        titl = "Edit";
        model.addAttribute("doc", doc);
        model.addAttribute("links", li);
        model.addAttribute("titl", titl);
        return "edit";
    }

    @RequestMapping("/adddoc")
    public String adddoc(Model model, @ModelAttribute("title") String title,
                         @ModelAttribute("newTitle") String newTitle,
                         @ModelAttribute("file") MultipartFile file,
                         @ModelAttribute("deleteImage") String deleteImage,
                         @ModelAttribute("text") String text, Principal principal) {
        try {
            Account account = accountRepository.findByEmail(principal.getName());
            List<Doc> docs = docRepository.findByOwner(account.getEmail());
            Doc doc = docs.stream()
                    .filter(d -> d.getTitle().equals(title))
                    .findFirst()
                    .orElse(new Doc());
            if (Objects.equals(text.toLowerCase(), "delete")){
                docRepository.delete(doc);
                li = "edit";
                titl = "Deleted";
            }
            else {
                doc.setTitle(newTitle);
                doc.setText(text);
                doc.setDate(new Date());
                doc.setOwner(account.getEmail());
                if (!Objects.equals(file.getOriginalFilename(), "")) {
                    // Define metaData
                    DBObject metaData = new BasicDBObject();
                    metaData.put("account", account.getEmail());
                    metaData.put("type", "image");
                    // Store file to MongoDB
                    imageFileId = gridOperations.store(file.getInputStream(), file.getOriginalFilename(), "image/png", metaData).getId().toString();
                    doc.setImageFileId(imageFileId);
                }
                if (deleteImage.equals("on")){
                    // Delete image file
                    gridOperations.delete(new Query(Criteria.where("_id").is(doc.getImageFileId())));
                    doc.setImageFileId(null);
                }
                docRepository.save(doc);
                li = "edit";
                titl = "Saved";
            }
        } catch (Exception e){
            li = "edit";
            titl = "Not saved";
        }
        model.addAttribute("links", li);
        model.addAttribute("titl", titl);
        return "edit";
    }

    @RequestMapping("/img/{imageId}")
    public void gridfs_img(@PathVariable String imageId, HttpServletResponse response){
        // read file from MongoDB
        GridFSDBFile imageFile = gridOperations.findOne(new Query(Criteria.where("_id").is(imageId)));
        if(imageFile!=null) {
            try {
                imageFile.writeTo(response.getOutputStream());
                response.setContentType("image/gif");
                response.flushBuffer();
            } catch (IOException ex) {
                throw new RuntimeException("IOError writing file to output stream");
            }
        }
    }

    @RequestMapping("/list")
    public String list(Model model, Principal principal) {
        Account account = accountRepository.findByEmail(principal.getName());
        List<Doc> docs = docRepository.findByOwner(account.getEmail());
        li = "list";
        titl = "List";
        model.addAttribute("links", li);
        model.addAttribute("titl", titl);
        model.addAttribute("docs", docs);
        return "list";
    }

    @RequestMapping("/register")
    public String register(Model model) {
        li = "register";
        titl = "Register";
        model.addAttribute("links", li);
        model.addAttribute("titl", titl);
        return "register";
    }

    @RequestMapping("/adduser")
    public String adduser(Model model, @ModelAttribute("username") String email, @ModelAttribute("place") String place,
                          @ModelAttribute("password") String password, @ModelAttribute("phone") String phone) {
        if (accountRepository.findByEmail(email) == null
                && !Objects.equals(email, "") && !Objects.equals(password, "")) {
            accountRepository.save(Account.builder()
                    .email(email)
                    .place(place)
                    .phone(phone)
                    .password(encoder.encode(password))
                    .enabled(true)
                    .build()
            );
            li = "login";
            titl = "Added";
        } else {
            li = "login";
            titl = "Not added";
        }
        model.addAttribute("links", li);
        model.addAttribute("titl", titl);
        return "login";
    }
}
