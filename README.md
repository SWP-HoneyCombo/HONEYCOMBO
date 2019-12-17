# HONEYCOMBO

![banner](https://i.imgur.com/ZMCLrTX.png)

>Somang Lee, Heejoe Choi, Chae Eun Lee
>
>Open Software Platform
>Ewha Womans University

## About

1. 편의점 러버들을 위한 편의점 러버들을 위한 편의점 제품 정보 및 레시피를 제공
2. 꿀조합러들과 자유롭게 편의점 레시피 공유 및 소통

### 웹사이트 화면 예시
![무제](https://i.imgur.com/lIZ5FFQ.png)

### 기능

1. **편의점 상품**

- 대표 편의점 GS25, CU의 상품들 편의점별로 보기
- 낮은 가격순, 높은 가격순으로 정렬 가능
- 원하는 편의점 상품 검색 가능

2. **편의점 레시피**

- 꿀조합러들이 올린 다양한 편의점 레시피 보기
- 레시피 제조 가격 범위와 재료 태그로 검색 가능
- 편의점 재료들을 선택하여 자유롭게 레시피 작성 가능
- 다른 꿀조합러들의 레시피 평점을 확인하고 댓글 작성 가능
- 원하는 레시피를 다른 사람들에게 카카오톡을 통해 공유 가능

## Code

### Requirements

- Node Package Module
- MySQL
- Python 3.6

### To do beforehand

- Database setting
  + Use database/honeycombo_table.sql
- Crawling
  + Use database/cu_crawler.py
  + Use database/gs_crawler.py
- Server
```
#download packages
npm install

#run server
node app.js
```
### To run
[http://localhost:3000/](http://localhost:3000/)

