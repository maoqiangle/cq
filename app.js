/**
 * ===========================================
 * 苍穹俱乐部官网 - 页面渲染引擎
 * ===========================================
 * 版本：2.0
 * 最后更新：2026-04-02
 * 
 * 模块：
 * 1. Utils - 工具函数
 * 2. LazyLoader - 懒加载
 * 3. StarryBackground - 星空背景
 * 4. Renderer - 数据渲染
 * 5. EventHandler - 事件处理
 * 
 * @author 苍穹俱乐部
 * @license All Rights Reserved
 */

// ==================== 全局平滑滚动函数 ====================
/**
 * 平滑滚动到指定区域
 * @param {Event} event - 点击事件
 * @param {string} targetId - 目标元素 ID
 */
function smoothScroll(event, targetId) {
    event.preventDefault();
    const target = document.getElementById(targetId);
    if (target) {
        const offsetTop = target.offsetTop - 80; // 减去导航栏高度
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

// ==================== 1. 工具函数 ====================
const Utils = {
    /**
     * 防抖函数
     * @param {Function} func - 原函数
     * @param {number} wait - 等待时间 (ms)
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    /**
     * 格式化数字（1 万 + 显示为 1.0 万）
     * @param {number} num - 数字
     * @returns {string} 格式化后的字符串
     */
    formatNumber(num) {
        return num >= 10000 ? (num / 10000).toFixed(1) + '万' : num.toString();
    },

    /**
     * 高亮搜索匹配文本
     * @param {string} text - 原文本
     * @param {string} searchTerm - 搜索词
     * @returns {string} 高亮后的 HTML
     */
    highlightText(text, searchTerm) {
        if (!searchTerm) return text;
        const regex = new RegExp(`(${searchTerm})`, 'gi');
        return text.replace(regex, '<span class="highlight-match">$1</span>');
    }
};

// ==================== 懒加载 ====================
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

// ==================== 星空背景动画 ====================
const StarryBackground = {
    init() {
        this.createParticles();
        this.createShootingStars();
    },

    createParticles() {
        const particlesContainer = document.getElementById('particles');
        if (!particlesContainer) return;

        const particleCount = 50; // 增加星星数量

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.classList.add('particle');

            const size = Math.random() * 6 + 2;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.top = `${Math.random() * 100}%`;
            particle.style.animationDelay = `${Math.random() * 5}s`;
            particle.style.animationDuration = `${15 + Math.random() * 10}s`;

            // 随机闪烁延迟
            particle.style.animationDelay += `, ${Math.random() * 3}s`;

            particlesContainer.appendChild(particle);
        }
    },

    createShootingStars() {
        const container = document.getElementById('shootingStars');
        if (!container) return;

        // 创建 3 个流星
        for (let i = 0; i < 3; i++) {
            const star = document.createElement('div');
            star.classList.add('shooting-star');
            star.style.left = `${60 + Math.random() * 40}%`;
            star.style.top = `${Math.random() * 30}%`;
            star.style.animationDelay = `${i * 3 + Math.random() * 2}s`;
            container.appendChild(star);
        }
    }
};

// ==================== 渲染引擎 ====================
const Renderer = {
    // 当前激活的荣誉类别
    currentHonorCategory: 'cup',

    renderStructure() {
        const { president, vicePresidents, organizer } = CLUB_DATA.structure;

        const presidentEl = document.querySelector('.president-card .member-name.president');
        if (presidentEl) presidentEl.textContent = president.members[0];

        const vpContainer = document.querySelector('.vice-president .role-members');
        if (vpContainer) {
            vpContainer.innerHTML = vicePresidents.members
                .map(name => `<div class="member-chip vice-president">${name}</div>`)
                .join('');
            const descEl = document.querySelector('.vice-president .role-desc');
            if (descEl) descEl.textContent = vicePresidents.desc;
        }

        const orgContainer = document.querySelector('.organizer .role-members');
        if (orgContainer) {
            orgContainer.innerHTML = organizer.members
                .map(name => `<div class="member-chip organizer">${name}</div>`)
                .join('');
            const descEl = document.querySelector('.organizer .role-desc');
            if (descEl) descEl.textContent = organizer.desc;
        }
    },

    /**
     * 渲染视频目录
     * 采用专业列表形式，无封面图，突出文字信息
     */
    renderVideos() {
        Object.keys(CLUB_DATA.videos).forEach(category => {
            const container = document.getElementById(`video-list-${category}`);
            if (!container) {
                return;
            }

            const videos = CLUB_DATA.videos[category].list;
            
            // 更新标签上的数量
            this.updateVideoCount(category, videos.length);
            
            // 渲染视频列表
            container.innerHTML = videos.map((video, index) => this.createVideoItem(video, index)).join('');
        });
    },

    /**
     * 创建单个视频项 HTML
     * @param {Object} video - 视频数据
     * @param {number} index - 索引
     * @returns {string} HTML 字符串
     */
    createVideoItem(video, index) {
        const rank = String(index + 1).padStart(2, '0');
        const tags = video.tags ? video.tags.map(tag => `<span class="video-tag">${tag}</span>`).join('') : '';
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

    renderHonors() {
        // 初始化时只渲染苍穹杯数据
        const category = 'cup';
        const honor = CLUB_DATA.honors[category];
        const panel = document.getElementById(category);
        
        if (!panel) return;

        const table = panel.querySelector('.honor-table');
        if (!table) return;

        // 更新标题
        const sectionTitle = panel.closest('section')?.querySelector('.section-title');
        if (sectionTitle && honor.subtitle) {
            let subtitle = sectionTitle.querySelector('.subtitle');
            if (!subtitle) {
                subtitle = document.createElement('span');
                subtitle.className = 'subtitle';
                subtitle.style.cssText = 'font-size: 0.9rem; color: var(--text-secondary); margin-left: 10px; font-weight: normal;';
                sectionTitle.appendChild(subtitle);
            }
            subtitle.textContent = honor.subtitle;
        }

        const thead = table.querySelector('thead');
        if (thead) {
            thead.innerHTML = `
                <tr>
                    ${honor.columns.map(col => `<th>${col}</th>`).join('')}
                </tr>
            `;
        }

        const tbody = table.querySelector('tbody');
        if (tbody) {
            if (category === 'cup') {
                // 苍穹杯特殊渲染
                tbody.innerHTML = honor.data.map(row => `
                    <tr class="honor-row">
                        <td>${row.date}</td>
                        <td><span class="season-badge">${row.season}</span></td>
                        <td class="champions">${row.champions}</td>
                        <td>${row.captain}</td>
                        <td>${row.mvp}</td>
                        <td class="ring">${row.ring}</td>
                    </tr>
                `).join('');
            }
        }

        this.updateHonorStats();
    },

    // 按届数分组数据
    groupByRound(data) {
        return data.reduce((groups, item) => {
            const round = item.round || '1';
            if (!groups[round]) {
                groups[round] = [];
            }
            groups[round].push(item);
            return groups;
        }, {});
    },

    // 搜索过滤荣誉数据
    filterHonors(searchTerm, filterType = 'all') {
        const category = this.currentHonorCategory;
        const honor = CLUB_DATA.honors[category];
        if (!honor) return;

        let filteredData = [...honor.data];

        // 按类型过滤
        if (filterType === 'recent') {
            filteredData = filteredData.slice(0, 10);
        }

        // 按搜索词过滤
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filteredData = filteredData.filter(row => {
                return Object.values(row).some(value => 
                    String(value).toLowerCase().includes(term)
                );
            });
        }

        // 重新渲染表格
        this.renderHonorTable(category, filteredData);
    },

    // 渲染单个荣誉表格
    renderHonorTable(category, data) {
        const panel = document.getElementById(category);
        if (!panel) return;

        const table = panel.querySelector('.honor-table');
        const tbody = table?.querySelector('tbody');
        if (!tbody) return;

        const honor = CLUB_DATA.honors[category];

        // 更新表头
        const thead = table.querySelector('thead');
        if (thead) {
            thead.innerHTML = `
                <tr>
                    ${honor.columns.map(col => `<th>${col}</th>`).join('')}
                </tr>
            `;
        }

        if (category === 'cup') {
            tbody.innerHTML = data.map(row => `
                <tr class="honor-row">
                    <td>${row.date}</td>
                    <td><span class="season-badge">${row.season}</span></td>
                    <td class="champions">${row.champions}</td>
                    <td>${row.captain}</td>
                    <td>${row.mvp}</td>
                    <td class="ring">${row.ring}</td>
                </tr>
            `).join('');
        } else if (category === 'league') {
            tbody.innerHTML = data.map(row => `
                <tr class="honor-row ${row.rank.includes('冠军') ? 'gold' : row.rank.includes('亚军') ? 'silver' : 'bronze'}">
                    <td>${row.year}</td>
                    <td><span class="season-badge">${row.season}</span></td>
                    <td>${row.rank}</td>
                    <td class="team-name">${row.team}</td>
                    <td>${row.count}</td>
                    <td class="players">${row.players}</td>
                </tr>
            `).join('');
        } else if (category === 'allstar') {
            // 全明星赛专门渲染 - 修复数据未展示问题
            tbody.innerHTML = data.map(row => `
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
        } else {
            tbody.innerHTML = data.map(row => {
                const rankClass = row.rank?.includes('总冠军') || row.rank?.includes('冠军') || row.honor?.includes('MVP') || row.honor?.includes('冠军') ? 'gold' :
                                  row.rank?.includes('亚军') || row.honor?.includes('亚军') ? 'silver' :
                                  row.rank?.includes('季军') ? 'bronze' : '';
                
                const col2 = row.season || row.event || '-';
                const col3 = row.rank || row.honor || '-';
                const col4 = row.opponent || row.player || '-';
                const col5 = row.score || row.stats || '-';
                const col6 = row.note || '-';
                
                return `
                    <tr class="honor-row ${rankClass}">
                        <td>${row.year || '-'}</td>
                        <td>${col2}</td>
                        <td>${col3}</td>
                        <td>${col4}</td>
                        <td>${col5}</td>
                        <td>${col6}</td>
                    </tr>
                `;
            }).join('');
        }

        // 显示空数据提示
        if (data.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="honor-table-empty">暂无匹配数据</td></tr>';
        }
    },

    updateHonorStats() {
        // 苍穹杯总数量
        const cupCount = CLUB_DATA.honors.cup.data.length;
        // 全明星总数量
        const allstarCount = CLUB_DATA.honors.allstar.data.length;
        // 全国联赛总届数（L1-L4 共 4 届）
        const leagueCount = 4;
        // 累计总场次（所有赛事数据总和）
        const totalMatches = cupCount + allstarCount + leagueCount;

        // 更新荣誉卡片上的数量显示（使用 honor- 前缀）
        this.updateTabCount('honor-cup-count', cupCount, '届');
        this.updateTabCount('honor-allstar-count', allstarCount, '届');
        this.updateTabCount('honor-league-count', leagueCount, '届');

        // 更新底部统计
        this.animateNumber('total-cups', cupCount);
        this.animateNumber('total-allstars', allstarCount);
        this.animateNumber('total-leagues', leagueCount);
        this.animateNumber('total-matches', totalMatches);
    },

    // 更新标签卡片上的数量
    updateTabCount(elementId, count, unit) {
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = count + unit;
        }
    },

    // 更新视频标签数量（无单位）
    updateVideoCount(category, count) {
        const element = document.getElementById(`video-${category}-count`);
        if (element) {
            element.textContent = count;
        }
    },

    animateNumber(elementId, target) {
        const element = document.getElementById(elementId);
        if (!element) return;

        let current = 0;
        const increment = target / 50;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = target;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current);
            }
        }, 30);
    },

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
    }
};

// ==================== 事件处理 ====================
const EventHandler = {
    // 当前过滤器状态
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
        const navLogo = document.getElementById('navLogo');
        if (navLogo) {
            navLogo.addEventListener('click', () => {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
            
            // 支持键盘访问
            navLogo.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                }
            });
        }
    },

    bindTabs() {
        // 视频标签
        document.querySelectorAll('.video-tabs .tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const tabId = btn.dataset.tab;
                this.switchTab('.video-tabs .tab-btn', '.video-directory .tab-panel', tabId);
            });
        });

        // 荣誉标签卡片切换 - 卡片式风格
        document.querySelectorAll('.honor-tabs-card .honor-tab-card').forEach(card => {
            card.addEventListener('click', () => {
                const honorId = card.dataset.honor;
                
                // 移除所有卡片的 active 类
                document.querySelectorAll('.honor-tabs-card .honor-tab-card').forEach(c => {
                    c.classList.remove('active');
                });
                
                // 添加 active 类到当前卡片
                card.classList.add('active');
                
                // 切换面板显示
                document.querySelectorAll('.honor-tables .honor-table-panel').forEach(p => {
                    p.classList.remove('active');
                });
                const targetPanel = document.getElementById(honorId);
                if (targetPanel) {
                    targetPanel.classList.add('active');
                }
                
                // 更新当前荣誉类别
                Renderer.currentHonorCategory = honorId;
                
                // 重置搜索框和过滤器
                const searchInput = document.getElementById('honorSearch');
                if (searchInput) searchInput.value = '';
                
                // 重置过滤按钮
                document.querySelectorAll('.honor-filter-btn').forEach(b => b.classList.remove('active'));
                document.querySelector('.honor-filter-btn[data-filter="all"]')?.classList.add('active');
                EventHandler.currentFilter = 'all';
                
                // 重新渲染完整数据
                Renderer.filterHonors('', 'all');
            });
        });
        
        // 快速导航文字按钮点击事件
        document.querySelectorAll('.quick-link').forEach(link => {
            link.addEventListener('click', function() {
                const sectionId = this.dataset.section;
                const target = document.getElementById(sectionId);
                
                if (target) {
                    // 添加点击动画效果
                    this.style.transform = 'translateY(0) scale(0.95)';
                    setTimeout(() => {
                        this.style.transform = '';
                    }, 150);
                    
                    // 平滑滚动
                    const offsetTop = target.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    },

    switchTab(btnSelector, panelSelector, targetId) {
        document.querySelectorAll(btnSelector).forEach(b => b.classList.remove('active'));
        document.querySelectorAll(panelSelector).forEach(p => p.classList.remove('active'));

        const targetBtn = document.querySelector(`${btnSelector}[data-tab="${targetId}"], ${btnSelector}[data-honor="${targetId}"]`);
        if (targetBtn) targetBtn.classList.add('active');

        // 处理视频标签和荣誉标签的不同ID命名规则
        let targetPanelId = targetId;
        if (targetId === 'stars' || targetId === 'cup' || targetId === 'allstar' || targetId === 'league') {
            // 视频标签面板ID需要添加video-前缀
            targetPanelId = `video-${targetId}`;
        }
        
        const targetPanel = document.getElementById(targetPanelId);
        if (targetPanel) targetPanel.classList.add('active');
        
        // 如果是视频标签切换，检查并渲染对应的数据
        if (targetId === 'stars' || targetId === 'cup' || targetId === 'allstar' || targetId === 'league') {
            const container = document.getElementById(`video-list-${targetId}`);
            if (container && CLUB_DATA.videos[targetId]) {
                // 检查容器是否包含视频列表项，如果没有则渲染数据
                const hasVideoItems = container.querySelector('.video-list-item') !== null;
                if (!hasVideoItems) {
                    const videos = CLUB_DATA.videos[targetId].list;
                    container.innerHTML = videos.map((video, index) => Renderer.createVideoItem(video, index)).join('');
                }
            }
        }
    },

    bindScroll() {
        const navbar = document.getElementById('navbar');
        const onScroll = Utils.debounce(() => {
            if (navbar) {
                if (window.pageYOffset > 50) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }
            }
        }, 10);

        window.addEventListener('scroll', onScroll);

        const progressBar = document.getElementById('scrollProgress');
        const onScrollProgress = Utils.debounce(() => {
            if (progressBar) {
                const scrollTop = window.pageYOffset;
                const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
                const scrollPercent = (scrollTop / docHeight) * 100;
                progressBar.style.width = scrollPercent + '%';
            }
        }, 10);

        window.addEventListener('scroll', onScrollProgress);

        // 回到顶部按钮
        const backToTop = document.getElementById('backToTop');
        if (backToTop) {
            window.addEventListener('scroll', () => {
                if (window.pageYOffset > 300) {
                    backToTop.classList.add('visible');
                } else {
                    backToTop.classList.remove('visible');
                }
            });

            backToTop.addEventListener('click', () => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }
    },

    bindClickAnimation() {
        // 篮球弹跳动画
        document.addEventListener('click', (e) => {
            // 排除交互元素
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

        // Logo 点击礼花特效
        const logoImg = document.querySelector('.logo-img');
        if (logoImg) {
            logoImg.addEventListener('click', () => {
                for (let i = 0; i < 30; i++) {
                    const confetti = document.createElement('div');
                    confetti.innerHTML = ['🏀', '', '🐍', '💜', '💛'][Math.floor(Math.random() * 5)];
                    confetti.style.cssText = `
                        position: fixed;
                        left: ${logoImg.getBoundingClientRect().left + logoImg.offsetWidth / 2}px;
                        top: ${logoImg.getBoundingClientRect().top + logoImg.offsetHeight / 2}px;
                        font-size: ${20 + Math.random() * 20}px;
                        pointer-events: none;
                        z-index: 9999;
                        animation: confettiFly 1.5s ease-out forwards;
                    `;
                    document.body.appendChild(confetti);

                    const angle = (Math.random() * 360) * (Math.PI / 180);
                    const velocity = 100 + Math.random() * 150;
                    const tx = Math.cos(angle) * velocity;
                    const ty = Math.sin(angle) * velocity;

                    confetti.style.setProperty('--tx', `${tx}px`);
                    confetti.style.setProperty('--ty', `${ty}px`);

                    setTimeout(() => confetti.remove(), 1500);
                }
            });
        }
    },

    bindMobileMenu() {
        const navToggle = document.getElementById('navToggle');
        const navMenu = document.querySelector('.nav-menu');

        if (navToggle && navMenu) {
            navToggle.addEventListener('click', () => {
                navMenu.classList.toggle('active');
                // 只禁用垂直滚动，保持水平滚动可用
                if (navMenu.classList.contains('active')) {
                    document.body.style.overflowY = 'hidden';
                    document.body.style.overflowX = 'auto';
                } else {
                    document.body.style.overflowY = '';
                    document.body.style.overflowX = '';
                }
            });

            // 点击链接后关闭菜单
            navMenu.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    navMenu.classList.remove('active');
                    document.body.style.overflowY = '';
                    document.body.style.overflowX = '';
                });
            });

            // 添加触摸事件处理，防止iOS上的bounce效果
            navMenu.addEventListener('touchstart', function(e) {
                this.touchStartX = e.touches[0].clientX;
            });

            navMenu.addEventListener('touchmove', function(e) {
                if (this.scrollWidth > this.clientWidth) {
                    e.preventDefault();
                }
            });
        }
    },

    // 绑定荣誉堂搜索
    bindHonorSearch() {
        const self = this; // 保存 this 引用
        const searchInput = document.getElementById('honorSearch');
        const filterBtns = document.querySelectorAll('.honor-filter-btn');

        if (searchInput) {
            // 搜索输入防抖
            const debouncedSearch = Utils.debounce((e) => {
                const searchTerm = e.target.value.trim();
                Renderer.filterHonors(searchTerm, self.currentFilter || 'all');
            }, 300);

            searchInput.addEventListener('input', debouncedSearch);
        }

        // 过滤按钮
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                self.currentFilter = btn.dataset.filter;

                const searchInput = document.getElementById('honorSearch');
                const searchTerm = searchInput?.value.trim() || '';
                Renderer.filterHonors(searchTerm, self.currentFilter);
            });
        });
    },

    // 绑定导航栏激活状态
    bindNavActive() {
        const navLinks = document.querySelectorAll('.nav-menu a');
        const quickLinks = document.querySelectorAll('.quick-link');
        const sections = document.querySelectorAll('section, header');

        const onScroll = Utils.debounce(() => {
            let current = '';
            const scrollPos = window.pageYOffset + 150;

            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;

                if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                    current = section.getAttribute('id');
                }
            });

            // 更新主导航菜单
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.dataset.section === current) {
                    link.classList.add('active');
                }
            });

            // 更新快速导航文字按钮
            quickLinks.forEach(link => {
                link.classList.remove('active');
                if (link.dataset.section === current) {
                    link.classList.add('active');
                }
            });
        }, 50);

        window.addEventListener('scroll', onScroll);
        onScroll(); // 初始化
    }
};

// ==================== 初始化 ====================
document.addEventListener('DOMContentLoaded', () => {
    // 初始化星空背景动画
    StarryBackground.init();
    
    // 渲染所有数据
    Renderer.renderStructure();
    Renderer.renderVideos();
    Renderer.renderHonors();
    Renderer.renderSpirit();

    // 初始化懒加载
    LazyLoader.init();

    // 绑定事件
    EventHandler.init();

    // 隐藏加载屏
    setTimeout(() => {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            loadingScreen.classList.add('hidden');
            setTimeout(() => loadingScreen.style.display = 'none', 500);
        }
    }, 800);
});
