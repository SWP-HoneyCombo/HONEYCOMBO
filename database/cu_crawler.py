import requests
from requests.exceptions import HTTPError
from bs4 import BeautifulSoup
from selenium import webdriver
import time
import pymysql

def getCatePage() :
	baseUrl = 'http://cu.bgfretail.com/product/product.do?category=product&depth2=5&depth3='
	prodJson = []
	for i in range(1) :
		tempUrl = baseUrl + str(i + 1)

		driver = webdriver.Chrome('C:/Users/thakd/Downloads/chromedriver')
		driver.get(tempUrl)

		while True :
			tempHtml = driver.page_source
			soup = BeautifulSoup(tempHtml, 'html.parser')

			if soup.find("div", {"class":"prodListBtn"}) is None :
				break
			else :
				driver.execute_script("nextPage(1);")
				time.sleep(3)

		prodListWrap = soup.findAll('div', {'class':'prodListWrap'})

		for listWrap in prodListWrap :
			prodList = listWrap.findAll('li')

			for prod in prodList :
				
				liTag = prod.find("img")

				if (liTag) :
					imgSrc = liTag['src']
					prodName = str(prod.find("p", {"class":"prodName"}).find("span").contents[0])
					prodPrice = int(str(prod.find("p", {"class":"prodPrice"}).find("span").contents[0]).replace(",", ""))
					prodObj = {"ITEMNAME":prodName, "ITEMPRICE" : int(prodPrice), "COMPANY" : "CU", "IMGFILENAME" : imgSrc}
					prodJson.append(prodObj)

				else :
					continue

	return prodJson

	


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