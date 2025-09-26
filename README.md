# Monialaprojekti S25 - Digitaalinen-suorituskorttijärjestelmä

Prototyyppi mobiilisovelluksesta, joka korvaa Helsingin yliopiston hammaslääketieteen koulutusohjelman fyysiset suorituskortit digitaalisella ratkaisulla. Sovellus mahdollistaa opiskelijoiden edistymisen seurannan, opettajien hyväksynnät ja palautteen reaaliajassa. Tavoitteena helppokäyttöinen ja tietoturvallinen ratkaisu. 

# Vaatimusmäärittely

## 1 Johdanto

### 1.1 Tarkoitus
Dokumentin tarkoituksena on määritellä Helsingin yliopiston hammaslääketieteellisen koulutusohjelman suorituskorttien digitalisointiprojektin vaatimukset.  
Tämän vaatimusmäärittelyn pohjalta toteutetaan digitaalinen prototyyppi, joka korvaa nykyisen fyysisiin kortteihin perustuvan järjestelmän.

### 1.2 Tausta
Nykyiset fyysiset suorituskortit aiheuttavat ongelmia:
- Työläs ja virhealtis manuaalinen käsittely  
- Korttien säilytysongelmat  
- Mahdollisuus vilppiin (esim. allekirjoitusten väärentäminen)  
- Tietosuojaongelmat  

Projektin tarkoituksena on kehittää digitaalinen järjestelmä, joka mahdollistaa reaaliaikaisen, turvallisen ja integroitavissa olevan tavan hallita suorituksia.

### 1.3 Määritelmät ja termit
- **Opiskelijaprofiili**: Sovelluksessa luotu käyttäjätili, johon tallentuu kurssit ja suoritukset.  
- **Tick box -lomake**: Yhtenäinen muokattava lomakepohja, jota kurssit käyttävät tehtävien arviointiin.
- **Dropdown menu**: Dropdown-valikko (eli alasvetovalikko) on käyttöliittymäelementti, joka mahdollistaa käyttäjän valita yhden vaihtoehdon useista, ilman että kaikki vaihtoehdot vievät tilaa näytöllä. Se on erityisen hyödyllinen mobiilisovelluksissa, joissa tila on rajallinen ja käyttöliittymän selkeys on tärkeää. 
- **Sisu**: Helsingin yliopiston opintotietojärjestelmä. Se tarjoaa työkalut opiskelijoiden, opettajien ja hallintohenkilöstön tarpeisiin. Sisu on suunniteltu tehostamaan opiskelijoiden opintopolkua ja tukemaan korkeakoulun hallintoa monipuolisilla opintojen seuranta- ja hallintatyökaluilla.

 

*(täydennettävä tarpeen mukaan)*

### 1.4 Viitteet
- Projektisuunnitelma 2025  
- GDPR / Tietosuojalaki (EU 2016/679)  (**Tiitus?**)
- Helsingin yliopiston tietoturvaohjeet  (**Tiitus?**) 

---

## 2 Yleiskuvaus

### 2.1 Järjestelmän tarkoitus
Mahdollistaa opiskelijoiden suoritusten digitaalinen hallinta ja opettajien tekemät hyväksynnät reaaliaikaisesti.  

### 2.2 Käyttäjäryhmät
- **Opiskelijat**: kirjaavat suorituksia, tekevät itsearviointeja  
- **Opettajat**: hyväksyvät ja kommentoivat suorituksia, hallinnoivat kursseja  
- **Ylläpitäjät (IT / hallinto)**: hallinnoivat järjestelmää ja käyttöoikeuksia  

### 2.3 Käyttöympäristö
- Mobiilisovellus (iOS ja Android), toteutus React Nativella  
- Backend ja autentikointi Firebase-palvelussa  
- Pilvipohjainen tietokanta (Firebase Realtime Database)  

### 2.4 Oletukset ja rajoitteet
- Ratkaisun tulee olla GDPR-yhteensopiva
- Asiakas pyyti VRK - Korttia kirjautumiseen, mutta sen toteuttaminen ei ole projektin puitteissa mahdollista. 
- Prototyypissä ei välttämättä vielä toteuteta vahvaa tunnistautumista, mutta se huomioidaan jatkokehityksessä  

