Spore Front End
=================
To run the project, enter npm install, then npm start in the current directory.

Code Structure
--------------------

#### Each Component created in the console will have the following files:
> [name].component.html
> [name].component.scss
> [name].component.ts

.html files will be made up of div's and other angular components. 
div's will have a class assigned to them for styling. For example
> GOOD: < div class='ex'>< /div> 
> BAD: < ex>< /ex>
> GOOD: < div (click='someFunction()')>
> BAD: < button>< /button>

scss files will contain the styling of appropriate components

ts files will contain a component declaration for the functionality being defined, and appropriate imports. Code must not use extreme logic. If something can be done in a simpler way, it will fail review. 

Commit Messages
-------------------------

Commit Messages will be in the form: 

> [Description of the Commit] \n
> [Reason for the Commit] \n
> [GitHub Issue Number]
> NOTE: If there is no issue number available for the task you are working on, contact Adam, Swapnil or Darren and an issue will be created for you. 

Branch Names will be in the format: 

>[type: either 'feat' or 'bug']/[Github Issue Number]
> NOTE: If there is no issue number available for the branch you'd like to make, contact Adam, Swapnil or Darren. 

Code Reviews
-------------------

Code Reviews will be assigned to either Adam or Swapnil for front end code.

Any UI changes **MUST** be be approved by Kevin before being closed.

The standard process for code review is as follows:

> Move the issue into the Review pipe on GitHub
> If there is a UI change of any kind:

>- Assign the issue to Kevin
>- Post a screenshot of the UI change 
>- Add a comment explaining the UI change and why it is necessary

> If Kevin approves of the change, or if the code does not have any UI changes, the issue will then be assigned to either Adam or Swapnil for review. Issues that fail code review will be moved back into In Progress, with a comment explaining why it failed. Isses that pass code review will be moved into the Done pipe.

Code reviews will include: 

 - Code Quality
 - Functionaity
 - Implementation
 
**ISSUES MUST PASS CODE REVIEW TO BE CLOSED**
