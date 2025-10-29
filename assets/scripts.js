document.addEventListener('DOMContentLoaded', function () {
	(function App() {
		function qs(sel, root) { return (root || document).querySelector(sel); }
		function qsa(sel, root) { return Array.from((root || document).querySelectorAll(sel)); }
		function parseHTML(html) { return new DOMParser().parseFromString(html, 'text/html'); }

		var Templates = {
			projectCard: function (data) {
				var tpl = document.createElement('article');
				tpl.className = 'project';
				tpl.setAttribute('data-category', data.category || 'geral');
				tpl.innerHTML = '<h4>' + (data.title || '') + '</h4>' +
					'<img src="' + (data.img || '') + '" alt="' + (data.alt || '') + '">' +
					'<p>' + (data.desc || '') + '</p>' +
					'<ul class="badges">' + ((data.badges || []).map(function(b){ return '<li class="badge">'+b+'</li>'; }).join('')) + '</ul>' +
					'<a href="#" class="btn">Ver detalhes</a>';
				return tpl;
			},
			campaignCard: function (data) {
				var tpl = document.createElement('article');
				tpl.className = 'campaign card';
				tpl.setAttribute('data-goal', String(data.goal || 1000));
				tpl.setAttribute('data-raised', String(data.raised || 0));
				tpl.innerHTML = '<h4>' + (data.title || '') + '</h4>' +
					'<p>' + (data.desc || '') + '</p>' +
					'<div class="progress" aria-label="Progresso da campanha"><div class="progress-bar" style="width:0%"></div></div>' +
					'<p><strong><span data-progress>0%</span></strong> — Arrecadado: <span data-raised>R$ 0,00</span> / Meta: <span data-goal>R$ 0,00</span></p>' +
					'<form class="donate-form" aria-label="Doação online (simulação)"><label>Valor (R$)</label><input name="valor" type="number" step="1" min="1" value="10" required><button class="btn" type="submit">Doar agora</button></form>';
				return tpl;
			}
		};

		function setMask(el, maskFunc) {
			if (!el) return;
			var apply = function () {
				var old = el.value || '';
				var masked = maskFunc(old);
				if (old !== masked) {
					el.value = masked;
					try { el.selectionStart = el.selectionEnd = el.value.length; } catch (_) {}
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
			if (v.length <= 10) v = v.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
			else v = v.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
			return v.replace(/-$/, '');
		}
		function maskCEP(v) {
			v = (v || '').replace(/\D/g, '').slice(0, 8);
			return v.replace(/(\d{5})(\d{1,3})/, '$1-$2');
		}

		function isValidCPF(v) {
			if (!v) return false;
			v = v.replace(/\D/g, '');
			if (v.length !== 11) return false;
			if (/^(\d)\1+$/.test(v)) return false;
			function calc(digs) {
				var sum = 0, pos = digs + 1;
				for (var i = 0; i < digs; i++) sum += parseInt(v.charAt(i)) * (pos--);
				var res = (sum * 10) % 11;
				return (res === 10) ? 0 : res;
			}
			return calc(9) === parseInt(v.charAt(9)) && calc(10) === parseInt(v.charAt(10));
		}

		function attachFormBehavior(root) {
			var form = qs('#cadastroForm', root);
			if (!form) return;
			var cpf = qs('#cpf', form); var tel = qs('#telefone', form); var cep = qs('#cep', form);
			if (cpf) setMask(cpf, maskCPF);
			if (tel) setMask(tel, maskTel);
			if (cep) setMask(cep, maskCEP);

			var storageKey = 'cadastro:' + location.pathname;
			try {
				var saved = JSON.parse(localStorage.getItem(storageKey) || '{}');
			} catch (_) { saved = {}; }
			qsa('input[name], textarea[name], select[name]', form).forEach(function (el) {
				var name = el.name;
				if (!name) return;
				if (saved[name] !== undefined) el.value = saved[name];
				el.addEventListener('input', function () {
					try {
						saved[name] = el.value;
						localStorage.setItem(storageKey, JSON.stringify(saved));
					} catch (_) {}
				});
			});

			form.addEventListener('submit', function (e) {
				qsa('[aria-invalid="true"]', form).forEach(function (el) { el.removeAttribute('aria-invalid'); });
				var cpfEl = qs('#cpf', form);
				var ok = true;
				if (cpfEl && !isValidCPF(cpfEl.value)) {
					cpfEl.setAttribute('aria-invalid', 'true'); ok = false;
				}

				if (!form.checkValidity() || !ok) {
					e.preventDefault();
					var firstInvalid = form.querySelector(':invalid, [aria-invalid="true"]');
					if (firstInvalid) firstInvalid.focus();
					alert('Há campos inválidos. Verifique os dados e tente novamente.');
					return;
				}
				e.preventDefault();
				try {
					var payload = {};
					qsa('input[name], textarea[name], select[name]', form).forEach(function (el) { if (el.name) payload[el.name] = el.value; });
					localStorage.setItem('cadastro:last', JSON.stringify(payload));
					localStorage.removeItem(storageKey);
				} catch (_) {}
				alert('Cadastro enviado (simulação) — verifique se os dados estão corretos.');
				form.reset();
			});
			var btnCert = qs('#btnCertificado', form);
			if (btnCert) btnCert.addEventListener('click', function(){ window.print(); });
		}

		function attachCampaigns(root) {
			qsa('.campaign', root).forEach(function (c) {
				var bar = qs('.progress-bar', c);
				var pctEl = qs('[data-progress]', c);
				var raisedEl = qs('[data-raised]', c);
				var goalEl = qs('[data-goal]', c);
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
				var form = qs('.donate-form', c);
				if (form) {
					form.addEventListener('submit', function (e) {
						e.preventDefault();
						var inp = form.querySelector('[name="valor"]');
						var val = parseFloat((inp?.value || '0').toString().replace(',','.')) || 0;
						if (val > 0) { raised += val; render(); alert('Doação simulada recebida. Obrigado pelo apoio!'); form.reset(); }
					});
				}
			});
		}

		function attachModal(root) {
			var modal = qs('#applyModal', root);
			if (!modal) return;
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

		function attachNav(root) {
			var navToggle = qs('.nav-toggle', root);
			var mainNav = qs('#main-nav', document);
			if (navToggle && mainNav) {
				navToggle.addEventListener('click', function () {
					var expanded = this.getAttribute('aria-expanded') === 'true';
					this.setAttribute('aria-expanded', String(!expanded));
					mainNav.setAttribute('aria-expanded', String(!expanded));
				});
			}
			document.body.addEventListener('click', function (e) {
				var a = e.target.closest('a[data-spa]');
				if (!a) return;
				var href = a.getAttribute('href');
				if (!href || href.indexOf('http') === 0 || href.startsWith('mailto:') || href.startsWith('tel:')) return;
				e.preventDefault();
				navigate(href);
			});
		}

		var cache = {};
		function navigate(href, replace) {
			var url = new URL(href, location.origin).pathname;
			loadRoute(url, replace);
		}
		function loadRoute(path, replace) {
			if (path === location.pathname && !replace) return;
			var key = path;
			var promise = cache[key] || fetch(path, {cache: "no-store"})
				.then(function (res) { if (!res.ok) throw new Error('Failed to load'); return res.text(); })
				.then(function (text) { cache[key] = text; return text; })
				.catch(function () { return null; });
			return promise.then(function (html) {
				if (!html) { location.href = path; return; }
				var doc = parseHTML(html);
				var newMain = doc.getElementById('main');
				if (!newMain) { location.href = path; return; }
				var main = document.getElementById('main');
				main.innerHTML = newMain.innerHTML;
				var newTitle = doc.querySelector('title');
				if (newTitle) document.title = newTitle.textContent;
				try {
					if (replace) history.replaceState({path: path}, '', path);
					else history.pushState({path: path}, '', path);
				} catch (_) {}
				bootstrapMain();
				main.setAttribute('tabindex','-1');
				main.focus();
			});
		}
		window.addEventListener('popstate', function (e) {
			var p = (e.state && e.state.path) || location.pathname;
			loadRoute(p, true);
		});

		function bootstrapMain() {
			var main = document.getElementById('main');
			attachFormBehavior(main);
			attachCampaigns(main);
			attachModal(main);
			attachNav(main);
			attachGlobalYear();
		}

		function attachGlobalYear() {
			var yearEl = document.getElementById('year');
			if (yearEl) yearEl.textContent = String(new Date().getFullYear());
		}

		function init() {
			bootstrapMain();
			attachNav(document);
		}
		init();
		window.App = { navigate: navigate, Templates: Templates };
	})();
});