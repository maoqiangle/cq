/**
 * ===========================================
 * 苍穹俱乐部官网 - 页面渲染引擎 (优化版)
 * ===========================================
 * 版本：2.1
 * 最后更新：2026-06-17
 * 
 * 优化内容：
 * - 修复全国联赛计数错误（动态统计赛季数）
 * - 全面使用 const/let 替代 var
 * - 模块化职责拆分，提升可维护性
 * - 使用箭头函数简化回调
 * - 优化事件绑定与性能
 * - 统一错误处理与边界情况
 * 
 * @author 苍穹俱乐部
 * @license All Rights Reserved
 */

'use strict';

// ==================== 工具函数模块 ====================
const Utils = {
    /**
     * 防抖函数
     * @param {Function} func - 原函数
     * @param {number} wait - 等待时间 (ms)
     * @returns {Function} 防抖后的函数
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func.apply(this, args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    /**
     * 格式化数字（1 万 + 显示为 1.0 万）
     */
    formatNumber(num) {
        return num >= 10000 ? (num / 10000).toFixed(1) + '万' : num.toString();
    },

    /**
     * 高亮搜索匹配文本
     */
    highlightText(text, searchTerm) {
        if (!searchTerm) return text;
        const regex = new RegExp(`(${searchTerm})`, 'gi');
        return text.replace(regex, '<span class="highlight-match">$1</span>');
    },

    /**
     * 安全获取 DOM 元素
     */
    getElement(id) {
        const el = document.getElementById(id);
        if (!el) console.warn(`Element with id "${id}" not found`);
        return el;
    },

    /**
     * 元素是否存在
     */
    exists(id) {
        return !!document.getElementById(id);
    }
};

// ==================== 懒加载模块 ====================
const LazyLoader = {
    init() {
        this.observeImages();
    },

    observeImages() {
        const images = document.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            });
        }, { rootMargin: '50px' });

        images.forEach(img => imageObserver.observe(img));
    }
};

// ==================== 星空背景动画模块 ====================
const StarryBackground = {
    init() {
        this.createParticles();
        this.createShootingStars();
    },

    createParticles() {
        const container = Utils.getElement('particles');
        if (!container) return;

        const particleCount = 50;
        const fragment = document.createDocumentFragment();

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.classList.add('particle');
            const size = Math.random() * 6 + 2;
            particle.style.width = size + 'px';
            particle.style.height = size + 'px';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 5 + 's, ' + Math.random() * 3 + 's';
            particle.style.animationDuration = (15 + Math.random() * 10) + 's';
            fragment.appendChild(particle);
        }
        container.appendChild(fragment);
    },

    createShootingStars() {
        const container = Utils.getElement('shootingStars');
        if (!container) return;

        const fragment = document.createDocumentFragment();
        for (let i = 0; i < 3; i++) {
            const star = document.createElement('div');
            star.classList.add('shooting-star');
            star.style.left = (60 + Math.random() * 40) + '%';
            star.style.top = Math.random() * 30 + '%';
            star.style.animationDelay = (i * 3 + Math.random() * 2) + 's';
            fragment.appendChild(star);
        }
        container.appendChild(fragment);
    }
};

