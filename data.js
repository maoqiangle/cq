/**
 * ===========================================
 * 苍穹俱乐部 - 集中式数据配置 v2.0
 * ===========================================
 * 说明：所有页面数据集中在此文件中管理
 * 更新数据时只需修改此文件，无需改动 HTML
 * 
 * 最后更新：2026-03-31
 * 数据来源：苍穹杯历届正赛 Sv3 荣誉总览
 */

const CLUB_DATA = {
    // ==================== 基础信息 ====================
    basic: {
        name: "2KOL 联合中心【穹】俱乐部",
        founded: "2013",
        clubId: "86670",
        douyin: "CQ86670",
        platform: "2KOL 联合中心",
        slogan: "冠军旗帜永挂苍穹",
        motto: "花有重开日，人无再少年，热血常埋于心中"
    },

    // ==================== 管理架构 ====================
    structure: {
        president: {
            title: "会长",
            members: ["雷"]
        },
        vicePresidents: {
            title: "副会长团",
            members: ["峰少", "十三", "小龙", "老铁", "雨", "妃子", "小包子"],
            desc: "负责俱乐部日程活动管理，招人纳新，内战组织，重大商议和决策投票等。"
        },
        organizer: {
            title: "《苍穹杯》组委会",
            members: ["十三", "小龙", "魔卡", "少女"],
            desc: "负责苍穹杯比赛规则制定，赛事运营，数据整理，结果发布，素材剪辑，平台发布等。"
        }
    },

    // ==================== 视频目录 ====================
    // 数据来源：抖音苍穹 CQ86670 高赞作品（按点赞从高到低排序）
    videos: {
        stars: {
            title: "⭐ 球星传",
            description: "苍穹球星传系列，回顾 NBA 传奇球星的经典时刻",
            list: [{
                    title: "苍穹球星传 39 期 加内特 04 版",
                    desc: "2025-05-08 发布。狼王巅峰重现，04 版加内特统治攻防两端",
                    duration: "04:30",
                    views: "高赞",
                    highlight: "经典攻防集锦",
                    tags: ["大前锋", "防守", "MVP"]
                },
                {
                    title: "苍穹球星传 34 期 伯德经典版",
                    desc: "2025-04-22 发布。大鸟传奇，篮球智商的天花板",
                    duration: "04:15",
                    views: "高赞",
                    highlight: "背身单打精选",
                    tags: ["小前锋", "投篮", "传奇"]
                },
                {
                    title: "苍穹球星传 21 期 罗德曼经典版",
                    desc: "2025-01-11 发布。大虫篮板王，防守端的疯狂表现",
                    duration: "03:50",
                    views: "高赞",
                    highlight: "篮板+防守集锦",
                    tags: ["大前锋", "篮板", "防守"]
                },
                {
                    title: "苍穹球星传 02 期 肯扬马丁经典版",
                    desc: "2024-12-23 发布。野兽派大前锋，暴力扣篮代表",
                    duration: "03:35",
                    views: "高赞",
                    highlight: "暴力扣篮合集",
                    tags: ["大前锋", "扣篮", "野兽"]
                },
                {
                    title: "苍穹球星传 04 期 威少十二版",
                    desc: "2024-10-05 发布。威少爷巅峰赛季，三双机器",
                    duration: "04:05",
                    views: "高赞",
                    highlight: "三双表现精选",
                    tags: ["控卫", "三双", "爆发力"]
                }
            ]
        },
        cup: {
            title: "🏆 杯赛冠军",
            description: "苍穹杯历届决赛精彩瞬间，见证冠军诞生",
            list: [{
                    title: "苍穹杯 S16 冠军集锦",
                    desc: "2024-09-13 发布，点赞 8015。杯赛夺冠精彩瞬间合集",
                    duration: "06:30",
                    views: "8015 赞",
                    highlight: "夺冠精彩瞬间",
                    tags: ["冠军", "集锦", "S16"]
                },
                {
                    title: "苍穹杯 S17 冠军集锦",
                    desc: "2024-10-13 发布，点赞 8015。杯赛夺冠精彩瞬间合集",
                    duration: "06:45",
                    views: "8015 赞",
                    highlight: "夺冠精彩瞬间",
                    tags: ["冠军", "集锦", "S17"]
                },
                {
                    title: "苍穹杯 S18 冠军集锦",
                    desc: "2024-11-20 发布，点赞 8015。杯赛夺冠精彩瞬间合集",
                    duration: "07:00",
                    views: "8015 赞",
                    highlight: "夺冠精彩瞬间",
                    tags: ["冠军", "集锦", "S18"]
                },
                {
                    title: "S19 苍穹杯十佳球 抢七绝杀",
                    desc: "2025-04-10 发布，点赞 6237。关键球集锦，绝杀时刻",
                    duration: "05:20",
                    views: "6237 赞",
                    highlight: "抢七绝杀球",
                    tags: ["绝杀", "十佳球", "S19"]
                }
            ]
        },
        allstar: {
            title: "🌟 全明星赛",
            description: "星光熠熠的娱乐盛宴",
            list: [{
                title: "全明星赛精彩集锦绿卡易建联精彩集锦",
                desc: "苍穹俱乐部全明星赛绿卡易建联精彩集锦",
                duration: "05:30",
                views: "1200 赞",
                highlight: "上电视",
                tags: ["得分", "暴扣"]
            }]
        },
        league: {
            title: "🔥 全国联赛",
            description: "L1-L4 联赛精彩瞬间，见证成长与荣耀",
            list: [{
                    title: "全国联赛总决赛L1 比赛集锦",
                    desc: "2025-05-23 发布，点赞 1208。联赛绝杀与高光操作",
                    duration: "05:30",
                    views: "1.2 万",
                    highlight: "绝杀 + 高光操作",
                    tags: ["5 佳球", "绝杀"]
                },
                {
                    title: "全国联赛总决赛L4 十佳球",
                    desc: "2025-06-02 发布，点赞 5864。总决赛逆转对局复盘",
                    duration: "08:15",
                    views: "5864 赞",
                    highlight: "精彩十佳球",
                    tags: ["总决赛", "逆转", "经典"]
                }
            ]
        }
    },

    // ==================== 荣誉殿堂 ====================
    honors: {
        cup: {
            title: "🥇 苍穹杯历届冠军榜",
            // subtitle: "S1-S35 完整记录",
            columns: ["比赛时间", "届数", "夺冠队员", "队长", "最佳球员", "冠军戒指"],
            data: [
                // 2026 年
                { date: "2026.04.18", season: "S35", champions: "雷，妃子，雨", captain: "雷", mvp: "雷", ring: "1957 勇士" },
                { date: "2026.03.14", season: "S34", champions: "皮鞋，老铁，李小龙", captain: "皮鞋", mvp: "皮鞋", ring: "1956 勇士" },
                { date: "2026.03.07", season: "S33", champions: "雷，牧师，小熊", captain: "雷", mvp: "牧师", ring: "1958 老鹰" },
                // 2025 年
                { date: "2026.01.31", season: "S32", champions: "大特，阿拉瓦，蓝莓", captain: "大特", mvp: "阿拉瓦", ring: "1948 子弹队" },
                { date: "2025.12.20", season: "S31", champions: "包子，vote，黑猫", captain: "vote", mvp: "包子", ring: "1951 国王" },
                { date: "2025.11.15", season: "S30", champions: "妃子，小宁，大特", captain: "妃子", mvp: "大特", ring: "2019 猛龙" },
                { date: "2025.10.25", season: "S29", champions: "皮鞋，雷，大秦", captain: "皮鞋", mvp: "雷", ring: "2021 雄鹿" },
                { date: "2025.09.20", season: "S28", champions: "包子，小熊，黑猫", captain: "包子", mvp: "包子", ring: "1962 凯尔特人" },
                { date: "2025.08.23", season: "S27", champions: "包子，撸，黑猫", captain: "包子", mvp: "包子", ring: "1996 公牛" },
                { date: "2025.07.19", season: "S26", champions: "包子，大虫，李小龙", captain: "包子", mvp: "包子", ring: "2017 勇士" },
                { date: "2025.06.14", season: "S25", champions: "包子，撸，小熊", captain: "包子", mvp: "包子", ring: "1970 尼克斯" },
                { date: "2025.05.10", season: "S24", champions: "闪电侠，皮鞋，夜店登", captain: "闪电侠", mvp: "闪电侠", ring: "2009 湖人" },
                { date: "2025.04.19", season: "S23", champions: "阿诺比，十三香，老铁", captain: "阿诺比", mvp: "阿诺比", ring: "2004 活塞" },
                { date: "2025.03.15", season: "S22", champions: "李小龙，村长，雨", captain: "李小龙", mvp: "村长", ring: "1947 勇士" },
                { date: "2025.02.22", season: "S21", champions: "包子，石头，卡卡", captain: "包子", mvp: "包子", ring: "1995 火箭" },
                { date: "2025.01.11", season: "S20", champions: "牧师，十三香，少男", captain: "牧师", mvp: "牧师", ring: "2002 湖人" },
                // 2024 年
                { date: "2024.12.15", season: "S19", champions: "老马，妃子，俏皮", captain: "老马", mvp: "老马", ring: "1990 活塞" },
                { date: "2024.11.16", season: "S18", champions: "杜，修，三猪", captain: "杜", mvp: "杜", ring: "1989 活塞" },
                { date: "2024.10.26", season: "S17", champions: "牧师，阿诺比，心脏", captain: "牧师", mvp: "心脏", ring: "1967 费城 76 人" },
                { date: "2024.09.07", season: "S16", champions: "老马，老铁，蓝莓", captain: "老马", mvp: "老马", ring: "2011 小牛" },
                { date: "2024.08.24", season: "S15", champions: "妃子，老马，石头", captain: "老马", mvp: "妃子", ring: "2001 湖人" },
                { date: "2024.07.20", season: "S14", champions: "妃子，魔卡，阿诺比", captain: "妃子", mvp: "妃子", ring: "1994 火箭" },
                { date: "2024.06.15", season: "S13", champions: "李小龙，牧师，禽兽", captain: "李小龙", mvp: "禽兽", ring: "2015 勇士" },
                { date: "2024.05.18", season: "S12", champions: "十三香，牧师，炫风舞", captain: "十三", mvp: "十三", ring: "2000 湖人" },
                { date: "2024.04.13", season: "S11", champions: "大虫，老马，吹杨", captain: "大虫", mvp: "老马", ring: "2012 热火" },
                { date: "2024.03.02", season: "S10", champions: "阿诺比，小宁，大虫", captain: "阿诺比", mvp: "阿诺比", ring: "2014 马刺" },
                { date: "2024.01.20", season: "S9", champions: "妃子，机智，雨果", captain: "妃子", mvp: "妃子", ring: "2007 马刺" },
                // 2023 年
                { date: "2023.12.30", season: "S8", champions: "魔卡，机智，妃子", captain: "妃子", mvp: "机智", ring: "2006 马刺" },
                { date: "2023.12.02", season: "S7", champions: "杜，修，雨果", captain: "修", mvp: "修", ring: "2003 马刺" },
                { date: "2023.11.11", season: "S6", champions: "雷，大虫，宫城", captain: "雷", mvp: "雷", ring: "1999 马刺" },
                { date: "2023.10.14", season: "S5", champions: "杜，修", captain: "杜", mvp: "-", ring: "2006 热火" },
                { date: "2023.08.24", season: "S4", champions: "雨，机智，妃子", captain: "雨", mvp: "机智", ring: "2000 凯尔特人" },
                { date: "2023.07.30", season: "S3", champions: "雨，机智，妃子", captain: "雨", mvp: "妃子", ring: "1998 公牛" },
                { date: "2023.07.01", season: "S2", champions: "雷，十三香，李小龙", captain: "雷", mvp: "雷", ring: "1992 公牛" },
                { date: "2023.06.07", season: "S1", champions: "雷，十三香，李小龙", captain: "雷", mvp: "雷", ring: "1991 公牛" }
            ]
        },
        allstar: {
            title: "🌟 全明星赛",
            // subtitle: "Q1-Q10 完整记录",
            columns: ["比赛时间", "届数", "获胜战队", "队员阵容", "荣誉时刻", "MVP", "三分王", "单挑王"],
            data: [
                // 2026 年
                { date: "2026.03.28", season: "Q10", champions: "🏆 雷队", members: "雷，皮鞋，大秦", honor: "🎖️ 拉塞尔名人堂戒指", mvp: "皮鞋", three: "-", one: "-" },
                { date: "2026.01.17", season: "Q9", champions: "🏆 戴琪轩队", members: "戴琪轩，初心，细白", honor: "🎖️ 科比名人堂戒指", mvp: "细白", three: "-", one: "-" },
                // 2025 年
                { date: "2025.10.18", season: "Q8", champions: "🏆 青龙", members: "包子，雷，大虫，李小龙", honor: "🎖️ 乔丹名人堂戒指", mvp: "李小龙", three: "李小龙", one: "阿诺比" },
                { date: "2025.06.28", season: "Q7", champions: "🏆 玄武", members: "牧师，阿诺比，小熊", honor: "🎖️ 奥尼尔名人堂戒指", mvp: "阿诺比", three: "妃子", one: "阿诺比" },
                { date: "2025.03.27", season: "Q6", champions: "🏆 朱雀", members: "小包子，阿诺比，小宁", honor: "🎖️ 艾弗森名人堂戒指", mvp: "小包子", three: "大虫", one: "小包子" },
                // 2024 年
                { date: "2024.12.28", season: "Q5", champions: "🏆 老马队", members: "老马，妃子，大虫，雨，机智，小宁，阿诺比", honor: "🎖️ 邓肯名人堂戒指", mvp: "妃子", three: "阿诺比", one: "牧师" },
                { date: "2024.09.21", season: "Q4", champions: "🏆 雷队", members: "雷，大虫，十三，李小龙，牧师", honor: "🎖️ 麦迪名人堂戒指", mvp: "雷", three: "十三", one: "牧师" },
                { date: "2024.06.29", season: "Q3", champions: "🏆 雷队", members: "雷，妃子，十三，李小龙，阿杜，机智，雨", honor: "🎖️ 加内特名人堂戒指", mvp: "十三", three: "吹杨", one: "牧师" },
                { date: "2024.03.24", season: "Q2", champions: "🏆 雷队", members: "雷，大虫，十三，李小龙，宫城", honor: "🎖️ 姚明名人堂戒指", mvp: "雷，十三", three: "阿诺比", one: "雷" },
                // 2023 年
                { date: "2023.12.16", season: "Q1", champions: "🏆 修队", members: "修，杜，雨，妃子", honor: "🎖️ 科比退役戒指", mvp: "修", three: "十三", one: "阿杜" }
            ]
        },
        league: {
            title: "🔥 全国联赛",
            // subtitle: "L1-L4 完整记录",
            columns: ["年份", "赛季", "名次", "战队", "人数", "队员名单"],
            data: [
                // L4 - 2025 年（第 4 届）
                { year: "2025", season: "L4", round: "4", rank: "🏆 冠军", team: "江苏队", count: "4 人", players: "大虫，村长△ (FMVP)，老铁，vote" },
                { year: "2025", season: "L4", round: "4", rank: "🥈 亚军", team: "广东队", count: "9 人", players: "牧师，雷，玫瑰△，阿哲，正经喵，大特，吹杨，碌柚，白清枚" },
                { year: "2025", season: "L4", round: "4", rank: "🥉 季军", team: "福建", count: "3 人", players: "阿拉瓦△，蓝莓，宫城" },
                // L3 - 2025 年（第 3 届）
                { year: "2025", season: "L3", round: "3", rank: "🏆 冠军", team: "广东队", count: "7 人", players: "牧师，雷 (FMVP)，正经喵，玫瑰△，阿哲，大特，夜店登" },
                { year: "2025", season: "L3", round: "3", rank: "🥈 亚军", team: "江苏队", count: "6 人", players: "大虫△，包子，老铁，马国成，vote" },
                { year: "2025", season: "L3", round: "3", rank: "🥉 季军", team: "赣皖渝联队", count: "4 人", players: "李小龙△，妃子，皮鞋，雨" },
                // L2 - 2024 年（第 2 届）
                { year: "2024", season: "L2", round: "2", rank: "🏆 冠军", team: "湘鄂联队", count: "3 人", players: "小雨干△ (FMVP)，石头，老马" },
                { year: "2024", season: "L2", round: "2", rank: "🥈 亚军", team: "湘宁浙联队", count: "3 人", players: "杜，修，阿诺比" },
                { year: "2024", season: "L2", round: "2", rank: "🥉 季军", team: "广东队", count: "5 人", players: "牧师，雷，吹杨，玫瑰△，阿哲" },
                // L1 - 2024 年（第 1 届）
                { year: "2024", season: "L1", round: "1", rank: "🏆 冠军", team: "苏贵联队", count: "3 人", players: "小虫△，包子 (FMVP)，雨果" },
                { year: "2024", season: "L1", round: "1", rank: "🥈 亚军", team: "湖南队", count: "3 人", players: "杜，修△，老马" },
                { year: "2024", season: "L1", round: "1", rank: "🥉 季军", team: "广东队", count: "6 人", players: "牧师，雷，吹杨，玫瑰△，阿哲" }
            ]
        }
    },

    // ==================== 黑曼巴精神 ====================
    spirit: [
        { icon: "💜", title: "永不言弃", desc: "即使跌倒 100 次，也要第 101 次站起来" },
        { icon: "🏀", title: "全力以赴", desc: "每一球都当作最后一球来打" },
        { icon: "👥", title: "兄弟同心", desc: "一个人可以走得快，一群人才能走得远" },
        { icon: "🏆", title: "追求卓越", desc: "冠军不是终点，而是新的起点" }
    ]
};

