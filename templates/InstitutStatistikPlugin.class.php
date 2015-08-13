<?php
/**
* TestPlugin.class.php
*
* @author        Rasmus Fuhse <fuhse@data-quest.de>, Suchi & Berg GmbH <info@data-quest.de>
*/
// +---------------------------------------------------------------------------+
// This file is part of Stud.IP
// Copyright (C) 2011 Rasmus Fuhse <fuhse@data-quest.de>
// Suchi & Berg GmbH <info@data-quest.de>
// +---------------------------------------------------------------------------+
// This program is free software; you can redistribute it and/or
// modify it under the terms of the GNU General Public License
// as published by the Free Software Foundation; either version 2
// of the License, or any later version.
// +---------------------------------------------------------------------------+
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
// You should have received a copy of the GNU General Public License
// along with this program; if not, write to the Free Software
// Foundation, Inc., 59 Temple Place - Suite 330, Boston, MA  02111-1307, USA.
// +---------------------------------------------------------------------------+

if (!function_exists("l")) {
    function l ($text) {
        gettext($text);
    }
}
if (!function_exists("ll")) {
    function ll ($text) {
        gettext($text);
    }
}

require_once 'lib/classes/exportdocument/ExportPDF.class.php';

class InstitutStatistikPlugin extends StudIPPlugin implements SystemPlugin {

    protected $statements = array();
    protected $categories = array();

    /**
     * Constructor for the class SeminarGridSearch
     */
    function __construct() {
        parent::__construct();
        $navigation = new AutoNavigation(_("Institut-Statistik"), PluginEngine::getURL($this, array(), "show"));
        Navigation::addItem('/tools/'.get_class($this), $navigation);
        $this->categories = array(
            "veranstaltungen" => _("Anzahl Veranstaltungen"),
            "dokumente" => _("Hochgeladene Dokumente"),
            "forum" => _("Forenpostings"),
            "wiki" => _("Bearbeitete Wikiseiten"),
            "litlists" => _("Erstellte Literaturlisten"),
            "scm" => _("Freie Informationen"),
            "lernmodule" => _("e-Learning Module"),
            "dozenten" => _("Anzahl Dozenten"),
            "doz_aktivitaet_dokumente" => _("Dozenaktivitäten: Dokumente"),
            "doz_aktivitaet_forum" => _("Dozenaktivitäten: Forum"),
            "doz_aktivitaet_wiki" => _("Dozenaktivitäten: Wiki"),
            "doz_aktivitaet_sum" => _("Dozenaktivitäten: Insgesamt"),
            "stud_aktivitaet_dokumente" => _("Studentenaktivitäten: Dokumente"),
            "stud_aktivitaet_forum" => _("Studentenaktivitäten: Forum"),
            "stud_aktivitaet_wiki" => _("Studentenaktivitäten: Wiki"),
            "stud_aktivitaet_sum" => _("Studentenaktivitäten: Insgesamt")
        );
    }

    function show_action($choice = '') {
        $rgraph_file = array(
            'RGraph.common.core.js',
            'RGraph.common.adjusting.js',
            'RGraph.common.annotate.js',
            'RGraph.common.context.js',
            'RGraph.common.resizing.js',
            'RGraph.common.tooltips.js',
            'RGraph.common.zoom.js',
            'RGraph.bar.js',
            'statistik.js'
        );
        foreach ($rgraph_file as $rgraph_file) {
            PageLayout::addHeadElement(
                "script",
                array('src' => $GLOBALS['ABSOLUTE_URI_STUDIP'].$this->getPluginPath()."/assets/".$rgraph_file),
                ""
            );
        }

        $db = DBManager::get();

        $inst = $db->query(
            "SELECT i.Institut_id, i.Name, IF(i.fakultaets_id = i.Institut_id,1,0) AS is_fak " .
            "FROM Institute as i " .
                "INNER JOIN Institute AS f ON (i.fakultaets_id = f.Institut_id) " .
            "ORDER BY f.Name ASC, i.Name ASC " .
        "")->fetchAll(PDO::FETCH_ASSOC);
        $institute = $data = array();

        foreach ($inst as $institut) {
            $data[$institut['Institut_id']] = array(
                'name' => $institut['Name']
            );
            $institute[$institut['Institut_id']] = array(
                'name' => $institut['Name'],
                'is_fak' => $institut['is_fak']
            );
        }

        $template = $this->getTemplate("statistik.php");
        $template->set_attribute("statistik_data", $data);
        $template->set_attribute("institute", $inst);
        $template->set_attribute('categories', $this->categories);
        $template->set_attribute("semester", $db->query("SELECT * FROM semester_data ORDER BY beginn")->fetchAll(PDO::FETCH_ASSOC));
        print $template->render();
    }

