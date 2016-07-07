package com.soti.backend.swapnilParser;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.nio.file.Paths;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.Formatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
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
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;



public class App 
{
	 public static void main(String[] args) throws IOException {
		 File folder = new File(System.getProperty("user.dir")+ "/PDFS/UnParsedFiles");
		 File[] listOfFiles = folder.listFiles();
	     PdfToText pdfManager = new PdfToText();
	     
		 for (int i = 0; i < listOfFiles.length; i++){
			 JSONObject obj = new JSONObject();
			 pdfManager.setFilePath(listOfFiles[i].toString());
			 String rawtext = pdfManager.ToText();
			 obj.put("rawtext", rawtext);
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
		    
		     //course code
		     String coursecodepattern = "[A-Z]{3}[0-9]{3}[H|Y][1|5][F|S|Y]?";
		     Pattern coursecode = Pattern.compile(coursecodepattern);
		     Map<String, Integer> results = new HashMap<String, Integer>();
		     
		     count = 0;
		     Matcher m = coursecode.matcher(rawtext);
		     String finalcoursecode = "hi";
		     int maxcoursecode = 0;
		     while (m.find()){
		     	count++;
		     	if (results.containsKey(m.group())){
		     		results.put(m.group(), results.get(m.group()) + 1);
		     		if (results.get(m.group()) > maxcoursecode){
		     			finalcoursecode = m.group();
		     			maxcoursecode = results.get(m.group());
		     		}
		     	} else{
		     		results.put(m.group(), 1);
		     	}
		     	   }   

		     obj.put("code", finalcoursecode);
		     
		     //name of the university
		     String universitycampus = "";
		     System.out.println(Character.toString(finalcoursecode.charAt(7)));
		     if (Character.toString(finalcoursecode.charAt(7)).equals("5")){
		    	 universitycampus = "UTM";
		    	 System.out.println(universitycampus);
		     } else {
		    	 universitycampus = "UTSG";
		     }
		     obj.put("university", universitycampus);
		     
		     //name of the course
		     obj.put("name", "");
		     //description of the course
		     obj.put("description", "");
		     //division of the course
		     obj.put("division", "");
		     //department the course is from
		     obj.put("department", "");
		     //prerequisities of the course
		     obj.put("prerequisites", "");
		     obj.put("exclusions", "");
		     obj.put("level", "");
		     obj.put("campus", "");
		     obj.put("term", "");
		     obj.put("meeting_sections", "");
		     obj.put("graded_evaluations", "");
		     obj.put("coursecode", "");


		        
		        
		        
			 try{
				 FileWriter file = new FileWriter(System.getProperty("user.dir") + "/PDFS/JSONOutput/" + finalcoursecode + ".json");
				 file.write(obj.toJSONString());
				 file.flush();
				 file.close();
						 
						 	
			 } catch (IOException e){
				 e.printStackTrace();
			 }
			 
		 }

	 }
}
/*
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
*/