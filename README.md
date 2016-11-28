# Starting Spore

## Windows
Open Bash in this directory and run the `start.sh` script.

The script takes the following *optional* arguments...

* `-d=path` - Specify a custom path for your mongo database
* `-p` - Run the server in production mode

If no arguments are given, the server is run in developer mode with the default database path of `C:\data\db`.

## Linux/macOS
* Ensure MongoDB is started
* Navigate to `Spore/front`
* Run `npm install`
* Run `npm run build:prod`
* Navigate to `Spore/back`
* Run `npm install`
* Run `npm start`

# SIP Description
This is a full-stack project that was created by the PEY Interns of the 2016-2017 year at SOTI. The contributors are:

Adam Natale (Adam.Natale@soti.net)

Darren Hobin (Darren.Hobin@soti.net)

Pavlo Usoltsev (Pavlo.Usoltsev@soti.net)

Pranali Rathi (Pranali.Rathi@soti.net)

Swapnil Shah (Swapnil.Shah@soti.net)

Zach Medeiros (Zach.Medeiros@soti.net)

---

Here are the original ideas for this project:

Parser for syllabus  
- A scalable web-application that adds important dates from syllabus to the calendar system (maybe google calendar)  
- Will have Google Drive and OneOffice integrated to help mobile users
- Calendars that are built into the application will be shareable with friends
- An integrated chatting system that will let students discuss
- Have the option to make a new calendar for social clubs
- Upload all the syllabus to one repository and let users search through their syllabus  
- You can put in any type of document (.pdf, .word, .txt, .html) and the service will check for dates and automatically add the dates to your google calendar and potentially other to-do list applications like OneNote
- Set up a way for users to buy/sell textbooks easily
- Other integrated apps will potentially be included such as reminders using SMS and/or email, skype chat/slack integration, GPA Calculator, Course Mark Calculator, etc. The options are limitless.
