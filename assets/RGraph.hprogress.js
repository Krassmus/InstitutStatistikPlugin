// THIS FILE HAS BEEN MINIFIED

if(typeof(RGraph) == 'undefined') RGraph = {};RGraph.HProgress = function (id, value, max)
{
this.id = id;this.max = max;this.value = value;this.canvas = document.getElementById(id);this.context = this.canvas.getContext('2d');this.canvas.__object__ = this;this.type = 'hprogress';this.coords = [];this.isRGraph = true;RGraph.OldBrowserCompat(this.context);this.properties = {
'chart.min':                0,
'chart.colors':             ['#0c0'],
'chart.tickmarks':          true,
'chart.tickmarks.color':    'black',
'chart.tickmarks.inner':    false,
'chart.gutter.left':        25,
'chart.gutter.right':       25,
'chart.gutter.top':         25,
'chart.gutter.bottom':      25,
'chart.numticks':           10,
'chart.numticks.inner':     50,
'chart.background.color':   '#eee',
'chart.shadow':             false,
'chart.shadow.color':       'rgba(0,0,0,0.5)',
'chart.shadow.blur':        3,
'chart.shadow.offsetx':     3,
'chart.shadow.offsety':     3,
'chart.title':              '',
'chart.title.background':   null,
'chart.title.hpos':         null,
'chart.title.vpos':         null,
'chart.width':              0,
'chart.height':             0,
'chart.text.size':          10,
'chart.text.color':         'black',
'chart.text.font':          'Verdana',
'chart.contextmenu':        null,
'chart.units.pre':          '',
'chart.units.post':         '',
'chart.tooltips':           [],
'chart.tooltips.effect':    'fade',
'chart.tooltips.css.class': 'RGraph_tooltip',
'chart.tooltips.highlight': true,
'chart.highlight.stroke':   'black',
'chart.highlight.fill':     'rgba(255,255,255,0.5)',
'chart.annotatable':        false,
'chart.annotate.color':     'black',
'chart.zoom.mode':          'canvas',
'chart.zoom.factor':        1.5,
'chart.zoom.fade.in':       true,
'chart.zoom.fade.out':      true,
'chart.zoom.hdir':          'right',
'chart.zoom.vdir':          'down',
'chart.zoom.frames':        10,
'chart.zoom.delay':         50,
'chart.zoom.shadow':        true,
'chart.zoom.background':    true,
'chart.zoom.thumbnail.width': 100,
'chart.zoom.thumbnail.height': 100,
'chart.arrows':             false,
'chart.margin':             0,
'chart.resizable':              false,
'chart.resize.handle.adjust':   [0,0],
'chart.resize.handle.background': null,
'chart.label.inner':        false,
'chart.adjustable':         false,
'chart.scale.decimals':     0,
'chart.key':                [],
'chart.key.background':     'white',
'chart.key.position':       'gutter',
'chart.key.halign':             'right',
'chart.key.shadow':         false,
'chart.key.shadow.color':   '#666',
'chart.key.shadow.blur':    3,
'chart.key.shadow.offsetx': 2,
'chart.key.shadow.offsety': 2,
'chart.key.position.gutter.boxed': false,
'chart.key.position.x':     null,
'chart.key.position.y':     null,
'chart.key.color.shape':    'square',
'chart.key.rounded':        true,
'chart.key.linewidth':      1,
'chart.key.color.shape':    'square',
'chart.labels.position':     'bottom'
}
if(!this.canvas){
alert('[PROGRESS] No canvas support');return;}
}
RGraph.HProgress.prototype.Set = function (name, value)
{
this.properties[name.toLowerCase()] = value;}
RGraph.HProgress.prototype.Get = function (name)
{
return this.properties[name.toLowerCase()];}
RGraph.HProgress.prototype.Draw = function ()
{
RGraph.FireCustomEvent(this, 'onbeforedraw');RGraph.ClearEventListeners(this.id);this.gutterLeft = this.Get('chart.gutter.left');this.gutterRight = this.Get('chart.gutter.right');this.gutterTop = this.Get('chart.gutter.top');this.gutterBottom = this.Get('chart.gutter.bottom');this.width = RGraph.GetWidth(this) - this.gutterLeft - this.gutterRight;this.height = RGraph.GetHeight(this) - this.gutterTop - this.gutterBottom;this.coords = [];this.Drawbar();this.DrawTickMarks();this.DrawLabels();this.context.stroke();this.context.fill();if(this.Get('chart.contextmenu')){
RGraph.ShowContext(this);}
if(typeof(this.Get('chart.tooltips')) == 'function' || this.Get('chart.tooltips').length){
RGraph.Register(this);var window_onclick = function ()
{
RGraph.Redraw();}
window.addEventListener('click', window_onclick, false);RGraph.AddEventListener('window_' + this.id, 'click', window_onclick);var canvas_onclick_func = function (e)
{
e = RGraph.FixEventObject(e);var canvas = document.getElementById(this.id);var obj = canvas.__object__;RGraph.Redraw();var mouseCoords = RGraph.getMouseXY(e);for (var i=0; i<obj.coords.length; i++){
var mouseX = mouseCoords[0];var mouseY = mouseCoords[1];var left = obj.coords[i][0];var top = obj.coords[i][1];var width = obj.coords[i][2];var height = obj.coords[i][3];var idx = i;if(mouseX >= left && mouseX <= (left + width) && mouseY >= top && mouseY <= (top + height) ){
if(typeof(obj.Get('chart.tooltips')) == 'function'){
var text = obj.Get('chart.tooltips')(idx);} else if(typeof(obj.Get('chart.tooltips')) == 'object' && typeof(obj.Get('chart.tooltips')[idx]) == 'function'){
var text = obj.Get('chart.tooltips')[idx](idx);} else if(typeof(obj.Get('chart.tooltips')) == 'object'){
var text = obj.Get('chart.tooltips')[idx];} else {
var text = null;}
if(text){
obj.context.beginPath();obj.context.strokeStyle = obj.Get('chart.highlight.stroke');obj.context.fillStyle = obj.Get('chart.highlight.fill');obj.context.strokeRect(left, top, width, height);obj.context.fillRect(left, top, width, height);obj.context.stroke();obj.context.fill();RGraph.Tooltip(canvas, text, e.pageX, e.pageY, i);}
}
}
e.stopPropagation();}
this.canvas.addEventListener('click', canvas_onclick_func, false);RGraph.AddEventListener(this.id, 'click', canvas_onclick_func);var canvas_onmousemove_func = function (e)
{
e = RGraph.FixEventObject(e);var canvas = document.getElementById(this.id);var obj = canvas.__object__;var mouseCoords = RGraph.getMouseXY(e);for (var i=0; i<obj.coords.length; i++){
var mouseX = mouseCoords[0];var mouseY = mouseCoords[1];var left = obj.coords[i][0];var top = obj.coords[i][1];var width = obj.coords[i][2];var height = obj.coords[i][3];if(mouseX >= left && mouseX <= (left + width) && mouseY >= top && mouseY <= (top + height) ){
canvas.style.cursor = 'pointer';break;}
canvas.style.cursor = 'default';}
}
this.canvas.addEventListener('mousemove', canvas_onmousemove_func, false);RGraph.AddEventListener(this.id, 'mousemove', canvas_onmousemove_func);}
if(this.Get('chart.annotatable')){
RGraph.Annotate(this);}
if(this.Get('chart.key').length){
RGraph.DrawKey(this, this.Get('chart.key'), this.Get('chart.colors'));}
if(this.Get('chart.zoom.mode') == 'thumbnail' || this.Get('chart.zoom.mode') == 'area'){
RGraph.ShowZoomWindow(this);}
if(this.Get('chart.resizable')){
RGraph.AllowResizing(this);}
if(this.Get('chart.adjustable')){
RGraph.AllowAdjusting(this);}
RGraph.FireCustomEvent(this, 'ondraw');}
RGraph.HProgress.prototype.Drawbar = function ()
{
if(this.Get('chart.shadow')){
RGraph.SetShadow(this, this.Get('chart.shadow.color'), this.Get('chart.shadow.offsetx'), this.Get('chart.shadow.offsety'), this.Get('chart.shadow.blur'));}
if(RGraph.isIE8() && this.Get('chart.shadow')){
this.context.fillStyle = this.Get('chart.shadow.color');this.context.fillRect(this.gutterLeft + this.Get('chart.shadow.offsetx'), this.gutterTop + this.Get('chart.shadow.offsety'), this.width, this.height);}
this.context.fillStyle = this.Get('chart.background.color');this.context.strokeStyle = 'black';this.context.strokeRect(this.gutterLeft, this.gutterTop, this.width, this.height);this.context.fillRect(this.gutterLeft, this.gutterTop, this.width, this.height);RGraph.NoShadow(this);this.context.fillStyle = this.Get('chart.color');this.context.strokeStyle = 'black';var margin = this.Get('chart.margin');var barWidth = Math.min(this.width, ((RGraph.array_sum(this.value) - this.Get('chart.min')) / (this.max - this.Get('chart.min')) ) * this.width);if(this.Get('chart.tickmarks.inner')){
var spacing = (RGraph.GetWidth(this) - this.gutterLeft - this.gutterRight) / this.Get('chart.numticks.inner');this.context.lineWidth = 1;this.context.strokeStyle = '#999';this.context.beginPath();for (var x = this.gutterLeft; x<RGraph.GetWidth(this) - this.gutterRight; x+=spacing){
this.context.moveTo(x, this.gutterTop);this.context.lineTo(x, this.gutterTop + 2);this.context.moveTo(x, RGraph.GetHeight(this) - this.gutterBottom);this.context.lineTo(x, RGraph.GetHeight(this) - this.gutterBottom - 2);}
this.context.stroke();}
if(typeof(this.value) == 'number'){
this.context.beginPath();this.context.strokeStyle = 'black';this.context.fillStyle = this.Get('chart.colors')[0];this.context.strokeRect(this.gutterLeft, this.gutterTop + margin, barWidth, this.height - margin - margin);this.context.fillRect(this.gutterLeft, this.gutterTop + margin, barWidth, this.height - margin - margin);this.coords.push([this.gutterLeft,
this.gutterTop + margin,
barWidth,
this.height - margin - margin]);} else if(typeof(this.value) == 'object'){
this.context.beginPath();this.context.strokeStyle = 'black';var startPoint = this.gutterLeft;for (var i=0; i<this.value.length; ++i){
var segmentLength = (this.value[i] / RGraph.array_sum(this.value)) * barWidth;this.context.fillStyle = this.Get('chart.colors')[i];this.context.strokeRect(startPoint, this.gutterTop + margin, segmentLength, this.height - margin - margin);this.context.fillRect(startPoint, this.gutterTop + margin, segmentLength, this.height - margin - margin);this.coords.push([startPoint,
this.gutterTop + margin,
segmentLength,
this.height - margin - margin]);startPoint += segmentLength;}
}
if(this.Get('chart.arrows')){
var x = this.gutterLeft + barWidth;var y = this.gutterTop;this.context.lineWidth = 1;this.context.fillStyle = 'black';this.context.strokeStyle = 'black';this.context.beginPath();this.context.moveTo(x, y - 3);this.context.lineTo(x + 2, y - 7);this.context.lineTo(x - 2, y - 7);this.context.closePath();this.context.stroke();this.context.fill();this.context.beginPath();this.context.moveTo(x, y + this.height + 4);this.context.lineTo(x + 2, y + this.height + 9);this.context.lineTo(x - 2, y + this.height + 9);this.context.closePath();this.context.stroke();this.context.fill()
if(this.Get('chart.label.inner')){
this.context.beginPath();this.context.fillStyle = 'black';RGraph.Text(this.context, this.Get('chart.text.font'), this.Get('chart.text.size') + 2, this.gutterLeft + barWidth + 5, RGraph.GetHeight(this) / 2, String(this.Get('chart.units.pre') + this.value + this.Get('chart.units.post')), 'center', 'left');this.context.fill();}
}
}
RGraph.HProgress.prototype.DrawTickMarks = function ()
{
var context = this.context;context.strokeStyle = this.Get('chart.tickmarks.color');if(this.Get('chart.tickmarks')){
this.context.beginPath();        
this.tickInterval = this.width / this.Get('chart.numticks');var start = this.Get('chart.tickmarks.zerostart') ? 0 : this.tickInterval;if(this.Get('chart.labels.position') == 'top'){
for (var i=this.gutterLeft + start; i<=(this.width + this.gutterLeft); i+=this.tickInterval){
context.moveTo(i, this.gutterTop);context.lineTo(i, this.gutterTop - 4);}
} else {
for (var i=this.gutterLeft + start; i<=(this.width + this.gutterLeft); i+=this.tickInterval){
context.moveTo(i, this.gutterTop + this.height);context.lineTo(i, this.gutterTop + this.height + 4);}
}
this.context.stroke();}
}
RGraph.HProgress.prototype.DrawLabels = function ()
{
var context = this.context;this.context.fillStyle = this.Get('chart.text.color');var xPoints = [];var yPoints = [];for (i=this.gutterLeft + this.tickInterval; i <= (this.gutterLeft + this.width); i+= this.tickInterval){
xPoints.push(i);yPoints.push(this.gutterTop + this.height + 4);}
var font = this.Get('chart.text.font');var size = this.Get('chart.text.size');this.context.beginPath();if(this.Get('chart.labels.position') == 'top'){
for (i=0; i<xPoints.length; ++i){
RGraph.Text(context,font,size,xPoints[i],yPoints[i] - this.height - 4 - 4 - 2,this.Get('chart.units.pre') + String((((this.max - this.Get('chart.min')) / xPoints.length) * (i + 1) + this.Get('chart.min')).toFixed(this.Get('chart.scale.decimals'))) + this.Get('chart.units.post'),'bottom','center');}
if(this.Get('chart.tickmarks.zerostart')){
RGraph.Text(this.context,font,size,this.gutterLeft,this.gutterTop - 4 - 2,this.Get('chart.units.pre') + Number(this.Get('chart.min')).toFixed(this.Get('chart.scale.decimals')) + this.Get('chart.units.post'),'bottom','center');}
} else {
for (i=0; i<xPoints.length; ++i){
RGraph.Text(this.context,font,size,xPoints[i],yPoints[i],this.Get('chart.units.pre') + String((((this.max - this.Get('chart.min')) / xPoints.length) * (i + 1) + this.Get('chart.min')).toFixed(this.Get('chart.scale.decimals'))) + this.Get('chart.units.post'),'top','center');}
if(this.Get('chart.tickmarks.zerostart')){
RGraph.Text(this.context,font,size,this.gutterLeft,RGraph.GetHeight(this) - this.gutterBottom + 4,this.Get('chart.units.pre') + Number(this.Get('chart.min')).toFixed(this.Get('chart.scale.decimals')) + this.Get('chart.units.post'),'top','center');}
}
if(this.Get('chart.title')){
RGraph.DrawTitle(this.canvas,
this.Get('chart.title'),
this.gutterTop + this.Get('chart.text.size'),
0,
this.Get('chart.text.size') + 2);}
}