### 2.5 Lainsäädäntö ja tietosuoja
- Sovelluksen toteutuksessa noudatetaan EU:n yleistä tietosuoja-asetusta (GDPR), Suomen tietosuojalakia sekä Helsingin yliopiston tietoturvaohjeita.
- Kaikki käyttäjien henkilötiedot käsitellään salattuna, ja järjestelmässä huomioidaan yleisimmät aplikaatio turvallisuus -suositukset sovellusturvallisuuden varmistamiseksi.
- Lisäksi pilvipalveluntarjoajan (Firebase) sertifioinnit ja tietoturvavaatimukset otetaan huomioon.
- Projektissa noudatetaan Helsingin yliopiston virallisia tietoturvaohjeita.  
Tämä tarkoittaa, että sovelluksen kehityksessä ja käytössä huomioidaan yliopiston linjaukset tietojen luottamuksellisuudesta, eheydestä ja saatavuudesta. 

 Tänne lissää 

---




## 3 Toiminnalliset vaatimukset

Esimerkkejä, täydennettävä:

- **REQ-1:** Opiskelija voi luoda profiilin sähköpostilla.  
- **REQ-2:** Opiskelija voi liittyä kurssille opettajan antamalla kurssikoodilla.  

Tämä voisi olla sitä **Iineksen** hommaa



---

## 4 Ei-toiminnalliset vaatimukset

Nää vois olla **Phongin ja Tiituksen** hommia

### **Suorituskyky:**
- Järjestelmän on päivitettävä opiskelijan ja opettajan näkymät reaaliajassa.
- Offline-tila missä opiskelija voi kirjata suorituksia ilman verkkoyhteyttä ja tiedot   synkronoituvat kun yhteys palautuu.
- Sovelluksen pitää kestää kuormaa eli suorituskyky ei voi heikentyä käyttäjämäärien mukaan.
   
### **Käytettävyys:**
- Sovelluksen käyttöliittymän tulee olla selkeä ja saavutettava.
- Sovelluksen pitää toimia iOS- sekä Android laitteilla.
- Käyttäjien tulee saada ohjeistusta ja interaktiivisia vinkkejä ensimmäisellä kirjautumisella.
  
### **Integraatiovalmius:**
- Suoritustietojen raportointi on oltava vietävissä Sisu-järjestelmään
- Tiedot pitää olla standardoidussa muodossa kuten CSV/REST-rajapinta.
- Sovelluksessa pitää olla mahdollisuus tulevaisuudessa tukea integraatioita muihin Helsingin yliopiston järjestelmiin.

### **Tietoturva:** roolipohjainen käyttöoikeus, autentikointi Firebase-tunnuksilla  ---- Tää olis sitä **Liisan** tonttia
  -  Roolipohjainen käyttöoikeus varmistaa, että eri käyttäjäryhmät, opiskelijat, opettajat ja hallinto näkevät ja käsittelevät vain heille kuuluvia tietoja. Firebase-autentikointi tarjoaa turvallisen kirjautumisprosessin, joka tukee käyttäjien yksilöintiä ja tietojen suojaamista. Lisäksi järjestelmä tukee auditointia ja lokitietojen hallintaa, mikä mahdollistaa toiminnan jäljitettävyyden ja tietosuojaloukkausten hallinnan.
Tavoitteena on kehittää helppokäyttöinen, skaalautuva ja tietoturvallinen järjestelmä, joka tukee opiskelijoiden oppimista ja opettajien ohjaustyötä nykyaikaisessa, digitaalisessa ympäristössä.


---

## 5 Käyttötapaukset




**Tänne voitas porukalla keksiä näitä ja sit tehdä se UML Kaavio**  

-- **Tässä käyttötapausesimerkki** -- 

## Käyttötapaus UC-1: Opiskelija liittyy kurssille ja suorittaa tehtävät

**Tunnus:** UC-1  
**Nimi:** Kurssille liittyminen ja tehtävien suorittaminen  
**Kuvaus:** Opiskelija liittyy haluamalleen kurssille ja suorittaa sen tehtävät järjestelmän kautta.  

### Osallistujat
- **Pääosallistuja:** Opiskelija  
- **Sidosryhmät:** Sovellus

### Esiehdot
- Opiskelijalla on voimassa oleva käyttäjätili.  
- Kurssi on olemassa ja siihen voi liittyä.  

