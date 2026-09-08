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
    "prompt": "How many lakes larger than 0.2 hectares are there on Earth?",
    "unit": "lakes",
    "answerValue": 117000000,
    "decompositionHint": "Small lakes vastly outnumber large ones on a steep size distribution, so the count is dominated by the smallest size counted. Above one square kilometre there are only a few hundred thousand.",
    "source": "Verpoorter et al. 2014, Geophysical Research Letters - ~117 million lakes above 0.2 ha"
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
    "answerValue": 5000000000,
    "decompositionHint": "A grain about 0.5 mm across occupies roughly 1.25x10^-10 cubic metres. Divide one cubic metre by that, then multiply by a packing fraction of about 0.6, since spheres cannot fill space completely.",
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
    "answerValue": 53000,
    "decompositionHint": "42.2 km divided by a running stride of roughly 0.8 metres, which is longer than a walking stride.",
    "source": "Derived from marathon distance and typical running stride"
  },
  {
    "id": "calories-burned-in-a-marathon",
    "prompt": "How many kilocalories does a runner burn completing a marathon?",
    "unit": "kilocalories",
    "answerValue": 2900,
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
    "answerValue": 17000,
    "decompositionHint": "A loaf takes roughly 500 grams of flour, and milling yields about 72% flour from the grain, so around 700 grams of wheat. A single grain weighs about 0.04 grams.",
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
  },
  {
    "id": "energy-in-a-aa-battery",
    "prompt": "How many joules of energy does a single AA alkaline battery hold?",
    "unit": "joules",
    "answerValue": 10000,
    "decompositionHint": "Around 2.5 amp hours at 1.5 volts. Convert amp hours to coulombs (multiply by 3600) and multiply by voltage.",
    "source": "Alkaline cell capacity specifications"
  },
  {
    "id": "energy-in-a-litre-of-petrol",
    "prompt": "How many joules of energy are released by burning one litre of petrol?",
    "unit": "joules",
    "answerValue": 34000000,
    "decompositionHint": "Petrol carries about 45 megajoules per kilogram and weighs roughly 0.75 kg per litre.",
    "source": "Standard fuel energy density tables"
  },
  {
    "id": "power-of-a-large-power-station",
    "prompt": "How many watts does a large nuclear power station generate?",
    "unit": "watts",
    "answerValue": 1000000000,
    "decompositionHint": "A single large reactor is around a gigawatt, which is roughly the average electricity demand of a million people in a wealthy country.",
    "source": "Typical reactor nameplate capacity"
  },
  {
    "id": "household-electricity-per-year",
    "prompt": "How many kilowatt hours of electricity does a typical household use in a year?",
    "asOf": 2025,
    "unit": "kilowatt hours",
    "answerValue": 4000,
    "decompositionHint": "Averages range from about 2,500 kWh in much of Europe to over 10,000 in the United States. Heating and hot water dominate where they are electric.",
    "source": "National household electricity consumption statistics"
  },
  {
    "id": "solar-panel-output-per-year",
    "prompt": "How many kilowatt hours does a single rooftop solar panel produce in a year?",
    "unit": "kilowatt hours",
    "answerValue": 450,
    "decompositionHint": "A panel is roughly 400 watts peak, and a temperate site delivers something like 1,100 full-sun-equivalent hours a year.",
    "source": "Typical panel rating and capacity factor"
  },
  {
    "id": "energy-to-boil-a-kettle",
    "prompt": "How many joules does it take to boil a litre of water from room temperature?",
    "unit": "joules",
    "answerValue": 340000,
    "decompositionHint": "Water needs 4,180 joules per kilogram per degree. One kilogram raised about 80 degrees gives the answer, before losses.",
    "source": "Specific heat capacity of water"
  },
  {
    "id": "global-electricity-generation",
    "prompt": "How many terawatt hours of electricity does the world generate in a year?",
    "asOf": 2025,
    "unit": "terawatt hours",
    "answerValue": 30000,
    "decompositionHint": "About 8 billion people averaging some 3,700 kWh each, though consumption per person varies by more than a hundredfold between countries.",
    "source": "IEA world electricity generation statistics"
  },
  {
    "id": "wind-turbine-output-per-year",
    "prompt": "How many megawatt hours does one large wind turbine produce in a year?",
    "unit": "megawatt hours",
    "answerValue": 9000,
    "decompositionHint": "A modern onshore turbine is around 3 MW and runs at roughly a 35% capacity factor across the 8,760 hours in a year.",
    "source": "Typical turbine rating and onshore capacity factor"
  },
  {
    "id": "energy-in-a-lightning-strike-vs-household",
    "prompt": "For how many days could a typical household run on the energy in one lightning bolt?",
    "unit": "days",
    "answerValue": 4,
    "decompositionHint": "A bolt carries roughly 5 gigajoules, or about 1,400 kWh. A household uses on the order of 300 kWh a month.",
    "source": "Derived from lightning energy and household consumption"
  },
  {
    "id": "calories-in-a-kilogram-of-fat",
    "prompt": "How many kilocalories are stored in one kilogram of body fat?",
    "unit": "kilocalories",
    "answerValue": 7700,
    "decompositionHint": "Pure fat carries about 9 kcal per gram, and body fat tissue is roughly 85% fat with the rest water and connective tissue.",
    "source": "Standard nutrition figures"
  },
  {
    "id": "coal-burned-per-year-worldwide",
    "prompt": "How many tonnes of coal are burned worldwide in a year?",
    "asOf": 2025,
    "unit": "tonnes",
    "answerValue": 8500000000,
    "decompositionHint": "Roughly a tonne per person on Earth per year, dominated by electricity generation and steelmaking in a handful of countries.",
    "source": "IEA coal consumption statistics"
  },
  {
    "id": "oil-consumed-per-day-worldwide",
    "prompt": "How many barrels of oil does the world consume each day?",
    "asOf": 2025,
    "unit": "barrels/day",
    "answerValue": 103000000,
    "decompositionHint": "About 100 million barrels, which works out near 1.6 litres per person per day averaged across everyone alive.",
    "source": "IEA and OPEC demand figures"
  },
  {
    "id": "speed-to-reach-orbit",
    "prompt": "How fast must a spacecraft travel to stay in low Earth orbit, in kilometres per hour?",
    "unit": "kilometres per hour",
    "answerValue": 28000,
    "decompositionHint": "About 7.8 km/s. Convert to hours by multiplying by 3,600. It circles the planet in roughly 90 minutes.",
    "source": "Orbital mechanics for low Earth orbit"
  },
  {
    "id": "altitude-of-the-space-station",
    "prompt": "How high above the Earth does the International Space Station orbit, in kilometres?",
    "unit": "kilometres",
    "answerValue": 410,
    "decompositionHint": "Low enough that residual atmosphere drags it down and it needs periodic reboosting - only about 1/16th of Earth's radius above the surface.",
    "source": "ISS operational orbital altitude"
  },
  {
    "id": "people-who-have-been-to-space",
    "prompt": "How many people have travelled to space?",
    "asOf": 2025,
    "unit": "people",
    "answerValue": 700,
    "decompositionHint": "Six decades of spaceflight at an average of roughly a dozen people a year, rising sharply with recent commercial flights.",
    "source": "Astronaut and cosmonaut flight records"
  },
  {
    "id": "people-who-have-walked-on-the-moon",
    "prompt": "How many people have walked on the Moon?",
    "unit": "people",
    "answerValue": 12,
    "decompositionHint": "Six successful landing missions, two crew on the surface each time.",
    "source": "Apollo mission records"
  },
  {
    "id": "cost-per-kilogram-to-orbit",
    "prompt": "What does it cost to put one kilogram into low Earth orbit, in US dollars?",
    "asOf": 2025,
    "unit": "US dollars",
    "answerValue": 2500,
    "decompositionHint": "Reusable boosters have cut this by more than an order of magnitude from the shuttle era, when it ran into the tens of thousands.",
    "source": "Published commercial launch pricing"
  },
  {
    "id": "asteroids-discovered",
    "prompt": "How many asteroids have been discovered and catalogued?",
    "asOf": 2025,
    "unit": "asteroids",
    "answerValue": 1400000,
    "decompositionHint": "Automated sky surveys add tens of thousands a year, so the catalogue has grown by more than a factor of ten since the 1990s.",
    "source": "Minor Planet Center catalogue"
  },
  {
    "id": "distance-to-the-moon",
    "prompt": "How far away is the Moon, in kilometres?",
    "unit": "kilometres",
    "answerValue": 384400,
    "decompositionHint": "About thirty Earth diameters. Light takes a little over a second to cross the gap.",
    "source": "Mean Earth-Moon distance"
  },
  {
    "id": "time-for-sunlight-to-reach-earth",
    "prompt": "How many seconds does sunlight take to reach the Earth?",
    "unit": "seconds",
    "answerValue": 500,
    "decompositionHint": "150 million kilometres divided by 300,000 kilometres per second.",
    "source": "Astronomical unit divided by the speed of light"
  },
  {
    "id": "moons-in-the-solar-system",
    "prompt": "How many moons are known in the solar system?",
    "asOf": 2025,
    "unit": "moons",
    "answerValue": 400,
    "decompositionHint": "Saturn and Jupiter account for most of them, and the count keeps rising as surveys find smaller irregular satellites.",
    "source": "IAU confirmed natural satellite counts"
  },
  {
    "id": "rocket-launches-per-year",
    "prompt": "How many orbital rocket launches take place worldwide in a year?",
    "asOf": 2025,
    "unit": "launches",
    "answerValue": 250,
    "decompositionHint": "Roughly one every day and a half, more than double the rate of a decade ago, driven largely by satellite constellation deployment.",
    "source": "Orbital launch logs"
  },
  {
    "id": "energy-in-a-hurricane",
    "prompt": "How many joules of energy does a hurricane release in a single day through cloud formation?",
    "unit": "joules",
    "answerValue": 50000000000000000000,
    "decompositionHint": "Dominated by latent heat as water vapour condenses. It is several hundred times the world's daily electricity generation.",
    "source": "NOAA hurricane energy estimates"
  },
  {
    "id": "raindrops-per-cubic-metre-of-cloud",
    "prompt": "How many water droplets are in one cubic metre of cloud?",
    "unit": "droplets",
    "answerValue": 100000000,
    "decompositionHint": "Cloud droplets are tiny, around 20 micrometres, and a cubic metre of cloud holds under a gram of liquid water in total.",
    "source": "Cloud physics droplet concentration figures"
  },
  {
    "id": "lightning-bolt-temperature",
    "prompt": "How hot does the air in a lightning channel get, in kelvin?",
    "unit": "kelvin",
    "answerValue": 30000,
    "decompositionHint": "Several times hotter than the surface of the Sun, which is why the surrounding air expands explosively and makes thunder.",
    "source": "Atmospheric physics measurements of return stroke temperature"
  },
  {
    "id": "snowflakes-in-a-cubic-metre-of-snow",
    "prompt": "How many snowflakes make up one cubic metre of fresh snow?",
    "unit": "snowflakes",
    "answerValue": 100000000,
    "decompositionHint": "Fresh snow is about a tenth the density of water, so a cubic metre holds ~100 kg of ice, and a snowflake weighs a few milligrams.",
    "source": "Derived from fresh snow density and typical flake mass"
  },
  {
    "id": "tornadoes-in-the-us-per-year",
    "prompt": "How many tornadoes are recorded in the United States each year?",
    "asOf": 2025,
    "unit": "tornadoes",
    "answerValue": 1200,
    "decompositionHint": "More than the rest of the world combined, because of the collision of Gulf moisture with dry continental air over the plains.",
    "source": "NOAA Storm Prediction Center annual counts"
  },
  {
    "id": "hottest-and-coldest-spread",
    "prompt": "What is the difference between the hottest and coldest air temperatures ever recorded on Earth, in degrees Celsius?",
    "unit": "degrees Celsius",
    "answerValue": 150,
    "decompositionHint": "Around 57 C in Death Valley against about -89 C at Vostok in Antarctica.",
    "source": "WMO verified temperature extremes"
  },
  {
    "id": "weight-of-a-cloud",
    "prompt": "How many kilograms does a typical cumulus cloud weigh?",
    "unit": "kilograms",
    "answerValue": 500000,
    "decompositionHint": "About a cubic kilometre in volume at roughly half a gram of liquid water per cubic metre. It stays up because the droplets are tiny and the air beneath is rising.",
    "source": "Derived from cumulus dimensions and liquid water content"
  },
  {
    "id": "deepest-point-in-the-ocean",
    "prompt": "How deep is the deepest point in the ocean, in metres?",
    "unit": "metres",
    "answerValue": 10900,
    "decompositionHint": "The Mariana Trench is deeper than Everest is tall, by more than a kilometre.",
    "source": "Challenger Deep depth measurements"
  },
  {
    "id": "salt-in-the-oceans",
    "prompt": "How many tonnes of salt are dissolved in the world's oceans?",
    "unit": "tonnes",
    "answerValue": 50000000000000000,
    "decompositionHint": "Seawater is about 3.5% salt by mass, and the oceans hold roughly 1.4x10^18 tonnes of water.",
    "source": "Derived from ocean mass and mean salinity"
  },
  {
    "id": "plankton-in-a-litre-of-seawater",
    "prompt": "How many phytoplankton cells are in one litre of surface seawater?",
    "unit": "cells",
    "answerValue": 1000000,
    "decompositionHint": "Concentrations run to thousands per millilitre in productive water. Collectively they produce roughly half the oxygen in the atmosphere.",
    "source": "Marine biology cell count surveys"
  },
  {
    "id": "fish-in-the-ocean",
    "prompt": "How many individual fish are in the world's oceans?",
    "unit": "fish",
    "answerValue": 3500000000000,
    "decompositionHint": "Dominated by small mesopelagic species rather than the large fish people picture, which is why the estimate is far larger than fishery statistics suggest.",
    "source": "Marine biomass estimates, commonly cited around 3.5 trillion"
  },
  {
    "id": "coral-reef-area",
    "prompt": "How many square kilometres of coral reef are there worldwide?",
    "unit": "square kilometres",
    "answerValue": 280000,
    "decompositionHint": "Under a tenth of a percent of the ocean floor, yet home to roughly a quarter of all marine species.",
    "source": "Global coral reef mapping surveys"
  },
  {
    "id": "waves-hitting-a-beach-per-day",
    "prompt": "How many waves break on a given beach in one day?",
    "unit": "waves",
    "answerValue": 8000,
    "decompositionHint": "Sets arrive roughly every ten seconds, so count the number of ten second intervals in 24 hours.",
    "source": "Typical ocean swell period"
  },
  {
    "id": "water-evaporating-from-oceans-per-year",
    "prompt": "How many cubic kilometres of water evaporate from the oceans each year?",
    "unit": "cubic kilometres",
    "answerValue": 430000,
    "decompositionHint": "Almost all of global precipitation ultimately comes from ocean evaporation, so it is close to the total rain and snow falling worldwide.",
    "source": "Global hydrological cycle budgets"
  },
  {
    "id": "krill-in-the-southern-ocean",
    "prompt": "How many tonnes of Antarctic krill live in the Southern Ocean?",
    "unit": "tonnes",
    "answerValue": 400000000,
    "decompositionHint": "One of the largest single-species biomasses on Earth, and the base of the food chain that supports whales, seals and penguins.",
    "source": "Antarctic krill biomass surveys"
  },
  {
    "id": "steps-in-a-football-match",
    "prompt": "How far does a professional footballer run during a 90 minute match, in kilometres?",
    "unit": "kilometres",
    "answerValue": 10,
    "decompositionHint": "Mostly walking and jogging with short sprints. Averaging a little over 6 km/h across 90 minutes gets you close.",
    "source": "Match tracking data for outfield players"
  },
  {
    "id": "golf-balls-made-per-year",
    "prompt": "How many golf balls are manufactured worldwide each year?",
    "asOf": 2025,
    "unit": "golf balls",
    "answerValue": 1200000000,
    "decompositionHint": "Roughly 60 million golfers losing and replacing on the order of twenty balls a year each.",
    "source": "Golf equipment industry production estimates"
  },
  {
    "id": "tennis-balls-used-at-wimbledon",
    "prompt": "How many tennis balls are used during the Wimbledon championships?",
    "unit": "tennis balls",
    "answerValue": 55000,
    "decompositionHint": "Balls are changed every nine games, and there are hundreds of matches across the fortnight including qualifying and doubles.",
    "source": "Wimbledon published tournament figures"
  },
  {
    "id": "marathon-finishers-per-year",
    "prompt": "How many people finish a marathon worldwide each year?",
    "asOf": 2025,
    "unit": "finishers",
    "answerValue": 1100000,
    "decompositionHint": "Thousands of events, with the largest half dozen accounting for well over a hundred thousand finishers between them.",
    "source": "Running event participation statistics"
  },
  {
    "id": "olympic-medals-awarded",
    "prompt": "How many medals are awarded at a modern summer Olympic Games?",
    "unit": "medals",
    "answerValue": 1000,
    "decompositionHint": "Around 330 events, each awarding gold, silver and bronze, with team events multiplying the physical medal count further.",
    "source": "Recent summer Olympic event and medal counts"
  },
  {
    "id": "swimming-pool-lengths-in-a-mile",
    "prompt": "How many lengths of a 25 metre pool make up a mile?",
    "unit": "lengths",
    "answerValue": 64,
    "decompositionHint": "A mile is about 1,609 metres. Divide by the length of the pool.",
    "source": "Direct unit conversion"
  },
  {
    "id": "heartbeats-during-a-marathon",
    "prompt": "How many times does a runner's heart beat during a marathon?",
    "unit": "heartbeats",
    "answerValue": 26000,
    "decompositionHint": "Around 160 beats a minute sustained for roughly four hours.",
    "source": "Derived from typical racing heart rate and finish time"
  },
  {
    "id": "footballs-made-per-year",
    "prompt": "How many footballs are manufactured worldwide each year?",
    "asOf": 2025,
    "unit": "footballs",
    "answerValue": 40000000,
    "decompositionHint": "A large share come from a single manufacturing cluster in Pakistan. Think of one ball per two hundred people on Earth per year.",
    "source": "Sporting goods manufacturing estimates"
  },
  {
    "id": "notes-in-a-piano-piece",
    "prompt": "How many individual notes does a pianist play in a typical three minute piece?",
    "unit": "notes",
    "answerValue": 2000,
    "decompositionHint": "Perhaps ten notes a second in busy passages, far fewer in slow ones. Average a few per second across 180 seconds.",
    "source": "Order-of-magnitude estimate from typical note density"
  },
  {
    "id": "strings-in-a-piano",
    "prompt": "How many strings are inside a grand piano?",
    "unit": "strings",
    "answerValue": 230,
    "decompositionHint": "88 keys, but most notes use two or three strings struck together, with only the lowest bass notes using a single thick string.",
    "source": "Piano construction references"
  },
  {
    "id": "musicians-in-a-symphony-orchestra",
    "prompt": "How many musicians play in a full symphony orchestra?",
    "unit": "musicians",
    "answerValue": 90,
    "decompositionHint": "Strings are the bulk of it at around sixty, with woodwind, brass and percussion making up the rest.",
    "source": "Standard orchestral complement"
  },
  {
    "id": "paintings-in-the-louvre",
    "prompt": "How many works of art are held by the Louvre?",
    "asOf": 2025,
    "unit": "works",
    "answerValue": 500000,
    "decompositionHint": "Only a small fraction is on display at any time; most of the collection is in storage.",
    "source": "Louvre published collection figures"
  },
  {
    "id": "books-in-the-library-of-congress",
    "prompt": "How many books does the Library of Congress hold?",
    "asOf": 2025,
    "unit": "books",
    "answerValue": 25000000,
    "decompositionHint": "Its total collection runs to well over 170 million items, but most of that is manuscripts, maps, photographs and recordings rather than books.",
    "source": "Library of Congress collection statistics"
  },
  {
    "id": "songs-recorded-in-history",
    "prompt": "How many distinct songs have been commercially recorded in history?",
    "asOf": 2025,
    "unit": "songs",
    "answerValue": 100000000,
    "decompositionHint": "Streaming catalogues alone list around a hundred million tracks, which is a reasonable proxy for everything ever released.",
    "source": "Streaming platform catalogue sizes as a proxy"
  },
  {
    "id": "words-in-a-feature-film-script",
    "prompt": "How many words are in a typical feature film screenplay?",
    "unit": "words",
    "answerValue": 20000,
    "decompositionHint": "Roughly 110 pages at one minute of screen time per page, and a screenplay page carries far fewer words than a novel page.",
    "source": "Standard screenplay formatting conventions"
  },
  {
    "id": "words-in-the-english-language",
    "prompt": "How many words are listed in a comprehensive English dictionary?",
    "unit": "words",
    "answerValue": 600000,
    "decompositionHint": "Far more than any person knows. An educated native speaker has a vocabulary of perhaps 20,000 to 35,000 word families.",
    "source": "Oxford English Dictionary headword counts"
  },
  {
    "id": "words-an-adult-knows",
    "prompt": "How many words does an average adult native English speaker know?",
    "unit": "words",
    "answerValue": 30000,
    "decompositionHint": "Vocabulary tests suggest steady growth of a few words a day through childhood, plateauing in adulthood.",
    "source": "Vocabulary size research"
  },
  {
    "id": "languages-spoken-worldwide",
    "prompt": "How many languages are spoken in the world?",
    "asOf": 2025,
    "unit": "languages",
    "answerValue": 7000,
    "decompositionHint": "Around half have fewer than ten thousand speakers, and a language dies roughly every few weeks.",
    "source": "Ethnologue language counts"
  },
  {
    "id": "characters-needed-to-read-chinese",
    "prompt": "How many Chinese characters do you need to know to read a newspaper?",
    "unit": "characters",
    "answerValue": 3000,
    "decompositionHint": "The full set runs to tens of thousands, but frequency is very skewed - a few thousand covers the overwhelming majority of running text.",
    "source": "Chinese literacy standards"
  },
  {
    "id": "words-spoken-per-day",
    "prompt": "How many words does an average person speak in a day?",
    "unit": "words",
    "answerValue": 16000,
    "decompositionHint": "Recording studies found men and women almost identical, contrary to the popular claim that women speak far more.",
    "source": "Mehl et al. 2007, Science"
  },
  {
    "id": "letters-in-a-typical-novel",
    "prompt": "How many individual letters are printed in an average novel?",
    "unit": "letters",
    "answerValue": 450000,
    "decompositionHint": "About 90,000 words at roughly five letters each.",
    "source": "Derived from typical novel length and word length"
  },
  {
    "id": "concrete-produced-per-year",
    "prompt": "How many tonnes of concrete are produced worldwide each year?",
    "asOf": 2025,
    "unit": "tonnes",
    "answerValue": 30000000000,
    "decompositionHint": "By mass the most used material on Earth after water - roughly four tonnes per person per year.",
    "source": "Global cement and concrete industry statistics"
  },
  {
    "id": "steel-produced-per-year",
    "prompt": "How many kilograms of steel are produced for each person on Earth in a year?",
    "asOf": 2025,
    "unit": "kilograms per person",
    "answerValue": 240,
    "decompositionHint": "World steel output is around 1.9 billion tonnes against a population of 8 billion. China alone makes over half of it.",
    "source": "World Steel Association output divided by world population"
  },
  {
    "id": "plastic-produced-per-year",
    "prompt": "How many tonnes of plastic have been manufactured in total since mass production began in the 1950s?",
    "asOf": 2025,
    "unit": "tonnes",
    "answerValue": 9500000000,
    "decompositionHint": "Annual output is around 400 million tonnes now but was tiny in the 1950s and has grown roughly exponentially, so the cumulative total is around twenty times the current annual figure.",
    "source": "Geyer, Jambeck and Law 2017, Science Advances - cumulative plastics production"
  },
  {
    "id": "cement-in-a-house-foundation",
    "prompt": "How many tonnes of concrete go into the foundation of a typical house?",
    "unit": "tonnes",
    "answerValue": 30,
    "decompositionHint": "A slab of maybe 100 square metres at 150 mm thick, and concrete weighs about 2.4 tonnes per cubic metre.",
    "source": "Construction estimating figures"
  },
  {
    "id": "steel-in-the-eiffel-tower",
    "prompt": "How many tonnes of iron went into the Eiffel Tower?",
    "unit": "tonnes",
    "answerValue": 7300,
    "decompositionHint": "Famously light for its size - the iron in it would only fill a cube about 12 metres on a side if melted down.",
    "source": "Eiffel Tower construction records"
  },
  {
    "id": "rivets-in-the-eiffel-tower",
    "prompt": "How many rivets hold the Eiffel Tower together?",
    "unit": "rivets",
    "answerValue": 2500000,
    "decompositionHint": "Around 18,000 individual iron pieces joined by hand, needing well over a hundred rivets each on average.",
    "source": "Eiffel Tower construction records"
  },
  {
    "id": "aluminium-cans-recycled-per-year",
    "prompt": "How many aluminium drink cans are used worldwide each year?",
    "asOf": 2025,
    "unit": "cans",
    "answerValue": 400000000000,
    "decompositionHint": "Roughly fifty per person on Earth per year, heavily skewed towards a handful of countries.",
    "source": "Aluminium packaging industry statistics"
  },
  {
    "id": "glass-bottles-produced-per-year",
    "prompt": "How many glass containers are produced worldwide each year?",
    "asOf": 2025,
    "unit": "containers",
    "answerValue": 500000000000,
    "decompositionHint": "Comparable in count to aluminium cans, dominated by beverage packaging.",
    "source": "Glass packaging industry statistics"
  },
  {
    "id": "buildings-in-new-york-city",
    "prompt": "How many buildings are there in New York City?",
    "asOf": 2025,
    "unit": "buildings",
    "answerValue": 1000000,
    "decompositionHint": "Dominated by low rise housing in the outer boroughs rather than the towers of Manhattan.",
    "source": "NYC building footprint datasets"
  },
  {
    "id": "skyscrapers-over-150m",
    "prompt": "How many buildings over 150 metres tall exist worldwide?",
    "asOf": 2025,
    "unit": "buildings",
    "answerValue": 9000,
    "decompositionHint": "China holds nearly half. The count has roughly tripled since 2010.",
    "source": "Council on Tall Buildings and Urban Habitat database"
  },
  {
    "id": "steps-in-the-empire-state-building",
    "prompt": "How many stairs are there to the top of the Empire State Building?",
    "unit": "stairs",
    "answerValue": 1576,
    "decompositionHint": "102 floors at roughly 15 steps each, allowing for taller lobby levels.",
    "source": "Empire State Building published figures"
  },
  {
    "id": "lifts-in-a-skyscraper",
    "prompt": "How many lifts serve a large 100 storey skyscraper?",
    "unit": "lifts",
    "answerValue": 70,
    "decompositionHint": "Tall buildings need banks serving different floor ranges, or the lift shafts would consume too much floor area at the base.",
    "source": "Tall building services design figures"
  },
  {
    "id": "people-per-square-kilometre-in-a-city",
    "prompt": "How many people live in one square kilometre of a dense city like Paris?",
    "unit": "people",
    "answerValue": 20000,
    "decompositionHint": "About two million people in roughly a hundred square kilometres within the historic boundary.",
    "source": "Municipal population density figures"
  },
  {
    "id": "bricks-in-the-great-wall",
    "prompt": "How many bricks make up the Great Wall of China?",
    "unit": "bricks",
    "answerValue": 3900000000,
    "decompositionHint": "Thousands of kilometres of wall, several metres tall and thick, though much of the length is rammed earth rather than brick.",
    "source": "Order-of-magnitude estimate from wall dimensions"
  },
  {
    "id": "windows-in-the-empire-state-building",
    "prompt": "How many windows does the Empire State Building have?",
    "unit": "windows",
    "answerValue": 6500,
    "decompositionHint": "102 floors, with the tower tapering sharply above the sixth floor so upper floors have far fewer windows than the base.",
    "source": "Empire State Building published figures"
  },
  {
    "id": "houses-in-a-suburb",
    "prompt": "How many houses are in one square kilometre of typical low density suburb?",
    "unit": "houses",
    "answerValue": 1200,
    "decompositionHint": "Plots of roughly 600 square metres including the share of roads and verges.",
    "source": "Derived from typical suburban lot sizes"
  },
  {
    "id": "paint-to-cover-a-house",
    "prompt": "How many litres of paint does it take to paint the outside of a house?",
    "unit": "litres",
    "answerValue": 40,
    "decompositionHint": "Around 200 square metres of wall at roughly 10 square metres per litre, over two coats.",
    "source": "Paint coverage rates from manufacturer guidance"
  },
  {
    "id": "fuel-burned-on-a-transatlantic-flight",
    "prompt": "How many litres of fuel does a wide body airliner burn crossing the Atlantic?",
    "unit": "litres",
    "answerValue": 60000,
    "decompositionHint": "Roughly 8 hours at about 7,500 litres an hour for a large twin engine jet.",
    "source": "Published fuel burn rates for long haul aircraft"
  },
  {
    "id": "fuel-per-passenger-per-100km-flying",
    "prompt": "How many litres of fuel does a full airliner burn per passenger per 100 kilometres?",
    "unit": "litres",
    "answerValue": 3,
    "decompositionHint": "Comparable to a small efficient car carrying one person, which surprises people who assume flying is far worse per kilometre.",
    "source": "Airline fuel efficiency reporting"
  },
  {
    "id": "rivets-in-an-airliner",
    "prompt": "How many rivets hold a large airliner together?",
    "unit": "rivets",
    "answerValue": 3000000,
    "decompositionHint": "Aluminium skin panels across a fuselage 60 metres long plus the wings, with rivets every few centimetres along every seam.",
    "source": "Aircraft manufacturing figures"
  },
  {
    "id": "parts-in-a-car",
    "prompt": "How many individual parts make up a modern car?",
    "unit": "parts",
    "answerValue": 30000,
    "decompositionHint": "Counting every nut, clip and fastener. An electric car has substantially fewer because the drivetrain is far simpler.",
    "source": "Automotive manufacturing figures"
  },
  {
    "id": "parts-in-a-bicycle",
    "prompt": "How many individual parts make up a bicycle?",
    "unit": "parts",
    "answerValue": 900,
    "decompositionHint": "The chain alone accounts for several hundred once you count every link, pin and roller.",
    "source": "Bicycle assembly component counts"
  },
  {
    "id": "revolutions-of-a-car-tyre-in-its-life",
    "prompt": "How many times does a car tyre rotate over its usable life?",
    "unit": "rotations",
    "answerValue": 20000000,
    "decompositionHint": "A tyre lasts around 50,000 km and has a circumference of about 2 metres.",
    "source": "Derived from typical tyre life and wheel circumference"
  },
  {
    "id": "trains-running-in-japan-daily",
    "prompt": "How many passenger trains run in Japan on a typical day?",
    "asOf": 2025,
    "unit": "trains",
    "answerValue": 26000,
    "decompositionHint": "Tokyo alone moves millions of passengers a day on services running every few minutes across dozens of lines.",
    "source": "Japanese rail operator service statistics"
  },
  {
    "id": "bicycles-in-the-netherlands",
    "prompt": "How many bicycles are there in the Netherlands?",
    "asOf": 2025,
    "unit": "bicycles",
    "answerValue": 23000000,
    "decompositionHint": "More bicycles than people, in a country of about 18 million.",
    "source": "Dutch cycling statistics"
  },
  {
    "id": "shipping-container-capacity-of-largest-ship",
    "prompt": "How many shipping containers can the largest container ship carry?",
    "asOf": 2025,
    "unit": "containers",
    "answerValue": 24000,
    "decompositionHint": "Measured in twenty foot equivalent units. Stacked end to end they would stretch well over a hundred kilometres.",
    "source": "Container ship capacity specifications"
  },
  {
    "id": "distance-a-truck-tyre-travels-per-year",
    "prompt": "How many kilometres does a long haul truck cover in a year?",
    "asOf": 2025,
    "unit": "kilometres",
    "answerValue": 120000,
    "decompositionHint": "Perhaps 500 km a day across 240 working days, several times what a private car covers.",
    "source": "Commercial fleet mileage statistics"
  },
  {
    "id": "thickness-of-earths-crust",
    "prompt": "How thick is the Earth's continental crust, in kilometres?",
    "unit": "kilometres",
    "answerValue": 35,
    "decompositionHint": "Proportionally thinner than the skin of an apple relative to the 6,371 km radius beneath it.",
    "source": "Standard geophysical figures"
  },
  {
    "id": "speed-of-continental-drift",
    "prompt": "How many centimetres do tectonic plates move in a year?",
    "unit": "centimetres",
    "answerValue": 5,
    "decompositionHint": "Famously about the rate fingernails grow. Over a human lifetime that adds up to a few metres.",
    "source": "GPS measurements of plate motion"
  },
  {
    "id": "diamonds-mined-per-year",
    "prompt": "How many carats of natural diamonds are mined worldwide each year?",
    "asOf": 2025,
    "unit": "carats",
    "answerValue": 120000000,
    "decompositionHint": "A carat is 0.2 grams, so the annual total is only around 24 tonnes - a single truckload.",
    "source": "Kimberley Process production statistics"
  },
  {
    "id": "gold-in-seawater",
    "prompt": "How many tonnes of gold are dissolved in the world's oceans?",
    "unit": "tonnes",
    "answerValue": 20000,
    "decompositionHint": "Concentration is only a few parts per trillion, but the oceans are so vast that the total is comparable to a decade of mining. Extracting it costs far more than it is worth.",
    "source": "Oceanographic trace element measurements"
  },
  {
    "id": "age-of-the-oldest-rocks",
    "prompt": "How old are the oldest rocks found on Earth's surface, in years?",
    "unit": "years",
    "answerValue": 4000000000,
    "decompositionHint": "Slightly younger than the planet itself, because plate tectonics and erosion have recycled almost all of the original crust.",
    "source": "Radiometric dating of Acasta and Nuvvuagittuq formations"
  },
  {
    "id": "volcanic-eruptions-per-year",
    "prompt": "How many volcanoes erupt somewhere on Earth in a given year?",
    "unit": "eruptions",
    "answerValue": 70,
    "decompositionHint": "Out of roughly 1,500 active volcanoes, only a small fraction are erupting in any given year, and most go unnoticed.",
    "source": "Smithsonian Global Volcanism Program annual activity"
  },
  {
    "id": "salt-mined-per-year",
    "prompt": "How many kilograms of salt does an average person eat in a year?",
    "asOf": 2025,
    "unit": "kilograms",
    "answerValue": 3.3,
    "decompositionHint": "Typical intake is around 9 grams of salt a day, well above the 5 grams the WHO recommends. Multiply by 365 and convert to kilograms.",
    "source": "WHO dietary sodium intake estimates"
  },
  {
    "id": "seeds-in-a-sunflower-head",
    "prompt": "How many seeds are in a single large sunflower head?",
    "unit": "seeds",
    "answerValue": 1500,
    "decompositionHint": "Seeds spiral outward in a tightly packed Fibonacci arrangement across a head 20 to 30 centimetres across.",
    "source": "Agronomy references for sunflower seed counts"
  },
  {
    "id": "grains-of-pollen-from-one-plant",
    "prompt": "How many pollen grains does a single ragweed plant release in a season?",
    "unit": "pollen grains",
    "answerValue": 1000000000,
    "decompositionHint": "Wind pollinated plants must produce vast quantities because the odds any one grain reaches a receptive flower are minuscule.",
    "source": "Aerobiology pollen production studies"
  },
  {
    "id": "leaves-on-a-mature-tree",
    "prompt": "How many leaves does a mature broadleaf tree carry?",
    "unit": "leaves",
    "answerValue": 200000,
    "decompositionHint": "Estimate the number of major branches, then twigs per branch and leaves per twig - the multiplication runs away quickly.",
    "source": "Forestry leaf area estimates"
  },
  {
    "id": "water-a-tree-drinks-per-day",
    "prompt": "How many litres of water does a large tree draw up in a summer day?",
    "unit": "litres",
    "answerValue": 400,
    "decompositionHint": "Almost all of it evaporates through the leaves rather than being retained. A hectare of forest can move several hundred tonnes of water a week.",
    "source": "Plant transpiration measurements"
  },
  {
    "id": "rings-in-an-old-tree",
    "prompt": "How many growth rings does the oldest known living tree have?",
    "unit": "rings",
    "answerValue": 4900,
    "decompositionHint": "One ring a year, and the oldest bristlecone pines were already ancient when the pyramids were built.",
    "source": "Dendrochronology records for Great Basin bristlecone pine"
  },
  {
    "id": "oxygen-produced-by-a-tree-per-year",
    "prompt": "How many kilograms of oxygen does a mature tree produce in a year?",
    "unit": "kilograms",
    "answerValue": 100,
    "decompositionHint": "Tied directly to how much carbon it fixes: roughly 20 kg of carbon dioxide absorbed yields a bit under its own mass in oxygen released.",
    "source": "Forestry carbon and oxygen exchange estimates"
  },
  {
    "id": "bacteria-on-a-doorknob",
    "prompt": "How many bacteria live on a typical door handle?",
    "unit": "bacteria",
    "answerValue": 100000,
    "decompositionHint": "Hard, dry, frequently touched surfaces carry hundreds of organisms per square centimetre - far fewer than a kitchen sponge.",
    "source": "Environmental microbiology swab studies"
  },
  {
    "id": "bacteria-in-a-kitchen-sponge",
    "prompt": "How many bacteria live in a used kitchen sponge?",
    "unit": "bacteria",
    "answerValue": 50000000000,
    "decompositionHint": "Warm, wet and full of food residue with enormous surface area - densities rival those found in faeces.",
    "source": "Cardinale et al. 2017, Scientific Reports"
  },
  {
    "id": "bacteria-generation-time",
    "prompt": "How many minutes does it take a well fed E. coli cell to divide?",
    "unit": "minutes",
    "answerValue": 20,
    "decompositionHint": "Fast enough that a single cell could in principle produce a colony visible to the naked eye overnight.",
    "source": "Standard microbiology growth rates"
  },
  {
    "id": "viruses-in-a-drop-of-seawater",
    "prompt": "How many virus particles are in a single drop of seawater?",
    "unit": "virus particles",
    "answerValue": 500000,
    "decompositionHint": "About ten million per millilitre, and a drop is roughly 0.05 millilitres.",
    "source": "Marine virology concentration measurements"
  },
  {
    "id": "microbes-in-the-human-gut",
    "prompt": "How many microbial cells live in the human large intestine?",
    "unit": "microbial cells",
    "answerValue": 38000000000000,
    "decompositionHint": "Roughly comparable to the number of human cells in the body, revising down the old claim of a ten to one ratio.",
    "source": "Sender, Fuchs and Milo 2016, PLOS Biology"
  },
  {
    "id": "possible-lottery-combinations",
    "prompt": "How many possible combinations are there in a 6 from 49 lottery?",
    "unit": "combinations",
    "answerValue": 14000000,
    "decompositionHint": "49 choose 6. Equivalent to picking one particular second out of about five months.",
    "source": "Direct combinatorial calculation"
  },
  {
    "id": "possible-rubiks-cube-positions",
    "prompt": "How many positions can a 3x3 Rubik's cube be in?",
    "unit": "positions",
    "answerValue": 43000000000000000000,
    "decompositionHint": "Corner and edge permutations and orientations, divided by the constraints that make some arrangements unreachable by legal turns.",
    "source": "Standard Rubik's cube group order, 4.325x10^19"
  },
  {
    "id": "possible-eight-character-passwords",
    "prompt": "How many different eight character passwords can be made from letters, digits and symbols?",
    "unit": "passwords",
    "answerValue": 6000000000000000,
    "decompositionHint": "About 95 printable characters raised to the eighth power.",
    "source": "Direct calculation over the printable ASCII set"
  },
  {
    "id": "possible-chess-openings-after-four-moves",
    "prompt": "How many distinct chess positions are possible after each player has made two moves?",
    "unit": "positions",
    "answerValue": 72000,
    "decompositionHint": "Twenty legal first moves each, then roughly thirty replies, with transpositions reducing the raw product somewhat.",
    "source": "Chess game tree enumeration"
  },
  {
    "id": "birthday-paradox-group-size",
    "prompt": "How many people must be in a room for a shared birthday to be more likely than not?",
    "unit": "people",
    "answerValue": 23,
    "decompositionHint": "It counts pairs, not people: 23 people form 253 pairs, and each pair has a 1 in 365 chance.",
    "source": "The birthday problem"
  },
  {
    "id": "items-in-a-supermarket",
    "prompt": "How many distinct products does a large supermarket stock?",
    "asOf": 2025,
    "unit": "products",
    "answerValue": 30000,
    "decompositionHint": "Counting every size and flavour variant separately, which is why the number dwarfs what a shopper perceives.",
    "source": "Grocery retail assortment statistics"
  },
  {
    "id": "items-owned-by-a-household",
    "prompt": "How many individual possessions does a typical household own?",
    "unit": "possessions",
    "answerValue": 15000,
    "decompositionHint": "Count a kitchen drawer honestly and extrapolate - cutlery, screws, socks and books add up far faster than intuition suggests.",
    "source": "Frequently cited household inventory estimates"
  },
  {
    "id": "loads-of-laundry-per-year",
    "prompt": "How many loads of laundry does a family of four wash in a year?",
    "unit": "loads",
    "answerValue": 300,
    "decompositionHint": "Something like six loads a week across 52 weeks.",
    "source": "Appliance usage surveys"
  },
  {
    "id": "water-used-in-a-shower",
    "prompt": "How many litres of water does an eight minute shower use?",
    "unit": "litres",
    "answerValue": 80,
    "decompositionHint": "A standard head delivers roughly 10 litres a minute; low flow heads about half that.",
    "source": "Plumbing fixture flow rate standards"
  },
  {
    "id": "toothbrushes-used-in-a-lifetime",
    "prompt": "How many toothbrushes does a person get through in a lifetime?",
    "unit": "toothbrushes",
    "answerValue": 300,
    "decompositionHint": "Dentists advise replacing every three months, so four a year across roughly 75 years of brushing.",
    "source": "Dental guidance on brush replacement"
  },
  {
    "id": "batteries-used-per-person-per-year",
    "prompt": "How many disposable batteries does an average person use in a year?",
    "asOf": 2025,
    "unit": "batteries",
    "answerValue": 8,
    "decompositionHint": "Global alkaline production runs into the tens of billions of cells a year across 8 billion people, though consumption is concentrated in wealthy countries.",
    "source": "Battery industry production statistics"
  },
  {
    "id": "plastic-bags-used-per-year-worldwide",
    "prompt": "How many plastic bags are used worldwide each year?",
    "asOf": 2025,
    "unit": "bags",
    "answerValue": 500000000000,
    "decompositionHint": "Roughly sixty per person on Earth per year, though bans have cut this sharply in some countries.",
    "source": "Plastics industry and environmental agency estimates"
  },
  {
    "id": "coffee-cups-used-per-year",
    "prompt": "How many disposable coffee cups are thrown away worldwide each year?",
    "asOf": 2025,
    "unit": "cups",
    "answerValue": 250000000000,
    "decompositionHint": "Follows from roughly 2 billion cups of coffee drunk a day, with a minority served in disposable cups.",
    "source": "Packaging waste estimates"
  },
  {
    "id": "nappies-used-per-baby",
    "prompt": "How many disposable nappies does one baby get through before toilet training?",
    "unit": "nappies",
    "answerValue": 5000,
    "decompositionHint": "Six or so a day for the first year, tapering to three or four, across about two and a half years.",
    "source": "Parenting and waste management estimates"
  },
  {
    "id": "shoes-owned-in-a-lifetime",
    "prompt": "How many pairs of shoes does a person buy in a lifetime?",
    "unit": "pairs",
    "answerValue": 250,
    "decompositionHint": "Averaging three or four pairs a year across seventy adult years, more in childhood when feet keep growing.",
    "source": "Consumer purchasing surveys"
  },
  {
    "id": "uk-population-1801",
    "prompt": "What was the population of Britain at its first census?",
    "asOf": 1801,
    "unit": "people",
    "answerValue": 10500000,
    "decompositionHint": "Barely a sixth of today's figure, on the eve of the industrial expansion that would transform it.",
    "source": "UK census records"
  },
  {
    "id": "uk-population-2025",
    "prompt": "What is the population of the United Kingdom?",
    "asOf": 2025,
    "unit": "people",
    "answerValue": 69000000,
    "decompositionHint": "Around 0.85% of world population, in a country roughly the size of the American state of Oregon.",
    "source": "Office for National Statistics estimates"
  },
  {
    "id": "china-population-1950",
    "prompt": "What was the population of China?",
    "asOf": 1950,
    "unit": "people",
    "answerValue": 550000000,
    "decompositionHint": "Under half its later peak, before the mortality decline that drove rapid growth through the second half of the century.",
    "source": "UN World Population Prospects"
  },
  {
    "id": "india-population-2025",
    "prompt": "What is the population of India?",
    "asOf": 2025,
    "unit": "people",
    "answerValue": 1460000000,
    "decompositionHint": "It overtook China around 2023, and now holds roughly one in six people alive.",
    "source": "UN World Population Prospects"
  },
  {
    "id": "global-literacy-1900",
    "prompt": "What percentage of the world's adults could read and write?",
    "asOf": 1900,
    "unit": "percent",
    "answerValue": 21,
    "decompositionHint": "Literacy was largely confined to Europe, North America and a thin elite elsewhere. Mass schooling was still decades away for most of the world.",
    "source": "Historical literacy reconstructions"
  },
  {
    "id": "global-literacy-2025",
    "prompt": "What percentage of the world's adults can read and write?",
    "asOf": 2025,
    "unit": "percent",
    "answerValue": 87,
    "decompositionHint": "One of the largest changes of the last century, though the remaining illiterate population is still counted in the hundreds of millions.",
    "source": "UNESCO literacy statistics"
  },
  {
    "id": "urban-share-1900",
    "prompt": "What percentage of the world's people lived in cities?",
    "asOf": 1900,
    "unit": "percent",
    "answerValue": 15,
    "decompositionHint": "Overwhelmingly rural. The crossover to a majority urban world only happened around 2007.",
    "source": "UN urbanisation historical estimates"
  },
  {
    "id": "urban-share-2025",
    "prompt": "What percentage of the world's people live in cities?",
    "asOf": 2025,
    "unit": "percent",
    "answerValue": 58,
    "decompositionHint": "The crossover past half happened around 2007, and the share continues to climb by roughly half a point a year.",
    "source": "UN World Urbanization Prospects"
  },
  {
    "id": "child-mortality-1900",
    "prompt": "What percentage of children died before their fifth birthday worldwide?",
    "asOf": 1900,
    "unit": "percent",
    "answerValue": 36,
    "decompositionHint": "More than a third. This single figure explains why historical life expectancy at birth looks so grim compared with adult lifespans.",
    "source": "Historical demographic reconstructions"
  },
  {
    "id": "child-mortality-2025",
    "prompt": "What percentage of children die before their fifth birthday worldwide?",
    "asOf": 2025,
    "unit": "percent",
    "answerValue": 3.7,
    "decompositionHint": "Down roughly tenfold from 1900, though it still means several million deaths a year.",
    "source": "UN Inter-agency Group for Child Mortality Estimation"
  },
  {
    "id": "cost-of-artificial-light-1800",
    "prompt": "How many hours of work did an hour of artificial light cost a labourer?",
    "asOf": 1800,
    "unit": "hours of work",
    "answerValue": 5,
    "decompositionHint": "Tallow candles were dim and expensive. The collapse in this figure to near zero is one of the starkest measures of economic progress.",
    "source": "Nordhaus 1996, historical price of light"
  },
  {
    "id": "horses-in-us-1900",
    "prompt": "How many horses and mules worked in the United States?",
    "asOf": 1900,
    "unit": "horses and mules",
    "answerValue": 21000000,
    "decompositionHint": "Roughly one for every four people, and cities had to dispose of thousands of tonnes of manure a day before motor vehicles arrived.",
    "source": "US Department of Agriculture historical livestock censuses"
  },
  {
    "id": "books-printed-before-1500",
    "prompt": "How many books were printed in Europe in the first fifty years after the printing press?",
    "asOf": 1500,
    "unit": "books",
    "answerValue": 20000000,
    "decompositionHint": "Around 30,000 distinct titles in editions of several hundred each - more books produced in fifty years than European scribes had made in the previous thousand.",
    "source": "Incunabula bibliographic surveys"
  },
  {
    "id": "children-in-school-worldwide",
    "prompt": "How many children are enrolled in primary school worldwide?",
    "asOf": 2025,
    "unit": "children",
    "answerValue": 750000000,
    "decompositionHint": "Roughly one in eleven people alive, reflecting how young the population still is in much of the world.",
    "source": "UNESCO Institute for Statistics enrolment data"
  },
  {
    "id": "teachers-worldwide",
    "prompt": "How many school teachers are there worldwide?",
    "asOf": 2025,
    "unit": "teachers",
    "answerValue": 85000000,
    "decompositionHint": "Primary and secondary combined, at average class sizes in the twenties across roughly 1.5 billion pupils.",
    "source": "UNESCO teacher workforce statistics"
  },
  {
    "id": "universities-worldwide",
    "prompt": "How many universities are there in the world?",
    "asOf": 2025,
    "unit": "universities",
    "answerValue": 30000,
    "decompositionHint": "Counting degree awarding institutions. India and the United States alone account for several thousand each.",
    "source": "International higher education directories"
  },
  {
    "id": "phds-awarded-per-year-worldwide",
    "prompt": "How many doctorates are awarded worldwide each year?",
    "asOf": 2025,
    "unit": "doctorates",
    "answerValue": 300000,
    "decompositionHint": "The United States and China each award several tens of thousands, and the OECD total alone is around a quarter of a million.",
    "source": "OECD education statistics"
  },
  {
    "id": "hours-a-child-spends-in-school",
    "prompt": "How many hours does a child spend in school across their entire education?",
    "unit": "hours",
    "answerValue": 12000,
    "decompositionHint": "Roughly 6 hours a day, 190 days a year, for about 12 years.",
    "source": "Derived from typical school year length"
  },
  {
    "id": "academic-papers-published-per-year",
    "prompt": "How many peer reviewed academic papers are published each year?",
    "asOf": 2025,
    "unit": "papers",
    "answerValue": 3000000,
    "decompositionHint": "Growing a few percent a year across tens of thousands of journals, which is why no researcher can read even their own subfield exhaustively.",
    "source": "Scholarly publishing output studies"
  },
  {
    "id": "countries-in-the-world",
    "prompt": "How many sovereign countries are there in the world?",
    "asOf": 2025,
    "unit": "countries",
    "answerValue": 195,
    "decompositionHint": "193 UN member states plus two observers. The number roughly quadrupled over the twentieth century through decolonisation.",
    "source": "United Nations membership"
  },
  {
    "id": "people-in-prison-worldwide",
    "prompt": "How many people are held in prison worldwide?",
    "asOf": 2025,
    "unit": "prisoners",
    "answerValue": 11000000,
    "decompositionHint": "Roughly 140 per 100,000 people globally, though rates vary more than tenfold between countries.",
    "source": "World Prison Population List"
  },
  {
    "id": "police-officers-worldwide",
    "prompt": "How many police officers are there worldwide?",
    "asOf": 2025,
    "unit": "officers",
    "answerValue": 12000000,
    "decompositionHint": "The UN median is around 300 officers per 100,000 people. Multiply across a population of 8 billion.",
    "source": "UNODC criminal justice statistics"
  },
  {
    "id": "soldiers-worldwide",
    "prompt": "How many active duty military personnel are there worldwide?",
    "asOf": 2025,
    "unit": "personnel",
    "answerValue": 27000000,
    "decompositionHint": "A handful of countries account for over half. Reserves would add tens of millions more.",
    "source": "IISS Military Balance"
  },
  {
    "id": "refugees-worldwide",
    "prompt": "How many people are forcibly displaced worldwide?",
    "asOf": 2025,
    "unit": "people",
    "answerValue": 120000000,
    "decompositionHint": "Around one in every 67 people alive, and the figure has more than doubled in a decade.",
    "source": "UNHCR global trends reports"
  },
  {
    "id": "elections-held-per-year",
    "prompt": "How many national elections take place worldwide in a typical year?",
    "asOf": 2025,
    "unit": "elections",
    "answerValue": 60,
    "decompositionHint": "About 195 countries with terms averaging four or five years, so a predictable fraction go to the polls annually.",
    "source": "International electoral calendars"
  },
  {
    "id": "laws-passed-per-year-in-a-country",
    "prompt": "How many acts of parliament does a typical national legislature pass in a year?",
    "unit": "acts",
    "answerValue": 50,
    "decompositionHint": "A few dozen primary statutes, though secondary regulations made under them run into the thousands.",
    "source": "National legislative output records"
  },
  {
    "id": "emails-a-worker-receives-per-day",
    "prompt": "How many emails does an office worker receive on a working day?",
    "asOf": 2025,
    "unit": "emails",
    "answerValue": 120,
    "decompositionHint": "Including automated notifications and copies, which typically outnumber genuinely personal messages several times over.",
    "source": "Workplace email volume studies"
  },
  {
    "id": "hours-of-video-on-youtube",
    "prompt": "How many years would it take to watch every video on YouTube?",
    "asOf": 2025,
    "unit": "years",
    "answerValue": 200000,
    "decompositionHint": "About 500 hours are uploaded every minute, so a year of uploads alone is far more than a lifetime of watching.",
    "source": "Derived from published upload rates"
  },
  {
    "id": "podcasts-in-existence",
    "prompt": "How many podcasts have been published?",
    "asOf": 2025,
    "unit": "podcasts",
    "answerValue": 4000000,
    "decompositionHint": "Millions of feeds exist but only a small fraction are still actively producing episodes.",
    "source": "Podcast directory listings"
  },
  {
    "id": "photos-on-social-media-per-day",
    "prompt": "How many photographs are uploaded to social media each day?",
    "asOf": 2025,
    "unit": "photographs",
    "answerValue": 4000000000,
    "decompositionHint": "Follows from roughly 5 billion social media users posting on the order of one image a day on average.",
    "source": "Social platform published upload figures"
  },
  {
    "id": "text-characters-typed-per-day-worldwide",
    "prompt": "How many text messages are sent worldwide each day across all platforms?",
    "asOf": 2025,
    "unit": "messages",
    "answerValue": 200000000000,
    "decompositionHint": "Messaging apps alone carry over a hundred billion, before SMS and in-platform direct messages are counted.",
    "source": "Aggregated messaging platform statistics"
  },
  {
    "id": "newspapers-printed-per-day",
    "prompt": "How many newspaper copies are printed worldwide each day?",
    "asOf": 2025,
    "unit": "copies",
    "answerValue": 200000000,
    "decompositionHint": "Down sharply from the peak but still substantial, sustained largely by markets like India and Japan where print remains strong.",
    "source": "World Association of News Publishers circulation data"
  },
  {
    "id": "dogs-in-the-world",
    "prompt": "How many domestic dogs are there in the world?",
    "asOf": 2025,
    "unit": "dogs",
    "answerValue": 900000000,
    "decompositionHint": "Counting strays and village dogs, which outnumber pets in much of the world.",
    "source": "Global canine population estimates"
  },
  {
    "id": "cats-in-the-world",
    "prompt": "How many domestic cats are there in the world?",
    "asOf": 2025,
    "unit": "cats",
    "answerValue": 600000000,
    "decompositionHint": "Roughly comparable to dogs, again dominated by free roaming animals rather than housecats.",
    "source": "Global feline population estimates"
  },
  {
    "id": "elephants-remaining",
    "prompt": "How many African elephants remain in the wild?",
    "asOf": 2025,
    "unit": "elephants",
    "answerValue": 415000,
    "decompositionHint": "Down from several million a century ago. A single population estimate for a species this large is easier to pin down than most.",
    "source": "IUCN African elephant status reports"
  },
  {
    "id": "penguins-in-antarctica",
    "prompt": "How many penguins live in Antarctica and its surrounding waters?",
    "unit": "penguins",
    "answerValue": 20000000,
    "decompositionHint": "Dominated by a few enormously abundant species like Adelie and chinstrap, counted from satellite imagery of guano stains.",
    "source": "Antarctic seabird population surveys"
  },
  {
    "id": "eggs-a-queen-bee-lays-per-day",
    "prompt": "How many eggs does a queen bee lay in a day at peak season?",
    "unit": "eggs",
    "answerValue": 1500,
    "decompositionHint": "More than her own body weight daily, which is why the colony must feed her constantly.",
    "source": "Apiculture references"
  },
  {
    "id": "wingbeats-of-a-hummingbird-per-second",
    "prompt": "How many times does a hummingbird beat its wings per second in hovering flight?",
    "unit": "wingbeats",
    "answerValue": 55,
    "decompositionHint": "Fast enough to produce an audible hum, which is where the name comes from.",
    "source": "High speed photography of hummingbird flight"
  },
  {
    "id": "lifespan-of-a-mayfly",
    "prompt": "How many hours does an adult mayfly live?",
    "unit": "hours",
    "answerValue": 24,
    "decompositionHint": "The winged adult exists only to reproduce and often has no functioning mouthparts. The nymph stage underwater lasts a year or more.",
    "source": "Entomology references for Ephemeroptera"
  },
  {
    "id": "distance-a-monarch-butterfly-migrates",
    "prompt": "How many kilometres does a monarch butterfly migrate?",
    "unit": "kilometres",
    "answerValue": 4000,
    "decompositionHint": "From Canada to central Mexico, a journey no single butterfly completes in both directions - it takes several generations.",
    "source": "Monarch migration tracking studies"
  },
  {
    "id": "seconds-in-a-year",
    "prompt": "How many seconds are there in a year?",
    "unit": "seconds",
    "answerValue": 31500000,
    "decompositionHint": "A useful constant to memorise: pi times ten million is accurate to under half a percent.",
    "source": "Direct unit conversion"
  },
  {
    "id": "heartbeats-in-a-day",
    "prompt": "How many times does a human heart beat in a day?",
    "unit": "beats",
    "answerValue": 100000,
    "decompositionHint": "About 70 beats a minute across 1,440 minutes.",
    "source": "Standard resting heart rate figures"
  },
  {
    "id": "walking-speed-in-a-lifetime",
    "prompt": "How many kilometres does an average person walk in a lifetime?",
    "unit": "kilometres",
    "answerValue": 150000,
    "decompositionHint": "Roughly 7,000 steps a day at 0.75 metres, across some 75 years - enough to circle the equator three times.",
    "source": "Derived from typical daily step counts"
  },
  {
    "id": "hours-slept-in-a-lifetime",
    "prompt": "How many hours does a person sleep in an 80 year lifetime?",
    "unit": "hours",
    "answerValue": 230000,
    "decompositionHint": "About 8 hours a night across roughly 29,000 nights, which works out to a full third of life.",
    "source": "Derived from typical sleep duration"
  },
  {
    "id": "meals-eaten-in-a-lifetime",
    "prompt": "How many meals does a person eat in a lifetime?",
    "unit": "meals",
    "answerValue": 80000,
    "decompositionHint": "Three a day across about 29,000 days.",
    "source": "Derived from typical meal frequency"
  },
  {
    "id": "days-in-a-human-lifetime",
    "prompt": "How many days does an average person live?",
    "unit": "days",
    "answerValue": 29000,
    "decompositionHint": "About 80 years at 365 days. A strikingly small number when written out, which is rather the point.",
    "source": "Direct unit conversion"
  },
  {
    "id": "photons-from-a-candle-per-second",
    "prompt": "How many photons does a candle emit each second in visible light?",
    "unit": "photons",
    "answerValue": 10000000000000000000,
    "decompositionHint": "A candle radiates a few watts, but only about 0.1 watt as visible light. A visible photon carries roughly 4x10^-19 joules.",
    "source": "Derived from candle luminous output and photon energy"
  },
  {
    "id": "photons-entering-the-eye-in-starlight",
    "prompt": "How many photons per second enter your eye from a faint naked eye star?",
    "unit": "photons",
    "answerValue": 1000,
    "decompositionHint": "The dark adapted eye can detect a handful of photons. A sixth magnitude star is right at that threshold across a pupil about 7 mm wide.",
    "source": "Visual astronomy photon flux estimates"
  },
  {
    "id": "time-for-sound-to-travel-a-kilometre",
    "prompt": "How many seconds does sound take to travel one kilometre through air?",
    "unit": "seconds",
    "answerValue": 3,
    "decompositionHint": "Sound moves at about 340 metres a second, which is why counting seconds between lightning and thunder gives distance in kilometres divided by three.",
    "source": "Speed of sound at sea level"
  },
  {
    "id": "wavelength-of-visible-light",
    "prompt": "How many nanometres is the wavelength of green light?",
    "unit": "nanometres",
    "answerValue": 530,
    "decompositionHint": "Visible light spans roughly 400 nm at the violet end to 700 nm at the red end, and human vision peaks in the middle.",
    "source": "Standard optical physics figures"
  },
  {
    "id": "decibels-of-a-jet-engine",
    "prompt": "How many decibels does a jet engine produce at 30 metres?",
    "unit": "decibels",
    "answerValue": 140,
    "decompositionHint": "Decibels are logarithmic: every 10 adds a factor of ten in intensity, so 140 dB is 10^14 times the quietest audible sound.",
    "source": "Occupational noise exposure references"
  },
  {
    "id": "sound-intensity-ratio-whisper-to-jet",
    "prompt": "How many times more intense is a jet engine than a whisper?",
    "unit": "times",
    "answerValue": 1000000000000,
    "decompositionHint": "A whisper is about 20 dB and a jet about 140 dB. Each 10 dB is a tenfold increase, so the gap of 120 dB is ten to the twelfth.",
    "source": "Derived from the decibel scale"
  },
  {
    "id": "frames-per-second-for-smooth-motion",
    "prompt": "How many frames per second does film use to create the illusion of motion?",
    "unit": "frames per second",
    "answerValue": 24,
    "decompositionHint": "Low enough that the flicker had to be masked by showing each frame twice in projection.",
    "source": "Standard cinema frame rate"
  },
  {
    "id": "energy-from-fissioning-a-uranium-atom",
    "prompt": "How many joules are released by splitting a single uranium atom?",
    "unit": "joules",
    "answerValue": 3.2e-11,
    "decompositionHint": "About 200 million electron volts, and one electron volt is 1.6x10^-19 joules.",
    "source": "Standard nuclear fission energy release"
  },
  {
    "id": "uranium-to-power-a-house-for-a-year",
    "prompt": "How many grams of uranium fuel would power one household for a year?",
    "unit": "grams",
    "answerValue": 0.5,
    "decompositionHint": "A household uses roughly 4,000 kWh, and fissioning a gram of uranium-235 releases around 24,000 kWh of heat before conversion losses.",
    "source": "Derived from fission energy density"
  },
  {
    "id": "background-radiation-per-year",
    "prompt": "How many millisieverts of background radiation does a person absorb in a year?",
    "unit": "millisieverts",
    "answerValue": 3,
    "decompositionHint": "Mostly radon indoors, plus cosmic rays and potassium-40 in your own body. A chest X-ray is about 0.1 mSv.",
    "source": "UNSCEAR background radiation estimates"
  },
  {
    "id": "half-life-of-carbon-14",
    "prompt": "How many years is the half life of carbon-14?",
    "unit": "years",
    "answerValue": 5730,
    "decompositionHint": "Short enough that after about ten half lives, roughly 60,000 years, too little remains to date reliably.",
    "source": "Standard radiometric dating constant"
  },
  {
    "id": "nuclear-warheads-in-the-world",
    "prompt": "How many nuclear warheads exist worldwide?",
    "asOf": 2025,
    "unit": "warheads",
    "answerValue": 12000,
    "decompositionHint": "Down from a peak above 60,000 in the 1980s, with two countries holding roughly 90% of the total.",
    "source": "Federation of American Scientists nuclear notebook"
  },
  {
    "id": "colours-the-eye-can-distinguish",
    "prompt": "How many distinct colours can the human eye distinguish?",
    "unit": "colours",
    "answerValue": 10000000,
    "decompositionHint": "Three cone types, each resolving perhaps a couple of hundred levels, multiplied together.",
    "source": "Colour vision research estimates"
  },
  {
    "id": "smells-humans-can-distinguish",
    "prompt": "How many distinct smells can a human nose distinguish?",
    "unit": "smells",
    "answerValue": 1000000000000,
    "decompositionHint": "About 400 olfactory receptor types combining combinatorially, which is why the number vastly exceeds the old textbook figure of 10,000.",
    "source": "Bushdid et al. 2014, Science"
  },
  {
    "id": "rods-and-cones-in-the-eye",
    "prompt": "How many photoreceptor cells are in one human retina?",
    "unit": "photoreceptors",
    "answerValue": 120000000,
    "decompositionHint": "Around 120 million rods for dim light and 6 million cones for colour, all feeding into only about a million optic nerve fibres.",
    "source": "Standard ophthalmology references"
  },
  {
    "id": "reaction-time-milliseconds",
    "prompt": "How many milliseconds does a human take to react to a visual signal?",
    "unit": "milliseconds",
    "answerValue": 250,
    "decompositionHint": "Signal transduction, nerve conduction and muscle activation each cost tens of milliseconds. Sound is faster than sight by about 40 ms.",
    "source": "Reaction time psychology research"
  },
  {
    "id": "information-through-the-optic-nerve",
    "prompt": "How many bits per second does the optic nerve carry to the brain?",
    "unit": "bits per second",
    "answerValue": 10000000,
    "decompositionHint": "Roughly a million fibres each firing a few times a second with several bits per spike - comparable to an ethernet connection.",
    "source": "Koch et al. 2006, Current Biology"
  },
  {
    "id": "taste-buds-replaced-per-week",
    "prompt": "How many days does a taste bud cell live before being replaced?",
    "unit": "days",
    "answerValue": 10,
    "decompositionHint": "Constant turnover is why a burnt tongue recovers within a couple of weeks.",
    "source": "Oral physiology references"
  },
  {
    "id": "molecules-in-a-mole",
    "prompt": "How many particles are in one mole of a substance?",
    "unit": "particles",
    "answerValue": 6.022e+23,
    "decompositionHint": "Avogadro's number, defined so that a mole of carbon-12 weighs exactly 12 grams.",
    "source": "Avogadro constant"
  },
  {
    "id": "atoms-in-a-gram-of-hydrogen",
    "prompt": "How many atoms are in one gram of hydrogen?",
    "unit": "atoms",
    "answerValue": 6e+23,
    "decompositionHint": "Hydrogen's molar mass is about 1 gram, so a gram is one mole of atoms.",
    "source": "Derived from molar mass and Avogadro's number"
  },
  {
    "id": "elements-found-in-nature",
    "prompt": "How many chemical elements occur naturally on Earth?",
    "unit": "elements",
    "answerValue": 94,
    "decompositionHint": "Everything up to plutonium occurs naturally at least in traces; beyond that they must be synthesised.",
    "source": "Standard periodic table classification"
  },
  {
    "id": "ph-difference-in-hydrogen-ions",
    "prompt": "How many times more acidic is lemon juice at pH 2 than water at pH 7?",
    "unit": "times",
    "answerValue": 100000,
    "decompositionHint": "pH is logarithmic - each unit is a factor of ten in hydrogen ion concentration, and the gap here is five units.",
    "source": "Definition of the pH scale"
  },
  {
    "id": "water-molecules-in-the-oceans",
    "prompt": "How many water molecules are in all the world's oceans?",
    "unit": "molecules",
    "answerValue": 4.6e+46,
    "decompositionHint": "The oceans hold about 1.4x10^21 kg of water. Convert to moles using 18 grams per mole, then multiply by Avogadro's number.",
    "source": "Derived from ocean mass and molar mass of water"
  },
  {
    "id": "oxygen-atoms-breathed-per-day",
    "prompt": "How many oxygen molecules does a person breathe in and absorb in a day?",
    "unit": "molecules",
    "answerValue": 1.5e+25,
    "decompositionHint": "About 550 litres of oxygen consumed a day. Convert to moles via 22.4 litres per mole, then multiply by Avogadro's number.",
    "source": "Derived from resting oxygen consumption"
  },
  {
    "id": "grains-of-sugar-in-a-teaspoon",
    "prompt": "How many sugar crystals are in a teaspoon of granulated sugar?",
    "unit": "crystals",
    "answerValue": 100000,
    "decompositionHint": "A teaspoon holds about 4 grams, and a crystal is roughly half a millimetre across weighing well under a milligram.",
    "source": "Derived from crystal size and teaspoon volume"
  },
  {
    "id": "bubbles-in-a-glass-of-champagne",
    "prompt": "How many bubbles are released from a glass of champagne?",
    "unit": "bubbles",
    "answerValue": 1000000,
    "decompositionHint": "Dissolved carbon dioxide comes out of solution at nucleation sites on the glass until the wine goes flat.",
    "source": "Liger-Belair champagne physics research"
  },
  {
    "id": "coffee-drunk-in-a-lifetime",
    "prompt": "How many litres of coffee does a regular drinker consume in a lifetime?",
    "unit": "litres",
    "answerValue": 15000,
    "decompositionHint": "Two cups a day at about 250 ml, across roughly 55 adult years.",
    "source": "Derived from typical consumption rates"
  },
  {
    "id": "eggs-eaten-in-a-lifetime",
    "prompt": "How many eggs does a person eat in a lifetime?",
    "unit": "eggs",
    "answerValue": 15000,
    "decompositionHint": "Around 200 a year in many countries, across about 75 years.",
    "source": "National egg consumption statistics"
  },
  {
    "id": "bread-eaten-in-a-lifetime",
    "prompt": "How many loaves of bread does a person eat in a lifetime?",
    "unit": "loaves",
    "answerValue": 3000,
    "decompositionHint": "Roughly 40 to 50 loaves a year in a bread eating country, across some 70 years.",
    "source": "National bread consumption statistics"
  },
  {
    "id": "calories-in-a-lifetime",
    "prompt": "How many kilocalories does a person eat in a lifetime?",
    "unit": "kilocalories",
    "answerValue": 60000000,
    "decompositionHint": "About 2,200 a day across roughly 29,000 days.",
    "source": "Derived from daily energy intake"
  },
  {
    "id": "pizzas-eaten-in-italy-per-year",
    "prompt": "How many pizzas are eaten in Italy each year?",
    "asOf": 2025,
    "unit": "pizzas",
    "answerValue": 2500000000,
    "decompositionHint": "About 59 million people eating on the order of forty a year each, counting both restaurant and frozen.",
    "source": "Italian food industry consumption estimates"
  },
  {
    "id": "ping-pong-balls-in-a-double-decker-bus",
    "prompt": "How many ping pong balls would fill a double decker bus?",
    "unit": "ping pong balls",
    "answerValue": 10000000,
    "decompositionHint": "The bus interior is roughly 100 cubic metres. A ball is 40 mm across, so about 6.4x10^-5 cubic metres before allowing for 26% empty space in packing.",
    "source": "Classic interview Fermi problem"
  },
  {
    "id": "tennis-balls-in-a-car",
    "prompt": "How many tennis balls fit inside a saloon car?",
    "unit": "tennis balls",
    "answerValue": 40000,
    "decompositionHint": "Perhaps 3 cubic metres of usable interior, and a tennis ball occupies about 1.5x10^-4 cubic metres allowing for packing gaps.",
    "source": "Classic interview Fermi problem"
  },
  {
    "id": "pennies-to-fill-a-room",
    "prompt": "How many one penny coins would fill an average bedroom?",
    "unit": "coins",
    "answerValue": 40000000,
    "decompositionHint": "A room of maybe 35 cubic metres, and a penny occupies roughly a cubic centimetre once stacking gaps are allowed for.",
    "source": "Derived from coin dimensions and room volume"
  },
  {
    "id": "hairs-cut-in-a-barbershop-per-year",
    "prompt": "How many individual hairs does a busy barber cut in a year?",
    "unit": "hairs",
    "answerValue": 500000000,
    "decompositionHint": "Perhaps 3,000 haircuts a year, each removing a fraction of the roughly 100,000 hairs on a head - but every hair on the head gets cut each time.",
    "source": "Derived from haircut volume and hair count"
  },
  {
    "id": "breaths-taken-in-a-cinema-screening",
    "prompt": "How many breaths do the people in a full cinema take during one film?",
    "unit": "breaths",
    "answerValue": 300000,
    "decompositionHint": "Around 200 people breathing roughly 14 times a minute for two hours.",
    "source": "Derived from audience size and respiratory rate"
  },
  {
    "id": "words-heard-in-a-lifetime",
    "prompt": "How many words does a person hear in a lifetime?",
    "unit": "words",
    "answerValue": 3000000000,
    "decompositionHint": "Speech runs at roughly 150 words a minute, and people are exposed to conversation, media and background talk for several hours a day.",
    "source": "Derived from speech rate and daily exposure"
  },
  {
    "id": "keystrokes-in-writing-a-novel",
    "prompt": "How many keystrokes does it take to type a novel?",
    "unit": "keystrokes",
    "answerValue": 550000,
    "decompositionHint": "About 90,000 words at roughly five letters plus a space each, before counting the deleting and rewriting.",
    "source": "Derived from novel length and word length"
  },
  {
    "id": "grains-of-salt-in-a-shaker",
    "prompt": "How many grains of salt are in a full table salt shaker?",
    "unit": "grains",
    "answerValue": 300000,
    "decompositionHint": "Perhaps 100 grams of salt, and a single grain weighs around 0.3 milligrams.",
    "source": "Derived from grain mass and shaker capacity"
  },
  {
    "id": "sheets-of-paper-in-a-filing-cabinet",
    "prompt": "How many sheets of paper fit in a four drawer filing cabinet?",
    "unit": "sheets",
    "answerValue": 20000,
    "decompositionHint": "Each drawer holds roughly 60 cm of packed paper, and 500 sheets make a stack about 5 cm thick.",
    "source": "Derived from paper thickness and drawer dimensions"
  },
  {
    "id": "cups-of-water-in-a-bathtub",
    "prompt": "How many cups of water does it take to fill a bathtub?",
    "unit": "cups",
    "answerValue": 600,
    "decompositionHint": "A bath holds around 150 litres and a cup is roughly 250 millilitres.",
    "source": "Direct unit conversion"
  },
  {
    "id": "banknotes-printed-per-year-us",
    "prompt": "How many banknotes does the United States print each year?",
    "asOf": 2025,
    "unit": "banknotes",
    "answerValue": 7000000000,
    "decompositionHint": "Most replace worn notes rather than expanding the supply. A one dollar bill lasts under seven years in circulation.",
    "source": "US Bureau of Engraving and Printing production figures"
  },
  {
    "id": "coins-in-circulation-us",
    "prompt": "How many coins are in circulation in the United States?",
    "asOf": 2025,
    "unit": "coins",
    "answerValue": 150000000000,
    "decompositionHint": "Hundreds of coins per person, most sitting unused in jars and drawers rather than actually circulating.",
    "source": "US Mint circulating coinage estimates"
  },
  {
    "id": "credit-card-transactions-per-day",
    "prompt": "How many card payments are made worldwide each day?",
    "asOf": 2025,
    "unit": "transactions",
    "answerValue": 1500000000,
    "decompositionHint": "Several billion cards in circulation, each used on the order of once every day or two.",
    "source": "Payment network transaction volumes"
  },
  {
    "id": "atm-withdrawals-per-year",
    "prompt": "How many cash withdrawals are made from ATMs worldwide each year?",
    "asOf": 2025,
    "unit": "withdrawals",
    "answerValue": 80000000000,
    "decompositionHint": "About 3 million machines each dispensing on the order of seventy times a day.",
    "source": "ATM industry transaction statistics"
  },
  {
    "id": "value-of-all-bitcoin",
    "prompt": "How many bitcoin will ever exist?",
    "unit": "bitcoin",
    "answerValue": 21000000,
    "decompositionHint": "The supply cap is fixed in the protocol, approached asymptotically as block rewards halve every four years.",
    "source": "Bitcoin protocol supply schedule"
  },
  {
    "id": "cost-of-a-loaf-of-bread-1970",
    "prompt": "What did a loaf of bread cost in the United States, in cents?",
    "asOf": 1970,
    "unit": "cents",
    "answerValue": 25,
    "decompositionHint": "Prices have risen roughly eightfold since, tracking general inflation rather than anything specific to bread.",
    "source": "US Bureau of Labor Statistics historical price data"
  },
  {
    "id": "median-house-price-us",
    "prompt": "What is the median price of a home sold in the United States, in dollars?",
    "asOf": 2025,
    "unit": "US dollars",
    "answerValue": 420000,
    "decompositionHint": "Roughly five times median household income, up from about three times in the 1980s.",
    "source": "US existing home sales price data"
  },
  {
    "id": "global-advertising-spend",
    "prompt": "How many US dollars are spent on advertising worldwide each year?",
    "asOf": 2025,
    "unit": "US dollars",
    "answerValue": 1000000000000,
    "decompositionHint": "Roughly 1% of world GDP, and now more than two thirds digital.",
    "source": "Global advertising expenditure forecasts"
  },
  {
    "id": "insurance-premiums-worldwide",
    "prompt": "How many US dollars in insurance premiums are paid worldwide each year?",
    "asOf": 2025,
    "unit": "US dollars",
    "answerValue": 7000000000000,
    "decompositionHint": "Around 7% of world GDP, split roughly evenly between life and non-life cover.",
    "source": "Swiss Re sigma insurance market reports"
  },
  {
    "id": "people-employed-worldwide",
    "prompt": "How many people are in paid employment worldwide?",
    "asOf": 2025,
    "unit": "people",
    "answerValue": 3400000000,
    "decompositionHint": "Out of about 5.5 billion of working age, with participation rates around 60%.",
    "source": "ILO global employment estimates"
  },
  {
    "id": "farmers-worldwide",
    "prompt": "How many people work in agriculture worldwide?",
    "asOf": 2025,
    "unit": "people",
    "answerValue": 850000000,
    "decompositionHint": "About a quarter of the global workforce, down from well over half in 1990 and near universal before industrialisation.",
    "source": "ILO sectoral employment data"
  },
  {
    "id": "software-developers-worldwide",
    "prompt": "How many professional software developers are there worldwide?",
    "asOf": 2025,
    "unit": "developers",
    "answerValue": 28000000,
    "decompositionHint": "Roughly one in every 120 workers, concentrated heavily in a handful of countries.",
    "source": "Developer population surveys"
  },
  {
    "id": "hours-worked-in-a-lifetime",
    "prompt": "How many hours does a person work in their career?",
    "unit": "hours",
    "answerValue": 80000,
    "decompositionHint": "About 1,800 hours a year across roughly 45 working years.",
    "source": "Derived from annual working hours"
  },
  {
    "id": "factories-in-china",
    "prompt": "How many manufacturing enterprises operate in China?",
    "asOf": 2025,
    "unit": "enterprises",
    "answerValue": 3000000,
    "decompositionHint": "Counting registered industrial firms above a revenue threshold; including tiny workshops would multiply this several times.",
    "source": "China National Bureau of Statistics industrial surveys"
  },
  {
    "id": "meetings-held-per-day-worldwide",
    "prompt": "How many business meetings take place worldwide each day?",
    "asOf": 2025,
    "unit": "meetings",
    "answerValue": 1000000000,
    "decompositionHint": "Hundreds of millions of office workers averaging a few meetings a day between them.",
    "source": "Order-of-magnitude estimate from workforce and meeting frequency"
  },
  {
    "id": "instructions-a-cpu-executes-per-second",
    "prompt": "How many instructions does a modern desktop processor execute per second?",
    "asOf": 2025,
    "unit": "instructions",
    "answerValue": 50000000000,
    "decompositionHint": "Several billion cycles a second, several instructions per cycle, across several cores.",
    "source": "Typical desktop CPU throughput figures"
  },
  {
    "id": "transistors-per-square-millimetre",
    "prompt": "How many transistors fit in one square millimetre on a leading chip process?",
    "asOf": 2025,
    "unit": "transistors",
    "answerValue": 200000000,
    "decompositionHint": "Around 200 million per square millimetre at the leading nodes, up from about a million twenty years ago.",
    "source": "Semiconductor process density figures"
  },
  {
    "id": "bytes-in-a-typical-web-page",
    "prompt": "How many bytes does an average web page transfer when it loads?",
    "asOf": 2025,
    "unit": "bytes",
    "answerValue": 2500000,
    "decompositionHint": "Images and scripts dominate. The median page has grown roughly tenfold since 2010.",
    "source": "HTTP Archive page weight reports"
  },
  {
    "id": "packets-per-second-on-the-internet",
    "prompt": "How many data packets cross the internet each second?",
    "asOf": 2025,
    "unit": "packets",
    "answerValue": 10000000000000,
    "decompositionHint": "Global traffic of several hundred terabits a second divided by a typical packet of around 1,000 bytes.",
    "source": "Derived from global traffic estimates and packet size"
  },
  {
    "id": "lines-of-code-in-a-car",
    "prompt": "How many lines of software code run in a modern car?",
    "asOf": 2025,
    "unit": "lines of code",
    "answerValue": 100000000,
    "decompositionHint": "More than a passenger aircraft, spread across a hundred or more separate control units.",
    "source": "Automotive software complexity estimates"
  },
  {
    "id": "storage-shipped-per-year",
    "prompt": "How many bytes of storage capacity are shipped worldwide each year?",
    "asOf": 2025,
    "unit": "bytes",
    "answerValue": 1.5e+21,
    "decompositionHint": "Well over a zettabyte, dominated by hard drives for data centres rather than consumer devices.",
    "source": "Storage industry shipment reports"
  },
  {
    "id": "bits-in-a-minute-of-music",
    "prompt": "How many bits are in one minute of CD quality audio?",
    "unit": "bits",
    "answerValue": 85000000,
    "decompositionHint": "44,100 samples a second, 16 bits each, two channels, times 60 seconds.",
    "source": "CD audio specification"
  },
  {
    "id": "steps-recommended-per-day",
    "prompt": "How many steps a day are typically recommended for health benefits?",
    "unit": "steps",
    "answerValue": 8000,
    "decompositionHint": "The famous 10,000 figure came from a 1960s Japanese pedometer marketing campaign; research suggests benefits plateau somewhat below it.",
    "source": "Physical activity epidemiology research"
  },
  {
    "id": "people-with-diabetes-worldwide",
    "prompt": "How many adults live with diabetes worldwide?",
    "asOf": 2025,
    "unit": "adults",
    "answerValue": 590000000,
    "decompositionHint": "Roughly one adult in nine, and the figure has more than tripled since 2000.",
    "source": "International Diabetes Federation atlas"
  },
  {
    "id": "deaths-worldwide-per-year",
    "prompt": "How many people die worldwide each year?",
    "asOf": 2025,
    "unit": "deaths",
    "answerValue": 62000000,
    "decompositionHint": "About 8 billion people with a crude death rate near 7.7 per thousand. Births exceed this by roughly 70 million, which is the annual population growth.",
    "source": "UN World Population Prospects"
  },
  {
    "id": "heart-attacks-per-year-worldwide",
    "prompt": "What percentage of all deaths worldwide are caused by cardiovascular disease?",
    "asOf": 2025,
    "unit": "percent",
    "answerValue": 32,
    "decompositionHint": "Roughly 19 million cardiovascular deaths against about 62 million deaths from all causes. It is comfortably the leading cause worldwide, ahead of cancer.",
    "source": "WHO global health estimates"
  },
  {
    "id": "antibiotic-courses-per-year",
    "prompt": "How many courses of antibiotics are taken worldwide each year?",
    "asOf": 2025,
    "unit": "courses",
    "answerValue": 40000000000,
    "decompositionHint": "Measured in defined daily doses this runs to tens of billions, unevenly distributed and heavily overused in some countries.",
    "source": "Global antibiotic consumption surveillance"
  },
  {
    "id": "spectacles-worn-worldwide",
    "prompt": "How many people wear glasses or contact lenses worldwide?",
    "asOf": 2025,
    "unit": "people",
    "answerValue": 4000000000,
    "decompositionHint": "Around half the world needs vision correction, though a substantial share of those who need it go without.",
    "source": "Vision impairment prevalence studies"
  },
  {
    "id": "hours-of-exercise-recommended-per-week",
    "prompt": "How many minutes of moderate exercise a week do health authorities recommend?",
    "unit": "minutes",
    "answerValue": 150,
    "decompositionHint": "Usually framed as thirty minutes on five days, or half that if the activity is vigorous.",
    "source": "WHO physical activity guidelines"
  },
  {
    "id": "million-seconds-in-days",
    "prompt": "How many days is one million seconds?",
    "unit": "days",
    "answerValue": 11.6,
    "decompositionHint": "86,400 seconds in a day. The contrast with a billion seconds is the point of the question.",
    "source": "Direct unit conversion"
  },
  {
    "id": "billion-seconds-in-years",
    "prompt": "How many years is one billion seconds?",
    "unit": "years",
    "answerValue": 31.7,
    "decompositionHint": "About 3.15x10^7 seconds a year. A million seconds is under a fortnight; a billion is most of a career.",
    "source": "Direct unit conversion"
  },
  {
    "id": "trillion-seconds-in-years",
    "prompt": "How many years is one trillion seconds?",
    "unit": "years",
    "answerValue": 31700,
    "decompositionHint": "A thousand times a billion seconds, taking you back well before the end of the last ice age.",
    "source": "Direct unit conversion"
  },
  {
    "id": "sheets-of-paper-to-the-moon",
    "prompt": "How many times would you fold a sheet of paper to reach the Moon?",
    "unit": "folds",
    "answerValue": 42,
    "decompositionHint": "Each fold doubles the thickness. Starting at 0.1 mm, ask what power of two exceeds 384,400 km.",
    "source": "Classic exponential growth problem"
  },
  {
    "id": "grains-of-rice-on-a-chessboard",
    "prompt": "How many grains of rice end up on a chessboard if you double on each of the 64 squares?",
    "unit": "grains",
    "answerValue": 18000000000000000000,
    "decompositionHint": "Two to the sixty-fourth minus one. More rice than the world has produced in all of history.",
    "source": "The classic wheat and chessboard problem"
  },
  {
    "id": "distance-if-earth-were-a-marble",
    "prompt": "If the Earth were shrunk to the size of a marble, how many metres away would the Moon be?",
    "unit": "metres",
    "answerValue": 0.3,
    "decompositionHint": "The Moon sits about thirty Earth diameters away, so scale that ratio onto a marble roughly a centimetre across.",
    "source": "Derived from the Earth-Moon distance ratio"
  },
  {
    "id": "humans-stacked-to-the-moon",
    "prompt": "How many people lying head to toe would reach the Moon?",
    "unit": "people",
    "answerValue": 220000000,
    "decompositionHint": "384,400 km divided by an average height of about 1.7 metres.",
    "source": "Direct unit conversion"
  },
  {
    "id": "all-humans-in-a-cube",
    "prompt": "How many kilometres on a side would a cube be that held every living human packed shoulder to shoulder?",
    "unit": "kilometres",
    "answerValue": 1,
    "decompositionHint": "A person occupies roughly 0.1 cubic metres when packed. Eight billion of those is 8x10^8 cubic metres - a cube under a kilometre on each side.",
    "source": "Derived from human body volume and world population"
  },
  {
    "id": "time-to-count-to-a-billion",
    "prompt": "How many years would it take to count to a billion out loud?",
    "unit": "years",
    "answerValue": 95,
    "decompositionHint": "At roughly one number a second without sleeping - and later numbers take much longer to say than early ones.",
    "source": "Derived from counting rate and a billion seconds"
  },
  {
    "id": "paper-thickness-doubling-to-sun",
    "prompt": "How many times must you double a sheet of paper's thickness to reach the Sun?",
    "unit": "folds",
    "answerValue": 51,
    "decompositionHint": "150 million kilometres from a 0.1 mm start. Each doubling adds a power of two, and 2^51 times 0.1 mm is about right.",
    "source": "Classic exponential growth problem"
  },
  {
    "id": "atoms-in-a-grain-of-sand",
    "prompt": "How many atoms are in a single grain of sand?",
    "unit": "atoms",
    "answerValue": 60000000000000000000,
    "decompositionHint": "A 0.5 mm grain of quartz weighs about 0.3 milligrams. Divide by the molar mass of silicon dioxide, multiply by Avogadro's number, then by three atoms per unit.",
    "source": "Standard chemistry calculation"
  },
  {
    "id": "human-cells-vs-stars-in-galaxy",
    "prompt": "How many times more cells are in your body than there are stars in the Milky Way?",
    "unit": "times",
    "answerValue": 185,
    "decompositionHint": "About 3.7x10^13 cells against roughly 2x10^11 stars.",
    "source": "Derived from human cell count and Milky Way star count"
  },
  {
    "id": "seconds-of-attention-in-a-lifetime",
    "prompt": "How many waking hours does a person have in a lifetime?",
    "unit": "hours",
    "answerValue": 460000,
    "decompositionHint": "About 16 waking hours across roughly 29,000 days.",
    "source": "Derived from lifespan and sleep duration"
  },
  {
    "id": "words-read-in-a-lifetime",
    "prompt": "How many words does a keen reader read in a lifetime?",
    "unit": "words",
    "answerValue": 500000000,
    "decompositionHint": "An hour a day at 250 words a minute across 60 years, plus everything read incidentally.",
    "source": "Derived from reading speed and daily reading time"
  },
  {
    "id": "grains-of-sand-vs-stars",
    "prompt": "How many times more stars are in the observable universe than grains of sand on Earth's beaches?",
    "unit": "times",
    "answerValue": 10,
    "decompositionHint": "Sand is estimated near 7.5x10^18 grains and stars near 10^22 to 10^24, so the ratio is large but the two are closer than the cliche suggests.",
    "source": "Derived from published sand and star estimates"
  },
  {
    "id": "breaths-in-a-cubic-metre-of-air",
    "prompt": "How many breaths could you take from one cubic metre of air before the oxygen ran too low?",
    "unit": "breaths",
    "answerValue": 400,
    "decompositionHint": "A cubic metre is 1,000 litres and a breath is half a litre, but you can only draw down a few percent of the oxygen before it becomes unbreathable.",
    "source": "Derived from tidal volume and usable oxygen fraction"
  },
  {
    "id": "trees-per-person-on-earth",
    "prompt": "How many trees are there for each person on Earth?",
    "asOf": 2025,
    "unit": "trees per person",
    "answerValue": 375,
    "decompositionHint": "Roughly three trillion trees against eight billion people. The ratio has fallen by nearly half since the start of human civilisation.",
    "source": "Crowther et al. 2015 tree count divided by world population"
  },
  {
    "id": "ants-per-person-on-earth",
    "prompt": "How many ants are there for each person on Earth?",
    "unit": "ants per person",
    "answerValue": 2500000,
    "decompositionHint": "About 2x10^16 ants against 8x10^9 people. Their combined mass rivals that of all wild birds and mammals together.",
    "source": "Schultheiss et al. 2022 ant estimate divided by world population"
  },
  {
    "id": "weight-of-all-ants-vs-humans",
    "prompt": "What fraction of the combined weight of all humans do all the world's ants weigh?",
    "unit": "fraction",
    "answerValue": 0.024,
    "decompositionHint": "Around 12 million tonnes of ants against roughly 500 million tonnes of people. The old claim that ants outweigh us turns out to be wrong by a wide margin.",
    "source": "Derived from published ant and human biomass estimates"
  },
  {
    "id": "raindrops-to-fill-a-bathtub",
    "prompt": "How many raindrops would it take to fill a bathtub?",
    "unit": "raindrops",
    "answerValue": 4500000,
    "decompositionHint": "A bath holds about 150 litres and a typical raindrop is roughly 0.03 millilitres.",
    "source": "Derived from bath volume and raindrop size"
  },
  {
    "id": "time-to-walk-around-the-world",
    "prompt": "How many days of continuous walking would it take to circle the equator?",
    "unit": "days",
    "answerValue": 333,
    "decompositionHint": "40,075 km at 5 km/h without stopping. Walking eight hours a day would take three times as long.",
    "source": "Derived from equatorial circumference and walking speed"
  },
  {
    "id": "cost-to-feed-a-person-for-a-year",
    "prompt": "How many US dollars does it cost to feed one person for a year at subsistence level?",
    "asOf": 2025,
    "unit": "US dollars",
    "answerValue": 400,
    "decompositionHint": "Around a dollar a day for basic staples in a low income country, several times that for a nutritionally adequate diet.",
    "source": "World Food Programme cost of diet analyses"
  },
  {
    "id": "water-a-person-drinks-in-a-lifetime",
    "prompt": "How many litres of water does a person drink in a lifetime?",
    "unit": "litres",
    "answerValue": 60000,
    "decompositionHint": "Roughly two litres a day across some 29,000 days.",
    "source": "Derived from daily fluid intake"
  },
  {
    "id": "air-breathed-in-a-lifetime",
    "prompt": "How many cubic metres of air does a person breathe in a lifetime?",
    "unit": "cubic metres",
    "answerValue": 300000,
    "decompositionHint": "About 11 cubic metres a day at rest, across roughly 29,000 days.",
    "source": "Derived from tidal volume and respiratory rate"
  },
  {
    "id": "cells-in-a-blue-whale",
    "prompt": "How many cells make up a blue whale?",
    "unit": "cells",
    "answerValue": 100000000000000000,
    "decompositionHint": "A human of 70 kg has about 3.7x10^13 cells. A whale is roughly 2,000 times heavier and made of broadly similar tissue.",
    "source": "Scaled from human cell count by body mass"
  },
  {
    "id": "bacteria-on-earth",
    "prompt": "How many bacterial cells are there on Earth?",
    "unit": "bacteria",
    "answerValue": 1e+30,
    "decompositionHint": "Most live in soil and in the deep subsurface rather than anywhere visible. They outweigh all animals combined.",
    "source": "Whitman et al. 1998, PNAS - prokaryote abundance estimates"
  },
  {
    "id": "grains-of-sand-on-earth",
    "prompt": "How many grains of sand are on all the beaches and deserts of Earth?",
    "unit": "grains of sand",
    "answerValue": 7500000000000000000,
    "decompositionHint": "Estimate the world's beach and desert area, a depth of a few metres, and roughly 5x10^9 grains per cubic metre.",
    "source": "Commonly cited estimate of around 7.5x10^18 grains"
  }
]

if (typeof module !== "undefined") module.exports = QUESTIONS
