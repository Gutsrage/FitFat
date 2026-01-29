let products = [];
let dailyIntake = {};
let norms = {
    calories: 2000,
    protein: 100,
    fats: 70,
    carbs: 250,
    water: 2000
};

function init() {
    loadFromStorage();
    updateProductsList();
    updateFoodSelect();
    updateDashboard();
    document.getElementById('historyDate').valueAsDate = new Date();
}

function loadFromStorage() {
    const savedProducts = localStorage.getItem('products');
    if (savedProducts) {
        products = JSON.parse(savedProducts);
    } else {
        products = [
            { id: 1, name: 'Куриная грудка', calories: 165, protein: 31, fats: 3.6, carbs: 0 },
            { id: 2, name: 'Рис отварной', calories: 130, protein: 2.7, fats: 0.3, carbs: 28.2 },
            { id: 3, name: 'Гречка отварная', calories: 110, protein: 4.2, fats: 1.3, carbs: 21.3 },
            { id: 4, name: 'Яйцо куриное', calories: 157, protein: 12.7, fats: 11.5, carbs: 0.7 },
            { id: 5, name: 'Овсяная каша', calories: 88, protein: 3, fats: 1.7, carbs: 15 },
            { id: 6, name: 'Банан', calories: 96, protein: 1.5, fats: 0.2, carbs: 21 },
            { id: 7, name: 'Яблоко', calories: 52, protein: 0.4, fats: 0.4, carbs: 11.8 },
            { id: 8, name: 'Творог 5%', calories: 121, protein: 16, fats: 5, carbs: 1.8 },
            { id: 9, name: 'Молоко 2.5%', calories: 52, protein: 2.8, fats: 2.5, carbs: 4.7 },
            { id: 10, name: 'Хлеб белый', calories: 265, protein: 7.6, fats: 2.9, carbs: 50.1 },
            { id: 11, name: 'Макароны отварные',calories: 120, protein: 4, fats: 6, carbs: 24 },
            { id: 12, name: 'Шоколад черный 70%',calories: 560, protein: 8.5, fats: 42, carbs: 33 },
            { id: 13, name: 'Колбаса докторская',calories: 257, protein: 12.8, fats: 22.2, carbs: 1.5 },
            { id: 14, name: 'Чипсы Lays',calories: 510, protein: 6, fats: 30, carbs: 52 },
            { id: 15, name: 'Картофельное пюре',calories: 74, protein: 2.2, fats: 3.5, carbs: 13 },
            { id: 16, name: 'Огурцы свежие',calories: 15, protein: 0.7, fats: 0.1, carbs: 3 },
            { id: 17, name: 'Помидоры Свежие',calories: 20, protein: 1, fats: 0.2, carbs: 3.2 },
            { id: 18, name: 'Майонез 67%',calories: 620, protein: 1.6, fats: 67, carbs: 2.7 }
        ];
        localStorage.setItem('products', JSON.stringify(products));
    }

    const savedNorms = localStorage.getItem('norms');
    if (savedNorms) {
        norms = JSON.parse(savedNorms);
    }

    const savedProfile = localStorage.getItem('profile');
    if (savedProfile) {
        const profile = JSON.parse(savedProfile);
        document.getElementById('gender').value = profile.gender;
        document.getElementById('age').value = profile.age;
        document.getElementById('weight').value = profile.weight;
        document.getElementById('height').value = profile.height;
    }

    loadDailyIntake();
}

function loadDailyIntake() {
    const saved = localStorage.getItem('dailyIntake');
    dailyIntake = saved ? JSON.parse(saved) : {};

    const today = getToday();
    if (!dailyIntake[today]) {
        dailyIntake[today] = {
            foods: [],
            water: 0
        };
    }
}

function saveDailyIntake() {
    localStorage.setItem('dailyIntake', JSON.stringify(dailyIntake));
}

function getToday() {
    return new Date().toISOString().split('T')[0];
}

function switchTab(index) {
    const tabs = document.querySelectorAll('.tab');
    const contents = document.querySelectorAll('.tab-content');

    tabs.forEach(t => t.classList.remove('active'));
    contents.forEach(c => c.classList.remove('active'));

    tabs[index].classList.add('active');
    contents[index].classList.add('active');

    if (index === 2) updateTodayView();
    if (index === 3) loadHistory();
}

function calculateNorms() {
    const gender = document.getElementById('gender').value;
    const age = parseInt(document.getElementById('age').value);
    const weight = parseFloat(document.getElementById('weight').value);
    const height = parseFloat(document.getElementById('height').value);

    if (isNaN(age) || isNaN(weight) || isNaN(height)) {
        alert('Пожалуйста, заполните все поля профиля!');
        return;
    }

    let bmr;
    if (gender === 'male') {
        bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
        bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }

    norms.calories = Math.round(bmr * 1.55);
    norms.protein = Math.round(weight * 1.5);
    norms.fats = Math.round(weight * 1);
    norms.carbs = Math.round((norms.calories - (norms.protein * 4 + norms.fats * 9)) / 4);
    norms.water = Math.round(weight * 30);

    localStorage.setItem('norms', JSON.stringify(norms));
    localStorage.setItem('profile', JSON.stringify({ gender, age, weight, height }));

    updateDashboard();
    alert('Нормы успешно рассчитаны!');
}

