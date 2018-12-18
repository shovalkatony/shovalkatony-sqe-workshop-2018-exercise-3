import * as esprima from 'esprima';
const expr = require('expression-eval');
'use strict';
let inputParam;

function initialParse(codeToParse,inputParam1) {
    let returnFunction = [];
    let env ={};
    let jsonParse;
    inputParam = ExpressionStatementinput(esprima.parseScript(inputParam1, {loc: true}),{});
    jsonParse = esprima.parseScript(codeToParse, {loc: true});
    parseProgram(jsonParse.body,returnFunction,env);
    debugger;
    return returnFunction;
}

const parseProgram = (body,returnFunction,env) => {


    if(body.type == 'BlockStatement')
        body = body.body;
    else if(body.type == 'IfStatement')
        IfStatement(body,returnFunction, env);
    for (let i = 0; i < body.length; i++)
        switchState(body[i], returnFunction, env);
};

function switchState(func,returnFunction,env) {
    switch (func.type) {
    case 'FunctionDeclaration':
        FunctionDeclaration(func,returnFunction,env);
        break;
    case 'VariableDeclaration':
        VariableDeclaration(func,env);
        break;
    case 'ExpressionStatement':
        ExpressionStatement(func, env);
        break;
    default:
        switchState2(func,returnFunction,env);
    }
}

function switchState2(func,returnFunction,env) {
    switch (func.type) {
    case 'WhileStatement':
        WhileStatement(func,returnFunction,env);
        break;
    case 'IfStatement':
        IfStatement(func,returnFunction, env);
        break;
    case 'ReturnStatement':
        ReturnStatement(func,returnFunction,env);
        break;
    }

}

function ExpressionStatementinput(func,env)
{
    let add={},vari,val, i;
    for(i=0;i<func.body[0].expression.expressions.length;i++) {
        vari = IdentifierLiteral(func.body[0].expression.expressions[i].left);
        if(func.body[0].expression.expressions[i].right.type=='ArrayExpression') {
            let arr = [];
            for (let j = 0; j < func.body[0].expression.expressions[i].right.elements.length; j++)
                arr.push(func.body[0].expression.expressions[i].right.elements[j].value);
        }
        else
            val = IdentifierLiteral(func.body[0].expression.expressions[i].right);
        add[vari] = val;
        env = Object.assign(env, add);
    }
    return env;
}

function FunctionDeclaration(func,returnFunction,env)
{
    let name = func.id.name;
    let param = [];
    let functionElement= [];
    for(let i=0; i<func.params.length; i++)
        param.push(func.params[i].name);
    parseProgram(func.body,functionElement,env);
    Object.assign(returnFunction,{type:'functionDecl',name:name,param:param,body:functionElement});
}

function ExpressionStatement(func,env)
{
    let vari,val;
    vari = IdentifierLiteral(func.expression.left);
    val = BinaryExpression(func.expression.right);
    if(val.includes(vari))
        val = substitute(val,env);
    if(!includeString(val)) {
        const ast = expr.parse(val);
        val = ''+expr.eval(ast, {});
    }
    env[vari] = val;
}
function includeString(exp)
{
    for(let i=0;i<exp.length;i++)
        if((exp[i] >= 'A' && exp[i] <= 'Z') || (exp[i] >= 'a' && exp[i] <= 'z'))
            return true;
    return false;
}

function VariableDeclaration(func,env)
{
    let add={},vari,val;
    for(let i=0; i<func.declarations.length; i++)
    {
        vari = func.declarations[i].id.name;
        val = IdentifierLiteral(func.declarations[i].init);
        add[vari] = val;
        env = Object.assign(env,add);
    }
}

function BinaryExpression(func)
{
    return IdentifierLiteral(func.left)+' '+func.operator+' '+IdentifierLiteral(func.right);
}
function IdentifierLiteral(func)
{
    if(func.type == 'Literal')
        return func.value;
    else if(func.type == 'Identifier')
        return func.name;
    else if(func.type == 'BinaryExpression')
        return BinaryExpression(func);
    else if (func.type == 'MemberExpression')
        return func.object.name +'['+IdentifierLiteral(func.property)+']';
    else if (func.type == 'UnaryExpression')
        return func.operator+func.argument.value;
}

function WhileStatement(func,returnFunction,env)
{
    let subVarTest = substitute(IdentifierLiteral(func.test),env);
    const ast = expr.parse(subVarTest);
    const value = expr.eval(ast,inputParam);
    let body = [];
    let envC = {};
    envC = Object.assign({}, env);
    parseProgram(func.body,body,envC);
    if(value)
        returnFunction.push({type:'WhileState',color:'green',test:subVarTest,body:body});
    else
        returnFunction.push({type:'WhileState',color:'red',test:subVarTest,body:body});
}

function IfStatement(func,returnFunction,env)
{
    let subVarTest = substitute(IdentifierLiteral(func.test),env);
    const ast = expr.parse(subVarTest);
    const value = expr.eval(ast,inputParam);
    let bodyCon = [];
    let bodyAlt = [];
    let envC = {},envA= {};
    envC = Object.assign({}, env);
    envA = Object.assign({}, env);
    parseProgram(func.consequent,bodyCon,envC);
    if(func.alternate!=null)
        parseProgram(func.alternate,bodyAlt,envA);
    else
        bodyAlt = null;
    if(value)
        returnFunction.push({type:'IfExp',color:'green',test:subVarTest,con:bodyCon,alt:bodyAlt});
    else
        returnFunction.push({type:'IfExp',color:'red',test:subVarTest,con:bodyCon,alt:bodyAlt});
}

function substitute(exp,env) {
    let key;
    for(let i=0;i<10;i++){
        for(key in env){
            exp = exp.replace(key,env[key]);
        }
    }
    return exp;
}


function ReturnStatement(func,returnFunction,env)
{
    let subVar = substitute(IdentifierLiteral(func.argument),env);
    returnFunction.push({type:'return',val:subVar});
}

export {initialParse};

