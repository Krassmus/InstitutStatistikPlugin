// THIS FILE HAS BEEN MINIFIED

if(typeof(RGraph) == 'undefined') RGraph = {};RGraph.Thermometer = function (id, min, max, value)
{
this.id = id;this.canvas = document.getElementById(id);this.context = this.canvas.getContext ? this.canvas.getContext("2d") : null;this.canvas.__object__ = this;this.type = 'thermometer';this.isRGraph = true;this.min = min;this.max = max;this.value = value;this.coords = [];this.graphArea = [];RGraph.OldBrowserCompat(this.context);this.properties = {
'chart.colors':                 ['red'],
'chart.gutter.left':            15,
'chart.gutter.right':           15,
'chart.gutter.top':             15,
'chart.gutter.bottom':          15,
'chart.ticksize':               5,
'chart.text.font':              'Verdana',
'chart.text.size':              10,
'chart.units.pre':              '',
'chart.units.post':             '',
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
'chart.title':                  '',
'chart.title.hpos':             null,
'chart.title.vpos':             null,
'chart.title.side':             '',
'chart.shadow':                 true,
'chart.shadow.offsetx':         0,
'chart.shadow.offsety':         0,
'chart.shadow.blur':            15,
'chart.shadow.color':           'gray',
'chart.resizable':              false,
'chart.contextmenu':            null,
'chart.adjustable':             false,
'chart.text.color':             'black',
'chart.value.label':            true
}
if(!this.canvas){
alert('[THERMOMETER] No canvas support');return;}
}
RGraph.Thermometer.prototype.Set = function (name, value)
{
this.properties[name.toLowerCase()] = value;}
RGraph.Thermometer.prototype.Get = function (name)
{
return this.properties[name];}
RGraph.Thermometer.prototype.Draw = function ()
{
RGraph.FireCustomEvent(this, 'onbeforedraw');RGraph.ClearEventListeners(this.id);this.gutterLeft = this.Get('chart.gutter.left');this.gutterRight = this.Get('chart.gutter.right');this.gutterTop = this.Get('chart.gutter.top');this.gutterBottom = this.Get('chart.gutter.bottom');this.DrawBackground();this.DrawBar();this.DrawTickMarks();this.DrawLabels();if(this.Get('chart.title')){
this.DrawTitle();}
if(this.Get('chart.title.side')){
this.DrawSideTitle();}
if(this.Get('chart.resizable')){
RGraph.AllowResizing(this);}
if(this.Get('chart.contextmenu')){
RGraph.ShowContext(this);}
if(this.Get('chart.annotatable')){
RGraph.Annotate(this);}
if(this.Get('chart.adjustable')){
RGraph.AllowAdjusting(this);}
RGraph.FireCustomEvent(this, 'ondraw');}
RGraph.Thermometer.prototype.DrawBackground = function ()
{
var canvas = this.canvas;var context = this.context;var bulbRadius = (RGraph.GetWidth(this) - this.gutterLeft - this.gutterRight) / 2;this.bulbRadius = bulbRadius;context.beginPath();context.fillStyle = 'black';if(this.Get('chart.shadow')){
RGraph.SetShadow(this, this.Get('chart.shadow.color'), this.Get('chart.shadow.offsetx'), this.Get('chart.shadow.offsety'), this.Get('chart.shadow.blur'));}
context.fillRect(this.gutterLeft + 12,this.gutterTop + bulbRadius,RGraph.GetWidth(this) - this.gutterLeft - this.gutterRight - 24, RGraph.GetHeight(this) - this.gutterTop - this.gutterBottom - bulbRadius - bulbRadius);context.arc(this.gutterLeft + bulbRadius, RGraph.GetHeight(this) - this.gutterBottom - bulbRadius, bulbRadius, 0, 6.28, 0);context.arc(this.gutterLeft + bulbRadius,this.gutterTop + bulbRadius,(RGraph.GetWidth(this) - this.gutterLeft - this.gutterRight - 24)/ 2,0,6.28,0);context.fill();RGraph.NoShadow(this);context.beginPath();context.fillStyle = 'white';context.fillRect(this.gutterLeft + 12 + 1,this.gutterTop + bulbRadius,RGraph.GetWidth(this) - this.gutterLeft - this.gutterRight - 24 - 2,RGraph.GetHeight(this) - this.gutterTop - this.gutterBottom - bulbRadius - bulbRadius);context.arc(this.gutterLeft + bulbRadius, RGraph.GetHeight(this) - this.gutterBottom - bulbRadius, bulbRadius - 1, 0, 6.28, 0);context.arc(this.gutterLeft + bulbRadius,this.gutterTop + bulbRadius,((RGraph.GetWidth(this) - this.gutterLeft - this.gutterRight - 24)/ 2) - 1,0,6.28,0);context.fill();context.beginPath();context.fillStyle = this.Get('chart.colors')[0];context.arc(this.gutterLeft + bulbRadius, RGraph.GetHeight(this) - this.gutterBottom - bulbRadius, bulbRadius - 1, 0, 6.28, 0);context.fillRect(this.gutterLeft + 12 + 1, RGraph.GetHeight(this) - this.gutterBottom - bulbRadius - bulbRadius,RGraph.GetWidth(this) - this.gutterLeft - this.gutterRight - 24 - 2, bulbRadius);context.fill();this.graphArea[0] = this.gutterLeft + 12 + 1;this.graphArea[1] = this.gutterTop + bulbRadius;this.graphArea[2] = RGraph.GetWidth(this) - this.gutterLeft - this.gutterRight - 24 - 2;this.graphArea[3] = (RGraph.GetHeight(this) - this.gutterBottom - bulbRadius - bulbRadius) - (this.graphArea[1]);}
RGraph.Thermometer.prototype.DrawBar = function ()
{
var barHeight = (this.value / (this.max - this.min)) * this.graphArea[3];var context = this.context;context.beginPath();context.fillStyle = this.Get('chart.colors')[0];context.fillRect(this.graphArea[0],this.graphArea[1] + this.graphArea[3] - barHeight,this.graphArea[2],barHeight);context.fill();this.coords = [this.graphArea[0],this.graphArea[1] + this.graphArea[3] - barHeight,this.graphArea[2],barHeight];}
RGraph.Thermometer.prototype.DrawTickMarks = function ()
{
var ticksize = this.Get('chart.ticksize');for (var i=this.graphArea[1]; i<=(this.graphArea[1] + this.graphArea[3]); i += (this.graphArea[3] / 10)){
this.context.beginPath();this.context.moveTo(this.gutterLeft + 12, i);this.context.lineTo(this.gutterLeft + 12 + ticksize, i);this.context.stroke();}
for (var i=this.graphArea[1]; i<=(this.graphArea[1] + this.graphArea[3]); i += (this.graphArea[3] / 10)){
this.context.beginPath();this.context.moveTo(RGraph.GetWidth(this) - (this.gutterRight + 12), i);this.context.lineTo(RGraph.GetWidth(this) - (this.gutterRight + 12 + ticksize), i);this.context.stroke();}
}
RGraph.Thermometer.prototype.DrawLabels = function ()
{
if(this.Get('chart.value.label')){
this.context.beginPath();this.context.fillStyle = this.Get('chart.text.color');RGraph.Text(this.context,this.Get('chart.text.font'),this.Get('chart.text.size'),this.gutterLeft + this.bulbRadius,this.coords[1] + this.Get('chart.text.size'),this.Get('chart.units.pre') + String(this.value) + this.Get('chart.units.post'),'center','center',true,null,'white');this.context.fill();}
}
RGraph.Thermometer.prototype.DrawTitle = function ()
{
this.context.beginPath();this.context.fillStyle = this.Get('chart.text.color');RGraph.Text(this.context,this.Get('chart.text.font'),this.Get('chart.text.size') + 2,this.gutterLeft + ((RGraph.GetWidth(this) - this.gutterLeft - this.gutterRight) / 2),this.gutterTop,String(this.Get('chart.title')),'center','center',null,null,null,true);this.context.fill();}
RGraph.Thermometer.prototype.DrawSideTitle = function ()
{
this.context.beginPath();this.context.fillStyle = this.Get('chart.text.color');RGraph.Text(this.context,this.Get('chart.text.font'),this.Get('chart.text.size') + 2,this.gutterLeft,RGraph.GetHeight(this) / 2,String(this.Get('chart.title.side')),'center','center',null,270,null,true);this.context.fill();}