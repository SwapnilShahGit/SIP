package com.soti.backend.swapnilParser;

import java.io.IOException;
import com.mdimension.jchronic.Chronic;
import com.mdimension.jchronic.utils.Span;
import com.soti.backend.swapnilParser.PdfToText;

/**
 * Hello world!
 *
 */
public class App 
{
    public static void main(String[] args) throws IOException {
       PdfToText pdfManager = new PdfToText();
       pdfManager.setFilePath(System.getProperty("user.dir") + "/src/main/java/com/soti/backend/swapnilParser/Syllabus.pdf");
       String rawtext= pdfManager.ToText();
       System.out.println(rawtext);
       Span actualSpan = Chronic.parse(rawtext);
       System.out.println(actualSpan);
}
}
