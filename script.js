// DOM이 로드된 후 실행
document.addEventListener('DOMContentLoaded', function() {
    
    // 네비게이션 스크롤 효과
    const navbar = document.querySelector('.navbar');
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    // 스크롤 시 네비게이션 배경 변경
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = 'none';
        }
    });
    
    // 모바일 햄버거 메뉴 토글
    hamburger.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });
    
    // 부드러운 스크롤
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80; // 네비게이션 높이만큼 조정
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // 모바일 메뉴가 열려있다면 닫기
                if (navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    hamburger.classList.remove('active');
                }
            }
        });
    });
    
    // 패키지 탭 기능
    const tabBtns = document.querySelectorAll('.tab-btn');
    const packageContents = document.querySelectorAll('.package-content');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            
            // 모든 탭 버튼에서 active 클래스 제거
            tabBtns.forEach(b => b.classList.remove('active'));
            // 모든 패키지 콘텐츠 숨기기
            packageContents.forEach(content => content.classList.remove('active'));
            
            // 클릭된 탭 버튼에 active 클래스 추가
            this.classList.add('active');
            // 해당하는 패키지 콘텐츠 표시
            const targetContent = document.getElementById(targetTab);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });
    
    // 스크롤 애니메이션
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, observerOptions);
    
    // 애니메이션을 적용할 요소들 관찰
    document.querySelectorAll('.destination-card, .package-card, .review-card, .stat-item').forEach(el => {
        el.classList.add('scroll-animate');
        observer.observe(el);
    });
    
    // 통계 숫자 카운트 애니메이션
    const statNumbers = document.querySelectorAll('.stat-number');
    
    const countUpObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const finalNumber = target.textContent;
                const isPercentage = finalNumber.includes('%');
                const isTime = finalNumber.includes('/');
                
                if (isPercentage || isTime) {
                    // 퍼센트나 시간은 그대로 표시
                    target.style.opacity = '1';
                } else {
                    // 숫자만 카운트 업
                    const number = parseInt(finalNumber.replace(/,/g, ''));
                    animateNumber(target, 0, number, 2000);
                }
                countUpObserver.unobserve(target);
            }
        });
    }, { threshold: 0.5 });
    
    statNumbers.forEach(stat => {
        countUpObserver.observe(stat);
    });
    
    // 숫자 카운트 애니메이션 함수
    function animateNumber(element, start, end, duration) {
        const startTime = performance.now();
        const startNumber = start;
        const endNumber = end;
        
        function updateNumber(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // easeOutQuart 이징 함수
            const easeProgress = 1 - Math.pow(1 - progress, 4);
            const currentNumber = Math.floor(startNumber + (endNumber - startNumber) * easeProgress);
            
            element.textContent = currentNumber.toLocaleString() + (endNumber >= 1000 ? '+' : '');
            
            if (progress < 1) {
                requestAnimationFrame(updateNumber);
            }
        }
        
        requestAnimationFrame(updateNumber);
    }
    
    // 폼 제출 처리
    const contactForm = document.querySelector('.contact-form form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // 폼 데이터 수집
            const formData = new FormData(this);
            const formObject = {};
            formData.forEach((value, key) => {
                formObject[key] = value;
            });
            
            // 간단한 유효성 검사
            if (!formObject.name || !formObject.tel || !formObject.email) {
                showNotification('Please fill in all required fields.', 'error');
                return;
            }
            
            // 이메일 형식 검사
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formObject.email)) {
                showNotification('Please enter a valid email format.', 'error');
                return;
            }
            
            // 성공 메시지 표시 (실제로는 서버로 데이터 전송)
            showNotification('Your inquiry has been successfully submitted. We will contact you soon.', 'success');
            this.reset();
        });
    }
    
    // 알림 메시지 표시 함수
    function showNotification(message, type = 'info') {
        // 기존 알림이 있다면 제거
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;
        
        // 스타일 추가
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
            z-index: 10000;
            max-width: 400px;
            animation: slideInRight 0.3s ease;
        `;
        
        // 닫기 버튼 이벤트
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            notification.remove();
        });
        
        // 자동으로 사라지기
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOutRight 0.3s ease';
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.remove();
                    }
                }, 300);
            }
        }, 5000);
        
        document.body.appendChild(notification);
    }
    
    // CSS 애니메이션 스타일 추가
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
        
        .notification-close {
            background: none;
            border: none;
            color: white;
            font-size: 20px;
            cursor: pointer;
            margin-left: 15px;
            padding: 0;
            line-height: 1;
        }
        
        .notification-content {
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        
        .notification-message {
            flex: 1;
        }
    `;
    document.head.appendChild(style);
    
    // 이미지 지연 로딩 (성능 최적화)
    const images = document.querySelectorAll('img[src*="unsplash"]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.src; // 이미지 로딩 트리거
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => {
        imageObserver.observe(img);
    });
    
    // 스크롤 진행률 표시
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(90deg, #667eea, #764ba2);
        z-index: 10001;
        transition: width 0.1s ease;
    `;
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset;
        const docHeight = document.body.offsetHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        progressBar.style.width = scrollPercent + '%';
    });
    
    // 패키지 카드 호버 효과 개선
    document.querySelectorAll('.package-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // 여행지 카드 호버 효과 개선
    document.querySelectorAll('.destination-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-15px)';
            this.style.boxShadow = '0 25px 50px rgba(0, 0, 0, 0.2)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.1)';
        });
    });
    
    // 리뷰 카드 호버 효과
    document.querySelectorAll('.review-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 15px 35px rgba(0, 0, 0, 0.15)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.1)';
        });
    });
    
    // 페이지 로딩 완료 후 초기 애니메이션
    window.addEventListener('load', function() {
        document.body.classList.add('loaded');
        
        // 히어로 섹션 텍스트 타이핑 효과
        const heroTitle = document.querySelector('.hero-content h1');
        if (heroTitle) {
            const text = heroTitle.textContent;
            heroTitle.textContent = '';
            heroTitle.style.borderRight = '3px solid white';
            
            let i = 0;
            const typeWriter = () => {
                if (i < text.length) {
                    heroTitle.textContent += text.charAt(i);
                    i++;
                    setTimeout(typeWriter, 100);
                } else {
                    heroTitle.style.borderRight = 'none';
                }
            };
            
            setTimeout(typeWriter, 500);
        }
    });
    
    // 스크롤 시 요소들 순차적으로 나타나기
    const staggeredObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('animate');
                }, index * 100);
            }
        });
    }, { threshold: 0.1 });
    
    // 통계 섹션의 각 항목들을 순차적으로 애니메이션
    document.querySelectorAll('.stat-item').forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        staggeredObserver.observe(item);
    });
    
    // 스크롤 시 네비게이션 메뉴 활성화
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;
            if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
    
    // 네비게이션 링크 활성화 스타일
    const navStyle = document.createElement('style');
    navStyle.textContent = `
        .nav-menu a.active {
            color: #667eea !important;
            position: relative;
        }
        
        .nav-menu a.active::after {
            content: '';
            position: absolute;
            bottom: -5px;
            left: 0;
            width: 100%;
            height: 2px;
            background: #667eea;
            border-radius: 1px;
        }
    `;
    document.head.appendChild(navStyle);
});
