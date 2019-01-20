import * as esprima from 'esprima';
const expr = require('expression-eval');
let inputParam;

function initialParse(codeToParse,inputParam1) {
    let returnFunction = [];
    let env ={};
    let jsonParse;
    inputParam = ExpressionStatementinput(esprima.parseScript(inputParam1, {loc: true}),{});
    jsonParse = esprima.parseScript(codeToParse, {loc: true});
    parseProgram(jsonParse.body,returnFunction,env);
    return returnFunction;
}

const parseProgram = (body,returnFunction,env,color) => {


    if(body.type == 'BlockStatement')
        body = body.body;
    else if(body.type == 'IfStatement')
        IfStatement(body,returnFunction, env,color);
    for (let i = 0; i < body.length; i++)
        switchState(body[i], returnFunction, env,color);
};

function switchState(func,returnFunction,env,color) {
    switch (func.type) {
    case 'FunctionDeclaration':
        FunctionDeclaration(func,returnFunction,env);
        break;
    case 'VariableDeclaration':
        VariableDeclaration(func,returnFunction,env,color);
        break;
    case 'ExpressionStatement':
        ExpressionStatement(func,returnFunction,env,color);
        break;
    default:
        switchState2(func,returnFunction,env,color);
    }
}

function switchState2(func,returnFunction,env,color) {
    switch (func.type) {
    case 'WhileStatement':
        WhileStatement(func,returnFunction,env,color);
        break;
    case 'IfStatement':
        IfStatement(func,returnFunction, env,color);
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
        vari = 'A'+i;
        if(func.body[0].expression.expressions[i].type=='ArrayExpression') {
            let arr = [];
            for (let j = 0; j < func.body[0].expression.expressions[i].elements.length; j++)
                arr.push(func.body[0].expression.expressions[i].elements[j].value);
            val = arr;
        }
        else
            val = IdentifierLiteral(func.body[0].expression.expressions[i]);
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
    for(let i=0; i<func.params.length; i++){
        param.push(func.params[i].name);
        inputParam[param[i]]=inputParam['A'+i];
        delete inputParam['A'+i];
    }
    parseProgram(func.body,functionElement,env,'green');
    Object.assign(returnFunction,{type:'functionDecl',name:name,param:param,body:functionElement});
}

function ExpressionStatement(func,returnFunction,env,color)
{
    let vari,val='';
    if(func.expression.type=='UpdateExpression'){
        vari = func.expression.argument.name
        if(func.expression.operator=='++')
            val = vari+' + 1';
        if(func.expression.operator=='--')
            val = vari+' - 1';
        returnFunction.push({type:'let',color:color,var:vari,val:val});}
    else {
        vari = IdentifierLiteral(func.expression.left);
        val = BinaryExpression(func.expression.right);
        returnFunction.push({type: 'let', color: color, var: vari, val: val});}
    if (val.includes(vari))
        val = substitute(val, env);
    if (!includeString(val)) {
        const ast = expr.parse(val);
        val = '' + expr.eval(ast, {});
    }
    env[vari] = val;

}
function includeString(exp)
{
    for(let i=0;i<exp.length;i++)
        checkLetter(exp[i]);
    return false;
}
function checkLetter(exp) {
    if((exp >= 'A' && exp <= 'Z') || (exp >= 'a' && exp <= 'z'))
        return true;
}

function VariableDeclaration(func,returnFunction,env,color)
{
    let add={},vari,val;
    for(let i=0; i<func.declarations.length; i++)
    {
        vari = func.declarations[i].id.name;
        val = IdentifierLiteral(func.declarations[i].init);
        returnFunction.push({type:'let',color:color,var:vari,val:val});
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
    else
        return func.operator+func.argument.value;
}

function WhileStatement(func,returnFunction,env,color)
{
    let subVarTest = substitute(IdentifierLiteral(func.test),env);
    const ast = expr.parse(subVarTest);
    const value = expr.eval(ast,inputParam);
    let body = [];
    let envC = {};
    envC = Object.assign({}, env);
    if(value) color='green';
    else color='black';
    parseProgram(func.body,body,envC,color);
    if(value)
        returnFunction.push({type: 'WhileState', color: 'green', test: IdentifierLiteral(func.test), body: body});
    else
        returnFunction.push({type:'WhileState',color:'black',test:IdentifierLiteral(func.test),body:body});
}

function IfStatement(func,returnFunction,env,color)
{
    let colort,colorf;
    let subVarTest = substitute(IdentifierLiteral(func.test),env);
    const ast = expr.parse(subVarTest);
    const value = expr.eval(ast,inputParam);
    let bodyCon = [];let bodyAlt = [];let envC = {},envA= {};
    envC = Object.assign({}, env);envA = Object.assign({}, env);
    if(value) {if(color=='black') colort = 'black';
    else colort = 'green';colorf='black';}
    else{ colort='black';colorf='green';}
    parseProgram(func.consequent,bodyCon,envC,colort);
    if(func.alternate!=null)
        parseProgram(func.alternate,bodyAlt,envA,colorf);
    else bodyAlt = null;
    if(value){returnFunction.push({type:'IfExp',color:color,test:IdentifierLiteral(func.test),con:bodyCon,alt:bodyAlt});
        color='green';}
    else{returnFunction.push({type:'IfExp',color:color,test:IdentifierLiteral(func.test),con:bodyCon,alt:bodyAlt});
        color='black';}
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


function ReturnStatement(func,returnFunction)
{
    //let subVar = substitute(IdentifierLiteral(func.argument),env);
    returnFunction.push({type:'return',val:IdentifierLiteral(func.argument)});
}

export {initialParse};