### Peruspolku
1. Opiskelija saa opettajalta kurssille liittymiskutsun sähköpostiinsa, joka sisältää liittymiskoodin.
2. Opiskelija seuraa linkkiä sovellukseen. 
3. Opiskelija avaa sovelluksen ja valitsee **Kirjaudu sisään**.  
4. Sovellus tarkistaa tunnukset ja kirjaa opiskelijan sisään.  
5. Opiskelija valitsee **Liity Kurssille** toiminnon ja syöttää liittymiskoodin.   
6. Järjestelmä vahvistaa liittymisen ja lisää opiskelijan kurssille.  
7. Opiskelija avaa kurssin ja valitsee **Täyttä tehtävät**.  
8. Sovellus tallentaa opiskelijan tehtäväpalautukset.  
9. Opiskelija voi tarkistaa edistymisensä toiminnolla **Näytä kurssin edistyminen**.  

### Poikkeuspolut
- Tunnukset virheelliset → Järjestelmä ilmoittaa virheestä ja pyytää uudelleen.  
- Liittymiskoodo on virheellinen → Järjestelmä ilmoittaa, eikä liittyminen onnistu.  

### Jälkiehdot
- Opiskelija on liittynyt kurssille ja hänen palautuksensa on tallennettu järjestelmään.

## Käyttötapaus UC-1: Opiskelija liittyy kurssille 

**Tunnus:** UC-1  
**Nimi:** Kurssille liittyminen
**Kuvaus:** Opiskelija liittyy haluamalleen kurssille järjestelmän kautta.  Kurssille liittyminen mahdollistaa harjoituskorttien täyttämisen ja arvioinnin kyseisen kurssin puitteissa.

### Osallistujat
- **Pääosallistuja:** Opiskelija
- **Sidosryhmät:** Opettaja, Admin, Kurssinhallintamoduuli

### Esiehdot
 - Opiskelijalla on voimassa oleva käyttäjätunnus järjestelmään.
- Kurssi on olemassa ja avoinna liittymiselle.
- Opiskelija on kirjautunut järjestelmään.

### Peruspolku
1.	Opiskelija kirjautuu järjestelmään.
2.	Opiskelija siirtyy kurssilistaukseen.
3.	Opiskelija valitsee haluamansa kurssin.
4.	Opiskelija painaa "Liity kurssille" -painiketta.
5.	Järjestelmä vahvistaa liittymisen ja lisää opiskelijan kurssin osallistujalistalle.
6.	Opiskelija näkee kurssin sisällön ja siihen liittyvät harjoituskortit.

### Poikkeuspolut
-	Kurssia ei löydy → Järjestelmä ilmoittaa virheestä.
-	Kurssi on suljettu liittymiseltä → Järjestelmä estää liittymisen ja ilmoittaa syyn.
-	Opiskelija on jo liittynyt kurssille → Järjestelmä ilmoittaa, ettei liittyminen ole tarpeen.
-	Liittyminen epäonnistuu teknisen virheen vuoksi → Järjestelmä ilmoittaa virheestä ja ohjaa tukipalveluun.

### Jälkiehdot
- Opiskelija on lisätty kurssin osallistujalistalle.
- Opiskelija voi tarkastella ja täyttää kurssiin liittyviä harjoituskortteja.
- Opettaja näkee opiskelijan kurssin osallistujana.




## UC-2: Tehtävän hyväksyminen

**Tunnus:** UC-2  
**Nimi:** Tehtävän hyväksyminen  
**Kuvaus:** Opettaja arvioi opiskelijan palautuksen ja hyväksyy sen järjestelmässä.  

### Osallistujat
- **Pääosallistuja:** Opettaja  
- **Sidosryhmät:** Sovellus, Opiskelija

### Esiehdot
- Opettajalla on voimassa oleva käyttäjätili. 
- Opiskelija on palauttanut tehtävän.  

### Peruspolku
1. Opettaja kirjautuu sovellukseen.
2. Opettaja avaa kurssin hallintanäkymän.
3. Opettaja tarkastelee opiskelijan palautusta.  
4. Opettaja valitsee toiminnon Hyväksy tehtävä. 
5. Sovellus tallentaa hyväksynnän ja merkitsee tehtävän suoritetuksi. 


### Poikkeuspolut
- Palautus puuttuu → Järjestelmä ilmoittaa virheestä. 
- Opettajalla ei ole oikeuksia → Järjestelmä estää toiminnon.  

