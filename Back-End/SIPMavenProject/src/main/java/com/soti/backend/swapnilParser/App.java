package com.soti.backend.swapnilParser;

import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Formatter;
import java.util.List;

import org.joda.time.DateTime;
import org.joda.time.LocalDate;
import org.joda.time.LocalDate.Property;
import org.joda.time.format.DateTimeFormat;
import org.joda.time.format.DateTimeFormatter;
import org.joda.time.format.DateTimeFormatterBuilder;
import org.joda.time.format.DateTimeParser;
import org.joda.time.format.ISODateTimeFormat;
import org.ocpsoft.prettytime.PrettyTime;

import com.joestelmach.natty.DateGroup;
import com.joestelmach.natty.Parser;
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
       DateTimeParser[] parsers = { 
    		   DateTimeFormat.forPattern("yyyy-MM-dd").getParser(),
    		   DateTimeFormat.forPattern("yyyy/MM/dd").getParser(),
    		   DateTimeFormat.forPattern("MM/dd/yyyy").getParser(),
    		   DateTimeFormat.forPattern("MM-dd-yyyy").getParser(),
    		   DateTimeFormat.forPattern("MMddyyyy").getParser(),
    		   DateTimeFormat.forPattern("yyyyMMdd").getParser(),

       };
       
       Parser parser = new Parser();
       List<DateGroup> group = parser.parse("two weeks after September 4 2012");
       List<Date> date = (group.get(0)).getDates();
       Date sampledate = date.get(0);
       DateTime dt = new DateTime(sampledate);
       System.out.println(dt.getMonthOfYear() + "-" + dt.getDayOfMonth() + "-" + dt.getYear());

       DateTimeFormatter formatter = new DateTimeFormatterBuilder().append(null, parsers).toFormatter();
       //LocalDate date1 = formatter.parseLocalDate("Mon May 4");
       //System.out.println(date1.toDate());
       
       
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