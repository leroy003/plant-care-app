// ========== 数据管理 ==========
const STORAGE_KEY = 'plant-care-data';
const WATER_LOG_KEY = 'plant-water-log';

const plantTypeInfo = {
    monstera: { emoji: '🌿', name: '龟背竹', water: 7 },
    succulent: { emoji: '🌵', name: '多肉植物', water: 14 },
    orchid: { emoji: '🌸', name: '蝴蝶兰', water: 5 },
    rose: { emoji: '🌹', name: '月季/玫瑰', water: 3 },
    bindweed: { emoji: '🍀', name: '绿萝', water: 5 },
    ficus: { emoji: '🌳', name: '琴叶榕', water: 7 },
    jasmine: { emoji: '🤍', name: '茉莉花', water: 4 },
    cactus: { emoji: '🌵', name: '仙人掌', water: 21 },
    other: { emoji: '🌱', name: '其他', water: 7 }
};

const guideData = {
    monstera: {
        title: '🌿 龟背竹养护指南',
        content: `
            <h3>📍 基本信息</h3>
            <p>龟背竹原产于墨西哥热带雨林，是最受欢迎的室内观叶植物之一。它那标志性的裂叶造型深受人们喜爱。</p>
            <h3>💧 浇水</h3>
            <ul>
                <li>每 7-10 天浇一次水，土壤表面干透后再浇</li>
                <li>夏季可适当增加浇水频率</li>
                <li>冬季减少浇水，保持土壤微润即可</li>
                <li>喜欢高湿度环境，可经常向叶片喷水</li>
            </ul>
            <h3>☀️ 光照</h3>
            <ul>
                <li>喜明亮散射光，避免强烈直射阳光</li>
                <li>可放在朝东或朝北的窗户附近</li>
                <li>光照不足时叶片裂口会减少</li>
            </ul>
            <h3>🌡️ 温度</h3>
            <ul>
                <li>适宜温度 18-30°C</li>
                <li>冬季温度不低于 10°C</li>
                <li>避免冷风直吹</li>
            </ul>
            <h3>🧪 施肥</h3>
            <ul>
                <li>春夏每月施一次均衡液肥</li>
                <li>秋冬停止施肥</li>
            </ul>
        `
    },
    succulent: {
        title: '🌵 多肉植物养护指南',
        content: `
            <h3>📍 基本信息</h3>
            <p>多肉植物种类繁多，它们在叶、茎或根部储存水分，是最适合新手的植物类型之一。</p>
            <h3>💧 浇水</h3>
            <ul>
                <li>遵循"干透浇透"原则，每 10-14 天浇一次</li>
                <li>浇水时避免浇到叶心，防止腐烂</li>
                <li>冬季休眠期每月浇一次即可</li>
                <li>宁可少浇，不要多浇</li>
            </ul>
            <h3>☀️ 光照</h3>
            <ul>
                <li>大多数多肉喜欢充足的阳光</li>
                <li>每天至少 4-6 小时光照</li>
                <li>夏季正午需遮阳，防止晒伤</li>
            </ul>
            <h3>🌡️ 温度</h3>
            <ul>
                <li>适宜温度 15-28°C</li>
                <li>昼夜温差大有利于上色</li>
                <li>多数多肉不耐寒，冬季需搬入室内</li>
            </ul>
            <h3>🪴 土壤</h3>
            <ul>
                <li>使用颗粒土为主的配土（颗粒占 60-80%）</li>
                <li>保证排水透气性良好</li>
                <li>花盆底部必须有排水孔</li>
            </ul>
        `
    },
    orchid: {
        title: '🌸 蝴蝶兰养护指南',
        content: `
            <h3>📍 基本信息</h3>
            <p>蝴蝶兰是最受欢迎的室内开花植物之一，花期长达2-3个月，高雅美丽。</p>
            <h3>💧 浇水</h3>
            <ul>
                <li>每 5-7 天浇一次水</li>
                <li>使用浸盆法效果最好：将花盆浸入水中 15 分钟</li>
                <li>水温接近室温，避免冰冷水</li>
                <li>注意不要让水积在叶心</li>
            </ul>
            <h3>☀️ 光照</h3>
            <ul>
                <li>喜欢明亮散射光</li>
                <li>避免直射阳光，否则叶片会灼伤</li>
                <li>朝东窗台是理想位置</li>
            </ul>
            <h3>🌡️ 温度</h3>
            <ul>
                <li>白天 20-28°C，夜间 15-18°C</li>
                <li>需要一定昼夜温差促进开花</li>
                <li>秋季降温可催花</li>
            </ul>
        `
    },
    rose: {
        title: '🌹 月季/玫瑰养护指南',
        content: `
            <h3>📍 基本信息</h3>
            <p>月季被称为"花中皇后"，花色丰富，四季可开花，但需要较多的养护关注。</p>
            <h3>💧 浇水</h3>
            <ul>
                <li>每 2-3 天浇一次水，夏季每天浇</li>
                <li>浇水要浇透，不要只浇表面</li>
                <li>早晨浇水最佳</li>
                <li>避免淋到花朵和叶片</li>
            </ul>
            <h3>☀️ 光照</h3>
            <ul>
                <li>非常喜阳，每天需 6 小时以上直射光</li>
                <li>光照不足会导致徒长和不开花</li>
            </ul>
            <h3>🧪 施肥</h3>
            <ul>
                <li>生长季每 10-15 天施一次肥</li>
                <li>花期使用磷钾肥促花</li>
                <li>冬季修剪后施基肥</li>
            </ul>
            <h3>✂️ 修剪</h3>
            <ul>
                <li>花后及时修剪残花</li>
                <li>冬季进行重剪</li>
                <li>定期疏除内部枝条保持通风</li>
            </ul>
        `
    },
    bindweed: {
        title: '🍀 绿萝养护指南',
        content: `
            <h3>📍 基本信息</h3>
            <p>绿萝是公认最好养的室内植物之一，不仅美观，还能有效净化空气中的甲醛等有害物质。</p>
            <h3>💧 浇水</h3>
            <ul>
                <li>每 5-7 天浇一次水</li>
                <li>土壤微干时浇水即可</li>
                <li>可以水培养殖，更加简单</li>
                <li>喜湿润，可经常喷水增加湿度</li>
            </ul>
            <h3>☀️ 光照</h3>
            <ul>
                <li>耐阴性极强，散射光即可</li>
                <li>避免强烈直射阳光</li>
                <li>光照不足也能生长，但叶色可能变浅</li>
            </ul>
            <h3>🌡️ 温度</h3>
            <ul>
                <li>适宜温度 15-30°C</li>
                <li>不耐寒，冬季保持 10°C 以上</li>
            </ul>
        `
    },
    ficus: {
        title: '🌳 琴叶榕养护指南',
        content: `
            <h3>📍 基本信息</h3>
            <p>琴叶榕因其大而美的叶片形似提琴而得名，是近年最流行的"网红"室内植物。</p>
            <h3>💧 浇水</h3>
            <ul>
                <li>每 7-10 天浇一次水</li>
                <li>表面 3cm 土壤干燥后浇水</li>
                <li>浇透后排掉底盘积水</li>
                <li>定期擦拭叶片保持清洁</li>
            </ul>
            <h3>☀️ 光照</h3>
            <ul>
                <li>喜明亮间接光线</li>
                <li>每天 6 小时以上明亮散射光</li>
                <li>定期转盆保证均匀光照</li>
            </ul>
            <h3>⚠️ 注意事项</h3>
            <ul>
                <li>不喜欢被频繁移动位置</li>
                <li>避免冷风和暖气直吹</li>
                <li>叶片发黑可能是浇水过多</li>
            </ul>
        `
    },
    jasmine: {
        title: '🤍 茉莉花养护指南',
        content: `
            <h3>📍 基本信息</h3>
            <p>茉莉花以其清香闻名，是中国传统名花之一，花期长且香气怡人。</p>
            <h3>💧 浇水</h3>
            <ul>
                <li>生长期每 3-4 天浇一次水</li>
                <li>花期保持土壤湿润</li>
                <li>冬季减少浇水</li>
            </ul>
            <h3>☀️ 光照</h3>
            <ul>
                <li>喜充足阳光，每天至少 5 小时</li>
                <li>"晒不死的茉莉"，越晒越开花</li>
            </ul>
            <h3>🧪 施肥</h3>
            <ul>
                <li>花期前施磷钾肥促进开花</li>
                <li>花后及时追肥恢复生长</li>
                <li>薄肥勤施效果最好</li>
            </ul>
        `
    },
    cactus: {
        title: '🌵 仙人掌养护指南',
        content: `
            <h3>📍 基本信息</h3>
            <p>仙人掌原产于美洲干旱地区，是最耐旱的植物之一，非常适合"懒人"养护。</p>
            <h3>💧 浇水</h3>
            <ul>
                <li>每 2-3 周浇一次水即可</li>
                <li>冬季可一个月不浇水</li>
                <li>浇水过多是最常见的"杀手"</li>
                <li>确保盆土完全干透再浇</li>
            </ul>
            <h3>☀️ 光照</h3>
            <ul>
                <li>喜欢充足的阳光</li>
                <li>放在朝南窗台最佳</li>
                <li>部分品种夏季需适当遮阳</li>
            </ul>
            <h3>🪴 土壤</h3>
            <ul>
                <li>使用专用仙人掌土，排水性极好</li>
                <li>花盆底部必须有排水孔</li>
                <li>可在土表铺一层小石子</li>
            </ul>
        `
    }
};

