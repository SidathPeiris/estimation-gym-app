// Historical Dates: the question bank.
//
// The third game, and the first that does not score on log distance. A date is
// a point on the calendar, not a magnitude, so Model.scoreDate measures the
// miss in years - or in days, on a question whose sources pin it to the day -
// and Model.PRECISIONS decides how much of a miss each question can forgive.
//
// --- the selection rule, which is the whole game ---------------------------
//
// The game is triangulation, not recall.
//
// A date everybody already knows is a free hundred points and teaches nothing:
// the Moon landing, the turn of the millennium, the September 11 attacks. A
// date nobody can reason towards is a coin flip, which teaches nothing either.
// What belongs here is the middle - a date you can get within a decade of by
// knowing what else was happening, and cannot get within two years of by luck.
//
// The test is whether there is a bracket. The telephone was 1876 and powered
// flight was 1903, so anything electrical and domestic sits between them.
// Anything Roman and imperial sits between Augustus and Constantine. Anything
// with a photograph of it is after 1826. A question that cannot be bracketed
// by something a reasonable person knows does not belong in this bank, however
// interesting the answer is.
//
// --- precision is a claim about the SOURCE, not about the era --------------
//
// Each question declares how precisely its answer is actually known, and the
// bands follow from that. Claiming more precision than the sources support
// would mark a correct answer wrong.
//
//   day      A documented calendar date. Bullseye is three days.
//   year     A documented year. Bullseye is two.
//   decade   Sources agree within about a decade: a reign, a war's beginning,
//            a technology that arrived over several years rather than on a
//            date. Bullseye is ten years.
//   century  Archaeological or traditional dating, uncertain by a century.
//            Bullseye is fifty years, and the widest band is a millennium -
//            which sounds absurd until you try to place the Great Pyramid.
//
// Nothing dated "c." in its sources is asked to the year. If a date is a
// scholarly convention rather than a record - the founding of Rome, the birth
// of a classical author - it is asked at the precision the convention itself
// has, which is usually decade or century.
//
// --- the calendar problem --------------------------------------------------
//
// A calendar date before the Gregorian reform is not one thing. Catholic
// Europe changed in 1582, Britain and its colonies in 1752, Russia in 1918, so
// the same event can be dated eleven or thirteen days apart depending on who
// wrote it down - four times the Bullseye band.
//
// So day precision has a floor of 1753, enforced by the bank's test. The half
// a test cannot enforce is the author's: an event whose own sources are Julian
// is asked to the year however modern it looks, which is why the Russian
// Revolution is here as a year and not as a date.
//
// --- no asOf ---------------------------------------------------------------
//
// World Records requires it, because a record stops being true the day it is
// broken. A historical date does not stop being true at all. A question here
// that wanted an asOf would be a question about the present in the wrong
// game's clothes, so the field is rejected outright rather than left optional.
//
// --- sourcing --------------------------------------------------------------
//
// Every answer is sourced to a body that has reason to know: a national
// archive, a museum, a scientific publication, the organisation the event
// happened to. Where the date is a scholarly estimate rather than a record,
// the source says so and the precision is widened to match.
//
// --- the schedule is append-only once live --------------------------------
//
// The array order is the calendar: day N serves the entry at N minus the
// schedule origin. Inserting or removing anything inside the scheduled span
// re-dates every question after it, which has changed a puzzle mid-day before.
// New questions go at the end. Fixing a wrong answer, a hint or a source in
// place is fine and always will be - only reordering is blocked.
//
// The order is deliberately not chronological. Fifteen questions about
// antiquity in a row would be fifteen days of the same game.
//
// --- nothing above this line may contain a square bracket -----------------
//
// The service worker has no payload to read, so it builds the daily reminder
// by slicing this file from its first opening square bracket to its last
// closing one and parsing the result as JSON. One anywhere in the header -
// including in a comment explaining the rule, which is how this was found -
// moves the start of that slice and the parse fails, dropping this game out of
// the notification with no error anywhere. The bank's test checks for it.

