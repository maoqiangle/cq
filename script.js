// 滚动动画
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'all 0.6s ease';
    observer.observe(section);
});

// 平滑滚动
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// 点击篮球特效
document.addEventListener('click', (e) => {
    const basketball = document.createElement('div');
    basketball.innerHTML = '🏀';
    basketball.style.cssText = `
        position: fixed;
        left: ${e.clientX}px;
        top: ${e.clientY}px;
        font-size: 30px;
        pointer-events: none;
        z-index: 9999;
        animation: basketballBounce 1s ease-out forwards;
    `;
    document.body.appendChild(basketball);
    setTimeout(() => basketball.remove(), 1000);
});

const style = document.createElement('style');
style.textContent = `
    @keyframes basketballBounce {
        0% { opacity: 1; transform: translateY(0) scale(1); }
        100% { opacity: 0; transform: translateY(-100px) scale(0.5); }
    }
`;
document.head.appendChild(style);

// 控制台彩蛋
console.log('🏀 苍穹俱乐部 - 冠军旗帜永挂苍穹 🏆');
console.log('🐍 Mamba Forever');