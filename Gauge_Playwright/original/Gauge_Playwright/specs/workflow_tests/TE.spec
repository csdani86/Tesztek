# TE folyamat teszt
    Tags: 

1. Mint kérelmező létrehozok egy "Építési engedélyezési eljárást":
    - Létrehoz egy Építési engedélyezési eljárás 
    - Új építésügyi hatósági szolgáltatás előzetes cselekmény létrehozás
    - Eljárás inditó beküldése

## TE folyamat teszt

Új építésügyi engedélyezési eljárás piszkozat létrehozása, mint kérelmezővel és Új építésügyi hatósági szolgáltatás benyújtása

* Belépés mint kérelmező
* Kattints az "Új építésügyi kérelem" gombra
* Építési engedélyezési eljárás piszkozat létrehozása
* Jegyezd meg a "#process-number" értékét a "TE_eljaras_azonosito" azonosítóval
* Eljárás nevének átírása "ENV:TE_eljaras_neve" névre
* Új építésügyi hatósági szolgáltatás előzetes cselekmény
* Kijelentkezés

Kérelem kezelése hatósági munkatárssal

* Belépés mint hatósági munkatárs
* Benyújtott "CACHE:TE_eljaras_azonosito" azonosítójú irat/cselekmény megnyitása
* Iratátvétel bezárása
* "FilingByOffice" tab bezárása
* Bejövő Iratkezelés
* Építésügyi hatósági állásfoglalás válasz cselekmény
* Kijelentkezés

Kérelmező benyújtja az eljárás iránti kérelmet

* Belépés mint kérelmező
* Előzetes megkeresés megnyitása kérelmezői oldalon "CACHE:TE_eljaras_azonosito" eljárás azonosító alapján
* Eljárás indítása "ENV:altalanos_hatosag" hatóságnál
* Kijelentkezés

Hatósági munkatárssal Engedély cselekmény küldése

* Belépés mint hatósági munkatárs
* Beküldött "CACHE:TE_eljaras_azonosito" azonosítójú megnyitása "Hatóság összes eljárása" nézetben
 "ProcessByOffice" tab bezárása
* Engedély cselekmény
* Kijelentkezés

Kérelmező belépés - Engedély cselekmény - Fellebbezés határozat ellen

* Belépés mint kérelmező

TODO: concept gyanus az értesítésekből ki lehessen eresni az iratot
* Kattints a "Értesítések" elemre
* Várj, amíg a "ENV:altalanos_hatosag" szöveg látszik
* Írd az "CACHE:TE_eljaras_azonosito" szöveget az "#MessageList_SearchPanel_CustomEditorName" címkével rendelkező elembe
* Nyomj egy Enter-t
* Kattints az "MessageList_DXMainTable" táblázat "2". sor "1". oszlopára

* Iratátvétel bezárása
* Ellenőrizd le, hogy a "CACHE:TE_eljaras_azonosito" szöveg megtalálható az oldalon
* Ellenőrizd le, hogy a "Általános levél" szöveg megtalálható az oldalon
* Ellenőrizd le, hogy a "Fellebbezési jogról való lem." szöveg megtalálható az oldalon
* Ellenőrizd le, hogy a "Fellebbezés határozat ellen" szöveg megtalálható az oldalon

* Fellebbezés határozat ellen cselekmény
* Kijelentkezés

Hatósági munkatárssal eljárás - Felterjesztése felügyeleti szervhez

* Belépés mint hatósági munkatárs
* Benyújtott "CACHE:TE_eljaras_azonosito" azonosítójú irat/cselekmény megnyitása
* "FilingByOffice" tab bezárása
* Bejövő Iratkezelés
* Kattints a "'Eljárás'" gombra
* Felterjesztése felügyeleti szervhez cselekmény
* Kijelentkezés

Miniszterelnökségi hatósági munkatárssal belépés - válasz a felterjesztésre

* Belépés mint miniszterelnökségi hatósági munkatárs
* Benyújtott "CACHE:TE_eljaras_azonosito" azonosítójú irat/cselekmény megnyitása
* Iratátvétel bezárása
* "FilingByOffice" tab bezárása
* Bejövő Iratkezelés
* Ellenőrizd le, hogy a "Általános levél" szöveg megtalálható az oldalon
* Ellenőrizd le, hogy a "Végzés" szöveg megtalálható az oldalon
* Végzés cselekmény
* Kijelentkezés

Hatósági munkatárssal belépés határozat módosítása expediálás után

* Belépés mint hatósági munkatárs
* Benyújtott "CACHE:TE_eljaras_azonosito" azonosítójú irat/cselekmény megnyitása
* Iratátvétel bezárása
* Várj, amíg a "Fellebbezés határozat ellen" szöveg jelen lesz
* "FilingByOffice" tab bezárása
* Bejövő Iratkezelés
* Kattints az "Eljárás" elemre
* Határozat módosítása expediálás után