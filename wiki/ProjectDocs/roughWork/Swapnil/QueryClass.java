package com.utm.csc.server;
import java.io.IOException;
import java.nio.file.Paths;

import org.apache.lucene.analysis.Analyzer;
import org.apache.lucene.analysis.standard.StandardAnalyzer;
import org.apache.lucene.document.Document;
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
import org.apache.lucene.store.FSDirectory;
import org.apache.lucene.store.FSLockFactory;
import org.apache.lucene.store.SimpleFSDirectory;
import org.apache.tools.ant.types.Path;



public class QueryClass {
  public static String testRun(String stringQuery) throws IOException, ParseException {


    System.out.println("1.000000000000000000000000000000");
    Analyzer analyzer = new StandardAnalyzer();
    java.nio.file.Path path = Paths.get("IndexedFiles/");
    System.out.println("2.000000000000000000000000000000");
    SimpleFSDirectory indexeddirectory = new SimpleFSDirectory(path);
    System.out.println("3.000000000000000000000000000000");
    IndexReader indexReader = null;
    IndexWriterConfig config = new IndexWriterConfig(analyzer);
    IndexWriter indexWriter = new IndexWriter(indexeddirectory, config);

    Document doc = new Document();
    try{
      indexReader = DirectoryReader.open(indexeddirectory);
    } catch(Exception e)  {
      e.printStackTrace();
    }
    System.out.println("4.000000000000000000000000000000");
    IndexSearcher indexSearcher = new IndexSearcher(indexReader);
    System.out.println("5.000000000000000000000000000000");
    QueryParser parser = new QueryParser( "Content", analyzer);
    System.out.println("6.000000000000000000000000000000");
    Query query = parser.parse(stringQuery);


    System.out.println("7.000000000000000000000000000000");


    int hitsPerPage = 10;
    TopDocs docs = indexSearcher.search(query, hitsPerPage);
    ScoreDoc[] hits = docs.scoreDocs;
    int end = Math.min(docs.totalHits, hitsPerPage);
    System.out.println("Total Hits: " + docs.totalHits);
    System.out.println("Results: ");
    StringBuilder sb=new StringBuilder();
    for (int i = 0; i < end; i++) {
      Document d = indexSearcher.doc(hits[i].doc);
      sb.append("Content: " + d.get("Content")+"<br>");
    }
    return sb.toString();
  }
}