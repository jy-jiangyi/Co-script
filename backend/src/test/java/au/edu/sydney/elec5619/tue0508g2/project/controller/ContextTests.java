package au.edu.sydney.elec5619.tue0508g2.project.controller;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
public class ContextTests {

    @Test
    public void contextLoads() {
        int x1 = 5;
        assertTrue(5==x1);
    }

}
