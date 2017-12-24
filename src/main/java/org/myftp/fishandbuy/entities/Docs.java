package org.myftp.fishandbuy.entities;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Document(collection="Docs")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Docs {

    @Id
    private String id;
    private Date date;
    private String title;
    private String text;
    private Account owner;

}
