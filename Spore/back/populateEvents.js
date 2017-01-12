//_________________________________________________________________________________________________
// -- script to populate database with dummy events
// -- events can range from being a few hours to week long
// -- between 2010-01-01T00:00 and 2020-12-31T24:00
// -- Created January 5, 2017
//_________________________________________________________________________________________________
var dj = require('dummy-json');

var eventArray = [];


 // -- create a list of events
for (var i = 0; i<1000; i++){

   var date = '{{date "2010-01-01T00:00" "2020-12-31T24:00" "YYYY-MM-DDThh:mm:ss"}}';
   var fewHours ='{{int 1 3600000 round=1000}}';
   var sameDay = '{{int 1 86400000 round=1000}}';
   var differentDay = '{{int 86400000 604800000 round=1000}}';

    var startTime = Date.parse(dj.parse(date));
    var endTime ;


    // -- longer events will be created less frequently than
    if ((i%100) == 0){
        endTime = startTime + parseInt(dj.parse(differentDay));
    }
    else if((i%75) == 0){
        endTime = startTime + parseInt(dj.parse(sameDay));
    }
    else{
        endTime = startTime + parseInt(dj.parse(fewHours));
    }

    var eventTitle = dj.parse('{{lorem 10}}');

    var event = {
         title: eventTitle,
         start: new Date(startTime),
         end: new Date(endTime)
    }
    eventArray[i] = event;

}
console.log(eventArray);


