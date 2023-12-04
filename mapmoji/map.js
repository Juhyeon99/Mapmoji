var map;
var mapContainer;
var markerArray = [];

var favoritePlace = {};
var pictureMarker = {};
//생성된 객체
var penData = {};
var markerData = {};
var memojiData = {};
var pinMemojiData = {};
var pictureData = {};
var pinPictureData = {};

var searchMarker = null;
var favoritePlace = {};
var ps = new kakao.maps.services.Places();


//체크박스 중복 방지
function oneCheck(chk) {
	var obj = document.getElementsByName("check");
	for (var i = 0; i < obj.length; i++) {
		if (obj[i] != chk) {
			obj[i].checked = false;
		}
	}
	pen();
}
/*
window.onload = function() {
mapContainer = document.getElementById('map');

if (navigator.geolocation) {
	navigator.geolocation.getCurrentPosition(function(position) {
		var uLat = position.coords.latitude;
		var uLng = position.coords.longitude;

		//맵 옵션
		var mapOption = {
			center: new kakao.maps.LatLng(uLat, uLng),
			level: 4,
			//draggable: false,
			disableDoubleClickZoom: true //더블클릭 줌 끄기
		};
		map = new kakao.maps.Map(mapContainer, mapOption);
		//searchPlaces();
		new Marker(map);
		new Memoji(map);
		new Memoji2(map);
		new Picture(map);
	});
} else { //아닐떄 기본값
	var mapOption = {
		center: new kakao.maps.LatLng(37.566826, 126.9786567),
		level: 4,
		//draggable: false,
		disableDoubleClickZoom: true
	};
	map = new kakao.maps.Map(mapContainer, mapOption);
	//searchPlaces();
	new Marker(map);
	new Memoji(map);
	new Memoji2(map);
	new Picture(map);
}
}
*/

function initMap(uLat, uLng) {
	mapContainer = document.getElementById('map');

	// 맵 옵션
	var mapOption = {
		center: new kakao.maps.LatLng(uLat, uLng),
		level: 4,
		disableDoubleClickZoom: true
	};
	map = new kakao.maps.Map(mapContainer, mapOption);
	initializeDrawingManager(map);
	new Marker(map);
	new PinMemoji(map);
	new Memoji(map);
	new Picture(map);
	new PinPicture(map);
	//테스트
	new LoadPinMemoji(map);
	new LoadMemoji(map);
}

function initMapError() {
	var mapOption = {
		center: new kakao.maps.LatLng(37.566826, 126.9786567),
		level: 4,
		disableDoubleClickZoom: true
	};
	map = new kakao.maps.Map(mapContainer, mapOption);
	initializeDrawingManager(map);
	new Marker(map);
	new PinMemoji(map);
	new Memoji(map);
	new Picture(map);
	new PinPicture(map);
	new LoadPinMemoji(map);
}

if (navigator.geolocation) {
	navigator.geolocation.getCurrentPosition(function(position) {
		var uLat = position.coords.latitude;
		var uLng = position.coords.longitude;
		initMap(uLat, uLng);
	}, function() {
		initMapError();
	});
} else {
	initMapError();
}


function pen() {
	var penModes = document.getElementById('modes');
	if (document.getElementById('penCheckbox').checked == true) {
		penModes.style.display = 'block';
	} else {
		penModes.style.display = 'none';
	}
}

var loadMemoToggle = false;

class LoadMemoji {
	constructor() {
		this.memoLoad = this.memoLoad.bind(this);
		mapContainer.addEventListener('contextmenu', (event) => {
			if (!loadMemoToggle) {
				this.memoLoad(event);
				loadMemoToggle = true;
			}
		});
	}
	memoLoad() {
		if (loadMemoToggle === false) {
			fetch('loadMemoji.jsp')
				.then(response => {
					if (!response.ok) {
						throw new Error('Network response was not ok');
					}
					return response.json();
				})
				.then(data => {
					console.log(data);
					for (let i = 0; i < data.length; i++) {
						const memoDiv = this.loadMemoUI(data[i].id, data[i].x, data[i].y, data[i].content);
						console.log(memoDiv);
					}
					loadMemoToggle = true;
				})
				.catch(error => {
					console.error('There was a problem with the fetch operation:', error);
				});
		}
	}

