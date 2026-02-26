// ==========================================
// GİRİŞ YAP / KAYIT OL SEKME DEĞİŞTİRİCİ
// ==========================================
const loginToggle = document.getElementById('loginToggle');
const registerToggle = document.getElementById('registerToggle');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');

// Sadece bu elemanlar sayfada varsa (yani login.html sayfasındaysak) çalıştır
if (loginToggle && registerToggle) {
    
    // Kayıt Ol'a Tıklanınca
    registerToggle.addEventListener('click', () => {
        registerToggle.classList.add('active');
        loginToggle.classList.remove('active');
        
        registerForm.classList.add('active');
        loginForm.classList.remove('active');
    });

    // Giriş Yap'a Tıklanınca
    loginToggle.addEventListener('click', () => {
        loginToggle.classList.add('active');
        registerToggle.classList.remove('active');
        
        loginForm.classList.add('active');
        registerForm.classList.remove('active');
    });
}