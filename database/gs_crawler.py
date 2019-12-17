import requests
from requests.exceptions import HTTPError
from bs4 import BeautifulSoup
from selenium import webdriver
import time
import pymysql
from selenium.webdriver.common.keys import Keys

def getCatePage() :
	baseUrl = 'http://gs25.gsretail.com/gscvs/ko/products/youus-different-service#;'
	prodJson = []

	# install chromedriver! and change temp webdriver path to your local path
	driver = webdriver.Chrome('C:\\Users\\heejo\\Downloads\\chromedriver')
	driver.get(baseUrl)
	
	tempHtml = driver.page_source
	soup = BeautifulSoup(tempHtml, 'html.parser')

	for i in range(1, 45) : #44

		productListWrap = soup.findAll('ul', {"class":"prod_list"})[0]

		prodList = productListWrap.findAll('li')

		for prod in prodList :
			liImg = prod.find("img")
			if(liImg) : 
				imgSrc = prod.find("img")['src']
				prodName = prod.find('p', {"class":"tit"}).contents[0]
				prodPrice = prod.find("span").contents[0].replace(",", "")
				prodObj = {"ITEMNAME" : prodName, "ITEMPRICE": int(prodPrice), "COMPANY":"GS", "IMGFILENAME":imgSrc}
				prodJson.append(prodObj)
			else :
				continue

		print("temp product list = ")
		print(prodJson)
		print("\n\n")

		time.sleep(5)
		driver.find_element_by_class_name("next").send_keys(Keys.ENTER)
		tempHtml = driver.page_source
		soup = BeautifulSoup(tempHtml, 'html.parser')

	withoutDuple = list({prod['ITEMNAME'] : prod for prod in prodJson}.values())
	print(withoutDuple)

	return withoutDuple
	


def main() :
	conn = pymysql.connect(host='localhost', port=3306, user='honeycombo', password='honeycombo123', db='honeycombo', charset='utf8')
	curs = conn.cursor(pymysql.cursors.DictCursor)

	sql = """ INSERT INTO PRODUCT (ITEMNAME, ITEMPRICE, COMPANY, IMGFILENAME) values """
	
	insertData = getCatePage()

	for obj in insertData :
		strValue = '(\'' + obj['ITEMNAME'] + '\', ' + str(obj['ITEMPRICE']) + ', \'' + obj['COMPANY'] + '\', \'' + obj['IMGFILENAME'] + '\'),'
		sql += strValue

	query = sql[:-1] + ';'
	curs.execute(query)
	conn.commit()
	conn.close()


if __name__ == "__main__" :
	main()