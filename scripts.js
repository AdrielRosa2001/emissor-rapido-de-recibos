

/* -------------------- variaveis -------------------- */

const grandezas = ["", "real","reais", "mil", "milhão", "milhões", "centavos"];
const unitario = ["", "um", "dois", "três", "quatro", "cinco", "seis", "sete", "oito", "nove"];
const dezenaInteira = ["onze", "doze", "treze", "quatorze", "quinze", "dezesseis", "dezessete", "dezoito", "dezenove"];
const dezenasMapeadas = {
    10: 'dez',
    11: 'onze',
    12: 'doze',
    13: 'treze',
    14: 'quatorze',
    15: 'quinze',
    16: 'dezesseis',
    17: 'dezessete',
    18: 'dezoito',
    19: 'dezenove',
}
const dezena = ["dez", "vinte", "trinta", "quarenta", "cinquenta", "sessenta", "setenta", "oitenta", "noventa"];
const centena = ["", "cento", "duzentos", "trezentos", "quatrocentos", "quinhentos", "seissentos", "setessentos", "oitossentos", "novessentos"];

var retornoExtenso = "";

// Fim variaveis
// ------------------------------------------------------------


function executarNoCarregamento(){
    setDatesFields();
}

function gerarPopupRecibo(){
    gerarRecibo();
    var windowVar = window.open('', 'popup', "width=760 height=560");
    var extracaoHtml = '<link rel="stylesheet" href="./style.css">' + document.getElementById('recibo-oculto').innerHTML;
    windowVar.document.write(extracaoHtml);
}

function returnData(){
    const data = new Date();
    const dictData = new Map();
    const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

    dictData.set('dia', data.getDate());
    dictData.set('mes', data.getMonth()+1);
    dictData.set('ano', data.getFullYear());

    dictData.set('mes-extenso', meses[data.getMonth()].toUpperCase());

    return dictData;
}

function converterReal(valor){
    const valorConvertido = "R$ " + (valor.toFixed(2)).replace(".", ",") ; 
    return valorConvertido;
}

function gerarRecibo(){
    const cliente = document.getElementById('cliente-desc').value;
    const valor = Number(document.getElementById('valor-desc').value);
    const valorExtenso = "cem reais";
    const referente = document.getElementById('referente-desc').value;
    const data = returnData();

    document.getElementById('valor-reais').innerHTML = converterReal(valor);

    document.getElementById('recebido-de').innerHTML = cliente.toUpperCase();
    document.getElementById('valor-extenso').innerHTML = exibirExtenso(valor, "txt").toUpperCase();
    document.getElementById('referente-a').innerHTML = referente.toUpperCase();

    /* Data */
    document.getElementById('dia').innerHTML = data.get('dia');
    document.getElementById('mes').innerHTML = data.get('mes-extenso');
    document.getElementById('ano').innerHTML = data.get('ano');
}

function setDatesFields(){
    const data = returnData();
    document.getElementById('dia-data').value = data.get('dia');
    document.getElementById('mes-data').value = data.get('mes');
    document.getElementById('ano-data').value = data.get('ano');
    
}


// Codigos da conversão de valor por extenso !!!
// -------------------------------------------------

/* RETORNA UNICO */
function retornaUnico(valor){
    
    const primeiro = Number((valor.toString()[0]));    
    
    return unitario[primeiro];

}

/* RETORNA DEZENA */
function retornaDezena(valor){
    let retorno = "";

    const primeiro = Number((valor.toString())[0]);
    const segundo = Number((valor.toString())[1]);

    if (primeiro == 1){
        retorno = retorno + dezenasMapeadas[valor];
    } else if (primeiro == 0){
        retorno = retorno + unitario[segundo];
    } else {
        if (segundo > 0){
            retorno = retorno + dezena[(primeiro-1)] + " e " + unitario[segundo];
        } else {
            retorno = retorno + dezena[(primeiro-1)];
        }
    }

    
    return retorno;
}


