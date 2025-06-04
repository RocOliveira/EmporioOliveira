document.addEventListener("DOMContentLoaded", function () {

    // Alternância de abas

    window.openTab = function (tabId) {
      const tabs = document.querySelectorAll('.tab-content');
      tabs.forEach(tab => tab.classList.remove('active'));

      const selectedTab = document.getElementById(tabId);
      if (selectedTab) {
        selectedTab.classList.add('active');
      }

      // Atualiza o total ao mudar de aba, caso a aba de produtos esteja ativa
      if (tabId === 'home') {
        atualizarTotal();
      }

    };

    const form = document.getElementById("cadastroForm");
    const cepInput = document.getElementById("cep");
    const cidadeInput = document.getElementById("cidade");
    const estadoInput = document.getElementById("estado");
    const cpfInput = document.getElementById("cpf");
    const telefoneInput = document.getElementById("telefone");
    const ruaInput = document.getElementById("logradouro");

 

    // Máscara de CPF

    cpfInput.addEventListener("input", function () {
      let cpf = this.value.replace(/\D/g, "").slice(0, 11);
      cpf = cpf.replace(/(\d{3})(\d)/, "$1.$2");
      cpf = cpf.replace(/(\d{3})(\d)/, "$1.$2");
      cpf = cpf.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
      this.value = cpf;
    });

 

    // Máscara de telefone
    telefoneInput.addEventListener("input", function () {
      let tel = this.value.replace(/\D/g, "").slice(0, 11);

      // Adiciona parênteses para DDD e hífen para o número
      if (tel.length > 2 && tel.length <= 7) {
        tel = `(${tel.substring(0, 2)}) ${tel.substring(2)}`;
      } else if (tel.length > 7) {
        tel = `(${tel.substring(0, 2)}) ${tel.substring(2, 7)}-${tel.substring(7, 11)}`;
      }
      this.value = tel;
    });

 

    // Máscara de CEP + API ViaCEP
    cepInput.addEventListener("input", function () {
      let cep = this.value.replace(/\D/g, "").slice(0, 8);
      cep = cep.replace(/^(\d{5})(\d)/, "$1-$2");
      this.value = cep;

      if (cep.length === 9) { // CEP completo (XXXXX-XXX)
        fetch(`https://viacep.com.br/ws/${cep.replace("-", "")}/json/`)
          .then(response => response.json())
          .then(data => {
            if (data.erro) {
              alert("CEP não encontrado.");
              ruaInput.value = "";
              cidadeInput.value = "";
              estadoInput.value = "";
              return;
            }
            ruaInput.value = data.logradouro;
            cidadeInput.value = data.localidade;
            estadoInput.value = data.uf;
          })

          .catch(() => {
            alert("Erro ao buscar o CEP.");
            ruaInput.value = "";
            cidadeInput.value = "";
            estadoInput.value = "";
          });

      } else {
        ruaInput.value = ""
        cidadeInput.value = "";
        estadoInput.value = "";
      }
    });

 

    // Envio do formulário

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      const dados = {
        nome: document.getElementById("nome").value,
        cpf: cpfInput.value,
        email: document.getElementById("email").value,
        telefone: telefoneInput.value,
        endereco: document.getElementById("logradouro").value,
        rua: ruaInput.value,
        cep: cepInput.value,
        estado: estadoInput.value,
        cidade: cidadeInput.value,
        mensagem: document.getElementById("mensagem").value
      };

      console.log("Dados do formulário:", dados);
      alert("Cadastro enviado com sucesso!");
      form.reset();
      ruaInput.value="";
      cidadeInput.value = "";
      estadoInput.value = "";
    });

 

    // Funções de controle de quantidade e total da compra
    window.alterarQuantidade = function (botao, delta) {
      const produto = botao.closest(".produto");
      const quantidadeSpan = produto.querySelector(".quantidade");
      let quantidadeAtual = parseInt(quantidadeSpan.textContent);
      const novoValor = Math.max(0, quantidadeAtual + delta); // Garante que a quantidade não seja negativa
      quantidadeSpan.textContent = novoValor;

      atualizarTotal(); // Recalcula o total após cada alteração de quantidade
    };

    function atualizarTotal() {
      const produtos = document.querySelectorAll(".produto");
      let total = 0;

      produtos.forEach(produto => {
        const preco = parseFloat(produto.getAttribute("data-preco"));
        const quantidade = parseInt(produto.querySelector(".quantidade").textContent);
        total += preco * quantidade;
      });

 

      const totalDiv = document.getElementById("totalCompra");
      totalDiv.textContent = `Total: R$ ${total.toFixed(2).replace(".", ",")}`;
    }

 

    // Inicializa o total ao carregar a página
    atualizarTotal();
  });