    public function fetch_data_action() {
        $db = DBManager::get();

        $start = 0;
        $ende = 86400 * 365 * 60;
        if (Request::get("start_semester_id")) {
            $semester = $db->query(
                "SELECT * FROM semester_data WHERE semester_id = ".$db->quote(Request::option("start_semester_id"))." " .
            "")->fetch(PDO::FETCH_ASSOC);
            $start = $semester['beginn'];
        }
        if (Request::get("end_semester_id")) {
            $semester = $db->query(
                "SELECT * FROM semester_data WHERE semester_id = ".$db->quote(Request::option("end_semester_id"))." " .
            "")->fetch(PDO::FETCH_ASSOC);
            $ende = $semester['ende'];
        }

        if (Request::get("institut_id")) {
            $institut = $db->query(
                "SELECT * " .
                "FROM Institute " .
                "WHERE Institut_id = ".$db->quote(Request::option("institut_id"))." " .
                "ORDER BY Name ASC " .
            "")->fetch(PDO::FETCH_ASSOC);
            if ($institut['Institut_id'] === $institut['fakultaets_id']) {
                $institute = $db->query(
                    "SELECT Institut_id, Name " .
                    "FROM Institute " .
                    "WHERE fakultaets_id = ".$db->quote(Request::option("institut_id"))." " .
                    "ORDER BY Name ASC " .
                "")->fetchAll(PDO::FETCH_ASSOC);
            } else {
                $institute = array($institut);
            }
        } else {
            $institute = $db->query(
                "SELECT Institut_id, Name " .
                "FROM Institute " .
                "WHERE fakultaets_id = Institut_id " .
                "ORDER BY Name ASC " .
            "")->fetchAll(PDO::FETCH_ASSOC);
        }
        $data = array();
        
        $output = array();
        $category = Request::get("category");
        $this->prepare_statements(!Request::get("institut_id"));
        foreach ($institute as $institut) {
            if ($category === "dozenten") {
                $this->statements[$category]->execute(array(
                    'institut_id' => $institut['Institut_id']
                ));
            } else {
                $this->statements[$category]->execute(array(
                    'institut_id' => $institut['Institut_id'],
                    'start' => $start,
                    'ende' => $ende
                ));
            }
            $output["anzahl"][] = (int) $this->statements[$category]->fetch(PDO::FETCH_COLUMN, 0);
            $output["institut_namen"][] = studip_utf8encode($institut['Name']);
            $output["institut_ids"][] = $institut['Institut_id'];
        }

        echo json_encode($output);
    }

    public function pdf_action() {
        $graphs = Request::getArray("graphs");
        if ($graphs['csv']) {
            $csv = $graphs['csv'];
            unset($graphs['csv']);
        }
        foreach ($graphs as $key => $g) {
            $g = substr($g, strpos($g, ",") + 1);
            $graphs[$key] = base64_decode($g);
        }
        $pdf = new ExportPDF("L");
        $pdf->setHeaderTitle("Statistik");
        foreach ($graphs as $key => $g) {
            $pdf->setHeaderSubtitle($this->categories[$key]);
            if ($key < 1) {
                $pdf->addPage("L");
            }
            $pdf->Image("@".$g);
        }
        if ($csv) {
            $csv = json_decode($csv);
            $pdf->setHeaderSubtitle("Tabellarische Übersicht");
            $pdf->addPage("L");
            foreach ($csv as $key => $line) {
                $csv[$key] = "| " . implode(" | ", $line). " |";
            }
            $csv = studip_utf8decode(implode("\n", $csv));
            $pdf->SetFontSize("8px");
            $pdf->addContent($csv);
        }

        $pdf->dispatch("statistik");
    }

