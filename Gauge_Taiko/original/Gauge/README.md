## Teszt írási segédlet

* Ha egy folyamat szóban elintézhető egyetlen mondatban, de automata teszt szinten ez több sornyi lépés és/vagy többször felhasználható ugyanabban a formában és/vagy minimális változtatással (értsd paraméterezetten), akkor az nagy valószínűség szerint egy concept lesz.

* De ha nem is akarod újra felhasználni, viszont olvashatóbb lenne tőle a teszt, akkor is érdemes conceptbe kiszervezni.

* Lehetőleg angolul nevezzük el a fájlokat, még akkor is, ha működés szempontjából semmi jelentősége a fileok neveinek.

* Ha nem fontos, hogy egy mezőbe mi került, akkor érdemes véletlen generált adatokkal feltölteni

* A környezetfüggő változókat, sztringeket a default.properties és a környezetnek megfelelő user.properties fileban tároljuk!

* Az egyes környezetek változói a default.properties fájlból öröklődnek, így csak azokat kell itt megadni, amik ettől elérnek.

## Példák futtatásra:

* localhost: gauge run -p -n 1 -i .\specs\workflow_tests\TA.spec