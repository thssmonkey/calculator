
var idequation = '#equation', idresult = '#result';
var idPI = '#btPI', id0 = '#bt0', id1 = '#bt1', id2 = '#bt2', id3 = '#bt3', id4 = '#bt4', id5 = '#bt5', id6 = '#bt6', id7 = '#bt7', id8 = '#bt8', id9 = '#bt9';
var idadd = '#btadd', idminus = '#btminus', idmulti = '#btmulti', iddivide = '#btdivide', idremain = '#btremain';
var iddot = '#btdot', idequal = '#btequal', idclean = '#btclean', iddel = '#btdel';
var idsin = '#btsin', idcos = '#btcos', idtan = '#bttan', idln = '#btln', idlog = '#btlog';
var idbral = '#btbral', idbrar = '#btbrar', idexp = '#btexp', idfact = '#btfact';
var clsnum = '.num', clsope = '.oper', clssta = '.start', clsend = '.end';

var idx = '#btx';
var idcontrol = '#control';
var idgraph = 'graph', idaxes = '#axes';

function initial() {    
    $(idx).attr("disabled",false);
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
    //finish = false;

    $(idequation).val('y=');
}

window.onload = function(){  
    initial();
}

var beforedot = true;
var firstdigit = true;
var leftbracket = 0;
//var finish = false;

function numend() {
    beforedot = true;
    firstdigit = true;   
}

