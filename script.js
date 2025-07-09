document.addEventListener('DOMContentLoaded', () => {
    // --- COMMON LOGIC ---
    const allPages = document.querySelectorAll('.page');
    const navLinks = document.querySelectorAll('.nav-link');
    const allModals = document.querySelectorAll('.modal-overlay');
    const mainContent = document.querySelector('main');
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const header = document.querySelector('header');

    /**
     * Shows a specific page and hides others.
     * Resets input fields on hidden pages.
     * @param {string} pageId - The ID of the page to show.
     */
    function showPage(pageId) {
        allPages.forEach(page => {
            page.classList.remove('active');
            // Reset input fields on pages that are being hidden
            const inputs = page.querySelectorAll('input, textarea');
            inputs.forEach(input => {
                if (input.type !== 'submit' && input.type !== 'button' && input.type !== 'hidden') {
                    input.value = '';
                }
            });
        });

        navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${pageId}`);
        });

        const targetPage = document.getElementById(pageId);
        if (targetPage) {
            targetPage.classList.add('active');
        } else {
            console.warn(`Page with ID '${pageId}' not found.`);
        }

        window.scrollTo(0, 0); // Scroll to top when changing pages
        closeAllModals(); // Close all modals when switching pages
        header.classList.remove('open'); // Close mobile menu if open
    }

    // Event listeners for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const pageId = link.getAttribute('href').substring(1);
            showPage(pageId);
        });
    });

    // Initial page load
    showPage('booking-page');

    // Mobile menu toggle
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', () => {
            header.classList.toggle('open');
        });
    }

    // --- MODAL LOGIC ---
    /**
     * Shows a specific modal.
     * @param {string} modalId - The ID of the modal to show.
     */
    function showModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('hidden');
            // Focus on the first focusable element in the modal for accessibility
            const focusableElements = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
            if (focusableElements.length > 0) {
                focusableElements[0].focus();
            }
        } else {
            console.warn(`Modal with ID '${modalId}' not found.`);
        }
    }

    /**
     * Closes all active modals.
     */
    function closeAllModals() {
        allModals.forEach(modal => {
            modal.classList.add('hidden');
        });
    }

    // Event listeners for closing modals (click outside or close button)
    allModals.forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal || e.target.closest('.close-modal-btn')) {
                modal.classList.add('hidden');
            }
        });
        // Allow closing with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
                modal.classList.add('hidden');
            }
        });
    });

    // --- USER AUTHENTICATION LOGIC ---
    const authButtons = document.querySelector('.auth-buttons');
    const userProfile = document.getElementById('user-profile');
    const authModal = document.getElementById('auth-modal');
    const modalTitle = authModal ? authModal.querySelector('#modal-title') : null;
    const modalForm = document.getElementById('modal-form');

    document.getElementById('login-btn')?.addEventListener('click', () => {
        if (modalTitle) modalTitle.textContent = 'Đăng nhập';
        showModal('auth-modal');
    });

    document.getElementById('register-btn')?.addEventListener('click', () => {
        if (modalTitle) modalTitle.textContent = 'Đăng ký';
        showModal('auth-modal');
    });

    modalForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        // In a real application, you would send data to a server here.
        // For this demo, we just simulate success.
        alert('Thực hiện thành công!');
        authModal.classList.add('hidden');
        authButtons.classList.add('hidden');
        userProfile.classList.remove('hidden');
        modalForm.reset(); // Clear form fields after submission
    });

    // --- BOOKING PAGE LOGIC ---
    const bookingOptions = document.querySelector('.booking-options');
    const bookingForm = document.querySelector('.booking-form');
    const bookingFormContainer = document.getElementById('booking-form-container');
    const additionalBookingInfo = document.querySelector('.additional-booking-info');
    const bookingResultsContainer = document.getElementById('booking-results-container');

    bookingOptions?.addEventListener('click', (e) => {
        if (e.target.classList.contains('option-btn')) {
            bookingOptions.querySelectorAll('.option-btn').forEach(btn => btn.classList.remove('active'));
            e.target.classList.add('active');
        }
    });

    bookingForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        // Simulate fetching results based on form input
        const location = document.getElementById('location').value;
        const date = document.getElementById('date').value;
        const time = document.getElementById('time').value;
        const bookingType = bookingOptions.querySelector('.option-btn.active')?.dataset.option || 'hourly';

        // Hide form and suggestions, show search results
        if (bookingFormContainer) bookingFormContainer.style.display = 'none';
        if (additionalBookingInfo) additionalBookingInfo.style.display = 'none';
        
        if (bookingResultsContainer) {
            bookingResultsContainer.innerHTML = `
                <h2>Kết quả cho "${location}"</h2>
                <div class="result-card">
                    <div class="result-info">
                        <h4>Bãi đỗ xe Trần Nhật Duật</h4>
                        <p>10 phút đi bộ</p>
                    </div>
                    <div class="result-price">
                        <span class="price">20.000đ</span>/giờ
                        <button class="btn btn-primary payment-btn">Chọn & Thanh toán</button>
                    </div>
                </div>
                <div class="result-card">
                    <div class="result-info">
                        <h4>Bãi đỗ xe Nguyễn Hữu Huân</h4>
                        <p>5 phút đi bộ</p>
                    </div>
                    <div class="result-price">
                        <span class="price">25.000đ</span>/giờ
                        <button class="btn btn-primary payment-btn">Chọn & Thanh toán</button>
                    </div>
                </div>
                <button class="btn btn-secondary btn-full mt-4" id="back-to-booking-form">Quay lại tìm kiếm</button>
            `;
            bookingResultsContainer.classList.remove('hidden');
        }
    });
    
    // Event delegation for dynamically added buttons
    mainContent.addEventListener('click', e => {
        // Payment button in search results or recommendations
        if (e.target.classList.contains('payment-btn')) {
            showModal('qr-modal');
        }
        // "Đặt lại" button in Recent Bookings
        if (e.target.closest('.recent-item .btn-secondary')) {
            alert('Đặt lại thành công! Chi tiết đã được gửi đến bạn.');
        }
        // "Đặt ngay" button in Nearby Recommendations
        if (e.target.closest('.recommendation-card .btn-primary')) {
            showModal('qr-modal');
        }
        // "Quay lại tìm kiếm" button
        if (e.target.id === 'back-to-booking-form') {
            if (bookingFormContainer) bookingFormContainer.style.display = 'block';
            if (additionalBookingInfo) additionalBookingInfo.style.display = 'grid'; // Use grid for this section
            if (bookingResultsContainer) bookingResultsContainer.classList.add('hidden');
        }
    });

    // --- SHARE PAGE LOGIC ---
    const tabContainer = document.querySelector('.share-tabs');
    const shareForm = document.querySelector('.share-form');

    tabContainer?.addEventListener('click', (e) => {
        if (e.target.classList.contains('tab-link')) {
            const tabId = e.target.dataset.tab;
            tabContainer.querySelectorAll('.tab-link').forEach(link => link.classList.remove('active'));
            e.target.classList.add('active');
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.toggle('active', content.id === tabId);
            });
        }
    });

    shareForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Đăng ký thành công, chúng tôi sẽ liên lạc với bạn trong 24h tới.');
        shareForm.reset(); // Clear form fields
    });

    // --- EZBOT PAGE LOGIC ---
    const ezbotSendBtn = document.getElementById('ezbot-send-btn');
    const ezbotChatInput = document.getElementById('ezbot-chat-input');
    const ezbotChatBody = document.getElementById('ezbot-chat-body');

    /**
     * Handles sending a message in the EZBOT chat.
     */
    function handleEzbotSend() {
        const userMessage = ezbotChatInput.value.trim();
        if (userMessage === '') return;

        appendEzbotMessage(userMessage, 'user');
        ezbotChatInput.value = ''; // Clear input immediately

        // Simulate bot typing delay
        ezbotChatInput.disabled = true;
        ezbotSendBtn.disabled = true;

        setTimeout(() => {
            getBotResponse(userMessage);
            ezbotChatInput.disabled = false;
            ezbotSendBtn.disabled = false;
            ezbotChatInput.focus(); // Return focus to input
        }, 1000);
    }

    /**
     * Appends a message to the EZBOT chat body.
     * @param {string} message - The message content.
     * @param {'user'|'bot'} sender - The sender of the message ('user' or 'bot').
     */
    function appendEzbotMessage(message, sender) {
        const msgEl = document.createElement('div');
        msgEl.className = `chat-message ${sender}`;
        msgEl.innerHTML = `<p>${message}</p>`;
        ezbotChatBody.appendChild(msgEl);
        ezbotChatBody.scrollTop = ezbotChatBody.scrollHeight; // Scroll to bottom
    }

    /**
     * Generates a bot response based on user input.
     * @param {string} userInput - The user's message.
     */
    function getBotResponse(userInput) {
        const lowerInput = userInput.toLowerCase();
        let response = "Xin lỗi, tôi chưa hiểu yêu cầu của bạn. Bạn có thể hỏi về việc tìm chỗ đỗ xe hoặc các vấn đề pháp lý liên quan nhé!";

        if (lowerInput.includes("đỗ ở đây có được không")) {
            response = "Đây là biển cấm đỗ xe ngày chẵn, dựa vào thông tin ngày hôm nay 7/5/2025 thì bạn <b>không được đỗ xe ở đây</b>. Muốn tôi tìm chỗ đỗ xe cho bạn không?";
        } else if (lowerInput.includes("xe tôi xe vinfast vf3, nhà có trẻ nhỏ và mẹ bầu, muốn đi chơi hồ gươm thì đỗ ở đâu hợp lý?")) {
            response = `Tuyệt vời! Dưới đây là một vài gợi ý:
                <ul>
                    <li><b>Bãi đỗ xe cao tầng Trần Nhật Duật (20K)</b>: 10-15 phút đi bộ.</li>
                    <li><b>Bãi đỗ xe trên đường Trần Quang Khải (25-30k)</b>: 5 phút đi bộ.</li>
                    <li><b>Bãi đỗ xe A15 (Shared, 15k)</b>: 10 phút đi bộ, cần liên hệ trước 30 phút.</li>
                </ul>`;
        } else if (lowerInput.includes("chào") || lowerInput.includes("hi")) {
            response = "Chào bạn! Tôi là EZBOT. Tôi có thể giúp gì cho bạn hôm nay?";
        } else if (lowerInput.includes("cảm ơn")) {
            response = "Không có gì! Rất vui được giúp đỡ bạn.";
        } else if (lowerInput.includes("giá đỗ xe")) {
            response = "Giá đỗ xe thường dao động tùy thuộc vào địa điểm và loại hình (theo giờ, qua đêm, theo tháng). Bạn muốn tìm giá ở khu vực nào?";
        } else if (lowerInput.includes("luật đỗ xe")) {
            response = "Về luật đỗ xe, bạn cần chú ý các biển báo cấm đỗ, cấm dừng, khu vực cấm đỗ theo ngày chẵn/lẻ, và không đỗ xe trên vỉa hè nếu không có biển cho phép. Bạn có câu hỏi cụ thể nào không?";
        }
        
        appendEzbotMessage(response, 'bot');
    }

    ezbotSendBtn?.addEventListener('click', handleEzbotSend);
    ezbotChatInput?.addEventListener('keypress', e => {
        if (e.key === 'Enter') {
            e.preventDefault(); // Prevent new line in input
            handleEzbotSend();
        }
    });

    // --- COMMUNITY PAGE LOGIC ---
    document.querySelector('.community-feed')?.addEventListener('click', (e) => {
        const likeBtn = e.target.closest('.like-btn');
        if (likeBtn) {
            const postCard = likeBtn.closest('.post-card');
            if (!postCard) return;

            const likeCountSpan = postCard.querySelector('.like-count');
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

    // --- EZGAME PAGE LOGIC ---
    const wheel = document.getElementById('lucky-wheel');
    const spinBtn = document.getElementById('spin-btn');
    const waterPlantBtn = document.getElementById('water-plant-btn');
    const plantLevelSpan = document.querySelector('.plant-level');
    const ezpBalanceEl = document.querySelector('#wallet-page .wallet-balance:nth-of-type(2) h3');

    // Lucky Wheel Game
    if (spinBtn && wheel) {
        let currentRotation = 0;
        spinBtn.addEventListener('click', () => {
            if (spinBtn.disabled) return;

            // Deduct 50 EZP before spinning
            let currentPointsText = ezpBalanceEl?.textContent;
            let currentPoints = parseInt(currentPointsText?.replace(/[^0-9]/g, '') || '0');

            if (currentPoints < 50) {
                alert('Bạn không đủ 50 EZPoints để quay vòng quay!');
                return;
            }

            currentPoints -= 50;
            if (ezpBalanceEl) {
                ezpBalanceEl.innerHTML = `<i class="fa-solid fa-star"></i> ${currentPoints.toLocaleString('vi-VN')} EZP`;
            }

            spinBtn.disabled = true;
            const randomSpins = Math.floor(Math.random() * 5) + 5; // 5-9 full spins
            const randomSegmentIndex = Math.floor(Math.random() * 8); // 0-7 for 8 segments
            const finalAngle = (randomSpins * 360) + (randomSegmentIndex * 45) + (Math.random() * 40 - 20); // Add slight random offset within segment
            
            currentRotation += finalAngle;
            wheel.style.transform = `rotate(${currentRotation}deg)`;

            setTimeout(() => {
                const prizes = ["Miễn phí", "+100 EZP", "Giảm 50%", "Thêm lượt", "Giảm 25%", "+50 EZP", "JACKPOT", "Rất tiếc"];
                const actualPrizeIndex = (8 - (randomSegmentIndex + 1) % 8) % 8; // Adjust index to match visual segments
                const prizeWon = prizes[actualPrizeIndex];

                alert(`Chúc mừng! Bạn đã trúng: ${prizeWon}`);
                spinBtn.disabled = false;

                // Apply prize effect
                if (prizeWon.includes('+')) {
                    const points = parseInt(prizeWon.replace(/[^0-9]/g, ''));
                    if (ezpBalanceEl) {
                        let current = parseInt(ezpBalanceEl.textContent.replace(/[^0-9]/g, '') || '0');
                        current += points;
                        ezpBalanceEl.innerHTML = `<i class="fa-solid fa-star"></i> ${current.toLocaleString('vi-VN')} EZP`;
                    }
                }
                // Add logic for other prizes like "Miễn phí", "Giảm 50%", "Thêm lượt", "JACKPOT"
                // For "JACKPOT", you might want a larger EZP reward or a special item.
                // For "Rất tiếc", no reward.

            }, 5000); // Match with CSS transition duration
        });
    }

    // Plant Watering Game
    if (waterPlantBtn && plantLevelSpan && ezpBalanceEl) {
        waterPlantBtn.addEventListener('click', () => {
            let levelText = plantLevelSpan.textContent;
            let currentLevel = parseInt(levelText.split(':')[1].split('/')[0].trim());
            
            if (currentLevel >= 10) {
                alert('Cây của bạn đã lớn tối đa rồi!');
                return;
            }

            currentLevel++;
            plantLevelSpan.textContent = `Cấp độ: ${currentLevel}/10`;

            // Update EZP balance
            let currentPointsText = ezpBalanceEl.textContent;
            let currentPoints = parseInt(currentPointsText.replace(/[^0-9]/g, '') || '0');
            currentPoints += 10;
            const newPointsText = currentPoints.toLocaleString('vi-VN');
            ezpBalanceEl.innerHTML = `<i class="fa-solid fa-star"></i> ${newPointsText} EZP`;
            
            alert('Tưới cây thành công! Bạn nhận được +10 EZP.');

            if (currentLevel === 10) {
                waterPlantBtn.disabled = true;
                waterPlantBtn.innerHTML = '<i class="fa-solid fa-tree"></i> Cây đã lớn';
                setTimeout(() => alert('Chúc mừng! Cây của bạn đã trưởng thành!'), 200);
            }
        });
    }

    // Daily Tasks Logic (Example - needs more robust implementation)
    const dailyTasksList = document.querySelector('.task-list');
    const dailyTaskRewardBtn = document.querySelector('.game-card .btn-secondary');

    if (dailyTasksList && dailyTaskRewardBtn) {
        // Simulate task completion (for demo purposes)
        const tasks = [
            { name: 'Đỗ xe 3 lần trong ngày', progress: '0/3', completed: false, icon: 'fa-square-parking' },
            { name: 'Chia sẻ 1 bài viết cộng đồng', progress: '0/1', completed: false, icon: 'fa-share-nodes' },
            { name: 'Sử dụng EZBOT 1 lần', progress: '<i class="fa-solid fa-check"></i>', completed: true, icon: 'fa-robot' }
        ];

        function renderTasks() {
            dailyTasksList.innerHTML = '';
            let allTasksCompleted = true;
            tasks.forEach(task => {
                const li = document.createElement('li');
                if (task.completed) {
                    li.classList.add('completed');
                } else {
                    allTasksCompleted = false;
                }
                li.innerHTML = `
                    <div class="task-info">
                        <i class="fa-solid ${task.icon}"></i>
                        <span>${task.name}</span>
                    </div>
                    <span class="task-progress">${task.progress}</span>
                `;
                dailyTasksList.appendChild(li);
            });

            if (allTasksCompleted) {
                dailyTaskRewardBtn.disabled = false;
                dailyTaskRewardBtn.textContent = 'Nhận thưởng (+50 EZP)';
            } else {
                dailyTaskRewardBtn.disabled = true;
                dailyTaskRewardBtn.textContent = 'Đã nhận thưởng'; // Or "Hoàn thành nhiệm vụ"
            }
        }

        renderTasks(); // Initial render

        dailyTaskRewardBtn.addEventListener('click', () => {
            if (!dailyTaskRewardBtn.disabled) {
                alert('Bạn đã nhận được 50 EZPoints từ nhiệm vụ hàng ngày!');
                if (ezpBalanceEl) {
                    let current = parseInt(ezpBalanceEl.textContent.replace(/[^0-9]/g, '') || '0');
                    current += 50;
                    ezpBalanceEl.innerHTML = `<i class="fa-solid fa-star"></i> ${current.toLocaleString('vi-VN')} EZP`;
                }
                dailyTaskRewardBtn.disabled = true;
                dailyTaskRewardBtn.textContent = 'Đã nhận thưởng';
                // Reset tasks for next day in a real app
            }
        });
    }
});
