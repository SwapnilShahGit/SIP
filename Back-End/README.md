![cover](https://proctorexam.com/2015/wp-content/uploads/2016/01/back-end.jpg)

# Back-End Team
This folder contains our code. Our main goal is to implement the parser with use of either Java and/or Python. 
This parser will be the primary focus of the entire project as it will need to work with a high level of accuracy for a better user experience. We have included a high level to-do list for this project below.

| Name    | Current Tasks                                                                            |
| ------- | ---------------------------------------------------------------------------------------- |
| Pranali | Pdf to Text conversion                                                                   |
|         | Check if class currently exists in the database                                          |
|         | look for anomalies in the pdf (things that might be wrong with the formatting)           |
|         | send raw string to darren                                                                |
| Darren  | go through different date formats and find the relevant dates in the document            |
|         | search around the date to find relevant information about the date                       |
|         | generate an object that has attributes of the found characteristics                      |
|         | Pass object to Swapnil                                                                   |
| Swapnil | Identify the date and information given                                                  |
|         | Process information for google calendar API                                              |
|         | send information to google and send an acknowledgement to the front-end with information |
|         | store Syllabus information on the database for future reference                          |


| End Goals                                                                                                                           |
|---------------------------------------------------------------------------------------------------------------------------------|
| Finish a basic version of the parser that works with 10 sample syllabi from UTM                                                 |
| Set up a server that will accept requests from the front-end and potential mobile applications                                  |
| Google Calendar API Integration using CalDev                                                                                    |
| Establish a database to store user information and manage the existing syllabus                                                 |
| A smarter system that will detect if the information from a specific syllabus has already been parsed (similar to a dictionary) |
| Ensure the parser works with 10 sample syllabi from UofT St.George                                                              |
| Ensure the parser works with syllabi from any university in Canada                                                              |  
| Support multiple types of documents (.pdf, .word, .txt, .html)                                                                  |  

The Back-End team consists of: 

Darren Hobin (Darren.Hobin@soti.net)

Pranali Rathi (Pranali.Rathi@soti.net)

Swapnil Shah (Swapnil.Shah@soti.net)