	loadMemoUI(id, x, y, content) {
		const memoDivWidth = 100;
		const memoDivHeight = 100;

		const memoDiv = document.createElement('div');
		memoDiv.setAttribute("data-id", id);

		memoDiv.style.position = 'absolute';
		memoDiv.style.left = (x - memoDivWidth / 2) + 'px';
		memoDiv.style.top = (y - memoDivHeight / 2) + 'px';
		memoDiv.style.zIndex = 1000;

		const memoText = document.createElement('textarea');
		memoText.style.width = memoDivWidth + 'px';
		memoText.style.height = memoDivHeight + 'px';
		memoText.style.resize = 'none';
		memoText.value = content;

		const memoDelBtn = document.createElement('button');
		memoDelBtn.textContent = 'X';
		memoDelBtn.onclick = () => this.deleteMemoji(memoDiv);
		memoDelBtn.onclick = () => this.deleteMemoji(id, memoDiv);

		memoDiv.appendChild(memoText);
		memoDiv.appendChild(memoDelBtn);
		document.body.appendChild(memoDiv);
	}

	deleteMemoji(id, memoDiv) {
		fetch(`deleteMemoji.jsp?id=${id}`)
			.then(response => {
				if (!response.ok) {
					throw new Error('Network response was not ok');
				}
				memoDiv.remove();
			})
			.catch(error => {
				console.error('There was a problem with the delete operation:', error);
			});
	}
}

var loadPinMemoToggle = false;

class LoadPinMemoji {
	constructor(map) {
		this.map = map;

		kakao.maps.event.addListener(map, 'rightclick', this.pinMemoLoad.bind(this));
	}

	pinMemoLoad() {
		//DB에서 데이터들 불러오기 (fetch로 get 요청)
		//location.href = "loadPinMemoji.jsp";
		//fetch("loadPinMemoji.jsp");
		if (loadPinMemoToggle === false) {
			fetch('loadPinMemoji.jsp')
				.then(response => {
					if (!response.ok) {
						throw new Error('Network response was not ok');
					}
					return response.json();
				})
				.then(data => {
					console.log(data);
					for (let i = 0; i < data.length; i++) {
						const pinMemoDiv = this.loadPinMemoUI(data[i].id, data[i].content);
						var position = new kakao.maps.LatLng(data[i].longitude, data[i].latitude);
						this.customLoadPinMemoji(pinMemoDiv, position);
						console.log(pinMemoDiv);
					}
					loadPinMemoToggle = true;
				})
				.catch(error => {
					console.error('There was a problem with the fetch operation:', error);
				});
		}

		//테스트 데이터
		//const data = { id: "1234", position: { La: 36.892968351513304, Ma: 126.68937494479835 }, content: "테스트데이터" }

		//반복문 돌려서 받아와서 id(삭제시 필요), position, content를 가져와서 랜더링
		//const pinMemoDiv = this.loadPinMemoUI(data.id, data.content);
		//var position = new kakao.maps.LatLng(data.position.La, data.position.Ma);

		//customLoadPinMemoji에다가 만든 div, position 넣고 호출
		//this.customLoadPinMemoji(pinMemoDiv, position);


	}

	loadPinMemoUI(id, content) {
		var pinMemoDiv = document.createElement('div');
		pinMemoDiv.setAttribute("data-id", id);
		
		var pinMemoText = document.createElement('textarea');
		var pinMemoDelBtn = document.createElement('button');

		pinMemoText.style.height = '100px';
		pinMemoText.style.width = '100px';
		pinMemoText.value = content;
		pinMemoText.style.resize = 'none';

		pinMemoDelBtn.textContent = 'X';
		pinMemoDelBtn.onclick = () => this.deletePinMemoji(id, pinMemoDiv);

		pinMemoDiv.appendChild(pinMemoText);
		pinMemoDiv.appendChild(pinMemoDelBtn);

		return pinMemoDiv;
	}

