# TB folyamat teszt
    Tags: 

1. Mint hatósági ügyfélszolgálatos (hivatali ügyintéző) létrehozok egy "Építési engedélyezési eljárást":
    - Létrehoz egy Építési engedélyezési eljárás 

## TB folyamat teszt

Új építésügyi engedélyezési eljárás iránti kérelem benyújtása mint hatósági ügyfélszolgálatos

* Belépés mint hatósági ügyfélszolgálatos
* Kattints az "Eljárások" elemre
* Kattints az "Új kérelem" gombra
* Kattints az "\\s+Építésügy\\s+$" gombra
* Építési engedélyezési eljárás piszkozat létrehozása 
* Jegyezd meg a "#process-number" értékét a "TB_eljaras_azonosito" azonosítóval
* Eljárás nevének átírása "ENV:TB_eljaras_neve" névre
* Eljárás indítása "ENV:altalanos_hatosag" hatóságnál
* Kijelentkezés

Kérelem kezelése hatósági munkatárssal - hiánypótlási felhívás

* Belépés mint hatósági munkatárs
* Benyújtott "CACHE:TB_eljaras_azonosito" azonosítójú irat/cselekmény megnyitása
* "FilingByOffice" tab bezárása
* Bejövő Iratkezelés
* Kattints a "Eljárás" gombra
* Ügyintézői státusz szerkesztése
* Hatósági bizonyítvány (közbenső) cselekmény - iratmegsemmisítés
* Hiánypótlási felhívás cselekmény "TB_hianypotlas_irat_azon"
* Kijelentkezés

Hatósági ügyfélszolgálatos - Hiánypótlási felhívás - hiánypótlás

* Belépés mint hatósági ügyfélszolgálatos
* Kattints a "Iratok" elemre
* Bemutató bezárása
* Várj, amíg az "//*[@id=\"FilingList_LPV\"]//*[@id=\"FilingList_TL\"]" elem már nem lesz jelen
* Írd ezt a szöveget "CACHE:TB_hianypotlas_irat_azon" a "#FilingList_SearchPanel_CustomEditorName" címkével rendelkező elembe
* Nyomj egy Enter-t
* Várj, amíg az "//*[@id=\"FilingList_LPV\"]//*[@id=\"FilingList_TL\"]" elem már nem lesz jelen
* Kattints az "FilingList_DXMainTable" táblázat "2". sor "1". oszlopára
* Hiánypótlás cselekmény
* Kijelentkezés

Hatósági munkatárssal hiánypótlás elfogadása

* Belépés mint hatósági munkatárs
* Benyújtott "CACHE:TB_eljaras_azonosito" azonosítójú irat/cselekmény megnyitása
* Iratátvétel bezárása
* "FilingByOffice" tab bezárása
* Bejövő Iratkezelés
* Hiánypótlás elfogadása cselekmény
* Általános levél cselekmény
* Hatósági bizonyítvány (közbenső) cselekmény - iratmegsemmisítés
