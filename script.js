const products = [
    { id: 1, name: 'محاكي الحرب', price: 99.99, description: 'محاكي لكيفيه الصد والهجوم.', subscription: true },
    { id: 2, name: 'محاكي تذاكر+صناديق', price: 50, description: 'محاكي عجله الثروه الخياليه ومحاكي الصناديق الاشتراك مدي الحياه.', subscription: false },
    { id: 3, name: 'قريبا', price: 0, description: 'قريبا ميزه جديده.', subscription: false },
];

let cart = [];
let invoiceNumber = Math.floor(Math.random() * 100000); // رقم فاتورة عشوائي

function displayProducts() {
    const productList = document.getElementById('product-list');
    products.forEach(product => {
        const subscriptionText = product.subscription ? 'اشتراك شهري' : 'لا يوجد اشتراك';
        const productCard = `
            <div class="col-md-4">
                <div class="card mb-4">
                    <div class="card-body">
                        <h5 class="card-title">${product.name}</h5>
                        <p class="card-text">السعر: ${product.price} جنيه مصري</p>
                        <p class="card-text">${product.description}</p>
                        <p class="card-text">${subscriptionText}</p>
                        <label for="quantity-${product.id}">الكمية:</label>
                        <input type="number" id="quantity-${product.id}" min="1" value="1" class="form-control mb-2" style="width: 70px;" />
                        <button class="btn btn-primary" onclick="addToCart(${product.id})">أضف إلى السلة</button>
                    </div>
                </div>
            </div>
        `;
        productList.innerHTML += productCard;
    });
}

function addToCart(productId) {
    const quantityInput = document.getElementById(`quantity-${productId}`);
    const quantity = parseInt(quantityInput.value);
    
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += quantity; // زيادة الكمية إذا كانت موجودة بالفعل
    } else {
        const cartItem = { ...product, quantity };
        cart.push(cartItem);
    }
    
    document.getElementById('cart-count').innerText = cart.length;
    alert(`تم إضافة ${quantity} من ${product.name} إلى السلة!`);
}

function displayInvoice() {
    const invoice = document.getElementById('invoice');
    invoice.innerHTML = '';

    let total = 0;
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        invoice.innerHTML += `<p>${item.name} - ${item.quantity} × ${item.price} = ${itemTotal} جنيه مصري</p>`;
        total += itemTotal;

        // إضافة تفاصيل الاشتراك إذا كان موجودًا
        if (item.subscription) {
            invoice.innerHTML += `<p><em>(اشتراك شهري)</em></p>`;
        }
    });

    const customerName = document.getElementById('customer-name').value;
    invoice.innerHTML += `<strong>رقم الفاتورة: ${invoiceNumber}</strong><br>`;
    invoice.innerHTML += `<strong>اسم العميل: ${customerName}</strong><br>`;
    invoice.innerHTML += `<strong>المجموع: ${total} جنيه مصري</strong>`;
}

document.getElementById('cart-btn').addEventListener('click', () => {
    const cartModal = new bootstrap.Modal(document.getElementById('cart-modal'));
    displayInvoice();
    cartModal.show();
});

document.getElementById('checkout-btn').addEventListener('click', () => {
    const customerName = document.getElementById('customer-name').value;
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const invoiceDetails = generateInvoiceDetails(customerName, total);

    // إرسال تفاصيل الفاتورة عبر واتساب
    const whatsappNumber = '+201098662418';
    const message = encodeURIComponent(invoiceDetails);
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`);
    
    // حفظ الفاتورة في الموقع
    saveInvoice(invoiceDetails);
});

// دالة لإنشاء تفاصيل الفاتورة
function generateInvoiceDetails(customerName, total) {
    return `فاتورة رقم: ${invoiceNumber}\nاسم العميل: ${customerName}\n\n` + cart.map(item => 
        `${item.name} - ${item.quantity} × ${item.price} = ${item.price * item.quantity} جنيه مصري`
    ).join('\n') + `\n\nالمجموع: ${total} جنيه مصري`;
}

// دالة لحفظ الفاتورة
function saveInvoice(invoiceDetails) {
    const invoices = JSON.parse(localStorage.getItem('invoices')) || [];
    invoices.push(invoiceDetails);
    localStorage.setItem('invoices', JSON.stringify(invoices));
}

// دالة لتحميل الفاتورة
document.getElementById('download-btn').addEventListener('click', () => {
    const customerName = document.getElementById('customer-name').value;
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const invoiceDetails = generateInvoiceDetails(customerName, total);

    const blob = new Blob([invoiceDetails], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `invoice_${invoiceNumber}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
});

