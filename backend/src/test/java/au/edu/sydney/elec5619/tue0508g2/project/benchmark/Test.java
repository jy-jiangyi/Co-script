package au.edu.sydney.elec5619.tue0508g2.project.benchmark;

import org.openjdk.jmh.annotations.*;
import org.openjdk.jmh.infra.Blackhole;

import java.util.concurrent.TimeUnit;

public class Test {

    /*
    @Benchmark
    @BenchmarkMode(Mode.AverageTime)
    @Warmup(iterations =1)
    @Measurement(iterations = 1)
    @Fork(value = 1)
    @OutputTimeUnit(TimeUnit.MILLISECONDS)*/
    public void testMethod(Blackhole blackhole) {
        int result = 0;
        for (int i = 0; i < 100000; i++) {
            result += (int) Math.sqrt(i);
        }
        blackhole.consume(result);
    }

}