// ==================== 渲染引擎模块 ====================
const Renderer = {
    // 当前激活的荣誉类别
    currentHonorCategory: 'cup',

    // 缓存 DOM 引用
    _cache: {},

    /**
     * 获取缓存的 DOM 元素
     */
    _getEl(id) {
        if (!this._cache[id]) {
            this._cache[id] = Utils.getElement(id);
        }
        return this._cache[id];
    },

    renderStructure() {
        const { president, vicePresidents, organizer } = CLUB_DATA.structure;

        const presidentEl = document.querySelector('.president-card .member-name.president');
        if (presidentEl) presidentEl.textContent = president.members[0];

        const vpContainer = document.querySelector('.vice-president .role-members');
        if (vpContainer) {
            vpContainer.innerHTML = vicePresidents.members.map(name =>
                `<div class="member-chip vice-president">${name}</div>`
            ).join('');
            const descEl = document.querySelector('.vice-president .role-desc');
            if (descEl) descEl.textContent = vicePresidents.desc;
        }

        const orgContainer = document.querySelector('.organizer .role-members');
        if (orgContainer) {
            orgContainer.innerHTML = organizer.members.map(name =>
                `<div class="member-chip organizer">${name}</div>`
            ).join('');
            const descEl = document.querySelector('.organizer .role-desc');
            if (descEl) descEl.textContent = organizer.desc;
        }
    },

    /**
     * 渲染视频目录
     */
    renderVideos() {
        Object.keys(CLUB_DATA.videos).forEach(category => {
            const container = this._getEl(`video-list-${category}`);
            if (!container) return;

            const videos = CLUB_DATA.videos[category].list;
            this.updateVideoCount(category, videos.length);
            container.innerHTML = videos.map((video, index) =>
                this.createVideoItem(video, index)
            ).join('');
        });
    },

    /**
     * 创建单个视频项 HTML
     */
    createVideoItem(video, index) {
        const rank = String(index + 1).padStart(2, '0');
        const tags = video.tags ? video.tags.map(tag =>
            `<span class="video-tag">${tag}</span>`
        ).join('') : '';
        const highlight = video.highlight ? `<div class="video-highlight">⭐ ${video.highlight}</div>` : '';

        return `
            <div class="video-list-item">
                <div class="video-rank">#${rank}</div>
                <div class="video-meta">
                    <h4 class="video-title">${video.title}</h4>
                    <p class="video-desc">${video.desc}</p>
                    ${highlight}
                    <div class="video-tags">${tags}</div>
                    <div class="video-stats">
                        <span class="video-duration">⏱️ ${video.duration}</span>
                        <span class="video-views">👁️ ${video.views}</span>
                    </div>
                </div>
            </div>
        `;
    },

    /**
     * 渲染荣誉数据（初始化调用）
     */
    renderHonors() {
        // 默认加载苍穹杯
        this.renderHonorTableByCategory('cup');
        this.updateHonorStats();
    },

    /**
     * 根据类别渲染荣誉表格
     */
    renderHonorTableByCategory(category, data) {
        const panel = this._getEl(category);
        if (!panel) return;

        const table = panel.querySelector('.honor-table');
        if (!table) return;

        const honor = CLUB_DATA.honors[category];
        if (!honor) return;

        const dataToRender = data || honor.data;
        const tbody = table.querySelector('tbody');
        const thead = table.querySelector('thead');

        // 更新表头
        if (thead) {
            thead.innerHTML = `
                <tr>
                    ${honor.columns.map(col => `<th>${col}</th>`).join('')}
                </tr>
            `;
        }

        if (!tbody) return;

        // 根据类别渲染行
        switch (category) {
            case 'cup':
                tbody.innerHTML = dataToRender.map(row => `
                    <tr class="honor-row">
                        <td>${row.date}</td>
                        <td><span class="season-badge">${row.season}</span></td>
                        <td class="champions">${row.champions}</td>
                        <td>${row.captain}</td>
                        <td>${row.mvp}</td>
                        <td class="ring">${row.ring}</td>
                    </tr>
                `).join('');
                break;

            case 'league':
                tbody.innerHTML = dataToRender.map(row => {
                    const rankClass = row.rank.includes('冠军') ? 'gold' :
                                     row.rank.includes('亚军') ? 'silver' :
                                     row.rank.includes('季军') ? 'bronze' : '';
                    return `
                        <tr class="honor-row ${rankClass}">
                            <td>${row.year}</td>
                            <td><span class="season-badge">${row.season}</span></td>
                            <td>${row.rank}</td>
                            <td class="team-name">${row.team}</td>
                            <td>${row.count}</td>
                            <td class="players">${row.players}</td>
                        </tr>
                    `;
                }).join('');
                break;

            case 'allstar':
                tbody.innerHTML = dataToRender.map(row => `
                    <tr class="honor-row allstar-row">
                        <td>${row.date || '-'}</td>
                        <td><span class="season-badge">${row.season || '-'}</span></td>
                        <td class="champions">${row.champions || '-'}</td>
                        <td class="players">${row.members || '-'}</td>
                        <td>${row.honor || '-'}</td>
                        <td class="mvp-highlight">${row.mvp || '-'}</td>
                        <td>${row.three || '-'}</td>
                        <td>${row.one || '-'}</td>
                    </tr>
                `).join('');
                break;

            default:
                // 通用渲染
                tbody.innerHTML = dataToRender.map(row => {
                    const rankClass = (row.rank && (row.rank.includes('总冠军') || row.rank.includes('冠军'))) ||
                                    (row.honor && (row.honor.includes('MVP') || row.honor.includes('冠军'))) ? 'gold' :
                                    (row.rank && row.rank.includes('亚军')) || (row.honor && row.honor.includes('亚军')) ? 'silver' :
                                    (row.rank && row.rank.includes('季军')) ? 'bronze' : '';
                    return `
                        <tr class="honor-row ${rankClass}">
                            <td>${row.year || '-'}</td>
                            <td>${row.season || row.event || '-'}</td>
                            <td>${row.rank || row.honor || '-'}</td>
                            <td>${row.opponent || row.player || '-'}</td>
                            <td>${row.score || row.stats || '-'}</td>
                            <td>${row.note || '-'}</td>
                        </tr>
                    `;
                }).join('');
                break;
        }

        if (dataToRender.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="honor-table-empty">暂无匹配数据</td></tr>';
        }
    },

    /**
     * 更新荣誉统计数字
     */
    updateHonorStats() {
        const cupData = CLUB_DATA.honors.cup.data;
        const allstarData = CLUB_DATA.honors.allstar.data;
        const leagueData = CLUB_DATA.honors.league.data;

        // 动态统计全国联赛赛季数（去重）
        const leagueSeasons = new Set(leagueData.map(item => item.season));
        const leagueCount = leagueSeasons.size;

        const cupCount = cupData.length;
        const allstarCount = allstarData.length;
        const totalMatches = cupCount + allstarCount + leagueData.length; // 总记录条数

        // 更新标签卡片
        this.updateTabCount('honor-cup-count', cupCount, '届');
        this.updateTabCount('honor-allstar-count', allstarCount, '届');
        this.updateTabCount('honor-league-count', leagueCount, '届');

        // 动画数字（如果存在这些元素）
        this.animateNumber('total-cups', cupCount);
        this.animateNumber('total-allstars', allstarCount);
        this.animateNumber('total-leagues', leagueCount);
        this.animateNumber('total-matches', totalMatches);
    },

    /**
     * 更新标签卡片上的数量
     */
    updateTabCount(elementId, count, unit) {
        const el = Utils.getElement(elementId);
        if (el) el.textContent = count + unit;
    },

    /**
     * 更新视频标签数量（无单位）
     */
    updateVideoCount(category, count) {
        const el = Utils.getElement(`video-${category}-count`);
        if (el) el.textContent = count;
    },

    /**
     * 数字递增动画
     */
    animateNumber(elementId, target) {
        const el = Utils.getElement(elementId);
        if (!el) return;

        let current = 0;
        const increment = target / 50;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                el.textContent = target;
                clearInterval(timer);
            } else {
                el.textContent = Math.floor(current);
            }
        }, 30);
    },

    /**
     * 渲染精神格言
     */
    renderSpirit() {
        const container = document.querySelector('.spirit-grid');
        if (!container) return;

        container.innerHTML = CLUB_DATA.spirit.map(item => `
            <div class="spirit-item">
                <span class="spirit-icon">${item.icon}</span>
                <h4>${item.title}</h4>
                <p>${item.desc}</p>
            </div>
        `).join('');
    },

    /**
     * 过滤并重新渲染荣誉表格
     */
    filterHonors(searchTerm, filterType = 'all') {
        const category = this.currentHonorCategory;
        const honor = CLUB_DATA.honors[category];
        if (!honor) return;

        let filteredData = [...honor.data];

        if (filterType === 'recent') {
            filteredData = filteredData.slice(0, 10);
        }

        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filteredData = filteredData.filter(row =>
                Object.values(row).some(value =>
                    String(value).toLowerCase().includes(term)
                )
            );
        }

        this.renderHonorTableByCategory(category, filteredData);
    },

    // 切换荣誉类别（外部调用）
    switchHonorCategory(category) {
        this.currentHonorCategory = category;
        this.renderHonorTableByCategory(category);
        this.updateHonorStats();
    }
};

