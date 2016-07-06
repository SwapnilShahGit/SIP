package com.soti.backend.swapnilParser;

import java.util.ArrayList;

public class Syllabus {
	//University Name (e.g. University of Toronto)
	String nameOfUniversity;
	//Represents the course code (e.g. CSC108)
	String courseCode;
	//Name of the Course (e.g. Introduction to Algorithms)
	String courseName;
	//Lecture Section (LEC0102, etc.)
	String lectureSection;
	//List of lecture times, tutorial times, and practical times that are outlined in a ClassEvent object
	ArrayList<ClassEvent> classTimes = new ArrayList<ClassEvent>();
	//Name of the professor (e.g. Daniel Zingaro)
	String professorName;
	//Email address of Professor (e.g. Daniel.Zingaro@mail.utoronto.ca)
	String professorEmail;
	//Website URL of Professor (e.g. www.google.com)
	String professorWebsite;
	//The location of the office (e.g. DH 3080)
	String officeLocation;
	//A list of ClassEvents that represent office hours
	ArrayList<ClassEvent> officeHoursTimes = new ArrayList<ClassEvent>();
	//Semester the course is in (Fall, Winter, Summer)
	String semester;
	//list of gradedEvaluation objects in the course
	ArrayList<GradedEvaluation> gradedEvaluations = new ArrayList<GradedEvaluation>();
}
