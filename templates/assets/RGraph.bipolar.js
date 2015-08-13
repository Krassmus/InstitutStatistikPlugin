// THIS FILE HAS BEEN MINIFIED

if(typeof(RGraph) == 'undefined') RGraph = {};RGraph.Bipolar = function (id, left, right)
{
this.id = id;this.canvas = document.getElementById(id);this.context = this.canvas.getContext('2d');this.canvas.__object__ = this;this.type = 'bipolar';this.coords = [];this.max = 0;this.isRGraph = true;RGraph.OldBrowserCompat(this.context);this.left = left;this.right = right;this.data = [left, right];this.properties = {
'chart.margin':                 2,
'chart.xtickinterval':          null,
'chart.labels':                 [],
'chart.text.size':              10,
'chart.text.color':             'black',
'chart.text.font':              'Verdana',
'chart.title.left':             '',
'chart.title.right':            '',
'chart.gutter.center':          60,
'chart.gutter.left':            25,
'chart.gutter.right':           25,
'chart.gutter.top':             25,
'chart.gutter.bottom':          25,
'chart.title':                  '',
'chart.title.background':       null,
'chart.title.hpos':             null,
'chart.title.vpos':             null,
'chart.colors':                 ['#0f0'],
'chart.contextmenu':            null,
'chart.tooltips':               null,
'chart.tooltips.effect':         'fade',
'chart.tooltips.css.class':      'RGraph_tooltip',
'chart.tooltips.highlight':     true,
'chart.highlight.stroke':       'black',
'chart.highlight.fill':         'rgba(255,255,255,0.5)',
'chart.units.pre':              '',
'chart.units.post':             '',
'chart.shadow':                 false,
'chart.shadow.color':           '#666',
'chart.shadow.offsetx':         3,
'chart.shadow.offsety':         3,
'chart.shadow.blur':            3,
'chart.annotatable':            false,
'chart.annotate.color':         'black',
'chart.xmax':                   null,
'chart.scale.decimals':         null,
'chart.scale.point':            '.',
'chart.scale.thousand':         ',',
'chart.axis.color':             'black',
'chart.zoom.factor':            1.5,
'chart.zoom.fade.in':           true,
'chart.zoom.fade.out':          true,
'chart.zoom.hdir':              'right',
'chart.zoom.vdir':              'down',
'chart.zoom.frames':            10,
'chart.zoom.delay':             50,
'chart.zoom.shadow':            true,
'chart.zoom.mode':              'canvas',
'chart.zoom.thumbnail.width':   75,
'chart.zoom.thumbnail.height':  75,
'chart.zoom.background':        true,
'chart.zoom.action':            'zoom',
'chart.resizable':              false,
'chart.resize.handle.adjust':   [0,0],
'chart.resize.handle.background': null,
'chart.strokestyle':            '#333'
}
while (this.left.length < this.right.length) this.left.push(0);while (this.left.length > this.right.length) this.right.push(0);}
RGraph.Bipolar.prototype.Set = function (name, value)
{
this.properties[name.toLowerCase()] = value;}
RGraph.Bipolar.prototype.Get = function (name)
{
return this.properties[name.toLowerCase()];}
RGraph.Bipolar.prototype.Draw = function ()
{
RGraph.FireCustomEvent(this, 'onbeforedraw');RGraph.ClearEventListeners(this.id);this.gutterLeft = this.Get('chart.gutter.left');this.gutterRight = this.Get('chart.gutter.right');this.gutterTop = this.Get('chart.gutter.top');this.gutterBottom = this.Get('chart.gutter.bottom');this.left = this.data[0];this.right = this.data[1];this.coords = [];this.GetMax();this.DrawAxes();this.DrawTicks();this.DrawLeftBars();this.DrawRightBars();if(this.Get('chart.axis.color') != 'black'){
this.DrawAxes();}
this.DrawLabels();this.DrawTitles();if(this.Get('chart.contextmenu')){
RGraph.ShowContext(this);}
if(this.Get('chart.tooltips')){
RGraph.Register(this);var eventHandler_window_click = function ()
{
RGraph.Redraw();}
window.addEventListener('click', eventHandler_window_click, false);RGraph.AddEventListener('window_' + this.id, 'click', eventHandler_window_click);var eventHandler_canvas_mousemove = function (e)
{
e = RGraph.FixEventObject(e);var canvas = document.getElementById(this.id);var obj = canvas.__object__;var mouseCoords = RGraph.getMouseXY(e);for (var i=0; i<obj.coords.length; i++){
var mouseX = mouseCoords[0];var mouseY = mouseCoords[1];var left = obj.coords[i][0];var top = obj.coords[i][1];var width = obj.coords[i][2];var height = obj.coords[i][3];if(mouseX >= left && mouseX <= (left + width ) && mouseY >= top && mouseY <= (top + height) ){
if(typeof(obj.Get('chart.tooltips')) == 'function'){
var text = obj.Get('chart.tooltips')(i);} else if(typeof(obj.Get('chart.tooltips')) == 'object' && typeof(obj.Get('chart.tooltips')[i]) == 'function'){
var text = obj.Get('chart.tooltips')[i](i);} else if(typeof(obj.Get('chart.tooltips')) == 'object'){
var text = obj.Get('chart.tooltips')[i];} else {
var text = '';}
if(text){
canvas.style.cursor = 'pointer';}
return;}
}
canvas.style.cursor = 'default';}
this.canvas.addEventListener('mousemove', eventHandler_canvas_mousemove, false);RGraph.AddEventListener(this.id, 'mouseover', eventHandler_canvas_mousemove);var eventHandler_canvas_click = function (e)
{
e = RGraph.FixEventObject(e);var canvas = document.getElementById(this.id)
var obj = canvas.__object__;RGraph.Clear(canvas);obj.Draw();var mouseCoords = RGraph.getMouseXY(e);for (var i=0; i<obj.coords.length; i++){
var mouseX = mouseCoords[0];var mouseY = mouseCoords[1];var left = obj.coords[i][0];var top = obj.coords[i][1];var width = obj.coords[i][2];var height = obj.coords[i][3];if(mouseX >= left && mouseX <= (left + width) && mouseY >= top && mouseY <= (top + height) ){
if(obj.Get('chart.tooltips')){
if(typeof(obj.Get('chart.tooltips')) == 'function'){
var text = obj.Get('chart.tooltips')(i);} else if(typeof(obj.Get('chart.tooltips')) == 'object' && typeof(obj.Get('chart.tooltips')[i]) == 'function'){
var text = obj.Get('chart.tooltips')[i](i);} else if(typeof(obj.Get('chart.tooltips')) == 'object'){
var text = obj.Get('chart.tooltips')[i];} else {
var text = '';}
if(text){
obj.context.beginPath();obj.context.strokeStyle = obj.Get('chart.highlight.stroke');obj.context.fillStyle = obj.Get('chart.highlight.fill');obj.context.strokeRect(left, top, width, height);obj.context.fillRect(left, top, width, height);obj.context.stroke();obj.context.fill();RGraph.Tooltip(canvas, text, e.pageX, e.pageY, i);}
}
}
}
e.stopPropagation();return false;}
this.canvas.addEventListener('click', eventHandler_canvas_click, false);RGraph.AddEventListener(this.id, 'click', eventHandler_canvas_click);if(RGraph.Registry.Get('chart.tooltip')){
RGraph.Registry.Get('chart.tooltip').style.display = 'none';RGraph.Registry.Set('chart.tooltip', null)
}
}
if(this.Get('chart.annotatable')){
RGraph.Annotate(this);}
if(this.Get('chart.zoom.mode') == 'thumbnail' || this.Get('chart.zoom.mode') == 'area'){
RGraph.ShowZoomWindow(this);}
if(this.Get('chart.resizable')){
RGraph.AllowResizing(this);}
RGraph.FireCustomEvent(this, 'ondraw');}
RGraph.Bipolar.prototype.DrawAxes = function ()
{
this.context.beginPath();this.context.strokeStyle = this.Get('chart.axis.color');this.axisWidth = (RGraph.GetWidth(this) - this.Get('chart.gutter.center') - this.gutterLeft - this.gutterRight) / 2;this.axisHeight = RGraph.GetHeight(this) - this.gutterTop - this.gutterBottom;this.context.moveTo(this.gutterLeft, RGraph.GetHeight(this) - this.gutterBottom);this.context.lineTo(this.gutterLeft + this.axisWidth, RGraph.GetHeight(this) - this.gutterBottom);this.context.lineTo(this.gutterLeft + this.axisWidth, this.gutterTop);this.context.stroke();this.context.beginPath();var x = this.gutterLeft + this.axisWidth + this.Get('chart.gutter.center');this.context.moveTo(x, this.gutterTop);this.context.lineTo(x, RGraph.GetHeight(this) - this.gutterBottom);this.context.lineTo(RGraph.GetWidth(this) - this.gutterRight, RGraph.GetHeight(this) - this.gutterBottom);this.context.stroke();}
RGraph.Bipolar.prototype.DrawTicks = function ()
{
var numDataPoints = this.left.length;var barHeight = ( (RGraph.GetHeight(this) - this.gutterTop - this.gutterBottom)- (this.left.length * (this.Get('chart.margin') * 2) )) / numDataPoints;for (var i = RGraph.GetHeight(this) - this.gutterBottom; i >= this.gutterTop; i -= (barHeight + ( this.Get('chart.margin') * 2)) ){
if(i < (RGraph.GetHeight(this) - this.gutterBottom) ){
this.context.beginPath();this.context.moveTo(this.gutterLeft + this.axisWidth, i);this.context.lineTo(this.gutterLeft + this.axisWidth + 3, i);this.context.stroke();}
}
for (var i = RGraph.GetHeight(this) - this.gutterBottom; i >= this.gutterTop; i -= (barHeight + ( this.Get('chart.margin') * 2)) ){
if(i < (RGraph.GetHeight(this) - this.gutterBottom) ){
this.context.beginPath();this.context.moveTo(this.gutterLeft + this.axisWidth + this.Get('chart.gutter.center'), i);this.context.lineTo(this.gutterLeft + this.axisWidth + this.Get('chart.gutter.center') - 3, i);this.context.stroke();}
}
var xInterval = this.axisWidth / 10;if(typeof(this.Get('chart.xtickinterval')) == 'number'){
xInterval = this.Get('chart.xtickinterval');}
for (i=this.gutterLeft; i<(this.gutterLeft + this.axisWidth); i+=xInterval){
this.context.beginPath();this.context.moveTo(i, RGraph.GetHeight(this) - this.gutterBottom);this.context.lineTo(i, (RGraph.GetHeight(this) - this.gutterBottom) + 4);this.context.closePath();this.context.stroke();}
var stoppingPoint = RGraph.GetWidth(this) - this.gutterRight;for (i=(this.gutterLeft + this.axisWidth + this.Get('chart.gutter.center') + xInterval); i<=stoppingPoint; i+=xInterval){
this.context.beginPath();this.context.moveTo(i, RGraph.GetHeight(this) - this.gutterBottom);this.context.lineTo(i, (RGraph.GetHeight(this) - this.gutterBottom) + 4);this.context.closePath();this.context.stroke();}
this.barHeight = barHeight;}
RGraph.Bipolar.prototype.GetMax = function()
{
var max = 0;var dec = this.Get('chart.scale.decimals');if(this.Get('chart.xmax')){
max = this.Get('chart.xmax');this.scale = [];this.scale[0] = Number((max / 5) * 1).toFixed(dec);this.scale[1] = Number((max / 5) * 2).toFixed(dec);this.scale[2] = Number((max / 5) * 3).toFixed(dec);this.scale[3] = Number((max / 5) * 4).toFixed(dec);this.scale[4] = Number(max).toFixed(dec);this.max = max;} else {
this.leftmax = RGraph.array_max(this.left);this.rightmax = RGraph.array_max(this.right);max = Math.max(this.leftmax, this.rightmax);this.scale = RGraph.getScale(max, this);this.scale[0] = Number(this.scale[0]).toFixed(dec);this.scale[1] = Number(this.scale[1]).toFixed(dec);this.scale[2] = Number(this.scale[2]).toFixed(dec);this.scale[3] = Number(this.scale[3]).toFixed(dec);this.scale[4] = Number(this.scale[4]).toFixed(dec);this.max = this.scale[4];}
}
RGraph.Bipolar.prototype.DrawLeftBars = function ()
{
this.context.strokeStyle = this.Get('chart.strokestyle');for (i=0; i<this.left.length; ++i){
if(this.Get('chart.shadow')){
this.context.shadowColor = this.Get('chart.shadow.color');this.context.shadowBlur = this.Get('chart.shadow.blur');this.context.shadowOffsetX = this.Get('chart.shadow.offsetx');this.context.shadowOffsetY = this.Get('chart.shadow.offsety');}
this.context.beginPath();if(this.Get('chart.colors')[i]){
this.context.fillStyle = this.Get('chart.colors')[i];}
var width = ( (this.left[i] / this.max) *  this.axisWidth);var coords = [
this.gutterLeft + this.axisWidth - width,
this.gutterTop + (i * ( this.axisHeight / this.left.length)) + this.Get('chart.margin'),
width,
this.barHeight
];if(RGraph.isIE8() && this.Get('chart.shadow')){
this.DrawIEShadow(coords);}
this.context.strokeRect(coords[0], coords[1], coords[2], coords[3]);this.context.fillRect(coords[0], coords[1], coords[2], coords[3]);this.context.stroke();this.context.fill();this.coords.push([
coords[0],
coords[1],
coords[2],
coords[3]
]);}
RGraph.NoShadow(this);}
RGraph.Bipolar.prototype.DrawRightBars = function ()
{
this.context.strokeStyle = this.Get('chart.strokestyle');if(this.Get('chart.shadow')){
this.context.shadowColor = this.Get('chart.shadow.color');this.context.shadowBlur = this.Get('chart.shadow.blur');this.context.shadowOffsetX = this.Get('chart.shadow.offsetx');this.context.shadowOffsetY = this.Get('chart.shadow.offsety');}
for (var i=0; i<this.right.length; ++i){
this.context.beginPath();if(this.Get('chart.colors')[i]){
this.context.fillStyle = this.Get('chart.colors')[i];}
var width = ( (this.right[i] / this.max) * this.axisWidth);var coords = [
this.gutterLeft + this.axisWidth + this.Get('chart.gutter.center'),
this.Get('chart.margin') + (i * (this.axisHeight / this.right.length)) + this.gutterTop,
width,
this.barHeight
];if(RGraph.isIE8() && this.Get('chart.shadow')){
this.DrawIEShadow(coords);}
this.context.strokeRect(coords[0], coords[1], coords[2], coords[3]);this.context.fillRect(coords[0], coords[1], coords[2], coords[3]);this.context.closePath();this.coords.push([
coords[0],
coords[1],
coords[2],
coords[3]
]);}
this.context.stroke();RGraph.NoShadow(this);}
RGraph.Bipolar.prototype.DrawLabels = function ()
{
this.context.fillStyle = this.Get('chart.text.color');var labelPoints = new Array();var font = this.Get('chart.text.font');var size = this.Get('chart.text.size');var max = Math.max(this.left.length, this.right.length);for (i=0; i<max; ++i){
var barAreaHeight = RGraph.GetHeight(this) - this.gutterTop - this.gutterBottom;var barHeight = barAreaHeight / this.left.length;var yPos = (i * barAreaHeight) + this.gutterTop;labelPoints.push(this.gutterTop + (i * barHeight) + (barHeight / 2) + 5);}
for (i=0; i<labelPoints.length; ++i){
RGraph.Text(this.context,
this.Get('chart.text.font'),
this.Get('chart.text.size'),
this.gutterLeft + this.axisWidth + (this.Get('chart.gutter.center') / 2),
labelPoints[i],
String(this.Get('chart.labels')[i] ? this.Get('chart.labels')[i] : ''),
null,
'center');}
RGraph.Text(this.context,font,size,this.gutterLeft,RGraph.GetHeight(this) - this.gutterBottom + 14,RGraph.number_format(this, this.scale[4], this.Get('chart.units.pre'), this.Get('chart.units.post')),null,'center');RGraph.Text(this.context, font, size, this.gutterLeft + ((RGraph.GetWidth(this) - this.Get('chart.gutter.center') - this.gutterLeft - this.gutterRight) / 2) * (1/5), RGraph.GetHeight(this) - this.gutterBottom + 14, RGraph.number_format(this, this.scale[3], this.Get('chart.units.pre'), this.Get('chart.units.post')), null, 'center');RGraph.Text(this.context, font, size, this.gutterLeft + ((RGraph.GetWidth(this) - this.Get('chart.gutter.center') - this.gutterLeft - this.gutterRight) / 2) * (2/5), RGraph.GetHeight(this) - this.gutterBottom + 14, RGraph.number_format(this, this.scale[2], this.Get('chart.units.pre'), this.Get('chart.units.post')), null, 'center');RGraph.Text(this.context, font, size, this.gutterLeft + ((RGraph.GetWidth(this) - this.Get('chart.gutter.center') - this.gutterLeft - this.gutterRight) / 2) * (3/5), RGraph.GetHeight(this) - this.gutterBottom + 14, RGraph.number_format(this, this.scale[1], this.Get('chart.units.pre'), this.Get('chart.units.post')), null, 'center');RGraph.Text(this.context, font, size, this.gutterLeft + ((RGraph.GetWidth(this) - this.Get('chart.gutter.center') - this.gutterLeft - this.gutterRight) / 2) * (4/5), RGraph.GetHeight(this) - this.gutterBottom + 14, RGraph.number_format(this, this.scale[0], this.Get('chart.units.pre'), this.Get('chart.units.post')), null, 'center');RGraph.Text(this.context, font, size, RGraph.GetWidth(this) - this.gutterRight, RGraph.GetHeight(this) - this.gutterBottom + 14, RGraph.number_format(this, this.scale[4], this.Get('chart.units.pre'), this.Get('chart.units.post')), null, 'center');RGraph.Text(this.context, font, size, RGraph.GetWidth(this) - this.gutterRight - (this.axisWidth * 0.2), RGraph.GetHeight(this) - this.gutterBottom + 14,RGraph.number_format(this, this.scale[3], this.Get('chart.units.pre'), this.Get('chart.units.post')), null, 'center');RGraph.Text(this.context, font, size, RGraph.GetWidth(this) - this.gutterRight - (this.axisWidth * 0.4), RGraph.GetHeight(this) - this.gutterBottom + 14,RGraph.number_format(this, this.scale[2], this.Get('chart.units.pre'), this.Get('chart.units.post')), null, 'center');RGraph.Text(this.context, font, size, RGraph.GetWidth(this) - this.gutterRight - (this.axisWidth * 0.6), RGraph.GetHeight(this) - this.gutterBottom + 14,RGraph.number_format(this, this.scale[1], this.Get('chart.units.pre'), this.Get('chart.units.post')), null, 'center');RGraph.Text(this.context, font, size, RGraph.GetWidth(this) - this.gutterRight - (this.axisWidth * 0.8), RGraph.GetHeight(this) - this.gutterBottom + 14,RGraph.number_format(this, this.scale[0], this.Get('chart.units.pre'), this.Get('chart.units.post')), null, 'center');}
RGraph.Bipolar.prototype.DrawTitles = function ()
{
RGraph.Text(this.context, this.Get('chart.text.font'), this.Get('chart.text.size'), this.gutterLeft + 5, (this.gutterTop / 2) + 5, String(this.Get('chart.title.left')), 'center');RGraph.Text(this.context,this.Get('chart.text.font'), this.Get('chart.text.size'), RGraph.GetWidth(this) - this.gutterRight - 5, (this.gutterTop / 2) + 5, String(this.Get('chart.title.right')), 'center', 'right');RGraph.DrawTitle(this.canvas, this.Get('chart.title'), this.gutterTop);}
RGraph.Bipolar.prototype.DrawIEShadow = function (coords)
{
var prevFillStyle = this.context.fillStyle;var offsetx = this.Get('chart.shadow.offsetx');var offsety = this.Get('chart.shadow.offsety');this.context.lineWidth = this.Get('chart.linewidth');this.context.fillStyle = this.Get('chart.shadow.color');this.context.beginPath();this.context.fillRect(coords[0] + offsetx, coords[1] + offsety, coords[2],coords[3]);this.context.fill();this.context.fillStyle = prevFillStyle;}