# Örökségvédelmi folyamat teszt
    Tags: ready
    
1. Mint kérelmező Új örökségvédelmi eljárás létrehozása
2. Örökségvédelmi hatósági munkatársként iratkezelés és egyedi válasz cselekmények létrehozása 

## Örökségvédelmi eljárás folyamat teszt
Új örökségvédelmi eljárást benyújtása mint kérelmező

* Belépés mint kérelmező
* Örökségvédelmi eljárás piszkozat létrehozása kérelmezővel
* Kattints az "Általános adatok" elemre
* Jegyezd meg a "#process-number" értékét az "OV_eljaras_azonosito" azonosítóval
* Eljárás nevének átírása "ENV:OV_eljaras_neve" névre
* Eljárás indítása "ENV:oroksegvedelem_hatosag" hatóságnál
* Kijelentkezés

Kérelem kezelése örökségvédelmi hatósági munkatárssal - egyedi örökségvédelmi eljárások készítése, válasz cselekemények

* Belépés mint örökségvédelmi hatósági munkatárs
* Benyújtott "CACHE:OV_eljaras_azonosito" azonosítójú irat/cselekmény megnyitása
* Bejövő Iratkezelés
* "FilingByOffice" tab bezárása
* Kattints az "Eljárás" gombra
* Szakvélemény kérése cselekmény "ENV:Vker_hatosag"-nak küldve
* Kijelentkezés

Szakvélemény kérése cselekményre válasz cselekmény készítése

* Belépés mint V. kerületi hatósági munkatárs 1
* Benyújtott "CACHE:OV_eljaras_azonosito" azonosítójú irat/cselekmény megnyitása
* Iratátvétel bezárása
* Bejövő Iratkezelés

* Szakvélemény válasz cselekmény