	customLoadPinMemoji(pinMemoDiv, position) {
		var customOverlay = new kakao.maps.CustomOverlay({
			content: pinMemoDiv,
			clickable: true,
			position: position,
			xAnchor: 0.5,
			yAnchor: 0.5
		});
		console.log(position);
		customOverlay.setMap(this.map);
	}

	deletePinMemoji(id, pinMemoDiv) {
		fetch(`deletePinMemoji.jsp?id=${id}`)
			.then(response => {
				if (!response.ok) {
					throw new Error('Network response was not ok');
				}
				pinMemoDiv.remove();
			})
			.catch(error => {
				console.error('There was a problem with the delete operation:', error);
			});
	}
}

class Marker {
	constructor(map) {
		this.map = map;

		kakao.maps.event.addListener(map, 'click', this.initMarker.bind(this));
	}
	initMarker(mouseEvent) {
		if (document.getElementById("markerCheckbox").checked == true) {
			const latlng = mouseEvent.latLng;
			const marker = new kakao.maps.Marker({
				position: latlng,
				map: this.map
			});

			
			const markerId = generateUniqueId();
			markerData[markerId] = {
				position: latlng
			};
			console.log(markerData);
			
			kakao.maps.event.addListener(marker, 'click', () => this.deleteMarker(marker, markerId));
		}
	}
	
	deleteMarker(marker, markerId) {
		marker.setMap(null);
		delete markerData[markerId];
	}
	/*markerUI(marker) {
		const markerDiv = document.createElement('div'); //UI 틀
		markerDiv.classList.add('marker-ui');
		markerDiv.style.position = 'relative';

		const textarea = document.createElement('textarea'); //메모장

		const markerDelBtn = document.createElement('button');
		markerDelBtn.textContent = 'X';
		markerDelBtn.onclick = () => this.deleteMarker(marker, markerDiv);
		markerDiv.appendChild(textarea);
		markerDiv.appendChild(markerDelBtn);
		document.body.appendChild(markerDiv);
	}
	deleteMarker(marker, markerDiv) {
		marker.setMap(null);
		markerArray = markerArray.filter(m => m !== marker);
		markerDiv.remove();
	}*/

}

class PinMemoji {
	constructor(map) {
		this.map = map;

		kakao.maps.event.addListener(map, 'click', this.initPinMemoji.bind(this));
	}

	initPinMemoji(mouseEvent) {
		if (document.getElementById("pinMemojiCheckbox").checked == true) {
			var pinMemoDiv = this.pinMemojiUI();
			var position = mouseEvent.latLng;
			//console.log('포지션입니다:', position.La, position.Ma);
			this.customPinMemoji(pinMemoDiv, position);
		}
	}

	pinMemojiUI() {
		var pinMemoDiv = document.createElement('div');
		//테스트
		const id = generateUniqueId();
		pinMemoDiv.setAttribute("data-id", id);
		pinMemoDiv.setAttribute("class", "pinMemoClass");
		var pinMemoText = document.createElement('textarea');
		var pinMemoDelBtn = document.createElement('button');

		pinMemoText.style.height = '100px';
		pinMemoText.style.width = '100px';
		pinMemoText.style.resize = 'none';


		pinMemoDelBtn.textContent = 'X';
		pinMemoDelBtn.onclick = () => this.deletePinMemoji(pinMemoDiv);

		pinMemoDiv.appendChild(pinMemoText);
		pinMemoDiv.appendChild(pinMemoDelBtn);

		return pinMemoDiv;
	}

