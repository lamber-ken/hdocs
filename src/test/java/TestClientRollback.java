
import org.junit.Test;

public class TestClientRollback {

    @Test
    public void testSavepointAndRollback() throws Exception {

        // test 000

        Thread.sleep(30000);

        System.out.println(1 / 0);
    }

}
