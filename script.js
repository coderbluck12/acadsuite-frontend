document.addEventListener('DOMContentLoaded', () => {

    // ===================== NAVBAR SCROLL =====================
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 20);
    });

    // ===================== FEATURE TABS =====================
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-tab');
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            tabPanels.forEach(panel => {
                panel.classList.toggle('active', panel.id === `tab-${targetTab}`);
            });
        });
    });

    // ===================== MODAL =====================
    const modal = document.getElementById('demoModal');
    const openBtns = document.querySelectorAll('.open-modal-btn');
    const closeBtn = document.getElementById('closeModal');
    const demoForm = document.getElementById('demoForm');
    const formState = document.getElementById('formState');
    const successMsg = document.getElementById('successMessage');
    const submitBtn = document.getElementById('submitBtn');
    const errorBanner = document.getElementById('errorBanner');

    const openModal = () => {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        // Reset
        formState.classList.remove('hidden');
        successMsg.classList.add('hidden');
        if (errorBanner) errorBanner.classList.add('hidden');
        demoForm.reset();
    };

    const closeModal = () => {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    };

    openBtns.forEach(btn => btn.addEventListener('click', openModal));
    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) closeModal();
    });

    // ===================== FORM SUBMIT =====================
    demoForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Gather form data
        const data = {
            firstName: document.getElementById('firstName').value.trim(),
            lastName: document.getElementById('lastName').value.trim(),
            email: document.getElementById('email').value.trim(),
            institution: document.getElementById('institution').value.trim(),
            role: document.getElementById('role').value,
            phone: document.getElementById('phone').value.trim(),
        };

        // Loading state
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<span class="spinner"></span> Sending...`;
        if (errorBanner) errorBanner.classList.add('hidden');

        try {
            const res = await fetch('/api/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            const result = await res.json();

            if (res.ok && result.success) {
                formState.classList.add('hidden');
                successMsg.classList.remove('hidden');
            } else {
                throw new Error(result.error || 'Something went wrong.');
            }
        } catch (err) {
            console.error(err);
            if (errorBanner) {
                errorBanner.textContent = err.message || 'Could not send your request. Please try again.';
                errorBanner.classList.remove('hidden');
            }
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = `Confirm &amp; Book Demo`;
        }
    });

    // ===================== SCROLL REVEAL =====================
    const revealEls = document.querySelectorAll('.testi-card, .step-card, .stat-item, .tab-panel-image');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealEls.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(24px)';
        el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(el);
    });

});
