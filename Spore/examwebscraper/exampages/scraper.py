from bs4 import BeautifulSoup

soup = BeautifulSoup(open("exams.html"))

print(soup.name)
