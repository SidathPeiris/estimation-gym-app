// World Records: the question bank.
//
// Same engine as Fermi Questions - a number, log-distance scoring, four bands -
// and the same schema, checked by the same code in tools/bank-check.js. What
// differs is what makes a question belong here at all.
//
// --- the selection rule, which is the whole game ---------------------------
//
// Bullseye is 0.3 decades, which is a factor of two. So "what is the men's
// 100m world record?" is not a question: every plausible answer between 4.8
// and 19.2 seconds scores full marks, and the player learns nothing about
// their own estimating. The same is true of the marathon, the tallest human,
// the tallest building.
//
// A record only belongs in this bank if a thoughtful, informed guess could
// still be out by more than a factor of two - and, ideally, if the magnitude
// can be REASONED to rather than recalled. The longest bridge is 165km, which
// almost nobody guesses within a factor of two. The deepest dive can be
// anchored on Everest. The farthest spacecraft can be anchored on Neptune's
// orbit. Those are estimation questions that happen to be about records.
//
// Everything in here was checked against that rule before it was written down.
// If a question starts feeling like a free 100, it was a mistake to include
// and should be left in place but not repeated - the schedule is append-only
// once it is live.
//
// --- asOf is mandatory here --------------------------------------------
//
// A record is a fact with an expiry date. "How many moons does Saturn have?"
// had the answer 274 in March 2025 and 285 in March 2026, and a bank that
// claimed either one without saying when would simply be wrong half the time.
// Every question here carries the year, the card renders "as of 2026" under
// the prompt, and the answer stays permanently true about the year it names.
// games/records/questions.test.js enforces it - it is optional for Fermi and
// required here, which is the one schema difference between the two banks.
//
// It also means a superseded record does not have to be edited. Saturn at 274
// moons as of 2025 is still a correct question; it is simply about 2025.
//
// --- sourcing -------------------------------------------------------------
//
// Every value is sourced to the body that actually certifies it: a sport
// federation, a scientific institution, a government agency, a standards list.
// Never Guinness World Records - the name is a registered trademark, using it
// commercially needs a licence, and a curated compilation of their records can
// attract UK database rights. Individual records are facts and facts are free;
// somebody else's list of them is not. The test rejects the name outright so
// this cannot creep back in through a source line.
//
// In practice that rule also improves the bank. Records with a real certifying
// authority are measurable and checkable; the stunt records are the ones with
// no primary source, and they are the ones that are mostly recall anyway.

