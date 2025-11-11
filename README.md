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
- **Opiskelijaprofiili**: Sovelluksessa luotu käyttäjätili, johon tallentuu kurssit ja suoritukset. Opiskelijaprofiilin kautta käyttäjä voi myös päivittää omia tietojaan, kuten yhteystiedot ja opintojen tavoitteet. 
- **Tick box -lomake**: Yhtenäinen muokattava lomakepohja, jota kurssit käyttävät tehtävien arviointiin.Tick box -lomake mahdollistaa nopean ja visuaalisen arvioinnin, mikä helpottaa sekä opettajan, että opiskelijan ymmärrystä tehtävän palautteesta.Tick box -lomakkeeseen voidaan lisätä kommenttikenttiä, jotka mahdollistavat yksityiskohtaisemman palautteen.
- **Dropdown menu**: Dropdown-valikko (eli alasvetovalikko) on käyttöliittymäelementti, joka mahdollistaa käyttäjän valita yhden vaihtoehdon useista, ilman että kaikki vaihtoehdot vievät tilaa näytöllä. Se on erityisen hyödyllinen mobiilisovelluksissa, joissa tila on rajallinen ja käyttöliittymän selkeys on tärkeää. Dropdown-valikon käyttö vähentää kognitiivista kuormitusta, kun vaihtoehdot esitetään kompaktisti ja loogisesti. Dropdown-valikkoa voidaan käyttää myös lomakkeissa, joissa käyttäjän tulee valita esimerkiksi kurssin aikataulu tai opetusmuoto.
- **Sisu**: Helsingin yliopiston opintotietojärjestelmä. Se tarjoaa työkalut opiskelijoiden, opettajien ja hallintohenkilöstön tarpeisiin. Sisu on suunniteltu tehostamaan opiskelijoiden opintopolkua ja tukemaan korkeakoulun hallintoa monipuolisilla opintojen seuranta- ja hallintatyökaluilla. Sisu tukee opiskelijan pitkäjänteistä suunnittelua tarjoamalla visuaalisia työkaluja opintojen aikatauluttamiseen.


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
- Tietojen säilytysaika on rajattu, ja vanhentuneet tiedot poistetaan automaattisesti tietosuojaperiaatteiden mukaisesti.
- Sovelluksen kehityksessä hyödynnetään tietoturva-auditointeja ja ulkopuolisten asiantuntijoiden suorittamia testauksia.
- Käyttäjille tarjotaan mahdollisuus tarkastella, muokata ja poistaa omia tietojaan sovelluksen asetuksista.
- Tietosuojakäytännöt päivitetään säännöllisesti vastaamaan muuttuvaa lainsäädäntöä ja teknologista kehitystä.
- Sovelluksen tietoliikenne on suojattu HTTPS-protokollalla, joka estää tietojen sieppauksen ja manipuloinnin siirron aikana.
- Sovelluksen käyttöoikeudet on rajattu roolipohjaisesti, jotta vain valtuutetut henkilöt pääsevät käsittelemään arkaluontoisia tietoja.
- Käyttäjien suostumus tietojen käsittelyyn kerätään selkeästi ja läpinäkyvästi ennen henkilötietojen tallentamista.
- Tietosuojariskien arviointi on osa kehitysprosessia, ja mahdolliset haavoittuvuudet pyritään tunnistamaan jo varhaisessa vaiheessa.
- Sovelluksessa hyödynnetään kaksivaiheista tunnistautumista lisäturvana käyttäjätileille.

### 2.6 Viitteet
- Projektisuunnitelma 2025
- GDPR / Tietosuojalaki (EU 2016/679)
- Helsingin yliopiston tietoturvaohjeet




## 3 Toiminnalliset vaatimukset

Esimerkkejä, täydennettävä:

- **REQ-1:** Opiskelija voi luoda profiilin sähköpostilla.  
- **REQ-2:** Opiskelija voi liittyä kurssille opettajan antamalla kurssikoodilla.
- Opiskelijaan liittyvät vaatimukset
  - **REQ-3:** Opiskelija voi tarkastella omia kurssitietojaan (esim. kurssin nimi, opettaja, aikataulu).
- **REQ-4:** Opiskelija voi lähettää tehtäviä kurssialustalle määräaikaan mennessä.
  - **REQ-5:** Opiskelija voi nähdä palautteen ja arvosanat opettajalta.
