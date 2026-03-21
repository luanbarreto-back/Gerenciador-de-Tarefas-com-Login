let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
let usuarioLogado = JSON.parse(localStorage.getItem("logado"));

const formCadastro = document.getElementById("formCadastro");
if (formCadastro) {
  formCadastro.addEventListener("submit", e => {
    e.preventDefault();

    const nome = document.getElementById("nome").value;
    const email = document.getElementById("emailCadastro").value;
    const senha = document.getElementById("senhaCadastro").value;

    if (usuarios.find(u => u.email === email)) {
      alert("Usuário já existe");
      return;
    }

    usuarios.push({ nome, email, senha, tarefas: [] });
    localStorage.setItem("usuarios", JSON.stringify(usuarios));

    alert("Cadastro feito");
    window.location.href = "index.html";
  });
}

const formLogin = document.getElementById("formLogin");
if (formLogin) {
  formLogin.addEventListener("submit", e => {
    e.preventDefault();

    const email = document.getElementById("emailLogin").value;
    const senha = document.getElementById("senhaLogin").value;

    const user = usuarios.find(u => u.email === email && u.senha === senha);

    if (!user) {
      alert("Login inválido");
      return;
    }

    localStorage.setItem("logado", JSON.stringify(user));
    window.location.href = "dashboard.html";
  });
}

if (window.location.pathname.includes("dashboard.html")) {

  if (!usuarioLogado) {
    window.location.href = "index.html";
  }

  let tarefas = usuarioLogado.tarefas || [];

  function salvar() {
    const index = usuarios.findIndex(u => u.email === usuarioLogado.email);
    usuarios[index].tarefas = tarefas;

    localStorage.setItem("usuarios", JSON.stringify(usuarios));
    localStorage.setItem("logado", JSON.stringify(usuarios[index]));
  }

  window.criarTarefa = function () {
    const input = document.getElementById("inputTarefa");
    const texto = input.value;

    if (!texto.trim()) return;

    tarefas.push({
      id: Date.now(),
      texto,
      status: "todo"
    });

    input.value = "";
    salvar();
    render();
  };

  function render() {
    document.getElementById("todo").innerHTML = "";
    document.getElementById("progresso").innerHTML = "";
    document.getElementById("feito").innerHTML = "";

    tarefas.forEach(t => {
      const div = document.createElement("div");
      div.className = "card";
      div.draggable = true;
      div.id = t.id;

      div.ondragstart = drag;

      div.innerHTML = `
        ${t.texto}
        <br>
        <button onclick="remover(${t.id})">Excluir</button>
      `;

      document.getElementById(t.status).appendChild(div);
    });
  }

  window.remover = function (id) {
    tarefas = tarefas.filter(t => t.id !== id);
    salvar();
    render();
  };

  window.allowDrop = function (e) {
    e.preventDefault();
  };

  window.drag = function (e) {
    e.dataTransfer.setData("id", e.target.id);
  };

  window.drop = function (e, status) {
    e.preventDefault();
    const id = e.dataTransfer.getData("id");

    tarefas = tarefas.map(t =>
      t.id == id ? { ...t, status } : t
    );

    salvar();
    render();
  };

  render();
}

function logout() {
  localStorage.removeItem("logado");
  window.location.href = "index.html";
}