	customPinMemoji(pinMemoDiv, position) {
		var customOverlay = new kakao.maps.CustomOverlay({
			content: pinMemoDiv,
			clickable: true,
			position: position,
			xAnchor: 0.5,
			yAnchor: 0.5
		});
		customOverlay.setMap(this.map);
		this.savePinMemojiData(pinMemoDiv, pinMemoDiv.querySelector('textarea'), position);
	}

	//테스트
	savePinMemojiData(pinMemoDiv, pinMemoText, position) {
		//const memoId = generateUniqueId();
		const memoId = pinMemoDiv.dataset.id;
		pinMemoDiv.memoId = memoId;
		pinMemojiData[memoId] = {
			element: pinMemoDiv,
			textElement: pinMemoText,
			position: position,
			content: pinMemoText.value
		};

		pinMemoText.addEventListener('input', () => {
			pinMemojiData[memoId].content = pinMemoText.value;

			console.log(`Memo updated: ${memoId}, Content: ${pinMemoText.value}, 
                     Latitude: ${position.getLat()}, Longitude: ${position.getLng()}`);
		});
	}

	deletePinMemoji(pinMemoDiv) {
		const memoId = pinMemoDiv.memoId;
		if (pinMemojiData[memoId]) {
			delete memojiData[memoId];

			console.log("Memo deleted:", memoId);
		}
		pinMemoDiv.remove();
	}
}

function displayPinMemojiList() {
	const displayDiv = document.getElementById('pinMemojiList');
	displayDiv.innerHTML = ''; // 기존 내용 초기화

	for (const id in pinMemojiData) {
		const memo = pinMemojiData[id];
		const memoContent = document.createElement('div');
		memoContent.textContent = `ID: ${id}, Content: ${memo.content}, Position: (${memo.position.getLat()}, ${memo.position.getLng()})`;
		displayDiv.appendChild(memoContent);
	}
}

class Memoji {
	constructor() {
		this.memojiUI = this.memojiUI.bind(this);
		this.dragStartX = 0;
		this.dragStartY = 0;
		this.drag = false;

		mapContainer.addEventListener('mousedown', (event) => {
			this.dragStartX = event.clientX;
			this.dragStartY = event.clientY;
			this.drag = false;
		});

		mapContainer.addEventListener('mousemove', (event) => {
			const dx = event.clientX - this.dragStartX;
			const dy = event.clientY - this.dragStartY;
			if (Math.sqrt(dx * dx + dy * dy) > 5) {
				this.drag = true;
			}
		});

		mapContainer.addEventListener('mouseup', (event) => {
			if (!this.drag) {
				this.memojiUI(event);
			}
			this.drag = false;
		});

	}
	memojiUI(event) {
		if (event.target.type === 'checkbox' ||
			event.target.tagName === 'BUTTON' ||
			event.target.type === 'textarea' ||
			event.target.tagName === 'LABEL'
		) {
			return;
		}
		if (document.getElementById("memojiCheckbox").checked == true) {
			const x = event.clientX;
			const y = event.clientY;

			const memoDivWidth = 100;
			const memoDivHeight = 100;

			const memoDiv = document.createElement('div');
			const id = generateUniqueId();
			memoDiv.setAttribute("data-id", id);
			memoDiv.setAttribute("class", "memoClass");

			memoDiv.style.position = 'absolute';
			memoDiv.style.left = (x - memoDivWidth / 2) + 'px';
			memoDiv.style.top = (y - memoDivHeight / 2) + 'px';
			memoDiv.style.zIndex = 1000;

			const memoText = document.createElement('textarea');
			memoText.style.width = memoDivWidth + 'px';
			memoText.style.height = memoDivHeight + 'px';
			memoText.style.resize = 'none';

			const memoDelBtn = document.createElement('button');
			memoDelBtn.textContent = 'X';
			memoDelBtn.onclick = () => this.deleteMemoji(memoDiv);

			memoDiv.appendChild(memoText);
			memoDiv.appendChild(memoDelBtn);
			document.body.appendChild(memoDiv);

			//테스트
			this.saveMemojiData(memoDiv, memoText, x, y);

			memoText.focus();
		}
	}

