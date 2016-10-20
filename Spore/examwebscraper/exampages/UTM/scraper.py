from bs4 import BeautifulSoup
import urllib2
import json
import io
import time
import os

now = time.strftime("%m")
filename = ""

if now <= 4:
    filename += "apr" + time.strftime("%y")
elif now > 4 and now < 7:
    filename += "jun" + time.strftime("%y")
elif now > 6 and now < 9:
    filename += "aug" + time.strftime("%y")
else:
    filename += "dec" + time.strftime("%y")
    
if not os.path.exists(filename):
    os.makedirs(filename)

page = urllib2.urlopen("https://student.utm.utoronto.ca/examschedule/finalexams.php")

page_content = urllib2.urlopen("https://student.utm.utoronto.ca/examschedule/finalexams.php").read()

with open(filename + '/rawpagesource.html', 'w') as f:
  f.write(page_content)

soup = BeautifulSoup(page, "html.parser")

#getting individual rows
class_exams = []
table = soup.find('table', attrs={'class', 'request_history schedule'})
table_body = table.find('tbody')
table_head = table.find('thead')

rows = table_body.find_all('tr')
for row in rows:
    cols = row.find_all('td')
    cols = [ele.text.strip() for ele in cols]
    class_exams.append([str(ele) for ele in cols if ele]) # Get rid of empty values

#getting names of columns
names = table_head.find_all('th')
table_head = table.find('thead')
column_names = [ele.text.strip() for ele in names]
column_names = [str(ele) for ele in column_names if ele] # Get rid of empty values

#merging the two together
final_list = []
for class_exam in class_exams:
    temp_list1 = []
    temp_list1.append(class_exam[0])
    temp_list2 = []
    for i in range(1, len(class_exam)):
        temp_list2.append([column_names[i], class_exam[i]])

    temp_list1.append(temp_list2)
    final_list.append(temp_list1)


with io.open(filename + '/' + filename + ".json", 'w', encoding='utf-8') as f:
  f.write(unicode(json.dumps(final_list)))
