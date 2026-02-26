let currentSlideIndex = 0;
const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.dot');

function showSlide(index) {
    if (index >= slides.length) currentSlideIndex = 0;
    if (index < 0) currentSlideIndex = slides.length - 1;

    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));

    slides[currentSlideIndex].classList.add('active');
    dots[currentSlideIndex].classList.add('active');
}

document.querySelector('.next-btn').addEventListener('click', () => {
    currentSlideIndex++;
    showSlide(currentSlideIndex);
});

document.querySelector('.prev-btn').addEventListener('click', () => {
    currentSlideIndex--;
    showSlide(currentSlideIndex);
});

function currentSlide(index) {
    currentSlideIndex = index;
    showSlide(currentSlideIndex);
}

// Otomatik geçiş (İsteğe bağlı, şu an 5 saniyede bir geçiyor)
setInterval(() => {
    currentSlideIndex++;
    showSlide(currentSlideIndex);
}, 5000);




// --- TAM EKRAN ARAMA İŞLEMLERİ ---
const openSearchBtn = document.getElementById('openSearch');
const closeSearchBtn = document.getElementById('closeSearch');
const searchOverlay = document.getElementById('searchOverlay');
const searchInput = document.getElementById('searchInput');

// Büyüteç butonuna tıklandığında ekranı aç
openSearchBtn.addEventListener('click', (e) => {
    e.preventDefault(); // Sayfanın en yukarı zıplamasını engeller
    searchOverlay.classList.add('active');
    
    // Ekran açıldıktan hemen sonra imleci otomatik olarak kutunun içine koy (kullanıcı deneyimi!)
    setTimeout(() => {
        searchInput.focus();
    }, 100); 
});

// Çarpı butonuna tıklandığında ekranı kapat
closeSearchBtn.addEventListener('click', () => {
    searchOverlay.classList.remove('active');
    searchInput.value = ''; // Kapatınca içindeki yazıyı temizle
});

// Kullanıcı siyah çerçevenin dışına (boşluğa) tıklarsa ekranı kapat
searchOverlay.addEventListener('click', (e) => {
    if(e.target === searchOverlay) {
        searchOverlay.classList.remove('active');
    }
});

// Klavye Dostu: ESC tuşuna basıldığında ekranı kapat
document.addEventListener('keydown', (e) => {
    if(e.key === 'Escape' && searchOverlay.classList.contains('active')) {
        searchOverlay.classList.remove('active');
    }
});



// --- SEPET ÇEKMECESİ İŞLEMLERİ ---
const openCartBtn = document.getElementById('openCart');
const closeCartBtn = document.getElementById('closeCart');
const cartSidebar = document.getElementById('cartSidebar');
const cartOverlay = document.getElementById('cartOverlay');

// Sepet İkonuna Tıklanınca Aç
openCartBtn.addEventListener('click', (e) => {
    e.preventDefault(); // Sayfanın başına zıplamayı önler
    cartSidebar.classList.add('active');
    cartOverlay.classList.add('active');
    
    // Eğer Arama ekranı açıksa onu kapat ki üst üste binmesinler
    const searchOverlay = document.getElementById('searchOverlay');
    if(searchOverlay && searchOverlay.classList.contains('active')) {
        searchOverlay.classList.remove('active');
    }
});

// Çarpı Butonuna Tıklanınca Kapat
closeCartBtn.addEventListener('click', () => {
    cartSidebar.classList.remove('active');
    cartOverlay.classList.remove('active');
});

// Siyah Boşluğa (Overlay) Tıklanınca Kapat
cartOverlay.addEventListener('click', () => {
    cartSidebar.classList.remove('active');
    cartOverlay.classList.remove('active');
});



// --- SEPET İÇİ ETKİLEŞİMLER (Artırma, Azaltma ve Silme) ---
const cartItemsContainer = document.querySelector('.cart-items');

cartItemsContainer.addEventListener('click', (e) => {
    
    // 1. ÜRÜN SİLME İŞLEMİ
    // closest() metodu sayesinde kullanıcı çöp kutusu ikonuna da bassa, butonun kendisine de bassa algılarız
    const removeBtn = e.target.closest('.remove-item');
    
    
    if (removeBtn) {
        // Sil butonunu barındıran en yakın 'cart-item' kutusunu bul ve HTML'den tamamen yok et
        const itemToRemove = removeBtn.closest('.cart-item');
        
        // Şık bir silinme animasyonu (İsteğe bağlı, direkt itemToRemove.remove() da yapılabilir)
        itemToRemove.style.transition = "opacity 0.3s ease, transform 0.3s ease";
        itemToRemove.style.opacity = "0";
        itemToRemove.style.transform = "translateX(20px)"; // Sağa doğru kayarak kaybolur
        
        setTimeout(() => {
            itemToRemove.remove();
        }, 300); // 300 milisaniye sonra elementi sil
        return; // Silme işlemi yapıldıysa alttaki kodları çalıştırma
        // Önceki artırma/azaltma işlemlerinden sonra bu iki satırı ekle ki fiyat/sayı anında güncellensin:
       
    }

    // 2. ADET ARTIRMA / AZALTMA İŞLEMİ
    // Tıklanan şeyin sınıfında 'qty-btn' var mı diye kontrol ediyoruz
    if (e.target.classList.contains('qty-btn')) {
        const btn = e.target;
        // Tıklanan butonun hemen yanındaki input (<input type="text">) kutusunu buluyoruz
        const input = btn.parentElement.querySelector('input');
        let currentValue = parseInt(input.value); // İçindeki sayıyı matematiğe çeviriyoruz

        if (btn.textContent === '+') {
            // Artı tuşuna basıldıysa sayıyı 1 artır
            input.value = currentValue + 1;
        } 
        else if (btn.textContent === '-') {
            // Eksi tuşuna basıldıysa ve sayı 1'den büyükse sayıyı 1 azalt
            // (1'in altına düşüp 0 veya eksi olmasını engelliyoruz)
            if (currentValue > 1) {
                input.value = currentValue - 1;
            }
        }
    }
});