	//테스트
	saveMemojiData(memoDiv, memoText, x, y) {
		//const memoId = generateUniqueId();\
		const memoId = memoDiv.dataset.id;
		console.log(memoDiv.dataset.id);
		memoDiv.memoId = memoId;
		memojiData[memoId] = {
			element: memoDiv,
			textElement: memoText,
			x: x - 50,
			y: y - 50,
			content: memoText.value
		};

		memoText.addEventListener('input', () => {
			memojiData[memoId].content = memoText.value;
			console.log(`Memo updated: ${memoId}, Content: ${memoText.value}`);
		});

		console.log('Memo saved:', memojiData[memoId]);
	}

	deleteMemoji(memoDiv) {
		//테스트
		const memoId = memoDiv.memoId;
		if (memojiData[memoId]) {
			delete memojiData[memoId];
			console.log("Memo deleted:", memoId);
		}
		memoDiv.remove();
	}
}

class PinPicture {
	constructor(map) {
		this.map = map;

		kakao.maps.event.addListener(map, 'click', this.initPinPicture.bind(this));
	}

	initPinPicture(mouseEvent) {
		if (document.getElementById("pinPictureCheckbox").checked == true) {
			var position = mouseEvent.latLng;
			var pinPictureDiv = this.pinPictureUI(position);
			this.customPinPicture(pinPictureDiv, position);
		}
	}

	pinPictureUI(position) {
		var pinPictureDiv = document.createElement('div');
		pinPictureDiv.style.width = '100px';
		pinPictureDiv.style.height = '100px';
		pinPictureDiv.style.backgroundColor = 'white';

		var addPImgBtn = document.createElement('button');
		addPImgBtn.textContent = '첨부하기'
		addPImgBtn.onclick = () => this.addPImage(pinPictureDiv, position);

		var pPictureDelBtn = document.createElement('button');
		pPictureDelBtn.textContent = 'X'
		pPictureDelBtn.onclick = () => this.deletePinPicture(pinPictureDiv);

		pinPictureDiv.appendChild(addPImgBtn);
		pinPictureDiv.appendChild(pPictureDelBtn)

		return pinPictureDiv;
	}

	customPinPicture(pinPictureDiv, position) {
		var customOverlay = new kakao.maps.CustomOverlay({
			content: pinPictureDiv,
			clickable: true,
			position: position,
			xAnchor: 0.5,
			yAnchor: 0.5
		});
		customOverlay.setMap(this.map);
	}
	//테스트
	savePinPictureData(pinPictureDiv, img, position) {
		const pinPictureId = generateUniqueId();
		pinPictureDiv.pinPictureId = pinPictureId;
		pinPictureData[pinPictureId] = {
			element: pinPictureDiv,
			imageElement: img,
			position: position
		};
		console.log('Image Element:', img);
		console.log('Image Source (src):', img.src);
		console.log('Image Width:', img.style.width);
		console.log('Image Height:', img.style.height);
		console.log('Saved Pin Picture Data:', pinPictureData[pinPictureId]);
	}

	addPImage(div, position) {
		const input = document.createElement('input');
		input.type = 'file';
		input.accept = 'image/*';
		input.onchange = (e) => {
			const file = e.target.files[0];
			const reader = new FileReader();
			reader.onload = (e) => {
				const img = new Image();
				img.src = e.target.result;
				img.style.width = '100%';
				img.style.height = '100%';

				const pPictureDelBtn = document.createElement('button');
				pPictureDelBtn.textContent = 'X';
				pPictureDelBtn.style.position = 'absolute';
				pPictureDelBtn.onclick = () => this.deletePinPicture(div);

				div.innerHTML = ''; // 기존 내용 삭제
				div.appendChild(img); // 이미지 삽입
				div.appendChild(pPictureDelBtn);

				this.savePinPictureData(div, img, position);

			};
			reader.readAsDataURL(file);
		};
		input.click();
	}

