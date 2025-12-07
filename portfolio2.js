document.querySelectorAll('[data-target]').forEach(button => {
    button.addEventListener('click', () => {
        const targetId = button.getAttribute('data-target');
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

const nav = document.getElementById('main-nav');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
});

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            fadeObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.observe-fade').forEach(el => {
    fadeObserver.observe(el);
});

const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.remove('image-hidden');
            entry.target.classList.add('animate-image-reveal');
            imageObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.hero-image, .project-media').forEach(img => {
    imageObserver.observe(img);
});

function updateLocalTime() {
    const now = new Date();
    const options = {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
        timeZone: 'Asia/Kolkata'
    };
    const timeString = now.toLocaleTimeString('en-IN', options);
    document.getElementById('localTime').textContent = `${timeString}, IST`;
}

updateLocalTime();
setInterval(updateLocalTime, 1000);

const contactForm = document.getElementById('contactForm');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const messageInput = document.getElementById('message');

function validateName(name) {
    const trimmed = name.trim();
    if (trimmed.length === 0) return { valid: false, message: 'Name is required' };
    if (trimmed.length > 100) return { valid: false, message: 'Name must be less than 100 characters' };
    return { valid: true, message: '' };
}

function validateEmail(email) {
    const trimmed = email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (trimmed.length === 0) return { valid: false, message: 'Email is required' };
    if (!emailRegex.test(trimmed)) return { valid: false, message: 'Invalid email address' };
    if (trimmed.length > 255) return { valid: false, message: 'Email must be less than 255 characters' };
    return { valid: true, message: '' };
}

function validateMessage(message) {
    const trimmed = message.trim();
    if (trimmed.length === 0) return { valid: false, message: 'Message is required' };
    if (trimmed.length > 1000) return { valid: false, message: 'Message must be less than 1000 characters' };
    return { valid: true, message: '' };
}

function showError(inputId, message) {
    const errorElement = document.getElementById(`${inputId}Error`);
    errorElement.textContent = message;
    errorElement.classList.add('show');
}

function clearError(inputId) {
    const errorElement = document.getElementById(`${inputId}Error`);
    errorElement.textContent = '';
    errorElement.classList.remove('show');
}

nameInput.addEventListener('blur', () => {
    const result = validateName(nameInput.value);
    result.valid ? clearError('name') : showError('name', result.message);
});

emailInput.addEventListener('blur', () => {
    const result = validateEmail(emailInput.value);
    result.valid ? clearError('email') : showError('email', result.message);
});

messageInput.addEventListener('blur', () => {
    const result = validateMessage(messageInput.value);
    result.valid ? clearError('message') : showError('message', result.message);
});

nameInput.addEventListener('input', () => clearError('name'));
emailInput.addEventListener('input', () => clearError('email'));
messageInput.addEventListener('input', () => clearError('message'));

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    clearError('name');
    clearError('email');
    clearError('message');

    const nameResult = validateName(nameInput.value);
    const emailResult = validateEmail(emailInput.value);
    const messageResult = validateMessage(messageInput.value);

    let hasErrors = false;

    if (!nameResult.valid) { showError('name', nameResult.message); hasErrors = true; }
    if (!emailResult.valid) { showError('email', emailResult.message); hasErrors = true; }
    if (!messageResult.valid) { showError('message', messageResult.message); hasErrors = true; }

    if (hasErrors) return;


});

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

console.log('Portfolio initialized successfully! 🚀');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const sendBtn = document.getElementById("sendBtn");
    sendBtn.innerHTML = `<span class="spinner"></span> Sending...`;
    sendBtn.classList.add("loading");

    const nameResult = validateName(nameInput.value);
    const emailResult = validateEmail(emailInput.value);
    const messageResult = validateMessage(messageInput.value);

    let hasErrors = false;

    if (!nameResult.valid) { showError('name', nameResult.message); markError(nameInput); hasErrors = true; }
    else { markSuccess(nameInput); }

    if (!emailResult.valid) { showError('email', emailResult.message); markError(emailInput); hasErrors = true; }
    else { markSuccess(emailInput); }

    if (!messageResult.valid) { showError('message', messageResult.message); markError(messageInput); hasErrors = true; }
    else { markSuccess(messageInput); }

    if (hasErrors) {
        sendBtn.innerHTML = "Send Message";
        sendBtn.classList.remove("loading");
        return;
    }

    emailjs.send("service_7n70gn7", "template_uqhimpu", {
        name: nameInput.value.trim(),
        email: emailInput.value.trim(),
        message: messageInput.value.trim()
    })
        .then(() => {
            showToast("Message sent successfully!");
            contactForm.reset();
            sendBtn.innerHTML = "Send Message";
            sendBtn.classList.remove("loading");
        })
        .catch((error) => {
            console.error("EmailJS Error:", error);
            showToast("Error sending message. Try again.");
            sendBtn.innerHTML = "Send Message";
            sendBtn.classList.remove("loading");
        });
});


function showToast(message) {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 3000);
}
function markSuccess(input) {
    input.classList.remove("error");
    input.classList.add("success");
}

function markError(input) {
    input.classList.add("error");
    input.classList.remove("success");
}
if (!nameResult.valid) { showError('name', nameResult.message); markError(nameInput); hasErrors = true; }
else { markSuccess(nameInput); }

if (!emailResult.valid) { showError('email', emailResult.message); markError(emailInput); hasErrors = true; }
else { markSuccess(emailInput); }

if (!messageResult.valid) { showError('message', messageResult.message); markError(messageInput); hasErrors = true; }
else { markSuccess(messageInput); }
