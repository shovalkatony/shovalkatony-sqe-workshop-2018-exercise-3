import $ from 'jquery';
import {parseCode,initialParse} from './code-analyzer';

$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {
        let codeToParse = $('#codePlaceholder').val();
        let parsedCode = parseCode(codeToParse);
        $('#parsedCode').val(JSON.stringify(parsedCode, null, 2));
    });

    $('#addRow').click(() => {
        let codeToParse = $('#codePlaceholder').val();
        let contentArr = initialParse(codeToParse);
        insertRow(contentArr);

    });

});
function insertRow(contentArr) {
    for(let i=0; i<contentArr.length; i++)
    {
        let tableRef = document.getElementById('myTbody');
        let newRow = tableRef.insertRow(0);
        let newCell = newRow.insertCell(0);
        let newText = document.createTextNode(contentArr[i]);
        newCell.appendChild(newText);
    }

}

