// THIS FILE HAS BEEN MINIFIED

if(typeof(RGraph) == 'undefined') RGraph = {};RGraph.Rscatter = function (id, data)
{
this.id = id;this.canvas = document.getElementById(id);this.context = this.canvas.getContext('2d');this.data = data;this.canvas.__object__ = this;this.type = 'rscatter';this.hasTooltips = false;this.isRGraph = true;RGraph.OldBrowserCompat(this.context);this.centerx = 0;this.centery = 0;this.radius = 0;this.max = 0;this.properties = {
'chart.radius':                 null,
'chart.colors':                 [],
'chart.colors.default':         'black',
'chart.gutter.left':            25,
'chart.gutter.right':           25,
'chart.gutter.top':             25,
'chart.gutter.bottom':          25,
'chart.title':                  '',
'chart.title.background':       null,
'chart.title.hpos':             null,
'chart.title.vpos':             null,
'chart.labels':                 null,
'chart.labels.position':       'center',
'chart.labels.axes':            'nsew',
'chart.text.color':             'black',
'chart.text.font':              'Verdana',
'chart.text.size':              10,
'chart.key':                    null,
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
'chart.contextmenu':            null,
'chart.tooltips.effect':        'fade',
'chart.tooltips.css.class':     'RGraph_tooltip',
'chart.tooltips.highlight':     true,
'chart.tooltips.hotspot':       3,
'chart.annotatable':            false,
'chart.annotate.color':         'black',
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
'chart.adjustable':             false,
'chart.ymax':                   null,
'chart.ymin':                   0,
'chart.tickmarks':              'cross',
'chart.ticksize':               3,
'chart.scale.decimals':         null,
'chart.scale.round':            false
}
}
RGraph.Rscatter.prototype.Set = function (name, value)
{
this.properties[name.toLowerCase()] = value;}
RGraph.Rscatter.prototype.Get = function (name)
{
return this.properties[name.toLowerCase()];}
RGraph.Rscatter.prototype.Draw = function ()
{
RGraph.FireCustomEvent(this, 'onbeforedraw');RGraph.ClearEventListeners(this.id);this.gutterLeft = this.Get('chart.gutter.left');this.gutterRight = this.Get('chart.gutter.right');this.gutterTop = this.Get('chart.gutter.top');this.gutterBottom = this.Get('chart.gutter.bottom');this.radius = (Math.min(RGraph.GetWidth(this) - this.gutterLeft - this.gutterRight, RGraph.GetHeight(this) - this.gutterTop - this.gutterBottom) / 2);this.centerx = RGraph.GetWidth(this) / 2;this.centery = RGraph.GetHeight(this) / 2;this.coords = [];if(typeof(this.Get('chart.radius')) == 'number'){
this.radius = this.Get('chart.radius');}
var max = this.Get('chart.ymax');var min = this.Get('chart.ymin');if(typeof(max) == 'number'){
this.max = max;this.scale = [((max - min) * 0.2) + min,((max - min) * 0.4) + min,((max - min) * 0.6) + min,((max - min) * 0.8) + min,((max - min) * 1.0) + min,];} else {
for (var i=0; i<this.data.length; ++i){
this.max = Math.max(this.max, this.data[i][1]);}
this.scale = RGraph.getScale(this.max, this);this.max = this.scale[4];if(String(this.scale[0]).indexOf('e') == -1){
this.scale[0] = Number(this.scale[0]).toFixed(this.Get('chart.scale.decimals'));this.scale[1] = Number(this.scale[1]).toFixed(this.Get('chart.scale.decimals'));this.scale[2] = Number(this.scale[2]).toFixed(this.Get('chart.scale.decimals'));this.scale[3] = Number(this.scale[3]).toFixed(this.Get('chart.scale.decimals'));this.scale[4] = Number(this.scale[4]).toFixed(this.Get('chart.scale.decimals'));}
}
if(this.Get('chart.key') && this.Get('chart.key').length > 0 && this.Get('chart.key').length >= 3){
this.centerx = this.centerx - this.Get('chart.gutter.right') + 5;}
if(typeof(this.Get('chart.key')) == 'object' && RGraph.is_array(this.Get('chart.key')) && this.Get('chart.key')[0]){
for (var i=0; i<this.data.length; ++i){
if(this.data[i][2] && typeof(this.data[i][2]) == 'string'){
this.Get('chart.colors').push(this.data[i][2]);}
}
}
this.DrawBackground();this.DrawRscatter();this.DrawLabels();if(this.Get('chart.contextmenu')){
RGraph.ShowContext(this);}
if(this.hasTooltips){
RGraph.Register(this);var canvas_onmousemove_func = function (event)
{
event = RGraph.FixEventObject(event);var mouseCoords = RGraph.getMouseXY(event);var mouseX = mouseCoords[0];var mouseY = mouseCoords[1];var obj = event.target.__object__;var canvas = obj.canvas;var context = obj.context;var overHotspot = false;var offset = obj.Get('chart.tooltips.hotspot');for (var i=0; i<obj.coords.length; ++i){
var xCoord = obj.coords[i][0];var yCoord = obj.coords[i][1];var tooltip = obj.coords[i][3];if(
mouseX < (xCoord + offset) &&
mouseX > (xCoord - offset) &&
mouseY < (yCoord + offset) &&
mouseY > (yCoord - offset) &&
typeof(tooltip) == 'string' &&
tooltip.length > 0
){
overHotspot = true;canvas.style.cursor = 'pointer';if(!RGraph.Registry.Get('chart.tooltip') || RGraph.Registry.Get('chart.tooltip').__text__ != tooltip){
if(obj.Get('chart.tooltips.highlight')){
RGraph.Redraw();}
if(typeof(tooltip) == 'function'){
var text = String(tooltip(i));} else {
var text = String(tooltip);}
RGraph.Tooltip(canvas, text, event.pageX + 5, event.pageY - 5, i);if(obj.Get('chart.tooltips.highlight')){
context.beginPath();context.fillStyle = 'rgba(255,255,255,0.5)';context.arc(xCoord, yCoord, 3, 0, 6.2830, 0);context.fill();}
}
}
}
if(!overHotspot){
canvas.style.cursor = 'default';}
}
this.canvas.addEventListener('mousemove', canvas_onmousemove_func, false);RGraph.AddEventListener(this.id, 'mousemove', canvas_onmousemove_func);}
if(this.Get('chart.title')){
RGraph.DrawTitle(this.canvas,
this.Get('chart.title'),
(this.canvas.height / 2) - this.radius - 5,
this.centerx,
this.Get('chart.text.size') + 2);}
if(this.Get('chart.annotatable')){
RGraph.Annotate(this);}
if(this.Get('chart.zoom.mode') == 'thumbnail' || this.Get('chart.zoom.mode') == 'area'){
RGraph.ShowZoomWindow(this);}
if(this.Get('chart.resizable')){
RGraph.AllowResizing(this);}
RGraph.FireCustomEvent(this, 'ondraw');}
RGraph.Rscatter.prototype.DrawBackground = function ()
{
this.context.lineWidth = 1;this.context.strokeStyle = '#ccc';for (var i=15; i<this.radius - (document.all ? 5 : 0); i+=15){
this.context.arc(this.centerx, this.centery, i, 0, (2 * Math.PI), 0);}
this.context.stroke();this.context.beginPath();for (var i=15; i<360; i+=15){
this.context.arc(this.centerx, this.centery, this.radius, i / 57.3, (i + 0.01) / 57.3, 0);this.context.lineTo(this.centerx, this.centery);}
this.context.stroke();this.context.beginPath();this.context.strokeStyle = 'black';this.context.moveTo(this.centerx - this.radius, this.centery);this.context.lineTo(this.centerx + this.radius, this.centery);this.context.moveTo(this.centerx - this.radius, this.centery - 5);this.context.lineTo(this.centerx - this.radius, this.centery + 5);this.context.moveTo(this.centerx + this.radius, this.centery - 5);this.context.lineTo(this.centerx + this.radius, this.centery + 5);for (var i=(this.centerx - this.radius); i<(this.centerx + this.radius); i+=20){
this.context.moveTo(i,  this.centery - 3);this.context.lineTo(i,  this.centery + 3);}
for (var i=(this.centery - this.radius); i<(this.centery + this.radius); i+=20){
this.context.moveTo(this.centerx - 3, i);this.context.lineTo(this.centerx + 3, i);}
this.context.moveTo(this.centerx, this.centery - this.radius);this.context.lineTo(this.centerx, this.centery + this.radius);this.context.moveTo(this.centerx - 5, this.centery - this.radius);this.context.lineTo(this.centerx + 5, this.centery - this.radius);this.context.moveTo(this.centerx - 5, this.centery + this.radius);this.context.lineTo(this.centerx + 5, this.centery + this.radius);this.context.closePath();this.context.stroke();}
RGraph.Rscatter.prototype.DrawRscatter = function ()
{
var data = this.data;for (var i=0; i<data.length; ++i){
var d1 = data[i][0];var d2 = data[i][1];var a = d1 / (180 / Math.PI);var r = ( (d2 - this.Get('chart.ymin')) / (this.max - this.Get('chart.ymin')) ) * this.radius;var x = Math.sin(a) * r;var y = Math.cos(a) * r;var color = data[i][2] ? data[i][2] : this.Get('chart.colors.default');var tooltip = data[i][3] ? data[i][3] : null;if(tooltip && tooltip.length){
this.hasTooltips = true;}
x = x + this.centerx;y = this.centery - y;this.DrawTick(x, y, color);this.coords.push([x, y, color, tooltip]);}
}
RGraph.Rscatter.prototype.DrawLabels = function ()
{
this.context.lineWidth = 1;var key = this.Get('chart.key');this.context.fillStyle = 'black';this.context.strokeStyle = 'black';var r = this.radius;var color = this.Get('chart.text.color');var font_face = this.Get('chart.text.font');var font_size = this.Get('chart.text.size');var context = this.context;var axes = this.Get('chart.labels.axes').toLowerCase();this.context.fillStyle = this.Get('chart.text.color');if(typeof(this.Get('chart.labels')) == 'object' && this.Get('chart.labels')){
this.DrawCircularLabels(context, this.Get('chart.labels'), font_face, font_size, r);}
var color = 'rgba(255,255,255,0.8)';if(axes.indexOf('n') > -1){
RGraph.Text(context,font_face,font_size,this.centerx,this.centery - ((r) * 0.2),String(this.scale[0]),'center','center',true,false,color);RGraph.Text(context, font_face, font_size, this.centerx, this.centery - ((r) * 0.4), String(this.scale[1]), 'center', 'center', true, false, color);RGraph.Text(context, font_face, font_size, this.centerx, this.centery - ((r) * 0.6), String(this.scale[2]), 'center', 'center', true, false, color);RGraph.Text(context, font_face, font_size, this.centerx, this.centery - ((r) * 0.8), String(this.scale[3]), 'center', 'center', true, false, color);RGraph.Text(context, font_face, font_size, this.centerx, this.centery - r, String(this.scale[4]), 'center', 'center', true, false, color);}
if(axes.indexOf('s') > -1){
RGraph.Text(context, font_face, font_size, this.centerx, this.centery + ((r) * 0.2), String(this.scale[0]), 'center', 'center', true, false, color);RGraph.Text(context, font_face, font_size, this.centerx, this.centery + ((r) * 0.4), String(this.scale[1]), 'center', 'center', true, false, color);RGraph.Text(context, font_face, font_size, this.centerx, this.centery + ((r) * 0.6), String(this.scale[2]), 'center', 'center', true, false, color);RGraph.Text(context, font_face, font_size, this.centerx, this.centery + ((r) * 0.8), String(this.scale[3]), 'center', 'center', true, false, color);RGraph.Text(context, font_face, font_size, this.centerx, this.centery + r, String(this.scale[4]), 'center', 'center', true, false, color);}
if(axes.indexOf('e') > -1){
RGraph.Text(context, font_face, font_size, this.centerx + ((r) * 0.2), this.centery, String(this.scale[0]), 'center', 'center', true, false, color);RGraph.Text(context, font_face, font_size, this.centerx + ((r) * 0.4), this.centery, String(this.scale[1]), 'center', 'center', true, false, color);RGraph.Text(context, font_face, font_size, this.centerx + ((r) * 0.6), this.centery, String(this.scale[2]), 'center', 'center', true, false, color);RGraph.Text(context, font_face, font_size, this.centerx + ((r) * 0.8), this.centery, String(this.scale[3]), 'center', 'center', true, false, color);RGraph.Text(context, font_face, font_size, this.centerx + r, this.centery, String(this.scale[4]), 'center', 'center', true, false, color);}
if(axes.indexOf('w') > -1){
RGraph.Text(context, font_face, font_size, this.centerx - ((r) * 0.2), this.centery, String(this.scale[0]), 'center', 'center', true, false, color);RGraph.Text(context, font_face, font_size, this.centerx - ((r) * 0.4), this.centery, String(this.scale[1]), 'center', 'center', true, false, color);RGraph.Text(context, font_face, font_size, this.centerx - ((r) * 0.6), this.centery, String(this.scale[2]), 'center', 'center', true, false, color);RGraph.Text(context, font_face, font_size, this.centerx - ((r) * 0.8), this.centery, String(this.scale[3]), 'center', 'center', true, false, color);RGraph.Text(context, font_face, font_size, this.centerx - r, this.centery, String(this.scale[4]), 'center', 'center', true, false, color);}
if(this.Get('chart.labels.axes').length > 0){
RGraph.Text(context, font_face, font_size, this.centerx,  this.centery, this.Get('chart.ymin') > 0 ? String(this.Get('chart.ymin').toFixed(this.Get('chart.scale.decimals'))) : '0', 'center', 'center', true, false, color);}
if(key && key.length){
RGraph.DrawKey(this, key, this.Get('chart.colors'));}
}
RGraph.Rscatter.prototype.DrawCircularLabels = function (context, labels, font_face, font_size, r)
{
var position = this.Get('chart.labels.position');var r = r + 10;for (var i=0; i<labels.length; ++i){
var a = (360 / labels.length) * (i + 1) - (360 / (labels.length * 2));var a = a - 90 + (this.Get('chart.labels.position') == 'edge' ? ((360 / labels.length) / 2) : 0);var x = Math.cos(a / 57.29577866666) * (r + 10);var y = Math.sin(a / 57.29577866666) * (r + 10);RGraph.Text(context, font_face, font_size, this.centerx + x, this.centery + y, String(labels[i]), 'center', 'center');}
}
RGraph.Rscatter.prototype.DrawTick = function (x, y, color)
{
var tickmarks = this.Get('chart.tickmarks');var ticksize = this.Get('chart.ticksize');this.context.strokeStyle = color;this.context.fillStyle = color;if(tickmarks == 'cross'){
this.context.beginPath();this.context.moveTo(x + ticksize, y + ticksize);this.context.lineTo(x - ticksize, y - ticksize);this.context.stroke();this.context.beginPath();this.context.moveTo(x - ticksize, y + ticksize);this.context.lineTo(x + ticksize, y - ticksize);this.context.stroke();} else if(tickmarks == 'circle'){
this.context.beginPath();this.context.arc(x, y, ticksize, 0, 6.2830, false);this.context.fill();} else if(tickmarks == 'square'){
this.context.beginPath();this.context.fillRect(x - ticksize, y - ticksize, 2 * ticksize, 2 * ticksize);this.context.fill();} else if(tickmarks == 'diamond'){
this.context.beginPath();this.context.moveTo(x, y - ticksize);this.context.lineTo(x + ticksize, y);this.context.lineTo(x, y + ticksize);this.context.lineTo(x - ticksize, y);this.context.closePath();this.context.fill();} else if(tickmarks == 'plus'){
this.context.lineWidth = 1;this.context.beginPath();this.context.moveTo(x, y - ticksize);this.context.lineTo(x, y + ticksize);this.context.moveTo(x - ticksize, y);this.context.lineTo(x + ticksize, y);this.context.stroke();}
}
