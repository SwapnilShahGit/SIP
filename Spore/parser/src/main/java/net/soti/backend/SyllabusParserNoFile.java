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
public class SyllabusParserNoFile{
	public static JSONObject outputfile;
	public static void main(String[] args) throws IOException{

		for (String arg: args){
			outputfile = new JSONObject();
			outputfile.put("rawinput", arg);
			outputfile.put("code", arg);
			outputfile.put("university", SyllabusParser.getUniversityCampus(arg));
			JSONObject infofromcobalt = null;
			try {
	    		infofromcobalt = connecttoCobalt(arg);
	   		} catch (Exception e) {
	    		//course not in cobalt
	    		System.out.println(arg);
	    		continue;
	   		}
	   		//populate the output file with necessary information from Cobalt
		    outputfile.put("id", infofromcobalt.get("id").toString());
		    outputfile.put("name", infofromcobalt.get("name").toString());
		    outputfile.put("description", infofromcobalt.get("description").toString());
		    outputfile.put("division", infofromcobalt.get("division").toString());
		    outputfile.put("department", infofromcobalt.get("department").toString());
		    outputfile.put("prerequisites", infofromcobalt.get("prerequisites").toString());
		    outputfile.put("exclusions", infofromcobalt.get("exclusions").toString());
		    outputfile.put("level", infofromcobalt.get("level").toString());
		    outputfile.put("campus", infofromcobalt.get("campus").toString());
		    outputfile.put("term", infofromcobalt.get("term").toString());
		    outputfile.put("meeting_sections", infofromcobalt.get("meeting_sections").toString());
		    saveAsJSON(arg);
		}
	}

	public static JSONObject connecttoCobalt(String coursecode) throws IOException {
  		String requestURL = "";
  		URLConnection connection = null;
  		URL uoftRequest;
  		Scanner scanner = null;
  		try {
		    requestURL = "http://localhost:4242/1.0/courses/" + coursecode;
   			uoftRequest = new URL(requestURL);
   			connection = uoftRequest.openConnection();
   			scanner = new Scanner(uoftRequest.openStream());
  		} catch (Exception e) {
   			System.out.println("was not able to connect to cobalt");
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

 	public static void saveAsJSON(String coursecode) {
  		//create a new JSON file with the information and save to filesystem
  		try {
   		FileWriter file = new FileWriter(System.getProperty("user.dir") + "/PDFS/JSONOutput/" + coursecode + ".json");
   		file.write(outputfile.toJSONString());
   		file.flush();
   		file.close();
  		} catch (IOException e) {
   			e.printStackTrace();
  		}
 	}
}