# Mario Space - Szakdolgozat

## Játékmenet és Leírás

- Ez a szakdolgozat egy 2D platformjátékot mutat be, amelyet Canvas API segítségével készítettem. A játék a Mario Space nevet viseli, és egy karakterrel játszható, aki különböző akadályokkal, ellenségekkel és szintekkel találkozik.

### Játékmenet:

- **Cél**: Játékos pontokat gyűjt, legyőzi az ellenségeket, és eljut a következő szintekre.
- **Pontok gyűjtése**: Az ellenségek legyőzése, power-up-ok összeszedése és akadályok elkerülése révén lehet pontokat gyűjteni.
- **Ellenségek**: Különböző ellenségekkel kell megküzdeni, például alienek, akiket eltaposással, vagy lövéssel lehet legyőzni.
- **Power-up**: Speciális tárgy, amellyel a játékos ideiglenesen erősebb lesz.

### Játék kinézete:

- Egyszerű, de hatékony 2D grafika.
- Különböző szintek és háttérképek.
- Animált karakterek és speciális effektek.

## Rendszerkövetelmények

Ahhoz, hogy futtasd a kódot és játszhass a játékkal, szükséged lesz a következőkre:

- Modern webböngésző (pl., Google Chrome, Mozilla Firefox, Safari).
- Lokális szervert futtató környezet (Node.js).

## Hogyan futtasd a kódot

1. Klónozd le a projektet a saját gépedre:

   ```bash
   git clone https://github.com/your-username/retro-platformer.git

2. Navigálj a projekt könyvtárába:

   cd Mario_Space_

3. Nyisd meg a projektet egy lokális szervert futtató módon. Például:

   npm install
   npm start

4. Nyisd meg a böngésződben a következő címet:

   http://localhost:3000

5. Élvezd a játékot!

## Irányítás
- Mozgás: A és D billentyűk balra és jobbra mozgatják a karaktert.
- Ugrás: W billentyűvel tud a karakter ugrani.
- Lövés: Szóköz billentyűvel lehet lövöldözni. (A tűzgolyók csak akkor működnek, ha van power-up.)

## Egyéb tudnivalók
- A játékban különböző szintek és nehézségi szintek találhatók.
- Power-up segítségével a karakter ideiglenesen erősebbé válhat.
- A pontokat az ellenségek legyőzésével és különböző akciókkal lehet gyűjteni.

## Felhasznált Technológiák
- HTML5 Canvas API
- JavaScript ES6
- Egyéb (például: Webpack, npm)