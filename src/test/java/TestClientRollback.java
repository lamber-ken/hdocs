
import org.junit.Test;

public class TestClientRollback {

    @Test
    public void testSavepointAndRollback() throws Exception {

        // test 11

        System.out.println(1 / 0);
    }

}