// ==================== 事件处理模块 ====================
const EventHandler = {
    currentFilter: 'all',

    init() {
        this.bindTabs();
        this.bindScroll();
        this.bindClickAnimation();
        this.bindMobileMenu();
        this.bindHonorSearch();
        this.bindNavActive();
        this.bindNavLogoClick();
    },

    bindNavLogoClick() {
        const navLogo = Utils.getElement('navLogo');
        if (navLogo) {
            navLogo.addEventListener('click', () => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
            navLogo.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
            });
        }
    },

    bindTabs() {
        // 视频标签切换
        document.querySelectorAll('.video-tabs .tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.switchVideoTab(btn.dataset.tab);
            });
        });

        // 荣誉卡片切换
        document.querySelectorAll('.honor-tabs-card .honor-tab-card').forEach(card => {
            card.addEventListener('click', () => {
                const honorId = card.dataset.honor;
                // 更新卡片状态
                document.querySelectorAll('.honor-tabs-card .honor-tab-card').forEach(c => c.classList.remove('active'));
                card.classList.add('active');

                // 切换面板
                document.querySelectorAll('.honor-tables .honor-table-panel').forEach(p => p.classList.remove('active'));
                const targetPanel = Utils.getElement(honorId);
                if (targetPanel) targetPanel.classList.add('active');

                // 重置搜索和过滤
                const searchInput = Utils.getElement('honorSearch');
                if (searchInput) searchInput.value = '';
                document.querySelectorAll('.honor-filter-btn').forEach(b => b.classList.remove('active'));
                const allFilter = document.querySelector('.honor-filter-btn[data-filter="all"]');
                if (allFilter) allFilter.classList.add('active');
                this.currentFilter = 'all';

                // 切换渲染
                Renderer.switchHonorCategory(honorId);
                Renderer.filterHonors('', 'all');
            });
        });

        // 快速导航文字按钮
        document.querySelectorAll('.quick-link').forEach(link => {
            link.addEventListener('click', function() {
                const sectionId = this.dataset.section;
                const target = document.getElementById(sectionId);
                if (target) {
                    this.style.transform = 'translateY(0) scale(0.95)';
                    setTimeout(() => { this.style.transform = ''; }, 150);
                    const offsetTop = target.offsetTop - 80;
                    window.scrollTo({ top: offsetTop, behavior: 'smooth' });
                }
            });
        });
    },

    switchVideoTab(tabId) {
        document.querySelectorAll('.video-tabs .tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.video-directory .tab-panel').forEach(p => p.classList.remove('active'));

        const targetBtn = document.querySelector(`.video-tabs .tab-btn[data-tab="${tabId}"]`);
        if (targetBtn) targetBtn.classList.add('active');

        const panelId = `video-${tabId}`;
        const panel = Utils.getElement(panelId);
        if (panel) panel.classList.add('active');

        // 检查并填充数据（如果容器为空）
        const container = Utils.getElement(`video-list-${tabId}`);
        if (container && CLUB_DATA.videos[tabId]) {
            if (!container.querySelector('.video-list-item')) {
                const videos = CLUB_DATA.videos[tabId].list;
                container.innerHTML = videos.map((video, index) =>
                    Renderer.createVideoItem(video, index)
                ).join('');
            }
        }
    },

    bindScroll() {
        const navbar = Utils.getElement('navbar');
        const progressBar = Utils.getElement('scrollProgress');
        const backToTop = Utils.getElement('backToTop');

        const onScroll = Utils.debounce(() => {
            if (navbar) {
                navbar.classList.toggle('scrolled', window.pageYOffset > 50);
            }
            if (progressBar) {
                const scrollTop = window.pageYOffset;
                const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
                const scrollPercent = (scrollTop / docHeight) * 100;
                progressBar.style.width = scrollPercent + '%';
            }
            if (backToTop) {
                backToTop.classList.toggle('visible', window.pageYOffset > 300);
            }
        }, 10);

        window.addEventListener('scroll', onScroll);

        if (backToTop) {
            backToTop.addEventListener('click', () => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }
    },

    bindClickAnimation() {
        // 篮球点击弹跳
        document.addEventListener('click', (e) => {
            if (e.target.closest('a, button, .contact-card, .tournament-card, .spirit-item, .back-to-top, .logo-img, .video-list-item, .member-chip, .nav-menu, .nav-toggle')) {
                return;
            }
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
                transform: translate(-50%, -50%);
            `;
            document.body.appendChild(basketball);
            setTimeout(() => basketball.remove(), 1000);
        });

        // Logo 礼花特效
        const logoImg = document.querySelector('.logo-img');
        if (logoImg) {
            logoImg.addEventListener('click', () => {
                const icons = ['🏀', '🎯', '🐍', '💜', '💛'];
                const rect = logoImg.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                for (let i = 0; i < 30; i++) {
                    const confetti = document.createElement('div');
                    confetti.innerHTML = icons[Math.floor(Math.random() * icons.length)];
                    const angle = (Math.random() * 360) * (Math.PI / 180);
                    const velocity = 100 + Math.random() * 150;
                    const tx = Math.cos(angle) * velocity;
                    const ty = Math.sin(angle) * velocity;
                    confetti.style.cssText = `
                        position: fixed;
                        left: ${centerX}px;
                        top: ${centerY}px;
                        font-size: ${20 + Math.random() * 20}px;
                        pointer-events: none;
                        z-index: 9999;
                        animation: confettiFly 1.5s ease-out forwards;
                        --tx: ${tx}px;
                        --ty: ${ty}px;
                    `;
                    document.body.appendChild(confetti);
                    setTimeout(() => confetti.remove(), 1500);
                }
            });
        }
    },

    bindMobileMenu() {
        const navToggle = Utils.getElement('navToggle');
        const navMenu = document.querySelector('.nav-menu');
        if (navToggle && navMenu) {
            navToggle.addEventListener('click', () => {
                navMenu.classList.toggle('active');
            });
            navMenu.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => navMenu.classList.remove('active'));
            });
        }
    },

    bindHonorSearch() {
        const searchInput = Utils.getElement('honorSearch');
        const filterBtns = document.querySelectorAll('.honor-filter-btn');

        if (searchInput) {
            const debouncedSearch = Utils.debounce((e) => {
                const term = e.target.value.trim();
                Renderer.filterHonors(term, this.currentFilter);
            }, 300);
            searchInput.addEventListener('input', debouncedSearch);
        }

        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentFilter = btn.dataset.filter;
                const searchInput = Utils.getElement('honorSearch');
                const term = searchInput ? searchInput.value.trim() : '';
                Renderer.filterHonors(term, this.currentFilter);
            });
        });
    },

    bindNavActive() {
        const navLinks = document.querySelectorAll('.nav-menu a');
        const quickLinks = document.querySelectorAll('.quick-link');
        const sections = document.querySelectorAll('section, header');

        const updateActive = Utils.debounce(() => {
            let current = '';
            const scrollPos = window.pageYOffset + 150;
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.toggle('active', link.dataset.section === current);
            });
            quickLinks.forEach(link => {
                link.classList.toggle('active', link.dataset.section === current);
            });
        }, 50);

        window.addEventListener('scroll', updateActive);
        updateActive(); // 初始调用
    }
};

// ==================== 启动 ====================
document.addEventListener('DOMContentLoaded', () => {
    // 初始化星空背景
    StarryBackground.init();

    // 渲染数据
    Renderer.renderStructure();
    Renderer.renderVideos();
    Renderer.renderHonors();
    Renderer.renderSpirit();

    // 懒加载
    LazyLoader.init();

    // 事件绑定
    EventHandler.init();

    // 隐藏加载屏
    setTimeout(() => {
        const loadingScreen = Utils.getElement('loadingScreen');
        if (loadingScreen) {
            loadingScreen.classList.add('hidden');
            setTimeout(() => { loadingScreen.style.display = 'none'; }, 500);
        }
    }, 800);
});
