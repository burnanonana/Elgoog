document.addEventListener('DOMContentLoaded', () => {
    // 1. 데이터 정의 (요청하신 정확한 동물 정보)
    const allAnimals = [
        { id: 1, img: 'animal1.png', name: '뿔모기', enName: 'HornMosquito', desc: '파리목 모기과에 속한다. 머리 부분에 뿔이 달려 있어 산란기의 암컷은 흡혈 시 숙주의 위협이 느껴지면 숙주를 공격한다.' },
        { id: 2, img: 'animal2.png', name: '고숭이', enName: 'Monkat', desc: '영장류에 속한다. 귀는 고양이과의 것과 닮았으며 주로 산에 서식한다. 성격이 사나워 사육하기 어렵다.' },
        { id: 3, img: 'animal3.png', name: '날고양이', enName: 'Catfly', desc: '고양이과에 속하나 조류의 날개를 가지고 있다. 집고양이와 유사하지만 자주 날지 않게 되면 스트레스를 유발하기에 가정에서 키우기는 어렵다.' },
        { id: 4, img: 'animal4.png', name: '녹색마', enName: 'Gorse', desc: '말목 말과의 동물이다. 초원에 서식하기 때문에 보호색으로 몸이 초록색인 것이 특징이다. 그로 인해 광합성이 가능하다.' },
        { id: 5, img: 'animal5.png', name: '털흰동가리', enName: 'HairyClownfish', desc: '흰동가리속에 속하는 바닷물고기이다. 생김새가 비슷한 흰동가리와는 다르게 개체 표면이 털로 덮여 있고 아가미와 폐가 함께 있어 물 밖에서도 서식한다.' },
        { id: 6, img: 'animal6.png', name: '물고릴라', enName: 'Worilla', desc: '고릴라과에 속하는 유인원이나 폐와 아가미를 함께 지니고 있어 물 속에서도 생존이 가능하다. 주식은 어류이고 천적은 털흰동가리이며, 주로 해변에 서식한다.' },
        { id: 7, img: 'animal7.png', name: '달팽이거북', enName: 'SnailTurtle', desc: '거북목 땅거북과에 속한다. 등딱지가 달팽이의 패각과 유사한데, 이는 등딱지 속 공간을 더 확보하기 위함으로 달팽이의 모습을 모방했기 때문이다.' },
        { id: 8, img: 'animal8.png', name: '햄스어', enName: 'Fisham', desc: '설치류인 햄스터의 모습과 유사하지만 어류이다. 햄스어라는 명칭도 햄스터와 닮았기에 붙여졌다. 비늘의 색이 예쁘고 생김새가 귀여워서 애완용으로 많이 길러진다.' },
        { id: 9, img: 'animal9.png', name: '갬', enName: 'Snar', desc: '파충류인 뱀의 몸에 포유류인 곰의 머리와 팔다리가 달려 있다. 이 동물이 언제부터 존재했고, 어떻게 분류해야 할 지에 대해서는 학자들 사이에서도 아직까지 의견이 분분하다.' },
        { id: 10, img: 'animal10.png', name: '어드밴스드카라칼', enName: 'Advanced Caracal', desc: '야생 고양이인 카라칼이 급격한 진화 과정을 거치면서 발생했다. 위장을 위한 줄무늬를 지녔으며, 박쥐의 날개를 가지고 있고, 초음파로 소통한다.' },
    ];

    // DOM 요소 가져오기
    const mobileContainer = document.querySelector('.mobile-container');
    const eyeOs = document.querySelectorAll('.eye-o');
    const floatingContainer = document.getElementById('floating-animals-container');
    const enclosureBox = document.getElementById('enclosure');
    const searchScreen = document.getElementById('search-screen');
    const resultScreen = document.getElementById('result-screen');
    const animalDetails = document.getElementById('animal-details');
    const resultLogo = document.getElementById('result-logo'); // [추가]

    let draggedAnimalId = null; // 드래그 중인 동물의 ID 저장
    let currentDraggingElement = null; // 터치 드래그 시 현재 움직이는 요소 저장

    const imagePathPrefix = 'src/images/';
    // --- 1. 눈동자 움직임 로직 ---
    function moveEyes() {
        eyeOs.forEach(eye => {
            const x = Math.random() * 10 - 5;
            const y = Math.random() * 10 - 5;
            
            // style.css의 ::before 선택자의 transform 속도를 제어하기 위해 CSS 변수 사용
            eye.style.setProperty('--eye-x', `${x}px`);
            eye.style.setProperty('--eye-y', `${y}px`);
        });
    }

    setInterval(moveEyes, 2000); 


    // --- 2. 랜덤 동물 배치 및 이벤트 등록 로직 ---
    function getRandomAnimals() {
        const shuffled = [...allAnimals].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, 3);
    }

    function checkCollision(rect1, rect2) {
    // 겹치지 않는 경우:
    // 1. rect1의 오른쪽이 rect2의 왼쪽보다 작거나
    // 2. rect1의 왼쪽이 rect2의 오른쪽보다 크거나
    // 3. rect1의 아래쪽이 rect2의 위쪽보다 작거나
    // 4. rect1의 위쪽이 rect2의 아래쪽보다 큰 경우
    return !(
        rect1.right < rect2.left ||
        rect1.left > rect2.right ||
        rect1.bottom < rect2.top ||
        rect1.top > rect2.bottom
    );
    }

    // main.js 파일 (기존 renderFloatingAnimals 함수를 아래 코드로 교체)

function renderFloatingAnimals() {
    const container = document.getElementById('floating-animals-container');
    container.innerHTML = '';
    
    // 이전에 CSS에서 설정한 .floating-animal의 크기와 일치해야 합니다. (140px)
    const animalSize = 140; 
    const animalsToDisplay = getRandomAnimals();
    
    // 이미 배치된 동물의 위치 정보를 저장할 배열
    const placedRects = []; 

    animalsToDisplay.forEach((animal) => {
        let newLeft, newTop;
        let isColliding = true;
        let attempts = 0; // 무한 루프 방지용 시도 횟수 제한

        // 겹치지 않는 위치를 찾을 때까지 루프를 실행
        while (isColliding && attempts < 100) {
            isColliding = false; // 기본적으로 겹치지 않는다고 가정
            attempts++;

            // 1. 새로운 무작위 위치 생성
            // container.clientWidth 대신 floatingContainer.clientWidth를 사용해야 하나,
            // 이 컨텍스트에서는 floatingContainer가 아직 정의되지 않았으므로 container를 사용합니다.
            newLeft = Math.random() * (container.clientWidth - animalSize);
            newTop = Math.random() * (container.clientHeight - animalSize);
            
            // 2. 새로운 동물의 임시 위치 정보(사각형) 생성
            const newRect = {
                left: newLeft,
                top: newTop,
                right: newLeft + animalSize,
                bottom: newTop + animalSize
            };
            
            // 3. 이미 배치된 동물들과 충돌하는지 확인
            for (const existingRect of placedRects) {
                if (checkCollision(newRect, existingRect)) {
                    isColliding = true; // 충돌 발견! 다시 시도해야 함
                    break;
                }
            }

            if (!isColliding) {
                // 겹치지 않으면 위치 확정 및 저장
                placedRects.push(newRect);
            }
        }
        
        // 5. 위치가 확정되면 DOM 요소 생성 및 배치
        const animalDiv = document.createElement('div');
        animalDiv.className = 'floating-animal';
        animalDiv.setAttribute('draggable', true);
        animalDiv.dataset.animalId = animal.id;
        
        const img = document.createElement('img');
        const nukkiFilename = animal.img.replace('.png', 'n.png'); 
        img.src = `${imagePathPrefix}${nukkiFilename}`; 
        img.alt = animal.name;
        animalDiv.appendChild(img);

        // 확정된 위치 적용
        animalDiv.style.left = `${newLeft}px`;
        animalDiv.style.top = `${newTop}px`;
        animalDiv.style.animationDelay = `${Math.random() * 2}s`; 

        // 이벤트 리스너는 기존 로직을 따릅니다 (생략된 부분은 기존대로 유지)
        animalDiv.addEventListener('dragstart', (e) => { /* ... */ });
        animalDiv.addEventListener('dragend', (e) => { /* ... */ });
        animalDiv.addEventListener('touchstart', handleTouchStart);
        animalDiv.addEventListener('touchmove', handleTouchMove);
        animalDiv.addEventListener('touchend', handleTouchEnd);
        
        container.appendChild(animalDiv);
    });
    }

    // --- 터치 드래그 핸들러 함수 ---
    function handleTouchStart(e) {
        e.preventDefault(); // 기본 스크롤 동작 방지
        const touch = e.touches[0];
        currentDraggingElement = this; // 'this'는 현재 터치된 animalDiv
        draggedAnimalId = parseInt(this.dataset.animalId);
        
        currentDraggingElement.classList.add('is-dragging'); // 드래그 중임을 표시
        currentDraggingElement.style.opacity = '0.5';

       // 1. 요소의 현재 위치 스타일 값을 가져와 숫자로 변환합니다.
       const currentLeft = parseFloat(currentDraggingElement.style.left) || 0;
       const currentTop = parseFloat(currentDraggingElement.style.top) || 0;

       // 2. 부모 컨테이너의 위치를 가져옵니다.
       const containerRect = mobileContainer.getBoundingClientRect();
    
       // 3. *** [수정] 옵셋(offsetX/Y)을 손가락 터치 위치와 요소의 현재 위치 차이로 계산 ***
       // 이 옵셋은 터치 시작 시 손가락이 요소의 어느 지점을 잡았는지 저장합니다.
       currentDraggingElement.offsetX = touch.clientX - containerRect.left - currentLeft;
       currentDraggingElement.offsetY = touch.clientY - containerRect.top - currentTop;
       // *************************************************************************

    }

    function handleTouchMove(e) {
        if (!currentDraggingElement) return;

        e.preventDefault();
        const touch = e.touches[0];
        
        // 부모 컨테이너 기준 위치 계산
        const containerRect = mobileContainer.getBoundingClientRect();
    
        // *** [수정] 손가락 현재 위치에서 저장된 옵셋을 빼서 정확한 left/top 위치 계산 ***
        // (손가락 위치) - (컨테이너 옵셋) - (터치 옵셋) = 새로운 left/top
        const newLeft = touch.clientX - containerRect.left - currentDraggingElement.offsetX;
        const newTop = touch.clientY - containerRect.top - currentDraggingElement.offsetY;
        // *************************************************************************

        currentDraggingElement.style.left = `${newLeft}px`;
        currentDraggingElement.style.top = `${newTop}px`;
    
        checkDropZone(touch.clientX, touch.clientY);
    }
    
    function handleTouchEnd(e) {
        if (!currentDraggingElement) return;

        const touch = e.changedTouches[0];
        currentDraggingElement.classList.remove('is-dragging');
        currentDraggingElement.style.opacity = '1';
        
        // 드롭 존 체크 후 검색 결과 표시
        if (isOverDropZone(touch.clientX, touch.clientY)) {
            const animal = allAnimals.find(a => a.id === draggedAnimalId);
            if (animal) {
                displayResult(animal);
            }
        }
        
        // 상태 초기화
        enclosureBox.classList.remove('drag-over');
        currentDraggingElement = null;
        draggedAnimalId = null;
    }

    // 드롭 존 위에 있는지 확인하는 헬퍼 함수
    function isOverDropZone(x, y) {
        const rect = enclosureBox.getBoundingClientRect();
        return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
    }
    
    // 드롭 존 시각적 피드백을 위한 헬퍼 함수
    function checkDropZone(x, y) {
        if (isOverDropZone(x, y)) {
            enclosureBox.classList.add('drag-over');
        } else {
            enclosureBox.classList.remove('drag-over');
        }
    }
    // ---------------------------------------------


    // --- 3. 마우스 드래그 앤 드롭 로직 (우리 박스) ---
    enclosureBox.addEventListener('dragover', (e) => {
        e.preventDefault(); 
        enclosureBox.classList.add('drag-over');
    });

    enclosureBox.addEventListener('dragleave', () => {
        enclosureBox.classList.remove('drag-over');
    });

    enclosureBox.addEventListener('drop', (e) => {
        e.preventDefault();
        enclosureBox.classList.remove('drag-over');

        if (draggedAnimalId !== null) {
            const animal = allAnimals.find(a => a.id === draggedAnimalId);
            if (animal) {
                displayResult(animal);
            }
        }
    });
    
    // --- 4. 검색 결과 표시 로직 ---
    function displayResult(animal) {
        animalDetails.innerHTML = `
            <img src="${imagePathPrefix}${animal.img}" alt="${animal.name}" class="animal-image">
            <div class="text-info">
                <h2 class="korean-name">${animal.name}</h2>
                <h3 class="english-name">${animal.enName}</h3>
                <p class="description">${animal.desc}</p>
            </div>
        `;
        
        searchScreen.classList.remove('active');
        resultScreen.classList.add('active');
    }

    // --- 5. 화면 전환 및 이벤트 등록 (맨 아래에 추가) ---

    // [추가] 결과 화면 로고 클릭 이벤트 핸들러
    if (resultLogo) {
        resultLogo.addEventListener('click', goToSearchScreen);
        resultLogo.style.cursor = 'pointer'; // 클릭 가능한 것처럼 보이게 설정
    }

    // [추가] 검색 화면으로 돌아가는 함수 정의
    function goToSearchScreen() {
        resultScreen.classList.remove('active'); // 결과 화면 숨기기
        searchScreen.classList.add('active');    // 검색 화면 표시
        renderFloatingAnimals(); // 플로팅 동물을 새로고침
    }
    // 초기 실행
    renderFloatingAnimals();
});