	deletePinPicture(pinPictureDiv) {
		const pinPictureId = pinPictureDiv.pinPictureId;
		if (pinPictureData[pinPictureId]) {
			delete pinPictureData[pinPictureId];
			console.log('Updated Pin Picture Data after Deletion:', pinPictureData);
		}
		pinPictureDiv.remove();
	}
}

class Picture {
	constructor() {
		this.pictureUI = this.pictureUI.bind(this);
		this.dragStartX = 0;
		this.dragStartY = 0;
		this.drag = false;

		mapContainer.addEventListener('mousedown', (event) => {
			this.dragStartX = event.clientX;
			this.dragStartY = event.clientY;
			this.drag = false;
		});

		mapContainer.addEventListener('mousemove', (event) => {
			const dx = event.clientX - this.dragStartX;
			const dy = event.clientY - this.dragStartY;
			if (Math.sqrt(dx * dx + dy * dy) > 5) {
				this.drag = true;
			}
		});

		mapContainer.addEventListener('mouseup', (event) => {
			if (!this.drag) {
				this.pictureUI(event);
			}
			this.drag = false;
		});
	}
	pictureUI(event) {
		if (event.target.type === 'checkbox' ||
			event.target.tagName === 'BUTTON' ||
			event.target.type === 'textarea' ||
			event.target.tagName === 'LABEL'
		) {
			return;
		}

		if (document.getElementById("pictureCheckbox").checked == true) {
			const x = event.clientX;
			const y = event.clientY;

			const pictureDivWidth = 100;
			const pictureDivHeight = 100;

			const pictureDiv = document.createElement('div');
			pictureDiv.style.width = '100px'
			pictureDiv.style.height = '100px'
			pictureDiv.style.position = 'absolute';
			pictureDiv.style.left = (x - pictureDivWidth / 2) + 'px';
			pictureDiv.style.top = (y - pictureDivHeight / 2) + 'px';
			pictureDiv.style.backgroundColor = 'white';
			pictureDiv.style.border = '1px solid black';
			pictureDiv.style.zIndex = 1000;

			const addImgBtn = document.createElement('button');
			addImgBtn.textContent = '첨부하기';
			addImgBtn.onclick = () => this.addImage(pictureDiv, x, y);

			const pictureDelBtn = document.createElement('button');
			pictureDelBtn.textContent = 'X';
			pictureDelBtn.onclick = () => this.deletePicture(pictureDiv);

			pictureDiv.appendChild(addImgBtn);
			pictureDiv.appendChild(pictureDelBtn);
			document.body.appendChild(pictureDiv);
		}
	}
	addImage(div, x, y) {
		const input = document.createElement('input');
		input.type = 'file';
		input.accept = 'image/*';
		input.onchange = (e) => {
			const file = e.target.files[0];
			const reader = new FileReader();
			reader.onload = (e) => {
				const img = new Image();
				img.src = e.target.result;
				img.style.width = '100%';
				img.style.height = '100%';

				const pictureDelBtn = document.createElement('button');
				pictureDelBtn.textContent = 'X';
				pictureDelBtn.style.position = 'absolute';
				pictureDelBtn.onclick = () => this.deletePicture(div);

				div.innerHTML = ''; // 기존 내용 삭제
				div.appendChild(img); // 이미지 삽입
				div.appendChild(pictureDelBtn);

				this.savePictureData(div, img, x, y);
			};
			reader.readAsDataURL(file);
		};
		input.click();
	}

	savePictureData(pictureDiv, img, x, y) {
		const pictureId = generateUniqueId();
		pictureDiv.pictureId = pictureId;
		pictureData[pictureId] = {
			element: pictureDiv,
			imgElement: img,
			x: x - 50,
			y: y - 50
		};
		console.log('Image Element:', img);
		console.log('Image Source (src):', img.src);
		console.log('Image Width:', img.style.width);
		console.log('Image Height:', img.style.height);
		console.log('Saved Pin Picture Data:', pictureData[pictureId]);
	}

