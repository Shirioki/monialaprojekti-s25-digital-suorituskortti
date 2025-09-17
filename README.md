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
- **Dropdown menu**: ... 
- **Sisu**: Helsingin yliopiston opintotietojärjestelmä.  

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
