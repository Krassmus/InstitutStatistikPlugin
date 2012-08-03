<style>
    #setup_table {
        display: block;
        margin: 6px;
        margin-top: 7px;
        margin-bottom: 7px;
        padding: 4px;
        border: 3px solid white;
        background-color: #f3f3f3;
        border-radius: 10px;
        box-shadow: 0px 0px 4px #d0d0d0;
        width: 400px;
        margin-left: auto;
        margin-right: auto;
    }
</style>
<table id="setup_table" align="center">
    <tbody>
        <tr>
            <td><label for="institut_id"><?= l("Nach Institut") ?></label></td>
            <td>
                <select name="institut_id" id="institut_id">
                    <option value=""><?= l("alle Fakultšten") ?></option>
                    <? foreach ($institute as $institut) : ?>
                    <option value="<?= $institut['Institut_id'] ?>"><?= (!$institut['is_fak'] ? "&nbsp;&nbsp;&nbsp;&nbsp;" : "").htmlReady($institut['Name']) ?></option>
                    <? endforeach ?>
                </select>
            </td>
        </tr>
        <tr>
            <td><label for="semester_id"><?= l("Semester") ?></label></td>
            <td>
                <select id="start_semester_id" name="start_semester_id" onChange="STUDIP.statistik.switch_semester();">
                    <option value=""><?= ll("unbegrenzt") ?></option>
                    <? foreach ($semester as $sem) : ?>
                    <option data-start="<?= $sem['beginn'] ?>" value="<?= $sem['semester_id'] ?>"<?= Request::get("semester_id") === $sem['semester_id'] ? " selected" : "" ?>><?= htmlReady($sem['name']) ?></option>
                    <? endforeach ?>
                </select>
                <?= l("bis") ?>
                <select id="end_semester_id" name="end_semester_id" onChange="STUDIP.statistik.switch_semester();">
                    <option value=""><?= ll("unbegrenzt") ?></option>
                    <? foreach ($semester as $sem) : ?>
                    <option data-start="<?= $sem['beginn'] ?>" value="<?= $sem['semester_id'] ?>"<?= Request::get("semester_id") === $sem['semester_id'] ? " selected" : "" ?>><?= htmlReady($sem['name']) ?></option>
                    <? endforeach ?>
                </select>
            </td>
        </tr>
        <tr>
            <td><?= l("Kategorien") ?></td>
            <td>
                <? foreach ($categories as $category => $category_name) : ?>
                <label>
                    <input type="checkbox" value="1" name="category[<?= $category ?>]" checked>
                    <?= htmlReady($category_name) ?>
                </label><br>
                <? endforeach ?>
            </td>
        </tr>
        <tr>
            <td><?= l("Ausgabe") ?></td>
            <td>
                <label>
                    <input type="radio" name="output_format" value="web" checked>
                    <?= l("Auf Webseite darstellen") ?>
                </label><br>
                <label>
                    <input type="radio" name="output_format" value="pdf_stat">
                    <?= l("PDF mit Grafiken und Statistiken") ?>
                </label><br>
                <label>
                    <input type="radio" name="output_format" value="pdf">
                    <?= l("PDF mit Grafiken") ?>
                </label><br>
                <label>
                    <input type="radio" name="output_format" value="csv">
                    <?= l("CSV mit Statistik") ?>
                </label><br>
            </td>
        </tr>
        <tr>
            <td></td>
            <td>
                <a href="#" onClick="STUDIP.statistik.export_data(); /*jQuery('#institut_data').text(''); loadData(categories[0]);*/ return false;">
                    <?= makebutton("auswaehlen", "img") ?>
                </a>
            </td>
        </tr>
        <tr>
            <td colspan="2">
                <div id="progressbar"></div>
            </td>
        </tr>
    </tbody>
</table>

<div id="html_output" style="display: none;">
    <h2><?= l("Diagramme") ?></h2>
    <div id="accordion">
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
        <div>
            <canvas id="<?= $category ?>_diagramm" width="1000" height="700">
                <?= ll("Diagramm konnte nicht dargestellt werden. Versuchen Sie einen anderen Browser wie zum Beispiel Firefox.") ?>
            </canvas>
        </div>
        <? endforeach ?>

        <h2><?= l("Daten nach Instituten") ?></h2>
        <div id="institut_data">
        </div>
    </div>
    <div id="institut_data_skeletton" style="display: none;">
        <h3 class="title"></h3>
        <table>
            <tbody>
            </tbody>
        </table>
    </div>
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
var ajax_url = "<?= $GLOBALS['ABSOLUTE_URI_STUDIP'] . "plugins.php/institutstatistikplugin" ?>";

</script>