    public function file_action() {
        header("Content-Type: ".Request::get("mime_type"));
        header("Content-Disposition: Attachment; filename=".studip_utf8decode(Request::get("filename")));
        echo studip_utf8decode(Request::get("content"));
    }

    public function csv_action() {
        $data = json_decode(Request::get("content"));
        foreach ($data as $key1 => $line) {
            foreach ($line as $key2 => $cell) {
                $line[$key2] = str_replace('"', '""', studip_utf8decode($cell));
            }
            $data[$key1] = '"'.implode('";"', $line).'"';
        }
        $data = implode("\n", $data);
        header("Content-Type: text/csv");
        header("Content-Disposition: Attachment; filename=statistik.csv");
        echo $data;
    }

    protected function getDisplayName() {
        return get_class($this);
    }
	
	protected function getTemplate($template_file_name, $layout = "without_infobox") {
        PageLayout::setTitle($this->getDisplayName());
        if (!$this->template_factory) {
            $this->template_factory = new Flexi_TemplateFactory(dirname(__file__)."/templates");
        }
        $template = $this->template_factory->open($template_file_name);
        if ($layout) {
            $template->set_layout($GLOBALS['template_factory']->open($layout === "without_infobox" ? 'layouts/base_without_infobox' : 'layouts/base'));
        }
        return $template;
    }