	deletePicture(pictureDiv) {
		const pictureId = pictureDiv.pictureId;
		if (pictureData[pictureId]) {
			delete pictureData[pictureId];
		}
		pictureDiv.remove();
	}
}





// 검색 결과 목록과 마커를 표출하는 함수입니다.
function searchPlaces() {
	var keyword = document.getElementById('keyword').value;

	if (!keyword.replace(/^\s+|\s+$/g, '')) {
		alert('키워드를 입력해주세요!');
		return false;
	}

	// 장소검색 객체를 통해 키워드로 장소검색을 요청합니다
	ps.keywordSearch(keyword, placesSearchCB);
}

// 장소검색이 완료됐을 때 호출되는 콜백함수 입니다
function placesSearchCB(data, status, pagination) {
	if (status === kakao.maps.services.Status.OK) {

		// 정상적으로 검색이 완료됐으면
		// 검색 목록과 마커를 표출합니다
		displayPlaces(data);

		// 페이지 번호를 표출합니다
		displayPagination(pagination);

	} else if (status === kakao.maps.services.Status.ZERO_RESULT) {

		alert('검색 결과가 존재하지 않습니다.');
		return;

	} else if (status === kakao.maps.services.Status.ERROR) {
		alert('검색 결과 중 오류가 발생했습니다.');
		return;
	}
}

// 검색 결과 목록과 마커를 표출하는 함수입니다
function displayPlaces(places) {
	var listEl = document.getElementById('placesList'),
		menuEl = document.getElementById('menu_wrap'),
		fragment = document.createDocumentFragment();
	bounds = new kakao.maps.LatLngBounds();

	// 검색 결과 목록에 추가된 항목들을 제거합니다
	removeAllChildNods(listEl);

	for (var i = 0; i < places.length; i++) {
		var placePosition = new kakao.maps.LatLng(places[i].y, places[i].x),
			itemEl = getListItem(i, places[i]);

		bounds.extend(placePosition)
		fragment.appendChild(itemEl);
	}

	// 검색결과 항목들을 검색결과 목록 Element에 추가합니다
	listEl.appendChild(fragment);
	menuEl.scrollTop = 0;

	map.setBounds(bounds);
}

// 검색결과 항목을 Element로 반환하는 함수입니다
function getListItem(index, places) {
	var fc = favoriteChecked(places.place_name);
	var cf = fc ? 'checked' : '';

	var el = document.createElement('li'),
		itemStr = '<div class="info">'
			+ '   <h5>' + places.place_name + '</h5>'
			+ '<input type="checkbox" id="fav_' + places.place_name + '"' + cf + '>'
	//+ '<label for="fav_' + places.place_name + '" class="custom-checkbox-label">즐겨찾기</label>'

	if (places.road_address_name) {
		itemStr += '    <span>' + places.road_address_name + '</span>' +
			'   <span class="jibun gray">' + places.address_name + '</span>';
	} else {
		itemStr += '    <span>' + places.address_name + '</span>';
	}

	itemStr += '  <span class="tel">' + places.phone + '</span>' +
		'</div>';

	el.innerHTML = itemStr;
	el.className = 'item';

	el.onclick = function() {
		var moveLatLon = new kakao.maps.LatLng(places.y, places.x);
		map.setCenter(moveLatLon);
		addMarker(moveLatLon, places.place_name);
	};

	return el;
}

function favoriteChecked(placeName) {
	return favoritePlace.hasOwnProperty(placeName);
}