function clickbt(bt) {   
    // if(finish === true)
    // {
    //     if(typeof bt === "number")
    //         initial();
    //     else
    //     {
    //         var result = $(idresult).val();
    //         initial()
    //         $(idequation).val(result);
    //     }
    // }
    if(typeof bt === "number")
    {
        if(beforedot === true)
        {
            $(iddot).attr("disabled",false);
            if(firstdigit === true)
            {
                if(bt === 0)
                {
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
        $(idx).attr("disabled",false);
        if(leftbracket !== 0)
        {
            $(idequal).attr("disabled",true);
            $(idbrar).attr("disabled",false);
        }
    }
    else if(bt === '.')
    {
        beforedot = false;
        $(idx).attr("disabled",true);
        $(clsnum).attr("disabled",false);
        $(clssta).attr("disabled",true);
        $(idPI).attr("disabled",true);
        $(idminus).attr("disabled",true);
        $(clsope).attr("disabled",true);
        $(clsend).attr("disabled",true);
        $(iddot).attr("disabled",true);
    }
    else if((bt === '(')||(bt === 'sin(')||(bt === 'cos(')||(bt === 'tan(')||(bt === 'ln(')||(bt === 'log('))
    {
        leftbracket += 1;
        $(idbrar).attr("disabled",false);

        $(idx).attr("disabled",false);

        $(iddot).attr("disabled",true);
        $(idfact).attr("disabled",true);
        $(clsope).attr("disabled",true);
        
        $(clsnum).attr("disabled",false);
        $(clssta).attr("disabled",false);
        $(idPI).attr("disabled",false);
        $(idminus).attr("disabled",false);

        numend();
    }
    else if((bt === ')')||(bt === '!')||(bt === 'π')||(bt === 'x'))
    {
        if(bt === ')')
        {
            leftbracket -= 1;
            if(leftbracket === 0)
                $(idbrar).attr("disabled",true);
        }


        $(iddot).attr("disabled",true);
        $(idx).attr("disabled",false);
        $(clsope).attr("disabled",false);
        $(idminus).attr("disabled",false);
        $(idfact).attr("disabled",false);

        if(leftbracket !== 0)
        {
            $(idequal).attr("disabled",true);
            $(idbrar).attr("disabled",false);
        }
        numend();
    }
    else if((bt === '+')||(bt === '-')||(bt === '*')||(bt === '÷')||(bt === '%')||(bt === '^'))
    {
        $(idx).attr("disabled",false);

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

function matchBracket(str, start, right=true)
{
    var num = 0;
    if(right===true)
    {
        for(var i = start; i < str.length; i++)
        {
            if(str.charAt(i)==='(')
                num += 1;
            else if(str.charAt(i)===')')
            {
                if(num===0)
                    return i;
                else
                    num -= 1;
            }
        }
    }
    else
    { 
        for(var i = start; i >= 0; i--)
        {
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
    //result = Math.round(eval(str)*100000)/100000
    return result; 
}

// function equal() {

//     $(iddot).attr("disabled",true);
//     $(idbrar).attr("disabled",true);

//     var equation = $(idequation).val();
//     var result = calculateValue(equation);
//     $(idresult).val(result);
//     finish = true;
// }



var x_start = -5;
var x_range = 10;
var y_start = -3;
var y_range = 6;
var pointnum = 2000;
var left_space = 0; var right_space = 0;
var top_space = 0; var bottom_space = 0;

var idxmin = '#xmin', idxrange = '#xrange', idymin = '#ymin', idyrange = '#yrange';

function draw()
{   
    $(iddot).attr("disabled",true);
    $(idbrar).attr("disabled",true);
    var str = $(idequation).val(); 
    str = str.substring(2);  
    //默认添加乘号
    while(true)
    {
        var match = str.match(/(!|\d|π|x)x/)
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
        var match = str.match(/x(sin|π|\d|\()/)
        if(match!==null)
        {
            var position = match.index;
            str = str.substring(0, position+1) + '*' + str.substring(position+1);
        }
        else
            break;
    }
    str = str.replace(/x/g, '(x)')
    x_start = parseInt($(idxmin).val());
    y_start = parseInt($(idymin).val());
    x_range = parseInt($(idxrange).val());
    y_range = parseInt($(idyrange).val());

    var canvas_width = window.innerWidth;
    var canvas_height = window.innerHeight - $(idcontrol).height();
    var width_draw = canvas_width - left_space - right_space;
    var height_draw = canvas_height - top_space - bottom_space;
    var x_draw_base = left_space;
    var y_draw_base = top_space;
    function transform_x(x){ return x_draw_base + width_draw*(x-x_start)/x_range; }
    function transform_y(y){ return y_draw_base + height_draw*(1 + (y_start - y)/y_range); }

    document.getElementById(idgraph).width = canvas_width;
    document.getElementById(idgraph).height = canvas_height;

    var graph_canvas=document.getElementById(idgraph);
    var graph_context=graph_canvas.getContext("2d");

    graph_context.clearRect(0,0, graph_canvas.width, graph_canvas.height);
    graph_context.strokeStyle="rgba(0, 0, 0, 1)";
    graph_context.beginPath();
    graph_context.lineWidth=2;  
    var x_value = x_start;
    var y_value = calculateValue(str.replace(/x/g,x_value));
    for(var i = 0; i < pointnum; i++)
    {       
        if((y_value<1000)&&(y_value>-1000)){
            graph_context.moveTo(transform_x(x_value), transform_y(y_value));
            x_value = x_start + (x_range)*i/pointnum;
            y_value = calculateValue(str.replace(/x/g,x_value));
            if((y_value<1000)&&(y_value>-1000)){
                //console.log(y_value)
                graph_context.lineTo(transform_x(x_value), transform_y(y_value));
            }
        }
       else{
            x_value = x_start + (x_range)*i/pointnum;
            y_value = calculateValue(str.replace(/x/g,x_value));
       }
    }
    graph_context.stroke();

    var spacing_screen = 100;
    var x_estimate = spacing_screen*x_range/width_draw;
    var y_estimate = spacing_screen*y_range/height_draw;
    function spacingEstimate(spacing_estimate){
        var spacing_result = 0.001;
        while(spacing_result*10<spacing_estimate)
            spacing_result *= 10;
        if(spacing_result*2.5<spacing_estimate)
        {
            spacing_result *= 2.5;
            if(spacing_result*2<spacing_estimate)
                spacing_result *= 2;
        }
        return spacing_result;
    }
    var spacing_x = spacingEstimate(x_estimate);
    var spacing_y = spacingEstimate(y_estimate);
    var x_grid_start = x_start - x_start%spacing_x;
    var y_grid_start = y_start - y_start%spacing_y;
    graph_context.strokeStyle="rgba(255, 0, 0, 0.5)";
    graph_context.beginPath();
    graph_context.lineWidth=1;
    graph_context.font = "24px serif";  
    var x_value = x_grid_start;
    while(x_value<x_start+x_range)
    {
        graph_context.fillText(x_value, transform_x(x_value)+3, (transform_y(y_start)-3));
        graph_context.moveTo(transform_x(x_value), transform_y(y_start))
        graph_context.lineTo(transform_x(x_value), transform_y(y_start+y_range));
        x_value += spacing_x;
    }   
    graph_context.stroke();
    graph_context.strokeStyle="rgba(255, 0, 0, 0.5)";
    graph_context.beginPath();
    graph_context.lineWidth=1;
    graph_context.font = "24px serif";  
    var y_value = y_grid_start;
    while(y_value<y_start+y_range)
    {
        graph_context.fillText(y_value, transform_x(x_start)+3, transform_y(y_value)+24);
        graph_context.moveTo(transform_x(x_start), transform_y(y_value))
        graph_context.lineTo(transform_x(x_start+x_range), transform_y(y_value));
        y_value += spacing_y;
    }
    graph_context.stroke();
    if((x_start<=0)&&(x_start+x_range>=0))
    {
        graph_context.strokeStyle="rgba(0, 0, 0, 1)";
        graph_context.beginPath();
        graph_context.lineWidth=1;
        graph_context.moveTo(transform_x(0), transform_y(y_start))
        graph_context.lineTo(transform_x(0), transform_y(y_start+y_range));
        graph_context.stroke();
    }
    if((y_start<=0)&&(y_start+y_range>=0))
    {
        graph_context.strokeStyle="rgba(0, 0, 0, 1)";
        graph_context.beginPath();
        graph_context.lineWidth=1;
        graph_context.moveTo(transform_x(x_start), transform_y(0))
        graph_context.lineTo(transform_x(x_start+x_range), transform_y(0));
        graph_context.stroke();
    }   
    if(((x_start<=0)&&(x_start+x_range>=0))||((y_start<=0)&&(y_start+y_range>=0)))
    {
        graph_context.font = "24px serif";
        graph_context.fillText('O', transform_x(0)-14, transform_y(0)+22);
    }
}
