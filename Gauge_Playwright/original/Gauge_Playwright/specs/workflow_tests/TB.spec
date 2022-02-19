# TB folyamat teszt
    Tags: ready, playwright

1. Mint hatósági ügyfélszolgálatos (hivatali ügyintéző) létrehozok egy "Építési engedélyezési eljárást":
    - Létrehoz egy Építési engedélyezési eljárás 

## TB folyamat teszt

Új építésügyi engedélyezési eljárás iránti kérelem benyújtása mint hatósági ügyfélszolgálatos

* Belépés mint hatósági ügyfélszolgálatos
* Kattints az "'Eljárások'" elemre
* Kattints az "Új kérelem" gombra
* Kattints az "'Építésügy'" gombra
* Építési engedélyezési eljárás piszkozat létrehozása 
* Jegyezd meg a "#process-number" értékét a "TB_eljaras_azonosito" azonosítóval
* Eljárás nevének átírása "ENV:TB_eljaras_neve" névre
* Eljárás indítása "ENV:altalanos_hatosag" hatóságnál
* Kijelentkezés

Kérelem kezelése hatósági munkatárssal - hiánypótlási felhívás

* Belépés mint hatósági munkatárs
* Benyújtott "CACHE:TB_eljaras_azonosito" azonosítójú irat/cselekmény megnyitása
* Bejövő Iratkezelés
* Kattints a "'Eljárás'" gombra
* Ügyintézői státusz szerkesztése
* Hatósági bizonyítvány (közbenső) cselekmény - iratmegsemmisítés
* Hiánypótlási felhívás cselekmény "TB_hianypotlas_irat_azon"
* Kijelentkezés

Hatósági ügyfélszolgálatos - Hiánypótlási felhívás - hiánypótlás

* Belépés mint hatósági ügyfélszolgálatos
* Kattints a "'Iratok'" elemre
* Bemutató bezárása
* Várj, amíg a táblázat betöltödik
* Írd ezt a szöveget "CACHE:TB_hianypotlas_irat_azon" a "#FilingList_SearchPanel_CustomEditorName" címkével rendelkező elembe
* Nyomj egy Enter-t
* Várj, amíg a táblázat betöltödik
* Kattints a "#FilingList_DXDataRow0" elemre és válts az újjonan megnyíló böngésző fülre
* Hiánypótlás cselekmény
* Kijelentkezés

Hatósági munkatárssal hiánypótlás elfogadása

* Belépés mint hatósági munkatárs
* Benyújtott "CACHE:TB_eljaras_azonosito" azonosítójú irat/cselekmény megnyitása
* Iratátvétel bezárása
* Bejövő Iratkezelés
* Hiánypótlás elfogadása cselekmény
* Általános levél cselekmény
* Hatósági bizonyítvány (közbenső) cselekmény - iratmegsemmisítés
