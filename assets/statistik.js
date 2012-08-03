STUDIP.statistik = {};
STUDIP.statistik.already_loading = false;
STUDIP.statistik.categories = [];
STUDIP.statistik.switch_semester = function () {
    if (jQuery("#start_semester_id").val() && jQuery("#end_semester_id").val()) {
        if (jQuery("#start_semester_id > [value=" + jQuery("#start_semester_id").val() + "]").data("start")
                > jQuery("#end_semester_id > [value=" + jQuery("#end_semester_id").val() + "]").data("start")) {
            var end_semester = jQuery("#end_semester_id").val();
            jQuery("#end_semester_id").val(jQuery("#start_semester_id").val());
            jQuery("#start_semester_id").val(end_semester);
        }
    }
};
STUDIP.statistik.export_data = function () {
    if (STUDIP.statistik.already_loading) {
        return;
    }
    STUDIP.statistik.categories = [];
    STUDIP.statistik.already_loading = true;
    jQuery("input[type=checkbox][name^=category]").each(function () {
        if (this.checked) {
            var category_name = jQuery(this).attr("name").match(/category\[(.*?)\]/);
            if (category_name && category_name[1]) {
                STUDIP.statistik.categories.push(category_name[1]);
            }
        }
    });
    var start_semester_id = jQuery("#start_semester_id").val();
    var end_semester_id = jQuery("#end_semester_id").val();
    var institut = jQuery("#institut_id").val();
    var output_format = jQuery("input[type='radio'][name='output_format']:checked").val();
    jQuery("#html_output").hide();
    jQuery("#institut_data").html('');
    STUDIP.statistik.fetch_data_recursively(0, start_semester_id, end_semester_id, institut, output_format);
};
STUDIP.statistik.fetch_data_recursively = function (category, start_semester_id, end_semester_id, institut, output_format) {
    if (category <= STUDIP.statistik.categories.length - 1) {
        STUDIP.statistik.load_marker(STUDIP.statistik.categories[category]);
        var percent = 100 * (category+1) / STUDIP.statistik.categories.length;
        jQuery("#progressbar").show().progressbar({ 'value': percent });
        jQuery.ajax({
            'url': ajax_url + "/fetch_data",
            'data': {
                'category': STUDIP.statistik.categories[category],
                'start_semester_id': start_semester_id,
                'end_semester_id': end_semester_id,
                'institut_id': institut
            },
            'dataType': "json",
            'success': function (data) {
                STUDIP.statistik.showData(STUDIP.statistik.categories[category], data);
                STUDIP.statistik.fetch_data_recursively(category + 1, start_semester_id, end_semester_id, institut, output_format);
            }
        });

        //STUDIP.statistik.showData(categories, start_semester_id, end_semester_id, institut, output_format);
    } else {
        //alles geladen, jetzt noch verpacken und präsentieren
        if (output_format === "web") {
            jQuery("#html_output").fadeIn();
            jQuery("#accordion").accordion({
                'autoHeight': false,
                'collapsible': true
            });
        } else {
            var data = [];
            var data_header = ["Institut"];
            jQuery.each(STUDIP.statistik.categories, function (Index, category) {
                data_header.push(category_names[category]);
            });
            data.push(data_header);
            jQuery("#institut_data > div").each(function (index, inst_data) {
                var data_line = [];
                data_line.push(jQuery("h3", inst_data).text());
                jQuery.each(STUDIP.statistik.categories, function (Index, category) {
                    data_line.push(jQuery("table tr." + category + " td.anzahl", inst_data).text());
                });
                data.push(data_line);
            });

            if (output_format === "pdf" || output_format === "pdf_stat") {
                var graphs = {};
                jQuery.each(STUDIP.statistik.categories, function (index, category) {
                    graphs[category] = document.getElementById(category + '_diagramm').toDataURL("images/png");
                });
                if (output_format === "pdf_stat") {
                    graphs['csv'] = JSON.stringify(data);
                }
                STUDIP.statistik.download(ajax_url + "/pdf", graphs, "post");
            }
            if (output_format === "csv") {
                jQuery.each(data, function (index1, line) {
                    jQuery.each(line, function (index2, value) {
                        line[index2] = value.replace('"', '""');
                    });
                    data[index1] = '"' + line.join('";"') + '"';
                });
                data = data.join("\n");
                //location.href = "data:text/csv;charset=CP-1252;Content-Disposition:attachment;filename=statistik.csv," + encodeURIComponent(data);
                location.href = STUDIP.URLHelper.getURL(ajax_url + "/file", {
                    'mime_type': "text/csv",
                    'filename': "statistik.csv",
                    'content': data
                });
            }
        }
        STUDIP.statistik.already_loading = false;
        jQuery("#progressbar").hide();
    }
};