- **REQ-6:** Opiskelija voi muokata omaa profiiliaan (esim. nimi, kuva, salasana).
- **REQ-7:** Opiskelija voi keskustella kurssin opettajan kanssa viestitoiminnon kautta.
- **REQ-8:** Opiskelija voi poistua kurssilta halutessaan.

Opettajaan liittyvät vaatimukset
- **REQ-9:** Opettaja voi luoda uuden kurssin ja määrittää kurssikoodin.
- **REQ-10:** Opettaja voi hyväksyä tai hylätä opiskelijoiden liittymispyynnöt.
- **REQ-11:** Opettaja voi lisätä kurssille tehtäviä ja määrittää palautuspäivän.
- **REQ-12:** Opettaja voi arvioida opiskelijoiden tehtävät ja antaa palautetta.
- **REQ-13:** Opettaja voi lähettää ilmoituksia kurssin osallistujille.
- **REQ-14:** Opettaja voi tarkastella kurssin osallistujalistaa ja opiskelijoiden edistymistä.
 

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

### **Tietoturva:** roolipohjainen käyttöoikeus, autentikointi Firebase-tunnuksilla 
  -  Roolipohjainen käyttöoikeus varmistaa, että eri käyttäjäryhmät, opiskelijat, opettajat ja hallinto näkevät ja käsittelevät vain heille kuuluvia tietoja. Firebase-autentikointi tarjoaa turvallisen kirjautumisprosessin, joka tukee käyttäjien yksilöintiä ja tietojen suojaamista.
  -  Lisäksi järjestelmä tukee auditointia ja lokitietojen hallintaa, mikä mahdollistaa toiminnan jäljitettävyyden ja tietosuojaloukkausten hallinnan.
  -  Tavoitteena on kehittää helppokäyttöinen, skaalautuva ja tietoturvallinen järjestelmä, joka tukee opiskelijoiden oppimista ja opettajien ohjaustyötä nykyaikaisessa, digitaalisessa ympäristössä.
  -  Käyttöoikeuksien hallinta perustuu vähimmän oikeuden periaatteeseen, mikä minimoi tarpeettoman pääsyn arkaluontoisiin tietoihin.
- Firebase tukee myös kertakirjautumista (SSO), mikä parantaa käyttökokemusta ja vähentää salasanojen hallintaan liittyviä riskejä.
- Lokitietojen analytiikkaa voidaan hyödyntää järjestelmän kehittämisessä ja mahdollisten väärinkäytösten ennaltaehkäisyssä.
- Tietoturvapoikkeamat dokumentoidaan ja käsitellään osana jatkuvaa riskienhallintaprosessia.
- Järjestelmä tukee myös käyttäjän toimien aikaleimausta, mikä parantaa auditointimahdollisuuksia ja vastuiden jäljittämistä.
  - Käyttöliittymä on suunniteltu responsiiviseksi, jotta se toimii sujuvasti eri laitteilla ja eri kokoisilla näytöillä.
- Skaalautuva arkkitehtuuri mahdollistaa järjestelmän laajentamisen uusille käyttäjäryhmille ja oppilaitoksille ilman merkittäviä muutoksia.
- Käyttäjäpalautetta kerätään säännöllisesti, ja sen pohjalta tehdään parannuksia käytettävyyteen ja toiminnallisuuksiin.
- Järjestelmä tukee monikielisyyttä, mikä edistää saavutettavuutta kansainvälisessä oppimisympäristössä.
- Käyttöönottoprosessi on vaiheistettu ja dokumentoitu, mikä helpottaa uusien käyttäjien perehdyttämistä.
- Opettajat voivat seurata opiskelijoiden edistymistä reaaliaikaisesti ja tarjota kohdennettua ohjausta.
- Järjestelmä tukee oppimisanalytiikkaa, jonka avulla voidaan tunnistaa opiskelijoiden vahvuuksia ja haasteita.
- Kurssien sisällöt ja tehtävät voidaan personoida opiskelijaprofiilin perusteella, mikä tukee yksilöllistä oppimispolkua.
- Opiskelijat voivat tarkastella omia suorituksiaan visuaalisessa muodossa, mikä lisää motivaatiota ja itseohjautuvuutta.
- Opettajille tarjotaan työkaluja palautteen antamiseen ja arvioinnin dokumentointiin, mikä tukee pedagogista jatkuvuutta.

