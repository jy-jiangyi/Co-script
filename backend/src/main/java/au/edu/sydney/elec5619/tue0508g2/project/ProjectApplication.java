package au.edu.sydney.elec5619.tue0508g2.project;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class ProjectApplication {

	public static void main(String[] args) {
		SpringApplication app = new SpringApplication(ProjectApplication.class);
		app.setAdditionalProfiles("secret");
		app.run(args);
	}

}
