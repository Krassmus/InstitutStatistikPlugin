<table align="center" style="border: 1px solid #aaaaaa;">
    <tbody>
        <tr>
            <td><label for="semester_id"><?= _("Semester") ?></label></td>
            <td>
                <select id="semester_id" name="semester_id">
                    <option value="">alle</option>
                    <? foreach ($semester as $sem) : ?>
                    <option value="<?= $sem['semester_id'] ?>"<?= Request::get("semester_id") === $sem['semester_id'] ? " selected" : "" ?>><?= htmlReady($sem['name']) ?></option>
                    <? endforeach ?>
                </select>
            </td>
        </tr>
        <tr>
            <td><label for="fakultaets_id"><?= _("Nach Fakultät") ?></label></td>
            <td>
                <select name="fakultaets_id" id="fakultaets_id">
                    <option value=""><?= _("alle") ?></option>
                    <? foreach ($fakultaeten as $fakultaet) : ?>
                    <option value="<?= $fakultaet['Institut_id'] ?>"><?= htmlReady($fakultaet['Name']) ?></option>
                    <? endforeach ?>
                </select>
            </td>
        </tr>
        <tr>
            <td></td>
            <td>
                <a href="" onClick="jQuery('#institut_data').text(''); loadData(categories[0]); return false;">
                    <?= makebutton("auswaehlen", "img") ?>
                </a>
            </td>
        </tr>
    </tbody>
</table>

<h2><?= _("Diagramme") ?></h2>
<?
$institut_namen = array();
$institut_ids = array();

$icons = array(
    "veranstaltungen" => "seminar",
    "dokumente" => "files",
    "forum" => "forum-shrink",
    "wiki" => "wiki",
    "litlists" => "literature",
    "scm" => "infopage",
    "lernmodule" => "learnmodule",
    "dozenten" => "person",
    "doz_aktivitaet_dokumente" => "file",
    "doz_aktivitaet_forum" => "forum",
    "doz_aktivitaet_wiki" => "wiki",
    "doz_aktivitaet_sum" => "file"
);
$colors = array(
    "veranstaltungen" => "255,0,0",
    "dokumente" => "20,0,255",
    "forum" => "0,255,0",
    "wiki" => "0,120,120",
    "litlists" => "200,0,180",
    "scm" => "120,120,120",
    "lernmodule" => "170,180,180",
    "dozenten" => "0,120,255",
    "doz_aktivitaet_dokumente" => "255,0,120",
    "doz_aktivitaet_forum" => "255,120,0",
    "doz_aktivitaet_wiki" => "120,0,255",
    "doz_aktivitaet_sum" => "100,0,0"
);

$anzahl = array();
?>

<? foreach ($categories as $category => $string) : ?>
<h3><?= Assets::img("icons/16/grey/".$icons[$category].".png", array('class' => "text-top"))." ".$string ?></h3>
<canvas id="<?= $category ?>_diagramm" width="1000" height="400">
    <?= _("Diagramm konnte nicht dargestellt werden. Versuchen Sie einen anderen Browser wie zum Beispiel Firefox.") ?>
</canvas>
<? endforeach ?>

<h2><?= _("Daten nach Instituten") ?></h2>
<div id="institut_data">
</div>
<div id="institut_data_skeletton" style="display: none;">
    <h3 class="title"></h3>
    <table>
        <tbody>
        </tbody>
    </table>
</div>

<?
foreach ($categories as $key => $category) {
    $categories[$key] = studip_utf8encode($category);
}
?>
<script>
var colors = <?= json_encode($colors) ?>;
var institute = <?= json_encode($institut_namen) ?>;
var categories = <?= json_encode(array_keys($categories)) ?>;
var category_names = <?= json_encode($categories) ?>;
var ajax_url = "<?= URLHelper::getURL("plugins.php/institutstatistikplugin/fetch_data") ?>";

loadData = function (category, justthis) {
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
    pencil.fillText('<?= _("Wird geladen") ?>', width/2, height/2);
    //Daten holen
    jQuery.ajax({
        url: ajax_url,
        data: {
            'category': category,
            'semester_id': jQuery('select[name=semester_id]').val(),
            'fakultaets_id': jQuery('select[name=fakultaets_id]').val()
        },
        dataType: "json",
        success: function (json) {
            var canvas = jQuery('#' + category + '_diagramm')[0].getContext("2d");
            canvas.clearRect(0,0,700,300);
            canvas.width = canvas.width;
            canvas.textAlign = "left";
            //Daten schreiben
            var bar = new RGraph.Bar(category + '_diagramm', json.anzahl);
            bar.Set('chart.labels', json.institut_namen);
            if (!RGraph.isIE8()) {
                bar.Set('chart.tooltips', json.institut_namen);
            }
            bar.Set('chart.gutter.left', 45);
            bar.Set('chart.gutter.bottom', 220);
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
            if (typeof justthis === "undefined" || !justthis) {
                jQuery.each(categories, function (index, new_cat) {
                    if (new_cat === category && index !== categories.length - 1) {
                        loadData(categories[index + 1], false);
                    }
                });
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            var canvas = jQuery('#' + category + '_diagramm')[0].getContext("2d");
            canvas.clearRect(0,0,700,300);
            canvas.width = canvas.width;
            canvas.textAlign = "center";
            canvas.fillStyle = "rgba(200,0,0,1)";
            canvas.shadowColor = "rgba(160,60,160,0.5)";
            canvas.shadowBlur = "15";
            canvas.font = "28px sans-serif";
            canvas.fillText('<?= _("Fehler beim Laden") ?>', width/2, height/2 - 20);
            canvas.font = "18px sans-serif";
            canvas.fillText(errorThrown, width/2, height/2 + 15);

            //nächster Request
            if (typeof justthis === "undefined" || !justthis) {
                jQuery.each(categories, function (index, new_cat) {
                    if (new_cat === category && index !== categories.length - 1) {
                        loadData(categories[index + 1], false);
                    }
                });
            }
        }
    });
};

jQuery(function () {
    loadData(categories[0]);
});
</script>