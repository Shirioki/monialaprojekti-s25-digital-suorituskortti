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

 Tänne lissää 

---

## 3 Toiminnalliset vaatimukset

Esimerkkejä, täydennettävä:

- **REQ-1:** Opiskelija voi luoda profiilin sähköpostilla.  
- **REQ-2:** Opiskelija voi liittyä kurssille opettajan antamalla kurssikoodilla.  

Tämä voisi olla sitä **Iineksen** hommaa



---

## 4 Ei-toiminnalliset vaatimukset

Nää vois olla **Phonkin ja Tiituksen** hommia

- **Suorituskyky:** järjestelmän on päivitettävä opiskelijan ja opettajan näkymät reaaliajassa  
- **Käytettävyys:** sovelluksen käyttöliittymän tulee olla selkeä ja saavutettava  
- **Integraatiovalmius:** suoritustietojen raportointi on oltava vietävissä Sisu-järjestelmään

- - **Tietoturva:** roolipohjainen käyttöoikeus, autentikointi Firebase-tunnuksilla  ---- Tää olis sitä **Liisan** tonttia
  -  Roolipohjainen käyttöoikeus varmistaa, että eri käyttäjäryhmät, opiskelijat, opettajat ja hallinto näkevät ja käsittelevät vain heille kuuluvia tietoja. Firebase-autentikointi tarjoaa turvallisen kirjautumisprosessin, joka tukee käyttäjien yksilöintiä ja tietojen suojaamista. Lisäksi järjestelmä tukee auditointia ja lokitietojen hallintaa, mikä mahdollistaa toiminnan jäljitettävyyden ja tietosuojaloukkausten hallinnan.
Tavoitteena on kehittää helppokäyttöinen, skaalautuva ja tietoturvallinen järjestelmä, joka tukee opiskelijoiden oppimista ja opettajien ohjaustyötä nykyaikaisessa, digitaalisessa ympäristössä.


---

## 5 Käyttötapaukset

**Tänne voitas porukalla keksiä näitä ja sit tehdä se UML Kaavio**  

### UC-1: Opiskelijan liittyminen kurssille
- **Osallistujat:** Opiskelija, Opettaja, Järjestelmä  
- **Esiehdot:** Opiskelijalla on luotu profiili  
- **Tapahtumat:**  
  1. Opiskelija syöttää kurssikoodin  
  2. Järjestelmä lisää opiskelijan kurssille  
  3. Opettaja näkee opiskelijan kurssilistauksessaan  
- **Poikkeukset:** Virheellinen kurssikoodi → virheilmoitus  

### UC-2: Tehtävän hyväksyminen
*(täydennettävä projektin edetessä)*  

---

## 6 Liittymät muihin järjestelmiin

**Tiitus, Phonki, Liisa** 

- Integraatio Helsingin yliopiston **Sisu-järjestelmään** (raportoinnin kautta).  
- Firebase-autentikointi ja tietokanta.
- Firebase-autentikointi on Googlen tarjoama palvelu, joka mahdollistaa turvallisen ja skaalautuvan käyttäjien tunnistamisen mobiili- ja verkkosovelluksissa. Se on erityisen hyödyllinen projekteissa, joissa tarvitaan nopea ja luotettava kirjautumisratkaisu ilman raskasta taustajärjestelmän rakentamista.
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
