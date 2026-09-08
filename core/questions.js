var QUESTIONS = [
  {
    "id": "piano-tuners-chicago",
    "prompt": "How many professional piano tuners work in the Chicago metro area?",
    "unit": "piano tuners",
    "answerValue": 100,
    "decompositionHint": "Metro population (~9.5M) \u2192 households with a piano (~1 in 20) \u2192 pianos tuned about once a year \u2192 a full-time tuner can do ~4 tunings/day, ~250 working days/year (~1000/year). Divide pianos-needing-tuning by tunings-per-tuner-per-year.",
    "source": "Classic Fermi problem (originally posed by Enrico Fermi); widely accepted estimate range 50-200"
  },
  {
    "id": "golf-balls-school-bus",
    "prompt": "How many standard golf balls would fit inside an empty school bus?",
    "unit": "golf balls",
    "answerValue": 500000,
    "decompositionHint": "Estimate the bus's interior volume (~cuboid, roughly 8m x 2.5m x 2m \u2248 40 m\u00b3), a golf ball's volume (~40 mL, diameter ~4.3cm), account for ~74% packing efficiency for spheres, then divide.",
    "source": "Classic interview-style Fermi problem; order-of-magnitude estimate"
  },
  {
    "id": "hairs-on-human-head",
    "prompt": "How many hairs are on an average adult human head?",
    "unit": "hairs",
    "answerValue": 100000,
    "decompositionHint": "Estimate scalp area (~600 cm\u00b2) and hair density (~150-200 hairs per cm\u00b2), then multiply.",
    "source": "Dermatology references; typical range 80,000-120,000"
  },
  {
    "id": "cells-in-human-body",
    "prompt": "Roughly how many cells are in the adult human body?",
    "unit": "cells",
    "answerValue": 37000000000000,
    "decompositionHint": "Estimate body mass (~70kg), average cell mass, and that most of the count comes from small, numerous cells like red blood cells and other blood/tissue cells.",
    "source": "Bianconi et al. 2013, Annals of Human Biology - widely cited estimate ~3.72\u00d710^13"
  },
  {
    "id": "grains-of-sand-beach",
    "prompt": "How many grains of sand are on a typical 1km-long, 30m-wide beach (down to 1m depth)?",
    "unit": "grains of sand",
    "answerValue": 2500000000000000,
    "decompositionHint": "Compute beach volume (length x width x depth), estimate a sand grain's volume (~0.5mm cube), then divide, accounting for packing.",
    "source": "Order-of-magnitude estimate using typical sand grain size ~0.5mm"
  },
  {
    "id": "stars-in-milky-way",
    "prompt": "Approximately how many stars are in the Milky Way galaxy?",
    "unit": "stars",
    "answerValue": 200000000000,
    "decompositionHint": "Use the galaxy's estimated total mass and the average stellar mass to back out a star count, or recall published astronomical estimates.",
    "source": "NASA/ESA estimates typically cite 100-400 billion stars"
  },
  {
    "id": "trees-on-earth",
    "prompt": "Approximately how many trees are there on Earth?",
    "unit": "trees",
    "answerValue": 3000000000000,
    "decompositionHint": "Estimate global forest area and average tree density per hectare, then multiply.",
    "source": "Crowther et al. 2015, Nature - estimated ~3.04 trillion trees"
  },
  {
    "id": "water-drops-in-swimming-pool",
    "prompt": "How many drops of water would it take to fill an Olympic swimming pool (2,500 m\u00b3)?",
    "unit": "drops",
    "answerValue": 50000000000,
    "decompositionHint": "A typical water drop is about 0.05 mL. Convert the pool's volume to milliliters and divide by drop volume.",
    "source": "Olympic pool standard volume 2,500,000 L; typical drop ~0.05mL"
  },
  {
    "id": "words-spoken-lifetime",
    "prompt": "How many words does an average person speak in their lifetime?",
    "unit": "words",
    "answerValue": 860000000,
    "decompositionHint": "Estimate average words spoken per day (~16,000), multiply by days in an ~80 year lifespan, adjusting for years before speech develops.",
    "source": "Mehl et al. 2007, Science - average ~16,000 words/day"
  },
  {
    "id": "heartbeats-lifetime",
    "prompt": "How many times does an average human heart beat over a full lifetime (~80 years)?",
    "unit": "heartbeats",
    "answerValue": 3000000000,
    "decompositionHint": "Average resting heart rate ~70-75 bpm. Multiply beats/minute by minutes/year by 80 years.",
    "source": "Standard physiology figures; commonly cited ~2.5-3 billion beats"
  },
  {
    "id": "bricks-empire-state",
    "prompt": "Roughly how many bricks would it take to build a structure the size of the Empire State Building (if built entirely of brick)?",
    "unit": "bricks",
    "answerValue": 10000000,
    "decompositionHint": "Estimate the building's total exterior wall surface area and typical wall thickness, a standard brick's volume, and divide.",
    "source": "Order-of-magnitude estimate based on building volume ~37 million cubic feet"
  },
  {
    "id": "cars-in-us",
    "prompt": "How many registered passenger cars are there in the United States?",
    "asOf": 2025,
    "unit": "cars",
    "answerValue": 280000000,
    "decompositionHint": "US population (~335M) x average vehicles per person (~0.8), or recall it's roughly 1 vehicle for every 1.2 people.",
    "source": "US Dept. of Transportation / Bureau of Transportation Statistics, ~280 million registered vehicles"
  },
  {
    "id": "smartphones-in-world",
    "prompt": "How many smartphones are actively in use worldwide?",
    "asOf": 2025,
    "unit": "smartphones",
    "answerValue": 6900000000,
    "decompositionHint": "World population (~8B) x smartphone penetration rate (~85% of adults in many regions, lower in others, roughly ~86% overall).",
    "source": "GSMA / Statista estimates, ~6.9 billion smartphone users worldwide (2024-2025)"
  },
  {
    "id": "gallons-water-us-daily",
    "prompt": "How many gallons of water does the average US household use per day?",
    "asOf": 2025,
    "unit": "gallons/day",
    "answerValue": 300,
    "decompositionHint": "Estimate per-person daily use (~80-100 gallons: showers, toilets, laundry, dishes) times average household size (~2.5 people).",
    "source": "US EPA WaterSense program estimates"
  },
  {
    "id": "pizza-slices-consumed-us-daily",
    "prompt": "How many slices of pizza are eaten in the United States per day?",
    "asOf": 2025,
    "unit": "pizza slices",
    "answerValue": 100000000,
    "decompositionHint": "US population (~335M), estimate fraction eating pizza on a given day (~13% per commonly cited industry figures) x average slices per person (~2-3).",
    "source": "Often-cited pizza industry statistic: ~100 million slices/day"
  },
  {
    "id": "leaves-on-oak-tree",
    "prompt": "How many leaves are on a mature oak tree?",
    "unit": "leaves",
    "answerValue": 200000,
    "decompositionHint": "Estimate canopy volume or number of branches x leaves per branch, or use published estimates for a mature tree's leaf count.",
    "source": "Botanical estimates for mature oaks, typically 100,000-250,000 leaves"
  },
  {
    "id": "atoms-in-grain-of-salt",
    "prompt": "Approximately how many atoms are in a single grain of table salt (NaCl)?",
    "unit": "atoms",
    "answerValue": 1200000000000000000,
    "decompositionHint": "Estimate the grain's volume (~0.3mm cube), use NaCl's density (~2.16 g/cm\u00b3) to get mass, convert to moles via molar mass (58.44 g/mol), multiply by Avogadro's number, then by 2 (for Na and Cl atoms).",
    "source": "Standard chemistry calculation using Avogadro's number 6.022\u00d710^23"
  },
  {
    "id": "breaths-per-lifetime",
    "prompt": "How many breaths does a person take over an 80-year lifetime?",
    "unit": "breaths",
    "answerValue": 670000000,
    "decompositionHint": "Average resting breathing rate ~12-16 breaths/minute. Multiply by minutes/year and years lived.",
    "source": "Standard respiratory physiology figures"
  },
  {
    "id": "libraries-of-congress-internet",
    "prompt": "How many 'Libraries of Congress' worth of data (~20 petabytes of text/print) is generated globally by internet traffic in one day?",
    "asOf": 2025,
    "unit": "Libraries of Congress",
    "answerValue": 15000,
    "decompositionHint": "Global daily internet traffic is roughly 300+ exabytes (2024 estimates). Convert to petabytes and divide by ~20 PB.",
    "source": "Cisco/various internet traffic reports; Library of Congress print collection estimated at ~20TB-20PB depending on what's counted (text only vs. all formats)"
  },
  {
    "id": "bacteria-per-human-body",
    "prompt": "How many bacterial cells live in and on an average human body?",
    "unit": "bacterial cells",
    "answerValue": 38000000000000,
    "decompositionHint": "Recent research revised the old '10x more bacteria than human cells' claim - the actual ratio is close to 1:1. Use human cell count (~3.7\u00d710^13) as an anchor.",
    "source": "Sender, Fuchs, Milo 2016, PLOS Biology - revised bacteria:human cell ratio ~1.3:1"
  },
  {
    "id": "steps-across-us",
    "prompt": "How many walking steps would it take to cross the continental US (~4,500 km) coast to coast?",
    "unit": "steps",
    "answerValue": 6000000,
    "decompositionHint": "Average adult stride length is about 0.75m. Convert the distance to meters and divide by stride length.",
    "source": "Standard stride length figures (~0.7-0.8m)"
  },
  {
    "id": "planes-in-air-worldwide",
    "prompt": "At any given moment, how many commercial passenger planes are in the air worldwide?",
    "asOf": 2025,
    "unit": "planes",
    "answerValue": 9000,
    "decompositionHint": "Global commercial fleet is ~25,000-30,000 aircraft; at peak times a large fraction are airborne simultaneously across time zones.",
    "source": "FlightAware/Flightradar24 peak concurrent flight estimates, ~9,000-20,000 depending on time of day"
  },
  {
    "id": "gold-total-mined",
    "prompt": "How much gold has ever been mined in human history, in metric tons?",
    "asOf": 2025,
    "unit": "metric tons",
    "answerValue": 212000,
    "decompositionHint": "This is largely a recall-based estimate, but you can sanity check: if all mined gold were melted into a cube, it would only be about 22m on a side - gold is surprisingly rare relative to its cultural prominence.",
    "source": "World Gold Council estimates, ~212,000 tonnes as of recent surveys"
  },
  {
    "id": "words-in-average-novel",
    "prompt": "How many words are in an average full-length novel?",
    "unit": "words",
    "answerValue": 90000,
    "decompositionHint": "Estimate pages (~300) x words per page (~300 for typical prose formatting).",
    "source": "Standard publishing industry figures, typical novel 70,000-100,000 words"
  },
  {
    "id": "blood-vessels-length",
    "prompt": "If you laid out all the blood vessels in an adult human body end to end, how many kilometers long would they be?",
    "unit": "kilometers",
    "answerValue": 100000,
    "decompositionHint": "Most of the length comes from capillaries, which are extremely numerous and thin despite each being very short - the count of capillaries dominates over their individual length.",
    "source": "Commonly cited physiology estimate, ~60,000-100,000 km total"
  },
  {
    "id": "chickens-on-earth",
    "prompt": "How many live chickens are there on Earth at any given time?",
    "asOf": 2025,
    "unit": "chickens",
    "answerValue": 26000000000,
    "decompositionHint": "World population (~8B) x average annual chicken meat + egg consumption per person, combined with typical chicken lifespan before slaughter (~6 weeks for broilers), gives a standing population estimate.",
    "source": "UN FAO livestock statistics, ~26 billion chickens (roughly 3x the human population)"
  },
  {
    "id": "gasoline-us-daily",
    "prompt": "How many gallons of gasoline does the US consume per day?",
    "asOf": 2025,
    "unit": "gallons/day",
    "answerValue": 370000000,
    "decompositionHint": "US has ~280M registered vehicles, average ~25-30 miles driven/day per active vehicle isn't quite right - better: total annual gasoline consumption (~135 billion gallons/year) divided by 365.",
    "source": "US Energy Information Administration (EIA) data"
  },
  {
    "id": "distance-blood-cell-travels-per-day",
    "prompt": "How many kilometers does a single red blood cell travel through the circulatory system in one day?",
    "unit": "kilometers",
    "answerValue": 19,
    "decompositionHint": "The heart completes a full circulation roughly once per minute at rest. Estimate the average circuit length (~1000-1300 cm through the full vascular loop) and multiply by circuits per day.",
    "source": "Physiology estimate based on ~1 full circulation per minute"
  },
  {
    "id": "e-coli-bacteria-mass-doubling",
    "prompt": "If a single E. coli bacterium divided unchecked every 20 minutes, how many hours would it take for its descendants' total mass to exceed the mass of Earth?",
    "unit": "hours",
    "answerValue": 66,
    "decompositionHint": "Each doubling multiplies mass by 2. Figure out how many doublings are needed to go from one bacterium's mass (~1 picogram) to Earth's mass (~6\u00d710^24 kg), then multiply doublings by 20 minutes.",
    "source": "Classic exponential-growth Fermi/math problem"
  },
  {
    "id": "post-it-notes-stacked-to-moon",
    "prompt": "How many standard Post-it notes (0.1mm thick) would you need to stack to reach the Moon (384,400 km away)?",
    "unit": "Post-it notes",
    "answerValue": 3800000000000,
    "decompositionHint": "Convert the Earth-Moon distance to millimeters and divide by a single note's thickness.",
    "source": "Simple unit-conversion Fermi problem"
  },
  {
    "id": "credit-cards-us-total",
    "prompt": "How many active credit card accounts are there in the United States?",
    "asOf": 2025,
    "unit": "credit card accounts",
    "answerValue": 680000000,
    "decompositionHint": "US adult population (~260M) x average number of credit cards per adult (~2.5-4, since many people hold multiple cards).",
    "source": "Federal Reserve / credit bureau (Experian) reports"
  },
  {
    "id": "keystrokes-programmer-lifetime",
    "prompt": "How many keystrokes might a professional software developer type over a 30-year career?",
    "unit": "keystrokes",
    "answerValue": 300000000,
    "decompositionHint": "Estimate typing hours/day at work (~4 active hours), typing speed in keystrokes/minute (~150 including code/comments/chat), workdays/year (~230), and years (30).",
    "source": "Order-of-magnitude estimate from typical office typing patterns"
  },
  {
    "id": "raindrops-in-thunderstorm",
    "prompt": "How many individual raindrops fall during a typical thunderstorm covering 100 km\u00b2 and dropping 25mm of rain?",
    "unit": "raindrops",
    "answerValue": 80000000000000,
    "decompositionHint": "Total rain volume = area x depth. A typical raindrop is about 4mm in diameter (~34 microliters). Divide total volume by single-drop volume.",
    "source": "Standard meteorology figures for raindrop size (2-5mm typical)"
  },
  {
    "id": "solar-energy-hitting-earth-per-hour",
    "prompt": "How does the solar energy hitting Earth in one hour compare to total global human energy consumption in one year? (express as a ratio, hours-of-sunlight-equivalent : 1 year)",
    "unit": "ratio (roughly X:1)",
    "answerValue": 1,
    "decompositionHint": "This is the famous 'more energy from the sun in an hour than humanity uses in a year' claim - the two quantities are roughly equal in order of magnitude (~5\u00d710^20 J vs ~6\u00d710^20 J), so the ratio is close to 1:1.",
    "source": "US Dept. of Energy solar energy figures; widely cited comparison, roughly accurate to within a factor of ~1"
  },
  {
    "id": "sheets-toilet-paper-lifetime",
    "prompt": "How many sheets of toilet paper does an average American use in a lifetime (~80 years)?",
    "unit": "sheets",
    "answerValue": 384000,
    "decompositionHint": "Average American uses roughly 3-4 rolls per week (~200 sheets/roll). Multiply weekly sheet use by weeks in 80 years.",
    "source": "Industry consumption estimates (~100+ rolls/person/year in the US)"
  },
  {
    "id": "ants-on-earth",
    "prompt": "Approximately how many individual ants are alive on Earth at any given time?",
    "unit": "ants",
    "answerValue": 20000000000000000,
    "decompositionHint": "This requires recalling a published biomass-based estimate - ant biomass roughly matches or exceeds human biomass despite ants being tiny, implying an enormous count.",
    "source": "Schultheiss et al. 2022, PNAS - estimated ~20 quadrillion (2\u00d710^16) ants globally"
  },
  {
    "id": "revolutions-earth-around-sun-human-history",
    "prompt": "How many times has Earth orbited the Sun since the first Homo sapiens appeared (~300,000 years ago)?",
    "unit": "orbits",
    "answerValue": 300000,
    "decompositionHint": "One orbit equals one year, so this reduces directly to the number of years elapsed - a reminder that not every Fermi problem needs heavy decomposition.",
    "source": "Paleoanthropological dating of earliest Homo sapiens fossils (~300,000 years, Jebel Irhoud find)"
  },
  {
    "id": "emails-sent-per-day-worldwide",
    "prompt": "How many emails are sent worldwide per day?",
    "asOf": 2025,
    "unit": "emails",
    "answerValue": 360000000000,
    "decompositionHint": "Estimate number of email accounts (~4-5B users, several accounts each) x average emails sent per account per day (~15-30, weighted heavily by automated/business email).",
    "source": "Radicati Group email statistics reports"
  },
  {
    "id": "distance-dna-in-body-stretched",
    "prompt": "If you unwound all the DNA in a single human body and laid the strands end to end, how many times could that length span the distance from Earth to the Sun (~150 million km) round trip?",
    "unit": "round trips",
    "answerValue": 400,
    "decompositionHint": "Each cell's DNA is about 2m long, and the body has ~3.7\u00d710^13 cells. Multiply to get total DNA length, then divide by twice the Earth-Sun distance.",
    "source": "Combines cell count (Bianconi et al. 2013) with commonly cited ~2m of DNA per cell"
  },
  {
    "id": "seconds-in-a-century",
    "prompt": "How many seconds are there in a century?",
    "unit": "seconds",
    "answerValue": 3160000000,
    "decompositionHint": "60 seconds x 60 minutes x 24 hours x 365.25 days x 100 years. Worth internalising: a century is only about 3 billion seconds, so a human lifetime is on the order of 2-3 billion.",
    "source": "Direct unit conversion"
  },
  {
    "id": "atoms-in-human-body",
    "prompt": "Approximately how many atoms make up an adult human body?",
    "unit": "atoms",
    "answerValue": 7e+27,
    "decompositionHint": "Body mass ~70 kg, mostly water. A water molecule is 18 g/mol and contains 3 atoms, so work out moles of water, multiply by Avogadro's number and by atoms per molecule.",
    "source": "Standard physics estimate, ~7x10^27 atoms"
  },
  {
    "id": "water-molecules-in-a-glass",
    "prompt": "How many water molecules are in a single 250 mL glass of water?",
    "unit": "molecules",
    "answerValue": 8.4e+24,
    "decompositionHint": "250 mL of water weighs 250 g. Divide by the molar mass of water (18 g/mol) to get moles, then multiply by Avogadro's number.",
    "source": "Standard chemistry calculation using Avogadro's number"
  },
  {
    "id": "air-molecules-in-a-breath",
    "prompt": "How many air molecules are in a single normal breath (~0.5 litres)?",
    "unit": "molecules",
    "answerValue": 1.3e+22,
    "decompositionHint": "One mole of gas occupies about 22.4 litres at standard conditions. Divide 0.5 L by 22.4 L/mol to get moles, then multiply by Avogadro's number.",
    "source": "Ideal gas molar volume and Avogadro's number"
  },
  {
    "id": "molecules-of-caesars-last-breath",
    "prompt": "Roughly how many molecules from Julius Caesar's dying breath are in the breath you just took?",
    "unit": "molecules",
    "answerValue": 1,
    "decompositionHint": "Compare molecules in one breath (~10^22) against molecules in the whole atmosphere (~10^44). The ratio of one breath to the atmosphere, squared by the two-step mixing, lands on roughly one molecule - the classic surprise is that the answer is about 1, not 0.",
    "source": "Classic Fermi problem; standard result is on the order of a single molecule"
  },
  {
    "id": "seconds-since-big-bang",
    "prompt": "How many seconds have elapsed since the Big Bang (~13.8 billion years ago)?",
    "unit": "seconds",
    "answerValue": 440000000000000000,
    "decompositionHint": "There are about 3.15x10^7 seconds in a year. Multiply by 1.38x10^10 years.",
    "source": "Planck mission age of the universe (~13.8 billion years) x seconds per year"
  },
  {
    "id": "galaxies-in-observable-universe",
    "prompt": "How many galaxies are estimated to exist in the observable universe?",
    "unit": "galaxies",
    "answerValue": 2000000000000,
    "decompositionHint": "Deep-field images count galaxies in a tiny patch of sky, then scale that density up to the whole celestial sphere.",
    "source": "Hubble/JWST deep field extrapolations; estimates range from ~2x10^11 to ~2x10^12"
  },
  {
    "id": "distance-to-nearest-star",
    "prompt": "How many kilometres away is the nearest star to the Sun (Proxima Centauri)?",
    "unit": "kilometres",
    "answerValue": 40000000000000,
    "decompositionHint": "Proxima Centauri is about 4.2 light years away. A light year is roughly 9.5x10^12 km - light travels 300,000 km/s times ~3.15x10^7 seconds per year.",
    "source": "Standard astronomical distance, ~4.24 light years"
  },
  {
    "id": "earth-mass",
    "prompt": "What is the mass of the Earth, in kilograms?",
    "unit": "kilograms",
    "answerValue": 5.97e+24,
    "decompositionHint": "Earth's radius is ~6,371 km, so compute the volume of a sphere, then multiply by average density (~5,500 kg/m^3 - higher than surface rock because of the iron core).",
    "source": "Standard geophysical constant, 5.97x10^24 kg"
  },
  {
    "id": "mass-of-atmosphere",
    "prompt": "What is the total mass of Earth's atmosphere, in kilograms?",
    "unit": "kilograms",
    "answerValue": 5150000000000000000,
    "decompositionHint": "Atmospheric pressure at sea level is ~101,000 N/m^2, which is the weight of the air column above each square metre. Divide by g to get mass per square metre, then multiply by Earth's surface area (~5.1x10^14 m^2).",
    "source": "Derived from sea-level pressure and Earth's surface area"
  },
  {
    "id": "light-circuits-of-earth-per-second",
    "prompt": "How many times could a beam of light circle the Earth's equator in one second?",
    "unit": "circuits",
    "answerValue": 7.5,
    "decompositionHint": "Light travels 300,000 km per second; Earth's equatorial circumference is about 40,075 km. Divide.",
    "source": "Speed of light and Earth's equatorial circumference"
  },
  {
    "id": "earths-that-fit-inside-the-sun",
    "prompt": "How many Earths would fit inside the volume of the Sun?",
    "unit": "Earths",
    "answerValue": 1300000,
    "decompositionHint": "The Sun's radius is about 109 times Earth's. Volume scales with the cube of radius, so cube 109.",
    "source": "Ratio of solar to terrestrial radius, cubed"
  },
  {
    "id": "neurons-in-human-brain",
    "prompt": "How many neurons are in an adult human brain?",
    "unit": "neurons",
    "answerValue": 86000000000,
    "decompositionHint": "This is largely recall, but note the popular '100 billion' figure was a guess later measured more carefully - the real number is close to 86 billion.",
    "source": "Azevedo et al. 2009, Journal of Comparative Neurology - ~86 billion neurons"
  },
  {
    "id": "synapses-in-human-brain",
    "prompt": "How many synapses (connections between neurons) are in an adult human brain?",
    "unit": "synapses",
    "answerValue": 150000000000000,
    "decompositionHint": "Start from ~8.6x10^10 neurons and multiply by average connections per neuron (on the order of 1,000-10,000).",
    "source": "Neuroscience estimates, ~100-150 trillion synapses"
  },
  {
    "id": "red-blood-cells-in-body",
    "prompt": "How many red blood cells are in an adult human body?",
    "unit": "red blood cells",
    "answerValue": 25000000000000,
    "decompositionHint": "An adult has ~5 litres of blood, and blood contains roughly 5x10^6 red blood cells per microlitre. Convert litres to microlitres and multiply.",
    "source": "Standard haematology reference ranges"
  },
  {
    "id": "cells-replaced-per-second",
    "prompt": "How many cells does an adult human body replace every second?",
    "unit": "cells/second",
    "answerValue": 3800000,
    "decompositionHint": "Roughly 330 billion cells are replaced per day, dominated by short-lived blood and gut lining cells. Divide by 86,400 seconds.",
    "source": "Cell turnover estimates, ~3.3x10^11 cells replaced per day"
  },
  {
    "id": "blinks-per-year",
    "prompt": "How many times does an average person blink in a year?",
    "unit": "blinks",
    "answerValue": 5300000,
    "decompositionHint": "About 15 blinks per minute while awake, ~16 waking hours a day, 365 days a year.",
    "source": "Ophthalmology figures, ~15-20 blinks per minute"
  },
  {
    "id": "steps-in-a-lifetime",
    "prompt": "How many steps does an average person walk in an 80-year lifetime?",
    "unit": "steps",
    "answerValue": 220000000,
    "decompositionHint": "Typical daily step counts are ~5,000-8,000. Multiply by 365 days and ~75 active years.",
    "source": "Pedometer studies of average daily step counts"
  },
  {
    "id": "blood-pumped-per-day",
    "prompt": "How many litres of blood does the heart pump in a single day?",
    "unit": "litres/day",
    "answerValue": 7000,
    "decompositionHint": "Each beat ejects ~70 mL. Multiply by ~70 beats/minute, 60 minutes and 24 hours.",
    "source": "Standard cardiac output figures (~5 L/min at rest)"
  },
  {
    "id": "skin-cells-shed-per-day",
    "prompt": "How many skin cells does a person shed per day?",
    "unit": "skin cells",
    "answerValue": 400000000,
    "decompositionHint": "Skin is fully replaced roughly every month. Estimate total skin surface area (~1.8 m^2), cells per square centimetre in the outer layer, and divide the total by ~30 days.",
    "source": "Dermatology estimates, commonly cited ~30-40 thousand cells per minute"
  },
  {
    "id": "bacteria-in-the-mouth",
    "prompt": "How many bacteria live in an average human mouth?",
    "unit": "bacteria",
    "answerValue": 20000000000,
    "decompositionHint": "Saliva alone carries ~10^8 bacteria per millilitre, and most of the population sits in plaque and on the tongue rather than free in saliva.",
    "source": "Oral microbiology estimates, ~10-100 billion bacteria"
  },
  {
    "id": "taste-buds-on-tongue",
    "prompt": "How many taste buds does an average adult have?",
    "unit": "taste buds",
    "answerValue": 10000,
    "decompositionHint": "Taste buds sit in the papillae covering the tongue, with a few thousand more spread across the palate and throat.",
    "source": "Standard anatomy references, ~2,000-10,000 taste buds"
  },
  {
    "id": "hair-growth-over-a-lifetime",
    "prompt": "If a single scalp hair were never cut and never fell out, how many metres would it grow over 80 years?",
    "unit": "metres",
    "answerValue": 12,
    "decompositionHint": "Scalp hair grows roughly 1.25 cm per month. Multiply by 12 months and 80 years, then convert to metres. (In reality each hair falls out after a few years, which is why nobody has 12-metre hair.)",
    "source": "Standard hair growth rate, ~1-1.5 cm per month"
  },
  {
    "id": "seconds-in-a-lifetime",
    "prompt": "How many seconds does an average person live (~80 years)?",
    "unit": "seconds",
    "answerValue": 2500000000,
    "decompositionHint": "About 3.15x10^7 seconds per year, times 80.",
    "source": "Direct unit conversion"
  },
  {
    "id": "species-on-earth",
    "prompt": "How many species (of all kinds) are estimated to exist on Earth?",
    "unit": "species",
    "answerValue": 8700000,
    "decompositionHint": "Only ~1.2 million species have been formally described. Estimates extrapolate from how the rate of new descriptions is slowing within well-studied groups.",
    "source": "Mora et al. 2011, PLOS Biology - estimated ~8.7 million eukaryotic species"
  },
  {
    "id": "insects-alive-on-earth",
    "prompt": "How many individual insects are alive on Earth at any moment?",
    "unit": "insects",
    "answerValue": 10000000000000000000,
    "decompositionHint": "Estimate insects per square metre of land (on the order of thousands when soil-dwellers are counted) and multiply by Earth's land area (~1.5x10^14 m^2).",
    "source": "Entomological biomass estimates, commonly cited on the order of 10^18-10^19"
  },
  {
    "id": "cattle-in-the-world",
    "prompt": "How many cattle are alive in the world at any given time?",
    "asOf": 2025,
    "unit": "cattle",
    "answerValue": 1500000000,
    "decompositionHint": "Global beef and dairy output divided by per-animal yield, or simply anchor on the fact that cattle number roughly one for every five or six people.",
    "source": "UN FAO livestock statistics, ~1.5 billion head"
  },
  {
    "id": "honeybee-flower-visits-per-kg-honey",
    "prompt": "How many flower visits do honeybees need to make to produce one kilogram of honey?",
    "unit": "flower visits",
    "answerValue": 4400000,
    "decompositionHint": "A bee carries a tiny nectar load per trip and nectar is mostly water that must be evaporated off. The widely quoted figure is about two million flower visits per pound of honey.",
    "source": "Beekeeping figures, ~2 million flower visits per pound"
  },
  {
    "id": "grains-of-rice-produced-per-year",
    "prompt": "How many individual grains of rice are produced worldwide in a year?",
    "asOf": 2025,
    "unit": "grains of rice",
    "answerValue": 20000000000000000,
    "decompositionHint": "World rice production is roughly 5x10^11 kg per year. A single grain weighs about 0.025 g. Convert and divide.",
    "source": "FAO rice production statistics and typical grain mass"
  },
  {
    "id": "people-ever-lived",
    "prompt": "How many humans have ever been born in the whole of human history?",
    "asOf": 2025,
    "unit": "people",
    "answerValue": 117000000000,
    "decompositionHint": "Integrate population over time: populations were tiny for most of prehistory but birth rates were high, so the cumulative total is dominated by the last few thousand years. Today's 8 billion is only about 7% of the total.",
    "source": "Population Reference Bureau estimate, ~117 billion people ever born"
  },
  {
    "id": "people-born-per-day",
    "prompt": "How many babies are born worldwide each day?",
    "asOf": 2025,
    "unit": "births/day",
    "answerValue": 385000,
    "decompositionHint": "World population ~8x10^9 with a crude birth rate of ~17 per 1,000 people per year. Multiply, then divide by 365.",
    "source": "UN World Population Prospects birth rate data"
  },
  {
    "id": "weight-of-all-humans",
    "prompt": "What is the combined mass of every living human, in kilograms?",
    "asOf": 2025,
    "unit": "kilograms",
    "answerValue": 500000000000,
    "decompositionHint": "World population (~8.1x10^9) times average body mass across all ages (~62 kg, lower than the adult average because a large fraction are children).",
    "source": "World population x global mean body mass estimates"
  },
  {
    "id": "internet-users-worldwide",
    "prompt": "How many people worldwide use the internet?",
    "asOf": 2025,
    "unit": "people",
    "answerValue": 5400000000,
    "decompositionHint": "World population ~8.1 billion with global penetration around two thirds, much higher in wealthy regions and lower in parts of Africa and South Asia.",
    "source": "ITU global connectivity statistics, ~67% of the world online"
  },
  {
    "id": "google-searches-per-day",
    "prompt": "How many searches does Google handle per day?",
    "asOf": 2025,
    "unit": "searches",
    "answerValue": 8500000000,
    "decompositionHint": "Estimate the number of active users (billions) and average searches each per day (a handful), remembering that a large share of queries come from a small heavy-use minority.",
    "source": "Widely cited industry figure, ~8.5 billion searches per day"
  },
  {
    "id": "youtube-hours-uploaded-per-minute",
    "prompt": "How many hours of video are uploaded to YouTube every minute?",
    "asOf": 2025,
    "unit": "hours/minute",
    "answerValue": 500,
    "decompositionHint": "A useful sanity check: this means YouTube receives far more video per day than a person could watch in several lifetimes.",
    "source": "YouTube/Google published upload statistics, ~500 hours per minute"
  },
  {
    "id": "messages-sent-per-day-worldwide",
    "prompt": "How many messages are sent on WhatsApp worldwide each day?",
    "asOf": 2025,
    "unit": "messages",
    "answerValue": 100000000000,
    "decompositionHint": "Roughly 2 billion users sending on the order of tens of messages a day each.",
    "source": "Meta published messaging volume, ~100 billion messages per day"
  },
  {
    "id": "photos-taken-per-year",
    "prompt": "How many photographs are taken worldwide in a year?",
    "asOf": 2025,
    "unit": "photographs",
    "answerValue": 1900000000000,
    "decompositionHint": "Around 5 billion smartphone owners, each taking a handful of photos on an average day. Multiply by 365.",
    "source": "Industry estimates of annual photo volume, ~1.8-2 trillion"
  },
  {
    "id": "commercial-flights-per-day",
    "prompt": "How many commercial flights take off worldwide on a typical day?",
    "asOf": 2025,
    "unit": "flights",
    "answerValue": 100000,
    "decompositionHint": "The global commercial fleet is ~25,000-30,000 aircraft, and a typical airliner flies several sectors per day.",
    "source": "Flight tracking services report ~100,000 commercial flights daily"
  },
  {
    "id": "air-passengers-per-year",
    "prompt": "How many passenger journeys are flown worldwide in a year?",
    "asOf": 2025,
    "unit": "passenger journeys",
    "answerValue": 4500000000,
    "decompositionHint": "About 100,000 flights a day, averaging on the order of 100+ passengers each, times 365 days.",
    "source": "IATA/ICAO annual passenger traffic statistics"
  },
  {
    "id": "cups-of-coffee-per-day-worldwide",
    "prompt": "How many cups of coffee are drunk worldwide each day?",
    "asOf": 2025,
    "unit": "cups",
    "answerValue": 2250000000,
    "decompositionHint": "Global green coffee production is ~10 million tonnes a year; roughly 10 g of coffee makes a cup. Convert and divide by 365.",
    "source": "International Coffee Organization consumption figures, ~2 billion cups daily"
  },
  {
    "id": "bananas-eaten-per-year",
    "prompt": "How many individual bananas are eaten worldwide in a year?",
    "asOf": 2025,
    "unit": "bananas",
    "answerValue": 1100000000000,
    "decompositionHint": "World banana production is roughly 1.3x10^11 kg per year, and a banana weighs about 120 g of edible fruit. Divide.",
    "source": "FAO banana production statistics and typical fruit mass"
  },
  {
    "id": "plastic-bottles-per-minute",
    "prompt": "How many plastic drink bottles are sold worldwide every minute?",
    "asOf": 2025,
    "unit": "bottles/minute",
    "answerValue": 1000000,
    "decompositionHint": "Annual sales are on the order of half a trillion bottles. Divide by the ~525,600 minutes in a year.",
    "source": "Widely cited packaging industry figure, ~1 million bottles per minute"
  },
  {
    "id": "books-published-per-year",
    "prompt": "How many new book titles are published worldwide each year?",
    "asOf": 2025,
    "unit": "titles",
    "answerValue": 2200000,
    "decompositionHint": "Large publishing markets each produce tens to hundreds of thousands of titles a year; summing major markets and adding self-published titles gets you into the low millions.",
    "source": "UNESCO and national ISBN agency statistics"
  },
  {
    "id": "pencils-made-per-year",
    "prompt": "How many wooden pencils are manufactured worldwide each year?",
    "asOf": 2025,
    "unit": "pencils",
    "answerValue": 14000000000,
    "decompositionHint": "Roughly two pencils per person on Earth per year is a reasonable anchor, weighted heavily towards school-age users.",
    "source": "Pencil industry estimates, ~14 billion pencils annually"
  },
  {
    "id": "lego-elements-per-year",
    "prompt": "How many individual LEGO elements are produced each year?",
    "asOf": 2025,
    "unit": "LEGO elements",
    "answerValue": 75000000000,
    "decompositionHint": "Estimate sets sold per year and average pieces per set - the answer works out to roughly ten pieces for every person on Earth, every year.",
    "source": "LEGO Group published production figures, ~75 billion elements per year"
  },
  {
    "id": "shipping-containers-per-year",
    "prompt": "How many shipping containers (TEU) pass through the world's ports in a year?",
    "asOf": 2025,
    "unit": "TEU",
    "answerValue": 850000000,
    "decompositionHint": "The largest single port handles tens of millions of TEU per year; the global total is dominated by a few dozen major ports.",
    "source": "UNCTAD world container port throughput statistics"
  },
  {
    "id": "us-currency-in-circulation",
    "prompt": "What is the total value of US physical currency in circulation, in dollars?",
    "asOf": 2025,
    "unit": "US dollars",
    "answerValue": 2300000000000,
    "decompositionHint": "Most of the value sits in $100 notes, a large share of which are held outside the United States. That works out to several thousand dollars of cash per American.",
    "source": "US Federal Reserve currency in circulation data"
  },
  {
    "id": "atms-worldwide",
    "prompt": "How many ATMs are there worldwide?",
    "asOf": 2025,
    "unit": "ATMs",
    "answerValue": 3000000,
    "decompositionHint": "Roughly one ATM per few thousand people globally, with much higher density in wealthy and cash-heavy economies.",
    "source": "World Bank / ATM industry statistics, ~3 million machines"
  },
  {
    "id": "mcdonalds-customers-per-day",
    "prompt": "How many customers does McDonald's serve worldwide per day?",
    "asOf": 2025,
    "unit": "customers/day",
    "answerValue": 69000000,
    "decompositionHint": "About 40,000 restaurants worldwide, each serving on the order of 1,500-2,000 customers a day.",
    "source": "McDonald's corporate reporting, ~69 million customers daily"
  },
  {
    "id": "gas-stations-in-us",
    "prompt": "How many petrol stations (gas stations) are there in the United States?",
    "asOf": 2025,
    "unit": "stations",
    "answerValue": 145000,
    "decompositionHint": "US population ~335 million; roughly one station per 2,000-2,500 people is a reasonable density for a car-dependent country.",
    "source": "US convenience store and fuel retailing industry counts"
  },
  {
    "id": "roads-in-us-length",
    "prompt": "How many kilometres of public road are there in the United States?",
    "asOf": 2025,
    "unit": "kilometres",
    "answerValue": 6600000,
    "decompositionHint": "Estimate from settlement density: every town needs local streets, and the interstate system alone is only ~78,000 km, so local roads dominate the total by two orders of magnitude.",
    "source": "US Federal Highway Administration, ~4.1 million miles of public road"
  },
  {
    "id": "km-driven-per-car-per-year",
    "prompt": "How many kilometres does an average car travel in one year?",
    "asOf": 2025,
    "unit": "kilometres/year",
    "answerValue": 15000,
    "decompositionHint": "A typical commute is on the order of 30-50 km a day round trip on working days, plus errands and occasional long trips.",
    "source": "National transport survey averages (~12,000-15,000 km/year)"
  },
  {
    "id": "hospitals-in-us",
    "prompt": "How many hospitals are there in the United States?",
    "asOf": 2025,
    "unit": "hospitals",
    "answerValue": 6100,
    "decompositionHint": "US population ~335 million; a hospital typically serves a catchment of tens of thousands of people.",
    "source": "American Hospital Association registered hospital counts"
  },
  {
    "id": "public-libraries-in-us",
    "prompt": "How many public libraries are there in the United States?",
    "asOf": 2025,
    "unit": "libraries",
    "answerValue": 17000,
    "decompositionHint": "Most towns of any size have at least one branch; estimate the number of towns above a few thousand people.",
    "source": "Institute of Museum and Library Services public library survey"
  },
  {
    "id": "schools-in-us",
    "prompt": "How many K-12 schools are there in the United States?",
    "asOf": 2025,
    "unit": "schools",
    "answerValue": 130000,
    "decompositionHint": "About 50 million school-age children, with an average school enrolling a few hundred students.",
    "source": "US National Center for Education Statistics"
  },
  {
    "id": "words-in-english-wikipedia",
    "prompt": "How many words are there in the whole of English Wikipedia?",
    "asOf": 2025,
    "unit": "words",
    "answerValue": 4600000000,
    "decompositionHint": "Roughly 7 million articles averaging several hundred words each - though the mean is dragged up by a minority of very long articles.",
    "source": "Wikipedia's own published statistics on article count and size"
  },
  {
    "id": "transistors-in-a-smartphone-chip",
    "prompt": "How many transistors are on a modern flagship smartphone processor?",
    "asOf": 2025,
    "unit": "transistors",
    "answerValue": 15000000000,
    "decompositionHint": "Chip area is on the order of 1 cm^2 and modern process nodes pack on the order of 10^8 transistors per mm^2.",
    "source": "Published die statistics for recent flagship mobile SoCs (~15-20 billion)"
  },
  {
    "id": "cups-of-tea-uk-per-day",
    "prompt": "How many cups of tea are drunk in the United Kingdom each day?",
    "asOf": 2025,
    "unit": "cups",
    "answerValue": 100000000,
    "decompositionHint": "UK population ~68 million; the commonly cited average is a bit under two cups per person per day.",
    "source": "UK Tea and Infusions Association, ~100 million cups daily"
  },
  {
    "id": "sheep-in-new-zealand",
    "prompt": "How many sheep are there in New Zealand?",
    "asOf": 2025,
    "unit": "sheep",
    "answerValue": 25000000,
    "decompositionHint": "The famous ratio of sheep to people has fallen a long way from its 1980s peak of over 20:1, but is still around 5:1 against a population of ~5 million.",
    "source": "Stats NZ agricultural production statistics"
  },
  {
    "id": "calories-burned-per-day",
    "prompt": "How many kilocalories does an average adult burn in a day?",
    "unit": "kilocalories/day",
    "answerValue": 2000,
    "decompositionHint": "Basal metabolic rate accounts for most of it (~1,400-1,700 kcal), with activity adding a few hundred more for a sedentary person.",
    "source": "Standard dietary reference intakes"
  },
  {
    "id": "world-population-1800",
    "prompt": "What was the world's total human population?",
    "asOf": 1800,
    "unit": "people",
    "answerValue": 1000000000,
    "decompositionHint": "The first billion was reached right around 1800 after millennia of very slow growth. Everything since is the anomaly, not the norm.",
    "source": "UN and HYDE historical population reconstructions"
  },
  {
    "id": "world-population-1900",
    "prompt": "What was the world's total human population?",
    "asOf": 1900,
    "unit": "people",
    "answerValue": 1650000000,
    "decompositionHint": "Growth from 1800 to 1900 was well under a doubling. Industrialisation had begun but the great mortality decline had not yet reached most of the world.",
    "source": "UN and HYDE historical population reconstructions"
  },
  {
    "id": "world-population-1950",
    "prompt": "What was the world's total human population?",
    "asOf": 1950,
    "unit": "people",
    "answerValue": 2500000000,
    "decompositionHint": "Half a century after 1900 added roughly as many people as the whole of prior history had by 1800. The acceleration is the story here.",
    "source": "UN World Population Prospects"
  },
  {
    "id": "world-population-2000",
    "prompt": "What was the world's total human population?",
    "asOf": 2000,
    "unit": "people",
    "answerValue": 6100000000,
    "decompositionHint": "The population roughly doubled between 1960 and 2000, the fastest sustained growth in human history.",
    "source": "UN World Population Prospects"
  },
  {
    "id": "world-population-2025",
    "prompt": "What is the world's total human population?",
    "asOf": 2025,
    "unit": "people",
    "answerValue": 8200000000,
    "decompositionHint": "Growth has slowed markedly since the 1960s peak rate. Adding the eighth billion took about twelve years.",
    "source": "UN World Population Prospects"
  },
  {
    "id": "global-life-expectancy-1900",
    "prompt": "What was average life expectancy at birth worldwide, in years?",
    "asOf": 1900,
    "unit": "years",
    "answerValue": 32,
    "decompositionHint": "Dominated by infant and child mortality rather than short adult lives - someone who survived to twenty could still expect a further few decades.",
    "source": "Historical demography reconstructions"
  },
  {
    "id": "global-life-expectancy-1950",
    "prompt": "What was average life expectancy at birth worldwide, in years?",
    "asOf": 1950,
    "unit": "years",
    "answerValue": 46,
    "decompositionHint": "Most of the gain over 1900 came from falling child mortality, driven by sanitation and vaccination rather than by medicine for the old.",
    "source": "UN World Population Prospects"
  },
  {
    "id": "global-life-expectancy-2025",
    "prompt": "What is average life expectancy at birth worldwide, in years?",
    "asOf": 2025,
    "unit": "years",
    "answerValue": 73,
    "decompositionHint": "Global average across very different national figures, from the low sixties in parts of Africa to the mid eighties in Japan.",
    "source": "WHO and UN life expectancy estimates"
  },
  {
    "id": "us-population-1790",
    "prompt": "What was the population of the United States at its first census?",
    "asOf": 1790,
    "unit": "people",
    "answerValue": 3900000,
    "decompositionHint": "Thirteen states, overwhelmingly rural, with no city above about 50,000 people. Smaller than a single large metro area today.",
    "source": "US Census Bureau, 1790 census"
  },
  {
    "id": "us-population-1900",
    "prompt": "What was the population of the United States?",
    "asOf": 1900,
    "unit": "people",
    "answerValue": 76000000,
    "decompositionHint": "Roughly twenty times the 1790 figure after a century of immigration and westward expansion, but still under a quarter of today's.",
    "source": "US Census Bureau"
  },
  {
    "id": "us-population-2025",
    "prompt": "What is the population of the United States?",
    "asOf": 2025,
    "unit": "people",
    "answerValue": 340000000,
    "decompositionHint": "About four percent of world population, and the third largest country after India and China.",
    "source": "US Census Bureau estimates"
  },
  {
    "id": "cost-per-gigabyte-1990",
    "prompt": "What did one gigabyte of hard disk storage cost, in US dollars?",
    "asOf": 1990,
    "unit": "US dollars",
    "answerValue": 10000,
    "decompositionHint": "Drives were priced per megabyte then, at roughly ten dollars each. Multiply by a thousand megabytes to reach a gigabyte.",
    "source": "Historical storage price surveys"
  },
  {
    "id": "cost-per-gigabyte-2025",
    "prompt": "What does one gigabyte of hard disk storage cost, in US dollars?",
    "asOf": 2025,
    "unit": "US dollars",
    "answerValue": 0.02,
    "decompositionHint": "A consumer drive of several terabytes costs under a hundred dollars. Divide the price by the capacity in gigabytes.",
    "source": "Consumer drive pricing"
  },
  {
    "id": "transistors-intel-4004",
    "prompt": "How many transistors were on the first commercial microprocessor, the Intel 4004?",
    "asOf": 1971,
    "unit": "transistors",
    "answerValue": 2300,
    "decompositionHint": "Small enough to be counted by hand on a die photograph. Compare against a modern chip to feel five decades of Moore's law.",
    "source": "Intel historical specifications"
  },
  {
    "id": "internet-users-2000",
    "prompt": "How many people worldwide used the internet?",
    "asOf": 2000,
    "unit": "people",
    "answerValue": 410000000,
    "decompositionHint": "Under seven percent of the world, concentrated in wealthy countries and mostly on dial-up connections.",
    "source": "ITU historical connectivity statistics"
  },
  {
    "id": "mobile-subscriptions-1995",
    "prompt": "How many mobile phone subscriptions existed worldwide?",
    "asOf": 1995,
    "unit": "subscriptions",
    "answerValue": 90000000,
    "decompositionHint": "Under two percent of the world's population, when a handset was still an expensive business tool rather than a default possession.",
    "source": "ITU historical telecommunications statistics"
  },
  {
    "id": "cars-in-world-1950",
    "prompt": "How many motor vehicles were in use worldwide?",
    "asOf": 1950,
    "unit": "vehicles",
    "answerValue": 70000000,
    "decompositionHint": "Overwhelmingly American - the United States held the large majority of the world's vehicles at mid century.",
    "source": "Historical automotive production and registration data"
  },
  {
    "id": "cars-in-world-2025",
    "prompt": "How many motor vehicles are in use worldwide?",
    "asOf": 2025,
    "unit": "vehicles",
    "answerValue": 1500000000,
    "decompositionHint": "Roughly one vehicle for every five or six people globally, with enormous variation between countries.",
    "source": "International vehicle registration statistics"
  },
  {
    "id": "co2-ppm-1960",
    "prompt": "What was the concentration of carbon dioxide in the atmosphere, in parts per million?",
    "asOf": 1960,
    "unit": "parts per million",
    "answerValue": 317,
    "decompositionHint": "The Mauna Loa record began in 1958 near 315 ppm, against a pre-industrial baseline of about 280.",
    "source": "NOAA Mauna Loa observatory record"
  },
  {
    "id": "co2-ppm-2025",
    "prompt": "What is the concentration of carbon dioxide in the atmosphere, in parts per million?",
    "asOf": 2025,
    "unit": "parts per million",
    "answerValue": 425,
    "decompositionHint": "Rising roughly two to three parts per million each year from the 1960 figure - a small number that compounds steadily.",
    "source": "NOAA Mauna Loa observatory record"
  },
  {
    "id": "un-member-states-1945",
    "prompt": "How many member states did the United Nations have at its founding?",
    "asOf": 1945,
    "unit": "member states",
    "answerValue": 51,
    "decompositionHint": "Before decolonisation. Most of Africa and much of Asia was still under colonial rule and therefore unrepresented.",
    "source": "United Nations founding records"
  },
  {
    "id": "mass-of-the-moon",
    "prompt": "What is the mass of the Moon, in kilograms?",
    "unit": "kilograms",
    "answerValue": 7.35e+22,
    "decompositionHint": "The Moon's radius is about a quarter of Earth's, so its volume is roughly one sixtieth, and it is somewhat less dense as well.",
    "source": "Standard astronomical constant"
  },
  {
    "id": "mass-of-the-sun",
    "prompt": "What is the mass of the Sun, in kilograms?",
    "unit": "kilograms",
    "answerValue": 1.99e+30,
    "decompositionHint": "About 330,000 times Earth's mass, and roughly 99.9 percent of all the mass in the solar system.",
    "source": "Standard astronomical constant"
  },
  {
    "id": "temperature-of-suns-core",
    "prompt": "How hot is the core of the Sun, in kelvin?",
    "unit": "kelvin",
    "answerValue": 15000000,
    "decompositionHint": "Hot enough to sustain hydrogen fusion. The visible surface is only about 5,800 K, so the core is thousands of times hotter.",
    "source": "Standard solar model"
  },
  {
    "id": "distance-earth-to-sun",
    "prompt": "How far is the Earth from the Sun, in kilometres?",
    "unit": "kilometres",
    "answerValue": 150000000,
    "decompositionHint": "Light takes about eight minutes to cross it, so multiply 300,000 km/s by roughly 500 seconds.",
    "source": "Astronomical unit, 149.6 million km"
  },
  {
    "id": "earth-orbital-speed",
    "prompt": "How fast does the Earth travel around the Sun, in kilometres per hour?",
    "unit": "kilometres per hour",
    "answerValue": 107000,
    "decompositionHint": "Divide the circumference of Earth's orbit (2 pi times 150 million km) by the hours in a year.",
    "source": "Derived from orbital radius and period"
  },
  {
    "id": "atoms-in-observable-universe",
    "prompt": "Roughly how many atoms are in the observable universe?",
    "unit": "atoms",
    "answerValue": 1e+80,
    "decompositionHint": "Multiply the number of stars per galaxy by the number of galaxies, then by the atoms in an average star. Most ordinary matter is hydrogen in stars and gas.",
    "source": "Standard cosmological estimate, 10^78 to 10^82"
  },
  {
    "id": "energy-in-a-lightning-bolt",
    "prompt": "How much energy does a typical lightning bolt release, in joules?",
    "unit": "joules",
    "answerValue": 5000000000,
    "decompositionHint": "Enough to power a household for weeks, but delivered in microseconds - the power is spectacular, the total energy less so than people expect.",
    "source": "Atmospheric physics estimates, roughly 1-10 gigajoules"
  },
  {
    "id": "lightning-strikes-per-day",
    "prompt": "How many lightning strikes hit the Earth each day?",
    "unit": "strikes",
    "answerValue": 8000000,
    "decompositionHint": "Roughly a hundred every second, concentrated over tropical land masses rather than spread evenly.",
    "source": "NASA and satellite lightning detection data"
  },
  {
    "id": "meteorite-mass-hitting-earth-per-year",
    "prompt": "How many kilograms of meteoritic material fall to Earth each year?",
    "unit": "kilograms",
    "answerValue": 15000000,
    "decompositionHint": "Almost all of it is dust and grains that burn up unnoticed, not the rare large impacts that get attention.",
    "source": "Planetary science estimates, roughly 15,000 tonnes per year"
  },
  {
    "id": "neutrinos-through-a-thumbnail",
    "prompt": "How many solar neutrinos pass through an area the size of your thumbnail each second?",
    "unit": "neutrinos",
    "answerValue": 65000000000,
    "decompositionHint": "The solar neutrino flux at Earth is about 6.5x10^10 per square centimetre per second, and a thumbnail is roughly a square centimetre.",
    "source": "Standard solar model neutrino flux"
  },
  {
    "id": "age-of-the-earth",
    "prompt": "How old is the Earth, in years?",
    "unit": "years",
    "answerValue": 4540000000,
    "decompositionHint": "Dated by radiometric measurement of the oldest meteorites, which formed with the solar system. About a third of the age of the universe.",
    "source": "Radiometric dating, 4.54 billion years"
  },
  {
    "id": "kilometres-in-a-light-year",
    "prompt": "How many kilometres are there in one light year?",
    "unit": "kilometres",
    "answerValue": 9460000000000,
    "decompositionHint": "Light travels 300,000 km each second. Multiply by the roughly 3.15x10^7 seconds in a year.",
    "source": "Direct calculation from the speed of light"
  },
  {
    "id": "molecules-in-a-drop-of-water",
    "prompt": "How many water molecules are in a single drop of water?",
    "unit": "molecules",
    "answerValue": 1.7e+21,
    "decompositionHint": "A drop is about 0.05 mL, so 0.05 g. Divide by the molar mass of water and multiply by Avogadro's number.",
    "source": "Standard chemistry calculation"
  },
  {
    "id": "atoms-across-a-human-hair",
    "prompt": "How many atoms would you need to lay side by side to span the width of a human hair?",
    "unit": "atoms",
    "answerValue": 350000,
    "decompositionHint": "A hair is roughly 70 micrometres across and an atom about 0.2 nanometres. Convert both to the same units and divide.",
    "source": "Typical hair diameter and atomic radius"
  },
  {
    "id": "carbon-atoms-in-a-diamond",
    "prompt": "How many carbon atoms are in a one carat diamond?",
    "unit": "atoms",
    "answerValue": 1e+22,
    "decompositionHint": "A carat is 0.2 grams. Divide by carbon's molar mass of 12 and multiply by Avogadro's number.",
    "source": "Standard chemistry calculation"
  },
  {
    "id": "iron-atoms-in-a-nail",
    "prompt": "How many iron atoms are in an ordinary three gram nail?",
    "unit": "atoms",
    "answerValue": 3.2e+22,
    "decompositionHint": "Three grams divided by iron's molar mass of about 56, multiplied by Avogadro's number.",
    "source": "Standard chemistry calculation"
  },
  {
    "id": "air-molecules-per-cubic-centimetre",
    "prompt": "How many air molecules are in one cubic centimetre of air at sea level?",
    "unit": "molecules",
    "answerValue": 25000000000000000000,
    "decompositionHint": "One mole occupies 22.4 litres, which is 22,400 cubic centimetres. Divide Avogadro's number by that.",
    "source": "Loschmidt constant, 2.5x10^19 per cubic centimetre"
  },
  {
    "id": "helium-balloons-to-lift-a-person",
    "prompt": "How many party balloons filled with helium would it take to lift an average adult?",
    "unit": "balloons",
    "answerValue": 5000,
    "decompositionHint": "Helium lifts roughly one gram per litre. A 70 kg person needs 70,000 litres of lift, and a party balloon holds about 14 litres.",
    "source": "Buoyancy calculation from helium and air densities"
  },
  {
    "id": "surface-area-of-earth",
    "prompt": "What is the total surface area of the Earth, in square kilometres?",
    "unit": "square kilometres",
    "answerValue": 510000000,
    "decompositionHint": "Use the surface area of a sphere, 4 pi r squared, with a radius of about 6,371 km.",
    "source": "Standard geophysical constant"
  },
  {
    "id": "land-area-of-earth",
    "prompt": "How much of the Earth's surface is land, in square kilometres?",
    "unit": "square kilometres",
    "answerValue": 149000000,
    "decompositionHint": "Land is about 29 percent of the total surface. Take the whole surface area and take a bit under a third.",
    "source": "Standard geographic figures"
  },
  {
    "id": "volume-of-the-oceans",
    "prompt": "What is the total volume of Earth's oceans, in cubic kilometres?",
    "unit": "cubic kilometres",
    "answerValue": 1335000000,
    "decompositionHint": "Ocean covers about 361 million square kilometres at an average depth of roughly 3.7 km. Multiply area by mean depth.",
    "source": "NOAA ocean volume estimates"
  },
  {
    "id": "amazon-river-discharge",
    "prompt": "How much water does the Amazon river discharge, in cubic metres per second?",
    "unit": "cubic metres per second",
    "answerValue": 210000,
    "decompositionHint": "About a fifth of all river water reaching the oceans, and more than the next several largest rivers combined.",
    "source": "Hydrological measurements of the Amazon basin"
  },
  {
    "id": "area-of-the-sahara",
    "prompt": "What is the area of the Sahara desert, in square kilometres?",
    "unit": "square kilometres",
    "answerValue": 9200000,
    "decompositionHint": "Comparable in area to the United States or to China. It spans nearly the full width of Africa.",
    "source": "Standard geographic figures"
  },
  {
    "id": "earthquakes-magnitude-five-per-year",
    "prompt": "How many earthquakes of magnitude 5 or greater occur worldwide in a year?",
    "unit": "earthquakes",
    "answerValue": 1500,
    "decompositionHint": "Each step down in magnitude is roughly ten times more frequent, so work from the handful of magnitude 8 events per decade.",
    "source": "US Geological Survey earthquake statistics"
  },
  {
    "id": "active-volcanoes-on-earth",
    "prompt": "How many volcanoes on Earth are considered active?",
    "unit": "volcanoes",
    "answerValue": 1500,
    "decompositionHint": "Counting those that have erupted in the Holocene. Only a few dozen are erupting in any given year.",
    "source": "Smithsonian Global Volcanism Program"
  },
  {
    "id": "glaciers-on-earth",
    "prompt": "How many individual glaciers are there on Earth?",
    "unit": "glaciers",
    "answerValue": 200000,
    "decompositionHint": "Counted from satellite inventories, excluding the two continental ice sheets which are catalogued separately.",
    "source": "Randolph Glacier Inventory"
  },
  {
    "id": "lakes-on-earth",
    "prompt": "How many lakes larger than a hectare are there on Earth?",
    "unit": "lakes",
    "answerValue": 117000000,
    "decompositionHint": "Small lakes vastly outnumber large ones, following a steep size distribution, so the count is dominated by the smallest counted size.",
    "source": "Satellite-based global lake inventories"
  },
  {
    "id": "rain-falling-on-earth-per-year",
    "prompt": "How many cubic kilometres of rain and snow fall on Earth in a year?",
    "unit": "cubic kilometres",
    "answerValue": 500000,
    "decompositionHint": "Global average precipitation is about one metre per year. Multiply that depth by Earth's whole surface area.",
    "source": "Global hydrological cycle estimates"
  },
  {
    "id": "sand-grains-in-a-cubic-metre",
    "prompt": "How many grains of sand are in one cubic metre of sand?",
    "unit": "grains of sand",
    "answerValue": 15000000000,
    "decompositionHint": "A typical grain is around half a millimetre across, so roughly 10^-10 cubic metres each once packing is allowed for.",
    "source": "Derived from typical grain size and packing density"
  },
  {
    "id": "trees-cut-for-paper-per-year",
    "prompt": "How many trees are harvested worldwide each year for paper and pulp?",
    "asOf": 2025,
    "unit": "trees",
    "answerValue": 3000000000,
    "decompositionHint": "Global paper production is roughly 400 million tonnes, and a single tree yields on the order of a tenth of a tonne of pulp.",
    "source": "FAO forest products statistics"
  },
  {
    "id": "mass-of-a-blue-whale",
    "prompt": "How much does an adult blue whale weigh, in kilograms?",
    "unit": "kilograms",
    "answerValue": 150000,
    "decompositionHint": "About 25 metres long. Water weighs a tonne per cubic metre and a whale is near neutral buoyancy, so estimate its volume and treat it as water.",
    "source": "Marine biology references, roughly 100-190 tonnes"
  },
  {
    "id": "bees-in-a-hive",
    "prompt": "How many bees live in a healthy honeybee hive at peak season?",
    "unit": "bees",
    "answerValue": 50000,
    "decompositionHint": "A queen lays on the order of 1,500 eggs a day and a worker lives about six weeks in summer. Multiply the daily rate by the lifespan.",
    "source": "Apiculture references, 20,000-80,000 in summer"
  },
  {
    "id": "eggs-laid-by-a-hen-per-year",
    "prompt": "How many eggs does a commercial laying hen produce in a year?",
    "unit": "eggs",
    "answerValue": 300,
    "decompositionHint": "Close to one a day with short breaks, which is why the figure lands just under the number of days in a year.",
    "source": "Poultry industry production figures"
  },
  {
    "id": "beetle-species",
    "prompt": "How many species of beetle have been described?",
    "unit": "species",
    "answerValue": 400000,
    "decompositionHint": "Beetles are about a quarter of all described animal species - the reason for the remark that the creator had an inordinate fondness for them.",
    "source": "Entomological catalogues, roughly 400,000 described species"
  },
  {
    "id": "birds-on-earth",
    "prompt": "How many individual wild birds are alive on Earth?",
    "unit": "birds",
    "answerValue": 50000000000,
    "decompositionHint": "Roughly six birds for every person. A handful of common species account for a very large share of the total.",
    "source": "Callaghan et al. 2021, PNAS - estimated ~50 billion wild birds"
  },
  {
    "id": "arctic-tern-annual-migration",
    "prompt": "How far does an Arctic tern migrate in a single year, in kilometres?",
    "unit": "kilometres",
    "answerValue": 70000,
    "decompositionHint": "It flies pole to pole and back, but by a looping route rather than a straight line, so the total well exceeds twice the Earth's radius of travel.",
    "source": "Tracking studies of Arctic tern migration"
  },
  {
    "id": "viruses-in-the-ocean",
    "prompt": "Roughly how many virus particles are in the world's oceans?",
    "unit": "virus particles",
    "answerValue": 1e+30,
    "decompositionHint": "Seawater holds around ten million virus particles per millilitre. Multiply by the ocean's volume converted to millilitres.",
    "source": "Marine microbiology estimates, ~10^30 virions"
  },
  {
    "id": "bacteria-in-a-gram-of-soil",
    "prompt": "How many bacteria live in a single gram of fertile soil?",
    "unit": "bacteria",
    "answerValue": 1000000000,
    "decompositionHint": "Soil is one of the densest microbial habitats known - a teaspoon holds more organisms than there are people on Earth.",
    "source": "Soil microbiology estimates, 10^8 to 10^10 per gram"
  },
  {
    "id": "base-pairs-in-human-genome",
    "prompt": "How many base pairs are in the human genome?",
    "unit": "base pairs",
    "answerValue": 3200000000,
    "decompositionHint": "Around three billion, which at one byte per base would fit on an ordinary memory card - the information density of life is lower than people expect.",
    "source": "Human Genome Project reference assembly"
  },
  {
    "id": "genes-in-human-genome",
    "prompt": "How many protein-coding genes does the human genome contain?",
    "unit": "genes",
    "answerValue": 20000,
    "decompositionHint": "Early estimates ran to 100,000 and were revised sharply down. It is roughly comparable to a nematode worm, which was the surprise.",
    "source": "GENCODE annotation, roughly 20,000 protein-coding genes"
  },
  {
    "id": "protein-molecules-in-a-cell",
    "prompt": "How many protein molecules are in a single human cell?",
    "unit": "protein molecules",
    "answerValue": 10000000000,
    "decompositionHint": "A typical cell masses about a nanogram, protein is roughly a fifth of that, and an average protein is around 50 kilodaltons.",
    "source": "Cell biology estimates, ~10^10 proteins per mammalian cell"
  },
  {
    "id": "mitochondria-per-cell",
    "prompt": "How many mitochondria are in a typical human cell?",
    "unit": "mitochondria",
    "answerValue": 1000,
    "decompositionHint": "Varies enormously by tissue - a heart muscle cell holds several thousand while a red blood cell holds none at all.",
    "source": "Cell biology references, hundreds to thousands"
  },
  {
    "id": "surface-area-of-human-lungs",
    "prompt": "What is the total internal surface area of adult human lungs, in square metres?",
    "unit": "square metres",
    "answerValue": 70,
    "decompositionHint": "Roughly 300 million alveoli, each about 0.2 mm across. The folding is what turns a chest-sized organ into something closer to a tennis court.",
    "source": "Respiratory physiology references, 50-100 square metres"
  },
  {
    "id": "surface-area-of-small-intestine",
    "prompt": "What is the absorptive surface area of the human small intestine, in square metres?",
    "unit": "square metres",
    "answerValue": 30,
    "decompositionHint": "Six metres of tube only gives a fraction of a square metre. Folds, villi and microvilli multiply it by more than a hundred.",
    "source": "Gastroenterology references, roughly 30 square metres"
  },
  {
    "id": "sweat-glands-on-the-body",
    "prompt": "How many sweat glands does an adult human body have?",
    "unit": "sweat glands",
    "answerValue": 3000000,
    "decompositionHint": "Skin area is around 1.8 square metres, with roughly 150-350 glands per square centimetre depending on the region.",
    "source": "Dermatology references, 2-4 million glands"
  },
  {
    "id": "nerve-signal-speed",
    "prompt": "How fast does a signal travel along a myelinated human nerve, in metres per second?",
    "unit": "metres per second",
    "answerValue": 100,
    "decompositionHint": "Fast enough to cross the body in a few hundredths of a second, but roughly three million times slower than electricity in a wire.",
    "source": "Neurophysiology references, 70-120 m/s for myelinated fibres"
  },
  {
    "id": "red-blood-cells-made-per-second",
    "prompt": "How many red blood cells does the human body produce each second?",
    "unit": "cells/second",
    "answerValue": 2500000,
    "decompositionHint": "There are about 2.5x10^13 red cells and each lasts roughly 120 days. Divide the total by the lifespan in seconds.",
    "source": "Derived from red cell count and 120-day lifespan"
  },
  {
    "id": "platelets-in-the-body",
    "prompt": "How many platelets are in an adult human's blood?",
    "unit": "platelets",
    "answerValue": 1500000000000,
    "decompositionHint": "Roughly 3x10^11 per litre of blood, across about five litres.",
    "source": "Standard haematology reference ranges"
  },
  {
    "id": "white-blood-cells-in-the-body",
    "prompt": "How many white blood cells are in an adult human's blood?",
    "unit": "white blood cells",
    "answerValue": 25000000000,
    "decompositionHint": "About 5x10^9 per litre - roughly a thousandth the number of red cells - across five litres of blood.",
    "source": "Standard haematology reference ranges"
  },
  {
    "id": "water-in-the-human-body",
    "prompt": "How many litres of water are in an adult human body?",
    "unit": "litres",
    "answerValue": 42,
    "decompositionHint": "Roughly 60 percent of body mass, and a litre of water weighs a kilogram, so it is simply 0.6 times body weight.",
    "source": "Standard physiology, ~60% of body mass"
  },
  {
    "id": "steps-in-a-marathon",
    "prompt": "How many steps does a runner take to complete a marathon?",
    "unit": "steps",
    "answerValue": 55000,
    "decompositionHint": "42.2 km divided by a running stride of roughly 0.8 metres, which is longer than a walking stride.",
    "source": "Derived from marathon distance and typical running stride"
  },
  {
    "id": "calories-burned-in-a-marathon",
    "prompt": "How many kilocalories does a runner burn completing a marathon?",
    "unit": "kilocalories",
    "answerValue": 2600,
    "decompositionHint": "Running costs roughly one kilocalorie per kilogram per kilometre. Multiply by body mass and the 42 km distance.",
    "source": "Exercise physiology energy cost estimates"
  },
  {
    "id": "saliva-produced-per-day",
    "prompt": "How many litres of saliva does a person produce in a day?",
    "unit": "litres",
    "answerValue": 1.5,
    "decompositionHint": "Production runs continuously at a low rate and spikes with eating. Over 24 hours it adds up to more than most people guess.",
    "source": "Oral physiology references, 0.5-1.5 litres daily"
  },
  {
    "id": "sperm-in-an-ejaculation",
    "prompt": "How many sperm cells are in a single human ejaculation?",
    "unit": "sperm cells",
    "answerValue": 200000000,
    "decompositionHint": "Concentration is on the order of 50 million per millilitre across a few millilitres of volume.",
    "source": "WHO semen analysis reference values"
  },
  {
    "id": "eggs-in-ovaries-at-birth",
    "prompt": "How many immature egg cells does a human female have at birth?",
    "unit": "egg cells",
    "answerValue": 1000000,
    "decompositionHint": "The supply is fixed at birth and declines steadily. Only a few hundred are ever ovulated across a lifetime.",
    "source": "Reproductive biology references, 1-2 million at birth"
  },
  {
    "id": "wheat-produced-per-year",
    "prompt": "How many tonnes of wheat are produced worldwide in a year?",
    "asOf": 2025,
    "unit": "tonnes",
    "answerValue": 790000000,
    "decompositionHint": "Enough to give every person on Earth roughly 100 kg a year, which is about right for a staple grain.",
    "source": "FAO cereal production statistics"
  },
  {
    "id": "eggs-produced-worldwide",
    "prompt": "How many chicken eggs are produced worldwide in a year?",
    "asOf": 2025,
    "unit": "eggs",
    "answerValue": 1600000000000,
    "decompositionHint": "Roughly 200 eggs per person per year across 8 billion people, though consumption is very unevenly distributed.",
    "source": "FAO livestock production statistics"
  },
  {
    "id": "milk-produced-worldwide",
    "prompt": "How many litres of milk are produced worldwide in a year?",
    "asOf": 2025,
    "unit": "litres",
    "answerValue": 900000000000,
    "decompositionHint": "About 1.5 billion cattle exist, but only a fraction are dairy animals, each yielding on the order of several thousand litres a year.",
    "source": "FAO dairy production statistics"
  },
  {
    "id": "coffee-beans-in-a-cup",
    "prompt": "How many roasted coffee beans go into a single cup of coffee?",
    "unit": "coffee beans",
    "answerValue": 70,
    "decompositionHint": "A cup uses roughly 10 grams of coffee and a roasted bean weighs about 0.13 grams.",
    "source": "Derived from standard brew ratios and bean mass"
  },
  {
    "id": "grains-of-wheat-in-a-loaf",
    "prompt": "How many grains of wheat go into one loaf of bread?",
    "unit": "grains of wheat",
    "answerValue": 15000,
    "decompositionHint": "A loaf takes roughly 500 grams of flour and a single wheat grain weighs about 0.04 grams.",
    "source": "Derived from typical loaf flour content and grain mass"
  },
  {
    "id": "farmland-area-worldwide",
    "prompt": "How many square kilometres of the Earth's land is used for agriculture?",
    "asOf": 2025,
    "unit": "square kilometres",
    "answerValue": 48000000,
    "decompositionHint": "About half of all habitable land, with grazing taking far more area than cropland does.",
    "source": "FAO land use statistics"
  },
  {
    "id": "water-to-produce-a-kilo-of-beef",
    "prompt": "How many litres of water does it take to produce one kilogram of beef?",
    "unit": "litres",
    "answerValue": 15000,
    "decompositionHint": "Almost all of it is the water grown into the feed the animal eats over its life, not water the animal drinks.",
    "source": "Water footprint assessments, roughly 15,000 litres per kg"
  },
  {
    "id": "water-to-grow-a-loaf-of-bread",
    "prompt": "How much water is needed to grow the wheat for a single loaf of bread, in litres?",
    "unit": "litres",
    "answerValue": 1000,
    "decompositionHint": "A loaf needs roughly 650 grams of wheat, and growing wheat consumes about 1,500 litres of water per kilogram. An order of magnitude less than beef, which must feed a large animal for years first.",
    "source": "Water footprint assessments, ~1,500 litres per kg of wheat"
  },
  {
    "id": "chickens-slaughtered-per-year",
    "prompt": "How many chickens are slaughtered worldwide for meat each year?",
    "asOf": 2025,
    "unit": "chickens",
    "answerValue": 75000000000,
    "decompositionHint": "The standing population is about 26 billion and a broiler reaches slaughter weight in roughly six weeks, so the flock turns over several times a year.",
    "source": "FAO livestock slaughter statistics"
  },
  {
    "id": "fish-caught-per-year",
    "prompt": "How many tonnes of fish are caught from the wild worldwide each year?",
    "asOf": 2025,
    "unit": "tonnes",
    "answerValue": 90000000,
    "decompositionHint": "Wild capture has been roughly flat for decades; almost all growth in seafood supply since the 1990s has come from farming instead.",
    "source": "FAO fisheries statistics"
  },
  {
    "id": "surgeries-performed-worldwide",
    "prompt": "How many surgical operations are performed worldwide each year?",
    "asOf": 2025,
    "unit": "operations",
    "answerValue": 310000000,
    "decompositionHint": "Roughly one operation per 25 people per year, though access is very unevenly distributed between rich and poor countries.",
    "source": "Lancet Commission on Global Surgery estimates"
  },
  {
    "id": "caesarean-births-per-year",
    "prompt": "How many babies are delivered by caesarean section worldwide each year?",
    "asOf": 2025,
    "unit": "births",
    "answerValue": 30000000,
    "decompositionHint": "There are about 135 million births a year and roughly a fifth are surgical, though rates range from under 5 percent to over 50 by country.",
    "source": "WHO caesarean section rate estimates"
  },
  {
    "id": "prescriptions-filled-in-us",
    "prompt": "How many retail prescriptions are filled in the United States each year?",
    "asOf": 2025,
    "unit": "prescriptions",
    "answerValue": 6700000000,
    "decompositionHint": "About twenty per American per year on average, driven up sharply by older patients on several long-term medications.",
    "source": "US pharmacy dispensing statistics"
  },
  {
    "id": "covid-vaccine-doses-administered",
    "prompt": "How many COVID-19 vaccine doses had been administered worldwide?",
    "asOf": 2023,
    "unit": "doses",
    "answerValue": 13500000000,
    "decompositionHint": "More than one dose per person alive, achieved in under three years - the fastest mass immunisation campaign ever run.",
    "source": "WHO COVID-19 vaccination dashboard"
  },
  {
    "id": "blood-donations-per-year-worldwide",
    "prompt": "How many units of blood are donated worldwide each year?",
    "asOf": 2025,
    "unit": "donations",
    "answerValue": 120000000,
    "decompositionHint": "Roughly one donation for every 65 people, with high income countries donating at several times the rate of low income ones.",
    "source": "WHO global blood supply statistics"
  },
  {
    "id": "cigarettes-smoked-per-year",
    "prompt": "How many cigarettes are smoked worldwide each year?",
    "asOf": 2025,
    "unit": "cigarettes",
    "answerValue": 5000000000000,
    "decompositionHint": "Around a billion smokers averaging on the order of ten to fifteen cigarettes a day.",
    "source": "WHO tobacco consumption estimates"
  },
  {
    "id": "hospital-beds-worldwide",
    "prompt": "How many hospital beds are there worldwide?",
    "asOf": 2025,
    "unit": "hospital beds",
    "answerValue": 20000000,
    "decompositionHint": "Global average is roughly 2.5 beds per thousand people, ranging from under one in low income countries to over twelve in Japan and Korea.",
    "source": "WHO health infrastructure statistics"
  },
  {
    "id": "doctors-worldwide",
    "prompt": "How many physicians are there worldwide?",
    "asOf": 2025,
    "unit": "physicians",
    "answerValue": 13000000,
    "decompositionHint": "Global average is about 1.6 doctors per thousand people, again ranging over more than an order of magnitude by country.",
    "source": "WHO global health workforce statistics"
  },
  {
    "id": "operations-per-second-fastest-supercomputer",
    "prompt": "How many floating point operations per second can the fastest supercomputer perform?",
    "asOf": 2025,
    "unit": "operations/second",
    "answerValue": 1700000000000000000,
    "decompositionHint": "The exascale threshold of 10^18 was crossed in 2022. Machines are built from tens of thousands of GPUs each doing on the order of 10^14.",
    "source": "TOP500 supercomputer rankings"
  },
  {
    "id": "data-created-per-day",
    "prompt": "How many bytes of data are created worldwide each day?",
    "asOf": 2025,
    "unit": "bytes",
    "answerValue": 400000000000000000000,
    "decompositionHint": "Roughly 400 exabytes. Video streaming dominates, so estimate hours watched globally times the bitrate of a stream.",
    "source": "Industry data volume estimates"
  },
  {
    "id": "english-wikipedia-articles",
    "prompt": "How many articles does English Wikipedia contain?",
    "asOf": 2025,
    "unit": "articles",
    "answerValue": 7000000,
    "decompositionHint": "Growth has been roughly linear for over a decade at a few hundred thousand articles a year.",
    "source": "Wikipedia published statistics"
  },
  {
    "id": "lines-of-code-linux-kernel",
    "prompt": "How many lines of code are in the Linux kernel?",
    "asOf": 2025,
    "unit": "lines of code",
    "answerValue": 35000000,
    "decompositionHint": "Well over half is device drivers rather than core kernel logic, which is why the number is far larger than people expect.",
    "source": "Linux kernel source statistics"
  },
  {
    "id": "websites-on-the-internet",
    "prompt": "How many websites exist on the internet?",
    "asOf": 2025,
    "unit": "websites",
    "answerValue": 1100000000,
    "decompositionHint": "Counted by registered hostnames. The large majority are parked or inactive, with only a couple of hundred million actually maintained.",
    "source": "Netcraft web server surveys"
  },
  {
    "id": "undersea-cable-length",
    "prompt": "How many kilometres of submarine communications cable lie on the ocean floor?",
    "asOf": 2025,
    "unit": "kilometres",
    "answerValue": 1400000,
    "decompositionHint": "A few hundred cables, many spanning entire oceans. Enough to wrap the equator dozens of times over.",
    "source": "TeleGeography submarine cable statistics"
  },
  {
    "id": "electricity-used-by-data-centres",
    "prompt": "How many terawatt hours of electricity do the world's data centres consume in a year?",
    "asOf": 2025,
    "unit": "terawatt hours",
    "answerValue": 460,
    "decompositionHint": "A little under two percent of global electricity - comparable to the total consumption of a mid-sized industrialised country.",
    "source": "International Energy Agency data centre estimates"
  },
  {
    "id": "active-satellites-in-orbit",
    "prompt": "How many active satellites are orbiting the Earth?",
    "asOf": 2025,
    "unit": "satellites",
    "answerValue": 10000,
    "decompositionHint": "The count has risen roughly tenfold in a decade, dominated by a single large communications constellation in low orbit.",
    "source": "UNOOSA and satellite tracking registries"
  },
  {
    "id": "tracked-space-debris",
    "prompt": "How many pieces of space debris large enough to track are in Earth orbit?",
    "asOf": 2025,
    "unit": "tracked objects",
    "answerValue": 35000,
    "decompositionHint": "Tracking covers objects above roughly ten centimetres. Smaller fragments are far more numerous but cannot be catalogued individually.",
    "source": "ESA space debris office estimates"
  },
  {
    "id": "bits-in-a-smartphone-photo",
    "prompt": "How many bits of data are in a typical smartphone photograph?",
    "unit": "bits",
    "answerValue": 32000000,
    "decompositionHint": "A compressed photo is around four megabytes. Multiply by 8 bits per byte and by a million bytes per megabyte.",
    "source": "Typical JPEG file sizes from modern phone cameras"
  },
  {
    "id": "world-gdp",
    "prompt": "What is the total annual economic output of the world, in US dollars?",
    "asOf": 2025,
    "unit": "US dollars",
    "answerValue": 105000000000000,
    "decompositionHint": "About 8 billion people producing roughly 13,000 dollars each on average, though the median is far below the mean.",
    "source": "World Bank and IMF world GDP estimates"
  },
  {
    "id": "global-military-spending",
    "prompt": "How much do the world's governments spend on their militaries in a year, in US dollars?",
    "asOf": 2025,
    "unit": "US dollars",
    "answerValue": 2400000000000,
    "decompositionHint": "A little over two percent of world GDP, with the single largest spender accounting for roughly 40 percent of the total.",
    "source": "SIPRI military expenditure database"
  },
  {
    "id": "value-of-all-gold-ever-mined",
    "prompt": "What is all the gold ever mined worth, in US dollars?",
    "asOf": 2025,
    "unit": "US dollars",
    "answerValue": 17000000000000,
    "decompositionHint": "About 212,000 tonnes exist. Convert to grams and multiply by a gold price on the order of 80 dollars per gram.",
    "source": "World Gold Council stock figures at prevailing prices"
  },
  {
    "id": "daily-foreign-exchange-volume",
    "prompt": "How much currency is traded on foreign exchange markets each day, in US dollars?",
    "asOf": 2025,
    "unit": "US dollars",
    "answerValue": 7500000000000,
    "decompositionHint": "More changes hands in a few days than the entire world produces in a year, because most of it is trading rather than trade.",
    "source": "Bank for International Settlements triennial survey"
  },
  {
    "id": "people-in-extreme-poverty",
    "prompt": "How many people live in extreme poverty worldwide?",
    "asOf": 2025,
    "unit": "people",
    "answerValue": 700000000,
    "decompositionHint": "Under nine percent of the world, down from roughly 40 percent in 1990 - one of the largest changes of the last half century.",
    "source": "World Bank poverty estimates"
  },
  {
    "id": "global-remittances",
    "prompt": "How much money do migrant workers send home across borders each year, in US dollars?",
    "asOf": 2025,
    "unit": "US dollars",
    "answerValue": 860000000000,
    "decompositionHint": "Substantially more than all official development aid combined, and for several countries it exceeds a tenth of national income.",
    "source": "World Bank remittance statistics"
  },
  {
    "id": "cost-of-the-apollo-program",
    "prompt": "What did the Apollo programme cost in total, in 2020 US dollars?",
    "unit": "US dollars",
    "answerValue": 280000000000,
    "decompositionHint": "About 25 billion in period dollars across the 1960s, inflated to the present by roughly a factor of ten.",
    "source": "NASA historical budget analyses"
  },
  {
    "id": "cost-of-the-space-station",
    "prompt": "What has the International Space Station cost to build and operate, in US dollars?",
    "unit": "US dollars",
    "answerValue": 150000000000,
    "decompositionHint": "Spread across multiple space agencies over three decades, making it among the most expensive objects ever constructed.",
    "source": "Combined agency ISS cost estimates"
  },
  {
    "id": "bridges-in-the-us",
    "prompt": "How many bridges are there in the United States?",
    "asOf": 2025,
    "unit": "bridges",
    "answerValue": 620000,
    "decompositionHint": "Any span over about six metres counts, so the total is dominated by small highway and rural crossings rather than famous structures.",
    "source": "US Federal Highway Administration national bridge inventory"
  },
  {
    "id": "railway-length-worldwide",
    "prompt": "How many kilometres of railway line exist worldwide?",
    "asOf": 2025,
    "unit": "kilometres",
    "answerValue": 1300000,
    "decompositionHint": "Roughly thirty times the Earth's circumference, concentrated in the United States, China, Russia and India.",
    "source": "International Union of Railways statistics"
  },
  {
    "id": "merchant-ships-at-sea",
    "prompt": "How many merchant ships make up the world's commercial fleet?",
    "asOf": 2025,
    "unit": "ships",
    "answerValue": 100000,
    "decompositionHint": "Around 100,000 vessels above 100 gross tonnes carry roughly 90 percent of world trade by volume.",
    "source": "UNCTAD review of maritime transport"
  },
  {
    "id": "airports-worldwide",
    "prompt": "How many airports are there worldwide?",
    "asOf": 2025,
    "unit": "airports",
    "answerValue": 40000,
    "decompositionHint": "Counting anything with a defined runway. Only a few thousand handle scheduled commercial passenger flights.",
    "source": "Global aviation infrastructure databases"
  },
  {
    "id": "street-lights-worldwide",
    "prompt": "How many street lights are there worldwide?",
    "asOf": 2025,
    "unit": "street lights",
    "answerValue": 320000000,
    "decompositionHint": "Roughly one for every 25 people. Estimate from the length of lit road worldwide and typical spacing of about 30 metres.",
    "source": "Municipal lighting inventories and industry estimates"
  },
  {
    "id": "kilometres-driven-worldwide",
    "prompt": "How many kilometres do the world's vehicles travel in a year, in total?",
    "asOf": 2025,
    "unit": "kilometres",
    "answerValue": 16000000000000,
    "decompositionHint": "About 1.5 billion vehicles each covering on the order of 11,000 km a year.",
    "source": "Derived from global vehicle stock and average annual distance"
  },
  {
    "id": "length-of-the-london-underground",
    "prompt": "How many kilometres of track does the London Underground have?",
    "unit": "kilometres",
    "answerValue": 402,
    "decompositionHint": "Eleven lines serving 272 stations. Estimate average line length and multiply, remembering much of the network is above ground.",
    "source": "Transport for London network statistics"
  },
  {
    "id": "windows-in-new-york-city",
    "prompt": "How many windows are there in New York City?",
    "unit": "windows",
    "answerValue": 10000000,
    "decompositionHint": "Estimate buildings in the city, average floors each, and windows per floor. A classic decomposition problem where the count of small buildings dominates.",
    "source": "Order-of-magnitude estimate from building stock"
  },
  {
    "id": "haircuts-in-the-us-per-year",
    "prompt": "How many haircuts are given in the United States in a year?",
    "asOf": 2025,
    "unit": "haircuts",
    "answerValue": 1300000000,
    "decompositionHint": "335 million people getting a haircut roughly every three months, adjusting down for those who cut their own or none at all.",
    "source": "Order-of-magnitude estimate from population and haircut frequency"
  },
  {
    "id": "bricks-in-a-house",
    "prompt": "How many bricks are in a typical two storey brick house?",
    "unit": "bricks",
    "answerValue": 8000,
    "decompositionHint": "Estimate the total external wall area, then use roughly 60 bricks per square metre for a single skin of standard brick.",
    "source": "Construction estimating rules of thumb"
  },
  {
    "id": "nails-in-a-wooden-house",
    "prompt": "How many nails are used to build a wooden house?",
    "unit": "nails",
    "answerValue": 30000,
    "decompositionHint": "Framing, sheathing, flooring and roofing each consume thousands. Estimate the total length of timber and a nail every few tens of centimetres.",
    "source": "Construction estimating rules of thumb"
  },
  {
    "id": "sheets-of-paper-from-a-tree",
    "prompt": "How many sheets of A4 paper can be made from one average tree?",
    "unit": "sheets",
    "answerValue": 8000,
    "decompositionHint": "A tree yields on the order of 50 kg of usable pulp, and a sheet of A4 weighs about 5 grams.",
    "source": "Paper industry yield estimates"
  },
  {
    "id": "drops-of-water-in-a-bathtub",
    "prompt": "How many drops of water fill a bathtub?",
    "unit": "drops",
    "answerValue": 3000000,
    "decompositionHint": "A bath holds roughly 150 litres and a drop is about 0.05 millilitres. Convert both to the same unit and divide.",
    "source": "Derived from typical bath volume and drop size"
  },
  {
    "id": "grains-of-rice-in-a-kilogram",
    "prompt": "How many grains of rice are in one kilogram?",
    "unit": "grains of rice",
    "answerValue": 50000,
    "decompositionHint": "A single grain weighs roughly 0.02 grams, so a kilogram holds tens of thousands.",
    "source": "Derived from typical rice grain mass"
  },
  {
    "id": "words-in-the-bible",
    "prompt": "How many words are in the Bible?",
    "unit": "words",
    "answerValue": 780000,
    "decompositionHint": "Around 1,200 pages of dense two-column text at roughly 600 words a page.",
    "source": "Word counts of the King James translation"
  },
  {
    "id": "steps-to-climb-the-eiffel-tower",
    "prompt": "How many steps are there to the top of the Eiffel Tower?",
    "unit": "steps",
    "answerValue": 1665,
    "decompositionHint": "The tower is 300 metres tall and a step rises about 18 centimetres, though the public stairs stop well short of the summit.",
    "source": "Eiffel Tower official figures"
  },
  {
    "id": "blocks-in-the-great-pyramid",
    "prompt": "How many stone blocks make up the Great Pyramid of Giza?",
    "unit": "blocks",
    "answerValue": 2300000,
    "decompositionHint": "The pyramid's volume is about 2.6 million cubic metres and an average block is roughly one cubic metre.",
    "source": "Egyptological surveys of the Great Pyramid"
  },
  {
    "id": "ways-to-shuffle-a-deck-of-cards",
    "prompt": "How many different orders can a standard 52 card deck be shuffled into?",
    "unit": "orderings",
    "answerValue": 8.07e+67,
    "decompositionHint": "52 factorial. Any well shuffled deck has almost certainly never existed before in that order anywhere in history.",
    "source": "52 factorial = 8.07x10^67"
  },
  {
    "id": "legal-chess-positions",
    "prompt": "Roughly how many legal positions are possible in chess?",
    "unit": "positions",
    "answerValue": 4.8e+44,
    "decompositionHint": "Far fewer than the naive count of pieces on squares, because most arrangements cannot be reached by legal play.",
    "source": "Computational enumeration of legal chess positions"
  },
  {
    "id": "possible-sudoku-grids",
    "prompt": "How many valid completed 9x9 sudoku grids are there?",
    "unit": "grids",
    "answerValue": 6.67e+21,
    "decompositionHint": "Counted by exhaustive computation combined with symmetry arguments rather than by any simple formula.",
    "source": "Felgenhauer and Jarvis enumeration, 6.67x10^21"
  },
  {
    "id": "songs-on-streaming-services",
    "prompt": "How many tracks are available on a major music streaming service?",
    "asOf": 2025,
    "unit": "tracks",
    "answerValue": 100000000,
    "decompositionHint": "Uploads run to over 100,000 new tracks a day, so the catalogue grows by tens of millions a year.",
    "source": "Published streaming platform catalogue sizes"
  },
  {
    "id": "feature-films-released-per-year",
    "prompt": "How many feature films are released worldwide each year?",
    "asOf": 2025,
    "unit": "films",
    "answerValue": 10000,
    "decompositionHint": "India alone releases well over a thousand. Summing the major producing countries and adding independents reaches five figures.",
    "source": "National film industry statistics"
  },
  {
    "id": "golf-balls-lost-in-the-us-per-year",
    "prompt": "How many golf balls are lost on United States courses each year?",
    "asOf": 2025,
    "unit": "golf balls",
    "answerValue": 300000000,
    "decompositionHint": "Around 25 million golfers playing roughly 20 rounds a year and losing on the order of one ball per round.",
    "source": "Golf industry estimates"
  },
  {
    "id": "hours-of-television-watched-per-person",
    "prompt": "How many hours of television and streaming video does an average person watch in a year?",
    "asOf": 2025,
    "unit": "hours",
    "answerValue": 1400,
    "decompositionHint": "Roughly three to four hours a day across 365 days, which adds up to a substantial fraction of waking life.",
    "source": "Media consumption surveys"
  },
  {
    "id": "population-of-the-roman-empire",
    "prompt": "What was the population of the Roman Empire at its peak?",
    "asOf": 117,
    "unit": "people",
    "answerValue": 60000000,
    "decompositionHint": "Roughly a fifth of all humans alive at the time, in an era when world population was around 250 million.",
    "source": "Historical demography of the Roman Empire"
  },
  {
    "id": "soldiers-in-the-roman-army",
    "prompt": "How many soldiers served in the Roman army at its height?",
    "asOf": 200,
    "unit": "soldiers",
    "answerValue": 400000,
    "decompositionHint": "About thirty legions of roughly 5,000 men each, plus auxiliary forces of comparable total size.",
    "source": "Roman military history estimates"
  },
  {
    "id": "scrolls-in-the-library-of-alexandria",
    "prompt": "How many scrolls did the Library of Alexandria hold at its height?",
    "asOf": -250,
    "unit": "scrolls",
    "answerValue": 500000,
    "decompositionHint": "Ancient sources disagree wildly. Note a scroll held far less text than a modern book, so the collection was smaller than the number suggests.",
    "source": "Ancient sources, variously 40,000 to 700,000 scrolls"
  },
  {
    "id": "people-at-woodstock",
    "prompt": "How many people attended the Woodstock festival?",
    "asOf": 1969,
    "unit": "people",
    "answerValue": 400000,
    "decompositionHint": "Tickets sold were a fraction of attendance once the fences came down. Estimate from aerial photographs and crowd density.",
    "source": "Contemporary crowd estimates"
  },
  {
    "id": "world-population-at-agriculture",
    "prompt": "What was the world's human population when agriculture first began?",
    "asOf": -10000,
    "unit": "people",
    "answerValue": 5000000,
    "decompositionHint": "Hunter gatherer densities are very low, on the order of one person per ten square kilometres of habitable land.",
    "source": "Archaeological and demographic reconstructions"
  }
]

if (typeof module !== "undefined") module.exports = QUESTIONS
