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
    "answerValue": 10935,
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
    "answerValue": 768,
    "decompositionHint": "It travelled horizontally through the top of a storm system, so the limit is the width of the storm rather than the height of a cloud.",
    "strategy": "anchor-scale",
    "source": "World Meteorological Organization weather and climate extremes archive",
    "asOf": 2020
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
    "answerValue": 269,
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
  }
]

if (typeof module !== "undefined") module.exports = RECORDS
