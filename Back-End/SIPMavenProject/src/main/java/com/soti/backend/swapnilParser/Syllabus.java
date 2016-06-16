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
	ArrayList<ClassEvent> lectureTimes = new ArrayList<ClassEvent>();
	//Name of the professor
	String professorName;
	//Email address of Professor
	String professorEmail;
	//Website URL of Professor
	String professorWebsite;
	//The location of the office
	String officeLocation;
	//represents the office hours in format [Location, Day of the Week, Start Time in 24 hour format, End Time in 24 hour format]
	ArrayList<ClassEvent> officeHoursTimes = new ArrayList<ClassEvent>();
	//Semester the course is in (Fall, Winter, Summer)
	String semester;
	//list of gradedEvaluation objects in the course
	ArrayList<GradedEvaluation> gradedEvaluations = new ArrayList<GradedEvaluation>();
}
