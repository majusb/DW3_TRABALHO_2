document.addEventListener('DOMContentLoaded', function() {
  // Ao abrir o login, limpa qualquer sessão anterior
  clearIsLoggedCookie();

  var form = document.getElementById('loginForm');
  var errorBox = document.getElementById('loginError');

  if (!form) {
    return;
  }

  // Submete os dados de login para o back-end
  form.addEventListener('submit', async function(event) {
    event.preventDefault();

    // Lê o atributo data-servidor-trabalho do formulário HTML
    var servidorDw3 = form.dataset.servidorTrabalho;
    var usuario = document.getElementById('usuario').value;
    var senha = document.getElementById('senha').value;
    var submitButton = form.querySelector('button[type="submit"]');

    if (errorBox) {
      errorBox.classList.add('d-none');
      errorBox.textContent = '';
    }

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = 'Entrando...';
    }

    try {
      var response = await fetch(servidorDw3 + '/Login', {
          method: 'POST',
          headers: {
              'content-type': 'application/json'
          },
          body: JSON.stringify({
              username: usuario,
              password: senha
          })
      });

      if (!response.ok) {
        throw new Error('Usuário ou senha inválidos.');
      }

      var data = await response.json();
      var token = data.token;

      if (!token) {
        throw new Error('Token não retornado pelo servidor.');
      }

      // Guarda o token no localStorage e marca o cookie de "logado"
      localStorage.setItem('token', token);
      document.cookie = 'IsLogged=true; path=/';

      window.location.href = '/home';
    } catch (error) {
      if (errorBox) {
        errorBox.textContent = error.message || 'Não foi possível realizar o login.';
        errorBox.classList.remove('d-none');
      }
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = 'Entrar';
      }
    }
  });
});