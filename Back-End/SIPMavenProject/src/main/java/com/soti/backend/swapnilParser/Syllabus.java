package com.soti.backend.swapnilParser;

import java.util.ArrayList;
import java.util.List;

public class Syllabus {
	//University Name
	String nameOfUniversity;
	//Represents the course code
	String courseCode;
	//Name of the Course
	String courseName;
	//Lecture Section
	String lectureSection;
	//List of Lecture Times, insert [Day of the Week, Location, Start Time in 24 hour format, End Time in 24 hour format]
	ArrayList<ArrayList<String>> lectureTimes = new ArrayList<ArrayList<String>>();
	//Name of the professor
	String professorName;
	//Email address of Professor
	String professorEmail;
	//Website name of Professor
	String professorWebsite;
	//The location of the office
	String officeLocation;
	//represents the office hours in format [Location, Day of the Week, Start Time in 24 hour format, End Time in 24 hour format]
	//sample entry is [DH3084, Friday, 10:30, 13:00]
	ArrayList<ArrayList<String>> officeHoursTimes = new ArrayList<ArrayList<String>>();
	//Semester the course is in (Fall, Winter, Summer)
	String semester;
	//list of gradedEvaluation objects in the course
	ArrayList<GradedEvaluation> gradedEvaluations = new ArrayList<GradedEvaluation>();
}
