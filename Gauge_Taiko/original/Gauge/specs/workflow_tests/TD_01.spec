# TD_01 folyamat teszt
    Tags: ready

## TD_01 scenario

Új piszkozat létrehozása, általános képviselőként

* Belépés mint kérelmező
* Kattints az "Új építésügyi kérelem" gombra
* Építési engedélyezési eljárás piszkozat létrehozása képviselőként
* Jegyezd meg a "#process-number" értékét az "TD_eljaras_azonosito" azonosítóval
* Kattints az "Általános adatok" elemre
* Eljárás nevének átírása "ENV:TD01_eljaras_neve" névre
* Eljárás indítása "ENV:altalanos_hatosag" hatóságnál
* Kérelem módosítása
* Kijelentkezés

Kérelem irat kezelés mint hatósági munkatárs 

* Belépés mint hatósági munkatárs
* Benyújtott "CACHE:TD_eljaras_azonosito" azonosítójú irat/cselekmény megnyitása

* Várj, amíg a "Befejezés ideje" szöveg jelen lesz
* "FilingByOffice" tab bezárása
* Kattints az "Irat" elemre
* Várj, amíg a "Aláírt iratkép megtekintése" szöveg jelen lesz
* Jegyezd meg a "#filing-system-number" értékét a "TD_iratazonosito" azonosítóval
* Érkeztetés

TODO: concept
* Kattints a "Iratok" elemre
* Válaszd ki a "BaseFilter" ID-val rendelkező legördülő listából a "Szignálásra váró iratok" címkéjű elemet
* Írd a "CACHE:TD_iratazonosito" szöveget a "#FilingList_SearchPanel_CustomEditorName" címkével rendelkező elembe
* Nyomj egy Enter-t
* Várj "5" másodpercet
* Kattints a "FilingList_DXMainTable" táblázat "2". sor "1". oszlopára
* Szignálás
* "FilingByOffice" tab bezárása

TODO: concept
* Kattints a "Iratok" elemre
* Válaszd ki a "BaseFilter" ID-val rendelkező legördülő listából a "Iktatásra váró iratok" címkéjű elemet
* Írd a "CACHE:TD_iratazonosito" szöveget a "#FilingList_SearchPanel_CustomEditorName" címkével rendelkező elembe
* Nyomj egy Enter-t
* Várj "5" másodpercet
* Kattints a "FilingList_DXMainTable" táblázat "2". sor "1". oszlopára
* Várj "2" másodpercet
* Iktatás
* "FilingByOffice" tab bezárása

Hiánypótlási felhívás cselekmény (kiadmanyozas, expedialas nélkül)

* Kattints a "Eljárás" gombra
* Kattints a "Végzés" gombra
* Kattints az "Hiánypótlási felhívás" elemre
* Iktatás
* Kattints az "Irat" elemre
* Jegyezd meg a "#filing-system-number" értékét a "TD_iratazonosito" azonosítóval
* Irat sablon beállítás
* Kattints az "Tovább" elemre
* Várj, amíg a "Hiánypótlási felhívás" szöveg jelen lesz
* Kattints a "Kiadmányozásra" elemre

TODO: concept
* Kattints a "Iratok" elemre
* Válaszd ki a "BaseFilter" ID-val rendelkező legördülő listából a "Kiadmányozásra váró iratok" címkéjű elemet
* Írd a "CACHE:TD_iratazonosito" szöveget a "#FilingList_SearchPanel_CustomEditorName" címkével rendelkező elembe
* Nyomj egy Enter-t
* Kattints a "FilingList_DXMainTable" táblázat "2". sor "1". oszlopára
* Várj, amíg a "Kiadmányozás" szöveg látszik

* "FilingByOffice" tab bezárása
* Fogadd el a "Biztosan végre szeretné hajtani a kiadmányozást?" szöveggel rendelkező böngésző figyelmeztetést
* Kattints a "Kiadmányozás" elemre
* Várj, amíg az "Az irat kiadmányozása folyamatban van. Kérem várja meg, amíg a rendszer befejezi a műveletet!" szöveg jelen lesz
* Várj, amíg az "Aláírt iratkép megtekintése" szöveg jelen lesz
* Várj, amíg a "Az irat kiadmányozása folyamatban van. Kérem várja meg, amíg a rendszer befejezi a műveletet!" szöveg nem lesz jelen

TODO: concept
* Kattints a "Iratok" elemre
* Válaszd ki a "BaseFilter" ID-val rendelkező legördülő listából a "Expediálásra váró iratok" címkéjű elemet
* Írd a "CACHE:TD_iratazonosito" szöveget a "#FilingList_SearchPanel_CustomEditorName" címkével rendelkező elembe
* Nyomj egy Enter-t
* Várj "2" másodpercet
* Kattints a "FilingList_DXMainTable" táblázat "2". sor "1". oszlopára

* Expediálás
* "FilingByOffice" tab bezárása
* Kattints a "Eljárás\\s*$" gombra
* Kattints a "Kapcsolódó eljárások" elemre
* Kattints az "Benyújtott ÉTDR eljárás hozzáadása" elemre
* Bemutató:Kapcsolódó eljárás választása

* Kattints a "Az összes eljárás megjelenítése" elemre
TODO: jáj miez a faszom szelektor?
* Jegyezd meg a "//*[@id=\"ProcessListForProcessSelectPartial_DXDataRow0\"]/td[1]" értékét a "Kapcs_elj_Ellenorzes" azonosítóval
* Kattints a "ProcessListForProcessSelectPartial_DXMainTable" táblázat "2". sor "1". oszlopára
* Kattints a "Kiválaszt" elemre

* Kattints a "Egyéb kapcsolódó eljárás hozzáadása" elemre
* Írd a "54321" szöveget az "Az eljárás iktatószáma" címkével rendelkező elembe
* Írd a "Hívatalos eljáró hivatal" szöveget az "Az eljáró hivatal" címkével rendelkező elembe
* Töröld a "Az eljárás kelte" elem szövegét
* Írd a "2012. 02. 22." szöveget az "Az eljárás kelte" címkével rendelkező elembe
* Kattints a "Mentés" gombra
* Ellenőrizd le, hogy a "CACHE:Kapcs_elj_Ellenorzes" szöveg megtalálható az oldalon