var DATES = [
  {
    "id": "dates-berlin-wall-falls",
    "prompt": "On what date did the Berlin Wall open, with East Germany announcing free passage to the West?",
    "precision": "day",
    "answerDate": "1989-11-09",
    "decompositionHint": "It was late in the year, weeks before Christmas and after a long autumn of protests in Leipzig. The Soviet Union still existed and had two years left.",
    "source": "Bundesstiftung Aufarbeitung der SED-Diktatur"
  },
  {
    "id": "dates-great-pyramid-completed",
    "prompt": "Around what year was the Great Pyramid of Giza completed?",
    "precision": "century",
    "answerYear": -2560,
    "decompositionHint": "It is older than almost everything else people call ancient. Rome is a thousand years off, and the pyramid was already two thousand years old when Cleopatra was born.",
    "source": "Egyptian Ministry of Tourism and Antiquities; Lehner, The Complete Pyramids"
  },
  {
    "id": "dates-wright-first-flight",
    "prompt": "On what date did the Wright brothers make the first sustained powered flight at Kitty Hawk?",
    "precision": "day",
    "answerDate": "1903-12-17",
    "decompositionHint": "Cars and telephones already existed; radio was a laboratory curiosity. It was cold enough on the North Carolina coast for the wind they needed, which puts it late in the year.",
    "source": "Smithsonian National Air and Space Museum"
  },
  {
    "id": "dates-hastings",
    "prompt": "In what year did the Norman conquest of England begin with the battle near Hastings?",
    "precision": "year",
    "answerYear": 1066,
    "decompositionHint": "It is the date English schooling is built around, and it sits neatly just after the turn of a millennium.",
    "source": "The National Archives (UK)"
  },
  {
    "id": "dates-lehman-collapse",
    "prompt": "On what date did Lehman Brothers file for bankruptcy?",
    "precision": "day",
    "answerDate": "2008-09-15",
    "decompositionHint": "It was during the American presidential campaign and before the election, which fixes the autumn. Bear Stearns had already gone in the spring.",
    "source": "United States Bankruptcy Court, Southern District of New York"
  },
  {
    "id": "dates-vesuvius-pompeii",
    "prompt": "In what year did the eruption of Vesuvius bury Pompeii and Herculaneum?",
    "precision": "year",
    "answerYear": 79,
    "decompositionHint": "The Colosseum was still being built and Titus had just become emperor, so it is within a lifetime of the start of the imperial era rather than its end.",
    "source": "Parco Archeologico di Pompei"
  },
  {
    "id": "dates-magna-carta",
    "prompt": "In what year was Magna Carta sealed at Runnymede?",
    "precision": "year",
    "answerYear": 1215,
    "decompositionHint": "Roughly a century and a half after the Norman conquest, and a generation before the first English parliament. The crusades were still going on.",
    "source": "The British Library"
  },
  {
    "id": "dates-sputnik",
    "prompt": "On what date was Sputnik 1 launched?",
    "precision": "day",
    "answerDate": "1957-10-04",
    "decompositionHint": "It is twelve years after the end of the Second World War and twelve years before the Moon landing, almost exactly halfway. Autumn, and it beat the American attempt by months.",
    "source": "NASA National Space Science Data Center"
  },
  {
    "id": "dates-stonehenge-sarsens",
    "prompt": "Around what year were the great sarsen stones at Stonehenge raised?",
    "precision": "century",
    "answerYear": -2500,
    "decompositionHint": "It is contemporary with the Egyptian pyramids rather than with the Romans or the Druids, both of which arrived thousands of years later.",
    "source": "English Heritage"
  },
  {
    "id": "dates-printing-gutenberg-bible",
    "prompt": "Around what year did Gutenberg finish printing his first Bible at Mainz?",
    "precision": "decade",
    "answerYear": 1455,
    "decompositionHint": "Printing is the hinge between the medieval and the modern: it arrives before Columbus sails and before Luther writes, but after the Black Death.",
    "source": "Gutenberg-Museum Mainz; British Library incunabula catalogue"
  },
  {
    "id": "dates-titanic-sinking",
    "prompt": "On what date did the Titanic sink after striking an iceberg?",
    "precision": "day",
    "answerDate": "1912-04-15",
    "decompositionHint": "Two years before the First World War. The North Atlantic iceberg season peaks in spring, which is why the ship was taking a southern track at all.",
    "source": "British Board of Trade Wreck Commissioner inquiry, 1912"
  },
  {
    "id": "dates-columbus-landfall",
    "prompt": "In what year did Columbus first cross the Atlantic and reach the Caribbean?",
    "precision": "year",
    "answerYear": 1492,
    "decompositionHint": "The same year Granada fell and Spain was unified, which is why the crown had money for it. Printing already existed; Luther had not been born.",
    "source": "Archivo General de Indias, Seville"
  },
  {
    "id": "dates-chernobyl",
    "prompt": "On what date did reactor four at Chernobyl explode?",
    "precision": "day",
    "answerDate": "1986-04-26",
    "decompositionHint": "The Soviet Union had five years left and Gorbachev had been in power about a year. Sweden detected the fallout within two days, in spring weather.",
    "source": "International Atomic Energy Agency, INSAG-7"
  },
  {
    "id": "dates-hammurabi-code",
    "prompt": "Around what year was the law code of Hammurabi inscribed in Babylon?",
    "precision": "century",
    "answerYear": -1754,
    "decompositionHint": "Babylon is much later than the first cities and much earlier than classical Greece. Think closer to the pyramids than to the Parthenon, but on the near side.",
    "source": "Musee du Louvre, Sb 8 (the Hammurabi stele)"
  },
  {
    "id": "dates-penicillin-discovery",
    "prompt": "In what year did Alexander Fleming notice that a mould was killing bacteria on his culture plates?",
    "precision": "year",
    "answerYear": 1928,
    "decompositionHint": "Between the wars, and a full decade before the drug was mass produced. Antibiotics were not available to soldiers at the start of the Second World War.",
    "source": "Nature, Fleming 1929; Imperial College London archives"
  },
  {
    "id": "dates-constantinople-falls",
    "prompt": "In what year did Ottoman forces take Constantinople?",
    "precision": "year",
    "answerYear": 1453,
    "decompositionHint": "It is usually given as the end of the Middle Ages, and it lands within a few years of the first printed book and four decades before Columbus.",
    "source": "Istanbul Archaeological Museums; Runciman, The Fall of Constantinople"
  },
  {
    "id": "dates-first-iphone-announced",
    "prompt": "On what date did Apple first show the iPhone to the public?",
    "precision": "day",
    "answerDate": "2007-01-09",
    "decompositionHint": "It was announced months before it went on sale, at the January trade show Apple used each year. Facebook existed; the iPad did not.",
    "source": "Apple Inc. press release, Macworld Expo"
  },
  {
    "id": "dates-cuneiform-writing",
    "prompt": "Around what year did the first true writing appear in Mesopotamia?",
    "precision": "century",
    "answerYear": -3200,
    "decompositionHint": "It predates the pyramids by several centuries and the wheel by rather less. Everything before it is prehistory, which is the definition doing the work.",
    "source": "British Museum, Department of the Middle East"
  },
  {
    "id": "dates-storming-bastille",
    "prompt": "On what date did a Paris crowd storm the Bastille?",
    "precision": "day",
    "answerDate": "1789-07-14",
    "decompositionHint": "It is a French national holiday, in high summer. The American revolution was already over and Napoleon was a twenty-year-old lieutenant.",
    "source": "Archives nationales (France)"
  },
  {
    "id": "dates-dna-double-helix",
    "prompt": "In what year was the double helix structure of DNA published in Nature?",
    "precision": "year",
    "answerYear": 1953,
    "decompositionHint": "The same year Everest was first climbed and Elizabeth II was crowned. Transistors existed; the structure of the gene did not.",
    "source": "Nature 171, Watson and Crick, 1953"
  },
  {
    "id": "dates-rome-founded-traditional",
    "prompt": "What year is traditionally given for the founding of Rome?",
    "precision": "decade",
    "answerYear": -753,
    "decompositionHint": "Roman writers dated everything from it, and it sits roughly in the middle of the archaic Greek period - after Homer, well before the Parthenon.",
    "source": "Varro's chronology, as used by Roman historians"
  },
  {
    "id": "dates-suez-canal-opens",
    "prompt": "On what date was the Suez Canal opened to shipping?",
    "precision": "day",
    "answerDate": "1869-11-17",
    "decompositionHint": "The American Civil War had ended four years earlier and the Panama Canal was still half a century away. Late in the year, to avoid the Egyptian summer.",
    "source": "Suez Canal Authority"
  },
  {
    "id": "dates-black-death-reaches-europe",
    "prompt": "In what year did the plague pandemic later called the Black Death reach Europe?",
    "precision": "year",
    "answerYear": 1347,
    "decompositionHint": "Mid fourteenth century, during the Hundred Years War and a generation before Chaucer wrote. It arrived by ship in Sicily and moved north over the following three years.",
    "source": "Benedictow, The Black Death 1346-1353"
  },
  {
    "id": "dates-mandela-released",
    "prompt": "On what date was Nelson Mandela released from prison?",
    "precision": "day",
    "answerDate": "1990-02-11",
    "decompositionHint": "Months after the Berlin Wall opened and four years before he became president. It was the southern hemisphere summer.",
    "source": "Nelson Mandela Foundation"
  },
  {
    "id": "dates-hagia-sophia-completed",
    "prompt": "In what year was the Hagia Sophia completed and dedicated in Constantinople?",
    "precision": "year",
    "answerYear": 537,
    "decompositionHint": "Under Justinian, about sixty years after the last western Roman emperor was deposed, and it stood as the largest cathedral in the world for nearly a thousand years.",
    "source": "Ayasofya Museum; Procopius, De Aedificiis"
  },
  {
    "id": "dates-krakatoa-eruption",
    "prompt": "On what date did the main eruption of Krakatoa destroy most of the island?",
    "precision": "day",
    "answerDate": "1883-08-27",
    "decompositionHint": "It was reported worldwide by telegraph within hours, which puts it after the cables were laid. The sound was heard in Australia; the sunsets lasted years.",
    "source": "Smithsonian Global Volcanism Program"
  },
  {
    "id": "dates-newton-principia",
    "prompt": "In what year was Newton's Principia first published?",
    "precision": "year",
    "answerYear": 1687,
    "decompositionHint": "Late seventeenth century, a generation after the Great Fire of London and two years before William and Mary took the English throne.",
    "source": "Royal Society archives"
  },
  {
    "id": "dates-terracotta-army-buried",
    "prompt": "Around what year was the Terracotta Army buried outside Xi'an?",
    "precision": "century",
    "answerYear": -210,
    "decompositionHint": "It was made for the emperor who first unified China, whose reign overlaps the Roman republic's wars with Carthage rather than the empire.",
    "source": "Emperor Qinshihuang's Mausoleum Site Museum"
  },
  {
    "id": "dates-first-telephone-call",
    "prompt": "On what date did Alexander Graham Bell make the first telephone call to his assistant?",
    "precision": "day",
    "answerDate": "1876-03-10",
    "decompositionHint": "The same year as the American centennial exhibition, where it was shown. Electric light was still three years off, so this comes first.",
    "source": "Library of Congress, Alexander Graham Bell family papers"
  },
  {
    "id": "dates-ussr-dissolved",
    "prompt": "In what year was the Soviet Union formally dissolved?",
    "precision": "year",
    "answerYear": 1991,
    "decompositionHint": "Two years after the Berlin Wall opened, and the same year as the failed August coup against Gorbachev. It happened at the very end of the year.",
    "source": "Alma-Ata Protocol; United Nations succession records"
  },
  {
    "id": "dates-machu-picchu-built",
    "prompt": "Around what year was Machu Picchu built?",
    "precision": "century",
    "answerYear": 1450,
    "decompositionHint": "The Inca empire was short: it rose and fell within about a century, and the Spanish arrived in the 1530s. So this sits shortly before European contact, not deep in antiquity.",
    "source": "Ministerio de Cultura del Peru; Rowe, Inca chronology"
  },
  {
    "id": "dates-hiroshima-bomb",
    "prompt": "On what date was the first atomic bomb used against a city?",
    "precision": "day",
    "answerDate": "1945-08-06",
    "decompositionHint": "The war in Europe had already ended in May, and Japan surrendered within about a fortnight of this. High summer.",
    "source": "Hiroshima Peace Memorial Museum"
  },
  {
    "id": "dates-luther-theses",
    "prompt": "In what year did Martin Luther publish his ninety-five theses?",
    "precision": "year",
    "answerYear": 1517,
    "decompositionHint": "A generation after printing became widespread and a quarter century after Columbus sailed, which is not a coincidence - the press is what spread it.",
    "source": "Luthergedenkstaetten Sachsen-Anhalt"
  },
  {
    "id": "dates-great-fire-london",
    "prompt": "In what year did the Great Fire destroy much of the City of London?",
    "precision": "year",
    "answerYear": 1666,
    "decompositionHint": "It came immediately after the last great English plague outbreak and while Charles II was on the throne, two decades after the civil war.",
    "source": "London Metropolitan Archives"
  },
  {
    "id": "dates-first-modern-olympics",
    "prompt": "In what year were the first modern Olympic Games held in Athens?",
    "precision": "year",
    "answerYear": 1896,
    "decompositionHint": "Late Victorian, after the telephone and the motor car but before powered flight. The games have been every four years since, which lets you count back from one you know.",
    "source": "International Olympic Committee"
  },
  {
    "id": "dates-alexander-dies",
    "prompt": "In what year did Alexander the Great die at Babylon?",
    "precision": "year",
    "answerYear": -323,
    "decompositionHint": "He was thirty-two, and his conquests happened in about a decade. Aristotle was his tutor, which anchors him to classical Athens rather than to Rome.",
    "source": "Plutarch, Life of Alexander; Oxford Classical Dictionary"
  },
  {
    "id": "dates-wall-street-crash",
    "prompt": "On what date did the New York stock market suffer the crash remembered as Black Tuesday?",
    "precision": "day",
    "answerDate": "1929-10-29",
    "decompositionHint": "Late autumn, a decade after the First World War ended and a decade before the next one began. The Depression that followed ran through the whole of the 1930s.",
    "source": "Federal Reserve Bank of New York historical records"
  },
  {
    "id": "dates-angkor-wat-begun",
    "prompt": "Around what year did construction of Angkor Wat begin?",
    "precision": "decade",
    "answerYear": 1113,
    "decompositionHint": "It is roughly contemporary with the Norman conquest and the first crusade rather than with anything later - medieval, not early modern.",
    "source": "APSARA National Authority; Coedes, Angkor inscriptions"
  },
  {
    "id": "dates-galileo-telescope",
    "prompt": "In what year did Galileo first turn a telescope on the night sky?",
    "precision": "year",
    "answerYear": 1609,
    "decompositionHint": "Shakespeare was still writing and the Mayflower had not sailed. The telescope was invented in the Netherlands the year before and he built his own copy.",
    "source": "Museo Galileo, Florence"
  },
  {
    "id": "dates-nhs-founded",
    "prompt": "On what date did the National Health Service begin operating in Britain?",
    "precision": "day",
    "answerDate": "1948-07-05",
    "decompositionHint": "Three years after the war ended, under the Attlee government, and rationing was still in force. It started at the beginning of a month, in summer.",
    "source": "The National Archives (UK), Ministry of Health records"
  },
  {
    "id": "dates-marco-polo-departs",
    "prompt": "Around what year did Marco Polo set out from Venice for Asia?",
    "precision": "decade",
    "answerYear": 1271,
    "decompositionHint": "The Mongol empire was at its height and Kublai Khan was on the throne, which places it well before the Black Death and long after the crusades began.",
    "source": "Biblioteca Nazionale Marciana; Larner, Marco Polo and the Discovery of the World"
  },
  {
    "id": "dates-waterloo",
    "prompt": "On what date was Napoleon defeated at Waterloo?",
    "precision": "day",
    "answerDate": "1815-06-18",
    "decompositionHint": "It ended a campaign that began when he escaped Elba in the spring, so it is early summer. The American war of 1812 had just finished.",
    "source": "Archives generales du Royaume (Belgium)"
  },
  {
    "id": "dates-eiffel-tower-completed",
    "prompt": "In what year was the Eiffel Tower completed?",
    "precision": "year",
    "answerYear": 1889,
    "decompositionHint": "It was built for a world's fair marking the centenary of the French revolution, which dates it exactly if you know when the revolution was.",
    "source": "Societe d'Exploitation de la Tour Eiffel"
  },
  {
    "id": "dates-first-transatlantic-telegraph",
    "prompt": "In what year was the first message sent along a telegraph cable laid across the Atlantic?",
    "precision": "year",
    "answerYear": 1858,
    "decompositionHint": "Before the American Civil War and before the telephone. The first cable failed within weeks; a lasting one followed eight years later.",
    "source": "Institution of Engineering and Technology archives"
  },
  {
    "id": "dates-darwin-origin-published",
    "prompt": "On what date was Darwin's On the Origin of Species first published?",
    "precision": "day",
    "answerDate": "1859-11-24",
    "decompositionHint": "The year after the Atlantic telegraph and two years before the American Civil War. Publishers favoured late autumn for a book meant to sell at Christmas.",
    "source": "Cambridge University Library, Darwin Correspondence Project"
  },
  {
    "id": "dates-berlin-wall-built",
    "prompt": "On what date did East Germany begin sealing off West Berlin with wire and concrete?",
    "precision": "day",
    "answerDate": "1961-08-13",
    "decompositionHint": "The same year as the first human spaceflight, and a year before the Cuban missile crisis. It was done over a summer weekend to catch the city off guard.",
    "source": "Bundesarchiv, Berlin"
  },
  {
    "id": "dates-oxford-teaching-begins",
    "prompt": "Around what year is there first evidence of teaching at Oxford?",
    "precision": "century",
    "answerYear": 1096,
    "decompositionHint": "It is medieval rather than Renaissance - within a generation of the Norman conquest, and centuries before printing.",
    "source": "University of Oxford archives"
  },
  {
    "id": "dates-first-photograph",
    "prompt": "Around what year was the earliest surviving photograph from nature made?",
    "precision": "decade",
    "answerYear": 1826,
    "decompositionHint": "Before the telegraph and before railways were common, but after Napoleon. It took an exposure of several hours, which is why the subject is a rooftop.",
    "source": "Harry Ransom Center, University of Texas at Austin"
  },
  {
    "id": "dates-cuban-missile-crisis",
    "prompt": "In what year did the Cuban missile crisis take place?",
    "precision": "year",
    "answerYear": 1962,
    "decompositionHint": "Between the building of the Berlin Wall and the Kennedy assassination, both of which are close. It lasted under a fortnight, in October.",
    "source": "John F. Kennedy Presidential Library and Museum"
  },
  {
    "id": "dates-western-roman-empire-ends",
    "prompt": "In what year was the last emperor of the western Roman empire deposed?",
    "precision": "year",
    "answerYear": 476,
    "decompositionHint": "The conventional end of antiquity, about a century after Christianity became the official religion and sixty years before the Hagia Sophia was built.",
    "source": "Oxford Classical Dictionary; Cambridge Ancient History vol. XIV"
  },
  {
    "id": "dates-dolly-the-sheep-born",
    "prompt": "On what date was Dolly, the first mammal cloned from an adult cell, born?",
    "precision": "day",
    "answerDate": "1996-07-05",
    "decompositionHint": "Her birth was kept quiet for seven months before being announced, so the announcement you may remember is later than this. The web was young and the genome unfinished.",
    "source": "Roslin Institute, University of Edinburgh"
  },
  {
    "id": "dates-taj-mahal-completed",
    "prompt": "Around what year was the Taj Mahal completed?",
    "precision": "decade",
    "answerYear": 1653,
    "decompositionHint": "Mughal India at its peak, contemporary with the English civil war and with Rembrandt rather than with anything medieval.",
    "source": "Archaeological Survey of India"
  },
  {
    "id": "dates-first-public-railway",
    "prompt": "On what date did the Stockton and Darlington Railway open, carrying passengers behind a steam locomotive?",
    "precision": "day",
    "answerDate": "1825-09-27",
    "decompositionHint": "A decade after Waterloo and a decade before Victoria came to the throne. Autumn, and it was a public holiday in the town.",
    "source": "National Railway Museum, York"
  },
  {
    "id": "dates-hadrians-wall-begun",
    "prompt": "Around what year did the Romans begin building Hadrian's Wall?",
    "precision": "decade",
    "answerYear": 122,
    "decompositionHint": "Roughly eighty years after the Roman invasion of Britain and at the empire's greatest extent, so early in the second century rather than late.",
    "source": "English Heritage; Birley, Hadrian's Wall inscriptions"
  },
  {
    "id": "dates-declaration-of-independence",
    "prompt": "On what date did the Continental Congress adopt the Declaration of Independence?",
    "precision": "day",
    "answerDate": "1776-07-04",
    "decompositionHint": "An American public holiday, in high summer. The war had already been going for over a year and would run for another seven.",
    "source": "United States National Archives"
  },
  {
    "id": "dates-marathon-battle",
    "prompt": "In what year did the Athenians defeat a Persian army on the plain of Marathon?",
    "precision": "year",
    "answerYear": -490,
    "decompositionHint": "A decade before the larger Persian invasion at Thermopylae and Salamis, and a generation before the Parthenon was built.",
    "source": "Herodotus, Histories VI; Oxford Classical Dictionary"
  },
  {
    "id": "dates-world-wide-web-proposed",
    "prompt": "In what year did Tim Berners-Lee write the proposal that became the World Wide Web?",
    "precision": "year",
    "answerYear": 1989,
    "decompositionHint": "The internet already existed and had for two decades; this is the layer on top. It is the same year the Berlin Wall opened, and browsers reached the public four years later.",
    "source": "CERN document server, Berners-Lee, Information Management: A Proposal"
  },
  {
    "id": "dates-russian-revolution-bolsheviks",
    "prompt": "In what year did the Bolsheviks seize power in Russia?",
    "precision": "year",
    "answerYear": 1917,
    "decompositionHint": "It happened while the First World War was still being fought, and Russia left the war shortly afterwards. The tsar had already abdicated earlier the same year.",
    "source": "State Archive of the Russian Federation"
  },
  {
    "id": "dates-euro-notes-circulate",
    "prompt": "On what date did euro banknotes and coins first enter circulation?",
    "precision": "day",
    "answerDate": "2002-01-01",
    "decompositionHint": "The currency existed for accounting for three years before the cash appeared, and a changeover like this is always scheduled for the start of a year.",
    "source": "European Central Bank"
  },
  {
    "id": "dates-colosseum-completed",
    "prompt": "In what year was the Colosseum completed and opened with a hundred days of games?",
    "precision": "year",
    "answerYear": 80,
    "decompositionHint": "Titus opened it, a year after the eruption that buried Pompeii happened on his watch. Early imperial Rome, not late.",
    "source": "Parco archeologico del Colosseo"
  },
  {
    "id": "dates-first-black-hole-image",
    "prompt": "On what date was the first direct image of a black hole released?",
    "precision": "day",
    "answerDate": "2019-04-10",
    "decompositionHint": "It came from a global array of radio telescopes and was announced simultaneously on several continents, in the spring of the year before the pandemic.",
    "source": "Event Horizon Telescope Collaboration; European Southern Observatory"
  },
  {
    "id": "dates-slavery-abolition-act",
    "prompt": "In what year did the British Parliament pass the act abolishing slavery across most of the empire?",
    "precision": "year",
    "answerYear": 1833,
    "decompositionHint": "The trade itself had been banned a quarter of a century earlier; this is the later act freeing the enslaved. It is a few years before Victoria came to the throne.",
    "source": "The National Archives (UK), Slavery Abolition Act 1833"
  },
  {
    "id": "dates-library-of-alexandria-founded",
    "prompt": "Around what year was the Library of Alexandria founded?",
    "precision": "century",
    "answerYear": -285,
    "decompositionHint": "Under the Ptolemies, the Greek dynasty that ruled Egypt after Alexander's death, so shortly after his empire broke up and long before Caesar arrived.",
    "source": "Oxford Classical Dictionary; Bagnall, Alexandria: Library of Dreams"
  },
  {
    "id": "dates-higgs-boson-announced",
    "prompt": "On what date did CERN announce the discovery of a particle consistent with the Higgs boson?",
    "precision": "day",
    "answerDate": "2012-07-04",
    "decompositionHint": "The collider had been running for a few years by then, after a false start. Summer, and the announcement was timed for a conference.",
    "source": "CERN press office; ATLAS and CMS collaborations"
  },
  {
    "id": "dates-mayflower-lands",
    "prompt": "In what year did the Mayflower reach New England?",
    "precision": "year",
    "answerYear": 1620,
    "decompositionHint": "Shakespeare had died four years earlier and Jamestown had been settled thirteen years before, so it is not the first English colony in America.",
    "source": "Plimoth Patuxet Museums; Bradford, Of Plymouth Plantation"
  },
  {
    "id": "dates-peace-of-westphalia",
    "prompt": "In what year was the Peace of Westphalia signed, ending the Thirty Years War?",
    "precision": "year",
    "answerYear": 1648,
    "decompositionHint": "The war's name gives you the arithmetic: it began in 1618. It ends in the same decade as the English civil war.",
    "source": "Staatsarchiv Muenster; treaties of Osnabrueck and Muenster"
  },
  {
    "id": "dates-fort-sumter",
    "prompt": "On what date did Confederate artillery open fire on Fort Sumter, beginning the American Civil War?",
    "precision": "day",
    "answerDate": "1861-04-12",
    "decompositionHint": "Weeks after Lincoln's inauguration, which was in March. The war ran four years from here, so count back from its end if that is the date you know.",
    "source": "United States National Park Service"
  },
  {
    "id": "dates-human-genome-completed",
    "prompt": "In what year was the Human Genome Project declared complete?",
    "precision": "year",
    "answerYear": 2003,
    "decompositionHint": "A draft was announced three years earlier with considerable fanfare; this is the finished version. It landed on the fiftieth anniversary of the double helix paper.",
    "source": "National Human Genome Research Institute"
  },
  {
    "id": "dates-great-wall-qin-construction",
    "prompt": "Around what year did the first emperor of China order the northern walls joined into one defensive line?",
    "precision": "century",
    "answerYear": -220,
    "decompositionHint": "Same reign as the Terracotta Army, and roughly contemporary with Hannibal crossing the Alps. Most of the wall visible today is far later, from the Ming period.",
    "source": "Waldron, The Great Wall of China: From History to Myth"
  },
  {
    "id": "dates-hamlet-first-performed",
    "prompt": "Around what year was Hamlet first performed?",
    "precision": "decade",
    "answerYear": 1600,
    "decompositionHint": "Elizabeth I was in her last years and the Globe had just been built. It comes after the Armada and before the King James Bible.",
    "source": "Folger Shakespeare Library; Stationers' Register entry, 1602"
  },
  {
    "id": "dates-mona-lisa-begun",
    "prompt": "Around what year did Leonardo begin painting the Mona Lisa?",
    "precision": "decade",
    "answerYear": 1503,
    "decompositionHint": "The High Renaissance, a decade after Columbus sailed and while Michelangelo was carving David. Leonardo kept working on it for years afterwards.",
    "source": "Musee du Louvre; Vasari, Lives of the Artists"
  }
]

if (typeof module !== "undefined") module.exports = DATES
