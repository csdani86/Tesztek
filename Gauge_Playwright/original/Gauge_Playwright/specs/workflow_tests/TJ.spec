# TJ folyamat
    Tags: ready, playwright

Létrehoz egy ellenözött eljárást kérelmezővel.

## TJ folyamat teszt

Ellenőrzött bejelentés létrehozása

* Belépés mint kérelmező
* Kattints a "Új ellenőrzött bejelentés >> nth=0" gombra
* Kattints az "css=a:text-is(\"Építésügy\")" gombra
* Ellenőrzött bejelentés (építés) piszkozat létrehozása
* Eljárás indítása "ENV:altalanos_hatosag" hatóságnál
* Kijelentkezés

Hatóság oldali irat kezelés cselekmények létrehozása
* Belépés mint hatósági munkatárs

Eljárások xlsx export
* Benyújtott "CACHE:TJ_eljaras_azonosito" azonosítójú irat/cselekmény megnyitása
* Bejövő Iratkezelés
* Kattints a "'Eljárás'" gombra
* Felhívás díjfizetésre cselekmény
* Engedélyezésre utalás cselekmény
* Értesítés joghatás beálltáról cselekmény
* Bejelentés visszautasítása cselekmény
* Kattints az "Eljárás általános adatai" gombra
* Várj, amíg a "Elutasítva" szöveg látszik
