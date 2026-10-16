# Piano: nuova home LonghiDev, header e hero con bozza contatti

## Obiettivo e confini

La home diventa una pagina di studio concentrata su **header + hero**. Si eliminano showcase a schede, sezione approccio e relative animazioni. Su richiesta successiva dell'utente, sotto la hero si abbozza un modulo contatti a cui punta **cominciamo**. Resta una riga legale minimale con `P. IVA 02644100063` per conservare l'informazione già richiesta. Nessun'altra sezione commerciale viene costruita in questo passaggio.

Il riferimento [UMANO Design Studio](https://umanodesign.studio/) suggerisce tre mosse: navigazione chiara a pillola sospesa, messaggio centrale con un termine che cambia, dispositivo protagonista sotto il testo. Sono principi di composizione e movimento: contenuti, colori, logo e interfacce restano originali LonghiDev.

## Decisioni di design

1. **Colore:** fondo hero chiaro `#F7F7F4`, superfici bianche e dettagli `#F2E9EA`; testo scuro `#242424`. Il bordeaux del logo `#6B0911` resta su CTA e accenti, senza occupare l'intero sfondo. Usare la palette fissata in `DESIGN-STYLE.md`.
2. **Header:** pillola bianca, centrata, con logo definitivo a sinistra, link **lavoro** e CTA **cominciamo**. Il link lavoro porta al laptop (`#lavoro`) e mette a fuoco la dimostrazione. Cominciamo porta al modulo `#contatto` sotto la hero.
3. **Messaggio:** titolo breve che dica chiaramente che LonghiDev sviluppa software. Una riga cambia tra **gestionali**, **ecommerce** e **siti web**. Evitare effetto macchina da scrivere: cambio rapido con movimento minimo, dimensione stabile e nessun salto del layout. Per i lettori di schermo offrire una frase statica completa.
4. **Dispositivi:** su desktop una cornice di computer riconoscibile ma sottile, con schermo 16:10; su mobile una cornice di telefono verticale. Dentro, tre layout HTML adattati a ciascun formato: gestionale con navigazione e ordini; ecommerce con prodotto, immagine, prezzo e azione; sito vetrina per una mostra d'arte con opera, date e invito alla visita. Dati e nomi sono etichettati come concept. Nessuna finestra fatta di barre decorative generiche.
5. **Movimento:** dopo l'ingresso della hero, il contenuto dello schermo cambia con una transizione morbida tra i tre progetti, poi continua a ritmo lento. I controlli visibili permettono di scegliere subito un progetto. Il controllo manuale prevale e interrompe il cambio automatico. Quando la tab non è visibile o la hero è fuori vista, l'animazione si ferma. Con movimento ridotto il primo frame e i controlli funzionano senza autoplay.
6. **Contatti:** modulo breve con nome, email e descrizione del progetto, etichette visibili, validazione nativa e feedback chiaro. È una bozza locale: finché non esiste un recapito o backend confermato, il submit non invia né conserva dati e lo comunica prima e dopo l'interazione.

## Comportamento mobile e touch

- A 320-430 px la pillola resta su una riga: logo, lavoro e cominciamo hanno spazio e aree di tocco di almeno 44 px. Se serve, si riduce il testo o la spaziatura, senza una navigazione che scorra orizzontalmente.
- Titolo e descrizione sono leggibili prima del telefono; la CTA resta nell'header. La hero ha altezza naturale così telefono e controlli rimangono raggiungibili anche con le barre mobili di Safari.
- Su mobile appare un telefono, non un laptop ridotto. Le tre interfacce diventano vere versioni mobili con navigazione, contenuti e azioni principali leggibili; nessun pulsante viene tagliato a 320 px.
- Tap sui tre controlli, swipe orizzontale sullo schermo e frecce da tastiera selezionano le stesse tre viste. Uno swipe verticale deve continuare a scorrere la pagina. Niente gesto obbligatorio: ogni vista è raggiungibile con un tap.
- Durante un tocco o dopo una scelta manuale non deve partire un cambio automatico che sottragga la vista. Nessun overflow orizzontale della pagina.
- Il modulo si legge e si compila senza zoom forzato, campi tagliati o tastiera che nasconde il pulsante; gli input usano dimensione minima 16 px.

## Architettura minima

- `src/pages/index.astro`: markup semantico di header, hero, mockup desktop/mobile, modulo contatti essenziale e riga legale.
- `src/styles/global.css`: riscrivere con token, layout e responsive necessari a queste due aree; eliminare le vecchie regole inutilizzate.
- `src/scripts/portfolio.ts`: sostituire la logica del vecchio showcase con un piccolo controller delle tre viste, del testo dinamico e del feedback del modulo; rimuovere GSAP/ScrollTrigger se non servono.
- `public/images/`: usare il logo esistente e un'immagine reale o generata per il prodotto e l'opera d'arte; asset locali ottimizzati. Eliminare solo asset resi inutilizzati da questo reset.
- `tests/site.test.mjs`: aggiornare i controlli alle nuove due aree e agli stati di navigazione, senza mantenere asserzioni sulle sezioni eliminate.
- `DESIGN-STYLE.md`, `README.md`: allineare la descrizione alla nuova home. Le informazioni inventate restano dichiarate come demo.

## Esecuzione affidata a due agenti Luna 6

**Agente 1, costruzione.** Implementa pagina, CSS, motion, asset e bozza del modulo. Controlla build e funzionamento di base. Non modifica i test automatizzati. Consegna una nota sui controlli, sulle classi principali e sui punti da osservare su mobile.

**Agente 2, verifica indipendente.** Prepara la matrice di verifica mentre il primo agente costruisce. Quando riceve il via, aggiorna i test automatizzati e prova la pagina nel browser a 320, 390, 430, 768, 1024 e 1440 px. Esegue test di tap, swipe in entrambe le direzioni, scroll verticale, scelta manuale, tastiera, movimento ridotto e pause dell'autoplay. Verifica anche collegamento cominciamo-modulo, etichette, validazione, feedback e usabilità della tastiera mobile. Segnala difetti concreti con viewport e passaggi per riprodurli; corregge soltanto i test e piccoli difetti concordati, senza riscrivere il design in parallelo.

## Criteri di completamento

- La pagina mostra header, hero, bozza contatti richiesta in seguito e riga legale.
- Header con logo, lavoro e cominciamo; il secondo link arriva al modulo, senza destinazioni inventate.
- Il testo dinamico descrive i tre servizi, mantenendo la frase accessibile anche senza animazione.
- Le tre viste nel computer e nel telefono sono immediatamente riconoscibili come gestionale, ecommerce e mostra d'arte; il selettore indica sempre la vista attiva.
- Autoplay, tap, swipe e tastiera non si contraddicono; il tocco non blocca lo scroll verticale.
- Il modulo valida i campi e dichiara esplicitamente che la demo non spedisce né salva il contenuto.
- Nessun taglio o scorrimento orizzontale della pagina alle larghezze previste; contrasto e focus visibile sono adeguati.
- `astro check`, build e test aggiornati passano. La verifica visuale avviene sia su desktop sia su telefono simulato.