// ========== 初始化 ==========
let plants = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
let waterLog = JSON.parse(localStorage.getItem(WATER_LOG_KEY)) || {};
let currentMonth = new Date();
let editingPlantId = null;

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initTheme();
    initFilters();
    setDefaultDate();
    renderAll();
});

// ========== 导航 ==========
function initNavigation() {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const section = link.dataset.section;
            showSection(section);
        });
    });
}

function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    document.getElementById(sectionId).classList.add('active');
    document.querySelector(`[data-section="${sectionId}"]`).classList.add('active');

    if (sectionId === 'calendar') renderCalendar();
    if (sectionId === 'plants') renderPlantGrid();
    if (sectionId === 'home') renderAll();
}

// ========== 主题 ==========
function initTheme() {
    const saved = localStorage.getItem('plant-app-theme') || 'light';
    if (saved === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        document.getElementById('themeToggle').textContent = '☀️';
    }
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);
}

function toggleTheme() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    document.documentElement.setAttribute('data-theme', isDark ? 'light' : 'dark');
    document.getElementById('themeToggle').textContent = isDark ? '🌙' : '☀️';
    localStorage.setItem('plant-app-theme', isDark ? 'light' : 'dark');
}

// ========== 筛选 ==========
function initFilters() {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderPlantGrid(btn.dataset.filter);
        });
    });
}