/**
 * ===========================================
 * 数据统计（自动生成）
 * ===========================================
 */

// 苍穹杯统计数据
CLUB_DATA.cupStats = {
    totalSeasons: CLUB_DATA.honors.cup.data.length, // 34 届
    // 夺冠次数统计
    championCount: {},
    // MVP 次数统计
    mvpCount: {},
    // 队长次数统计
    captainCount: {}
};

// 统计冠军/MVP/队长次数
CLUB_DATA.honors.cup.data.forEach(record => {
    // 统计冠军
    record.champions.split('，').forEach(player => {
        if (player && player !== '-') {
            CLUB_DATA.cupStats.championCount[player] = (CLUB_DATA.cupStats.championCount[player] || 0) + 1;
        }
    });
    // 统计 MVP
    if (record.mvp && record.mvp !== '-') {
        CLUB_DATA.cupStats.mvpCount[record.mvp] = (CLUB_DATA.cupStats.mvpCount[record.mvp] || 0) + 1;
    }
    // 统计队长
    if (record.captain && record.captain !== '-') {
        CLUB_DATA.cupStats.captainCount[record.captain] = (CLUB_DATA.cupStats.captainCount[record.captain] || 0) + 1;
    }
});

/**
 * ===========================================
 * 数据格式规范
 * ===========================================
 * 
 * 【空缺值统一格式】
 * - 所有空缺/未知数据统一使用 "-" (字符串) 表示
 * - 示例：mvp: "-", three: "-", one: "-"
 * - 不要使用空字符串 ""、null 或 undefined
 * - 队员列表如有空缺，直接省略该队员，不要保留 "，-" 
 *   错误示例：champions: "杜，修，-"
 *   正确示例：champions: "杜，修"
 * 
 * 【数据更新说明】
 * 
 * 1. 更新苍穹杯数据：
 *    修改 CLUB_DATA.honors.cup.data 数组
 *    每条数据包含：date(日期), season(届数), champions(冠军队员), captain(队长), mvp(MVP), ring(戒指)
 * 
 * 2. 更新视频数据：
 *    修改 CLUB_DATA.videos.stars / cup / allstar / league.list 数组
 * 
 * 3. 更新管理架构：
 *    修改 CLUB_DATA.structure.president / vicePresidents / organizer.members 数组
 *  
 * 4. 添加新数据：
 *    在对应数组中使用 unshift() 方法添加到开头（最新数据）
 *    例如：CLUB_DATA.honors.cup.data.unshift({ date: "2026.04.05", season: "S35", ... })
 * 
 * 5. 搜索/筛选功能：
 *    页面会自动支持按年份、队员、队长、MVP 搜索
 *    无需额外配置
 */
