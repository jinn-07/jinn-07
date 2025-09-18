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
        function handleSwipe(endX) {
            const diffX = endX - startX;
            const threshold = 50; // 스와이프로 인식할 최소 거리 (px)

            // 오른쪽으로 스와이프
            if (diffX > threshold) {
                // 이전 이미지로 이동
                if (currentIndices[sectionType] > 0) {
                    currentIndices[sectionType]--;
                } else {
                    currentIndices[sectionType] = images.length - 1; // 마지막 이미지로 순환
                }
            // 왼쪽으로 스와이프
            } else if (diffX < -threshold) {
                // 다음 이미지로 이동
                if (currentIndices[sectionType] < images.length - 1) {
                    currentIndices[sectionType]++;
                } else {
                    currentIndices[sectionType] = 0; // 첫 번째 이미지로 순환
                }
            }
            
            // 모든 이미지를 현재 인덱스에 맞춰 재배치
            images.forEach((img, index) => {
                const newPosition = index - currentIndices[sectionType];
                img.style.transform = `translateX(${newPosition * 100}%)`;
            });
        }
    });
});