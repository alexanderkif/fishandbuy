package org.myftp.fishandbuy.services;


import com.mongodb.MongoClient;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import org.bson.Document;
import org.myftp.fishandbuy.entities.Account;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class MyUserDetailsService implements UserDetailsService {

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private MongoClient mongoClient;

    public MyUserDetailsService() {}

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        MongoDatabase database = mongoClient.getDatabase("fish");
        MongoCollection<Document> collection = database.getCollection("colfish");
        Account account = accountRepository.findByEmail(email);
        if (account != null) {
            return new User(account.getEmail(), account.getPassword(),
                    true, true, true, true,
                    AuthorityUtils.createAuthorityList("USER"));
        }
        else{
            throw new UsernameNotFoundException("could not find the account '" + email + "'");
        }
//        org.bson.Document document = collection.find(Filters.eq("email",email)).first();
//        if(document!=null) {
//            String name = document.getString("name");
//            String surname = document.getString("surname");
//            String password = document.getString("password");
//            List<User> authorities = (List<String>) document.get("colfish");
//            UserDetails mongoUserDetails = new User(email,password,authorities.toArray(new String[authorities.size()]));
//            return mongoUserDetails;
//        }
//        return null;
    }
//    @Override
//    public UserDetails loadUserByUsername (String username) {
//        Account account = accountRepository.findByEmail(username);
//        if (account != null) {
//            return new User(account.getEmail(), account.getPassword(),
//                    true, true, true, true,
//                    AuthorityUtils.createAuthorityList("USER"));
//        }
//        else{
//            throw new UsernameNotFoundException("could not find the account '" + username + "'");
//        }
//    }
}

