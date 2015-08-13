// THIS FILE HAS BEEN MINIFIED

ModalDialog = {}
ModalDialog.dialog = null;ModalDialog.background = null;ModalDialog.offset = 50;ModalDialog.events = [];ModalDialog.Show = function (id, width)
{
ModalDialog.id = id;ModalDialog.width = width;ModalDialog.ShowBackground();ModalDialog.ShowDialog();window.onresize = ModalDialog.Resize;ModalDialog.Resize();ModalDialog.FireCustomEvent('onmodaldialog');}
ModalDialog.ShowBackground = function ()
{
ModalDialog.background = document.createElement('DIV');ModalDialog.background.className = 'ModalDialog_background';ModalDialog.background.style.position = 'fixed';ModalDialog.background.style.top = 0;ModalDialog.background.style.left = 0;ModalDialog.background.style.width = (screen.width + 100) + 'px';ModalDialog.background.style.height = (screen.height + 100) + 'px';ModalDialog.background.style.backgroundColor = 'rgb(204,204,204)';        
ModalDialog.background.style.opacity = 0;ModalDialog.background.style.zIndex = 3276;ModalDialog.background.style.filter = "Alpha(opacity=50)";document.body.appendChild(ModalDialog.background);ModalDialog.background.style.visibility = 'visible';}
ModalDialog.ShowDialog = function ()
{
if(!ModalDialog.dialog){
ModalDialog.dialog = document.createElement('DIV');ModalDialog.dialog.id = 'ModalDialog_dialog';ModalDialog.dialog.className = 'ModalDialog_dialog';var borderRadius = '15px';ModalDialog.dialog.style.borderRadius = borderRadius;ModalDialog.dialog.style.MozBorderRadius = borderRadius;ModalDialog.dialog.style.WebkitBorderRadius = borderRadius;ModalDialog.dialog.style.boxShadow = '3px 3px 3px rgba(96,96,96,0.5)';ModalDialog.dialog.style.MozBoxShadow = '3px 3px 3px rgba(96,96,96,0.5)';ModalDialog.dialog.style.WebkitBoxShadow = 'rgba(96,96,96,0.5) 3px 3px 3px';ModalDialog.dialog.style.position = 'fixed';ModalDialog.dialog.style.backgroundColor = 'white';ModalDialog.dialog.style.width = parseInt(ModalDialog.width) + 'px';ModalDialog.dialog.style.border = '2px solid #999';ModalDialog.dialog.style.zIndex = 32767;ModalDialog.dialog.style.padding = '5px';ModalDialog.dialog.style.paddingTop = '25px';ModalDialog.dialog.style.opacity = 0;if(document.all){
ModalDialog.dialog.style.zIndex = 32767;}
if(navigator.userAgent.indexOf('Opera') != -1){
ModalDialog.dialog.style.paddingTop = '25px';} else if(navigator.userAgent.indexOf('MSIE') != -1){
ModalDialog.dialog.style.paddingTop = '25px';} else if(navigator.userAgent.indexOf('Safari') != -1){
ModalDialog.dialog.style.paddingTop = '25px';}
document.body.appendChild(ModalDialog.dialog);var bar = document.createElement('DIV');bar.className = 'ModalDialog_topbar';bar.style.top = 0;bar.style.left = 0;bar.style.width = '100%';bar.style.height = '20px';bar.style.backgroundColor = '#bbb';bar.style.borderBottom = '2px solid #999';bar.style.position = 'absolute';var borderRadius = '11px';bar.style.WebkitBorderTopLeftRadius = borderRadius;bar.style.WebkitBorderTopRightRadius = borderRadius;bar.style.MozBorderRadiusTopleft = borderRadius;bar.style.MozBorderRadiusTopright = borderRadius;bar.style.borderTopRightRadius = borderRadius;bar.style.borderTopLeftRadius = borderRadius;ModalDialog.dialog.appendChild(bar);var content = document.createElement('DIV');content.style.width = '100%';content.style.height = '100%';ModalDialog.dialog.appendChild(content);content.innerHTML = document.getElementById(ModalDialog.id).innerHTML;ModalDialog.dialog.style.left = (document.body.offsetWidth / 2) - (ModalDialog.dialog.offsetWidth / 2) + 'px';ModalDialog.dialog.style.top = '30%';}
ModalDialog.dialog.style.visibility = 'visible';setTimeout('ModalDialog.dialog.style.opacity = 0.2', 50);setTimeout('ModalDialog.dialog.style.opacity = 0.4', 100);setTimeout('ModalDialog.dialog.style.opacity = 0.6', 150);setTimeout('ModalDialog.dialog.style.opacity = 0.8', 200);setTimeout('ModalDialog.dialog.style.opacity = 1', 250);setTimeout('ModalDialog.background.style.opacity = 0.1', 50);setTimeout('ModalDialog.background.style.opacity = 0.2', 100);setTimeout('ModalDialog.background.style.opacity = 0.3', 150);setTimeout('ModalDialog.background.style.opacity = 0.4', 200);setTimeout('ModalDialog.background.style.opacity = 0.5', 250);}
ModalDialog.Close = function ()
{
if(ModalDialog.dialog){
ModalDialog.dialog.style.visibility = 'hidden';ModalDialog.dialog.style.opacity = 0;}
if(ModalDialog.background){
ModalDialog.background.style.visibility = 'hidden';ModalDialog.background.style.opacity = 0;}        
}
ModalDialog.Hide = ModalDialog.Close
ModalDialog.Resize = function ()
{
if(ModalDialog.dialog){
ModalDialog.dialog.style.left = (document.body.offsetWidth / 2) - (ModalDialog.dialog.offsetWidth / 2) + 'px';}
ModalDialog.background.style.width = '2500px';ModalDialog.background.style.height = '2500px';}
ModalDialog.AddCustomEventListener = function (name, func)
{
if(typeof(ModalDialog.events) == 'undefined'){
ModalDialog.events = [];}
ModalDialog.events.push([name, func]);}
ModalDialog.FireCustomEvent = function (name)
{
for (var i=0; i<ModalDialog.events.length; ++i){
if(typeof(ModalDialog.events[i][0]) == 'string' && ModalDialog.events[i][0] == name && typeof(ModalDialog.events[i][1]) == 'function'){
ModalDialog.events[i][1]();}
}
}
ModalDialog.isIE8 = function ()
{
return document.all && (navigatot.userAgent.indexOf('MSIE 8') > 0);}