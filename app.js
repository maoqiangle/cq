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
    var target = document.getElementById(targetId);
    if (target) {
        var offsetTop = target.offsetTop - 80; // 减去导航栏高度
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

// ==================== 1. 工具函数 ====================
var Utils = {
    /**
     * 防抖函数
     * @param {Function} func - 原函数
     * @param {number} wait - 等待时间 (ms)
     */
    debounce: function(func, wait) {
        var timeout;
        return function executedFunction() {
            var context = this;
            var args = arguments;
            var later = function() {
                clearTimeout(timeout);
                func.apply(context, args);
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
    formatNumber: function(num) {
        return num >= 10000 ? (num / 10000).toFixed(1) + '万' : num.toString();
    },

    /**
     * 高亮搜索匹配文本
     * @param {string} text - 原文本
     * @param {string} searchTerm - 搜索词
     * @returns {string} 高亮后的 HTML
     */
    highlightText: function(text, searchTerm) {
        if (!searchTerm) return text;
        var regex = new RegExp('(' + searchTerm + ')', 'gi');
        return text.replace(regex, '<span class="highlight-match">$1</span>');
    }
};

// ==================== 懒加载 ====================
var LazyLoader = {
    init: function() {
        this.observeImages();
    },

    observeImages: function() {
        var images = document.querySelectorAll('img[data-src]');
        var imageObserver = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    var img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            });
        }, { rootMargin: '50px' });

        images.forEach(function(img) { return imageObserver.observe(img); });
    }
};

// ==================== 星空背景动画 ====================
var StarryBackground = {
    init: function() {
        this.createParticles();
        this.createShootingStars();
    },

    createParticles: function() {
        var particlesContainer = document.getElementById('particles');
        if (!particlesContainer) return;

        var particleCount = 50; // 增加星星数量

        for (var i = 0; i < particleCount; i++) {
            var particle = document.createElement('div');
            particle.classList.add('particle');

            var size = Math.random() * 6 + 2;
            particle.style.width = size + 'px';
            particle.style.height = size + 'px';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 5 + 's';
            particle.style.animationDuration = (15 + Math.random() * 10) + 's';

            // 随机闪烁延迟
            particle.style.animationDelay += ', ' + Math.random() * 3 + 's';

            particlesContainer.appendChild(particle);
        }
    },

    createShootingStars: function() {
        var container = document.getElementById('shootingStars');
        if (!container) return;

        // 创建 3 个流星
        for (var i = 0; i < 3; i++) {
            var star = document.createElement('div');
            star.classList.add('shooting-star');
            star.style.left = (60 + Math.random() * 40) + '%';
            star.style.top = Math.random() * 30 + '%';
            star.style.animationDelay = (i * 3 + Math.random() * 2) + 's';
            container.appendChild(star);
        }
    }
};

