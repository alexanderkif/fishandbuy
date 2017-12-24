package org.myftp.fishandbuy;

import org.myftp.fishandbuy.services.AccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class FishandbuyApplication {

	public static void main(String[] args) {
		SpringApplication.run(FishandbuyApplication.class, args);
	}
}