    protected function prepare_statements($with_subinstitut = false) {
        $db = DBManager::get();
        $field = $with_subinstitut ? "fakultaets_id" : "Institut_id";

        $this->statements['veranstaltungen'] = $db->prepare(
            "SELECT COUNT(DISTINCT seminare.Seminar_id) " .
            "FROM seminare " .
                "INNER JOIN seminar_inst ON (seminar_inst.seminar_id = seminare.Seminar_id) " .
                "INNER JOIN Institute ON (Institute.Institut_id = seminar_inst.institut_id) " .
            "WHERE Institute.$field = :institut_id " .
                "AND ((seminare.duration_time = '-1') " .
                    "OR (seminare.duration_time = '0' AND seminare.start_time = :start) " .
                    "OR (seminare.duration_time > '0' AND seminare.start_time >= :start AND seminare.start_time < :ende) " .
                    "OR (seminare.duration_time > '0' AND seminare.start_time + seminare.duration_time >= :start AND seminare.start_time + seminare.duration_time < :ende) " .
                    "OR (seminare.duration_time > '0' AND seminare.start_time < :start AND seminare.start_time + seminare.duration_time > :ende) " .
                ") " .
        "");
        $this->statements['dokumente'] = $db->prepare(
            "SELECT COUNT(DISTINCT dokumente.dokument_id) " .
            "FROM seminar_inst " .
                "INNER JOIN dokumente ON (seminar_inst.seminar_id = dokumente.seminar_id) " .
                "INNER JOIN Institute ON (Institute.Institut_id = seminar_inst.institut_id) " .
            "WHERE Institute.$field = :institut_id " .
                "AND dokumente.mkdate >= :start " .
                "AND dokumente.mkdate <= :ende " .
        "");
        $this->statements['forum'] = $db->prepare(
            "SELECT COUNT(DISTINCT forum_entries.topic_id) " .
            "FROM seminar_inst " .
                "INNER JOIN forum_entries ON (seminar_inst.seminar_id = forum_entries.seminar_id) " .
                "INNER JOIN Institute ON (Institute.Institut_id = seminar_inst.institut_id) " .
            "WHERE Institute.$field = :institut_id " .
                "AND forum_entries.mkdate >= :start " .
                "AND forum_entries.mkdate <= :ende " .
        "");
        $this->statements['wiki'] = $db->prepare(
            "SELECT COUNT(*) " .
            "FROM " .
                "(SELECT wiki.range_id, wiki.keyword " .
                "FROM seminar_inst " .
                    "INNER JOIN wiki ON (seminar_inst.seminar_id = wiki.range_id) " .
                    "INNER JOIN Institute ON (Institute.Institut_id = seminar_inst.institut_id) " .
                "WHERE Institute.$field = :institut_id " .
                    "AND wiki.chdate >= :start " .
                    "AND wiki.chdate <= :ende " .
                "" .
                "GROUP BY wiki.range_id, wiki.keyword " .
                ") AS wikipages " .
        "");
        $this->statements['litlists'] = $db->prepare(
            "SELECT COUNT(DISTINCT list_id) " .
            "FROM seminar_inst " .
                "INNER JOIN lit_list ON (seminar_inst.seminar_id = lit_list.range_id) " .
                "INNER JOIN Institute ON (Institute.Institut_id = seminar_inst.institut_id) " .
            "WHERE Institute.$field = :institut_id " .
                "AND lit_list.mkdate >= :start " .
                "AND lit_list.mkdate <= :ende " .
        "");
        $this->statements['scm'] = $db->prepare(
            "SELECT COUNT(DISTINCT scm_id) " .
            "FROM seminar_inst " .
                "INNER JOIN scm ON (seminar_inst.seminar_id = scm.range_id) " .
                "INNER JOIN Institute ON (Institute.Institut_id = seminar_inst.institut_id) " .
            "WHERE Institute.$field = :institut_id " .
                "AND scm.mkdate >= :start " .
                "AND scm.mkdate <= :ende " .
        "");
        $this->statements['lernmodule'] = $db->prepare(
            "SELECT COUNT(DISTINCT object_id) " .
            "FROM seminar_inst " .
                "INNER JOIN object_contentmodules ON (seminar_inst.seminar_id = object_contentmodules.object_id) " .
                "INNER JOIN Institute ON (Institute.Institut_id = seminar_inst.institut_id) " .
            "WHERE Institute.$field = :institut_id " .
                "AND object_contentmodules.mkdate >= :start " .
                "AND object_contentmodules.mkdate <= :ende " .
        "");
        $this->statements['dozenten'] = $db->prepare(
            "SELECT COUNT(DISTINCT user_inst.user_id) " .
            "FROM user_inst " .
                "INNER JOIN Institute ON (Institute.Institut_id = user_inst.Institut_id) " .
            "WHERE Institute.$field = :institut_id " .
                "AND user_inst.inst_perms = 'dozent' " .
        "");
        
        $this->statements['doz_aktivitaet_dokumente'] = $db->prepare(
            "SELECT COUNT(DISTINCT user_inst.user_id) " .
            "FROM user_inst " .
                "INNER JOIN object_user_visits ON (object_user_visits.user_id = user_inst.user_id) " .
                "INNER JOIN Institute ON (Institute.Institut_id = user_inst.Institut_id) " .
            "WHERE Institute.$field = :institut_id " .
                "AND object_user_visits.type = 'documents' " .
                "AND object_user_visits.visitdate >= :start " .
                "AND object_user_visits.visitdate <= :ende " .
                "AND user_inst.inst_perms = 'dozent' " .
        "");
        $this->statements['doz_aktivitaet_forum'] = $db->prepare(
            "SELECT COUNT(DISTINCT object_user_visits.object_id, object_user_visits.user_id) " .
            "FROM user_inst " .
                "INNER JOIN object_user_visits ON (object_user_visits.user_id = user_inst.user_id) " .
                "INNER JOIN Institute ON (Institute.Institut_id = user_inst.Institut_id) " .
            "WHERE Institute.$field = :institut_id " .
                "AND object_user_visits.type = 'forum' " .
                "AND object_user_visits.visitdate >= :start " .
                "AND object_user_visits.visitdate <= :ende " .
                "AND user_inst.inst_perms = 'dozent' " .
        "");
        $this->statements['doz_aktivitaet_wiki'] = $db->prepare(
            "SELECT COUNT(DISTINCT object_user_visits.object_id, object_user_visits.user_id) " .
            "FROM user_inst " .
                "INNER JOIN object_user_visits ON (object_user_visits.user_id = user_inst.user_id) " .
                "INNER JOIN Institute ON (Institute.Institut_id = user_inst.Institut_id) " .
            "WHERE Institute.$field = :institut_id " .
                "AND object_user_visits.type = 'wiki' " .
                "AND object_user_visits.visitdate >= :start " .
                "AND object_user_visits.visitdate <= :ende " .
                "AND user_inst.inst_perms = 'dozent' " .
        "");
        $this->statements['doz_aktivitaet_sum'] = $db->prepare(
            "SELECT COUNT(DISTINCT object_user_visits.object_id, object_user_visits.user_id) " .
            "FROM user_inst " .
                "INNER JOIN object_user_visits ON (object_user_visits.user_id = user_inst.user_id) " .
                "INNER JOIN Institute ON (Institute.Institut_id = user_inst.Institut_id) " .
            "WHERE Institute.$field = :institut_id " .
                "AND object_user_visits.visitdate >= :start " .
                "AND object_user_visits.visitdate <= :ende " .
                "AND user_inst.inst_perms = 'dozent' " .
        "");

        $this->statements['stud_aktivitaet_dokumente'] = $db->prepare(
            "SELECT COUNT(DISTINCT user_inst.user_id) " .
            "FROM user_inst " .
                "INNER JOIN object_user_visits ON (object_user_visits.user_id = user_inst.user_id) " .
                "INNER JOIN Institute ON (Institute.Institut_id = user_inst.Institut_id) " .
            "WHERE Institute.$field = :institut_id " .
                "AND object_user_visits.type = 'documents' " .
                "AND object_user_visits.visitdate >= :start " .
                "AND object_user_visits.visitdate <= :ende " .
                "AND user_inst.inst_perms IN ('tutor','autor') " .
        "");
        $this->statements['stud_aktivitaet_forum'] = $db->prepare(
            "SELECT COUNT(DISTINCT object_user_visits.object_id, object_user_visits.user_id) " .
            "FROM user_inst " .
                "INNER JOIN object_user_visits ON (object_user_visits.user_id = user_inst.user_id) " .
                "INNER JOIN Institute ON (Institute.Institut_id = user_inst.Institut_id) " .
            "WHERE Institute.$field = :institut_id " .
                "AND object_user_visits.type = 'forum' " .
                "AND object_user_visits.visitdate >= :start " .
                "AND object_user_visits.visitdate <= :ende " .
                "AND user_inst.inst_perms IN ('tutor','autor') " .
        "");
        $this->statements['stud_aktivitaet_wiki'] = $db->prepare(
            "SELECT COUNT(DISTINCT object_user_visits.object_id, object_user_visits.user_id) " .
            "FROM user_inst " .
                "INNER JOIN object_user_visits ON (object_user_visits.user_id = user_inst.user_id) " .
                "INNER JOIN Institute ON (Institute.Institut_id = user_inst.Institut_id) " .
            "WHERE Institute.$field = :institut_id " .
                "AND object_user_visits.type = 'wiki' " .
                "AND object_user_visits.visitdate >= :start " .
                "AND object_user_visits.visitdate <= :ende " .
                "AND user_inst.inst_perms IN ('tutor','autor') " .
        "");
        $this->statements['stud_aktivitaet_sum'] = $db->prepare(
            "SELECT COUNT(DISTINCT object_user_visits.object_id, object_user_visits.user_id) " .
            "FROM user_inst " .
                "INNER JOIN object_user_visits ON (object_user_visits.user_id = user_inst.user_id) " .
                "INNER JOIN Institute ON (Institute.Institut_id = user_inst.Institut_id) " .
            "WHERE Institute.$field = :institut_id " .
                "AND object_user_visits.visitdate >= :start " .
                "AND object_user_visits.visitdate <= :ende " .
                "AND user_inst.inst_perms IN ('tutor','autor') " .
        "");
    }
}

