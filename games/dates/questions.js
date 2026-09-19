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
  },
  {
    "id": "dates-pearl-harbor",
    "prompt": "On what date did Japan attack the American fleet at Pearl Harbor?",
    "precision": "day",
    "answerDate": "1941-12-07",
    "decompositionHint": "Britain had been at war for over two years by then and America had not. It was a Sunday morning chosen for that reason, late in the year.",
    "source": "United States National Archives; Congressional declaration of war, 8 December 1941"
  },
  {
    "id": "dates-caesar-assassinated",
    "prompt": "In what year was Julius Caesar assassinated?",
    "precision": "year",
    "answerYear": -44,
    "decompositionHint": "The republic ended within a generation of it: his heir won the civil war that followed and became the first emperor fourteen years later.",
    "source": "Suetonius, Divus Julius; Oxford Classical Dictionary"
  },
  {
    "id": "dates-hijra",
    "prompt": "In what year did Muhammad and his followers migrate from Mecca to Medina?",
    "precision": "year",
    "answerYear": 622,
    "decompositionHint": "The Islamic calendar counts from it, so any Islamic year plus about 580 lands near the western one. It is a century and a half after the last Roman emperor in the west.",
    "source": "Encyclopaedia of Islam; the Hijri calendar epoch"
  },
  {
    "id": "dates-first-telegraph-message",
    "prompt": "On what date did Samuel Morse send the first message over the Washington to Baltimore telegraph line?",
    "precision": "day",
    "answerDate": "1844-05-24",
    "decompositionHint": "Railways were spreading and photography was about twenty years old. The telephone is still more than thirty years away, so this comes well before it.",
    "source": "Library of Congress, Samuel F. B. Morse papers"
  },
  {
    "id": "dates-charlemagne-crowned",
    "prompt": "In what year was Charlemagne crowned emperor in Rome?",
    "precision": "year",
    "answerYear": 800,
    "decompositionHint": "A famously round number, and it sits between the Viking raids beginning and the Norman conquest. Three centuries after the western empire it claimed to revive.",
    "source": "Annales regni Francorum; Einhard, Vita Karoli Magni"
  },
  {
    "id": "dates-hubble-launched",
    "prompt": "On what date was the Hubble Space Telescope launched?",
    "precision": "day",
    "answerDate": "1990-04-24",
    "decompositionHint": "It went up on the shuttle, so it is after the programme resumed following the Challenger loss four years earlier. Its famously blurred mirror was fixed three years later.",
    "source": "NASA; STS-31 mission record"
  },
  {
    "id": "dates-thermopylae",
    "prompt": "In what year did a small Greek force hold the pass at Thermopylae against a Persian army?",
    "precision": "year",
    "answerYear": -480,
    "decompositionHint": "It is the second Persian invasion, a decade after the first was turned back on the plain of Marathon, and a generation before the Parthenon was built.",
    "source": "Herodotus, Histories VII; Oxford Classical Dictionary"
  },
  {
    "id": "dates-everest-first-climbed",
    "prompt": "On what date did Hillary and Tenzing first reach the summit of Everest?",
    "precision": "day",
    "answerDate": "1953-05-29",
    "decompositionHint": "The news reached London in time for the coronation, which fixes it to a few days. Climbing there is only possible in the narrow window before the monsoon.",
    "source": "Royal Geographical Society; the 1953 British Everest expedition records"
  },
  {
    "id": "dates-domesday-book",
    "prompt": "In what year was the Domesday survey of England compiled?",
    "precision": "year",
    "answerYear": 1086,
    "decompositionHint": "It was ordered by the king who had taken the country twenty years earlier, and finished shortly before he died.",
    "source": "The National Archives (UK), E 31"
  },
  {
    "id": "dates-gagarin-flight",
    "prompt": "On what date did Yuri Gagarin become the first person to fly in space?",
    "precision": "day",
    "answerDate": "1961-04-12",
    "decompositionHint": "Three and a half years after the first satellite, and weeks before Kennedy committed America to the Moon - the commitment was a response to this.",
    "source": "Russian State Archive of Scientific and Technical Documentation; Vostok 1 records"
  },
  {
    "id": "dates-lisbon-earthquake",
    "prompt": "On what date did the earthquake and tsunami destroy much of Lisbon?",
    "precision": "day",
    "answerDate": "1755-11-01",
    "decompositionHint": "It struck while the churches were full for a major feast day, which is part of why it shook European thinking as much as the city. Mid-eighteenth century, before the American revolution.",
    "source": "Instituto Portugues do Mar e da Atmosfera; contemporary Lisbon accounts"
  },
  {
    "id": "dates-spanish-armada",
    "prompt": "In what year was the Spanish Armada defeated?",
    "precision": "year",
    "answerYear": 1588,
    "decompositionHint": "Late in Elizabeth's reign, a generation before the Mayflower sailed and a century after Columbus. Shakespeare was in his twenties.",
    "source": "The National Archives (UK); Spanish Archivo General de Simancas"
  },
  {
    "id": "dates-hannibal-crosses-alps",
    "prompt": "In what year did Hannibal cross the Alps into Italy?",
    "precision": "year",
    "answerYear": -218,
    "decompositionHint": "Rome was still a republic and had not yet taken Greece or Egypt. The war it opened ran for sixteen years and Rome nearly lost it.",
    "source": "Polybius, Histories III; Livy, Ab Urbe Condita XXI"
  },
  {
    "id": "dates-covid-pandemic-declared",
    "prompt": "On what date did the World Health Organization declare COVID-19 a pandemic?",
    "precision": "day",
    "answerDate": "2020-03-11",
    "decompositionHint": "Weeks after the first lockdowns in Europe and about ten weeks after the outbreak was first reported. Most national lockdowns followed within a fortnight.",
    "source": "World Health Organization, Director-General's opening remarks"
  },
  {
    "id": "dates-first-crusade-jerusalem",
    "prompt": "In what year did the First Crusade capture Jerusalem?",
    "precision": "year",
    "answerYear": 1099,
    "decompositionHint": "A generation after the Norman conquest of England, and just before the turn of a century. The campaign took three years from its calling.",
    "source": "Gesta Francorum; Runciman, A History of the Crusades"
  },
  {
    "id": "dates-armistice-first-world-war",
    "prompt": "On what date did the armistice end the fighting of the First World War?",
    "precision": "day",
    "answerDate": "1918-11-11",
    "decompositionHint": "Remembrance is still held on its anniversary, and the hour and the month match the day. The war had run a little over four years by then.",
    "source": "Archives nationales (France); the Compiegne armistice"
  },
  {
    "id": "dates-genghis-khan-unites-mongols",
    "prompt": "In what year was Temujin proclaimed Genghis Khan, ruler of a united Mongol nation?",
    "precision": "year",
    "answerYear": 1206,
    "decompositionHint": "Within a decade either side of Magna Carta. The empire that followed reached Hungary within forty years, which is the part worth anchoring on.",
    "source": "The Secret History of the Mongols; Cambridge History of Inner Asia"
  },
  {
    "id": "dates-wikipedia-launched",
    "prompt": "On what date did Wikipedia go online?",
    "precision": "day",
    "answerDate": "2001-01-15",
    "decompositionHint": "After the dot-com crash and before broadband was common. Google was two years old; Facebook was three years away. New sites like this tended to launch in January.",
    "source": "Wikimedia Foundation"
  },
  {
    "id": "dates-nicaea-council",
    "prompt": "In what year did the first church council meet at Nicaea?",
    "precision": "year",
    "answerYear": 325,
    "decompositionHint": "Called by Constantine, a decade or so after he legalised Christianity and a generation before the empire made it official. A century and a half before the west fell.",
    "source": "Eusebius, Vita Constantini; Oxford Dictionary of the Christian Church"
  },
  {
    "id": "dates-marconi-transatlantic-signal",
    "prompt": "On what date did Marconi receive the first radio signal sent across the Atlantic?",
    "precision": "day",
    "answerDate": "1901-12-12",
    "decompositionHint": "Between the first powered flight and the first cars being common - so right at the turn of the century. Undersea telegraph cables had already been working for forty years.",
    "source": "Marconi Collection, Bodleian Library, University of Oxford"
  },
  {
    "id": "dates-mohenjo-daro-built",
    "prompt": "Around what year was the city of Mohenjo-daro in the Indus valley at its height?",
    "precision": "century",
    "answerYear": -2500,
    "decompositionHint": "It is contemporary with the Egyptian pyramids and with Stonehenge's great stones, not with anything classical. Its script has never been deciphered.",
    "source": "Archaeological Survey of India; UNESCO World Heritage nomination"
  },
  {
    "id": "dates-d-day-landings",
    "prompt": "On what date did Allied forces land in Normandy?",
    "precision": "day",
    "answerDate": "1944-06-06",
    "decompositionHint": "Eleven months before the war in Europe ended, and timed to the tide and the moon in early summer. It had been postponed by a day for weather.",
    "source": "United States National Archives; Supreme Headquarters Allied Expeditionary Force records"
  },
  {
    "id": "dates-confucius-born",
    "prompt": "Around what year was Confucius born?",
    "precision": "decade",
    "answerYear": -551,
    "decompositionHint": "Roughly contemporary with the Buddha and with the early Greek philosophers, and two centuries before China was first unified under one emperor.",
    "source": "Sima Qian, Shiji; Cambridge History of Ancient China"
  },
  {
    "id": "dates-boston-tea-party",
    "prompt": "On what date was a cargo of tea thrown into Boston harbour in protest at British taxes?",
    "precision": "day",
    "answerDate": "1773-12-16",
    "decompositionHint": "Under three years before the colonies declared independence, and in the cold half of the year. Working out which side of Christmas it falls is most of the job.",
    "source": "Massachusetts Historical Society"
  },
  {
    "id": "dates-hong-kong-handover",
    "prompt": "On what date was Hong Kong handed back to China?",
    "precision": "day",
    "answerDate": "1997-07-01",
    "decompositionHint": "The lease that ran out was a ninety-nine year one signed in 1898, which gives you the year almost exactly. Handovers are scheduled for the first of a month.",
    "source": "Sino-British Joint Declaration; UK Foreign and Commonwealth Office records"
  },
  {
    "id": "dates-vikings-lindisfarne",
    "prompt": "In what year did Viking raiders sack the monastery at Lindisfarne?",
    "precision": "year",
    "answerYear": 793,
    "decompositionHint": "Usually taken as the start of the Viking age, and it lands within a decade of Charlemagne being crowned emperor. Nearly three centuries before the Norman conquest.",
    "source": "Anglo-Saxon Chronicle; British Library, Cotton MS Tiberius A VI"
  },
  {
    "id": "dates-x-rays-discovered",
    "prompt": "On what date did Roentgen first observe the rays he called X-rays?",
    "precision": "day",
    "answerDate": "1895-11-08",
    "decompositionHint": "Radioactivity was found the following year and the electron the year after that, so this is the first of the three. Late autumn, in a darkened laboratory.",
    "source": "Deutsches Roentgen-Museum; Wuerzburg Physical-Medical Society proceedings"
  },
  {
    "id": "dates-agincourt",
    "prompt": "In what year did the English defeat a much larger French army at Agincourt?",
    "precision": "year",
    "answerYear": 1415,
    "decompositionHint": "Roughly midway through the Hundred Years War, which began in 1337, and a generation before printing arrived in Europe.",
    "source": "The National Archives (UK); Gesta Henrici Quinti"
  },
  {
    "id": "dates-first-test-tube-baby",
    "prompt": "On what date was Louise Brown, the first baby conceived by IVF, born?",
    "precision": "day",
    "answerDate": "1978-07-25",
    "decompositionHint": "Between the first heart transplant and the first cloned mammal, and closer to the transplant. Personal computers were just arriving; the web was a decade away.",
    "source": "Oldham General Hospital records; The Lancet, Steptoe and Edwards, 1978"
  },
  {
    "id": "dates-qin-unifies-china",
    "prompt": "In what year did the state of Qin complete its conquest of the other Chinese states?",
    "precision": "year",
    "answerYear": -221,
    "decompositionHint": "The emperor it produced is the one buried with the terracotta figures, who died about a decade later. Rome was fighting Hannibal at the time.",
    "source": "Sima Qian, Shiji; Cambridge History of China vol. 1"
  },
  {
    "id": "dates-communist-manifesto",
    "prompt": "In what year was the Communist Manifesto first published?",
    "precision": "year",
    "answerYear": 1848,
    "decompositionHint": "It appeared in the same year as revolutions across half of Europe, which is not a coincidence. Railways were spreading; the telephone was thirty years away.",
    "source": "International Institute of Social History, Amsterdam"
  },
  {
    "id": "dates-chatgpt-released",
    "prompt": "On what date was ChatGPT first released to the public?",
    "precision": "day",
    "answerDate": "2022-11-30",
    "decompositionHint": "It reached a million users within a week, which was reported over the following month - so it is right at the end of its year rather than the start.",
    "source": "OpenAI announcement"
  },
  {
    "id": "dates-edict-of-milan",
    "prompt": "In what year did Constantine and Licinius agree to tolerate Christianity across the Roman empire?",
    "precision": "year",
    "answerYear": 313,
    "decompositionHint": "A decade or so before the first great church council, and a lifetime before Christianity became the empire's official religion. Still well before the western empire fell.",
    "source": "Lactantius, De Mortibus Persecutorum; Oxford Classical Dictionary"
  },
  {
    "id": "dates-golden-gate-opens",
    "prompt": "On what date did the Golden Gate Bridge open?",
    "precision": "day",
    "answerDate": "1937-05-27",
    "decompositionHint": "Deep in the Depression and two years before the war in Europe. It opened to people on foot the day before cars, in the late spring.",
    "source": "Golden Gate Bridge, Highway and Transportation District"
  },
  {
    "id": "dates-tenochtitlan-founded",
    "prompt": "Around what year was the Aztec capital Tenochtitlan founded?",
    "precision": "decade",
    "answerYear": 1325,
    "decompositionHint": "Roughly two centuries before the Spanish arrived, and about the time of the Black Death in Europe. Not an ancient city by the time Cortes saw it.",
    "source": "Codex Mendoza; Instituto Nacional de Antropologia e Historia"
  },
  {
    "id": "dates-first-heart-transplant",
    "prompt": "On what date did Christiaan Barnard perform the first human heart transplant?",
    "precision": "day",
    "answerDate": "1967-12-03",
    "decompositionHint": "Between the first spaceflight and the Moon landing, and closer to the Moon landing. It happened in Cape Town in the southern summer, at the very end of the year.",
    "source": "Groote Schuur Hospital records; South African Medical Journal, 1967"
  },
  {
    "id": "dates-mansa-musa-pilgrimage",
    "prompt": "Around what year did Mansa Musa of Mali make his pilgrimage to Mecca?",
    "precision": "decade",
    "answerYear": 1324,
    "decompositionHint": "The gold he handed out in Cairo was still depressing its price a decade later, which is how it is dated. A generation before the Black Death reached Europe.",
    "source": "al-Umari, Masalik al-absar; Levtzion, Ancient Ghana and Mali"
  },
  {
    "id": "dates-jenner-vaccination",
    "prompt": "On what date did Edward Jenner first inoculate a boy with cowpox to protect against smallpox?",
    "precision": "day",
    "answerDate": "1796-05-14",
    "decompositionHint": "During the French revolutionary wars and a few years before the Rosetta Stone was found. Cowpox comes from cattle, so it had to be done in the grazing season.",
    "source": "Royal College of Physicians; Jenner, An Inquiry, 1798"
  },
  {
    "id": "dates-berlin-airlift-begins",
    "prompt": "In what year did the Soviet blockade of West Berlin and the airlift that answered it begin?",
    "precision": "year",
    "answerYear": 1948,
    "decompositionHint": "Three years after the war ended and a year before NATO was founded. The airlift ran for about eleven months.",
    "source": "United States Air Force Historical Research Agency; Bundesarchiv"
  },
  {
    "id": "dates-forbidden-city-completed",
    "prompt": "Around what year was the Forbidden City in Beijing completed?",
    "precision": "decade",
    "answerYear": 1420,
    "decompositionHint": "Built by the emperor who also sent the great treasure fleets abroad, so the two are within a few years of each other. Decades before printing reached Europe.",
    "source": "Palace Museum, Beijing; Ming Shilu"
  },
  {
    "id": "dates-mount-st-helens",
    "prompt": "On what date did Mount St Helens erupt and collapse its north face?",
    "precision": "day",
    "answerDate": "1980-05-18",
    "decompositionHint": "It had been rumbling for two months before it went, which puts the eruption in late spring. Personal computers were new and the Berlin Wall had another nine years.",
    "source": "United States Geological Survey, Cascades Volcano Observatory"
  },
  {
    "id": "dates-east-west-schism",
    "prompt": "In what year did the eastern and western churches formally break communion?",
    "precision": "year",
    "answerYear": 1054,
    "decompositionHint": "A dozen years before the Norman conquest, and four decades before the First Crusade set out. The two halves had been drifting for centuries before it became official.",
    "source": "Oxford Dictionary of Byzantium; Runciman, The Eastern Schism"
  },
  {
    "id": "dates-model-t-introduced",
    "prompt": "In what year did Ford introduce the Model T?",
    "precision": "year",
    "answerYear": 1908,
    "decompositionHint": "Five years after the first powered flight and six before the First World War. The moving assembly line came five years after the car itself.",
    "source": "The Henry Ford museum archives"
  },
  {
    "id": "dates-rosetta-stone-found",
    "prompt": "In what year was the Rosetta Stone found in Egypt?",
    "precision": "year",
    "answerYear": 1799,
    "decompositionHint": "Found by French soldiers during Napoleon's Egyptian campaign, right at the end of a century. The script was not deciphered for another twenty-three years.",
    "source": "British Museum, EA24"
  },
  {
    "id": "dates-amundsen-south-pole",
    "prompt": "On what date did Amundsen's party reach the South Pole?",
    "precision": "day",
    "answerDate": "1911-12-14",
    "decompositionHint": "The Antarctic travelling season is the southern summer, so it has to be near the turn of the year. Scott arrived about five weeks later. Months before the Titanic sailed.",
    "source": "Norwegian National Library, Amundsen collection"
  },
  {
    "id": "dates-tutankhamun-tomb-opened",
    "prompt": "In what year was the tomb of Tutankhamun found in the Valley of the Kings?",
    "precision": "year",
    "answerYear": 1922,
    "decompositionHint": "Between the wars and a few years after the First World War ended. Radio broadcasting was just starting, which is part of why the find became so famous.",
    "source": "Griffith Institute, University of Oxford, Howard Carter archive"
  },
  {
    "id": "dates-tutankhamun-died",
    "prompt": "Around what year did the pharaoh Tutankhamun die?",
    "precision": "century",
    "answerYear": -1323,
    "decompositionHint": "New Kingdom Egypt, over a thousand years after the Great Pyramid was built and a thousand before Cleopatra. Closer to the pyramids than to the Romans, but not by much.",
    "source": "Egyptian Museum, Cairo; Shaw, The Oxford History of Ancient Egypt"
  },
  {
    "id": "dates-live-aid",
    "prompt": "On what date were the Live Aid concerts held in London and Philadelphia?",
    "precision": "day",
    "answerDate": "1985-07-13",
    "decompositionHint": "Outdoor stadium concerts on two continents at once need long daylight in the northern summer. It was four years before the Berlin Wall opened.",
    "source": "Band Aid Trust; BBC broadcast records"
  },
  {
    "id": "dates-transcontinental-railroad",
    "prompt": "On what date were the two halves of the American transcontinental railroad joined at Promontory Summit?",
    "precision": "day",
    "answerDate": "1869-05-10",
    "decompositionHint": "Four years after the Civil War ended and the same year the Suez Canal opened. Work in the mountains stopped for winter, so it finished in the warm half of the year.",
    "source": "United States National Park Service, Golden Spike"
  },
  {
    "id": "dates-great-exhibition-opens",
    "prompt": "On what date did the Great Exhibition open in the Crystal Palace in Hyde Park?",
    "precision": "day",
    "answerDate": "1851-05-01",
    "decompositionHint": "Mid-Victorian, with railways established and the telephone decades away. A glass building in London is only comfortable from late spring, and it opened on the first of a month.",
    "source": "Royal Commission for the Exhibition of 1851"
  },
  {
    "id": "dates-actium",
    "prompt": "In what year did Octavian defeat Antony and Cleopatra in the sea battle at Actium?",
    "precision": "year",
    "answerYear": -31,
    "decompositionHint": "It ends the civil wars that began with Caesar's murder thirteen years earlier, and Octavian became the first emperor four years after it.",
    "source": "Plutarch, Life of Antony; Cassius Dio, Roman History L"
  },
  {
    "id": "dates-good-friday-agreement",
    "prompt": "On what date was the Good Friday Agreement signed in Belfast?",
    "precision": "day",
    "answerDate": "1998-04-10",
    "decompositionHint": "Its name tells you the week, and Easter moves - it fell early that year. The year is a year after the Hong Kong handover.",
    "source": "UK Foreign and Commonwealth Office; Irish Department of Foreign Affairs"
  },
  {
    "id": "dates-hundred-years-war-begins",
    "prompt": "In what year did the Hundred Years War between England and France begin?",
    "precision": "year",
    "answerYear": 1337,
    "decompositionHint": "The name is misleading - it ran about a hundred and sixteen years - but the end is the useful anchor: it finished the same decade Constantinople fell. The Black Death arrived a decade into it.",
    "source": "The National Archives (UK); Sumption, The Hundred Years War"
  },
  {
    "id": "dates-hitler-becomes-chancellor",
    "prompt": "On what date was Hitler appointed chancellor of Germany?",
    "precision": "day",
    "answerDate": "1933-01-30",
    "decompositionHint": "Six and a half years before the invasion of Poland, and just over three years after the Wall Street crash that helped put him there. Right at the start of a year.",
    "source": "Bundesarchiv, Reichskanzlei records"
  },
  {
    "id": "dates-bhopal-disaster",
    "prompt": "On what date did the gas leak at the Union Carbide plant in Bhopal happen?",
    "precision": "day",
    "answerDate": "1984-12-03",
    "decompositionHint": "It happened overnight, when the cold air held the gas near the ground - so it is in the Indian winter. Two years before Chernobyl.",
    "source": "Indian Council of Medical Research; Madhya Pradesh government inquiry"
  },
  {
    "id": "dates-sack-of-rome-alaric",
    "prompt": "In what year did Alaric's Goths sack the city of Rome?",
    "precision": "year",
    "answerYear": 410,
    "decompositionHint": "Two-thirds of a century before the last western emperor was deposed, so the empire limped on afterwards. Britain was abandoned by Rome at about the same time.",
    "source": "Orosius, Historiae; Cambridge Ancient History vol. XIII"
  },
  {
    "id": "dates-channel-tunnel-opens",
    "prompt": "On what date was the Channel Tunnel officially opened?",
    "precision": "day",
    "answerDate": "1994-05-06",
    "decompositionHint": "Digging finished in 1990 and services took several years to start, so this sits a few years after the two halves met. Same year Mandela became president.",
    "source": "Getlink; UK Department of Transport records"
  },
  {
    "id": "dates-first-olympic-games-ancient",
    "prompt": "Around what year were the first Olympic games held at Olympia?",
    "precision": "decade",
    "answerYear": -776,
    "decompositionHint": "Greeks dated events by counting four-year cycles from it, and it falls within a generation of the traditional founding of Rome.",
    "source": "Pausanias, Description of Greece V; Oxford Classical Dictionary"
  },
  {
    "id": "dates-perry-opens-japan",
    "prompt": "In what year did the Convention of Kanagawa open Japanese ports to American ships?",
    "precision": "year",
    "answerYear": 1854,
    "decompositionHint": "It is about fifteen years before the Meiji restoration that followed from it, and a few years before the American Civil War.",
    "source": "United States National Archives, treaty series"
  },
  {
    "id": "dates-daguerreotype-announced",
    "prompt": "In what year did Louis Daguerre announce the photographic process that carried his name?",
    "precision": "year",
    "answerYear": 1839,
    "decompositionHint": "About a dozen years after the earliest surviving photograph, which needed an exposure of hours. Railways were new; the telegraph was about to arrive.",
    "source": "Academie des sciences, Paris, session of 19 August 1839"
  },
  {
    "id": "dates-mendel-inheritance-paper",
    "prompt": "In what year did Gregor Mendel publish his work on inheritance in pea plants?",
    "precision": "year",
    "answerYear": 1866,
    "decompositionHint": "A few years after Darwin's book, and ignored for about thirty-five years afterwards. The American Civil War had just ended.",
    "source": "Verhandlungen des naturforschenden Vereines in Bruenn, vol. 4"
  },
  {
    "id": "dates-empire-state-opens",
    "prompt": "On what date did the Empire State Building open?",
    "precision": "day",
    "answerDate": "1931-05-01",
    "decompositionHint": "Built through the first years of the Depression, and it took about a year and a half. Buildings like this opened on the first of a month.",
    "source": "Empire State Realty Trust; New York City Landmarks Preservation Commission"
  },
  {
    "id": "dates-india-independence",
    "prompt": "On what date did India become independent?",
    "precision": "day",
    "answerDate": "1947-08-15",
    "decompositionHint": "Two years after the Second World War ended, and it is still the national holiday. Pakistan's is the day before.",
    "source": "Indian Independence Act 1947; National Archives of India"
  },
  {
    "id": "dates-teotihuacan-pyramid-of-the-sun",
    "prompt": "Around what year was the Pyramid of the Sun at Teotihuacan completed?",
    "precision": "century",
    "answerYear": 200,
    "decompositionHint": "Roman imperial times, though the two had no contact. It is well over a thousand years before the Aztecs arrived and named the ruins.",
    "source": "Instituto Nacional de Antropologia e Historia; Millon, Urbanization at Teotihuacan"
  },
  {
    "id": "dates-buddha-death-traditional",
    "prompt": "Around what year do most scholars now place the death of the Buddha?",
    "precision": "century",
    "answerYear": -400,
    "decompositionHint": "Scholarly estimates span about eighty years, which is why this is asked loosely. Roughly contemporary with classical Athens and with Confucius in China.",
    "source": "Bechert, The Dating of the Historical Buddha; Cousins, Journal of the Royal Asiatic Society"
  },
  {
    "id": "dates-franz-ferdinand-assassinated",
    "prompt": "On what date was Archduke Franz Ferdinand shot in Sarajevo?",
    "precision": "day",
    "answerDate": "1914-06-28",
    "decompositionHint": "War was declared about five weeks later and the fighting began in August, so work back from there. Early summer.",
    "source": "Haus-, Hof- und Staatsarchiv, Vienna"
  },
  {
    "id": "dates-neptune-discovered",
    "prompt": "On what date was Neptune first observed, after its position had been predicted from mathematics?",
    "precision": "day",
    "answerDate": "1846-09-23",
    "decompositionHint": "Mid-Victorian, a few years after the first photographs and the telegraph. It was found within a degree of where the arithmetic said to look, on the first night of trying.",
    "source": "Berlin Observatory records; Royal Astronomical Society"
  },
  {
    "id": "dates-galileo-trial",
    "prompt": "In what year was Galileo tried in Rome and made to renounce the idea that the Earth moves?",
    "precision": "year",
    "answerYear": 1633,
    "decompositionHint": "About twenty-five years after he first turned a telescope on the sky, and half a century before Newton's Principia. During the Thirty Years War.",
    "source": "Archivio Apostolico Vaticano, processo Galileo"
  },
  {
    "id": "dates-transistor-invented",
    "prompt": "In what year was the transistor first demonstrated at Bell Labs?",
    "precision": "year",
    "answerYear": 1947,
    "decompositionHint": "Just after the Second World War and about a decade before the integrated circuit. Computers at the time filled rooms and ran on valves.",
    "source": "Nokia Bell Labs archives; Physical Review, Bardeen and Brattain, 1948"
  },
  {
    "id": "dates-fall-of-saigon",
    "prompt": "On what date did North Vietnamese forces take Saigon, ending the Vietnam War?",
    "precision": "day",
    "answerDate": "1975-04-30",
    "decompositionHint": "American combat troops had left two years earlier, so this is later than most people place it. Right at the end of a month, in spring.",
    "source": "United States Department of State, Office of the Historian"
  },
  {
    "id": "dates-sistine-chapel-ceiling",
    "prompt": "In what year did Michelangelo finish painting the ceiling of the Sistine Chapel?",
    "precision": "year",
    "answerYear": 1512,
    "decompositionHint": "It took about four years, and he began it roughly a decade after Leonardo started the Mona Lisa. Five years before Luther's theses.",
    "source": "Musei Vaticani; Vasari, Lives of the Artists"
  },
  {
    "id": "dates-arpanet-first-message",
    "prompt": "On what date was the first message sent between two computers on the ARPANET?",
    "precision": "day",
    "answerDate": "1969-10-29",
    "decompositionHint": "The same year as the Moon landing, a few months after it. The system crashed after two letters, which is the detail usually remembered.",
    "source": "UCLA Kleinrock Center; ARPANET IMP log"
  },
  {
    "id": "dates-charles-i-executed",
    "prompt": "In what year was Charles I executed outside the Banqueting House in Whitehall?",
    "precision": "year",
    "answerYear": 1649,
    "decompositionHint": "Seven years after the civil war began, and the monarchy came back eleven years later. The same decade the Thirty Years War ended.",
    "source": "The National Archives (UK); Journal of the House of Commons"
  },
  {
    "id": "dates-lumiere-first-screening",
    "prompt": "On what date did the Lumiere brothers hold their first paying public film screening in Paris?",
    "precision": "day",
    "answerDate": "1895-12-28",
    "decompositionHint": "The same year X-rays were found, and right at the end of it. Cinema and the motor car arrive within a few years of each other.",
    "source": "Institut Lumiere, Lyon"
  },
  {
    "id": "dates-magellan-circumnavigation",
    "prompt": "In what year did the survivors of Magellan's expedition complete the first voyage around the world?",
    "precision": "year",
    "answerYear": 1522,
    "decompositionHint": "Three decades after Columbus crossed the Atlantic, and within a few years of Luther's theses. Magellan himself died on the way and never finished it.",
    "source": "Archivo General de Indias, Seville; Pigafetta's account"
  },
  {
    "id": "dates-versailles-treaty-signed",
    "prompt": "On what date was the Treaty of Versailles signed?",
    "precision": "day",
    "answerDate": "1919-06-28",
    "decompositionHint": "Deliberately signed on the fifth anniversary of the assassination that started the war, which fixes the day exactly if you know that one. Seven months after the armistice.",
    "source": "Archives diplomatiques, La Courneuve; League of Nations treaty series"
  },
  {
    "id": "dates-pluto-discovered",
    "prompt": "On what date was Pluto discovered?",
    "precision": "day",
    "answerDate": "1930-02-18",
    "decompositionHint": "Between the wars, and found by comparing photographic plates rather than by eye. Late winter in Arizona, with the long clear nights that needs.",
    "source": "Lowell Observatory archives"
  },
  {
    "id": "dates-nato-founded",
    "prompt": "In what year was NATO founded?",
    "precision": "year",
    "answerYear": 1949,
    "decompositionHint": "During the Berlin airlift, which is what prompted it, and a year before the Korean War. Four years after the Second World War ended.",
    "source": "North Atlantic Treaty; NATO archives"
  },
  {
    "id": "dates-first-mobile-phone-call",
    "prompt": "On what date did Martin Cooper make the first call from a handheld mobile phone?",
    "precision": "day",
    "answerDate": "1973-04-03",
    "decompositionHint": "A decade before anyone could buy one, and the same era as the first pocket calculators. Spring, on a New York street.",
    "source": "Motorola archives; IEEE Spectrum"
  },
  {
    "id": "dates-penny-black",
    "prompt": "In what year was the world's first adhesive postage stamp issued in Britain?",
    "precision": "year",
    "answerYear": 1840,
    "decompositionHint": "Early Victorian, just after the railways made cheap national post possible and a few years before the telegraph. Prepayment by the sender was the new idea.",
    "source": "The Postal Museum, London"
  },
  {
    "id": "dates-stalingrad-ends",
    "prompt": "In what year did the German Sixth Army surrender at Stalingrad?",
    "precision": "year",
    "answerYear": 1943,
    "decompositionHint": "Usually called the turning point in the east, and it is closer to the end of the war than the beginning. About sixteen months before the Normandy landings.",
    "source": "Bundesarchiv-Militaerarchiv; Russian State Military Archive"
  },
  {
    "id": "dates-first-folio-published",
    "prompt": "In what year was the first collected edition of Shakespeare's plays published?",
    "precision": "year",
    "answerYear": 1623,
    "decompositionHint": "Seven years after he died, put together by two of his actors. Half the plays in it had never been printed before, which is why it matters.",
    "source": "Folger Shakespeare Library; Stationers' Register"
  },
  {
    "id": "dates-mlk-assassinated",
    "prompt": "On what date was Martin Luther King shot in Memphis?",
    "precision": "day",
    "answerDate": "1968-04-04",
    "decompositionHint": "Under five years after his most famous speech, and two months before Robert Kennedy was shot. Early April.",
    "source": "United States National Archives; FBI investigative records"
  },
  {
    "id": "dates-bank-of-england-founded",
    "prompt": "In what year was the Bank of England founded?",
    "precision": "year",
    "answerYear": 1694,
    "decompositionHint": "Set up to lend the crown money for a war with France, a few years after the Glorious Revolution and a few years after Newton's Principia.",
    "source": "Bank of England Archive; Bank of England Act 1694"
  },
  {
    "id": "dates-indian-ocean-tsunami",
    "prompt": "On what date did the Indian Ocean earthquake and tsunami strike?",
    "precision": "day",
    "answerDate": "2004-12-26",
    "decompositionHint": "Right at the end of its year, which is why so much of the aid response ran into the following January. The same year Facebook launched.",
    "source": "United States Geological Survey; UN Office for the Coordination of Humanitarian Affairs"
  },
  {
    "id": "dates-english-civil-war-begins",
    "prompt": "In what year did the English Civil War begin?",
    "precision": "year",
    "answerYear": 1642,
    "decompositionHint": "Two decades after the Mayflower sailed, and the king was executed seven years into it. It overlaps the end of the Thirty Years War on the continent.",
    "source": "The National Archives (UK); Journals of the House of Lords"
  },
  {
    "id": "dates-voyager-1-launched",
    "prompt": "On what date was Voyager 1 launched?",
    "precision": "day",
    "answerDate": "1977-09-05",
    "decompositionHint": "It had to go when the outer planets lined up, which happens roughly every 175 years. Its twin went up a fortnight earlier, in late summer. The same year Star Wars came out.",
    "source": "NASA Jet Propulsion Laboratory"
  },
  {
    "id": "dates-curie-radium",
    "prompt": "In what year did Marie and Pierre Curie announce the discovery of radium?",
    "precision": "year",
    "answerYear": 1898,
    "decompositionHint": "Three years after X-rays and two after radioactivity itself. Right at the end of the century, before the atom was known to have a nucleus.",
    "source": "Comptes rendus de l'Academie des sciences, December 1898"
  },
  {
    "id": "dates-brexit-referendum",
    "prompt": "On what date did the United Kingdom vote to leave the European Union?",
    "precision": "day",
    "answerDate": "2016-06-23",
    "decompositionHint": "Leaving actually happened three and a half years later, so the vote is earlier than the date most people remember. British referendums are held on a Thursday, in summer.",
    "source": "UK Electoral Commission"
  },
  {
    "id": "dates-beethoven-ninth-premiere",
    "prompt": "On what date was Beethoven's Ninth Symphony first performed?",
    "precision": "day",
    "answerDate": "1824-05-07",
    "decompositionHint": "A decade after Waterloo, and he was completely deaf by then. Vienna's concert season runs through spring, and he died three years later.",
    "source": "Gesellschaft der Musikfreunde, Vienna"
  },
  {
    "id": "dates-eniac-unveiled",
    "prompt": "In what year was ENIAC, the first general-purpose electronic computer, unveiled to the public?",
    "precision": "year",
    "answerYear": 1946,
    "decompositionHint": "Just after the Second World War, which is what it was built for. The transistor was a year away, so it ran on thousands of valves.",
    "source": "University of Pennsylvania archives; United States Army Ordnance records"
  },
  {
    "id": "dates-louis-xvi-executed",
    "prompt": "On what date was Louis XVI executed in Paris?",
    "precision": "day",
    "answerDate": "1793-01-21",
    "decompositionHint": "Three and a half years after the Bastille, so the revolution took a while to get there. Depth of winter, at the start of a year.",
    "source": "Archives nationales (France)"
  },
  {
    "id": "dates-germany-invades-poland",
    "prompt": "On what date did Germany invade Poland?",
    "precision": "day",
    "answerDate": "1939-09-01",
    "decompositionHint": "Britain and France declared war two days later, which is the date often remembered instead. Campaigns are launched after the harvest and before the autumn mud.",
    "source": "Bundesarchiv; Instytut Pamieci Narodowej"
  },
  {
    "id": "dates-harvard-founded",
    "prompt": "In what year was Harvard founded?",
    "precision": "year",
    "answerYear": 1636,
    "decompositionHint": "Sixteen years after the Mayflower landed, so the colony was barely established. Five and a half centuries after teaching began at Oxford.",
    "source": "Harvard University Archives; Massachusetts General Court records"
  },
  {
    "id": "dates-bayeux-tapestry-made",
    "prompt": "Around what year was the Bayeux Tapestry made?",
    "precision": "century",
    "answerYear": 1077,
    "decompositionHint": "It is near-contemporary with the invasion it shows rather than a later retelling, so start from the Norman conquest and add a decade or so.",
    "source": "Musee de la Tapisserie de Bayeux; Centre Guillaume le Conquerant"
  },
  {
    "id": "dates-first-integrated-circuit",
    "prompt": "In what year did Jack Kilby demonstrate the first working integrated circuit?",
    "precision": "year",
    "answerYear": 1958,
    "decompositionHint": "About a decade after the transistor and a decade before the microprocessor. The same year as the first American satellite.",
    "source": "Texas Instruments archives; IEEE Milestones"
  },
  {
    "id": "dates-vienna-congress",
    "prompt": "In what year did the Congress of Vienna conclude, redrawing the map of Europe after Napoleon?",
    "precision": "year",
    "answerYear": 1815,
    "decompositionHint": "It was still sitting when Napoleon escaped from Elba, and finished days before the battle that ended him for good.",
    "source": "Haus-, Hof- und Staatsarchiv, Vienna; Final Act of the Congress"
  },
  {
    "id": "dates-sydney-opera-house-opens",
    "prompt": "On what date was the Sydney Opera House opened?",
    "precision": "day",
    "answerDate": "1973-10-20",
    "decompositionHint": "It took sixteen years and ran ten times over budget, so it is much later than the design competition. The southern spring, and the architect was not invited.",
    "source": "Sydney Opera House Trust; NSW State Archives"
  },
  {
    "id": "dates-glorious-revolution",
    "prompt": "In what year did William of Orange land in England and take the throne from James II?",
    "precision": "year",
    "answerYear": 1688,
    "decompositionHint": "A year after Newton's Principia and a few years before the Bank of England was founded. Four decades after Charles I was executed.",
    "source": "The National Archives (UK); Journals of the House of Commons"
  },
  {
    "id": "dates-tohoku-earthquake",
    "prompt": "On what date did the earthquake and tsunami strike north-east Japan and flood the Fukushima plant?",
    "precision": "day",
    "answerDate": "2011-03-11",
    "decompositionHint": "It was the year after the first iPad and the year of the Arab Spring. Early in the year, and the reactor meltdowns followed over the next four days.",
    "source": "Japan Meteorological Agency; IAEA report on the Fukushima Daiichi accident"
  },
  {
    "id": "dates-don-quixote-published",
    "prompt": "In what year was the first part of Don Quixote published?",
    "precision": "year",
    "answerYear": 1605,
    "decompositionHint": "The same handful of years as Hamlet, and Cervantes died within days of Shakespeare eleven years later. Two decades before the first Shakespeare folio.",
    "source": "Biblioteca Nacional de Espana; Madrid printing licence, 1604"
  },
  {
    "id": "dates-nyse-founded",
    "prompt": "In what year did the agreement that founded the New York Stock Exchange get signed under a buttonwood tree?",
    "precision": "year",
    "answerYear": 1792,
    "decompositionHint": "Just after the American constitution came into force and during the French Revolution. A century before the first skyscrapers went up around it.",
    "source": "New York Stock Exchange archives; the Buttonwood Agreement"
  },
  {
    "id": "dates-challenger-disaster",
    "prompt": "On what date did the shuttle Challenger break up shortly after launch?",
    "precision": "day",
    "answerDate": "1986-01-28",
    "decompositionHint": "The cold on the launch pad that morning is what caused it, so it is deep winter. Three months before Chernobyl.",
    "source": "Rogers Commission report; NASA"
  },
  {
    "id": "dates-opium-war-begins",
    "prompt": "In what year did the first Opium War between Britain and China begin?",
    "precision": "year",
    "answerYear": 1839,
    "decompositionHint": "It ended with Hong Kong being ceded three years later, which is the better-known date. Early Victorian, with steam warships new enough to be decisive.",
    "source": "The National Archives (UK), Foreign Office China correspondence"
  },
  {
    "id": "dates-guernica-painted",
    "prompt": "In what year did Picasso paint Guernica?",
    "precision": "year",
    "answerYear": 1937,
    "decompositionHint": "Painted within weeks of the bombing it is about, during the Spanish Civil War and two years before the wider war began.",
    "source": "Museo Nacional Centro de Arte Reina Sofia"
  },
  {
    "id": "dates-mariana-trench-first-dive",
    "prompt": "On what date did Trieste carry two men to the bottom of the Mariana Trench?",
    "precision": "day",
    "answerDate": "1960-01-23",
    "decompositionHint": "Between the first satellite and the first human spaceflight, and closer to the spaceflight. Nobody went back for over fifty years.",
    "source": "United States Navy; Piccard and Walsh dive records"
  },
  {
    "id": "dates-spanish-civil-war-begins",
    "prompt": "In what year did the Spanish Civil War begin?",
    "precision": "year",
    "answerYear": 1936,
    "decompositionHint": "It ran about three years and finished months before the Second World War started, which brackets it tightly from the far end.",
    "source": "Archivo General de la Administracion, Alcala de Henares"
  },
  {
    "id": "dates-statue-of-liberty-dedicated",
    "prompt": "On what date was the Statue of Liberty dedicated in New York harbour?",
    "precision": "day",
    "answerDate": "1886-10-28",
    "decompositionHint": "A French gift marking a centenary of independence, given a decade late. The Eiffel Tower, by the same engineer, came three years after it.",
    "source": "United States National Park Service"
  },
  {
    "id": "dates-korean-war-begins",
    "prompt": "In what year did the Korean War begin?",
    "precision": "year",
    "answerYear": 1950,
    "decompositionHint": "A year after NATO was founded and after China became a communist republic. The fighting stopped three years later with an armistice, not a peace.",
    "source": "United Nations Security Council Resolution 82; United States Army Center of Military History"
  },
  {
    "id": "dates-michelson-morley",
    "prompt": "In what year did Michelson and Morley fail to detect the ether that light was supposed to travel through?",
    "precision": "year",
    "answerYear": 1887,
    "decompositionHint": "Almost twenty years before Einstein explained the result, and the same decade as the Eiffel Tower and the first cars.",
    "source": "American Journal of Science, Michelson and Morley, 1887"
  },
  {
    "id": "dates-mtv-launches",
    "prompt": "On what date did MTV first go on air?",
    "precision": "day",
    "answerDate": "1981-08-01",
    "decompositionHint": "Four years before Live Aid and the same year as the first space shuttle flight. A channel launches at the start of a month, in this case at midnight.",
    "source": "MTV Networks; Federal Communications Commission records"
  },
  {
    "id": "dates-german-empire-proclaimed",
    "prompt": "In what year was the German empire proclaimed at Versailles?",
    "precision": "year",
    "answerYear": 1871,
    "decompositionHint": "It happened during a war with France, in the palace that later gave its name to the treaty ending the First World War. A decade after Italy unified.",
    "source": "Bundesarchiv; Deutsches Historisches Museum"
  },
  {
    "id": "dates-crimean-war-begins",
    "prompt": "In what year did the Crimean War begin?",
    "precision": "year",
    "answerYear": 1853,
    "decompositionHint": "It is the war of the Charge of the Light Brigade and of Florence Nightingale, and the first to be photographed and reported by telegraph. Just before the American Civil War.",
    "source": "The National Archives (UK), War Office records"
  },
  {
    "id": "dates-facebook-launched",
    "prompt": "On what date did Facebook first go online?",
    "precision": "day",
    "answerDate": "2004-02-04",
    "decompositionHint": "It started at one university and took years to open to everyone, so this is earlier than it feels. The same year as the Indian Ocean tsunami. Early in the year.",
    "source": "Meta Platforms; Harvard Crimson contemporary reporting"
  },
  {
    "id": "dates-pride-and-prejudice",
    "prompt": "In what year was Pride and Prejudice first published?",
    "precision": "year",
    "answerYear": 1813,
    "decompositionHint": "During the Napoleonic wars and a couple of years before Waterloo. Written much earlier than it was printed, which is why it feels older.",
    "source": "British Library; Egerton first edition, 1813"
  },
  {
    "id": "dates-suez-crisis",
    "prompt": "In what year did Britain, France and Israel attack Egypt over the nationalised Suez Canal?",
    "precision": "year",
    "answerYear": 1956,
    "decompositionHint": "The same weeks as the Soviet invasion of Hungary, and a year before the first satellite. Nearly ninety years after the canal opened.",
    "source": "The National Archives (UK), Cabinet papers; UN General Assembly records"
  },
  {
    "id": "dates-book-of-kells",
    "prompt": "Around what year was the Book of Kells made?",
    "precision": "century",
    "answerYear": 800,
    "decompositionHint": "Made in an Irish or Scottish monastery at about the time the Viking raids began, which is why it was moved inland. Charlemagne was being crowned.",
    "source": "Trinity College Dublin, MS 58"
  },
  {
    "id": "dates-ve-day",
    "prompt": "On what date did Germany's surrender take effect, ending the war in Europe?",
    "precision": "day",
    "answerDate": "1945-05-08",
    "decompositionHint": "Three months before the war with Japan ended, and a week after Hitler died. Russia marks it a day later because of the time difference when it was signed.",
    "source": "United States National Archives; instrument of surrender, Reims and Berlin"
  },
  {
    "id": "dates-sagrada-familia-begun",
    "prompt": "In what year did construction of the Sagrada Familia in Barcelona begin?",
    "precision": "year",
    "answerYear": 1882,
    "decompositionHint": "Gaudi took it over a year later and worked on it until he died in 1926, so it started before his involvement. Contemporary with the Eiffel Tower.",
    "source": "Junta Constructora del Temple Expiatori de la Sagrada Familia"
  },
  {
    "id": "dates-munich-agreement",
    "prompt": "In what year did Britain and France agree at Munich to let Germany take the Sudetenland?",
    "precision": "year",
    "answerYear": 1938,
    "decompositionHint": "Almost exactly a year before the invasion of Poland, which is the tightest bracket available. Autumn.",
    "source": "The National Archives (UK), Prime Minister's Office papers"
  },
  {
    "id": "dates-moby-dick-published",
    "prompt": "In what year was Moby-Dick first published?",
    "precision": "year",
    "answerYear": 1851,
    "decompositionHint": "The same year as the Great Exhibition in London, and a decade before the American Civil War. Whaling was still a major industry.",
    "source": "Houghton Library, Harvard; Harper and Brothers first American edition"
  },
  {
    "id": "dates-mendeleev-periodic-table",
    "prompt": "In what year did Mendeleev publish his periodic table of the elements?",
    "precision": "year",
    "answerYear": 1869,
    "decompositionHint": "The same year the Suez Canal opened and the American transcontinental railroad was joined. The electron was still thirty years off, so nobody knew why it worked.",
    "source": "Russian Chemical Society, Zhurnal Russkogo Khimicheskogo Obshchestva, 1869"
  },
  {
    "id": "dates-easter-rising",
    "prompt": "In what year was the Easter Rising in Dublin?",
    "precision": "year",
    "answerYear": 1916,
    "decompositionHint": "Halfway through the First World War, which is precisely why it was attempted then. The Irish Free State followed six years later.",
    "source": "National Archives of Ireland; Bureau of Military History witness statements"
  },
  {
    "id": "dates-smallpox-eradicated",
    "prompt": "In what year was smallpox declared eradicated worldwide?",
    "precision": "year",
    "answerYear": 1980,
    "decompositionHint": "The last natural case was in 1977, and the declaration came a few years after that once the search found nothing. Nearly two centuries after the first vaccination.",
    "source": "World Health Assembly resolution WHA33.3; World Health Organization"
  },
  {
    "id": "dates-battle-of-britain",
    "prompt": "In what year was the Battle of Britain fought?",
    "precision": "year",
    "answerYear": 1940,
    "decompositionHint": "It followed straight on from the fall of France and the evacuation at Dunkirk, in the summer after the war began.",
    "source": "The National Archives (UK), Air Ministry records; RAF Museum"
  },
  {
    "id": "dates-first-lhc-beam",
    "prompt": "On what date was the first beam of protons circulated in the Large Hadron Collider?",
    "precision": "day",
    "answerDate": "2008-09-10",
    "decompositionHint": "It broke down nine days later and took over a year to repair, so the physics did not start until well after this. Four years before the Higgs announcement.",
    "source": "CERN press office"
  },
  {
    "id": "dates-bitcoin-white-paper",
    "prompt": "On what date was the Bitcoin white paper first posted to a cryptography mailing list?",
    "precision": "day",
    "answerDate": "2008-10-31",
    "decompositionHint": "Weeks after Lehman Brothers collapsed, which the design is a reaction to. The first block was mined about ten weeks later. Right at the end of a month.",
    "source": "The Cryptography Mailing List archive; bitcoin.org"
  },
  {
    "id": "dates-italian-unification",
    "prompt": "In what year was the Kingdom of Italy proclaimed?",
    "precision": "year",
    "answerYear": 1861,
    "decompositionHint": "The same year the American Civil War began, and a decade before Germany unified. Rome itself did not join for another nine years.",
    "source": "Archivio Centrale dello Stato, Rome"
  },
  {
    "id": "dates-notre-dame-begun",
    "prompt": "Around what year did construction of Notre-Dame de Paris begin?",
    "precision": "decade",
    "answerYear": 1163,
    "decompositionHint": "Gothic building starts in the twelfth century, so it is a century after the Norman conquest and a generation before Magna Carta. It took about two hundred years.",
    "source": "Centre des monuments nationaux; Diocese of Paris records"
  },
  {
    "id": "dates-columbia-disaster",
    "prompt": "On what date did the shuttle Columbia break up on re-entry?",
    "precision": "day",
    "answerDate": "2003-02-01",
    "decompositionHint": "Seventeen years after the Challenger loss, and the programme ended eight years later. Early in the year, right at the start of a month.",
    "source": "Columbia Accident Investigation Board report; NASA"
  },
  {
    "id": "dates-rwandan-genocide",
    "prompt": "In what year did the genocide in Rwanda take place?",
    "precision": "year",
    "answerYear": 1994,
    "decompositionHint": "The same months Mandela was elected president of South Africa, which is the useful anchor. It lasted about a hundred days.",
    "source": "International Criminal Tribunal for Rwanda; United Nations"
  },
  {
    "id": "dates-notre-dame-fire",
    "prompt": "On what date did fire destroy the roof and spire of Notre-Dame de Paris?",
    "precision": "day",
    "answerDate": "2019-04-15",
    "decompositionHint": "It happened during Holy Week, which fixes it to a few days if you know Easter fell late that year. The year before the pandemic.",
    "source": "Ministere de la Culture (France); Paris prosecutor's investigation"
  },
  {
    "id": "dates-tiananmen-square",
    "prompt": "In what year did the Chinese army clear the protests in Tiananmen Square?",
    "precision": "year",
    "answerYear": 1989,
    "decompositionHint": "Five months before the Berlin Wall opened, in the same year of upheaval. The protests had run for about seven weeks before the army moved.",
    "source": "United States Department of State, Office of the Historian; contemporary diplomatic cables"
  },
  {
    "id": "dates-coca-cola-invented",
    "prompt": "In what year was Coca-Cola first sold in an Atlanta pharmacy?",
    "precision": "year",
    "answerYear": 1886,
    "decompositionHint": "The same year the Statue of Liberty was dedicated, and a few years before the Eiffel Tower. Late Victorian, when patent medicines were still sold at soda fountains.",
    "source": "Coca-Cola Company archives; Atlanta Journal contemporary advertisements"
  },
  {
    "id": "dates-halleys-comet-predicted-return",
    "prompt": "In what year did Halley's comet return as predicted, confirming Newton's laws for comets?",
    "precision": "year",
    "answerYear": 1758,
    "decompositionHint": "Halley worked it out from Newton's laws but died sixteen years before it arrived, so the return is well after his lifetime. Mid-eighteenth century, before the American revolution.",
    "source": "Royal Society; Paris Observatory records"
  },
  {
    "id": "dates-first-jet-airliner-service",
    "prompt": "In what year did the first jet airliner enter scheduled passenger service?",
    "precision": "year",
    "answerYear": 1952,
    "decompositionHint": "Under a decade after the Second World War, and the aircraft was grounded two years later after a series of crashes. Two decades before the jumbo jet.",
    "source": "British Overseas Airways Corporation records; Royal Aeronautical Society"
  },
  {
    "id": "dates-maastricht-treaty",
    "prompt": "In what year was the Maastricht Treaty signed, creating the European Union?",
    "precision": "year",
    "answerYear": 1992,
    "decompositionHint": "A year after the Soviet Union dissolved, and a decade before the euro appeared as cash. The single market opened the year after it was signed.",
    "source": "European Union treaty archive; Council of the European Union"
  },
  {
    "id": "dates-iranian-revolution",
    "prompt": "In what year did the Iranian revolution overthrow the Shah?",
    "precision": "year",
    "answerYear": 1979,
    "decompositionHint": "The embassy hostage crisis began in the same year and ran into 1981, which brackets it. The Soviet invasion of Afghanistan was months later.",
    "source": "United States Department of State, Office of the Historian; Iranian national archives"
  },
  {
    "id": "dates-first-talking-picture",
    "prompt": "In what year was The Jazz Singer released, bringing synchronised speech to feature films?",
    "precision": "year",
    "answerYear": 1927,
    "decompositionHint": "Cinema had been silent for about thirty years by then, and colour was another decade off. Two years before the Wall Street crash.",
    "source": "Academy of Motion Picture Arts and Sciences; Warner Bros. records"
  },
  {
    "id": "dates-lewis-and-clark-depart",
    "prompt": "In what year did Lewis and Clark set out to cross the continent to the Pacific?",
    "precision": "year",
    "answerYear": 1804,
    "decompositionHint": "It followed directly from the Louisiana Purchase the year before, which is what made the land American to explore. Napoleon was being crowned emperor.",
    "source": "American Philosophical Society, Lewis and Clark journals"
  },
  {
    "id": "dates-san-francisco-earthquake",
    "prompt": "On what date did the earthquake and fire destroy much of San Francisco?",
    "precision": "day",
    "answerDate": "1906-04-18",
    "decompositionHint": "Three years after the first powered flight and six before the Titanic. It struck before dawn in spring, and the fires burned for three days.",
    "source": "United States Geological Survey; California State Archives"
  },
  {
    "id": "dates-act-of-union-scotland",
    "prompt": "In what year did the parliaments of England and Scotland unite into one?",
    "precision": "year",
    "answerYear": 1707,
    "decompositionHint": "The crowns had already been shared for a century by then, so this is the later, political union. Just after the Bank of England was founded.",
    "source": "The National Archives (UK); Records of the Parliaments of Scotland"
  },
  {
    "id": "dates-kennedy-assassinated",
    "prompt": "On what date was John F. Kennedy shot in Dallas?",
    "precision": "day",
    "answerDate": "1963-11-22",
    "decompositionHint": "Three months after the March on Washington and just under two years after the Cuban missile crisis. Late November, days before Thanksgiving.",
    "source": "United States National Archives, Warren Commission records"
  },
  {
    "id": "dates-battle-of-tours",
    "prompt": "In what year did Charles Martel turn back an Arab army near Tours?",
    "precision": "year",
    "answerYear": 732,
    "decompositionHint": "A century after Muhammad's migration to Medina, and about seventy years before Charlemagne was crowned. Islam had reached Spain twenty years earlier.",
    "source": "Chronicle of 754; Cambridge Medieval History"
  },
  {
    "id": "dates-lincoln-assassinated",
    "prompt": "On what date was Abraham Lincoln shot at Ford's Theatre?",
    "precision": "day",
    "answerDate": "1865-04-14",
    "decompositionHint": "Five days after the main Confederate surrender, which is the tightest bracket there is. Good Friday that year.",
    "source": "United States National Archives; War Department records"
  },
  {
    "id": "dates-eclipse-confirms-relativity",
    "prompt": "On what date did a solar eclipse expedition confirm that starlight bends around the Sun?",
    "precision": "day",
    "answerDate": "1919-05-29",
    "decompositionHint": "It had to wait for a total eclipse with bright stars behind the Sun, and for the war to end so the expeditions could sail. Six months after the armistice.",
    "source": "Royal Society and Royal Astronomical Society joint meeting, November 1919"
  },
  {
    "id": "dates-us-constitution-signed",
    "prompt": "On what date was the United States Constitution signed in Philadelphia?",
    "precision": "day",
    "answerDate": "1787-09-17",
    "decompositionHint": "Eleven years after independence was declared and four after the war ended, so the country ran without it for a while. The convention sat through a Philadelphia summer.",
    "source": "United States National Archives"
  },
  {
    "id": "dates-first-world-cup",
    "prompt": "In what year was the first football World Cup held?",
    "precision": "year",
    "answerYear": 1930,
    "decompositionHint": "Between the wars, and the tournament has been every four years since apart from two missed for the Second World War - so count back from one you know.",
    "source": "FIFA archives; Uruguayan Football Association"
  },
  {
    "id": "dates-henry-viii-breaks-with-rome",
    "prompt": "In what year did the Act of Supremacy make the English king head of the church?",
    "precision": "year",
    "answerYear": 1534,
    "decompositionHint": "Seventeen years after Luther's theses, so England was late to the argument and joined it for its own reasons. The monasteries were dissolved within a few years.",
    "source": "The National Archives (UK); Statutes of the Realm"
  },
  {
    "id": "dates-curiosity-lands-on-mars",
    "prompt": "On what date did the Curiosity rover land on Mars?",
    "precision": "day",
    "answerDate": "2012-08-06",
    "decompositionHint": "The landing used a sky crane, which was new, and it was watched live a month after the Higgs announcement. Launch windows to Mars open every twenty-six months.",
    "source": "NASA Jet Propulsion Laboratory"
  },
  {
    "id": "dates-anaesthesia-demonstrated",
    "prompt": "On what date was ether anaesthesia first publicly demonstrated in surgery?",
    "precision": "day",
    "answerDate": "1846-10-16",
    "decompositionHint": "Two decades before antiseptic surgery, so operations were painless before they were clean. Mid-Victorian, the same year Neptune was found.",
    "source": "Massachusetts General Hospital archives; Boston Medical and Surgical Journal"
  },
  {
    "id": "dates-emancipation-proclamation",
    "prompt": "On what date did the Emancipation Proclamation take effect?",
    "precision": "day",
    "answerDate": "1863-01-01",
    "decompositionHint": "Announced the previous September to take effect at a clean break in the calendar. Two years into the Civil War and two years before it ended.",
    "source": "United States National Archives"
  },
  {
    "id": "dates-hubble-expanding-universe",
    "prompt": "In what year did Edwin Hubble publish the evidence that the universe is expanding?",
    "precision": "year",
    "answerYear": 1929,
    "decompositionHint": "Only a few years after it was settled that other galaxies exist at all. The same year as the Wall Street crash.",
    "source": "Proceedings of the National Academy of Sciences, Hubble, 1929"
  },
  {
    "id": "dates-trafalgar",
    "prompt": "On what date did Nelson defeat the French and Spanish fleets off Cape Trafalgar?",
    "precision": "day",
    "answerDate": "1805-10-21",
    "decompositionHint": "A decade before Waterloo, and in the same year Napoleon was preparing to invade Britain. Autumn, and Nelson died in the battle.",
    "source": "The National Archives (UK), Admiralty records; National Maritime Museum"
  },
  {
    "id": "dates-first-spacewalk",
    "prompt": "On what date did Alexei Leonov make the first spacewalk?",
    "precision": "day",
    "answerDate": "1965-03-18",
    "decompositionHint": "Four years after the first human spaceflight and four before the Moon landing, almost exactly in between. His suit swelled and he barely got back inside.",
    "source": "Russian State Archive of Scientific and Technical Documentation; Voskhod 2 records"
  },
  {
    "id": "dates-st-petersburg-founded",
    "prompt": "In what year did Peter the Great found St Petersburg?",
    "precision": "year",
    "answerYear": 1703,
    "decompositionHint": "Right at the start of a century, during a long war with Sweden that the city was built to face. Four years before England and Scotland united.",
    "source": "Russian State Historical Archive; Peter the Great's founding decree"
  },
  {
    "id": "dates-nixon-resigns",
    "prompt": "On what date did Richard Nixon resign the presidency?",
    "precision": "day",
    "answerDate": "1974-08-09",
    "decompositionHint": "Just over two years after the break-in that caused it, and a year before Saigon fell. High summer.",
    "source": "United States National Archives, Nixon Presidential Library"
  },
  {
    "id": "dates-first-tour-de-france",
    "prompt": "In what year was the first Tour de France held?",
    "precision": "year",
    "answerYear": 1903,
    "decompositionHint": "The same year as the first powered flight, and it was invented to sell newspapers. Bicycles were modern technology at the time; cars barely existed.",
    "source": "Amaury Sport Organisation; L'Auto contemporary editions"
  },
  {
    "id": "dates-battle-of-bosworth",
    "prompt": "In what year did Richard III die at Bosworth, ending the Wars of the Roses?",
    "precision": "year",
    "answerYear": 1485,
    "decompositionHint": "Seven years before Columbus sailed and three decades after Constantinople fell. Printing had just reached England.",
    "source": "The National Archives (UK); Crowland Chronicle"
  },
  {
    "id": "dates-berlin-conference",
    "prompt": "In what year did the Berlin Conference begin carving up Africa between European powers?",
    "precision": "year",
    "answerYear": 1884,
    "decompositionHint": "Late Victorian, a couple of years before the Statue of Liberty and half a decade before the Eiffel Tower. Most of the continent was colonised in the twenty years after it.",
    "source": "Bundesarchiv; General Act of the Berlin Conference"
  },
  {
    "id": "dates-cosmic-microwave-background",
    "prompt": "In what year was the cosmic microwave background accidentally discovered?",
    "precision": "year",
    "answerYear": 1964,
    "decompositionHint": "Found as unexplained noise in a radio antenna, and it settled the argument for the Big Bang. Between the first spaceflight and the Moon landing.",
    "source": "Astrophysical Journal, Penzias and Wilson, 1965; Nokia Bell Labs archives"
  },
  {
    "id": "dates-appomattox-surrender",
    "prompt": "On what date did Lee surrender to Grant at Appomattox?",
    "precision": "day",
    "answerDate": "1865-04-09",
    "decompositionHint": "Four years almost to the month after the war began at Fort Sumter, and five days before Lincoln was shot. Early spring.",
    "source": "United States National Park Service; War Department records"
  },
  {
    "id": "dates-first-shuttle-flight",
    "prompt": "On what date did the first space shuttle launch?",
    "precision": "day",
    "answerDate": "1981-04-12",
    "decompositionHint": "Deliberately flown on the twentieth anniversary of the first human spaceflight, which gives you the day if you know that one. Six years after the last Apollo flight.",
    "source": "NASA; STS-1 mission record"
  },
  {
    "id": "dates-oxygen-isolated",
    "prompt": "In what year did Joseph Priestley isolate the gas later named oxygen?",
    "precision": "year",
    "answerYear": 1774,
    "decompositionHint": "Two years before the American Declaration of Independence, and Lavoisier named and explained it within a few years. The steam engine was being improved at the same time.",
    "source": "Royal Society, Philosophical Transactions, Priestley, 1775"
  },
  {
    "id": "dates-kristallnacht",
    "prompt": "On what date did the coordinated attacks on Jewish shops and synagogues across Germany take place?",
    "precision": "day",
    "answerDate": "1938-11-09",
    "decompositionHint": "Six weeks after the Munich agreement and ten months before the invasion of Poland. Late autumn, overnight.",
    "source": "Bundesarchiv; United States Holocaust Memorial Museum"
  },
  {
    "id": "dates-victoria-accedes",
    "prompt": "On what date did Victoria become queen?",
    "precision": "day",
    "answerDate": "1837-06-20",
    "decompositionHint": "She reigned sixty-three years and died in 1901, which gives you the start by subtraction. She was eighteen, and woken before dawn to be told.",
    "source": "Royal Archives, Windsor; London Gazette"
  },
  {
    "id": "dates-london-underground-opens",
    "prompt": "In what year did the first underground railway open in London?",
    "precision": "year",
    "answerYear": 1863,
    "decompositionHint": "Steam trains in tunnels, decades before electrification made it bearable. During the American Civil War, and forty years before the New York subway.",
    "source": "London Transport Museum; Metropolitan Railway records"
  },
  {
    "id": "dates-panama-canal-opens",
    "prompt": "On what date did the Panama Canal open to traffic?",
    "precision": "day",
    "answerDate": "1914-08-15",
    "decompositionHint": "It opened in the same weeks the First World War began, which buried the news. Forty-five years after the Suez Canal.",
    "source": "Panama Canal Authority; United States National Archives"
  },
  {
    "id": "dates-nuremberg-trials-begin",
    "prompt": "In what year did the main Nuremberg trial of Nazi leaders begin?",
    "precision": "year",
    "answerYear": 1945,
    "decompositionHint": "It started within months of the war ending and ran into the following autumn. The United Nations was founded in the same year.",
    "source": "International Military Tribunal records; United States National Archives"
  },
  {
    "id": "dates-first-exoplanet-sunlike-star",
    "prompt": "In what year was the first planet found orbiting an ordinary sun-like star?",
    "precision": "year",
    "answerYear": 1995,
    "decompositionHint": "Thousands are known now, but the first is more recent than most people guess - the web was about a year old. It was a giant planet orbiting in four days, which nobody expected.",
    "source": "Nature, Mayor and Queloz, 1995; Observatoire de Geneve"
  },
  {
    "id": "dates-yorktown-surrender",
    "prompt": "On what date did Cornwallis surrender at Yorktown?",
    "precision": "day",
    "answerDate": "1781-10-19",
    "decompositionHint": "Five years after independence was declared, and the treaty ending the war took another two. Campaigning season ends in autumn.",
    "source": "United States National Archives; United States Army Center of Military History"
  },
  {
    "id": "dates-sharpeville-massacre",
    "prompt": "In what year did South African police shoot protesters at Sharpeville?",
    "precision": "year",
    "answerYear": 1960,
    "decompositionHint": "It is what turned the ANC to armed resistance, two years before Mandela was jailed. The start of a decade, and of the wider African independence year.",
    "source": "South African History Archive; UN Security Council Resolution 134"
  },
  {
    "id": "dates-dunkirk-evacuation",
    "prompt": "In what year were British and French troops evacuated from Dunkirk?",
    "precision": "year",
    "answerYear": 1940,
    "decompositionHint": "It came directly before the Battle of Britain in the same summer, so they are the same year. Eight months after the war began.",
    "source": "The National Archives (UK), Admiralty records; Imperial War Museum"
  },
  {
    "id": "dates-first-mri-human-scan",
    "prompt": "In what year was the first MRI scan of a living person taken?",
    "precision": "year",
    "answerYear": 1977,
    "decompositionHint": "A few years after the CT scanner and a decade before the technique was common in hospitals. The first scan took nearly five hours.",
    "source": "Physics in Medicine and Biology; Downstate Medical Center records"
  },
  {
    "id": "dates-meiji-restoration",
    "prompt": "In what year did the Meiji Restoration return power to the Japanese emperor?",
    "precision": "year",
    "answerYear": 1868,
    "decompositionHint": "About fifteen years after American ships forced Japan open to trade, and it is what made the country industrialise within a generation.",
    "source": "National Archives of Japan; Charter Oath"
  },
  {
    "id": "dates-gravitational-waves-detected",
    "prompt": "On what date were gravitational waves first directly detected?",
    "precision": "day",
    "answerDate": "2015-09-14",
    "decompositionHint": "The announcement came five months later, so the detection is earlier than the date most people remember. A century after Einstein predicted them.",
    "source": "LIGO Scientific Collaboration; Physical Review Letters, 2016"
  },
  {
    "id": "dates-little-bighorn",
    "prompt": "On what date was Custer's force destroyed at the Little Bighorn?",
    "precision": "day",
    "answerDate": "1876-06-25",
    "decompositionHint": "The same summer as the American centennial celebrations, which is how the news landed. Plains campaigning happens in the warm months.",
    "source": "United States National Park Service; Army Court of Inquiry, 1879"
  },
  {
    "id": "dates-insulin-first-used",
    "prompt": "In what year was insulin first used to treat a patient with diabetes?",
    "precision": "year",
    "answerYear": 1922,
    "decompositionHint": "Between the wars, and the Nobel prize followed within a year of the first patient. The same year Tutankhamun's tomb was found.",
    "source": "University of Toronto archives; Canadian Medical Association Journal, 1922"
  },
  {
    "id": "dates-reunification-of-germany",
    "prompt": "On what date did East and West Germany formally reunify?",
    "precision": "day",
    "answerDate": "1990-10-03",
    "decompositionHint": "Under a year after the Wall opened, which is faster than almost anyone expected at the time. It is still the German national holiday.",
    "source": "Bundesarchiv; Unification Treaty"
  },
  {
    "id": "dates-salk-polio-vaccine",
    "prompt": "In what year was the Salk polio vaccine announced to be safe and effective?",
    "precision": "year",
    "answerYear": 1955,
    "decompositionHint": "The trial was the largest ever run at the time. Two years after the structure of DNA and two before the first satellite.",
    "source": "University of Michigan; Francis Field Trial report, 1955"
  },
  {
    "id": "dates-chinese-republic-founded",
    "prompt": "In what year did the last Chinese emperor abdicate and a republic replace the empire?",
    "precision": "year",
    "answerYear": 1912,
    "decompositionHint": "The same year the Titanic sank. Two thousand one hundred and thirty-three years of imperial rule ended, counting from the first unification.",
    "source": "Academia Historica, Taipei; abdication edict of the Xuantong Emperor"
  },
  {
    "id": "dates-watergate-break-in",
    "prompt": "On what date were burglars caught inside the Democratic headquarters at the Watergate?",
    "precision": "day",
    "answerDate": "1972-06-17",
    "decompositionHint": "It was an election year and the president won it comfortably months later, so this is well before the scandal took hold. Just over two years before he resigned.",
    "source": "United States National Archives; District of Columbia court records"
  },
  {
    "id": "dates-wimbledon-first-championship",
    "prompt": "In what year was the first Wimbledon championship played?",
    "precision": "year",
    "answerYear": 1877,
    "decompositionHint": "Late Victorian, two decades before the first modern Olympics and a year after the telephone. Only men played, on grass, for a silver cup.",
    "source": "All England Lawn Tennis Club archives"
  },
  {
    "id": "dates-arab-spring-begins",
    "prompt": "In what year did the protests known as the Arab Spring begin in Tunisia?",
    "precision": "year",
    "answerYear": 2010,
    "decompositionHint": "It began in December and most of the governments fell the following year, so the start is a year earlier than it is usually remembered. The year before the Japanese tsunami.",
    "source": "United Nations Human Rights Council reports; contemporary Tunisian government records"
  },
  {
    "id": "dates-hoover-dam-completed",
    "prompt": "In what year was the Hoover Dam completed?",
    "precision": "year",
    "answerYear": 1936,
    "decompositionHint": "Built through the Depression as public works, and finished two years ahead of schedule. Five years after the Empire State Building and three before the war.",
    "source": "United States Bureau of Reclamation"
  },
  {
    "id": "dates-darwin-beagle-sails",
    "prompt": "In what year did Darwin sail from England aboard the Beagle?",
    "precision": "year",
    "answerYear": 1831,
    "decompositionHint": "He was twenty-two and the voyage lasted five years. His book came nearly three decades after he got home, which is the gap worth remembering.",
    "source": "Cambridge University Library, Darwin Correspondence Project; Admiralty records"
  },
  {
    "id": "dates-faraday-induction",
    "prompt": "In what year did Michael Faraday demonstrate electromagnetic induction?",
    "precision": "year",
    "answerYear": 1831,
    "decompositionHint": "Half a century before power stations, and it is the principle every generator still uses. Early Victorian, before the telegraph and before photography was announced.",
    "source": "Royal Institution of Great Britain, Faraday's diary"
  },
  {
    "id": "dates-first-iss-module",
    "prompt": "On what date was the first module of the International Space Station launched?",
    "precision": "day",
    "answerDate": "1998-11-20",
    "decompositionHint": "The first crew did not move in for another two years, so the station existed before anyone lived on it. Late in the year, on a Russian rocket.",
    "source": "NASA; Roscosmos, Zarya launch record"
  },
  {
    "id": "dates-taiping-rebellion-begins",
    "prompt": "In what year did the Taiping Rebellion begin in southern China?",
    "precision": "year",
    "answerYear": 1850,
    "decompositionHint": "It ran fourteen years and killed more people than the First World War, overlapping the American Civil War entirely. A decade after the first Opium War.",
    "source": "First Historical Archives of China; Cambridge History of China vol. 10"
  },
  {
    "id": "dates-gold-rush-california",
    "prompt": "In what year did the California gold rush begin?",
    "precision": "year",
    "answerYear": 1848,
    "decompositionHint": "Gold was found in January and the crowds arrived the following year, which is where the nickname for the prospectors comes from. The year of revolutions in Europe.",
    "source": "California State Archives; Sutter's Mill contemporary accounts"
  },
  {
    "id": "dates-1984-published",
    "prompt": "In what year was Orwell's Nineteen Eighty-Four published?",
    "precision": "year",
    "answerYear": 1949,
    "decompositionHint": "Written just after the Second World War, during the Berlin airlift, and he died within a year of it appearing. The title is the year of writing with two digits swapped.",
    "source": "British Library; Secker and Warburg first edition"
  },
  {
    "id": "dates-sydney-harbour-bridge",
    "prompt": "On what date was the Sydney Harbour Bridge opened?",
    "precision": "day",
    "answerDate": "1932-03-19",
    "decompositionHint": "Built through the Depression and opened four decades before the Opera House beside it. The southern end of summer.",
    "source": "NSW State Archives; Sydney Harbour Bridge Act records"
  },
  {
    "id": "dates-prcs-founded",
    "prompt": "On what date was the People's Republic of China proclaimed in Beijing?",
    "precision": "day",
    "answerDate": "1949-10-01",
    "decompositionHint": "Four years after the Second World War ended, after a civil war that resumed once Japan was beaten. It is still the national day, at the start of a month.",
    "source": "Central People's Government of the PRC founding proclamation"
  },
  {
    "id": "dates-six-day-war",
    "prompt": "In what year was the Six-Day War fought?",
    "precision": "year",
    "answerYear": 1967,
    "decompositionHint": "Nineteen years after Israel was founded and six years before the next major war there. The same year as the first heart transplant.",
    "source": "Israel State Archives; UN Security Council Resolution 242"
  },
  {
    "id": "dates-crispr-gene-editing-paper",
    "prompt": "In what year was the paper published showing CRISPR could be used to edit DNA?",
    "precision": "year",
    "answerYear": 2012,
    "decompositionHint": "It won the Nobel prize eight years later, which is unusually fast. The same year the Higgs boson was announced.",
    "source": "Science, Jinek, Chylinski, Charpentier and Doudna, 2012"
  },
  {
    "id": "dates-pasteurisation-patented",
    "prompt": "In what year did Pasteur patent the heating process that carries his name?",
    "precision": "year",
    "answerYear": 1865,
    "decompositionHint": "It was developed for wine and beer before milk, during the American Civil War. Two years before antiseptic surgery and a few before germ theory was accepted.",
    "source": "Institut Pasteur archives; French patent records"
  },
  {
    "id": "dates-lister-antiseptic-surgery",
    "prompt": "In what year did Joseph Lister publish his results using carbolic acid to prevent surgical infection?",
    "precision": "year",
    "answerYear": 1867,
    "decompositionHint": "Two decades after anaesthesia, so surgery was painless long before it stopped killing people afterwards. Just after Pasteur's work on fermentation.",
    "source": "The Lancet, Lister, 1867; Royal College of Surgeons"
  },
  {
    "id": "dates-alaska-purchase",
    "prompt": "In what year did the United States buy Alaska from Russia?",
    "precision": "year",
    "answerYear": 1867,
    "decompositionHint": "Two years after the American Civil War ended, and it was widely mocked at the time. Gold was found there three decades later.",
    "source": "United States National Archives; Treaty of Cession"
  },
  {
    "id": "dates-stanley-finds-livingstone",
    "prompt": "In what year did Stanley find Livingstone at Ujiji on Lake Tanganyika?",
    "precision": "year",
    "answerYear": 1871,
    "decompositionHint": "Mid-Victorian, the same year Germany unified, and it was a newspaper stunt as much as an expedition. Livingstone died two years later, still in Africa.",
    "source": "Royal Geographical Society; New York Herald contemporary despatches"
  },
  {
    "id": "dates-mexican-revolution-begins",
    "prompt": "In what year did the Mexican Revolution begin?",
    "precision": "year",
    "answerYear": 1910,
    "decompositionHint": "It ran for about a decade and overlapped the First World War entirely. Right at the start of a decade, after thirty years of one president.",
    "source": "Archivo General de la Nacion, Mexico"
  },
  {
    "id": "dates-boxer-rebellion",
    "prompt": "In what year did the Boxer Rebellion besiege the foreign legations in Beijing?",
    "precision": "year",
    "answerYear": 1900,
    "decompositionHint": "A famously round number, and a decade before the empire fell. It is between the Sino-Japanese and Russo-Japanese wars.",
    "source": "First Historical Archives of China; The National Archives (UK), Foreign Office records"
  },
  {
    "id": "dates-second-boer-war-begins",
    "prompt": "In what year did the Second Boer War begin?",
    "precision": "year",
    "answerYear": 1899,
    "decompositionHint": "Right at the end of a century, and it ran into the next one for about two and a half years. Concentration camps take their name from it.",
    "source": "The National Archives (UK), War Office records; South African National Archives"
  },
  {
    "id": "dates-russo-japanese-war",
    "prompt": "In what year did the Russo-Japanese War begin?",
    "precision": "year",
    "answerYear": 1904,
    "decompositionHint": "It was the first modern war an Asian power won against a European one, and the defeat helped trigger the 1905 revolution in Russia. A decade before the First World War.",
    "source": "Japan Center for Asian Historical Records; Treaty of Portsmouth"
  },
  {
    "id": "dates-new-york-subway-opens",
    "prompt": "On what date did the New York subway open?",
    "precision": "day",
    "answerDate": "1904-10-27",
    "decompositionHint": "Four decades after London's, and electric from the start rather than steam. Autumn, and it ran from City Hall.",
    "source": "New York Transit Museum; Interborough Rapid Transit Company records"
  },
  {
    "id": "dates-indian-rebellion-1857",
    "prompt": "In what year did the Indian Rebellion against Company rule break out?",
    "precision": "year",
    "answerYear": 1857,
    "decompositionHint": "It ended the East India Company's rule and put India directly under the crown the following year. Between the Crimean War and the American Civil War.",
    "source": "National Archives of India; The National Archives (UK), India Office records"
  },
  {
    "id": "dates-continental-drift-proposed",
    "prompt": "In what year did Alfred Wegener first propose that the continents had drifted apart?",
    "precision": "year",
    "answerYear": 1912,
    "decompositionHint": "It was rejected for about fifty years until sea-floor spreading explained how. The same year the Titanic sank.",
    "source": "Geologische Rundschau, Wegener, 1912; Alfred Wegener Institute"
  },
  {
    "id": "dates-first-nuclear-test",
    "prompt": "In what year was the first nuclear weapon tested?",
    "precision": "year",
    "answerYear": 1945,
    "decompositionHint": "Three weeks before the first one was used on a city, which brackets it tightly. In the New Mexico desert, before dawn.",
    "source": "United States Department of Energy; Manhattan Project records"
  },
  {
    "id": "dates-bretton-woods",
    "prompt": "In what year did the Bretton Woods conference set up the post-war financial system?",
    "precision": "year",
    "answerYear": 1944,
    "decompositionHint": "Held while the war was still being fought, a month after the Normandy landings. The IMF and World Bank both come from it.",
    "source": "United States Department of State; IMF archives"
  },
  {
    "id": "dates-solidarity-founded",
    "prompt": "In what year was the Solidarity trade union founded in Poland?",
    "precision": "year",
    "answerYear": 1980,
    "decompositionHint": "It grew out of a shipyard strike in Gdansk, was banned within about sixteen months, and helped end communist rule nine years later.",
    "source": "Instytut Pamieci Narodowej; Gdansk Agreement"
  },
  {
    "id": "dates-gorbachev-takes-power",
    "prompt": "In what year did Mikhail Gorbachev become leader of the Soviet Union?",
    "precision": "year",
    "answerYear": 1985,
    "decompositionHint": "A year before Chernobyl and four years before the Berlin Wall opened, both of which happened on his watch. Three predecessors had died in as many years.",
    "source": "Russian State Archive of Contemporary History; CPSU Central Committee plenum records"
  },
  {
    "id": "dates-bannister-four-minute-mile",
    "prompt": "On what date did Roger Bannister first run a mile in under four minutes?",
    "precision": "day",
    "answerDate": "1954-05-06",
    "decompositionHint": "A year after Everest was climbed, and the record was broken again within six weeks. Track season starts in late spring, and the wind dropped that evening.",
    "source": "World Athletics; Oxford University Athletic Club records"
  },
  {
    "id": "dates-amritsar-massacre",
    "prompt": "In what year did British troops open fire on a crowd at Jallianwala Bagh in Amritsar?",
    "precision": "year",
    "answerYear": 1919,
    "decompositionHint": "The year after the First World War ended, and it is what turned Gandhi decisively against British rule. The Treaty of Versailles was signed the same year.",
    "source": "The National Archives (UK), India Office records; Hunter Commission report"
  },
  {
    "id": "dates-salt-march",
    "prompt": "In what year did Gandhi lead the Salt March to the sea?",
    "precision": "year",
    "answerYear": 1930,
    "decompositionHint": "Between the wars, seventeen years before independence and a decade after Amritsar. The march itself took about three and a half weeks.",
    "source": "National Archives of India; Gandhi Heritage Portal"
  },
  {
    "id": "dates-long-march-begins",
    "prompt": "In what year did the Chinese communists begin the Long March?",
    "precision": "year",
    "answerYear": 1934,
    "decompositionHint": "Fifteen years before they took power, and it is what made Mao leader of the party. Between the wars, and it took about a year.",
    "source": "Central Archives of China; Cambridge History of China vol. 13"
  },
  {
    "id": "dates-warsaw-pact-founded",
    "prompt": "In what year was the Warsaw Pact founded?",
    "precision": "year",
    "answerYear": 1955,
    "decompositionHint": "A direct answer to West Germany joining NATO, so it is six years after NATO itself. The same year as the Salk polio vaccine.",
    "source": "Bundesarchiv; treaty text, Warsaw, May 1955"
  },
  {
    "id": "dates-prague-spring",
    "prompt": "In what year did Warsaw Pact troops crush the reforms of the Prague Spring?",
    "precision": "year",
    "answerYear": 1968,
    "decompositionHint": "The same year as the Paris protests and the Tet Offensive. The reforms had run about eight months before the tanks arrived in August.",
    "source": "Czech National Archives; Russian State Archive of Contemporary History"
  },
  {
    "id": "dates-camp-david-accords",
    "prompt": "In what year were the Camp David Accords between Egypt and Israel agreed?",
    "precision": "year",
    "answerYear": 1978,
    "decompositionHint": "Five years after the last war between them, and the formal treaty followed six months later. The year before the Iranian revolution.",
    "source": "Jimmy Carter Presidential Library; Israel State Archives"
  },
  {
    "id": "dates-apollo-13",
    "prompt": "In what year did an oxygen tank explode on the way to the Moon, forcing Apollo 13 to turn back?",
    "precision": "year",
    "answerYear": 1970,
    "decompositionHint": "The third mission aimed at a landing, less than a year after the first one succeeded. Four more landings followed after it.",
    "source": "NASA; Apollo 13 Review Board report"
  },
  {
    "id": "dates-human-genome-draft",
    "prompt": "In what year was the first draft of the human genome announced?",
    "precision": "year",
    "answerYear": 2000,
    "decompositionHint": "A famously round number, announced jointly by a public project and a private company. The finished version came three years later.",
    "source": "National Human Genome Research Institute; White House announcement, June 2000"
  },
  {
    "id": "dates-new-horizons-pluto",
    "prompt": "On what date did New Horizons fly past Pluto?",
    "precision": "day",
    "answerDate": "2015-07-14",
    "decompositionHint": "It launched nine years earlier, while Pluto was still a planet, and was demoted en route. Mid-July, and the pictures took months to come back.",
    "source": "NASA; Johns Hopkins Applied Physics Laboratory"
  },
  {
    "id": "dates-paris-climate-agreement",
    "prompt": "In what year was the Paris climate agreement adopted?",
    "precision": "year",
    "answerYear": 2015,
    "decompositionHint": "Adopted in December at the end of a two-week conference, and it came into force the following year. The same year gravitational waves were first detected.",
    "source": "United Nations Framework Convention on Climate Change"
  },
  {
    "id": "dates-egypt-unified",
    "prompt": "Around what year was Upper and Lower Egypt first unified under one king?",
    "precision": "century",
    "answerYear": -3100,
    "decompositionHint": "It is the start of dynastic Egypt, about five centuries before the Great Pyramid and roughly contemporary with the first writing in Mesopotamia.",
    "source": "British Museum, Department of Egypt and Sudan; Shaw, The Oxford History of Ancient Egypt"
  },
  {
    "id": "dates-wheel-for-transport",
    "prompt": "Around what year did the wheel first come into use for transport?",
    "precision": "century",
    "answerYear": -3500,
    "decompositionHint": "It is later than farming and pottery by thousands of years, and earlier than the pyramids by about a thousand. The potter's wheel came first.",
    "source": "Anthony, The Horse, the Wheel, and Language; Ljubljana Marshes wheel dating"
  },
  {
    "id": "dates-thera-eruption",
    "prompt": "Around what year did the volcanic eruption on Thera devastate the Minoan world?",
    "precision": "century",
    "answerYear": -1600,
    "decompositionHint": "Radiocarbon and Egyptian records disagree by about a century, which is why this is asked loosely. Bronze Age, well before Greece as anyone would recognise it.",
    "source": "Friedrich et al., Science, 2006; British School at Athens"
  },
  {
    "id": "dates-bronze-age-collapse",
    "prompt": "Around what year did the Bronze Age civilisations of the eastern Mediterranean collapse?",
    "precision": "century",
    "answerYear": -1200,
    "decompositionHint": "It is what separates Mycenaean Greece from classical Greece, with a dark age of several centuries in between. Roughly when the Hittite empire vanished.",
    "source": "Cline, 1177 BC: The Year Civilization Collapsed; Cambridge Ancient History vol. II"
  },
  {
    "id": "dates-cyrus-takes-babylon",
    "prompt": "In what year did Cyrus the Great take Babylon?",
    "precision": "year",
    "answerYear": -539,
    "decompositionHint": "It ends Babylon as an independent power and starts the Persian empire that Greece fought fifty years later. Within a generation of Confucius being born.",
    "source": "Nabonidus Chronicle, British Museum; Cyrus Cylinder"
  },
  {
    "id": "dates-socrates-executed",
    "prompt": "In what year was Socrates put to death in Athens?",
    "precision": "year",
    "answerYear": -399,
    "decompositionHint": "Just after Athens lost the long war with Sparta, which is part of why the city turned on him. Plato was in his twenties; Alexander was not born for another forty years.",
    "source": "Plato, Apology; Oxford Classical Dictionary"
  },
  {
    "id": "dates-homer-composed",
    "prompt": "Around what year were the Iliad and the Odyssey first written down?",
    "precision": "century",
    "answerYear": -750,
    "decompositionHint": "Centuries after the Bronze Age war they describe, and about when the Greek alphabet appears - the two are connected. Near the traditional founding of Rome.",
    "source": "West, The Making of the Iliad; Oxford Classical Dictionary"
  },
  {
    "id": "dates-ashoka-reign-begins",
    "prompt": "Around what year did the emperor Ashoka come to the throne in India?",
    "precision": "decade",
    "answerYear": -268,
    "decompositionHint": "Two generations after Alexander reached the Indus, and about the time Rome was fighting Carthage. His carved edicts are how the dates are fixed.",
    "source": "Ashokan edicts; Thapar, Asoka and the Decline of the Mauryas"
  },
  {
    "id": "dates-roman-conquest-of-britain",
    "prompt": "In what year did the Romans under Claudius invade and begin to conquer Britain?",
    "precision": "year",
    "answerYear": 43,
    "decompositionHint": "Caesar had raided it a century earlier without staying. Hadrian's Wall came about eighty years after this, which brackets it from the far side.",
    "source": "Cassius Dio, Roman History LX; Britannia journal"
  },
  {
    "id": "dates-constantinople-founded",
    "prompt": "In what year was Constantinople dedicated as the new Roman capital?",
    "precision": "year",
    "answerYear": 330,
    "decompositionHint": "A few years after the council at Nicaea, by the same emperor. It stood as a capital for over eleven hundred years after this.",
    "source": "Chronicon Paschale; Oxford Dictionary of Byzantium"
  },
  {
    "id": "dates-tang-dynasty-founded",
    "prompt": "In what year was the Tang dynasty founded in China?",
    "precision": "year",
    "answerYear": 618,
    "decompositionHint": "Within a few years of Muhammad's migration to Medina, and it ran for about three centuries. Printing and gunpowder both come from the era it began.",
    "source": "Jiu Tang Shu; Cambridge History of China vol. 3"
  },
  {
    "id": "dates-umayyad-conquest-of-spain",
    "prompt": "In what year did Muslim armies cross from Africa and begin the conquest of Spain?",
    "precision": "year",
    "answerYear": 711,
    "decompositionHint": "About twenty years before the advance was stopped in central France, and eight centuries before the last Muslim kingdom in Spain fell.",
    "source": "Chronicle of 754; Collins, The Arab Conquest of Spain"
  },
  {
    "id": "dates-baghdad-founded",
    "prompt": "Around what year was Baghdad founded as the Abbasid capital?",
    "precision": "decade",
    "answerYear": 762,
    "decompositionHint": "A generation after the Muslim advance into Europe was halted, and a generation before Charlemagne was crowned. It became the largest city in the world within a century.",
    "source": "al-Tabari, History of the Prophets and Kings; Encyclopaedia of Islam"
  },
  {
    "id": "dates-song-dynasty-founded",
    "prompt": "In what year was the Song dynasty founded in China?",
    "precision": "year",
    "answerYear": 960,
    "decompositionHint": "A round number, and about a century before the Norman conquest. Paper money, movable type and the compass all spread under it.",
    "source": "Song Shi; Cambridge History of China vol. 5"
  },
  {
    "id": "dates-norse-reach-north-america",
    "prompt": "Around what year did Norse voyagers first reach North America?",
    "precision": "century",
    "answerYear": 1000,
    "decompositionHint": "Five centuries before Columbus, and the settlement at L'Anse aux Meadows has been dated by tree rings. Roughly when Iceland converted to Christianity.",
    "source": "Parks Canada, L'Anse aux Meadows; Kuitems et al., Nature, 2021"
  },
  {
    "id": "dates-mali-empire-founded",
    "prompt": "Around what year was the Mali empire founded in West Africa?",
    "precision": "century",
    "answerYear": 1235,
    "decompositionHint": "A century before its best-known ruler made his pilgrimage to Mecca, and roughly when Genghis Khan's successors were moving west.",
    "source": "Levtzion, Ancient Ghana and Mali; Epic of Sundiata oral tradition"
  },
  {
    "id": "dates-great-zimbabwe",
    "prompt": "Around what year was Great Zimbabwe at its height?",
    "precision": "century",
    "answerYear": 1300,
    "decompositionHint": "Medieval rather than ancient - roughly contemporary with the great European cathedrals, and abandoned before the Portuguese arrived on the coast.",
    "source": "UNESCO World Heritage nomination; National Museums and Monuments of Zimbabwe"
  },
  {
    "id": "dates-ming-dynasty-founded",
    "prompt": "In what year was the Ming dynasty founded in China?",
    "precision": "year",
    "answerYear": 1368,
    "decompositionHint": "It replaced Mongol rule, two decades after the Black Death reached Europe. The treasure fleets and the Forbidden City both come about half a century later.",
    "source": "Ming Shilu; Cambridge History of China vol. 7"
  },
  {
    "id": "dates-cortes-reaches-tenochtitlan",
    "prompt": "In what year did Cortes first enter the Aztec capital?",
    "precision": "year",
    "answerYear": 1519,
    "decompositionHint": "Just under three decades after Columbus crossed, and the city fell two years later. Luther had published his theses two years before.",
    "source": "Archivo General de Indias, Seville; Cortes, Cartas de Relacion"
  },
  {
    "id": "dates-pizarro-captures-atahualpa",
    "prompt": "In what year did Pizarro capture the Inca ruler Atahualpa at Cajamarca?",
    "precision": "year",
    "answerYear": 1532,
    "decompositionHint": "About thirteen years after Cortes reached the Aztec capital, so Peru falls after Mexico. Henry VIII was breaking with Rome at the time.",
    "source": "Archivo General de Indias, Seville; Xerez, Verdadera relacion"
  },
  {
    "id": "dates-copernicus-published",
    "prompt": "In what year was Copernicus's book placing the Sun at the centre published?",
    "precision": "year",
    "answerYear": 1543,
    "decompositionHint": "Published as he was dying, and it took another sixty years and a telescope before the argument really started. A generation after Luther's theses.",
    "source": "Bayerische Staatsbibliothek; De revolutionibus orbium coelestium, Nuremberg"
  },
  {
    "id": "dates-vesalius-anatomy",
    "prompt": "In what year did Vesalius publish his illustrated study of human anatomy?",
    "precision": "year",
    "answerYear": 1543,
    "decompositionHint": "It appeared in the same year as the book that moved the Earth, which is a coincidence historians enjoy. Based on dissection rather than on ancient authority.",
    "source": "De humani corporis fabrica, Basel; Wellcome Collection"
  },
  {
    "id": "dates-ivan-crowned-tsar",
    "prompt": "In what year was Ivan the Terrible crowned as the first tsar of Russia?",
    "precision": "year",
    "answerYear": 1547,
    "decompositionHint": "Mid-sixteenth century, while Henry VIII was dying in England. He was sixteen, and reigned for another thirty-seven years.",
    "source": "Russian State Archive of Ancient Acts; Nikon Chronicle"
  },
  {
    "id": "dates-tokugawa-shogunate-founded",
    "prompt": "In what year was the Tokugawa shogunate established in Japan?",
    "precision": "year",
    "answerYear": 1603,
    "decompositionHint": "It lasted until the Meiji restoration, which gives you the span of two and a half centuries to count back from. Elizabeth I died the same year.",
    "source": "National Archives of Japan; Tokugawa Jikki"
  },
  {
    "id": "dates-jamestown-founded",
    "prompt": "In what year was Jamestown, the first lasting English settlement in America, founded?",
    "precision": "year",
    "answerYear": 1607,
    "decompositionHint": "Thirteen years before the Mayflower, which is the settlement people usually name first. Shakespeare was still writing.",
    "source": "Virginia Company records; Preservation Virginia, Jamestown Rediscovery"
  },
  {
    "id": "dates-qing-take-beijing",
    "prompt": "In what year did the Manchu Qing take Beijing and replace the Ming?",
    "precision": "year",
    "answerYear": 1644,
    "decompositionHint": "The same years as the English Civil War. The dynasty it started ran until the republic in 1912, which is a useful span to count back.",
    "source": "Qing Shilu; Cambridge History of China vol. 9"
  },
  {
    "id": "dates-great-plague-of-london",
    "prompt": "In what year did the last great outbreak of plague hit London?",
    "precision": "year",
    "answerYear": 1665,
    "decompositionHint": "The Great Fire came the year after, which is the tightest bracket available. Three centuries after the Black Death.",
    "source": "London Metropolitan Archives, Bills of Mortality"
  },
  {
    "id": "dates-siege-of-vienna-1683",
    "prompt": "In what year did an Ottoman siege of Vienna fail, marking the limit of their advance into Europe?",
    "precision": "year",
    "answerYear": 1683,
    "decompositionHint": "Two centuries and a bit after they took Constantinople, and a few years before Newton's Principia. It is the high-water mark of Ottoman Europe.",
    "source": "Haus-, Hof- und Staatsarchiv, Vienna; Ottoman campaign registers"
  },
  {
    "id": "dates-handel-messiah-premiere",
    "prompt": "In what year was Handel's Messiah first performed, in Dublin?",
    "precision": "year",
    "answerYear": 1742,
    "decompositionHint": "Mid-eighteenth century, a generation before the American revolution. Bach was still alive and working in Leipzig.",
    "source": "Royal Irish Academy of Music; Dublin Journal contemporary advertisements"
  },
  {
    "id": "dates-battle-of-plassey",
    "prompt": "In what year did the East India Company's victory at Plassey give it control of Bengal?",
    "precision": "year",
    "answerYear": 1757,
    "decompositionHint": "A century before the rebellion that ended Company rule, which is the span to count back from. During the Seven Years War.",
    "source": "The National Archives (UK), India Office records; National Archives of India"
  },
  {
    "id": "dates-watt-separate-condenser",
    "prompt": "In what year did James Watt patent the separate condenser that made steam engines efficient?",
    "precision": "year",
    "answerYear": 1769,
    "decompositionHint": "Engines already existed for pumping water out of mines; this made them worth using for anything else. A few years before the American revolution.",
    "source": "UK Patent Office records; Birmingham Archives, Boulton and Watt collection"
  },
  {
    "id": "dates-cook-reaches-australia",
    "prompt": "In what year did Cook chart the eastern coast of Australia?",
    "precision": "year",
    "answerYear": 1770,
    "decompositionHint": "The first convict fleet arrived eighteen years later, which brackets it from the far side. The voyage was mainly sent to observe a transit of Venus.",
    "source": "National Library of Australia, Cook's Endeavour journal"
  },
  {
    "id": "dates-first-manned-balloon-flight",
    "prompt": "On what date did two men make the first free flight in a hot air balloon over Paris?",
    "precision": "day",
    "answerDate": "1783-11-21",
    "decompositionHint": "A hundred and twenty years before the Wright brothers, and in the same years as the American revolution ending. Late in the year, after months of unmanned tests.",
    "source": "Academie des sciences, Paris; Musee de l'Air et de l'Espace"
  },
  {
    "id": "dates-mozart-dies",
    "prompt": "On what date did Mozart die in Vienna?",
    "precision": "day",
    "answerDate": "1791-12-05",
    "decompositionHint": "He was thirty-five and left the Requiem unfinished. The French Revolution was two years old. Early December, and he was buried in a common grave.",
    "source": "Vienna city death register; Mozarteum Foundation, Salzburg"
  },
  {
    "id": "dates-haiti-independence",
    "prompt": "On what date did Haiti declare independence after the only successful slave revolt to found a state?",
    "precision": "day",
    "answerDate": "1804-01-01",
    "decompositionHint": "The revolt began in 1791 and took thirteen years, so this is the end rather than the beginning. Declarations are made on the first of a year.",
    "source": "Archives Nationales d'Haiti; Declaration of Independence, Gonaives"
  },
  {
    "id": "dates-greek-independence-war",
    "prompt": "In what year did the Greek war of independence against Ottoman rule begin?",
    "precision": "year",
    "answerYear": 1821,
    "decompositionHint": "Six years after Waterloo, and Byron died fighting in it three years in. Independence was recognised about a decade later.",
    "source": "General State Archives of Greece; Treaty of Constantinople, 1832"
  },
  {
    "id": "dates-monroe-doctrine",
    "prompt": "In what year was the Monroe Doctrine set out, warning Europe away from the Americas?",
    "precision": "year",
    "answerYear": 1823,
    "decompositionHint": "Just after most of Spanish America won independence, which is what prompted it. A decade after the war of 1812 and four decades before the Civil War.",
    "source": "United States National Archives; annual message to Congress, December 1823"
  },
  {
    "id": "dates-thirteenth-amendment",
    "prompt": "In what year was slavery abolished throughout the United States by constitutional amendment?",
    "precision": "year",
    "answerYear": 1865,
    "decompositionHint": "It came at the very end of the Civil War, after the Emancipation Proclamation which only covered the rebelling states. Three decades after the British act.",
    "source": "United States National Archives; Thirteenth Amendment ratification records"
  },
  {
    "id": "dates-first-impressionist-exhibition",
    "prompt": "In what year did the first Impressionist exhibition open in Paris?",
    "precision": "year",
    "answerYear": 1874,
    "decompositionHint": "Just after the Franco-Prussian war, and the name came from a hostile review of one painting. Photography was thirty-five years old, which is part of the story.",
    "source": "Musee d'Orsay; Societe anonyme des artistes exhibition catalogue"
  },
  {
    "id": "dates-nutcracker-premiere",
    "prompt": "In what year was Tchaikovsky's Nutcracker first performed?",
    "precision": "year",
    "answerYear": 1892,
    "decompositionHint": "Late Victorian, a couple of years before the composer died and a few years after the Eiffel Tower. It was not a success at the time.",
    "source": "Mariinsky Theatre archives, St Petersburg"
  },
  {
    "id": "dates-the-scream-painted",
    "prompt": "In what year did Munch paint the first version of The Scream?",
    "precision": "year",
    "answerYear": 1893,
    "decompositionHint": "A few years after Van Gogh's Starry Night and a decade before Picasso's blue period. Cinema was two years away.",
    "source": "Nasjonalmuseet, Oslo; Munch Museum"
  },
  {
    "id": "dates-first-ferris-wheel",
    "prompt": "In what year did the original Ferris wheel turn at the Chicago world's fair?",
    "precision": "year",
    "answerYear": 1893,
    "decompositionHint": "Built to answer the Eiffel Tower of four years earlier, which is the anchor. Late Victorian, before cars and before cinema.",
    "source": "Chicago History Museum; World's Columbian Exposition records"
  },
  {
    "id": "dates-starry-night-painted",
    "prompt": "In what year did Van Gogh paint The Starry Night?",
    "precision": "year",
    "answerYear": 1889,
    "decompositionHint": "Painted from an asylum window about a year before he died, and the same year the Eiffel Tower was finished.",
    "source": "Museum of Modern Art, New York; Van Gogh Museum correspondence"
  },
  {
    "id": "dates-demoiselles-davignon",
    "prompt": "In what year did Picasso paint Les Demoiselles d'Avignon?",
    "precision": "year",
    "answerYear": 1907,
    "decompositionHint": "Usually taken as the start of cubism, a few years after the Wright brothers flew. He kept it in his studio for years before showing it.",
    "source": "Museum of Modern Art, New York; Musee Picasso, Paris"
  },
  {
    "id": "dates-trans-siberian-completed",
    "prompt": "In what year was the Trans-Siberian Railway completed along its full route?",
    "precision": "year",
    "answerYear": 1916,
    "decompositionHint": "Begun in the 1890s and finished during the First World War, a year before the revolution. The last stretch was the bridge over the Amur.",
    "source": "Russian State Historical Archive; Russian Railways"
  },
  {
    "id": "dates-duchamp-fountain",
    "prompt": "In what year did Duchamp submit a urinal to an art exhibition under the title Fountain?",
    "precision": "year",
    "answerYear": 1917,
    "decompositionHint": "During the First World War, in New York rather than Europe. A decade after Picasso's cubist breakthrough.",
    "source": "Philadelphia Museum of Art; Society of Independent Artists records"
  },
  {
    "id": "dates-ulysses-published",
    "prompt": "In what year was Joyce's Ulysses first published?",
    "precision": "year",
    "answerYear": 1922,
    "decompositionHint": "Published in Paris because it was banned elsewhere, four years after the First World War ended. The same year the Irish Free State was founded.",
    "source": "National Library of Ireland; Shakespeare and Company first edition"
  },
  {
    "id": "dates-great-gatsby-published",
    "prompt": "In what year was The Great Gatsby published?",
    "precision": "year",
    "answerYear": 1925,
    "decompositionHint": "Set and written in the middle of the decade it is famous for, and it sold poorly at the time. Four years before the Wall Street crash it seems to anticipate.",
    "source": "Princeton University Library, Fitzgerald papers; Scribner first edition"
  },
  {
    "id": "dates-snow-white-released",
    "prompt": "In what year was Snow White, the first feature-length animated film, released?",
    "precision": "year",
    "answerYear": 1937,
    "decompositionHint": "Deep in the Depression and two years before the war, when nobody believed audiences would sit through a cartoon that long. A decade after sound came to film.",
    "source": "Academy of Motion Picture Arts and Sciences; Walt Disney Archives"
  },
  {
    "id": "dates-citizen-kane-released",
    "prompt": "In what year was Citizen Kane released?",
    "precision": "year",
    "answerYear": 1941,
    "decompositionHint": "Made before America entered the Second World War, by a director of twenty-five. Four years after the first feature-length animation.",
    "source": "Academy of Motion Picture Arts and Sciences; RKO Pictures records"
  },
  {
    "id": "dates-fellowship-of-the-ring-published",
    "prompt": "In what year was The Fellowship of the Ring first published?",
    "precision": "year",
    "answerYear": 1954,
    "decompositionHint": "Seventeen years after The Hobbit, and the three volumes came out over about a year. The same year as the first four-minute mile.",
    "source": "Bodleian Library, Oxford, Tolkien archive; Allen and Unwin records"
  },
  {
    "id": "dates-elvis-first-record",
    "prompt": "In what year did Elvis Presley make his first commercial record at Sun Studio?",
    "precision": "year",
    "answerYear": 1954,
    "decompositionHint": "A decade before the Beatles reached America. Television was spreading fast, which is most of why it travelled.",
    "source": "Sun Records; Country Music Hall of Fame archives"
  },
  {
    "id": "dates-to-kill-a-mockingbird",
    "prompt": "In what year was To Kill a Mockingbird published?",
    "precision": "year",
    "answerYear": 1960,
    "decompositionHint": "Four years before the Civil Rights Act, and the film followed two years after the book. A round number at the start of a decade.",
    "source": "Library of Congress; J. B. Lippincott first edition"
  },
  {
    "id": "dates-beatles-ed-sullivan",
    "prompt": "On what date did the Beatles first appear on American television on the Ed Sullivan Show?",
    "precision": "day",
    "answerDate": "1964-02-09",
    "decompositionHint": "Under three months after the Kennedy assassination, and a Sunday evening in winter. Seventy-three million people watched.",
    "source": "CBS broadcast records; Library of Congress"
  },
  {
    "id": "dates-sgt-pepper-released",
    "prompt": "In what year was Sgt. Pepper's Lonely Hearts Club Band released?",
    "precision": "year",
    "answerYear": 1967,
    "decompositionHint": "Three years after the band first played in America, and three before they split. The same year as the first heart transplant.",
    "source": "EMI Archive Trust; Parlophone release records"
  },
  {
    "id": "dates-woodstock",
    "prompt": "In what year was the Woodstock festival held?",
    "precision": "year",
    "answerYear": 1969,
    "decompositionHint": "The same summer as the Moon landing, about a month after it. Half a million people turned up for a site expecting a fraction of that.",
    "source": "Bethel Woods Center for the Arts archives; Sullivan County records"
  },
  {
    "id": "dates-rumble-in-the-jungle",
    "prompt": "In what year did Ali beat Foreman in Kinshasa in the fight called the Rumble in the Jungle?",
    "precision": "year",
    "answerYear": 1974,
    "decompositionHint": "Seven years after Ali was stripped of the title for refusing the draft, and the year Nixon resigned. Fought at dawn for American television.",
    "source": "World Boxing Council records; contemporary Zairean government records"
  },
  {
    "id": "dates-jaws-released",
    "prompt": "In what year was Jaws released?",
    "precision": "year",
    "answerYear": 1975,
    "decompositionHint": "Usually called the first summer blockbuster, two years before Star Wars. The same year Saigon fell.",
    "source": "Academy of Motion Picture Arts and Sciences; Universal Pictures records"
  },
  {
    "id": "dates-thriller-released",
    "prompt": "In what year was Michael Jackson's Thriller released?",
    "precision": "year",
    "answerYear": 1982,
    "decompositionHint": "A year after MTV launched, which is most of why it sold what it did. Three years before Live Aid.",
    "source": "Recording Industry Association of America; Epic Records release records"
  },
  {
    "id": "dates-yugoslavia-breaks-up",
    "prompt": "In what year did Slovenia and Croatia declare independence, beginning the break-up of Yugoslavia?",
    "precision": "year",
    "answerYear": 1991,
    "decompositionHint": "The same year the Soviet Union dissolved, and two years after the Berlin Wall opened. The Bosnian war started the following spring.",
    "source": "United Nations Security Council records; Badinter Arbitration Committee opinions"
  },
  {
    "id": "dates-gulf-war-begins",
    "prompt": "In what year did the coalition air campaign to drive Iraq out of Kuwait begin?",
    "precision": "year",
    "answerYear": 1991,
    "decompositionHint": "The invasion of Kuwait was the previous August, and the ground war lasted about a hundred hours. The Soviet Union still existed, just.",
    "source": "UN Security Council Resolution 678; United States Department of Defense records"
  },
  {
    "id": "dates-srebrenica",
    "prompt": "In what year did the massacre at Srebrenica take place?",
    "precision": "year",
    "answerYear": 1995,
    "decompositionHint": "In the last months of the Bosnian war, which ended with an agreement that December. A year after the Rwandan genocide.",
    "source": "International Criminal Tribunal for the former Yugoslavia judgments"
  },
  {
    "id": "dates-toy-story-released",
    "prompt": "In what year was Toy Story, the first entirely computer-animated feature, released?",
    "precision": "year",
    "answerYear": 1995,
    "decompositionHint": "The same year the web was becoming common and the first exoplanet was found. Nearly sixty years after the first hand-drawn animated feature.",
    "source": "Academy of Motion Picture Arts and Sciences; Pixar Animation Studios"
  },
  {
    "id": "dates-first-harry-potter-published",
    "prompt": "In what year was the first Harry Potter book published?",
    "precision": "year",
    "answerYear": 1997,
    "decompositionHint": "The same year Hong Kong was handed back and Dolly the sheep was announced. The first print run was five hundred copies.",
    "source": "British Library; Bloomsbury Publishing records"
  },
  {
    "id": "dates-kyoto-protocol",
    "prompt": "In what year was the Kyoto Protocol agreed?",
    "precision": "year",
    "answerYear": 1997,
    "decompositionHint": "It took another eight years to come into force, so the agreement is earlier than it is usually remembered. Eighteen years before the Paris agreement.",
    "source": "United Nations Framework Convention on Climate Change"
  },
  {
    "id": "dates-burj-khalifa-opens",
    "prompt": "In what year did the Burj Khalifa open?",
    "precision": "year",
    "answerYear": 2010,
    "decompositionHint": "Just after the financial crisis, which nearly stopped it. The tower it overtook, Taipei 101, had held the record for about six years.",
    "source": "Council on Tall Buildings and Urban Habitat; Emaar Properties"
  },
  {
    "id": "dates-persepolis-begun",
    "prompt": "Around what year did Darius begin building Persepolis?",
    "precision": "decade",
    "answerYear": -518,
    "decompositionHint": "A generation before the Persian invasions of Greece, and Alexander burned it about two centuries later. Roughly when the Roman republic was founded.",
    "source": "Oriental Institute, University of Chicago; Persepolis Fortification Archive"
  },
  {
    "id": "dates-silk-road-opens",
    "prompt": "Around what year did Zhang Qian's mission west open the route later called the Silk Road?",
    "precision": "decade",
    "answerYear": -130,
    "decompositionHint": "Han dynasty China, about a century after the first unification and while Rome was finishing off Carthage.",
    "source": "Sima Qian, Shiji; Cambridge History of China vol. 1"
  },
  {
    "id": "dates-boudica-revolt",
    "prompt": "Around what year did Boudica lead a revolt against Roman rule in Britain?",
    "precision": "decade",
    "answerYear": 60,
    "decompositionHint": "About twenty years after the Roman conquest began, and sixty before Hadrian's Wall. Nero was emperor.",
    "source": "Tacitus, Annals XIV; Cassius Dio, Roman History LXII"
  },
  {
    "id": "dates-plague-of-justinian",
    "prompt": "Around what year did the plague pandemic named after Justinian reach Constantinople?",
    "precision": "decade",
    "answerYear": 541,
    "decompositionHint": "A few years after the Hagia Sophia was finished, under the same emperor. Eight centuries before the Black Death, and probably the same disease.",
    "source": "Procopius, History of the Wars II; Little, Plague and the End of Antiquity"
  },
  {
    "id": "dates-timur-sacks-delhi",
    "prompt": "Around what year did Timur sack Delhi?",
    "precision": "decade",
    "answerYear": 1398,
    "decompositionHint": "Right at the end of the fourteenth century, half a century after the Black Death and a generation before the Ming treasure fleets.",
    "source": "Zafarnama of Sharaf al-Din Yazdi; Cambridge History of India"
  },
  {
    "id": "dates-council-of-trent",
    "prompt": "Around what year did the Council of Trent open to answer the Protestant reformation?",
    "precision": "decade",
    "answerYear": 1545,
    "decompositionHint": "Nearly three decades after Luther's theses, which is the point: it took a long time to respond. It sat on and off for eighteen years.",
    "source": "Archivio Apostolico Vaticano; Canons and Decrees of the Council of Trent"
  },
  {
    "id": "dates-dutch-declare-independence",
    "prompt": "In what year did the northern Dutch provinces formally renounce Spanish rule?",
    "precision": "year",
    "answerYear": 1581,
    "decompositionHint": "Seven years before the Spanish Armada sailed against England, in the same long war. Spain did not accept it for another sixty-seven years.",
    "source": "Nationaal Archief, The Hague; Act of Abjuration"
  },
  {
    "id": "dates-phoenician-alphabet",
    "prompt": "Around what year did the Phoenician alphabet come into use?",
    "precision": "century",
    "answerYear": -1050,
    "decompositionHint": "Just after the Bronze Age collapse, and the Greek and Latin alphabets both descend from it. Two millennia after the first writing in Mesopotamia.",
    "source": "British Museum, Department of the Middle East; Ahiram sarcophagus inscription"
  },
  {
    "id": "dates-euclid-elements",
    "prompt": "Around what year was Euclid's Elements written?",
    "precision": "century",
    "answerYear": -300,
    "decompositionHint": "Alexandria under the early Ptolemies, shortly after Alexander's empire broke up. It stayed the standard geometry textbook for over two thousand years.",
    "source": "Oxford Classical Dictionary; Heath, The Thirteen Books of Euclid's Elements"
  }
]

if (typeof module !== "undefined") module.exports = DATES
