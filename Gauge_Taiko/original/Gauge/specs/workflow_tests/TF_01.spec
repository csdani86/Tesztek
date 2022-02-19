# TF_01 folyamat teszt
    Tags: 

## TF-01 folyamat teszt

Kérelmezővel belépés

* Belépés mint kérelmező
* Kattints a "Új építésügyi kérelem" elemre

* Építési engedélyezési eljárás piszkozat létrehozása meghatalmazottként V ker
* Kattints az "Általános adatok" elemre
* Jegyezd meg a "#process-number" értékét a "TF01_eljaras_azonosito" azonosítóval
* Eljárás nevének átírása "ENV:TF01_eljaras_neve" névre

* Kattints a "Eljárást indító kérelem" elemre
* Kattints az "Eljáró hatóság" elemre

* Kattints a "Elsőfokon eljáró hatóság kiválasztása\\s*$" gombra
* Írd a "ENV:Vker_hatosag" szöveget az "#grid_ListFirstOffices_SearchPanel_CustomEditorName" címkével rendelkező elembe
* Kattints a "grid_ListFirstOffices_DXMainTable" táblázat "2". sor "1". oszlopára
* Kattints a "Mentés" elemre
* Kattints a "Mellékletek" gombra
* Kattints a "Új dokumentum feltöltése" gombra
* Fájl feltöltése
* Kattints az ".close-feedback-icon" elemre, ha tudsz
* Várj, amíg a "Tovább" szöveg látszik
* Kattints az "Tovább" gombra
* Kattints az "Benyújtás" gombra
* Várj, amíg az "Biztosan be szeretné nyújtani?" szöveg jelen lesz
* Kattints az "Igen" gombra
* Kattints a "Ügy áttekintése" gombra
* Kijelentkezés

Belépés Hatósági Munkatárssal (V. Kerület)

* Belépés mint V. kerületi hatósági munkatárs 1
* Benyújtott "CACHE:TF01_eljaras_azonosito" azonosítójú irat/cselekmény megnyitása
* Bejövő Iratkezelés
* "FilingByOffice" tab bezárása
* Kattints a "Eljárás" elemre
* Ügyirat áttétel "ENV:altalanos_hatosag" cselekmény
* Kattints a "Eljárás" gombra
* Kijelentkezés

Belépés Hatósági Munkatárssal_epugy_01

* Belépés mint hatósági munkatárs
* Benyújtott "CACHE:TF01_eljaras_azonosito" azonosítójú irat/cselekmény megnyitása
* Iratátvétel bezárása
* "FilingByOffice" tab bezárása
* Bejövő Iratkezelés
* Kattints az "Eljárás" elemre
* Hiánypótlási felhívás cselekmény "TF01_hianypotlas_irat_azon"
* Kijelentkezés

Belépés kérelmezővel_Hiánypótlás

* Belépés mint kérelmező
* Kattints a "Értesítések" gombra
* Várj "2" másodpercet
* Írd az "CACHE:TF01_eljaras_azonosito" szöveget az "#MessageList_SearchPanel_CustomEditorName" címkével rendelkező elembe
 Írd az "B-06926/2021" szöveget az "#MessageList_SearchPanel_CustomEditorName" címkével rendelkező elembe
* Nyomj egy Enter-t
* Várj "5" másodpercet
* Kattints a "MessageList_DXMainTable" táblázat "2". sor "1". oszlopára
* Iratátvétel bezárása
* Hiánypótlás cselekmény
* Kijelentkezés

Belépés hatósági munkatárssal hiánypótlás elfogadása

* Belépés mint hatósági munkatárs
* Benyújtott "CACHE:TF01_eljaras_azonosito" azonosítójú irat/cselekmény megnyitása
* Iratátvétel bezárása
* "FilingByOffice" tab bezárása
* Hiánypótlás elfogadása cselekmény
* Engedély cselekmény