function addProduct() {
    const name = document.getElementById('productName').value.trim();
    const calories = parseFloat(document.getElementById('productCalories').value);
    const protein = parseFloat(document.getElementById('productProtein').value) || 0;
    const fats = parseFloat(document.getElementById('productFats').value) || 0;
    const carbs = parseFloat(document.getElementById('productCarbs').value) || 0;

    if (!name || isNaN(calories)) {
        alert('Заполните название и калорийность продукта!');
        return;
    }

    products.push({
        id: Date.now(),
        name,
        calories,
        protein,
        fats,
        carbs
    });

    localStorage.setItem('products', JSON.stringify(products));

    document.getElementById('productName').value = '';
    document.getElementById('productCalories').value = '';
    document.getElementById('productProtein').value = '';
    document.getElementById('productFats').value = '';
    document.getElementById('productCarbs').value = '';

    updateProductsList();
    updateFoodSelect();
}

function deleteProduct(id) {
    if (confirm('Удалить этот продукт?')) {
        products = products.filter(p => p.id !== id);
        localStorage.setItem('products', JSON.stringify(products));
        updateProductsList();
        updateFoodSelect();
    }
}

function updateProductsList() {
    const list = document.getElementById('productsList');
    list.innerHTML = '';

    if (products.length === 0) {
        list.innerHTML = '<p style="text-align: center; color: #6c757d; padding: 20px;">Продукты не добавлены</p>';
        return;
    }

    products.forEach(p => {
        const div = document.createElement('div');
        div.className = 'product-item';
        div.innerHTML = `
            <div class="product-info">
                <div class="product-name">${p.name}</div>
                <div class="product-details">
                    Калории: ${p.calories} | Б: ${p.protein}г | Ж: ${p.fats}г | У: ${p.carbs}г (на 100г)
                </div>
            </div>
            <button class="delete-btn" onclick="deleteProduct(${p.id})">Удалить</button>
        `;
        list.appendChild(div);
    });
}

function updateFoodSelect() {
    const select = document.getElementById('foodSelect');
    select.innerHTML = '<option value="">Выберите продукт</option>';

    products.forEach(p => {
        const option = document.createElement('option');
        option.value = p.id;
        option.textContent = p.name;
        select.appendChild(option);
    });
}

function addFood() {
    const productId = parseInt(document.getElementById('foodSelect').value);
    const amount = parseFloat(document.getElementById('foodAmount').value);

    if (!productId || isNaN(amount) || amount <= 0) {
        alert('Выберите продукт и укажите количество!');
        return;
    }

    const product = products.find(p => p.id === productId);
    if (!product) {
        alert('Продукт не найден!');
        return;
    }

    const today = getToday();
    dailyIntake[today].foods.push({
        ...product,
        amount,
        time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
    });

    saveDailyIntake();
    updateDashboard();
    document.getElementById('foodAmount').value = '100';
}

function addWater() {
    const amount = parseFloat(document.getElementById('waterAmount').value);

    if (isNaN(amount) || amount <= 0) {
        alert('Укажите количество воды!');
        return;
    }

    const today = getToday();
    dailyIntake[today].water += amount;

    saveDailyIntake();
    updateDashboard();
    document.getElementById('waterAmount').value = '250';
}

function updateDashboard() {
    const today = getToday();
    const data = dailyIntake[today] || { foods: [], water: 0 };

    let totalCalories = 0;
    let totalProtein = 0;
    let totalFats = 0;
    let totalCarbs = 0;

    data.foods.forEach(f => {
        const k = f.amount / 100;
        totalCalories += f.calories * k;
        totalProtein += f.protein * k;
        totalFats += f.fats * k;
        totalCarbs += f.carbs * k;
    });

    updateBar('calories', totalCalories, norms.calories, 'ккал');
    updateBar('protein', totalProtein, norms.protein, 'г');
    updateBar('fats', totalFats, norms.fats, 'г');
    updateBar('carbs', totalCarbs, norms.carbs, 'г');
    updateBar('water', data.water, norms.water, 'мл');

    document.getElementById('caloriesNorm').textContent = norms.calories;
    document.getElementById('proteinNorm').textContent = norms.protein;
    document.getElementById('fatsNorm').textContent = norms.fats;
    document.getElementById('carbsNorm').textContent = norms.carbs;
    document.getElementById('waterNorm').textContent = norms.water;

    document.getElementById('caloriesEaten').textContent = Math.round(totalCalories);
    document.getElementById('proteinEaten').textContent = Math.round(totalProtein);
    document.getElementById('fatsEaten').textContent = Math.round(totalFats);
    document.getElementById('carbsEaten').textContent = Math.round(totalCarbs);
    document.getElementById('waterDrank').textContent = data.water;
}

