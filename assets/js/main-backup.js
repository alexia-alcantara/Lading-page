$('a.desce').click(function () {
    $('html, body').animate({
        scrollTop: $('#comercial').offset().top
    }, 1000, function () {
        parallaxScroll();
    });
    return false;
});

function parallaxScroll() {
    var scrolled = $(window).scrollTop();
}

function getCidades(uf) {
    const selectEstado = document.querySelector('#estado');
    const selectCidade = document.querySelector('#cidade');
    const selUf = selectEstado.options[selectEstado.selectedIndex].value;

    Parse.Cloud.run('retornaMunicipiosEstado', { 'UF': selUf }).then(function (cidades) {
        selectCidade.innerHTML = '';
        selectCidade.innerHTML = '<option value="">Selecione</option>';
        dataSrcCidades = Object.create(cidades);
        cidades.map(function (cidade, index) {
            const optionCity = document.createElement('option');

            optionCity.value = index;
            optionCity.textContent = cidade.nome;

            selectCidade.appendChild(optionCity);
        });
    });
}

// Mascara para o telefone
$(document).ready(function () {
    $('body').on('focus', '#celular', function () {
        var maskBehavior = function (val) {
            return val.replace(/\D/g, '').length === 11 ? '(00) 00000-0000' : '(00) 0000-00009';
        },
            options = {
                onKeyPress: function (val, e, field, options) {
                    field.mask(maskBehavior.apply({}, arguments), options);

                    if (field[0].value.length >= 14) {
                        var val = field[0].value.replace(/\D/g, '');
                        if (/\d\d(\d)\1{7,8}/.test(val)) {
                            field[0].value = '';
                            alert('Telefone Inválido');
                        }
                    }
                }
            };
        $(this).mask(maskBehavior, options);
    });
});

// Valida o formulario
$("#formDaily").validate({
    rules: {
        cpf_cnpj: "required"
        , nome: "required"
        , celular: {
            required: true,
            minlength: 14
        }
        , email: {
            required: true,
            email: true
        }
        , estado: "required"
        , cidade: "required"
        , produto_interesse: "required"
        , previsao_compra: "required"
    },
    messages: {
        cpf_cnpj: "Por favor, informe o seu CPF ou CNPJ"
        , nome: "Por favor, informe seu nome."
        , celular: {
            required: "Precisamos do seu número de telefone para contatar você.",
            minlength: "Esse número não parece válido."
        }
        , email: {
            required: "Precisamos do seu email para contatar você.",
            email: "O seu endereço de email precisa estar correto."
        }
        , estado: "Informe seu estado"
        , cidade: "Informe sua cidade"
        , produto_interesse: "Escolha um modelo"
        , previsao_compra: "Informe qual é a sua previsão de compra"
    },
    submitHandler: function (form) {
        enviaDados();
    },
});

Parse.initialize('FRHWR989SxY3Y3TCBVfrxFJoyeFFQYMaeX4t159w');
// Parse.serverURL = 'http://localhost:1350/parse/';
Parse.serverURL = 'https://appservices.bhtec.com.br/cnhileads/parse/';
var dataSrcCidades;

function enviaDados() {
    $('.btn-enviar').attr('disabled', 'disabled');
    var cidadeNome = parseInt($('#cidade').val());
    console.log(dataSrcCidades);

    Parse.Cloud.run('testeCRMIveco',
        {
            'marca': 'IVECO',
            'clienteCnpjCpf': $('#cpf_cnpj').val(),
            'clienteNome': $('#nome').val(),
            'clienteEmail': $('#email').val(),
            'clienteTelefone': $('#celular').val(),
            'clienteEndereco': '',
            'clienteEmpresa': '',
            'clienteEstado': $('#estado').val(),
            'clienteCidade': dataSrcCidades[cidadeNome].nome,
            'clienteCidadeCodigoIBGE': dataSrcCidades[cidadeNome].codigoIBGE,
            'origem': 'Landing Page',
            'referer': document.referrer,
            'produto': '26', // Leve
            'modelo': $('#produto_interesse').val(),
            'mensagem': $('#mensagem').val(),
            'campanha': 'IVECO TESTE | Teste CRM',
            'previsaoCompra': $('#previsao_compra').val(),
            'clienteOptinMaisInformacoes': ($('#opt_in').is(':checked')) ? "S" : "N"
        });

    try { _gaq.push(['_trackEvent', 'UA_LP_lead', 'lead', 'Leves - ' + $('#produto_interesse').val(), null, false]); } catch (err) { }
    try { fbq('track', 'Lead'); } catch (err) { }

    top.location.href = "obrigado.html";

}

Util = {
    redirecionaOutros: function (e) {
        window.open($(e).val(), "_blank")
    }
}