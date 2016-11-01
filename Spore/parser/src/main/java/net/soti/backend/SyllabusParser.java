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



/**
 * This class parses through in the local directory "PDFS/UnParsedFiles"
 * and attemps to find all the information relevant to the course
 * the PDF is for. This class does not return anything. This class saves
 * the output information into a JSON file that is saved inside the 
 * "/PDFS/OutputFiles" folder.
 * 
 * command line argument is "coursecode" which is an optional argument 
 * that is provided when the user provides a course code with the syllabus
 * 
 * @author Swapnil Shah
 * @author swapnilshahmail@gmail.com
 */
public class SyllabusParser {
 private static String rawtext;
 private static String lines[];
 private static String finalcoursecode;
 private static String currentyear;
 private static String session;
 private static String optionalcharacter = "";
 private static JSONObject outputfile;

 /**
  * Main method gathers all the relevant information and saves information in JSON
  * @param args takes in an array of course codes that need to be parsed
  * @return does not return anything but saves output files in PDFS/OutputFiles
  */
 public void main(String[] args) throws IOException {
  //get list of files in the PDF directory
  File folder = new File(System.getProperty("user.dir") + "/PDFS/UnParsedFiles");

  //get a list of the files inside the directory
  File[] listOfFiles = folder.listFiles();
  PdfToText pdfManager = new PdfToText();


  for (int i = 0; i < listOfFiles.length; i++) {
   //ensure we are only looking at PDF files
   if (!listOfFiles[i].toString().endsWith(".pdf")) {
    continue;
   }
   //create JSON object to store parsed information
   outputfile = new JSONObject();
   //point the file at pdfManager
   pdfManager.setFilePath(listOfFiles[i].toString());
   //save text outputted by conversion from PDF to txt
   rawtext = pdfManager.ToText();
   //save raw extracted text to JSON object
   outputfile.put("rawtext", rawtext);
   lines = rawtext.split("\\r?\\n");
   //find the course code of current syllabus
   finalcoursecode = coursecodefinder();
   outputfile.put("code", finalcoursecode);
   //obtain the university campus based on the course code
   outputfile.put("university", getUniversityCampus());
   //use information to find corresponding course in API
   JSONObject infofromcobalt = null;
   try {
    infofromcobalt = connecttoCobalt();
   } catch (Exception e) {
    //information not available in cobalt API
    e.printStackTrace();
    //get as much information as possible and save outputfile
    outputfile.put("graded_evaluations", getassignments());
    saveAsJSON();
    continue;
   }

   //id of the course
   outputfile.put("id", infofromcobalt.get("id").toString());
   //name of the course
   outputfile.put("name", infofromcobalt.get("name").toString());
   //description of the course
   outputfile.put("description", infofromcobalt.get("description").toString());
   //division of the course
   outputfile.put("division", infofromcobalt.get("division").toString());
   //department the course is from
   outputfile.put("department", infofromcobalt.get("department").toString());
   //prerequisities of the course
   outputfile.put("prerequisites", infofromcobalt.get("prerequisites").toString());
   //exclusions from the course
   outputfile.put("exclusions", infofromcobalt.get("exclusions").toString());
   //grade level of the course
   outputfile.put("level", infofromcobalt.get("level").toString());
   //campus the course is being taught on
   outputfile.put("campus", infofromcobalt.get("campus").toString());
   //the term the course is being taught in
   outputfile.put("term", infofromcobalt.get("term").toString());
   //the meeting sections of the course
   outputfile.put("meeting_sections", infofromcobalt.get("meeting_sections")
    .toString());
   //list of graded evaluations
   outputfile.put("graded_evaluations", getassignments());
   saveAsJSON();
  }
 }


