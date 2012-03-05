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


class InstitutStatistikPlugin extends StudIPPlugin implements SystemPlugin {

    protected $statements = array();
    protected $categories = array();

    /**
     * Constructor for the class SeminarGridSearch
     */
    function __construct() {
        parent::__construct();
        if ($GLOBALS['perm']->have_perm('root')) {
            $navigation = new AutoNavigation(_("Institut-Statistik"), PluginEngine::getURL($this, array(), "show"));
            Navigation::addItem('/tools/'.get_class($this), $navigation);
        }
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
            "doz_aktivitaet_sum" => _("Dozenaktivitäten: Insgesamt")
        );
    }

    function show_action($choice = '') {
        if (!$GLOBALS['perm']->have_perm('root')) {
            throw new AccessDeniedException("Keine Berechtigung");
        }
        $rgraph_file = array(
            'RGraph.common.core.js',
            'RGraph.common.adjusting.js',
            'RGraph.common.annotate.js',
            'RGraph.common.context.js',
            'RGraph.common.resizing.js',
            'RGraph.common.tooltips.js',
            'RGraph.common.zoom.js',
            'RGraph.bar.js'
        );
        foreach ($rgraph_file as $rgraph_file) {
            PageLayout::addHeadElement(
                "script",
                array('src' => $GLOBALS['ABSOLUTE_URI_STUDIP'].$this->getPluginPath()."/assets/".$rgraph_file),
                ""
            );
        }

        $db = DBManager::get();

        $institute = $db->query(
            "SELECT Institut_id, Name " .
            "FROM Institute " .
            "ORDER BY Name ASC " .
        "")->fetchAll(PDO::FETCH_ASSOC);
        $data = array();
        
        foreach ($institute as $institut) {
            $data[$institut['Institut_id']] = array(
                'name' => $institut['Name']
            );
        }
        $fakultaeten = $db->query(
            "SELECT * FROM Institute WHERE fakultaets_id = Institut_id " .
        "")->fetchAll(PDO::FETCH_ASSOC);

        $template = $this->getTemplate("statistik.php");
        $template->set_attribute("statistik_data", $data);
        $template->set_attribute("fakultaeten", $fakultaeten);
        $template->set_attribute('categories', $this->categories);
        $template->set_attribute("semester", $db->query("SELECT * FROM semester_data ORDER BY beginn")->fetchAll(PDO::FETCH_ASSOC));
        print $template->render();
    }

    public function fetch_data_action() {
        if (!$GLOBALS['perm']->have_perm('root')) {
            throw new AccessDeniedException("Keine Berechtigung");
        }
        $db = DBManager::get();

        if (Request::get("semester_id")) {
            $semester = $db->query(
                "SELECT * FROM semester_data WHERE semester_id = ".$db->quote(Request::option("semester_id"))." " .
            "")->fetch(PDO::FETCH_ASSOC);
            $start = $semester['beginn'];
            $ende = $semester['ende'];
        } elseif(Request::get("start") && Request::get("ende")) {
            $start = Request::int("start");
            $ende = Request::int("ende");
        } else {
            $start = 0;
            $ende = 86400 * 365 * 60;
        }

        if (Request::get("fakultaets_id")) {
            $institute = $db->query(
                "SELECT Institut_id, Name " .
                "FROM Institute " .
                "WHERE fakultaets_id = ".$db->quote(Request::option("fakultaets_id"))." " .
                "ORDER BY Name ASC " .
            "")->fetchAll(PDO::FETCH_ASSOC);
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
        $this->prepare_statements(!Request::get("fakultaets_id"));
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
            "SELECT COUNT(DISTINCT px_topics.topic_id) " .
            "FROM seminar_inst " .
                "INNER JOIN px_topics ON (seminar_inst.seminar_id = px_topics.Seminar_id) " .
                "INNER JOIN Institute ON (Institute.Institut_id = seminar_inst.institut_id) " .
            "WHERE Institute.$field = :institut_id " .
                "AND px_topics.mkdate >= :start " .
                "AND px_topics.mkdate <= :ende " .
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
    }
}