function updateBar(name, current, norm, unit) {
    const bar = document.getElementById(name + 'Bar');
    const percent = Math.min((current / norm) * 100, 150); // Увеличиваем до 150% для отображения

    bar.style.width = Math.min(percent, 100) + '%';
    bar.textContent = `${Math.round(current)} / ${norm} ${unit}`;

    // Скрываем текст если процент меньше 5%
    if (percent < 5) {
        bar.style.opacity = '0';
    } else {
        bar.style.opacity = '1';
    }

    
    if (percent >= 90 && percent <= 120) {
        bar.className = 'progress-fill green';
    } else if (percent > 120) {
        bar.className = 'progress-fill orange';
    } else {
        bar.className = 'progress-fill red';
    }
}

function updateTodayView() {
    const today = getToday();
    const data = dailyIntake[today] || { foods: [], water: 0 };

    let totalCalories = 0;
    let totalProtein = 0;
    let totalFats = 0;
    let totalCarbs = 0;

    data.foods.forEach(f => {
        const k = f.amount / 100;
        totalCalories += f.calories * k;
        totalProtein += f.protein * k;
        totalFats += f.fats * k;
        totalCarbs += f.carbs * k;
    });

    document.getElementById('todayCalories').textContent = Math.round(totalCalories);
    document.getElementById('todayProtein').textContent = Math.round(totalProtein);
    document.getElementById('todayFats').textContent = Math.round(totalFats);
    document.getElementById('todayCarbs').textContent = Math.round(totalCarbs);
    document.getElementById('todayWater').textContent = data.water;

    const list = document.getElementById('todayList');
    list.innerHTML = '';

    if (data.foods.length === 0) {
        list.innerHTML = '<p style="text-align: center; color: #6c757d; padding: 20px;">Сегодня еще ничего не съедено</p>';
        return;
    }

    data.foods.forEach((f, i) => {
        const k = f.amount / 100;
        const div = document.createElement('div');
        div.className = 'product-item';
        div.innerHTML = `
            <div class="product-info">
                <div class="product-name">${f.name} - ${f.amount}г (${f.time})</div>
                <div class="product-details">
                    К: ${Math.round(f.calories * k)} | 
                    Б: ${Math.round(f.protein * k)}г | 
                    Ж: ${Math.round(f.fats * k)}г | 
                    У: ${Math.round(f.carbs * k)}г
                </div>
            </div>
            <button class="delete-btn" onclick="removeFoodFromToday(${i})">Удалить</button>
        `;
        list.appendChild(div);
    });
}

function loadHistory() {
    const date = document.getElementById('historyDate').value;
    const data = dailyIntake[date] || { foods: [], water: 0 };

    let totalCalories = 0;
    let totalProtein = 0;
    let totalFats = 0;
    let totalCarbs = 0;

    data.foods.forEach(f => {
        const k = f.amount / 100;
        totalCalories += f.calories * k;
        totalProtein += f.protein * k;
        totalFats += f.fats * k;
        totalCarbs += f.carbs * k;
    });

    document.getElementById('historyCalories').textContent = Math.round(totalCalories);
    document.getElementById('historyProtein').textContent = Math.round(totalProtein);
    document.getElementById('historyFats').textContent = Math.round(totalFats);
    document.getElementById('historyCarbs').textContent = Math.round(totalCarbs);
    document.getElementById('historyWater').textContent = data.water;

    const list = document.getElementById('historyList');
    list.innerHTML = '';

    if (data.foods.length === 0 && data.water === 0) {
        list.innerHTML = '<p style="text-align: center; color: #6c757d; padding: 20px;">За выбранный день нет данных</p>';
        return;
    }

    data.foods.forEach(f => {
        const k = f.amount / 100;
        const div = document.createElement('div');
        div.className = 'product-item';
        div.innerHTML = `
            <div class="product-info">
                <div class="product-name">${f.name} - ${f.amount}г (${f.time})</div>
                <div class="product-details">
                    К: ${Math.round(f.calories * k)} | 
                    Б: ${Math.round(f.protein * k)}г | 
                    Ж: ${Math.round(f.fats * k)}г | 
                    У: ${Math.round(f.carbs * k)}г
                </div>
            </div>
        `;
        list.appendChild(div);
    });

    if (data.water > 0) {
        const waterDiv = document.createElement('div');
        waterDiv.className = 'product-item';
        waterDiv.innerHTML = `
            <div class="product-info">
                <div class="product-name">Вода</div>
                <div class="product-details">Выпито: ${data.water} мл</div>
            </div>
        `;
        list.appendChild(waterDiv);
    }
}

function removeFoodFromToday(index) {
    const today = getToday();
    const data = dailyIntake[today];
    
    if (data && data.foods && data.foods[index]) {
        data.foods.splice(index, 1);
        
        saveDailyIntake();
        
        updateDashboard();
        updateTodayView();
    }
}

window.addEventListener('DOMContentLoaded', init);