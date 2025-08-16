// Internationalization (i18n) system
class I18n {
    constructor() {
        this.currentLanguage = 'en';
        this.translations = {
            en: {
                'title': 'Speed Reader',
                'subtitle': 'Read faster by focusing on one word at a time',
                'paste-text': 'Paste your text here:',
                'text-placeholder': 'Paste or type your long-form content here...',
                'start-reading': 'Start Reading',
                'pause': 'Pause',
                'resume': 'Resume',
                'start-over': 'Start Over',
                'reset': 'Reset',
                'speed-wpm': 'Speed (WPM):',
                'wpm': 'WPM',
                'word': 'Word',
                'of': 'of',
                'search-books': '📚 Search Books from Internet Archive',
                'search-placeholder': 'Search for books (e.g., \'Alice in Wonderland\', \'Pride and Prejudice\')',
                'search': 'Search Books',
                'searching': 'Searching books...',
                'load-sample': 'Load Sample Text',
                'footer-tip': 'Speed reading technique: Focus on the center and let your peripheral vision catch each word',
                'click-start': 'Click "Start Reading" to begin',
                'ready-start': 'Ready to start',
                'finished': '✅ Finished!',
                'enter-text': 'Enter some text to begin',
                'enter-search': 'Please enter a search term',
                'no-books': 'No books found. Try a different search term.',
                'search-error': 'Error searching books. Please try again.',
                'load-error': 'Could not load this book',
                'no-text-version': 'No text version available for this book',
                'text-too-short': 'Text content is too short or corrupted',
                'fetch-failed': 'Failed to fetch book text',
                'loaded-success': 'Loaded!',
                'manual-download': 'Manual Download Required',
                'download-instructions': 'Due to browser security restrictions, automatic loading failed.',
                'download-steps': 'Please follow these steps:',
                'download-link': 'Download Text File',
                'network-error': 'Network error - try again or use manual download option above',
                'cors-error': 'Browser security restriction - use manual download option'
            },
            es: {
                'title': 'Lector Rápido',
                'subtitle': 'Lee más rápido enfocándote en una palabra a la vez',
                'paste-text': 'Pega tu texto aquí:',
                'text-placeholder': 'Pega o escribe tu contenido largo aquí...',
                'start-reading': 'Comenzar Lectura',
                'pause': 'Pausar',
                'resume': 'Reanudar',
                'start-over': 'Empezar de Nuevo',
                'reset': 'Reiniciar',
                'speed-wpm': 'Velocidad (PPM):',
                'wpm': 'PPM',
                'word': 'Palabra',
                'of': 'de',
                'search-books': '📚 Buscar Libros del Archivo de Internet',
                'search-placeholder': 'Buscar libros (ej., \'Alicia en el País de las Maravillas\', \'Orgullo y Prejuicio\')',
                'search': 'Buscar Libros',
                'searching': 'Buscando libros...',
                'load-sample': 'Cargar Texto de Ejemplo',
                'footer-tip': 'Técnica de lectura rápida: Enfócate en el centro y deja que tu visión periférica capture cada palabra',
                'click-start': 'Haz clic en "Comenzar Lectura" para empezar',
                'ready-start': 'Listo para comenzar',
                'finished': '✅ ¡Terminado!',
                'enter-text': 'Ingresa algún texto para comenzar',
                'enter-search': 'Por favor ingresa un término de búsqueda',
                'no-books': 'No se encontraron libros. Prueba con un término diferente.',
                'search-error': 'Error al buscar libros. Por favor intenta de nuevo.',
                'load-error': 'No se pudo cargar este libro',
                'no-text-version': 'No hay versión de texto disponible para este libro',
                'text-too-short': 'El contenido del texto es demasiado corto o está corrupto',
                'fetch-failed': 'Error al obtener el texto del libro',
                'loaded-success': '¡Cargado!',
                'manual-download': 'Descarga Manual Requerida',
                'download-instructions': 'Debido a restricciones de seguridad del navegador, la carga automática falló.',
                'download-steps': 'Por favor sigue estos pasos:',
                'download-link': 'Descargar Archivo de Texto',
                'network-error': 'Error de red - intenta de nuevo o usa la opción de descarga manual',
                'cors-error': 'Restricción de seguridad del navegador - usa la opción de descarga manual'
            },
            fr: {
                'title': 'Lecteur Rapide',
                'subtitle': 'Lisez plus vite en vous concentrant sur un mot à la fois',
                'paste-text': 'Collez votre texte ici :',
                'text-placeholder': 'Collez ou tapez votre contenu long ici...',
                'start-reading': 'Commencer la Lecture',
                'pause': 'Pause',
                'resume': 'Reprendre',
                'start-over': 'Recommencer',
                'reset': 'Réinitialiser',
                'speed-wpm': 'Vitesse (MPM) :',
                'wpm': 'MPM',
                'word': 'Mot',
                'of': 'de',
                'search-books': '📚 Rechercher des Livres dans les Archives Internet',
                'search-placeholder': 'Rechercher des livres (ex., \'Alice au Pays des Merveilles\', \'Orgueil et Préjugés\')',
                'search': 'Rechercher des Livres',
                'searching': 'Recherche de livres...',
                'load-sample': 'Charger un Texte d\'Exemple',
                'footer-tip': 'Technique de lecture rapide : Concentrez-vous sur le centre et laissez votre vision périphérique saisir chaque mot',
                'click-start': 'Cliquez sur "Commencer la Lecture" pour débuter',
                'ready-start': 'Prêt à commencer',
                'finished': '✅ Terminé !',
                'enter-text': 'Entrez du texte pour commencer',
                'enter-search': 'Veuillez entrer un terme de recherche',
                'no-books': 'Aucun livre trouvé. Essayez un terme différent.',
                'search-error': 'Erreur lors de la recherche de livres. Veuillez réessayer.',
                'load-error': 'Impossible de charger ce livre',
                'no-text-version': 'Aucune version texte disponible pour ce livre',
                'text-too-short': 'Le contenu du texte est trop court ou corrompu',
                'fetch-failed': 'Échec de la récupération du texte du livre',
                'loaded-success': 'Chargé !',
                'manual-download': 'Téléchargement Manuel Requis',
                'download-instructions': 'En raison des restrictions de sécurité du navigateur, le chargement automatique a échoué.',
                'download-steps': 'Veuillez suivre ces étapes :',
                'download-link': 'Télécharger le Fichier Texte',
                'network-error': 'Erreur réseau - réessayez ou utilisez l\'option de téléchargement manuel',
                'cors-error': 'Restriction de sécurité du navigateur - utilisez l\'option de téléchargement manuel'
            },
            de: {
                'title': 'Schnellleser',
                'subtitle': 'Lesen Sie schneller, indem Sie sich auf ein Wort nach dem anderen konzentrieren',
                'paste-text': 'Fügen Sie Ihren Text hier ein:',
                'text-placeholder': 'Fügen Sie Ihren langen Inhalt hier ein oder tippen Sie ihn...',
                'start-reading': 'Lesen Beginnen',
                'pause': 'Pausieren',
                'resume': 'Fortsetzen',
                'start-over': 'Von Vorne Beginnen',
                'reset': 'Zurücksetzen',
                'speed-wpm': 'Geschwindigkeit (WpM):',
                'wpm': 'WpM',
                'word': 'Wort',
                'of': 'von',
                'search-books': '📚 Bücher im Internet-Archiv Suchen',
                'search-placeholder': 'Nach Büchern suchen (z.B. \'Alice im Wunderland\', \'Stolz und Vorurteil\')',
                'search': 'Bücher Suchen',
                'searching': 'Bücher werden gesucht...',
                'load-sample': 'Beispieltext Laden',
                'footer-tip': 'Schnelllesetechnik: Konzentrieren Sie sich auf die Mitte und lassen Sie Ihr peripheres Sehen jedes Wort erfassen',
                'click-start': 'Klicken Sie auf "Lesen Beginnen" um zu starten',
                'ready-start': 'Bereit zum Starten',
                'finished': '✅ Fertig!',
                'enter-text': 'Geben Sie Text ein, um zu beginnen',
                'enter-search': 'Bitte geben Sie einen Suchbegriff ein',
                'no-books': 'Keine Bücher gefunden. Versuchen Sie einen anderen Suchbegriff.',
                'search-error': 'Fehler beim Suchen von Büchern. Bitte versuchen Sie es erneut.',
                'load-error': 'Dieses Buch konnte nicht geladen werden',
                'no-text-version': 'Keine Textversion für dieses Buch verfügbar',
                'text-too-short': 'Textinhalt ist zu kurz oder beschädigt',
                'fetch-failed': 'Fehler beim Abrufen des Buchtexts',
                'loaded-success': 'Geladen!',
                'manual-download': 'Manueller Download Erforderlich',
                'download-instructions': 'Aufgrund von Browser-Sicherheitsbeschränkungen ist das automatische Laden fehlgeschlagen.',
                'download-steps': 'Bitte befolgen Sie diese Schritte:',
                'download-link': 'Textdatei Herunterladen',
                'network-error': 'Netzwerkfehler - versuchen Sie es erneut oder nutzen Sie die manuelle Download-Option',
                'cors-error': 'Browser-Sicherheitsbeschränkung - nutzen Sie die manuelle Download-Option'
            },
            sv: {
                'title': 'Snabbläsare',
                'subtitle': 'Läs snabbare genom att fokusera på ett ord i taget',
                'paste-text': 'Klistra in din text här:',
                'text-placeholder': 'Klistra in eller skriv ditt långa innehåll här...',
                'start-reading': 'Börja Läsa',
                'pause': 'Pausa',
                'resume': 'Fortsätt',
                'start-over': 'Börja Om',
                'reset': 'Återställ',
                'speed-wpm': 'Hastighet (OPM):',
                'wpm': 'OPM',
                'word': 'Ord',
                'of': 'av',
                'search-books': '📚 Sök Böcker från Internetarkivet',
                'search-placeholder': 'Sök efter böcker (t.ex. \'Alice i Underlandet\', \'Stolthet och Fördom\')',
                'search': 'Sök Böcker',
                'searching': 'Söker böcker...',
                'load-sample': 'Ladda Exempeltext',
                'footer-tip': 'Snabbläsningsteknik: Fokusera på mitten och låt din perifera syn fånga varje ord',
                'click-start': 'Klicka på "Börja Läsa" för att börja',
                'ready-start': 'Redo att börja',
                'finished': '✅ Klar!',
                'enter-text': 'Ange text för att börja',
                'enter-search': 'Vänligen ange en sökterm',
                'no-books': 'Inga böcker hittades. Prova en annan sökterm.',
                'search-error': 'Fel vid sökning av böcker. Försök igen.',
                'load-error': 'Kunde inte ladda denna bok',
                'no-text-version': 'Ingen textversion tillgänglig för denna bok',
                'text-too-short': 'Textinnehållet är för kort eller skadat',
                'fetch-failed': 'Misslyckades med att hämta boktext',
                'loaded-success': 'Laddat!'
            }
        };
        
        this.init();
    }
    
