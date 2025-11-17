// Simulated real-time data
let wasteData = {
    totalWaste: 123,
    wasteLevel: 45,
    waterTemp: 28,
    phLevel: 7.2,
    turbidity: 12,
    waterFlow: 2.5,
    humidity: 75,
    plasticWaste: 45,
    bagWaste: 32,
    packageWaste: 28,
    otherWaste: 18
};

let chartData = {
    labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
    data: [30, 35, 40, 42, 45, 45]
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    startRealTimeUpdates();
    setupFormHandlers();
    setupNavigation();
});

// Initialize application
function initializeApp() {
    updateDashboard();
    createWasteChart();
    showWelcomeNotification();
}

// Update dashboard with real-time data
function updateDashboard() {
    // Update stats
    document.getElementById('total-waste').textContent = `${wasteData.totalWaste} kg`;
    document.getElementById('waste-level').textContent = `${wasteData.wasteLevel}%`;
    document.getElementById('water-temp').textContent = `${wasteData.waterTemp}°C`;
    document.getElementById('ph-level').textContent = wasteData.phLevel;
    
    // Update environmental data
    document.getElementById('turbidity').textContent = `${wasteData.turbidity} NTU`;
    document.getElementById('water-flow').textContent = `${wasteData.waterFlow} m/s`;
    document.getElementById('humidity').textContent = `${wasteData.humidity}%`;
    
    // Update waste categories
    document.getElementById('plastic-waste').textContent = `${wasteData.plasticWaste} kg`;
    document.getElementById('bag-waste').textContent = `${wasteData.bagWaste} kg`;
    document.getElementById('package-waste').textContent = `${wasteData.packageWaste} kg`;
    document.getElementById('other-waste').textContent = `${wasteData.otherWaste} kg`;
    
    // Update progress bar
    const progressBar = document.getElementById('wasteProgress');
    progressBar.style.width = `${wasteData.wasteLevel}%`;
    
    // Update timestamp
    updateLastUpdateTime();
    
    // Check thresholds
    checkWasteThreshold();
}

// Create waste level chart
function createWasteChart() {
    const canvas = document.getElementById('wasteChart');
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = 200;
    
    const width = canvas.width;
    const height = canvas.height;
    const padding = 40;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Draw background
    ctx.fillStyle = '#f0f9ff';
    ctx.fillRect(0, 0, width, height);
    
    // Draw grid lines
    ctx.strokeStyle = '#e0f2fe';
    ctx.lineWidth = 1;
    
    for (let i = 0; i <= 5; i++) {
        const y = padding + (chartHeight / 5) * i;
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(width - padding, y);
        ctx.stroke();
    }
    
    // Calculate points
    const points = chartData.data.map((value, index) => {
        const x = padding + (chartWidth / (chartData.data.length - 1)) * index;
        const y = padding + chartHeight - (value / 100) * chartHeight;
        return { x, y, value };
    });
    
    // Draw gradient fill
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, 'rgba(8, 145, 178, 0.3)');
    gradient.addColorStop(1, 'rgba(8, 145, 178, 0.05)');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.moveTo(points[0].x, height - padding);
    points.forEach(point => ctx.lineTo(point.x, point.y));
    ctx.lineTo(points[points.length - 1].x, height - padding);
    ctx.closePath();
    ctx.fill();
    
    // Draw line
    ctx.strokeStyle = '#0891b2';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    points.forEach(point => ctx.lineTo(point.x, point.y));
    ctx.stroke();
    
    // Draw points
    points.forEach((point, index) => {
        // Circle
        ctx.fillStyle = '#0891b2';
        ctx.beginPath();
        ctx.arc(point.x, point.y, 6, 0, Math.PI * 2);
        ctx.fill();
        
        // White inner circle
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(point.x, point.y, 3, 0, Math.PI * 2);
        ctx.fill();
        
        // Label
        ctx.fillStyle = '#075985';
        ctx.font = '12px Segoe UI';
        ctx.textAlign = 'center';
        ctx.fillText(chartData.labels[index], point.x, height - 10);
        
        // Value label
        ctx.fillStyle = '#0891b2';
        ctx.font = 'bold 11px Segoe UI';
        ctx.fillText(`${point.value}%`, point.x, point.y - 15);
    });
    
    // Draw y-axis labels
    ctx.fillStyle = '#075985';
    ctx.font = '11px Segoe UI';
    ctx.textAlign = 'right';
    for (let i = 0; i <= 5; i++) {
        const value = 100 - (i * 20);
        const y = padding + (chartHeight / 5) * i;
        ctx.fillText(`${value}%`, padding - 10, y + 4);
    }
}

