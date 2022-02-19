# TC folymat teszt
    Tags: ready

1. Mint kérelmező Új építésügyi kérelem létrehozása, előzetes cseleménnyel (Szakhatósági megkeresés) és eljárás közbeni cselekménnyel (Kérelem visszavonása)

## TC folyamat teszt

Új építésügyi engedélyezési eljárás benyújtása mint kérelmező, előzetes szakhatósági megkeresés és kérelem visszavonása

* Belépés mint kérelmező
* Kattints az "Új építésügyi kérelem" gombra
* Építési engedélyezési eljárás piszkozat létrehozása kérelmezővel
* Kattints az "Általános adatok" elemre
* Jegyezd meg a "#process-number" értékét az "TC_eljaras_azonosito" azonosítóval
* Eljárás nevének átírása "ENV:TC_eljaras_neve" névre
* Előzetes szakhatósági állásfoglalás kérése cselekmény
* Eljárás indítása "ENV:altalanos_hatosag" hatóságnál
* Kérelem visszavonása cselekmény
* Kijelentkezés

Kérelem kezelése hatósági munkatárssal - Hatósági bizonyítváy, módosítása és véglegesítése

* Belépés mint hatósági munkatárs
* Kattints az "Eljárások" gombra
* Válaszd ki a "Nézet" legördülő listából a "Hatóság folyamatban lévő eljárásai" címkéjű elemet
* Eljárások, Iratok oldal bemutató teszt
* Benyújtott "CACHE:TC_eljaras_azonosito" azonosítójú irat/cselekmény megnyitása
* Bejövő Iratkezelés
* Kattints az "Eljárás" gombra
* Tárgyi ingatlan hozzáadása
* Irattározás folyamatban lévő eljárást
* Irattárból vissza
* Hatósági bizonyítvány (közbenső) cselekmény
* Rontott határozat - Határozat kijavítása cselekmény
* Értesítés határozat véglegessé válásáról cselekmény
* Kattints a "Eljárás" gombra
* Kattints a "Cselekmények" gombra
* Várj, amíg a "Hatósági bizonyítvány" szöveg jelen lesz
