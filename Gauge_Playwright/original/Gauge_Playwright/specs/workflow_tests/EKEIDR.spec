# EKEIDR folyamat
    Tags: 

EKEIDR tesztelése
- Építési engedélyezési eljárás létrehozása benyújtás EKEIDR-es hatóságnak

## EKEIDR folyamat teszt

Ellenőrzött bejelentés létrehozása

* Belépés mint kérelmező
* Kattints a "Új építésügyi kérelem >> nth=0" gombra
* Építési engedélyezési eljárás piszkozat létrehozása kérelmezővel EKEIDR
* Jegyezd meg a "#process-number" értékét az "EKEIDR_eljaras_azonosito" azonosítóval
* Eljárás indítása "ENV:ekeidr_hatosag" hatóságnál
* Kijelentkezés

Hatóság oldali irat kezelés cselekmények létrehozása szakhatóság megkeresése kiküldése Poszeidon ellenőrzés
 Jegyezd meg a "B-18185/2022" értéket a "EKEIDR_eljaras_azonosito" azonosítóval

* Belépés mint EKEIDR hatósági munkatárs
* Benyújtott "CACHE:EKEIDR_eljaras_azonosito" azonosítójú cselekmény megnyitása
* Várj, amíg a "Eljárást indító kérelem" szöveg látszik
* Jegyezd meg az aktuális URL-t, ezzel az azonosítóval "ekeidr_eljaras_url"
* Kattints duplán a "Eljárást indító kérelem" elemre
* EKEIDR bejövő iratkezelés
* Jegyezd meg az "#filing-number" értékét az "EKEIDR_filing_number_1" azonosítóval
* Poszeidonos belépés adott url-en "ENV:hat_munk_poszeidon_url"
* Főszámos Iktatószám ellenőrzése Poszeidonben adott iktatószámmal "CACHE:EKEIDR_filing_number_1"
* Navigálj az "CACHE:ekeidr_eljaras_url" URL-re
* EKEIDR_Szakhatósági megkeresés cselekmény
* Navigálj az "ENV:hat_munk_poszeidon_url" URL-re
* Alszámos Iktatószám ellenőrzése Poszeidonben adott iktatószámmal "CACHE:EKEIDR_sub_filing_number"
* Navigálj az "CACHE:ekeidr_eljaras_url" URL-re
* Kijelentkezés

Szakhatósági állásfoglalás létrehozása és ellenőrzése Poszeidonban

* Belépés mint EKEIDR szakhatósági munkatárs
* Benyújtott "CACHE:EKEIDR_eljaras_azonosito" azonosítójú cselekmény megnyitása
* Várj, amíg a "Szakhatósági megkeresés" szöveg látszik
* Kattints duplán a "Szakhatósági megkeresés" elemre
* Jegyezd meg az aktuális URL-t, ezzel az azonosítóval "ekeidr_eljaras_url"
* Kattints duplán a "Bezárás" gombra
* EKEIDR bejövő iratkezelés
* Jegyezd meg az "#filing-number" értékét az "EKEIDR_filing_number_2" azonosítóval
* Poszeidonos belépés adott url-en "ENV:szakhat_munk_poszeidon_url"
* Főszámos Iktatószám ellenőrzése Poszeidonben adott iktatószámmal "CACHE:EKEIDR_filing_number_2"
* Navigálj az "CACHE:ekeidr_eljaras_url" URL-re

* Szakhatósági állásfoglalás cselekmény EKEIDR
* Navigálj az "ENV:szakhat_munk_poszeidon_url" URL-re
* Alszámos Iktatószám ellenőrzése Poszeidonben adott iktatószámmal "CACHE:EKEIDR_sub_filing_number_2"
* Navigálj az "CACHE:ekeidr_eljaras_url" URL-re
* Kijelentkezés

Hatósági munkatársal belépés kézi érkeztetés, irattározás ellenőrzés