// Start real-time updates
function startRealTimeUpdates() {
    // Simulate real-time data updates every 3 seconds
    setInterval(() => {
        // Simulate data changes
        wasteData.wasteLevel = Math.min(100, wasteData.wasteLevel + Math.random() * 2);
        wasteData.totalWaste = Math.round(wasteData.totalWaste + Math.random() * 0.5);
        wasteData.waterTemp = (27 + Math.random() * 2).toFixed(1);
        wasteData.phLevel = (7 + Math.random() * 0.5).toFixed(1);
        wasteData.turbidity = Math.round(10 + Math.random() * 5);
        wasteData.waterFlow = (2 + Math.random()).toFixed(1);
        wasteData.humidity = Math.round(70 + Math.random() * 10);
        
        // Update waste categories
        wasteData.plasticWaste = Math.round(wasteData.totalWaste * 0.37);
        wasteData.bagWaste = Math.round(wasteData.totalWaste * 0.26);
        wasteData.packageWaste = Math.round(wasteData.totalWaste * 0.23);
        wasteData.otherWaste = Math.round(wasteData.totalWaste * 0.14);
        
        // Update chart data
        chartData.data.shift();
        chartData.data.push(wasteData.wasteLevel);
        
        // Update display
        updateDashboard();
        createWasteChart();
    }, 3000);
}

// Update last update time
function updateLastUpdateTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    document.getElementById('last-update').textContent = `Diperbarui pada ${timeString}`;
}

// Check waste threshold and send notification
function checkWasteThreshold() {
    if (wasteData.wasteLevel > 80 && wasteData.wasteLevel <= 81) {
        showNotification(
            'Peringatan Kapasitas Tinggi!',
            `Level sampah mencapai ${wasteData.wasteLevel}%. Segera lakukan pembersihan.`,
            'warning'
        );
    } else if (wasteData.wasteLevel > 95 && wasteData.wasteLevel <= 96) {
        showNotification(
            'Darurat! Kapasitas Penuh',
            `Level sampah mencapai ${wasteData.wasteLevel}%. Sistem hampir penuh!`,
            'danger'
        );
    }
}

// Show notification
function showNotification(title, message, type = 'success') {
    const container = document.getElementById('notification-container');
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    const iconMap = {
        success: 'fa-check-circle',
        warning: 'fa-exclamation-triangle',
        danger: 'fa-exclamation-circle',
        info: 'fa-info-circle'
    };
    
    notification.innerHTML = `
        <div class="notification-header">
            <i class="fas ${iconMap[type] || iconMap.info}"></i>
            <span>${title}</span>
        </div>
        <div class="notification-body">${message}</div>
    `;
    
    container.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// Show welcome notification
function showWelcomeNotification() {
    setTimeout(() => {
        showNotification(
            'Selamat Datang di B-SMART',
            'Sistem monitoring aktif dan berjalan normal.',
            'success'
        );
    }, 1000);
}

// Setup form handlers
function setupFormHandlers() {
    const form = document.getElementById('pollution-form');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const location = document.getElementById('location').value;
        const category = document.getElementById('category').value;
        const details = document.getElementById('pollutionDetails').value;
        
        // Simulate report submission
        showNotification(
            'Laporan Berhasil Dikirim!',
            `Terima kasih telah melaporkan polusi di ${location}. Tim kami akan segera menindaklanjuti.`,
            'success'
        );
        
        // Update report stats
        const totalReports = document.getElementById('total-reports');
        totalReports.textContent = parseInt(totalReports.textContent) + 1;
        
        // Reset form
        form.reset();
        
        // Log to console (in production, send to backend)
        console.log('Laporan Polusi:', {
            location,
            category,
            details,
            timestamp: new Date().toISOString()
        });
    });
}

// Setup navigation
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links
            navLinks.forEach(l => l.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Smooth scroll to section
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 70;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Update active nav on scroll
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('.section');
        const scrollPos = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });
}

// Add slide out animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Console welcome message
console.log('%cB-SMART System', 'color: #0891b2; font-size: 24px; font-weight: bold;');
console.log('%cBubble System for Monitoring and Rubbish Trapping', 'color: #075985; font-size: 14px;');
console.log('%cDesa Pejagan, Bangkalan, Indonesia', 'color: #0e7490; font-size: 12px;');
