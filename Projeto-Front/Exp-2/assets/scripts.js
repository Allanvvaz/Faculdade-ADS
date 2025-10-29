document.addEventListener('DOMContentLoaded', function () {
	var yearEl = document.getElementById('year');
	if (yearEl) {
		yearEl.textContent = String(new Date().getFullYear());
	}

	function setMask(el, maskFunc) {
		if (!el) return;
		var apply = function () {
			var old = el.value || '';
			var masked = maskFunc(old);
			if (old !== masked) {
				el.value = masked;
				try {
					el.selectionStart = el.selectionEnd = el.value.length;
				} catch (_) {}
			}
		};
		el.addEventListener('input', apply);
		el.addEventListener('blur', apply);
		apply();
	}

	function maskCPF(v) {
		v = (v || '').replace(/\D/g, '').slice(0, 11);
		v = v.replace(/(\d{3})(\d)/, '$1.$2');
		v = v.replace(/(\d{3})(\d)/, '$1.$2');
		v = v.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
		return v;
	}

	function maskTel(v) {
		v = (v || '').replace(/\D/g, '').slice(0, 11);
		if (v.length <= 10) {
			v = v.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
		} else {
			v = v.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
		}
		return v.replace(/-$/, '');
	}

	function maskCEP(v) {
		v = (v || '').replace(/\D/g, '').slice(0, 8);
		v = v.replace(/(\d{5})(\d{1,3})/, '$1-$2');
		return v;
	}

	var cpf = document.getElementById('cpf');
	var tel = document.getElementById('telefone');
	var cep = document.getElementById('cep');
	if (cpf) setMask(cpf, maskCPF);
	if (tel) setMask(tel, maskTel);
	if (cep) setMask(cep, maskCEP);

	var form = document.getElementById('cadastroForm');
	if (form) {
		form.addEventListener('submit', function (e) {
			[].forEach.call(form.querySelectorAll('[aria-invalid="true"]'), function (el) {
				el.removeAttribute('aria-invalid');
			});

			if (!form.checkValidity()) {
				e.preventDefault();
				var firstInvalid = form.querySelector(':invalid');
				if (firstInvalid) {
					firstInvalid.setAttribute('aria-invalid', 'true');
					firstInvalid.focus();
				}
			} else {
				e.preventDefault(); 
				alert('Cadastro enviado (simulação) — verifique se os dados estão corretos.');
			}
		});
	}

	var filterWrap = document.querySelector('[data-filter-wrap]');
	if (filterWrap) {
		filterWrap.addEventListener('click', function (e) {
			var btn = e.target.closest('[data-filter]');
			if (!btn) return;
			filterWrap.querySelectorAll('[data-filter]').forEach(function (b) {
				b.setAttribute('aria-pressed', String(b === btn));
			});
			var val = btn.getAttribute('data-filter');
			document.querySelectorAll('.project-list .project').forEach(function (card) {
				if (val === 'all' || card.getAttribute('data-category') === val) {
					card.hidden = false;
				} else {
					card.hidden = true;
				}
			});
		});
	}

	var modal = document.getElementById('applyModal');
	if (modal) {
		function openModal(role) {
			modal.hidden = false;
			var roleEl = modal.querySelector('#applyRole');
			if (roleEl) roleEl.textContent = role || '-';
			setTimeout(function(){ modal.querySelector('.modal-content')?.focus(); }, 0);
		}
		function closeModal() { modal.hidden = true; }
		document.addEventListener('click', function (e) {
			var openBtn = e.target.closest('.js-apply-btn');
			if (openBtn) { openModal(openBtn.getAttribute('data-op')); }
			if (e.target.matches('[data-close-modal]')) { closeModal(); }
		});
		document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !modal.hidden) closeModal(); });
	}

	document.querySelectorAll('.campaign').forEach(function (c) {
		var bar = c.querySelector('.progress-bar');
		var pctEl = c.querySelector('[data-progress]');
		var raisedEl = c.querySelector('[data-raised]');
		var goalEl = c.querySelector('[data-goal]');
		var goal = parseInt(c.getAttribute('data-goal'), 10) || 10000;
		var raised = parseInt(c.getAttribute('data-raised'), 10) || 0;

		function money(v){ return v.toLocaleString('pt-BR',{style:'currency',currency:'BRL'}); }
		function render(){
			var pct = Math.min(100, Math.round((raised/goal)*100));
			if (bar) bar.style.width = pct + '%';
			if (pctEl) pctEl.textContent = pct + '%';
			if (raisedEl) raisedEl.textContent = money(raised);
			if (goalEl) goalEl.textContent = money(goal);
		}
		render();

		var form = c.querySelector('.donate-form');
		if (form) {
			form.addEventListener('submit', function (e) {
				e.preventDefault();
				var inp = form.querySelector('[name="valor"]');
				var val = parseFloat((inp?.value || '0').replace(',','.')) || 0;
				if (val > 0) {
					raised += val;
					render();
					alert('Doação simulada recebida. Obrigado pelo apoio!');
					form.reset();
				}
			});
		}
	});

	var form = document.getElementById('cadastroForm');
	if (form) {
		form.addEventListener('submit', function (e) {
			[].forEach.call(form.querySelectorAll('[aria-invalid="true"]'), function (el) {
				el.removeAttribute('aria-invalid');
			});

			if (!form.checkValidity()) {
				e.preventDefault();
				var firstInvalid = form.querySelector(':invalid');
				if (firstInvalid) {
					firstInvalid.setAttribute('aria-invalid', 'true');
					firstInvalid.focus();
				}
			} else {
				e.preventDefault(); // demo only
				alert('Cadastro enviado (simulação) — verifique se os dados estão corretos.');
			}
		});
		var btnCert = document.getElementById('btnCertificado');
		if (btnCert) {
			btnCert.addEventListener('click', function(){
				window.print();
			});
		}
	}

	var navToggle = document.querySelector('.nav-toggle');
	var mainNav = document.getElementById('main-nav');

	if (navToggle && mainNav) {
		navToggle.addEventListener('click', function () {
			var expanded = this.getAttribute('aria-expanded') === 'true';
			this.setAttribute('aria-expanded', String(!expanded));
			mainNav.setAttribute('aria-expanded', String(!expanded));
		});
	}
});