### Jälkiehdot
- Opiskelijan palautus on merkitty hyväksytyksi.
- Opiskelijan kurssin edistymistiedot päivittyvät.


## UC-3: Opettaja luo uuden kurssin

**Tunnus:** UC-3  
**Nimi:** Uuden kurssin luominen  
**Kuvaus:** Opettaja luo järjestelmään uuden kurssin, johon opiskelijat voivat myöhemmin liittyä liittymiskoodilla.  

### Osallistujat
- **Pääosallistuja:** Opettaja  
- **Sidosryhmät:** Sovellus

### Esiehdot
- Opettajalla on voimassa oleva käyttäjätili. 
- Opiskelija on oikeudet kurssien hallintaan.  

### Peruspolku
1. Opettaja kirjautuu sovellukseen.
2. Opettaja valitsee toiminnon Luo uusi kurssi.
3. Opettaja syöttää kurssin tiedot (nimi, kuvaus, aikataulu). 
4. Sovellus luo kurssille automaattisesti liittymiskoodin.
5. Sovellus tallentaa kurssin tietokantaan.
6. Opettaja saa liittymiskoodin, jonka hän voi jakaa opiskelijoille.


### Poikkeuspolut
- Syötetty kurssin nimi on jo käytössä → Järjestelmä ilmoittaa virheestä.
- Kurssin pakollisia tietoja puuttuu → Järjestelmä pyytää täydentämään. 

### Jälkiehdot
- Kurssi on luotu järjestelmään ja opiskelijat voivat liittyä siihen liittymiskoodilla.


## UC-4: Opiskelija tarkastelee omaa edistymistään

**Tunnus:** UC-4  
**Nimi:** Oman edistymisen tarkastelu  
**Kuvaus:** Opiskelija voi sovelluksessa seurata omaa suoritustaan kurssilla, nähdä hyväksytyt tehtävät ja palautteet reaaliajassa.  

### Osallistujat
- **Pääosallistuja:** Opiskelija
- **Sidosryhmät:** Sovellus

### Esiehdot
- Opiskelijalla on voimassa oleva käyttäjätili.
- Opiskelija on liittynyt vähintään yhdelle kurssille.
- Opettajat ovat arvioineet tehtäviä.

### Peruspolku
1. Opiskelija kirjautuu sovellukseen.
2. Opiskelija avaa kurssinäkymän.
3. Opiskelija valitsee toiminnon Näytä edistyminen.
4. Sovellus hakee kurssin suoritustiedot Firebase-tietokannasta.
5. Sovellus näyttää opiskelijalle suoritettujen ja hyväksyttyjen tehtävien listan sekä mahdollisen opettajan antaman palautteen.


### Poikkeuspolut
- Yhteysvirhe → Sovellus näyttää viimeksi tallennetut tiedot ja ilmoittaa, ettei reaaliaikaisia tietoja voitu hakea.

### Jälkiehdot
- Opiskelija saa ajantasaisen kuvan omasta edistymisestään kurssilla.


## Käyttötapaus UC-5: Admin lisää tai poistaa käyttäjiä (opiskelijat, opettajat)

**Tunnus:** UC-5  
**Nimi:** Käyttäjähallinta: lisääminen ja poistaminen
**Kuvaus:** Admin hallinnoi järjestelmän käyttäjiä lisäämällä uusia opiskelijoita ja opettajia tai poistamalla vanhoja käyttäjiä tarpeen mukaan. Tämä mahdollistaa järjestelmän ajantasaisuuden ja turvallisuuden.

### Osallistujat
- **Pääosallistuja:** Admin  
- **Sidosryhmät:** Sovellus (käyttäjähallintamoduuli, tietokanta)

### Esiehdot
- Admin on kirjautunut järjestelmään ja hänellä on tarvittavat käyttöoikeudet.
- Järjestelmä on toiminnassa ja yhteydessä käyttäjätietokantaan.
### Peruspolku
- Admin avaa käyttäjähallintanäkymän.
-  Admin valitsee toiminnon: "Lisää käyttäjä" tai "Poista käyttäjä".
Lisättäessä käyttäjää:
-Admin syöttää tarvittavat tiedot (nimi, rooli, sähköposti, käyttäjätunnus).
-Järjestelmä tarkistaa tietojen oikeellisuuden ja mahdolliset duplikaatit.
- Järjestelmä tallentaa uuden käyttäjän tietokantaan.
- Järjestelmä lähettää käyttäjälle aktivointiviestin tai tunnukset.
Poistettaessa käyttäjää:
-	Admin hakee käyttäjän tiedot.
-	Admin vahvistaa poistamisen.
-	Järjestelmä poistaa käyttäjän tiedot tai merkitsee ne inaktiiviseksi.
Järjestelmä vahvistaa onnistuneen toimenpiteen.

