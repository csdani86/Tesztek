# TF_02 folyamat teszt
    Tags: ready

Mint kérelmező létrehozok egy "Építési engedélyezési eljárást" mint meghatalmazott:
    - Létrehoz egy Építési engedélyezési eljárás 
    - Tárgyi ingatlan hozzáadása
    - Eljárás inditó beküldése
    - Meghatalmazás küldése

## TF_02 folyamat teszt

Új építésügyi engedélyezési eljárás benyújtása mint kérelmező meghatalmazottja és Új építésügyi hatósági szolgáltatás benyújtása

* Belépés mint kérelmező
* Kattints az "Új építésügyi kérelem" gombra
* Építési engedélyezési eljárás piszkozat létrehozása meghatalmazottként V ker
* Kattints az "Általános adatok" elemre
* Jegyezd meg a "#process-number" értékét a "TF02_eljaras_azonosito" azonosítóval
* Eljárás nevének átírása "ENV:TF02_eljaras_neve" névre
* Tárgyi ingatlan hozzáadása
* Eljárás indítása "ENV:Vker_hatosag" hatóságnál
* Meghatalmazás cselekmény - eljárás közbeni
* Kijelentkezés

Belépés V.ker hatósági munkatárssal - Eljárás típus módosítás, megosztás

* Belépés mint V. kerületi hatósági munkatárs 1
* Benyújtott "CACHE:TF02_eljaras_azonosito" azonosítójú irat/cselekmény megnyitása
* Bejövő Iratkezelés
* "FilingByOffice" tab bezárása
* Kattints az "Eljárás" gombra
* Eljárás típus módosítása
* Hatóság oldali megosztások
* Kijelentkezés

Megosztott kérelmezővel belépés - megosztás ellenőrzés

* Belépés mint balint kérelmező
* Értesítések: megosztott ügy megnyitása adott "CACHE:TF02_eljaras_azonosito" eljárás azonosítóval
* Megosztott ügyek ellenőrzés adott "CACHE:TF02_eljaras_azonosito" eljárás azonosítóval
