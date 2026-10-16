# LonghiDev: direzione visiva proposta

Questa guida definisce la prossima identità del sito. La pagina Astro attuale è una demo precedente e non rappresenta ancora questa direzione. Il pubblico sono imprese, professionisti e startup che valutano gestionali, ecommerce e siti web su misura.

## Idea guida

**Software chiaro, fatto da una persona.** Il sito deve comunicare competenza tecnica con la semplicità di un prodotto ben progettato. Linguaggio visivo luminoso, preciso e cordiale; dettagli giocosi solo quando aiutano a capire un servizio o un'interazione.

- Lettura del brief: portfolio commerciale, con il ritmo arioso di [Wispr Flow](https://wisprflow.ai/) e la chiarezza modulare di [Phosphor Icons](https://phosphoricons.com/).
- Intensità: variazione **6/10**, movimento **5/10**, densità **3/10**.
- Tema: chiaro e coerente dall'inizio alla fine. I blocchi possono cambiare tinta all'interno della stessa famiglia di colori.
- Il logo definitivo è l'autorità cromatica: il segno bordeaux `#6B0911`, la scritta grigia `#545454` e il bianco.

## Cosa prendiamo dai riferimenti

| Riferimento | Principio da applicare | Traduzione LonghiDev |
| --- | --- | --- |
| [Wispr Flow](https://wisprflow.ai/) | Messaggio breve, grandi spazi, dimostrazione visiva del prodotto, movimento legato a una trasformazione | Ogni servizio mostra il passaggio da un problema reale a un risultato comprensibile, con una sola sequenza forte nella hero |
| [Phosphor Icons](https://phosphoricons.com/) | Geometria morbida, icone leggere e coerenti, controlli leggibili, tono accessibile | Icone Phosphor `regular` per interfaccia e diagrammi; poche forme grandi, mai un mosaico di simboli decorativi |

La combinazione non riproduce il lilla di Wispr né il verde di Phosphor. Il bordeaux del logo resta l'accento per azioni e dettagli selezionati. La home usa il canvas `#F7F7F4`, una fascia di supporto `#F2E9EA` e superfici chiare per le interfacce dimostrative.

## Palette

| Token | Colore | Uso |
| --- | --- | --- |
| `brand` | `#6B0911` | CTA primaria, link attivi, piccoli punti di enfasi, tratto della motion |
| `logo-gray` | `#545454` | Parte grigia del logo, testo secondario, icone |
| `ink` | `#242424` | Titoli e testo più importante |
| `canvas` | `#F7F7F4` | Sfondo principale, neutro chiaro senza tonalità gialla |
| `surface` | `#FFFFFF` | Superfici interattive e anteprime reali |
| `brand-tint` | `#F2E9EA` | Una sezione di enfasi, stati selezionati e fondi di illustrazioni |
| `line` | `#D8D6D2` | Bordi sottili e separatori funzionali |

Rapporti di contrasto calcolati: `brand` su `canvas` **11,7:1**, `logo-gray` su `canvas` **7,1:1**, bianco su `brand` **12,6:1**. Il bordeaux su `brand-tint` è **10,5:1**. Testo ordinario e CTA restano leggibili anche su mobile.

**Regola d'uso:** il canvas occupa la maggior parte della pagina. Il bordeaux attira l'attenzione su un'azione o una parte del racconto. `brand-tint` è una pausa, non lo sfondo di ogni card. Niente arancione, blu o altri accenti nelle sezioni LonghiDev. Le anteprime di prodotti clienti possono mantenere la propria identità, separate con chiarezza dal sito.

## Tipografia

- **Una famiglia:** Outfit Variable ospitato localmente. Le forme geometriche e morbide danno al sito un tono giocoso e moderno, mantenendo chiari i testi delle interfacce.
- **Titoli:** Outfit con pesi 600-700, interlinea 1,05-1,12 e spaziatura lettere da `-0.02em` a `-0.03em`. Hero 56-80 px desktop e 40-56 px mobile, sempre con massimo due righe leggibili.
- **Testo:** 16-18 px, interlinea 1,55-1,65, larghezza 65-72 caratteri. Testi secondari in `logo-gray`, senza abbassare l'opacità.
- **Microtesto:** 12-14 px, mai usato per informazioni necessarie a decidere o contattare.
- **Voce:** diretta, concreta, in italiano. Nominare ciò che il software fa, come migliora un lavoro e quale passo propone al visitatore. Niente numeri o clienti inventati.

La prossima versione abbandona Anton, l'ASCII e l'enfasi serif della demo attuale: avevano una personalità troppo aggressiva rispetto ai due riferimenti.

## Forme e componenti

- **Contenitori:** raggio 14 px, bordo sottile o ombra morbida, mai entrambi senza motivo. Le sezioni principali non hanno bisogno di essere tutte card.
- **Pulsanti:** pillola compatta, etichetta in una riga. Primario bordeaux con testo bianco; secondario chiaro con bordo grigio. La stessa azione usa la stessa etichetta in tutta la pagina.
- **Icone:** unicamente Phosphor, peso `regular`, dimensione base 24 px. Scegliere icone per azioni e categorie; non usarle come riempitivo accanto a ogni titolo.
- **Navigazione:** pillola chiara sticky e compatta, logo a sinistra, `Lavoro` centrato e `cominciamo` a destra. Aree touch di almeno 44 px.
- **Anteprime:** screenshot o mini prodotti realmente funzionanti e riconoscibili come gestionale, ecommerce o sito web. Ogni concept inventato è dichiarato come esempio. Niente finte finestre piene di rettangoli generici.
- **Focus e stati:** contorno bordeaux da 2-3 px; hover, pressione, errore e successo hanno segnali visivi e testuali coerenti.

## Griglia e ritmo

- Contenuto massimo 1280 px, margini fluidi di 20-24 px su telefono e 40-72 px su desktop.
- Home con header, hero, form demo locale e riga legale. La hero ha titolo statico centrato, servizio variabile nel sottotitolo e laptop su desktop; sotto 640 px il dispositivo diventa un telefono con interfacce verticali e scorrimento interno.
- Più spazio tra sezioni che dentro una sezione. Alternare una dimostrazione ampia, contenuto editoriale semplice e prove concrete del processo; evitare file di tre card identiche.
- Su mobile: una colonna, testo e CTA prima della visualizzazione, anteprime alla larghezza disponibile. Nessuna navigazione nascosta dentro uno scroll orizzontale.

## Movimento

La hero alterna tre concept nel laptop desktop o nel telefono mobile: gestionale, ecommerce e sito per una mostra d'arte. Il cambio automatico è lento e si ferma dopo una scelta manuale; controlli, frecce e swipe consentono la selezione diretta. Il movimento resta breve e con `prefers-reduced-motion` l'autoplay è disattivato. Tutti i concept sono dichiarati come demo.

Con `prefers-reduced-motion: reduce`, il frame finale è subito visibile. Su mobile la demo usa forme e testi più grandi, senza dipendere dal passaggio del mouse; animazione e media non devono ritardare la CTA o causare scatti durante lo scroll.

## Criterio per il prossimo redesign

Una persona che apre il sito per pochi secondi deve capire **chi crea il software, quali tre servizi offre e come avviare una conversazione**. La pagina deve sembrare un prodotto digitale curato, con una firma bordeaux riconoscibile e una leggerezza che resti credibile anche per un gestionale aziendale.

Questa guida è una proposta di stile da applicare nel prossimo passaggio. Prima di modificare la pagina, il primo viewport andrà composto su questa base e valutato a 390 px e 1440 px.
