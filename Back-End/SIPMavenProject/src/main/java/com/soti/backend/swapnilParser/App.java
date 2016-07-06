package com.soti.backend.swapnilParser;

import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.Formatter;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

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


public class App 
{
    public static void main(String[] args) throws IOException {
       PdfToText pdfManager = new PdfToText();
       pdfManager.setFilePath(System.getProperty("user.dir") + "/src/main/java/com/soti/backend/swapnilParser/csSyllabus.pdf");
       String rawtext = pdfManager.ToText();
       System.out.println(rawtext);
       String lines[] = rawtext.split("\\r?\\n");
       String pattern = "(?<!\\S)(?:(?:(?:31(\\/|-|\\.)(?:0?[13578]|1[02]|(?:Jan|Mar|May|Jul|Aug|Oct|Dec)))\\1|"
       		+ "(?:(?:29|30)(\\/|-|\\.)(?:0?[1,3-9]|1[0-2]|(?:Jan|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec))\\2))"
       		+ "(?:(?:1[6-9]|[2-9]\\d)?\\d{2})|(?:(?:1[6-9]|[2-9]\\d)?\\d{2})(\\/|-|\\.)(?:(?:(?:0?[13578]|1[02]|"
       		+ "(?:Jan|Mar|May|Jul|Aug|Oct|Dec))\\3(?:31))|(?:(?:0?[1,3-9]|1[0-2]|(?:Jan|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)"
       		+ ")\\3(?:29|30)))|(?:29(\\/|-|\\.)(?:0?2|(?:Feb))\\4(?:(?:(?:1[6-9]|[2-9]\\d)?(?:0[48]|[2468][048]|[13579][26])|"
       		+ "(?:(?:16|[2468][048]|[3579][26])00))))|(?:(?:(?:(?:1[6-9]|[2-9]\\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|"
       		+ "[2468][048]|[3579][26])00)))(\\/|-|\\.)(?:0?2|(?:Feb))\\5(?:29))|(?:0?[1-9]|1\\d|2[0-8])(\\/|-|\\.)(?:(?:0?[1-9]|"
       		+ "(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep))|(?:1[0-2]|(?:Oct|Nov|Dec)))\\6(?:(?:1[6-9]|[2-9]\\d)?\\d{2})|(?:(?:1[6-9]|"
       		+ "[2-9]\\d)?\\d{2})(\\/|-|\\.)(?:(?:0?[1-9]|(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep))|(?:1[0-2]|(?:Oct|Nov|Dec)))\\7"
       		+ "(?:0?[1-9]|1\\d|2[0-8]))(?!\\S)";
       Pattern r = Pattern.compile(pattern);
       List<String> matchedcharacters = new ArrayList<String>();

       int count = 0;
       for (String x : lines){
    	   Matcher m = r.matcher(x);
    	   while (m.find()){
    		   count++;
    		   matchedcharacters.add(x);
    	   }   
       }
       
       

       //what do we do if the date is not valid?
       
       //properly parse the date into the correct format
       List<DateTime> outputdates = new ArrayList<DateTime>();
       Parser parser = new Parser();
       for (String x : matchedcharacters){
    	   List<DateGroup> group = parser.parse(x);
    	   if (group.toString() == "[]"){
    		   continue;
    	   }
    	   List<Date> date = (group.get(0)).getDates();
           Date sampledate = date.get(0);
           DateTime dt = new DateTime(sampledate);
           outputdates.add(dt);
           //System.out.println(dt.getMonthOfYear() + "-" + dt.getDayOfMonth() + "-" + dt.getYear());
       }
       
       for (DateTime dt : outputdates){
           System.out.println(dt.getMonthOfYear() + "-" + dt.getDayOfMonth() + "-" + dt.getYear());
           //System.out.println(dt.getHourOfDay());
       }
       


       
       
}
 
}

