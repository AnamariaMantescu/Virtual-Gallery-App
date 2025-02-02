  Virtual Gallery este o aplicație web single-page (SPA) construită cu Vue 3, Vuex, Firebase și Express, având scopul de a oferi utilizatorilor
o experiență interactivă pentru explorarea și gestionarea operelor de artă și a colecțiilor asociate.

  Funcționalități principale
* Autentificare și autorizare - Utilizatorii pot crea conturi și se pot autentifica folosind Firebase Authentication.
* Gestionarea operelor de artă - Adăugare, editare, ștergere și afișare a operelor de artă.
* Gestionarea colecțiilor: Creare, modificare, ștergere și listare a colecțiilor de artă.
* Filtrare și căutare pentru facilitare: Utilizatorii pot căuta opere de artă după titlu, artist, stil, an, mediu și dimensiune.
* Interfață responsive: Design adaptabil pentru diferite dispozitive.

  Manual de utilizare:  Aplicația accepta 3 roluri:
1. vizitator
2. utilizator
3. administrator
        1. Vizitatorul poate fi oricine. Acesta poate vedea toate operele de artă și colecțiile existente pe site, poate căuta
   și aplica filtre și poate vedea detalii despre acestea. De asemenea, el își poate crea un cont. 
        2. Utilizatorul este rolul pe care un vizitator îl dobândește odată cu crearea unui cont. Astfel, acesta păstrează
   toate beneficiile de care un vizitator dispune, alături de posibilitatea de a propune operă de artă pentru o anumită colecție.
   În acest sens, el completeaza un formular cu detalii referitoare la opera sa de artă pe care le trimite către o anumită colecție selectată.
   Această colecție poate să existe sau poate fi o colecție viitoare (coming soon collection). Ulterior, așteaptă ca opera sa să fie aprobată. 
        3. Administratorul deține cel mai complex rol din cadrul platformei. Acesta are, în primă instanță, capacitatea de a accepta
   și de a refuza propunerile existente. El vede totalitatea operelor existente, propuse și deja expuse, putând să decidă ce apare
   și ce nu pe ecranul celorlalți. Pentru asta, odată deschisă o operă marcată drept neaprobată, el o poate corecta (greșeli in principiu)
   în titlu, descriere, chiar și colecție, urmând apoi să aprobe sau nu opera de artă. De asemenea, el poate edita sau șterge ceva deja publicat.
   Mai poate adăuga, la rândul său, opere de artă, folosindu-se de același formular care, de data aceasta, trimite operele aprobate automat.
   Administratorul este responsabil și de crearea colecțiilor. El poate crea colecții goale (coming soon collections) sau colecții care conțin opere
   deja existente, dar le și poate edita sau șterge definitiv. 
