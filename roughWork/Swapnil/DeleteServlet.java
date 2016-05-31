package com.utm.csc.server;

import java.io.BufferedReader;


import static java.nio.file.StandardCopyOption.*;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.lucene.analysis.Analyzer;
import org.apache.lucene.analysis.standard.StandardAnalyzer;
import org.apache.lucene.document.Document;
import org.apache.lucene.document.Field;
import org.apache.lucene.document.TextField;
import org.apache.lucene.index.IndexWriter;
import org.apache.lucene.index.IndexWriterConfig;
import org.apache.lucene.store.Directory;
import org.apache.lucene.store.RAMDirectory;
import org.apache.lucene.store.SimpleFSDirectory;


public class DeleteServlet extends HttpServlet {

  @Override
  protected void doGet(HttpServletRequest req, HttpServletResponse resp)
      throws ServletException, IOException {
    // TODO Auto-generated method stub
    //super.doGet(req, resp);
    PrintWriter out = resp.getWriter();

    try {
      String deleteQuery = req.getParameter("delete");
      java.nio.file.Path deletepath = Paths.get("IndexedFiles/");
      boolean success = (new File(deletepath + "/" + deleteQuery)).delete();
      if (success){
        out.println("-----------------------------Deleted---------------------------");
        java.nio.file.Path generatepath = Paths.get("GeneratedFiles/");
        String[] arrayofgeneratedfiles = SimpleFSDirectory.listAll(generatepath);

        for (int i = 0; i < arrayofgeneratedfiles.length; i++){
          boolean generatedsuccess = (new File(generatepath + "/" + 	arrayofgeneratedfiles[i])).delete();
          if (generatedsuccess){
            out.println("-----------------------------Generated Files Deleted---------------------------");
          }else{
            out.println("-----------------------------Generated Files Not Deleted---------------------------");
          }
        }
      }else{
        out.println("-----------------------------File Not Deleted---------------------------");
      }
      String[] arrayoffiles = SimpleFSDirectory.listAll(deletepath);
      for (int i = 0; i < arrayoffiles.length; i++){
        java.nio.file.Path sourcepath = Paths.get("IndexedFiles/" + arrayoffiles[i]);
        java.nio.file.Path destpath = Paths.get("UnindexedFiles/");
        Files.move(sourcepath, destpath.resolve(sourcepath.getFileName()));      
      }

    } catch (Exception e) {
      out.println("File does not exist");
    }


    Analyzer analyzer = new StandardAnalyzer();
    IndexWriterConfig config = new IndexWriterConfig(analyzer);

    java.nio.file.Path path = Paths.get("GeneratedFiles/");
    SimpleFSDirectory indexeddirectory = new SimpleFSDirectory(path);
    //IndexReader indexReader = null;
    IndexWriter indexWriter = new IndexWriter(indexeddirectory, config);

    java.nio.file.Path unindexedpath = Paths.get("UnindexedFiles/");
    String[] arrayoffiles = SimpleFSDirectory.listAll(unindexedpath);
    BufferedReader br = null;	
    String content = "";


    for (int i = 0; i < arrayoffiles.length; i++){
      content = "";
      try {
        String sCurrentLine;
        br = new BufferedReader(new FileReader("UnindexedFiles/" + arrayoffiles[i]));
        while ((sCurrentLine = br.readLine()) != null) {
          content += sCurrentLine + '\n';
        }

        System.out.println(content);
      } catch (IOException e) {
        e.printStackTrace();
      } finally {
        try {
          if (br != null)br.close();
        } catch (IOException ex) {
          ex.printStackTrace();
        }
      }

      br.close();
      Document doc = new Document();
      String text = content;
      doc.add(new TextField("Content", text, Field.Store.YES));
      doc.add(new TextField("title", arrayoffiles[i], Field.Store.YES));
      indexWriter.addDocument(doc);


    }
    indexWriter.close();


    for (int i = 0; i < arrayoffiles.length; i++){

      java.nio.file.Path sourcepath = Paths.get("UnindexedFiles/" + arrayoffiles[i]);
      System.out.println(sourcepath);
      java.nio.file.Path destpath = Paths.get("IndexedFiles/");
      System.out.println(destpath);
      Files.move(sourcepath, destpath.resolve(sourcepath.getFileName()));            
    }


    try
    {
      resp.setContentType("text/html");
      resp.addHeader("Access-Control-Allow-Origin", "*");
      resp.addHeader("Access-Control-Allow-Methods", "GET, PUT, POST, OPTIONS, DELETE");
      resp.addHeader("Access-Control-Allow-Headers", "Content-Type");
      resp.addHeader("Access-Control-Max-Age", "86400");
    }

    catch(Exception e)
    {

    }



  }

}