### **Tietojen eheys ja varmuuskopiointi:**
- Kaikki tiedot varmuuskopioidaan automaattisesti Firebase-palvelun pilvitallennukseen.
- Järjestelmä tarkistaa tiedonsiirron eheyden ennen tallennusta.
- Mahdolliset tiedonsiirtovirheet käsitellään automaattisesti, ja käyttäjälle ilmoitetaan tilanteesta.

### **Luotettavuus ja ylläpidettävyys:**
- Palvelun käyttökatkot minimoidaan hyödyntämällä Firebase-palvelun automaattista varmistusta ja palautusta.
- Virhetilanteet lokitetaan automaattisesti, ja käyttäjälle näytetään selkeä virheilmoitus.
- Käyttäjä voi raportoida ongelmia sovelluksen kautta.



---

## 5 Käyttötapaukset




**Tänne voitas porukalla keksiä näitä ja sit tehdä se UML Kaavio**  

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

## Käyttötapaus UC-2: Opiskelija suorittaa kurssitehtävät

**Tunnus:** UC-2  
**Nimi:** Kurssitehtävien suorittaminen  
**Kuvaus:** Opiskelija suorittaa kurssiin liittyviä tehtäviä digitaalisten harjoituskorttien muodossa. Tehtävät voivat sisältää potilastapauksia, toimenpiteiden kirjaamista, reflektiota tai teoreettisia harjoituksia, jotka arvioidaan opettajan toimesta.

### Osallistujat
- **Pääosallistuja:**: Opiskelija
- **Sidosryhmät:**: Opettaja, Sovellus (harjoituskorttijärjestelmä), Kurssinhallintamoduuli

### Esiehdot  
-	Opiskelija on liittynyt kurssille.
-	Opiskelijalla on voimassa oleva käyttäjätunnus ja pääsy järjestelmään.
-	Kurssitehtävät ovat julkaistu ja saatavilla opiskelijalle.

### Peruspolku
1.	Opiskelija kirjautuu järjestelmään.
2.	Opiskelija siirtyy kurssin tehtäväosioon.
3.	Opiskelija valitsee tehtävän tai harjoituskortin.
4.	Opiskelija täyttää tehtävän vaadituilla tiedoilla.
5.	Opiskelija tallentaa tai lähettää tehtävän arvioitavaksi.
6.	Järjestelmä vahvistaa tehtävän vastaanoton ja merkitsee sen arviointiin.
7.	Opettaja arvioi tehtävän ja antaa palautteen.
8.	Opiskelija tarkastelee palautetta ja tekee tarvittaessa korjauksia.

### Poikkeuspolut   

-	Tehtävää ei löydy tai se on poistettu → Järjestelmä ilmoittaa virheestä.
-	Tehtävän täyttö keskeytyy teknisen virheen vuoksi → Järjestelmä tallentaa luonnoksen ja ilmoittaa virheestä.
-	Tehtävää ei voi lähettää → Järjestelmä ilmoittaa puuttuvista tiedoista tai virheellisestä muodosta.
-	Opettaja ei arvioi tehtävää määräajassa → Järjestelmä lähettää muistutuksen opettajalle.
  
### Jälkiehdot

-	Tehtävä on tallennettu ja arvioitu.
-	Opiskelija on saanut palautteen ja voi seurata edistymistään.
-	Tehtävä näkyy kurssin suoritusmerkinnöissä.



## UC-3: Tehtävän hyväksyminen

**Tunnus:** UC-3  
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


## UC-4: Opettaja luo uuden kurssin

**Tunnus:** UC-4  
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


## UC-5: Opiskelija tarkastelee omaa edistymistään

**Tunnus:** UC-5  
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


## Käyttötapaus UC-6: Admin lisää tai poistaa käyttäjiä (opiskelijat, opettajat)

**Tunnus:** UC-6  
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

## Käyttötapaus UC-7: Admin muokkaa käyttäjärooleja ja käyttöoikeuksia

**Tunnus:** UC-7  
**Nimi:** Käyttäjäroolien ja käyttöoikeuksien hallinta

**Kuvaus:** Admin voi muuttaa järjestelmän käyttäjien rooleja (esim. opiskelija, opettaja, tarkastaja) ja määrittää heidän käyttöoikeutensa eri toimintoihin, kuten harjoituskorttien luomiseen, arviointiin tai raporttien tarkasteluun.

### Osallistujat
- **Pääosallistuja:** Admin
- **Sidosryhmät:** Sovellus (käyttäjähallintamoduuli), Käyttäjät (opiskelijat, opettajat)