    init() {
        // Load saved language preference
        const savedLanguage = localStorage.getItem('speedreader-language');
        if (savedLanguage && this.translations[savedLanguage]) {
            this.currentLanguage = savedLanguage;
        }
        
        // Set up language selector
        const languageSelect = document.getElementById('languageSelect');
        if (languageSelect) {
            languageSelect.value = this.currentLanguage;
            languageSelect.addEventListener('change', (e) => {
                this.changeLanguage(e.target.value);
            });
        }
        
        // Apply initial translation
        this.updatePage();
    }
    
    changeLanguage(language) {
        if (this.translations[language]) {
            this.currentLanguage = language;
            localStorage.setItem('speedreader-language', language);
            this.updatePage();
        }
    }
    
    translate(key) {
        return this.translations[this.currentLanguage]?.[key] || this.translations['en'][key] || key;
    }
    
    updatePage() {
        // Update all elements with data-i18n attribute
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            element.textContent = this.translate(key);
        });
        
        // Update placeholders
        document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
            const key = element.getAttribute('data-i18n-placeholder');
            element.placeholder = this.translate(key);
        });
        
        // Update document title
        document.title = this.translate('title') + ' - Read Faster and Better';
        
        // Trigger custom event for other components to update
        window.dispatchEvent(new CustomEvent('languageChanged', { 
            detail: { language: this.currentLanguage } 
        }));
    }
    
    // Get sample text in the current language
    getSampleText() {
        const sampleTexts = {
            en: `Speed reading is a collection of reading methods which attempt to increase rates of reading without greatly reducing comprehension or retention. Methods include chunking and eliminating subvocalization. The many available speed-reading training programs include books, videos, software, and seminars.

There is little scientific evidence regarding speed reading, and as a result its value is contested. Cognitive neuroscientist Stanislas Dehaene says that claims of reading speeds of above 500 words per minute "must be viewed with skepticism" and that above 300 wpm people must start to use things like skimming or scanning which do not qualify as reading.

The average adult reads prose text at 250 to 300 words per minute. While proofreaders tasked with detecting errors read more slowly at 200 wpm. Higher reading speeds are claimed through speed reading programs, some of which are listed here.

This speed reading application helps you practice the technique of presenting one word at a time in a fixed position, allowing your eyes to stay focused while your brain processes each word individually. This method can help reduce subvocalization and improve reading efficiency for certain types of content.`,
            
            es: `La lectura rápida es una colección de métodos de lectura que intentan aumentar la velocidad de lectura sin reducir considerablemente la comprensión o retención. Los métodos incluyen la agrupación y la eliminación de la subvocalización. Los muchos programas de entrenamiento disponibles incluyen libros, videos, software y seminarios.

Hay poca evidencia científica sobre la lectura rápida, y como resultado su valor es controvertido. El neurocientífico cognitivo Stanislas Dehaene dice que las afirmaciones de velocidades de lectura superiores a 500 palabras por minuto "deben verse con escepticismo" y que por encima de 300 ppm las personas deben comenzar a usar cosas como el escaneo que no califican como lectura.

El adulto promedio lee texto en prosa de 250 a 300 palabras por minuto. Mientras que los correctores encargados de detectar errores leen más lentamente a 200 ppm. Se afirman velocidades de lectura más altas a través de programas de lectura rápida.

Esta aplicación de lectura rápida te ayuda a practicar la técnica de presentar una palabra a la vez en una posición fija, permitiendo que tus ojos se mantengan enfocados mientras tu cerebro procesa cada palabra individualmente.`,
            
            fr: `La lecture rapide est un ensemble de méthodes de lecture qui tentent d'augmenter les taux de lecture sans réduire considérablement la compréhension ou la rétention. Les méthodes incluent le regroupement et l'élimination de la sous-vocalisation. Les nombreux programmes d'entraînement disponibles incluent des livres, des vidéos, des logiciels et des séminaires.

Il y a peu de preuves scientifiques concernant la lecture rapide, et par conséquent sa valeur est contestée. Le neuroscientifique cognitif Stanislas Dehaene dit que les affirmations de vitesses de lecture supérieures à 500 mots par minute "doivent être vues avec scepticisme" et qu'au-dessus de 300 mpm les gens doivent commencer à utiliser des choses comme le balayage qui ne qualifient pas comme lecture.

L'adulte moyen lit un texte en prose à 250 à 300 mots par minute. Tandis que les correcteurs chargés de détecter les erreurs lisent plus lentement à 200 mpm. Des vitesses de lecture plus élevées sont revendiquées grâce aux programmes de lecture rapide.

Cette application de lecture rapide vous aide à pratiquer la technique de présenter un mot à la fois dans une position fixe, permettant à vos yeux de rester concentrés pendant que votre cerveau traite chaque mot individuellement.`,
            
            de: `Schnelllesen ist eine Sammlung von Lesemethoden, die versuchen, die Lesegeschwindigkeit zu erhöhen, ohne das Verständnis oder die Behaltensleistung stark zu reduzieren. Zu den Methoden gehören Chunking und die Eliminierung der Subvokalisation. Die vielen verfügbaren Schnelllesetrainingsprogramme umfassen Bücher, Videos, Software und Seminare.

Es gibt wenig wissenschaftliche Belege für das Schnelllesen, und daher ist sein Wert umstritten. Der kognitive Neurowissenschaftler Stanislas Dehaene sagt, dass Behauptungen von Lesegeschwindigkeiten über 500 Wörter pro Minute "mit Skepsis betrachtet werden müssen" und dass Menschen über 300 wpm anfangen müssen, Dinge wie Überfliegen zu verwenden, die nicht als Lesen qualifiziert werden.

Der durchschnittliche Erwachsene liest Prosatext mit 250 bis 300 Wörtern pro Minute. Während Korrektoren, die mit der Fehlererkennung beauftragt sind, langsamer mit 200 wpm lesen. Höhere Lesegeschwindigkeiten werden durch Schnellleseprogramme behauptet.

Diese Schnelllese-Anwendung hilft Ihnen, die Technik zu üben, ein Wort nach dem anderen in einer festen Position zu präsentieren, wodurch Ihre Augen fokussiert bleiben können, während Ihr Gehirn jedes Wort einzeln verarbeitet.`,
            
            sv: `Snabbläsning är en samling läsmetoder som försöker öka läshastigheten utan att avsevärt minska förståelsen eller minnesfunktionen. Metoder inkluderar chunking och eliminering av subvokalisering. De många tillgängliga snabbläsningsprogrammen inkluderar böcker, videor, programvara och seminarier.

Det finns lite vetenskapliga bevis angående snabbläsning, och som ett resultat är dess värde omtvistat. Kognitiv neurovetenskapsman Stanislas Dehaene säger att påståenden om läshastigheter över 500 ord per minut "måste betraktas med skepsis" och att över 300 opm måste folk börja använda saker som skumläsning som inte kvalificerar som läsning.

Den genomsnittliga vuxna läser prosatext med 250 till 300 ord per minut. Medan korrekturläsare som har till uppgift att upptäcka fel läser långsammare med 200 opm. Högre läshastigheter påstås genom snabbläsningsprogram.

Denna snabbläsningsapplikation hjälper dig att öva tekniken att presentera ett ord i taget i en fast position, vilket gör att dina ögon kan förbli fokuserade medan din hjärna bearbetar varje ord individuellt.`
        };
        
        return sampleTexts[this.currentLanguage] || sampleTexts['en'];
    }
}

// Initialize i18n when DOM is loaded
let i18n;
document.addEventListener('DOMContentLoaded', () => {
    i18n = new I18n();
});