function filterPlants() {
    const activeFilter = document.querySelector('.filter-btn.active')?.dataset.filter || 'all';
    renderPlantGrid(activeFilter);
}

// ========== 渲染 ==========
function renderAll() {
    updateStats();
    renderTodayTasks();
    renderPlantGrid();
}

function updateStats() {
    const total = plants.length;
    const needWaterCount = plants.filter(p => isNeedWater(p)).length;
    const healthy = total - needWaterCount;

    document.getElementById('totalPlants').textContent = total;
    document.getElementById('needWater').textContent = needWaterCount;
    document.getElementById('healthyCount').textContent = healthy;
}

function isNeedWater(plant) {
    if (!plant.lastWatered) return true;
    const lastDate = new Date(plant.lastWatered);
    const now = new Date();
    const diffDays = Math.floor((now - lastDate) / (1000 * 60 * 60 * 24));
    return diffDays >= plant.waterFreq;
}

function getDaysUntilWater(plant) {
    if (!plant.lastWatered) return 0;
    const lastDate = new Date(plant.lastWatered);
    const nextDate = new Date(lastDate);
    nextDate.setDate(nextDate.getDate() + plant.waterFreq);
    const now = new Date();
    const diffDays = Math.ceil((nextDate - now) / (1000 * 60 * 60 * 24));
    return diffDays;
}