### Poikkeuspolut
- Syötetyt tiedot ovat puutteelliset → Järjestelmä ilmoittaa virheestä ja pyytää korjausta.
- Käyttäjä on jo olemassa → Järjestelmä estää duplikaatin ja ehdottaa muokkausta.
- Käyttäjää ei löydy → Järjestelmä ilmoittaa virheestä.
- Poisto epäonnistuu teknisen virheen vuoksi → Järjestelmä ilmoittaa virheestä ja kirjaa tapahtuman lokiin.

### Jälkiehdot
-	Käyttäjätietokanta on päivitetty.
-	Käyttäjälle on luotu tunnukset, tai hänen tietonsa on poistettu.
-	Lokitiedot on päivitetty toimenpiteestä.
-	Järjestelmä on valmis seuraavaan hallintatoimenpiteeseen.





---

## 6 Liittymät muihin järjestelmiin

**Tiitus, Phong, Liisa** 

### 6.1 Sisu järjestelmä
- Integraatio Helsingin yliopiston Sisu-järjestelmään (raportoinnin kautta).
- Rajapinta toteutetaan standardoidussa muodossa, kuten CSV/REST-rajapinta.
- Jos siirto epäonnistuu, järjestelmän tulee antaa selkeä virheilmoitus ja mahdollisuuden yrittää uudelleen ilman tietojen katoamista. 

### 6.2 Firebase-autentikointi ja tietokanta

Firebase-autentikointi on Googlen tarjoama palvelu, joka mahdollistaa turvallisen ja skaalautuvan käyttäjien tunnistamisen mobiili- ja verkkosovelluksissa. Se on erityisen hyödyllinen projekteissa, joissa tarvitaan nopea ja luotettava kirjautumisratkaisu ilman raskasta taustajärjestelmän rakentamista.

Firebase-autentikointi tarjoaa:
•	Useita kirjautumistapoja
Tukee sähköpostilla ja salasanalla kirjautumista, puhelinnumeroa (SMS-varmennus), sekä kolmannen osapuolen tunnistautumista kuten Google, Facebook, Twitter ja Apple.
•	Valmiit käyttöliittymäkomponentit (FirebaseUI)
Tarjoaa helposti käyttöönotettavan kirjautumisnäkymän, joka voidaan räätälöidä sovelluksen visuaaliseen ilmeeseen.
•	Turvallinen käyttäjähallinta
Firebase huolehtii käyttäjätunnusten tallennuksesta, salasanan palautuksesta ja tilien yhdistämisestä turvallisesti.
•	Integroitu muuhun Firebase-ekosysteemiin
Autentikointi toimii saumattomasti yhdessä Firebase Realtime Database, Firestore, Cloud Functions ja muiden palveluiden kanssa.
•	Laajennettavuus ja yritystason ominaisuudet
Mahdollisuus ottaa käyttöön lisäominaisuuksia kuten monivaiheinen tunnistautuminen (MFA), auditointi, SAML/OpenID Connect -tuki ja käyttäjätoimintojen seuranta.

Firebase-autentikointi sopii erinomaisesti projekteihin, kuten digitaalinen suorituskorttisovellus, jossa tarvitaan roolipohjainen käyttöoikeus ja turvallinen kirjautuminen eri käyttäjäryhmille (opiskelijat, opettajat, hallinto).


---

## 7 Laadunvarmistus
- Prototyypin testaus sprinttien lopussa.  
- Katselmointipalaverit viikoittain.  
- Hyväksymiskriteerit sovitaan asiakkaan kanssa.  

---

## 8 Liitteet
- Sovelluksen wireframe *(lisätään erikseen)*  

---

## 9 Lähteet
- Projektisuunnitelma 2025  
- GDPR-asetus  
- Helsingin yliopiston tietoturvaohjeet  
