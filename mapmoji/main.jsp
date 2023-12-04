<%@page import="java.sql.*"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>mapmogi</title>
<script type="text/javascript"
	src="//dapi.kakao.com/v2/maps/sdk.js?appkey=d3d79c22f00aa9407e65920f9e8e3b72&libraries=services,drawing"></script>
<link type="text/css" rel="stylesheet" href="style.css">
</head>

<body>
	<div class="map_wrap" id="wrap">
		<div id="map" class="map"></div>
		<div id="menu_wrap" class="bg_white">
			<div class="option">
				<div>
					<form onsubmit="searchPlaces(); return false;">
						키워드 : <input type="text" value="" id="keyword" size="15">
						<button type="submit">검색하기</button>
					</form>
				</div>
			</div>
			<hr>
			<ul id="placesList"></ul>
			<div id="pagination"></div>
		</div>
	</div>
	<ul id="favoriteList"></ul>
	<div id="pinMemojiList"></div>
	<div id="toolBox">
		<p class="modes" id="modes">
			<button onclick="selectOverlay('ARROW')">화살표</button>
			<button onclick="selectOverlay('POLYLINE')">선</button>
			<button onclick="selectOverlay('CIRCLE')">원</button>
			<button onclick="selectOverlay('RECTANGLE')">사각형</button>
			<button onclick="selectOverlay('POLYGON')">다각형</button>
		</p>
		<input id="penCheckbox" name="check" class="toolChk" type="checkbox"
			onclick="oneCheck(this)" onchange="pen(this)">펜 <input
			id="markerCheckbox" name="check" class="toolChk" type="checkbox"
			onclick="oneCheck(this)">마커 <input id="pinMemojiCheckbox"
			name="check" class="toolChk" type="checkbox" onclick="oneCheck(this)">핀메모지
		<input id="memojiCheckbox" name="check" class="toolChk"
			type="checkbox" onclick="oneCheck(this)">메모지 <input
			id="pinPictureCheckbox" name="check" class="toolChk" type="checkbox"
			onclick="oneCheck(this)">핀사진 <input id="pictureCheckbox"
			name="check" class="toolChk" type="checkbox" onclick="oneCheck(this)">사진
	</div>
	<input type="button" value="저장" onclick="save()">
	<br>
	불러오기는 우클릭 입니다.
	<script type="text/javascript" src="map.js"></script>
	<script>
		function save() {
			const pinMemos = document.getElementsByClassName('pinMemoClass');
			console.log(pinMemos);

			for (let i = 0; i < pinMemos.length; i++) {
				const data = pinMemojiData[pinMemos[i].dataset.id];
				const url = "savePinMemo.jsp?" + "id=" + data.element.memoId
						+ "&latitude=" + data.position.La + "&longitude="
						+ data.position.Ma + "&content="
						+ encodeURIComponent(data.content);
				fetch(url);
			}

			const memos = document.getElementsByClassName('memoClass');
			console.log(memos);
			//const data = memojiData[memos[0].dataset.id];
			//console.log(data);

			for (let i = 0; i < memos.length; i++) {
				const data = memojiData[memos[i].dataset.id];
				const url = "saveMemo.jsp?" + "id=" + data.element.memoId
						+ "&x=" + data.x + "&y=" + data.y + "&content="
						+ encodeURIComponent(data.content);
				fetch(url);
			}
			
			//for (let i = 0; i<markers.length; i++) {
			//	const data = markerData[markers[i].dataset.id];
			//	const url = 
			//}
			//console.log(data);
			//console.log(url);
			//console.log(data.content);
			//console.log(url);
			//location.href = url;
			window.location.reload();
		}
	</script>
</body>
</html>