function addMarker(position, placeName) {
	if (searchMarker) {
		searchMarker.setMap(null);
	}

	searchMarker = new kakao.maps.Marker({
		position: position
	});
	searchMarker.setMap(map);

	var checkbox = document.getElementById('fav_' + placeName);
	if (checkbox.checked) {
		if (!favoritePlace[placeName]) {
			favoritePlace[placeName] = {
				marker: new kakao.maps.Marker({
					position: position
				}), name: placeName
			};
			favoritePlace[placeName].marker.setMap(map);
			displayFavorite();
		}
	} else {
		if (favoritePlace[placeName]) {
			favoritePlace[placeName].marker.setMap(null);
			delete favoritePlace[placeName];
			displayFavorite();
		}
	}
}

// 즐겨찾기 리스트 출력
function displayFavorite() {
	var favoriteList = document.getElementById('favoriteList');
	favoriteList.innerHTML = '';

	for (var placeName in favoritePlace) {
		if (favoritePlace.hasOwnProperty(placeName)) {
			var list = document.createElement('li');
			list.textContent = favoritePlace[placeName].name;
			favoriteList.appendChild(list);
		}
	}
}

function displayPagination(pagination) {
	var paginationEl = document.getElementById('pagination'),
		fragment = document.createDocumentFragment();

	while (paginationEl.hasChildNodes()) {
		paginationEl.removeChild(paginationEl.lastChild);
	}

	for (var i = 1; i <= pagination.last; i++) {
		var el = document.createElement('a');
		el.href = "#";
		el.innerHTML = i;

		if (i === pagination.current) {
			el.className = 'on';
		} else {
			el.onclick = (function(i) {
				return function() {
					pagination.gotoPage(i);
				}
			})(i);
		}

		fragment.appendChild(el);
	}
	paginationEl.appendChild(fragment);
}

// 검색결과 목록의 자식 Element를 제거하는 함수입니다
function removeAllChildNods(el) {
	while (el.hasChildNodes()) {
		el.removeChild(el.lastChild);
	}
}

var manager;

function initializeDrawingManager(map) {
	var drawingOptions = { // Drawing Manager를 생성할 때 사용할 옵션입니다
		map: map,
		drawingMode: [
			kakao.maps.drawing.OverlayType.ARROW,
			kakao.maps.drawing.OverlayType.POLYLINE,
			kakao.maps.drawing.OverlayType.RECTANGLE,
			kakao.maps.drawing.OverlayType.CIRCLE,
			kakao.maps.drawing.OverlayType.POLYGON
		],
		guideTooltip: ['draw', 'drag', 'edit'],
		markerOptions: {
			draggable: true,
			removable: true
		},
		polylineOptions: {
			draggable: true,
			removable: true,
			editable: true,
			strokeColor: '#39f',
			hintStrokeStyle: 'dash',
			hintStrokeOpacity: 0.5
		},
		rectangleOptions: {
			draggable: true,
			removable: true,
			editable: true,
			strokeColor: '#39f',
			fillColor: '#39f',
			fillOpacity: 0.5
		},
		circleOptions: {
			draggable: true,
			removable: true,
			editable: true,
			strokeColor: '#39f',
			fillColor: '#39f',
			fillOpacity: 0.5
		},
		polygonOptions: {
			draggable: true,
			removable: true,
			editable: true,
			strokeColor: '#39f',
			fillColor: '#39f',
			fillOpacity: 0.5,
			hintStrokeStyle: 'dash',
			hintStrokeOpacity: 0.5
		},
		arrowOptions: {
			draggable: true,
			removable: true,
			strokeColor: '#39f', // 화살표의 테두리 색을 빨간색으로 설정
		}
	};

	// Drawing Manager 생성
	manager = new kakao.maps.drawing.DrawingManager(drawingOptions);
}
function selectOverlay(type) {
	// 그리기 중이면 그리기를 취소합니다
	manager.cancel();

	// 클릭한 그리기 요소 타입을 선택합니다
	manager.select(kakao.maps.drawing.OverlayType[type]);
}

function generateUniqueId() {
	return Date.now();
}
