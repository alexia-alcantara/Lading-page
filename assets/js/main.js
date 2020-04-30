// Cidades //////////////////////////////
function getCidades(uf) {
  const selectEstado = document.querySelector("#estado");
  const selectCidade = document.querySelector("#cidade");
  const selUf = selectEstado.options[selectEstado.selectedIndex].value;

  Parse.Cloud.run("retornaMunicipiosEstado", { UF: selUf }).then(function (
    cidades
  ) {
    selectCidade.innerHTML = "";
    selectCidade.innerHTML = '<option value="">Selecione</option>';
    dataSrcCidades = Object.create(cidades);
    cidades.map(function (cidade, index) {
      const optionCity = document.createElement("option");

      optionCity.value = index;
      optionCity.textContent = cidade.nome;

      selectCidade.appendChild(optionCity);
    });
  });
}

// Mascara para o telefone
$(document).ready(function () {
  $("body").on("focus", "#celular", function () {
    var maskBehavior = function (val) {
        return val.replace(/\D/g, "").length === 11
          ? "(00) 00000-0000"
          : "(00) 0000-00009";
      },
      options = {
        onKeyPress: function (val, e, field, options) {
          field.mask(maskBehavior.apply({}, arguments), options);

          if (field[0].value.length >= 14) {
            var val = field[0].value.replace(/\D/g, "");
            if (/\d\d(\d)\1{7,8}/.test(val)) {
              field[0].value = "";
              alert("Telefone Inválido");
            }
          }
        },
      };
    $(this).mask(maskBehavior, options);
  });
});

$("#cpf_cnpj").blur(function () {
  // O CPF ou CNPJ
  var cpf_cnpj = $(this).val();

  // Testa a validação e formata se estiver OK
  if (formata_cpf_cnpj(cpf_cnpj)) {
    $(this).val(formata_cpf_cnpj(cpf_cnpj));
    cpf_cnpj_invalido = false;
  } else {
    cpf_cnpj_invalido = true;
    alert("CPF ou CNPJ inválido.");
  }
});

// Valida o formulario
$("#form").validate({
  rules: {
    cpf_cnpj: "required",
    nome: "required",
    celular: {
      required: true,
      minlength: 14,
    },
    email: {
      required: true,
      email: true,
    },
    estado: "required",
    cidade: "required",
    produto_interesse: "required",
    modelo_interesse: "required",
    opt_in_autorizacao_contato: "required",
    opt_in_privacidade: "required",
    previsao_compra: "required",
  },
  messages: {
    cpf_cnpj: "Por favor, informe o seu CPF ou CNPJ",
    nome: "Por favor, informe seu nome.",
    celular: {
      required: "Precisamos do seu número de telefone para contatar você.",
      minlength: "Esse número não parece válido.",
    },
    email: {
      required: "Precisamos do seu email para contatar você.",
      email: "O seu endereço de email precisa estar correto.",
    },
    estado: "Informe seu estado",
    cidade: "Informe sua cidade",
    produto_interesse: "Escolha um produto",
    modelo_interesse: "Escolha um modelo",
    opt_in_autorizacao_contato:
      "É preciso estar de acordo para que nossa equipe comercial possa entrar em contato.",
    opt_in_privacidade:
      "É preciso estar de acordo com nossa Política de privacidade para entrar em contato.",
    previsao_compra: "Informe qual é a sua previsão de compra",
  },
  submitHandler: function (form) {
    if (cpf_cnpj_invalido) {
      alert("CPF ou CNPJ inválido.");
    } else {
      enviaDados();
    }
  },
});

Parse.initialize("FRHWR989SxY3Y3TCBVfrxFJoyeFFQYMaeX4t159w");
// Parse.serverURL = 'http://localhost:1350/parse/';
Parse.serverURL = "https://appservices.bhtec.com.br/cnhileads/parse/";
var dataSrcCidades;
var cpf_cnpj_invalido = true;

function enviaDados() {
  $(".btn-enviar").attr("disabled", "disabled");
  var cidadeNome = parseInt($("#cidade").val());
  console.log(dataSrcCidades);

  Parse.Cloud.run("insereNovoLeadCNH", {
    marca: "CASEIH",
    clienteCnpjCpf: $("#cpf_cnpj").val(),
    clienteNome: $("#nome").val(),
    clienteEmail: $("#email").val(),
    clienteTelefone: $("#celular").val(),
    clienteEndereco: "",
    clienteEmpresa: "",
    clienteEstado: $("#estado").val(),
    clienteCidade: dataSrcCidades[cidadeNome].nome,
    clienteCidadeCodigoIBGE: dataSrcCidades[cidadeNome].codigoIBGE,
    origem: "Landing Page",
    referer: document.referrer,
    produto: $("#produto_interesse").val(),
    modelo: $("#modelo_interesse").val(),
    mensagem: $("#mensagem").val(),
    campanha: "Ofertas imperdiveis CASEIH",
    previsaoCompra: $("#previsao_compra").val(),
    clienteOptinMaisInformacoes: $("#opt_in_autorizacao_contato").is(":checked")
      ? "S"
      : "N",
  });

  try {
    _gaq.push([
      "_trackEvent",
      "UA_LP_lead",
      "lead",
      $("#produto_interesse").val(),
      +"-" + $("#modelo_interesse").val(),
      null,
      false,
    ]);
  } catch (err) {}
  try {
    fbq("track", "Lead");
  } catch (err) {}

  alert("obrigado!");
  /*   if (location.origin == "http://wwwd.cnh.bhtec.com.br") {
    top.location.href =
      location.origin + "/iveco/lp-iveco-daily-2020/obrigado.html";
  }
  if (location.origin == "http://localhost") {
    top.location.href = location.origin + "/novo-daily-2020/obrigado.html";
  }
  if (location.origin == "https://www.ivecodaily.com.br") {
    top.location.href = location.origin + "/obrigado.html";
  } */
}

Util = {
  redirecionaOutros: function (e) {
    window.open($(e).val(), "_blank");
  },
};
