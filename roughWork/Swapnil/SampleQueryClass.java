package com.utm.csc.server;
import java.io.IOException;
import java.nio.file.Paths;

import org.apache.lucene.analysis.Analyzer;
import org.apache.lucene.analysis.core.StopAnalyzer;
import org.apache.lucene.analysis.core.WhitespaceAnalyzer;
import org.apache.lucene.analysis.standard.StandardAnalyzer;
import org.apache.lucene.document.Document;
import org.apache.lucene.document.Field;
import org.apache.lucene.document.TextField;
import org.apache.lucene.index.DirectoryReader;
import org.apache.lucene.index.IndexReader;
import org.apache.lucene.index.IndexWriter;
import org.apache.lucene.index.IndexWriterConfig;
import org.apache.lucene.queryparser.classic.ParseException;
import org.apache.lucene.queryparser.classic.QueryParser;
import org.apache.lucene.search.IndexSearcher;
import org.apache.lucene.search.Query;
import org.apache.lucene.search.ScoreDoc;
import org.apache.lucene.search.TopDocs;
import org.apache.lucene.store.Directory;
import org.apache.lucene.store.RAMDirectory;
import org.apache.lucene.store.SimpleFSDirectory;
import org.apache.lucene.util.Version;



public class SampleQueryClass {

  public static String excerpt(String query, String content) {
    query = query.toLowerCase();
    query = query.substring(9, query.length()-2);
    content = content.replace("\n", " ").replace("\r", "");
    String[] lst = content.split(" ");
    int index = 0;
    for (int i = 0; i < lst.length; i++) {
      if (lst[i].toLowerCase().equals(query)) {
        index = i;
        break;
      }
    }


    if (index == 0) {
      String excerpt = "<strong>" + lst[index] + "</strong>" + " " + lst[index+1] + " " + lst[index+2] + " " + lst[index+3];
      if (lst.length > 4) {
        excerpt += "...";
      }
      return excerpt; 
    }
    if (lst.length >= 7) {
      if (index < 4) {
        String excerpt = "";
        for (int i = 0; i < index; i++) {
          excerpt += lst[i] + " ";
        }
        excerpt += "<strong>" + lst[index] + "</strong>" + " " +
            lst[index+1] + " " + lst[index+2] + " " + lst[index+3];
        if (lst.length > 7) {
          excerpt += "...";
        }
        return excerpt;
      }

      if (lst.length - index < 4) {
        String excerpt = "..." + lst[index-3] + " " + lst[index-2] + " " + lst[index-1] + " " + "<strong>" + lst[index] + "</strong> ";

        for (int i = index+1; i < lst.length; i++) {
          excerpt += lst[i] + " ";
        }
        return excerpt;
      }

      if (lst.length == 7) {
        return lst[index-3] + " " + lst[index-2] + " " + lst[index-1] + " " + "<strong>" + lst[index] + "</strong>" + " " +
            lst[index+1] + " " + lst[index+2] + " " + lst[index+3];
      }

      return "..." + lst[index-3] + " " + lst[index-2] + " " + lst[index-1] + " " + "<strong>" + lst[index] + "</strong>" + " " +
      lst[index+1] + " " + lst[index+2] + " " + lst[index+3] + "...";
    }
    else {
      String excerpt = "";
      for (int i = 0; i < lst.length; i++) {
        if (i == index) {
          excerpt += "<strong>" + lst[i] + "</strong> ";
        }
        else {
          excerpt += lst[i] + " ";
        }
      }
      return excerpt;
    }

  }

