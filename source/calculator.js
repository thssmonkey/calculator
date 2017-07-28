var idequation = '#equation', idresult = '#result';
var idPI = '#btPI', id0 = '#bt0', id1 = '#bt1', id2 = '#bt2', id3 = '#bt3', id4 = '#bt4', id5 = '#bt5', id6 = '#bt6', id7 = '#bt7', id8 = '#bt8', id9 = '#bt9';
var idadd = '#btadd', idminus = '#btminus', idmulti = '#btmulti', iddivide = '#btdivide', idremain = '#btremain';
var iddot = '#btdot', idequal = '#btequal', idclean = '#btclean', iddel = '#btdel';
var idsin = '#btsin', idcos = '#btcos', idtan = '#bttan', idln = '#btln', idlog = '#btlog';
var idbral = '#btbral', idbrar = '#btbrar', idexp = '#btexp', idfact = '#btfact';
var clsnum = '.num', clsope = '.oper', clssta = '.start', clsend = '.end';
var idforward = 'btforward', idnext = 'idnext';

var record = [];
var position = -1;

function initial() {    
    $(clsnum).attr("disabled",false);
    $(clssta).attr("disabled",false);
    $(idPI).attr("disabled",false);
    $(idminus).attr("disabled",false);
    $(clsope).attr("disabled",true);
    $(clsend).attr("disabled",true);
    $(iddot).attr("disabled",true);
    beforedot = true;
    firstdigit = true;
    leftbracket = 0;
    finish = false;

    $(idequation).val('');
    $(idresult).val('');
}

function toRecord(forward)
{
    if (record.length > 0) {
        if (forward === true) {
            if(position < record.length-1){
                initial();
                position += 1;   
                $(idequation).val(record[position]);
            }
        }
        else if (position > 0) {
            initial();     
            position -= 1;   
            $(idequation).val(record[position]);
        }
    }
}

window.onload = function(){  
    initial();
}

var beforedot = true;
var firstdigit = true;
var leftbracket = 0;
var finish = false;

function numend() {
    beforedot = true;
    firstdigit = true;   
}

function clickbt(bt) {   
    if(finish === true) {
        if(typeof bt === "number")
            initial();
        else {
            var result = $(idresult).val();
            initial()
            $(idequation).val(result);
        }
    }
    if(typeof bt === "number") {
        if(beforedot === true) {
            $(iddot).attr("disabled",false);
            if(firstdigit === true) {
                if(bt === 0) {
                    $(clsnum).attr("disabled",true);
                    $(clssta).attr("disabled",true);
                    $(idPI).attr("disabled",true);
                }
                firstdigit = false;
            }
        }
        $(clsope).attr("disabled",false);
        $(idfact).attr("disabled",false);
        $(idminus).attr("disabled",false);
        if(leftbracket !== 0) {
            $(idequal).attr("disabled",true);
            $(idbrar).attr("disabled",false);
        }
    }
    else if(bt === '.') {
        beforedot = false;
        $(clsnum).attr("disabled",false);
        $(clssta).attr("disabled",true);
        $(idPI).attr("disabled",true);
        $(idminus).attr("disabled",true);
        $(clsope).attr("disabled",true);
        $(clsend).attr("disabled",true);
        $(iddot).attr("disabled",true);
    }
    else if((bt === '(')||(bt === 'sin(')||(bt === 'cos(')||(bt === 'tan(')||(bt === 'ln(')||(bt === 'log(')) {
        leftbracket += 1;
        $(idbrar).attr("disabled",false);

        $(iddot).attr("disabled",true);
        $(idfact).attr("disabled",true);
        $(clsope).attr("disabled",true);
        
        $(clsnum).attr("disabled",false);
        $(clssta).attr("disabled",false);
        $(idPI).attr("disabled",false);
        $(idminus).attr("disabled",false);

        numend();
    }
    else if((bt === ')')||(bt === '!')||(bt === 'π')) {
        if(bt === ')') {
            leftbracket -= 1;
            if(leftbracket === 0)
                $(idbrar).attr("disabled",true);
        }

        $(iddot).attr("disabled",true);
        $(clsope).attr("disabled",false);
        $(idminus).attr("disabled",false);
        $(idfact).attr("disabled",false);

        if(leftbracket !== 0) {
            $(idequal).attr("disabled",true);
            $(idbrar).attr("disabled",false);
        }
        numend();
    }
    else if((bt === '+')||(bt === '-')||(bt === '×')||(bt === '÷')||(bt === '%')||(bt === '^')) {
        $(iddot).attr("disabled",true);
        $(clsope).attr("disabled",true);
        $(clsend).attr("disabled",true);
        $(idminus).attr("disabled",true);
        $(clsnum).attr("disabled",false);
        $(clssta).attr("disabled",false);
        $(idPI).attr("disabled",false);

        numend();
    }

    var equation = $(idequation).val() + bt;
    $(idequation).val(equation);
}