function renderTodayTasks() {
    const container = document.getElementById('todayTasks');
    const tasksNeedWater = plants.filter(p => isNeedWater(p));

    if (tasksNeedWater.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <span class="empty-icon">✨</span>
                <p>今天没有待办任务，享受美好的一天吧！</p>
            </div>
        `;
        return;
    }

    container.innerHTML = tasksNeedWater.map(plant => {
        const info = plantTypeInfo[plant.type] || plantTypeInfo.other;
        return `
            <div class="task-item">
                <div class="task-icon">${info.emoji}</div>
                <div class="task-content">
                    <div class="task-name">${plant.name}</div>
                    <div class="task-detail">${plant.location ? '📍 ' + plant.location + ' · ' : ''}需要浇水啦！</div>
                </div>
                <div class="task-action">
                    <button class="btn btn-primary btn-sm" onclick="waterPlant('${plant.id}')">💧 浇水</button>
                </div>
            </div>
        `;
    }).join('');
}

function renderPlantGrid(filter = 'all') {
    const container = document.getElementById('plantGrid');
    const searchTerm = document.getElementById('searchInput')?.value.toLowerCase() || '';

    let filtered = [...plants];

    // 搜索
    if (searchTerm) {
        filtered = filtered.filter(p =>
            p.name.toLowerCase().includes(searchTerm) ||
            (plantTypeInfo[p.type]?.name || '').includes(searchTerm) ||
            (p.location || '').toLowerCase().includes(searchTerm)
        );
    }

    // 筛选
    if (filter === 'needWater') {
        filtered = filtered.filter(p => isNeedWater(p));
    } else if (filter === 'healthy') {
        filtered = filtered.filter(p => !isNeedWater(p));
    } else if (filter === 'attention') {
        filtered = filtered.filter(p => {
            const days = getDaysUntilWater(p);
            return days <= 1 && days > -2;
        });
    }

    if (filtered.length === 0) {
        container.innerHTML = `
            <div class="empty-state" style="grid-column: 1/-1;">
                <span class="empty-icon">🌱</span>
                <p>${plants.length === 0 ? '还没有植物，点击上方按钮添加第一株吧！' : '没有匹配的植物'}</p>
            </div>
        `;
        return;
    }

    container.innerHTML = filtered.map(plant => {
        const info = plantTypeInfo[plant.type] || plantTypeInfo.other;
        const needWater = isNeedWater(plant);
        const daysUntil = getDaysUntilWater(plant);
        let statusClass, statusText;

        if (needWater) {
            statusClass = 'status-water';
            statusText = '💧 需要浇水';
        } else if (daysUntil <= 2) {
            statusClass = 'status-attention';
            statusText = `⚠️ ${daysUntil} 天后需浇水`;
        } else {
            statusClass = 'status-good';
            statusText = `✅ ${daysUntil} 天后浇水`;
        }

        const lastWateredText = plant.lastWatered
            ? new Date(plant.lastWatered).toLocaleDateString('zh-CN')
            : '未记录';

        return `
            <div class="plant-card" data-id="${plant.id}">
                <div class="plant-card-header">
                    <div>
                        <div class="plant-card-emoji">${info.emoji}</div>
                        <div class="plant-card-name">${plant.name}</div>
                        <div class="plant-card-type">${info.name}</div>
                    </div>
                    <span class="plant-status ${statusClass}">${statusText}</span>
                </div>
                <div class="plant-card-info">
                    ${plant.location ? `<div class="plant-info-item">📍 ${plant.location}</div>` : ''}
                    <div class="plant-info-item">💧 每 ${plant.waterFreq} 天浇水一次</div>
                    <div class="plant-info-item">📅 上次浇水: ${lastWateredText}</div>
                    ${plant.note ? `<div class="plant-info-item">📝 ${plant.note}</div>` : ''}
                </div>
                <div class="plant-card-actions">
                    <button class="btn btn-primary btn-sm" onclick="waterPlant('${plant.id}')">💧 浇水</button>
                    <button class="btn btn-secondary btn-sm" onclick="editPlant('${plant.id}')">✏️ 编辑</button>
                    <button class="btn btn-danger btn-sm" onclick="deletePlant('${plant.id}')">🗑️</button>
                </div>
            </div>
        `;
    }).join('');
}

// ========== 植物 CRUD ==========
function setDefaultDate() {
    const today = new Date().toISOString().split('T')[0];
    const dateInput = document.getElementById('lastWatered');
    if (dateInput) dateInput.value = today;
}

function openAddModal() {
    editingPlantId = null;
    document.getElementById('modalTitle').textContent = '添加植物';
    document.getElementById('plantForm').reset();
    setDefaultDate();
    document.getElementById('plantId').value = '';
    document.getElementById('plantModal').style.display = 'flex';
}

function closePlantModal() {
    document.getElementById('plantModal').style.display = 'none';
}

function editPlant(id) {
    const plant = plants.find(p => p.id === id);
    if (!plant) return;

    editingPlantId = id;
    document.getElementById('modalTitle').textContent = '编辑植物';
    document.getElementById('plantName').value = plant.name;
    document.getElementById('plantType').value = plant.type;
    document.getElementById('plantLocation').value = plant.location || '';
    document.getElementById('waterFreq').value = plant.waterFreq;
    document.getElementById('lastWatered').value = plant.lastWatered || '';
    document.getElementById('plantNote').value = plant.note || '';
    document.getElementById('plantId').value = id;
    document.getElementById('plantModal').style.display = 'flex';
}

function savePlant(e) {
    e.preventDefault();

    const plantData = {
        id: editingPlantId || Date.now().toString(),
        name: document.getElementById('plantName').value.trim(),
        type: document.getElementById('plantType').value,
        location: document.getElementById('plantLocation').value.trim(),
        waterFreq: parseInt(document.getElementById('waterFreq').value) || 7,
        lastWatered: document.getElementById('lastWatered').value,
        note: document.getElementById('plantNote').value.trim(),
        createdAt: editingPlantId
            ? plants.find(p => p.id === editingPlantId)?.createdAt || new Date().toISOString()
            : new Date().toISOString()
    };

    if (editingPlantId) {
        const index = plants.findIndex(p => p.id === editingPlantId);
        if (index >= 0) plants[index] = plantData;
        showToast('✅ 植物信息已更新');
    } else {
        plants.push(plantData);
        showToast('🌱 新植物已添加');
    }

    saveData();
    closePlantModal();
    renderAll();
    renderPlantGrid();
}

function deletePlant(id) {
    const plant = plants.find(p => p.id === id);
    if (!plant) return;
    if (!confirm(`确定要删除「${plant.name}」吗？`)) return;

    plants = plants.filter(p => p.id !== id);
    saveData();
    renderAll();
    renderPlantGrid();
    showToast('🗑️ 植物已删除');
}

function waterPlant(id) {
    const plant = plants.find(p => p.id === id);
    if (!plant) return;

    const today = new Date().toISOString().split('T')[0];
    plant.lastWatered = today;

    // 记录浇水日志
    if (!waterLog[today]) waterLog[today] = [];
    if (!waterLog[today].includes(id)) {
        waterLog[today].push(id);
    }

    saveData();
    renderAll();
    renderPlantGrid();
    showToast(`💧 已为「${plant.name}」浇水`);
}

function saveData() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(plants));
    localStorage.setItem(WATER_LOG_KEY, JSON.stringify(waterLog));
}

// ========== 日历 ==========
function renderCalendar() {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    document.getElementById('calendarTitle').textContent =
        `${year} 年 ${month + 1} 月`;

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDay = (firstDay.getDay() + 6) % 7; // 周一开始

    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    let html = '';

    // 空白格
    for (let i = 0; i < startDay; i++) {
        html += '<div class="calendar-day empty"></div>';
    }

    // 日期格
    for (let d = 1; d <= lastDay.getDate(); d++) {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
        const isToday = dateStr === todayStr;
        const isWatered = waterLog[dateStr] && waterLog[dateStr].length > 0;

        // 检查是否是计划浇水日
        const isScheduled = plants.some(p => {
            if (!p.lastWatered) return false;
            const last = new Date(p.lastWatered);
            const next = new Date(last);
            next.setDate(next.getDate() + p.waterFreq);
            return next.toISOString().split('T')[0] === dateStr;
        });

        let classes = 'calendar-day';
        if (isToday) classes += ' today';
        if (isWatered) classes += ' watered';
        else if (isScheduled) classes += ' scheduled';

        html += `<div class="${classes}" onclick="onCalendarDayClick('${dateStr}')">${d}</div>`;
    }

    document.getElementById('calendarDays').innerHTML = html;
}

function changeMonth(delta) {
    currentMonth.setMonth(currentMonth.getMonth() + delta);
    renderCalendar();
}

function onCalendarDayClick(dateStr) {
    const wateredPlants = (waterLog[dateStr] || [])
        .map(id => plants.find(p => p.id === id))
        .filter(Boolean);

    if (wateredPlants.length > 0) {
        const names = wateredPlants.map(p => p.name).join('、');
        showToast(`📅 ${dateStr}：已浇水 - ${names}`);
    }
}

// ========== 养护指南弹窗 ==========
function showGuideDetail(type) {
    const data = guideData[type];
    if (!data) return;

    document.getElementById('guideTitle').textContent = data.title;
    document.getElementById('guideBody').innerHTML = data.content;
    document.getElementById('guideModal').style.display = 'flex';
}

function closeGuideModal() {
    document.getElementById('guideModal').style.display = 'none';
}

// ========== Toast ==========
function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2500);
}

// ========== 点击弹窗外部关闭 ==========
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        e.target.style.display = 'none';
    }
});
