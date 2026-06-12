document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------
    // Tab / View Switching Logic
    // ----------------------------------------------------
    const navItems = document.querySelectorAll('.nav-dock .nav-item');
    const tabs = document.querySelectorAll('.view-tab');
    const tabTriggers = document.querySelectorAll('.tab-trigger');

    let updateParallaxOffset = null;

    function switchTab(tabId) {
        const currentActiveTab = document.querySelector('.view-tab.active');
        const targetTab = document.getElementById(tabId);

        if (!targetTab || currentActiveTab === targetTab) return;

        // Smooth scroll to top (important on mobile layout)
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });

        // Update nav items active class
        navItems.forEach(item => {
            if (item.getAttribute('data-tab') === tabId) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });

        // Elegant fade-out of current view and fade-in of target view
        if (currentActiveTab) {
            currentActiveTab.style.opacity = '0';
            currentActiveTab.style.transform = 'translateY(15px)';

            setTimeout(() => {
                currentActiveTab.classList.remove('active');
                currentActiveTab.style.display = 'none';

                // Display target tab
                targetTab.style.display = 'block';
                // Trigger reflow
                void targetTab.offsetWidth;
                targetTab.classList.add('active');
                targetTab.style.opacity = '1';
                targetTab.style.transform = 'translateY(0)';

                if (typeof updateParallaxOffset === 'function') {
                    updateParallaxOffset();
                }
            }, 400);
        } else {
            targetTab.classList.add('active');
            targetTab.style.display = 'block';
            targetTab.style.opacity = '1';
            targetTab.style.transform = 'translateY(0)';
        }
    }

    // Set up click listeners for floating dock items
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const tabId = item.getAttribute('data-tab');
            switchTab(tabId);
        });
    });

    // Set up click listeners for other tab triggers (e.g. CTA buttons)
    tabTriggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            const tabId = trigger.getAttribute('data-tab');
            switchTab(tabId);
        });
    });

    // ----------------------------------------------------
    // Video Hover Autoplay Logic
    // ----------------------------------------------------
    const videoElements = document.querySelectorAll('video');
    videoElements.forEach(video => {
        const card = video.closest('.project-card-v2');
        if (card) {
            // Hover in: Play video
            card.addEventListener('mouseenter', () => {
                video.play().catch(err => {
                    // Ignore autoplay/interrupted exceptions
                    console.log('Video play interrupted or blocked:', err);
                });
            });
            // Hover out: Pause video and reset to beginning
            card.addEventListener('mouseleave', () => {
                video.pause();
                video.currentTime = 0;
            });
        }
    });

    // ----------------------------------------------------
    // Contact Form Logic (opens Gmail compose prefilled)
    // ----------------------------------------------------
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const submitBtn = document.getElementById('btn-submit');
            const name = (document.getElementById('form-name').value || '').trim();
            const email = (document.getElementById('form-email').value || '').trim();
            const subject = (document.getElementById('form-subject').value || '').trim();
            const message = (document.getElementById('form-message').value || '').trim();

            // Build the full body: include sender name & email so you know who wrote
            const fullBody = `${message}\n\n---\nFrom: ${name}\nReply-to: ${email}`;

            // Gmail compose URL - opens a pre-filled compose window
            const gmailUrl =
                'https://mail.google.com/mail/?view=cm&fs=1' +
                '&to=' + encodeURIComponent('abuzarkhan.ip123@gmail.com') +
                '&su=' + encodeURIComponent(subject) +
                '&body=' + encodeURIComponent(fullBody);

            // Animate button briefly, then open Gmail
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Opening Gmail...';

            setTimeout(() => {
                window.open(gmailUrl, '_blank');

                // Success state
                submitBtn.innerHTML = '<i class="fa-solid fa-circle-check"></i> Gmail Opened!';
                submitBtn.style.backgroundColor = '#10b981';
                submitBtn.style.color = '#ffffff';
                contactForm.reset();

                // Revert button after 4 seconds
                setTimeout(() => {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Send Message';
                    submitBtn.style.backgroundColor = '';
                    submitBtn.style.color = '';
                }, 4000);
            }, 600);
        });
    }

    // ----------------------------------------------------
    // Opposite Scroll Effect for Profile Sidebar
    // ----------------------------------------------------
    const profileSidebar = document.querySelector('.profile-sidebar');
    let parentPaddingTop = 0;
    let parentPaddingBottom = 0;

    updateParallaxOffset = function () {
        if (!profileSidebar) return;
        
        // Reset transform to get accurate layout height
        profileSidebar.style.transform = '';
        
        const parentElement = profileSidebar.parentElement;
        if (parentElement) {
            const style = window.getComputedStyle(parentElement);
            parentPaddingTop = parseFloat(style.paddingTop) || 0;
            parentPaddingBottom = parseFloat(style.paddingBottom) || 0;
        }
    };

    function handleParallax() {
        if (!profileSidebar) return;
        
        if (window.innerWidth >= 1024) {
            const scrolled = window.scrollY;
            const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
            const parentElement = profileSidebar.parentElement;
            
            if (parentElement && maxScroll > 0) {
                const parentHeight = parentElement.clientHeight;
                const sidebarHeight = profileSidebar.getBoundingClientRect().height;
                const maxTranslateY = parentHeight - parentPaddingTop - parentPaddingBottom - sidebarHeight;
                
                if (maxTranslateY > 0) {
                    const scrollFraction = Math.min(1, Math.max(0, scrolled / maxScroll));
                    const translateY = maxTranslateY * scrollFraction;
                    profileSidebar.style.transform = `translateY(${translateY}px)`;
                } else {
                    profileSidebar.style.transform = '';
                }
            } else {
                profileSidebar.style.transform = '';
            }
        } else {
            profileSidebar.style.transform = '';
        }
    }

    updateParallaxOffset();
    handleParallax();

    window.addEventListener('scroll', handleParallax);
    window.addEventListener('resize', () => {
        updateParallaxOffset();
        handleParallax();
    });
});