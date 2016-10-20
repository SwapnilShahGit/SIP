from bs4 import BeautifulSoup
import urllib2, json, io, time, os

#figure out what exam this is for
now = time.strftime("%m")
filename = ""
April = 4
July = 7
June = 6
September = 9
if now <= April:
    filename += "apr" + time.strftime("%y")
elif now > April and now < July:
    filename += "jun" + time.strftime("%y")
elif now > June and now < September:
    filename += "aug" + time.strftime("%y")
else:
    filename += "dec" + time.strftime("%y")

#create appropriate directory to store files
if not os.path.exists(filename):
    os.makedirs(filename)

#saving raw HTML into directory
page_content = urllib2.urlopen("https://student.utm.utoronto.ca/examschedule/finalexams.php").read()
with open(filename + '/rawpagesource.html', 'w') as f:
  f.write(page_content)

#start logic of the scraper
soup = BeautifulSoup(page_content, "html.parser")

#get individual rows
class_exams = []
table = soup.find('table', attrs={'class', 'request_history schedule'})
table_body = table.find('tbody')
rows = table_body.find_all('tr')
for row in rows:
    cols = row.find_all('td')
    cols = [ele.get_text() for ele in cols]
    class_exams.append([ele.encode('ascii', 'ignore') for ele in cols if ele])

#get names of columns
table_head = table.find('thead')
names = table_head.find_all('th')
column_names = [ele.get_text() for ele in names]
column_names = [ele.encode('ascii', 'ignore') for ele in column_names if ele]

#match the column names with each individual row
final_list = []
for class_exam in class_exams:
    temp_list1 = []
    temp_list1.append(class_exam[0])
    temp_list2 = []
    for i in range(1, len(class_exam)):
        temp_list2.append([column_names[i], class_exam[i]])
    temp_list1.append(temp_list2)
    final_list.append(temp_list1)

#save matched rows and columns into a JSON file inside newly created folder
with io.open(filename + '/' + filename + ".json", 'w', encoding='utf-8') as f:
  f.write(unicode(json.dumps(final_list)))
