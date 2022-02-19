# TD_02 folyamat teszt
    Tags: ready

## TD_02 folyamat teszt

Új piszkozat létrehozása, általános képviselőként

* Belépés mint kérelmező
* Kattints az "Új építésügyi kérelem" gombra
* Építési engedélyezési eljárás piszkozat létrehozása képviselőként
* Jegyezd meg a "#process-number" értékét az "TD02_eljaras_azonosito" azonosítóval
* Kattints az "Általános adatok" elemre
* Eljárás nevének átírása "ENV:TD02_eljaras_neve" névre
* Településképi vélemény kérés cselekmény - előzetes
* Kijelentkezés

Belépés mint szakhatósági munkatárs, szakhatósági állásfoglalás

* Belépés mint hatósági munkatárs polgármester
* Benyújtott "CACHE:TD02_eljaras_azonosito" azonosítójú irat/cselekmény megnyitása
* Iratátvétel bezárása
* Bejövő Iratkezelés
* Szakhatósági állásfoglalás cselekmény
* Kijelentkezés

Belépés kérelmezővel cselekmény benyújtása

* Belépés mint kérelmező
* Kérelmezői oldal: eljárás megnyitása a "Előzetes megkeresések" oldalon "CACHE:TD02_eljaras_azonosito" azonosítóval
* Várj, amíg a "Szakhatósági állásfoglalás (Szakhat)" szöveg látszik
* Eljárás indítása "ENV:altalanos_hatosag" hatóságnál
* Kijelentkezés

Belépés hatósági munkatársal irat kezelés, cselekmény készítés

* Belépés mint hatósági munkatárs
* Benyújtott "CACHE:TD02_eljaras_azonosito" azonosítójú irat/cselekmény megnyitása
* Bejövő Iratkezelés
* Kattints a "'Eljárás'" gombra
* Feljegyzés cselekmény létrehozása