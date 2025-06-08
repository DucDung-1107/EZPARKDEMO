document.addEventListener('DOMContentLoaded', () => {

    // --- LOGIC CHUNG ---
    const allPages = document.querySelectorAll('.page');
    const navLinks = document.querySelectorAll('.nav-link');
    const allModals = document.querySelectorAll('.modal-overlay');
    const mainContent = document.querySelector('main');

    // --- LOGIC CHUYỂN TRANG (SPA) ---
    function showPage(pageId) {
        allPages.forEach(page => page.classList.remove('active'));
        navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${pageId}`));
        const targetPage = document.getElementById(pageId);
        if (targetPage) targetPage.classList.add('active');
        window.scrollTo(0, 0); // Cuộn lên đầu trang khi chuyển trang
    }

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const pageId = link.getAttribute('href').substring(1);
            showPage(pageId);
        });
    });
    showPage('booking-page'); // Trang mặc định

    // --- LOGIC MỞ/ĐÓNG MODAL ---
    function showModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) modal.classList.remove('hidden');
    }
    allModals.forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal || e.target.closest('.close-modal-btn')) {
                modal.classList.add('hidden');
            }
        });
    });

    // --- LOGIC XÁC THỰC NGƯỜI DÙNG ---
    const authButtons = document.querySelector('.auth-buttons');
    const userProfile = document.getElementById('user-profile');
    const authModal = document.getElementById('auth-modal');
    document.getElementById('login-btn').addEventListener('click', () => {
        authModal.querySelector('#modal-title').textContent = 'Đăng nhập';
        showModal('auth-modal');
    });
    document.getElementById('register-btn').addEventListener('click', () => {
        authModal.querySelector('#modal-title').textContent = 'Đăng ký';
        showModal('auth-modal');
    });
    document.getElementById('modal-form').addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Thực hiện thành công!');
        authModal.classList.add('hidden');
        authButtons.classList.add('hidden');
        userProfile.classList.remove('hidden');
    });

    // --- LOGIC TRANG ĐẶT CHỖ (BOOKING) ---
    const bookingOptions = document.querySelector('.booking-options');
    if (bookingOptions) {
        bookingOptions.addEventListener('click', (e) => {
            if (e.target.classList.contains('option-btn')) {
                bookingOptions.querySelectorAll('.option-btn').forEach(btn => btn.classList.remove('active'));
                e.target.classList.add('active');
            }
        });
    }
    document.querySelector('.booking-form').addEventListener('submit', (e) => {
        e.preventDefault();
        // Ẩn form và các gợi ý, hiển thị kết quả tìm kiếm
        document.getElementById('booking-form-container').style.display = 'none';
        document.querySelector('.additional-booking-info').style.display = 'none';
        
        const resultsContainer = document.getElementById('booking-results-container');
        resultsContainer.innerHTML = `<h2>Kết quả cho "Hồ Gươm"</h2><div class="result-card"><div class="result-info"><h4>Bãi đỗ xe Trần Nhật Duật</h4><p>10 phút đi bộ</p></div><div class="result-price"><span class="price">20.000đ</span>/giờ<button class="btn btn-primary payment-btn">Chọn & Thanh toán</button></div></div>`;
        resultsContainer.classList.remove('hidden');
    });
    
    // Sử dụng event delegation cho toàn bộ trang để xử lý các nút được thêm vào sau
    mainContent.addEventListener('click', e => {
        // Nút thanh toán trong kết quả tìm kiếm
        if (e.target.classList.contains('payment-btn')) {
            showModal('qr-modal');
        }
        // Nút "Đặt lại" trong Lịch sử đặt chỗ
        if (e.target.closest('.recent-item .btn-secondary')) {
            alert('Đặt lại thành công! Chi tiết đã được gửi đến bạn.');
        }
        // Nút "Đặt ngay" trong Gợi ý gần bạn
        if (e.target.closest('.recommendation-card .btn-primary')) {
            showModal('qr-modal');
        }
    });


    // --- LOGIC TRANG CHIA SẺ (SHARE) ---
    const tabContainer = document.querySelector('.share-tabs');
    if (tabContainer) {
        tabContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('tab-link')) {
                const tabId = e.target.dataset.tab;
                tabContainer.querySelectorAll('.tab-link').forEach(link => link.classList.remove('active'));
                e.target.classList.add('active');
                document.querySelectorAll('.tab-content').forEach(content => content.classList.toggle('active', content.id === tabId));
            }
        });
    }
    document.querySelector('.share-form').addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Đăng ký thành công, chúng tôi sẽ liên lạc với bạn trong 24h tới.');
        e.target.reset();
    });

    // --- LOGIC TRANG EZBOT ---
    const ezbotSendBtn = document.getElementById('ezbot-send-btn');
    const ezbotChatInput = document.getElementById('ezbot-chat-input');
    const ezbotChatBody = document.getElementById('ezbot-chat-body');
    function handleEzbotSend() {
        const userMessage = ezbotChatInput.value.trim();
        if (userMessage === '') return;
        appendEzbotMessage(userMessage, 'user');
        ezbotChatInput.value = '';
        setTimeout(() => getBotResponse(userMessage), 1000);
    }
    function appendEzbotMessage(message, sender) {
        const msgEl = document.createElement('div');
        msgEl.className = `chat-message ${sender}`;
        msgEl.innerHTML = `<p>${message}</p>`;
        ezbotChatBody.appendChild(msgEl);
        ezbotChatBody.scrollTop = ezbotChatBody.scrollHeight;
    }
    function getBotResponse(userInput) {
        const lowerInput = userInput.toLowerCase();
        let response = "Xin lỗi, tôi chưa hiểu câu hỏi của bạn.";
        if (lowerInput.includes("Đỗ ở đây có được không")) {
            response = "Đây là biển cấm đỗ xe ngày chẵn, dựa vào thông tin ngày hôm nay 7/5/2025 thì bạn <b>không được đỗ xe ở đây</b>. Muốn tôi tìm chỗ đỗ xe cho bạn không?";
        } else if (lowerInput.includes("Xe tôi xe VinFast VF3, nhà có trẻ nhỏ và mẹ bầu, muốn đi chơi hồ gươm thì đỗ ở đâu hợp lý?")) {
            response = `Tuyệt vời! Dưới đây là một vài gợi ý:<ul><li><b>Bãi đỗ xe cao tầng Trần Nhật Duật (20K)</b>: 10-15 phút đi bộ.</li><li><b>Bãi đỗ xe trên đường Trần Quang Khải (25-30k)</b>: 5 phút đi bộ.</li><li><b>Bãi đỗ xe A15 (Shared, 15k)</b>: 10 phút đi bộ, cần liên hệ trước 30 phút.</li></ul>`;
        }
        appendEzbotMessage(response, 'bot');
    }
    ezbotSendBtn.addEventListener('click', handleEzbotSend);
    ezbotChatInput.addEventListener('keypress', e => { if (e.key === 'Enter') handleEzbotSend(); });

    // --- LOGIC TRANG CỘNG ĐỒNG (COMMUNITY) ---
    document.querySelector('.community-feed').addEventListener('click', (e) => {
        const likeBtn = e.target.closest('.like-btn');
        if (likeBtn) {
            const likeCountSpan = likeBtn.closest('.post-card').querySelector('.like-count');
            let count = parseInt(likeCountSpan.textContent);
            likeBtn.classList.toggle('liked');
            if (likeBtn.classList.contains('liked')) {
                likeBtn.innerHTML = '<i class="fa-solid fa-thumbs-up"></i> Đã thích';
                count++;
            } else {
                likeBtn.innerHTML = '<i class="fa-regular fa-thumbs-up"></i> Thích';
                count--;
            }
            likeCountSpan.textContent = count;
        }
    });

    // --- LOGIC TRANG EZGAME ---
    const wheel = document.getElementById('lucky-wheel');
    const spinBtn = document.getElementById('spin-btn');
    const waterPlantBtn = document.getElementById('water-plant-btn');
    const plantLevelSpan = document.querySelector('.plant-level');
    const ezpBalanceEl = document.querySelector('#wallet-page .wallet-balance:nth-of-type(2) h3');

    // Vòng quay may mắn
    if (spinBtn && wheel) {
        let currentRotation = 0;
        spinBtn.addEventListener('click', () => {
            if (spinBtn.disabled) return;
            spinBtn.disabled = true;
            const randomSpins = Math.floor(Math.random() * 5) + 5;
            const randomSegment = Math.floor(Math.random() * 8);
            const finalAngle = (randomSpins * 360) + (randomSegment * 45);
            currentRotation += finalAngle;
            wheel.style.transform = `rotate(${currentRotation}deg)`;
            setTimeout(() => {
                const prizes = ["Miễn phí", "+100 EZP", "Giảm 50%", "Thêm lượt", "Giảm 25%", "+50 EZP", "JACKPOT", "Rất tiếc"];
                const prizeIndex = Math.floor(((360 - (currentRotation % 360) + 22.5) % 360) / 45);
                alert(`Chúc mừng! Bạn đã trúng: ${prizes[prizeIndex]}`);
                spinBtn.disabled = false;
            }, 5000); // Thời gian phải khớp với transition trong CSS
        });
    }

    // Game Tưới cây
    if (waterPlantBtn && plantLevelSpan && ezpBalanceEl) {
        waterPlantBtn.addEventListener('click', () => {
            // Lấy cấp độ hiện tại từ text
            let levelText = plantLevelSpan.textContent;
            let currentLevel = parseInt(levelText.split(':')[1].split('/')[0]);
            
            if (currentLevel >= 10) return; // Không làm gì nếu cây đã lớn tối đa

            // Tăng cấp độ
            currentLevel++;
            plantLevelSpan.textContent = `Cấp độ: ${currentLevel}/10`;

            // Cập nhật điểm EZP
            let currentPointsText = ezpBalanceEl.textContent;
            let currentPoints = parseInt(currentPointsText.replace(/[^0-9]/g, ''));
            currentPoints += 10;
            const newPointsText = currentPoints.toLocaleString('vi-VN');
            ezpBalanceEl.innerHTML = `<i class="fa-solid fa-star"></i> ${newPointsText} EZP`;
            
            alert('Tưới cây thành công! Bạn nhận được +10 EZP.');

            // Nếu cây đạt cấp tối đa
            if (currentLevel === 10) {
                waterPlantBtn.disabled = true;
                waterPlantBtn.innerHTML = '<i class="fa-solid fa-tree"></i> Cây đã lớn';
                setTimeout(() => alert('Chúc mừng! Cây của bạn đã trưởng thành!'), 200);
            }
        });
    }
});
