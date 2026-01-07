// Данные изображений для слайдера
const images = [
    {
        url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1350&q=80',
        title: 'Горный пейзаж'
    },
    {
        url: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1350&q=80',
        title: 'Лесная тропа'
    },
    {
        url: 'https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1350&q=80',
        title: 'Морской берег'
    },
    {
        url: 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1350&q=80',
        title: 'Осенний лес'
    },
    {
        url: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1350&q=80',
        title: 'Городской закат'
    }
];

// Элементы DOM
const slider = document.querySelector('.slider');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');
const currentImageElement = document.getElementById('current-image');
const totalImagesElement = document.getElementById('total-images');
const imageTitleElement = document.getElementById('image-title-text');
const navigationDots = document.querySelector('.navigation-dots');
const autoPlayToggle = document.getElementById('auto-play-toggle');
const speedSlider = document.getElementById('speed-slider');
const speedValue = document.getElementById('speed-value');

// Текущий индекс изображения
let currentImageIndex = 0;
let autoPlayInterval;
let isAutoPlayActive = false;
let slideSpeed = 5000; // 5 секунд по умолчанию

// Инициализация слайдера
function initSlider() {
    // Устанавливаем общее количество изображений
    totalImagesElement.textContent = images.length;
    
    // Создаем слайды
    images.forEach((image, index) => {
        // Создаем элемент изображения
        const slide = document.createElement('img');
        slide.classList.add('slide');
        slide.src = image.url;
        slide.alt = image.title;
        
        // Добавляем класс для анимации при первой загрузке
        if (index === 0) {
            slide.classList.add('fade-in');
        }
        
        slider.appendChild(slide);
        
        // Создаем точку навигации
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (index === 0) dot.classList.add('active');
        dot.dataset.index = index;
        
        dot.addEventListener('click', () => {
            goToSlide(index);
        });
        
        navigationDots.appendChild(dot);
    });
    
    // Обновляем отображение
    updateSlider();
    
    // Устанавливаем обработчики событий для кнопок
    prevBtn.addEventListener('click', showPrevSlide);
    nextBtn.addEventListener('click', showNextSlide);
    
    // Обработчики для клавиатуры
    document.addEventListener('keydown', handleKeyPress);
    
    // Обработчики для автопрокрутки
    autoPlayToggle.addEventListener('click', toggleAutoPlay);
    speedSlider.addEventListener('input', updateSlideSpeed);
    
    // Обновляем отображение скорости
    updateSpeedDisplay();
}

// Функция для показа следующего слайда
function showNextSlide() {
    currentImageIndex = (currentImageIndex + 1) % images.length;
    updateSlider();
}

// Функция для показа предыдущего слайда
function showPrevSlide() {
    currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
    updateSlider();
}

// Функция для перехода к конкретному слайду
function goToSlide(index) {
    currentImageIndex = index;
    updateSlider();
}
// Функция для обновления отображения слайдера
function updateSlider() {
    // Обновляем положение слайдера
    slider.style.transform = `translateX(-${currentImageIndex * 100}%)`;
    
    // Обновляем счетчик
    currentImageElement.textContent = currentImageIndex + 1;
    
    // Обновляем заголовок
    imageTitleElement.textContent = images[currentImageIndex].title;
    
    // Обновляем активную точку навигации
    document.querySelectorAll('.dot').forEach((dot, index) => {
        if (index === currentImageIndex) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
    
    // Добавляем анимацию к текущему слайду
    const currentSlide = document.querySelectorAll('.slide')[currentImageIndex];
    currentSlide.classList.add('fade-in');
    
    // Убираем анимацию у предыдущего слайда через некоторое время
    setTimeout(() => {
        currentSlide.classList.remove('fade-in');
    }, 500);
}

// Функция для обработки нажатия клавиш
function handleKeyPress(e) {
    if (e.key === 'ArrowLeft') {
        showPrevSlide();
    } else if (e.key === 'ArrowRight') {
        showNextSlide();
    } else if (e.key === ' ') {
        // Пробел для переключения автопрокрутки
        toggleAutoPlay();
        e.preventDefault(); // Предотвращаем прокрутку страницы
    }
}

// Функция для переключения автопрокрутки
function toggleAutoPlay() {
    isAutoPlayActive = !isAutoPlayActive;
    
    if (isAutoPlayActive) {
        startAutoPlay();
        autoPlayToggle.innerHTML = '<i class="fas fa-pause"></i> Пауза';
        autoPlayToggle.style.backgroundColor = '#e74c3c';
    } else {
        stopAutoPlay();
        autoPlayToggle.innerHTML = '<i class="fas fa-play"></i> Автопрокрутка';
        autoPlayToggle.style.backgroundColor = '#3498db';
    }
}

// Функция для запуска автопрокрутки
function startAutoPlay() {
    // Очищаем существующий интервал, если есть
    if (autoPlayInterval) {
        clearInterval(autoPlayInterval);
    }
    
    // Устанавливаем новый интервал
    autoPlayInterval = setInterval(showNextSlide, slideSpeed);
}

// Функция для остановки автопрокрутки
function stopAutoPlay() {
    if (autoPlayInterval) {
        clearInterval(autoPlayInterval);
        autoPlayInterval = null;
    }
}

// Функция для обновления скорости слайдов
function updateSlideSpeed() {
    // Конвертируем значение ползунка (1-10) в миллисекунды (2000-10000)
    slideSpeed = 11000 - (speedSlider.value * 1000);
    updateSpeedDisplay();
    
    // Если автопрокрутка активна, перезапускаем её с новой скоростью
    if (isAutoPlayActive) {
        stopAutoPlay();
        startAutoPlay();
    }
}

// Функция для обновления отображения скорости
function updateSpeedDisplay() {
    // Отображаем скорость в секундах
    const seconds = slideSpeed / 1000;
    speedValue.textContent = `${seconds.toFixed(1)}с`;
}

// Инициализируем слайдер при загрузке страницы
document.addEventListener('DOMContentLoaded', initSlider);