// ==================== 渲染引擎 ====================
var Renderer = {
    // 当前激活的荣誉类别
    currentHonorCategory: 'cup',

    renderStructure: function() {
        var president = CLUB_DATA.structure.president;
        var vicePresidents = CLUB_DATA.structure.vicePresidents;
        var organizer = CLUB_DATA.structure.organizer;

        var presidentEl = document.querySelector('.president-card .member-name.president');
        if (presidentEl) presidentEl.textContent = president.members[0];

        var vpContainer = document.querySelector('.vice-president .role-members');
        if (vpContainer) {
            vpContainer.innerHTML = vicePresidents.members.map(function(name) {
                return '<div class="member-chip vice-president">' + name + '</div>';
            }).join('');
            var descEl = document.querySelector('.vice-president .role-desc');
            if (descEl) descEl.textContent = vicePresidents.desc;
        }

        var orgContainer = document.querySelector('.organizer .role-members');
        if (orgContainer) {
            orgContainer.innerHTML = organizer.members.map(function(name) {
                return '<div class="member-chip organizer">' + name + '</div>';
            }).join('');
            var descEl = document.querySelector('.organizer .role-desc');
            if (descEl) descEl.textContent = organizer.desc;
        }
    },

    /**
     * 渲染视频目录
     * 采用专业列表形式，无封面图，突出文字信息
     */
    renderVideos: function() {
        var self = this;
        Object.keys(CLUB_DATA.videos).forEach(function(category) {
            var container = document.getElementById('video-list-' + category);
            if (!container) {
                return;
            }

            var videos = CLUB_DATA.videos[category].list;

            // 更新标签上的数量
            self.updateVideoCount(category, videos.length);

            // 渲染视频列表
            container.innerHTML = videos.map(function(video, index) {
                return self.createVideoItem(video, index);
            }).join('');
        });
    },

    /**
     * 创建单个视频项 HTML
     * @param {Object} video - 视频数据
     * @param {number} index - 索引
     * @returns {string} HTML 字符串
     */
    createVideoItem: function(video, index) {
        var rank = String(index + 1).padStart(2, '0');
        var tags = video.tags ? video.tags.map(function(tag) {
            return '<span class="video-tag">' + tag + '</span>';
        }).join('') : '';
        var highlight = video.highlight ? '<div class="video-highlight">⭐ ' + video.highlight + '</div>' : '';

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

    renderHonors: function() {
        // 初始化时只渲染苍穹杯数据
        var category = 'cup';
        var honor = CLUB_DATA.honors[category];
        var panel = document.getElementById(category);

        if (!panel) return;

        var table = panel.querySelector('.honor-table');
        if (!table) return;

        // 更新标题
        var sectionTitle = panel.closest('section');
        if (sectionTitle) {
            sectionTitle = sectionTitle.querySelector('.section-title');
        }
        if (sectionTitle && honor.subtitle) {
            var subtitle = sectionTitle.querySelector('.subtitle');
            if (!subtitle) {
                subtitle = document.createElement('span');
                subtitle.className = 'subtitle';
                subtitle.style.cssText = 'font-size: 0.9rem; color: var(--text-secondary); margin-left: 10px; font-weight: normal;';
                sectionTitle.appendChild(subtitle);
            }
            subtitle.textContent = honor.subtitle;
        }

        var thead = table.querySelector('thead');
        if (thead) {
            thead.innerHTML = `
                <tr>
                    ${honor.columns.map(function(col) { return '<th>' + col + '</th>'; }).join('')}
                </tr>
            `;
        }

        var tbody = table.querySelector('tbody');
        if (tbody) {
            if (category === 'cup') {
                // 苍穹杯特殊渲染
                tbody.innerHTML = honor.data.map(function(row) {
                    return `
                        <tr class="honor-row">
                            <td>${row.date}</td>
                            <td><span class="season-badge">${row.season}</span></td>
                            <td class="champions">${row.champions}</td>
                            <td>${row.captain}</td>
                            <td>${row.mvp}</td>
                            <td class="ring">${row.ring}</td>
                        </tr>
                    `;
                }).join('');
            }
        }

        this.updateHonorStats();
    },

    // 按届数分组数据
    groupByRound: function(data) {
        return data.reduce(function(groups, item) {
            var round = item.round || '1';
            if (!groups[round]) {
                groups[round] = [];
            }
            groups[round].push(item);
            return groups;
        }, {});
    },

    // 搜索过滤荣誉数据
    filterHonors: function(searchTerm, filterType) {
        if (filterType === undefined) filterType = 'all';
        var category = this.currentHonorCategory;
        var honor = CLUB_DATA.honors[category];
        if (!honor) return;

        var filteredData = honor.data.slice(); // 复制数组

        // 按类型过滤
        if (filterType === 'recent') {
            filteredData = filteredData.slice(0, 10);
        }

        // 按搜索词过滤
        if (searchTerm) {
            var term = searchTerm.toLowerCase();
            filteredData = filteredData.filter(function(row) {
                return Object.values(row).some(function(value) {
                    return String(value).toLowerCase().includes(term);
                });
            });
        }

        // 重新渲染表格
        this.renderHonorTable(category, filteredData);
    },

    // 渲染单个荣誉表格
    renderHonorTable: function(category, data) {
        var panel = document.getElementById(category);
        if (!panel) return;

        var table = panel.querySelector('.honor-table');
        var tbody = table ? table.querySelector('tbody') : null;
        if (!tbody) return;

        var honor = CLUB_DATA.honors[category];

        // 更新表头
        var thead = table.querySelector('thead');
        if (thead) {
            thead.innerHTML = `
                <tr>
                    ${honor.columns.map(function(col) { return '<th>' + col + '</th>'; }).join('')}
                </tr>
            `;
        }

        if (category === 'cup') {
            tbody.innerHTML = data.map(function(row) {
                return `
                    <tr class="honor-row">
                        <td>${row.date}</td>
                        <td><span class="season-badge">${row.season}</span></td>
                        <td class="champions">${row.champions}</td>
                        <td>${row.captain}</td>
                        <td>${row.mvp}</td>
                        <td class="ring">${row.ring}</td>
                    </tr>
                `;
            }).join('');
        } else if (category === 'league') {
            tbody.innerHTML = data.map(function(row) {
                var rankClass = '';
                if (row.rank.indexOf('冠军') !== -1) {
                    rankClass = 'gold';
                } else if (row.rank.indexOf('亚军') !== -1) {
                    rankClass = 'silver';
                } else if (row.rank.indexOf('季军') !== -1) {
                    rankClass = 'bronze';
                }
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
        } else if (category === 'allstar') {
            // 全明星赛专门渲染 - 修复数据未展示问题
            tbody.innerHTML = data.map(function(row) {
                return `
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
                `;
            }).join('');
        } else {
            tbody.innerHTML = data.map(function(row) {
                var rankClass = '';
                if (row.rank && (row.rank.indexOf('总冠军') !== -1 || row.rank.indexOf('冠军') !== -1) ||
                    row.honor && (row.honor.indexOf('MVP') !== -1 || row.honor.indexOf('冠军') !== -1)) {
                    rankClass = 'gold';
                } else if (row.rank && row.rank.indexOf('亚军') !== -1 || row.honor && row.honor.indexOf('亚军') !== -1) {
                    rankClass = 'silver';
                } else if (row.rank && row.rank.indexOf('季军') !== -1) {
                    rankClass = 'bronze';
                }

                var col2 = row.season || row.event || '-';
                var col3 = row.rank || row.honor || '-';
                var col4 = row.opponent || row.player || '-';
                var col5 = row.score || row.stats || '-';
                var col6 = row.note || '-';

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

    updateHonorStats: function() {
        // 苍穹杯总数量
        var cupCount = CLUB_DATA.honors.cup.data.length;
        // 全明星总数量
        var allstarCount = CLUB_DATA.honors.allstar.data.length;
        // 全国联赛总届数（L1-L4 共 4 届）
        var leagueCount = 4;
        // 累计总场次（所有赛事数据总和）
        var totalMatches = cupCount + allstarCount + leagueCount;

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
    updateTabCount: function(elementId, count, unit) {
        var element = document.getElementById(elementId);
        if (element) {
            element.textContent = count + unit;
        }
    },

    // 更新视频标签数量（无单位）
    updateVideoCount: function(category, count) {
        var element = document.getElementById('video-' + category + '-count');
        if (element) {
            element.textContent = count;
        }
    },

    animateNumber: function(elementId, target) {
        var element = document.getElementById(elementId);
        if (!element) return;

        var current = 0;
        var increment = target / 50;
        var timer = setInterval(function() {
            current += increment;
            if (current >= target) {
                element.textContent = target;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current);
            }
        }, 30);
    },

    renderSpirit: function() {
        var container = document.querySelector('.spirit-grid');
        if (!container) return;

        container.innerHTML = CLUB_DATA.spirit.map(function(item) {
            return `
                <div class="spirit-item">
                    <span class="spirit-icon">${item.icon}</span>
                    <h4>${item.title}</h4>
                    <p>${item.desc}</p>
                </div>
            `;
        }).join('');
    }
};

// ==================== 事件处理 ====================
var EventHandler = {
    // 当前过滤器状态
    currentFilter: 'all',

    init: function() {
        this.bindTabs();
        this.bindScroll();
        this.bindClickAnimation();
        this.bindMobileMenu();
        this.bindHonorSearch();
        this.bindNavActive();
        this.bindNavLogoClick();
    },

    bindNavLogoClick: function() {
        var navLogo = document.getElementById('navLogo');
        if (navLogo) {
            navLogo.addEventListener('click', function() {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });

            // 支持键盘访问
            navLogo.addEventListener('keydown', function(e) {
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

    bindTabs: function() {
        var self = this;

        // 视频标签
        document.querySelectorAll('.video-tabs .tab-btn').forEach(function(btn) {
            btn.addEventListener('click', function() {
                var tabId = btn.dataset.tab;
                self.switchTab('.video-tabs .tab-btn', '.video-directory .tab-panel', tabId);
            });
        });

        // 荣誉标签卡片切换 - 卡片式风格
        document.querySelectorAll('.honor-tabs-card .honor-tab-card').forEach(function(card) {
            card.addEventListener('click', function() {
                var honorId = card.dataset.honor;

                // 移除所有卡片的 active 类
                document.querySelectorAll('.honor-tabs-card .honor-tab-card').forEach(function(c) {
                    c.classList.remove('active');
                });

                // 添加 active 类到当前卡片
                card.classList.add('active');

                // 切换面板显示
                document.querySelectorAll('.honor-tables .honor-table-panel').forEach(function(p) {
                    p.classList.remove('active');
                });
                var targetPanel = document.getElementById(honorId);
                if (targetPanel) {
                    targetPanel.classList.add('active');
                }

                // 更新当前荣誉类别
                Renderer.currentHonorCategory = honorId;

                // 重置搜索框和过滤器
                var searchInput = document.getElementById('honorSearch');
                if (searchInput) searchInput.value = '';

                // 重置过滤按钮
                document.querySelectorAll('.honor-filter-btn').forEach(function(b) {
                    b.classList.remove('active');
                });
                var allFilterBtn = document.querySelector('.honor-filter-btn[data-filter="all"]');
                if (allFilterBtn) allFilterBtn.classList.add('active');
                EventHandler.currentFilter = 'all';

                // 重新渲染完整数据
                Renderer.filterHonors('', 'all');
            });
        });

        // 快速导航文字按钮点击事件
        document.querySelectorAll('.quick-link').forEach(function(link) {
            link.addEventListener('click', function() {
                var sectionId = this.dataset.section;
                var target = document.getElementById(sectionId);

                if (target) {
                    // 添加点击动画效果
                    this.style.transform = 'translateY(0) scale(0.95)';
                    setTimeout(function() {
                        link.style.transform = '';
                    }, 150);

                    // 平滑滚动
                    var offsetTop = target.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    },

    switchTab: function(btnSelector, panelSelector, targetId) {
        document.querySelectorAll(btnSelector).forEach(function(b) {
            b.classList.remove('active');
        });
        document.querySelectorAll(panelSelector).forEach(function(p) {
            p.classList.remove('active');
        });

        var targetBtn = document.querySelector(btnSelector + '[data-tab="' + targetId + '"], ' + btnSelector + '[data-honor="' + targetId + '"]');
        if (targetBtn) targetBtn.classList.add('active');

        // 处理视频标签和荣誉标签的不同ID命名规则
        var targetPanelId = targetId;
        if (targetId === 'stars' || targetId === 'cup' || targetId === 'allstar' || targetId === 'league') {
            // 视频标签面板ID需要添加video-前缀
            targetPanelId = 'video-' + targetId;
        }

        var targetPanel = document.getElementById(targetPanelId);
        if (targetPanel) targetPanel.classList.add('active');

        // 如果是视频标签切换，检查并渲染对应的数据
        if (targetId === 'stars' || targetId === 'cup' || targetId === 'allstar' || targetId === 'league') {
            var container = document.getElementById('video-list-' + targetId);
            if (container && CLUB_DATA.videos[targetId]) {
                // 检查容器是否包含视频列表项，如果没有则渲染数据
                var hasVideoItems = container.querySelector('.video-list-item') !== null;
                if (!hasVideoItems) {
                    var videos = CLUB_DATA.videos[targetId].list;
                    container.innerHTML = videos.map(function(video, index) {
                        return Renderer.createVideoItem(video, index);
                    }).join('');
                }
            }
        }
    },

    bindScroll: function() {
        var navbar = document.getElementById('navbar');
        var onScroll = Utils.debounce(function() {
            if (navbar) {
                if (window.pageYOffset > 50) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }
            }
        }, 10);

        window.addEventListener('scroll', onScroll);

        var progressBar = document.getElementById('scrollProgress');
        var onScrollProgress = Utils.debounce(function() {
            if (progressBar) {
                var scrollTop = window.pageYOffset;
                var docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
                var scrollPercent = (scrollTop / docHeight) * 100;
                progressBar.style.width = scrollPercent + '%';
            }
        }, 10);

        window.addEventListener('scroll', onScrollProgress);

        // 回到顶部按钮
        var backToTop = document.getElementById('backToTop');
        if (backToTop) {
            window.addEventListener('scroll', function() {
                if (window.pageYOffset > 300) {
                    backToTop.classList.add('visible');
                } else {
                    backToTop.classList.remove('visible');
                }
            });

            backToTop.addEventListener('click', function() {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }
    },

    bindClickAnimation: function() {
        // 篮球弹跳动画
        document.addEventListener('click', function(e) {
            // 排除交互元素
            if (e.target.closest('a, button, .contact-card, .tournament-card, .spirit-item, .back-to-top, .logo-img, .video-list-item, .member-chip, .nav-menu, .nav-toggle')) {
                return;
            }

            var basketball = document.createElement('div');
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

            setTimeout(function() { return basketball.remove(); }, 1000);
        });

        // Logo 点击礼花特效
        var logoImg = document.querySelector('.logo-img');
        if (logoImg) {
            logoImg.addEventListener('click', function() {
                var icons = ['🏀', '🎯', '🐍', '💜', '💛'];
                for (var i = 0; i < 30; i++) {
                    var confetti = document.createElement('div');
                    confetti.innerHTML = icons[Math.floor(Math.random() * icons.length)];
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

                    var angle = (Math.random() * 360) * (Math.PI / 180);
                    var velocity = 100 + Math.random() * 150;
                    var tx = Math.cos(angle) * velocity;
                    var ty = Math.sin(angle) * velocity;

                    confetti.style.setProperty('--tx', tx + 'px');
                    confetti.style.setProperty('--ty', ty + 'px');

                    setTimeout(function() { return confetti.remove(); }, 1500);
                }
            });
        }
    },

    bindMobileMenu: function() {
        var navToggle = document.getElementById('navToggle');
        var navMenu = document.querySelector('.nav-menu');

        if (navToggle && navMenu) {
            navToggle.addEventListener('click', function() {
                navMenu.classList.toggle('active');
            });

            // 点击链接后关闭菜单
            navMenu.querySelectorAll('a').forEach(function(link) {
                link.addEventListener('click', function() {
                    navMenu.classList.remove('active');
                });
            });
        }
    },

    // 绑定荣誉堂搜索
    bindHonorSearch: function() {
        var self = this;
        var searchInput = document.getElementById('honorSearch');
        var filterBtns = document.querySelectorAll('.honor-filter-btn');

        if (searchInput) {
            // 搜索输入防抖
            var debouncedSearch = Utils.debounce(function(e) {
                var searchTerm = e.target.value.trim();
                Renderer.filterHonors(searchTerm, self.currentFilter || 'all');
            }, 300);

            searchInput.addEventListener('input', debouncedSearch);
        }

        // 过滤按钮
        filterBtns.forEach(function(btn) {
            btn.addEventListener('click', function() {
                filterBtns.forEach(function(b) {
                    b.classList.remove('active');
                });
                btn.classList.add('active');
                self.currentFilter = btn.dataset.filter;

                var searchInput = document.getElementById('honorSearch');
                var searchTerm = searchInput ? searchInput.value.trim() : '';
                Renderer.filterHonors(searchTerm, self.currentFilter);
            });
        });
    },

    // 绑定导航栏激活状态
    bindNavActive: function() {
        var navLinks = document.querySelectorAll('.nav-menu a');
        var quickLinks = document.querySelectorAll('.quick-link');
        var sections = document.querySelectorAll('section, header');

        var onScroll = Utils.debounce(function() {
            var current = '';
            var scrollPos = window.pageYOffset + 150;

            sections.forEach(function(section) {
                var sectionTop = section.offsetTop;
                var sectionHeight = section.offsetHeight;

                if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                    current = section.getAttribute('id');
                }
            });

            // 更新主导航菜单
            navLinks.forEach(function(link) {
                link.classList.remove('active');
                if (link.dataset.section === current) {
                    link.classList.add('active');
                }
            });

            // 更新快速导航文字按钮
            quickLinks.forEach(function(link) {
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
document.addEventListener('DOMContentLoaded', function() {
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
    setTimeout(function() {
        var loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            loadingScreen.classList.add('hidden');
            setTimeout(function() { loadingScreen.style.display = 'none'; }, 500);
        }
    }, 800);
});
