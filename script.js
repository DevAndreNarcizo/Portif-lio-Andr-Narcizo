document.addEventListener('DOMContentLoaded', () => {

    // --- Seletores de Elementos DOM ---
    const header = document.getElementById('header');
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const contactForm = document.getElementById('contact-form');
    const hiddenElements = document.querySelectorAll('.hidden');

    // --- Otimização do Evento de Scroll ---
    const handleScroll = () => {
        if (header) {
            header.classList.toggle('scrolled', window.scrollY > 50);
        }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });


    // --- Menu Mobile ---
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            const icon = navToggle.querySelector('i');
            const isOpen = navMenu.classList.contains('active');
            icon.textContent = isOpen ? '✕' : '☰';
            navToggle.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
        });

        navMenu.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                navToggle.querySelector('i').textContent = '☰';
                navToggle.setAttribute('aria-label', 'Abrir menu');
            });
        });
    }

    // --- Animação de Scroll Reveal (Intersection Observer) ---
    if (hiddenElements.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('show');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        hiddenElements.forEach(el => observer.observe(el));
    }


    // --- Submissão do Formulário (AJAX) ---
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const form = e.target;
            const submitButton = form.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.textContent;

            submitButton.disabled = true;
            submitButton.textContent = 'Enviando...';

            try {
                const response = await fetch(form.action, {
                    method: form.method,
                    body: new FormData(form),
                    headers: { 'Accept': 'application/json' }
                });

                if (response.ok) {
                    form.reset();
                    submitButton.textContent = 'Enviado com Sucesso!';
                    setTimeout(() => { submitButton.textContent = originalButtonText; }, 3000);
                } else {
                    throw new Error('Houve um problema ao enviar o formulário.');
                }
            } catch (error) {
                console.error('Erro no envio:', error);
                submitButton.textContent = 'Falha no Envio';
                setTimeout(() => { submitButton.textContent = originalButtonText; }, 3000);
            } finally {
                submitButton.disabled = false;
            }
        });
    }

    // --- LÓGICA DA ANIMAÇÃO DE DIGITAÇÃO ---
    const typingTextElement = document.getElementById('typing-text');
    if (typingTextElement) {
        const skills = ["Front-End", "JavaScript", "React.js", "Python", "Java", "SQL"];
        let skillIndex = 0;
        let charIndex = 0;
        let isDeleting = false;

        const type = () => {
            const currentSkill = skills[skillIndex];

            if (isDeleting) {
                // Deletando
                typingTextElement.textContent = currentSkill.substring(0, charIndex - 1);
                charIndex--;
            } else {
                // Digitando
                typingTextElement.textContent = currentSkill.substring(0, charIndex + 1);
                charIndex++;
            }

            // Mudar estado
            if (!isDeleting && charIndex === currentSkill.length) {
                // Pausa antes de começar a deletar
                setTimeout(() => { isDeleting = true; }, 2000);
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                skillIndex = (skillIndex + 1) % skills.length;
            }

            // Define a velocidade da digitação
            const typingSpeed = isDeleting ? 100 : 150;
            setTimeout(type, typingSpeed);
        };

        type(); // Inicia a animação
    }
});