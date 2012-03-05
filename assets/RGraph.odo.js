// THIS FILE HAS BEEN MINIFIED

if(typeof(RGraph) == 'undefined') RGraph = {};RGraph.Odometer = function (id, start, end, value)
{
this.id = id
this.canvas = document.getElementById(id);this.context = this.canvas.getContext('2d');this.canvas.__object__ = this;this.type = 'odo';this.isRGraph = true;this.start = start;this.end = end;this.value = value;RGraph.OldBrowserCompat(this.context);this.properties = {
'chart.radius':                 null,
'chart.value.text':             false,
'chart.needle.color':           'black',
'chart.needle.width':           2,
'chart.needle.head':            true,
'chart.needle.tail':            true,
'chart.needle.type':            'pointer',
'chart.needle.extra':            [],
'chart.needle.triangle.border': '#aaa',
'chart.text.size':              10,
'chart.text.color':             'black',
'chart.text.font':              'Verdana',
'chart.green.max':              end * 0.75,
'chart.red.min':                end * 0.9,
'chart.green.color':            'green',
'chart.yellow.color':           'yellow',
'chart.red.color':              'red',
'chart.green.solid':            false,
'chart.yellow.solid':           false,
'chart.red.solid':              false,
'chart.label.area':             35,
'chart.gutter.left':            25,
'chart.gutter.right':           25,
'chart.gutter.top':             25,
'chart.gutter.bottom':          25,
'chart.title':                  '',
'chart.title.background':       null,
'chart.title.hpos':             null,
'chart.title.vpos':             null,
'chart.contextmenu':            null,
'chart.linewidth':              1,
'chart.shadow.inner':           false,
'chart.shadow.inner.color':     'black',
'chart.shadow.inner.offsetx':   3,
'chart.shadow.inner.offsety':   3,
'chart.shadow.inner.blur':      6,
'chart.shadow.outer':           false,
'chart.shadow.outer.color':     '#666',
'chart.shadow.outer.offsetx':   0,
'chart.shadow.outer.offsety':   0,
'chart.shadow.outer.blur':      15,
'chart.annotatable':            false,
'chart.annotate.color':         'black',
'chart.scale.decimals':         0,
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
'chart.units.pre':              '',
'chart.units.post':             '',
'chart.border':                 false,
'chart.border.color1':          '#BEBCB0',
'chart.border.color2':          '#F0EFEA',
'chart.border.color3':          '#BEBCB0',
'chart.tickmarks.highlighted':  false,
'chart.zerostart':              false,
'chart.labels':                 null,
'chart.units.pre':              '',
'chart.units.post':             '',
'chart.value.units.pre':        '',
'chart.value.units.post':       '',
'chart.key':                    [],
'chart.key.background':         'white',
'chart.key.position':           'graph',
'chart.key.shadow':             false,
'chart.key.shadow.color':       '#666',
'chart.key.shadow.blur':        3,
'chart.key.shadow.offsetx':     2,
'chart.key.shadow.offsety':     2,
'chart.key.position.gutter.boxed': true,
'chart.key.position.x':         null,
'chart.key.position.y':         null,
'chart.key.halign':             'right',
'chart.key.color.shape':        'square',
'chart.key.rounded':            true,
'chart.key.text.size':          10,
}
}
RGraph.Odometer.prototype.Set = function (name, value)
{
if(name == 'chart.needle.style'){
alert('[RGRAPH] The RGraph property chart.needle.style has changed to chart.needle.color');}
if(name == 'chart.needle.thickness'){
name = 'chart.needle.width';}
this.properties[name.toLowerCase()] = value;}
RGraph.Odometer.prototype.Get = function (name)
{
return this.properties[name.toLowerCase()];}
RGraph.Odometer.prototype.Draw = function ()
{
RGraph.FireCustomEvent(this, 'onbeforedraw');this.gutterLeft = this.Get('chart.gutter.left');this.gutterRight = this.Get('chart.gutter.right');this.gutterTop = this.Get('chart.gutter.top');this.gutterBottom = this.Get('chart.gutter.bottom');this.radius = Math.min((RGraph.GetWidth(this) - this.gutterLeft - this.gutterRight) / 2, (RGraph.GetHeight(this) - this.gutterTop - this.gutterBottom) / 2) - (this.Get('chart.border') ? 25 : 0);this.diameter = 2 * this.radius;this.centerx = RGraph.GetWidth(this) / 2;this.centery = RGraph.GetHeight(this) / 2;this.range = this.end - this.start;if(typeof(this.Get('chart.radius')) == 'number'){
this.radius = this.Get('chart.radius');}
if(this.Get('chart.key').length > 0 && this.canvas.width > this.canvas.height){
this.centerx = 5 + this.radius;}
this.context.lineWidth = this.Get('chart.linewidth');this.DrawBackground();this.DrawLabels();this.DrawNeedle(this.value, this.Get('chart.needle.color'));if(this.Get('chart.needle.extra').length > 0){
for (var i=0; i<this.Get('chart.needle.extra').length; ++i){
var needle = this.Get('chart.needle.extra')[i];this.DrawNeedle(needle[0], needle[1], needle[2]);}
}
if(this.Get('chart.key').length > 0){
var colors = [this.Get('chart.needle.color')];if(this.Get('chart.needle.extra').length > 0){
for (var i=0; i<this.Get('chart.needle.extra').length; ++i){
var needle = this.Get('chart.needle.extra')[i];colors.push(needle[1]);}
}
RGraph.DrawKey(this, this.Get('chart.key'), colors);}
if(this.Get('chart.contextmenu')){
RGraph.ShowContext(this);}
if(this.Get('chart.annotatable')){
RGraph.Annotate(this);}
if(this.Get('chart.zoom.mode') == 'thumbnail' || this.Get('chart.zoom.mode') == 'area'){
RGraph.ShowZoomWindow(this);}
if(this.Get('chart.resizable')){
RGraph.AllowResizing(this);}
RGraph.FireCustomEvent(this, 'ondraw');}
RGraph.Odometer.prototype.DrawBackground = function ()
{
this.context.beginPath();if(this.Get('chart.shadow.outer')){
RGraph.SetShadow(this, this.Get('chart.shadow.outer.color'), this.Get('chart.shadow.outer.offsetx'), this.Get('chart.shadow.outer.offsety'), this.Get('chart.shadow.outer.blur'));}
var backgroundColor = '#eee';this.context.fillStyle = backgroundColor;this.context.arc(this.centerx, this.centery, this.radius, 0.0001, 6.28, false);this.context.fill();RGraph.NoShadow(this);this.context.strokeStyle = '#666';this.context.arc(this.centerx, this.centery, this.radius, 0, 6.28, false);this.context.fillStyle = backgroundColor;this.context.arc(this.centerx, this.centery, this.radius, 0, 6.28, false);this.context.fill();this.context.beginPath();this.context.strokeStyle = '#bbb';for (var i=0; i<=360; i+=3){
this.context.arc(this.centerx, this.centery, this.radius, 0, RGraph.degrees2Radians(i), false);this.context.lineTo(this.centerx, this.centery);}
this.context.stroke();this.context.beginPath();this.context.lineWidth = 1;this.context.strokeStyle = 'black';this.context.fillStyle = backgroundColor;this.context.strokeStyle = backgroundColor;this.context.arc(this.centerx, this.centery, this.radius - 5, 0, 6.28, false);this.context.fill();this.context.stroke();this.context.beginPath();this.context.strokeStyle = '#ddd';for (var i=0; i<360; i+=18){
this.context.arc(this.centerx, this.centery, this.radius, 0, RGraph.degrees2Radians(i), false);this.context.lineTo(this.centerx, this.centery);}
this.context.stroke();this.context.beginPath();this.context.strokeStyle = 'black';this.context.arc(this.centerx, this.centery, this.radius, 0, 6.2830, false);this.context.stroke();if(this.Get('chart.shadow.inner')){
this.context.beginPath();RGraph.SetShadow(this, this.Get('chart.shadow.inner.color'), this.Get('chart.shadow.inner.offsetx'), this.Get('chart.shadow.inner.offsety'), this.Get('chart.shadow.inner.blur'));this.context.arc(this.centerx, this.centery, this.radius - this.Get('chart.label.area'), 0, 6.28, 0);this.context.fill();this.context.stroke();RGraph.NoShadow(this);}
if(this.Get('chart.green.solid')){
var greengrad = this.Get('chart.green.color');} else {
var greengrad = this.context.createRadialGradient(this.centerx,this.centery,0,this.centerx,this.centery,this.radius);greengrad.addColorStop(0, 'white');greengrad.addColorStop(1, this.Get('chart.green.color'));}
if(this.Get('chart.tickmarks.highlighted')){
this.context.beginPath();this.context.lineWidth = 5;this.context.strokeStyle = greengrad;this.context.arc(this.centerx, this.centery, this.radius - 2.5,
-1.57,
(((this.Get('chart.green.max') - this.start)/ (this.end - this.start)) * 6.2830) - 1.57,
0);this.context.stroke();this.context.lineWidth = 1;}
this.context.beginPath();this.context.fillStyle = greengrad;this.context.arc(
this.centerx,
this.centery,
this.radius - this.Get('chart.label.area'),
-1.57,
(((this.Get('chart.green.max') - this.start)/ (this.end - this.start)) * 6.2830) - 1.57,
false
);this.context.lineTo(this.centerx, this.centery);this.context.closePath();this.context.fill();if(this.Get('chart.yellow.solid')){
var yellowgrad = this.Get('chart.yellow.color');} else {
var yellowgrad = this.context.createRadialGradient(this.centerx,this.centery,0,this.centerx,this.centery,this.radius);yellowgrad.addColorStop(0, 'white');yellowgrad.addColorStop(1, this.Get('chart.yellow.color'));}
if(this.Get('chart.tickmarks.highlighted')){
this.context.beginPath();this.context.lineWidth = 5;this.context.strokeStyle = yellowgrad;this.context.arc(this.centerx, this.centery, this.radius - 2.5, (
((this.Get('chart.green.max') - this.start) / (this.end - this.start)) * 6.2830) - 1.57,
(((this.Get('chart.red.min') - this.start) / (this.end - this.start)) * 6.2830) - 1.57,
0);this.context.stroke();this.context.lineWidth = 1;}
this.context.beginPath();this.context.fillStyle = yellowgrad;this.context.arc(
this.centerx,
this.centery,
this.radius - this.Get('chart.label.area'),
( ((this.Get('chart.green.max') -this.start) / (this.end - this.start)) * 6.2830) - 1.57,
( ((this.Get('chart.red.min') - this.start) / (this.end - this.start)) * 6.2830) - 1.57,
false
);this.context.lineTo(this.centerx, this.centery);this.context.closePath();this.context.fill();if(this.Get('chart.red.solid')){
var redgrad = this.Get('chart.red.color');} else {
var redgrad = this.context.createRadialGradient(this.centerx,
this.centery,
0,
this.centerx,
this.centery,
this.radius);redgrad.addColorStop(0, 'white');redgrad.addColorStop(1, this.Get('chart.red.color'));}
if(this.Get('chart.tickmarks.highlighted')){
this.context.beginPath();this.context.lineWidth = 5;this.context.strokeStyle = redgrad;this.context.arc(this.centerx, this.centery, this.radius - 2.5,(((this.Get('chart.red.min') - this.start) / (this.end - this.start)) * 6.2830) - 1.57,(2 * Math.PI) - (0.5 * Math.PI),0);this.context.stroke();this.context.lineWidth = 1;}
this.context.beginPath();this.context.fillStyle = redgrad;this.context.strokeStyle = redgrad;this.context.arc(
this.centerx,
this.centery,
this.radius - this.Get('chart.label.area'),
(((this.Get('chart.red.min') - this.start) / (this.end - this.start)) * 6.2830) - 1.57,
6.2830 - (0.25 * 6.2830),
false
);this.context.lineTo(this.centerx, this.centery);this.context.closePath();this.context.fill();if(this.Get('chart.border')){
var grad = this.context.createRadialGradient(this.centerx, this.centery, this.radius, this.centerx, this.centery, this.radius + 15);grad.addColorStop(1, this.Get('chart.border.color1'));grad.addColorStop(0.5, this.Get('chart.border.color2'));grad.addColorStop(0, this.Get('chart.border.color3'));this.context.beginPath();this.context.fillStyle = grad;this.context.strokeStyle = grad;this.context.lineWidth = 22;this.context.lineCap = 'round';this.context.arc(this.centerx, this.centery, this.radius + 9, 0, 6.2830, 0);this.context.stroke();}
this.context.lineWidth = this.Get('chart.linewidth');if(this.Get('chart.title')){
RGraph.DrawTitle(this.canvas,
this.Get('chart.title'),
this.centery - this.radius,
null,
this.Get('chart.text.size') + 2);}
if(!this.Get('chart.tickmarks.highlighted')){
for (var i=18; i<=360; i+=36){
this.context.beginPath();this.context.strokeStyle = '#999';this.context.lineWidth = 2;this.context.arc(this.centerx, this.centery, this.radius - 1, RGraph.degrees2Radians(i), RGraph.degrees2Radians(i+0.01), false);this.context.arc(this.centerx, this.centery, this.radius - 7, RGraph.degrees2Radians(i), RGraph.degrees2Radians(i+0.01), false);this.context.stroke();}
}
}
RGraph.Odometer.prototype.DrawNeedle = function (value, color)
{
var length = arguments[2] ? arguments[2] : this.radius - this.Get('chart.label.area');this.context.fillStyle = '#999';this.context.beginPath();this.context.moveTo(this.centerx, this.centery);this.context.arc(this.centerx, this.centery, 10, 0, 6.28, false);this.context.fill();this.context.closePath();this.context.fill();this.context.fillStyle = color
this.context.strokeStyle = '#666';this.context.beginPath();this.context.moveTo(this.centerx, this.centery);this.context.arc(this.centerx, this.centery, 8, 0, 6.28, false);this.context.fill();this.context.closePath();this.context.stroke();this.context.fill();if(this.Get('chart.needle.type') == 'pointer'){
this.context.strokeStyle = color;this.context.lineWidth = this.Get('chart.needle.width');this.context.lineCap = 'round';this.context.lineJoin = 'round';this.context.beginPath();this.context.beginPath();this.context.moveTo(this.centerx, this.centery);if(this.Get('chart.needle.tail')){
this.context.arc(this.centerx,
this.centery,
20,
(((value / this.range) * 360) + 90) / 57.3,
(((value / this.range) * 360) + 90 + 0.01) / 57.3,
false
);}
this.context.arc(this.centerx,
this.centery,
length - 10,
(((value / this.range) * 360) - 90) / 57.3,
(((value / this.range) * 360) - 90 + 0.1 ) / 57.3,
false
);this.context.closePath();} else if(this.Get('chart.needle.type') == 'triangle'){
this.context.lineWidth = 0.01;this.context.lineEnd = 'square';this.context.lineJoin = 'miter';this.context.beginPath();this.context.fillStyle = this.Get('chart.needle.triangle.border');this.context.arc(this.centerx, this.centery, 11, (((value / this.range) * 360)) / 57.3, ((((value / this.range) * 360)) + 0.01) / 57.3, 0);this.context.arc(this.centerx, this.centery, 11, (((value / this.range) * 360) + 180) / 57.3, ((((value / this.range) * 360) + 180) + 0.01)/ 57.3, 0);this.context.arc(this.centerx, this.centery, length - 5, (((value / this.range) * 360) - 90) / 57.3, ((((value / this.range) * 360) - 90) / 57.3) + 0.01, 0);this.context.closePath();this.context.fill();this.context.beginPath();this.context.arc(this.centerx, this.centery, 15, 0, 6.28, 0);this.context.closePath();this.context.fill();this.context.beginPath();this.context.strokeStyle = 'black';this.context.fillStyle = color;this.context.arc(this.centerx, this.centery, 7, (((value / this.range) * 360)) / 57.3, ((((value / this.range) * 360)) + 0.01) / 57.3, 0);this.context.arc(this.centerx, this.centery, 7, (((value / this.range) * 360) + 180) / 57.3, ((((value / this.range) * 360) + 180) + 0.01)/ 57.3, 0);this.context.arc(this.centerx, this.centery, length - 13, (((value / this.range) * 360) - 90) / 57.3, ((((value / this.range) * 360) - 90) / 57.3) + 0.01, 0);this.context.closePath();this.context.stroke();this.context.fill();this.context.beginPath();this.context.arc(this.centerx, this.centery, 7, 0, 6.28, 0);this.context.closePath();this.context.fill();}
this.context.stroke();this.context.fill();this.context.beginPath();this.context.fillStyle = color;this.context.arc(this.centerx, this.centery, this.Get('chart.needle.type') == 'pointer' ? 7 : 12, 0.01, 6.2830, false);this.context.fill();if(this.Get('chart.needle.head') && this.Get('chart.needle.type') == 'pointer'){
this.context.lineWidth = 1;this.context.fillStyle = color;this.context.lineJoin = 'miter';this.context.lineCap = 'butt';this.context.beginPath();this.context.arc(this.centerx, this.centery, length - 5, (((value / this.range) * 360) - 90) / 57.3, (((value / this.range) * 360) - 90 + 0.1) / 57.3, false);this.context.arc(this.centerx,
this.centery,
length - 20,
RGraph.degrees2Radians( ((value / this.range) * 360) - (length < 60 ? 80 : 85) ),
RGraph.degrees2Radians( ((value / this.range) * 360) - (length < 60 ? 100 : 95) ),
1);this.context.closePath();this.context.fill();}
this.context.beginPath();this.context.fillStyle = 'gray';this.context.moveTo(this.centerx, this.centery);this.context.arc(this.centerx,this.centery,2,0,6.2795,false);this.context.closePath();this.context.fill();}
RGraph.Odometer.prototype.DrawLabels = function ()
{
var context = this.context;var size = this.Get('chart.text.size');var font = this.Get('chart.text.font');var centerx = this.centerx;var centery = this.centery;var r = this.radius - (this.Get('chart.label.area') / 2);var start = this.start;var end = this.end;var decimals = this.Get('chart.scale.decimals');var labels = this.Get('chart.labels');var units_pre = this.Get('chart.units.pre');var units_post = this.Get('chart.units.post');context.beginPath();context.fillStyle = this.Get('chart.text.color');if(labels){
for (var i=0; i<labels.length; ++i){
RGraph.Text(context,
font,
size,
centerx + (Math.cos(((i / labels.length) * 6.28) - 1.57) * (this.radius - (this.Get('chart.label.area') / 2) ) ),
centery + (Math.sin(((i / labels.length) * 6.28) - 1.57) * (this.radius - (this.Get('chart.label.area') / 2) ) ),
String(units_pre + labels[i] + units_post),
'center',
'center');}
} else {
RGraph.Text(context, font, size, centerx + (0.588 * r ), centery - (0.809 * r ), String(units_pre + (((end - start) * (1/10)) + start).toFixed(decimals) + units_post), 'center', 'center', false, 36);RGraph.Text(context, font, size, centerx + (0.951 * r ), centery - (0.309 * r), String(units_pre + (((end - start) * (2/10)) + start).toFixed(decimals) + units_post), 'center', 'center', false, 72);RGraph.Text(context, font, size, centerx + (0.949 * r), centery + (0.287 * r), String(units_pre + (((end - start) * (3/10)) + start).toFixed(decimals) + units_post), 'center', 'center', false, 108);RGraph.Text(context, font, size, centerx + (0.588 * r ), centery + (0.809 * r ), String(units_pre + (((end - start) * (4/10)) + start).toFixed(decimals) + units_post), 'center', 'center', false, 144);RGraph.Text(context, font, size, centerx, centery + r, String(units_pre + (((end - start) * (5/10)) + start).toFixed(decimals) + units_post), 'center', 'center', false, 180);RGraph.Text(context, font, size, centerx - (0.588 * r ), centery + (0.809 * r ), String(units_pre + (((end - start) * (6/10)) + start).toFixed(decimals) + units_post), 'center', 'center', false, 216);RGraph.Text(context, font, size, centerx - (0.949 * r), centery + (0.300 * r), a = String(units_pre + (((end - start) * (7/10)) + start).toFixed(decimals) + units_post), 'center', 'center', false, 252);RGraph.Text(context, font, size, centerx - (0.951 * r), centery - (0.309 * r), String(units_pre + (((end - start) * (8/10)) + start).toFixed(decimals) + units_post), 'center', 'center', false, 288);RGraph.Text(context, font, size, centerx - (0.588 * r ), centery - (0.809 * r ), String(units_pre + (((end - start) * (9/10)) + start).toFixed(decimals) + units_post), 'center', 'center', false, 324);RGraph.Text(context, font, size, centerx, centery - r, this.Get('chart.zerostart') ? units_pre + String(this.start) + units_post : String(units_pre + (((end - start) * (10/10)) + start).toFixed(decimals) + units_post), 'center', 'center', false, 360);}
this.context.fill();if(this.Get('chart.value.text')){
context.strokeStyle = 'black';RGraph.Text(context, font, size + 2, centerx, centery + size + 2 + 10, String(this.Get('chart.value.units.pre') + this.value + this.Get('chart.value.units.post')), 'center', 'center', true,  null, 'white');}
}
