package com.soti.backend.swapnilParser;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.net.URL;
import java.net.URLConnection;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.Formatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Scanner;
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
import org.json.simple.parser.JSONParser;



public class SyllabusParser 
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
		     String coursecodepattern = "[A-Z]{3}\\s?[0-9]{3}[H|Y][1|5][F|S|Y]?";
		     Pattern coursecode = Pattern.compile(coursecodepattern);
		     Map<String, Integer> results = new HashMap<String, Integer>();
		     
		     count = 0;
		     Matcher m = coursecode.matcher(rawtext);
		     String finalcoursecode = "";
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
		     		finalcoursecode = m.group();
		     	}
		     	   }
		     if (finalcoursecode.length() == 8){
		    	 finalcoursecode += "Y";
		     }
		     finalcoursecode = finalcoursecode.replaceAll("\\s+","");
		     obj.put("code", finalcoursecode);
		     
		     //name of the university
		     String universitycampus = "";
		     if (Character.toString(finalcoursecode.charAt(7)).equals("5")){
		    	 universitycampus = "UTM";
		     } else {
		    	 universitycampus = "UTSG";
		     }
		     obj.put("university", universitycampus);
		     String session;
		     String optionalcharacter = "";
		     
		     if (rawtext.contains("Summer") | rawtext.contains("summer")){
		    	 session = "5";
		    	 if (finalcoursecode.endsWith("F") | finalcoursecode.endsWith("S")){
		    		 optionalcharacter = finalcoursecode.substring(8);
		    	 }
		     }else if (rawtext.contains("Winter")| rawtext.contains("winter")) {
		    	 session = "1";
		     } else if (rawtext.contains("Winter")| rawtext.contains("winter")){
		    	 session = "9";
		     } else {
		    	 int month = Calendar.getInstance().get(Calendar.MONTH);
		    	 if (month < 4){
		    		 session = "1";
		    	 } else if (month >= 4 && month < 8){
		    		 session = "5";
		    	 } else {
		    		 session = "9";
		    	 }
		     }
		     int year = Calendar.getInstance().get(Calendar.YEAR);
		     String currentyear;
		     if (rawtext.contains(Integer.toString(year))){
		    	 currentyear = Integer.toString(year);
		     }else {
		    	 currentyear = Integer.toString(year +1);
		     }
		     String requestURL = "";
		     URLConnection connection;
		     URL uoftRequest;
		     Scanner scanner;
		     try{
		    	 requestURL = "http://localhost:4242/1.0/courses/" + finalcoursecode + currentyear + session + optionalcharacter;
		    	 uoftRequest = new URL(requestURL);
			     connection = uoftRequest.openConnection();
			     scanner = new Scanner(uoftRequest.openStream());
		     } catch (Exception e){
		    	 year += 1;
		         currentyear = Integer.toString(year);			 
		    	 requestURL = "http://localhost:4242/1.0/courses/" + finalcoursecode + currentyear + session + optionalcharacter;
		    	 uoftRequest = new URL(requestURL);
			     connection = uoftRequest.openConnection();  
			     scanner = new Scanner(uoftRequest.openStream());
		     }
			connection.setDoOutput(true);  
		     String response = scanner.useDelimiter("\\Z").next();
		     JSONParser parser2 = new JSONParser();
		     JSONObject json = null;
			try {
				//object = parser2.parse(response);
				json = (JSONObject)parser2.parse(response);

			} catch (org.json.simple.parser.ParseException e1) {
				e1.printStackTrace();
			}
		     scanner.close();
		    
		     
		     
		     
		     
		     //id of the course
		     obj.put("id",json.get("id").toString());

		     //name of the course
		     obj.put("name", json.get("name").toString());
		     //description of the course
		     obj.put("description", json.get("description").toString());
		     //division of the course
		     obj.put("division", json.get("division").toString());
		     //department the course is from
		     obj.put("department", json.get("department").toString());
		     //prerequisities of the course
		     obj.put("prerequisites", json.get("prerequisites").toString());
		     obj.put("exclusions", json.get("exclusions").toString());
		     obj.put("level", json.get("level").toString());
		     obj.put("campus", json.get("campus").toString());
		     obj.put("term", json.get("term").toString());
		     obj.put("meeting_sections", json.get("meeting_sections").toString());
		     
		     //list of graded evaluations
		     List<String> assignmentlines = new ArrayList<String>();
		     int assignmentcount = 0;
		        for (String x : lines){
		     	   if (x.contains("%")){
		     		   if (x.contains("Total 100%")){
		     			   continue;
		     		   }
		     		   assignmentcount += 1;
		     		   assignmentlines.add(x);
		     	   }
		        }
		        Parser parser = new Parser();
		        List<DateTime> outputdates = new ArrayList<DateTime>();
		        int counter = 0;
		        JSONArray markedlist = new JSONArray();
		        for (String y : assignmentlines){
		           List<DateGroup> group = parser.parse(y);
		      	   if (group.toString() == "[]"){
		      		   continue;
		      	   }
		      	   List<Date> date = (group.get(0)).getDates();
		             Date sampledate = date.get(0);
		             DateTime dt = new DateTime(sampledate);
		             outputdates.add(dt);
		             JSONArray minilist = new JSONArray();
		             minilist.add(dt);
		             minilist.add(y);
		             markedlist.add(minilist);

		        }
		       
		        
		     obj.put("graded_evaluations", markedlist);


		        
		        
		        
			 try{
				 FileWriter file = new FileWriter(System.getProperty("user.dir") + "/PDFS/JSONOutput/" + finalcoursecode + currentyear + session + optionalcharacter + ".json");
				 file.write(obj.toJSONString());
				 file.flush();
				 file.close();
						 
						 	
			 } catch (IOException e){
				 e.printStackTrace();
			 }
			 
		 }
		 /*
		 for (int i = 0; i < listOfFiles.length; i++){
		 try{
			 Files.move(Paths.get(listOfFiles[i].toString()), Paths.get(System.getProperty("user.dir") + "\\PDFS\\Syllabi\\" + listOfFiles[i].getName()));
		 } catch (Exception e){
			e.printStackTrace();
		 }
		 }
		*/
	 }
	 /*
	 public static void Move(File startingFile, String endinglocation){
		 try{
			 if(startingFile.renameTo(new File(endinglocation + startingFile.getName()))){
				 System.out.println("File move successful!");
			 } else{
				 System.out.println("File move not successful");
			 };
		 } catch (Exception e){
			 e.printStackTrace();;
		 }
	 }
	 */
}


