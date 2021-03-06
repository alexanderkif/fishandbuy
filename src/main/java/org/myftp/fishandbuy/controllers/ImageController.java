package org.myftp.fishandbuy.controllers;

import com.mongodb.BasicDBObject;
import com.mongodb.DBObject;
import com.mongodb.gridfs.GridFSDBFile;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.gridfs.GridFsOperations;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.security.Principal;
import java.util.Objects;


@RestController
@RequestMapping("image")
public class ImageController {

    @Autowired
    private GridFsOperations gridOperations;

    @GetMapping("{imageId}")
    public void getImageById(@PathVariable String imageId, HttpServletResponse response){
        // read file from MongoDB
        GridFSDBFile imageFile = gridOperations.findOne(new Query(Criteria.where("_id").is(imageId)));
        if(imageFile!=null) {
            try {
                imageFile.writeTo(response.getOutputStream());
                response.setContentType("image/*");
                response.flushBuffer();
            } catch (IOException ex) {
                throw new RuntimeException("IOError writing file to output stream");
            }
        }
    }

    @PostMapping
    public String saveImage(Model model, @ModelAttribute("file") MultipartFile file,
                            Principal principal){
        if (!Objects.equals(file.getOriginalFilename(), "")) {
            // Define metaData
            DBObject metaData = new BasicDBObject();
            metaData.put("account", principal.getName());
            metaData.put("type", "image");
            // Store file to MongoDB
            try {
                return gridOperations.store(file.getInputStream(), file.getOriginalFilename(), "image/*", metaData).getId().toString();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        return "error";
    }

    @DeleteMapping("{imageId}")
    public String deleteImageById(@PathVariable String imageId){
        try {
            gridOperations.delete(new Query(Criteria.where("_id").is(imageId)));
            return "deleted";
        }catch (Exception e) {
            return "error";
        }
    }
}
