document.addEventListener('DOMContentLoaded', function() {
    // تهيئة المتغيرات
    const addNumberBtn = document.getElementById('add-number-btn');
    const numbersTableBody = document.getElementById('numbers-table-body');
    const addNumberModal = new bootstrap.Modal(document.getElementById('addNumberModal'));
    
    // إضافة مستمعي الأحداث
    addNumberBtn.addEventListener('click', () => {
        showAddNumberModal();
    });

    // تحميل قائمة الأرقام عند بدء التطبيق
    loadWhatsAppNumbers();

    // الدوال المساعدة
    async function loadWhatsAppNumbers() {
        try {
            const response = await fetch('/api/whatsapp/numbers');
            const numbers = await response.json();
            renderWhatsAppNumbers(numbers);
        } catch (error) {
            console.error('Error loading WhatsApp numbers:', error);
            showError('حدث خطأ أثناء تحميل قائمة الأرقام');
        }
    }

    function renderWhatsAppNumbers(numbers) {
        numbersTableBody.innerHTML = '';
        numbers.forEach(number => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${number.phoneNumber}</td>
                <td>
                    <span class="status-badge ${number.connected ? 'status-connected' : 'status-disconnected'}">
                        ${number.connected ? 'متصل' : 'غير متصل'}
                    </span>
                </td>
                <td>
                    <span class="webhook-count">${number.webhooks?.length || 0}</span>
                </td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="editWebhooks('${number.id}')">
                        Webhooks
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteNumber('${number.id}')">
                        حذف
                    </button>
                </td>
            `;
            numbersTableBody.appendChild(row);
        });
    }

    async function showAddNumberModal() {
        try {
            addNumberModal.show();
            const qrContainer = document.getElementById('qr-code-container');
            const statusDiv = document.getElementById('connection-status');
            
            // طلب رمز QR من السيرفر
            const response = await fetch('/api/whatsapp/generate-qr', {
                method: 'POST'
            });
            
            if (!response.ok) throw new Error('Failed to generate QR code');
            
            const data = await response.json();
            qrContainer.innerHTML = `<img src="${data.qr}" alt="WhatsApp QR Code">`;
            
            // بدء مراقبة حالة الاتصال
            checkConnectionStatus(data.sessionId);
        } catch (error) {
            console.error('Error showing add number modal:', error);
            showError('حدث خطأ أثناء إنشاء رمز QR');
        }
    }

    async function checkConnectionStatus(sessionId) {
        const statusDiv = document.getElementById('connection-status');
        const interval = setInterval(async () => {
            try {
                const response = await fetch(`/api/whatsapp/connection-status/${sessionId}`);
                const status = await response.json();
                
                if (status.connected) {
                    clearInterval(interval);
                    statusDiv.className = 'alert alert-success';
                    statusDiv.textContent = 'تم الاتصال بنجاح!';
                    setTimeout(() => {
                        addNumberModal.hide();
                        loadWhatsAppNumbers(); // إعادة تحميل القائمة
                    }, 2000);
                }
            } catch (error) {
                console.error('Error checking connection status:', error);
            }
        }, 2000);
    }

    function showError(message) {
        // يمكن إضافة مكتبة لعرض الإشعارات مثل toastr
        alert(message);
    }

    // تصدير الدوال العامة
    window.editWebhooks = function(numberId) {
        // سيتم تنفيذها لاحقاً
        console.log('Edit webhooks for number:', numberId);
    };

    window.deleteNumber = async function(numberId) {
        if (confirm('هل أنت متأكد من حذف هذا الرقم؟')) {
            try {
                const response = await fetch(`/api/whatsapp/numbers/${numberId}`, {
                    method: 'DELETE'
                });
                
                if (!response.ok) throw new Error('Failed to delete number');
                
                loadWhatsAppNumbers(); // إعادة تحميل القائمة
            } catch (error) {
                console.error('Error deleting number:', error);
                showError('حدث خطأ أثناء حذف الرقم');
            }
        }
    };
});