// تفعيل الوضع الليلي تلقائيًا عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    document.body.classList.add('dark-mode'); // تفعيل الوضع الليلي افتراضيًا
    const themeText = document.getElementById('theme-text');
    themeText.innerText = 'الوضع العادي'; // تحديث نص الزر ليتماشى مع الوضع الحالي
});

// تفعيل الوضع الليلي من خلال الزر
document.getElementById('toggle-theme').addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const themeText = document.getElementById('theme-text');
    themeText.innerText = document.body.classList.contains('dark-mode') ? 'الوضع العادي' : 'الوضع الليلي';
});

// التحكم في الشات بوت
document.getElementById('chat-icon').addEventListener('click', () => {
    const chatbot = document.getElementById('chatbot');
    chatbot.style.display = chatbot.style.display === 'none' || chatbot.style.display === '' ? 'flex' : 'none';
});

document.getElementById('close-chat').addEventListener('click', () => {
    document.getElementById('chatbot').style.display = 'none';
});

// إرسال الرسائل في الشات بوت
document.getElementById('send-chat').addEventListener('click', () => {
    const input = document.getElementById('chat-input');
    const message = input.value;
    const chatOutput = document.getElementById('chat-output');
    
    if (message.trim() !== '') {
        chatOutput.innerHTML += `<p>أنت: ${message}</p>`;
        input.value = '';
        
        // ردود الشات بوت
        if (message.toLowerCase() === 'help') {
            chatOutput.innerHTML += `<p> الشات بوت: يمكنك الاستعلام عن (المنتجات) (طرق الدفع) او (سياسه الاسترجاع) فقط اكتب اي من هذه الاوامر.</p>`;
            else         if (message.toLowerCase() === 'سياسه الاسترجاع') {
                chatOutput.innerHTML += `<p>الشات بوت: سياسه الاسترجاع تمم من الواتس لكن سياسه الاسترجاع مدتها 24 ساعه من تاريخ الشراء ويجب عليك دفع ثمن التحويل ولكي ترجع مشترياتك يجب ان تأتي بالفاتوره صحيحه.</p>`;

                            else         if (message.toLowerCase() === 'المنتجات') {
                chatOutput.innerHTML += `<p>الشات بوت : يتم العمل علي منتجات جديده انتظروناا . علما تستطيع استخدام المنتج في اي وقت .</p>`;
 

                else         if (message.toLowerCase() === 'وطرق الدفع') {
                    chatOutput.innerHTML += `<p>الشات بوت : طرق الدفع حاليا هي فودافون كاش او اورانج كاش سيتم اضافه  طرق اخري مستقبلا  .</p>`;
    

        } else {
            chatOutput.innerHTML += `<p>الشات بوت: عذرًا، لم أفهم. اكتب "help" لمساعدتك.</p>`;
        }
        
        // التمرير لأسفل تلقائيًا
        chatOutput.scrollTop = chatOutput.scrollHeight;
    }
});

// عرض خيارات التواصل
document.getElementById('contact-options-btn').addEventListener('click', () => {
    const contactOptions = document.getElementById('contact-options');
    contactOptions.classList.toggle('show'); // إضافة أو إزالة الفئة 'show' لتفعيل تأثير التلاشي
});

// تواصل عبر فيسبوك
document.getElementById('facebook-contact').addEventListener('click', () => {
    const facebookUrl = 'https://www.facebook.com/profile.php?id=61558933496823';
    window.open(facebookUrl, '_blank');
});

// تواصل عبر واتساب
document.getElementById('whatsapp-contact').addEventListener('click', () => {
    const whatsappNumber = '+201098662418';
    const message = encodeURIComponent('مرحبًا! أريد الاستفسار عن الخصائص.');
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`);
});

// تواصل عبر جيميل
document.getElementById('gmail-contact').addEventListener('click', () => {
    const gmailUrl = 'mailto:sinperrr3ddd@gmail.com?subject=استفسار&body=مرحبًا! أريد الاستفسار عن الخصائص.';
    window.open(gmailUrl);
});

// تواصل عبر جيميل بديل
document.getElementById('alternative-gmail-contact').addEventListener('click', () => {
    const alternativeGmailUrl = 'mailto:empirewiki200@gmail.com?subject=استفسار&body=مرحبًا! أريد الاستفسار عن الخصائص.';
    window.open(alternativeGmailUrl);
});

// عرض المنتجات عند تحميل الصفحة
displayProducts();
