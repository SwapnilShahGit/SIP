package com.soti.backend.swapnilParser;

import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Formatter;
import java.util.List;

import org.joda.time.DateTime;
import org.joda.time.format.DateTimeFormat;
import org.joda.time.format.DateTimeFormatter;
import org.joda.time.format.DateTimeFormatterBuilder;
import org.joda.time.format.DateTimeParser;
import org.joda.time.format.ISODateTimeFormat;
import org.ocpsoft.prettytime.PrettyTime;

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
       String rawtext = pdfManager.ToText();
       
       System.out.println(rawtext);
       DateTimeParser[] parsers = { 
    		   DateTimeFormat.forPattern("yyyy-MM-dd").getParser(),
    		   DateTimeFormat.forPattern("yyyy/MM/dd").getParser()
       };
       
       DateTimeFormatter formatter = new DateTimeFormatterBuilder().append(null, parsers).toFormatter();
       DateTime date1 = formatter.parseDateTime("2016/03/02");

       System.out.println(date1);
       
       
}
    
    public static String createRegex(String s) {
        StringBuilder b = new StringBuilder();
        for(int i=0; i<s.length(); ++i) {
            char ch = s.charAt(i);
            if ("\\.^$|?*+[]{}()".indexOf(ch) != -1)
                b.append('\\').append(ch);
            else if (Character.isLetter(ch))
                b.append("[A-Za-z]");
            else if (Character.isDigit(ch))
                b.append("\\d");
            else
                b.append(ch);
        }
        return b.toString();
    }
}

//SimpleDateFormat ft = new SimpleDateFormat("yyyy-MM-dd"); 
 
/*
Date t = new Date(); 
//This is the date which has the format of ft defined above

try { 
    //parse the date based on the format ft defined above
    t = ft.parse("2016-09-12"); 
    System.out.println("Parsed date : " + t); 
} catch (ParseException e) { 
    System.out.println("Not able to parse " + ft); 
}
*/