### Esiehdot
- Admin on kirjautunut järjestelmään ja hänellä on pääkäyttäjän oikeudet.
- Käyttäjä, jonka roolia tai oikeuksia halutaan muuttaa, on olemassa järjestelmässä.
- Järjestelmä on yhteydessä käyttäjätietokantaan.

### Peruspolku
- Admin avaa käyttäjähallintanäkymän.
- Admin hakee haluamansa käyttäjän tiedot.
- Admin valitsee toiminnon: "Muokkaa roolia" tai "Muokkaa käyttöoikeuksia".
- Admin valitsee uuden roolin tai käyttöoikeudet (esim. luku-, kirjoitus-, arviointioikeus).
- Järjestelmä tarkistaa muutoksen kelpoisuuden.
- Admin vahvistaa muutoksen.
- Järjestelmä tallentaa muutoksen ja päivittää käyttäjän oikeudet.
- Järjestelmä ilmoittaa onnistuneesta päivityksestä.

### Poikkeuspolut
-  Käyttäjää ei löydy → Järjestelmä ilmoittaa virheestä.
- Valittu rooli ei ole sallittu → Järjestelmä estää muutoksen ja ilmoittaa syyn.
- Muutos ei ole teknisesti mahdollinen → Järjestelmä ilmoittaa virheestä ja kirjaa tapahtuman lokiin.
-  Tallennus epäonnistuu → Järjestelmä ilmoittaa virheestä ja ehdottaa uudelleenyritystä.

### Jälkiehdot
- Käyttäjän rooli ja käyttöoikeudet on päivitetty.
- Käyttäjä näkee uudet oikeudet seuraavassa kirjautumisessa.
- Lokitiedot on päivitetty muutoksesta.
- Järjestelmä on valmis seuraavaan hallintatoimenpiteeseen.






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

## 7 Taitopajatoiminnallisuudet ja käytettävyystestauksen havainnot

### 7.1 Käytettävyystestauksessa havaittiin erityistarpeita taitopajaympäristön käyttöön liittyen:

- Sovellus on suunniteltava toimimaan myös hanskoilla käytettäessä. 
- Tehtävien hyväksyntäprosessi on oltava nopea ja helposti hallittava mobiililaitteella, koska opettajat arvioivat suorituksia suoraan taitopajassa.
- Osassa tehtävistä riittää pelkkä suorituksen kuittaus ja itsearviointi, kun taas toisissa vaaditaan useita välivaiheita ja opettajan arviota (esim. asteikko: Ei arviointia / Sujuu hyvin / Tarvitsee harjoitusta).
- Opiskelijoiden eteneminen kurssilla voidaan rajata siten, että seuraavat suoritukset avautuvat vasta kun edelliset on hyväksytty.
- Myöhässä oleville tehtäville lisätään symboli (esim. huutomerkki) selkeyttämään palautustilannetta.
- Järjestelmä tukee QR-koodilla tapahtuvaa kuittauskirjautumista tulevaisuudessa, mikä korvaa nykyisen "lätkä"-menettelyn.
- Opettajat voivat luoda ja kopioida korttipohjia (esim. H3-syksy ja kevät) ja lisätä niihin hammas- ja pintakohtaisia alasvetovalikoita.

### 7.2 Tulevaisuuden kehityskohteet:

- Mahdollisuus käyttää sovellusta myös selaimessa niille käyttäjille, jotka eivät halua asentaa mobiilisovellusta.
- Tuntiopettajien työaikakirjausten lisääminen osaksi järjestelmää.
- Järjestelmän laajennettavuus muihin yliopistoihin tai koulutusohjelmiin.

---

## 8 Laadunvarmistus
- Prototyypin testaus sprinttien lopussa.  
- Katselmointipalaverit viikoittain.  
- Hyväksymiskriteerit sovitaan asiakkaan kanssa.  

---

## 9 Liitteet
- [Sovelluksen wireframe](https://www.figma.com/design/kcA0t7G717CqYGmhIGFy5p/Monialaprojekti-WF?t=JuTxYux5t83AS9Hy-1) 

---

## 10 Lähteet
- Projektisuunnitelma 2025  
- [GDPR-asetus](https://eur-lex.europa.eu/FI/legal-content/summary/general-data-protection-regulation-gdpr.html)
- [Helsingin yliopiston tietoturvaohjeet](https://www.helsinki.fi/fi/tietotekniikkakeskus/tietoturva-yliopistolla/tietoturva-ja-tietosuoja/yliopiston-tietoturvapolitiikka)
