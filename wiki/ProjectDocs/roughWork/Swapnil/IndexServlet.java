package com.utm.csc.server;

import java.io.IOException;
import java.io.PrintWriter;
import java.nio.file.Paths;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.lucene.analysis.Analyzer;
import org.apache.lucene.analysis.standard.StandardAnalyzer;
import org.apache.lucene.index.IndexReader;
import org.apache.lucene.index.IndexWriter;
import org.apache.lucene.index.IndexWriterConfig;
import org.apache.lucene.store.Directory;
import org.apache.lucene.store.RAMDirectory;
import org.apache.lucene.store.SimpleFSDirectory;

public class IndexServlet extends HttpServlet {

  @Override
  protected void doGet(HttpServletRequest req, HttpServletResponse resp)
      throws ServletException, IOException {
    // TODO Auto-generated method stub
    //super.doGet(req, resp);
    try
    {
      String searchQuery = req.getParameter("query");
      resp.setContentType("text/html");
      PrintWriter out = resp.getWriter();
      System.out.println("ahfdoifasdiahfaosihfodaiffhfhas");
      out.println("<html><body><h1>blah blah blah "+searchQuery+" </h1>"+QueryClass.testRun(searchQuery)+"</body></html>");
    }

    catch(Exception e)
    {

    }


  }

  public static void main(String[] args) throws IOException {
    Analyzer analyzer = new StandardAnalyzer();
    Directory directory = new RAMDirectory();
    IndexWriterConfig config = new IndexWriterConfig(analyzer);

    java.nio.file.Path path = Paths.get("UnindexedFiles/");
    SimpleFSDirectory indexeddirectory = new SimpleFSDirectory(path);
    //IndexReader indexReader = null;
    IndexWriter indexWriter = new IndexWriter(indexeddirectory, config);
    System.out.println("7.000000000000000000000000000000");

    indexWriter.close();
  }


}
