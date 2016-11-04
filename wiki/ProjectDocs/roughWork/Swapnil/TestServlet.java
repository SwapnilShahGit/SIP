package com.utm.csc.server;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.io.FilenameUtils;
import org.apache.lucene.analysis.Analyzer;
import org.apache.lucene.analysis.standard.StandardAnalyzer;
import org.apache.lucene.document.Document;
import org.apache.lucene.document.Field;
import org.apache.lucene.document.StringField;
import org.apache.lucene.document.TextField;
import org.apache.lucene.index.IndexWriter;
import org.apache.lucene.index.IndexWriterConfig;
import org.apache.lucene.store.SimpleFSDirectory;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;


public class TestServlet extends HttpServlet {

  @Override
  protected void doGet(HttpServletRequest req, HttpServletResponse resp)
      throws ServletException, IOException {
    Analyzer analyzer = new StandardAnalyzer();
    IndexWriterConfig config = new IndexWriterConfig(analyzer);

    java.nio.file.Path path = Paths.get("GeneratedFiles/");
    SimpleFSDirectory indexeddirectory = new SimpleFSDirectory(path);
    IndexWriter indexWriter = new IndexWriter(indexeddirectory, config);

    java.nio.file.Path unindexedpath = Paths.get("UnindexedFiles/");
    String[] arrayoffiles = SimpleFSDirectory.listAll(unindexedpath);
    BufferedReader br = null;	
    String content = "";


    for (int i = 0; i < arrayoffiles.length; i++){
      content = "";
      try {
        String ext = FilenameUtils.getExtension(arrayoffiles[i]);
        ext = ext.replaceAll("\\s","");
        
        if (ext.equals("pdf")){
          PDDocument pdfDocument = PDDocument.load(new File(unindexedpath + "/" + arrayoffiles[i]));
          PDFTextStripper stripper = new PDFTextStripper();
          content =  stripper.getText(pdfDocument);
          pdfDocument.close();

        }else if(ext.equals("txt") || ext.equals("html")){
          String sCurrentLine;
          br = new BufferedReader(new FileReader("UnindexedFiles/" + arrayoffiles[i]));
          while ((sCurrentLine = br.readLine()) != null) {
            content += sCurrentLine + '\n';
          }
          br.close();

        }else{
          PrintWriter out = resp.getWriter();
      	  out.println("<h4>No Results</h4><i>");

        }

      } catch (IOException e) {
        e.printStackTrace();
      } finally {
        try {
          if (br != null)br.close();
        } catch (IOException ex) {
          ex.printStackTrace();
        }
      }

      Document doc = new Document();
      String text = content;
      String[] parts = arrayoffiles[i].split("~");
      String email = parts[0];
      String date = parts[1];
      String course = parts[2];
      String fileName = parts[3];

      String ext = FilenameUtils.getExtension(arrayoffiles[i]);
      ext = ext.replaceAll("\\s","");

      doc.add(new TextField("Content", text, Field.Store.YES));
      doc.add(new TextField("Email", email, Field.Store.YES));
      doc.add(new TextField("Date", date, Field.Store.YES));
      doc.add(new TextField("Course", course, Field.Store.YES));
      doc.add(new TextField("Title", fileName, Field.Store.YES));
      doc.add(new TextField("Extension", ext, Field.Store.YES));
      doc.add(new TextField("Size", Integer.toString(text.length()), Field.Store.YES));

      indexWriter.addDocument(doc);


    }

    indexWriter.close();


    for (int i = 0; i < arrayoffiles.length; i++){
      String[] parts = arrayoffiles[i].split("~");
      java.nio.file.Path sourcepath = Paths.get("UnindexedFiles/" + arrayoffiles[i]);
      java.nio.file.Path destpath = Paths.get("IndexedFiles/");
      Files.move(sourcepath, destpath.resolve(sourcepath.getFileName()));         
    }


    try
    {
       System.out.println(req);
      String searchQuery = req.getParameter("query");
      String exactUserQuery = req.getParameter("user");
      String uploadTimeQuery = req.getParameter("day");
      String maxWordsQuery = req.getParameter("max");
      String minWordsQuery = req.getParameter("min");
      String typeOfFileQuery = req.getParameter("type");
      String exactFileQuery = req.getParameter("file");
      String exactCourseQuery = req.getParameter("course");
      

      
      String calculateQuery = req.toString();
      int start = calculateQuery.indexOf("query=") + 6;
      int end = calculateQuery.indexOf(")@");
      calculateQuery = calculateQuery.substring(start, end);
      calculateQuery = calculateQuery.replaceAll("%20", "");
      int left_count = 0;
      int right_count = 0;
      for (int i = 0; i < calculateQuery.length(); i++) {
        if (calculateQuery.charAt(i) == '(') {
          left_count++;
        }
        else if (calculateQuery.charAt(i) == ')') {
          right_count++;
        }
      }
      if (left_count > right_count) {
    	  while (left_count != right_count) {
    	        int index = calculateQuery.indexOf('(');
    	        calculateQuery = calculateQuery.substring(0, index) + calculateQuery.substring(index + 1);
    	        left_count--;
    	      }
      }
      else {
        while (left_count != right_count) {
          int index = calculateQuery.lastIndexOf(')');
          calculateQuery = calculateQuery.substring(0, index) + calculateQuery.substring(index + 1);
          right_count--;
        }
      }
      
      PrintWriter out = resp.getWriter();
      resp.setContentType("text/html");
      resp.addHeader("Access-Control-Allow-Origin", "*");
      resp.addHeader("Access-Control-Allow-Methods", "GET, PUT, POST, OPTIONS, DELETE");
      resp.addHeader("Access-Control-Allow-Headers", "Content-Type");
      resp.addHeader("Access-Control-Max-Age", "86400");
     
      if (searchQuery != null && exactUserQuery == null && uploadTimeQuery == null && maxWordsQuery == null && 
    		  minWordsQuery == null && typeOfFileQuery == null && exactFileQuery == null &&
    		  exactCourseQuery == null && (calculateQuery.contains("+") | calculateQuery.contains("-") | calculateQuery.contains("^")
    		  | calculateQuery.contains("/") | calculateQuery.contains("*"))){
    	  try{
        	  out.println("<html><h4><center><font color=#000000>" + eval(calculateQuery) + "</font></center></h4><html>");
    	  } catch (Exception e) {
        	  out.println("<html><h4><center><font color=#000000>" + "Invalid Formula!" + "</font></center></h4><html>");
    	  }
    	  String bodycalculator = "<center><FORM NAME=\"sci-calc\">\n" + 
    	            "<TABLE CELLSPACING=\"0\" CELLPADDING=\"1\">\n" + 
    	            "<TR>\n" + 
    	            "<TD COLSPAN=\"5\" ALIGN=\"center\"><INPUT NAME=\"display\" VALUE=\"0\" SIZE=\"28\" MAXLENGTH=\"25\"></TD>\n" + 
    	            "</TR>\n" + 
    	            "<TR>\n" + 
    	            "<TD ALIGN=\"center\"><INPUT TYPE=\"button\" VALUE=\" exp \" ONCLICK=\"if (checkNum(this.form.display.value)) { exp(this.form) }\"></TD>\n" + 
    	            "<TD ALIGN=\"center\"><INPUT TYPE=\"button\" VALUE=\"  7  \" ONCLICK=\"addChar(this.form.display, '7')\"></TD>\n" + 
    	            "<TD ALIGN=\"center\"><INPUT TYPE=\"button\" VALUE=\"  8  \" ONCLICK=\"addChar(this.form.display, '8')\"></TD>\n" + 
    	            "<TD ALIGN=\"center\"><INPUT TYPE=\"button\" VALUE=\"  9  \" ONCLICK=\"addChar(this.form.display, '9')\"></TD>\n" + 
    	            "<TD ALIGN=\"center\"><INPUT TYPE=\"button\" VALUE=\"   /   \" ONCLICK=\"addChar(this.form.display, '/')\"></TD>\n" + 
    	            "</TR>\n" + 
    	            "<TR>\n" + 
    	            "<TD ALIGN=\"center\"><INPUT TYPE=\"button\" VALUE=\"   ln   \" ONCLICK=\"if (checkNum(this.form.display.value)) { ln(this.form) }\"></TD>\n" + 
    	            "<TD ALIGN=\"center\"><INPUT TYPE=\"button\" VALUE=\"  4  \" ONCLICK=\"addChar(this.form.display, '4')\"></TD>\n" + 
    	            "<TD ALIGN=\"center\"><INPUT TYPE=\"button\" VALUE=\"  5  \" ONCLICK=\"addChar(this.form.display, '5')\"></TD>\n" + 
    	            "<TD ALIGN=\"center\"><INPUT TYPE=\"button\" VALUE=\"  6  \" ONCLICK=\"addChar(this.form.display, '6')\"></TD>\n" + 
    	            "<TD ALIGN=\"center\"><INPUT TYPE=\"button\" VALUE=\"   *   \" ONCLICK=\"addChar(this.form.display, '*')\"></TD>\n" + 
    	            "</TR>\n" + 
    	            "<TR>\n" + 
    	            "<TD ALIGN=\"center\"><INPUT TYPE=\"button\" VALUE=\" sqrt \" ONCLICK=\"if (checkNum(this.form.display.value)) { sqrt(this.form) }\"></TD>\n" + 
    	            "<TD ALIGN=\"center\"><INPUT TYPE=\"button\" VALUE=\"  1  \" ONCLICK=\"addChar(this.form.display, '1')\"></TD>\n" + 
    	            "<TD ALIGN=\"center\"><INPUT TYPE=\"button\" VALUE=\"  2  \" ONCLICK=\"addChar(this.form.display, '2')\"></TD>\n" + 
    	            "<TD ALIGN=\"center\"><INPUT TYPE=\"button\" VALUE=\"  3  \" ONCLICK=\"addChar(this.form.display, '3')\"></TD>\n" + 
    	            "<TD ALIGN=\"center\"><INPUT TYPE=\"button\" VALUE=\"   -   \" ONCLICK=\"addChar(this.form.display, '-')\"></TD>\n" + 
    	            "</TR>\n" + 
    	            "<TR>\n" + 
    	            "<TD ALIGN=\"center\"><INPUT TYPE=\"button\" VALUE=\"  sq  \" ONCLICK=\"if (checkNum(this.form.display.value)) { square(this.form) }\"></TD>\n" + 
    	            "<TD ALIGN=\"center\"><INPUT TYPE=\"button\" VALUE=\"  0  \" ONCLICK=\"addChar(this.form.display, '0')\"></TD>\n" + 
    	            "<TD ALIGN=\"center\"><INPUT TYPE=\"button\" VALUE=\"   .  \" ONCLICK=\"addChar(this.form.display, '.')\"></TD>\n" + 
    	            "<TD ALIGN=\"center\"><INPUT TYPE=\"button\" VALUE=\" +/- \" ONCLICK=\"changeSign(this.form.display)\"></TD>\n" + 
    	            "<TD ALIGN=\"center\"><INPUT TYPE=\"button\" VALUE=\"   +  \" ONCLICK=\"addChar(this.form.display, '+')\"></TD>\n" + 
    	            "</TR>\n" + 
    	            "<TR>\n" + 
    	            "<TD ALIGN=\"center\"><INPUT TYPE=\"button\" VALUE=\"    (    \" ONCLICK=\"addChar(this.form.display, '(')\"></TD>\n" + 
    	            "<TD ALIGN=\"center\"><INPUT TYPE=\"button\" VALUE=\"cos\" ONCLICK=\"if (checkNum(this.form.display.value)) { cos(this.form) }\"></TD>\n" + 
    	            "<TD ALIGN=\"center\"><INPUT TYPE=\"button\" VALUE=\" sin\" ONCLICK=\"if (checkNum(this.form.display.value)) { sin(this.form) }\"></TD>\n" + 
    	            "<TD ALIGN=\"center\"><INPUT TYPE=\"button\" VALUE=\" tan\" ONCLICK=\"if (checkNum(this.form.display.value)) { tan(this.form) }\"></TD>\n" + 
    	            "<TD ALIGN=\"center\"><INPUT TYPE=\"button\" VALUE=\"   )   \" ONCLICK=\"addChar(this.form.display, ')')\"></TD>\n" + 
    	            "</TR>\n" + 
    	            "<TR>\n" + 
    	            "<TD ALIGN=\"center\"><INPUT TYPE=\"button\" VALUE=\"clear\" ONCLICK=\"this.form.display.value = 0 \"></TD>\n" + 
    	            "<TD ALIGN=\"center\" COLSPAN=\"3\"><INPUT TYPE=\"button\" VALUE=\"backspace\" ONCLICK=\"deleteChar(this.form.display)\"></TD>\n" + 
    	            "<TD ALIGN=\"center\"><INPUT TYPE=\"button\" VALUE=\"enter\" NAME=\"enter\" ONCLICK=\"if (checkNum(this.form.display.value)) { compute(this.form) }\"></TD>\n" + 
    	            "</TR>\n" + 
    	            "</TABLE>\n" + 
    	            "</FORM></center>"; 
    	  out.println(bodycalculator);
      } else {

    	  out.println("<html><link rel='stylesheet' href='https://fonts.googleapis.com/icon?family=Material+Icons'>"+SampleQueryClass.testRun(searchQuery, exactUserQuery, 
    			  uploadTimeQuery, maxWordsQuery, minWordsQuery, typeOfFileQuery, exactFileQuery, exactCourseQuery)+"</body></html>");
      }
    }

    catch(Exception e)
    {

    }


  }


public static double eval(final String str) {
    return new Object() {
        int pos = -1, ch;

        void eatChar() {
            ch = (++pos < str.length()) ? str.charAt(pos) : -1;
        }

        boolean eatChar(int ch) {
            if (this.ch == ch) {
                eatChar();
                return true;
            }
            return false;
        }

        void eatSpace() {
            while (Character.isWhitespace(ch)) eatChar();
        }

        double parse() {
            eatChar();
            double x = parseExpression();
            if (pos < str.length()) throw new RuntimeException("Unexpected: " + (char)ch);
            return x;
        }

        // Grammar:
        // expression = term | expression `+` term | expression `-` term
        // term = factor | term `*` factor | term `/` factor
        // factor = `+` factor | `-` factor | `(` expression `)`
        //        | number | functionName factor | factor `^` factor

        double parseExpression() {
            double x = parseTerm();
            for (;;) {
                eatSpace();
                if      (eatChar('+')) x += parseTerm(); // addition
                else if (eatChar('-')) x -= parseTerm(); // subtraction
                else return x;
            }
        }

        double parseTerm() {
            double x = parseFactor();
            for (;;) {
                eatSpace();
                if      (eatChar('*')) x *= parseFactor(); // multiplication
                else if (eatChar('/')) x /= parseFactor(); // division
                else return x;
            }
        }

        double parseFactor() {
            eatSpace();
            if (eatChar('+')) return parseFactor(); // unary plus
            if (eatChar('-')) return -parseFactor(); // unary minus

            double x;
            int startPos = this.pos;
            if (eatChar('(')) { // parentheses
                x = parseExpression();
                eatChar(')');
            } else if ((ch >= '0' && ch <= '9') || ch == '.') { // numbers
                while ((ch >= '0' && ch <= '9') || ch == '.') eatChar();
                x = Double.parseDouble(str.substring(startPos, this.pos));
            } else if (ch >= 'a' && ch <= 'z') { // functions
                while (ch >= 'a' && ch <= 'z') eatChar();
                String func = str.substring(startPos, this.pos);
                x = parseFactor();
                if (func.equals("sqrt")) x = Math.sqrt(x);
                else if (func.equals("sin")) x = Math.sin(Math.toRadians(x));
                else if (func.equals("cos")) x = Math.cos(Math.toRadians(x));
                else if (func.equals("tan")) x = Math.tan(Math.toRadians(x));
                else throw new RuntimeException("Unknown function: " + func);
            } else {
                throw new RuntimeException("Unexpected: " + (char)ch);
            }

            eatSpace();
            if (eatChar('^')) x = Math.pow(x, parseFactor()); // exponentiation

            return x;
        }
    }.parse();
}
}
