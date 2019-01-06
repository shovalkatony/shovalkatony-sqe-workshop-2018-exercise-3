import $ from 'jquery';
import {initialParse} from './code-analyzer';
var flowchart = require('flowchart.js');

$(document).ready(function () {

    $('#make_cgf').click(() => {
        let codeToParse = $('#codePlaceholder').val();
        let paramsVal = $('#parsedCode').val();
        let contentArr = initialParse(codeToParse,paramsVal);
        debugger;
        let structure = makeFlowChart(contentArr);
        op=0,cond=0,nodeNum=0;
        let flowGraph = flowchart.parse(structure);
        flowGraph.drawSVG('graph',proper);
    });

});
/*
function printRow(line,color) {

    let tableRef = document.getElementById('myTbody');
    let newRow = tableRef.insertRow(-1);
    let newCell = newRow.insertCell(0);
    let newText = document.createTextNode(line);
    newCell.appendChild(newText);
    newCell.style.color = color;
}*/

function makeFlowChart(input) {
    let start='',end='';
    return printFunc(input,start,end);
}

function printFunc(input,start,end) {
    let ret;
    if(Array.isArray(input)&&input.length != 0)
        for (let i = 0; i < input.length;i++)
            printFunc(input[i],start,end);
    else{
        ret = blockGenerate(input.body,start,end,null);
        return ret;
    }
}
/*
function generatelets(input) {
    let lets='';
    for (let i = 0; (i < input.length) && (input[i].type=='let');i++){
        lets=lets+input[i].var+' = '+input[i].val+'\n';
    }
    return lets;
}*/


let op=0,cond=0,nodeNum=0;

function newNode() {
    return `op${++op}`;
}
function newCond() {
    return `cond${++cond}`;
}
function addNumber() {
    return `${++nodeNum}`;
}
function link(parent,child) {
    return `${parent}->${child}\n`;
}

function conectLeaves(parent,child) {
    let ret='';
    for (let i = 0;i<parent.length;i++)
        ret = ret + link(parent[i].nodeName,child);
    return ret;
}
function blockGenerate(input,start,end,last) { //{retStart,retEnd,nodeName,leaves(node arr)
    let firstNode;
    if(last==null) {
        firstNode = switchGenerate(input[0], start, end);
        start = start + firstNode.retStart;end = end + firstNode.retEnd;}
    else {firstNode = last;
        start = start + firstNode.retStart;end = end + firstNode.retEnd;}
    if(input.length>1){
        let rest = input.slice(1, input.length);let start1='';
        let secNode = switchGenerate(input[1], start1, end);
        start = start + secNode.retStart;
        end =end + firstsec(firstNode,secNode);
        end = end + firstNode.retEnd + secNode.retEnd;
        if(input.length==2&&secNode.end==true)
            return start+end;
        return blockGenerate(rest, start, end,secNode);}
    else return firstNode;
}
function firstsec(firstNode,secNode) {
    let end='';
    if(firstNode.leaves!=null) {
        if (firstNode.leaves[0] == 'while')
            end = end + link(firstNode.leaves[1]+'(no)',secNode.nodeName);
        else end = end + conectLeaves(firstNode.leaves, secNode.nodeName);}
    else end = end + link(firstNode.nodeName,secNode.nodeName);
    return end;
}
function switchGenerate(input,start,end)
{
    switch (input.type) {
    case 'IfExp':
        return generateIf(input,start,end);
    case 'let':
        return generateLet(input,start,end);
    case 'return':
        return generateReturn(input,start,end);
    case 'WhileState':
        return generateWhile(input,start,end);
    }
}
function addLeaves(node,leaves) {
    if(node.leaves!=null)
    {
        for (let i=0;i<node.leaves.length;i++)
            leaves.push(addLeaves(node.leaves[i],[]));
    }
    if(node.leaves==null)
        return node;
    else
        return leaves;

}


//{retStart,retEnd,nodeName,leaves(node arr)
function generateIf(input,start,end) {
    let condName = newCond(); let nodeNumber = addNumber();
    start = start+condName+'=>condition: ('+nodeNumber+')  '+input.test+' | '+input.color+'\n';
    let con = blockGenerate(input.con,start,end,null); start = start+con.retStart;
    end = end + link(condName+'(yes, right)',con.nodeName); let alt = null; let leaves;
    let addLeave=addLeaves(con,[]);
    if(Array.isArray(addLeave)) leaves = addLeave;
    else leaves = [addLeave];
    if(input.alt!=null) {
        alt = blockGenerate(input.alt, start, end,null);
        end = end +alt.retEnd;
        end = end + link(condName+'(no)',alt.nodeName);
        start = start+alt.retStart;
        let addLeaveAlt=addLeaves(alt,[]);
        if(Array.isArray(addLeaveAlt))
            leaves = leaves.concat(addLeaveAlt);
        else
            leaves = leaves.concat([addLeaveAlt]);}
    return {retStart:start,retEnd:end,nodeName:condName,leaves:leaves};
}

function generateWhile(input,start,end) {
    let nullName = newNode();
    let nullNumber = addNumber();
    start = start+nullName+'=>operation: ('+nullNumber+') NULL | green \n';
    let condName = newCond(); let nodeNumber = addNumber();
    start = start+condName+'=>condition: ('+nodeNumber+')  '+input.test+' | green \n';
    end = end +link(nullName,condName);

    let body = blockGenerate(input.body,start,end,null); start = start+body.retStart;
    end = end + link(condName+'(yes, right)',body.nodeName); let leaves;
    let addLeave = addLeaves(body,[]);
    if(Array.isArray(addLeave)) leaves = addLeave;
    else leaves = [addLeave];
    end = end + conectLeaves(leaves, nullName);
    return {retStart:start,retEnd:end,nodeName:nullName,leaves:['while',condName]};
}
/*
function generateLets(lets,start) {
    let nodeName = newNode();
    start = start+nodeName+'=>operation: '+lets+' | green\n';
    return nodeName;
}*/

function generateLet(input,start,end) {
    let nodeName = newNode();
    let nodeNumber = addNumber();
    start = start+nodeName+'=>operation: ('+nodeNumber+')  '+input.var+' = '+input.val+' | '+input.color+'\n';
    return {retStart:start,retEnd:end,nodeName:nodeName,leaves:null};
}
function generateReturn(input,start,end) {
    let nodeName = newNode();
    let nodeNumber = addNumber();
    start = start+nodeName+'=>operation: ('+nodeNumber+')  return '+input.val.name+' | green \n';
    nodeNum++;
    return {retStart:start,retEnd:end,nodeName:nodeName,leaves:null,end:true};
}


let proper={
    'x': 0,
    'y': 0,
    'line-width': 3,
    'line-length': 50,
    'text-margin': 10,
    'font-size': 14,
    'font-color': 'black',
    'line-color': 'black',
    'element-color': 'black',
    'fill': 'white',
    'yes-text': 'true',
    'no-text': 'false',
    'arrow-end': 'block',
    'scale': 1,
    'symbols': {
        'start': {
            'element-color': 'black',
        },
        'end':{
            'fill': 'green',
            'class': 'end-element'
        }
    },
    'flowstate' : {
        'green' : {'fill' : 'green', 'font-color' : 'black'},
        'black1' : { 'fill' : 'blue'}
    }
};


/*
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
*/
export {makeFlowChart};