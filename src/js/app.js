import $ from 'jquery';
import {initialParse} from './code-analyzer';

$(document).ready(function () {
    /*$('#codeSubmissionButton').click(() => {
        let codeToParse = $('#codePlaceholder').val();
        let parsedCode = parseCode(codeToParse);
        $('#parsedCode').val(JSON.stringify(parsedCode, null, 2));
    });
    */

    $('#color_if').click(() => {
        let codeToParse = $('#codePlaceholder').val();
        let paramsVal = $('#parsedCode').val();
        let contentArr = initialParse(codeToParse,paramsVal);
        printFunc(contentArr);
    });

});
function printRow(line,color) {

    let tableRef = document.getElementById('myTbody');
    let newRow = tableRef.insertRow(-1);
    let newCell = newRow.insertCell(0);
    let newText = document.createTextNode(line);
    newCell.appendChild(newText);
    newCell.style.color = color;

}

function printFunc(input) {
    if(Array.isArray(input)&&input.length != 0)
        for (let i = 0; i < input.length;i++)
            printFunc(input[i]);
    else
        switchPrint(input);
}

function printIf(input) {
    printRow('if (' + input.test + ')', input.color);
    printFunc(input.con);
    printRow('}','black');
    if (input.alt != null) {
        printRow('else{','black');
        printFunc(input.alt);
        printRow('}','black');
    }
}

function switchPrint(input)
{
    switch (input.type) {
    case 'functionDecl':
        printRow('function ' + input.name + '(' + input.param.toString() + '){', 'black');
        printFunc(input.body); printRow('}','black');
        break;
    case 'IfExp':
        printIf(input);
        break;
    case 'return':
        printRow('return ' + input.val + ';', 'black');
        break;
    case 'WhileState':
        printRow('while (' + input.test + ')', input.color);
        printFunc(input.body);
        printRow('}','black');
        break;
    }
}

