import * as esprima from 'esprima';


function initialParse(codeToParse) {
    let returnString = [];
    let jsonParse;
    jsonParse = esprima.parseScript(codeToParse, {loc: true});
    parseProgram(jsonParse.body,returnString);
    return returnString;
}

const parseProgram = (body,stringArr) => {

    if(body.type == 'BlockStatement')
        body = body.body;
    for(let i=0; i<body.length; i++)
        switchState(body[i],stringArr);
};

function switchState(func,stringArr) {
    switch (func.type) {
    case 'FunctionDeclaration':
        FunctionDeclaration(func, stringArr);
        break;
    case 'VariableDeclaration':
        VariableDeclaration(func, stringArr);
        break;
    case 'ExpressionStatement':
        ExpressionStatement(func, stringArr);
        break;
    default:
        switchState2(func,stringArr);
    }
}

function switchState2(func,stringArr) {
    switch (func.type) {
    case 'WhileStatement':
        WhileStatement(func, stringArr);
        break;
    case 'IfStatement':
        IfStatement(func, stringArr);
        break;
    case 'ReturnStatement':
        ReturnStatement(func, stringArr);
        break;
    }

}

function FunctionDeclaration(func,array)
{
    let row = ' '+func.id.loc.start.line+' function declaration '+func.id.name;
    array.push(row);
    for(let i=0; i<func.params.length; i++)
    {
        let param = ''+func.params[i].loc.start.line+' variable declaration '+func.params[i].name;
        array.push(param);
    }
    parseProgram(func.body,array);
}

function ExpressionStatement(func,array)
{
    let decl;
    if(func.expression.type == 'AssignmentExpression'){
        if(func.expression.right.type=='BinaryExpression')
            decl = ''+func.expression.left.loc.start.line+' assignment expression '+IdentifierLiteral(func.expression.left)+'  '+BinaryExpression(func.expression.right);
        else
            decl = ''+func.expression.left.loc.start.line+' assignment expression '+IdentifierLiteral(func.expression.left)+'  '+IdentifierLiteral(func.expression.right);
        array.push(decl);
    }
}

function VariableDeclaration(func,array)
{
    for(let i=0; i<func.declarations.length; i++)
    {
        let decl = ''+func.declarations[i].id.loc.start.line+' variable declaration '+func.declarations[i].id.name+'  '+func.declarations[i].init;
        array.push(decl);
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

function WhileStatement(func,array)
{
    let decl = ''+func.test.left.loc.start.line+' while statement '+BinaryExpression(func.test);
    array.push(decl);
    parseProgram(func.body,array);
}
function IfStatement(func,array)
{
    let decl = ''+func.test.left.loc.start.line+' if statement '+BinaryExpression(func.test);
    array.push(decl);
    switchState(func.consequent,array);
    switchState(func.alternate,array);
}
function ReturnStatement(func,array)
{
    let decl = ''+func.loc.start.line+' return statement  '+IdentifierLiteral(func.argument);
    array.push(decl);
}
export {initialParse};
