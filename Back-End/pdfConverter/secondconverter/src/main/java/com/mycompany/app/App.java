package src.main.java.com.mycompany.app;
import java.io.IOException;


/**
 * Hello world!
 *
 */
public class App 
{
    public static void main(String[] args) throws IOException {

       SWAPNILPDFManager pdfManager = new SWAPNILPDFManager();
       pdfManager.setFilePath(System.getProperty("user.dir") + "/src/main/java/com/mycompany/app/Syllabus.pdf");
       System.out.println(pdfManager.ToText());       
}
}
