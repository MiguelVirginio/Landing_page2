// ============================================================
// Portfólio — Miguel Virgínio
// Menu, rolagem, revelação de elementos e formulário de contato
// ============================================================

(function () {
  'use strict';

  const reduzMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ----------------------------------------------------------
  // 1. Menu mobile (folha translúcida ancorada no botão)
  // ----------------------------------------------------------
  const menuToggle = document.getElementById('menuToggle');
  const navLinks   = document.getElementById('navLinks');

  function definirMenu(aberto) {
    navLinks.classList.toggle('aberto', aberto);
    menuToggle.setAttribute('aria-expanded', String(aberto));
    menuToggle.setAttribute('aria-label', aberto ? 'Fechar menu' : 'Abrir menu');
  }

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () =>
      definirMenu(!navLinks.classList.contains('aberto')));

    navLinks.querySelectorAll('a').forEach(link =>
      link.addEventListener('click', () => definirMenu(false)));

    // Clique fora fecha
    document.addEventListener('pointerdown', (e) => {
      if (!navLinks.classList.contains('aberto')) return;
      if (!navLinks.contains(e.target) && !menuToggle.contains(e.target)) definirMenu(false);
    });

    // Esc fecha e devolve o foco ao botão
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navLinks.classList.contains('aberto')) {
        definirMenu(false);
        menuToggle.focus();
      }
    });

    // Ao voltar para desktop, garante estado limpo
    window.matchMedia('(min-width: 861px)').addEventListener('change', () => definirMenu(false));
  }

  // ----------------------------------------------------------
  // 2. Cabeçalho (fio de luz ao rolar) e botão voltar ao topo
  // ----------------------------------------------------------
  const header  = document.querySelector('.header');
  const btnTopo = document.getElementById('btnTopo');
  let aguardandoFrame = false;

  function aoRolar() {
    aguardandoFrame = false;
    const y = window.scrollY;
    if (header)  header.classList.toggle('rolou', y > 8);
    if (btnTopo) btnTopo.classList.toggle('visivel', y > 480);
  }

  window.addEventListener('scroll', () => {
    if (!aguardandoFrame) {
      aguardandoFrame = true;
      requestAnimationFrame(aoRolar);   // sincroniza com o display
    }
  }, { passive: true });
  aoRolar();

  if (btnTopo) {
    btnTopo.addEventListener('click', () =>
      window.scrollTo({ top: 0, behavior: reduzMovimento ? 'auto' : 'smooth' }));
  }

  // ----------------------------------------------------------
  // 3. Revelar elementos ao entrar na tela
  // ----------------------------------------------------------
  const revelaveis = document.querySelectorAll('.revelar');

  if (revelaveis.length) {
    if (reduzMovimento || !('IntersectionObserver' in window)) {
      revelaveis.forEach(el => el.classList.remove('revelar'));
    } else {
      // Atraso escalonado entre irmãos do mesmo grupo
      const contagem = new Map();
      revelaveis.forEach(el => {
        const pai = el.parentElement;
        const i = contagem.get(pai) || 0;
        el.style.setProperty('--i', Math.min(i, 5));
        contagem.set(pai, i + 1);
      });

      const observador = new IntersectionObserver((entradas) => {
        entradas.forEach(entrada => {
          if (entrada.isIntersecting) {
            const el = entrada.target;
            el.classList.add('visivel-scroll');
            observador.unobserve(el);

            // Depois da entrada, devolve o controle ao CSS do componente
            // (senão a transição de revelar sobrescreve o hover dos cards)
            const limpar = () => el.classList.remove('revelar', 'visivel-scroll');
            el.addEventListener('transitionend', (ev) => {
              if (ev.target === el && ev.propertyName === 'opacity') limpar();
            }, { once: true });
            setTimeout(limpar, 1600); // segurança
          }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });

      revelaveis.forEach(el => observador.observe(el));
    }
  }

  // ----------------------------------------------------------
  // 4. Formulário de contato
  // Site estático (sem servidor): ao validar, abre o app de e-mail
  // do visitante com a mensagem já preenchida.
  // ----------------------------------------------------------
  const form = document.getElementById('formContato');

  if (form) {
    const EMAIL_DESTINO = 'contact.miguelvirginio@gmail.com';

    const campos = {
      nome:     { el: document.getElementById('nome'),     erro: document.getElementById('erroNome') },
      email:    { el: document.getElementById('email'),    erro: document.getElementById('erroEmail') },
      mensagem: { el: document.getElementById('mensagem'), erro: document.getElementById('erroMensagem') }
    };

    const validarEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

    const regras = {
      nome(v) {
        if (!v) return 'Informe seu nome.';
        if (v.length < 3) return 'O nome deve ter pelo menos 3 caracteres.';
        return '';
      },
      email(v) {
        if (!v) return 'Informe seu e-mail.';
        if (!validarEmail(v)) return 'Use um e-mail válido, como nome@email.com.';
        return '';
      },
      mensagem(v) {
        if (!v) return 'Escreva uma mensagem.';
        if (v.length < 10) return 'A mensagem deve ter pelo menos 10 caracteres.';
        return '';
      }
    };

    function validarCampo(chave) {
      const { el, erro } = campos[chave];
      const msg = regras[chave](el.value.trim());
      el.classList.toggle('erro', Boolean(msg));
      el.setAttribute('aria-invalid', msg ? 'true' : 'false');
      erro.textContent = msg;
      return !msg;
    }

    // Validação inline: ao sair do campo e, se já houve erro, enquanto digita
    Object.keys(campos).forEach((chave) => {
      const { el } = campos[chave];
      el.addEventListener('blur', () => { if (el.value.trim()) validarCampo(chave); });
      el.addEventListener('input', () => { if (el.classList.contains('erro')) validarCampo(chave); });
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const validos = Object.keys(campos).map(validarCampo);
      if (validos.includes(false)) {
        const primeiro = Object.values(campos).find(c => c.el.classList.contains('erro'));
        if (primeiro) primeiro.el.focus();
        return;
      }

      const assunto = `Contato pelo portfólio — ${campos.nome.el.value.trim()}`;
      const corpo = `${campos.mensagem.el.value.trim()}\n\n—\n${campos.nome.el.value.trim()}\n${campos.email.el.value.trim()}`;
      window.location.href =
        `mailto:${EMAIL_DESTINO}?subject=${encodeURIComponent(assunto)}&body=${encodeURIComponent(corpo)}`;

      const ok = document.getElementById('msgSucesso');
      if (ok) {
        ok.classList.add('visivel');
        setTimeout(() => ok.classList.remove('visivel'), 6000);
      }
      form.reset();
    });
  }
})();