var RECORDS = [
  {
    "id": "records-farthest-spacecraft",
    "prompt": "How many kilometres from Earth is the most distant human-made object?",
    "unit": "kilometres",
    "answerValue": 25600000000,
    "decompositionHint": "The Sun is 150 million kilometres away and Neptune is thirty times that. Voyager 1 has been leaving at about 17 kilometres per second since 1977.",
    "strategy": "anchor-scale",
    "source": "NASA Jet Propulsion Laboratory Voyager mission status",
    "asOf": 2026
  },
  {
    "id": "records-saturn-moons",
    "prompt": "How many confirmed moons does Saturn have?",
    "unit": "moons",
    "answerValue": 285,
    "decompositionHint": "Almost all of them are irregular captures a few kilometres across, found in survey batches rather than one at a time, so the count jumps.",
    "strategy": "recall-sanity",
    "source": "International Astronomical Union Minor Planet Center",
    "asOf": 2026
  },
  {
    "id": "records-largest-prime-digits",
    "prompt": "How many decimal digits does the largest known prime number have?",
    "unit": "digits",
    "answerValue": 41024320,
    "decompositionHint": "It is a Mersenne prime, two to a power minus one. A power of two has about 0.3 digits per exponent, so the exponent is roughly three times the digit count.",
    "strategy": "exponential",
    "source": "Great Internet Mersenne Prime Search verified discovery of 2^136279841-1",
    "asOf": 2024
  },
  {
    "id": "records-longest-nonstop-flight",
    "prompt": "How many kilometres is the longest scheduled non-stop passenger flight?",
    "unit": "kilometres",
    "answerValue": 15349,
    "decompositionHint": "The Earth is 40,000 kilometres around, so halfway round is 20,000. No scheduled flight is close to that, but the longest is a decent fraction of it.",
    "strategy": "anchor-scale",
    "source": "Singapore Airlines published route data for Singapore to New York",
    "asOf": 2026
  },
  {
    "id": "records-fastest-supercomputer",
    "prompt": "How many floating-point operations per second does the fastest supercomputer sustain?",
    "unit": "operations per second",
    "answerValue": 2198000000000000000,
    "decompositionHint": "Millions of cores, each doing a few billion operations a second. Multiply those two and check the exponent before you commit to it.",
    "strategy": "chain-multiply",
    "source": "TOP500 supercomputer list, June 2026",
    "asOf": 2026
  },
  {
    "id": "records-deepest-ocean-descent",
    "prompt": "How many metres below sea level is the deepest a crewed vessel has descended?",
    "unit": "metres",
    "answerValue": 10925,
    "decompositionHint": "The deepest ocean trench is a little deeper than Everest is tall, and the record is essentially the bottom of it.",
    "strategy": "anchor-scale",
    "source": "Five Deeps Expedition bathymetric survey of the Challenger Deep",
    "asOf": 2019
  },
  {
    "id": "records-highest-skydive",
    "prompt": "How many metres above the ground did the highest parachute jump begin?",
    "unit": "metres",
    "answerValue": 41419,
    "decompositionHint": "An airliner cruises at about 11 kilometres. This was a balloon ascent well into the stratosphere, several times that height.",
    "strategy": "anchor-scale",
    "source": "Federation Aeronautique Internationale ratified record files",
    "asOf": 2014
  },
  {
    "id": "records-deepest-borehole",
    "prompt": "How many metres deep is the deepest hole ever drilled into the Earth?",
    "unit": "metres",
    "answerValue": 12262,
    "decompositionHint": "Deeper than the deepest ocean, and still nowhere near through the crust, which runs to about 35 kilometres under land.",
    "strategy": "anchor-scale",
    "source": "Kola Superdeep Borehole drilling programme records",
    "asOf": 1989
  },
  {
    "id": "records-longest-bridge",
    "prompt": "How many kilometres long is the longest bridge in the world?",
    "unit": "kilometres",
    "answerValue": 164.8,
    "decompositionHint": "Not a span over water but a continuous railway viaduct across flat country, so think in terms of a stretch of line rather than a river crossing.",
    "strategy": "anchor-scale",
    "source": "China Railway published engineering data for the Danyang-Kunshan Grand Bridge",
    "asOf": 2026
  },
  {
    "id": "records-longest-rail-tunnel",
    "prompt": "How many kilometres long is the longest railway tunnel?",
    "unit": "kilometres",
    "answerValue": 57.1,
    "decompositionHint": "It runs under an Alpine massif rather than across a strait. Ask yourself how wide a mountain range actually is at its base.",
    "strategy": "anchor-scale",
    "source": "AlpTransit Gotthard construction records for the Gotthard Base Tunnel",
    "asOf": 2016
  },
  {
    "id": "records-longest-lightning-flash",
    "prompt": "How many kilometres long was the longest lightning flash ever recorded?",
    "unit": "kilometres",
    "answerValue": 829,
    "decompositionHint": "It travelled horizontally through the top of a storm system, so the limit is the width of the storm rather than the height of a cloud.",
    "strategy": "anchor-scale",
    "source": "World Meteorological Organization certified megaflash record, July 2025",
    "asOf": 2025
  },
  {
    "id": "records-greatest-one-minute-rainfall",
    "prompt": "How many millimetres of rain fell in the wettest minute ever recorded?",
    "unit": "millimetres",
    "answerValue": 31.2,
    "decompositionHint": "Heavy rain is a few millimetres an hour. Work out what a whole month of that would be in one minute, then decide how much less extreme this really is.",
    "strategy": "rate-time",
    "source": "World Meteorological Organization weather and climate extremes archive",
    "asOf": 1956
  },
  {
    "id": "records-heaviest-hailstone",
    "prompt": "How many kilograms did the heaviest recorded hailstone weigh?",
    "unit": "kilograms",
    "answerValue": 1.02,
    "decompositionHint": "Ice is roughly the density of water, so a stone the size of a grapefruit is about a kilogram. Decide how big a hailstone an updraught can hold up.",
    "strategy": "volume-packing",
    "source": "World Meteorological Organization weather and climate extremes archive",
    "asOf": 1986
  },
  {
    "id": "records-highest-wind-gust",
    "prompt": "How many kilometres per hour was the strongest surface wind gust ever measured?",
    "unit": "kilometres per hour",
    "answerValue": 408,
    "decompositionHint": "A severe hurricane runs around 250 kilometres per hour at the surface. This was a tropical cyclone gust on an exposed island.",
    "strategy": "anchor-scale",
    "source": "World Meteorological Organization weather and climate extremes archive",
    "asOf": 1996
  },
  {
    "id": "records-greatest-seasonal-snowfall",
    "prompt": "How many millimetres of snow fell at the snowiest single season ever recorded?",
    "unit": "millimetres",
    "answerValue": 28960,
    "decompositionHint": "Think in metres of settled snow first, then convert. A very snowy mountain season is several metres; this was many times that.",
    "strategy": "unit-conversion",
    "source": "NOAA National Centers for Environmental Information, Mount Baker",
    "asOf": 1999
  },
  {
    "id": "records-highest-tsunami-runup",
    "prompt": "How many metres high did the water reach in the largest recorded tsunami runup?",
    "unit": "metres",
    "answerValue": 524,
    "decompositionHint": "Not an ocean-crossing wave but a landslide into a narrow inlet, so the water was funnelled up a hillside rather than spread across a coast.",
    "strategy": "anchor-scale",
    "source": "US Geological Survey field survey of the 1958 Lituya Bay megatsunami",
    "asOf": 1958
  },
  {
    "id": "records-largest-organism-area",
    "prompt": "How many square kilometres does the largest known single organism cover?",
    "unit": "square kilometres",
    "answerValue": 9.65,
    "decompositionHint": "It is a fungus growing outward underground at a few dozen centimetres a year. Multiply that rate by a few thousand years to get a radius.",
    "strategy": "rate-time",
    "source": "US Forest Service survey of Armillaria in the Malheur National Forest",
    "asOf": 2003
  },
  {
    "id": "records-oldest-living-tree",
    "prompt": "How many years old is the oldest known living non-clonal tree?",
    "unit": "years",
    "answerValue": 4850,
    "decompositionHint": "Old enough to predate the pyramids. Tree rings date it exactly, so this is a counted figure rather than an estimated one.",
    "strategy": "recall-sanity",
    "source": "Rocky Mountain Tree-Ring Research crossdating of Great Basin bristlecone pines",
    "asOf": 2025
  },
  {
    "id": "records-longest-animal-migration",
    "prompt": "How many kilometres does the longest known animal migration cover in a year?",
    "unit": "kilometres",
    "answerValue": 96000,
    "decompositionHint": "Pole to pole and back is about 40,000 kilometres in a straight line, and this bird does not fly straight - it follows wind systems.",
    "strategy": "anchor-scale",
    "source": "Newcastle University satellite tracking of Arctic terns",
    "asOf": 2016
  },
  {
    "id": "records-deepest-living-fish",
    "prompt": "How many metres down was the deepest fish ever filmed?",
    "unit": "metres",
    "answerValue": 8336,
    "decompositionHint": "There is a physiological ceiling around 8,200 metres set by protein chemistry, so the answer sits just under it rather than at the trench floor.",
    "strategy": "anchor-scale",
    "source": "University of Western Australia deep-sea survey of the Izu-Ogasawara Trench",
    "asOf": 2023
  },
  {
    "id": "records-fastest-human-travel",
    "prompt": "How many kilometres per hour is the fastest speed any human has travelled?",
    "unit": "kilometres per hour",
    "answerValue": 39937,
    "decompositionHint": "Low Earth orbit is about 28,000 kilometres per hour. This was a crew returning from the Moon, so faster than orbital but below escape velocity.",
    "strategy": "anchor-scale",
    "source": "NASA Apollo 10 mission report, return trajectory",
    "asOf": 1969
  },
  {
    "id": "records-longest-single-spaceflight",
    "prompt": "How many days was the longest single continuous spaceflight by one person?",
    "unit": "days",
    "answerValue": 437,
    "decompositionHint": "Longer than a year, and set deliberately to test whether a crew could survive a round trip to Mars.",
    "strategy": "recall-sanity",
    "source": "Roscosmos Mir programme mission records",
    "asOf": 1995
  },
  {
    "id": "records-most-cumulative-days-in-space",
    "prompt": "How many days in total has the most experienced cosmonaut spent in space?",
    "unit": "days",
    "answerValue": 1111,
    "decompositionHint": "Five or six long-duration missions of roughly six months each, accumulated over a whole career.",
    "strategy": "chain-multiply",
    "source": "Roscosmos cosmonaut flight records",
    "asOf": 2024
  },
  {
    "id": "records-land-speed",
    "prompt": "How many kilometres per hour is the land speed record?",
    "unit": "kilometres per hour",
    "answerValue": 1228,
    "decompositionHint": "The record run was supersonic, so anchor on the speed of sound at ground level and work out how far past it a jet car can get.",
    "strategy": "anchor-scale",
    "source": "Federation Internationale de l'Automobile ratified land speed record",
    "asOf": 1997
  },
  {
    "id": "records-largest-nuclear-test",
    "prompt": "How many kilotons of TNT equivalent was the largest nuclear test ever conducted?",
    "unit": "kilotons of TNT equivalent",
    "answerValue": 50000,
    "decompositionHint": "The Hiroshima bomb was about 15 kilotons. Work in multiples of that rather than trying to picture the number directly.",
    "strategy": "anchor-scale",
    "source": "Declassified Soviet nuclear test records for the 1961 Novaya Zemlya test",
    "asOf": 1961
  },
  {
    "id": "records-hottest-temperature-created",
    "prompt": "How many kelvin was the highest temperature ever created in a laboratory?",
    "unit": "kelvin",
    "answerValue": 5500000000000,
    "decompositionHint": "The centre of the Sun is about 15 million kelvin. A heavy-ion collider beats that by a very large factor, not a small one.",
    "strategy": "anchor-scale",
    "source": "CERN ALICE experiment quark-gluon plasma measurements",
    "asOf": 2012
  },
  {
    "id": "records-strongest-continuous-magnetic-field",
    "prompt": "How many tesla is the strongest continuous magnetic field ever produced?",
    "unit": "tesla",
    "answerValue": 45.5,
    "decompositionHint": "A hospital MRI scanner runs at about 3 tesla and a fridge magnet at a hundredth of one. Sustained fields are limited by the magnet tearing itself apart.",
    "strategy": "anchor-scale",
    "source": "US National High Magnetic Field Laboratory",
    "asOf": 2019
  },
  {
    "id": "records-fastest-data-transmission",
    "prompt": "How many bits per second is the fastest data transmission ever achieved over optical fibre?",
    "unit": "bits per second",
    "answerValue": 402000000000000,
    "decompositionHint": "A fast home connection is a gigabit. Laboratory records multiply that by packing hundreds of wavelengths down one fibre at once.",
    "strategy": "chain-multiply",
    "source": "National Institute of Information and Communications Technology transmission experiment, Japan",
    "asOf": 2024
  },
  {
    "id": "records-most-pi-digits",
    "prompt": "How many digits of pi have been computed in the record calculation?",
    "unit": "digits",
    "answerValue": 202000000000000,
    "decompositionHint": "The limit is storage rather than arithmetic: each digit is a fraction of a byte, and the working set has to fit on disk.",
    "strategy": "divide-total",
    "source": "Verified pi computation record, StorageReview",
    "asOf": 2024
  },
  {
    "id": "records-longest-tennis-match",
    "prompt": "How many minutes did the longest professional tennis match last?",
    "unit": "minutes",
    "answerValue": 665,
    "decompositionHint": "A long five-setter is about four hours. This one went to a final set that could not be decided by a tiebreak.",
    "strategy": "anchor-scale",
    "source": "Wimbledon official match records, 2010 first round",
    "asOf": 2010
  },
  {
    "id": "records-longest-chess-game",
    "prompt": "How many moves were played in the longest tournament chess game on record?",
    "unit": "moves",
    "answerValue": 295,
    "decompositionHint": "A normal game is about 40 moves. This one hit the fifty-move draw rule repeatedly without either side claiming it.",
    "strategy": "anchor-scale",
    "source": "FIDE tournament records, Belgrade 1989",
    "asOf": 1989
  },
  {
    "id": "records-largest-domino-toppling",
    "prompt": "How many dominoes were toppled in the largest domino chain ever set up?",
    "unit": "dominoes",
    "answerValue": 4491863,
    "decompositionHint": "A team of a hundred people placing a few thousand tiles a day for two months. Multiply the chain out rather than guessing the total.",
    "strategy": "chain-multiply",
    "source": "Domino Day event records, Leeuwarden, Netherlands",
    "asOf": 2009
  },
  {
    "id": "records-most-passengers-one-flight",
    "prompt": "How many passengers were carried on the most crowded single aircraft flight?",
    "unit": "passengers",
    "answerValue": 1088,
    "decompositionHint": "A jumbo jet seats about 400. This was an evacuation flight with the seats removed and people sitting on the floor.",
    "strategy": "anchor-scale",
    "source": "El Al records for the 1991 Operation Solomon airlift",
    "asOf": 1991
  },
  {
    "id": "records-largest-ship-tonnage",
    "prompt": "How many deadweight tonnes could the largest ship ever built carry?",
    "unit": "deadweight tonnes",
    "answerValue": 564763,
    "decompositionHint": "Roughly a cube of water 80 metres on a side. Estimate the hull's length, beam and draught and work out the displacement.",
    "strategy": "volume-packing",
    "source": "Lloyd's Register vessel tonnage records for the Seawise Giant",
    "asOf": 1979
  },
  {
    "id": "records-longest-24-hour-run",
    "prompt": "How many kilometres has the farthest anyone has run in twenty-four hours?",
    "unit": "kilometres",
    "answerValue": 319.6,
    "decompositionHint": "A marathon pace of twelve kilometres an hour cannot be held for a day. Pick a pace that can be, and multiply by the hours actually spent running.",
    "strategy": "rate-time",
    "source": "International Association of Ultrarunners ratified world record",
    "asOf": 2022
  },
  {
    "id": "records-longest-static-apnea",
    "prompt": "How many seconds is the longest anyone has held their breath underwater without breathing oxygen first?",
    "unit": "seconds",
    "answerValue": 695,
    "decompositionHint": "An untrained person manages about a minute. Trained divers slow the heart and tolerate carbon dioxide, which multiplies it several times over.",
    "strategy": "anchor-scale",
    "source": "AIDA International ratified static apnea record",
    "asOf": 2009
  },
  {
    "id": "records-deepest-freedive",
    "prompt": "How many metres down is the deepest freedive on a single breath?",
    "unit": "metres",
    "answerValue": 214,
    "decompositionHint": "Pressure doubles every ten metres, so the lungs at this depth are a small fraction of their surface volume. That physiology sets the limit.",
    "strategy": "anchor-scale",
    "source": "AIDA International ratified no-limits freediving record",
    "asOf": 2007
  },
  {
    "id": "records-largest-wave-surfed",
    "prompt": "How many metres high was the largest wave ever surfed?",
    "unit": "metres",
    "answerValue": 26.21,
    "decompositionHint": "Measured from trough to crest against the rider's own height, which is why the figure is far smaller than photographs suggest.",
    "strategy": "anchor-scale",
    "source": "World Surf League ratified big wave award measurement",
    "asOf": 2020
  },
  {
    "id": "records-most-expensive-painting",
    "prompt": "How many US dollars did the most expensive painting ever sold at auction fetch?",
    "unit": "US dollars",
    "answerValue": 450300000,
    "decompositionHint": "Well-known old masters trade in the tens of millions. This one went several times past the previous record in a single bidding war.",
    "strategy": "anchor-scale",
    "source": "Christie's published auction results, November 2017",
    "asOf": 2017
  },
  {
    "id": "records-largest-impact-crater",
    "prompt": "How many kilometres across is the largest confirmed impact crater on Earth?",
    "unit": "kilometres",
    "answerValue": 300,
    "decompositionHint": "The Chicxulub crater linked to the dinosaur extinction is about 180 kilometres. The largest is older, more eroded and larger still.",
    "strategy": "anchor-scale",
    "source": "Council for Geoscience South Africa surveys of the Vredefort structure",
    "asOf": 2025
  },
  {
    "id": "records-longest-submarine-cable",
    "prompt": "How many kilometres long is the longest submarine communications cable system?",
    "unit": "kilometres",
    "answerValue": 45000,
    "decompositionHint": "It rings an entire continent and lands in dozens of countries, so compare it with the circumference of the Earth rather than an ocean crossing.",
    "strategy": "anchor-scale",
    "source": "TeleGeography submarine cable database",
    "asOf": 2024
  },
  {
    "id": "records-largest-cave-chamber",
    "prompt": "How many cubic metres is the largest known cave chamber by volume?",
    "unit": "cubic metres",
    "answerValue": 10780000,
    "decompositionHint": "Estimate it as a box and then take a fraction of it: roughly 850 metres long, 190 wide and 190 high, but sloping away at both ends rather than square-cut.",
    "strategy": "volume-packing",
    "source": "China Caves Project laser survey of the Miao Room, Ziyun Getu He Chuandong National Park",
    "asOf": 2013
  },
  {
    "id": "records-longest-cave-system",
    "prompt": "How many kilometres of passage have been surveyed in the longest cave system?",
    "unit": "kilometres",
    "answerValue": 686,
    "decompositionHint": "A maze of connected levels in soluble limestone, surveyed a few kilometres at a time over more than a century.",
    "strategy": "rate-time",
    "source": "National Park Service survey records for Mammoth Cave",
    "asOf": 2025
  },
  {
    "id": "records-longest-bird-flight-without-landing",
    "prompt": "How many days can the common swift stay airborne without landing?",
    "unit": "days",
    "answerValue": 300,
    "decompositionHint": "It feeds, drinks and sleeps on the wing and only comes down to breed, so the limit is the length of the non-breeding season.",
    "strategy": "recall-sanity",
    "source": "Lund University geolocator tracking of common swifts",
    "asOf": 2016
  },
  {
    "id": "records-highest-balloon-flight",
    "prompt": "How many kilometres up did the highest balloon flight reach?",
    "unit": "kilometres",
    "answerValue": 53,
    "decompositionHint": "Space is reckoned to start at 100 kilometres and airliners fly at 11. A balloon stops where the air is too thin to displace its own weight.",
    "strategy": "anchor-scale",
    "source": "Japan Aerospace Exploration Agency scientific balloon flight records",
    "asOf": 2002
  },
  {
    "id": "records-longest-lived-animal",
    "prompt": "How many years old was the longest-lived individual animal ever recorded?",
    "unit": "years",
    "answerValue": 507,
    "decompositionHint": "A cold-water bivalve, aged by counting growth bands in its shell the way tree rings are counted.",
    "strategy": "recall-sanity",
    "source": "Bangor University sclerochronology analysis of an Icelandic ocean quahog",
    "asOf": 2013
  },
  {
    "id": "records-heaviest-seed",
    "prompt": "How many kilograms does the heaviest seed of any plant weigh?",
    "unit": "kilograms",
    "answerValue": 25,
    "decompositionHint": "A single palm seed the size of a large watermelon, which is about the limit for something a tree can hold up and drop.",
    "strategy": "anchor-scale",
    "source": "Royal Botanic Gardens Kew records for the coco de mer",
    "asOf": 2025
  },
  {
    "id": "records-longest-mountain-range",
    "prompt": "How many kilometres long is the longest mountain range on Earth?",
    "unit": "kilometres",
    "answerValue": 65000,
    "decompositionHint": "It is almost entirely underwater and runs between the tectonic plates, so compare it with the total length of plate boundary rather than with the Andes.",
    "strategy": "anchor-scale",
    "source": "NOAA Ocean Exploration seafloor mapping of the mid-ocean ridge",
    "asOf": 2025
  },
  {
    "id": "records-largest-desert",
    "prompt": "How many square kilometres is the largest desert on Earth?",
    "unit": "square kilometres",
    "answerValue": 14000000,
    "decompositionHint": "A desert is defined by how little falls, not by how hot it is, which puts a whole polar continent in the running.",
    "strategy": "recall-sanity",
    "source": "British Antarctic Survey continental area measurements",
    "asOf": 2025
  },
  {
    "id": "records-fastest-spacecraft",
    "prompt": "How many kilometres per hour is the fastest speed any spacecraft has reached?",
    "unit": "kilometres per hour",
    "answerValue": 692000,
    "decompositionHint": "It gets its speed by falling towards the Sun rather than by burning fuel, so the limit is how close it dares pass. Escape velocity from Earth is about 40,000 km/h.",
    "strategy": "anchor-scale",
    "source": "NASA Parker Solar Probe mission telemetry",
    "asOf": 2024
  },
  {
    "id": "records-closest-approach-to-the-sun",
    "prompt": "How many kilometres from the Sun's surface did the closest ever solar flyby pass?",
    "unit": "kilometres",
    "answerValue": 6100000,
    "decompositionHint": "Earth orbits at 150 million kilometres and Mercury at 58 million. This passed inside Mercury's orbit by a large factor, but well outside the Sun itself.",
    "strategy": "anchor-scale",
    "source": "NASA Parker Solar Probe mission telemetry",
    "asOf": 2024
  },
  {
    "id": "records-black-hole-m87-mass",
    "prompt": "How many times the Sun's mass is the black hole at the centre of the galaxy M87?",
    "unit": "solar masses",
    "answerValue": 6500000000,
    "decompositionHint": "The one at the centre of our own galaxy is about four million Suns. This is the one that was photographed, and it is in a far larger galaxy.",
    "strategy": "anchor-scale",
    "source": "Event Horizon Telescope Collaboration published mass measurement",
    "asOf": 2019
  },
  {
    "id": "records-earliest-galaxy-seen",
    "prompt": "How many years after the Big Bang had the earliest galaxy ever observed already formed?",
    "unit": "years",
    "answerValue": 290000000,
    "decompositionHint": "The universe is 13.8 billion years old, so work out what small fraction of that a very early galaxy represents rather than guessing the number directly.",
    "strategy": "anchor-scale",
    "source": "NASA James Webb Space Telescope JADES survey results",
    "asOf": 2024
  },
  {
    "id": "records-largest-galaxy",
    "prompt": "How many light years across is the largest known galaxy?",
    "unit": "light years",
    "answerValue": 16300000,
    "decompositionHint": "The Milky Way is about 100,000 light years across. This one is a radio galaxy whose jets reach far beyond its visible stars.",
    "strategy": "anchor-scale",
    "source": "Leiden Observatory published survey of the Alcyoneus radio galaxy",
    "asOf": 2022
  },
  {
    "id": "records-largest-cosmic-structure",
    "prompt": "How many light years long is the largest confirmed structure in the universe?",
    "unit": "light years",
    "answerValue": 1370000000,
    "decompositionHint": "A wall of galaxy clusters rather than a single object. Compare it with the 93 billion light year width of the observable universe.",
    "strategy": "anchor-scale",
    "source": "Sloan Digital Sky Survey mapping of the Sloan Great Wall",
    "asOf": 2025
  },
  {
    "id": "records-fastest-spinning-star",
    "prompt": "How many times per second does the fastest known pulsar rotate?",
    "unit": "rotations per second",
    "answerValue": 716,
    "decompositionHint": "A city-sized ball of neutrons spun up by material falling onto it. The limit is where centrifugal force would tear it apart.",
    "strategy": "anchor-scale",
    "source": "Published pulsar timing measurements of PSR J1748-2446ad",
    "asOf": 2006
  },
  {
    "id": "records-strongest-magnetic-field-known",
    "prompt": "How many tesla is the strongest magnetic field known anywhere in the universe?",
    "unit": "tesla",
    "answerValue": 100000000000,
    "decompositionHint": "A hospital scanner is 3 tesla and the strongest laboratory magnet about 45. A magnetar beats those by a factor nobody guesses high enough.",
    "strategy": "anchor-scale",
    "source": "NASA published magnetar field measurements for SGR 1806-20",
    "asOf": 2025
  },
  {
    "id": "records-densest-matter",
    "prompt": "How many kilograms per cubic metre is the density of neutron star material?",
    "unit": "kilograms per cubic metre",
    "answerValue": 400000000000000000,
    "decompositionHint": "An atom is almost entirely empty space; strip that out and you are left with nuclear density. Water is 1,000 and lead about 11,000.",
    "strategy": "anchor-scale",
    "source": "Published neutron star structure models, NASA astrophysics",
    "asOf": 2025
  },
  {
    "id": "records-highest-energy-cosmic-ray",
    "prompt": "How many electronvolts of energy did the most energetic cosmic ray ever detected carry?",
    "unit": "electronvolts",
    "answerValue": 320000000000000000000,
    "decompositionHint": "One subatomic particle carrying about the energy of a fast-bowled cricket ball. The largest accelerator on Earth reaches 10^13 electronvolts.",
    "strategy": "anchor-scale",
    "source": "University of Utah Fly's Eye cosmic ray observatory",
    "asOf": 1991
  },
  {
    "id": "records-largest-volcano-base",
    "prompt": "How many kilometres across is the base of the largest volcano in the solar system?",
    "unit": "kilometres",
    "answerValue": 600,
    "decompositionHint": "Mars has no drifting plates, so one hot spot built one mountain for billions of years instead of a chain of islands. Hawaii's base is about 100 km.",
    "strategy": "anchor-scale",
    "source": "NASA Mars Global Surveyor topographic mapping of Olympus Mons",
    "asOf": 2025
  },
  {
    "id": "records-longest-canyon",
    "prompt": "How many kilometres long is the largest canyon in the solar system?",
    "unit": "kilometres",
    "answerValue": 4000,
    "decompositionHint": "It runs a substantial fraction of the way around Mars, whose circumference is 21,300 km. The Grand Canyon is 446 km.",
    "strategy": "anchor-scale",
    "source": "NASA Mariner 9 and Mars Express imaging of Valles Marineris",
    "asOf": 2025
  },
  {
    "id": "records-tallest-cliff",
    "prompt": "How many metres high is the tallest cliff known in the solar system?",
    "unit": "metres",
    "answerValue": 20000,
    "decompositionHint": "On a small icy moon with almost no gravity, so a rock face can stand far higher than anything Earth could hold up. El Capitan is about 900 metres.",
    "strategy": "anchor-scale",
    "source": "NASA Voyager 2 imaging of Verona Rupes on Miranda",
    "asOf": 2025
  },
  {
    "id": "records-largest-impact-basin",
    "prompt": "How many kilometres across is the largest impact basin in the solar system?",
    "unit": "kilometres",
    "answerValue": 2500,
    "decompositionHint": "It covers much of the far side of the Moon, whose diameter is 3,475 km, so work out what fraction of a whole hemisphere a basin can be.",
    "strategy": "anchor-scale",
    "source": "NASA Lunar Reconnaissance Orbiter mapping of the South Pole-Aitken basin",
    "asOf": 2025
  },
  {
    "id": "records-longest-planetary-day",
    "prompt": "How many Earth hours does one rotation of the slowest-turning planet take?",
    "unit": "hours",
    "answerValue": 5832,
    "decompositionHint": "Venus turns so slowly that its day is longer than its year, and it turns backwards. Start from how many Earth days that must be, then convert.",
    "strategy": "unit-conversion",
    "source": "NASA planetary fact sheets",
    "asOf": 2025
  },
  {
    "id": "records-longest-lived-storm",
    "prompt": "How many years has the longest continuously observed storm in the solar system been watched?",
    "unit": "years",
    "answerValue": 194,
    "decompositionHint": "A storm on Jupiter, tracked since telescopes were good enough to resolve it reliably. That puts the start in the early nineteenth century.",
    "strategy": "anchor-scale",
    "source": "NASA and historical observational records of Jupiter's Great Red Spot",
    "asOf": 2025
  },
  {
    "id": "records-largest-radio-dish",
    "prompt": "How many metres across is the largest single-dish radio telescope?",
    "unit": "metres",
    "answerValue": 500,
    "decompositionHint": "Built into a natural karst hollow rather than on a mount, because nothing that size can be steered. Jodrell Bank's dish is 76 metres.",
    "strategy": "anchor-scale",
    "source": "Chinese Academy of Sciences specifications for the FAST telescope",
    "asOf": 2025
  },
  {
    "id": "records-largest-particle-accelerator",
    "prompt": "How many metres around is the ring of the largest particle accelerator?",
    "unit": "metres",
    "answerValue": 26659,
    "decompositionHint": "It crosses a national border and sits about 100 metres underground. Think in kilometres of tunnel first, then convert.",
    "strategy": "unit-conversion",
    "source": "CERN published specifications for the Large Hadron Collider",
    "asOf": 2025
  },
  {
    "id": "records-heaviest-payload-to-orbit",
    "prompt": "How many kilograms could the most powerful launch vehicle ever flown put into low Earth orbit?",
    "unit": "kilograms",
    "answerValue": 140000,
    "decompositionHint": "It had to lift an entire Moon mission, so start from the mass of a lunar spacecraft plus the stage that pushed it out of orbit.",
    "strategy": "decompose",
    "source": "NASA Saturn V launch vehicle specifications",
    "asOf": 1973
  },
  {
    "id": "records-greatest-rocket-thrust",
    "prompt": "How many newtons of thrust did the Saturn V produce at liftoff?",
    "unit": "newtons",
    "answerValue": 35100000,
    "decompositionHint": "It weighed about 2,900 tonnes and had to leave the pad, so the thrust must exceed that weight in newtons - mass times ten - by a sensible margin.",
    "strategy": "energy-balance",
    "source": "NASA Saturn V launch vehicle specifications",
    "asOf": 1967
  },
  {
    "id": "records-most-satellites-one-launch",
    "prompt": "How many satellites were carried to orbit by a single rocket on one flight?",
    "unit": "satellites",
    "answerValue": 143,
    "decompositionHint": "Most were shoebox-sized cubesats stacked on a shared ride, so the limit is fairing volume rather than mass.",
    "strategy": "volume-packing",
    "source": "Federal Aviation Administration launch records for the Transporter-1 mission",
    "asOf": 2021
  },
  {
    "id": "records-farthest-driven-on-another-world",
    "prompt": "How many kilometres has the farthest-travelled rover driven on another world?",
    "unit": "kilometres",
    "answerValue": 45.16,
    "decompositionHint": "A solar-powered rover moving at walking pace for a few minutes a day, over fourteen years rather than the ninety days it was designed for.",
    "strategy": "rate-time",
    "source": "NASA Jet Propulsion Laboratory Opportunity mission records",
    "asOf": 2018
  },
  {
    "id": "records-longest-spacewalk",
    "prompt": "How many minutes did the longest single spacewalk last?",
    "unit": "minutes",
    "answerValue": 536,
    "decompositionHint": "The limit is the suit: how much oxygen, cooling water and battery a person can carry on their back. A typical spacewalk runs six or seven hours.",
    "strategy": "anchor-scale",
    "source": "NASA mission records for STS-102",
    "asOf": 2001
  },
  {
    "id": "records-continuous-human-presence-in-space",
    "prompt": "How many days has a human being been continuously in space somewhere aboard the same station?",
    "unit": "days",
    "answerValue": 9400,
    "decompositionHint": "Unbroken since the first crew arrived at the International Space Station, which was around the turn of the millennium. Count the years and convert.",
    "strategy": "unit-conversion",
    "source": "NASA International Space Station programme records",
    "asOf": 2026
  },
  {
    "id": "records-largest-meteorite",
    "prompt": "How many kilograms does the largest meteorite ever found weigh?",
    "unit": "kilograms",
    "answerValue": 60000,
    "decompositionHint": "It is mostly iron, so about eight tonnes per cubic metre, and it is roughly the size of a small van. It has never been moved.",
    "strategy": "volume-packing",
    "source": "National Museum of Namibia records for the Hoba meteorite",
    "asOf": 2025
  },
  {
    "id": "records-longest-solar-eclipse",
    "prompt": "How many seconds did totality last in the longest solar eclipse of the twentieth century?",
    "unit": "seconds",
    "answerValue": 428,
    "decompositionHint": "The Moon's shadow races across the ground at about 1,700 km/h, and its dark core is only a couple of hundred kilometres wide at best.",
    "strategy": "rate-time",
    "source": "NASA eclipse catalogue for the 30 June 1973 total solar eclipse",
    "asOf": 1973
  },
  {
    "id": "records-longest-lunar-eclipse",
    "prompt": "How many minutes did totality last in the longest lunar eclipse of the twenty-first century?",
    "unit": "minutes",
    "answerValue": 103,
    "decompositionHint": "The Earth's shadow at the Moon's distance is about 9,000 km across, and the Moon crosses it at roughly 3,700 km/h.",
    "strategy": "rate-time",
    "source": "NASA eclipse catalogue for the 27 July 2018 total lunar eclipse",
    "asOf": 2018
  },
  {
    "id": "records-deepest-basin-on-mars",
    "prompt": "How many metres below the surrounding surface is the deepest basin on Mars?",
    "unit": "metres",
    "answerValue": 7152,
    "decompositionHint": "An ancient impact scar big enough to hold weather of its own. For scale, the deepest point on Earth's land surface is about 400 metres below sea level.",
    "strategy": "anchor-scale",
    "source": "NASA Mars Orbiter Laser Altimeter survey of Hellas Planitia",
    "asOf": 2025
  },
  {
    "id": "records-faintest-signal-received",
    "prompt": "How many watts of signal power does Earth receive from the most distant spacecraft?",
    "unit": "watts",
    "answerValue": 1e-19,
    "decompositionHint": "It transmits about 20 watts from beyond the planets, and signal strength falls with the square of distance. A digital watch uses a millionth of a watt.",
    "strategy": "anchor-scale",
    "source": "NASA Deep Space Network link budgets for Voyager 1",
    "asOf": 2025
  },
  {
    "id": "records-most-moons-found-at-once",
    "prompt": "How many new moons of Saturn were confirmed in a single announcement?",
    "unit": "moons",
    "answerValue": 128,
    "decompositionHint": "Found by stacking years of telescope images so that faint objects moving with the planet emerge from the noise, then confirmed in one batch.",
    "strategy": "recall-sanity",
    "source": "International Astronomical Union Minor Planet Center, March 2025",
    "asOf": 2025
  },
  {
    "id": "records-highest-jet-altitude",
    "prompt": "How many metres up did the highest flight by a jet aircraft reach?",
    "unit": "metres",
    "answerValue": 37650,
    "decompositionHint": "A zoom climb rather than level flight: the engines flame out in thin air and the aircraft coasts upward on momentum. Airliners cruise at 11,000 metres.",
    "strategy": "anchor-scale",
    "source": "Federation Aeronautique Internationale absolute altitude record",
    "asOf": 1977
  },
  {
    "id": "records-largest-optical-mirror",
    "prompt": "How many metres across is the largest optical telescope mirror in operation?",
    "unit": "metres",
    "answerValue": 10.4,
    "decompositionHint": "Segmented rather than cast in one piece, because glass that size sags under its own weight. The Hubble mirror is 2.4 metres.",
    "strategy": "anchor-scale",
    "source": "Instituto de Astrofisica de Canarias specifications for the Gran Telescopio Canarias",
    "asOf": 2025
  },
  {
    "id": "records-largest-lake-by-volume",
    "prompt": "How many cubic kilometres of fresh water does the largest lake by volume hold?",
    "unit": "cubic kilometres",
    "answerValue": 23600,
    "decompositionHint": "It is a rift valley rather than a basin: 636 km long, about 50 wide and averaging three quarters of a kilometre deep. Multiply those out.",
    "strategy": "volume-packing",
    "source": "Russian Academy of Sciences bathymetric surveys of Lake Baikal",
    "asOf": 2025
  },
  {
    "id": "records-largest-lake-by-area",
    "prompt": "How many square kilometres does the largest lake on Earth cover?",
    "unit": "square kilometres",
    "answerValue": 371000,
    "decompositionHint": "Big enough that several countries have a coast on it, and salty enough that people argue about calling it a sea. Roughly 1,000 km by 300.",
    "strategy": "area-density",
    "source": "United Nations Environment Programme survey of the Caspian Sea",
    "asOf": 2025
  },
  {
    "id": "records-greatest-river-discharge",
    "prompt": "How many cubic metres of water per second does the greatest river discharge into the sea?",
    "unit": "cubic metres per second",
    "answerValue": 209000,
    "decompositionHint": "It carries about a fifth of all the river water reaching the oceans. A large European river manages a couple of thousand cubic metres a second.",
    "strategy": "anchor-scale",
    "source": "Brazilian National Water Agency gauging of the Amazon",
    "asOf": 2025
  },
  {
    "id": "records-greatest-waterfall-flow",
    "prompt": "How many cubic metres per second flow over the highest-volume waterfall?",
    "unit": "cubic metres per second",
    "answerValue": 25768,
    "decompositionHint": "A set of rapids on a major African river rather than a single vertical drop. Niagara passes about 2,400 cubic metres a second.",
    "strategy": "anchor-scale",
    "source": "Democratic Republic of the Congo hydrological survey of the Inga Rapids",
    "asOf": 2025
  },
  {
    "id": "records-highest-waterfall",
    "prompt": "How many metres does the water fall at the highest uninterrupted waterfall?",
    "unit": "metres",
    "answerValue": 979,
    "decompositionHint": "It drops from the edge of a flat-topped plateau, and much of the water turns to mist before it lands. A tall office tower is about 400 metres.",
    "strategy": "anchor-scale",
    "source": "Venezuelan national park survey of Angel Falls",
    "asOf": 2025
  },
  {
    "id": "records-deepest-cave",
    "prompt": "How many metres below its entrance does Veryovkina Cave reach?",
    "unit": "metres",
    "answerValue": 2212,
    "decompositionHint": "Limited by how far water can cut down before it meets the local water table, so think about the height of the mountain above it.",
    "strategy": "anchor-scale",
    "source": "Ukrainian Speleological Association survey of Veryovkina Cave",
    "asOf": 2025
  },
  {
    "id": "records-longest-glacier",
    "prompt": "How many kilometres long is the longest glacier on Earth?",
    "unit": "kilometres",
    "answerValue": 400,
    "decompositionHint": "It drains a large part of the East Antarctic ice sheet through a single valley. Alpine glaciers are measured in tens of kilometres at most.",
    "strategy": "anchor-scale",
    "source": "British Antarctic Survey mapping of the Lambert Glacier",
    "asOf": 2025
  },
  {
    "id": "records-thickest-ice",
    "prompt": "How many metres thick is the ice at the deepest point of the Antarctic ice sheet?",
    "unit": "metres",
    "answerValue": 4776,
    "decompositionHint": "Thick enough to bury a mountain range, and it is why the continent's average elevation is the highest of any. Greenland's ice peaks near 3,000 metres.",
    "strategy": "anchor-scale",
    "source": "BedMachine Antarctica radar sounding, published ice thickness data",
    "asOf": 2025
  },
  {
    "id": "records-largest-iceberg",
    "prompt": "How many square kilometres did the largest recorded iceberg cover?",
    "unit": "square kilometres",
    "answerValue": 11000,
    "decompositionHint": "A slab calved off an ice shelf rather than a floating mountain, so think of it as a flat island - roughly 295 km by 37.",
    "strategy": "area-density",
    "source": "United States National Ice Center tracking of iceberg B-15",
    "asOf": 2000
  },
  {
    "id": "records-driest-place-rainfall",
    "prompt": "How many millimetres of rain fall in an average year at the driest inhabited place on Earth?",
    "unit": "millimetres",
    "answerValue": 0.76,
    "decompositionHint": "Some weather stations there have never recorded rain at all. A dry English summer month is about 40 millimetres, so work down from there.",
    "strategy": "anchor-scale",
    "source": "Chilean Meteorological Directorate long-term records for Arica",
    "asOf": 2025
  },
  {
    "id": "records-wettest-place-rainfall",
    "prompt": "How many millimetres of rain fall in an average year at the wettest place on Earth?",
    "unit": "millimetres",
    "answerValue": 11871,
    "decompositionHint": "Monsoon air forced up a steep escarpment, dumping most of its year's rain in a few months. London gets about 600 millimetres.",
    "strategy": "anchor-scale",
    "source": "India Meteorological Department records for Mawsynram",
    "asOf": 2025
  },
  {
    "id": "records-greatest-daily-rainfall",
    "prompt": "How many millimetres of rain fell in the wettest twenty-four hours ever recorded?",
    "unit": "millimetres",
    "answerValue": 1825,
    "decompositionHint": "A tropical cyclone stalling against a mountainous island. That is close to two metres of water standing on the ground in one day.",
    "strategy": "rate-time",
    "source": "World Meteorological Organization weather and climate extremes archive",
    "asOf": 1966
  },
  {
    "id": "records-greatest-annual-rainfall",
    "prompt": "How many millimetres of rain fell in the wettest single year ever recorded?",
    "unit": "millimetres",
    "answerValue": 26470,
    "decompositionHint": "Twenty-six metres of water in twelve months. Start from the wettest place's yearly average and ask how much an exceptional monsoon adds.",
    "strategy": "anchor-scale",
    "source": "India Meteorological Department records for Cherrapunji",
    "asOf": 1861
  },
  {
    "id": "records-longest-dry-spell",
    "prompt": "How many months passed without measurable rain in the longest recorded dry spell?",
    "unit": "months",
    "answerValue": 173,
    "decompositionHint": "Fourteen years and more. It happened on a desert coast where a cold current keeps the air from ever rising enough to rain.",
    "strategy": "unit-conversion",
    "source": "World Meteorological Organization weather and climate extremes archive",
    "asOf": 1918
  },
  {
    "id": "records-widest-tornado",
    "prompt": "How many metres wide was the widest tornado ever measured?",
    "unit": "metres",
    "answerValue": 4200,
    "decompositionHint": "Measured by mobile radar rather than by damage path. A typical tornado is a couple of hundred metres across at the ground.",
    "strategy": "anchor-scale",
    "source": "NOAA Storm Prediction Center survey of the El Reno tornado",
    "asOf": 2013
  },
  {
    "id": "records-longest-tornado-track",
    "prompt": "How many kilometres did the longest continuous tornado track run?",
    "unit": "kilometres",
    "answerValue": 352,
    "decompositionHint": "It stayed on the ground for three and a half hours across three states. Most tornadoes last a few minutes and travel a few kilometres.",
    "strategy": "rate-time",
    "source": "NOAA National Weather Service reanalysis of the 1925 Tri-State tornado",
    "asOf": 1925
  },
  {
    "id": "records-largest-hailstone-diameter",
    "prompt": "How many centimetres across was the largest hailstone ever measured?",
    "unit": "centimetres",
    "answerValue": 20.3,
    "decompositionHint": "About the size of a football. It needs an updraught strong enough to hold that weight aloft while layer after layer of ice freezes on.",
    "strategy": "anchor-scale",
    "source": "NOAA National Climatic Data Center verification, Vivian, South Dakota",
    "asOf": 2010
  },
  {
    "id": "records-longest-lived-cyclone",
    "prompt": "How many days did the longest-lasting tropical cyclone survive?",
    "unit": "days",
    "answerValue": 36,
    "decompositionHint": "It crossed an entire ocean basin, staying over warm water the whole time. Most storms last about a week before land or cold water kills them.",
    "strategy": "anchor-scale",
    "source": "World Meteorological Organization certified duration extreme for Cyclone Freddy",
    "asOf": 2023
  },
  {
    "id": "records-largest-volcanic-eruption",
    "prompt": "How many cubic kilometres of material did the largest known volcanic eruption throw out?",
    "unit": "cubic kilometres",
    "answerValue": 2800,
    "decompositionHint": "It left a caldera 100 km long and is thought to have cooled the whole planet for years. Mount St Helens produced about one cubic kilometre.",
    "strategy": "anchor-scale",
    "source": "Published volcanological studies of the Toba supereruption",
    "asOf": 2025
  },
  {
    "id": "records-largest-historical-eruption",
    "prompt": "How many cubic kilometres of material did the largest eruption in recorded history produce?",
    "unit": "cubic kilometres",
    "answerValue": 150,
    "decompositionHint": "It caused a year without a summer on the other side of the world, which tells you it was far larger than anything in living memory.",
    "strategy": "anchor-scale",
    "source": "Smithsonian Global Volcanism Program record of the 1815 Tambora eruption",
    "asOf": 1815
  },
  {
    "id": "records-fastest-pyroclastic-flow",
    "prompt": "How many kilometres per hour can the fastest pyroclastic flows travel?",
    "unit": "kilometres per hour",
    "answerValue": 700,
    "decompositionHint": "A ground-hugging cloud of gas and ash denser than air, accelerating downhill. Compare it with a passenger jet rather than with a car.",
    "strategy": "anchor-scale",
    "source": "United States Geological Survey volcano hazards measurements",
    "asOf": 2025
  },
  {
    "id": "records-longest-earthquake-shaking",
    "prompt": "How many seconds did the ground shake in the longest recorded earthquake rupture?",
    "unit": "seconds",
    "answerValue": 600,
    "decompositionHint": "The rupture ran for about 1,500 km along a fault at roughly 3 km per second, so work out how long that takes to unzip.",
    "strategy": "rate-time",
    "source": "United States Geological Survey analysis of the 1960 Valdivia earthquake",
    "asOf": 1960
  },
  {
    "id": "records-largest-known-flood",
    "prompt": "How many cubic metres per second did the largest known freshwater flood discharge?",
    "unit": "cubic metres per second",
    "answerValue": 17000000,
    "decompositionHint": "An ice dam holding back a lake the size of a small sea failed all at once. Compare it with the Amazon, which manages 209,000.",
    "strategy": "anchor-scale",
    "source": "United States Geological Survey studies of the Missoula floods",
    "asOf": 2025
  },
  {
    "id": "records-strongest-ocean-current",
    "prompt": "How many cubic metres of water per second does the strongest ocean current carry?",
    "unit": "cubic metres per second",
    "answerValue": 137000000,
    "decompositionHint": "It is the only current that circles the globe unobstructed. Compare it with every river on Earth combined, which is about a million.",
    "strategy": "anchor-scale",
    "source": "Published oceanographic transport estimates for the Antarctic Circumpolar Current",
    "asOf": 2025
  },
  {
    "id": "records-largest-coral-reef",
    "prompt": "How many square kilometres does the largest coral reef system cover?",
    "unit": "square kilometres",
    "answerValue": 344400,
    "decompositionHint": "It runs about 2,300 km along a coast and is tens to hundreds of kilometres wide. Multiply rather than guessing the area whole.",
    "strategy": "area-density",
    "source": "Great Barrier Reef Marine Park Authority",
    "asOf": 2025
  },
  {
    "id": "records-oldest-ice-core",
    "prompt": "How many years of climate history does the oldest continuous ice core contain?",
    "unit": "years",
    "answerValue": 1200000,
    "decompositionHint": "Antarctic ice accumulates a few centimetres a year and compresses with depth, so a core a few kilometres long covers a very long time.",
    "strategy": "rate-time",
    "source": "Beyond EPICA Oldest Ice project, European Science Foundation",
    "asOf": 2025
  },
  {
    "id": "records-largest-sand-dune",
    "prompt": "How many metres tall is the tallest sand dune on Earth?",
    "unit": "metres",
    "answerValue": 1230,
    "decompositionHint": "It sits in a high desert basin where wind has piled sand against a mountain front for millennia. A big coastal dune is 50 metres.",
    "strategy": "anchor-scale",
    "source": "Argentine national geographic survey of Duna Federico Kirbus",
    "asOf": 2025
  },
  {
    "id": "records-largest-crystal",
    "prompt": "How many metres long is the largest natural crystal ever found?",
    "unit": "metres",
    "answerValue": 12,
    "decompositionHint": "Gypsum grown slowly in a flooded cave kept at a steady 58 degrees for hundreds of thousands of years. Think in terms of a bus, not a hand specimen.",
    "strategy": "anchor-scale",
    "source": "Published mineralogical surveys of the Cave of the Crystals, Naica",
    "asOf": 2025
  },
  {
    "id": "records-largest-geode",
    "prompt": "How many metres long is the largest geode anyone can walk inside?",
    "unit": "metres",
    "answerValue": 8,
    "decompositionHint": "A gypsum-lined cavity big enough for a few people to stand in at once, lined with transparent crystals up to two metres long. Geodes are normally fist-sized.",
    "strategy": "anchor-scale",
    "source": "Spanish Geological and Mining Institute survey of the Pulpi Geode",
    "asOf": 2025
  },
  {
    "id": "records-largest-gold-nugget",
    "prompt": "How many kilograms did the largest gold nugget ever found weigh?",
    "unit": "kilograms",
    "answerValue": 109.59,
    "decompositionHint": "Gold is nineteen times denser than water, so a nugget the size of a football weighs far more than it looks. This is its weight as dug up, before refining.",
    "strategy": "volume-packing",
    "source": "Museums Victoria records for the Welcome Stranger nugget",
    "asOf": 1869
  },
  {
    "id": "records-largest-rough-diamond",
    "prompt": "How many carats did the largest rough diamond ever found weigh?",
    "unit": "carats",
    "answerValue": 3106,
    "decompositionHint": "A carat is a fifth of a gram, so convert to grams first and ask how big a lump of carbon that actually is. It was cut into nine major stones.",
    "strategy": "unit-conversion",
    "source": "Royal Collection Trust records for the Cullinan diamond",
    "asOf": 1905
  },
  {
    "id": "records-deepest-mine",
    "prompt": "How many metres below the surface does the deepest mine reach?",
    "unit": "metres",
    "answerValue": 4000,
    "decompositionHint": "The limit is heat and rock pressure: the rock face is around 60 degrees and has to be cooled with ice to be workable at all.",
    "strategy": "anchor-scale",
    "source": "South African Department of Mineral Resources records for the Mponeng mine",
    "asOf": 2025
  },
  {
    "id": "records-deepest-permafrost",
    "prompt": "How many metres deep does the deepest permafrost extend?",
    "unit": "metres",
    "answerValue": 1650,
    "decompositionHint": "Frozen ground reaches down until the Earth's own heat wins, so the depth depends on how cold the surface has stayed for how long.",
    "strategy": "anchor-scale",
    "source": "Russian Academy of Sciences permafrost measurements in the Lena river basin",
    "asOf": 2025
  },
  {
    "id": "records-largest-river-delta",
    "prompt": "How many square kilometres does the largest river delta cover?",
    "unit": "square kilometres",
    "answerValue": 105000,
    "decompositionHint": "Two major rivers meeting before the sea, depositing sediment across a coastal plain roughly 350 km wide and 300 deep.",
    "strategy": "area-density",
    "source": "Bangladesh Water Development Board survey of the Ganges-Brahmaputra delta",
    "asOf": 2025
  },
  {
    "id": "records-largest-open-pit",
    "prompt": "How many metres deep is the deepest open-pit mine?",
    "unit": "metres",
    "answerValue": 1200,
    "decompositionHint": "Dug as a widening cone rather than a shaft, because the walls must slope gently enough not to collapse. Four kilometres across at the top.",
    "strategy": "anchor-scale",
    "source": "Rio Tinto published mine specifications for Bingham Canyon",
    "asOf": 2025
  },
  {
    "id": "records-heaviest-animal-heart",
    "prompt": "How many kilograms does the heart of a blue whale weigh?",
    "unit": "kilograms",
    "answerValue": 180,
    "decompositionHint": "A heart is roughly half a percent of body mass in large mammals, and a blue whale runs to 150 tonnes. Work from that fraction.",
    "strategy": "divide-total",
    "source": "Royal Ontario Museum specimen measurements",
    "asOf": 2015
  },
  {
    "id": "records-longest-animal",
    "prompt": "How many metres long can the longest animal on Earth stretch?",
    "unit": "metres",
    "answerValue": 55,
    "decompositionHint": "A marine worm a few millimetres thick that stretches rather than grows bulk, so length is limited by tearing rather than by weight.",
    "strategy": "anchor-scale",
    "source": "Published specimen record of the bootlace worm, St Andrews",
    "asOf": 2025
  },
  {
    "id": "records-fastest-wingbeat",
    "prompt": "How many wingbeats per second does the fastest-beating insect wing manage?",
    "unit": "beats per second",
    "answerValue": 1046,
    "decompositionHint": "Too fast for nerves to fire once per beat, so the muscle oscillates mechanically instead. A bee manages about 230.",
    "strategy": "anchor-scale",
    "source": "Published entomological measurements of the midge Forcipomyia",
    "asOf": 2025
  },
  {
    "id": "records-most-eggs-laid",
    "prompt": "How many eggs can a single ocean sunfish carry at one time?",
    "unit": "eggs",
    "answerValue": 300000000,
    "decompositionHint": "Each egg is about a millimetre across and the fish weighs a tonne, so work out how many millimetre spheres a fraction of that volume holds.",
    "strategy": "volume-packing",
    "source": "Published ichthyological studies of Mola mola fecundity",
    "asOf": 2025
  },
  {
    "id": "records-longest-gestation",
    "prompt": "How many days is the longest gestation period of any animal?",
    "unit": "days",
    "answerValue": 1278,
    "decompositionHint": "A deep-sea shark in cold water, where everything runs slowly. An elephant manages 645 days, and this is roughly twice that.",
    "strategy": "anchor-scale",
    "source": "Published studies of frilled shark reproduction, Japanese fisheries research",
    "asOf": 2025
  },
  {
    "id": "records-largest-egg",
    "prompt": "How many kilograms did the largest bird egg ever known weigh?",
    "unit": "kilograms",
    "answerValue": 10,
    "decompositionHint": "Laid by a flightless bird three metres tall. An ostrich egg is 1.4 kg, and shell thickness limits how much bigger an egg can get.",
    "strategy": "anchor-scale",
    "source": "Natural History Museum specimen records for the elephant bird",
    "asOf": 2025
  },
  {
    "id": "records-smallest-mammal",
    "prompt": "How many grams does the smallest mammal weigh?",
    "unit": "grams",
    "answerValue": 2,
    "decompositionHint": "The floor is set by heat loss: below this, surface area beats metabolism and the animal cannot eat fast enough to stay warm.",
    "strategy": "anchor-scale",
    "source": "IUCN species account for Kitti's hog-nosed bat",
    "asOf": 2025
  },
  {
    "id": "records-longest-mammal-migration",
    "prompt": "How many kilometres does the longest mammal migration cover in a year?",
    "unit": "kilometres",
    "answerValue": 22500,
    "decompositionHint": "A whale swimming from Arctic feeding grounds to tropical breeding lagoons and back, at a steady few kilometres an hour for months.",
    "strategy": "rate-time",
    "source": "NOAA Fisheries tracking of grey whale migration",
    "asOf": 2025
  },
  {
    "id": "records-deepest-mammal-dive",
    "prompt": "How many metres down has the deepest-diving mammal been recorded?",
    "unit": "metres",
    "answerValue": 2992,
    "decompositionHint": "A beaked whale hunting squid, with collapsible lungs and muscle that stores oxygen. Sperm whales manage about 2,000 metres.",
    "strategy": "anchor-scale",
    "source": "Published satellite tagging of Cuvier's beaked whale, Scripps Institution",
    "asOf": 2014
  },
  {
    "id": "records-longest-mammal-dive",
    "prompt": "How many minutes did the longest recorded dive by a mammal last?",
    "unit": "minutes",
    "answerValue": 222,
    "decompositionHint": "Nearly four hours on one breath. The trick is not lung capacity but slowing the heart and shutting blood off from everything but brain and heart.",
    "strategy": "anchor-scale",
    "source": "Published satellite tagging of Cuvier's beaked whale, Duke University",
    "asOf": 2020
  },
  {
    "id": "records-longest-bird-flight-distance",
    "prompt": "How many kilometres did the longest non-stop bird flight cover?",
    "unit": "kilometres",
    "answerValue": 13560,
    "decompositionHint": "Alaska to Tasmania without landing, feeding or drinking, in about eleven days. Work from a sustained ground speed and that many days.",
    "strategy": "rate-time",
    "source": "Published satellite tracking of a bar-tailed godwit, Global Flyway Network",
    "asOf": 2022
  },
  {
    "id": "records-deepest-bird-dive",
    "prompt": "How many metres down has the deepest-diving bird been recorded?",
    "unit": "metres",
    "answerValue": 564,
    "decompositionHint": "An emperor penguin hunting under sea ice. Its bones are solid rather than hollow, which is why it can go so much deeper than any other bird.",
    "strategy": "anchor-scale",
    "source": "British Antarctic Survey dive-recorder data",
    "asOf": 2025
  },
  {
    "id": "records-longest-lived-vertebrate",
    "prompt": "How many years old was the oldest vertebrate ever found?",
    "unit": "years",
    "answerValue": 392,
    "decompositionHint": "A shark in near-freezing Arctic water, growing about a centimetre a year and aged by radiocarbon in its eye lens.",
    "strategy": "rate-time",
    "source": "Published radiocarbon dating of Greenland sharks, University of Copenhagen",
    "asOf": 2016
  },
  {
    "id": "records-most-abundant-wild-bird",
    "prompt": "How many individuals does the most numerous wild bird species number?",
    "unit": "birds",
    "answerValue": 1500000000,
    "decompositionHint": "A small African grain-eater that moves in flocks of millions and is treated as an agricultural pest across a continent.",
    "strategy": "anchor-scale",
    "source": "IUCN Red List population assessment for the red-billed quelea",
    "asOf": 2025
  },
  {
    "id": "records-largest-animal-biomass",
    "prompt": "How many tonnes is the total biomass of Antarctic krill?",
    "unit": "tonnes",
    "answerValue": 379000000,
    "decompositionHint": "Each animal weighs about a gram, so the question is really how many trillions of them the Southern Ocean holds.",
    "strategy": "chain-multiply",
    "source": "Commission for the Conservation of Antarctic Marine Living Resources survey",
    "asOf": 2025
  },
  {
    "id": "records-strongest-animal-for-its-size",
    "prompt": "How many times its own body weight can the strongest insect pull?",
    "unit": "times its body weight",
    "answerValue": 1141,
    "decompositionHint": "Strength scales with muscle cross-section, which is area, while weight scales with volume - so small animals are always stronger for their size.",
    "strategy": "anchor-scale",
    "source": "Published biomechanics study of the dung beetle Onthophagus taurus",
    "asOf": 2010
  },
  {
    "id": "records-most-teeth",
    "prompt": "How many teeth does a garden snail have on its feeding ribbon?",
    "unit": "teeth",
    "answerValue": 25000,
    "decompositionHint": "Not teeth in a jaw but rows of microscopic ones on a rasping tongue, replaced continuously as they wear away.",
    "strategy": "anchor-scale",
    "source": "Published malacological studies of the gastropod radula",
    "asOf": 2025
  },
  {
    "id": "records-most-legs",
    "prompt": "How many legs does the animal with the most legs have?",
    "unit": "legs",
    "answerValue": 1306,
    "decompositionHint": "A threadlike millipede found deep in a mining borehole. It adds segments as it grows, so the count is limited by how long it lives.",
    "strategy": "anchor-scale",
    "source": "Published description of Eumillipes persephone, Scientific Reports",
    "asOf": 2021
  },
  {
    "id": "records-largest-eye",
    "prompt": "How many centimetres across is the largest eye of any animal?",
    "unit": "centimetres",
    "answerValue": 27,
    "decompositionHint": "A deep-sea squid that needs to spot an approaching sperm whale by the faint glow it disturbs. A human eye is about 2.4 cm.",
    "strategy": "anchor-scale",
    "source": "Museum of New Zealand Te Papa colossal squid specimen measurements",
    "asOf": 2025
  },
  {
    "id": "records-largest-jellyfish",
    "prompt": "How many metres long can the tentacles of the largest jellyfish reach?",
    "unit": "metres",
    "answerValue": 36.6,
    "decompositionHint": "The bell is only a couple of metres across; almost all the length is trailing tentacles fishing a large volume of water.",
    "strategy": "anchor-scale",
    "source": "Published specimen record of the lion's mane jellyfish, Massachusetts Bay",
    "asOf": 2025
  },
  {
    "id": "records-largest-bacterium",
    "prompt": "How many millimetres long is the largest known single bacterial cell?",
    "unit": "millimetres",
    "answerValue": 20,
    "decompositionHint": "Visible to the naked eye as a pale thread, which is remarkable because a typical bacterium is a thousandth of this.",
    "strategy": "anchor-scale",
    "source": "Published description of Thiomargarita magnifica, Science",
    "asOf": 2022
  },
  {
    "id": "records-largest-genome",
    "prompt": "How many base pairs does the largest known genome contain?",
    "unit": "base pairs",
    "answerValue": 149000000000,
    "decompositionHint": "A fern-like plant, not an animal. The human genome has three billion, so ask how many times larger a genome can plausibly get.",
    "strategy": "anchor-scale",
    "source": "Royal Botanic Gardens Kew plant DNA C-values database",
    "asOf": 2023
  },
  {
    "id": "records-largest-tree-by-volume",
    "prompt": "How many cubic metres of wood does the largest single tree contain?",
    "unit": "cubic metres",
    "answerValue": 1487,
    "decompositionHint": "Treat the trunk as a tapering cylinder: about 11 metres across at the base and 83 metres tall. Branches add surprisingly little.",
    "strategy": "volume-packing",
    "source": "United States National Park Service measurements of General Sherman",
    "asOf": 2025
  },
  {
    "id": "records-heaviest-organism",
    "prompt": "How many kilograms does the heaviest known single organism weigh?",
    "unit": "kilograms",
    "answerValue": 6000000,
    "decompositionHint": "A single aspen clone of tens of thousands of stems sharing one root system, spread over 43 hectares.",
    "strategy": "area-density",
    "source": "United States Forest Service surveys of the Pando aspen clone",
    "asOf": 2025
  },
  {
    "id": "records-fastest-growing-plant",
    "prompt": "How many centimetres a day can the fastest-growing plant add?",
    "unit": "centimetres per day",
    "answerValue": 91,
    "decompositionHint": "Bamboo does not build new cells so much as inflate ones already made, which is why it can outpace anything that grows the ordinary way.",
    "strategy": "rate-time",
    "source": "Published growth measurements of Phyllostachys bamboo, Kyoto University",
    "asOf": 2025
  },
  {
    "id": "records-largest-leaf",
    "prompt": "How many metres long is the largest leaf of any plant?",
    "unit": "metres",
    "answerValue": 25,
    "decompositionHint": "A single raffia palm frond, which has to be stiff enough not to tear under its own weight in wind. Think in terms of a bus length.",
    "strategy": "anchor-scale",
    "source": "Royal Botanic Gardens Kew records for Raphia regalis",
    "asOf": 2025
  },
  {
    "id": "records-smallest-flowering-plant",
    "prompt": "How many millimetres across is the smallest flowering plant?",
    "unit": "millimetres",
    "answerValue": 0.6,
    "decompositionHint": "A floating duckweed with no leaves, stem or roots at all - the whole plant is a single grain smaller than a pinhead.",
    "strategy": "anchor-scale",
    "source": "Royal Botanic Gardens Kew records for Wolffia globosa",
    "asOf": 2025
  },
  {
    "id": "records-deepest-growing-plant",
    "prompt": "How many metres below the surface has the deepest-growing marine algae been found?",
    "unit": "metres",
    "answerValue": 269,
    "decompositionHint": "The limit is light: only about one part in a hundred thousand of surface sunlight reaches this far down in the clearest water.",
    "strategy": "exponential",
    "source": "Published survey of coralline algae, Bahamas seamount",
    "asOf": 2025
  },
  {
    "id": "records-longest-lived-insect",
    "prompt": "How many years can the longest-lived insect survive?",
    "unit": "years",
    "answerValue": 50,
    "decompositionHint": "A termite queen doing nothing but laying eggs while sealed in a climate-controlled chamber and fed by her own offspring.",
    "strategy": "anchor-scale",
    "source": "Published studies of Macrotermes colony longevity",
    "asOf": 2025
  },
  {
    "id": "records-largest-insect-wingspan",
    "prompt": "How many centimetres across were the wings of the largest flying insect ever?",
    "unit": "centimetres",
    "answerValue": 71,
    "decompositionHint": "It flew when the air held far more oxygen, which is what let an insect that size breathe through tubes rather than lungs.",
    "strategy": "anchor-scale",
    "source": "Published palaeontological descriptions of Meganeuropsis permiana",
    "asOf": 2025
  },
  {
    "id": "records-fastest-heart-rate",
    "prompt": "How many beats per minute is the fastest recorded animal heart rate?",
    "unit": "beats per minute",
    "answerValue": 1260,
    "decompositionHint": "A hummingbird hovering. Heart rate scales inversely with body size, so start from a human's 70 and work down the mass scale.",
    "strategy": "anchor-scale",
    "source": "Published physiological measurements of the blue-throated hummingbird",
    "asOf": 2025
  },
  {
    "id": "records-highest-flying-bird",
    "prompt": "How many metres up has the highest-flying bird been recorded?",
    "unit": "metres",
    "answerValue": 11300,
    "decompositionHint": "Struck by an airliner at cruising altitude over West Africa, where there is barely a quarter of the oxygen available at sea level.",
    "strategy": "anchor-scale",
    "source": "United States Air Force bird strike records for Ruppell's griffon vulture",
    "asOf": 1973
  },
  {
    "id": "records-deepest-land-animal",
    "prompt": "How many metres underground has the deepest-living land animal been found?",
    "unit": "metres",
    "answerValue": 1980,
    "decompositionHint": "In a cave system rather than in soil, feeding on what washes down. Nothing photosynthesises there, so the whole food chain arrives from above.",
    "strategy": "anchor-scale",
    "source": "Published cave biology surveys of Krubera Cave",
    "asOf": 2025
  },
  {
    "id": "records-largest-virus",
    "prompt": "How many micrometres long is the largest known virus?",
    "unit": "micrometres",
    "answerValue": 1.5,
    "decompositionHint": "Big enough to see under an ordinary light microscope and larger than some bacteria, which is why it went unnoticed for so long.",
    "strategy": "anchor-scale",
    "source": "Published description of Pithovirus sibericum, PNAS",
    "asOf": 2014
  },
  {
    "id": "records-longest-suspension-span",
    "prompt": "How many metres is the longest single span of any suspension bridge?",
    "unit": "metres",
    "answerValue": 2023,
    "decompositionHint": "The limit is the cable carrying its own weight before any traffic. The Golden Gate manages 1,280 metres and dates from 1937.",
    "strategy": "anchor-scale",
    "source": "Turkish General Directorate of Highways specifications for the Canakkale Bridge",
    "asOf": 2022
  },
  {
    "id": "records-highest-bridge-deck",
    "prompt": "How many metres above the river below does the highest bridge deck sit?",
    "unit": "metres",
    "answerValue": 625,
    "decompositionHint": "It crosses a gorge rather than a wide valley, so compare the drop with a very tall building rather than with a normal bridge.",
    "strategy": "anchor-scale",
    "source": "China Ministry of Transport records for the Huajiang Canyon Bridge",
    "asOf": 2025
  },
  {
    "id": "records-largest-dam-volume",
    "prompt": "How many cubic metres of material were used to build the largest dam by volume?",
    "unit": "cubic metres",
    "answerValue": 153000000,
    "decompositionHint": "An earth-fill embankment rather than a concrete wall, so it is essentially an artificial hill: about 2.7 km long and 140 metres high.",
    "strategy": "volume-packing",
    "source": "Pakistan Water and Power Development Authority records for Tarbela Dam",
    "asOf": 2025
  },
  {
    "id": "records-largest-reservoir",
    "prompt": "How many cubic kilometres of water does the largest artificial reservoir hold?",
    "unit": "cubic kilometres",
    "answerValue": 180,
    "decompositionHint": "A flooded valley about 220 km long and 40 wide, averaging perhaps 30 metres deep. Multiply those out and convert.",
    "strategy": "volume-packing",
    "source": "Zambezi River Authority records for Lake Kariba",
    "asOf": 2025
  },
  {
    "id": "records-largest-power-station",
    "prompt": "How many megawatts can the largest power station generate?",
    "unit": "megawatts",
    "answerValue": 22500,
    "decompositionHint": "A hydroelectric plant with dozens of turbines. A single large nuclear reactor is about 1,000 megawatts, so count how many of those it replaces.",
    "strategy": "anchor-scale",
    "source": "China Three Gorges Corporation published generating capacity",
    "asOf": 2025
  },
  {
    "id": "records-largest-solar-farm",
    "prompt": "How many megawatts can the largest solar power complex generate?",
    "unit": "megawatts",
    "answerValue": 15600,
    "decompositionHint": "Panels yield roughly 200 watts per square metre of array in good sun, so the question is really how many square kilometres of desert are covered.",
    "strategy": "area-density",
    "source": "China National Energy Administration capacity records for the Gonghe-Talatan complex",
    "asOf": 2025
  },
  {
    "id": "records-largest-battery-storage",
    "prompt": "How many megawatt hours can the largest battery storage facility hold?",
    "unit": "megawatt hours",
    "answerValue": 3000,
    "decompositionHint": "Enough to run a small city for a few hours, not a few days. Compare it with an electric car battery at about 0.075 megawatt hours.",
    "strategy": "divide-total",
    "source": "California Energy Commission records for the Moss Landing facility",
    "asOf": 2025
  },
  {
    "id": "records-longest-power-line",
    "prompt": "How many kilometres long is the longest electricity transmission line?",
    "unit": "kilometres",
    "answerValue": 2543,
    "decompositionHint": "It carries power from a remote dam to a distant city, using direct current because alternating current loses too much over that distance.",
    "strategy": "anchor-scale",
    "source": "Brazilian National Electric Energy Agency records for the Belo Monte link",
    "asOf": 2019
  },
  {
    "id": "records-longest-pipeline",
    "prompt": "How many kilometres long is the longest natural gas pipeline system?",
    "unit": "kilometres",
    "answerValue": 8704,
    "decompositionHint": "It crosses a continent-sized country from its western deserts to its eastern coast. Compare that with the width of the country itself.",
    "strategy": "anchor-scale",
    "source": "China National Petroleum Corporation specifications for the West-East Gas Pipeline",
    "asOf": 2025
  },
  {
    "id": "records-longest-canal",
    "prompt": "How many kilometres long is the longest canal ever built?",
    "unit": "kilometres",
    "answerValue": 1776,
    "decompositionHint": "Dug by hand over more than a thousand years to link two great rivers, and still partly in use. Think in terms of a country's length.",
    "strategy": "anchor-scale",
    "source": "UNESCO World Heritage documentation for the Grand Canal of China",
    "asOf": 2025
  },
  {
    "id": "records-longest-undersea-tunnel",
    "prompt": "How many kilometres of the longest undersea tunnel actually run beneath the sea?",
    "unit": "kilometres",
    "answerValue": 37.9,
    "decompositionHint": "The whole tunnel is longer, but only the stretch under water counts here - roughly the width of the strait it crosses.",
    "strategy": "anchor-scale",
    "source": "Eurotunnel published engineering data for the Channel Tunnel",
    "asOf": 2025
  },
  {
    "id": "records-longest-tunnel-any-kind",
    "prompt": "How many kilometres long is the longest tunnel of any kind?",
    "unit": "kilometres",
    "answerValue": 137,
    "decompositionHint": "It carries drinking water rather than trains, bored through bedrock in one continuous run to supply a large city.",
    "strategy": "anchor-scale",
    "source": "New York City Department of Environmental Protection, Delaware Aqueduct",
    "asOf": 2025
  },
  {
    "id": "records-deepest-tunnel",
    "prompt": "How many metres of rock sit above the deepest point of any transport tunnel?",
    "unit": "metres",
    "answerValue": 2450,
    "decompositionHint": "Deep enough that the rock face is around 45 degrees and has to be cooled. That depth is set by the height of the mountains above it.",
    "strategy": "anchor-scale",
    "source": "AlpTransit Gotthard construction records",
    "asOf": 2016
  },
  {
    "id": "records-longest-train",
    "prompt": "How many metres long was the longest train ever run?",
    "unit": "metres",
    "answerValue": 7353,
    "decompositionHint": "682 iron ore wagons hauled as one. A wagon is a little over ten metres, so multiply rather than picture the whole thing.",
    "strategy": "chain-multiply",
    "source": "BHP published operating records for the Mount Newman line",
    "asOf": 2001
  },
  {
    "id": "records-heaviest-train",
    "prompt": "How many tonnes did the heaviest train ever run weigh?",
    "unit": "tonnes",
    "answerValue": 99734,
    "decompositionHint": "Hundreds of wagons each carrying well over a hundred tonnes of ore. Start from the wagon count and the load per wagon.",
    "strategy": "chain-multiply",
    "source": "BHP published operating records for the Mount Newman line",
    "asOf": 2001
  },
  {
    "id": "records-largest-land-vehicle",
    "prompt": "How many tonnes does the largest self-propelled land vehicle weigh?",
    "unit": "tonnes",
    "answerValue": 14200,
    "decompositionHint": "A bucket-wheel excavator that walks on crawler tracks at a tenth of a kilometre an hour. It is 96 metres tall and 225 long.",
    "strategy": "volume-packing",
    "source": "TAKRAF published specifications for the Bagger 293",
    "asOf": 2025
  },
  {
    "id": "records-greatest-crane-lift",
    "prompt": "How many tonnes can the strongest crane lift in a single hoist?",
    "unit": "tonnes",
    "answerValue": 20133,
    "decompositionHint": "A shipyard gantry rather than a mobile crane, lifting whole hull sections. A large mobile crane manages about 1,200 tonnes.",
    "strategy": "anchor-scale",
    "source": "Yantai Raffles Shipyard specifications for the Taisun crane",
    "asOf": 2008
  },
  {
    "id": "records-heaviest-aircraft",
    "prompt": "How many kilograms was the maximum takeoff weight of the heaviest aircraft ever flown?",
    "unit": "kilograms",
    "answerValue": 640000,
    "decompositionHint": "Six engines and thirty-two wheels. A fully loaded jumbo jet is about 400 tonnes, so this is that and half again.",
    "strategy": "anchor-scale",
    "source": "Antonov Design Bureau specifications for the An-225",
    "asOf": 2001
  },
  {
    "id": "records-largest-container-ship",
    "prompt": "How many standard containers can the largest container ship carry?",
    "unit": "containers",
    "answerValue": 24346,
    "decompositionHint": "The hull is about 400 metres by 61. Work out how many six-metre boxes fit across and along, then how many layers high they stack.",
    "strategy": "volume-packing",
    "source": "Lloyd's Register vessel specifications",
    "asOf": 2023
  },
  {
    "id": "records-largest-cruise-ship",
    "prompt": "How many gross tons is the largest cruise ship?",
    "unit": "gross tons",
    "answerValue": 248663,
    "decompositionHint": "Gross tonnage measures enclosed volume rather than weight - one gross ton is about 2.83 cubic metres - so this is a floating volume figure.",
    "strategy": "unit-conversion",
    "source": "Lloyd's Register vessel specifications for Icon of the Seas",
    "asOf": 2024
  },
  {
    "id": "records-largest-building-by-volume",
    "prompt": "How many cubic metres does the largest building by volume enclose?",
    "unit": "cubic metres",
    "answerValue": 13300000,
    "decompositionHint": "An aircraft assembly hall: about 1,000 metres long, 500 wide and 35 high. Multiply rather than guessing the volume directly.",
    "strategy": "volume-packing",
    "source": "Boeing published facility specifications for the Everett factory",
    "asOf": 2025
  },
  {
    "id": "records-largest-building-by-floor-area",
    "prompt": "How many square metres of floor space does the New Century Global Center have?",
    "unit": "square metres",
    "answerValue": 1700000,
    "decompositionHint": "It holds shops, offices, hotels and an indoor beach under one roof. Compare it with a large shopping centre at maybe 150,000 square metres.",
    "strategy": "anchor-scale",
    "source": "Chengdu municipal records for the New Century Global Center",
    "asOf": 2025
  },
  {
    "id": "records-largest-airport-area",
    "prompt": "How many square kilometres does the largest airport by land area cover?",
    "unit": "square kilometres",
    "answerValue": 776,
    "decompositionHint": "Most of it is empty desert held in reserve rather than terminals and runways. For scale, a large city airport occupies about 20 square kilometres.",
    "strategy": "anchor-scale",
    "source": "Saudi General Authority of Civil Aviation records for King Fahd International",
    "asOf": 2025
  },
  {
    "id": "records-tallest-statue",
    "prompt": "How many metres tall is the tallest statue in the world?",
    "unit": "metres",
    "answerValue": 182,
    "decompositionHint": "Measured without its plinth. The Statue of Liberty is 46 metres to the torch, so ask how many of those this stacks up to.",
    "strategy": "anchor-scale",
    "source": "Government of Gujarat records for the Statue of Unity",
    "asOf": 2018
  },
  {
    "id": "records-largest-clock-face",
    "prompt": "How many metres across is the largest clock face ever built?",
    "unit": "metres",
    "answerValue": 43,
    "decompositionHint": "Mounted 400 metres up a tower so it can be read from kilometres away. Big Ben's dial is seven metres, which is the usual upper limit.",
    "strategy": "anchor-scale",
    "source": "Published engineering specifications for the Makkah Royal Clock Tower",
    "asOf": 2025
  },
  {
    "id": "records-longest-escalator",
    "prompt": "How many metres long is the longest escalator?",
    "unit": "metres",
    "answerValue": 137,
    "decompositionHint": "It serves a very deep metro station, so the length is set by the depth divided by the sine of a thirty-degree incline.",
    "strategy": "anchor-scale",
    "source": "Saint Petersburg Metro published station specifications",
    "asOf": 2025
  },
  {
    "id": "records-fastest-lift",
    "prompt": "How many metres per second does the fastest lift travel?",
    "unit": "metres per second",
    "answerValue": 21,
    "decompositionHint": "The ceiling is not the motor but the passenger's ears: pressure change is what limits how fast a lift can climb comfortably.",
    "strategy": "anchor-scale",
    "source": "Hitachi specifications for the Guangzhou CTF Finance Centre lifts",
    "asOf": 2025
  },
  {
    "id": "records-longest-wind-turbine-blade",
    "prompt": "How many metres long is the longest wind turbine blade?",
    "unit": "metres",
    "answerValue": 143,
    "decompositionHint": "Power rises with the square of blade length, which is why they keep growing. Compare it with the wingspan of a large airliner, about 80 metres.",
    "strategy": "anchor-scale",
    "source": "Published manufacturer specifications for offshore turbine blades",
    "asOf": 2025
  },
  {
    "id": "records-oldest-company",
    "prompt": "How many years has the oldest continuously operating company been in business?",
    "unit": "years",
    "answerValue": 1446,
    "decompositionHint": "A temple construction firm founded in Japan not long after Buddhism arrived there, which puts its founding in the sixth century.",
    "strategy": "anchor-scale",
    "source": "Japanese corporate registry records for Kongo Gumi",
    "asOf": 2024
  },
  {
    "id": "records-canal-excavation-volume",
    "prompt": "How many cubic metres of earth were excavated to build the Panama Canal?",
    "unit": "cubic metres",
    "answerValue": 205000000,
    "decompositionHint": "A cut 80 km long, and in places 100 metres deep through a mountain ridge. Estimate an average cross-section and multiply by the length.",
    "strategy": "volume-packing",
    "source": "Panama Canal Authority historical construction records",
    "asOf": 1914
  },
  {
    "id": "records-busiest-airport",
    "prompt": "How many passengers a year pass through the busiest airport?",
    "unit": "passengers",
    "answerValue": 108100000,
    "decompositionHint": "Divide by 365 to get daily passengers, then by a plausible aircraft load, and check the number of flights a day sounds physically possible.",
    "strategy": "divide-total",
    "source": "Airports Council International annual traffic rankings",
    "asOf": 2024
  },
  {
    "id": "records-longest-boxing-match",
    "prompt": "How many rounds did the longest gloved boxing match last?",
    "unit": "rounds",
    "answerValue": 110,
    "decompositionHint": "Fought before rounds were limited, so it ended only when both men were too exhausted to continue. It ran over seven hours.",
    "strategy": "anchor-scale",
    "source": "Louisiana boxing commission and contemporary press records, New Orleans 1893",
    "asOf": 1893
  },
  {
    "id": "records-longest-cricket-match",
    "prompt": "How many minutes of play did the longest cricket match last?",
    "unit": "minutes",
    "answerValue": 2596,
    "decompositionHint": "A timeless Test played to a finish, abandoned only because the visiting team had a ship to catch. Nine days of play at about six hours a day.",
    "strategy": "rate-time",
    "source": "Marylebone Cricket Club match records, Durban 1939",
    "asOf": 1939
  },
  {
    "id": "records-highest-cricket-innings",
    "prompt": "How many runs did the highest first-class cricket innings total reach?",
    "unit": "runs",
    "answerValue": 1107,
    "decompositionHint": "A single innings on a flat pitch against tiring bowling. A very good Test innings total is about 600, so ask how far past that is possible.",
    "strategy": "anchor-scale",
    "source": "Cricket Australia first-class match records, Melbourne 1926",
    "asOf": 1926
  },
  {
    "id": "records-longest-winning-streak",
    "prompt": "How many consecutive matches did the longest unbeaten run by a squash player reach?",
    "unit": "matches",
    "answerValue": 555,
    "decompositionHint": "Five years and seven months without a single defeat, across every tournament entered. Work from matches per year times years.",
    "strategy": "rate-time",
    "source": "Professional Squash Association records",
    "asOf": 1986
  },
  {
    "id": "records-longest-unbeaten-football-run",
    "prompt": "How many league matches did the longest unbeaten run in top-flight football last?",
    "unit": "matches",
    "answerValue": 104,
    "decompositionHint": "A domestic league season is about 34 matches, so this is three full seasons and more without losing once.",
    "strategy": "divide-total",
    "source": "Romanian Football Federation league records",
    "asOf": 1989
  },
  {
    "id": "records-longest-tour-de-france-stage",
    "prompt": "How many kilometres was the longest stage ever raced in the Tour de France?",
    "unit": "kilometres",
    "answerValue": 482,
    "decompositionHint": "Ridden in a single day on unpaved roads, starting before dawn. A modern long stage is about 240 km.",
    "strategy": "anchor-scale",
    "source": "Amaury Sport Organisation historical Tour de France records",
    "asOf": 1919
  },
  {
    "id": "records-longest-glider-flight",
    "prompt": "How many kilometres is the longest distance flown by a glider?",
    "unit": "kilometres",
    "answerValue": 3009,
    "decompositionHint": "Flown along a mountain wave that provides lift for hundreds of kilometres, so the limit is daylight rather than altitude.",
    "strategy": "rate-time",
    "source": "Federation Aeronautique Internationale ratified gliding records",
    "asOf": 2003
  },
  {
    "id": "records-longest-balloon-flight",
    "prompt": "How many kilometres is the longest distance flown by a hot air balloon?",
    "unit": "kilometres",
    "answerValue": 7672,
    "decompositionHint": "It crossed an ocean by riding a jet stream, so the distance is set by how long the fuel lasts at a few hundred kilometres an hour.",
    "strategy": "rate-time",
    "source": "Federation Aeronautique Internationale ratified ballooning records",
    "asOf": 1991
  },
  {
    "id": "records-human-powered-flight",
    "prompt": "How many kilometres is the longest distance flown by a human-powered aircraft?",
    "unit": "kilometres",
    "answerValue": 115.11,
    "decompositionHint": "A trained cyclist can sustain about 250 watts for three hours, and the aircraft needed roughly that. Multiply by a plausible airspeed.",
    "strategy": "rate-time",
    "source": "Federation Aeronautique Internationale ratified human-powered flight record",
    "asOf": 1988
  },
  {
    "id": "records-fastest-sailing-speed",
    "prompt": "How many kilometres per hour is the fastest speed ever sailed on water?",
    "unit": "kilometres per hour",
    "answerValue": 121.2,
    "decompositionHint": "A hydrofoil craft on a shallow canal, where flat water removes the usual limit. A fast racing yacht manages about 60 km/h.",
    "strategy": "anchor-scale",
    "source": "World Sailing Speed Record Council ratified record",
    "asOf": 2012
  },
  {
    "id": "records-fastest-freefall",
    "prompt": "How many kilometres per hour is the fastest speed reached in freefall?",
    "unit": "kilometres per hour",
    "answerValue": 1357.6,
    "decompositionHint": "Faster than sound, which is only possible because the air at that altitude is too thin to slow a falling body much.",
    "strategy": "anchor-scale",
    "source": "Federation Aeronautique Internationale ratified record",
    "asOf": 2012
  },
  {
    "id": "records-fastest-bicycle-speed",
    "prompt": "How many kilometres per hour is the fastest speed ever ridden on a bicycle?",
    "unit": "kilometres per hour",
    "answerValue": 296,
    "decompositionHint": "Ridden in the slipstream of a vehicle, which removes almost all the air resistance. In open air a cyclist tops out near 130 km/h downhill.",
    "strategy": "anchor-scale",
    "source": "Published timing records, Bonneville Salt Flats",
    "asOf": 2018
  },
  {
    "id": "records-fastest-skiing-speed",
    "prompt": "How many kilometres per hour is the fastest speed reached on skis?",
    "unit": "kilometres per hour",
    "answerValue": 255,
    "decompositionHint": "On a purpose-built straight slope steep enough that air resistance, not gravity, sets the limit. Downhill racers reach about 150 km/h.",
    "strategy": "anchor-scale",
    "source": "International Ski Federation speed skiing records",
    "asOf": 2016
  },
  {
    "id": "records-longest-ski-jump",
    "prompt": "How many metres is the longest ski jump ever landed?",
    "unit": "metres",
    "answerValue": 253.5,
    "decompositionHint": "The jumper is effectively gliding, so distance depends on the hill profile: the landing slope has to fall away as fast as the jumper descends.",
    "strategy": "anchor-scale",
    "source": "International Ski Federation ratified ski flying record",
    "asOf": 2017
  },
  {
    "id": "records-farthest-wingsuit-flight",
    "prompt": "How many kilometres is the longest distance flown in a wingsuit?",
    "unit": "kilometres",
    "answerValue": 32.094,
    "decompositionHint": "A wingsuit glides at roughly three metres forward for every one down, so start from the exit altitude and apply that ratio.",
    "strategy": "anchor-scale",
    "source": "Federation Aeronautique Internationale ratified wingsuit record",
    "asOf": 2017
  },
  {
    "id": "records-longest-glider-endurance",
    "prompt": "How many hours did the longest glider flight stay airborne?",
    "unit": "hours",
    "answerValue": 56.25,
    "decompositionHint": "Flown along a ridge where wind rising over the terrain provides lift day and night. The record was retired as too dangerous to chase.",
    "strategy": "anchor-scale",
    "source": "Federation Aeronautique Internationale historical gliding records",
    "asOf": 1952
  },
  {
    "id": "records-longest-open-water-swim",
    "prompt": "How many kilometres is the longest non-stop open water swim?",
    "unit": "kilometres",
    "answerValue": 225,
    "decompositionHint": "Just over fifty hours in the water. A strong distance swimmer makes about four kilometres an hour, so multiply that by the hours.",
    "strategy": "rate-time",
    "source": "Adriatic swim ratification records, Croatian Swimming Federation",
    "asOf": 2006
  },
  {
    "id": "records-longest-six-day-run",
    "prompt": "How many kilometres has the farthest anyone has run in six days?",
    "unit": "kilometres",
    "answerValue": 1036.8,
    "decompositionHint": "Averaged over six days including sleep, that is a pace worth checking against what a person can hold for one day, which is about 320 km.",
    "strategy": "rate-time",
    "source": "International Association of Ultrarunners ratified record",
    "asOf": 2005
  },
  {
    "id": "records-longest-48-hour-run",
    "prompt": "How many kilometres has the farthest anyone has run in forty-eight hours?",
    "unit": "kilometres",
    "answerValue": 473.5,
    "decompositionHint": "Less than twice the single-day figure, because the second day is always slower. Start from the 24-hour record and discount it.",
    "strategy": "anchor-scale",
    "source": "International Association of Ultrarunners ratified record",
    "asOf": 1996
  },
  {
    "id": "records-deepest-scuba-dive",
    "prompt": "How many metres is the deepest scuba dive ever made?",
    "unit": "metres",
    "answerValue": 332.35,
    "decompositionHint": "The descent took twelve minutes and the decompression took fifteen hours, which is what actually limits the depth.",
    "strategy": "anchor-scale",
    "source": "Verified dive computer logs and witness records, Dahab, Egypt",
    "asOf": 2014
  },
  {
    "id": "records-deepest-constant-weight-freedive",
    "prompt": "How many metres is the deepest freedive under a swimmer's own power?",
    "unit": "metres",
    "answerValue": 136,
    "decompositionHint": "No sled and no lift bag, so the diver must swim back up as well as down - which roughly halves what is reachable with assistance.",
    "strategy": "anchor-scale",
    "source": "AIDA International ratified constant weight record",
    "asOf": 2023
  },
  {
    "id": "records-longest-fast",
    "prompt": "How many days did the longest medically supervised fast last?",
    "unit": "days",
    "answerValue": 382,
    "decompositionHint": "Fat stores are the limit: a person carrying 200 kg has enough energy for well over a year at 2,000 kilocalories a day.",
    "strategy": "divide-total",
    "source": "University of Dundee clinical case report, Postgraduate Medical Journal",
    "asOf": 1966
  },
  {
    "id": "records-longest-survival-without-water",
    "prompt": "How many days did the longest recorded survival without water last?",
    "unit": "days",
    "answerValue": 18,
    "decompositionHint": "Forgotten in a cell at a mild temperature with no exertion, which is what makes it so far beyond the usual three-day figure.",
    "strategy": "anchor-scale",
    "source": "Austrian police and hospital records, Hoechst 1979",
    "asOf": 1979
  },
  {
    "id": "records-longest-time-adrift",
    "prompt": "How many days did the longest survival adrift at sea last?",
    "unit": "days",
    "answerValue": 438,
    "decompositionHint": "Drifting the width of the Pacific on ocean currents moving at a few kilometres an hour. Work from that distance and that speed.",
    "strategy": "rate-time",
    "source": "Marshall Islands government and Mexican consular records",
    "asOf": 2014
  },
  {
    "id": "records-greatest-fall-survived",
    "prompt": "How many metres is the greatest height anyone has fallen and survived without a parachute?",
    "unit": "metres",
    "answerValue": 10160,
    "decompositionHint": "From an aircraft at cruising altitude. Survival depended on staying inside part of the fuselage, which slowed and cushioned the landing.",
    "strategy": "anchor-scale",
    "source": "Czechoslovak civil aviation accident investigation records",
    "asOf": 1972
  },
  {
    "id": "records-longest-artificial-heart-support",
    "prompt": "How many days did the longest support by an artificial heart last?",
    "unit": "days",
    "answerValue": 1373,
    "decompositionHint": "Nearly four years waiting for a transplant. The limiting factors are clotting and infection at the drive line rather than the pump itself.",
    "strategy": "anchor-scale",
    "source": "Published clinical case report, Journal of Heart and Lung Transplantation",
    "asOf": 2018
  },
  {
    "id": "records-fastest-sailing-circumnavigation",
    "prompt": "How many days is the fastest non-stop sailing circumnavigation?",
    "unit": "days",
    "answerValue": 40.96,
    "decompositionHint": "The course runs about 40,000 km around the Southern Ocean. Divide that by a plausible average speed for a racing trimaran.",
    "strategy": "rate-time",
    "source": "World Sailing Speed Record Council ratified record",
    "asOf": 2017
  },
  {
    "id": "records-longest-solo-sailing-voyage",
    "prompt": "How many days did the first non-stop solo sailing circumnavigation take?",
    "unit": "days",
    "answerValue": 312,
    "decompositionHint": "A heavy wooden ketch in 1968, averaging well under five knots. Divide the 48,000 km route by that speed.",
    "strategy": "rate-time",
    "source": "Sunday Times Golden Globe Race official records",
    "asOf": 1969
  },
  {
    "id": "records-largest-marathon-field",
    "prompt": "How many runners finished the largest marathon ever staged?",
    "unit": "finishers",
    "answerValue": 55646,
    "decompositionHint": "Start waves go off for hours to keep the road passable, so the limit is how many can cross a single start line in a morning.",
    "strategy": "rate-time",
    "source": "New York Road Runners published race results",
    "asOf": 2024
  },
  {
    "id": "records-longest-motorcycle-jump",
    "prompt": "How many metres is the longest motorcycle jump ever landed?",
    "unit": "metres",
    "answerValue": 106.98,
    "decompositionHint": "A projectile problem: at a 45 degree ramp the distance is roughly speed squared over gravity, so about 120 km/h gets you into this range.",
    "strategy": "energy-balance",
    "source": "Published event timing and measurement records, Melbourne",
    "asOf": 2008
  },
  {
    "id": "records-coldest-temperature-achieved",
    "prompt": "How many kelvin above absolute zero is the coldest temperature ever achieved?",
    "unit": "kelvin",
    "answerValue": 3.8e-11,
    "decompositionHint": "Temperature is atomic motion, so cooling means slowing atoms almost to a standstill. At this point they move a few millimetres an hour.",
    "strategy": "anchor-scale",
    "source": "Published cold atom experiments, University of Bremen drop tower",
    "asOf": 2021
  },
  {
    "id": "records-highest-pressure-achieved",
    "prompt": "How many pascals is the highest pressure ever produced in a laboratory?",
    "unit": "pascals",
    "answerValue": 1100000000000,
    "decompositionHint": "Atmospheric pressure is 100,000 pascals and the Earth's core about 360 billion, so ask whether a diamond anvil can beat the centre of a planet.",
    "strategy": "anchor-scale",
    "source": "Published diamond anvil cell experiments, University of Bayreuth",
    "asOf": 2022
  },
  {
    "id": "records-best-vacuum",
    "prompt": "How many pascals is the lowest pressure ever achieved in a vacuum chamber?",
    "unit": "pascals",
    "answerValue": 1e-11,
    "decompositionHint": "Even here there are millions of molecules per cubic centimetre. Start from atmospheric pressure and count the orders of magnitude down.",
    "strategy": "anchor-scale",
    "source": "Published extreme high vacuum measurements, CERN vacuum group",
    "asOf": 2025
  },
  {
    "id": "records-most-accurate-clock",
    "prompt": "How many years would the most accurate clock run before gaining or losing a second?",
    "unit": "years",
    "answerValue": 30000000000,
    "decompositionHint": "Longer than the universe has existed. It counts an optical transition oscillating hundreds of trillions of times a second.",
    "strategy": "anchor-scale",
    "source": "JILA and National Institute of Standards and Technology optical lattice clock",
    "asOf": 2024
  },
  {
    "id": "records-shortest-time-measured",
    "prompt": "How many seconds was the shortest interval of time ever measured?",
    "unit": "seconds",
    "answerValue": 2.47e-19,
    "decompositionHint": "The time light takes to cross a hydrogen molecule. Divide that distance by the speed of light rather than guessing the exponent.",
    "strategy": "divide-total",
    "source": "Published photoionisation timing, Goethe University Frankfurt",
    "asOf": 2020
  },
  {
    "id": "records-shortest-laser-pulse",
    "prompt": "How many seconds long is the shortest laser pulse ever produced?",
    "unit": "seconds",
    "answerValue": 4.3e-17,
    "decompositionHint": "Short enough to photograph an electron moving within an atom. A pulse cannot be shorter than roughly one cycle of the light it is made of.",
    "strategy": "anchor-scale",
    "source": "Published attosecond pulse measurements, ETH Zurich",
    "asOf": 2017
  },
  {
    "id": "records-most-powerful-laser",
    "prompt": "How many watts of peak power does the most powerful laser deliver?",
    "unit": "watts",
    "answerValue": 10000000000000000,
    "decompositionHint": "Peak power, not average: a modest amount of energy squeezed into a pulse lasting a few tens of femtoseconds gives an enormous ratio.",
    "strategy": "divide-total",
    "source": "Extreme Light Infrastructure Nuclear Physics published specifications",
    "asOf": 2025
  },
  {
    "id": "records-highest-accelerator-energy",
    "prompt": "How many electronvolts does each proton carry in the most energetic accelerator beam?",
    "unit": "electronvolts",
    "answerValue": 6800000000000,
    "decompositionHint": "Energy is charge times voltage, so the number is set by how many volts a particle is effectively pushed through on each of many laps.",
    "strategy": "anchor-scale",
    "source": "CERN Large Hadron Collider operational parameters",
    "asOf": 2025
  },
  {
    "id": "records-strongest-pulsed-magnetic-field",
    "prompt": "How many tesla was the strongest magnetic field ever produced indoors?",
    "unit": "tesla",
    "answerValue": 1200,
    "decompositionHint": "Produced for a few microseconds by imploding a coil, which destroys the apparatus. Sustained magnets top out around 45 tesla.",
    "strategy": "anchor-scale",
    "source": "University of Tokyo Institute for Solid State Physics",
    "asOf": 2018
  },
  {
    "id": "records-strongest-material",
    "prompt": "How many pascals of tensile stress can the strongest measured material withstand?",
    "unit": "pascals",
    "answerValue": 63000000000,
    "decompositionHint": "A carbon nanotube, where the bonds are being tested directly with no flaws to start a crack. Structural steel manages about 400 million.",
    "strategy": "anchor-scale",
    "source": "Published nanotube tensile testing, National University of Singapore",
    "asOf": 2025
  },
  {
    "id": "records-longest-running-experiment",
    "prompt": "How many years has the longest continuously running laboratory experiment been going?",
    "unit": "years",
    "answerValue": 98,
    "decompositionHint": "A funnel of pitch dripping about once a decade, set up to show that something apparently solid is in fact a very slow liquid.",
    "strategy": "rate-time",
    "source": "University of Queensland pitch drop experiment records",
    "asOf": 2025
  },
  {
    "id": "records-largest-vacuum-chamber",
    "prompt": "How many cubic metres does the largest vacuum chamber enclose?",
    "unit": "cubic metres",
    "answerValue": 22653,
    "decompositionHint": "A cylinder 30 metres across and 37 tall, built so whole spacecraft can be tested in something close to space conditions.",
    "strategy": "volume-packing",
    "source": "NASA Space Power Facility specifications, Plum Brook Station",
    "asOf": 2025
  },
  {
    "id": "records-deepest-laboratory",
    "prompt": "How many metres of rock shield the deepest underground physics laboratory?",
    "unit": "metres",
    "answerValue": 2400,
    "decompositionHint": "The depth is chosen to cut the cosmic ray background by about a millionfold, since each doubling of depth buys a large factor.",
    "strategy": "exponential",
    "source": "China Jinping Underground Laboratory published facility specifications",
    "asOf": 2025
  },
  {
    "id": "records-largest-neutrino-detector",
    "prompt": "How many cubic metres of ice does the largest neutrino detector instrument?",
    "unit": "cubic metres",
    "answerValue": 1000000000,
    "decompositionHint": "Neutrinos interact so rarely that the only way to catch them is to watch an enormous volume, so the detector is a cubic kilometre of ice.",
    "strategy": "unit-conversion",
    "source": "IceCube Neutrino Observatory published specifications",
    "asOf": 2025
  },
  {
    "id": "records-heaviest-magnet",
    "prompt": "How many tonnes does the heaviest magnet ever built weigh?",
    "unit": "tonnes",
    "answerValue": 12500,
    "decompositionHint": "Most of the mass is the steel return yoke rather than the coil, because the iron is what shapes and contains the field.",
    "strategy": "volume-packing",
    "source": "CERN specifications for the CMS detector solenoid",
    "asOf": 2025
  },
  {
    "id": "records-fastest-camera",
    "prompt": "How many frames per second does the fastest camera capture?",
    "unit": "frames per second",
    "answerValue": 70000000000000,
    "decompositionHint": "Fast enough to film light itself moving across a scene. Compare a frame interval with the time light takes to cross a room.",
    "strategy": "anchor-scale",
    "source": "Published compressed ultrafast photography, Caltech",
    "asOf": 2020
  },
  {
    "id": "records-highest-resolution-camera",
    "prompt": "How many pixels does the highest-resolution astronomical camera have?",
    "unit": "pixels",
    "answerValue": 3200000000,
    "decompositionHint": "It photographs the whole southern sky every few nights, so the sensor has to resolve a very wide field finely. A phone camera has 12 million.",
    "strategy": "anchor-scale",
    "source": "Vera C. Rubin Observatory LSST camera specifications",
    "asOf": 2025
  },
  {
    "id": "records-most-transistors",
    "prompt": "How many transistors does the chip with the most transistors contain?",
    "unit": "transistors",
    "answerValue": 4000000000000,
    "decompositionHint": "A wafer-scale processor the size of a dinner plate rather than a fingernail. A high-end desktop chip has tens of billions.",
    "strategy": "area-density",
    "source": "Cerebras published specifications for the WSE-3 processor",
    "asOf": 2024
  },
  {
    "id": "records-densest-data-storage",
    "prompt": "How many bytes of data can be stored in one gram of DNA?",
    "unit": "bytes",
    "answerValue": 215000000000000000,
    "decompositionHint": "Each base pair stores two bits and weighs about 650 daltons, so start from how many base pairs a gram contains.",
    "strategy": "molar",
    "source": "Published DNA data storage research, Harvard Medical School",
    "asOf": 2017
  },
  {
    "id": "records-largest-chess-tablebase",
    "prompt": "How many chess positions are solved in the largest endgame tablebase?",
    "unit": "positions",
    "answerValue": 423000000000000,
    "decompositionHint": "Every legal arrangement of seven pieces on 64 squares, with the perfect result known for each. Count the placements and divide out symmetry.",
    "strategy": "combinatorial",
    "source": "Lomonosov Moscow State University endgame tablebase project",
    "asOf": 2012
  },
  {
    "id": "records-longest-mathematical-proof",
    "prompt": "How many pages long is the longest mathematical proof?",
    "unit": "pages",
    "answerValue": 15000,
    "decompositionHint": "Assembled from hundreds of journal papers by dozens of mathematicians over decades, rather than written as one document.",
    "strategy": "anchor-scale",
    "source": "Published accounts of the classification of finite simple groups",
    "asOf": 2004
  },
  {
    "id": "records-longest-burning-light-bulb",
    "prompt": "How many years has the longest-burning light bulb been alight?",
    "unit": "years",
    "answerValue": 124,
    "decompositionHint": "A hand-blown carbon filament run at a fraction of its rated power, which is exactly why it has never burnt out.",
    "strategy": "anchor-scale",
    "source": "Livermore-Pleasanton Fire Department records for the Centennial Light",
    "asOf": 2025
  },
  {
    "id": "records-largest-atom-interference",
    "prompt": "How many atoms have been placed in a single quantum superposition at once?",
    "unit": "atoms",
    "answerValue": 2000,
    "decompositionHint": "The limit is decoherence: the bigger the object, the faster the environment measures it. This was a large organic molecule, not a crystal.",
    "strategy": "anchor-scale",
    "source": "Published matter-wave interferometry, University of Vienna",
    "asOf": 2019
  },
  {
    "id": "records-largest-software-codebase",
    "prompt": "How many lines of code are in the largest single software repository?",
    "unit": "lines of code",
    "answerValue": 2000000000,
    "decompositionHint": "Tens of thousands of engineers, each adding perhaps a few thousand usable lines a year, accumulated over two decades.",
    "strategy": "chain-multiply",
    "source": "Published engineering accounts of the Google monorepo",
    "asOf": 2015
  },
  {
    "id": "records-largest-encyclopedia",
    "prompt": "How many articles does the largest encyclopedia contain?",
    "unit": "articles",
    "answerValue": 7000000,
    "decompositionHint": "Written by volunteers over two decades. Think about how many articles a day that requires, and whether that sounds achievable.",
    "strategy": "rate-time",
    "source": "Wikimedia Foundation published statistics for English Wikipedia",
    "asOf": 2025
  },
  {
    "id": "records-largest-library",
    "prompt": "How many items does the largest library hold?",
    "unit": "items",
    "answerValue": 173000000,
    "decompositionHint": "Books are a minority of it: maps, recordings, photographs and manuscripts make up most of the count.",
    "strategy": "anchor-scale",
    "source": "Library of Congress published collection statistics",
    "asOf": 2025
  },
  {
    "id": "records-longest-novel",
    "prompt": "How many words long is the longest novel ever published?",
    "unit": "words",
    "answerValue": 1267069,
    "decompositionHint": "Seven volumes written over fourteen years. A normal novel is about 90,000 words, so work out how many of those this stacks up to.",
    "strategy": "divide-total",
    "source": "Published bibliographic word counts for A la recherche du temps perdu",
    "asOf": 1927
  },
  {
    "id": "records-oldest-cave-painting",
    "prompt": "How many years old is the oldest known figurative cave painting?",
    "unit": "years",
    "answerValue": 51200,
    "decompositionHint": "Dated by uranium series in the mineral crust that grew over the pigment, so the painting is at least as old as the crust above it.",
    "strategy": "anchor-scale",
    "source": "Griffith University uranium-series dating of Leang Karampuang, Sulawesi",
    "asOf": 2024
  },
  {
    "id": "records-oldest-musical-instrument",
    "prompt": "How many years old is the oldest known musical instrument?",
    "unit": "years",
    "answerValue": 42000,
    "decompositionHint": "A flute cut from a bird's wing bone, found alongside early figurative carvings in a European cave.",
    "strategy": "anchor-scale",
    "source": "University of Tubingen excavation records for the Hohle Fels flute",
    "asOf": 2025
  },
  {
    "id": "records-oldest-writing",
    "prompt": "How many years old is the oldest known writing?",
    "unit": "years",
    "answerValue": 5400,
    "decompositionHint": "It begins as accounting rather than literature: marks on clay recording quantities of grain and livestock in southern Mesopotamia.",
    "strategy": "anchor-scale",
    "source": "British Museum records for the Uruk period clay tablets",
    "asOf": 2025
  },
  {
    "id": "records-oldest-monument",
    "prompt": "How many years old is the oldest known monumental structure?",
    "unit": "years",
    "answerValue": 11600,
    "decompositionHint": "Built by people who had not yet taken up farming, which is what made it so surprising. That places it well before the first cities.",
    "strategy": "anchor-scale",
    "source": "German Archaeological Institute excavation records for Gobekli Tepe",
    "asOf": 2025
  },
  {
    "id": "records-oldest-board-game",
    "prompt": "How many years old is the oldest known board game?",
    "unit": "years",
    "answerValue": 4600,
    "decompositionHint": "Found in a royal cemetery in Mesopotamia, complete enough that the rules were later reconstructed from a cuneiform tablet.",
    "strategy": "anchor-scale",
    "source": "British Museum records for the Royal Game of Ur",
    "asOf": 2025
  },
  {
    "id": "records-oldest-printed-book",
    "prompt": "How many years old is the oldest surviving dated printed book?",
    "unit": "years",
    "answerValue": 1157,
    "decompositionHint": "Woodblock printed in China, six centuries before movable type reached Europe, and it carries a printed date.",
    "strategy": "anchor-scale",
    "source": "British Library records for the Diamond Sutra scroll",
    "asOf": 2025
  },
  {
    "id": "records-oldest-shipwreck",
    "prompt": "How many years old is the oldest shipwreck ever excavated?",
    "unit": "years",
    "answerValue": 3300,
    "decompositionHint": "A Bronze Age trading vessel carrying copper and tin ingots, dated by the timbers and by the cargo's known trade period.",
    "strategy": "anchor-scale",
    "source": "Institute of Nautical Archaeology records for the Uluburun wreck",
    "asOf": 2025
  },
  {
    "id": "records-deepest-shipwreck",
    "prompt": "How many metres down is the deepest shipwreck ever located?",
    "unit": "metres",
    "answerValue": 6895,
    "decompositionHint": "It sank in a Pacific trench during the Second World War. That is deeper than most of the ocean floor but not the deepest trench.",
    "strategy": "anchor-scale",
    "source": "Caladan Oceanic survey of the USS Samuel B. Roberts",
    "asOf": 2022
  },
  {
    "id": "records-oldest-surviving-composition",
    "prompt": "How many years old is the oldest surviving complete piece of written music?",
    "unit": "years",
    "answerValue": 3400,
    "decompositionHint": "A cuneiform tablet giving both words and playing instructions for a nine-stringed instrument, from the ancient Near East.",
    "strategy": "anchor-scale",
    "source": "National Museum of Damascus records for the Hurrian hymns",
    "asOf": 2025
  },
  {
    "id": "records-blocks-in-the-great-pyramid",
    "prompt": "How many stone blocks were used to build the Great Pyramid of Giza?",
    "unit": "blocks",
    "answerValue": 2300000,
    "decompositionHint": "The pyramid holds about 2.6 million cubic metres of stone, and an average block is a bit over a cubic metre. Divide one by the other.",
    "strategy": "divide-total",
    "source": "Egyptian Ministry of Antiquities published survey figures",
    "asOf": 2025
  },
  {
    "id": "records-largest-pyramid-by-volume",
    "prompt": "How many cubic metres of material does the largest pyramid by volume contain?",
    "unit": "cubic metres",
    "answerValue": 4450000,
    "decompositionHint": "It is in Mexico rather than Egypt, and is squatter and much wider - 400 metres along each side but only 55 tall. Volume is a third of base times height.",
    "strategy": "volume-packing",
    "source": "Mexican National Institute of Anthropology and History survey of Cholula",
    "asOf": 2025
  },
  {
    "id": "records-longest-wall",
    "prompt": "How many kilometres long is the longest wall ever built?",
    "unit": "kilometres",
    "answerValue": 21196,
    "decompositionHint": "Counting every branch and period rather than one continuous line. Compare it with the 40,000 km circumference of the Earth.",
    "strategy": "anchor-scale",
    "source": "Chinese State Administration of Cultural Heritage survey of the Great Wall",
    "asOf": 2012
  },
  {
    "id": "records-largest-empire",
    "prompt": "How many square kilometres did the largest empire in history cover at its peak?",
    "unit": "square kilometres",
    "answerValue": 35500000,
    "decompositionHint": "The Earth's land surface is about 149 million square kilometres, so ask what share of all the land one state could plausibly hold.",
    "strategy": "divide-total",
    "source": "Published historical atlas area measurements of the British Empire",
    "asOf": 1920
  },
  {
    "id": "records-longest-war",
    "prompt": "How many years did the longest war in history last?",
    "unit": "years",
    "answerValue": 781,
    "decompositionHint": "A centuries-long series of campaigns over one peninsula, conventionally dated from an eighth-century battle to a fifteenth-century surrender.",
    "strategy": "anchor-scale",
    "source": "Published historical chronologies of the Reconquista",
    "asOf": 1492
  },
  {
    "id": "records-largest-coin-hoard",
    "prompt": "How many coins were in the largest single hoard of Roman coins found in Britain?",
    "unit": "coins",
    "answerValue": 52503,
    "decompositionHint": "Buried in one pot, which had to be lifted whole and excavated in a laboratory. Think about how many coins a pot that size holds.",
    "strategy": "volume-packing",
    "source": "British Museum Portable Antiquities Scheme record of the Frome Hoard",
    "asOf": 2010
  },
  {
    "id": "records-largest-ancient-library",
    "prompt": "How many scrolls is the great library of Alexandria thought to have held?",
    "unit": "scrolls",
    "answerValue": 400000,
    "decompositionHint": "A scroll holds far less than a book - roughly one long chapter - so the figure is larger than the equivalent number of modern volumes.",
    "strategy": "anchor-scale",
    "source": "Published classical scholarship on the Alexandrian library catalogues",
    "asOf": 2025
  },
  {
    "id": "records-oldest-tattoos",
    "prompt": "How many years old are the oldest known tattoos on a human body?",
    "unit": "years",
    "answerValue": 5300,
    "decompositionHint": "Found on a frozen body in the Alps, preserved with his clothing and tools. The dating comes from radiocarbon on the body itself.",
    "strategy": "anchor-scale",
    "source": "South Tyrol Museum of Archaeology records for the Iceman",
    "asOf": 2025
  },
  {
    "id": "records-oldest-alcohol-residue",
    "prompt": "How many years old is the oldest chemical evidence of a fermented drink?",
    "unit": "years",
    "answerValue": 9000,
    "decompositionHint": "Identified from residues absorbed into pottery, so the date is tied to when people started making pots as much as to when they started brewing.",
    "strategy": "anchor-scale",
    "source": "University of Pennsylvania Museum biomolecular archaeology, Jiahu",
    "asOf": 2025
  },
  {
    "id": "records-highest-grossing-film",
    "prompt": "How many US dollars has the highest-grossing film taken at the box office?",
    "unit": "US dollars",
    "answerValue": 2920000000,
    "decompositionHint": "Divide by an average ticket price of about ten dollars and check whether the resulting number of admissions is physically plausible.",
    "strategy": "divide-total",
    "source": "Published worldwide box office returns for Avatar",
    "asOf": 2025
  },
  {
    "id": "records-most-expensive-car",
    "prompt": "How many US dollars did the most expensive car ever sold fetch?",
    "unit": "US dollars",
    "answerValue": 142000000,
    "decompositionHint": "A one-of-two prototype sold privately at auction. Compare it with the most expensive painting, which went for three times as much.",
    "strategy": "anchor-scale",
    "source": "RM Sotheby's published auction result for the Mercedes-Benz 300 SLR Uhlenhaut Coupe",
    "asOf": 2022
  },
  {
    "id": "records-most-expensive-coin",
    "prompt": "How many US dollars did the most expensive coin ever sold fetch?",
    "unit": "US dollars",
    "answerValue": 18900000,
    "decompositionHint": "A gold coin that was never legally released, making it the only one of its kind that can be lawfully owned.",
    "strategy": "anchor-scale",
    "source": "Sotheby's published auction result for the 1933 Double Eagle",
    "asOf": 2021
  },
  {
    "id": "records-most-expensive-manuscript",
    "prompt": "How many US dollars did the most expensive manuscript ever sold fetch?",
    "unit": "US dollars",
    "answerValue": 30800000,
    "decompositionHint": "A notebook of scientific drawings and notes, bought by a technology executive in the mid-1990s. Adjust for the era before guessing.",
    "strategy": "anchor-scale",
    "source": "Christie's published auction result for the Codex Leicester",
    "asOf": 1994
  },
  {
    "id": "records-largest-gold-reserve",
    "prompt": "How many tonnes of gold does the largest national gold reserve hold?",
    "unit": "tonnes",
    "answerValue": 8133,
    "decompositionHint": "All the gold ever mined is about 210,000 tonnes and would fit in a cube 22 metres on a side, so ask what share one country holds.",
    "strategy": "divide-total",
    "source": "World Gold Council official reserve statistics",
    "asOf": 2025
  },
  {
    "id": "records-largest-banknote-denomination",
    "prompt": "What was the face value of the largest denomination banknote ever issued?",
    "unit": "units of currency",
    "answerValue": 100000000000000,
    "decompositionHint": "Issued during a hyperinflation where prices doubled roughly every day, so the denomination had to chase the price level upward.",
    "strategy": "exponential",
    "source": "Reserve Bank of Zimbabwe currency issue records",
    "asOf": 2009
  },
  {
    "id": "records-fastest-inflation",
    "prompt": "How many hours did it take for prices to double at the fastest recorded inflation?",
    "unit": "hours",
    "answerValue": 15,
    "decompositionHint": "Fast enough that wages were paid more than once a day and spent immediately. Compare with a bad inflation where doubling takes a year.",
    "strategy": "exponential",
    "source": "Hungarian National Bank records of the 1946 pengo hyperinflation",
    "asOf": 1946
  },
  {
    "id": "records-most-languages-in-one-country",
    "prompt": "How many living languages are spoken in the most linguistically diverse country?",
    "unit": "languages",
    "answerValue": 840,
    "decompositionHint": "Mountainous terrain kept communities separated for millennia, so the count tracks valleys rather than population.",
    "strategy": "anchor-scale",
    "source": "SIL International Ethnologue survey of Papua New Guinea",
    "asOf": 2025
  },
  {
    "id": "records-most-translated-document",
    "prompt": "How many languages has the most translated document been published in?",
    "unit": "languages",
    "answerValue": 500,
    "decompositionHint": "A single page of text adopted by an international body, translated deliberately as a matter of policy rather than by demand.",
    "strategy": "anchor-scale",
    "source": "United Nations Office of the High Commissioner for Human Rights",
    "asOf": 2025
  },
  {
    "id": "records-longest-running-play",
    "prompt": "How many performances has the longest-running theatrical play given?",
    "unit": "performances",
    "answerValue": 30000,
    "decompositionHint": "Eight shows a week, nearly every week, since 1952. Multiply that out and subtract a couple of years for closures.",
    "strategy": "rate-time",
    "source": "Society of London Theatre performance records for The Mousetrap",
    "asOf": 2025
  },
  {
    "id": "records-largest-orchestra",
    "prompt": "How many musicians played together in the largest orchestra ever assembled?",
    "unit": "musicians",
    "answerValue": 8573,
    "decompositionHint": "Staged in a stadium, so the real limit is how many players can see a conductor and stay together across that distance.",
    "strategy": "anchor-scale",
    "source": "El Sistema Nacional de Orquestas de Venezuela, Caracas, November 2021",
    "asOf": 2021
  },
  {
    "id": "records-oldest-inhabited-city",
    "prompt": "How many years has the oldest continuously inhabited city been occupied?",
    "unit": "years",
    "answerValue": 11000,
    "decompositionHint": "Continuously is the key word: older settlements exist, but they were abandoned. That pushes the date back to the first farming.",
    "strategy": "anchor-scale",
    "source": "Published archaeological surveys of Jericho and Damascus",
    "asOf": 2025
  },
  {
    "id": "records-longest-tusks",
    "prompt": "How many metres long were the longest tusks ever found?",
    "unit": "metres",
    "answerValue": 5.02,
    "decompositionHint": "A mastodon rather than an elephant, and the tusks curved round almost into a spiral, so the measured length far exceeds the animal height.",
    "strategy": "anchor-scale",
    "source": "Published measurements of the Milia mastodon tusks, Grevena, Greece",
    "asOf": 2025
  },
  {
    "id": "records-largest-arthropod",
    "prompt": "How many metres long was the largest arthropod that ever lived?",
    "unit": "metres",
    "answerValue": 2.6,
    "decompositionHint": "A millipede relative from a period when the air was far richer in oxygen, which is what allowed a tube-breathing animal to get that big.",
    "strategy": "anchor-scale",
    "source": "Published description of Arthropleura trackways and fossils, Cambridge",
    "asOf": 2021
  },
  {
    "id": "records-largest-crustacean",
    "prompt": "How many metres is the leg span of the largest crustacean?",
    "unit": "metres",
    "answerValue": 3.7,
    "decompositionHint": "The body is only about 40 cm across; nearly all of the span is thin legs, which is why it can grow so wide without collapsing.",
    "strategy": "anchor-scale",
    "source": "Published specimen records for the Japanese spider crab",
    "asOf": 2025
  },
  {
    "id": "records-heaviest-bird",
    "prompt": "How many kilograms did the heaviest bird that ever lived weigh?",
    "unit": "kilograms",
    "answerValue": 650,
    "decompositionHint": "Flightless, so the usual weight ceiling for birds does not apply. An ostrich is 150 kg, and this one stood three metres tall.",
    "strategy": "anchor-scale",
    "source": "Zoological Society of London description of Vorombe titan",
    "asOf": 2018
  },
  {
    "id": "records-largest-flying-animal",
    "prompt": "How many metres was the wingspan of the largest flying animal ever?",
    "unit": "metres",
    "answerValue": 11,
    "decompositionHint": "A pterosaur the size of a small aircraft. The living record is a wandering albatross at 3.7 metres, so ask how far past that flight can go.",
    "strategy": "anchor-scale",
    "source": "Published palaeontological reconstructions of Quetzalcoatlus northropi",
    "asOf": 2025
  },
  {
    "id": "records-smallest-fish",
    "prompt": "How many millimetres long is the smallest known fish?",
    "unit": "millimetres",
    "answerValue": 7.9,
    "decompositionHint": "It lives in acidic peat swamps and is transparent. The floor for a vertebrate is set by how small a working eye and brain can be.",
    "strategy": "anchor-scale",
    "source": "Published description of Paedocypris progenetica, Raffles Museum",
    "asOf": 2006
  },
  {
    "id": "records-smallest-reptile",
    "prompt": "How many millimetres long is the smallest known reptile?",
    "unit": "millimetres",
    "answerValue": 21.6,
    "decompositionHint": "A chameleon that fits on a fingertip, found on one mountain in Madagascar. Measured from snout to vent rather than including the tail.",
    "strategy": "anchor-scale",
    "source": "Published description of Brookesia nana, Scientific Reports",
    "asOf": 2021
  },
  {
    "id": "records-fastest-animal-movement",
    "prompt": "How many seconds does the fastest animal movement take to complete?",
    "unit": "seconds",
    "answerValue": 0.00013,
    "decompositionHint": "A trap-jaw ant's mandibles, released like a catapult rather than driven by muscle directly. Far too fast for a nerve signal to control mid-strike.",
    "strategy": "anchor-scale",
    "source": "Published high-speed videography of Odontomachus, University of Illinois",
    "asOf": 2006
  },
  {
    "id": "records-greatest-animal-acceleration",
    "prompt": "How many times the acceleration of gravity does the fastest animal strike reach?",
    "unit": "times gravity",
    "answerValue": 10400,
    "decompositionHint": "A mantis shrimp's club, which stores energy in a spring and releases it in milliseconds. A fighter pilot blacks out at about nine.",
    "strategy": "anchor-scale",
    "source": "Published biomechanics of Odontodactylus scyllarus, University of California",
    "asOf": 2018
  },
  {
    "id": "records-highest-jumper-for-its-size",
    "prompt": "How many times its own body length can the best jumping insect leap?",
    "unit": "times its body length",
    "answerValue": 115,
    "decompositionHint": "A froghopper storing energy in a bow-shaped cuticle. Jump height depends on energy per unit mass, which favours small animals enormously.",
    "strategy": "energy-balance",
    "source": "Published biomechanics of Philaenus spumarius, University of Cambridge",
    "asOf": 2003
  },
  {
    "id": "records-longest-sperm",
    "prompt": "How many millimetres long is the longest sperm cell of any animal?",
    "unit": "millimetres",
    "answerValue": 58,
    "decompositionHint": "Twenty times the length of the fly that makes it, coiled up until use. It is a competition strategy rather than an engineering necessity.",
    "strategy": "anchor-scale",
    "source": "Published studies of Drosophila bifurca, Syracuse University",
    "asOf": 2025
  },
  {
    "id": "records-deepest-reptile-dive",
    "prompt": "How deep in metres can a leatherback turtle dive?",
    "unit": "metres",
    "answerValue": 1280,
    "decompositionHint": "A leatherback turtle, which has a flexible shell and collapsible lungs rather than a rigid one. Most sea turtles stay above 100 metres.",
    "strategy": "anchor-scale",
    "source": "Published satellite tagging of Dermochelys coriacea, University of Wales",
    "asOf": 2025
  },
  {
    "id": "records-largest-insect-swarm",
    "prompt": "How many individual locusts were estimated in the largest swarm ever recorded?",
    "unit": "locusts",
    "answerValue": 12500000000000,
    "decompositionHint": "The swarm covered about 500,000 square kilometres. Estimate a plausible density per square metre and multiply by that area.",
    "strategy": "area-density",
    "source": "United States Entomological Commission records of Albert's swarm",
    "asOf": 1875
  },
  {
    "id": "records-most-abundant-vertebrate",
    "prompt": "How many individuals does the most abundant vertebrate on Earth number?",
    "unit": "fish",
    "answerValue": 100000000000000,
    "decompositionHint": "A small deep-sea fish found in every ocean. Work from ocean volume and a plausible density rather than trying to picture the total.",
    "strategy": "volume-packing",
    "source": "Published estimates of bristlemouth abundance, Scripps Institution",
    "asOf": 2025
  },
  {
    "id": "records-oldest-animal-fossil",
    "prompt": "How many years old is the oldest claimed animal fossil?",
    "unit": "years",
    "answerValue": 890000000,
    "decompositionHint": "A sponge-like structure in ancient reef rock, far older than the Cambrian explosion, which is why the claim was contested.",
    "strategy": "anchor-scale",
    "source": "Published description of sponge fossils in Nature, Laurentian University",
    "asOf": 2021
  },
  {
    "id": "records-largest-dinosaur-footprint",
    "prompt": "How many metres across is the largest dinosaur footprint ever found?",
    "unit": "metres",
    "answerValue": 1.7,
    "decompositionHint": "A sauropod track preserved in coastal rock. Foot area has to carry the animal's weight, so work back from a plausible ground pressure.",
    "strategy": "area-density",
    "source": "University of Queensland survey of the Walmadany trackways",
    "asOf": 2017
  },
  {
    "id": "records-highest-altitude-plant",
    "prompt": "How many metres above sea level does the highest-growing flowering plant survive?",
    "unit": "metres",
    "answerValue": 6150,
    "decompositionHint": "Above this there is neither liquid water for long enough nor soil. Everest's summit is 8,849 metres, so the limit is well below it.",
    "strategy": "anchor-scale",
    "source": "Published botanical surveys of the Himalayas, University of Zurich",
    "asOf": 2025
  },
  {
    "id": "records-oldest-germinated-seed",
    "prompt": "How many years old was the oldest seed ever successfully germinated?",
    "unit": "years",
    "answerValue": 32000,
    "decompositionHint": "Recovered from a frozen squirrel burrow in Siberian permafrost, where it had never thawed. Radiocarbon dated rather than estimated.",
    "strategy": "anchor-scale",
    "source": "Published research on Silene stenophylla regeneration, Russian Academy of Sciences",
    "asOf": 2012
  },
  {
    "id": "records-heaviest-fruit",
    "prompt": "How many kilograms did the heaviest fruit ever grown weigh?",
    "unit": "kilograms",
    "answerValue": 1247,
    "decompositionHint": "A competition pumpkin, which is mostly water laid down over about 120 days. Work out the kilograms per day that implies.",
    "strategy": "rate-time",
    "source": "Great Pumpkin Commonwealth official weigh-off records",
    "asOf": 2023
  },
  {
    "id": "records-tallest-cactus",
    "prompt": "How many metres tall was the tallest cactus ever measured?",
    "unit": "metres",
    "answerValue": 19.2,
    "decompositionHint": "A saguaro grows about a centimetre a year for its first decade and speeds up later, so this one is well over a century old.",
    "strategy": "rate-time",
    "source": "United States National Park Service records, Saguaro National Park",
    "asOf": 2025
  },
  {
    "id": "records-deepest-life",
    "prompt": "How many metres below the sea floor has living life been found?",
    "unit": "metres",
    "answerValue": 5000,
    "decompositionHint": "Microbes in sediment and rock, living on chemical energy rather than sunlight. The limit is temperature, which rises with depth.",
    "strategy": "anchor-scale",
    "source": "International Ocean Discovery Program drilling results",
    "asOf": 2025
  },
  {
    "id": "records-hottest-temperature-for-life",
    "prompt": "How many degrees Celsius is the highest temperature at which life can reproduce?",
    "unit": "degrees Celsius",
    "answerValue": 122,
    "decompositionHint": "Above the boiling point of water at surface pressure, which is possible only because deep-sea pressure keeps the water liquid.",
    "strategy": "anchor-scale",
    "source": "Published research on Methanopyrus kandleri, Japan Agency for Marine-Earth Science",
    "asOf": 2008
  },
  {
    "id": "records-most-radiation-resistant-organism",
    "prompt": "How many grays of radiation can the most radiation-resistant organism survive?",
    "unit": "grays",
    "answerValue": 15000,
    "decompositionHint": "A dose of about 5 grays kills a human. This bacterium survives by holding several copies of its genome and stitching them back together.",
    "strategy": "anchor-scale",
    "source": "Published research on Deinococcus radiodurans, Uniformed Services University",
    "asOf": 2025
  },
  {
    "id": "records-longest-surgery",
    "prompt": "How many minutes did the longest single surgical operation last?",
    "unit": "minutes",
    "answerValue": 5760,
    "decompositionHint": "Four days with relays of surgeons. That is the practical ceiling set by the patient rather than by the team.",
    "strategy": "unit-conversion",
    "source": "Published clinical case report, University of Chicago Medical Center",
    "asOf": 2001
  },
  {
    "id": "records-largest-tumour-removed",
    "prompt": "How many kilograms did the largest tumour ever removed weigh?",
    "unit": "kilograms",
    "answerValue": 138.7,
    "decompositionHint": "It weighed more than the patient did afterwards, and had grown slowly over years. Think about how much mass a body can carry at all.",
    "strategy": "anchor-scale",
    "source": "Published clinical case report, Stanford University Medical Center",
    "asOf": 1991
  },
  {
    "id": "records-longest-transplant-chain",
    "prompt": "How many surgical operations made up the longest single kidney donor chain?",
    "unit": "operations",
    "answerValue": 70,
    "decompositionHint": "Every transplant needs two operations, one to remove and one to implant, and each donor gives to a stranger so their own recipient can receive from another.",
    "strategy": "anchor-scale",
    "source": "National Kidney Registry published chain records",
    "asOf": 2015
  },
  {
    "id": "records-longest-coma",
    "prompt": "How many years did the longest recorded coma last?",
    "unit": "years",
    "answerValue": 42,
    "decompositionHint": "Kept alive by continuous nursing care at home for over 15,000 days. The limits are infection and pressure injury rather than anything neurological.",
    "strategy": "anchor-scale",
    "source": "Published clinical records for Edwarda O Bara, Miami, Florida",
    "asOf": 2012
  },
  {
    "id": "records-most-expensive-spice",
    "prompt": "How many US dollars per kilogram does the most expensive spice cost?",
    "unit": "US dollars per kilogram",
    "answerValue": 10000,
    "decompositionHint": "It takes about 150,000 hand-picked flowers to make a kilogram, and each yields three threads. Work from the labour rather than the plant.",
    "strategy": "chain-multiply",
    "source": "International Trade Centre commodity price statistics for saffron",
    "asOf": 2025
  },
  {
    "id": "records-fastest-planetary-winds",
    "prompt": "How many kilometres per hour are the fastest winds in the solar system?",
    "unit": "kilometres per hour",
    "answerValue": 2100,
    "decompositionHint": "On Neptune, where there is no solid surface to create drag and very little sunlight to drive the weather - which is the puzzle.",
    "strategy": "anchor-scale",
    "source": "NASA Voyager 2 atmospheric measurements",
    "asOf": 2025
  },
  {
    "id": "records-shortest-exoplanet-year",
    "prompt": "How many hours does one orbit take for the exoplanet with the shortest year?",
    "unit": "hours",
    "answerValue": 4.245,
    "decompositionHint": "It orbits so close that it is nearly grazing its star. The floor is where tidal forces would pull the planet apart entirely.",
    "strategy": "anchor-scale",
    "source": "NASA Exoplanet Archive, KOI 1843.03",
    "asOf": 2025
  },
  {
    "id": "records-fastest-rotating-asteroid",
    "prompt": "How many seconds does one rotation take for the fastest-spinning asteroid?",
    "unit": "seconds",
    "answerValue": 24.5,
    "decompositionHint": "It must be a solid lump rather than a rubble pile, because loose gravel spinning this fast would simply fly apart.",
    "strategy": "anchor-scale",
    "source": "Published photometric observations of asteroid 2010 JL88",
    "asOf": 2010
  },
  {
    "id": "records-longest-comet-tail",
    "prompt": "How many kilometres long was the longest comet tail ever measured?",
    "unit": "kilometres",
    "answerValue": 570000000,
    "decompositionHint": "Longer than the distance from the Sun to Jupiter, produced by a nucleus only a couple of kilometres across.",
    "strategy": "anchor-scale",
    "source": "European Space Agency Ulysses spacecraft measurements of Comet Hyakutake",
    "asOf": 1996
  },
  {
    "id": "records-largest-comet-nucleus",
    "prompt": "How many kilometres across is the largest known comet nucleus?",
    "unit": "kilometres",
    "answerValue": 119,
    "decompositionHint": "Most comet nuclei are one to ten kilometres across, so this one is an outlier by a large factor rather than a small one.",
    "strategy": "anchor-scale",
    "source": "NASA Hubble Space Telescope measurements of comet Bernardinelli-Bernstein",
    "asOf": 2022
  },
  {
    "id": "records-most-massive-star",
    "prompt": "How many times the Sun's mass is the most massive known star?",
    "unit": "solar masses",
    "answerValue": 196,
    "decompositionHint": "There is an upper limit: past a certain mass a star's own radiation blows away the gas that would make it heavier.",
    "strategy": "anchor-scale",
    "source": "Published spectroscopic analysis of R136a1, European Southern Observatory",
    "asOf": 2022
  },
  {
    "id": "records-largest-telescope-baseline",
    "prompt": "How many kilometres apart were the most widely separated telescopes ever combined into one image?",
    "unit": "kilometres",
    "answerValue": 10700,
    "decompositionHint": "Dishes on several continents observing together, so the effective aperture is limited by the size of the planet itself.",
    "strategy": "anchor-scale",
    "source": "Event Horizon Telescope Collaboration published array specifications",
    "asOf": 2019
  },
  {
    "id": "records-deepest-lunar-crater",
    "prompt": "How many metres deep is the deepest crater on the Moon?",
    "unit": "metres",
    "answerValue": 8200,
    "decompositionHint": "Near the south pole, deep enough that its floor has never seen sunlight. Compare it with the deepest ocean trench on Earth.",
    "strategy": "anchor-scale",
    "source": "NASA Lunar Reconnaissance Orbiter altimetry",
    "asOf": 2025
  },
  {
    "id": "records-loudest-sound-heard-distance",
    "prompt": "How many kilometres away was the loudest sound in recorded history still audible?",
    "unit": "kilometres",
    "answerValue": 4800,
    "decompositionHint": "A volcanic eruption heard as distant gunfire across an ocean. Ask what fraction of the Earth's 40,000 km circumference that is.",
    "strategy": "anchor-scale",
    "source": "Royal Society report on the 1883 Krakatoa eruption",
    "asOf": 1883
  },
  {
    "id": "records-largest-ozone-hole",
    "prompt": "How many square kilometres did the largest recorded ozone hole cover?",
    "unit": "square kilometres",
    "answerValue": 29900000,
    "decompositionHint": "Larger than the continent it sits over. Antarctica is about 14 million square kilometres, so compare it with that.",
    "strategy": "anchor-scale",
    "source": "NASA Ozone Watch satellite measurements",
    "asOf": 2000
  },
  {
    "id": "records-largest-sinkhole",
    "prompt": "How many metres deep is the largest sinkhole on Earth?",
    "unit": "metres",
    "answerValue": 662,
    "decompositionHint": "A collapsed cave roof in limestone country, with a river still running through the bottom. Think in terms of a very tall building.",
    "strategy": "anchor-scale",
    "source": "Chinese Ministry of Natural Resources survey of Xiaozhai Tiankeng",
    "asOf": 2025
  },
  {
    "id": "records-deepest-freshwater-cave",
    "prompt": "How many metres deep is the deepest known flooded freshwater cave?",
    "unit": "metres",
    "answerValue": 519,
    "decompositionHint": "Measured by a remotely operated vehicle after divers reached their own limit. The cave was dissolved from below by rising carbonated water.",
    "strategy": "anchor-scale",
    "source": "Czech Speleological Society survey of the Hranice Abyss",
    "asOf": 2020
  },
  {
    "id": "records-largest-salt-flat",
    "prompt": "How many square kilometres does the largest salt flat cover?",
    "unit": "square kilometres",
    "answerValue": 10582,
    "decompositionHint": "A dried prehistoric lake bed so flat it is used to calibrate satellite altimeters. Roughly 100 km by 100.",
    "strategy": "area-density",
    "source": "Bolivian Geological and Mining Survey of the Salar de Uyuni",
    "asOf": 2025
  },
  {
    "id": "records-largest-mangrove-forest",
    "prompt": "How many square kilometres does the largest mangrove forest cover?",
    "unit": "square kilometres",
    "answerValue": 10000,
    "decompositionHint": "It sits across a great river delta and is shared by two countries. Compare it with the delta's own area of about 105,000 square kilometres.",
    "strategy": "divide-total",
    "source": "UNESCO World Heritage documentation for the Sundarbans",
    "asOf": 2025
  },
  {
    "id": "records-largest-river-island",
    "prompt": "How big in square kilometres is Majuli, the biggest island sitting in a river?",
    "unit": "square kilometres",
    "answerValue": 880,
    "decompositionHint": "Formed between two channels of a braided river and shrinking every year to erosion. Compare it with a small country or a large city.",
    "strategy": "anchor-scale",
    "source": "Government of Assam survey records for Majuli",
    "asOf": 2025
  },
  {
    "id": "records-longest-fjord",
    "prompt": "How many kilometres long is the longest fjord?",
    "unit": "kilometres",
    "answerValue": 350,
    "decompositionHint": "Carved by a glacier that reached far inland, so its length tracks how far the ice sheet extended rather than the coastline's shape.",
    "strategy": "anchor-scale",
    "source": "Danish Geodata Agency survey of Scoresby Sund",
    "asOf": 2025
  },
  {
    "id": "records-largest-atoll",
    "prompt": "How many square kilometres of land does the largest coral atoll have?",
    "unit": "square kilometres",
    "answerValue": 388,
    "decompositionHint": "A ring of reef built on a sunken volcano. Most atolls are a few square kilometres of land around a much larger lagoon.",
    "strategy": "anchor-scale",
    "source": "Republic of Kiribati national survey records for Kiritimati",
    "asOf": 2025
  },
  {
    "id": "records-fastest-glacier-surge",
    "prompt": "How many metres a day did the fastest glacier surge advance?",
    "unit": "metres per day",
    "answerValue": 100,
    "decompositionHint": "Meltwater beneath the ice lifts it off its bed and it slides rather than creeps. Ordinary glaciers move under a metre a day.",
    "strategy": "anchor-scale",
    "source": "Published glaciological measurements of Kutiah Glacier, Karakoram",
    "asOf": 1953
  },
  {
    "id": "records-heaviest-stone-moved",
    "prompt": "How many tonnes did the heaviest stone ever moved by pre-industrial means weigh?",
    "unit": "tonnes",
    "answerValue": 1500,
    "decompositionHint": "Granite is about 2.7 tonnes per cubic metre, so work from the block's dimensions rather than trying to picture the weight.",
    "strategy": "volume-packing",
    "source": "Russian Academy of Sciences records for the Thunder Stone, Saint Petersburg",
    "asOf": 1770
  },
  {
    "id": "records-deepest-swimming-pool",
    "prompt": "How many metres deep is the deepest swimming pool?",
    "unit": "metres",
    "answerValue": 60.02,
    "decompositionHint": "Built for dive training, so the depth is chosen to cover the range where nitrogen narcosis begins to matter on air.",
    "strategy": "anchor-scale",
    "source": "Deep Dive Dubai published facility specifications",
    "asOf": 2021
  },
  {
    "id": "records-longest-zip-line",
    "prompt": "How many metres long is the longest zip line?",
    "unit": "metres",
    "answerValue": 2832,
    "decompositionHint": "The cable must sag enough not to snap but not so much that the rider stops short, which limits span for a given tower height.",
    "strategy": "anchor-scale",
    "source": "Ras Al Khaimah tourism authority published specifications for Jebel Jais Flight",
    "asOf": 2018
  },
  {
    "id": "records-longest-suspension-footbridge",
    "prompt": "How many metres long is the longest pedestrian suspension bridge?",
    "unit": "metres",
    "answerValue": 721,
    "decompositionHint": "Carrying only people, so the deck can be far lighter than a road bridge - which is exactly what lets the span be so long.",
    "strategy": "anchor-scale",
    "source": "Czech tourism authority specifications for Sky Bridge 721, Dolni Morava",
    "asOf": 2022
  },
  {
    "id": "records-most-exoplanets-known",
    "prompt": "How many exoplanets have been confirmed?",
    "unit": "exoplanets",
    "answerValue": 5900,
    "decompositionHint": "Almost all were found by watching stars dim as a planet crosses them, so the count tracks how many stars have been monitored and for how long.",
    "strategy": "anchor-scale",
    "source": "NASA Exoplanet Archive",
    "asOf": 2025
  },
  {
    "id": "records-hottest-exoplanet",
    "prompt": "How many kelvin is the surface temperature of the hottest known exoplanet?",
    "unit": "kelvin",
    "answerValue": 4600,
    "decompositionHint": "Hotter than many stars, because it orbits very close to a hot blue one. The Sun's surface is 5,800 kelvin, which is the comparison to make.",
    "strategy": "anchor-scale",
    "source": "NASA Exoplanet Archive measurements of KELT-9b",
    "asOf": 2025
  },
  {
    "id": "records-tallest-tides-in-solar-system",
    "prompt": "How many metres does the solid surface of Io rise and fall with tides?",
    "unit": "metres",
    "answerValue": 100,
    "decompositionHint": "Jupiter's pull flexes the whole moon, and that flexing is what heats it enough to make it the most volcanic body in the solar system.",
    "strategy": "anchor-scale",
    "source": "NASA Galileo mission measurements",
    "asOf": 2025
  },
  {
    "id": "records-fastest-tornado-wind",
    "prompt": "How many kilometres per hour was the fastest wind ever measured in a tornado?",
    "unit": "kilometres per hour",
    "answerValue": 484,
    "decompositionHint": "Measured by mobile Doppler radar a few tens of metres above ground, since no instrument on the ground would survive it.",
    "strategy": "anchor-scale",
    "source": "NOAA National Weather Service radar analysis, Bridge Creek, Oklahoma",
    "asOf": 1999
  },
  {
    "id": "records-highest-storm-surge",
    "prompt": "How many metres high was the greatest storm surge ever recorded?",
    "unit": "metres",
    "answerValue": 13,
    "decompositionHint": "Wind pushing water into a shallow funnel-shaped bay, where the shape of the coast matters as much as the strength of the storm.",
    "strategy": "anchor-scale",
    "source": "Australian Bureau of Meteorology records for the 1899 Bathurst Bay cyclone",
    "asOf": 1899
  },
  {
    "id": "records-greatest-hourly-rainfall",
    "prompt": "How many millimetres of rain fell in the wettest single hour ever recorded?",
    "unit": "millimetres",
    "answerValue": 305,
    "decompositionHint": "Nearly a third of a metre in sixty minutes. Compare that rate with the wettest place on Earth's yearly total of about twelve metres.",
    "strategy": "rate-time",
    "source": "World Meteorological Organization weather and climate extremes archive",
    "asOf": 1947
  },
  {
    "id": "records-highest-wave-measured-at-sea",
    "prompt": "How many metres was the highest significant wave height ever measured by a buoy?",
    "unit": "metres",
    "answerValue": 19,
    "decompositionHint": "Significant wave height is the average of the highest third, so the largest individual waves in that sea were considerably taller again.",
    "strategy": "anchor-scale",
    "source": "World Meteorological Organization verified buoy measurement, North Atlantic",
    "asOf": 2013
  },
  {
    "id": "records-largest-wildfire",
    "prompt": "How many square kilometres did the largest recorded wildfire season burn?",
    "unit": "square kilometres",
    "answerValue": 243000,
    "decompositionHint": "Comparable with the area of a mid-sized country. Work from a fire front moving for months rather than from a single blaze.",
    "strategy": "area-density",
    "source": "Australian government royal commission report on the 2019-20 bushfires",
    "asOf": 2020
  },
  {
    "id": "records-largest-oil-spill",
    "prompt": "How many tonnes of oil were released in the largest oil spill?",
    "unit": "tonnes",
    "answerValue": 1500000,
    "decompositionHint": "Deliberate rather than accidental, released from terminals and tankers over several weeks. A supertanker carries about 300,000 tonnes.",
    "strategy": "anchor-scale",
    "source": "United Nations Environment Programme assessment of the 1991 Gulf War spill",
    "asOf": 1991
  },
  {
    "id": "records-largest-artificial-island",
    "prompt": "How many square kilometres does the largest artificial island cover?",
    "unit": "square kilometres",
    "answerValue": 970,
    "decompositionHint": "Reclaimed by draining a shallow inland sea rather than by dumping fill, which is why it is so much larger than any coastal project.",
    "strategy": "anchor-scale",
    "source": "Netherlands Rijkswaterstaat records for Flevopolder",
    "asOf": 2025
  },
  {
    "id": "records-longest-sea-crossing",
    "prompt": "How many kilometres long is the longest bridge over open sea?",
    "unit": "kilometres",
    "answerValue": 55,
    "decompositionHint": "It includes an undersea tunnel in the middle so ships can pass. Compare it with the width of the estuary it crosses.",
    "strategy": "anchor-scale",
    "source": "Hong Kong Highways Department specifications for the Hong Kong-Zhuhai-Macau link",
    "asOf": 2018
  },
  {
    "id": "records-largest-concrete-pour",
    "prompt": "How many cubic metres of concrete were placed in the largest continuous pour?",
    "unit": "cubic metres",
    "answerValue": 19624,
    "decompositionHint": "It has to be continuous because a joint would weaken the raft, so the limit is how many trucks can reach the site across two days of pouring.",
    "strategy": "rate-time",
    "source": "Published construction records for the Lakhta Center, Saint Petersburg",
    "asOf": 2015
  },
  {
    "id": "records-tallest-chimney",
    "prompt": "How many metres tall is the tallest chimney ever built?",
    "unit": "metres",
    "answerValue": 419.7,
    "decompositionHint": "Built to disperse smelter fumes above the inversion layer, so the height is set by local meteorology rather than by engineering ambition.",
    "strategy": "anchor-scale",
    "source": "Published engineering records for the Ekibastuz GRES-2 chimney",
    "asOf": 2025
  },
  {
    "id": "records-longest-airliner-glide",
    "prompt": "How many kilometres did an airliner glide after losing all engine power?",
    "unit": "kilometres",
    "answerValue": 120,
    "decompositionHint": "A jet glides about fifteen metres forward for every one it drops, so start from cruising altitude and apply that ratio.",
    "strategy": "anchor-scale",
    "source": "Portuguese civil aviation accident investigation report, Air Transat Flight 236",
    "asOf": 2001
  },
  {
    "id": "records-longest-runway",
    "prompt": "How many metres long was Qamdo Bamda Airport’s original runway?",
    "unit": "metres",
    "answerValue": 5500,
    "decompositionHint": "It sits at 4,300 metres on a plateau, where thin air means much longer takeoff rolls - so altitude rather than aircraft size sets the length. It has since been replaced by a shorter one.",
    "strategy": "anchor-scale",
    "source": "Civil Aviation Administration of China records for Qamdo Bamda Airport",
    "asOf": 2025
  },
  {
    "id": "records-highest-airport",
    "prompt": "How many metres above sea level is the highest commercial airport?",
    "unit": "metres",
    "answerValue": 4411,
    "decompositionHint": "High enough that passengers are offered oxygen on arrival. Compare it with the height at which climbers start using bottled air.",
    "strategy": "anchor-scale",
    "source": "Civil Aviation Administration of China records for Daocheng Yading Airport",
    "asOf": 2025
  },
  {
    "id": "records-fastest-crewed-aircraft",
    "prompt": "How many kilometres per hour is the fastest speed flown by a crewed aircraft?",
    "unit": "kilometres per hour",
    "answerValue": 7274,
    "decompositionHint": "A rocket plane dropped from a bomber rather than taking off. The speed of sound at altitude is about 1,060 km/h.",
    "strategy": "anchor-scale",
    "source": "NASA X-15 flight research programme records",
    "asOf": 1967
  },
  {
    "id": "records-longest-aircraft-flight-distance",
    "prompt": "How many kilometres did the longest non-stop unrefuelled aircraft flight cover?",
    "unit": "kilometres",
    "answerValue": 40212,
    "decompositionHint": "It circled the globe without landing or refuelling, so the answer is essentially the circumference of the Earth.",
    "strategy": "anchor-scale",
    "source": "Federation Aeronautique Internationale ratified record for Rutan Voyager",
    "asOf": 1986
  },
  {
    "id": "records-largest-submarine",
    "prompt": "How many tonnes does the largest submarine ever built displace when submerged?",
    "unit": "tonnes",
    "answerValue": 48000,
    "decompositionHint": "It is 175 metres long with a beam of 23. Treat it as a cylinder and remember that submerged displacement equals its whole volume of water.",
    "strategy": "volume-packing",
    "source": "Published naval specifications for the Typhoon class",
    "asOf": 2025
  },
  {
    "id": "records-fastest-atlantic-ship-crossing",
    "prompt": "How many hours did the fastest ever ship crossing of the Atlantic take?",
    "unit": "hours",
    "answerValue": 82,
    "decompositionHint": "The route is about 5,300 km, so divide that by a plausible sustained speed for a fast ocean liner or powerboat.",
    "strategy": "rate-time",
    "source": "Hales Trophy records, Blue Riband of the Atlantic",
    "asOf": 1992
  },
  {
    "id": "records-longest-rail-journey",
    "prompt": "How many kilometres is the longest scheduled single railway journey?",
    "unit": "kilometres",
    "answerValue": 10214,
    "decompositionHint": "A through carriage running across most of Eurasia. Compare it with the roughly 9,300 km Trans-Siberian route it mostly follows.",
    "strategy": "anchor-scale",
    "source": "Russian Railways published timetable records",
    "asOf": 2025
  },
  {
    "id": "records-highest-railway",
    "prompt": "How many metres above sea level does the highest railway reach?",
    "unit": "metres",
    "answerValue": 5072,
    "decompositionHint": "Carriages are pressurised and oxygen is piped to every seat, which tells you it is well above where altitude sickness sets in.",
    "strategy": "anchor-scale",
    "source": "China Railway specifications for the Qinghai-Tibet line at Tanggula Pass",
    "asOf": 2025
  },
  {
    "id": "records-longest-bus-route",
    "prompt": "How many kilometres long is the longest scheduled bus route?",
    "unit": "kilometres",
    "answerValue": 6200,
    "decompositionHint": "It crosses a continent and takes about five days. Estimate the daily distance a coach can cover and multiply.",
    "strategy": "rate-time",
    "source": "Peruvian and Brazilian transport authority route registrations",
    "asOf": 2025
  },
  {
    "id": "records-longest-traffic-jam",
    "prompt": "How many hours did the longest traffic jam last?",
    "unit": "hours",
    "answerValue": 288,
    "decompositionHint": "Twelve days on a road that had been closed for repair while heavy freight kept arriving. Drivers slept and ate in their vehicles.",
    "strategy": "unit-conversion",
    "source": "Chinese Ministry of Public Security records for the 2010 China National Highway 110 jam",
    "asOf": 2010
  },
  {
    "id": "records-tallest-rocket",
    "prompt": "How many metres tall is the tallest rocket ever launched?",
    "unit": "metres",
    "answerValue": 121,
    "decompositionHint": "The Saturn V was 111 metres, so this is in the same class rather than a different one. Compare it with a 40-storey building.",
    "strategy": "anchor-scale",
    "source": "SpaceX published vehicle specifications for Starship",
    "asOf": 2023
  },
  {
    "id": "records-largest-conventional-explosion",
    "prompt": "How many tonnes of TNT equivalent was the largest accidental non-nuclear explosion?",
    "unit": "tonnes of TNT equivalent",
    "answerValue": 2900,
    "decompositionHint": "A munitions ship catching fire in a harbour. For comparison, the Hiroshima bomb was about 15,000 tonnes of TNT equivalent.",
    "strategy": "anchor-scale",
    "source": "Canadian government inquiry records for the 1917 Halifax explosion",
    "asOf": 1917
  },
  {
    "id": "records-largest-test-crater",
    "prompt": "How many metres across is the crater left by the largest deliberate excavation blast?",
    "unit": "metres",
    "answerValue": 390,
    "decompositionHint": "A buried nuclear device tested for civil earthmoving. It lifted twelve million tonnes of soil, which is what sets the crater's width.",
    "strategy": "volume-packing",
    "source": "United States Department of Energy records for the Sedan test",
    "asOf": 1962
  },
  {
    "id": "records-largest-mining-truck-payload",
    "prompt": "How many tonnes can the largest mining truck carry in one load?",
    "unit": "tonnes",
    "answerValue": 450,
    "decompositionHint": "Limited by tyres rather than by engine: six tyres four metres tall, each carrying a share of the loaded weight.",
    "strategy": "divide-total",
    "source": "BelAZ published specifications for the 75710 haul truck",
    "asOf": 2025
  },
  {
    "id": "records-most-powerful-rocket-engine",
    "prompt": "How many newtons of thrust does the most powerful single rocket engine produce?",
    "unit": "newtons",
    "answerValue": 6770000,
    "decompositionHint": "Five of these lifted the Saturn V, whose total liftoff thrust was about 35 million newtons. Divide rather than guess.",
    "strategy": "divide-total",
    "source": "NASA specifications for the F-1 engine",
    "asOf": 1967
  },
  {
    "id": "records-largest-bell",
    "prompt": "How many kilograms does the largest bell ever cast weigh?",
    "unit": "kilograms",
    "answerValue": 201924,
    "decompositionHint": "It cracked before it was ever rung and has never left the ground. Bronze is about 8,800 kilograms per cubic metre.",
    "strategy": "volume-packing",
    "source": "Moscow Kremlin Museums records for the Tsar Bell",
    "asOf": 1735
  },
  {
    "id": "records-largest-pipe-organ",
    "prompt": "How many pipes does the largest pipe organ have?",
    "unit": "pipes",
    "answerValue": 33112,
    "decompositionHint": "Seven keyboards and hundreds of stops, each stop being a full set of pipes across the keyboard range. Multiply stops by notes.",
    "strategy": "chain-multiply",
    "source": "Boardwalk Hall Auditorium Organ published specifications, Atlantic City",
    "asOf": 2025
  },
  {
    "id": "records-longest-tapestry",
    "prompt": "How many metres long is the Bayeux Tapestry?",
    "unit": "metres",
    "answerValue": 68.4,
    "decompositionHint": "An embroidered strip of linen only half a metre tall, telling a story in sequence - so its length is set by how much story it covers.",
    "strategy": "anchor-scale",
    "source": "Bayeux Museum conservation survey records",
    "asOf": 2025
  },
  {
    "id": "records-largest-wind-farm",
    "prompt": "How many megawatts is the planned capacity of the largest wind farm?",
    "unit": "megawatts",
    "answerValue": 20000,
    "decompositionHint": "Thousands of turbines of a few megawatts each, spread across a desert corridor. Multiply a plausible turbine count by turbine size.",
    "strategy": "chain-multiply",
    "source": "China National Energy Administration records for the Gansu Wind Farm",
    "asOf": 2025
  },
  {
    "id": "records-largest-swimming-pool",
    "prompt": "How many square metres of water does the largest swimming pool cover?",
    "unit": "square metres",
    "answerValue": 82000,
    "decompositionHint": "A kilometre long lagoon filled with filtered seawater. Compare it with an Olympic pool at 1,250 square metres.",
    "strategy": "divide-total",
    "source": "San Alfonso del Mar published facility specifications, Chile",
    "asOf": 2025
  },
  {
    "id": "records-tallest-wooden-building",
    "prompt": "How many metres tall is the tallest building made mostly of wood?",
    "unit": "metres",
    "answerValue": 87,
    "decompositionHint": "Engineered timber rather than sawn logs. The limit is fire regulation and stiffness rather than the strength of the material.",
    "strategy": "anchor-scale",
    "source": "Published construction records for the Ascent tower, Milwaukee",
    "asOf": 2022
  },
  {
    "id": "records-largest-dome-span",
    "prompt": "How many metres across is the largest free-spanning dome?",
    "unit": "metres",
    "answerValue": 310,
    "decompositionHint": "A steel roof over a stadium bowl, so the span has to clear the pitch and the stands without any internal support.",
    "strategy": "anchor-scale",
    "source": "Published engineering specifications for the Singapore National Stadium",
    "asOf": 2014
  },
  {
    "id": "records-longest-cantilever-span",
    "prompt": "How many metres is the longest cantilever bridge span?",
    "unit": "metres",
    "answerValue": 549,
    "decompositionHint": "Two arms built out from piers to meet in the middle, so each half must hold itself up during construction with nothing beneath it.",
    "strategy": "anchor-scale",
    "source": "Canadian national engineering records for the Quebec Bridge",
    "asOf": 1917
  },
  {
    "id": "records-largest-carbon-capture-plant",
    "prompt": "How many tonnes of carbon dioxide a year can the largest direct air capture plant remove?",
    "unit": "tonnes per year",
    "answerValue": 36000,
    "decompositionHint": "Compare with global emissions of about 37 billion tonnes a year, and the answer says a good deal about how early this technology is.",
    "strategy": "divide-total",
    "source": "Climeworks published specifications for the Mammoth plant, Iceland",
    "asOf": 2024
  },
  {
    "id": "records-largest-telescope-array-antennas",
    "prompt": "How many antennas does the largest radio telescope array use?",
    "unit": "antennas",
    "answerValue": 131072,
    "decompositionHint": "Low-frequency antennas are cheap and small, so sensitivity comes from building enormous numbers rather than a few large dishes.",
    "strategy": "anchor-scale",
    "source": "Square Kilometre Array Observatory published design specifications",
    "asOf": 2025
  },
  {
    "id": "records-deepest-plant-roots",
    "prompt": "How many metres down have the deepest plant roots ever been found?",
    "unit": "metres",
    "answerValue": 68,
    "decompositionHint": "A desert tree reaching for a water table far below the surface, found when a borehole was drilled through it. Most tree roots stay within three metres.",
    "strategy": "anchor-scale",
    "source": "Published botanical records for Boscia albitrunca, Kalahari",
    "asOf": 2025
  },
  {
    "id": "records-largest-geomagnetic-storm",
    "prompt": "How many nanotesla did the magnetic field dip during the largest recorded solar storm?",
    "unit": "nanotesla",
    "answerValue": 850,
    "decompositionHint": "Earth's own field at the surface is about 50,000 nanotesla, so this is a disturbance of a couple of percent - enough to set telegraph wires sparking.",
    "strategy": "anchor-scale",
    "source": "NOAA Space Weather Prediction Center reconstruction of the 1859 Carrington event",
    "asOf": 1859
  },
  {
    "id": "records-largest-airburst",
    "prompt": "How many tonnes of TNT equivalent was the largest recorded meteor airburst?",
    "unit": "tonnes of TNT equivalent",
    "answerValue": 12000000,
    "decompositionHint": "It flattened 2,000 square kilometres of forest without leaving a crater. Compare it with the 15,000 tonnes of the Hiroshima bomb.",
    "strategy": "anchor-scale",
    "source": "Russian Academy of Sciences studies of the 1908 Tunguska event",
    "asOf": 1908
  },
  {
    "id": "records-chelyabinsk-airburst-energy",
    "prompt": "How many tonnes of TNT equivalent did the Chelyabinsk meteor release?",
    "unit": "tonnes of TNT equivalent",
    "answerValue": 500000,
    "decompositionHint": "An object about 20 metres across entering at 19 kilometres a second. Kinetic energy is half the mass times the speed squared.",
    "strategy": "energy-balance",
    "source": "NASA Jet Propulsion Laboratory near-Earth object analysis",
    "asOf": 2013
  },
  {
    "id": "records-deepest-earthquake",
    "prompt": "How many kilometres below the surface did the deepest recorded earthquake occur?",
    "unit": "kilometres",
    "answerValue": 751,
    "decompositionHint": "Far below the brittle crust, in a subducting slab where rock should flow rather than snap - which is why these are so puzzling.",
    "strategy": "anchor-scale",
    "source": "United States Geological Survey earthquake catalogue",
    "asOf": 2015
  },
  {
    "id": "records-highest-g-force-survived",
    "prompt": "How many times the force of gravity did the highest deliberate human deceleration reach?",
    "unit": "times gravity",
    "answerValue": 46.2,
    "decompositionHint": "A rocket sled stopped in about a second from 1,000 km/h. Divide the speed change by the time to get the acceleration.",
    "strategy": "rate-time",
    "source": "United States Air Force rocket sled test records, Holloman",
    "asOf": 1954
  },
  {
    "id": "records-fastest-plate-motion",
    "prompt": "How many centimetres a year does the fastest-moving tectonic plate travel?",
    "unit": "centimetres per year",
    "answerValue": 16,
    "decompositionHint": "Roughly the rate fingernails grow. Measured by satellite geodesy, which can resolve millimetres over a continent.",
    "strategy": "anchor-scale",
    "source": "NASA Jet Propulsion Laboratory space geodesy measurements",
    "asOf": 2025
  },
  {
    "id": "records-oldest-water",
    "prompt": "How many years has the oldest water ever found been isolated underground?",
    "unit": "years",
    "answerValue": 2000000000,
    "decompositionHint": "Dated by the noble gases that have accumulated in it from radioactive decay in the surrounding rock, which acts as a clock.",
    "strategy": "anchor-scale",
    "source": "University of Toronto isotopic dating of Kidd Creek Mine fluids",
    "asOf": 2016
  },
  {
    "id": "records-farthest-object-visited",
    "prompt": "How many kilometres from the Sun was the most distant object ever visited by a spacecraft?",
    "unit": "kilometres",
    "answerValue": 6600000000,
    "decompositionHint": "A small Kuiper Belt object photographed in a flyby. Neptune orbits at 4.5 billion kilometres, so this is comfortably beyond the planets.",
    "strategy": "anchor-scale",
    "source": "NASA New Horizons mission data for Arrokoth",
    "asOf": 2019
  },
  {
    "id": "records-longest-venus-survival",
    "prompt": "How many minutes did the longest-surviving lander last on the surface of Venus?",
    "unit": "minutes",
    "answerValue": 127,
    "decompositionHint": "465 degrees and ninety times Earth's air pressure. The probe was chilled beforehand and ran on stored cold rather than cooling.",
    "strategy": "anchor-scale",
    "source": "Soviet Venera programme mission records, Venera 13",
    "asOf": 1982
  },
  {
    "id": "records-lunar-craters-counted",
    "prompt": "How many craters wider than one kilometre have been catalogued on the Moon?",
    "unit": "craters",
    "answerValue": 1300000,
    "decompositionHint": "The Moon's surface is 38 million square kilometres. Work out how densely a 1 km crater would have to be packed to reach a given count.",
    "strategy": "area-density",
    "source": "NASA Lunar Reconnaissance Orbiter global crater catalogue",
    "asOf": 2025
  },
  {
    "id": "records-chicxulub-impact-energy",
    "prompt": "How many joules of energy did the impact that ended the dinosaurs release?",
    "unit": "joules",
    "answerValue": 1e+23,
    "decompositionHint": "A 10 km rock at 20 km per second. Kinetic energy is half the mass times the speed squared, and rock is about 3,000 kilograms per cubic metre.",
    "strategy": "energy-balance",
    "source": "Published impact modelling of the Chicxulub event, Imperial College London",
    "asOf": 2025
  },
  {
    "id": "records-longest-rover-mission",
    "prompt": "How many Martian days did the longest-running Mars rover mission last?",
    "unit": "sols",
    "answerValue": 5352,
    "decompositionHint": "Designed for ninety days and killed in the end by a dust storm coating its solar panels. That is roughly fifteen Earth years.",
    "strategy": "unit-conversion",
    "source": "NASA Jet Propulsion Laboratory Opportunity mission records",
    "asOf": 2018
  },
  {
    "id": "records-largest-ring-system",
    "prompt": "How many kilometres is the outer radius of the largest planetary ring?",
    "unit": "kilometres",
    "answerValue": 13000000,
    "decompositionHint": "Not the bright rings but a vast, faint dust ring found in infrared. Saturn's visible rings end about 140,000 km out, so this is far beyond them.",
    "strategy": "anchor-scale",
    "source": "NASA Spitzer Space Telescope discovery of the Phoebe ring",
    "asOf": 2009
  },
  {
    "id": "records-coldest-place-solar-system",
    "prompt": "How many kelvin is the coldest temperature measured anywhere in the solar system?",
    "unit": "kelvin",
    "answerValue": 25,
    "decompositionHint": "In a crater floor near the Moon's south pole that has not seen sunlight for billions of years. Deep space itself sits at about 2.7 kelvin.",
    "strategy": "anchor-scale",
    "source": "NASA Lunar Reconnaissance Orbiter Diviner radiometer measurements",
    "asOf": 2009
  },
  {
    "id": "records-coldest-place-in-universe",
    "prompt": "How many kelvin is the coldest known natural place in the universe?",
    "unit": "kelvin",
    "answerValue": 1,
    "decompositionHint": "A nebula cooled below the background temperature of space itself by gas expanding rapidly away from a dying star.",
    "strategy": "anchor-scale",
    "source": "Published submillimetre observations of the Boomerang Nebula",
    "asOf": 2025
  },
  {
    "id": "records-highest-rocket-plane-altitude",
    "prompt": "How many metres up did the highest flight by a rocket-powered aeroplane reach?",
    "unit": "metres",
    "answerValue": 107960,
    "decompositionHint": "Above the 100 km line that is usually taken as the edge of space, flown by a piloted aircraft that glided back to a runway.",
    "strategy": "anchor-scale",
    "source": "NASA X-15 flight research programme records",
    "asOf": 1963
  },
  {
    "id": "records-farthest-naked-eye-object",
    "prompt": "How many light years away is the most distant object visible to the naked eye?",
    "unit": "light years",
    "answerValue": 2500000,
    "decompositionHint": "A whole galaxy rather than a star, which is the only way something that far can be bright enough. The Milky Way is 100,000 light years across.",
    "strategy": "anchor-scale",
    "source": "International Astronomical Union catalogue data for the Andromeda Galaxy",
    "asOf": 2025
  },
  {
    "id": "records-most-energetic-gamma-ray",
    "prompt": "How many electronvolts did the most energetic photon ever detected carry?",
    "unit": "electronvolts",
    "answerValue": 18000000000000,
    "decompositionHint": "From a gamma-ray burst so bright it saturated the detectors watching it. Visible light photons carry about two electronvolts.",
    "strategy": "anchor-scale",
    "source": "LHAASO observatory published measurements of GRB 221009A",
    "asOf": 2022
  },
  {
    "id": "records-largest-typhoon",
    "prompt": "How many kilometres across was the largest tropical cyclone ever measured?",
    "unit": "kilometres",
    "answerValue": 2220,
    "decompositionHint": "Nearly half the width of a continent, measured to the outer edge of its circulation rather than to the eye wall.",
    "strategy": "anchor-scale",
    "source": "NOAA and Joint Typhoon Warning Center records for Typhoon Tip",
    "asOf": 1979
  },
  {
    "id": "records-oldest-impact-crater",
    "prompt": "How many years old is the oldest confirmed impact crater on Earth?",
    "unit": "years",
    "answerValue": 2229000000,
    "decompositionHint": "Half the age of the planet. Almost nothing older survives, because plate tectonics recycles the crust that would carry the scar.",
    "strategy": "anchor-scale",
    "source": "Curtin University isotopic dating of the Yarrabubba structure",
    "asOf": 2020
  },
  {
    "id": "records-most-lightning-per-year",
    "prompt": "How many nights a year does the most lightning-prone place on Earth see storms?",
    "unit": "nights per year",
    "answerValue": 297,
    "decompositionHint": "Warm air off a lake meeting mountain air almost every evening, so the answer is a large fraction of the whole year rather than a handful.",
    "strategy": "anchor-scale",
    "source": "NASA Lightning Imaging Sensor observations of Lake Maracaibo",
    "asOf": 2016
  },
  {
    "id": "records-longest-continuous-eruption",
    "prompt": "How many years has the longest continuously erupting volcano been active?",
    "unit": "years",
    "answerValue": 800,
    "decompositionHint": "Recorded by European sailors as already erupting when they first passed, and it has not stopped since. That puts the start in medieval times.",
    "strategy": "anchor-scale",
    "source": "Smithsonian Global Volcanism Program record for Mount Yasur",
    "asOf": 2025
  },
  {
    "id": "records-largest-sand-sea",
    "prompt": "How many square kilometres does the largest continuous sand desert cover?",
    "unit": "square kilometres",
    "answerValue": 650000,
    "decompositionHint": "Sand seas are a small part of most deserts - the Sahara is mostly rock and gravel - so this is far less than the desert that contains it.",
    "strategy": "anchor-scale",
    "source": "Published geological surveys of the Rub al Khali",
    "asOf": 2025
  },
  {
    "id": "records-farthest-point-from-earth-centre",
    "prompt": "How many kilometres from the centre of the Earth is its most distant surface point?",
    "unit": "kilometres",
    "answerValue": 6384.4,
    "decompositionHint": "Not Everest: the planet bulges at the equator by about 21 km, so a lower mountain nearer the equator wins by that margin.",
    "strategy": "anchor-scale",
    "source": "Instituto Geografico Militar survey of Chimborazo",
    "asOf": 2025
  },
  {
    "id": "records-longest-animal-fast",
    "prompt": "How many days can a male emperor penguin go without eating?",
    "unit": "days",
    "answerValue": 120,
    "decompositionHint": "It incubates an egg through the Antarctic winter while the female feeds at sea. Work from the length of that winter rather than from hunger.",
    "strategy": "rate-time",
    "source": "British Antarctic Survey breeding studies",
    "asOf": 2025
  },
  {
    "id": "records-most-chromosomes",
    "prompt": "How many chromosomes does the species with the most chromosomes carry?",
    "unit": "chromosomes",
    "answerValue": 1440,
    "decompositionHint": "A fern that has repeatedly doubled its whole genome. Humans have 46, so this is a chain of doublings rather than a slow accumulation.",
    "strategy": "exponential",
    "source": "Royal Botanic Gardens Kew chromosome count records for Ophioglossum",
    "asOf": 2025
  },
  {
    "id": "records-smallest-genome",
    "prompt": "How many base pairs does the smallest known cellular genome contain?",
    "unit": "base pairs",
    "answerValue": 159662,
    "decompositionHint": "A bacterium living inside insect cells, which has shed almost every gene it can borrow from its host. E. coli has 4.6 million.",
    "strategy": "anchor-scale",
    "source": "Published genome sequence of Carsonella ruddii, Science",
    "asOf": 2006
  },
  {
    "id": "records-longest-hibernation",
    "prompt": "How many months can the longest-hibernating mammal stay asleep?",
    "unit": "months",
    "answerValue": 11,
    "decompositionHint": "A dormouse that skips breeding entirely in years when the tree seed crop fails, so the sleep is limited by the length of the year itself.",
    "strategy": "anchor-scale",
    "source": "Published studies of Glis glis hibernation, University of Vienna",
    "asOf": 2025
  },
  {
    "id": "records-largest-bird-nest",
    "prompt": "How many kilograms did the heaviest recorded bird nest weigh?",
    "unit": "kilograms",
    "answerValue": 2700,
    "decompositionHint": "Built up over decades by successive pairs adding sticks each year, until the branch holding it gave way.",
    "strategy": "rate-time",
    "source": "Published ornithological records for a bald eagle nest, St Petersburg, Florida",
    "asOf": 1963
  },
  {
    "id": "records-largest-beaver-dam",
    "prompt": "How many metres long is the largest beaver dam?",
    "unit": "metres",
    "answerValue": 850,
    "decompositionHint": "Large enough to be spotted from orbit in satellite imagery, built by successive generations across a shallow valley over decades.",
    "strategy": "anchor-scale",
    "source": "Parks Canada survey of Wood Buffalo National Park",
    "asOf": 2007
  },
  {
    "id": "records-tallest-termite-mound",
    "prompt": "How many metres tall is the tallest recorded termite mound?",
    "unit": "metres",
    "answerValue": 8,
    "decompositionHint": "A ventilation chimney for a colony living mostly underground, so the height is set by the airflow it has to drive rather than by the nest.",
    "strategy": "anchor-scale",
    "source": "Documented cathedral termite mounds, Northern Territory, Australia",
    "asOf": 2025
  },
  {
    "id": "records-oldest-wild-bird",
    "prompt": "How many years old is the oldest known wild bird still breeding?",
    "unit": "years",
    "answerValue": 74,
    "decompositionHint": "A Laysan albatross ringed as an adult in 1956, so her true age is at least that plus the five years before a first breeding attempt.",
    "strategy": "anchor-scale",
    "source": "United States Fish and Wildlife Service banding records for Wisdom",
    "asOf": 2025
  },
  {
    "id": "records-most-abundant-organism",
    "prompt": "How many individual cells does the most abundant organism on Earth number?",
    "unit": "cells",
    "answerValue": 2e+28,
    "decompositionHint": "A marine bacterium making up a large share of all plankton. Start from the ocean's volume in litres and a plausible count per litre.",
    "strategy": "volume-packing",
    "source": "Published abundance estimates for Pelagibacter ubique, Oregon State University",
    "asOf": 2025
  },
  {
    "id": "records-highest-living-mammal",
    "prompt": "How many metres above sea level does the highest-living mammal survive?",
    "unit": "metres",
    "answerValue": 6130,
    "decompositionHint": "Found in rock crevices on a volcano well above the snowline, where there is a little over half the oxygen available at sea level.",
    "strategy": "anchor-scale",
    "source": "Published survey of yellow-rumped leaf-eared mouse, University of Nebraska",
    "asOf": 2020
  },
  {
    "id": "records-largest-flower",
    "prompt": "How many metres across is the largest single flower?",
    "unit": "metres",
    "answerValue": 1.11,
    "decompositionHint": "A parasite with no leaves, stem or roots, which is what lets it put everything into one bloom. It smells of rotting meat to draw flies.",
    "strategy": "anchor-scale",
    "source": "Published botanical records for Rafflesia arnoldii, Indonesia",
    "asOf": 2025
  },
  {
    "id": "records-largest-fungus-fruiting-body",
    "prompt": "How many metres long was the largest fungal fruiting body ever found?",
    "unit": "metres",
    "answerValue": 10.85,
    "decompositionHint": "A shelf fungus growing along the underside of a fallen trunk, so its length is limited by the tree rather than by the fungus.",
    "strategy": "anchor-scale",
    "source": "Published description of Phellinus ellipsoideus, Fungal Biology",
    "asOf": 2011
  },
  {
    "id": "records-fastest-plant-movement",
    "prompt": "How many seconds does the fastest movement by a plant take?",
    "unit": "seconds",
    "answerValue": 0.0005,
    "decompositionHint": "A flower firing its pollen by releasing elastic tension, far too fast for anything chemical. A Venus flytrap is a thousand times slower.",
    "strategy": "anchor-scale",
    "source": "Published high-speed videography of bunchberry dogwood, Williams College",
    "asOf": 2005
  },
  {
    "id": "records-largest-seagrass-meadow",
    "prompt": "How many square kilometres does the largest single seagrass meadow cover?",
    "unit": "square kilometres",
    "answerValue": 180,
    "decompositionHint": "One clone spreading by runners for about 4,500 years, so its size is a growth rate multiplied by a very long time.",
    "strategy": "rate-time",
    "source": "University of Western Australia genetic survey of Shark Bay",
    "asOf": 2022
  },
  {
    "id": "records-highest-helicopter-flight",
    "prompt": "How many metres up did the highest helicopter flight reach?",
    "unit": "metres",
    "answerValue": 12442,
    "decompositionHint": "A rotor needs air to bite on, so the ceiling is far below a jet's. Airliners cruise at about 11,000 metres.",
    "strategy": "anchor-scale",
    "source": "Federation Aeronautique Internationale ratified rotorcraft altitude record",
    "asOf": 1972
  },
  {
    "id": "records-highest-glider-altitude",
    "prompt": "How many metres up did the highest glider flight reach?",
    "unit": "metres",
    "answerValue": 22657,
    "decompositionHint": "Riding a stratospheric mountain wave in a pressurised sailplane, well above where airliners fly and with no engine at all.",
    "strategy": "anchor-scale",
    "source": "Federation Aeronautique Internationale ratified record, Perlan 2",
    "asOf": 2018
  },
  {
    "id": "records-longest-paraglider-flight",
    "prompt": "How many kilometres is the longest distance flown by a paraglider?",
    "unit": "kilometres",
    "answerValue": 631,
    "decompositionHint": "A fabric wing with no rigid structure, climbing in thermals all day. Work from a modest cross-country speed and the hours of usable lift.",
    "strategy": "rate-time",
    "source": "Federation Aeronautique Internationale ratified paragliding record",
    "asOf": 2023
  },
  {
    "id": "records-longest-hang-glider-flight",
    "prompt": "How many kilometres is the longest distance flown by a hang glider?",
    "unit": "kilometres",
    "answerValue": 764,
    "decompositionHint": "Faster than a paraglider and so able to cover more ground in the same day's thermals, but still limited by daylight.",
    "strategy": "rate-time",
    "source": "Federation Aeronautique Internationale ratified hang gliding record",
    "asOf": 2012
  },
  {
    "id": "records-fastest-motorcycle",
    "prompt": "How many kilometres per hour is the motorcycle land speed record?",
    "unit": "kilometres per hour",
    "answerValue": 605.7,
    "decompositionHint": "Set in a fully enclosed streamliner rather than on an exposed bike, which is what lets it pass halfway to the speed of sound.",
    "strategy": "anchor-scale",
    "source": "Federation Internationale de Motocyclisme ratified record",
    "asOf": 2010
  },
  {
    "id": "records-longest-cave-isolation",
    "prompt": "How many days did the longest voluntary stay alone underground last?",
    "unit": "days",
    "answerValue": 500,
    "decompositionHint": "An experiment in isolation with no clocks and no contact. The limit is psychological rather than physical, and it ran well over a year.",
    "strategy": "anchor-scale",
    "source": "Published scientific monitoring of the Timeline project, Granada",
    "asOf": 2023
  },
  {
    "id": "records-fastest-100km-run",
    "prompt": "How many seconds is the world record for running 100 kilometres?",
    "unit": "seconds",
    "answerValue": 22154,
    "decompositionHint": "Just over six hours, which is a pace close to three and a half minutes per kilometre held for the whole distance. Convert the hours.",
    "strategy": "rate-time",
    "source": "International Association of Ultrarunners ratified world record",
    "asOf": 2018
  },
  {
    "id": "records-longest-golf-hole",
    "prompt": "How many metres long is the longest golf hole in the world?",
    "unit": "metres",
    "answerValue": 1004,
    "decompositionHint": "A par seven, and a kilometre from tee to green. A long par five is about 550 metres, so ask how many extra shots this adds and how far each carries.",
    "strategy": "anchor-scale",
    "source": "Korea Golf Association course records for Gunsan Country Club",
    "asOf": 2025
  },
  {
    "id": "records-largest-quantum-computer",
    "prompt": "How many qubits does the largest superconducting quantum processor have?",
    "unit": "qubits",
    "answerValue": 1121,
    "decompositionHint": "Each qubit needs its own control wiring into a dilution refrigerator, so the count is limited by cabling and heat rather than by chip area.",
    "strategy": "anchor-scale",
    "source": "IBM published specifications for the Condor processor",
    "asOf": 2023
  },
  {
    "id": "records-highest-transmission-voltage",
    "prompt": "How many volts does the highest-voltage power line carry?",
    "unit": "volts",
    "answerValue": 1100000,
    "decompositionHint": "Higher voltage means lower current and so less heating loss, which is what makes very long lines possible. Household supply is about 230 volts.",
    "strategy": "anchor-scale",
    "source": "State Grid Corporation of China specifications for the Changji-Guquan link",
    "asOf": 2019
  },
  {
    "id": "records-largest-planned-telescope",
    "prompt": "How many hexagonal segments make up the mirror of the Extremely Large Telescope?",
    "unit": "segments",
    "answerValue": 798,
    "decompositionHint": "The mirror is 39 metres across and each segment is about 1.4 metres. Divide the mirror area by the segment area rather than guessing.",
    "strategy": "anchor-scale",
    "source": "European Southern Observatory specifications for the Extremely Large Telescope",
    "asOf": 2025
  },
  {
    "id": "records-oldest-shoes",
    "prompt": "How many years old is the oldest known pair of shoes?",
    "unit": "years",
    "answerValue": 5500,
    "decompositionHint": "Leather preserved in a dry cave under a layer of sheep dung, which sealed it from air. That puts it before the first written records.",
    "strategy": "anchor-scale",
    "source": "Published excavation report for the Areni-1 cave, Armenia",
    "asOf": 2010
  },
  {
    "id": "records-oldest-bread",
    "prompt": "How many years old is the oldest known bread?",
    "unit": "years",
    "answerValue": 14400,
    "decompositionHint": "Charred crumbs found in a fireplace, and older than farming - so it was made from wild grains gathered rather than grown.",
    "strategy": "anchor-scale",
    "source": "University of Copenhagen excavation at Shubayqa 1, Jordan",
    "asOf": 2018
  },
  {
    "id": "records-oldest-pottery",
    "prompt": "How many years old is the oldest known pottery?",
    "unit": "years",
    "answerValue": 20000,
    "decompositionHint": "Made by hunter-gatherers well before farming, which overturned the old assumption that pots arrive with settled villages.",
    "strategy": "anchor-scale",
    "source": "Published radiocarbon dating of Xianrendong Cave pottery, Science",
    "asOf": 2012
  },
  {
    "id": "records-oldest-human-footprints",
    "prompt": "How many years old are the oldest securely dated human footprints in the Americas?",
    "unit": "years",
    "answerValue": 23000,
    "decompositionHint": "Pressed into a lakeshore and dated by seeds in the layers above and below, which places people there during the last glacial maximum.",
    "strategy": "anchor-scale",
    "source": "United States Geological Survey dating of the White Sands trackways",
    "asOf": 2021
  },
  {
    "id": "records-oldest-mummy",
    "prompt": "How many years old are the oldest deliberately mummified human remains?",
    "unit": "years",
    "answerValue": 7000,
    "decompositionHint": "From a desert coast in South America, and around two thousand years earlier than the Egyptian practice most people think of first.",
    "strategy": "anchor-scale",
    "source": "UNESCO World Heritage documentation for the Chinchorro culture",
    "asOf": 2025
  },
  {
    "id": "records-oldest-university",
    "prompt": "How many years has the oldest continuously operating university been teaching?",
    "unit": "years",
    "answerValue": 1166,
    "decompositionHint": "Founded in North Africa as a mosque school and still awarding degrees, which puts its founding in the ninth century.",
    "strategy": "anchor-scale",
    "source": "UNESCO records for the University of al-Qarawiyyin",
    "asOf": 2025
  },
  {
    "id": "records-oldest-parliament",
    "prompt": "How many years has the oldest surviving parliament been sitting?",
    "unit": "years",
    "answerValue": 1095,
    "decompositionHint": "Founded by settlers on a volcanic island who met outdoors at a rift valley once a year. That places it in the early tenth century.",
    "strategy": "anchor-scale",
    "source": "UNESCO World Heritage documentation for Thingvellir and the Althing",
    "asOf": 2025
  },
  {
    "id": "records-oldest-star-map",
    "prompt": "How many years old is the oldest known depiction of the night sky?",
    "unit": "years",
    "answerValue": 3600,
    "decompositionHint": "A bronze disc with gold inlays showing the sun, moon and a cluster of stars, dated by the Bronze Age hoard it was buried with.",
    "strategy": "anchor-scale",
    "source": "State Museum of Prehistory Halle records for the Nebra sky disc",
    "asOf": 2025
  },
  {
    "id": "records-most-expensive-watch",
    "prompt": "How many US dollars did the most expensive wristwatch ever sold fetch?",
    "unit": "US dollars",
    "answerValue": 31190000,
    "decompositionHint": "A one-off complicated piece sold for charity, so the price reflects competitive bidding as much as the movement inside it.",
    "strategy": "anchor-scale",
    "source": "Christie's published auction result, Only Watch 2019",
    "asOf": 2019
  },
  {
    "id": "records-most-expensive-stamp",
    "prompt": "How many US dollars did the most expensive postage stamp fetch?",
    "unit": "US dollars",
    "answerValue": 8300000,
    "decompositionHint": "A single surviving example of a provisional issue printed locally when a shipment failed to arrive. Rarity rather than beauty sets the price.",
    "strategy": "anchor-scale",
    "source": "Sotheby's published auction result for the British Guiana 1c magenta",
    "asOf": 2021
  },
  {
    "id": "records-most-expensive-violin",
    "prompt": "How many US dollars did the most expensive violin ever sold fetch?",
    "unit": "US dollars",
    "answerValue": 15900000,
    "decompositionHint": "An eighteenth-century instrument. Compare it with the most expensive painting, which went for nearly thirty times as much.",
    "strategy": "anchor-scale",
    "source": "Tarisio published auction result for the Lady Blunt Stradivarius",
    "asOf": 2011
  },
  {
    "id": "records-most-expensive-photograph",
    "prompt": "How many US dollars did the most expensive photograph fetch at auction?",
    "unit": "US dollars",
    "answerValue": 12400000,
    "decompositionHint": "A print from a small numbered edition, which is what lets a reproducible medium command a price at all.",
    "strategy": "anchor-scale",
    "source": "Christie's published auction result for Man Ray's Le Violon d'Ingres",
    "asOf": 2022
  },
  {
    "id": "records-largest-ipo",
    "prompt": "How many US dollars did the largest stock market flotation raise?",
    "unit": "US dollars",
    "answerValue": 29400000000,
    "decompositionHint": "A state oil company selling a sliver of itself. The sum raised is a small percentage of a valuation close to two trillion dollars.",
    "strategy": "divide-total",
    "source": "Saudi Aramco published prospectus and listing documents",
    "asOf": 2019
  },
  {
    "id": "records-largest-lottery-jackpot",
    "prompt": "How many US dollars was the largest lottery jackpot ever won?",
    "unit": "US dollars",
    "answerValue": 2040000000,
    "decompositionHint": "It rolled over for three months. Each draw adds a share of ticket sales, so multiply a plausible weekly take by the number of draws.",
    "strategy": "rate-time",
    "source": "California State Lottery published Powerball results",
    "asOf": 2022
  },
  {
    "id": "records-largest-ancient-city",
    "prompt": "How many people lived in the largest city of the ancient world at its peak?",
    "unit": "people",
    "answerValue": 1000000,
    "decompositionHint": "It needed grain shipped from across a sea to feed itself, which is a good clue to the scale. No city matched it again for 1,800 years.",
    "strategy": "anchor-scale",
    "source": "Published demographic estimates for imperial Rome, Cambridge Ancient History",
    "asOf": 2025
  },
  {
    "id": "records-longest-suspension-bridge-towers",
    "prompt": "How many metres tall are the tallest bridge towers ever built?",
    "unit": "metres",
    "answerValue": 343,
    "decompositionHint": "A suspension bridge's towers must clear the deck by enough for the cable to sag properly, so tower height tracks span length.",
    "strategy": "anchor-scale",
    "source": "Published engineering specifications for the Millau Viaduct",
    "asOf": 2004
  },
  {
    "id": "records-deepest-railway-station",
    "prompt": "How many metres below ground is Kyiv’s Arsenalna metro station?",
    "unit": "metres",
    "answerValue": 105.5,
    "decompositionHint": "Deep enough to double as a shelter, and dug under a river bluff. A normal underground station sits about 20 metres down.",
    "strategy": "anchor-scale",
    "source": "Kyiv Metro published station specifications for Arsenalna",
    "asOf": 2025
  },
  {
    "id": "records-largest-cruise-passenger-count",
    "prompt": "How many people can the largest cruise ship carry including crew?",
    "unit": "people",
    "answerValue": 9950,
    "decompositionHint": "Passengers at maximum occupancy plus around 2,350 crew. Compare it with the population of a small town rather than a hotel.",
    "strategy": "decompose",
    "source": "Royal Caribbean published specifications for Icon of the Seas",
    "asOf": 2024
  },
  {
    "id": "records-longest-flight-by-a-model-aircraft",
    "prompt": "How many kilometres did the first model aircraft to cross the Atlantic fly?",
    "unit": "kilometres",
    "answerValue": 3030,
    "decompositionHint": "A five-kilogram petrol-powered model navigating by GPS, so the limit is fuel fraction rather than anything about the crossing itself.",
    "strategy": "rate-time",
    "source": "Federation Aeronautique Internationale ratified model aircraft record",
    "asOf": 2003
  },
  {
    "id": "records-largest-aircraft-wingspan",
    "prompt": "How many metres is the wingspan of the aircraft with the widest wings?",
    "unit": "metres",
    "answerValue": 117,
    "decompositionHint": "A twin-fuselage carrier built to drop rockets at altitude. A jumbo jet spans 68 metres, so this is not quite double that.",
    "strategy": "anchor-scale",
    "source": "Published manufacturer specifications for Stratolaunch Roc",
    "asOf": 2019
  },
  {
    "id": "records-most-flight-hours",
    "prompt": "How many hours has the pilot with the most logged flight time flown?",
    "unit": "hours",
    "answerValue": 64396,
    "decompositionHint": "More than seven years spent airborne, accumulated over 66 years of flying. Work out the hours a working pilot can log per year and multiply.",
    "strategy": "rate-time",
    "source": "Certified logbook records for Ed Long, 1933-1999",
    "asOf": 1999
  },
  {
    "id": "records-largest-helicopter-lift",
    "prompt": "How many kilograms could the largest helicopter ever built lift?",
    "unit": "kilograms",
    "answerValue": 40000,
    "decompositionHint": "Rotor lift scales with disc area, so doubling the payload needs a much larger rotor. A heavy transport helicopter manages about 12 tonnes.",
    "strategy": "area-density",
    "source": "Published specifications for the Mil V-12 rotorcraft",
    "asOf": 1969
  },
  {
    "id": "records-fastest-passenger-aircraft",
    "prompt": "How many kilometres per hour was the cruising speed of the fastest passenger aircraft?",
    "unit": "kilometres per hour",
    "answerValue": 2179,
    "decompositionHint": "Just over twice the speed of sound at altitude, which is about 1,060 km/h. Ordinary airliners cruise at around 900.",
    "strategy": "anchor-scale",
    "source": "Published operating specifications for Concorde",
    "asOf": 2003
  },
  {
    "id": "records-longest-serving-aircraft",
    "prompt": "How many years has the longest-serving military aircraft type been in operation?",
    "unit": "years",
    "answerValue": 71,
    "decompositionHint": "A strategic bomber first flown in the 1950s and planned to keep flying into the 2050s, which would make a century of service.",
    "strategy": "anchor-scale",
    "source": "United States Air Force published fleet records for the B-52",
    "asOf": 2026
  },
  {
    "id": "records-most-cited-scientific-paper",
    "prompt": "How many times has the most cited scientific paper been cited?",
    "unit": "citations",
    "answerValue": 350000,
    "decompositionHint": "A laboratory method for measuring protein, cited by anyone who used it. Method papers dominate this list rather than famous discoveries.",
    "strategy": "anchor-scale",
    "source": "Web of Science citation counts for Lowry et al. 1951",
    "asOf": 2025
  },
  {
    "id": "records-longest-scientific-experiment-plants",
    "prompt": "How many years has the longest-running seed germination experiment been going?",
    "unit": "years",
    "answerValue": 146,
    "decompositionHint": "Bottles of seed buried in 1879 and dug up on a schedule that has been stretched as the seeds kept germinating.",
    "strategy": "rate-time",
    "source": "Michigan State University records for the Beal seed viability experiment",
    "asOf": 2025
  },
  {
    "id": "records-largest-prime-gap",
    "prompt": "How large is the biggest known gap between consecutive known primes?",
    "unit": "integers",
    "answerValue": 16045848,
    "decompositionHint": "Gaps grow roughly with the logarithm of the numbers involved, so a gap this size sits among numbers with hundreds of thousands of digits.",
    "strategy": "exponential",
    "source": "Published prime gap records, Andreas Hoglund verification",
    "asOf": 2024
  },
  {
    "id": "records-most-digits-memorised",
    "prompt": "How many digits of pi has the record holder recited from memory?",
    "unit": "digits",
    "answerValue": 70030,
    "decompositionHint": "Recited over ten hours without error. Work from a plausible digits-per-minute rate and the hours the attempt lasted.",
    "strategy": "rate-time",
    "source": "Published verification records for Rajveer Meena, VIT University",
    "asOf": 2015
  },
  {
    "id": "records-largest-known-twin-primes",
    "prompt": "How many digits do the largest known twin primes have?",
    "unit": "digits",
    "answerValue": 388342,
    "decompositionHint": "Far smaller than the largest known prime, because twins have to be found by searching rather than by a fast test for one special form.",
    "strategy": "anchor-scale",
    "source": "PrimeGrid verified discovery records",
    "asOf": 2016
  },
  {
    "id": "records-longest-word-in-a-dictionary",
    "prompt": "How many letters are in the longest word in a major English dictionary?",
    "unit": "letters",
    "answerValue": 45,
    "decompositionHint": "A medical coinage built from Greek and Latin roots for a lung disease caused by inhaling fine dust.",
    "strategy": "recall-sanity",
    "source": "Oxford English Dictionary entry for pneumonoultramicroscopicsilicovolcanoconiosis",
    "asOf": 2025
  },
  {
    "id": "records-most-languages-spoken-by-one-person",
    "prompt": "How many languages could the most prolific recorded polyglot speak?",
    "unit": "languages",
    "answerValue": 59,
    "decompositionHint": "A nineteenth-century cardinal and librarian, tested by visitors who arrived speaking their own tongues. Claims above this are unverified.",
    "strategy": "anchor-scale",
    "source": "Published contemporary accounts and scholarship on Giuseppe Mezzofanti",
    "asOf": 1849
  },
  {
    "id": "records-largest-vocabulary-animal",
    "prompt": "How many words could the animal with the largest proven vocabulary understand?",
    "unit": "words",
    "answerValue": 1022,
    "decompositionHint": "A border collie taught object names over three years and tested blind. Work from a learning rate per week and the years of training.",
    "strategy": "rate-time",
    "source": "Published study of the dog Chaser, Wofford College",
    "asOf": 2011
  },
  {
    "id": "records-largest-recorded-swarm-of-bees",
    "prompt": "How many bees are in a very large honeybee swarm?",
    "unit": "bees",
    "answerValue": 60000,
    "decompositionHint": "A swarm is roughly half a colony leaving with the old queen. Start from how many bees a full hive holds.",
    "strategy": "divide-total",
    "source": "Published apiological studies, Cornell University",
    "asOf": 2025
  },
  {
    "id": "records-deepest-scuba-cave-dive",
    "prompt": "How many metres deep is the deepest cave dive on record?",
    "unit": "metres",
    "answerValue": 283,
    "decompositionHint": "Deeper than open-water scuba records are usually set, because a cave gives no straight route to the surface if anything goes wrong.",
    "strategy": "anchor-scale",
    "source": "Published dive logs and verification for the Boesmansgat cave, South Africa",
    "asOf": 1996
  },
  {
    "id": "records-longest-underwater-habitat-stay",
    "prompt": "How many days did the longest continuous stay in an underwater habitat last?",
    "unit": "days",
    "answerValue": 100,
    "decompositionHint": "At a depth shallow enough to avoid decompression on exit, so the limit is supplies and psychology rather than pressure.",
    "strategy": "anchor-scale",
    "source": "Published mission records for Jules Undersea Lodge, Florida",
    "asOf": 2023
  },
  {
    "id": "records-largest-recorded-tide-range",
    "prompt": "How many metres is the greatest tidal range measured anywhere on Earth?",
    "unit": "metres",
    "answerValue": 16.3,
    "decompositionHint": "A funnel-shaped bay whose natural sloshing period happens to match the tide, so each cycle reinforces the last.",
    "strategy": "anchor-scale",
    "source": "Canadian Hydrographic Service measurements for the Bay of Fundy",
    "asOf": 2025
  },
  {
    "id": "records-strongest-recorded-tornado-outbreak",
    "prompt": "How many tornadoes touched down in the largest single outbreak?",
    "unit": "tornadoes",
    "answerValue": 360,
    "decompositionHint": "Over three days along one frontal system. A busy tornado day produces a few dozen, so this is roughly ten times a normal peak.",
    "strategy": "anchor-scale",
    "source": "NOAA Storm Prediction Center records for the 2011 Super Outbreak",
    "asOf": 2011
  },
  {
    "id": "records-most-powerful-recorded-solar-flare",
    "prompt": "How many watts per square metre of X-rays did the most powerful recorded solar flare deliver at Earth?",
    "unit": "watts per square metre",
    "answerValue": 0.0045,
    "decompositionHint": "Flare classes go up by factors of ten and this one saturated the sensors. An ordinary large flare delivers about a thousandth of this.",
    "strategy": "exponential",
    "source": "NOAA Space Weather Prediction Center GOES measurements, November 2003",
    "asOf": 2003
  },
  {
    "id": "records-largest-recorded-sunspot",
    "prompt": "How many millionths of the Sun's visible hemisphere did the largest recorded sunspot group cover?",
    "unit": "millionths of a hemisphere",
    "answerValue": 6132,
    "decompositionHint": "Expressed in millionths because sunspots are measured as a fraction of the disc. That fraction is still under one percent.",
    "strategy": "divide-total",
    "source": "Royal Greenwich Observatory sunspot area records, April 1947",
    "asOf": 1947
  },
  {
    "id": "records-longest-total-eclipse-possible",
    "prompt": "How many seconds is the longest a total solar eclipse can theoretically last?",
    "unit": "seconds",
    "answerValue": 452,
    "decompositionHint": "Set by the Moon at its closest and the Earth at its farthest from the Sun, with the shadow crossing the equator at local noon.",
    "strategy": "anchor-scale",
    "source": "NASA eclipse computations, Goddard Space Flight Center",
    "asOf": 2025
  },
  {
    "id": "records-largest-recorded-aurora-extent",
    "prompt": "How far from the pole in degrees of latitude has an aurora been seen?",
    "unit": "degrees of latitude",
    "answerValue": 23,
    "decompositionHint": "During the largest geomagnetic storm on record, aurorae were reported from the tropics. Give the latitude rather than the distance.",
    "strategy": "anchor-scale",
    "source": "Published historical accounts of the 1859 Carrington event, NOAA",
    "asOf": 1859
  },
  {
    "id": "records-fastest-mountain-uplift",
    "prompt": "How many millimetres a year is the fastest measured mountain uplift?",
    "unit": "millimetres per year",
    "answerValue": 10,
    "decompositionHint": "Measured by GPS across a collision zone. At this rate a range gains a kilometre of height every hundred thousand years, before erosion.",
    "strategy": "rate-time",
    "source": "Published GPS geodesy of the Southern Alps, GNS Science New Zealand",
    "asOf": 2025
  },
  {
    "id": "records-largest-recorded-sediment-flow",
    "prompt": "How many kilometres did the longest recorded underwater sediment flow travel?",
    "unit": "kilometres",
    "answerValue": 1100,
    "decompositionHint": "A turbidity current running down a submarine canyon and out across the abyssal plain, tracked by the seafloor cables it broke.",
    "strategy": "anchor-scale",
    "source": "Published study of the Congo Canyon turbidity current, University of Durham",
    "asOf": 2020
  },
  {
    "id": "records-largest-recorded-fish-catch",
    "prompt": "How many tonnes of fish were landed in the largest annual catch of a single species?",
    "unit": "tonnes",
    "answerValue": 13000000,
    "decompositionHint": "Peruvian anchoveta before the fishery collapsed. Compare it with total world fish landings of about 90 million tonnes a year.",
    "strategy": "divide-total",
    "source": "Food and Agriculture Organization fishery statistics",
    "asOf": 1970
  },
  {
    "id": "records-largest-recorded-crop-yield",
    "prompt": "How many tonnes of wheat per hectare is the record yield?",
    "unit": "tonnes per hectare",
    "answerValue": 17.96,
    "decompositionHint": "A cool maritime climate with a long grain-filling season. World average yield is about 3.5 tonnes per hectare.",
    "strategy": "anchor-scale",
    "source": "Published verification by the New Zealand Arable Food Industry Council",
    "asOf": 2022
  },
  {
    "id": "records-oldest-seed-bank-holding",
    "prompt": "How many seed samples does the largest seed vault hold?",
    "unit": "seed samples",
    "answerValue": 1300000,
    "decompositionHint": "Duplicates of collections held elsewhere, stored in permafrost as insurance. Each sample is typically 500 seeds in a foil packet.",
    "strategy": "anchor-scale",
    "source": "Norwegian Ministry of Agriculture records for the Svalbard Global Seed Vault",
    "asOf": 2025
  },
  {
    "id": "records-largest-herbarium",
    "prompt": "How many preserved plant specimens does the largest herbarium hold?",
    "unit": "specimens",
    "answerValue": 8000000,
    "decompositionHint": "Pressed sheets accumulated over four centuries of collecting. Work from a plausible annual accession rate times the years.",
    "strategy": "rate-time",
    "source": "Museum national d'Histoire naturelle published collection statistics, Paris",
    "asOf": 2025
  },
  {
    "id": "records-largest-natural-history-collection",
    "prompt": "How many specimens does the largest natural history collection hold?",
    "unit": "specimens",
    "answerValue": 145000000,
    "decompositionHint": "Most of it is insects and microscopic marine life rather than skeletons, which is why the count is so much larger than the displays suggest.",
    "strategy": "anchor-scale",
    "source": "Smithsonian National Museum of Natural History published collection statistics",
    "asOf": 2025
  },
  {
    "id": "records-most-species-named-by-one-person",
    "prompt": "How many species did the most prolific taxonomist formally describe?",
    "unit": "species",
    "answerValue": 2500,
    "decompositionHint": "The founder of modern naming conventions, working through a career of about fifty years. Divide to check the rate sounds achievable.",
    "strategy": "rate-time",
    "source": "International Plant Names Index attribution records for Carl Linnaeus",
    "asOf": 1778
  },
  {
    "id": "records-largest-genome-sequenced",
    "prompt": "How many base pairs are in the largest animal genome ever sequenced?",
    "unit": "base pairs",
    "answerValue": 43000000000,
    "decompositionHint": "A lungfish, whose genome is bloated with repeated sequence rather than extra genes. The human genome is three billion base pairs.",
    "strategy": "anchor-scale",
    "source": "Published lungfish genome assembly, Nature",
    "asOf": 2021
  },
  {
    "id": "records-most-eggs-laid-per-day",
    "prompt": "How many eggs does the most fecund insect queen lay in a day?",
    "unit": "eggs per day",
    "answerValue": 40000,
    "decompositionHint": "An African termite queen laying continuously around the clock. Divide by the minutes in a day to check the rate is physically possible.",
    "strategy": "rate-time",
    "source": "Published studies of Macrotermes queens, Smithsonian Tropical Research Institute",
    "asOf": 2025
  },
  {
    "id": "records-loudest-recorded-volcanic-eruption-pressure",
    "prompt": "How many pascals of pressure change did the loudest recorded eruption produce at a hundred miles?",
    "unit": "pascals",
    "answerValue": 2100,
    "decompositionHint": "Enough to move a mercury barometer visibly. Normal atmospheric pressure is 101,325 pascals, so this is a few percent of it.",
    "strategy": "anchor-scale",
    "source": "Royal Society barometric records of the 1883 Krakatoa eruption",
    "asOf": 1883
  },
  {
    "id": "records-largest-recorded-power-outage",
    "prompt": "How many people lost power in the largest blackout ever recorded?",
    "unit": "people",
    "answerValue": 620000000,
    "decompositionHint": "Two linked grid failures on consecutive days across northern India. That is a large fraction of one country's population.",
    "strategy": "divide-total",
    "source": "Indian Ministry of Power inquiry report, July 2012",
    "asOf": 2012
  },
  {
    "id": "records-largest-evacuation",
    "prompt": "How many people were moved in the largest civilian evacuation by sea?",
    "unit": "people",
    "answerValue": 500000,
    "decompositionHint": "Boats of every size ferrying people off Manhattan on one day. Compare it with the Dunkirk evacuation, which moved about 338,000 over nine days.",
    "strategy": "anchor-scale",
    "source": "United States Coast Guard records of the 11 September 2001 boatlift",
    "asOf": 2001
  },
  {
    "id": "records-longest-continuous-radio-broadcast",
    "prompt": "How many years has the longest continuously running radio programme been on air?",
    "unit": "years",
    "answerValue": 75,
    "decompositionHint": "A rural drama broadcast almost daily since 1951, which places its start in the early post-war years.",
    "strategy": "anchor-scale",
    "source": "BBC published programme records for The Archers",
    "asOf": 2026
  },
  {
    "id": "records-largest-museum-visitor-count",
    "prompt": "How many people visited the most-visited museum in a single year?",
    "unit": "visitors",
    "answerValue": 10200000,
    "decompositionHint": "Divide by the days it opens and check the daily figure against how many people can physically pass one entrance hall.",
    "strategy": "divide-total",
    "source": "Musee du Louvre published attendance figures",
    "asOf": 2018
  }
]

if (typeof module !== "undefined") module.exports = RECORDS