function matchBracket(str, start, right=true) {
    var num = 0;
    if (right===true) {
        for (var i = start; i < str.length; i++) {
            if(str.charAt(i)==='(')
                num += 1;
            else if(str.charAt(i)===')') {
                if(num===0)
                    return i;
                else
                    num -= 1;
            }
        }
    }
    else { 
        for (var i = start; i >= 0; i--) {
            if(str.charAt(i)===')')
                num += 1;
            else if(str.charAt(i)==='(')
            {
                if(num===0)
                    return i;
                else
                    num -= 1;
            }
        } 
    }
    return -1;
}

function calculateValue(str)
{
    //默认添加乘法算符
    while(true)
    {
        var match = str.match(/(!|\d|π)\(/)
        if(match!==null)
        {
            var position = match.index;
            str = str.substring(0, position+1) + '*' + str.substring(position+1);
        }
        else
            break;
    }
    while(true)
    {
        var match = str.match(/\)[^\+\-\*\×\/\÷\%\^\)!]/)
        if(match!==null)
        {
            var position = match.index;
            str = str.substring(0, position+1) + '*' + str.substring(position+1);
        }
        else
            break;
    }
    while(true)
    {
        var match = str.match(/[^\+\-\*\×\/\÷\%\^\(!](sin|cos|tan|ln|log|π)/)
        if(match!==null)
        {
            var position = match.index;
            str = str.substring(0, position+1) + '*' + str.substring(position+1);
        }
        else
            break;
    }
    //去除无用小数点
    while(true)
    {
        var match = str.match(/\.[^\dP]/)
        if(match!==null)
        {
            var position = match.index;
            str = str.substring(0, position) + str.substring(position+1);
        }
        else
            break;
    }
    //小数点前默认为0
    while(true)
    {
        var match = str.match(/[^\d]\.\d/)
        if(match!==null)
        {
            var position = match.index;
            str = str.substring(0, position+1) + '0' + str.substring(position+1);
        }
        else
            break;
    }
    //去掉多重括号
    while(true)
    {
        var match = str.match(/\(\(.*\)\)/)
        if(match!==null)
        {
            var position = match.index;
            var matchstr = match[0];
            str = str.substring(0, position) + matchstr.substring(1,matchstr.length-1) + str.substring(position+matchstr.length);
        }
        else
            break;
    }


    str=str.replace(/×/g, '*');  
    str=str.replace(/÷/g, '/');  
    str=str.replace(/π/g, 'Math.PI');
    str=str.replace(/\(\)/, '(0)');

    //运算自带括号的前置单目运算符sin, cos, tan, ln, log
    while(true)
    {
        var start = str.indexOf('sin');
        if(start!==-1)
        {
            var end = matchBracket(str, start+4);
            if(end!==-1)
            {
                var temp = calculateValue(str.substring(start+4, end));
                if(temp===false)
                    return false;
                else
                {
                    temp = Math.sin(temp);
                    str = str.substring(0,start) + '(' + temp + ')' + str.substring(end+1);
                }
            }
        }
        else
            break;
    }
    while(true)
    {
        var start = str.indexOf('cos');
        if(start!==-1)
        {
            var end = matchBracket(str, start+4);
            if(end!==-1)
            {
                var temp = calculateValue(str.substring(start+4, end));
                if(temp===false)
                    return false;
                else
                {
                    temp = Math.cos(temp);
                    str = str.substring(0,start) + '(' + temp + ')' + str.substring(end+1);
                }
            }
        }
        else
            break;
    }
    while(true)
    {
        var start = str.indexOf('tan');
        if(start!==-1)
        {
            var end = matchBracket(str, start+4);
            if(end!==-1)
            {
                var temp = calculateValue(str.substring(start+4, end));
                if(temp===false)
                    return false;
                else
                {
                    temp = Math.tan(temp);
                    str = str.substring(0,start) + '(' + temp + ')' + str.substring(end+1);
                }
            }
        }
        else
            break;
    }
    while(true)
    {
        var start = str.indexOf('ln');
        if(start!==-1)
        {
            var end = matchBracket(str, start+3);
            if(end!==-1)
            {
                var temp = calculateValue(str.substring(start+3, end));
                if(temp===false)
                    return false;
                else
                {
                    temp = Math.log(temp);
                    str = str.substring(0,start) + '(' + temp + ')' + str.substring(end+1);
                }
            }
        }
        else
            break;
    }
    while(true)
    {
        var start = str.indexOf('log');
        if(start!==-1)
        {
            var end = matchBracket(str, start+4);
            if(end!==-1)
            {
                var temp = calculateValue(str.substring(start+4, end));
                if(temp===false)
                    return false;
                else
                {
                    temp = Math.log(temp)/Math.log(10);
                    str = str.substring(0,start) + '(' + temp + ')' + str.substring(end+1);
                }
            }
        }
        else
            break;
    }

    //运算阶乘
    while(true)
    {
        var match = str.match(/(\(.*\)|\d*\.?\d*|Math.PI)!/);
        if(match!==null)
        {
            var matchstr = match[0];
            var numstr = matchstr.substring(0,matchstr.length-1);
            if(matchstr.charAt(0)==='(')
            {
                var start = matchBracket(matchstr, matchstr.length-3, false)
                if(start===-1)
                    return false;
                else
                {
                    matchstr = matchstr.substring(start);
                    numstr = numstr.substring(start);
                    numstr = calculateValue(numstr);
                    if(numstr===false)
                        return false;
                }
            }
            var num = eval(numstr);
            if(num<0)
                num = 0 - num;
            var temp = 1;
            for(var i = 1; i <= num; i++)
                temp *= i;
            temp = '(' + temp + ')';
            str = str.replace(matchstr,temp);
        }
        else
            break;
    }

    //运算幂次
    while(true)
    {
        var match = str.match(/(\(.*\)|\d+\.?\d*|Math.PI)\^(\(.*\)|\d+\.?\d*|Math.PI)/);
        if(match!==null)
        {
            var matchstr = match[0];
            var separate = matchstr.split('^');
            var basestr = separate[0];
            var expstr = separate[1];
            if(basestr.charAt(0)==='(')
            {
                var start = matchBracket(basestr, basestr.length-2, false)
                if(start===-1)
                    return false;
                else
                {
                    matchstr = matchstr.substring(start);
                    basestr = basestr.substring(start);
                    basestr = calculateValue(basestr);
                    if(basestr===false)
                        return false;
                    basestr += ''
                }
            }
            if(expstr.charAt(0)==='(')
            {
                var end = matchBracket(expstr, 1)
                if(end===-1)
                    return false;
                else
                {
                    matchstr = matchstr.substring(0, matchstr.length+expstr.length-end);
                    expstr = expstr.substring(0, end+1);
                    expstr = calculateValue(expstr);
                    if(expstr===false)
                        return false;
                }
            }
            var base = eval(basestr);
            var exp = eval(expstr);
            var temp = Math.pow(base, exp);
            temp = '(' + temp + ')';
            str = str.replace(matchstr, temp);
        }
        else
            break;
    }

    //运算所有括号
    while(true)
    { 
        var start = str.indexOf('(');
        if(start!==-1){
            var end = matchBracket(str,start+1);
            if(end<start)
                return false;
            else
            {
                var temp = calculateValue(str.substring(start+1, end));
                if(temp===false)
                    return false;
                else
                    str = str.substring(0, start) + temp + str.substring(end+1);
            }
        }
        else
            break;
    }
    
    var result = eval(str);
    result = Math.round(eval(str)*100000)/100000
    return result; 
}

function equal() {

    $(iddot).attr("disabled",true);
    $(idbrar).attr("disabled",true);

    var equation = $(idequation).val();
    var result = calculateValue(equation);
    record.unshift(result);
    position = -1;
    $(idresult).val(result);
    finish = true;
}