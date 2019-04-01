package org.myftp.fishandbuy.controllers;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;

@Controller
@RequestMapping("/")
public class IndexController {

    public String index() {
        return "index";
    }

    @RequestMapping(value = "/user", method = RequestMethod.GET)
    @ResponseBody
    public String currentUserName(Principal principal) {
        try {
            return principal.getName();
        } catch (Exception e) {
            return "nouser";
        }
    }

    @RequestMapping(value = "/role", method = RequestMethod.GET)
    @ResponseBody
    public String currentUserRole() {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        return authentication.getAuthorities().toString();
    }
}
