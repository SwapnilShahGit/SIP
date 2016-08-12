package net.soti.backend;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.net.MalformedURLException;
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
import net.soti.backend.PdfToText;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;




public class SyllabusParser
{
	public static String rawtext;
	public static String lines[];
	public static String finalcoursecode;
    public static String currentyear;
	public static String session;
    public static String optionalcharacter = "";
    public static JSONObject obj;

	 public static void main(String[] args) throws IOException {
		 File folder = new File(System.getProperty("user.dir")+ "/PDFS/UnParsedFiles");
		 File[] listOfFiles = folder.listFiles();
	     PdfToText pdfManager = new PdfToText();


		 for (int i = 0; i < listOfFiles.length; i++){
			 obj = new JSONObject();
			 pdfManager.setFilePath(listOfFiles[i].toString());
			 rawtext = pdfManager.ToText();
			 obj.put("rawtext", rawtext);
		     lines = rawtext.split("\\r?\\n");
		     //UofT course code format
		     finalcoursecode = coursecodefinder();
		     obj.put("code", finalcoursecode);
		     //obtains the university campus based on the course code
		     obj.put("university", getUniversityCampus());
		     //use information processed above to find corresponding course in API
		     JSONObject json = null;
		     try{
			     json = connecttoCobalt();
		     }catch (Exception e){
		    	 //information not available in cobalt API
		    	 e.printStackTrace();
		    	 saveAsJSON();
		    	 continue;
		     }
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
		     //exclusions from the course
		     obj.put("exclusions", json.get("exclusions").toString());
		     //grade level of the course
		     obj.put("level", json.get("level").toString());
		     //campus the course is being taught on
		     obj.put("campus", json.get("campus").toString());
		     //the term the course is being taught in
		     obj.put("term", json.get("term").toString());
		     //the meeting sections of the course
		     obj.put("meeting_sections", json.get("meeting_sections").toString());
		     //list of graded evaluations
		     obj.put("graded_evaluations", getassignments());
		     saveAsJSON();

		 }
	 }

	 public static String coursecodefinder() {
		    String coursecodepattern = "[A-Z]{3}\\s?[0-9]{3}[H|Y][1|5][F|S|Y]?";
		 		Pattern coursecode = Pattern.compile(coursecodepattern);
				Map<String, Integer> results = new HashMap<String, Integer>();

				int count = 0;
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
				return finalcoursecode.replaceAll("\\s+","");
	 }

	 public static JSONObject connecttoCobalt() throws IOException{
		     if (rawtext.contains("Summer") | rawtext.contains("summer")){
		    	 session = "5";
		    	 if (finalcoursecode.endsWith("F") | finalcoursecode.endsWith("S")){
		    		 optionalcharacter = finalcoursecode.substring(8);
		    	 }
		     }else if (rawtext.contains("Winter")| rawtext.contains("winter")) {
		    	 session = "1";
		     } else if (rawtext.contains("Fall")| rawtext.contains("fall")){
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
		     return json;
	 }

	 public static JSONArray getassignments(){
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
		        JSONArray minilist = new JSONArray();
		        for (String y : assignmentlines){
	        	     minilist = new JSONArray();
		           List<DateGroup> group = parser.parse(y);
		           if (y.contains("Final Exam")){
		        	   	 minilist.add(y);
			             markedlist.add(minilist);
			             continue;
			      	   }
		      	   else if (group.toString() == "[]"){
			      		   continue;
			      	   } 
		      	   List<Date> date = (group.get(0)).getDates();
		             Date sampledate = date.get(0);
		             DateTime dt = new DateTime(sampledate);
		             outputdates.add(dt);
		             minilist.add(dt);
		             minilist.add(y);
		             markedlist.add(minilist);

		        }
		        return markedlist;

		/*
		 * String pattern = "(?<!\\S)(?:(?:(?:31(\\/|-|\\.)(?:0?[13578]|1[02]|(?:Jan|Mar|May|Jul|Aug|Oct|Dec)))\\1|"
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
		 */
	 }

	 public static void saveAsJSON(){
		 //create a new JSON file with the information and save to filesystem
			 try{
				 FileWriter file = new FileWriter(System.getProperty("user.dir") + "/PDFS/JSONOutput/" + finalcoursecode + currentyear + session + optionalcharacter + ".json");
				 file.write(obj.toJSONString());
				 file.flush();
				 file.close();
			 } catch (IOException e){
				 e.printStackTrace();
			 }
	 }

	 public static String getUniversityCampus(){
		 //name of the university
		     String universitycampus = "";
				 System.out.println(finalcoursecode);
		     if (Character.toString(finalcoursecode.charAt(7)).equals("5")){
		    	 universitycampus = "UTM";
		     } else {
		    	 universitycampus = "UTSG";
		     }
				 return universitycampus;
	 }
}
