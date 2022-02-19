# TK folyamat
    Tags: ready

Címkék ellenőrzése, admin userrel belépünk és felveszünk egy címkét, zöld és kék oldalra is.
Majd ellenűrizzük, hogy látható-e ez a címke a hatósági és akérelmezői oldalon is.
Végül töröljük a címkét.

## Címke létrehozása

Admin oldalon, admin user címkét hoz létre mind a kérelmezői mind pedig a hivatali oldalakra

* Belépés mint rendszer adminisztrátor
* Kattints az "'Admin'" elemre
* Kattints a "Hatósági Címkék" elemre
* Kattints a "Sorrend" elemre
* Jegyezd meg a "RAND:alphabetic:12:PREFIX:TEST_TAG_" értéket a "címke_név" azonosítóval
* "CACHE:címke_név" címke létrehozása
* Ellenőrizd le, hogy a "CACHE:címke_név" "style" paraméterének az értéke "background-color:#94e334; color:#db4a30; border: 1px solid #395418;"
* Kijelentkezés

Belépünk mint hatósági munkatárs, majd ellenőrizzük, hogy látjuk-e az imént létrehozott címkét

* Belépés mint hatósági munkatárs
* Kattints az "'Eljárások'" elemre
* Kattints a "#ProcessListByOffice_DXDataRow0" elemre
* Kattints a "a:has-text('Dokumentumok')" elemre
* Bemutató bezárása
* Ellenőrizd le, hogy az "CACHE:címke_név" szöveg megtalálható az oldalon
* Kijelentkezés

##Belépünk mint kérelmező, majd ellenőrizzük, hogy látjuk-e az imént létrehozott címkét
* Jegyezd meg a "ivyDqVpHIZAO" értéket a "címke_név" azonosítóval

* Belépés mint kérelmező
* Kattints a "Beadott kérelmek" elemre
* Kattints a "#ProcessListByUser_DXDataRow0" elemre
* Kattints a "Dokumentumok" elemre
* Ellenőrizd le, hogy az "CACHE:címke_név" szöveg megtalálható az oldalon
* Kijelentkezés

___
##Admin oldalon, admin user címkét töröl
* Belépés mint rendszer adminisztrátor
* Kattints az "'Admin'" elemre
* Kattints a "Hatósági Címkék" elemre
* Kattints a "Sorrend" elemre
* Kattints a "Sorrend" elemre
* "CACHE:címke_név" címke törlése
* Ellenőrizd le, hogy az "CACHE:címke_név" szöveg nem található meg az oldalon
* Kijelentkezés
