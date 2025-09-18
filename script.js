document.addEventListener('DOMContentLoaded', function() {
    // 스와이프 이벤트를 감지할 섹션들을 가져옵니다.
    const sections = document.querySelectorAll('.section');

    // 각 섹션의 현재 이미지 인덱스를 저장할 객체
    const currentIndices = {
        face: 0,
        torso: 0,
        legs: 0
    };

    sections.forEach(section => {
        let startX = 0;
        const sectionType = section.classList[1]; // 'face', 'torso', 'legs' 중 하나를 가져옴
        const images = Array.from(section.querySelectorAll('img'));

        // 초기 상태 설정: 첫 번째 이미지만 보이게 함
        images.forEach((img, index) => {
            img.style.transform = `translateX(${index * 100}%)`;
        });

        // 마우스 또는 터치 시작 시
        section.addEventListener('mousedown', (e) => startX = e.clientX);
        section.addEventListener('touchstart', (e) => startX = e.touches[0].clientX);

        // 마우스 또는 터치 끝났을 때
        section.addEventListener('mouseup', (e) => handleSwipe(e.clientX));
        section.addEventListener('touchend', (e) => handleSwipe(e.changedTouches[0].clientX));

        // 스와이프 처리 함수
        // ... (기존 코드 유지)

        // 스와이프 처리 함수
        function handleSwipe(endX) {
            const diffX = endX - startX;
            const threshold = 50; // 스와이프로 인식할 최소 거리 (px)

            let isSwiped = false;

            // 오른쪽으로 스와이프 (이전 사진)
            if (diffX > threshold) {
                currentIndices[sectionType] = (currentIndices[sectionType] - 1 + images.length) % images.length;
                isSwiped = true;
            // 왼쪽으로 스와이프 (다음 사진)
            } else if (diffX < -threshold) {
                currentIndices[sectionType] = (currentIndices[sectionType] + 1) % images.length;
                isSwiped = true;
            }

            if (isSwiped) {
                // 모든 이미지를 현재 인덱스에 맞춰 재배치하여 자연스럽게 넘어가게 함
                images.forEach((img, index) => {
                    const newPosition = index - currentIndices[sectionType];
                    img.style.transform = `translateX(${newPosition * 100}%)`;
                });
            }
        }
    });
});
});