 /**
  * This method finds the course code from the syllabus. The function
  * looks inside "rawtext" which is generated when converting the pdf
  * to text. 
  *
  * @return the function returns the course code found from the PDF
  */
 public String coursecodefinder() {
  //generate regex to find the course code
  String coursecodepattern = "[A-Z]{3}\\s?[0-9]{3}[H|Y][1|5][F|S|Y]?";
  Pattern coursecode = Pattern.compile(coursecodepattern);
  Map < String, Integer > results = new HashMap < String, Integer > ();

  //go through the course codes and output most recurring code
  int count = 0;
  Matcher m = coursecode.matcher(rawtext);
  String finalcoursecode = "";
  int maxcoursecode = 0;
  while (m.find()) { 
   count++;
   if (results.containsKey(m.group())) {
    results.put(m.group(), results.get(m.group()) + 1);
    if (results.get(m.group()) > maxcoursecode) {
     finalcoursecode = m.group();
     maxcoursecode = results.get(m.group());
    }
   } else {
    results.put(m.group(), 1);
    finalcoursecode = m.group();
   }
  }
  if (finalcoursecode.length() == 8) {
   finalcoursecode += "Y";
  }
  return finalcoursecode.replaceAll("\\s+", "");
 }


/**
  * This method finds the course code from the syllabus. The function
  * looks inside "rawtext" which is generated when converting the pdf
  * to text. 
  *
  * @return the function returns the course code found from the PDF
  */
 public JSONObject connecttoCobalt() throws IOException {
    findsession();
    int year = Calendar.getInstance().get(Calendar.YEAR);
    if (rawtext.contains(Integer.toString(year))) {
   currentyear = Integer.toString(year);
  } else {
   currentyear = Integer.toString(year + 1);
  }
  String requestURL = "";
  URLConnection connection;
  URL uoftRequest;
  Scanner scanner;
  try {
   System.out.println("http://localhost:4242/1.0/courses/" +
    finalcoursecode + currentyear + session + optionalcharacter);
   requestURL = "http://localhost:4242/1.0/courses/" +
    finalcoursecode + currentyear + session + optionalcharacter;
   uoftRequest = new URL(requestURL);
   connection = uoftRequest.openConnection();
   scanner = new Scanner(uoftRequest.openStream());
  } catch (Exception e) {
   year += 1;
   currentyear = Integer.toString(year);
   requestURL = "http://localhost:4242/1.0/courses/" +
    finalcoursecode + currentyear + session + optionalcharacter;
   uoftRequest = new URL(requestURL);
   connection = uoftRequest.openConnection();
   scanner = new Scanner(uoftRequest.openStream());
  }
  connection.setDoOutput(true);
  String response = scanner.useDelimiter("\\Z").next();
  JSONParser parser2 = new JSONParser();
  JSONObject json = null;
  try {
   json = (JSONObject) parser2.parse(response);

  } catch (org.json.simple.parser.ParseException e1) {
   e1.printStackTrace();
  }
  scanner.close();
  return json;
 }


 public JSONArray getassignments() {
  List < String > assignmentlines = new ArrayList < String > ();
  int assignmentcount = 0;
  for (String x: lines) {
   if (x.contains("%")) {
    if (x.contains("Total 100%")) {
     continue;
    }
    assignmentcount += 1;
    assignmentlines.add(x);
   }
  }
  Parser parser = new Parser();
  List < DateTime > outputdates = new ArrayList < DateTime > ();
  int counter = 0;
  JSONArray markedlist = new JSONArray();
  JSONArray minilist = new JSONArray();
  for (String y: assignmentlines) {
   minilist = new JSONArray();
   List < DateGroup > group = parser.parse(y);
   if (y.contains("Final Exam")) {
    minilist.add(y);
    markedlist.add(minilist);
    continue;
   } else if (group.toString() == "[]") {
    continue;
   }
   List < Date > date = (group.get(0)).getDates();
   Date sampledate = date.get(0);
   DateTime dt = new DateTime(sampledate);
   outputdates.add(dt);
   minilist.add(dt);
   minilist.add(y);
   markedlist.add(minilist);

  }
  return markedlist;
 }


 public void saveAsJSON() {
  //create a new JSON file with the information and save to filesystem
  try {
   FileWriter file = new FileWriter(System.getProperty("user.dir") +
    "/PDFS/JSONOutput/" + finalcoursecode + currentyear + session +
    optionalcharacter + ".json");
   file.write(outputfile.toJSONString());
   file.flush();
   file.close();
  } catch (IOException e) {
   e.printStackTrace();
  }
 }


 public String getUniversityCampus() {
  //name of the university
  String universitycampus = "";
  if (Character.toString(finalcoursecode.charAt(7)).equals("5")) {
   universitycampus = "UTM";
  } else {
   universitycampus = "UTSG";
  }
  return universitycampus;
 }
}

public String findSession(){
    //check to see if the course is during the summer
    if (rawtext.contains("Summer") | rawtext.contains("summer")) 
    {
        session = "5";
        if (finalcoursecode.endsWith("F") | finalcoursecode.endsWith("S")) 
        {
            optionalcharacter = finalcoursecode.substring(8);
        }
    } 
    
    //check to see if the course is during the winter
    else if (rawtext.contains("Winter") | rawtext.contains("winter")) 
    {
        session = "1";
    } 
    
    //check to see if the course is during the fall
    else if (rawtext.contains("Fall") | rawtext.contains("fall")) 
    {
        session = "9";
    } 
    
    //if none are found, then assume course is in current semester
    else 
    {
        //assigning session based on current month
        int month = Calendar.getInstance().get(Calendar.MONTH);
        int april = 4
        int august = 8
        if (month < april) 
        {
            session = "1";
        } 

        else if (month >= april && month < august) 
        {
            session = "5";
        }

        else 
        {
            session = "9";
        }
    }
}