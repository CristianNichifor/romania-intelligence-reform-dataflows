# 16 · Restricțiile post-mandat — perioada de așteptare după încetarea serviciului

> DEMO // NECLASIFICAT — DATE SIMULATE — FĂRĂ SISTEME REALE

## Scop

Împiedică transformarea secretelor de stat, a rețelelor personale și a cunoștințelor despre achiziții
în profit privat și blochează „ușile turnante” către angajatori străini sau ostili.

## Perioade de așteptare pe niveluri

| Nivel | Funcții | Perioada de așteptare |
| --- | --- | --- |
| T1 | Directori, directori adjuncți, șefii contrainformațiilor/SIGINT | 24 de luni |
| T2 | Șefi de departament, analiști seniori, responsabili cu achizițiile | 12 luni |
| T3 | Personal operațional cu acces la surse/metode clasificate | 6 luni |

## Destinații interzise

- Angajarea la un serviciu de informații sau de securitate străin: **interdicție pe viață, fără excepții**
- Lobby sau consultanță pentru guverne străine ori companii de stat străine: interdicție pe viață pentru T1;
  24 de luni pentru T2/T3
- Companii în ale căror decizii de achiziție sau licențiere a participat funcționarul: 24 de luni de la
  ultima astfel de decizie
- Roluri care presupun folosirea unor cunoștințe încă clasificate (de exemplu, instruirea analiștilor
  unui concurent privind sursele și metodele): interzise cât timp cunoștințele rămân clasificate

## Procedura de aprobare a excepțiilor

- Cerere scrisă depusă cu cel puțin 30 de zile înainte de începerea noului loc de muncă
- Excepțiile pentru T1 necesită recomandarea IG și aprobarea JPC; pentru T2/T3 decide doar IG
- Toate excepțiile se publică, motivat, într-un registru public

## Mecanisme de aplicare

- Declarație înainte de plecare, depusă cu cel puțin 30 de zile înainte de ieșirea din serviciu
  (`schemas/post-employment-notification.schema.json`)
- Baza de date a IG privind angajările: fiecare funcționar care pleacă este înregistrat pe toată durata
  perioadei de așteptare
- Verificarea încrucișată cu evidențele achizițiilor, pentru a detecta foști funcționari care consiliază
  ofertanții câștigători
- Evidențele de pensii și salarii sunt verificate pe durata perioadei de așteptare

## Consecințele încălcării

- Reducerea sau suspendarea pensiei pe durata încălcării
- Recuperarea remunerației primite de la angajatorul interzis
- Sesizare penală pentru declarație falsă
- Angajatorul interzis poate fi exclus de la contracte publice pentru până la 5 ani

## Raportare publică anuală

IG publică un raport anual agregat (`schemas/cooling-off-compliance-report.schema.json`) privind
plecările, destinațiile, excepțiile, investigațiile și sancțiunile. Raportul este prezentat JPC și
publicat. Fluxul de aplicare este prezentat în `diagrams/cooling-off-enforcement.mmd`.

## Repere comparative

- **U.S. DOJ — cazul de încălcare post-mandat de la ODNI (Deirdre Walsh, 2026):** un funcționar de rang
  înalt al ODNI s-a mutat la o companie legată de un guvern străin fără evaluarea post-mandat obligatorie.
  Arată că declarațiile fără aplicare sunt inerte — acțiunea de aplicare însăși este cea care descurajează.
- **Rep. Jackson — amendamentele la Intelligence Authorization Act pentru FY2027 (2026):** extinderea
  prin lege a perioadei de așteptare la categorii suplimentare și amenzi civile, cu dreptul IG de a
  recupera sumele. Arată că regimurile post-mandat trebuie înăsprite prin lege pe măsură ce apar
  tipare de eludare.