STUDIP.statistik.download = function(url, data, method){
	//url and data options required
	if( url && data ){
		//data can be string of parameters or array/object
		//data = typeof data == 'string' ? data : jQuery.param(data);
		//split params into form inputs
		var inputs = '';
		jQuery.each(data, function(category, image) {
			inputs += '<input type="hidden" name="graphs['+ category +']" value="'+ image.replace(/"/g, '&quot;') +'" />';
		});
		//send request
		jQuery('<form accept-charset=utf-8 action="'+ url +'" method="'+ (method||'post') +'">'+inputs+'</form>')
		.appendTo('body').submit().remove();
	};
};

STUDIP.statistik.load_marker = function (category) {
    //Bitte Warten schreiben:
    var pencil = jQuery('#' + category + '_diagramm')[0].getContext("2d");
    var width = jQuery('#' + category + '_diagramm').width();
    var height = jQuery('#' + category + '_diagramm').height();
    pencil.clearRect(0, 0, width, height);
    pencil.width = pencil.width;
    pencil.textAlign = "center";
    pencil.fillStyle = "rgba(60,60,160,1)";
    pencil.shadowColor = "rgba(160,60,160,0.5)";
    pencil.shadowBlur = "15";
    pencil.font = "28px sans-serif";
    pencil.fillText('Wird geladen', width/2, height/2);
};

STUDIP.statistik.showData = function (category, json) {
    //Bitte Warten schreiben:
    var width = jQuery('#' + category + '_diagramm').width();
    var height = jQuery('#' + category + '_diagramm').height();
    
    var canvas_object = jQuery('#' + category + '_diagramm');
    var canvas = canvas_object[0].getContext("2d");
    canvas.clearRect(0,0,100000,100000);
    canvas.width = canvas.width;
    canvas.textAlign = "left";
    //Daten schreiben
    var bar = new RGraph.Bar(category + '_diagramm', json.anzahl);
    bar.Set('chart.labels', json.institut_namen);
    bar.Set('chart.ylabels', true);
    bar.Set('chart.title', category_names[category]);
    //bar.Set('chart.title.hpos', 0.13);
    if (!RGraph.isIE8()) {
        bar.Set('chart.tooltips', json.institut_namen);
    }
    bar.Set('chart.gutter.left', 45);
    bar.Set('chart.gutter.bottom', 400);
    bar.Set('chart.background.grid', true);
    bar.Set('chart.shadow', true);
    bar.Set('chart.shadow.blur', 15);
    bar.Set('chart.shadow.color', 'rgba(' + colors[category] + ',0.5)');
    bar.Set('chart.shadow.offsetx', 0);
    bar.Set('chart.shadow.offsety', 0);
    bar.Set('chart.colors', ['rgb(' + colors[category] + ')']);
    bar.Set('chart.strokecolor', 'rgba(' + colors[category] + ',0.5)');
    bar.Set('chart.text.angle', 65);
    bar.Set('chart.text.size', 8);
    bar.Set('chart.resizable', true);
    bar.Draw();

    jQuery.each(json.institut_namen, function (index, institut) {
        if (jQuery("#institut_data > ." + json.institut_ids[index]).length === 0) {
            var new_area = jQuery("#institut_data_skeletton")
                .clone()
                .show()
                .attr("id", "")
                .addClass(json.institut_ids[index]);
            new_area.find("h3").text(institut);
            jQuery.each(categories, function (index, category) {
                var tbody = new_area.find("tbody");
                tbody.append("<tr class='" + category + "'><td>" + category_names[category] + "</td><td class='anzahl'>?</td></tr>");
            });
            new_area.appendTo("#institut_data");
        }
    });

    //Daten eintragen in die Tabelle
    jQuery.each(jQuery("tr." + category + " > td.anzahl"), function (index, element) {
        jQuery(element).text(json.anzahl[index]);
    });

    //nächster Request
    if (typeof callback === "function") {
        callback();
    }

        /*error: function (jqXHR, textStatus, errorThrown) {
            var canvas = jQuery('#' + category + '_diagramm')[0].getContext("2d");
            canvas.clearRect(0, 0, width, height);
            canvas.width = canvas.width;
            canvas.textAlign = "center";
            canvas.fillStyle = "rgba(200,0,0,1)";
            canvas.shadowColor = "rgba(160,60,160,0.5)";
            canvas.shadowBlur = "15";
            canvas.font = "28px sans-serif";
            canvas.fillText('Fehler beim Laden', width/2, height/2 - 20);
            canvas.font = "18px sans-serif";
            canvas.fillText(errorThrown, width/2, height/2 + 15);

            //nächster Request
            if (typeof callback === "function") {
                callback();
            }
        }*/
};