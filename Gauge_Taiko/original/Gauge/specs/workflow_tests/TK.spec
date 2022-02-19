# TK folyamat
    Tags: 

Címkék ellenőrzése, admin userrel belépünk és felveszünk egy címkét, zöld és kék oldalra is.
Majd ellenűrizzük, hogy látható-e ez a címke a hatósági és akérelmezői oldalon is.
Végül töröljük a címkét.

## Címke létrehozása

Admin oldalon, admin user címkét hoz létre mind a kérelmezői mind pedig a hivatali oldalakra

* Belépés mint rendszer adminisztrátor
* Kattints az "Admin" elemre
* Kattints a "Hatósági Címkék" elemre
* Kattints a "Sorrend" elemre
* Jegyezd meg a "RAND:alphabetic:12:111_test_" értéket a "címke_név" azonosítóval
* "CACHE:címke_név" címke létrehozása
* Ellenőrizd le, hogy a "CACHE:címke_név" "style" paraméterének az értéke "background-color:#94e334; color:#db4a30; border: 1px solid #395418;"
* Kijelentkezés

Belépünk mint hatósági munkatárs, majd ellenőrizzük, hogy látjuk-e az imént létrehozott címkét

* Belépés mint hatósági munkatárs
* Kattints az "Eljárások" elemre
* Várj, amíg a "Nincs megjelenítendő adat" szöveg nem lesz jelen
* Kattints a "ProcessListByOffice_DXMainTable" táblázat "2". sor "1". oszlopára
* Várj, amíg a "Nincs kapcsolódó eljárási cselekmény" szöveg már nem látszik
* Kattints a "Dokumentumok" elemre
* Bemutató bezárása
* Várj, amíg az "CACHE:címke_név" szöveg jelen lesz
* Kijelentkezés

Belépünk mint kérelmező, majd ellenőrizzük, hogy látjuk-e az imént létrehozott címkét

* Belépés mint kérelmező
* Kattints a "Beadott kérelmek" elemre
* Várj, amíg a "Nincs megjelenítendő adat" szöveg nem lesz jelen
* Kattints a "ProcessListByUser_DXMainTable" táblázat "2". sor "1". oszlopára
* Várj, amíg a "Dokumentumok" szöveg látszik
* Kattints a "Dokumentumok" elemre
* Ellenőrizd le, hogy az "CACHE:címke_név" szöveg megtalálható az oldalon
* Kijelentkezés

Admin oldalon, admin user címkét töröl

* Belépés mint rendszer adminisztrátor
* Kattints az "Admin" elemre
* Kattints a "Hatósági Címkék" elemre
* Kattints a "Név" elemre
* "CACHE:címke_név" címke törlése
* Ellenőrizd le, hogy az "CACHE:címke_név" szöveg nem található meg az oldalon