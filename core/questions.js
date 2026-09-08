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
    "answerValue": 37000000000000.0,
    "decompositionHint": "Estimate body mass (~70kg), average cell mass, and that most of the count comes from small, numerous cells like red blood cells and other blood/tissue cells.",
    "source": "Bianconi et al. 2013, Annals of Human Biology - widely cited estimate ~3.72\u00d710^13"
  },
  {
    "id": "grains-of-sand-beach",
    "prompt": "How many grains of sand are on a typical 1km-long, 30m-wide beach (down to 1m depth)?",
    "unit": "grains of sand",
    "answerValue": 2500000000000000.0,
    "decompositionHint": "Compute beach volume (length x width x depth), estimate a sand grain's volume (~0.5mm cube), then divide, accounting for packing.",
    "source": "Order-of-magnitude estimate using typical sand grain size ~0.5mm"
  },
  {
    "id": "stars-in-milky-way",
    "prompt": "Approximately how many stars are in the Milky Way galaxy?",
    "unit": "stars",
    "answerValue": 200000000000.0,
    "decompositionHint": "Use the galaxy's estimated total mass and the average stellar mass to back out a star count, or recall published astronomical estimates.",
    "source": "NASA/ESA estimates typically cite 100-400 billion stars"
  },
  {
    "id": "trees-on-earth",
    "prompt": "Approximately how many trees are there on Earth?",
    "unit": "trees",
    "answerValue": 3000000000000.0,
    "decompositionHint": "Estimate global forest area and average tree density per hectare, then multiply.",
    "source": "Crowther et al. 2015, Nature - estimated ~3.04 trillion trees"
  },
  {
    "id": "water-drops-in-swimming-pool",
    "prompt": "How many drops of water would it take to fill an Olympic swimming pool (2,500 m\u00b3)?",
    "unit": "drops",
    "answerValue": 50000000000.0,
    "decompositionHint": "A typical water drop is about 0.05 mL. Convert the pool's volume to milliliters and divide by drop volume.",
    "source": "Olympic pool standard volume 2,500,000 L; typical drop ~0.05mL"
  },
  {
    "id": "words-spoken-lifetime",
    "prompt": "How many words does an average person speak in their lifetime?",
    "unit": "words",
    "answerValue": 860000000.0,
    "decompositionHint": "Estimate average words spoken per day (~16,000), multiply by days in an ~80 year lifespan, adjusting for years before speech develops.",
    "source": "Mehl et al. 2007, Science - average ~16,000 words/day"
  },
  {
    "id": "heartbeats-lifetime",
    "prompt": "How many times does an average human heart beat over a full lifetime (~80 years)?",
    "unit": "heartbeats",
    "answerValue": 3000000000.0,
    "decompositionHint": "Average resting heart rate ~70-75 bpm. Multiply beats/minute by minutes/year by 80 years.",
    "source": "Standard physiology figures; commonly cited ~2.5-3 billion beats"
  },
  {
    "id": "bricks-empire-state",
    "prompt": "Roughly how many bricks would it take to build a structure the size of the Empire State Building (if built entirely of brick)?",
    "unit": "bricks",
    "answerValue": 10000000.0,
    "decompositionHint": "Estimate the building's total exterior wall surface area and typical wall thickness, a standard brick's volume, and divide.",
    "source": "Order-of-magnitude estimate based on building volume ~37 million cubic feet"
  },
  {
    "id": "cars-in-us",
    "prompt": "How many registered passenger cars are there in the United States?",
    "unit": "cars",
    "answerValue": 280000000.0,
    "decompositionHint": "US population (~335M) x average vehicles per person (~0.8), or recall it's roughly 1 vehicle for every 1.2 people.",
    "source": "US Dept. of Transportation / Bureau of Transportation Statistics, ~280 million registered vehicles"
  },
  {
    "id": "smartphones-in-world",
    "prompt": "How many smartphones are actively in use worldwide?",
    "unit": "smartphones",
    "answerValue": 6900000000.0,
    "decompositionHint": "World population (~8B) x smartphone penetration rate (~85% of adults in many regions, lower in others, roughly ~86% overall).",
    "source": "GSMA / Statista estimates, ~6.9 billion smartphone users worldwide (2024-2025)"
  },
  {
    "id": "gallons-water-us-daily",
    "prompt": "How many gallons of water does the average US household use per day?",
    "unit": "gallons/day",
    "answerValue": 300,
    "decompositionHint": "Estimate per-person daily use (~80-100 gallons: showers, toilets, laundry, dishes) times average household size (~2.5 people).",
    "source": "US EPA WaterSense program estimates"
  },
  {
    "id": "pizza-slices-consumed-us-daily",
    "prompt": "How many slices of pizza are eaten in the United States per day?",
    "unit": "pizza slices",
    "answerValue": 100000000.0,
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
    "answerValue": 1.2e+18,
    "decompositionHint": "Estimate the grain's volume (~0.3mm cube), use NaCl's density (~2.16 g/cm\u00b3) to get mass, convert to moles via molar mass (58.44 g/mol), multiply by Avogadro's number, then by 2 (for Na and Cl atoms).",
    "source": "Standard chemistry calculation using Avogadro's number 6.022\u00d710^23"
  },
  {
    "id": "breaths-per-lifetime",
    "prompt": "How many breaths does a person take over an 80-year lifetime?",
    "unit": "breaths",
    "answerValue": 670000000.0,
    "decompositionHint": "Average resting breathing rate ~12-16 breaths/minute. Multiply by minutes/year and years lived.",
    "source": "Standard respiratory physiology figures"
  },
  {
    "id": "libraries-of-congress-internet",
    "prompt": "How many 'Libraries of Congress' worth of data (~20 petabytes of text/print) is generated globally by internet traffic in one day?",
    "unit": "Libraries of Congress",
    "answerValue": 15000,
    "decompositionHint": "Global daily internet traffic is roughly 300+ exabytes (2024 estimates). Convert to petabytes and divide by ~20 PB.",
    "source": "Cisco/various internet traffic reports; Library of Congress print collection estimated at ~20TB-20PB depending on what's counted (text only vs. all formats)"
  },
  {
    "id": "bacteria-per-human-body",
    "prompt": "How many bacterial cells live in and on an average human body?",
    "unit": "bacterial cells",
    "answerValue": 38000000000000.0,
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
    "unit": "planes",
    "answerValue": 9000,
    "decompositionHint": "Global commercial fleet is ~25,000-30,000 aircraft; at peak times a large fraction are airborne simultaneously across time zones.",
    "source": "FlightAware/Flightradar24 peak concurrent flight estimates, ~9,000-20,000 depending on time of day"
  },
  {
    "id": "gold-total-mined",
    "prompt": "How much gold has ever been mined in human history, in metric tons?",
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
    "unit": "chickens",
    "answerValue": 26000000000.0,
    "decompositionHint": "World population (~8B) x average annual chicken meat + egg consumption per person, combined with typical chicken lifespan before slaughter (~6 weeks for broilers), gives a standing population estimate.",
    "source": "UN FAO livestock statistics, ~26 billion chickens (roughly 3x the human population)"
  },
  {
    "id": "gasoline-us-daily",
    "prompt": "How many gallons of gasoline does the US consume per day?",
    "unit": "gallons/day",
    "answerValue": 370000000.0,
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
    "answerValue": 3800000000000.0,
    "decompositionHint": "Convert the Earth-Moon distance to millimeters and divide by a single note's thickness.",
    "source": "Simple unit-conversion Fermi problem"
  },
  {
    "id": "credit-cards-us-total",
    "prompt": "How many active credit card accounts are there in the United States?",
    "unit": "credit card accounts",
    "answerValue": 680000000.0,
    "decompositionHint": "US adult population (~260M) x average number of credit cards per adult (~2.5-4, since many people hold multiple cards).",
    "source": "Federal Reserve / credit bureau (Experian) reports"
  },
  {
    "id": "keystrokes-programmer-lifetime",
    "prompt": "How many keystrokes might a professional software developer type over a 30-year career?",
    "unit": "keystrokes",
    "answerValue": 300000000.0,
    "decompositionHint": "Estimate typing hours/day at work (~4 active hours), typing speed in keystrokes/minute (~150 including code/comments/chat), workdays/year (~230), and years (30).",
    "source": "Order-of-magnitude estimate from typical office typing patterns"
  },
  {
    "id": "raindrops-in-thunderstorm",
    "prompt": "How many individual raindrops fall during a typical thunderstorm covering 100 km\u00b2 and dropping 25mm of rain?",
    "unit": "raindrops",
    "answerValue": 80000000000000.0,
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
    "answerValue": 2e+16,
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
    "unit": "emails",
    "answerValue": 360000000000.0,
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
    "unit": "grains of rice",
    "answerValue": 20000000000000000,
    "decompositionHint": "World rice production is roughly 5x10^11 kg per year. A single grain weighs about 0.025 g. Convert and divide.",
    "source": "FAO rice production statistics and typical grain mass"
  },
  {
    "id": "people-ever-lived",
    "prompt": "How many humans have ever been born in the whole of human history?",
    "unit": "people",
    "answerValue": 117000000000,
    "decompositionHint": "Integrate population over time: populations were tiny for most of prehistory but birth rates were high, so the cumulative total is dominated by the last few thousand years. Today's 8 billion is only about 7% of the total.",
    "source": "Population Reference Bureau estimate, ~117 billion people ever born"
  },
  {
    "id": "people-born-per-day",
    "prompt": "How many babies are born worldwide each day?",
    "unit": "births/day",
    "answerValue": 385000,
    "decompositionHint": "World population ~8x10^9 with a crude birth rate of ~17 per 1,000 people per year. Multiply, then divide by 365.",
    "source": "UN World Population Prospects birth rate data"
  },
  {
    "id": "weight-of-all-humans",
    "prompt": "What is the combined mass of every living human, in kilograms?",
    "unit": "kilograms",
    "answerValue": 500000000000,
    "decompositionHint": "World population (~8.1x10^9) times average body mass across all ages (~62 kg, lower than the adult average because a large fraction are children).",
    "source": "World population x global mean body mass estimates"
  },
  {
    "id": "internet-users-worldwide",
    "prompt": "How many people worldwide use the internet?",
    "unit": "people",
    "answerValue": 5400000000,
    "decompositionHint": "World population ~8.1 billion with global penetration around two thirds, much higher in wealthy regions and lower in parts of Africa and South Asia.",
    "source": "ITU global connectivity statistics, ~67% of the world online"
  },
  {
    "id": "google-searches-per-day",
    "prompt": "How many searches does Google handle per day?",
    "unit": "searches",
    "answerValue": 8500000000,
    "decompositionHint": "Estimate the number of active users (billions) and average searches each per day (a handful), remembering that a large share of queries come from a small heavy-use minority.",
    "source": "Widely cited industry figure, ~8.5 billion searches per day"
  },
  {
    "id": "youtube-hours-uploaded-per-minute",
    "prompt": "How many hours of video are uploaded to YouTube every minute?",
    "unit": "hours/minute",
    "answerValue": 500,
    "decompositionHint": "A useful sanity check: this means YouTube receives far more video per day than a person could watch in several lifetimes.",
    "source": "YouTube/Google published upload statistics, ~500 hours per minute"
  },
  {
    "id": "messages-sent-per-day-worldwide",
    "prompt": "How many messages are sent on WhatsApp worldwide each day?",
    "unit": "messages",
    "answerValue": 100000000000,
    "decompositionHint": "Roughly 2 billion users sending on the order of tens of messages a day each.",
    "source": "Meta published messaging volume, ~100 billion messages per day"
  },
  {
    "id": "photos-taken-per-year",
    "prompt": "How many photographs are taken worldwide in a year?",
    "unit": "photographs",
    "answerValue": 1900000000000,
    "decompositionHint": "Around 5 billion smartphone owners, each taking a handful of photos on an average day. Multiply by 365.",
    "source": "Industry estimates of annual photo volume, ~1.8-2 trillion"
  },
  {
    "id": "commercial-flights-per-day",
    "prompt": "How many commercial flights take off worldwide on a typical day?",
    "unit": "flights",
    "answerValue": 100000,
    "decompositionHint": "The global commercial fleet is ~25,000-30,000 aircraft, and a typical airliner flies several sectors per day.",
    "source": "Flight tracking services report ~100,000 commercial flights daily"
  },
  {
    "id": "air-passengers-per-year",
    "prompt": "How many passenger journeys are flown worldwide in a year?",
    "unit": "passenger journeys",
    "answerValue": 4500000000,
    "decompositionHint": "About 100,000 flights a day, averaging on the order of 100+ passengers each, times 365 days.",
    "source": "IATA/ICAO annual passenger traffic statistics"
  },
  {
    "id": "cups-of-coffee-per-day-worldwide",
    "prompt": "How many cups of coffee are drunk worldwide each day?",
    "unit": "cups",
    "answerValue": 2250000000,
    "decompositionHint": "Global green coffee production is ~10 million tonnes a year; roughly 10 g of coffee makes a cup. Convert and divide by 365.",
    "source": "International Coffee Organization consumption figures, ~2 billion cups daily"
  },
  {
    "id": "bananas-eaten-per-year",
    "prompt": "How many individual bananas are eaten worldwide in a year?",
    "unit": "bananas",
    "answerValue": 1100000000000,
    "decompositionHint": "World banana production is roughly 1.3x10^11 kg per year, and a banana weighs about 120 g of edible fruit. Divide.",
    "source": "FAO banana production statistics and typical fruit mass"
  },
  {
    "id": "plastic-bottles-per-minute",
    "prompt": "How many plastic drink bottles are sold worldwide every minute?",
    "unit": "bottles/minute",
    "answerValue": 1000000,
    "decompositionHint": "Annual sales are on the order of half a trillion bottles. Divide by the ~525,600 minutes in a year.",
    "source": "Widely cited packaging industry figure, ~1 million bottles per minute"
  },
  {
    "id": "books-published-per-year",
    "prompt": "How many new book titles are published worldwide each year?",
    "unit": "titles",
    "answerValue": 2200000,
    "decompositionHint": "Large publishing markets each produce tens to hundreds of thousands of titles a year; summing major markets and adding self-published titles gets you into the low millions.",
    "source": "UNESCO and national ISBN agency statistics"
  },
  {
    "id": "pencils-made-per-year",
    "prompt": "How many wooden pencils are manufactured worldwide each year?",
    "unit": "pencils",
    "answerValue": 14000000000,
    "decompositionHint": "Roughly two pencils per person on Earth per year is a reasonable anchor, weighted heavily towards school-age users.",
    "source": "Pencil industry estimates, ~14 billion pencils annually"
  },
  {
    "id": "lego-elements-per-year",
    "prompt": "How many individual LEGO elements are produced each year?",
    "unit": "LEGO elements",
    "answerValue": 75000000000,
    "decompositionHint": "Estimate sets sold per year and average pieces per set - the answer works out to roughly ten pieces for every person on Earth, every year.",
    "source": "LEGO Group published production figures, ~75 billion elements per year"
  },
  {
    "id": "shipping-containers-per-year",
    "prompt": "How many shipping containers (TEU) pass through the world's ports in a year?",
    "unit": "TEU",
    "answerValue": 850000000,
    "decompositionHint": "The largest single port handles tens of millions of TEU per year; the global total is dominated by a few dozen major ports.",
    "source": "UNCTAD world container port throughput statistics"
  },
  {
    "id": "us-currency-in-circulation",
    "prompt": "What is the total value of US physical currency in circulation, in dollars?",
    "unit": "US dollars",
    "answerValue": 2300000000000,
    "decompositionHint": "Most of the value sits in $100 notes, a large share of which are held outside the United States. That works out to several thousand dollars of cash per American.",
    "source": "US Federal Reserve currency in circulation data"
  },
  {
    "id": "atms-worldwide",
    "prompt": "How many ATMs are there worldwide?",
    "unit": "ATMs",
    "answerValue": 3000000,
    "decompositionHint": "Roughly one ATM per few thousand people globally, with much higher density in wealthy and cash-heavy economies.",
    "source": "World Bank / ATM industry statistics, ~3 million machines"
  },
  {
    "id": "mcdonalds-customers-per-day",
    "prompt": "How many customers does McDonald's serve worldwide per day?",
    "unit": "customers/day",
    "answerValue": 69000000,
    "decompositionHint": "About 40,000 restaurants worldwide, each serving on the order of 1,500-2,000 customers a day.",
    "source": "McDonald's corporate reporting, ~69 million customers daily"
  },
  {
    "id": "gas-stations-in-us",
    "prompt": "How many petrol stations (gas stations) are there in the United States?",
    "unit": "stations",
    "answerValue": 145000,
    "decompositionHint": "US population ~335 million; roughly one station per 2,000-2,500 people is a reasonable density for a car-dependent country.",
    "source": "US convenience store and fuel retailing industry counts"
  },
  {
    "id": "roads-in-us-length",
    "prompt": "How many kilometres of public road are there in the United States?",
    "unit": "kilometres",
    "answerValue": 6600000,
    "decompositionHint": "Estimate from settlement density: every town needs local streets, and the interstate system alone is only ~78,000 km, so local roads dominate the total by two orders of magnitude.",
    "source": "US Federal Highway Administration, ~4.1 million miles of public road"
  },
  {
    "id": "km-driven-per-car-per-year",
    "prompt": "How many kilometres does an average car travel in one year?",
    "unit": "kilometres/year",
    "answerValue": 15000,
    "decompositionHint": "A typical commute is on the order of 30-50 km a day round trip on working days, plus errands and occasional long trips.",
    "source": "National transport survey averages (~12,000-15,000 km/year)"
  },
  {
    "id": "hospitals-in-us",
    "prompt": "How many hospitals are there in the United States?",
    "unit": "hospitals",
    "answerValue": 6100,
    "decompositionHint": "US population ~335 million; a hospital typically serves a catchment of tens of thousands of people.",
    "source": "American Hospital Association registered hospital counts"
  },
  {
    "id": "public-libraries-in-us",
    "prompt": "How many public libraries are there in the United States?",
    "unit": "libraries",
    "answerValue": 17000,
    "decompositionHint": "Most towns of any size have at least one branch; estimate the number of towns above a few thousand people.",
    "source": "Institute of Museum and Library Services public library survey"
  },
  {
    "id": "schools-in-us",
    "prompt": "How many K-12 schools are there in the United States?",
    "unit": "schools",
    "answerValue": 130000,
    "decompositionHint": "About 50 million school-age children, with an average school enrolling a few hundred students.",
    "source": "US National Center for Education Statistics"
  },
  {
    "id": "words-in-english-wikipedia",
    "prompt": "How many words are there in the whole of English Wikipedia?",
    "unit": "words",
    "answerValue": 4600000000,
    "decompositionHint": "Roughly 7 million articles averaging several hundred words each - though the mean is dragged up by a minority of very long articles.",
    "source": "Wikipedia's own published statistics on article count and size"
  },
  {
    "id": "transistors-in-a-smartphone-chip",
    "prompt": "How many transistors are on a modern flagship smartphone processor?",
    "unit": "transistors",
    "answerValue": 15000000000,
    "decompositionHint": "Chip area is on the order of 1 cm^2 and modern process nodes pack on the order of 10^8 transistors per mm^2.",
    "source": "Published die statistics for recent flagship mobile SoCs (~15-20 billion)"
  },
  {
    "id": "cups-of-tea-uk-per-day",
    "prompt": "How many cups of tea are drunk in the United Kingdom each day?",
    "unit": "cups",
    "answerValue": 100000000,
    "decompositionHint": "UK population ~68 million; the commonly cited average is a bit under two cups per person per day.",
    "source": "UK Tea and Infusions Association, ~100 million cups daily"
  },
  {
    "id": "sheep-in-new-zealand",
    "prompt": "How many sheep are there in New Zealand?",
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
  }
]

if (typeof module !== "undefined") module.exports = QUESTIONS
