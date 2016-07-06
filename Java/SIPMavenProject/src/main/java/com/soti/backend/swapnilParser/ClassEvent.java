package com.soti.backend.swapnilParser;

public class ClassEvent {
	//course code
	String courseCode;
	//Location of the event
	String location;
	//Day of the week the event is in
	String dayOfTheWeek;
	//Start time of event in 24 hour format
	String startTime;
	//End time of event in 24 hour format
	String endTime;
	//Determine whether the event is recurring at the same time
	//every week until the end of the semester
	boolean recurring;
}