// --- SEPETE ÜRÜN EKLEME (ADD TO CART) MOTORU ---
const addToCartButtons = document.querySelectorAll('.add-to-cart');
const cartCountBadge = document.querySelector('.cart-count');
const cartTotalElement = document.querySelector('.cart-total span:nth-child(2)');

// Sayfadaki tüm "Sepete Ekle" butonlarını dinle
addToCartButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        // Tıklanan butonun içindeki bulunduğu "ürün kartını" (product-card) bul
        const card = e.target.closest('.product-card');
        
        // Ürünün bilgilerini kartın içinden çek
        const title = card.querySelector('.product-name').innerText;
        const price = card.querySelector('.product-price').innerText;
        const imgSrc = card.querySelector('.product-img').src; // img etiketindeki class'ı yakalar

        // Sepete ekleme fonksiyonunu çalıştır
        addItemToCart(title, price, imgSrc);
        
        // Sepet toplamını ve sağ üstteki sayıyı güncelle
        updateCartTotal();
        updateCartBadge();
        
        // Kullanıcıya sepete eklendiğini göstermek için sepet çekmecesini otomatik aç (Çok havalı bir detay!)
        document.getElementById('cartSidebar').classList.add('active');
        document.getElementById('cartOverlay').classList.add('active');
    });
});

// Sepete Ürün Ekleme veya Adet Artırma Fonksiyonu
function addItemToCart(title, price, imgSrc) {
    // 1. KONTROL: Bu ürün zaten sepette var mı?
    const cartItemNames = cartItemsContainer.querySelectorAll('.cart-item-info h4');
    for (let i = 0; i < cartItemNames.length; i++) {
        if (cartItemNames[i].innerText === title) {
            // Ürün zaten varsa, sadece adedini (input value) 1 artır ve çık
            let quantityInput = cartItemNames[i].parentElement.querySelector('.cart-item-quantity input');
            quantityInput.value = parseInt(quantityInput.value) + 1;
            return; 
        }
    }

    // 2. YENİ ÜRÜN: Eğer sepette yoksa, yepyeni bir sepet satırı oluştur
    const cartRow = document.createElement('div');
    cartRow.classList.add('cart-item');
    
    // HTML şablonumuzu oluşturuyoruz
    const cartRowContents = `
        <img src="${imgSrc}" alt="${title}" class="cart-item-img">
        <div class="cart-item-info">
            <h4>${title}</h4>
            <p class="cart-item-price">${price}</p>
            <div class="cart-item-quantity">
                <button class="qty-btn">-</button>
                <input type="text" value="1" readonly>
                <button class="qty-btn">+</button>
            </div>
        </div>
        <button class="remove-item"><i class="fas fa-trash-alt"></i></button>
    `;
    
    // Şablonu kutuya yerleştir ve sepetin en altına ekle
    cartRow.innerHTML = cartRowContents;
    cartItemsContainer.append(cartRow);
}

// Sepetteki Farklı Ürün Sayısını (Rozeti) Güncelleyen Fonksiyon
function updateCartBadge() {
    const itemsCount = cartItemsContainer.querySelectorAll('.cart-item').length;
    cartCountBadge.innerText = itemsCount;
}

// Sepet Toplam Tutarını (Ara Toplam) Hesaplayan Fonksiyon
function updateCartTotal() {
    const cartItems = cartItemsContainer.querySelectorAll('.cart-item');
    let total = 0;
    
    cartItems.forEach(item => {
        const priceElement = item.querySelector('.cart-item-price');
        const quantityElement = item.querySelector('.cart-item-quantity input');
        
        // "₺ 2,650.00" yazısını matematiğe çevirmek için temizle (₺ ve virgülü at)
        let priceText = priceElement.innerText.replace('₺', '').replace(',', '').trim();
        let price = parseFloat(priceText);
        let quantity = parseInt(quantityElement.value);
        
        total += (price * quantity); // Fiyat ile adedi çarpıp toplama ekle
    });
    
    // Çıkan sonucu "₺ 1,250.00" formatında tekrar ekrana yazdır
    cartTotalElement.innerText = '₺ ' + total.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}




// ==========================================
// SIKÇA SORULAN SORULAR (AKORDEON) İŞLEMİ
// ==========================================
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
    const questionButton = item.querySelector('.faq-question');
    
    // Güvenlik kontrolü: Eğer sayfada FAQ yoksa bu kodu atla
    if(questionButton) {
        questionButton.addEventListener('click', () => {
            
            // Eğer tıklanan soru zaten açıksa, sadece onu kapat
            const isOpen = item.classList.contains('active');
            
            // Önce tüm soruların 'active' sınıfını kaldır (hepsini kapat)
            faqItems.forEach(otherItem => {
                otherItem.classList.remove('active');
            });

            // Eğer tıklanan soru kapalıysa, onu aç
            if (!isOpen) {
                item.classList.add('active');
            }
        });
    }
});