/* RETORNA CENTENA */
function retornaCentena(valor){
    let retorno = "";


    const primeiro = Number((valor.toString())[0]);
    const dezena = (valor.toString())[1]+(valor.toString())[2];

    if (dezena == '00'){
        if (primeiro == 1){
            retorno = retorno + "cem";
        } else if( primeiro == 0){
            retorno = "";
        } else {
            retorno = retorno + "e " + centena[primeiro];
        }
    } else {
        if (dezena[0] == 0){
            retorno = retorno + "e " + centena[primeiro] + retornaDezena(dezena);
        } else {
            if (primeiro == 0){
                retorno = retorno + centena[primeiro] + retornaDezena(dezena); 
            } else {
                retorno = retorno + centena[primeiro] + " e " + retornaDezena(dezena); 
            }
            
        }
    }

    
    return retorno;

}
function retornaMil(valor){
    let retorno = "";
    let cont = ((valor.toString()).length);

    let primeiraCent = "";
    let segundaCent = "";

    if (cont == 4){

        primeiraCent = (valor.toString())[0];
        segundaCent = (valor.toString())[1] + (valor.toString())[2] + (valor.toString())[3];

        if ( segundaCent == '000'){
            retorno = retornaUnico(Number(primeiraCent)) + " mil";
        } else {
            retorno = numExtenso(Number(primeiraCent)) + " mil " + retornaCentena(segundaCent);
        }
        
        return retorno;

    } else if (cont == 5) {

        primeiraCent = (valor.toString())[0] + (valor.toString())[1];
        segundaCent = (valor.toString())[2] + (valor.toString())[3] + (valor.toString())[4];

        if ( segundaCent == '000'){
            retorno = retornaDezena(Number(primeiraCent)) + " mil";
        } else {
            retorno = numExtenso(Number(primeiraCent)) + " mil " + retornaCentena(segundaCent);
        }

        return retorno;

    } else if (cont == 6) {

        primeiraCent = (valor.toString())[0] + (valor.toString())[1] + (valor.toString())[2];
        segundaCent = (valor.toString())[3] + (valor.toString())[4] + (valor.toString())[5];
        
        if ( segundaCent == '000'){
            retorno = retornaCentena(Number(primeiraCent)) + " mil";
        } else {
            retorno = numExtenso(Number(primeiraCent)) + " mil " + retornaCentena(segundaCent);
        }

        return retorno;

    }

    
    
}

function numExtenso(numeroInput) {
    
    tamanho = (numeroInput.toString()).length;

    if (tamanho == 1){
        /* Unico */
        return retornaUnico(numeroInput).toUpperCase();
    } else if (tamanho == 2){
        /* Dezena */
        return retornaDezena(numeroInput).toUpperCase();
    } else if (tamanho == 3) {
        /* Centena */
        return retornaCentena(numeroInput).toUpperCase();
    } else if ((tamanho > 3) && (tamanho < 7)){
        /* mil */
        return retornaMil(numeroInput).toUpperCase();
    }
    
}

function exibirExtenso(ElemValue, tipo) {
    //let valor = Number(document.getElementById(idElemValue).value);
    let valor = ElemValue;
    lista = ((valor.toString()).replace(",", ".")).split(".");

    if (tipo == "alert"){
        if (lista.length == 1){
            if (lista[0].length == 1 ) {
                if (lista[0] == 1){
                    alert((numExtenso(lista[0]) + " " + grandezas[1]).toUpperCase());    
                } else {
                    alert((numExtenso(lista[0]) + " " + grandezas[2]).toUpperCase());    
                }
            }else {
                alert((numExtenso(lista[0]) + " " + grandezas[2]).toUpperCase());
            }
    
            
        } else {
            alert((numExtenso(lista[0]) + " " + grandezas[2] + " e " + retornaDezena(lista[1]) + " " + grandezas[6]).toUpperCase());
        }
    } else if (tipo = "txt"){
        if (lista.length == 1){
            if (lista[0].length == 1 ) {
                if (lista[0] == 1){
                    return (numExtenso(lista[0]) + " " + grandezas[1]).toUpperCase() ;
                } else {
                    return (numExtenso(lista[0]) + " " + grandezas[2]).toUpperCase() ;
                }
            }else {
                return (numExtenso(lista[0]) + " " + grandezas[2]).toUpperCase() ;
            }
    
            
        } else {
            return (numExtenso(lista[0]) + " " + grandezas[2] + " e " + retornaDezena(lista[1]) + " " + grandezas[6]).toUpperCase() ;
        }
    }
    
    
}

