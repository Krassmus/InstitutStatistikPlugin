// THIS FILE HAS BEEN MINIFIED

if(typeof(RGraph) == 'undefined') RGraph = {};RGraph.Funnel = function (id, data)
{
this.id = id;this.canvas = document.getElementById(id);this.context = this.canvas.getContext ? this.canvas.getContext("2d") : null;this.canvas.__object__ = this;this.type = 'funnel';this.coords = [];this.isRGraph = true;RGraph.OldBrowserCompat(this.context);if(!this.canvas){
alert('[FUNNEL] No canvas support');return;}
this.properties = {
'chart.strokestyle':           'black',
'chart.gutter.left':           25,
'chart.gutter.right':          25,
'chart.gutter.top':            25,
'chart.gutter.bottom':         25,
'chart.labels':                null,
'chart.title':                 '',
'chart.title.background':       null,
'chart.title.hpos':             null,
'chart.title.vpos':            null,
'chart.colors':                ['red', 'green', 'gray', 'blue', 'black', 'gray'],
'chart.text.size':             10,
'chart.text.boxed':            true,
'chart.text.halign':           'left',
'chart.text.color':            'black',
'chart.text.font':             'Verdana',
'chart.contextmenu':           null,
'chart.shadow':                false,
'chart.shadow.color':          '#666',
'chart.shadow.blur':           3,
'chart.shadow.offsetx':        3,
'chart.shadow.offsety':        3,
'chart.key':                    [],
'chart.key.background':         'white',
'chart.key.position':           'graph',
'chart.key.halign':             'right',
'chart.key.shadow':             false,
'chart.key.shadow.color':       '#666',
'chart.key.shadow.blur':        3,
'chart.key.shadow.offsetx':     2,
'chart.key.shadow.offsety':     2,
'chart.key.position.gutter.boxed': true,
'chart.key.position.x':         null,
'chart.key.position.y':         null,
'chart.key.color.shape':        'square',
'chart.key.rounded':            true,
'chart.key.linewidth':          1,
'chart.tooltips':               null,
'chart.tooltips.effect':        'fade',
'chart.tooltips.css.class':     'RGraph_tooltip',
'chart.highlight.stroke':       'black',
'chart.highlight.fill':         'rgba(255,255,255,0.5)',
'chart.tooltips.highlight':     true,
'chart.annotatable':           false,
'chart.annotate.color':        'black',
'chart.zoom.factor':           1.5,
'chart.zoom.fade.in':          true,
'chart.zoom.fade.out':         true,
'chart.zoom.factor':           1.5,
'chart.zoom.fade.in':          true,
'chart.zoom.fade.out':         true,
'chart.zoom.hdir':             'right',
'chart.zoom.vdir':             'down',
'chart.zoom.frames':           10,
'chart.zoom.delay':            50,
'chart.zoom.shadow':           true,
'chart.zoom.mode':             'canvas',
'chart.zoom.thumbnail.width':  75,
'chart.zoom.thumbnail.height': 75,
'chart.zoom.background':        true,
'chart.zoom.action':            'zoom',
'chart.resizable':              false,
'chart.resize.handle.adjust':   [0,0],
'chart.resize.handle.background': null
}
this.data = data;}
RGraph.Funnel.prototype.Set = function (name, value)
{
this.properties[name.toLowerCase()] = value;}
RGraph.Funnel.prototype.Get = function (name)
{
return this.properties[name.toLowerCase()];}
RGraph.Funnel.prototype.Draw = function ()
{
RGraph.FireCustomEvent(this, 'onbeforedraw');RGraph.ClearEventListeners(this.id);this.gutterLeft = this.Get('chart.gutter.left');this.gutterRight = this.Get('chart.gutter.right');this.gutterTop = this.Get('chart.gutter.top');this.gutterBottom = this.Get('chart.gutter.bottom');this.coords = [];RGraph.DrawTitle(this.canvas, this.Get('chart.title'), this.gutterTop, null, this.Get('chart.text.size') + 2);this.DrawFunnel();if(this.Get('chart.contextmenu')){
RGraph.ShowContext(this);}
if(this.Get('chart.tooltips')){
RGraph.Register(this);var canvas_onclick_func = function (e)
{
RGraph.Redraw();var e = RGraph.FixEventObject(e);var canvas = e.target;var context = canvas.getContext('2d');var obj = canvas.__object__;var mouseCoords = RGraph.getMouseXY(e);var coords = obj.coords;var x = mouseCoords[0];var y = mouseCoords[1];for (i=0; i<coords.length; ++i){
if(
x > coords[i][0]
&& x < coords[i][2]
&& y > coords[i][1]
&& y < coords[i][5]
){
if(x > coords[i][4]){
var w1 = coords[i][2] - coords[i][4];var h1 = coords[i][5] - coords[i][3];;var a1 = Math.atan(h1 / w1) * 57.3;var w2 = coords[i][2] - mouseCoords[0];var h2 = mouseCoords[1] - coords[i][1];var a2 = Math.atan(h2 / w2) * 57.3;if(a2 > a1){
continue;}
} else if(x < coords[i][6]){
var w1 = coords[i][6] - coords[i][0];var h1 = coords[i][7] - coords[i][1];;var a1 = Math.atan(h1 / w1) * 57.3;var w2 = mouseCoords[0] - coords[i][0];var h2 = mouseCoords[1] - coords[i][1];var a2 = Math.atan(h2 / w2) * 57.3;if(a2 > a1){
continue;}
}
if(!obj.Get('chart.tooltips')[i] && typeof(obj.Get('chart.tooltips')) != 'function'){
break;}
context.beginPath();RGraph.NoShadow(obj);context.strokeStyle = obj.Get('chart.highlight.stroke');context.fillStyle = obj.Get('chart.highlight.fill');context.moveTo(coords[i][0], coords[i][1]);context.lineTo(coords[i][2], coords[i][3]);context.lineTo(coords[i][4], coords[i][5]);context.lineTo(coords[i][6], coords[i][7]);context.closePath();context.stroke();context.fill();if(obj.Get('chart.key').length && obj.Get('chart.key.position') == 'graph'){
RGraph.DrawKey(obj, obj.Get('chart.key'), obj.Get('chart.colors'));}
if(obj.Get('chart.labels')){
obj.DrawLabels();}
if(typeof(obj.Get('chart.tooltips')) == 'function'){
var text = obj.Get('chart.tooltips')(i);} else if(typeof(obj.Get('chart.tooltips')) == 'object' && typeof(obj.Get('chart.tooltips')[i]) == 'function'){
var text = obj.Get('chart.tooltips')[i](i);} else if(typeof(obj.Get('chart.tooltips')) == 'object'){
var text = obj.Get('chart.tooltips')[i];} else {
var text = '';}
RGraph.Tooltip(canvas, text, e.pageX, e.pageY, i);e.stopPropagation();break;}
}
}
this.canvas.addEventListener('click', canvas_onclick_func, false);RGraph.AddEventListener(this.id, 'click', canvas_onclick_func);var canvas_onmousemove_func = function (e)
{
var e = RGraph.FixEventObject(e);var canvas = e.target;var context = canvas.getContext('2d');var obj = canvas.__object__;var overFunnel = false;var coords = obj.coords;var mouseCoords = RGraph.getMouseXY(e);var x = mouseCoords[0];var y = mouseCoords[1];for (i=0; i<coords.length; ++i){
if(
x > coords[i][0]
&& x < coords[i][2]
&& y > coords[i][1]
&& y < coords[i][5]
){
if(x > coords[i][4]){
var w1 = coords[i][2] - coords[i][4];var h1 = coords[i][5] - coords[i][3];;var a1 = Math.atan(h1 / w1) * 57.3;var w2 = coords[i][2] - mouseCoords[0];var h2 = mouseCoords[1] - coords[i][1];var a2 = Math.atan(h2 / w2) * 57.3;if(a2 > a1){
continue;}
} else if(x < coords[i][6]){
var w1 = coords[i][6] - coords[i][0];var h1 = coords[i][7] - coords[i][1];;var a1 = Math.atan(h1 / w1) * 57.3;var w2 = mouseCoords[0] - coords[i][0];var h2 = mouseCoords[1] - coords[i][1];var a2 = Math.atan(h2 / w2) * 57.3;if(a2 > a1){
continue;}
}
if(!obj.Get('chart.tooltips')[i] && typeof(obj.Get('chart.tooltips')) != 'function'){
break;}
overFunnel = true;canvas.style.cursor = 'pointer';e.stopPropagation();break;}
}
if(!overFunnel){
canvas.style.cursor = 'default';canvas.style.cursor = 'default';}
}
this.canvas.addEventListener('mousemove', canvas_onmousemove_func, false);RGraph.AddEventListener(this.id, 'mousemove', canvas_onmousemove_func);}
this.DrawLabels();if(this.Get('chart.annotatable')){
RGraph.Annotate(this);}
if(this.Get('chart.zoom.mode') == 'thumbnail'|| this.Get('chart.zoom.mode') == 'area'){
RGraph.ShowZoomWindow(this);}
if(this.Get('chart.resizable')){
RGraph.AllowResizing(this);}
RGraph.FireCustomEvent(this, 'ondraw');}
RGraph.Funnel.prototype.DrawFunnel = function ()
{
var context = this.context;var canvas = this.canvas;var width = RGraph.GetWidth(this) - this.gutterLeft - this.gutterRight;var height = RGraph.GetHeight(this) - this.gutterTop - this.gutterBottom;var total = RGraph.array_max(this.data);var accheight = this.gutterTop;if(this.Get('chart.shadow')){
context.shadowColor = this.Get('chart.shadow.color');context.shadowBlur = this.Get('chart.shadow.blur');context.shadowOffsetX = this.Get('chart.shadow.offsetx');context.shadowOffsetY = this.Get('chart.shadow.offsety');}
for (i=0; i<this.data.length; ++i){
i = Number(i);var firstvalue = this.data[0];var firstwidth = (firstvalue / total) * width;var curvalue = this.data[i];var curwidth = (curvalue / total) * width;var curheight = height / this.data.length;var halfCurWidth = (curwidth / 2);var nextvalue = this.data[i + 1] ?  this.data[i + 1] : 0;var nextwidth = this.data[i + 1] ? (nextvalue / total) * width : 0;var halfNextWidth = (nextwidth / 2);var center = this.gutterLeft + (firstwidth / 2);if(i == 0){
var x1 = center - halfCurWidth;var y1 = this.gutterTop;var x2 = center + halfCurWidth;var y2 = this.gutterTop;var x3 = center + halfNextWidth;var y3 = accheight + curheight;var x4 = center - halfNextWidth;var y4 = accheight + curheight;} else {
var x1 = center - halfCurWidth;var y1 = accheight;var x2 = center + halfCurWidth;var y2 = accheight;var x3 = center + halfNextWidth;var y3 = accheight + curheight;var x4 = center - halfNextWidth;var y4 = accheight + curheight;}
if(document.all && this.Get('chart.shadow')){
this.DrawIEShadow([x1, y1, x2, y2, x3, y3, x4, y4], i > 0 && this.Get('chart.shadow.offsety') < 0);}
context.strokeStyle = this.Get('chart.strokestyle');context.fillStyle = this.Get('chart.colors')[i];context.beginPath();context.moveTo(x1, y1);context.lineTo(x2, y2);context.lineTo(x3, y3);context.lineTo(x4, y4);context.closePath();this.coords.push([x1, y1, x2, y2, x3, y3, x4, y4]);if(!this.Get('chart.shadow')){
context.stroke();}
context.fill();accheight += curheight;}
if(this.Get('chart.shadow')){
RGraph.NoShadow(this);for (i=0; i<this.coords.length; ++i){
context.strokeStyle = this.Get('chart.strokestyle');context.fillStyle = this.Get('chart.colors')[i];context.beginPath();context.moveTo(this.coords[i][0], this.coords[i][1]);context.lineTo(this.coords[i][2], this.coords[i][3]);context.lineTo(this.coords[i][4], this.coords[i][5]);context.lineTo(this.coords[i][6], this.coords[i][7]);context.closePath();context.stroke();context.fill();}
}
if(this.Get('chart.key') && this.Get('chart.key').length){
RGraph.DrawKey(this, this.Get('chart.key'), this.Get('chart.colors'));}
}
RGraph.Funnel.prototype.DrawLabels = function ()
{
if(this.Get('chart.labels') && this.Get('chart.labels').length > 0){
var context = this.context;for (var j=0; j<this.coords.length; ++j){
context.beginPath();context.strokeStyle = 'black';context.fillStyle = this.Get('chart.text.color');RGraph.NoShadow(this);var label = this.Get('chart.labels')[j];RGraph.Text(context,
this.Get('chart.text.font'),
this.Get('chart.text.size'),
this.Get('chart.text.halign') == 'left' ? (this.gutterLeft - 15) : ((this.canvas.width - this.gutterLeft - this.gutterRight) / 2) + this.gutterLeft,
this.coords[j][1],
label,
'center',
this.Get('chart.text.halign') == 'left' ? 'left' : 'center',
true,
null,
this.Get('chart.text.boxed') ? 'white' : null);}
}
}
RGraph.Funnel.prototype.DrawIEShadow = function (coords, noOffset)
{
var prevFillStyle = this.context.fillStyle;var offsetx = this.Get('chart.shadow.offsetx');var offsety = this.Get('chart.shadow.offsety');var context = this.context;context.lineWidth = 1;context.fillStyle = this.Get('chart.shadow.color');context.beginPath();context.moveTo(coords[0] + (noOffset ? 0 : offsetx), coords[1] + (noOffset ? 0 : offsety));context.lineTo(coords[2] + (noOffset ? 0 : offsetx), coords[3] + (noOffset ? 0 : offsety));context.lineTo(coords[4] + (noOffset ? 0 : offsetx), coords[5] + (noOffset ? 0 : offsety));context.lineTo(coords[6] + (noOffset ? 0 : offsetx), coords[7] + (noOffset ? 0 : offsety));context.closePath();context.fill();this.context.fillStyle = prevFillStyle;}