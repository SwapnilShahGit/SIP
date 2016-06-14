package com.soti.backend.swapnilParser;

import java.io.IOException;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.joda.time.DateTime;
import org.joda.time.format.DateTimeFormat;
import org.joda.time.format.DateTimeFormatter;
import org.joda.time.format.DateTimeFormatterBuilder;
import org.joda.time.format.DateTimeParser;

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
       String pattern = createRegex("^(?:(?:31(\\/|-|\\.)(?:0?[13578]|1[02]|(?:Jan|Mar|May|Jul|Aug|Oct|Dec)))\\1|(?:(?:29|30)(\\/|-|\\.)(?:0?[1,3-9]|1[0-2]|(?:Jan|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec))\\2))(?:(?:1[6-9]|[2-9]\\d)?\\d{2})$|^(?:29(\\/|-|\\.)(?:0?2|(?:Feb))\\3(?:(?:(?:1[6-9]|[2-9]\\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\\d|2[0-8])(\\/|-|\\.)(?:(?:0?[1-9]|(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep))|(?:1[0-2]|(?:Oct|Nov|Dec)))\\4(?:(?:1[6-9]|[2-9]\\d)?\\d{2})$");
       
       DateTime myDate;
       if (DateTime.parse("01/1/2000", "dd-MM-yyyy")){
    	   System.out.println("found 1");
       }
       Pattern r = Pattern.compile(pattern);
       Matcher m = r.matcher("01/1/2000");
       if (m.find()){
    	   System.out.println("found 1");
       } else {
    	   System.out.println("fdoajshfahfsaihdf");
       }
       DateTimeParser[] parsers = { 
    		   DateTimeFormat.forPattern("yyyy-MM-dd").getParser(),
    		   DateTimeFormat.forPattern("yyyy/MM/dd").getParser()
       };
       
       DateTimeFormatter formatter = new DateTimeFormatterBuilder().append(null, parsers).toFormatter();
       DateTime date1 = formatter.parseDateTime("2016/03/02");
       //DateTime date2 = formatter;

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