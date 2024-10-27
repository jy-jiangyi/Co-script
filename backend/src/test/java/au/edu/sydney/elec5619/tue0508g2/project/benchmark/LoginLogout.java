package au.edu.sydney.elec5619.tue0508g2.project.benchmark;
import au.edu.sydney.elec5619.tue0508g2.project.ProjectApplication;
import au.edu.sydney.elec5619.tue0508g2.project.controller.MvcTools;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.test.context.SpringBootTest;
import org.openjdk.jmh.annotations.*;
import org.openjdk.jmh.infra.Blackhole;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.web.client.RestTemplate;

import java.util.concurrent.TimeUnit;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@State(Scope.Benchmark)
@BenchmarkMode(Mode.AverageTime)
@Fork(value = 1)
@Warmup(iterations = 1)
@Measurement(iterations = 2)
@OutputTimeUnit(TimeUnit.MILLISECONDS)
public class LoginLogout {

    @LocalServerPort
    private int port;

    private ConfigurableApplicationContext context;
    private final MvcTools mvcTools = new MvcTools();

    private RestTemplate restTemplate;

    @Setup
    public void env_init(){
        context = SpringApplication.run(ProjectApplication.class);
        port = context.getEnvironment().getProperty("local.server.port", Integer.class, 8080); // 获取实际端口

        mvcTools.setPort(port);
        restTemplate = mvcTools.getRestTemplate();
    }

    @Benchmark
    public void testInAndOut(Blackhole blackhole) {
        mvcTools.login(restTemplate);
        blackhole.consume(mvcTools.logout(restTemplate));
    }

}