  public static String testRun(String stringQuery, String exactUserQuery, String uploadTimeQuery,
		  String maxWordsQuery, String minWordsQuery, String typeOfFileQuery, String exactFileQuery, 
		  String exactCourseQuery) throws IOException, ParseException {
	long startTime = System.currentTimeMillis();
    Analyzer analyzer = new StandardAnalyzer();
    java.nio.file.Path path = Paths.get("GeneratedFiles/");
    SimpleFSDirectory indexeddirectory = new SimpleFSDirectory(path);

    //String querystr = "title:(part) AND course_code:(3437RJ1)";
    //Query q = new QueryParser("title", analyzer).parse(querystr);
    //stringQuery = "Content:(" + stringQuery +") " + "course:(CSC301)";

    IndexReader indexReader = DirectoryReader.open(indexeddirectory);
    IndexSearcher indexSearcher = new IndexSearcher(indexReader);
    String finalStringQuery = "";
    QueryParser parser = new QueryParser( "title", analyzer);
    if (stringQuery != null){
    	finalStringQuery += "Content:(" + stringQuery + ") ";
    }
    if (exactFileQuery != null){
    	finalStringQuery += "Title:(" + exactFileQuery + ") ";
    }
    
    if (exactUserQuery != null){
    	finalStringQuery += "Email:(" + exactUserQuery + ") ";
    }
    
    if (uploadTimeQuery != null){
    	finalStringQuery += "Date:(" + uploadTimeQuery + ") ";
    }
    
    if (typeOfFileQuery != null){
    	finalStringQuery += "Extension:(" + typeOfFileQuery + ") ";
    }
    
    if (exactCourseQuery != null){
    	finalStringQuery += "Course:(" + exactCourseQuery + ") ";
    }
    

    
    System.out.println("fasdafdsfafasdafadsfsa");
    System.out.println(finalStringQuery);
    StringBuilder sb=new StringBuilder();
 
    if (minWordsQuery != null && finalStringQuery == "" || maxWordsQuery != null && finalStringQuery == ""){
    	sb.append("<h4>No Results</h4><i>");
        return sb.toString();
    }
    int hitsPerPage = 10;
    Query query = parser.parse(finalStringQuery);
    TopDocs docs = indexSearcher.search(query, hitsPerPage);
    System.out.println(docs.totalHits);
    if (docs.totalHits != 0){
    	ScoreDoc[] hits = docs.scoreDocs;

        int end = Math.min(docs.totalHits, hitsPerPage);
        int skippedFiles = 0;
        String targetFile = "";
        for (int i = 0; i < end; i++) {
          Document d = indexSearcher.doc(hits[i].doc);
          System.out.println(d.get("Title"));
          int numberOfWords = 0;
          try {
              numberOfWords = Integer.parseInt(d.get("Size"));
          } catch (Exception e){
        	  e.printStackTrace();
          }
          if (minWordsQuery != null){
        	  int minWords = Integer.parseInt(minWordsQuery);
        	  if (minWords > numberOfWords){
        		  skippedFiles += 1;
        		  continue;
        	  }
          }
          if (maxWordsQuery != null){
        	  int maxWords = Integer.parseInt(maxWordsQuery);
        	  if (maxWords < numberOfWords){
        		  skippedFiles += 1;
        		  continue;
        	  }
          }
          System.out.println("outside if statements");
          targetFile = "http://localhost:8887/301grouprepository1/Back-End/war/IndexedFiles/" + d.get("Email") + "~" + d.get("Date") + "~" +
          d.get("Course") + "~" + d.get("Title");
          System.out.println(targetFile);
          String icon = "<i class='material-icons' style='font-size:20px'>email</i>";
          sb.append("<h5>"
          		+ "<a style='text-decoration:none' href='../../Back-End/war/IndexedFiles/" + d.get("Email") + "~" + d.get("Date") + "~" +
                d.get("Course") + "~" + d.get("Title") + "' target='_blank'>" + d.get("Title") + "</a>"
          		+ "<a href='mailto:someone@example.com?Subject=Search%20Result&body=" + targetFile + "'>"+ "  "+ icon + "</a>"
          		+ "</h5><i>");
          System.out.println(sb.toString());
          System.out.println(d.get("Content"));
          if (finalStringQuery != null && finalStringQuery.substring(0,7).equals("Content")){
        	  sb.append(excerpt(finalStringQuery, d.get("Content")) + "</i><br><br><hr><br>");
          }
        }
        long endTime = System.currentTimeMillis();
        long Time = endTime - startTime;	
        System.out.println("0000000000000000000");
        if (docs.totalHits - skippedFiles == 0){
        	sb.append("<h4>No Results</h4><i>");
        } else if (docs.totalHits == 1){
            sb.insert(0, "About " + Integer.toString(docs.totalHits-skippedFiles) + " result (" + Time + " milliseconds)");
    	} else {
            sb.insert(0, "About " + Integer.toString(docs.totalHits-skippedFiles) + " results (" + Time + " milliseconds)");
    	}
        System.out.println("-------");
        System.out.println(sb.toString());
        
    } else {
    	sb.append("<h4>No Results</h4><i>");
    }
    return sb.toString();
  }
}