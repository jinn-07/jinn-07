document.addEventListener('DOMContentLoaded', function() {
    const sections = document.querySelectorAll('.section');

    sections.forEach(section => {
        const originalImages = Array.from(section.querySelectorAll('img'));
        const totalOriginalImages = originalImages.length;
        
        // 이미지 복제: 첫 번째 이미지와 마지막 이미지를 복제하여 양 끝에 추가
        const lastImageClone = originalImages[totalOriginalImages - 1].cloneNode(true);
        const firstImageClone = originalImages[0].cloneNode(true);
        section.insertBefore(lastImageClone, originalImages[0]);
        section.appendChild(firstImageClone);
        
        const images = Array.from(section.querySelectorAll('img'));
        let currentIndex = 1; // 복제된 이미지 때문에 실제 첫 번째 이미지는 인덱스 1
        let isSwiping = false;
        let startX = 0;
        
        // 초기 위치 설정: 첫 번째 원본 이미지가 보이도록
        images.forEach((img, index) => {
            img.style.transform = `translateX(${(index - currentIndex) * 100}%)`;
        });
        
        // 터치/마우스 시작
        const handleStart = (e) => {
            isSwiping = true;
            startX = (e.touches ? e.touches[0].clientX : e.clientX);
            // 애니메이션 비활성화 (실시간 스와이프를 위해)
            images.forEach(img => img.style.transition = 'none');
        };

        // 터치/마우스 움직임
        const handleMove = (e) => {
            if (!isSwiping) return;
            const currentX = (e.touches ? e.touches[0].clientX : e.clientX);
            const diffX = currentX - startX;
            const containerWidth = section.offsetWidth;
            const newOffset = diffX / containerWidth * 100;
            
            images.forEach((img, index) => {
                const imgTranslate = (index - currentIndex) * 100 + newOffset;
                img.style.transform = `translateX(${imgTranslate}%)`;
            });
        };

        // 터치/마우스 끝
        const handleEnd = (e) => {
            if (!isSwiping) return;
            isSwiping = false;
            
            const endX = (e.changedTouches ? e.changedTouches[0].clientX : e.clientX);
            const diffX = endX - startX;
            const threshold = section.offsetWidth / 3;

            // 스와이프 방향 결정
            if (diffX > threshold) { // 오른쪽으로 스와이프 (이전 사진)
                currentIndex--;
            } else if (diffX < -threshold) { // 왼쪽으로 스와이프 (다음 사진)
                currentIndex++;
            }
            
            // 모든 이미지에 애니메이션 활성화
            images.forEach(img => img.style.transition = 'transform 0.5s ease-in-out');
            
            // 최종 위치로 이동
            images.forEach((img, index) => {
                const newPos = (index - currentIndex) * 100;
                img.style.transform = `translateX(${newPos}%)`;
            });
            
            // 무한 순환을 위한 위치 보정
            if (currentIndex === 0) {
                // 맨 처음 클론 사진에 도달하면, 마지막 원본 사진으로 순간 이동
                currentIndex = totalOriginalImages;
                setTimeout(() => {
                    images.forEach(img => img.style.transition = 'none');
                    images.forEach((img, index) => {
                        const newPos = (index - currentIndex) * 100;
                        img.style.transform = `translateX(${newPos}%)`;
                    });
                }, 500); // CSS transition 시간(0.5초) 후에 실행
            } else if (currentIndex === totalOriginalImages + 1) {
                // 맨 끝 클론 사진에 도달하면, 첫 번째 원본 사진으로 순간 이동
                currentIndex = 1;
                setTimeout(() => {
                    images.forEach(img => img.style.transition = 'none');
                    images.forEach((img, index) => {
                        const newPos = (index - currentIndex) * 100;
                        img.style.transform = `translateX(${newPos}%)`;
                    });
                }, 500); // CSS transition 시간(0.5초) 후에 실행
            }
        };
        
        // 이벤트 리스너 추가
        section.addEventListener('mousedown', handleStart);
        section.addEventListener('touchstart', handleStart);
        section.addEventListener('mousemove', handleMove);
        section.addEventListener('touchmove', handleMove);
        section.addEventListener('mouseup', handleEnd);
        section.addEventListener('touchend', handleEnd);
        section.addEventListener('mouseleave', () => {
            if (isSwiping) handleEnd({ clientX: startX });
        });
    });
});
