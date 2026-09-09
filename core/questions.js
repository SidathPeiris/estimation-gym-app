var QUESTIONS = [
  {
    "id": "piano-tuners-chicago",
    "prompt": "How many professional piano tuners work in the Chicago metro area?",
    "unit": "piano tuners",
    "answerValue": 100,
    "decompositionHint": "Metro population (~9.5M) \u2192 households with a piano (~1 in 20) \u2192 pianos tuned about once a year \u2192 a full-time tuner can do ~4 tunings/day, ~250 working days/year (~1000/year). Divide pianos-needing-tuning by tunings-per-tuner-per-year.",
    "strategy": "population-rate",
    "source": "Classic Fermi problem (originally posed by Enrico Fermi); widely accepted estimate range 50-200"
  },
  {
    "id": "golf-balls-school-bus",
    "prompt": "How many standard golf balls would fit inside an empty school bus?",
    "unit": "golf balls",
    "answerValue": 500000,
    "decompositionHint": "Estimate the bus's interior volume (~cuboid, roughly 8m x 2.5m x 2m \u2248 40 m\u00b3), a golf ball's volume (~40 mL, diameter ~4.3cm), account for ~74% packing efficiency for spheres, then divide.",
    "strategy": "volume-packing",
    "source": "Classic interview-style Fermi problem; order-of-magnitude estimate"
  },
  {
    "id": "hairs-on-human-head",
    "prompt": "How many hairs are on an average adult human head?",
    "unit": "hairs",
    "answerValue": 100000,
    "decompositionHint": "Estimate scalp area (~600 cm\u00b2) and hair density (~150-200 hairs per cm\u00b2), then multiply.",
    "strategy": "area-density",
    "source": "Dermatology references; typical range 80,000-120,000"
  },
  {
    "id": "cells-in-human-body",
    "prompt": "Roughly how many cells are in the adult human body?",
    "unit": "cells",
    "answerValue": 37000000000000,
    "decompositionHint": "Estimate body mass (~70kg), average cell mass, and that most of the count comes from small, numerous cells like red blood cells and other blood/tissue cells.",
    "strategy": "chain-multiply",
    "source": "Bianconi et al. 2013, Annals of Human Biology - widely cited estimate ~3.72\u00d710^13"
  },
  {
    "id": "grains-of-sand-beach",
    "prompt": "How many grains of sand are on a typical 1km-long, 30m-wide beach (down to 1m depth)?",
    "unit": "grains of sand",
    "answerValue": 2500000000000000,
    "decompositionHint": "Compute beach volume (length x width x depth), estimate a sand grain's volume (~0.5mm cube), then divide, accounting for packing.",
    "strategy": "volume-packing",
    "source": "Order-of-magnitude estimate using typical sand grain size ~0.5mm"
  },
  {
    "id": "stars-in-milky-way",
    "prompt": "Approximately how many stars are in the Milky Way galaxy?",
    "unit": "stars",
    "answerValue": 200000000000,
    "decompositionHint": "Use the galaxy's estimated total mass and the average stellar mass to back out a star count, or recall published astronomical estimates.",
    "strategy": "recall-sanity",
    "source": "NASA/ESA estimates typically cite 100-400 billion stars"
  },
  {
    "id": "trees-on-earth",
    "prompt": "Approximately how many trees are there on Earth?",
    "unit": "trees",
    "answerValue": 3000000000000,
    "decompositionHint": "Estimate global forest area and average tree density per hectare, then multiply.",
    "strategy": "area-density",
    "source": "Crowther et al. 2015, Nature - estimated ~3.04 trillion trees"
  },
  {
    "id": "water-drops-in-swimming-pool",
    "prompt": "How many drops of water would it take to fill an Olympic swimming pool (2,500 m\u00b3)?",
    "unit": "drops",
    "answerValue": 50000000000,
    "decompositionHint": "A typical water drop is about 0.05 mL. Convert the pool's volume to milliliters and divide by drop volume.",
    "strategy": "unit-conversion",
    "source": "Olympic pool standard volume 2,500,000 L; typical drop ~0.05mL"
  },
  {
    "id": "words-spoken-lifetime",
    "prompt": "How many words does an average person speak in their lifetime?",
    "unit": "words",
    "answerValue": 860000000,
    "decompositionHint": "Estimate average words spoken per day (~16,000), multiply by days in an ~80 year lifespan, adjusting for years before speech develops.",
    "strategy": "stock-flow",
    "source": "Mehl et al. 2007, Science - average ~16,000 words/day"
  },
  {
    "id": "heartbeats-lifetime",
    "prompt": "How many times does an average human heart beat over a full lifetime (~80 years)?",
    "unit": "heartbeats",
    "answerValue": 3000000000,
    "decompositionHint": "Average resting heart rate ~70-75 bpm. Multiply beats/minute by minutes/year by 80 years.",
    "strategy": "chain-multiply",
    "source": "Standard physiology figures; commonly cited ~2.5-3 billion beats"
  },
  {
    "id": "bricks-empire-state",
    "prompt": "Roughly how many bricks would it take to build a structure the size of the Empire State Building (if built entirely of brick)?",
    "unit": "bricks",
    "answerValue": 10000000,
    "decompositionHint": "Estimate the building's total exterior wall surface area and typical wall thickness, a standard brick's volume, and divide.",
    "strategy": "area-density",
    "source": "Order-of-magnitude estimate based on building volume ~37 million cubic feet"
  },
  {
    "id": "cars-in-us",
    "prompt": "How many registered passenger cars are there in the United States?",
    "asOf": 2025,
    "unit": "cars",
    "answerValue": 280000000,
    "decompositionHint": "US population (~335M) x average vehicles per person (~0.8), or recall it's roughly 1 vehicle for every 1.2 people.",
    "strategy": "population-rate",
    "source": "US Dept. of Transportation / Bureau of Transportation Statistics, ~280 million registered vehicles"
  },
  {
    "id": "smartphones-in-world",
    "prompt": "How many smartphones are actively in use worldwide?",
    "asOf": 2025,
    "unit": "smartphones",
    "answerValue": 6900000000,
    "decompositionHint": "World population (~8B) x smartphone penetration rate (~85% of adults in many regions, lower in others, roughly ~86% overall).",
    "strategy": "population-rate",
    "source": "GSMA / Statista estimates, ~6.9 billion smartphone users worldwide (2024-2025)"
  },
  {
    "id": "gallons-water-us-daily",
    "prompt": "How many gallons of water does the average US household use per day?",
    "asOf": 2025,
    "unit": "gallons/day",
    "answerValue": 300,
    "decompositionHint": "Estimate per-person daily use (~80-100 gallons: showers, toilets, laundry, dishes) times average household size (~2.5 people).",
    "strategy": "rate-time",
    "source": "US EPA WaterSense program estimates"
  },
  {
    "id": "pizza-slices-consumed-us-daily",
    "prompt": "How many slices of pizza are eaten in the United States per day?",
    "asOf": 2025,
    "unit": "pizza slices",
    "answerValue": 100000000,
    "decompositionHint": "US population (~335M), estimate fraction eating pizza on a given day (~13% per commonly cited industry figures) x average slices per person (~2-3).",
    "strategy": "population-rate",
    "source": "Often-cited pizza industry statistic: ~100 million slices/day"
  },
  {
    "id": "leaves-on-oak-tree",
    "prompt": "How many leaves are on a mature oak tree?",
    "unit": "leaves",
    "answerValue": 200000,
    "decompositionHint": "Estimate canopy volume or number of branches x leaves per branch, or use published estimates for a mature tree's leaf count.",
    "strategy": "chain-multiply",
    "source": "Botanical estimates for mature oaks, typically 100,000-250,000 leaves"
  },
  {
    "id": "atoms-in-grain-of-salt",
    "prompt": "Approximately how many atoms are in a single grain of table salt (NaCl)?",
    "unit": "atoms",
    "answerValue": 1200000000000000000,
    "decompositionHint": "Estimate the grain's volume (~0.3mm cube), use NaCl's density (~2.16 g/cm\u00b3) to get mass, convert to moles via molar mass (58.44 g/mol), multiply by Avogadro's number, then by 2 (for Na and Cl atoms).",
    "strategy": "molar",
    "source": "Standard chemistry calculation using Avogadro's number 6.022\u00d710^23"
  },
  {
    "id": "breaths-per-lifetime",
    "prompt": "How many breaths does a person take over an 80-year lifetime?",
    "unit": "breaths",
    "answerValue": 670000000,
    "decompositionHint": "Average resting breathing rate ~12-16 breaths/minute. Multiply by minutes/year and years lived.",
    "strategy": "chain-multiply",
    "source": "Standard respiratory physiology figures"
  },
  {
    "id": "libraries-of-congress-internet",
    "prompt": "How many 'Libraries of Congress' worth of data (~20 petabytes of text/print) is generated globally by internet traffic in one day?",
    "asOf": 2025,
    "unit": "Libraries of Congress",
    "answerValue": 15000,
    "decompositionHint": "Global daily internet traffic is roughly 300+ exabytes (2024 estimates). Convert to petabytes and divide by ~20 PB.",
    "strategy": "unit-conversion",
    "source": "Cisco/various internet traffic reports; Library of Congress print collection estimated at ~20TB-20PB depending on what's counted (text only vs. all formats)"
  },
  {
    "id": "bacteria-per-human-body",
    "prompt": "How many bacterial cells live in and on an average human body?",
    "unit": "bacterial cells",
    "answerValue": 38000000000000,
    "decompositionHint": "Recent research revised the old '10x more bacteria than human cells' claim - the actual ratio is close to 1:1. Use human cell count (~3.7\u00d710^13) as an anchor.",
    "strategy": "anchor-scale",
    "source": "Sender, Fuchs, Milo 2016, PLOS Biology - revised bacteria:human cell ratio ~1.3:1"
  },
  {
    "id": "steps-across-us",
    "prompt": "How many walking steps would it take to cross the continental US (~4,500 km) coast to coast?",
    "unit": "steps",
    "answerValue": 6000000,
    "decompositionHint": "Average adult stride length is about 0.75m. Convert the distance to meters and divide by stride length.",
    "strategy": "unit-conversion",
    "source": "Standard stride length figures (~0.7-0.8m)"
  },
  {
    "id": "planes-in-air-worldwide",
    "prompt": "At any given moment, how many commercial passenger planes are in the air worldwide?",
    "asOf": 2025,
    "unit": "planes",
    "answerValue": 9000,
    "decompositionHint": "Global commercial fleet is ~25,000-30,000 aircraft; at peak times a large fraction are airborne simultaneously across time zones.",
    "strategy": "chain-multiply",
    "source": "FlightAware/Flightradar24 peak concurrent flight estimates, ~9,000-20,000 depending on time of day"
  },
  {
    "id": "gold-total-mined",
    "prompt": "How much gold has ever been mined in human history, in metric tons?",
    "asOf": 2025,
    "unit": "metric tons",
    "answerValue": 212000,
    "decompositionHint": "This is largely a recall-based estimate, but you can sanity check: if all mined gold were melted into a cube, it would only be about 22m on a side - gold is surprisingly rare relative to its cultural prominence.",
    "strategy": "anchor-scale",
    "source": "World Gold Council estimates, ~212,000 tonnes as of recent surveys"
  },
  {
    "id": "words-in-average-novel",
    "prompt": "How many words are in an average full-length novel?",
    "unit": "words",
    "answerValue": 90000,
    "decompositionHint": "Estimate pages (~300) x words per page (~300 for typical prose formatting).",
    "strategy": "chain-multiply",
    "source": "Standard publishing industry figures, typical novel 70,000-100,000 words"
  },
  {
    "id": "blood-vessels-length",
    "prompt": "If you laid out all the blood vessels in an adult human body end to end, how many kilometers long would they be?",
    "unit": "kilometers",
    "answerValue": 100000,
    "decompositionHint": "Most of the length comes from capillaries, which are extremely numerous and thin despite each being very short - the count of capillaries dominates over their individual length.",
    "strategy": "recall-sanity",
    "source": "Commonly cited physiology estimate, ~60,000-100,000 km total"
  },
  {
    "id": "chickens-on-earth",
    "prompt": "How many live chickens are there on Earth at any given time?",
    "asOf": 2025,
    "unit": "chickens",
    "answerValue": 26000000000,
    "decompositionHint": "World population (~8B) x average annual chicken meat + egg consumption per person, combined with typical chicken lifespan before slaughter (~6 weeks for broilers), gives a standing population estimate.",
    "strategy": "stock-flow",
    "source": "UN FAO livestock statistics, ~26 billion chickens (roughly 3x the human population)"
  },
  {
    "id": "gasoline-us-daily",
    "prompt": "How many gallons of gasoline does the US consume per day?",
    "asOf": 2025,
    "unit": "gallons/day",
    "answerValue": 370000000,
    "decompositionHint": "US has ~280M registered vehicles, average ~25-30 miles driven/day per active vehicle isn't quite right - better: total annual gasoline consumption (~135 billion gallons/year) divided by 365.",
    "strategy": "energy-balance",
    "source": "US Energy Information Administration (EIA) data"
  },
  {
    "id": "distance-blood-cell-travels-per-day",
    "prompt": "How many kilometers does a single red blood cell travel through the circulatory system in one day?",
    "unit": "kilometers",
    "answerValue": 19,
    "decompositionHint": "The heart completes a full circulation roughly once per minute at rest. Estimate the average circuit length (~1000-1300 cm through the full vascular loop) and multiply by circuits per day.",
    "strategy": "rate-time",
    "source": "Physiology estimate based on ~1 full circulation per minute"
  },
  {
    "id": "e-coli-bacteria-mass-doubling",
    "prompt": "If a single E. coli bacterium divided unchecked every 20 minutes, how many hours would it take for its descendants' total mass to exceed the mass of Earth?",
    "unit": "hours",
    "answerValue": 66,
    "decompositionHint": "Each doubling multiplies mass by 2. Figure out how many doublings are needed to go from one bacterium's mass (~1 picogram) to Earth's mass (~6\u00d710^24 kg), then multiply doublings by 20 minutes.",
    "strategy": "exponential",
    "source": "Classic exponential-growth Fermi/math problem"
  },
  {
    "id": "post-it-notes-stacked-to-moon",
    "prompt": "How many standard Post-it notes (0.1mm thick) would you need to stack to reach the Moon (384,400 km away)?",
    "unit": "Post-it notes",
    "answerValue": 3800000000000,
    "decompositionHint": "Convert the Earth-Moon distance to millimeters and divide by a single note's thickness.",
    "strategy": "unit-conversion",
    "source": "Simple unit-conversion Fermi problem"
  },
  {
    "id": "credit-cards-us-total",
    "prompt": "How many active credit card accounts are there in the United States?",
    "asOf": 2025,
    "unit": "credit card accounts",
    "answerValue": 680000000,
    "decompositionHint": "US adult population (~260M) x average number of credit cards per adult (~2.5-4, since many people hold multiple cards).",
    "strategy": "population-rate",
    "source": "Federal Reserve / credit bureau (Experian) reports"
  },
  {
    "id": "keystrokes-programmer-lifetime",
    "prompt": "How many keystrokes might a professional software developer type over a 30-year career?",
    "unit": "keystrokes",
    "answerValue": 300000000,
    "decompositionHint": "Estimate typing hours/day at work (~4 active hours), typing speed in keystrokes/minute (~150 including code/comments/chat), workdays/year (~230), and years (30).",
    "strategy": "chain-multiply",
    "source": "Order-of-magnitude estimate from typical office typing patterns"
  },
  {
    "id": "raindrops-in-thunderstorm",
    "prompt": "How many individual raindrops fall during a typical thunderstorm covering 100 km\u00b2 and dropping 25mm of rain?",
    "unit": "raindrops",
    "answerValue": 80000000000000,
    "decompositionHint": "Total rain volume = area x depth. A typical raindrop is about 4mm in diameter (~34 microliters). Divide total volume by single-drop volume.",
    "strategy": "divide-total",
    "source": "Standard meteorology figures for raindrop size (2-5mm typical)"
  },
  {
    "id": "solar-energy-hitting-earth-per-hour",
    "prompt": "How does the solar energy hitting Earth in one hour compare to total global human energy consumption in one year? (express as a ratio, hours-of-sunlight-equivalent : 1 year)",
    "unit": "ratio (roughly X:1)",
    "answerValue": 1,
    "decompositionHint": "This is the famous 'more energy from the sun in an hour than humanity uses in a year' claim - the two quantities are roughly equal in order of magnitude (~5\u00d710^20 J vs ~6\u00d710^20 J), so the ratio is close to 1:1.",
    "strategy": "energy-balance",
    "source": "US Dept. of Energy solar energy figures; widely cited comparison, roughly accurate to within a factor of ~1"
  },
  {
    "id": "sheets-toilet-paper-lifetime",
    "prompt": "How many sheets of toilet paper does an average American use in a lifetime (~80 years)?",
    "unit": "sheets",
    "answerValue": 384000,
    "decompositionHint": "Average American uses roughly 3-4 rolls per week (~200 sheets/roll). Multiply weekly sheet use by weeks in 80 years.",
    "strategy": "chain-multiply",
    "source": "Industry consumption estimates (~100+ rolls/person/year in the US)"
  },
  {
    "id": "ants-on-earth",
    "prompt": "Approximately how many individual ants are alive on Earth at any given time?",
    "unit": "ants",
    "answerValue": 20000000000000000,
    "decompositionHint": "This requires recalling a published biomass-based estimate - ant biomass roughly matches or exceeds human biomass despite ants being tiny, implying an enormous count.",
    "strategy": "recall-sanity",
    "source": "Schultheiss et al. 2022, PNAS - estimated ~20 quadrillion (2\u00d710^16) ants globally"
  },
  {
    "id": "revolutions-earth-around-sun-human-history",
    "prompt": "How many times has Earth orbited the Sun since the first Homo sapiens appeared (~300,000 years ago)?",
    "unit": "orbits",
    "answerValue": 300000,
    "decompositionHint": "One orbit equals one year, so this reduces directly to the number of years elapsed - a reminder that not every Fermi problem needs heavy decomposition.",
    "strategy": "chain-multiply",
    "source": "Paleoanthropological dating of earliest Homo sapiens fossils (~300,000 years, Jebel Irhoud find)"
  },
  {
    "id": "emails-sent-per-day-worldwide",
    "prompt": "How many emails are sent worldwide per day?",
    "asOf": 2025,
    "unit": "emails",
    "answerValue": 360000000000,
    "decompositionHint": "Estimate number of email accounts (~4-5B users, several accounts each) x average emails sent per account per day (~15-30, weighted heavily by automated/business email).",
    "strategy": "rate-time",
    "source": "Radicati Group email statistics reports"
  },
  {
    "id": "distance-dna-in-body-stretched",
    "prompt": "If you unwound all the DNA in a single human body and laid the strands end to end, how many times could that length span the distance from Earth to the Sun (~150 million km) round trip?",
    "unit": "round trips",
    "answerValue": 400,
    "decompositionHint": "Each cell's DNA is about 2m long, and the body has ~3.7\u00d710^13 cells. Multiply to get total DNA length, then divide by twice the Earth-Sun distance.",
    "strategy": "divide-total",
    "source": "Combines cell count (Bianconi et al. 2013) with commonly cited ~2m of DNA per cell"
  },
  {
    "id": "seconds-in-a-century",
    "prompt": "How many seconds are there in a century?",
    "unit": "seconds",
    "answerValue": 3160000000,
    "decompositionHint": "60 seconds x 60 minutes x 24 hours x 365.25 days x 100 years. Worth internalising: a century is only about 3 billion seconds, so a human lifetime is on the order of 2-3 billion.",
    "strategy": "unit-conversion",
    "source": "Direct unit conversion"
  },
  {
    "id": "atoms-in-human-body",
    "prompt": "Approximately how many atoms make up an adult human body?",
    "unit": "atoms",
    "answerValue": 7e+27,
    "decompositionHint": "Body mass ~70 kg, mostly water. A water molecule is 18 g/mol and contains 3 atoms, so work out moles of water, multiply by Avogadro's number and by atoms per molecule.",
    "strategy": "molar",
    "source": "Standard physics estimate, ~7x10^27 atoms"
  },
  {
    "id": "water-molecules-in-a-glass",
    "prompt": "How many water molecules are in a single 250 mL glass of water?",
    "unit": "molecules",
    "answerValue": 8.4e+24,
    "decompositionHint": "250 mL of water weighs 250 g. Divide by the molar mass of water (18 g/mol) to get moles, then multiply by Avogadro's number.",
    "strategy": "molar",
    "source": "Standard chemistry calculation using Avogadro's number"
  },
  {
    "id": "air-molecules-in-a-breath",
    "prompt": "How many air molecules are in a single normal breath (~0.5 litres)?",
    "unit": "molecules",
    "answerValue": 1.3e+22,
    "decompositionHint": "One mole of gas occupies about 22.4 litres at standard conditions. Divide 0.5 L by 22.4 L/mol to get moles, then multiply by Avogadro's number.",
    "strategy": "molar",
    "source": "Ideal gas molar volume and Avogadro's number"
  },
  {
    "id": "molecules-of-caesars-last-breath",
    "prompt": "Roughly how many molecules from Julius Caesar's dying breath are in the breath you just took?",
    "unit": "molecules",
    "answerValue": 1,
    "decompositionHint": "Compare molecules in one breath (~10^22) against molecules in the whole atmosphere (~10^44). The ratio of one breath to the atmosphere, squared by the two-step mixing, lands on roughly one molecule - the classic surprise is that the answer is about 1, not 0.",
    "strategy": "anchor-scale",
    "source": "Classic Fermi problem; standard result is on the order of a single molecule"
  },
  {
    "id": "seconds-since-big-bang",
    "prompt": "How many seconds have elapsed since the Big Bang (~13.8 billion years ago)?",
    "unit": "seconds",
    "answerValue": 440000000000000000,
    "decompositionHint": "There are about 3.15x10^7 seconds in a year. Multiply by 1.38x10^10 years.",
    "strategy": "rate-time",
    "source": "Planck mission age of the universe (~13.8 billion years) x seconds per year"
  },
  {
    "id": "galaxies-in-observable-universe",
    "prompt": "How many galaxies are estimated to exist in the observable universe?",
    "unit": "galaxies",
    "answerValue": 2000000000000,
    "decompositionHint": "Deep-field images count galaxies in a tiny patch of sky, then scale that density up to the whole celestial sphere.",
    "strategy": "area-density",
    "source": "Hubble/JWST deep field extrapolations; estimates range from ~2x10^11 to ~2x10^12"
  },
  {
    "id": "distance-to-nearest-star",
    "prompt": "How many kilometres away is the nearest star to the Sun (Proxima Centauri)?",
    "unit": "kilometres",
    "answerValue": 40000000000000,
    "decompositionHint": "Proxima Centauri is about 4.2 light years away. A light year is roughly 9.5x10^12 km - light travels 300,000 km/s times ~3.15x10^7 seconds per year.",
    "strategy": "unit-conversion",
    "source": "Standard astronomical distance, ~4.24 light years"
  },
  {
    "id": "earth-mass",
    "prompt": "What is the mass of the Earth, in kilograms?",
    "unit": "kilograms",
    "answerValue": 5.97e+24,
    "decompositionHint": "Earth's radius is ~6,371 km, so compute the volume of a sphere, then multiply by average density (~5,500 kg/m^3 - higher than surface rock because of the iron core).",
    "strategy": "volume-packing",
    "source": "Standard geophysical constant, 5.97x10^24 kg"
  },
  {
    "id": "mass-of-atmosphere",
    "prompt": "What is the total mass of Earth's atmosphere, in kilograms?",
    "unit": "kilograms",
    "answerValue": 5150000000000000000,
    "decompositionHint": "Atmospheric pressure at sea level is ~101,000 N/m^2, which is the weight of the air column above each square metre. Divide by g to get mass per square metre, then multiply by Earth's surface area (~5.1x10^14 m^2).",
    "strategy": "area-density",
    "source": "Derived from sea-level pressure and Earth's surface area"
  },
  {
    "id": "light-circuits-of-earth-per-second",
    "prompt": "How many times could a beam of light circle the Earth's equator in one second?",
    "unit": "circuits",
    "answerValue": 7.5,
    "decompositionHint": "Light travels 300,000 km per second; Earth's equatorial circumference is about 40,075 km. Divide.",
    "strategy": "divide-total",
    "source": "Speed of light and Earth's equatorial circumference"
  },
  {
    "id": "earths-that-fit-inside-the-sun",
    "prompt": "How many Earths would fit inside the volume of the Sun?",
    "unit": "Earths",
    "answerValue": 1300000,
    "decompositionHint": "The Sun's radius is about 109 times Earth's. Volume scales with the cube of radius, so cube 109.",
    "strategy": "volume-packing",
    "source": "Ratio of solar to terrestrial radius, cubed"
  },
  {
    "id": "neurons-in-human-brain",
    "prompt": "How many neurons are in an adult human brain?",
    "unit": "neurons",
    "answerValue": 86000000000,
    "decompositionHint": "This is largely recall, but note the popular '100 billion' figure was a guess later measured more carefully - the real number is close to 86 billion.",
    "strategy": "recall-sanity",
    "source": "Azevedo et al. 2009, Journal of Comparative Neurology - ~86 billion neurons"
  },
  {
    "id": "synapses-in-human-brain",
    "prompt": "How many synapses (connections between neurons) are in an adult human brain?",
    "unit": "synapses",
    "answerValue": 150000000000000,
    "decompositionHint": "Start from ~8.6x10^10 neurons and multiply by average connections per neuron (on the order of 1,000-10,000).",
    "strategy": "chain-multiply",
    "source": "Neuroscience estimates, ~100-150 trillion synapses"
  },
  {
    "id": "red-blood-cells-in-body",
    "prompt": "How many red blood cells are in an adult human body?",
    "unit": "red blood cells",
    "answerValue": 25000000000000,
    "decompositionHint": "An adult has ~5 litres of blood, and blood contains roughly 5x10^6 red blood cells per microlitre. Convert litres to microlitres and multiply.",
    "strategy": "unit-conversion",
    "source": "Standard haematology reference ranges"
  },
  {
    "id": "cells-replaced-per-second",
    "prompt": "How many cells does an adult human body replace every second?",
    "unit": "cells/second",
    "answerValue": 3800000,
    "decompositionHint": "Roughly 330 billion cells are replaced per day, dominated by short-lived blood and gut lining cells. Divide by 86,400 seconds.",
    "strategy": "unit-conversion",
    "source": "Cell turnover estimates, ~3.3x10^11 cells replaced per day"
  },
  {
    "id": "blinks-per-year",
    "prompt": "How many times does an average person blink in a year?",
    "unit": "blinks",
    "answerValue": 5300000,
    "decompositionHint": "About 15 blinks per minute while awake, ~16 waking hours a day, 365 days a year.",
    "strategy": "rate-time",
    "source": "Ophthalmology figures, ~15-20 blinks per minute"
  },
  {
    "id": "steps-in-a-lifetime",
    "prompt": "How many steps does an average person walk in an 80-year lifetime?",
    "unit": "steps",
    "answerValue": 220000000,
    "decompositionHint": "Typical daily step counts are ~5,000-8,000. Multiply by 365 days and ~75 active years.",
    "strategy": "rate-time",
    "source": "Pedometer studies of average daily step counts"
  },
  {
    "id": "blood-pumped-per-day",
    "prompt": "How many litres of blood does the heart pump in a single day?",
    "unit": "litres/day",
    "answerValue": 7000,
    "decompositionHint": "Each beat ejects ~70 mL. Multiply by ~70 beats/minute, 60 minutes and 24 hours.",
    "strategy": "unit-conversion",
    "source": "Standard cardiac output figures (~5 L/min at rest)"
  },
  {
    "id": "bacteria-in-the-mouth",
    "prompt": "How many bacteria live in an average human mouth?",
    "unit": "bacteria",
    "answerValue": 20000000000,
    "decompositionHint": "Saliva alone carries ~10^8 bacteria per millilitre, and most of the population sits in plaque and on the tongue rather than free in saliva.",
    "strategy": "area-density",
    "source": "Oral microbiology estimates, ~10-100 billion bacteria"
  },
  {
    "id": "taste-buds-on-tongue",
    "prompt": "How many taste buds does an average adult have?",
    "unit": "taste buds",
    "answerValue": 10000,
    "decompositionHint": "Taste buds sit in the papillae covering the tongue, with a few thousand more spread across the palate and throat.",
    "strategy": "decompose",
    "source": "Standard anatomy references, ~2,000-10,000 taste buds"
  },
  {
    "id": "hair-growth-over-a-lifetime",
    "prompt": "If a single scalp hair were never cut and never fell out, how many metres would it grow over 80 years?",
    "unit": "metres",
    "answerValue": 12,
    "decompositionHint": "Scalp hair grows roughly 1.25 cm per month. Multiply by 12 months and 80 years, then convert to metres. (In reality each hair falls out after a few years, which is why nobody has 12-metre hair.)",
    "strategy": "unit-conversion",
    "source": "Standard hair growth rate, ~1-1.5 cm per month"
  },
  {
    "id": "seconds-in-a-lifetime",
    "prompt": "How many seconds does an average person live (~80 years)?",
    "unit": "seconds",
    "answerValue": 2500000000,
    "decompositionHint": "About 3.15x10^7 seconds per year, times 80.",
    "strategy": "rate-time",
    "source": "Direct unit conversion"
  },
  {
    "id": "species-on-earth",
    "prompt": "How many species (of all kinds) are estimated to exist on Earth?",
    "unit": "species",
    "answerValue": 8700000,
    "decompositionHint": "Only ~1.2 million species have been formally described. Estimates extrapolate from how the rate of new descriptions is slowing within well-studied groups.",
    "strategy": "recall-sanity",
    "source": "Mora et al. 2011, PLOS Biology - estimated ~8.7 million eukaryotic species"
  },
  {
    "id": "insects-alive-on-earth",
    "prompt": "How many individual insects are alive on Earth at any moment?",
    "unit": "insects",
    "answerValue": 10000000000000000000,
    "decompositionHint": "Estimate insects per square metre of land (on the order of thousands when soil-dwellers are counted) and multiply by Earth's land area (~1.5x10^14 m^2).",
    "strategy": "area-density",
    "source": "Entomological biomass estimates, commonly cited on the order of 10^18-10^19"
  },
  {
    "id": "cattle-in-the-world",
    "prompt": "How many cattle are alive in the world at any given time?",
    "asOf": 2025,
    "unit": "cattle",
    "answerValue": 1500000000,
    "decompositionHint": "Global beef and dairy output divided by per-animal yield, or simply anchor on the fact that cattle number roughly one for every five or six people.",
    "strategy": "divide-total",
    "source": "UN FAO livestock statistics, ~1.5 billion head"
  },
  {
    "id": "honeybee-flower-visits-per-kg-honey",
    "prompt": "How many flower visits do honeybees need to make to produce one kilogram of honey?",
    "unit": "flower visits",
    "answerValue": 4400000,
    "decompositionHint": "A bee carries a tiny nectar load per trip and nectar is mostly water that must be evaporated off. The widely quoted figure is about two million flower visits per pound of honey.",
    "strategy": "rate-time",
    "source": "Beekeeping figures, ~2 million flower visits per pound"
  },
  {
    "id": "grains-of-rice-produced-per-year",
    "prompt": "How many individual grains of rice are produced worldwide in a year?",
    "asOf": 2025,
    "unit": "grains of rice",
    "answerValue": 20000000000000000,
    "decompositionHint": "World rice production is roughly 5x10^11 kg per year. A single grain weighs about 0.025 g. Convert and divide.",
    "strategy": "unit-conversion",
    "source": "FAO rice production statistics and typical grain mass"
  },
  {
    "id": "people-ever-lived",
    "prompt": "How many humans have ever been born in the whole of human history?",
    "asOf": 2025,
    "unit": "people",
    "answerValue": 117000000000,
    "decompositionHint": "Integrate population over time: populations were tiny for most of prehistory but birth rates were high, so the cumulative total is dominated by the last few thousand years. Today's 8 billion is only about 7% of the total.",
    "strategy": "population-rate",
    "source": "Population Reference Bureau estimate, ~117 billion people ever born"
  },
  {
    "id": "people-born-per-day",
    "prompt": "How many babies are born worldwide each day?",
    "asOf": 2025,
    "unit": "births/day",
    "answerValue": 385000,
    "decompositionHint": "World population ~8x10^9 with a crude birth rate of ~17 per 1,000 people per year. Multiply, then divide by 365.",
    "strategy": "population-rate",
    "source": "UN World Population Prospects birth rate data"
  },
  {
    "id": "weight-of-all-humans",
    "prompt": "What is the combined mass of every living human, in kilograms?",
    "asOf": 2025,
    "unit": "kilograms",
    "answerValue": 500000000000,
    "decompositionHint": "World population (~8.1x10^9) times average body mass across all ages (~62 kg, lower than the adult average because a large fraction are children).",
    "strategy": "population-rate",
    "source": "World population x global mean body mass estimates"
  },
  {
    "id": "internet-users-worldwide",
    "prompt": "How many people worldwide use the internet?",
    "asOf": 2025,
    "unit": "people",
    "answerValue": 5400000000,
    "decompositionHint": "World population ~8.1 billion with global penetration around two thirds, much higher in wealthy regions and lower in parts of Africa and South Asia.",
    "strategy": "population-rate",
    "source": "ITU global connectivity statistics, ~67% of the world online"
  },
  {
    "id": "google-searches-per-day",
    "prompt": "How many searches does Google handle per day?",
    "asOf": 2025,
    "unit": "searches",
    "answerValue": 8500000000,
    "decompositionHint": "Estimate the number of active users (billions) and average searches each per day (a handful), remembering that a large share of queries come from a small heavy-use minority.",
    "strategy": "rate-time",
    "source": "Widely cited industry figure, ~8.5 billion searches per day"
  },
  {
    "id": "youtube-hours-uploaded-per-minute",
    "prompt": "How many hours of video are uploaded to YouTube every minute?",
    "asOf": 2025,
    "unit": "hours/minute",
    "answerValue": 500,
    "decompositionHint": "A useful sanity check: this means YouTube receives far more video per day than a person could watch in several lifetimes.",
    "strategy": "rate-time",
    "source": "YouTube/Google published upload statistics, ~500 hours per minute"
  },
  {
    "id": "messages-sent-per-day-worldwide",
    "prompt": "How many messages are sent on WhatsApp worldwide each day?",
    "asOf": 2025,
    "unit": "messages",
    "answerValue": 100000000000,
    "decompositionHint": "Roughly 2 billion users sending on the order of tens of messages a day each.",
    "strategy": "rate-time",
    "source": "Meta published messaging volume, ~100 billion messages per day"
  },
  {
    "id": "photos-taken-per-year",
    "prompt": "How many photographs are taken worldwide in a year?",
    "asOf": 2025,
    "unit": "photographs",
    "answerValue": 1900000000000,
    "decompositionHint": "Around 5 billion smartphone owners, each taking a handful of photos on an average day. Multiply by 365.",
    "strategy": "rate-time",
    "source": "Industry estimates of annual photo volume, ~1.8-2 trillion"
  },
  {
    "id": "commercial-flights-per-day",
    "prompt": "How many commercial flights take off worldwide on a typical day?",
    "asOf": 2025,
    "unit": "flights",
    "answerValue": 100000,
    "decompositionHint": "The global commercial fleet is ~25,000-30,000 aircraft, and a typical airliner flies several sectors per day.",
    "strategy": "rate-time",
    "source": "Flight tracking services report ~100,000 commercial flights daily"
  },
  {
    "id": "air-passengers-per-year",
    "prompt": "How many passenger journeys are flown worldwide in a year?",
    "asOf": 2025,
    "unit": "passenger journeys",
    "answerValue": 4500000000,
    "decompositionHint": "About 100,000 flights a day, averaging on the order of 100+ passengers each, times 365 days.",
    "strategy": "rate-time",
    "source": "IATA/ICAO annual passenger traffic statistics"
  },
  {
    "id": "cups-of-coffee-per-day-worldwide",
    "prompt": "How many cups of coffee are drunk worldwide each day?",
    "asOf": 2025,
    "unit": "cups",
    "answerValue": 2250000000,
    "decompositionHint": "Global green coffee production is ~10 million tonnes a year; roughly 10 g of coffee makes a cup. Convert and divide by 365.",
    "strategy": "unit-conversion",
    "source": "International Coffee Organization consumption figures, ~2 billion cups daily"
  },
  {
    "id": "bananas-eaten-per-year",
    "prompt": "How many individual bananas are eaten worldwide in a year?",
    "asOf": 2025,
    "unit": "bananas",
    "answerValue": 1100000000000,
    "decompositionHint": "World banana production is roughly 1.3x10^11 kg per year, and a banana weighs about 120 g of edible fruit. Divide.",
    "strategy": "divide-total",
    "source": "FAO banana production statistics and typical fruit mass"
  },
  {
    "id": "plastic-bottles-per-minute",
    "prompt": "How many plastic drink bottles are sold worldwide every minute?",
    "asOf": 2025,
    "unit": "bottles/minute",
    "answerValue": 1000000,
    "decompositionHint": "Annual sales are on the order of half a trillion bottles. Divide by the ~525,600 minutes in a year.",
    "strategy": "divide-total",
    "source": "Widely cited packaging industry figure, ~1 million bottles per minute"
  },
  {
    "id": "books-published-per-year",
    "prompt": "How many new book titles are published worldwide each year?",
    "asOf": 2025,
    "unit": "titles",
    "answerValue": 2200000,
    "decompositionHint": "Large publishing markets each produce tens to hundreds of thousands of titles a year; summing major markets and adding self-published titles gets you into the low millions.",
    "strategy": "rate-time",
    "source": "UNESCO and national ISBN agency statistics"
  },
  {
    "id": "pencils-made-per-year",
    "prompt": "How many wooden pencils are manufactured worldwide each year?",
    "asOf": 2025,
    "unit": "pencils",
    "answerValue": 14000000000,
    "decompositionHint": "Roughly two pencils per person on Earth per year is a reasonable anchor, weighted heavily towards school-age users.",
    "strategy": "population-rate",
    "source": "Pencil industry estimates, ~14 billion pencils annually"
  },
  {
    "id": "lego-elements-per-year",
    "prompt": "How many individual LEGO elements are produced each year?",
    "asOf": 2025,
    "unit": "LEGO elements",
    "answerValue": 75000000000,
    "decompositionHint": "Estimate sets sold per year and average pieces per set - the answer works out to roughly ten pieces for every person on Earth, every year.",
    "strategy": "rate-time",
    "source": "LEGO Group published production figures, ~75 billion elements per year"
  },
  {
    "id": "shipping-containers-per-year",
    "prompt": "How many shipping containers (TEU) pass through the world's ports in a year?",
    "asOf": 2025,
    "unit": "TEU",
    "answerValue": 850000000,
    "decompositionHint": "The largest single port handles tens of millions of TEU per year; the global total is dominated by a few dozen major ports.",
    "strategy": "rate-time",
    "source": "UNCTAD world container port throughput statistics"
  },
  {
    "id": "us-currency-in-circulation",
    "prompt": "What is the total value of US physical currency in circulation, in dollars?",
    "asOf": 2025,
    "unit": "US dollars",
    "answerValue": 2300000000000,
    "decompositionHint": "Most of the value sits in $100 notes, a large share of which are held outside the United States. That works out to several thousand dollars of cash per American.",
    "strategy": "decompose",
    "source": "US Federal Reserve currency in circulation data"
  },
  {
    "id": "atms-worldwide",
    "prompt": "How many ATMs are there worldwide?",
    "asOf": 2025,
    "unit": "ATMs",
    "answerValue": 3000000,
    "decompositionHint": "Roughly one ATM per few thousand people globally, with much higher density in wealthy and cash-heavy economies.",
    "strategy": "area-density",
    "source": "World Bank / ATM industry statistics, ~3 million machines"
  },
  {
    "id": "mcdonalds-customers-per-day",
    "prompt": "How many customers does McDonald's serve worldwide per day?",
    "asOf": 2025,
    "unit": "customers/day",
    "answerValue": 69000000,
    "decompositionHint": "About 40,000 restaurants worldwide, each serving on the order of 1,500-2,000 customers a day.",
    "strategy": "rate-time",
    "source": "McDonald's corporate reporting, ~69 million customers daily"
  },
  {
    "id": "gas-stations-in-us",
    "prompt": "How many petrol stations (gas stations) are there in the United States?",
    "asOf": 2025,
    "unit": "stations",
    "answerValue": 145000,
    "decompositionHint": "US population ~335 million; roughly one station per 2,000-2,500 people is a reasonable density for a car-dependent country.",
    "strategy": "area-density",
    "source": "US convenience store and fuel retailing industry counts"
  },
  {
    "id": "roads-in-us-length",
    "prompt": "How many kilometres of public road are there in the United States?",
    "asOf": 2025,
    "unit": "kilometres",
    "answerValue": 6600000,
    "decompositionHint": "Estimate from settlement density: every town needs local streets, and the interstate system alone is only ~78,000 km, so local roads dominate the total by two orders of magnitude.",
    "strategy": "area-density",
    "source": "US Federal Highway Administration, ~4.1 million miles of public road"
  },
  {
    "id": "km-driven-per-car-per-year",
    "prompt": "How many kilometres does an average car travel in one year?",
    "asOf": 2025,
    "unit": "kilometres/year",
    "answerValue": 15000,
    "decompositionHint": "A typical commute is on the order of 30-50 km a day round trip on working days, plus errands and occasional long trips.",
    "strategy": "rate-time",
    "source": "National transport survey averages (~12,000-15,000 km/year)"
  },
  {
    "id": "hospitals-in-us",
    "prompt": "How many hospitals are there in the United States?",
    "asOf": 2025,
    "unit": "hospitals",
    "answerValue": 6100,
    "decompositionHint": "US population ~335 million; a hospital typically serves a catchment of tens of thousands of people.",
    "strategy": "population-rate",
    "source": "American Hospital Association registered hospital counts"
  },
  {
    "id": "public-libraries-in-us",
    "prompt": "How many public libraries are there in the United States?",
    "asOf": 2025,
    "unit": "libraries",
    "answerValue": 17000,
    "decompositionHint": "Most towns of any size have at least one branch; estimate the number of towns above a few thousand people.",
    "strategy": "chain-multiply",
    "source": "Institute of Museum and Library Services public library survey"
  },
  {
    "id": "schools-in-us",
    "prompt": "How many K-12 schools are there in the United States?",
    "asOf": 2025,
    "unit": "schools",
    "answerValue": 130000,
    "decompositionHint": "About 50 million school-age children, with an average school enrolling a few hundred students.",
    "strategy": "population-rate",
    "source": "US National Center for Education Statistics"
  },
  {
    "id": "words-in-english-wikipedia",
    "prompt": "How many words are there in the whole of English Wikipedia?",
    "asOf": 2025,
    "unit": "words",
    "answerValue": 4600000000,
    "decompositionHint": "Roughly 7 million articles averaging several hundred words each - though the mean is dragged up by a minority of very long articles.",
    "strategy": "decompose",
    "source": "Wikipedia's own published statistics on article count and size"
  },
  {
    "id": "transistors-in-a-smartphone-chip",
    "prompt": "How many transistors are on a modern flagship smartphone processor?",
    "asOf": 2025,
    "unit": "transistors",
    "answerValue": 15000000000,
    "decompositionHint": "Chip area is on the order of 1 cm^2 and modern process nodes pack on the order of 10^8 transistors per mm^2.",
    "strategy": "decompose",
    "source": "Published die statistics for recent flagship mobile SoCs (~15-20 billion)"
  },
  {
    "id": "cups-of-tea-uk-per-day",
    "prompt": "How many cups of tea are drunk in the United Kingdom each day?",
    "asOf": 2025,
    "unit": "cups",
    "answerValue": 100000000,
    "decompositionHint": "UK population ~68 million; the commonly cited average is a bit under two cups per person per day.",
    "strategy": "population-rate",
    "source": "UK Tea and Infusions Association, ~100 million cups daily"
  },
  {
    "id": "sheep-in-new-zealand",
    "prompt": "How many sheep are there in New Zealand?",
    "asOf": 2025,
    "unit": "sheep",
    "answerValue": 25000000,
    "decompositionHint": "The famous ratio of sheep to people has fallen a long way from its 1980s peak of over 20:1, but is still around 5:1 against a population of ~5 million.",
    "strategy": "population-rate",
    "source": "Stats NZ agricultural production statistics"
  },
  {
    "id": "calories-burned-per-day",
    "prompt": "How many kilocalories does an average adult burn in a day?",
    "unit": "kilocalories/day",
    "answerValue": 2000,
    "decompositionHint": "Basal metabolic rate accounts for most of it (~1,400-1,700 kcal), with activity adding a few hundred more for a sedentary person.",
    "strategy": "energy-balance",
    "source": "Standard dietary reference intakes"
  },
  {
    "id": "world-population-1800",
    "prompt": "What was the world's total human population?",
    "asOf": 1800,
    "unit": "people",
    "answerValue": 1000000000,
    "decompositionHint": "The first billion was reached right around 1800 after millennia of very slow growth. Everything since is the anomaly, not the norm.",
    "strategy": "population-rate",
    "source": "UN and HYDE historical population reconstructions"
  },
  {
    "id": "world-population-1900",
    "prompt": "What was the world's total human population?",
    "asOf": 1900,
    "unit": "people",
    "answerValue": 1650000000,
    "decompositionHint": "Growth from 1800 to 1900 was well under a doubling. Industrialisation had begun but the great mortality decline had not yet reached most of the world.",
    "strategy": "exponential",
    "source": "UN and HYDE historical population reconstructions"
  },
  {
    "id": "world-population-1950",
    "prompt": "What was the world's total human population?",
    "asOf": 1950,
    "unit": "people",
    "answerValue": 2500000000,
    "decompositionHint": "Half a century after 1900 added roughly as many people as the whole of prior history had by 1800. The acceleration is the story here.",
    "strategy": "population-rate",
    "source": "UN World Population Prospects"
  },
  {
    "id": "world-population-2000",
    "prompt": "What was the world's total human population?",
    "asOf": 2000,
    "unit": "people",
    "answerValue": 6100000000,
    "decompositionHint": "The population roughly doubled between 1960 and 2000, the fastest sustained growth in human history.",
    "strategy": "population-rate",
    "source": "UN World Population Prospects"
  },
  {
    "id": "world-population-2025",
    "prompt": "What is the world's total human population?",
    "asOf": 2025,
    "unit": "people",
    "answerValue": 8200000000,
    "decompositionHint": "Growth has slowed markedly since the 1960s peak rate. Adding the eighth billion took about twelve years.",
    "strategy": "population-rate",
    "source": "UN World Population Prospects"
  },
  {
    "id": "global-life-expectancy-1900",
    "prompt": "What was average life expectancy at birth worldwide, in years?",
    "asOf": 1900,
    "unit": "years",
    "answerValue": 32,
    "decompositionHint": "Dominated by infant and child mortality rather than short adult lives - someone who survived to twenty could still expect a further few decades.",
    "strategy": "decompose",
    "source": "Historical demography reconstructions"
  },
  {
    "id": "global-life-expectancy-1950",
    "prompt": "What was average life expectancy at birth worldwide, in years?",
    "asOf": 1950,
    "unit": "years",
    "answerValue": 46,
    "decompositionHint": "Most of the gain over 1900 came from falling child mortality, driven by sanitation and vaccination rather than by medicine for the old.",
    "strategy": "population-rate",
    "source": "UN World Population Prospects"
  },
  {
    "id": "global-life-expectancy-2025",
    "prompt": "What is average life expectancy at birth worldwide, in years?",
    "asOf": 2025,
    "unit": "years",
    "answerValue": 73,
    "decompositionHint": "Global average across very different national figures, from the low sixties in parts of Africa to the mid eighties in Japan.",
    "strategy": "decompose",
    "source": "WHO and UN life expectancy estimates"
  },
  {
    "id": "us-population-1790",
    "prompt": "What was the population of the United States at its first census?",
    "asOf": 1790,
    "unit": "people",
    "answerValue": 3900000,
    "decompositionHint": "Thirteen states, overwhelmingly rural, with no city above about 50,000 people. Smaller than a single large metro area today.",
    "strategy": "population-rate",
    "source": "US Census Bureau, 1790 census"
  },
  {
    "id": "us-population-1900",
    "prompt": "What was the population of the United States?",
    "asOf": 1900,
    "unit": "people",
    "answerValue": 76000000,
    "decompositionHint": "Roughly twenty times the 1790 figure after a century of immigration and westward expansion, but still under a quarter of today's.",
    "strategy": "population-rate",
    "source": "US Census Bureau"
  },
  {
    "id": "us-population-2025",
    "prompt": "What is the population of the United States?",
    "asOf": 2025,
    "unit": "people",
    "answerValue": 340000000,
    "decompositionHint": "About four percent of world population, and the third largest country after India and China.",
    "strategy": "population-rate",
    "source": "US Census Bureau estimates"
  },
  {
    "id": "cost-per-gigabyte-1990",
    "prompt": "What did one gigabyte of hard disk storage cost, in US dollars?",
    "asOf": 1990,
    "unit": "US dollars",
    "answerValue": 10000,
    "decompositionHint": "Drives were priced per megabyte then, at roughly ten dollars each. Multiply by a thousand megabytes to reach a gigabyte.",
    "strategy": "chain-multiply",
    "source": "Historical storage price surveys"
  },
  {
    "id": "cost-per-gigabyte-2025",
    "prompt": "What does one gigabyte of hard disk storage cost, in US dollars?",
    "asOf": 2025,
    "unit": "US dollars",
    "answerValue": 0.02,
    "decompositionHint": "A consumer drive of several terabytes costs under a hundred dollars. Divide the price by the capacity in gigabytes.",
    "strategy": "divide-total",
    "source": "Consumer drive pricing"
  },
  {
    "id": "transistors-intel-4004",
    "prompt": "How many transistors were on the first commercial microprocessor, the Intel 4004?",
    "asOf": 1971,
    "unit": "transistors",
    "answerValue": 2300,
    "decompositionHint": "Small enough to be counted by hand on a die photograph. Compare against a modern chip to feel five decades of Moore's law.",
    "strategy": "anchor-scale",
    "source": "Intel historical specifications"
  },
  {
    "id": "internet-users-2000",
    "prompt": "How many people worldwide used the internet?",
    "asOf": 2000,
    "unit": "people",
    "answerValue": 410000000,
    "decompositionHint": "Under seven percent of the world, concentrated in wealthy countries and mostly on dial-up connections.",
    "strategy": "population-rate",
    "source": "ITU historical connectivity statistics"
  },
  {
    "id": "mobile-subscriptions-1995",
    "prompt": "How many mobile phone subscriptions existed worldwide?",
    "asOf": 1995,
    "unit": "subscriptions",
    "answerValue": 90000000,
    "decompositionHint": "Under two percent of the world's population, when a handset was still an expensive business tool rather than a default possession.",
    "strategy": "population-rate",
    "source": "ITU historical telecommunications statistics"
  },
  {
    "id": "cars-in-world-1950",
    "prompt": "How many motor vehicles were in use worldwide?",
    "asOf": 1950,
    "unit": "vehicles",
    "answerValue": 70000000,
    "decompositionHint": "Overwhelmingly American - the United States held the large majority of the world's vehicles at mid century.",
    "strategy": "anchor-scale",
    "source": "Historical automotive production and registration data"
  },
  {
    "id": "cars-in-world-2025",
    "prompt": "How many motor vehicles are in use worldwide?",
    "asOf": 2025,
    "unit": "vehicles",
    "answerValue": 1500000000,
    "decompositionHint": "Roughly one vehicle for every five or six people globally, with enormous variation between countries.",
    "strategy": "anchor-scale",
    "source": "International vehicle registration statistics"
  },
  {
    "id": "co2-ppm-1960",
    "prompt": "What was the concentration of carbon dioxide in the atmosphere, in parts per million?",
    "asOf": 1960,
    "unit": "parts per million",
    "answerValue": 317,
    "decompositionHint": "The Mauna Loa record began in 1958 near 315 ppm, against a pre-industrial baseline of about 280.",
    "strategy": "anchor-scale",
    "source": "NOAA Mauna Loa observatory record"
  },
  {
    "id": "co2-ppm-2025",
    "prompt": "What is the concentration of carbon dioxide in the atmosphere, in parts per million?",
    "asOf": 2025,
    "unit": "parts per million",
    "answerValue": 425,
    "decompositionHint": "Rising roughly two to three parts per million each year from the 1960 figure - a small number that compounds steadily.",
    "strategy": "anchor-scale",
    "source": "NOAA Mauna Loa observatory record"
  },
  {
    "id": "un-member-states-1945",
    "prompt": "How many member states did the United Nations have at its founding?",
    "asOf": 1945,
    "unit": "member states",
    "answerValue": 51,
    "decompositionHint": "Before decolonisation. Most of Africa and much of Asia was still under colonial rule and therefore unrepresented.",
    "strategy": "decompose",
    "source": "United Nations founding records"
  },
  {
    "id": "mass-of-the-moon",
    "prompt": "What is the mass of the Moon, in kilograms?",
    "unit": "kilograms",
    "answerValue": 7.35e+22,
    "decompositionHint": "The Moon's radius is about a quarter of Earth's, so its volume is roughly one sixtieth, and it is somewhat less dense as well.",
    "strategy": "recall-sanity",
    "source": "Standard astronomical constant"
  },
  {
    "id": "mass-of-the-sun",
    "prompt": "What is the mass of the Sun, in kilograms?",
    "unit": "kilograms",
    "answerValue": 1.99e+30,
    "decompositionHint": "About 330,000 times Earth's mass, and roughly 99.9 percent of all the mass in the solar system.",
    "strategy": "chain-multiply",
    "source": "Standard astronomical constant"
  },
  {
    "id": "temperature-of-suns-core",
    "prompt": "How hot is the core of the Sun, in kelvin?",
    "unit": "kelvin",
    "answerValue": 15000000,
    "decompositionHint": "Hot enough to sustain hydrogen fusion. The visible surface is only about 5,800 K, so the core is thousands of times hotter.",
    "strategy": "chain-multiply",
    "source": "Standard solar model"
  },
  {
    "id": "distance-earth-to-sun",
    "prompt": "How far is the Earth from the Sun, in kilometres?",
    "unit": "kilometres",
    "answerValue": 150000000,
    "decompositionHint": "Light takes about eight minutes to cross it, so multiply 300,000 km/s by roughly 500 seconds.",
    "strategy": "unit-conversion",
    "source": "Astronomical unit, 149.6 million km"
  },
  {
    "id": "earth-orbital-speed",
    "prompt": "How fast does the Earth travel around the Sun, in kilometres per hour?",
    "unit": "kilometres per hour",
    "answerValue": 107000,
    "decompositionHint": "Divide the circumference of Earth's orbit (2 pi times 150 million km) by the hours in a year.",
    "strategy": "divide-total",
    "source": "Derived from orbital radius and period"
  },
  {
    "id": "atoms-in-observable-universe",
    "prompt": "Roughly how many atoms are in the observable universe?",
    "unit": "atoms",
    "answerValue": 1e+80,
    "decompositionHint": "Multiply the number of stars per galaxy by the number of galaxies, then by the atoms in an average star. Most ordinary matter is hydrogen in stars and gas.",
    "strategy": "chain-multiply",
    "source": "Standard cosmological estimate, 10^78 to 10^82"
  },
  {
    "id": "energy-in-a-lightning-bolt",
    "prompt": "How much energy does a typical lightning bolt release, in joules?",
    "unit": "joules",
    "answerValue": 5000000000,
    "decompositionHint": "Enough to power a household for weeks, but delivered in microseconds - the power is spectacular, the total energy less so than people expect.",
    "strategy": "energy-balance",
    "source": "Atmospheric physics estimates, roughly 1-10 gigajoules"
  },
  {
    "id": "lightning-strikes-per-day",
    "prompt": "How many lightning strikes hit the Earth each day?",
    "unit": "strikes",
    "answerValue": 8000000,
    "decompositionHint": "Roughly a hundred every second, concentrated over tropical land masses rather than spread evenly.",
    "strategy": "rate-time",
    "source": "NASA and satellite lightning detection data"
  },
  {
    "id": "meteorite-mass-hitting-earth-per-year",
    "prompt": "How many kilograms of meteoritic material fall to Earth each year?",
    "unit": "kilograms",
    "answerValue": 15000000,
    "decompositionHint": "Almost all of it is dust and grains that burn up unnoticed, not the rare large impacts that get attention.",
    "strategy": "rate-time",
    "source": "Planetary science estimates, roughly 15,000 tonnes per year"
  },
  {
    "id": "neutrinos-through-a-thumbnail",
    "prompt": "How many solar neutrinos pass through an area the size of your thumbnail each second?",
    "unit": "neutrinos",
    "answerValue": 65000000000,
    "decompositionHint": "The solar neutrino flux at Earth is about 6.5x10^10 per square centimetre per second, and a thumbnail is roughly a square centimetre.",
    "strategy": "area-density",
    "source": "Standard solar model neutrino flux"
  },
  {
    "id": "age-of-the-earth",
    "prompt": "How old is the Earth, in years?",
    "unit": "years",
    "answerValue": 4540000000,
    "decompositionHint": "Dated by radiometric measurement of the oldest meteorites, which formed with the solar system. About a third of the age of the universe.",
    "strategy": "recall-sanity",
    "source": "Radiometric dating, 4.54 billion years"
  },
  {
    "id": "kilometres-in-a-light-year",
    "prompt": "How many kilometres are there in one light year?",
    "unit": "kilometres",
    "answerValue": 9460000000000,
    "decompositionHint": "Light travels 300,000 km each second. Multiply by the roughly 3.15x10^7 seconds in a year.",
    "strategy": "unit-conversion",
    "source": "Direct calculation from the speed of light"
  },
  {
    "id": "molecules-in-a-drop-of-water",
    "prompt": "How many water molecules are in a single drop of water?",
    "unit": "molecules",
    "answerValue": 1.7e+21,
    "decompositionHint": "A drop is about 0.05 mL, so 0.05 g. Divide by the molar mass of water and multiply by Avogadro's number.",
    "strategy": "molar",
    "source": "Standard chemistry calculation"
  },
  {
    "id": "atoms-across-a-human-hair",
    "prompt": "How many atoms would you need to lay side by side to span the width of a human hair?",
    "unit": "atoms",
    "answerValue": 350000,
    "decompositionHint": "A hair is roughly 70 micrometres across and an atom about 0.2 nanometres. Convert both to the same units and divide.",
    "strategy": "unit-conversion",
    "source": "Typical hair diameter and atomic radius"
  },
  {
    "id": "carbon-atoms-in-a-diamond",
    "prompt": "How many carbon atoms are in a one carat diamond?",
    "unit": "atoms",
    "answerValue": 1e+22,
    "decompositionHint": "A carat is 0.2 grams. Divide by carbon's molar mass of 12 and multiply by Avogadro's number.",
    "strategy": "molar",
    "source": "Standard chemistry calculation"
  },
  {
    "id": "iron-atoms-in-a-nail",
    "prompt": "How many iron atoms are in an ordinary three gram nail?",
    "unit": "atoms",
    "answerValue": 3.2e+22,
    "decompositionHint": "Three grams divided by iron's molar mass of about 56, multiplied by Avogadro's number.",
    "strategy": "molar",
    "source": "Standard chemistry calculation"
  },
  {
    "id": "air-molecules-per-cubic-centimetre",
    "prompt": "How many air molecules are in one cubic centimetre of air at sea level?",
    "unit": "molecules",
    "answerValue": 25000000000000000000,
    "decompositionHint": "One mole occupies 22.4 litres, which is 22,400 cubic centimetres. Divide Avogadro's number by that.",
    "strategy": "molar",
    "source": "Loschmidt constant, 2.5x10^19 per cubic centimetre"
  },
  {
    "id": "helium-balloons-to-lift-a-person",
    "prompt": "How many party balloons filled with helium would it take to lift an average adult?",
    "unit": "balloons",
    "answerValue": 5000,
    "decompositionHint": "Helium lifts roughly one gram per litre. A 70 kg person needs 70,000 litres of lift, and a party balloon holds about 14 litres.",
    "strategy": "area-density",
    "source": "Buoyancy calculation from helium and air densities"
  },
  {
    "id": "surface-area-of-earth",
    "prompt": "What is the total surface area of the Earth, in square kilometres?",
    "unit": "square kilometres",
    "answerValue": 510000000,
    "decompositionHint": "Use the surface area of a sphere, 4 pi r squared, with a radius of about 6,371 km.",
    "strategy": "area-density",
    "source": "Standard geophysical constant"
  },
  {
    "id": "land-area-of-earth",
    "prompt": "How much of the Earth's surface is land, in square kilometres?",
    "unit": "square kilometres",
    "answerValue": 149000000,
    "decompositionHint": "Land is about 29 percent of the total surface. Take the whole surface area and take a bit under a third.",
    "strategy": "area-density",
    "source": "Standard geographic figures"
  },
  {
    "id": "volume-of-the-oceans",
    "prompt": "What is the total volume of Earth's oceans, in cubic kilometres?",
    "unit": "cubic kilometres",
    "answerValue": 1335000000,
    "decompositionHint": "Ocean covers about 361 million square kilometres at an average depth of roughly 3.7 km. Multiply area by mean depth.",
    "strategy": "chain-multiply",
    "source": "NOAA ocean volume estimates"
  },
  {
    "id": "amazon-river-discharge",
    "prompt": "How much water does the Amazon river discharge, in cubic metres per second?",
    "unit": "cubic metres per second",
    "answerValue": 210000,
    "decompositionHint": "About a fifth of all river water reaching the oceans, and more than the next several largest rivers combined.",
    "strategy": "rate-time",
    "source": "Hydrological measurements of the Amazon basin"
  },
  {
    "id": "area-of-the-sahara",
    "prompt": "What is the area of the Sahara desert, in square kilometres?",
    "unit": "square kilometres",
    "answerValue": 9200000,
    "decompositionHint": "Comparable in area to the United States or to China. It spans nearly the full width of Africa.",
    "strategy": "anchor-scale",
    "source": "Standard geographic figures"
  },
  {
    "id": "earthquakes-magnitude-five-per-year",
    "prompt": "How many earthquakes of magnitude 5 or greater occur worldwide in a year?",
    "unit": "earthquakes",
    "answerValue": 1500,
    "decompositionHint": "Each step down in magnitude is roughly ten times more frequent, so work from the handful of magnitude 8 events per decade.",
    "strategy": "rate-time",
    "source": "US Geological Survey earthquake statistics"
  },
  {
    "id": "active-volcanoes-on-earth",
    "prompt": "How many volcanoes on Earth are considered active?",
    "unit": "volcanoes",
    "answerValue": 1500,
    "decompositionHint": "Counting those that have erupted in the Holocene. Only a few dozen are erupting in any given year.",
    "strategy": "decompose",
    "source": "Smithsonian Global Volcanism Program"
  },
  {
    "id": "glaciers-on-earth",
    "prompt": "How many individual glaciers are there on Earth?",
    "unit": "glaciers",
    "answerValue": 200000,
    "decompositionHint": "Counted from satellite inventories, excluding the two continental ice sheets which are catalogued separately.",
    "strategy": "recall-sanity",
    "source": "Randolph Glacier Inventory"
  },
  {
    "id": "lakes-on-earth",
    "prompt": "How many lakes larger than 0.2 hectares are there on Earth?",
    "unit": "lakes",
    "answerValue": 117000000,
    "decompositionHint": "Small lakes vastly outnumber large ones on a steep size distribution, so the count is dominated by the smallest size counted. Above one square kilometre there are only a few hundred thousand.",
    "strategy": "area-density",
    "source": "Verpoorter et al. 2014, Geophysical Research Letters - ~117 million lakes above 0.2 ha"
  },
  {
    "id": "rain-falling-on-earth-per-year",
    "prompt": "How many cubic kilometres of rain and snow fall on Earth in a year?",
    "unit": "cubic kilometres",
    "answerValue": 500000,
    "decompositionHint": "Global average precipitation is about one metre per year. Multiply that depth by Earth's whole surface area.",
    "strategy": "volume-packing",
    "source": "Global hydrological cycle estimates"
  },
  {
    "id": "sand-grains-in-a-cubic-metre",
    "prompt": "How many grains of sand are in one cubic metre of sand?",
    "unit": "grains of sand",
    "answerValue": 5000000000,
    "decompositionHint": "A grain about 0.5 mm across occupies roughly 1.25x10^-10 cubic metres. Divide one cubic metre by that, then multiply by a packing fraction of about 0.6, since spheres cannot fill space completely.",
    "strategy": "volume-packing",
    "source": "Derived from typical grain size and packing density"
  },
  {
    "id": "trees-cut-for-paper-per-year",
    "prompt": "How many trees are harvested worldwide each year for paper and pulp?",
    "asOf": 2025,
    "unit": "trees",
    "answerValue": 3000000000,
    "decompositionHint": "Global paper production is roughly 400 million tonnes, and a single tree yields on the order of a tenth of a tonne of pulp.",
    "strategy": "divide-total",
    "source": "FAO forest products statistics"
  },
  {
    "id": "mass-of-a-blue-whale",
    "prompt": "How much does an adult blue whale weigh, in kilograms?",
    "unit": "kilograms",
    "answerValue": 150000,
    "decompositionHint": "About 25 metres long. Water weighs a tonne per cubic metre and a whale is near neutral buoyancy, so estimate its volume and treat it as water.",
    "strategy": "volume-packing",
    "source": "Marine biology references, roughly 100-190 tonnes"
  },
  {
    "id": "bees-in-a-hive",
    "prompt": "How many bees live in a healthy honeybee hive at peak season?",
    "unit": "bees",
    "answerValue": 50000,
    "decompositionHint": "A queen lays on the order of 1,500 eggs a day and a worker lives about six weeks in summer. Multiply the daily rate by the lifespan.",
    "strategy": "stock-flow",
    "source": "Apiculture references, 20,000-80,000 in summer"
  },
  {
    "id": "eggs-laid-by-a-hen-per-year",
    "prompt": "How many eggs does a commercial laying hen produce in a year?",
    "unit": "eggs",
    "answerValue": 300,
    "decompositionHint": "Close to one a day with short breaks, which is why the figure lands just under the number of days in a year.",
    "strategy": "rate-time",
    "source": "Poultry industry production figures"
  },
  {
    "id": "beetle-species",
    "prompt": "How many species of beetle have been described?",
    "unit": "species",
    "answerValue": 400000,
    "decompositionHint": "Beetles are about a quarter of all described animal species - the reason for the remark that the creator had an inordinate fondness for them.",
    "strategy": "recall-sanity",
    "source": "Entomological catalogues, roughly 400,000 described species"
  },
  {
    "id": "birds-on-earth",
    "prompt": "How many individual wild birds are alive on Earth?",
    "unit": "birds",
    "answerValue": 50000000000,
    "decompositionHint": "Roughly six birds for every person. A handful of common species account for a very large share of the total.",
    "strategy": "decompose",
    "source": "Callaghan et al. 2021, PNAS - estimated ~50 billion wild birds"
  },
  {
    "id": "arctic-tern-annual-migration",
    "prompt": "How far does an Arctic tern migrate in a single year, in kilometres?",
    "unit": "kilometres",
    "answerValue": 70000,
    "decompositionHint": "It flies pole to pole and back, but by a looping route rather than a straight line, so the total well exceeds twice the Earth's radius of travel.",
    "strategy": "anchor-scale",
    "source": "Tracking studies of Arctic tern migration"
  },
  {
    "id": "viruses-in-the-ocean",
    "prompt": "Roughly how many virus particles are in the world's oceans?",
    "unit": "virus particles",
    "answerValue": 1e+30,
    "decompositionHint": "Seawater holds around ten million virus particles per millilitre. Multiply by the ocean's volume converted to millilitres.",
    "strategy": "unit-conversion",
    "source": "Marine microbiology estimates, ~10^30 virions"
  },
  {
    "id": "bacteria-in-a-gram-of-soil",
    "prompt": "How many bacteria live in a single gram of fertile soil?",
    "unit": "bacteria",
    "answerValue": 1000000000,
    "decompositionHint": "Soil is one of the densest microbial habitats known - a teaspoon holds more organisms than there are people on Earth.",
    "strategy": "population-rate",
    "source": "Soil microbiology estimates, 10^8 to 10^10 per gram"
  },
  {
    "id": "base-pairs-in-human-genome",
    "prompt": "How many base pairs are in the human genome?",
    "unit": "base pairs",
    "answerValue": 3200000000,
    "decompositionHint": "Around three billion, which at one byte per base would fit on an ordinary memory card - the information density of life is lower than people expect.",
    "strategy": "area-density",
    "source": "Human Genome Project reference assembly"
  },
  {
    "id": "genes-in-human-genome",
    "prompt": "How many protein-coding genes does the human genome contain?",
    "unit": "genes",
    "answerValue": 20000,
    "decompositionHint": "Early estimates ran to 100,000 and were revised sharply down. It is roughly comparable to a nematode worm, which was the surprise.",
    "strategy": "anchor-scale",
    "source": "GENCODE annotation, roughly 20,000 protein-coding genes"
  },
  {
    "id": "protein-molecules-in-a-cell",
    "prompt": "How many protein molecules are in a single human cell?",
    "unit": "protein molecules",
    "answerValue": 10000000000,
    "decompositionHint": "A typical cell masses about a nanogram, protein is roughly a fifth of that, and an average protein is around 50 kilodaltons.",
    "strategy": "decompose",
    "source": "Cell biology estimates, ~10^10 proteins per mammalian cell"
  },
  {
    "id": "mitochondria-per-cell",
    "prompt": "How many mitochondria are in a typical human cell?",
    "unit": "mitochondria",
    "answerValue": 1000,
    "decompositionHint": "Varies enormously by tissue - a heart muscle cell holds several thousand while a red blood cell holds none at all.",
    "strategy": "decompose",
    "source": "Cell biology references, hundreds to thousands"
  },
  {
    "id": "surface-area-of-human-lungs",
    "prompt": "What is the total internal surface area of adult human lungs, in square metres?",
    "unit": "square metres",
    "answerValue": 70,
    "decompositionHint": "Roughly 300 million alveoli, each about 0.2 mm across. The folding is what turns a chest-sized organ into something closer to a tennis court.",
    "strategy": "area-density",
    "source": "Respiratory physiology references, 50-100 square metres"
  },
  {
    "id": "surface-area-of-small-intestine",
    "prompt": "What is the absorptive surface area of the human small intestine, in square metres?",
    "unit": "square metres",
    "answerValue": 30,
    "decompositionHint": "Six metres of tube only gives a fraction of a square metre. Folds, villi and microvilli multiply it by more than a hundred.",
    "strategy": "area-density",
    "source": "Gastroenterology references, roughly 30 square metres"
  },
  {
    "id": "sweat-glands-on-the-body",
    "prompt": "How many sweat glands does an adult human body have?",
    "unit": "sweat glands",
    "answerValue": 3000000,
    "decompositionHint": "Skin area is around 1.8 square metres, with roughly 150-350 glands per square centimetre depending on the region.",
    "strategy": "area-density",
    "source": "Dermatology references, 2-4 million glands"
  },
  {
    "id": "nerve-signal-speed",
    "prompt": "How fast does a signal travel along a myelinated human nerve, in metres per second?",
    "unit": "metres per second",
    "answerValue": 100,
    "decompositionHint": "Fast enough to cross the body in a few hundredths of a second, but roughly three million times slower than electricity in a wire.",
    "strategy": "rate-time",
    "source": "Neurophysiology references, 70-120 m/s for myelinated fibres"
  },
  {
    "id": "red-blood-cells-made-per-second",
    "prompt": "How many red blood cells does the human body produce each second?",
    "unit": "cells/second",
    "answerValue": 2500000,
    "decompositionHint": "There are about 2.5x10^13 red cells and each lasts roughly 120 days. Divide the total by the lifespan in seconds.",
    "strategy": "stock-flow",
    "source": "Derived from red cell count and 120-day lifespan"
  },
  {
    "id": "platelets-in-the-body",
    "prompt": "How many platelets are in an adult human's blood?",
    "unit": "platelets",
    "answerValue": 1500000000000,
    "decompositionHint": "Roughly 3x10^11 per litre of blood, across about five litres.",
    "strategy": "area-density",
    "source": "Standard haematology reference ranges"
  },
  {
    "id": "white-blood-cells-in-the-body",
    "prompt": "How many white blood cells are in an adult human's blood?",
    "unit": "white blood cells",
    "answerValue": 25000000000,
    "decompositionHint": "About 5x10^9 per litre - roughly a thousandth the number of red cells - across five litres of blood.",
    "strategy": "area-density",
    "source": "Standard haematology reference ranges"
  },
  {
    "id": "water-in-the-human-body",
    "prompt": "How many litres of water are in an adult human body?",
    "unit": "litres",
    "answerValue": 42,
    "decompositionHint": "Roughly 60 percent of body mass, and a litre of water weighs a kilogram, so it is simply 0.6 times body weight.",
    "strategy": "chain-multiply",
    "source": "Standard physiology, ~60% of body mass"
  },
  {
    "id": "steps-in-a-marathon",
    "prompt": "How many steps does a runner take to complete a marathon?",
    "unit": "steps",
    "answerValue": 53000,
    "decompositionHint": "42.2 km divided by a running stride of roughly 0.8 metres, which is longer than a walking stride.",
    "strategy": "divide-total",
    "source": "Derived from marathon distance and typical running stride"
  },
  {
    "id": "calories-burned-in-a-marathon",
    "prompt": "How many kilocalories does a runner burn completing a marathon?",
    "unit": "kilocalories",
    "answerValue": 2900,
    "decompositionHint": "Running costs roughly one kilocalorie per kilogram per kilometre. Multiply by body mass and the 42 km distance.",
    "strategy": "energy-balance",
    "source": "Exercise physiology energy cost estimates"
  },
  {
    "id": "saliva-produced-per-day",
    "prompt": "How many litres of saliva does a person produce in a day?",
    "unit": "litres",
    "answerValue": 1.5,
    "decompositionHint": "Production runs continuously at a low rate and spikes with eating. Over 24 hours it adds up to more than most people guess.",
    "strategy": "unit-conversion",
    "source": "Oral physiology references, 0.5-1.5 litres daily"
  },
  {
    "id": "sperm-in-an-ejaculation",
    "prompt": "How many sperm cells are in a single human ejaculation?",
    "unit": "sperm cells",
    "answerValue": 200000000,
    "decompositionHint": "Concentration is on the order of 50 million per millilitre across a few millilitres of volume.",
    "strategy": "area-density",
    "source": "WHO semen analysis reference values"
  },
  {
    "id": "eggs-in-ovaries-at-birth",
    "prompt": "How many immature egg cells does a human female have at birth?",
    "unit": "egg cells",
    "answerValue": 1000000,
    "decompositionHint": "The supply is fixed at birth and declines steadily. Only a few hundred are ever ovulated across a lifetime.",
    "strategy": "decompose",
    "source": "Reproductive biology references, 1-2 million at birth"
  },
  {
    "id": "wheat-produced-per-year",
    "prompt": "How many tonnes of wheat are produced worldwide in a year?",
    "asOf": 2025,
    "unit": "tonnes",
    "answerValue": 790000000,
    "decompositionHint": "Enough to give every person on Earth roughly 100 kg a year, which is about right for a staple grain.",
    "strategy": "rate-time",
    "source": "FAO cereal production statistics"
  },
  {
    "id": "eggs-produced-worldwide",
    "prompt": "How many chicken eggs are produced worldwide in a year?",
    "asOf": 2025,
    "unit": "eggs",
    "answerValue": 1600000000000,
    "decompositionHint": "Roughly 200 eggs per person per year across 8 billion people, though consumption is very unevenly distributed.",
    "strategy": "population-rate",
    "source": "FAO livestock production statistics"
  },
  {
    "id": "milk-produced-worldwide",
    "prompt": "How many litres of milk are produced worldwide in a year?",
    "asOf": 2025,
    "unit": "litres",
    "answerValue": 900000000000,
    "decompositionHint": "About 1.5 billion cattle exist, but only a fraction are dairy animals, each yielding on the order of several thousand litres a year.",
    "strategy": "rate-time",
    "source": "FAO dairy production statistics"
  },
  {
    "id": "coffee-beans-in-a-cup",
    "prompt": "How many roasted coffee beans go into a single cup of coffee?",
    "unit": "coffee beans",
    "answerValue": 70,
    "decompositionHint": "A cup uses roughly 10 grams of coffee and a roasted bean weighs about 0.13 grams.",
    "strategy": "divide-total",
    "source": "Derived from standard brew ratios and bean mass"
  },
  {
    "id": "grains-of-wheat-in-a-loaf",
    "prompt": "How many grains of wheat go into one loaf of bread?",
    "unit": "grains of wheat",
    "answerValue": 17000,
    "decompositionHint": "A loaf takes roughly 500 grams of flour, and milling yields about 72% flour from the grain, so around 700 grams of wheat. A single grain weighs about 0.04 grams.",
    "strategy": "divide-total",
    "source": "Derived from typical loaf flour content and grain mass"
  },
  {
    "id": "farmland-area-worldwide",
    "prompt": "How many square kilometres of the Earth's land is used for agriculture?",
    "asOf": 2025,
    "unit": "square kilometres",
    "answerValue": 48000000,
    "decompositionHint": "About half of all habitable land, with grazing taking far more area than cropland does.",
    "strategy": "area-density",
    "source": "FAO land use statistics"
  },
  {
    "id": "water-to-produce-a-kilo-of-beef",
    "prompt": "How many litres of water does it take to produce one kilogram of beef?",
    "unit": "litres",
    "answerValue": 15000,
    "decompositionHint": "Almost all of it is the water grown into the feed the animal eats over its life, not water the animal drinks.",
    "strategy": "decompose",
    "source": "Water footprint assessments, roughly 15,000 litres per kg"
  },
  {
    "id": "water-to-grow-a-loaf-of-bread",
    "prompt": "How much water is needed to grow the wheat for a single loaf of bread, in litres?",
    "unit": "litres",
    "answerValue": 1000,
    "decompositionHint": "A loaf needs roughly 650 grams of wheat, and growing wheat consumes about 1,500 litres of water per kilogram. An order of magnitude less than beef, which must feed a large animal for years first.",
    "strategy": "decompose",
    "source": "Water footprint assessments, ~1,500 litres per kg of wheat"
  },
  {
    "id": "chickens-slaughtered-per-year",
    "prompt": "How many chickens are slaughtered worldwide for meat each year?",
    "asOf": 2025,
    "unit": "chickens",
    "answerValue": 75000000000,
    "decompositionHint": "The standing population is about 26 billion and a broiler reaches slaughter weight in roughly six weeks, so the flock turns over several times a year.",
    "strategy": "stock-flow",
    "source": "FAO livestock slaughter statistics"
  },
  {
    "id": "fish-caught-per-year",
    "prompt": "How many tonnes of fish are caught from the wild worldwide each year?",
    "asOf": 2025,
    "unit": "tonnes",
    "answerValue": 90000000,
    "decompositionHint": "Wild capture has been roughly flat for decades; almost all growth in seafood supply since the 1990s has come from farming instead.",
    "strategy": "decompose",
    "source": "FAO fisheries statistics"
  },
  {
    "id": "surgeries-performed-worldwide",
    "prompt": "How many surgical operations are performed worldwide each year?",
    "asOf": 2025,
    "unit": "operations",
    "answerValue": 310000000,
    "decompositionHint": "Roughly one operation per 25 people per year, though access is very unevenly distributed between rich and poor countries.",
    "strategy": "rate-time",
    "source": "Lancet Commission on Global Surgery estimates"
  },
  {
    "id": "caesarean-births-per-year",
    "prompt": "How many babies are delivered by caesarean section worldwide each year?",
    "asOf": 2025,
    "unit": "births",
    "answerValue": 30000000,
    "decompositionHint": "There are about 135 million births a year and roughly a fifth are surgical, though rates range from under 5 percent to over 50 by country.",
    "strategy": "rate-time",
    "source": "WHO caesarean section rate estimates"
  },
  {
    "id": "prescriptions-filled-in-us",
    "prompt": "How many retail prescriptions are filled in the United States each year?",
    "asOf": 2025,
    "unit": "prescriptions",
    "answerValue": 6700000000,
    "decompositionHint": "About twenty per American per year on average, driven up sharply by older patients on several long-term medications.",
    "strategy": "rate-time",
    "source": "US pharmacy dispensing statistics"
  },
  {
    "id": "covid-vaccine-doses-administered",
    "prompt": "How many COVID-19 vaccine doses had been administered worldwide?",
    "asOf": 2023,
    "unit": "doses",
    "answerValue": 13500000000,
    "decompositionHint": "More than one dose per person alive, achieved in under three years - the fastest mass immunisation campaign ever run.",
    "strategy": "population-rate",
    "source": "WHO COVID-19 vaccination dashboard"
  },
  {
    "id": "blood-donations-per-year-worldwide",
    "prompt": "How many units of blood are donated worldwide each year?",
    "asOf": 2025,
    "unit": "donations",
    "answerValue": 120000000,
    "decompositionHint": "Roughly one donation for every 65 people, with high income countries donating at several times the rate of low income ones.",
    "strategy": "chain-multiply",
    "source": "WHO global blood supply statistics"
  },
  {
    "id": "cigarettes-smoked-per-year",
    "prompt": "How many cigarettes are smoked worldwide each year?",
    "asOf": 2025,
    "unit": "cigarettes",
    "answerValue": 5000000000000,
    "decompositionHint": "Around a billion smokers averaging on the order of ten to fifteen cigarettes a day.",
    "strategy": "rate-time",
    "source": "WHO tobacco consumption estimates"
  },
  {
    "id": "hospital-beds-worldwide",
    "prompt": "How many hospital beds are there worldwide?",
    "asOf": 2025,
    "unit": "hospital beds",
    "answerValue": 20000000,
    "decompositionHint": "Global average is roughly 2.5 beds per thousand people, ranging from under one in low income countries to over twelve in Japan and Korea.",
    "strategy": "population-rate",
    "source": "WHO health infrastructure statistics"
  },
  {
    "id": "doctors-worldwide",
    "prompt": "How many physicians are there worldwide?",
    "asOf": 2025,
    "unit": "physicians",
    "answerValue": 13000000,
    "decompositionHint": "Global average is about 1.6 doctors per thousand people, again ranging over more than an order of magnitude by country.",
    "strategy": "population-rate",
    "source": "WHO global health workforce statistics"
  },
  {
    "id": "operations-per-second-fastest-supercomputer",
    "prompt": "How many floating point operations per second can the fastest supercomputer perform?",
    "asOf": 2025,
    "unit": "operations/second",
    "answerValue": 1700000000000000000,
    "decompositionHint": "The exascale threshold of 10^18 was crossed in 2022. Machines are built from tens of thousands of GPUs each doing on the order of 10^14.",
    "strategy": "rate-time",
    "source": "TOP500 supercomputer rankings"
  },
  {
    "id": "data-created-per-day",
    "prompt": "How many bytes of data are created worldwide each day?",
    "asOf": 2025,
    "unit": "bytes",
    "answerValue": 400000000000000000000,
    "decompositionHint": "Roughly 400 exabytes. Video streaming dominates, so estimate hours watched globally times the bitrate of a stream.",
    "strategy": "chain-multiply",
    "source": "Industry data volume estimates"
  },
  {
    "id": "english-wikipedia-articles",
    "prompt": "How many articles does English Wikipedia contain?",
    "asOf": 2025,
    "unit": "articles",
    "answerValue": 7000000,
    "decompositionHint": "Growth has been roughly linear for over a decade at a few hundred thousand articles a year.",
    "strategy": "rate-time",
    "source": "Wikipedia published statistics"
  },
  {
    "id": "lines-of-code-linux-kernel",
    "prompt": "How many lines of code are in the Linux kernel?",
    "asOf": 2025,
    "unit": "lines of code",
    "answerValue": 35000000,
    "decompositionHint": "Well over half is device drivers rather than core kernel logic, which is why the number is far larger than people expect.",
    "strategy": "decompose",
    "source": "Linux kernel source statistics"
  },
  {
    "id": "websites-on-the-internet",
    "prompt": "How many websites exist on the internet?",
    "asOf": 2025,
    "unit": "websites",
    "answerValue": 1100000000,
    "decompositionHint": "Counted by registered hostnames. The large majority are parked or inactive, with only a couple of hundred million actually maintained.",
    "strategy": "recall-sanity",
    "source": "Netcraft web server surveys"
  },
  {
    "id": "undersea-cable-length",
    "prompt": "How many kilometres of submarine communications cable lie on the ocean floor?",
    "asOf": 2025,
    "unit": "kilometres",
    "answerValue": 1400000,
    "decompositionHint": "A few hundred cables, many spanning entire oceans. Enough to wrap the equator dozens of times over.",
    "strategy": "chain-multiply",
    "source": "TeleGeography submarine cable statistics"
  },
  {
    "id": "electricity-used-by-data-centres",
    "prompt": "How many terawatt hours of electricity do the world's data centres consume in a year?",
    "asOf": 2025,
    "unit": "terawatt hours",
    "answerValue": 460,
    "decompositionHint": "A little under two percent of global electricity - comparable to the total consumption of a mid-sized industrialised country.",
    "strategy": "energy-balance",
    "source": "International Energy Agency data centre estimates"
  },
  {
    "id": "active-satellites-in-orbit",
    "prompt": "How many active satellites are orbiting the Earth?",
    "asOf": 2025,
    "unit": "satellites",
    "answerValue": 10000,
    "decompositionHint": "The count has risen roughly tenfold in a decade, dominated by a single large communications constellation in low orbit.",
    "strategy": "decompose",
    "source": "UNOOSA and satellite tracking registries"
  },
  {
    "id": "tracked-space-debris",
    "prompt": "How many pieces of space debris large enough to track are in Earth orbit?",
    "asOf": 2025,
    "unit": "tracked objects",
    "answerValue": 35000,
    "decompositionHint": "Tracking covers objects above roughly ten centimetres. Smaller fragments are far more numerous but cannot be catalogued individually.",
    "strategy": "recall-sanity",
    "source": "ESA space debris office estimates"
  },
  {
    "id": "bits-in-a-smartphone-photo",
    "prompt": "How many bits of data are in a typical smartphone photograph?",
    "unit": "bits",
    "answerValue": 32000000,
    "decompositionHint": "A compressed photo is around four megabytes. Multiply by 8 bits per byte and by a million bytes per megabyte.",
    "strategy": "chain-multiply",
    "source": "Typical JPEG file sizes from modern phone cameras"
  },
  {
    "id": "world-gdp",
    "prompt": "What is the total annual economic output of the world, in US dollars?",
    "asOf": 2025,
    "unit": "US dollars",
    "answerValue": 105000000000000,
    "decompositionHint": "About 8 billion people producing roughly 13,000 dollars each on average, though the median is far below the mean.",
    "strategy": "rate-time",
    "source": "World Bank and IMF world GDP estimates"
  },
  {
    "id": "global-military-spending",
    "prompt": "How much do the world's governments spend on their militaries in a year, in US dollars?",
    "asOf": 2025,
    "unit": "US dollars",
    "answerValue": 2400000000000,
    "decompositionHint": "A little over two percent of world GDP, with the single largest spender accounting for roughly 40 percent of the total.",
    "strategy": "rate-time",
    "source": "SIPRI military expenditure database"
  },
  {
    "id": "value-of-all-gold-ever-mined",
    "prompt": "What is all the gold ever mined worth, in US dollars?",
    "asOf": 2025,
    "unit": "US dollars",
    "answerValue": 17000000000000,
    "decompositionHint": "About 212,000 tonnes exist. Convert to grams and multiply by a gold price on the order of 80 dollars per gram.",
    "strategy": "unit-conversion",
    "source": "World Gold Council stock figures at prevailing prices"
  },
  {
    "id": "daily-foreign-exchange-volume",
    "prompt": "How much currency is traded on foreign exchange markets each day, in US dollars?",
    "asOf": 2025,
    "unit": "US dollars",
    "answerValue": 7500000000000,
    "decompositionHint": "More changes hands in a few days than the entire world produces in a year, because most of it is trading rather than trade.",
    "strategy": "rate-time",
    "source": "Bank for International Settlements triennial survey"
  },
  {
    "id": "people-in-extreme-poverty",
    "prompt": "How many people live in extreme poverty worldwide?",
    "asOf": 2025,
    "unit": "people",
    "answerValue": 700000000,
    "decompositionHint": "Under nine percent of the world, down from roughly 40 percent in 1990 - one of the largest changes of the last half century.",
    "strategy": "decompose",
    "source": "World Bank poverty estimates"
  },
  {
    "id": "global-remittances",
    "prompt": "How much money do migrant workers send home across borders each year, in US dollars?",
    "asOf": 2025,
    "unit": "US dollars",
    "answerValue": 860000000000,
    "decompositionHint": "Substantially more than all official development aid combined, and for several countries it exceeds a tenth of national income.",
    "strategy": "decompose",
    "source": "World Bank remittance statistics"
  },
  {
    "id": "cost-of-the-apollo-program",
    "prompt": "What did the Apollo programme cost in total, in 2020 US dollars?",
    "unit": "US dollars",
    "answerValue": 280000000000,
    "decompositionHint": "About 25 billion in period dollars across the 1960s, inflated to the present by roughly a factor of ten.",
    "strategy": "decompose",
    "source": "NASA historical budget analyses"
  },
  {
    "id": "cost-of-the-space-station",
    "prompt": "What has the International Space Station cost to build and operate, in US dollars?",
    "unit": "US dollars",
    "answerValue": 150000000000,
    "decompositionHint": "Spread across multiple space agencies over three decades, making it among the most expensive objects ever constructed.",
    "strategy": "decompose",
    "source": "Combined agency ISS cost estimates"
  },
  {
    "id": "bridges-in-the-us",
    "prompt": "How many bridges are there in the United States?",
    "asOf": 2025,
    "unit": "bridges",
    "answerValue": 620000,
    "decompositionHint": "Any span over about six metres counts, so the total is dominated by small highway and rural crossings rather than famous structures.",
    "strategy": "anchor-scale",
    "source": "US Federal Highway Administration national bridge inventory"
  },
  {
    "id": "railway-length-worldwide",
    "prompt": "How many kilometres of railway line exist worldwide?",
    "asOf": 2025,
    "unit": "kilometres",
    "answerValue": 1300000,
    "decompositionHint": "Roughly thirty times the Earth's circumference, concentrated in the United States, China, Russia and India.",
    "strategy": "chain-multiply",
    "source": "International Union of Railways statistics"
  },
  {
    "id": "merchant-ships-at-sea",
    "prompt": "How many merchant ships make up the world's commercial fleet?",
    "asOf": 2025,
    "unit": "ships",
    "answerValue": 100000,
    "decompositionHint": "Around 100,000 vessels above 100 gross tonnes carry roughly 90 percent of world trade by volume.",
    "strategy": "decompose",
    "source": "UNCTAD review of maritime transport"
  },
  {
    "id": "airports-worldwide",
    "prompt": "How many airports are there worldwide?",
    "asOf": 2025,
    "unit": "airports",
    "answerValue": 40000,
    "decompositionHint": "Counting anything with a defined runway. Only a few thousand handle scheduled commercial passenger flights.",
    "strategy": "decompose",
    "source": "Global aviation infrastructure databases"
  },
  {
    "id": "street-lights-worldwide",
    "prompt": "How many street lights are there worldwide?",
    "asOf": 2025,
    "unit": "street lights",
    "answerValue": 320000000,
    "decompositionHint": "Roughly one for every 25 people. Estimate from the length of lit road worldwide and typical spacing of about 30 metres.",
    "strategy": "chain-multiply",
    "source": "Municipal lighting inventories and industry estimates"
  },
  {
    "id": "kilometres-driven-worldwide",
    "prompt": "How many kilometres do the world's vehicles travel in a year, in total?",
    "asOf": 2025,
    "unit": "kilometres",
    "answerValue": 16000000000000,
    "decompositionHint": "About 1.5 billion vehicles each covering on the order of 11,000 km a year.",
    "strategy": "rate-time",
    "source": "Derived from global vehicle stock and average annual distance"
  },
  {
    "id": "length-of-the-london-underground",
    "prompt": "How many kilometres of track does the London Underground have?",
    "unit": "kilometres",
    "answerValue": 402,
    "decompositionHint": "Eleven lines serving 272 stations. Estimate average line length and multiply, remembering much of the network is above ground.",
    "strategy": "chain-multiply",
    "source": "Transport for London network statistics"
  },
  {
    "id": "windows-in-new-york-city",
    "prompt": "How many windows are there in New York City?",
    "unit": "windows",
    "answerValue": 10000000,
    "decompositionHint": "Estimate buildings in the city, average floors each, and windows per floor. A classic decomposition problem where the count of small buildings dominates.",
    "strategy": "chain-multiply",
    "source": "Order-of-magnitude estimate from building stock"
  },
  {
    "id": "haircuts-in-the-us-per-year",
    "prompt": "How many haircuts are given in the United States in a year?",
    "asOf": 2025,
    "unit": "haircuts",
    "answerValue": 1300000000,
    "decompositionHint": "335 million people getting a haircut roughly every three months, adjusting down for those who cut their own or none at all.",
    "strategy": "population-rate",
    "source": "Order-of-magnitude estimate from population and haircut frequency"
  },
  {
    "id": "bricks-in-a-house",
    "prompt": "How many bricks are in a typical two storey brick house?",
    "unit": "bricks",
    "answerValue": 8000,
    "decompositionHint": "Estimate the total external wall area, then use roughly 60 bricks per square metre for a single skin of standard brick.",
    "strategy": "area-density",
    "source": "Construction estimating rules of thumb"
  },
  {
    "id": "nails-in-a-wooden-house",
    "prompt": "How many nails are used to build a wooden house?",
    "unit": "nails",
    "answerValue": 30000,
    "decompositionHint": "Framing, sheathing, flooring and roofing each consume thousands. Estimate the total length of timber and a nail every few tens of centimetres.",
    "strategy": "chain-multiply",
    "source": "Construction estimating rules of thumb"
  },
  {
    "id": "sheets-of-paper-from-a-tree",
    "prompt": "How many sheets of A4 paper can be made from one average tree?",
    "unit": "sheets",
    "answerValue": 8000,
    "decompositionHint": "A tree yields on the order of 50 kg of usable pulp, and a sheet of A4 weighs about 5 grams.",
    "strategy": "divide-total",
    "source": "Paper industry yield estimates"
  },
  {
    "id": "drops-of-water-in-a-bathtub",
    "prompt": "How many drops of water fill a bathtub?",
    "unit": "drops",
    "answerValue": 3000000,
    "decompositionHint": "A bath holds roughly 150 litres and a drop is about 0.05 millilitres. Convert both to the same unit and divide.",
    "strategy": "unit-conversion",
    "source": "Derived from typical bath volume and drop size"
  },
  {
    "id": "grains-of-rice-in-a-kilogram",
    "prompt": "How many grains of rice are in one kilogram?",
    "unit": "grains of rice",
    "answerValue": 50000,
    "decompositionHint": "A single grain weighs roughly 0.02 grams, so a kilogram holds tens of thousands.",
    "strategy": "divide-total",
    "source": "Derived from typical rice grain mass"
  },
  {
    "id": "words-in-the-bible",
    "prompt": "How many words are in the Bible?",
    "unit": "words",
    "answerValue": 780000,
    "decompositionHint": "Around 1,200 pages of dense two-column text at roughly 600 words a page.",
    "strategy": "chain-multiply",
    "source": "Word counts of the King James translation"
  },
  {
    "id": "steps-to-climb-the-eiffel-tower",
    "prompt": "How many steps are there to the top of the Eiffel Tower?",
    "unit": "steps",
    "answerValue": 1665,
    "decompositionHint": "The tower is 300 metres tall and a step rises about 18 centimetres, though the public stairs stop well short of the summit.",
    "strategy": "decompose",
    "source": "Eiffel Tower official figures"
  },
  {
    "id": "blocks-in-the-great-pyramid",
    "prompt": "How many stone blocks make up the Great Pyramid of Giza?",
    "unit": "blocks",
    "answerValue": 2300000,
    "decompositionHint": "The pyramid's volume is about 2.6 million cubic metres and an average block is roughly one cubic metre.",
    "strategy": "volume-packing",
    "source": "Egyptological surveys of the Great Pyramid"
  },
  {
    "id": "ways-to-shuffle-a-deck-of-cards",
    "prompt": "How many different orders can a standard 52 card deck be shuffled into?",
    "unit": "orderings",
    "answerValue": 8.07e+67,
    "decompositionHint": "52 factorial. Any well shuffled deck has almost certainly never existed before in that order anywhere in history.",
    "strategy": "combinatorial",
    "source": "52 factorial = 8.07x10^67"
  },
  {
    "id": "legal-chess-positions",
    "prompt": "Roughly how many legal positions are possible in chess?",
    "unit": "positions",
    "answerValue": 4.8e+44,
    "decompositionHint": "Far fewer than the naive count of pieces on squares, because most arrangements cannot be reached by legal play.",
    "strategy": "combinatorial",
    "source": "Computational enumeration of legal chess positions"
  },
  {
    "id": "possible-sudoku-grids",
    "prompt": "How many valid completed 9x9 sudoku grids are there?",
    "unit": "grids",
    "answerValue": 6.67e+21,
    "decompositionHint": "Counted by exhaustive computation combined with symmetry arguments rather than by any simple formula.",
    "strategy": "anchor-scale",
    "source": "Felgenhauer and Jarvis enumeration, 6.67x10^21"
  },
  {
    "id": "songs-on-streaming-services",
    "prompt": "How many tracks are available on a major music streaming service?",
    "asOf": 2025,
    "unit": "tracks",
    "answerValue": 100000000,
    "decompositionHint": "Uploads run to over 100,000 new tracks a day, so the catalogue grows by tens of millions a year.",
    "strategy": "rate-time",
    "source": "Published streaming platform catalogue sizes"
  },
  {
    "id": "feature-films-released-per-year",
    "prompt": "How many feature films are released worldwide each year?",
    "asOf": 2025,
    "unit": "films",
    "answerValue": 10000,
    "decompositionHint": "India alone releases well over a thousand. Summing the major producing countries and adding independents reaches five figures.",
    "strategy": "decompose",
    "source": "National film industry statistics"
  },
  {
    "id": "golf-balls-lost-in-the-us-per-year",
    "prompt": "How many golf balls are lost on United States courses each year?",
    "asOf": 2025,
    "unit": "golf balls",
    "answerValue": 300000000,
    "decompositionHint": "Around 25 million golfers playing roughly 20 rounds a year and losing on the order of one ball per round.",
    "strategy": "rate-time",
    "source": "Golf industry estimates"
  },
  {
    "id": "hours-of-television-watched-per-person",
    "prompt": "How many hours of television and streaming video does an average person watch in a year?",
    "asOf": 2025,
    "unit": "hours",
    "answerValue": 1400,
    "decompositionHint": "Roughly three to four hours a day across 365 days, which adds up to a substantial fraction of waking life.",
    "strategy": "rate-time",
    "source": "Media consumption surveys"
  },
  {
    "id": "population-of-the-roman-empire",
    "prompt": "What was the population of the Roman Empire at its peak?",
    "asOf": 117,
    "unit": "people",
    "answerValue": 60000000,
    "decompositionHint": "Roughly a fifth of all humans alive at the time, in an era when world population was around 250 million.",
    "strategy": "population-rate",
    "source": "Historical demography of the Roman Empire"
  },
  {
    "id": "soldiers-in-the-roman-army",
    "prompt": "How many soldiers served in the Roman army at its height?",
    "asOf": 200,
    "unit": "soldiers",
    "answerValue": 400000,
    "decompositionHint": "About thirty legions of roughly 5,000 men each, plus auxiliary forces of comparable total size.",
    "strategy": "anchor-scale",
    "source": "Roman military history estimates"
  },
  {
    "id": "scrolls-in-the-library-of-alexandria",
    "prompt": "How many scrolls did the Library of Alexandria hold at its height?",
    "asOf": -250,
    "unit": "scrolls",
    "answerValue": 500000,
    "decompositionHint": "Ancient sources disagree wildly. Note a scroll held far less text than a modern book, so the collection was smaller than the number suggests.",
    "strategy": "decompose",
    "source": "Ancient sources, variously 40,000 to 700,000 scrolls"
  },
  {
    "id": "people-at-woodstock",
    "prompt": "How many people attended the Woodstock festival?",
    "asOf": 1969,
    "unit": "people",
    "answerValue": 400000,
    "decompositionHint": "Tickets sold were a fraction of attendance once the fences came down. Estimate from aerial photographs and crowd density.",
    "strategy": "area-density",
    "source": "Contemporary crowd estimates"
  },
  {
    "id": "world-population-at-agriculture",
    "prompt": "What was the world's human population when agriculture first began?",
    "asOf": -10000,
    "unit": "people",
    "answerValue": 5000000,
    "decompositionHint": "Hunter gatherer densities are very low, on the order of one person per ten square kilometres of habitable land.",
    "strategy": "area-density",
    "source": "Archaeological and demographic reconstructions"
  },
  {
    "id": "energy-in-a-aa-battery",
    "prompt": "How many joules of energy does a single AA alkaline battery hold?",
    "unit": "joules",
    "answerValue": 10000,
    "decompositionHint": "Around 2.5 amp hours at 1.5 volts. Convert amp hours to coulombs (multiply by 3600) and multiply by voltage.",
    "strategy": "unit-conversion",
    "source": "Alkaline cell capacity specifications"
  },
  {
    "id": "energy-in-a-litre-of-petrol",
    "prompt": "How many joules of energy are released by burning one litre of petrol?",
    "unit": "joules",
    "answerValue": 34000000,
    "decompositionHint": "Petrol carries about 45 megajoules per kilogram and weighs roughly 0.75 kg per litre.",
    "strategy": "energy-balance",
    "source": "Standard fuel energy density tables"
  },
  {
    "id": "power-of-a-large-power-station",
    "prompt": "How many watts does a large nuclear power station generate?",
    "unit": "watts",
    "answerValue": 1000000000,
    "decompositionHint": "A single large reactor is around a gigawatt, which is roughly the average electricity demand of a million people in a wealthy country.",
    "strategy": "energy-balance",
    "source": "Typical reactor nameplate capacity"
  },
  {
    "id": "household-electricity-per-year",
    "prompt": "How many kilowatt hours of electricity does a typical household use in a year?",
    "asOf": 2025,
    "unit": "kilowatt hours",
    "answerValue": 4000,
    "decompositionHint": "Averages range from about 2,500 kWh in much of Europe to over 10,000 in the United States. Heating and hot water dominate where they are electric.",
    "strategy": "energy-balance",
    "source": "National household electricity consumption statistics"
  },
  {
    "id": "solar-panel-output-per-year",
    "prompt": "How many kilowatt hours does a single rooftop solar panel produce in a year?",
    "unit": "kilowatt hours",
    "answerValue": 450,
    "decompositionHint": "A panel is roughly 400 watts peak, and a temperate site delivers something like 1,100 full-sun-equivalent hours a year.",
    "strategy": "energy-balance",
    "source": "Typical panel rating and capacity factor"
  },
  {
    "id": "energy-to-boil-a-kettle",
    "prompt": "How many joules does it take to boil a litre of water from room temperature?",
    "unit": "joules",
    "answerValue": 340000,
    "decompositionHint": "Water needs 4,180 joules per kilogram per degree. One kilogram raised about 80 degrees gives the answer, before losses.",
    "strategy": "energy-balance",
    "source": "Specific heat capacity of water"
  },
  {
    "id": "global-electricity-generation",
    "prompt": "How many terawatt hours of electricity does the world generate in a year?",
    "asOf": 2025,
    "unit": "terawatt hours",
    "answerValue": 30000,
    "decompositionHint": "About 8 billion people averaging some 3,700 kWh each, though consumption per person varies by more than a hundredfold between countries.",
    "strategy": "population-rate",
    "source": "IEA world electricity generation statistics"
  },
  {
    "id": "wind-turbine-output-per-year",
    "prompt": "How many megawatt hours does one large wind turbine produce in a year?",
    "unit": "megawatt hours",
    "answerValue": 9000,
    "decompositionHint": "A modern onshore turbine is around 3 MW and runs at roughly a 35% capacity factor across the 8,760 hours in a year.",
    "strategy": "rate-time",
    "source": "Typical turbine rating and onshore capacity factor"
  },
  {
    "id": "energy-in-a-lightning-strike-vs-household",
    "prompt": "For how many days could a typical household run on the energy in one lightning bolt?",
    "unit": "days",
    "answerValue": 4,
    "decompositionHint": "A bolt carries roughly 5 gigajoules, or about 1,400 kWh. A household uses on the order of 300 kWh a month.",
    "strategy": "energy-balance",
    "source": "Derived from lightning energy and household consumption"
  },
  {
    "id": "calories-in-a-kilogram-of-fat",
    "prompt": "How many kilocalories are stored in one kilogram of body fat?",
    "unit": "kilocalories",
    "answerValue": 7700,
    "decompositionHint": "Pure fat carries about 9 kcal per gram, and body fat tissue is roughly 85% fat with the rest water and connective tissue.",
    "strategy": "energy-balance",
    "source": "Standard nutrition figures"
  },
  {
    "id": "coal-burned-per-year-worldwide",
    "prompt": "How many tonnes of coal are burned worldwide in a year?",
    "asOf": 2025,
    "unit": "tonnes",
    "answerValue": 8500000000,
    "decompositionHint": "Roughly a tonne per person on Earth per year, dominated by electricity generation and steelmaking in a handful of countries.",
    "strategy": "population-rate",
    "source": "IEA coal consumption statistics"
  },
  {
    "id": "oil-consumed-per-day-worldwide",
    "prompt": "How many barrels of oil does the world consume each day?",
    "asOf": 2025,
    "unit": "barrels/day",
    "answerValue": 103000000,
    "decompositionHint": "About 100 million barrels, which works out near 1.6 litres per person per day averaged across everyone alive.",
    "strategy": "population-rate",
    "source": "IEA and OPEC demand figures"
  },
  {
    "id": "speed-to-reach-orbit",
    "prompt": "How fast must a spacecraft travel to stay in low Earth orbit, in kilometres per hour?",
    "unit": "kilometres per hour",
    "answerValue": 28000,
    "decompositionHint": "About 7.8 km/s. Convert to hours by multiplying by 3,600. It circles the planet in roughly 90 minutes.",
    "strategy": "unit-conversion",
    "source": "Orbital mechanics for low Earth orbit"
  },
  {
    "id": "altitude-of-the-space-station",
    "prompt": "How high above the Earth does the International Space Station orbit, in kilometres?",
    "unit": "kilometres",
    "answerValue": 410,
    "decompositionHint": "Low enough that residual atmosphere drags it down and it needs periodic reboosting - only about 1/16th of Earth's radius above the surface.",
    "strategy": "anchor-scale",
    "source": "ISS operational orbital altitude"
  },
  {
    "id": "people-who-have-been-to-space",
    "prompt": "How many people have travelled to space?",
    "asOf": 2025,
    "unit": "people",
    "answerValue": 700,
    "decompositionHint": "Six decades of spaceflight at an average of roughly a dozen people a year, rising sharply with recent commercial flights.",
    "strategy": "rate-time",
    "source": "Astronaut and cosmonaut flight records"
  },
  {
    "id": "people-who-have-walked-on-the-moon",
    "prompt": "How many people have walked on the Moon?",
    "unit": "people",
    "answerValue": 12,
    "decompositionHint": "Six successful landing missions, two crew on the surface each time.",
    "strategy": "decompose",
    "source": "Apollo mission records"
  },
  {
    "id": "cost-per-kilogram-to-orbit",
    "prompt": "What does it cost to put one kilogram into low Earth orbit, in US dollars?",
    "asOf": 2025,
    "unit": "US dollars",
    "answerValue": 2500,
    "decompositionHint": "Reusable boosters have cut this by more than an order of magnitude from the shuttle era, when it ran into the tens of thousands.",
    "strategy": "decompose",
    "source": "Published commercial launch pricing"
  },
  {
    "id": "asteroids-discovered",
    "prompt": "How many asteroids have been discovered and catalogued?",
    "asOf": 2025,
    "unit": "asteroids",
    "answerValue": 1400000,
    "decompositionHint": "Automated sky surveys add tens of thousands a year, so the catalogue has grown by more than a factor of ten since the 1990s.",
    "strategy": "rate-time",
    "source": "Minor Planet Center catalogue"
  },
  {
    "id": "distance-to-the-moon",
    "prompt": "How far away is the Moon, in kilometres?",
    "unit": "kilometres",
    "answerValue": 384400,
    "decompositionHint": "About thirty Earth diameters. Light takes a little over a second to cross the gap.",
    "strategy": "rate-time",
    "source": "Mean Earth-Moon distance"
  },
  {
    "id": "time-for-sunlight-to-reach-earth",
    "prompt": "How many seconds does sunlight take to reach the Earth?",
    "unit": "seconds",
    "answerValue": 500,
    "decompositionHint": "150 million kilometres divided by 300,000 kilometres per second.",
    "strategy": "unit-conversion",
    "source": "Astronomical unit divided by the speed of light"
  },
  {
    "id": "moons-in-the-solar-system",
    "prompt": "How many moons are known in the solar system?",
    "asOf": 2025,
    "unit": "moons",
    "answerValue": 400,
    "decompositionHint": "Saturn and Jupiter account for most of them, and the count keeps rising as surveys find smaller irregular satellites.",
    "strategy": "decompose",
    "source": "IAU confirmed natural satellite counts"
  },
  {
    "id": "rocket-launches-per-year",
    "prompt": "How many orbital rocket launches take place worldwide in a year?",
    "asOf": 2025,
    "unit": "launches",
    "answerValue": 250,
    "decompositionHint": "Roughly one every day and a half, more than double the rate of a decade ago, driven largely by satellite constellation deployment.",
    "strategy": "rate-time",
    "source": "Orbital launch logs"
  },
  {
    "id": "energy-in-a-hurricane",
    "prompt": "How many joules of energy does a hurricane release in a single day through cloud formation?",
    "unit": "joules",
    "answerValue": 50000000000000000000,
    "decompositionHint": "Dominated by latent heat as water vapour condenses. It is several hundred times the world's daily electricity generation.",
    "strategy": "energy-balance",
    "source": "NOAA hurricane energy estimates"
  },
  {
    "id": "raindrops-per-cubic-metre-of-cloud",
    "prompt": "How many water droplets are in one cubic metre of cloud?",
    "unit": "droplets",
    "answerValue": 100000000,
    "decompositionHint": "Cloud droplets are tiny, around 20 micrometres, and a cubic metre of cloud holds under a gram of liquid water in total.",
    "strategy": "volume-packing",
    "source": "Cloud physics droplet concentration figures"
  },
  {
    "id": "lightning-bolt-temperature",
    "prompt": "How hot does the air in a lightning channel get, in kelvin?",
    "unit": "kelvin",
    "answerValue": 30000,
    "decompositionHint": "Several times hotter than the surface of the Sun, which is why the surrounding air expands explosively and makes thunder.",
    "strategy": "chain-multiply",
    "source": "Atmospheric physics measurements of return stroke temperature"
  },
  {
    "id": "snowflakes-in-a-cubic-metre-of-snow",
    "prompt": "How many snowflakes make up one cubic metre of fresh snow?",
    "unit": "snowflakes",
    "answerValue": 100000000,
    "decompositionHint": "Fresh snow is about a tenth the density of water, so a cubic metre holds ~100 kg of ice, and a snowflake weighs a few milligrams.",
    "strategy": "volume-packing",
    "source": "Derived from fresh snow density and typical flake mass"
  },
  {
    "id": "tornadoes-in-the-us-per-year",
    "prompt": "How many tornadoes are recorded in the United States each year?",
    "asOf": 2025,
    "unit": "tornadoes",
    "answerValue": 1200,
    "decompositionHint": "More than the rest of the world combined, because of the collision of Gulf moisture with dry continental air over the plains.",
    "strategy": "rate-time",
    "source": "NOAA Storm Prediction Center annual counts"
  },
  {
    "id": "hottest-and-coldest-spread",
    "prompt": "What is the difference between the hottest and coldest air temperatures ever recorded on Earth, in degrees Celsius?",
    "unit": "degrees Celsius",
    "answerValue": 150,
    "decompositionHint": "Around 57 C in Death Valley against about -89 C at Vostok in Antarctica.",
    "strategy": "decompose",
    "source": "WMO verified temperature extremes"
  },
  {
    "id": "weight-of-a-cloud",
    "prompt": "How many kilograms does a typical cumulus cloud weigh?",
    "unit": "kilograms",
    "answerValue": 500000,
    "decompositionHint": "About a cubic kilometre in volume at roughly half a gram of liquid water per cubic metre. It stays up because the droplets are tiny and the air beneath is rising.",
    "strategy": "decompose",
    "source": "Derived from cumulus dimensions and liquid water content"
  },
  {
    "id": "deepest-point-in-the-ocean",
    "prompt": "How deep is the deepest point in the ocean, in metres?",
    "unit": "metres",
    "answerValue": 10900,
    "decompositionHint": "The Mariana Trench is deeper than Everest is tall, by more than a kilometre.",
    "strategy": "decompose",
    "source": "Challenger Deep depth measurements"
  },
  {
    "id": "salt-in-the-oceans",
    "prompt": "How many tonnes of salt are dissolved in the world's oceans?",
    "unit": "tonnes",
    "answerValue": 50000000000000000,
    "decompositionHint": "Seawater is about 3.5% salt by mass, and the oceans hold roughly 1.4x10^18 tonnes of water.",
    "strategy": "decompose",
    "source": "Derived from ocean mass and mean salinity"
  },
  {
    "id": "plankton-in-a-litre-of-seawater",
    "prompt": "How many phytoplankton cells are in one litre of surface seawater?",
    "unit": "cells",
    "answerValue": 1000000,
    "decompositionHint": "Concentrations run to thousands per millilitre in productive water. Collectively they produce roughly half the oxygen in the atmosphere.",
    "strategy": "area-density",
    "source": "Marine biology cell count surveys"
  },
  {
    "id": "fish-in-the-ocean",
    "prompt": "How many individual fish are in the world's oceans?",
    "unit": "fish",
    "answerValue": 3500000000000,
    "decompositionHint": "Dominated by small mesopelagic species rather than the large fish people picture, which is why the estimate is far larger than fishery statistics suggest.",
    "strategy": "recall-sanity",
    "source": "Marine biomass estimates, commonly cited around 3.5 trillion"
  },
  {
    "id": "coral-reef-area",
    "prompt": "How many square kilometres of coral reef are there worldwide?",
    "unit": "square kilometres",
    "answerValue": 280000,
    "decompositionHint": "Under a tenth of a percent of the ocean floor, yet home to roughly a quarter of all marine species.",
    "strategy": "decompose",
    "source": "Global coral reef mapping surveys"
  },
  {
    "id": "waves-hitting-a-beach-per-day",
    "prompt": "How many waves break on a given beach in one day?",
    "unit": "waves",
    "answerValue": 8000,
    "decompositionHint": "Sets arrive roughly every ten seconds, so count the number of ten second intervals in 24 hours.",
    "strategy": "unit-conversion",
    "source": "Typical ocean swell period"
  },
  {
    "id": "water-evaporating-from-oceans-per-year",
    "prompt": "How many cubic kilometres of water evaporate from the oceans each year?",
    "unit": "cubic kilometres",
    "answerValue": 430000,
    "decompositionHint": "Almost all of global precipitation ultimately comes from ocean evaporation, so it is close to the total rain and snow falling worldwide.",
    "strategy": "volume-packing",
    "source": "Global hydrological cycle budgets"
  },
  {
    "id": "krill-in-the-southern-ocean",
    "prompt": "How many tonnes of Antarctic krill live in the Southern Ocean?",
    "unit": "tonnes",
    "answerValue": 400000000,
    "decompositionHint": "One of the largest single-species biomasses on Earth, and the base of the food chain that supports whales, seals and penguins.",
    "strategy": "decompose",
    "source": "Antarctic krill biomass surveys"
  },
  {
    "id": "steps-in-a-football-match",
    "prompt": "How far does a professional footballer run during a 90 minute match, in kilometres?",
    "unit": "kilometres",
    "answerValue": 10,
    "decompositionHint": "Mostly walking and jogging with short sprints. Averaging a little over 6 km/h across 90 minutes gets you close.",
    "strategy": "decompose",
    "source": "Match tracking data for outfield players"
  },
  {
    "id": "golf-balls-made-per-year",
    "prompt": "How many golf balls are manufactured worldwide each year?",
    "asOf": 2025,
    "unit": "golf balls",
    "answerValue": 1200000000,
    "decompositionHint": "Roughly 60 million golfers losing and replacing on the order of twenty balls a year each.",
    "strategy": "rate-time",
    "source": "Golf equipment industry production estimates"
  },
  {
    "id": "tennis-balls-used-at-wimbledon",
    "prompt": "How many tennis balls are used during the Wimbledon championships?",
    "unit": "tennis balls",
    "answerValue": 55000,
    "decompositionHint": "Balls are changed every nine games, and there are hundreds of matches across the fortnight including qualifying and doubles.",
    "strategy": "decompose",
    "source": "Wimbledon published tournament figures"
  },
  {
    "id": "marathon-finishers-per-year",
    "prompt": "How many people finish a marathon worldwide each year?",
    "asOf": 2025,
    "unit": "finishers",
    "answerValue": 1100000,
    "decompositionHint": "Thousands of events, with the largest half dozen accounting for well over a hundred thousand finishers between them.",
    "strategy": "decompose",
    "source": "Running event participation statistics"
  },
  {
    "id": "olympic-medals-awarded",
    "prompt": "How many medals are awarded at a modern summer Olympic Games?",
    "unit": "medals",
    "answerValue": 1000,
    "decompositionHint": "Around 330 events, each awarding gold, silver and bronze, with team events multiplying the physical medal count further.",
    "strategy": "chain-multiply",
    "source": "Recent summer Olympic event and medal counts"
  },
  {
    "id": "swimming-pool-lengths-in-a-mile",
    "prompt": "How many lengths of a 25 metre pool make up a mile?",
    "unit": "lengths",
    "answerValue": 64,
    "decompositionHint": "A mile is about 1,609 metres. Divide by the length of the pool.",
    "strategy": "divide-total",
    "source": "Direct unit conversion"
  },
  {
    "id": "heartbeats-during-a-marathon",
    "prompt": "How many times does a runner's heart beat during a marathon?",
    "unit": "heartbeats",
    "answerValue": 26000,
    "decompositionHint": "Around 160 beats a minute sustained for roughly four hours.",
    "strategy": "rate-time",
    "source": "Derived from typical racing heart rate and finish time"
  },
  {
    "id": "footballs-made-per-year",
    "prompt": "How many footballs are manufactured worldwide each year?",
    "asOf": 2025,
    "unit": "footballs",
    "answerValue": 40000000,
    "decompositionHint": "A large share come from a single manufacturing cluster in Pakistan. Think of one ball per two hundred people on Earth per year.",
    "strategy": "population-rate",
    "source": "Sporting goods manufacturing estimates"
  },
  {
    "id": "notes-in-a-piano-piece",
    "prompt": "How many individual notes does a pianist play in a typical three minute piece?",
    "unit": "notes",
    "answerValue": 2000,
    "decompositionHint": "Perhaps ten notes a second in busy passages, far fewer in slow ones. Average a few per second across 180 seconds.",
    "strategy": "area-density",
    "source": "Order-of-magnitude estimate from typical note density"
  },
  {
    "id": "strings-in-a-piano",
    "prompt": "How many strings are inside a grand piano?",
    "unit": "strings",
    "answerValue": 230,
    "decompositionHint": "88 keys, but most notes use two or three strings struck together, with only the lowest bass notes using a single thick string.",
    "strategy": "decompose",
    "source": "Piano construction references"
  },
  {
    "id": "musicians-in-a-symphony-orchestra",
    "prompt": "How many musicians play in a full symphony orchestra?",
    "unit": "musicians",
    "answerValue": 90,
    "decompositionHint": "Strings are the bulk of it at around sixty, with woodwind, brass and percussion making up the rest.",
    "strategy": "decompose",
    "source": "Standard orchestral complement"
  },
  {
    "id": "paintings-in-the-louvre",
    "prompt": "How many works of art are held by the Louvre?",
    "asOf": 2025,
    "unit": "works",
    "answerValue": 500000,
    "decompositionHint": "Only a small fraction is on display at any time; most of the collection is in storage.",
    "strategy": "decompose",
    "source": "Louvre published collection figures"
  },
  {
    "id": "books-in-the-library-of-congress",
    "prompt": "How many books does the Library of Congress hold?",
    "asOf": 2025,
    "unit": "books",
    "answerValue": 25000000,
    "decompositionHint": "Its total collection runs to well over 170 million items, but most of that is manuscripts, maps, photographs and recordings rather than books.",
    "strategy": "decompose",
    "source": "Library of Congress collection statistics"
  },
  {
    "id": "songs-recorded-in-history",
    "prompt": "How many distinct songs have been commercially recorded in history?",
    "asOf": 2025,
    "unit": "songs",
    "answerValue": 100000000,
    "decompositionHint": "Streaming catalogues alone list around a hundred million tracks, which is a reasonable proxy for everything ever released.",
    "strategy": "recall-sanity",
    "source": "Streaming platform catalogue sizes as a proxy"
  },
  {
    "id": "words-in-a-feature-film-script",
    "prompt": "How many words are in a typical feature film screenplay?",
    "unit": "words",
    "answerValue": 20000,
    "decompositionHint": "Roughly 110 pages at one minute of screen time per page, and a screenplay page carries far fewer words than a novel page.",
    "strategy": "decompose",
    "source": "Standard screenplay formatting conventions"
  },
  {
    "id": "words-in-the-english-language",
    "prompt": "How many words are listed in a comprehensive English dictionary?",
    "unit": "words",
    "answerValue": 600000,
    "decompositionHint": "Far more than any person knows. An educated native speaker has a vocabulary of perhaps 20,000 to 35,000 word families.",
    "strategy": "decompose",
    "source": "Oxford English Dictionary headword counts"
  },
  {
    "id": "words-an-adult-knows",
    "prompt": "How many words does an average adult native English speaker know?",
    "unit": "words",
    "answerValue": 30000,
    "decompositionHint": "Vocabulary tests suggest steady growth of a few words a day through childhood, plateauing in adulthood.",
    "strategy": "rate-time",
    "source": "Vocabulary size research"
  },
  {
    "id": "languages-spoken-worldwide",
    "prompt": "How many languages are spoken in the world?",
    "asOf": 2025,
    "unit": "languages",
    "answerValue": 7000,
    "decompositionHint": "Around half have fewer than ten thousand speakers, and a language dies roughly every few weeks.",
    "strategy": "decompose",
    "source": "Ethnologue language counts"
  },
  {
    "id": "characters-needed-to-read-chinese",
    "prompt": "How many Chinese characters do you need to know to read a newspaper?",
    "unit": "characters",
    "answerValue": 3000,
    "decompositionHint": "The full set runs to tens of thousands, but frequency is very skewed - a few thousand covers the overwhelming majority of running text.",
    "strategy": "decompose",
    "source": "Chinese literacy standards"
  },
  {
    "id": "words-spoken-per-day",
    "prompt": "How many words does an average person speak in a day?",
    "unit": "words",
    "answerValue": 16000,
    "decompositionHint": "Recording studies found men and women almost identical, contrary to the popular claim that women speak far more.",
    "strategy": "rate-time",
    "source": "Mehl et al. 2007, Science"
  },
  {
    "id": "letters-in-a-typical-novel",
    "prompt": "How many individual letters are printed in an average novel?",
    "unit": "letters",
    "answerValue": 450000,
    "decompositionHint": "About 90,000 words at roughly five letters each.",
    "strategy": "decompose",
    "source": "Derived from typical novel length and word length"
  },
  {
    "id": "concrete-produced-per-year",
    "prompt": "How many tonnes of concrete are produced worldwide each year?",
    "asOf": 2025,
    "unit": "tonnes",
    "answerValue": 30000000000,
    "decompositionHint": "By mass the most used material on Earth after water - roughly four tonnes per person per year.",
    "strategy": "population-rate",
    "source": "Global cement and concrete industry statistics"
  },
  {
    "id": "steel-produced-per-year",
    "prompt": "How many kilograms of steel are produced for each person on Earth in a year?",
    "asOf": 2025,
    "unit": "kilograms per person",
    "answerValue": 240,
    "decompositionHint": "World steel output is around 1.9 billion tonnes against a population of 8 billion. China alone makes over half of it.",
    "strategy": "population-rate",
    "source": "World Steel Association output divided by world population"
  },
  {
    "id": "plastic-produced-per-year",
    "prompt": "How many tonnes of plastic have been manufactured in total since mass production began in the 1950s?",
    "asOf": 2025,
    "unit": "tonnes",
    "answerValue": 9500000000,
    "decompositionHint": "Annual output is around 400 million tonnes now but was tiny in the 1950s and has grown roughly exponentially, so the cumulative total is around twenty times the current annual figure.",
    "strategy": "exponential",
    "source": "Geyer, Jambeck and Law 2017, Science Advances - cumulative plastics production"
  },
  {
    "id": "cement-in-a-house-foundation",
    "prompt": "How many tonnes of concrete go into the foundation of a typical house?",
    "unit": "tonnes",
    "answerValue": 30,
    "decompositionHint": "A slab of maybe 100 square metres at 150 mm thick, and concrete weighs about 2.4 tonnes per cubic metre.",
    "strategy": "decompose",
    "source": "Construction estimating figures"
  },
  {
    "id": "steel-in-the-eiffel-tower",
    "prompt": "How many tonnes of iron went into the Eiffel Tower?",
    "unit": "tonnes",
    "answerValue": 7300,
    "decompositionHint": "Famously light for its size - the iron in it would only fill a cube about 12 metres on a side if melted down.",
    "strategy": "decompose",
    "source": "Eiffel Tower construction records"
  },
  {
    "id": "rivets-in-the-eiffel-tower",
    "prompt": "How many rivets hold the Eiffel Tower together?",
    "unit": "rivets",
    "answerValue": 2500000,
    "decompositionHint": "Around 18,000 individual iron pieces joined by hand, needing well over a hundred rivets each on average.",
    "strategy": "decompose",
    "source": "Eiffel Tower construction records"
  },
  {
    "id": "aluminium-cans-recycled-per-year",
    "prompt": "How many aluminium drink cans are used worldwide each year?",
    "asOf": 2025,
    "unit": "cans",
    "answerValue": 400000000000,
    "decompositionHint": "Roughly fifty per person on Earth per year, heavily skewed towards a handful of countries.",
    "strategy": "population-rate",
    "source": "Aluminium packaging industry statistics"
  },
  {
    "id": "glass-bottles-produced-per-year",
    "prompt": "How many glass containers are produced worldwide each year?",
    "asOf": 2025,
    "unit": "containers",
    "answerValue": 500000000000,
    "decompositionHint": "Comparable in count to aluminium cans, dominated by beverage packaging.",
    "strategy": "anchor-scale",
    "source": "Glass packaging industry statistics"
  },
  {
    "id": "buildings-in-new-york-city",
    "prompt": "How many buildings are there in New York City?",
    "asOf": 2025,
    "unit": "buildings",
    "answerValue": 1000000,
    "decompositionHint": "Dominated by low rise housing in the outer boroughs rather than the towers of Manhattan.",
    "strategy": "decompose",
    "source": "NYC building footprint datasets"
  },
  {
    "id": "skyscrapers-over-150m",
    "prompt": "How many buildings over 150 metres tall exist worldwide?",
    "asOf": 2025,
    "unit": "buildings",
    "answerValue": 9000,
    "decompositionHint": "China holds nearly half. The count has roughly tripled since 2010.",
    "strategy": "decompose",
    "source": "Council on Tall Buildings and Urban Habitat database"
  },
  {
    "id": "steps-in-the-empire-state-building",
    "prompt": "How many stairs are there to the top of the Empire State Building?",
    "unit": "stairs",
    "answerValue": 1576,
    "decompositionHint": "102 floors at roughly 15 steps each, allowing for taller lobby levels.",
    "strategy": "recall-sanity",
    "source": "Empire State Building published figures"
  },
  {
    "id": "lifts-in-a-skyscraper",
    "prompt": "How many lifts serve a large 100 storey skyscraper?",
    "unit": "lifts",
    "answerValue": 70,
    "decompositionHint": "Tall buildings need banks serving different floor ranges, or the lift shafts would consume too much floor area at the base.",
    "strategy": "decompose",
    "source": "Tall building services design figures"
  },
  {
    "id": "people-per-square-kilometre-in-a-city",
    "prompt": "How many people live in one square kilometre of a dense city like Paris?",
    "unit": "people",
    "answerValue": 20000,
    "decompositionHint": "About two million people in roughly a hundred square kilometres within the historic boundary.",
    "strategy": "area-density",
    "source": "Municipal population density figures"
  },
  {
    "id": "bricks-in-the-great-wall",
    "prompt": "How many bricks make up the Great Wall of China?",
    "unit": "bricks",
    "answerValue": 3900000000,
    "decompositionHint": "Thousands of kilometres of wall, several metres tall and thick, though much of the length is rammed earth rather than brick.",
    "strategy": "decompose",
    "source": "Order-of-magnitude estimate from wall dimensions"
  },
  {
    "id": "windows-in-the-empire-state-building",
    "prompt": "How many windows does the Empire State Building have?",
    "unit": "windows",
    "answerValue": 6500,
    "decompositionHint": "102 floors, with the tower tapering sharply above the sixth floor so upper floors have far fewer windows than the base.",
    "strategy": "recall-sanity",
    "source": "Empire State Building published figures"
  },
  {
    "id": "houses-in-a-suburb",
    "prompt": "How many houses are in one square kilometre of typical low density suburb?",
    "unit": "houses",
    "answerValue": 1200,
    "decompositionHint": "Plots of roughly 600 square metres including the share of roads and verges.",
    "strategy": "area-density",
    "source": "Derived from typical suburban lot sizes"
  },
  {
    "id": "paint-to-cover-a-house",
    "prompt": "How many litres of paint does it take to paint the outside of a house?",
    "unit": "litres",
    "answerValue": 40,
    "decompositionHint": "Around 200 square metres of wall at roughly 10 square metres per litre, over two coats.",
    "strategy": "area-density",
    "source": "Paint coverage rates from manufacturer guidance"
  },
  {
    "id": "fuel-burned-on-a-transatlantic-flight",
    "prompt": "How many litres of fuel does a wide body airliner burn crossing the Atlantic?",
    "unit": "litres",
    "answerValue": 60000,
    "decompositionHint": "Roughly 8 hours at about 7,500 litres an hour for a large twin engine jet.",
    "strategy": "decompose",
    "source": "Published fuel burn rates for long haul aircraft"
  },
  {
    "id": "fuel-per-passenger-per-100km-flying",
    "prompt": "How many litres of fuel does a full airliner burn per passenger per 100 kilometres?",
    "unit": "litres",
    "answerValue": 3,
    "decompositionHint": "Comparable to a small efficient car carrying one person, which surprises people who assume flying is far worse per kilometre.",
    "strategy": "anchor-scale",
    "source": "Airline fuel efficiency reporting"
  },
  {
    "id": "rivets-in-an-airliner",
    "prompt": "How many rivets hold a large airliner together?",
    "unit": "rivets",
    "answerValue": 3000000,
    "decompositionHint": "Aluminium skin panels across a fuselage 60 metres long plus the wings, with rivets every few centimetres along every seam.",
    "strategy": "decompose",
    "source": "Aircraft manufacturing figures"
  },
  {
    "id": "parts-in-a-car",
    "prompt": "How many individual parts make up a modern car?",
    "unit": "parts",
    "answerValue": 30000,
    "decompositionHint": "Counting every nut, clip and fastener. An electric car has substantially fewer because the drivetrain is far simpler.",
    "strategy": "decompose",
    "source": "Automotive manufacturing figures"
  },
  {
    "id": "parts-in-a-bicycle",
    "prompt": "How many individual parts make up a bicycle?",
    "unit": "parts",
    "answerValue": 900,
    "decompositionHint": "The chain alone accounts for several hundred once you count every link, pin and roller.",
    "strategy": "decompose",
    "source": "Bicycle assembly component counts"
  },
  {
    "id": "revolutions-of-a-car-tyre-in-its-life",
    "prompt": "How many times does a car tyre rotate over its usable life?",
    "unit": "rotations",
    "answerValue": 20000000,
    "decompositionHint": "A tyre lasts around 50,000 km and has a circumference of about 2 metres.",
    "strategy": "chain-multiply",
    "source": "Derived from typical tyre life and wheel circumference"
  },
  {
    "id": "trains-running-in-japan-daily",
    "prompt": "How many passenger trains run in Japan on a typical day?",
    "asOf": 2025,
    "unit": "trains",
    "answerValue": 26000,
    "decompositionHint": "Tokyo alone moves millions of passengers a day on services running every few minutes across dozens of lines.",
    "strategy": "rate-time",
    "source": "Japanese rail operator service statistics"
  },
  {
    "id": "bicycles-in-the-netherlands",
    "prompt": "How many bicycles are there in the Netherlands?",
    "asOf": 2025,
    "unit": "bicycles",
    "answerValue": 23000000,
    "decompositionHint": "More bicycles than people, in a country of about 18 million.",
    "strategy": "decompose",
    "source": "Dutch cycling statistics"
  },
  {
    "id": "shipping-container-capacity-of-largest-ship",
    "prompt": "How many shipping containers can the largest container ship carry?",
    "asOf": 2025,
    "unit": "containers",
    "answerValue": 24000,
    "decompositionHint": "Measured in twenty foot equivalent units. Stacked end to end they would stretch well over a hundred kilometres.",
    "strategy": "volume-packing",
    "source": "Container ship capacity specifications"
  },
  {
    "id": "distance-a-truck-tyre-travels-per-year",
    "prompt": "How many kilometres does a long haul truck cover in a year?",
    "asOf": 2025,
    "unit": "kilometres",
    "answerValue": 120000,
    "decompositionHint": "Perhaps 500 km a day across 240 working days, several times what a private car covers.",
    "strategy": "rate-time",
    "source": "Commercial fleet mileage statistics"
  },
  {
    "id": "thickness-of-earths-crust",
    "prompt": "How thick is the Earth's continental crust, in kilometres?",
    "unit": "kilometres",
    "answerValue": 35,
    "decompositionHint": "Proportionally thinner than the skin of an apple relative to the 6,371 km radius beneath it.",
    "strategy": "anchor-scale",
    "source": "Standard geophysical figures"
  },
  {
    "id": "speed-of-continental-drift",
    "prompt": "How many centimetres do tectonic plates move in a year?",
    "unit": "centimetres",
    "answerValue": 5,
    "decompositionHint": "Famously about the rate fingernails grow. Over a human lifetime that adds up to a few metres.",
    "strategy": "rate-time",
    "source": "GPS measurements of plate motion"
  },
  {
    "id": "diamonds-mined-per-year",
    "prompt": "How many carats of natural diamonds are mined worldwide each year?",
    "asOf": 2025,
    "unit": "carats",
    "answerValue": 120000000,
    "decompositionHint": "A carat is 0.2 grams, so the annual total is only around 24 tonnes - a single truckload.",
    "strategy": "rate-time",
    "source": "Kimberley Process production statistics"
  },
  {
    "id": "gold-in-seawater",
    "prompt": "How many tonnes of gold are dissolved in the world's oceans?",
    "unit": "tonnes",
    "answerValue": 20000,
    "decompositionHint": "Concentration is only a few parts per trillion, but the oceans are so vast that the total is comparable to a decade of mining. Extracting it costs far more than it is worth.",
    "strategy": "anchor-scale",
    "source": "Oceanographic trace element measurements"
  },
  {
    "id": "age-of-the-oldest-rocks",
    "prompt": "How old are the oldest rocks found on Earth's surface, in years?",
    "unit": "years",
    "answerValue": 4000000000,
    "decompositionHint": "Slightly younger than the planet itself, because plate tectonics and erosion have recycled almost all of the original crust.",
    "strategy": "decompose",
    "source": "Radiometric dating of Acasta and Nuvvuagittuq formations"
  },
  {
    "id": "volcanic-eruptions-per-year",
    "prompt": "How many volcanoes erupt somewhere on Earth in a given year?",
    "unit": "eruptions",
    "answerValue": 70,
    "decompositionHint": "Out of roughly 1,500 active volcanoes, only a small fraction are erupting in any given year, and most go unnoticed.",
    "strategy": "rate-time",
    "source": "Smithsonian Global Volcanism Program annual activity"
  },
  {
    "id": "salt-mined-per-year",
    "prompt": "How many kilograms of salt does an average person eat in a year?",
    "asOf": 2025,
    "unit": "kilograms",
    "answerValue": 3.3,
    "decompositionHint": "Typical intake is around 9 grams of salt a day, well above the 5 grams the WHO recommends. Multiply by 365 and convert to kilograms.",
    "strategy": "unit-conversion",
    "source": "WHO dietary sodium intake estimates"
  },
  {
    "id": "seeds-in-a-sunflower-head",
    "prompt": "How many seeds are in a single large sunflower head?",
    "unit": "seeds",
    "answerValue": 1500,
    "decompositionHint": "Seeds spiral outward in a tightly packed Fibonacci arrangement across a head 20 to 30 centimetres across.",
    "strategy": "decompose",
    "source": "Agronomy references for sunflower seed counts"
  },
  {
    "id": "grains-of-pollen-from-one-plant",
    "prompt": "How many pollen grains does a single ragweed plant release in a season?",
    "unit": "pollen grains",
    "answerValue": 1000000000,
    "decompositionHint": "Wind pollinated plants must produce vast quantities because the odds any one grain reaches a receptive flower are minuscule.",
    "strategy": "decompose",
    "source": "Aerobiology pollen production studies"
  },
  {
    "id": "leaves-on-a-mature-tree",
    "prompt": "How many leaves does a mature broadleaf tree carry?",
    "unit": "leaves",
    "answerValue": 200000,
    "decompositionHint": "Estimate the number of major branches, then twigs per branch and leaves per twig - the multiplication runs away quickly.",
    "strategy": "area-density",
    "source": "Forestry leaf area estimates"
  },
  {
    "id": "water-a-tree-drinks-per-day",
    "prompt": "How many litres of water does a large tree draw up in a summer day?",
    "unit": "litres",
    "answerValue": 400,
    "decompositionHint": "Almost all of it evaporates through the leaves rather than being retained. A hectare of forest can move several hundred tonnes of water a week.",
    "strategy": "area-density",
    "source": "Plant transpiration measurements"
  },
  {
    "id": "rings-in-an-old-tree",
    "prompt": "How many growth rings does the oldest known living tree have?",
    "unit": "rings",
    "answerValue": 4900,
    "decompositionHint": "One ring a year, and the oldest bristlecone pines were already ancient when the pyramids were built.",
    "strategy": "rate-time",
    "source": "Dendrochronology records for Great Basin bristlecone pine"
  },
  {
    "id": "oxygen-produced-by-a-tree-per-year",
    "prompt": "How many kilograms of oxygen does a mature tree produce in a year?",
    "unit": "kilograms",
    "answerValue": 100,
    "decompositionHint": "Tied directly to how much carbon it fixes: roughly 20 kg of carbon dioxide absorbed yields a bit under its own mass in oxygen released.",
    "strategy": "rate-time",
    "source": "Forestry carbon and oxygen exchange estimates"
  },
  {
    "id": "bacteria-on-a-doorknob",
    "prompt": "How many bacteria live on a typical door handle?",
    "unit": "bacteria",
    "answerValue": 100000,
    "decompositionHint": "Hard, dry, frequently touched surfaces carry hundreds of organisms per square centimetre - far fewer than a kitchen sponge.",
    "strategy": "area-density",
    "source": "Environmental microbiology swab studies"
  },
  {
    "id": "bacteria-in-a-kitchen-sponge",
    "prompt": "How many bacteria live in a used kitchen sponge?",
    "unit": "bacteria",
    "answerValue": 50000000000,
    "decompositionHint": "Warm, wet and full of food residue with enormous surface area - densities rival those found in faeces.",
    "strategy": "area-density",
    "source": "Cardinale et al. 2017, Scientific Reports"
  },
  {
    "id": "bacteria-generation-time",
    "prompt": "How many minutes does it take a well fed E. coli cell to divide?",
    "unit": "minutes",
    "answerValue": 20,
    "decompositionHint": "Fast enough that a single cell could in principle produce a colony visible to the naked eye overnight.",
    "strategy": "divide-total",
    "source": "Standard microbiology growth rates"
  },
  {
    "id": "viruses-in-a-drop-of-seawater",
    "prompt": "How many virus particles are in a single drop of seawater?",
    "unit": "virus particles",
    "answerValue": 500000,
    "decompositionHint": "About ten million per millilitre, and a drop is roughly 0.05 millilitres.",
    "strategy": "area-density",
    "source": "Marine virology concentration measurements"
  },
  {
    "id": "microbes-in-the-human-gut",
    "prompt": "How many microbial cells live in the human large intestine?",
    "unit": "microbial cells",
    "answerValue": 38000000000000,
    "decompositionHint": "Roughly comparable to the number of human cells in the body, revising down the old claim of a ten to one ratio.",
    "strategy": "anchor-scale",
    "source": "Sender, Fuchs and Milo 2016, PLOS Biology"
  },
  {
    "id": "possible-lottery-combinations",
    "prompt": "How many possible combinations are there in a 6 from 49 lottery?",
    "unit": "combinations",
    "answerValue": 14000000,
    "decompositionHint": "49 choose 6. Equivalent to picking one particular second out of about five months.",
    "strategy": "combinatorial",
    "source": "Direct combinatorial calculation"
  },
  {
    "id": "possible-rubiks-cube-positions",
    "prompt": "How many positions can a 3x3 Rubik's cube be in?",
    "unit": "positions",
    "answerValue": 43000000000000000000,
    "decompositionHint": "Corner and edge permutations and orientations, divided by the constraints that make some arrangements unreachable by legal turns.",
    "strategy": "combinatorial",
    "source": "Standard Rubik's cube group order, 4.325x10^19"
  },
  {
    "id": "possible-eight-character-passwords",
    "prompt": "How many different eight character passwords can be made from letters, digits and symbols?",
    "unit": "passwords",
    "answerValue": 6000000000000000,
    "decompositionHint": "About 95 printable characters raised to the eighth power.",
    "strategy": "decompose",
    "source": "Direct calculation over the printable ASCII set"
  },
  {
    "id": "possible-chess-openings-after-four-moves",
    "prompt": "How many distinct chess positions are possible after each player has made two moves?",
    "unit": "positions",
    "answerValue": 72000,
    "decompositionHint": "Twenty legal first moves each, then roughly thirty replies, with transpositions reducing the raw product somewhat.",
    "strategy": "combinatorial",
    "source": "Chess game tree enumeration"
  },
  {
    "id": "birthday-paradox-group-size",
    "prompt": "How many people must be in a room for a shared birthday to be more likely than not?",
    "unit": "people",
    "answerValue": 23,
    "decompositionHint": "It counts pairs, not people: 23 people form 253 pairs, and each pair has a 1 in 365 chance.",
    "strategy": "decompose",
    "source": "The birthday problem"
  },
  {
    "id": "items-in-a-supermarket",
    "prompt": "How many distinct products does a large supermarket stock?",
    "asOf": 2025,
    "unit": "products",
    "answerValue": 30000,
    "decompositionHint": "Counting every size and flavour variant separately, which is why the number dwarfs what a shopper perceives.",
    "strategy": "decompose",
    "source": "Grocery retail assortment statistics"
  },
  {
    "id": "items-owned-by-a-household",
    "prompt": "How many individual possessions does a typical household own?",
    "unit": "possessions",
    "answerValue": 15000,
    "decompositionHint": "Count a kitchen drawer honestly and extrapolate - cutlery, screws, socks and books add up far faster than intuition suggests.",
    "strategy": "recall-sanity",
    "source": "Frequently cited household inventory estimates"
  },
  {
    "id": "loads-of-laundry-per-year",
    "prompt": "How many loads of laundry does a family of four wash in a year?",
    "unit": "loads",
    "answerValue": 300,
    "decompositionHint": "Something like six loads a week across 52 weeks.",
    "strategy": "rate-time",
    "source": "Appliance usage surveys"
  },
  {
    "id": "water-used-in-a-shower",
    "prompt": "How many litres of water does an eight minute shower use?",
    "unit": "litres",
    "answerValue": 80,
    "decompositionHint": "A standard head delivers roughly 10 litres a minute; low flow heads about half that.",
    "strategy": "rate-time",
    "source": "Plumbing fixture flow rate standards"
  },
  {
    "id": "toothbrushes-used-in-a-lifetime",
    "prompt": "How many toothbrushes does a person get through in a lifetime?",
    "unit": "toothbrushes",
    "answerValue": 300,
    "decompositionHint": "Dentists advise replacing every three months, so four a year across roughly 75 years of brushing.",
    "strategy": "stock-flow",
    "source": "Dental guidance on brush replacement"
  },
  {
    "id": "batteries-used-per-person-per-year",
    "prompt": "How many disposable batteries does an average person use in a year?",
    "asOf": 2025,
    "unit": "batteries",
    "answerValue": 8,
    "decompositionHint": "Global alkaline production runs into the tens of billions of cells a year across 8 billion people, though consumption is concentrated in wealthy countries.",
    "strategy": "rate-time",
    "source": "Battery industry production statistics"
  },
  {
    "id": "plastic-bags-used-per-year-worldwide",
    "prompt": "How many plastic bags are used worldwide each year?",
    "asOf": 2025,
    "unit": "bags",
    "answerValue": 500000000000,
    "decompositionHint": "Roughly sixty per person on Earth per year, though bans have cut this sharply in some countries.",
    "strategy": "population-rate",
    "source": "Plastics industry and environmental agency estimates"
  },
  {
    "id": "coffee-cups-used-per-year",
    "prompt": "How many disposable coffee cups are thrown away worldwide each year?",
    "asOf": 2025,
    "unit": "cups",
    "answerValue": 250000000000,
    "decompositionHint": "Follows from roughly 2 billion cups of coffee drunk a day, with a minority served in disposable cups.",
    "strategy": "rate-time",
    "source": "Packaging waste estimates"
  },
  {
    "id": "nappies-used-per-baby",
    "prompt": "How many disposable nappies does one baby get through before toilet training?",
    "unit": "nappies",
    "answerValue": 5000,
    "decompositionHint": "Six or so a day for the first year, tapering to three or four, across about two and a half years.",
    "strategy": "divide-total",
    "source": "Parenting and waste management estimates"
  },
  {
    "id": "shoes-owned-in-a-lifetime",
    "prompt": "How many pairs of shoes does a person buy in a lifetime?",
    "unit": "pairs",
    "answerValue": 250,
    "decompositionHint": "Averaging three or four pairs a year across seventy adult years, more in childhood when feet keep growing.",
    "strategy": "rate-time",
    "source": "Consumer purchasing surveys"
  },
  {
    "id": "uk-population-1801",
    "prompt": "What was the population of Britain at its first census?",
    "asOf": 1801,
    "unit": "people",
    "answerValue": 10500000,
    "decompositionHint": "Barely a sixth of today's figure, on the eve of the industrial expansion that would transform it.",
    "strategy": "population-rate",
    "source": "UK census records"
  },
  {
    "id": "uk-population-2025",
    "prompt": "What is the population of the United Kingdom?",
    "asOf": 2025,
    "unit": "people",
    "answerValue": 69000000,
    "decompositionHint": "Around 0.85% of world population, in a country roughly the size of the American state of Oregon.",
    "strategy": "population-rate",
    "source": "Office for National Statistics estimates"
  },
  {
    "id": "china-population-1950",
    "prompt": "What was the population of China?",
    "asOf": 1950,
    "unit": "people",
    "answerValue": 550000000,
    "decompositionHint": "Under half its later peak, before the mortality decline that drove rapid growth through the second half of the century.",
    "strategy": "population-rate",
    "source": "UN World Population Prospects"
  },
  {
    "id": "india-population-2025",
    "prompt": "What is the population of India?",
    "asOf": 2025,
    "unit": "people",
    "answerValue": 1460000000,
    "decompositionHint": "It overtook China around 2023, and now holds roughly one in six people alive.",
    "strategy": "population-rate",
    "source": "UN World Population Prospects"
  },
  {
    "id": "global-literacy-1900",
    "prompt": "What percentage of the world's adults could read and write?",
    "asOf": 1900,
    "unit": "percent",
    "answerValue": 21,
    "decompositionHint": "Literacy was largely confined to Europe, North America and a thin elite elsewhere. Mass schooling was still decades away for most of the world.",
    "strategy": "population-rate",
    "source": "Historical literacy reconstructions"
  },
  {
    "id": "global-literacy-2025",
    "prompt": "What percentage of the world's adults can read and write?",
    "asOf": 2025,
    "unit": "percent",
    "answerValue": 87,
    "decompositionHint": "One of the largest changes of the last century, though the remaining illiterate population is still counted in the hundreds of millions.",
    "strategy": "population-rate",
    "source": "UNESCO literacy statistics"
  },
  {
    "id": "urban-share-1900",
    "prompt": "What percentage of the world's people lived in cities?",
    "asOf": 1900,
    "unit": "percent",
    "answerValue": 15,
    "decompositionHint": "Overwhelmingly rural. The crossover to a majority urban world only happened around 2007.",
    "strategy": "decompose",
    "source": "UN urbanisation historical estimates"
  },
  {
    "id": "urban-share-2025",
    "prompt": "What percentage of the world's people live in cities?",
    "asOf": 2025,
    "unit": "percent",
    "answerValue": 58,
    "decompositionHint": "The crossover past half happened around 2007, and the share continues to climb by roughly half a point a year.",
    "strategy": "rate-time",
    "source": "UN World Urbanization Prospects"
  },
  {
    "id": "child-mortality-1900",
    "prompt": "What percentage of children died before their fifth birthday worldwide?",
    "asOf": 1900,
    "unit": "percent",
    "answerValue": 36,
    "decompositionHint": "More than a third. This single figure explains why historical life expectancy at birth looks so grim compared with adult lifespans.",
    "strategy": "stock-flow",
    "source": "Historical demographic reconstructions"
  },
  {
    "id": "child-mortality-2025",
    "prompt": "What percentage of children die before their fifth birthday worldwide?",
    "asOf": 2025,
    "unit": "percent",
    "answerValue": 3.7,
    "decompositionHint": "Down roughly tenfold from 1900, though it still means several million deaths a year.",
    "strategy": "population-rate",
    "source": "UN Inter-agency Group for Child Mortality Estimation"
  },
  {
    "id": "cost-of-artificial-light-1800",
    "prompt": "How many hours of work did an hour of artificial light cost a labourer?",
    "asOf": 1800,
    "unit": "hours of work",
    "answerValue": 5,
    "decompositionHint": "Tallow candles were dim and expensive. The collapse in this figure to near zero is one of the starkest measures of economic progress.",
    "strategy": "decompose",
    "source": "Nordhaus 1996, historical price of light"
  },
  {
    "id": "horses-in-us-1900",
    "prompt": "How many horses and mules worked in the United States?",
    "asOf": 1900,
    "unit": "horses and mules",
    "answerValue": 21000000,
    "decompositionHint": "Roughly one for every four people, and cities had to dispose of thousands of tonnes of manure a day before motor vehicles arrived.",
    "strategy": "rate-time",
    "source": "US Department of Agriculture historical livestock censuses"
  },
  {
    "id": "books-printed-before-1500",
    "prompt": "How many books were printed in Europe in the first fifty years after the printing press?",
    "asOf": 1500,
    "unit": "books",
    "answerValue": 20000000,
    "decompositionHint": "Around 30,000 distinct titles in editions of several hundred each - more books produced in fifty years than European scribes had made in the previous thousand.",
    "strategy": "decompose",
    "source": "Incunabula bibliographic surveys"
  },
  {
    "id": "children-in-school-worldwide",
    "prompt": "How many children are enrolled in primary school worldwide?",
    "asOf": 2025,
    "unit": "children",
    "answerValue": 750000000,
    "decompositionHint": "Roughly one in eleven people alive, reflecting how young the population still is in much of the world.",
    "strategy": "population-rate",
    "source": "UNESCO Institute for Statistics enrolment data"
  },
  {
    "id": "teachers-worldwide",
    "prompt": "How many school teachers are there worldwide?",
    "asOf": 2025,
    "unit": "teachers",
    "answerValue": 85000000,
    "decompositionHint": "Primary and secondary combined, at average class sizes in the twenties across roughly 1.5 billion pupils.",
    "strategy": "chain-multiply",
    "source": "UNESCO teacher workforce statistics"
  },
  {
    "id": "universities-worldwide",
    "prompt": "How many universities are there in the world?",
    "asOf": 2025,
    "unit": "universities",
    "answerValue": 30000,
    "decompositionHint": "Counting degree awarding institutions. India and the United States alone account for several thousand each.",
    "strategy": "decompose",
    "source": "International higher education directories"
  },
  {
    "id": "phds-awarded-per-year-worldwide",
    "prompt": "How many doctorates are awarded worldwide each year?",
    "asOf": 2025,
    "unit": "doctorates",
    "answerValue": 300000,
    "decompositionHint": "The United States and China each award several tens of thousands, and the OECD total alone is around a quarter of a million.",
    "strategy": "decompose",
    "source": "OECD education statistics"
  },
  {
    "id": "hours-a-child-spends-in-school",
    "prompt": "How many hours does a child spend in school across their entire education?",
    "unit": "hours",
    "answerValue": 12000,
    "decompositionHint": "Roughly 6 hours a day, 190 days a year, for about 12 years.",
    "strategy": "rate-time",
    "source": "Derived from typical school year length"
  },
  {
    "id": "academic-papers-published-per-year",
    "prompt": "How many peer reviewed academic papers are published each year?",
    "asOf": 2025,
    "unit": "papers",
    "answerValue": 3000000,
    "decompositionHint": "Growing a few percent a year across tens of thousands of journals, which is why no researcher can read even their own subfield exhaustively.",
    "strategy": "rate-time",
    "source": "Scholarly publishing output studies"
  },
  {
    "id": "countries-in-the-world",
    "prompt": "How many sovereign countries are there in the world?",
    "asOf": 2025,
    "unit": "countries",
    "answerValue": 195,
    "decompositionHint": "193 UN member states plus two observers. The number roughly quadrupled over the twentieth century through decolonisation.",
    "strategy": "decompose",
    "source": "United Nations membership"
  },
  {
    "id": "people-in-prison-worldwide",
    "prompt": "How many people are held in prison worldwide?",
    "asOf": 2025,
    "unit": "prisoners",
    "answerValue": 11000000,
    "decompositionHint": "Roughly 140 per 100,000 people globally, though rates vary more than tenfold between countries.",
    "strategy": "population-rate",
    "source": "World Prison Population List"
  },
  {
    "id": "police-officers-worldwide",
    "prompt": "How many police officers are there worldwide?",
    "asOf": 2025,
    "unit": "officers",
    "answerValue": 12000000,
    "decompositionHint": "The UN median is around 300 officers per 100,000 people. Multiply across a population of 8 billion.",
    "strategy": "population-rate",
    "source": "UNODC criminal justice statistics"
  },
  {
    "id": "soldiers-worldwide",
    "prompt": "How many active duty military personnel are there worldwide?",
    "asOf": 2025,
    "unit": "personnel",
    "answerValue": 27000000,
    "decompositionHint": "A handful of countries account for over half. Reserves would add tens of millions more.",
    "strategy": "decompose",
    "source": "IISS Military Balance"
  },
  {
    "id": "refugees-worldwide",
    "prompt": "How many people are forcibly displaced worldwide?",
    "asOf": 2025,
    "unit": "people",
    "answerValue": 120000000,
    "decompositionHint": "Around one in every 67 people alive, and the figure has more than doubled in a decade.",
    "strategy": "population-rate",
    "source": "UNHCR global trends reports"
  },
  {
    "id": "elections-held-per-year",
    "prompt": "How many national elections take place worldwide in a typical year?",
    "asOf": 2025,
    "unit": "elections",
    "answerValue": 60,
    "decompositionHint": "About 195 countries with terms averaging four or five years, so a predictable fraction go to the polls annually.",
    "strategy": "divide-total",
    "source": "International electoral calendars"
  },
  {
    "id": "laws-passed-per-year-in-a-country",
    "prompt": "How many acts of parliament does a typical national legislature pass in a year?",
    "unit": "acts",
    "answerValue": 50,
    "decompositionHint": "A few dozen primary statutes, though secondary regulations made under them run into the thousands.",
    "strategy": "rate-time",
    "source": "National legislative output records"
  },
  {
    "id": "emails-a-worker-receives-per-day",
    "prompt": "How many emails does an office worker receive on a working day?",
    "asOf": 2025,
    "unit": "emails",
    "answerValue": 120,
    "decompositionHint": "Including automated notifications and copies, which typically outnumber genuinely personal messages several times over.",
    "strategy": "chain-multiply",
    "source": "Workplace email volume studies"
  },
  {
    "id": "hours-of-video-on-youtube",
    "prompt": "How many years would it take to watch every video on YouTube?",
    "asOf": 2025,
    "unit": "years",
    "answerValue": 200000,
    "decompositionHint": "About 500 hours are uploaded every minute, so a year of uploads alone is far more than a lifetime of watching.",
    "strategy": "divide-total",
    "source": "Derived from published upload rates"
  },
  {
    "id": "podcasts-in-existence",
    "prompt": "How many podcasts have been published?",
    "asOf": 2025,
    "unit": "podcasts",
    "answerValue": 4000000,
    "decompositionHint": "Millions of feeds exist but only a small fraction are still actively producing episodes.",
    "strategy": "decompose",
    "source": "Podcast directory listings"
  },
  {
    "id": "photos-on-social-media-per-day",
    "prompt": "How many photographs are uploaded to social media each day?",
    "asOf": 2025,
    "unit": "photographs",
    "answerValue": 4000000000,
    "decompositionHint": "Follows from roughly 5 billion social media users posting on the order of one image a day on average.",
    "strategy": "rate-time",
    "source": "Social platform published upload figures"
  },
  {
    "id": "text-characters-typed-per-day-worldwide",
    "prompt": "How many text messages are sent worldwide each day across all platforms?",
    "asOf": 2025,
    "unit": "messages",
    "answerValue": 200000000000,
    "decompositionHint": "Messaging apps alone carry over a hundred billion, before SMS and in-platform direct messages are counted.",
    "strategy": "decompose",
    "source": "Aggregated messaging platform statistics"
  },
  {
    "id": "newspapers-printed-per-day",
    "prompt": "How many newspaper copies are printed worldwide each day?",
    "asOf": 2025,
    "unit": "copies",
    "answerValue": 200000000,
    "decompositionHint": "Down sharply from the peak but still substantial, sustained largely by markets like India and Japan where print remains strong.",
    "strategy": "decompose",
    "source": "World Association of News Publishers circulation data"
  },
  {
    "id": "dogs-in-the-world",
    "prompt": "How many domestic dogs are there in the world?",
    "asOf": 2025,
    "unit": "dogs",
    "answerValue": 900000000,
    "decompositionHint": "Counting strays and village dogs, which outnumber pets in much of the world.",
    "strategy": "population-rate",
    "source": "Global canine population estimates"
  },
  {
    "id": "cats-in-the-world",
    "prompt": "How many domestic cats are there in the world?",
    "asOf": 2025,
    "unit": "cats",
    "answerValue": 600000000,
    "decompositionHint": "Roughly comparable to dogs, again dominated by free roaming animals rather than housecats.",
    "strategy": "population-rate",
    "source": "Global feline population estimates"
  },
  {
    "id": "elephants-remaining",
    "prompt": "How many African elephants remain in the wild?",
    "asOf": 2025,
    "unit": "elephants",
    "answerValue": 415000,
    "decompositionHint": "Down from several million a century ago. A single population estimate for a species this large is easier to pin down than most.",
    "strategy": "population-rate",
    "source": "IUCN African elephant status reports"
  },
  {
    "id": "penguins-in-antarctica",
    "prompt": "How many penguins live in Antarctica and its surrounding waters?",
    "unit": "penguins",
    "answerValue": 20000000,
    "decompositionHint": "Dominated by a few enormously abundant species like Adelie and chinstrap, counted from satellite imagery of guano stains.",
    "strategy": "population-rate",
    "source": "Antarctic seabird population surveys"
  },
  {
    "id": "eggs-a-queen-bee-lays-per-day",
    "prompt": "How many eggs does a queen bee lay in a day at peak season?",
    "unit": "eggs",
    "answerValue": 1500,
    "decompositionHint": "More than her own body weight daily, which is why the colony must feed her constantly.",
    "strategy": "rate-time",
    "source": "Apiculture references"
  },
  {
    "id": "wingbeats-of-a-hummingbird-per-second",
    "prompt": "How many times does a hummingbird beat its wings per second in hovering flight?",
    "unit": "wingbeats",
    "answerValue": 55,
    "decompositionHint": "Fast enough to produce an audible hum, which is where the name comes from.",
    "strategy": "rate-time",
    "source": "High speed photography of hummingbird flight"
  },
  {
    "id": "lifespan-of-a-mayfly",
    "prompt": "How many hours does an adult mayfly live?",
    "unit": "hours",
    "answerValue": 24,
    "decompositionHint": "The winged adult exists only to reproduce and often has no functioning mouthparts. The nymph stage underwater lasts a year or more.",
    "strategy": "rate-time",
    "source": "Entomology references for Ephemeroptera"
  },
  {
    "id": "distance-a-monarch-butterfly-migrates",
    "prompt": "How many kilometres does a monarch butterfly migrate?",
    "unit": "kilometres",
    "answerValue": 4000,
    "decompositionHint": "From Canada to central Mexico, a journey no single butterfly completes in both directions - it takes several generations.",
    "strategy": "anchor-scale",
    "source": "Monarch migration tracking studies"
  },
  {
    "id": "seconds-in-a-year",
    "prompt": "How many seconds are there in a year?",
    "unit": "seconds",
    "answerValue": 31500000,
    "decompositionHint": "A useful constant to memorise: pi times ten million is accurate to under half a percent.",
    "strategy": "rate-time",
    "source": "Direct unit conversion"
  },
  {
    "id": "heartbeats-in-a-day",
    "prompt": "How many times does a human heart beat in a day?",
    "unit": "beats",
    "answerValue": 100000,
    "decompositionHint": "About 70 beats a minute across 1,440 minutes.",
    "strategy": "rate-time",
    "source": "Standard resting heart rate figures"
  },
  {
    "id": "walking-speed-in-a-lifetime",
    "prompt": "How many kilometres does an average person walk in a lifetime?",
    "unit": "kilometres",
    "answerValue": 150000,
    "decompositionHint": "Roughly 7,000 steps a day at 0.75 metres, across some 75 years - enough to circle the equator three times.",
    "strategy": "rate-time",
    "source": "Derived from typical daily step counts"
  },
  {
    "id": "hours-slept-in-a-lifetime",
    "prompt": "How many hours does a person sleep in an 80 year lifetime?",
    "unit": "hours",
    "answerValue": 230000,
    "decompositionHint": "About 8 hours a night across roughly 29,000 nights, which works out to a full third of life.",
    "strategy": "chain-multiply",
    "source": "Derived from typical sleep duration"
  },
  {
    "id": "meals-eaten-in-a-lifetime",
    "prompt": "How many meals does a person eat in a lifetime?",
    "unit": "meals",
    "answerValue": 80000,
    "decompositionHint": "Three a day across about 29,000 days.",
    "strategy": "rate-time",
    "source": "Derived from typical meal frequency"
  },
  {
    "id": "days-in-a-human-lifetime",
    "prompt": "How many days does an average person live?",
    "unit": "days",
    "answerValue": 29000,
    "decompositionHint": "About 80 years at 365 days. A strikingly small number when written out, which is rather the point.",
    "strategy": "decompose",
    "source": "Direct unit conversion"
  },
  {
    "id": "photons-from-a-candle-per-second",
    "prompt": "How many photons does a candle emit each second in visible light?",
    "unit": "photons",
    "answerValue": 10000000000000000000,
    "decompositionHint": "A candle radiates a few watts, but only about 0.1 watt as visible light. A visible photon carries roughly 4x10^-19 joules.",
    "strategy": "energy-balance",
    "source": "Derived from candle luminous output and photon energy"
  },
  {
    "id": "photons-entering-the-eye-in-starlight",
    "prompt": "How many photons per second enter your eye from a faint naked eye star?",
    "unit": "photons",
    "answerValue": 1000,
    "decompositionHint": "The dark adapted eye can detect a handful of photons. A sixth magnitude star is right at that threshold across a pupil about 7 mm wide.",
    "strategy": "rate-time",
    "source": "Visual astronomy photon flux estimates"
  },
  {
    "id": "time-for-sound-to-travel-a-kilometre",
    "prompt": "How many seconds does sound take to travel one kilometre through air?",
    "unit": "seconds",
    "answerValue": 3,
    "decompositionHint": "Sound moves at about 340 metres a second, which is why counting seconds between lightning and thunder gives distance in kilometres divided by three.",
    "strategy": "divide-total",
    "source": "Speed of sound at sea level"
  },
  {
    "id": "wavelength-of-visible-light",
    "prompt": "How many nanometres is the wavelength of green light?",
    "unit": "nanometres",
    "answerValue": 530,
    "decompositionHint": "Visible light spans roughly 400 nm at the violet end to 700 nm at the red end, and human vision peaks in the middle.",
    "strategy": "decompose",
    "source": "Standard optical physics figures"
  },
  {
    "id": "decibels-of-a-jet-engine",
    "prompt": "How many decibels does a jet engine produce at 30 metres?",
    "unit": "decibels",
    "answerValue": 140,
    "decompositionHint": "Decibels are logarithmic: every 10 adds a factor of ten in intensity, so 140 dB is 10^14 times the quietest audible sound.",
    "strategy": "chain-multiply",
    "source": "Occupational noise exposure references"
  },
  {
    "id": "sound-intensity-ratio-whisper-to-jet",
    "prompt": "How many times more intense is a jet engine than a whisper?",
    "unit": "times",
    "answerValue": 1000000000000,
    "decompositionHint": "A whisper is about 20 dB and a jet about 140 dB. Each 10 dB is a tenfold increase, so the gap of 120 dB is ten to the twelfth.",
    "strategy": "chain-multiply",
    "source": "Derived from the decibel scale"
  },
  {
    "id": "frames-per-second-for-smooth-motion",
    "prompt": "How many frames per second does film use to create the illusion of motion?",
    "unit": "frames per second",
    "answerValue": 24,
    "decompositionHint": "Low enough that the flicker had to be masked by showing each frame twice in projection.",
    "strategy": "rate-time",
    "source": "Standard cinema frame rate"
  },
  {
    "id": "energy-from-fissioning-a-uranium-atom",
    "prompt": "How many joules are released by splitting a single uranium atom?",
    "unit": "joules",
    "answerValue": 3.2e-11,
    "decompositionHint": "About 200 million electron volts, and one electron volt is 1.6x10^-19 joules.",
    "strategy": "energy-balance",
    "source": "Standard nuclear fission energy release"
  },
  {
    "id": "uranium-to-power-a-house-for-a-year",
    "prompt": "How many grams of uranium fuel would power one household for a year?",
    "unit": "grams",
    "answerValue": 0.5,
    "decompositionHint": "A household uses roughly 4,000 kWh, and fissioning a gram of uranium-235 releases around 24,000 kWh of heat before conversion losses.",
    "strategy": "energy-balance",
    "source": "Derived from fission energy density"
  },
  {
    "id": "background-radiation-per-year",
    "prompt": "How many millisieverts of background radiation does a person absorb in a year?",
    "unit": "millisieverts",
    "answerValue": 3,
    "decompositionHint": "Mostly radon indoors, plus cosmic rays and potassium-40 in your own body. A chest X-ray is about 0.1 mSv.",
    "strategy": "rate-time",
    "source": "UNSCEAR background radiation estimates"
  },
  {
    "id": "half-life-of-carbon-14",
    "prompt": "How many years is the half life of carbon-14?",
    "unit": "years",
    "answerValue": 5730,
    "decompositionHint": "Short enough that after about ten half lives, roughly 60,000 years, too little remains to date reliably.",
    "strategy": "decompose",
    "source": "Standard radiometric dating constant"
  },
  {
    "id": "nuclear-warheads-in-the-world",
    "prompt": "How many nuclear warheads exist worldwide?",
    "asOf": 2025,
    "unit": "warheads",
    "answerValue": 12000,
    "decompositionHint": "Down from a peak above 60,000 in the 1980s, with two countries holding roughly 90% of the total.",
    "strategy": "anchor-scale",
    "source": "Federation of American Scientists nuclear notebook"
  },
  {
    "id": "colours-the-eye-can-distinguish",
    "prompt": "How many distinct colours can the human eye distinguish?",
    "unit": "colours",
    "answerValue": 10000000,
    "decompositionHint": "Three cone types, each resolving perhaps a couple of hundred levels, multiplied together.",
    "strategy": "decompose",
    "source": "Colour vision research estimates"
  },
  {
    "id": "smells-humans-can-distinguish",
    "prompt": "How many distinct smells can a human nose distinguish?",
    "unit": "smells",
    "answerValue": 1000000000000,
    "decompositionHint": "About 400 olfactory receptor types combining combinatorially, which is why the number vastly exceeds the old textbook figure of 10,000.",
    "strategy": "decompose",
    "source": "Bushdid et al. 2014, Science"
  },
  {
    "id": "rods-and-cones-in-the-eye",
    "prompt": "How many photoreceptor cells are in one human retina?",
    "unit": "photoreceptors",
    "answerValue": 120000000,
    "decompositionHint": "Around 120 million rods for dim light and 6 million cones for colour, all feeding into only about a million optic nerve fibres.",
    "strategy": "decompose",
    "source": "Standard ophthalmology references"
  },
  {
    "id": "reaction-time-milliseconds",
    "prompt": "How many milliseconds does a human take to react to a visual signal?",
    "unit": "milliseconds",
    "answerValue": 250,
    "decompositionHint": "Signal transduction, nerve conduction and muscle activation each cost tens of milliseconds. Sound is faster than sight by about 40 ms.",
    "strategy": "decompose",
    "source": "Reaction time psychology research"
  },
  {
    "id": "information-through-the-optic-nerve",
    "prompt": "How many bits per second does the optic nerve carry to the brain?",
    "unit": "bits per second",
    "answerValue": 10000000,
    "decompositionHint": "Roughly a million fibres each firing a few times a second with several bits per spike - comparable to an ethernet connection.",
    "strategy": "rate-time",
    "source": "Koch et al. 2006, Current Biology"
  },
  {
    "id": "taste-buds-replaced-per-week",
    "prompt": "How many days does a taste bud cell live before being replaced?",
    "unit": "days",
    "answerValue": 10,
    "decompositionHint": "Constant turnover is why a burnt tongue recovers within a couple of weeks.",
    "strategy": "stock-flow",
    "source": "Oral physiology references"
  },
  {
    "id": "molecules-in-a-mole",
    "prompt": "How many particles are in one mole of a substance?",
    "unit": "particles",
    "answerValue": 6.022e+23,
    "decompositionHint": "Avogadro's number, defined so that a mole of carbon-12 weighs exactly 12 grams.",
    "strategy": "molar",
    "source": "Avogadro constant"
  },
  {
    "id": "atoms-in-a-gram-of-hydrogen",
    "prompt": "How many atoms are in one gram of hydrogen?",
    "unit": "atoms",
    "answerValue": 6e+23,
    "decompositionHint": "Hydrogen's molar mass is about 1 gram, so a gram is one mole of atoms.",
    "strategy": "molar",
    "source": "Derived from molar mass and Avogadro's number"
  },
  {
    "id": "elements-found-in-nature",
    "prompt": "How many chemical elements occur naturally on Earth?",
    "unit": "elements",
    "answerValue": 94,
    "decompositionHint": "Everything up to plutonium occurs naturally at least in traces; beyond that they must be synthesised.",
    "strategy": "decompose",
    "source": "Standard periodic table classification"
  },
  {
    "id": "ph-difference-in-hydrogen-ions",
    "prompt": "How many times more acidic is lemon juice at pH 2 than water at pH 7?",
    "unit": "times",
    "answerValue": 100000,
    "decompositionHint": "pH is logarithmic - each unit is a factor of ten in hydrogen ion concentration, and the gap here is five units.",
    "strategy": "chain-multiply",
    "source": "Definition of the pH scale"
  },
  {
    "id": "water-molecules-in-the-oceans",
    "prompt": "How many water molecules are in all the world's oceans?",
    "unit": "molecules",
    "answerValue": 4.6e+46,
    "decompositionHint": "The oceans hold about 1.4x10^21 kg of water. Convert to moles using 18 grams per mole, then multiply by Avogadro's number.",
    "strategy": "molar",
    "source": "Derived from ocean mass and molar mass of water"
  },
  {
    "id": "oxygen-atoms-breathed-per-day",
    "prompt": "How many oxygen molecules does a person breathe in and absorb in a day?",
    "unit": "molecules",
    "answerValue": 1.5e+25,
    "decompositionHint": "About 550 litres of oxygen consumed a day. Convert to moles via 22.4 litres per mole, then multiply by Avogadro's number.",
    "strategy": "molar",
    "source": "Derived from resting oxygen consumption"
  },
  {
    "id": "grains-of-sugar-in-a-teaspoon",
    "prompt": "How many sugar crystals are in a teaspoon of granulated sugar?",
    "unit": "crystals",
    "answerValue": 100000,
    "decompositionHint": "A teaspoon holds about 4 grams, and a crystal is roughly half a millimetre across weighing well under a milligram.",
    "strategy": "decompose",
    "source": "Derived from crystal size and teaspoon volume"
  },
  {
    "id": "bubbles-in-a-glass-of-champagne",
    "prompt": "How many bubbles are released from a glass of champagne?",
    "unit": "bubbles",
    "answerValue": 1000000,
    "decompositionHint": "Dissolved carbon dioxide comes out of solution at nucleation sites on the glass until the wine goes flat.",
    "strategy": "decompose",
    "source": "Liger-Belair champagne physics research"
  },
  {
    "id": "coffee-drunk-in-a-lifetime",
    "prompt": "How many litres of coffee does a regular drinker consume in a lifetime?",
    "unit": "litres",
    "answerValue": 15000,
    "decompositionHint": "Two cups a day at about 250 ml, across roughly 55 adult years.",
    "strategy": "rate-time",
    "source": "Derived from typical consumption rates"
  },
  {
    "id": "eggs-eaten-in-a-lifetime",
    "prompt": "How many eggs does a person eat in a lifetime?",
    "unit": "eggs",
    "answerValue": 15000,
    "decompositionHint": "Around 200 a year in many countries, across about 75 years.",
    "strategy": "rate-time",
    "source": "National egg consumption statistics"
  },
  {
    "id": "bread-eaten-in-a-lifetime",
    "prompt": "How many loaves of bread does a person eat in a lifetime?",
    "unit": "loaves",
    "answerValue": 3000,
    "decompositionHint": "Roughly 40 to 50 loaves a year in a bread eating country, across some 70 years.",
    "strategy": "rate-time",
    "source": "National bread consumption statistics"
  },
  {
    "id": "calories-in-a-lifetime",
    "prompt": "How many kilocalories does a person eat in a lifetime?",
    "unit": "kilocalories",
    "answerValue": 60000000,
    "decompositionHint": "About 2,200 a day across roughly 29,000 days.",
    "strategy": "energy-balance",
    "source": "Derived from daily energy intake"
  },
  {
    "id": "pizzas-eaten-in-italy-per-year",
    "prompt": "How many pizzas are eaten in Italy each year?",
    "asOf": 2025,
    "unit": "pizzas",
    "answerValue": 2500000000,
    "decompositionHint": "About 59 million people eating on the order of forty a year each, counting both restaurant and frozen.",
    "strategy": "rate-time",
    "source": "Italian food industry consumption estimates"
  },
  {
    "id": "ping-pong-balls-in-a-double-decker-bus",
    "prompt": "How many ping pong balls would fill a double decker bus?",
    "unit": "ping pong balls",
    "answerValue": 10000000,
    "decompositionHint": "The bus interior is roughly 100 cubic metres. A ball is 40 mm across, so about 6.4x10^-5 cubic metres before allowing for 26% empty space in packing.",
    "strategy": "volume-packing",
    "source": "Classic interview Fermi problem"
  },
  {
    "id": "tennis-balls-in-a-car",
    "prompt": "How many tennis balls fit inside a saloon car?",
    "unit": "tennis balls",
    "answerValue": 40000,
    "decompositionHint": "Perhaps 3 cubic metres of usable interior, and a tennis ball occupies about 1.5x10^-4 cubic metres allowing for packing gaps.",
    "strategy": "volume-packing",
    "source": "Classic interview Fermi problem"
  },
  {
    "id": "pennies-to-fill-a-room",
    "prompt": "How many one penny coins would fill an average bedroom?",
    "unit": "coins",
    "answerValue": 40000000,
    "decompositionHint": "A room of maybe 35 cubic metres, and a penny occupies roughly a cubic centimetre once stacking gaps are allowed for.",
    "strategy": "volume-packing",
    "source": "Derived from coin dimensions and room volume"
  },
  {
    "id": "hairs-cut-in-a-barbershop-per-year",
    "prompt": "How many individual hairs does a busy barber cut in a year?",
    "unit": "hairs",
    "answerValue": 500000000,
    "decompositionHint": "Perhaps 3,000 haircuts a year, each removing a fraction of the roughly 100,000 hairs on a head - but every hair on the head gets cut each time.",
    "strategy": "rate-time",
    "source": "Derived from haircut volume and hair count"
  },
  {
    "id": "breaths-taken-in-a-cinema-screening",
    "prompt": "How many breaths do the people in a full cinema take during one film?",
    "unit": "breaths",
    "answerValue": 300000,
    "decompositionHint": "Around 200 people breathing roughly 14 times a minute for two hours.",
    "strategy": "rate-time",
    "source": "Derived from audience size and respiratory rate"
  },
  {
    "id": "words-heard-in-a-lifetime",
    "prompt": "How many words does a person hear in a lifetime?",
    "unit": "words",
    "answerValue": 3000000000,
    "decompositionHint": "Speech runs at roughly 150 words a minute, and people are exposed to conversation, media and background talk for several hours a day.",
    "strategy": "rate-time",
    "source": "Derived from speech rate and daily exposure"
  },
  {
    "id": "keystrokes-in-writing-a-novel",
    "prompt": "How many keystrokes does it take to type a novel?",
    "unit": "keystrokes",
    "answerValue": 550000,
    "decompositionHint": "About 90,000 words at roughly five letters plus a space each, before counting the deleting and rewriting.",
    "strategy": "decompose",
    "source": "Derived from novel length and word length"
  },
  {
    "id": "grains-of-salt-in-a-shaker",
    "prompt": "How many grains of salt are in a full table salt shaker?",
    "unit": "grains",
    "answerValue": 300000,
    "decompositionHint": "Perhaps 100 grams of salt, and a single grain weighs around 0.3 milligrams.",
    "strategy": "divide-total",
    "source": "Derived from grain mass and shaker capacity"
  },
  {
    "id": "sheets-of-paper-in-a-filing-cabinet",
    "prompt": "How many sheets of paper fit in a four drawer filing cabinet?",
    "unit": "sheets",
    "answerValue": 20000,
    "decompositionHint": "Each drawer holds roughly 60 cm of packed paper, and 500 sheets make a stack about 5 cm thick.",
    "strategy": "volume-packing",
    "source": "Derived from paper thickness and drawer dimensions"
  },
  {
    "id": "cups-of-water-in-a-bathtub",
    "prompt": "How many cups of water does it take to fill a bathtub?",
    "unit": "cups",
    "answerValue": 600,
    "decompositionHint": "A bath holds around 150 litres and a cup is roughly 250 millilitres.",
    "strategy": "decompose",
    "source": "Direct unit conversion"
  },
  {
    "id": "banknotes-printed-per-year-us",
    "prompt": "How many banknotes does the United States print each year?",
    "asOf": 2025,
    "unit": "banknotes",
    "answerValue": 7000000000,
    "decompositionHint": "Most replace worn notes rather than expanding the supply. A one dollar bill lasts under seven years in circulation.",
    "strategy": "decompose",
    "source": "US Bureau of Engraving and Printing production figures"
  },
  {
    "id": "coins-in-circulation-us",
    "prompt": "How many coins are in circulation in the United States?",
    "asOf": 2025,
    "unit": "coins",
    "answerValue": 150000000000,
    "decompositionHint": "Hundreds of coins per person, most sitting unused in jars and drawers rather than actually circulating.",
    "strategy": "population-rate",
    "source": "US Mint circulating coinage estimates"
  },
  {
    "id": "credit-card-transactions-per-day",
    "prompt": "How many card payments are made worldwide each day?",
    "asOf": 2025,
    "unit": "transactions",
    "answerValue": 1500000000,
    "decompositionHint": "Several billion cards in circulation, each used on the order of once every day or two.",
    "strategy": "decompose",
    "source": "Payment network transaction volumes"
  },
  {
    "id": "atm-withdrawals-per-year",
    "prompt": "How many cash withdrawals are made from ATMs worldwide each year?",
    "asOf": 2025,
    "unit": "withdrawals",
    "answerValue": 80000000000,
    "decompositionHint": "About 3 million machines each dispensing on the order of seventy times a day.",
    "strategy": "rate-time",
    "source": "ATM industry transaction statistics"
  },
  {
    "id": "value-of-all-bitcoin",
    "prompt": "How many bitcoin will ever exist?",
    "unit": "bitcoin",
    "answerValue": 21000000,
    "decompositionHint": "The supply cap is fixed in the protocol, approached asymptotically as block rewards halve every four years.",
    "strategy": "decompose",
    "source": "Bitcoin protocol supply schedule"
  },
  {
    "id": "cost-of-a-loaf-of-bread-1970",
    "prompt": "What did a loaf of bread cost in the United States, in cents?",
    "asOf": 1970,
    "unit": "cents",
    "answerValue": 25,
    "decompositionHint": "Prices have risen roughly eightfold since, tracking general inflation rather than anything specific to bread.",
    "strategy": "decompose",
    "source": "US Bureau of Labor Statistics historical price data"
  },
  {
    "id": "median-house-price-us",
    "prompt": "What is the median price of a home sold in the United States, in dollars?",
    "asOf": 2025,
    "unit": "US dollars",
    "answerValue": 420000,
    "decompositionHint": "Roughly five times median household income, up from about three times in the 1980s.",
    "strategy": "chain-multiply",
    "source": "US existing home sales price data"
  },
  {
    "id": "global-advertising-spend",
    "prompt": "How many US dollars are spent on advertising worldwide each year?",
    "asOf": 2025,
    "unit": "US dollars",
    "answerValue": 1000000000000,
    "decompositionHint": "Roughly 1% of world GDP, and now more than two thirds digital.",
    "strategy": "decompose",
    "source": "Global advertising expenditure forecasts"
  },
  {
    "id": "insurance-premiums-worldwide",
    "prompt": "How many US dollars in insurance premiums are paid worldwide each year?",
    "asOf": 2025,
    "unit": "US dollars",
    "answerValue": 7000000000000,
    "decompositionHint": "Around 7% of world GDP, split roughly evenly between life and non-life cover.",
    "strategy": "decompose",
    "source": "Swiss Re sigma insurance market reports"
  },
  {
    "id": "people-employed-worldwide",
    "prompt": "How many people are in paid employment worldwide?",
    "asOf": 2025,
    "unit": "people",
    "answerValue": 3400000000,
    "decompositionHint": "Out of about 5.5 billion of working age, with participation rates around 60%.",
    "strategy": "decompose",
    "source": "ILO global employment estimates"
  },
  {
    "id": "farmers-worldwide",
    "prompt": "How many people work in agriculture worldwide?",
    "asOf": 2025,
    "unit": "people",
    "answerValue": 850000000,
    "decompositionHint": "About a quarter of the global workforce, down from well over half in 1990 and near universal before industrialisation.",
    "strategy": "decompose",
    "source": "ILO sectoral employment data"
  },
  {
    "id": "software-developers-worldwide",
    "prompt": "How many professional software developers are there worldwide?",
    "asOf": 2025,
    "unit": "developers",
    "answerValue": 28000000,
    "decompositionHint": "Roughly one in every 120 workers, concentrated heavily in a handful of countries.",
    "strategy": "population-rate",
    "source": "Developer population surveys"
  },
  {
    "id": "hours-worked-in-a-lifetime",
    "prompt": "How many hours does a person work in their career?",
    "unit": "hours",
    "answerValue": 80000,
    "decompositionHint": "About 1,800 hours a year across roughly 45 working years.",
    "strategy": "rate-time",
    "source": "Derived from annual working hours"
  },
  {
    "id": "factories-in-china",
    "prompt": "How many manufacturing enterprises operate in China?",
    "asOf": 2025,
    "unit": "enterprises",
    "answerValue": 3000000,
    "decompositionHint": "Counting registered industrial firms above a revenue threshold; including tiny workshops would multiply this several times.",
    "strategy": "chain-multiply",
    "source": "China National Bureau of Statistics industrial surveys"
  },
  {
    "id": "meetings-held-per-day-worldwide",
    "prompt": "How many business meetings take place worldwide each day?",
    "asOf": 2025,
    "unit": "meetings",
    "answerValue": 1000000000,
    "decompositionHint": "Hundreds of millions of office workers averaging a few meetings a day between them.",
    "strategy": "rate-time",
    "source": "Order-of-magnitude estimate from workforce and meeting frequency"
  },
  {
    "id": "instructions-a-cpu-executes-per-second",
    "prompt": "How many instructions does a modern desktop processor execute per second?",
    "asOf": 2025,
    "unit": "instructions",
    "answerValue": 50000000000,
    "decompositionHint": "Several billion cycles a second, several instructions per cycle, across several cores.",
    "strategy": "rate-time",
    "source": "Typical desktop CPU throughput figures"
  },
  {
    "id": "transistors-per-square-millimetre",
    "prompt": "How many transistors fit in one square millimetre on a leading chip process?",
    "asOf": 2025,
    "unit": "transistors",
    "answerValue": 200000000,
    "decompositionHint": "Around 200 million per square millimetre at the leading nodes, up from about a million twenty years ago.",
    "strategy": "volume-packing",
    "source": "Semiconductor process density figures"
  },
  {
    "id": "bytes-in-a-typical-web-page",
    "prompt": "How many bytes does an average web page transfer when it loads?",
    "asOf": 2025,
    "unit": "bytes",
    "answerValue": 2500000,
    "decompositionHint": "Images and scripts dominate. The median page has grown roughly tenfold since 2010.",
    "strategy": "decompose",
    "source": "HTTP Archive page weight reports"
  },
  {
    "id": "packets-per-second-on-the-internet",
    "prompt": "How many data packets cross the internet each second?",
    "asOf": 2025,
    "unit": "packets",
    "answerValue": 10000000000000,
    "decompositionHint": "Global traffic of several hundred terabits a second divided by a typical packet of around 1,000 bytes.",
    "strategy": "divide-total",
    "source": "Derived from global traffic estimates and packet size"
  },
  {
    "id": "lines-of-code-in-a-car",
    "prompt": "How many lines of software code run in a modern car?",
    "asOf": 2025,
    "unit": "lines of code",
    "answerValue": 100000000,
    "decompositionHint": "More than a passenger aircraft, spread across a hundred or more separate control units.",
    "strategy": "decompose",
    "source": "Automotive software complexity estimates"
  },
  {
    "id": "storage-shipped-per-year",
    "prompt": "How many bytes of storage capacity are shipped worldwide each year?",
    "asOf": 2025,
    "unit": "bytes",
    "answerValue": 1.5e+21,
    "decompositionHint": "Well over a zettabyte, dominated by hard drives for data centres rather than consumer devices.",
    "strategy": "decompose",
    "source": "Storage industry shipment reports"
  },
  {
    "id": "bits-in-a-minute-of-music",
    "prompt": "How many bits are in one minute of CD quality audio?",
    "unit": "bits",
    "answerValue": 85000000,
    "decompositionHint": "44,100 samples a second, 16 bits each, two channels, times 60 seconds.",
    "strategy": "unit-conversion",
    "source": "CD audio specification"
  },
  {
    "id": "steps-recommended-per-day",
    "prompt": "How many steps a day are typically recommended for health benefits?",
    "unit": "steps",
    "answerValue": 8000,
    "decompositionHint": "The famous 10,000 figure came from a 1960s Japanese pedometer marketing campaign; research suggests benefits plateau somewhat below it.",
    "strategy": "rate-time",
    "source": "Physical activity epidemiology research"
  },
  {
    "id": "people-with-diabetes-worldwide",
    "prompt": "How many adults live with diabetes worldwide?",
    "asOf": 2025,
    "unit": "adults",
    "answerValue": 590000000,
    "decompositionHint": "Roughly one adult in nine, and the figure has more than tripled since 2000.",
    "strategy": "population-rate",
    "source": "International Diabetes Federation atlas"
  },
  {
    "id": "deaths-worldwide-per-year",
    "prompt": "How many people die worldwide each year?",
    "asOf": 2025,
    "unit": "deaths",
    "answerValue": 62000000,
    "decompositionHint": "About 8 billion people with a crude death rate near 7.7 per thousand. Births exceed this by roughly 70 million, which is the annual population growth.",
    "strategy": "population-rate",
    "source": "UN World Population Prospects"
  },
  {
    "id": "heart-attacks-per-year-worldwide",
    "prompt": "What percentage of all deaths worldwide are caused by cardiovascular disease?",
    "asOf": 2025,
    "unit": "percent",
    "answerValue": 32,
    "decompositionHint": "Roughly 19 million cardiovascular deaths against about 62 million deaths from all causes. It is comfortably the leading cause worldwide, ahead of cancer.",
    "strategy": "decompose",
    "source": "WHO global health estimates"
  },
  {
    "id": "antibiotic-courses-per-year",
    "prompt": "How many courses of antibiotics are taken worldwide each year?",
    "asOf": 2025,
    "unit": "courses",
    "answerValue": 40000000000,
    "decompositionHint": "Measured in defined daily doses this runs to tens of billions, unevenly distributed and heavily overused in some countries.",
    "strategy": "decompose",
    "source": "Global antibiotic consumption surveillance"
  },
  {
    "id": "spectacles-worn-worldwide",
    "prompt": "How many people wear glasses or contact lenses worldwide?",
    "asOf": 2025,
    "unit": "people",
    "answerValue": 4000000000,
    "decompositionHint": "Around half the world needs vision correction, though a substantial share of those who need it go without.",
    "strategy": "decompose",
    "source": "Vision impairment prevalence studies"
  },
  {
    "id": "hours-of-exercise-recommended-per-week",
    "prompt": "How many minutes of moderate exercise a week do health authorities recommend?",
    "unit": "minutes",
    "answerValue": 150,
    "decompositionHint": "Usually framed as thirty minutes on five days, or half that if the activity is vigorous.",
    "strategy": "decompose",
    "source": "WHO physical activity guidelines"
  },
  {
    "id": "million-seconds-in-days",
    "prompt": "How many days is one million seconds?",
    "unit": "days",
    "answerValue": 11.6,
    "decompositionHint": "86,400 seconds in a day. The contrast with a billion seconds is the point of the question.",
    "strategy": "unit-conversion",
    "source": "Direct unit conversion"
  },
  {
    "id": "billion-seconds-in-years",
    "prompt": "How many years is one billion seconds?",
    "unit": "years",
    "answerValue": 31.7,
    "decompositionHint": "About 3.15x10^7 seconds a year. A million seconds is under a fortnight; a billion is most of a career.",
    "strategy": "rate-time",
    "source": "Direct unit conversion"
  },
  {
    "id": "trillion-seconds-in-years",
    "prompt": "How many years is one trillion seconds?",
    "unit": "years",
    "answerValue": 31700,
    "decompositionHint": "A thousand times a billion seconds, taking you back well before the end of the last ice age.",
    "strategy": "chain-multiply",
    "source": "Direct unit conversion"
  },
  {
    "id": "sheets-of-paper-to-the-moon",
    "prompt": "How many times would you fold a sheet of paper to reach the Moon?",
    "unit": "folds",
    "answerValue": 42,
    "decompositionHint": "Each fold doubles the thickness. Starting at 0.1 mm, ask what power of two exceeds 384,400 km.",
    "strategy": "exponential",
    "source": "Classic exponential growth problem"
  },
  {
    "id": "grains-of-rice-on-a-chessboard",
    "prompt": "How many grains of rice end up on a chessboard if you double on each of the 64 squares?",
    "unit": "grains",
    "answerValue": 18000000000000000000,
    "decompositionHint": "Two to the sixty-fourth minus one. More rice than the world has produced in all of history.",
    "strategy": "decompose",
    "source": "The classic wheat and chessboard problem"
  },
  {
    "id": "distance-if-earth-were-a-marble",
    "prompt": "If the Earth were shrunk to the size of a marble, how many metres away would the Moon be?",
    "unit": "metres",
    "answerValue": 0.3,
    "decompositionHint": "The Moon sits about thirty Earth diameters away, so scale that ratio onto a marble roughly a centimetre across.",
    "strategy": "anchor-scale",
    "source": "Derived from the Earth-Moon distance ratio"
  },
  {
    "id": "humans-stacked-to-the-moon",
    "prompt": "How many people lying head to toe would reach the Moon?",
    "unit": "people",
    "answerValue": 220000000,
    "decompositionHint": "384,400 km divided by an average height of about 1.7 metres.",
    "strategy": "divide-total",
    "source": "Direct unit conversion"
  },
  {
    "id": "all-humans-in-a-cube",
    "prompt": "How many kilometres on a side would a cube be that held every living human packed shoulder to shoulder?",
    "unit": "kilometres",
    "answerValue": 1,
    "decompositionHint": "A person occupies roughly 0.1 cubic metres when packed. Eight billion of those is 8x10^8 cubic metres - a cube under a kilometre on each side.",
    "strategy": "population-rate",
    "source": "Derived from human body volume and world population"
  },
  {
    "id": "time-to-count-to-a-billion",
    "prompt": "How many years would it take to count to a billion out loud?",
    "unit": "years",
    "answerValue": 95,
    "decompositionHint": "At roughly one number a second without sleeping - and later numbers take much longer to say than early ones.",
    "strategy": "rate-time",
    "source": "Derived from counting rate and a billion seconds"
  },
  {
    "id": "paper-thickness-doubling-to-sun",
    "prompt": "How many times must you double a sheet of paper's thickness to reach the Sun?",
    "unit": "folds",
    "answerValue": 51,
    "decompositionHint": "150 million kilometres from a 0.1 mm start. Each doubling adds a power of two, and 2^51 times 0.1 mm is about right.",
    "strategy": "exponential",
    "source": "Classic exponential growth problem"
  },
  {
    "id": "atoms-in-a-grain-of-sand",
    "prompt": "How many atoms are in a single grain of sand?",
    "unit": "atoms",
    "answerValue": 60000000000000000000,
    "decompositionHint": "A 0.5 mm grain of quartz weighs about 0.3 milligrams. Divide by the molar mass of silicon dioxide, multiply by Avogadro's number, then by three atoms per unit.",
    "strategy": "molar",
    "source": "Standard chemistry calculation"
  },
  {
    "id": "human-cells-vs-stars-in-galaxy",
    "prompt": "How many times more cells are in your body than there are stars in the Milky Way?",
    "unit": "times",
    "answerValue": 185,
    "decompositionHint": "About 3.7x10^13 cells against roughly 2x10^11 stars.",
    "strategy": "chain-multiply",
    "source": "Derived from human cell count and Milky Way star count"
  },
  {
    "id": "seconds-of-attention-in-a-lifetime",
    "prompt": "How many waking hours does a person have in a lifetime?",
    "unit": "hours",
    "answerValue": 460000,
    "decompositionHint": "About 16 waking hours across roughly 29,000 days.",
    "strategy": "stock-flow",
    "source": "Derived from lifespan and sleep duration"
  },
  {
    "id": "words-read-in-a-lifetime",
    "prompt": "How many words does a keen reader read in a lifetime?",
    "unit": "words",
    "answerValue": 500000000,
    "decompositionHint": "An hour a day at 250 words a minute across 60 years, plus everything read incidentally.",
    "strategy": "rate-time",
    "source": "Derived from reading speed and daily reading time"
  },
  {
    "id": "grains-of-sand-vs-stars",
    "prompt": "How many times more stars are in the observable universe than grains of sand on Earth's beaches?",
    "unit": "times",
    "answerValue": 10,
    "decompositionHint": "Sand is estimated near 7.5x10^18 grains and stars near 10^22 to 10^24, so the ratio is large but the two are closer than the cliche suggests.",
    "strategy": "chain-multiply",
    "source": "Derived from published sand and star estimates"
  },
  {
    "id": "breaths-in-a-cubic-metre-of-air",
    "prompt": "How many breaths could you take from one cubic metre of air before the oxygen ran too low?",
    "unit": "breaths",
    "answerValue": 400,
    "decompositionHint": "A cubic metre is 1,000 litres and a breath is half a litre, but you can only draw down a few percent of the oxygen before it becomes unbreathable.",
    "strategy": "volume-packing",
    "source": "Derived from tidal volume and usable oxygen fraction"
  },
  {
    "id": "trees-per-person-on-earth",
    "prompt": "How many trees are there for each person on Earth?",
    "asOf": 2025,
    "unit": "trees per person",
    "answerValue": 375,
    "decompositionHint": "Roughly three trillion trees against eight billion people. The ratio has fallen by nearly half since the start of human civilisation.",
    "strategy": "population-rate",
    "source": "Crowther et al. 2015 tree count divided by world population"
  },
  {
    "id": "ants-per-person-on-earth",
    "prompt": "How many ants are there for each person on Earth?",
    "unit": "ants per person",
    "answerValue": 2500000,
    "decompositionHint": "About 2x10^16 ants against 8x10^9 people. Their combined mass rivals that of all wild birds and mammals together.",
    "strategy": "population-rate",
    "source": "Schultheiss et al. 2022 ant estimate divided by world population"
  },
  {
    "id": "weight-of-all-ants-vs-humans",
    "prompt": "What fraction of the combined weight of all humans do all the world's ants weigh?",
    "unit": "fraction",
    "answerValue": 0.024,
    "decompositionHint": "Around 12 million tonnes of ants against roughly 500 million tonnes of people. The old claim that ants outweigh us turns out to be wrong by a wide margin.",
    "strategy": "decompose",
    "source": "Derived from published ant and human biomass estimates"
  },
  {
    "id": "raindrops-to-fill-a-bathtub",
    "prompt": "How many raindrops would it take to fill a bathtub?",
    "unit": "raindrops",
    "answerValue": 4500000,
    "decompositionHint": "A bath holds about 150 litres and a typical raindrop is roughly 0.03 millilitres.",
    "strategy": "decompose",
    "source": "Derived from bath volume and raindrop size"
  },
  {
    "id": "time-to-walk-around-the-world",
    "prompt": "How many days of continuous walking would it take to circle the equator?",
    "unit": "days",
    "answerValue": 333,
    "decompositionHint": "40,075 km at 5 km/h without stopping. Walking eight hours a day would take three times as long.",
    "strategy": "rate-time",
    "source": "Derived from equatorial circumference and walking speed"
  },
  {
    "id": "cost-to-feed-a-person-for-a-year",
    "prompt": "How many US dollars does it cost to feed one person for a year at subsistence level?",
    "asOf": 2025,
    "unit": "US dollars",
    "answerValue": 400,
    "decompositionHint": "Around a dollar a day for basic staples in a low income country, several times that for a nutritionally adequate diet.",
    "strategy": "rate-time",
    "source": "World Food Programme cost of diet analyses"
  },
  {
    "id": "water-a-person-drinks-in-a-lifetime",
    "prompt": "How many litres of water does a person drink in a lifetime?",
    "unit": "litres",
    "answerValue": 60000,
    "decompositionHint": "Roughly two litres a day across some 29,000 days.",
    "strategy": "rate-time",
    "source": "Derived from daily fluid intake"
  },
  {
    "id": "air-breathed-in-a-lifetime",
    "prompt": "How many cubic metres of air does a person breathe in a lifetime?",
    "unit": "cubic metres",
    "answerValue": 300000,
    "decompositionHint": "About 11 cubic metres a day at rest, across roughly 29,000 days.",
    "strategy": "volume-packing",
    "source": "Derived from tidal volume and respiratory rate"
  },
  {
    "id": "cells-in-a-blue-whale",
    "prompt": "How many cells make up a blue whale?",
    "unit": "cells",
    "answerValue": 100000000000000000,
    "decompositionHint": "A human of 70 kg has about 3.7x10^13 cells. A whale is roughly 2,000 times heavier and made of broadly similar tissue.",
    "strategy": "chain-multiply",
    "source": "Scaled from human cell count by body mass"
  },
  {
    "id": "bacteria-on-earth",
    "prompt": "How many bacterial cells are there on Earth?",
    "unit": "bacteria",
    "answerValue": 1e+30,
    "decompositionHint": "Most live in soil and in the deep subsurface rather than anywhere visible. They outweigh all animals combined.",
    "strategy": "decompose",
    "source": "Whitman et al. 1998, PNAS - prokaryote abundance estimates"
  },
  {
    "id": "grains-of-sand-on-earth",
    "prompt": "How many grains of sand are on all the beaches and deserts of Earth?",
    "unit": "grains of sand",
    "answerValue": 7500000000000000000,
    "decompositionHint": "Estimate the world's beach and desert area, a depth of a few metres, and roughly 5x10^9 grains per cubic metre.",
    "strategy": "area-density",
    "source": "Commonly cited estimate of around 7.5x10^18 grains"
  },
  {
    "id": "alveoli-in-the-lungs",
    "prompt": "How many alveoli are there in a pair of human lungs?",
    "unit": "alveoli",
    "answerValue": 480000000,
    "decompositionHint": "Lung gas-exchange surface is roughly 70 square metres packed into a few litres, so the sacs must be small and numerous.",
    "strategy": "divide-total",
    "source": "Ochs et al. 2004, American Journal of Respiratory and Critical Care Medicine"
  },
  {
    "id": "skin-cells-shed-per-day",
    "prompt": "How many skin cells does a person shed each day?",
    "unit": "skin cells",
    "answerValue": 400000000,
    "decompositionHint": "The outer layer replaces itself about every four weeks, so a day sheds roughly a twenty-eighth of it.",
    "strategy": "stock-flow",
    "source": "Derived from epidermal turnover rates"
  },
  {
    "id": "bones-in-a-newborn",
    "prompt": "How many bones does a newborn baby have?",
    "unit": "bones",
    "answerValue": 300,
    "decompositionHint": "Rather more than an adult, because many separate bones fuse during childhood down to 206.",
    "strategy": "anchor-scale",
    "source": "Standard anatomy references"
  },
  {
    "id": "hair-grown-by-one-follicle",
    "prompt": "How many metres of hair does a single scalp follicle grow in a lifetime?",
    "unit": "metres",
    "answerValue": 9,
    "decompositionHint": "Hair grows about 1.25 centimetres a month, and a follicle keeps cycling across an 80 year life.",
    "strategy": "rate-time",
    "source": "Derived from average hair growth rate"
  },
  {
    "id": "nail-growth-in-a-lifetime",
    "prompt": "How many centimetres does a fingernail grow over a lifetime?",
    "unit": "centimetres",
    "answerValue": 950,
    "decompositionHint": "About 3.5 millimetres a month for some 80 years.",
    "strategy": "rate-time",
    "source": "Derived from average nail growth rate"
  },
  {
    "id": "droplets-in-a-sneeze",
    "prompt": "How many droplets are released in a single sneeze?",
    "unit": "droplets",
    "answerValue": 40000,
    "decompositionHint": "A sneeze expels a few millilitres of fluid broken into droplets averaging about a tenth of a millimetre.",
    "strategy": "divide-total",
    "source": "Aerosol studies of respiratory events"
  },
  {
    "id": "bacteria-on-a-hand",
    "prompt": "How many bacteria live on a single human hand?",
    "unit": "bacteria",
    "answerValue": 1500000,
    "decompositionHint": "A hand is roughly 400 square centimetres, carrying thousands of bacteria per square centimetre.",
    "strategy": "area-density",
    "source": "Fierer et al. 2008 skin microbiome surveys"
  },
  {
    "id": "tears-produced-per-year",
    "prompt": "How many millilitres of tears does a person produce in a year?",
    "unit": "millilitres",
    "answerValue": 300,
    "decompositionHint": "Basal tear production runs under a millilitre a day, quite apart from crying.",
    "strategy": "rate-time",
    "source": "Ophthalmology references on basal tear secretion"
  },
  {
    "id": "mass-of-gut-bacteria",
    "prompt": "How many grams do the bacteria in a human gut weigh?",
    "unit": "grams",
    "answerValue": 200,
    "decompositionHint": "Around 4x10^13 bacterial cells, each with a mass of roughly a picogram.",
    "strategy": "chain-multiply",
    "source": "Sender, Fuchs and Milo 2016, PLOS Biology"
  },
  {
    "id": "kidney-filtration-per-day",
    "prompt": "How many litres of blood do the kidneys filter each day?",
    "unit": "litres",
    "answerValue": 180,
    "decompositionHint": "About 125 millilitres a minute of filtrate, around the clock. Almost all of it is reabsorbed.",
    "strategy": "rate-time",
    "source": "Standard renal physiology figures"
  },
  {
    "id": "taste-cells-replaced-per-day",
    "prompt": "How many taste receptor cells does a person replace each day?",
    "unit": "cells",
    "answerValue": 5000,
    "decompositionHint": "Roughly 50,000 taste cells with a lifespan of about ten days.",
    "strategy": "stock-flow",
    "source": "Derived from taste-bud cell turnover"
  },
  {
    "id": "energy-stored-in-body-fat",
    "prompt": "How many kilocalories are stored in the body fat of an average adult?",
    "unit": "kilocalories",
    "answerValue": 120000,
    "decompositionHint": "Roughly 15 kilograms of fat at about 7,700 kilocalories per kilogram.",
    "strategy": "energy-balance",
    "source": "Derived from body composition and fat energy density"
  },
  {
    "id": "seconds-for-blood-to-circulate",
    "prompt": "How many seconds does it take blood to complete one full circuit of the body at rest?",
    "unit": "seconds",
    "answerValue": 60,
    "decompositionHint": "About five litres of blood, and a cardiac output of roughly five litres a minute.",
    "strategy": "divide-total",
    "source": "Derived from blood volume and cardiac output"
  },
  {
    "id": "fastest-nerve-signal-speed",
    "prompt": "How many metres per second does the fastest human nerve signal travel?",
    "unit": "metres per second",
    "answerValue": 120,
    "decompositionHint": "Fast enough to cross a body in hundredths of a second, but far slower than electricity in a wire.",
    "strategy": "recall-sanity",
    "source": "Neurophysiology measurements of myelinated fibres"
  },
  {
    "id": "bites-of-food-per-year",
    "prompt": "How many bites of food does a person take in a year?",
    "unit": "bites",
    "answerValue": 30000,
    "decompositionHint": "Perhaps 80 bites a day across three meals and some snacks.",
    "strategy": "rate-time",
    "source": "Derived from typical bite counts per meal"
  },
  {
    "id": "atoms-in-a-chromosome",
    "prompt": "How many atoms are in a single human chromosome?",
    "unit": "atoms",
    "answerValue": 4000000000,
    "decompositionHint": "A chromosome holds on the order of 10^8 base pairs, and each base pair is a few dozen atoms.",
    "strategy": "chain-multiply",
    "source": "Derived from base-pair counts and nucleotide composition"
  },
  {
    "id": "sperm-produced-per-day",
    "prompt": "How many sperm cells does a human male produce each day?",
    "unit": "sperm",
    "answerValue": 100000000,
    "decompositionHint": "Production runs continuously from puberty, at roughly a thousand every second.",
    "strategy": "rate-time",
    "source": "Reproductive physiology references"
  },
  {
    "id": "olfactory-receptors-in-the-nose",
    "prompt": "How many olfactory receptor neurons are in a human nose?",
    "unit": "neurons",
    "answerValue": 12000000,
    "decompositionHint": "The olfactory epithelium covers only a few square centimetres but packs receptors densely.",
    "strategy": "area-density",
    "source": "Olfactory neuroscience references"
  },
  {
    "id": "bone-marrow-red-cells-per-second",
    "prompt": "How many red blood cells does bone marrow make every second?",
    "unit": "cells",
    "answerValue": 2400000,
    "decompositionHint": "About 2.5x10^13 red cells living roughly 120 days each must be replaced continuously.",
    "strategy": "stock-flow",
    "source": "Derived from red cell count and lifespan"
  },
  {
    "id": "eyelashes-on-a-person",
    "prompt": "How many eyelashes does a person have in total?",
    "unit": "eyelashes",
    "answerValue": 500,
    "decompositionHint": "Roughly 150 on each upper lid and 75 on each lower one.",
    "strategy": "chain-multiply",
    "source": "Ophthalmology references on lash counts"
  },
  {
    "id": "collagen-share-of-body-protein",
    "prompt": "What percentage of the protein in a human body is collagen?",
    "unit": "percent",
    "answerValue": 30,
    "decompositionHint": "It is the scaffolding of skin, tendon, bone and cartilage, so it dominates rather than being a minor component.",
    "strategy": "recall-sanity",
    "source": "Biochemistry references on protein composition"
  },
  {
    "id": "breaths-during-one-night-of-sleep",
    "prompt": "How many breaths does a person take during one night of sleep?",
    "unit": "breaths",
    "answerValue": 6000,
    "decompositionHint": "Roughly 12 breaths a minute while asleep, across about eight hours.",
    "strategy": "rate-time",
    "source": "Derived from sleeping respiratory rate"
  },
  {
    "id": "mass-of-the-sun-vs-solar-system",
    "prompt": "What percentage of the solar system's mass is the Sun?",
    "unit": "percent",
    "answerValue": 99.86,
    "decompositionHint": "Jupiter is the largest of the rest and is still only a thousandth of the Sun.",
    "strategy": "anchor-scale",
    "source": "Derived from planetary and solar masses"
  },
  {
    "id": "temperature-of-the-sun-core",
    "prompt": "How many degrees Celsius is the core of the Sun?",
    "unit": "degrees Celsius",
    "answerValue": 15000000,
    "decompositionHint": "Hot enough to fuse hydrogen, which needs tens of millions of degrees, not thousands.",
    "strategy": "recall-sanity",
    "source": "Standard solar models"
  },
  {
    "id": "photons-leaving-the-sun-per-second",
    "prompt": "How many photons does the Sun emit each second?",
    "unit": "photons",
    "answerValue": 1e+45,
    "decompositionHint": "The Sun radiates about 3.8x10^26 watts, and a visible photon carries roughly 4x10^-19 joules.",
    "strategy": "divide-total",
    "source": "Derived from solar luminosity and mean photon energy"
  },
  {
    "id": "time-for-photon-to-escape-the-sun",
    "prompt": "How many years does a photon take to travel from the Sun's core to its surface?",
    "unit": "years",
    "answerValue": 100000,
    "decompositionHint": "It does not travel straight. Constant scattering turns 700,000 kilometres into an enormously long random walk.",
    "strategy": "recall-sanity",
    "source": "Solar interior radiative transfer estimates"
  },
  {
    "id": "asteroids-larger-than-a-kilometre",
    "prompt": "How many asteroids larger than one kilometre across are in the asteroid belt?",
    "unit": "asteroids",
    "answerValue": 1000000,
    "decompositionHint": "Survey counts extrapolated by size distribution. Smaller bodies are far more numerous than large ones.",
    "strategy": "recall-sanity",
    "source": "Minor planet survey extrapolations"
  },
  {
    "id": "mass-of-the-asteroid-belt",
    "prompt": "What fraction of the Moon's mass is the entire asteroid belt?",
    "unit": "fraction",
    "answerValue": 0.04,
    "decompositionHint": "Far less than films suggest. Ceres alone is about a third of the belt.",
    "strategy": "anchor-scale",
    "source": "Derived from belt and lunar mass estimates"
  },
  {
    "id": "distance-to-the-edge-of-solar-system",
    "prompt": "How many astronomical units away is the outer edge of the Oort cloud?",
    "unit": "astronomical units",
    "answerValue": 100000,
    "decompositionHint": "Far beyond Neptune at 30 AU. The cloud is measured in tens of thousands of AU, a good fraction of the way to the nearest star.",
    "strategy": "recall-sanity",
    "source": "Cometary dynamics estimates"
  },
  {
    "id": "earths-across-the-suns-diameter",
    "prompt": "How many Earths would fit side by side across the diameter of the Sun?",
    "unit": "Earths",
    "answerValue": 109,
    "decompositionHint": "Solar radius is about 696,000 kilometres and Earth's is 6,371.",
    "strategy": "divide-total",
    "source": "Derived from solar and terrestrial radii"
  },
  {
    "id": "speed-of-the-solar-system-round-the-galaxy",
    "prompt": "How many kilometres per second does the solar system move around the galactic centre?",
    "unit": "kilometres per second",
    "answerValue": 230,
    "decompositionHint": "One orbit takes about 230 million years at a radius of some 26,000 light years.",
    "strategy": "divide-total",
    "source": "Galactic rotation measurements"
  },
  {
    "id": "stars-visible-to-the-naked-eye",
    "prompt": "How many stars can be seen with the naked eye from a dark site across the whole sky?",
    "unit": "stars",
    "answerValue": 9000,
    "decompositionHint": "Only about half are above the horizon at once, and light pollution cuts it dramatically.",
    "strategy": "recall-sanity",
    "source": "Yale Bright Star Catalogue down to magnitude 6.5"
  },
  {
    "id": "meteors-hitting-earth-per-day",
    "prompt": "How many tonnes of meteoric material fall on Earth each day?",
    "unit": "tonnes",
    "answerValue": 50,
    "decompositionHint": "Mostly dust rather than rocks. Almost all of it burns up long before reaching the ground.",
    "strategy": "recall-sanity",
    "source": "Atmospheric dust influx measurements"
  },
  {
    "id": "age-of-the-oldest-light",
    "prompt": "How many years has the cosmic microwave background been travelling?",
    "unit": "years",
    "answerValue": 13800000000,
    "decompositionHint": "It was released about 380,000 years after the Big Bang, which is a rounding error on the age of the universe.",
    "strategy": "recall-sanity",
    "source": "Planck mission cosmological parameters"
  },
  {
    "id": "black-hole-at-galactic-centre-mass",
    "prompt": "How many solar masses is the black hole at the centre of the Milky Way?",
    "unit": "solar masses",
    "answerValue": 4300000,
    "decompositionHint": "Measured from the orbits of stars whipping around it. Millions, not billions, unlike the giants in larger galaxies.",
    "strategy": "recall-sanity",
    "source": "Genzel and Ghez stellar orbit measurements"
  },
  {
    "id": "diameter-of-a-neutron-star",
    "prompt": "How many kilometres across is a typical neutron star?",
    "unit": "kilometres",
    "answerValue": 20,
    "decompositionHint": "More than a solar mass compressed to the size of a city.",
    "strategy": "recall-sanity",
    "source": "Neutron star structure models"
  },
  {
    "id": "density-of-a-neutron-star",
    "prompt": "How many tonnes would a teaspoon of neutron star material weigh?",
    "unit": "tonnes",
    "answerValue": 1000000000,
    "decompositionHint": "Nuclear density is about 10^17 kilograms per cubic metre, and a teaspoon is 5 millilitres.",
    "strategy": "chain-multiply",
    "source": "Derived from nuclear density"
  },
  {
    "id": "satellites-launched-since-1957",
    "prompt": "How many satellites have been launched into orbit since 1957?",
    "asOf": 2025,
    "unit": "satellites",
    "answerValue": 20000,
    "decompositionHint": "The pace changed completely in the 2020s. More went up in the last five years than in the preceding fifty.",
    "strategy": "recall-sanity",
    "source": "UN Register of Objects Launched into Outer Space"
  },
  {
    "id": "power-output-of-the-iss-solar-arrays",
    "prompt": "How many kilowatts do the solar arrays on the International Space Station generate?",
    "unit": "kilowatts",
    "answerValue": 120,
    "decompositionHint": "About 2,500 square metres of panels, though the station spends part of each orbit in shadow.",
    "strategy": "energy-balance",
    "source": "NASA ISS power system specifications"
  },
  {
    "id": "water-in-the-atmosphere",
    "prompt": "How many cubic kilometres of water are in the atmosphere at any moment?",
    "unit": "cubic kilometres",
    "answerValue": 12900,
    "decompositionHint": "Spread over the whole Earth it would be a layer only about 25 millimetres deep.",
    "strategy": "area-density",
    "source": "Global hydrological cycle inventories"
  },
  {
    "id": "lightning-energy-per-year",
    "prompt": "How many petajoules of energy does global lightning release in a year?",
    "unit": "petajoules",
    "answerValue": 1000,
    "decompositionHint": "Roughly 1.4 billion flashes a year at a few hundred megajoules each.",
    "strategy": "energy-balance",
    "source": "Derived from global flash rate and per-flash energy"
  },
  {
    "id": "depth-of-the-mariana-trench",
    "prompt": "How many metres deep is the Mariana Trench at its deepest point?",
    "unit": "metres",
    "answerValue": 10935,
    "decompositionHint": "Deeper than Everest is tall, with a couple of kilometres to spare.",
    "strategy": "anchor-scale",
    "source": "Challenger Deep sonar surveys"
  },
  {
    "id": "volume-of-the-great-lakes",
    "prompt": "How many cubic kilometres of water do the Great Lakes hold?",
    "unit": "cubic kilometres",
    "answerValue": 22700,
    "decompositionHint": "About a fifth of the world's surface fresh water. Lake Superior alone is roughly half of it.",
    "strategy": "recall-sanity",
    "source": "US EPA Great Lakes water inventories"
  },
  {
    "id": "sand-in-the-sahara",
    "prompt": "How many cubic kilometres of sand are in the Sahara desert?",
    "unit": "cubic kilometres",
    "answerValue": 250000,
    "decompositionHint": "About 9 million square kilometres, though only around a fifth is dune fields, at an average depth of tens of metres.",
    "strategy": "volume-packing",
    "source": "Derived from desert area and typical erg depth"
  },
  {
    "id": "rivers-discharge-to-the-sea",
    "prompt": "How many cubic kilometres of water do the world's rivers discharge into the oceans each year?",
    "unit": "cubic kilometres",
    "answerValue": 37000,
    "decompositionHint": "Precipitation on land minus what evaporates back. The Amazon alone carries about a sixth of it.",
    "strategy": "stock-flow",
    "source": "Global runoff estimates"
  },
  {
    "id": "height-gain-of-the-himalayas",
    "prompt": "How many millimetres per year are the Himalayas rising?",
    "unit": "millimetres per year",
    "answerValue": 5,
    "decompositionHint": "Slow enough to be invisible, fast enough to build kilometres over a few million years, and partly offset by erosion.",
    "strategy": "rate-time",
    "source": "GPS geodetic measurements"
  },
  {
    "id": "ice-lost-from-greenland-per-year",
    "prompt": "How many gigatonnes of ice does Greenland lose each year?",
    "asOf": 2025,
    "unit": "gigatonnes",
    "answerValue": 270,
    "decompositionHint": "Enough to raise global sea level by under a millimetre a year, which sounds small until you compound it.",
    "strategy": "recall-sanity",
    "source": "GRACE and GRACE-FO satellite gravimetry"
  },
  {
    "id": "carbon-in-the-atmosphere",
    "prompt": "How many gigatonnes of carbon are in the atmosphere?",
    "asOf": 2025,
    "unit": "gigatonnes of carbon",
    "answerValue": 890,
    "decompositionHint": "About 420 parts per million of an atmosphere massing 5.1x10^18 kilograms, counting carbon rather than whole CO2 molecules.",
    "strategy": "chain-multiply",
    "source": "Global Carbon Project"
  },
  {
    "id": "carbon-in-soil",
    "prompt": "How many gigatonnes of carbon are stored in the world's soils?",
    "unit": "gigatonnes of carbon",
    "answerValue": 1500,
    "decompositionHint": "More than the atmosphere and all plant life put together.",
    "strategy": "anchor-scale",
    "source": "IPCC land carbon pool assessments"
  },
  {
    "id": "sunlight-reflected-by-earth",
    "prompt": "What percentage of incoming sunlight does Earth reflect straight back to space?",
    "unit": "percent",
    "answerValue": 30,
    "decompositionHint": "Cloud does most of it, with ice and desert contributing. This is the planetary albedo.",
    "strategy": "recall-sanity",
    "source": "Earth radiation budget measurements"
  },
  {
    "id": "wind-energy-in-the-atmosphere",
    "prompt": "How many terawatts of wind power are dissipated in the atmosphere globally?",
    "unit": "terawatts",
    "answerValue": 900,
    "decompositionHint": "A small fraction of the sunlight the Earth absorbs ends up driving atmospheric motion.",
    "strategy": "energy-balance",
    "source": "Atmospheric energy budget studies"
  },
  {
    "id": "annual-global-rainfall-mass",
    "prompt": "How many tonnes of rain fall on Earth each year?",
    "unit": "tonnes",
    "answerValue": 500000000000000,
    "decompositionHint": "About a metre of precipitation a year over 510 million square kilometres.",
    "strategy": "area-density",
    "source": "Derived from global mean precipitation"
  },
  {
    "id": "trees-cut-down-per-year",
    "prompt": "How many trees are cut down worldwide each year?",
    "asOf": 2025,
    "unit": "trees",
    "answerValue": 15000000000,
    "decompositionHint": "Against a standing stock of roughly three trillion, so a fraction of a percent annually.",
    "strategy": "stock-flow",
    "source": "Crowther et al. 2015 and FAO forest assessments"
  },
  {
    "id": "topsoil-lost-per-year",
    "prompt": "How many tonnes of topsoil are lost to erosion worldwide each year?",
    "asOf": 2025,
    "unit": "tonnes",
    "answerValue": 24000000000,
    "decompositionHint": "Farmland loses soil far faster than it forms, which takes centuries per centimetre.",
    "strategy": "recall-sanity",
    "source": "FAO soil degradation assessments"
  },
  {
    "id": "volcanic-co2-per-year",
    "prompt": "How many million tonnes of carbon dioxide do volcanoes emit each year?",
    "unit": "million tonnes",
    "answerValue": 350,
    "decompositionHint": "Worth comparing against human emissions, which are more than a hundred times larger.",
    "strategy": "anchor-scale",
    "source": "Volcanic degassing surveys"
  },
  {
    "id": "lightning-strikes-per-square-km",
    "prompt": "How many lightning strikes hit an average square kilometre of land each year?",
    "unit": "strikes",
    "answerValue": 6,
    "decompositionHint": "Roughly 1.4 billion flashes a year spread very unevenly over the land surface.",
    "strategy": "divide-total",
    "source": "Derived from satellite lightning detection"
  },
  {
    "id": "searches-per-second-worldwide",
    "prompt": "How many web searches are made worldwide every second?",
    "asOf": 2025,
    "unit": "searches",
    "answerValue": 100000,
    "decompositionHint": "Several billion a day, spread across the world so the rate never drops to nothing.",
    "strategy": "rate-time",
    "source": "Published search engine volume estimates"
  },
  {
    "id": "energy-per-google-search",
    "prompt": "How many joules of energy does a single web search consume?",
    "unit": "joules",
    "answerValue": 1080,
    "decompositionHint": "About 0.3 watt-hours, covering the data centre work rather than your own device.",
    "strategy": "energy-balance",
    "source": "Published search energy disclosures"
  },
  {
    "id": "bitcoin-energy-per-year",
    "prompt": "How many terawatt-hours does Bitcoin mining consume in a year?",
    "asOf": 2025,
    "unit": "terawatt-hours",
    "answerValue": 150,
    "decompositionHint": "Comparable to the annual electricity use of a mid-sized country.",
    "strategy": "recall-sanity",
    "source": "Cambridge Bitcoin Electricity Consumption Index"
  },
  {
    "id": "emails-that-are-spam",
    "prompt": "What percentage of all email sent worldwide is spam?",
    "asOf": 2025,
    "unit": "percent",
    "answerValue": 45,
    "decompositionHint": "Filtering is good enough that the share reaching an inbox is far lower than the share sent.",
    "strategy": "recall-sanity",
    "source": "Email security vendor traffic reports"
  },
  {
    "id": "data-centre-share-of-electricity",
    "prompt": "What percentage of world electricity do data centres consume?",
    "asOf": 2025,
    "unit": "percent",
    "answerValue": 1.5,
    "decompositionHint": "Smaller than most people guess, though growing quickly with AI workloads.",
    "strategy": "recall-sanity",
    "source": "IEA data centre energy analyses"
  },
  {
    "id": "computing-power-of-a-1990s-supercomputer",
    "prompt": "How many times more powerful is a modern phone than a 1995 supercomputer?",
    "unit": "times",
    "answerValue": 100,
    "decompositionHint": "A 1995 top machine ran at a few hundred gigaflops. A modern phone reaches a few teraflops.",
    "strategy": "anchor-scale",
    "source": "Derived from TOP500 records and mobile chip specifications"
  },
  {
    "id": "github-repositories",
    "prompt": "How many repositories are hosted on GitHub?",
    "asOf": 2025,
    "unit": "repositories",
    "answerValue": 420000000,
    "decompositionHint": "Most are personal or forked rather than actively developed projects.",
    "strategy": "recall-sanity",
    "source": "GitHub published platform statistics"
  },
  {
    "id": "domain-names-registered",
    "prompt": "How many domain names are registered worldwide?",
    "asOf": 2025,
    "unit": "domain names",
    "answerValue": 360000000,
    "decompositionHint": "Dot-com is roughly half. A large share are parked rather than serving a site.",
    "strategy": "recall-sanity",
    "source": "Verisign Domain Name Industry Brief"
  },
  {
    "id": "ip-addresses-in-ipv4",
    "prompt": "How many addresses exist in the IPv4 address space?",
    "unit": "addresses",
    "answerValue": 4290000000,
    "decompositionHint": "Thirty-two bits, so two to the power of 32. Fewer than there are people, which is why it ran out.",
    "strategy": "exponential",
    "source": "IPv4 specification"
  },
  {
    "id": "cost-of-a-gigabyte-1980",
    "prompt": "How many US dollars did one gigabyte of hard disk storage cost in 1980?",
    "asOf": 1980,
    "unit": "US dollars",
    "answerValue": 400000,
    "decompositionHint": "Storage cost has fallen by roughly a factor of ten every four or five years since.",
    "strategy": "recall-sanity",
    "source": "Historical storage price surveys"
  },
  {
    "id": "power-of-apollo-guidance-computer",
    "prompt": "How many kilobytes of memory did the Apollo Guidance Computer have?",
    "asOf": 1969,
    "unit": "kilobytes",
    "answerValue": 74,
    "decompositionHint": "Less than a single modern photograph, and it flew people to the Moon.",
    "strategy": "recall-sanity",
    "source": "Apollo Guidance Computer technical documentation"
  },
  {
    "id": "video-watched-per-day-worldwide",
    "prompt": "How many years of video are watched worldwide each day?",
    "asOf": 2025,
    "unit": "years",
    "answerValue": 100000,
    "decompositionHint": "Billions of hours a day. Convert hours to years to see how absurd the total is.",
    "strategy": "unit-conversion",
    "source": "Derived from published streaming watch-time figures"
  },
  {
    "id": "football-pitches-of-grass-mown",
    "prompt": "How many square metres of grass does a groundskeeper mow in one pass of a football pitch?",
    "unit": "square metres",
    "answerValue": 7000,
    "decompositionHint": "A pitch is about 105 by 68 metres. One pass covers all of it.",
    "strategy": "area-density",
    "source": "FIFA pitch dimension standards"
  },
  {
    "id": "swings-in-a-round-of-golf",
    "prompt": "How many club swings does an average golfer take in one round of 18 holes?",
    "unit": "swings",
    "answerValue": 95,
    "decompositionHint": "Around 90 to 100 strokes for a typical amateur, plus practice swings if you count them.",
    "strategy": "recall-sanity",
    "source": "Golf handicap distribution data"
  },
  {
    "id": "distance-run-in-a-football-match",
    "prompt": "How many kilometres does a professional footballer run during one match?",
    "unit": "kilometres",
    "answerValue": 10.5,
    "decompositionHint": "Ninety minutes of mixed walking, jogging and sprinting, tracked by GPS vests.",
    "strategy": "recall-sanity",
    "source": "Player tracking data from professional leagues"
  },
  {
    "id": "tennis-balls-hit-in-a-match",
    "prompt": "How many times is the ball struck during an average professional tennis match?",
    "unit": "strikes",
    "answerValue": 1000,
    "decompositionHint": "Roughly 200 points at four or five shots each, plus serves that come back.",
    "strategy": "chain-multiply",
    "source": "Derived from match statistics"
  },
  {
    "id": "olympic-athletes-per-games",
    "prompt": "How many athletes compete in a modern summer Olympic Games?",
    "asOf": 2024,
    "unit": "athletes",
    "answerValue": 10500,
    "decompositionHint": "About 200 nations, though a handful send hundreds each and many send only a few.",
    "strategy": "recall-sanity",
    "source": "International Olympic Committee participation figures"
  },
  {
    "id": "cricket-balls-bowled-in-a-test",
    "prompt": "How many deliveries are bowled in a full five day cricket Test match?",
    "unit": "deliveries",
    "answerValue": 2400,
    "decompositionHint": "About 90 overs a day of six balls each, across five days, if weather permits.",
    "strategy": "chain-multiply",
    "source": "Derived from Test match playing conditions"
  },
  {
    "id": "marathons-run-worldwide-per-year",
    "prompt": "How many marathon races are held worldwide each year?",
    "asOf": 2025,
    "unit": "races",
    "answerValue": 3000,
    "decompositionHint": "Most cities of any size host one, and many host several.",
    "strategy": "recall-sanity",
    "source": "Race calendar aggregations"
  },
  {
    "id": "notes-in-a-symphony",
    "prompt": "How many individual notes are played in a full symphony performance?",
    "unit": "notes",
    "answerValue": 200000,
    "decompositionHint": "Around 80 players over roughly 45 minutes, each averaging perhaps one note a second while playing.",
    "strategy": "chain-multiply",
    "source": "Derived from orchestra size and performance length"
  },
  {
    "id": "keys-pressed-in-a-piano-concerto",
    "prompt": "How many key presses does a pianist make during a full concerto?",
    "unit": "key presses",
    "answerValue": 30000,
    "decompositionHint": "Roughly 30 minutes of playing at a few notes a second, both hands.",
    "strategy": "rate-time",
    "source": "Derived from concerto length and note density"
  },
  {
    "id": "vinyl-records-pressed-per-year",
    "prompt": "How many vinyl records are pressed worldwide each year?",
    "asOf": 2025,
    "unit": "records",
    "answerValue": 60000000,
    "decompositionHint": "A format that nearly vanished and came back, though still tiny next to streaming.",
    "strategy": "recall-sanity",
    "source": "Recording industry shipment reports"
  },
  {
    "id": "guitar-strings-sold-per-year",
    "prompt": "How many guitar strings are sold worldwide each year?",
    "asOf": 2025,
    "unit": "strings",
    "answerValue": 300000000,
    "decompositionHint": "Tens of millions of players, each changing a six-string set a few times a year.",
    "strategy": "population-rate",
    "source": "Musical instrument industry estimates"
  },
  {
    "id": "hours-to-learn-an-instrument",
    "prompt": "How many hours of practice does it take to reach professional standard on an instrument?",
    "unit": "hours",
    "answerValue": 10000,
    "decompositionHint": "The often-quoted figure from studies of elite performers, roughly three hours a day for a decade.",
    "strategy": "recall-sanity",
    "source": "Ericsson et al. deliberate practice research"
  },
  {
    "id": "brush-strokes-in-an-oil-painting",
    "prompt": "How many brush strokes are in a typical large oil painting?",
    "unit": "brush strokes",
    "answerValue": 50000,
    "decompositionHint": "A square metre of canvas covered with strokes a couple of centimetres across, in several layers.",
    "strategy": "area-density",
    "source": "Derived from canvas area and stroke size"
  },
  {
    "id": "objects-in-the-british-museum",
    "prompt": "How many objects are in the British Museum collection?",
    "asOf": 2025,
    "unit": "objects",
    "answerValue": 8000000,
    "decompositionHint": "Only a small fraction is ever on display. Most sits in storage.",
    "strategy": "recall-sanity",
    "source": "British Museum published collection figures"
  },
  {
    "id": "books-in-a-city-library",
    "prompt": "How many books does a typical city public library hold?",
    "unit": "books",
    "answerValue": 300000,
    "decompositionHint": "Shelving is the constraint: a few kilometres of shelf at roughly 30 books a metre.",
    "strategy": "divide-total",
    "source": "Public library collection surveys"
  },
  {
    "id": "words-in-a-shakespeare-play",
    "prompt": "How many words are in an average Shakespeare play?",
    "unit": "words",
    "answerValue": 22000,
    "decompositionHint": "About two to three hours of performance at roughly 130 spoken words a minute.",
    "strategy": "rate-time",
    "source": "Derived from performance length and speaking rate"
  },
  {
    "id": "chess-games-played-online-per-day",
    "prompt": "How many chess games are played online worldwide each day?",
    "asOf": 2025,
    "unit": "games",
    "answerValue": 15000000,
    "decompositionHint": "Millions of players, most playing several short games in a session.",
    "strategy": "population-rate",
    "source": "Published figures from major chess platforms"
  },
  {
    "id": "playing-cards-made-per-year",
    "prompt": "How many decks of playing cards are manufactured worldwide each year?",
    "asOf": 2025,
    "unit": "decks",
    "answerValue": 1000000000,
    "decompositionHint": "Casinos alone get through enormous numbers, since decks are retired after limited use.",
    "strategy": "recall-sanity",
    "source": "Playing card industry estimates"
  },
  {
    "id": "dice-rolls-for-every-combination",
    "prompt": "How many rolls of two dice are needed on average to see every possible total at least once?",
    "unit": "rolls",
    "answerValue": 61,
    "decompositionHint": "A coupon collector problem, and the rare totals of 2 and 12 dominate the wait.",
    "strategy": "combinatorial",
    "source": "Coupon collector calculation for weighted outcomes"
  },
  {
    "id": "steps-danced-in-a-ballet",
    "prompt": "How many individual steps does a principal dancer perform in a full-length ballet?",
    "unit": "steps",
    "answerValue": 6000,
    "decompositionHint": "Perhaps 40 minutes of actual dancing across the evening, at a few steps a second.",
    "strategy": "rate-time",
    "source": "Derived from stage time and step rate"
  },
  {
    "id": "stones-in-stonehenge",
    "prompt": "How many tonnes does the largest standing stone at Stonehenge weigh?",
    "unit": "tonnes",
    "answerValue": 25,
    "decompositionHint": "Roughly 4 metres tall by 2 wide by 1 thick, and sandstone is about 2.4 tonnes per cubic metre.",
    "strategy": "volume-packing",
    "source": "Archaeological surveys of the sarsen stones"
  },
  {
    "id": "workers-to-build-the-great-pyramid",
    "prompt": "How many workers were needed to build the Great Pyramid?",
    "asOf": -2560,
    "unit": "workers",
    "answerValue": 20000,
    "decompositionHint": "About 2.3 million blocks over roughly 20 years. Work backwards from blocks placed per day.",
    "strategy": "divide-total",
    "source": "Egyptological labour estimates from worker settlements"
  },
  {
    "id": "length-of-roman-roads",
    "prompt": "How many kilometres of paved road did the Roman Empire build?",
    "asOf": 100,
    "unit": "kilometres",
    "answerValue": 80000,
    "decompositionHint": "Enough to circle the Earth twice, connecting a territory spanning three continents.",
    "strategy": "recall-sanity",
    "source": "Roman infrastructure surveys"
  },
  {
    "id": "ships-in-the-spanish-armada",
    "prompt": "How many ships sailed in the Spanish Armada?",
    "asOf": 1588,
    "unit": "ships",
    "answerValue": 130,
    "decompositionHint": "Large by the standards of the time, though only a minority were true fighting galleons.",
    "strategy": "recall-sanity",
    "source": "Contemporary naval records"
  },
  {
    "id": "letters-sent-in-victorian-britain",
    "prompt": "How many letters were posted in Britain each year at the height of the Victorian postal system?",
    "asOf": 1900,
    "unit": "letters",
    "answerValue": 2300000000,
    "decompositionHint": "Around 40 million people, several deliveries a day in cities, and no telephone for most.",
    "strategy": "population-rate",
    "source": "Royal Mail historical traffic figures"
  },
  {
    "id": "horses-in-london-1900",
    "prompt": "How many horses worked in London in 1900?",
    "asOf": 1900,
    "unit": "horses",
    "answerValue": 300000,
    "decompositionHint": "Everything moved by horse, and each one produced enough manure to make it a public health crisis.",
    "strategy": "recall-sanity",
    "source": "Victorian transport histories"
  },
  {
    "id": "candles-to-light-a-house-1800",
    "prompt": "How many candles would light a house for one evening in 1800?",
    "asOf": 1800,
    "unit": "candles",
    "answerValue": 12,
    "decompositionHint": "A candle gives about one hundredth the light of a modern bulb, so several per room.",
    "strategy": "anchor-scale",
    "source": "Historical lighting studies"
  },
  {
    "id": "books-copied-by-a-medieval-scribe",
    "prompt": "How many books could a medieval scribe copy in a working lifetime?",
    "asOf": 1400,
    "unit": "books",
    "answerValue": 60,
    "decompositionHint": "A single book took months of continuous work, across perhaps 30 working years.",
    "strategy": "divide-total",
    "source": "Manuscript production studies"
  },
  {
    "id": "population-of-ancient-rome",
    "prompt": "How many people lived in the city of Rome at its ancient peak?",
    "asOf": 100,
    "unit": "people",
    "answerValue": 1000000,
    "decompositionHint": "No other European city reached this size again until London in the 1800s.",
    "strategy": "recall-sanity",
    "source": "Roman demographic estimates"
  },
  {
    "id": "years-to-build-a-cathedral",
    "prompt": "How many years did it typically take to build a medieval European cathedral?",
    "asOf": 1300,
    "unit": "years",
    "answerValue": 100,
    "decompositionHint": "Long enough that the people who started it never saw it finished.",
    "strategy": "recall-sanity",
    "source": "Architectural histories of Gothic construction"
  },
  {
    "id": "bricks-in-a-brick-wall-per-square-metre",
    "prompt": "How many bricks are in one square metre of a standard brick wall?",
    "unit": "bricks",
    "answerValue": 60,
    "decompositionHint": "A standard brick face is about 215 by 65 millimetres including mortar joints.",
    "strategy": "divide-total",
    "source": "Standard bricklaying references"
  },
  {
    "id": "nails-in-a-pallet",
    "prompt": "How many nails are used to build one wooden shipping pallet?",
    "unit": "nails",
    "answerValue": 78,
    "decompositionHint": "Nine blocks or three stringers, with several nails at each board crossing.",
    "strategy": "chain-multiply",
    "source": "Pallet manufacturing standards"
  },
  {
    "id": "cement-per-kilometre-of-motorway",
    "prompt": "How many tonnes of concrete are used per kilometre of motorway?",
    "unit": "tonnes",
    "answerValue": 12000,
    "decompositionHint": "Roughly 12 metres wide and a quarter of a metre thick, at 2.4 tonnes per cubic metre.",
    "strategy": "volume-packing",
    "source": "Highway construction specifications"
  },
  {
    "id": "steel-in-a-skyscraper",
    "prompt": "How many tonnes of structural steel are in a 50 storey office tower?",
    "unit": "tonnes",
    "answerValue": 25000,
    "decompositionHint": "Roughly 100,000 square metres of floor at a couple of hundred kilograms of steel per square metre.",
    "strategy": "area-density",
    "source": "Structural engineering rules of thumb"
  },
  {
    "id": "glass-in-a-skyscraper-facade",
    "prompt": "How many square metres of glass cover the facade of a 50 storey tower?",
    "unit": "square metres",
    "answerValue": 40000,
    "decompositionHint": "A 50 by 50 metre footprint, 200 metres tall, with most of the wall glazed.",
    "strategy": "area-density",
    "source": "Curtain wall design references"
  },
  {
    "id": "timber-in-a-wooden-house",
    "prompt": "How many cubic metres of timber go into building a typical wooden house?",
    "unit": "cubic metres",
    "answerValue": 45,
    "decompositionHint": "Around 150 square metres of floor, with framing, floors and roof all made of wood.",
    "strategy": "area-density",
    "source": "Residential construction material estimates"
  },
  {
    "id": "paint-on-a-large-ship",
    "prompt": "How many litres of paint are needed to coat a large container ship?",
    "unit": "litres",
    "answerValue": 60000,
    "decompositionHint": "Hull and superstructure run to tens of thousands of square metres, at several coats.",
    "strategy": "area-density",
    "source": "Marine coatings industry figures"
  },
  {
    "id": "welds-in-a-ship-hull",
    "prompt": "How many metres of welding are in the hull of a large cargo ship?",
    "unit": "metres",
    "answerValue": 300000,
    "decompositionHint": "Steel plates a few metres across, joined along every edge, across a hull hundreds of metres long.",
    "strategy": "divide-total",
    "source": "Shipbuilding production estimates"
  },
  {
    "id": "rivets-in-the-titanic",
    "prompt": "How many rivets held the hull of the Titanic together?",
    "asOf": 1912,
    "unit": "rivets",
    "answerValue": 3000000,
    "decompositionHint": "Welding was not yet used for hulls, so every plate seam was riveted by hand.",
    "strategy": "recall-sanity",
    "source": "Shipbuilding records from Harland and Wolff"
  },
  {
    "id": "tonnes-moved-to-dig-the-panama-canal",
    "prompt": "How many cubic metres of earth were excavated to dig the Panama Canal?",
    "asOf": 1914,
    "unit": "cubic metres",
    "answerValue": 200000000,
    "decompositionHint": "Eighty kilometres long, cut through a continental divide, mostly before mechanised earthmoving matured.",
    "strategy": "recall-sanity",
    "source": "Panama Canal construction records"
  },
  {
    "id": "bandages-used-in-a-hospital-per-year",
    "prompt": "How many dressings does a large hospital use in a year?",
    "unit": "dressings",
    "answerValue": 500000,
    "decompositionHint": "Perhaps 800 beds, most occupied, with a couple of dressing changes a day between them.",
    "strategy": "population-rate",
    "source": "Hospital consumables procurement estimates"
  },
  {
    "id": "x-rays-taken-worldwide-per-year",
    "prompt": "How many medical X-ray images are taken worldwide each year?",
    "asOf": 2025,
    "unit": "images",
    "answerValue": 4000000000,
    "decompositionHint": "Roughly one image for every two people on Earth, concentrated in wealthier countries.",
    "strategy": "population-rate",
    "source": "UNSCEAR medical radiation exposure reports"
  },
  {
    "id": "organ-transplants-per-year",
    "prompt": "How many organ transplants are performed worldwide each year?",
    "asOf": 2025,
    "unit": "transplants",
    "answerValue": 160000,
    "decompositionHint": "Limited by donors rather than by surgical capacity, so far below the waiting lists.",
    "strategy": "recall-sanity",
    "source": "Global Observatory on Donation and Transplantation"
  },
  {
    "id": "hearing-aids-in-use",
    "prompt": "How many hearing aids are in use worldwide?",
    "asOf": 2025,
    "unit": "hearing aids",
    "answerValue": 60000000,
    "decompositionHint": "Far fewer than the number of people who would benefit, which runs into the hundreds of millions.",
    "strategy": "recall-sanity",
    "source": "WHO hearing loss reports"
  },
  {
    "id": "aspirin-tablets-per-year",
    "prompt": "How many aspirin tablets are consumed worldwide each year?",
    "asOf": 2025,
    "unit": "tablets",
    "answerValue": 100000000000,
    "decompositionHint": "Over a hundred billion, between pain relief and daily low-dose cardiac use.",
    "strategy": "recall-sanity",
    "source": "Pharmaceutical production estimates"
  },
  {
    "id": "bacteria-killed-by-handwashing",
    "prompt": "What percentage of bacteria does a thorough 20 second handwash remove?",
    "unit": "percent",
    "answerValue": 99,
    "decompositionHint": "Soap does not kill so much as lift and rinse away. The time spent scrubbing matters more than the soap.",
    "strategy": "recall-sanity",
    "source": "Hand hygiene efficacy studies"
  },
  {
    "id": "teeth-brushed-in-a-lifetime",
    "prompt": "How many hours does a person spend brushing their teeth in a lifetime?",
    "unit": "hours",
    "answerValue": 1200,
    "decompositionHint": "Four minutes a day across some 75 years, once you stop counting childhood.",
    "strategy": "rate-time",
    "source": "Derived from recommended brushing time"
  },
  {
    "id": "germs-on-a-phone-screen",
    "prompt": "How many bacteria live on an average mobile phone screen?",
    "unit": "bacteria",
    "answerValue": 17000,
    "decompositionHint": "About 100 square centimetres, handled constantly and cleaned rarely.",
    "strategy": "area-density",
    "source": "Microbiological swab studies of mobile devices"
  },
  {
    "id": "grains-of-pollen-in-a-breath",
    "prompt": "How many pollen grains does a person inhale in a breath on a high pollen day?",
    "unit": "pollen grains",
    "answerValue": 5,
    "decompositionHint": "Half a litre of air at a few thousand grains per cubic metre.",
    "strategy": "chain-multiply",
    "source": "Derived from peak pollen count measurements"
  },
  {
    "id": "dust-mites-in-a-mattress",
    "prompt": "How many dust mites live in a typical used mattress?",
    "unit": "dust mites",
    "answerValue": 1000000,
    "decompositionHint": "They eat shed skin, and a person sheds a great deal of it in bed.",
    "strategy": "recall-sanity",
    "source": "Allergen and household ecology studies"
  },
  {
    "id": "hospital-admissions-worldwide",
    "prompt": "How many hospital admissions happen worldwide each year?",
    "asOf": 2025,
    "unit": "admissions",
    "answerValue": 800000000,
    "decompositionHint": "Roughly one admission for every ten people, though very unevenly distributed.",
    "strategy": "population-rate",
    "source": "WHO health service utilisation data"
  },
  {
    "id": "antibiotic-resistant-deaths-per-year",
    "prompt": "How many deaths worldwide each year are attributable to antibiotic resistance?",
    "asOf": 2025,
    "unit": "deaths",
    "answerValue": 1300000,
    "decompositionHint": "Comparable to malaria or HIV, and projected to grow substantially.",
    "strategy": "recall-sanity",
    "source": "Global Burden of Disease antimicrobial resistance study"
  },
  {
    "id": "vaccines-given-in-childhood",
    "prompt": "How many vaccine doses does a fully immunised child receive by age five?",
    "asOf": 2025,
    "unit": "doses",
    "answerValue": 25,
    "decompositionHint": "A dozen or so diseases, several needing multiple doses to complete a course.",
    "strategy": "recall-sanity",
    "source": "National childhood immunisation schedules"
  },
  {
    "id": "steps-a-nurse-walks-per-shift",
    "prompt": "How many kilometres does a hospital nurse walk during one shift?",
    "unit": "kilometres",
    "answerValue": 6,
    "decompositionHint": "Twelve hours moving between beds, stores and stations, at a walking pace but rarely in a straight line.",
    "strategy": "rate-time",
    "source": "Pedometer studies of clinical staff"
  },
  {
    "id": "prescriptions-per-person-per-year",
    "prompt": "How many prescription items does an average person in a wealthy country receive each year?",
    "asOf": 2025,
    "unit": "items",
    "answerValue": 20,
    "decompositionHint": "Heavily skewed: most young adults get almost none, while elderly patients may collect dozens.",
    "strategy": "recall-sanity",
    "source": "National prescribing statistics"
  },
  {
    "id": "surgical-masks-used-per-year",
    "prompt": "How many surgical masks are used worldwide each year?",
    "asOf": 2025,
    "unit": "masks",
    "answerValue": 100000000000,
    "decompositionHint": "Healthcare use alone is enormous, and single-use means every one is discarded.",
    "strategy": "recall-sanity",
    "source": "Medical consumables market analyses"
  },
  {
    "id": "heartbeats-saved-by-a-pacemaker",
    "prompt": "How many beats does a pacemaker deliver over ten years of service?",
    "unit": "beats",
    "answerValue": 370000000,
    "decompositionHint": "About 70 beats a minute, continuously, for a decade before the battery is changed.",
    "strategy": "rate-time",
    "source": "Derived from pacing rate and device longevity"
  },
  {
    "id": "grains-of-coffee-ground-per-cup",
    "prompt": "How many coffee grounds particles are in one espresso dose?",
    "unit": "particles",
    "answerValue": 20000000,
    "decompositionHint": "About 18 grams ground to particles a few hundred microns across.",
    "strategy": "divide-total",
    "source": "Derived from grind size distributions"
  },
  {
    "id": "bubbles-in-a-pint-of-beer",
    "prompt": "How many bubbles rise through a pint of beer?",
    "unit": "bubbles",
    "answerValue": 2000000,
    "decompositionHint": "Dissolved carbon dioxide coming out of solution, a couple of grams of it, in bubbles under a millimetre across.",
    "strategy": "divide-total",
    "source": "Derived from carbonation levels and bubble size"
  },
  {
    "id": "tea-leaves-in-a-teabag",
    "prompt": "How many tea leaves are in a single teabag?",
    "unit": "leaf fragments",
    "answerValue": 5000,
    "decompositionHint": "About two grams of broken leaf, each fragment a few milligrams.",
    "strategy": "divide-total",
    "source": "Derived from teabag mass and particle size"
  },
  {
    "id": "sesame-seeds-on-a-burger-bun",
    "prompt": "How many sesame seeds are on a typical burger bun?",
    "unit": "seeds",
    "answerValue": 250,
    "decompositionHint": "The crown of the bun is roughly 60 square centimetres, sprinkled at a few seeds per square centimetre.",
    "strategy": "area-density",
    "source": "Derived from bun area and seed spacing"
  },
  {
    "id": "kernels-on-a-corn-cob",
    "prompt": "How many kernels are on an average ear of corn?",
    "unit": "kernels",
    "answerValue": 800,
    "decompositionHint": "About 16 rows of roughly 50 kernels each. The row count is almost always even.",
    "strategy": "chain-multiply",
    "source": "Agricultural extension references"
  },
  {
    "id": "seeds-in-a-watermelon",
    "prompt": "How many seeds are in an average seeded watermelon?",
    "unit": "seeds",
    "answerValue": 350,
    "decompositionHint": "Concentrated in bands through the flesh rather than spread evenly.",
    "strategy": "recall-sanity",
    "source": "Horticultural surveys"
  },
  {
    "id": "grapes-to-make-a-bottle-of-wine",
    "prompt": "How many grapes go into one bottle of wine?",
    "unit": "grapes",
    "answerValue": 700,
    "decompositionHint": "About 1.2 kilograms of fruit per bottle, and a grape weighs a couple of grams.",
    "strategy": "divide-total",
    "source": "Winemaking yield references"
  },
  {
    "id": "olives-for-a-litre-of-olive-oil",
    "prompt": "How many olives are needed to produce one litre of olive oil?",
    "unit": "olives",
    "answerValue": 1300,
    "decompositionHint": "Roughly five kilograms of olives per litre, and an olive weighs about four grams.",
    "strategy": "divide-total",
    "source": "Olive oil extraction yields"
  },
  {
    "id": "cocoa-beans-in-a-chocolate-bar",
    "prompt": "How many cocoa beans go into one bar of dark chocolate?",
    "unit": "beans",
    "answerValue": 40,
    "decompositionHint": "A 100 gram bar at 70 percent cocoa needs about 70 grams of bean, and a bean is under two grams.",
    "strategy": "divide-total",
    "source": "Chocolate manufacturing references"
  },
  {
    "id": "bees-to-make-a-jar-of-honey",
    "prompt": "How many bees does it take to fill one jar of honey?",
    "unit": "bees",
    "answerValue": 850,
    "decompositionHint": "A bee makes about a twelfth of a teaspoon in its entire life, and a jar holds around 340 grams.",
    "strategy": "divide-total",
    "source": "Apiculture yield figures"
  },
  {
    "id": "wheat-in-a-pizza-base",
    "prompt": "How many wheat grains go into one pizza base?",
    "unit": "grains",
    "answerValue": 5000,
    "decompositionHint": "About 200 grams of flour, and a wheat grain yields roughly 0.03 grams of it.",
    "strategy": "divide-total",
    "source": "Derived from milling yields"
  },
  {
    "id": "potatoes-in-a-bag-of-crisps",
    "prompt": "How many potatoes are used to make one large bag of crisps?",
    "unit": "potatoes",
    "answerValue": 4,
    "decompositionHint": "A 150 gram bag needs about 600 grams of raw potato, since most of the water is driven off.",
    "strategy": "divide-total",
    "source": "Snack food processing yields"
  },
  {
    "id": "milk-for-a-kilogram-of-cheese",
    "prompt": "How many litres of milk are needed to make one kilogram of hard cheese?",
    "unit": "litres",
    "answerValue": 10,
    "decompositionHint": "Most of the milk leaves as whey. Only the curd becomes cheese.",
    "strategy": "divide-total",
    "source": "Dairy processing yields"
  },
  {
    "id": "eggs-in-a-wedding-cake",
    "prompt": "How many eggs go into a three tier wedding cake?",
    "unit": "eggs",
    "answerValue": 100,
    "decompositionHint": "Perhaps 12 kilograms of cake, with a typical sponge using around one egg per 120 grams.",
    "strategy": "divide-total",
    "source": "Derived from standard cake recipes"
  },
  {
    "id": "sugar-cubes-in-a-can-of-cola",
    "prompt": "How many teaspoons of sugar are in one can of cola?",
    "unit": "teaspoons",
    "answerValue": 9,
    "decompositionHint": "About 35 grams of sugar, and a teaspoon holds roughly four grams.",
    "strategy": "divide-total",
    "source": "Nutritional labelling"
  },
  {
    "id": "peanuts-in-a-jar-of-peanut-butter",
    "prompt": "How many peanuts go into one jar of peanut butter?",
    "unit": "peanuts",
    "answerValue": 700,
    "decompositionHint": "A 500 gram jar is nearly all peanut, and a shelled peanut weighs under a gram.",
    "strategy": "divide-total",
    "source": "Food processing references"
  },
  {
    "id": "salt-grains-on-a-crisp",
    "prompt": "How many salt grains are on a single potato crisp?",
    "unit": "salt grains",
    "answerValue": 250,
    "decompositionHint": "A crisp carries a few milligrams of salt, and a fine grain is a few micrograms.",
    "strategy": "divide-total",
    "source": "Derived from seasoning rates and grain mass"
  },
  {
    "id": "loaves-from-a-tonne-of-wheat",
    "prompt": "How many loaves of bread can be made from one tonne of wheat?",
    "unit": "loaves",
    "answerValue": 1400,
    "decompositionHint": "Milling gives about 720 kilograms of flour, and a loaf takes roughly 500 grams.",
    "strategy": "divide-total",
    "source": "Milling and baking yield figures"
  },
  {
    "id": "cows-for-a-days-milk-in-a-city",
    "prompt": "How many dairy cows are needed to supply a city of one million with milk for a day?",
    "unit": "cows",
    "answerValue": 9000,
    "decompositionHint": "Perhaps a quarter litre per person per day, and a dairy cow gives around 28 litres.",
    "strategy": "divide-total",
    "source": "Derived from consumption and dairy yields"
  },
  {
    "id": "socks-owned-in-a-lifetime",
    "prompt": "How many pairs of socks does a person get through in a lifetime?",
    "unit": "pairs",
    "answerValue": 800,
    "decompositionHint": "Perhaps a dozen pairs replaced each year across 65 adult years.",
    "strategy": "rate-time",
    "source": "Derived from typical replacement rates"
  },
  {
    "id": "lightbulbs-in-a-lifetime",
    "prompt": "How many light bulbs does a household get through in fifty years?",
    "unit": "bulbs",
    "answerValue": 400,
    "decompositionHint": "Around 30 fittings, with incandescent bulbs lasting a year and LEDs a decade.",
    "strategy": "stock-flow",
    "source": "Derived from lamp counts and rated lifetimes"
  },
  {
    "id": "batteries-in-a-house",
    "prompt": "How many batteries are sitting in a typical home right now?",
    "unit": "batteries",
    "answerValue": 30,
    "decompositionHint": "Remotes, smoke alarms, toys, clocks, tools and the spares in a drawer.",
    "strategy": "recall-sanity",
    "source": "Household inventory surveys"
  },
  {
    "id": "keys-on-a-keyring",
    "prompt": "How many keys does an average adult carry?",
    "unit": "keys",
    "answerValue": 5,
    "decompositionHint": "Home, work, car, and one or two nobody can identify any more.",
    "strategy": "recall-sanity",
    "source": "Consumer survey estimates"
  },
  {
    "id": "screws-in-a-flat-pack-wardrobe",
    "prompt": "How many screws and fixings are in a flat pack wardrobe?",
    "unit": "fixings",
    "answerValue": 120,
    "decompositionHint": "Cam locks, dowels, screws and back panel pins, several per joint across a dozen panels.",
    "strategy": "chain-multiply",
    "source": "Flat pack assembly instructions"
  },
  {
    "id": "threads-in-a-bed-sheet",
    "prompt": "How many individual threads are woven into one bed sheet?",
    "unit": "threads",
    "answerValue": 500000,
    "decompositionHint": "A 200 thread count means 200 threads per square inch, over a sheet of some 30,000 square inches.",
    "strategy": "area-density",
    "source": "Textile thread count standards"
  },
  {
    "id": "stitches-in-a-pair-of-jeans",
    "prompt": "How many stitches are in a pair of jeans?",
    "unit": "stitches",
    "answerValue": 12000,
    "decompositionHint": "Around 30 metres of seam at roughly eight stitches per centimetre.",
    "strategy": "chain-multiply",
    "source": "Garment manufacturing specifications"
  },
  {
    "id": "bristles-on-a-toothbrush",
    "prompt": "How many bristles are on a toothbrush head?",
    "unit": "bristles",
    "answerValue": 2500,
    "decompositionHint": "About 40 tufts, each holding dozens of filaments.",
    "strategy": "chain-multiply",
    "source": "Oral care product specifications"
  },
  {
    "id": "sheets-in-a-roll-of-toilet-paper",
    "prompt": "How many sheets are on a standard roll of toilet paper?",
    "unit": "sheets",
    "answerValue": 200,
    "decompositionHint": "A roll unwinds to roughly 25 metres, and a sheet is about 12 centimetres.",
    "strategy": "divide-total",
    "source": "Product packaging specifications"
  },
  {
    "id": "washing-machine-litres-per-year",
    "prompt": "How many litres of water does a household washing machine use in a year?",
    "unit": "litres",
    "answerValue": 12000,
    "decompositionHint": "Around 50 litres a cycle, at four or five cycles a week.",
    "strategy": "rate-time",
    "source": "Appliance efficiency ratings"
  },
  {
    "id": "dishwasher-cycles-in-its-life",
    "prompt": "How many cycles does a dishwasher run before it is replaced?",
    "unit": "cycles",
    "answerValue": 3500,
    "decompositionHint": "Roughly one cycle a day for about ten years.",
    "strategy": "rate-time",
    "source": "Appliance lifespan surveys"
  },
  {
    "id": "hairs-in-a-paintbrush",
    "prompt": "How many bristles are in a decorator's paintbrush?",
    "unit": "bristles",
    "answerValue": 15000,
    "decompositionHint": "A 75 millimetre brush with a bristle block a centimetre thick, packed densely.",
    "strategy": "area-density",
    "source": "Brush manufacturing specifications"
  },
  {
    "id": "pages-in-a-lifetime-of-newspapers",
    "prompt": "How many newspaper pages would a daily reader get through in a lifetime?",
    "unit": "pages",
    "answerValue": 1000000,
    "decompositionHint": "Around 40 pages a day for 60 years, if they read one every day.",
    "strategy": "rate-time",
    "source": "Derived from typical newspaper length"
  },
  {
    "id": "envelopes-licked-in-an-office-year",
    "prompt": "How many envelopes does a busy office get through in a year?",
    "unit": "envelopes",
    "answerValue": 25000,
    "decompositionHint": "Around 100 a working day, though far fewer than it once was.",
    "strategy": "rate-time",
    "source": "Office supplies consumption estimates"
  },
  {
    "id": "pencil-line-length",
    "prompt": "How many kilometres of line can one pencil draw?",
    "unit": "kilometres",
    "answerValue": 56,
    "decompositionHint": "The often-quoted figure is about 35 miles, from a graphite core a few grams in mass laid down microns thick.",
    "strategy": "recall-sanity",
    "source": "Pencil manufacturer published figures"
  },
  {
    "id": "ink-in-a-ballpoint-pen",
    "prompt": "How many metres of writing does one ballpoint pen produce?",
    "unit": "metres",
    "answerValue": 2000,
    "decompositionHint": "Manufacturers quote roughly two kilometres for a standard refill.",
    "strategy": "recall-sanity",
    "source": "Pen manufacturer specifications"
  },
  {
    "id": "rubbish-thrown-away-in-a-lifetime",
    "prompt": "How many tonnes of household waste does one person throw away in a lifetime?",
    "unit": "tonnes",
    "answerValue": 45,
    "decompositionHint": "Roughly 1.6 kilograms a day in a wealthy country, across 75 years.",
    "strategy": "rate-time",
    "source": "Municipal waste generation statistics"
  },
  {
    "id": "plastic-in-a-supermarket-shop",
    "prompt": "How many grams of plastic packaging come home with an average weekly supermarket shop?",
    "unit": "grams",
    "answerValue": 400,
    "decompositionHint": "Almost everything is wrapped, though most items carry only a few grams each.",
    "strategy": "chain-multiply",
    "source": "Packaging waste audits"
  },
  {
    "id": "cardboard-boxes-delivered-per-year",
    "prompt": "How many cardboard parcels are delivered worldwide each year?",
    "asOf": 2025,
    "unit": "parcels",
    "answerValue": 160000000000,
    "decompositionHint": "Roughly 20 parcels a year for every person alive, concentrated in a handful of countries.",
    "strategy": "population-rate",
    "source": "Global parcel shipping index reports"
  },
  {
    "id": "fish-in-a-coral-reef-hectare",
    "prompt": "How many fish live on one hectare of healthy coral reef?",
    "unit": "fish",
    "answerValue": 5000,
    "decompositionHint": "Reefs are among the densest habitats on Earth, holding a few fish per square metre.",
    "strategy": "area-density",
    "source": "Reef fish census surveys"
  },
  {
    "id": "eggs-a-cod-lays",
    "prompt": "How many eggs does a single female cod release in one spawning?",
    "unit": "eggs",
    "answerValue": 5000000,
    "decompositionHint": "Almost none survive, so the strategy is enormous numbers rather than parental care.",
    "strategy": "recall-sanity",
    "source": "Fisheries biology references"
  },
  {
    "id": "krill-eaten-by-a-blue-whale-per-day",
    "prompt": "How many kilograms of krill does a blue whale eat in a day?",
    "unit": "kilograms",
    "answerValue": 3600,
    "decompositionHint": "Feeding lunges take in tonnes of water at a time during the summer feeding season.",
    "strategy": "recall-sanity",
    "source": "Cetacean feeding ecology studies"
  },
  {
    "id": "plastic-pieces-in-the-ocean",
    "prompt": "How many pieces of plastic are floating in the world's oceans?",
    "asOf": 2025,
    "unit": "pieces",
    "answerValue": 5000000000000,
    "decompositionHint": "Dominated by tiny fragments rather than whole objects, which is what makes it hard to remove.",
    "strategy": "recall-sanity",
    "source": "Ocean plastic survey extrapolations"
  },
  {
    "id": "sharks-killed-per-year",
    "prompt": "How many sharks are killed by humans each year?",
    "asOf": 2025,
    "unit": "sharks",
    "answerValue": 100000000,
    "decompositionHint": "Compare against the handful of people killed by sharks annually.",
    "strategy": "recall-sanity",
    "source": "Marine fisheries mortality estimates"
  },
  {
    "id": "seabirds-on-earth",
    "prompt": "How many seabirds are alive worldwide?",
    "asOf": 2025,
    "unit": "seabirds",
    "answerValue": 1000000000,
    "decompositionHint": "A small fraction of all birds, but they range over most of the planet's surface.",
    "strategy": "recall-sanity",
    "source": "BirdLife International population estimates"
  },
  {
    "id": "migrating-birds-crossing-a-country",
    "prompt": "How many birds migrate across a mid-sized country in one autumn?",
    "unit": "birds",
    "answerValue": 500000000,
    "decompositionHint": "Radar surveys pick up enormous nocturnal movements invisible from the ground.",
    "strategy": "recall-sanity",
    "source": "Weather radar ornithology studies"
  },
  {
    "id": "worms-in-a-hectare-of-soil",
    "prompt": "How many earthworms live in one hectare of good pasture soil?",
    "unit": "earthworms",
    "answerValue": 2000000,
    "decompositionHint": "A few hundred per square metre in healthy soil, and a hectare is ten thousand of those.",
    "strategy": "area-density",
    "source": "Soil ecology surveys"
  },
  {
    "id": "mass-of-earthworms-vs-livestock",
    "prompt": "How many times the mass of all humans do the world's earthworms weigh?",
    "unit": "times",
    "answerValue": 0.5,
    "decompositionHint": "Estimated global earthworm biomass against roughly 400 million tonnes of people.",
    "strategy": "anchor-scale",
    "source": "Derived from soil biomass estimates"
  },
  {
    "id": "spiders-in-a-house",
    "prompt": "How many spiders live in an average house at any time?",
    "unit": "spiders",
    "answerValue": 60,
    "decompositionHint": "Mostly small and hidden. Surveys of individual homes find dozens of species, let alone individuals.",
    "strategy": "recall-sanity",
    "source": "Household arthropod surveys"
  },
  {
    "id": "insects-eaten-by-a-bat-per-night",
    "prompt": "How many insects does a single bat eat in one night?",
    "unit": "insects",
    "answerValue": 3000,
    "decompositionHint": "A bat can eat close to its own body weight, and a mosquito weighs a couple of milligrams.",
    "strategy": "divide-total",
    "source": "Bat foraging ecology studies"
  },
  {
    "id": "pollination-visits-by-one-bee-per-day",
    "prompt": "How many flowers does a single honeybee visit in one day?",
    "unit": "flowers",
    "answerValue": 2000,
    "decompositionHint": "Ten or so foraging trips, each visiting a couple of hundred flowers.",
    "strategy": "chain-multiply",
    "source": "Apiculture foraging studies"
  },
  {
    "id": "seeds-a-single-oak-drops",
    "prompt": "How many acorns does a mature oak tree drop in a good year?",
    "unit": "acorns",
    "answerValue": 10000,
    "decompositionHint": "Masting years produce enormous crops, and almost none become trees.",
    "strategy": "recall-sanity",
    "source": "Forestry seed production studies"
  },
  {
    "id": "leaves-fallen-in-a-park-in-autumn",
    "prompt": "How many leaves fall in a one hectare park during autumn?",
    "unit": "leaves",
    "answerValue": 20000000,
    "decompositionHint": "Perhaps 100 mature trees, each shedding a couple of hundred thousand leaves.",
    "strategy": "chain-multiply",
    "source": "Derived from tree density and leaf counts"
  },
  {
    "id": "grass-blades-in-a-lawn",
    "prompt": "How many blades of grass are in a typical suburban lawn?",
    "unit": "blades",
    "answerValue": 10000000,
    "decompositionHint": "Around 200 square metres at several thousand blades per square metre.",
    "strategy": "area-density",
    "source": "Turf density measurements"
  },
  {
    "id": "mushroom-spores-released",
    "prompt": "How many spores does a single mushroom release?",
    "unit": "spores",
    "answerValue": 10000000000,
    "decompositionHint": "Released continuously over days from gills with an enormous combined surface area.",
    "strategy": "recall-sanity",
    "source": "Mycology spore production studies"
  },
  {
    "id": "photosynthesis-carbon-fixed-per-year",
    "prompt": "How many gigatonnes of carbon do plants fix by photosynthesis each year?",
    "unit": "gigatonnes of carbon",
    "answerValue": 120,
    "decompositionHint": "Gross primary production. About half is respired straight back by the plants themselves.",
    "strategy": "recall-sanity",
    "source": "Global carbon cycle assessments"
  },
  {
    "id": "oxygen-from-the-ocean",
    "prompt": "What percentage of the world's oxygen production comes from ocean plankton?",
    "unit": "percent",
    "answerValue": 50,
    "decompositionHint": "Rainforests get the attention, but microscopic marine life does about half the work.",
    "strategy": "recall-sanity",
    "source": "Marine primary production studies"
  },
  {
    "id": "ants-per-square-metre-of-rainforest",
    "prompt": "How many ants live in one square metre of rainforest floor?",
    "unit": "ants",
    "answerValue": 800,
    "decompositionHint": "Ants and termites together can make up a large share of all animal biomass in a rainforest.",
    "strategy": "recall-sanity",
    "source": "Tropical entomology surveys"
  },
  {
    "id": "atoms-in-a-teaspoon-of-water",
    "prompt": "How many atoms are in one teaspoon of water?",
    "unit": "atoms",
    "answerValue": 5e+23,
    "decompositionHint": "Five grams is about 0.28 moles, and each water molecule contributes three atoms.",
    "strategy": "molar",
    "source": "Derived from molar mass and Avogadro's number"
  },
  {
    "id": "moles-of-air-in-a-room",
    "prompt": "How many moles of air are in an average bedroom?",
    "unit": "moles",
    "answerValue": 1600,
    "decompositionHint": "About 36 cubic metres, and a mole of gas occupies roughly 24 litres at room temperature.",
    "strategy": "molar",
    "source": "Derived from molar volume at ambient conditions"
  },
  {
    "id": "energy-to-melt-a-kilogram-of-ice",
    "prompt": "How many kilojoules does it take to melt one kilogram of ice at zero degrees?",
    "unit": "kilojoules",
    "answerValue": 334,
    "decompositionHint": "The latent heat of fusion. It takes no temperature change at all, only energy.",
    "strategy": "energy-balance",
    "source": "Standard thermodynamic tables"
  },
  {
    "id": "energy-to-boil-away-a-litre",
    "prompt": "How many kilojoules are needed to boil away one litre of water already at 100 degrees?",
    "unit": "kilojoules",
    "answerValue": 2260,
    "decompositionHint": "Latent heat of vaporisation, which is far larger than the heat needed to raise it to boiling in the first place.",
    "strategy": "energy-balance",
    "source": "Standard thermodynamic tables"
  },
  {
    "id": "molecules-in-a-breath-of-air",
    "prompt": "How many nitrogen molecules are in a single breath?",
    "unit": "molecules",
    "answerValue": 1e+22,
    "decompositionHint": "Half a litre of air is about 0.02 moles, and roughly 78 percent of it is nitrogen.",
    "strategy": "molar",
    "source": "Derived from molar volume and atmospheric composition"
  },
  {
    "id": "half-life-doses-of-caffeine",
    "prompt": "How many hours does it take for half the caffeine in a coffee to leave the body?",
    "unit": "hours",
    "answerValue": 5,
    "decompositionHint": "Which is why an afternoon coffee is still a quarter present at bedtime.",
    "strategy": "exponential",
    "source": "Pharmacokinetic studies of caffeine"
  },
  {
    "id": "iron-in-the-human-body",
    "prompt": "How many grams of iron are in an adult human body?",
    "unit": "grams",
    "answerValue": 4,
    "decompositionHint": "Most of it is in haemoglobin. About enough for a small nail.",
    "strategy": "recall-sanity",
    "source": "Nutritional biochemistry references"
  },
  {
    "id": "carbon-atoms-in-a-breath-of-co2",
    "prompt": "How many carbon dioxide molecules does a person exhale in one breath?",
    "unit": "molecules",
    "answerValue": 500000000000000000000,
    "decompositionHint": "Exhaled air is about 4 percent carbon dioxide, from roughly 0.02 moles of air.",
    "strategy": "molar",
    "source": "Derived from respiratory gas composition"
  },
  {
    "id": "pressure-at-the-bottom-of-the-ocean",
    "prompt": "How many atmospheres of pressure are there at the deepest point in the ocean?",
    "unit": "atmospheres",
    "answerValue": 1100,
    "decompositionHint": "Roughly one extra atmosphere for every ten metres of depth, and the trench is nearly eleven kilometres deep.",
    "strategy": "rate-time",
    "source": "Derived from hydrostatic pressure"
  },
  {
    "id": "speed-of-sound-in-water",
    "prompt": "How many metres per second does sound travel in seawater?",
    "unit": "metres per second",
    "answerValue": 1500,
    "decompositionHint": "Over four times its speed in air, which is why whales can communicate across ocean basins.",
    "strategy": "recall-sanity",
    "source": "Underwater acoustics references"
  },
  {
    "id": "energy-in-a-lithium-battery-pack",
    "prompt": "How many kilowatt-hours does an electric car battery pack store?",
    "asOf": 2025,
    "unit": "kilowatt-hours",
    "answerValue": 75,
    "decompositionHint": "About four days of a typical household's electricity, carried around on wheels.",
    "strategy": "anchor-scale",
    "source": "Electric vehicle specifications"
  },
  {
    "id": "energy-density-petrol-vs-battery",
    "prompt": "How many times more energy does a kilogram of petrol hold than a kilogram of lithium battery?",
    "unit": "times",
    "answerValue": 60,
    "decompositionHint": "Petrol is about 45 megajoules per kilogram, a battery around 0.75.",
    "strategy": "anchor-scale",
    "source": "Derived from published energy densities"
  },
  {
    "id": "photons-in-a-laser-pointer-second",
    "prompt": "How many photons does a laser pointer emit each second?",
    "unit": "photons",
    "answerValue": 3000000000000000,
    "decompositionHint": "One milliwatt divided by the energy of a red photon, about 3x10^-19 joules.",
    "strategy": "divide-total",
    "source": "Derived from output power and photon energy"
  },
  {
    "id": "electrons-in-a-lightning-strike",
    "prompt": "How many electrons flow in a single lightning strike?",
    "unit": "electrons",
    "answerValue": 90000000000000000000,
    "decompositionHint": "About 15 coulombs of charge, and each electron carries 1.6x10^-19 coulombs.",
    "strategy": "divide-total",
    "source": "Derived from typical stroke charge transfer"
  },
  {
    "id": "electricity-in-a-household-per-day-in-joules",
    "prompt": "How many megajoules of electricity does a household use in a day?",
    "unit": "megajoules",
    "answerValue": 36,
    "decompositionHint": "About 10 kilowatt-hours, and a kilowatt-hour is 3.6 megajoules.",
    "strategy": "unit-conversion",
    "source": "Derived from household consumption figures"
  },
  {
    "id": "force-to-lift-a-car",
    "prompt": "How many newtons of force are needed to lift a small car?",
    "unit": "newtons",
    "answerValue": 12000,
    "decompositionHint": "About 1,200 kilograms times gravitational acceleration of 9.8.",
    "strategy": "chain-multiply",
    "source": "Derived from vehicle mass"
  },
  {
    "id": "atoms-thick-is-gold-leaf",
    "prompt": "How many atoms thick is a sheet of gold leaf?",
    "unit": "atoms",
    "answerValue": 400,
    "decompositionHint": "Gold leaf is about 100 nanometres thick and a gold atom is roughly 0.29 nanometres across.",
    "strategy": "divide-total",
    "source": "Derived from leaf thickness and atomic radius"
  },
  {
    "id": "temperature-doubling-of-reaction-rate",
    "prompt": "By how many degrees Celsius must temperature rise to roughly double a chemical reaction rate?",
    "unit": "degrees Celsius",
    "answerValue": 10,
    "decompositionHint": "A rule of thumb from the Arrhenius relationship, useful for cooking and for spoilage alike.",
    "strategy": "recall-sanity",
    "source": "Chemical kinetics references"
  },
  {
    "id": "traffic-lights-in-a-city",
    "prompt": "How many traffic lights are there in a city of one million people?",
    "unit": "traffic lights",
    "answerValue": 1200,
    "decompositionHint": "Roughly one signalised junction per thousand people in a developed city.",
    "strategy": "population-rate",
    "source": "Municipal transport infrastructure inventories"
  },
  {
    "id": "parking-spaces-per-car",
    "prompt": "How many parking spaces exist for every car in a developed country?",
    "unit": "spaces",
    "answerValue": 4,
    "decompositionHint": "Home, work, shops and street. Each car needs somewhere to sit at every destination.",
    "strategy": "recall-sanity",
    "source": "Urban parking supply studies"
  },
  {
    "id": "road-markings-paint-per-year",
    "prompt": "How many litres of road marking paint does a country use each year?",
    "unit": "litres",
    "answerValue": 5000000,
    "decompositionHint": "Hundreds of thousands of kilometres of road, with lines repainted every couple of years.",
    "strategy": "area-density",
    "source": "Highway maintenance procurement figures"
  },
  {
    "id": "aircraft-in-service-worldwide",
    "prompt": "How many commercial passenger aircraft are in service worldwide?",
    "asOf": 2025,
    "unit": "aircraft",
    "answerValue": 27000,
    "decompositionHint": "Each one flies several sectors a day, which is how tens of thousands serve billions of journeys.",
    "strategy": "recall-sanity",
    "source": "Aviation fleet databases"
  },
  {
    "id": "runways-worldwide",
    "prompt": "How many paved runways exist worldwide?",
    "asOf": 2025,
    "unit": "runways",
    "answerValue": 15000,
    "decompositionHint": "Far fewer than the airport count, since most airfields are unpaved strips.",
    "strategy": "recall-sanity",
    "source": "Global aerodrome databases"
  },
  {
    "id": "air-traffic-controllers-worldwide",
    "prompt": "How many air traffic controllers work worldwide?",
    "asOf": 2025,
    "unit": "controllers",
    "answerValue": 60000,
    "decompositionHint": "A surprisingly small profession for the volume of traffic it handles.",
    "strategy": "recall-sanity",
    "source": "Civil aviation workforce statistics"
  },
  {
    "id": "luggage-lost-per-year",
    "prompt": "How many bags are mishandled by airlines worldwide each year?",
    "asOf": 2025,
    "unit": "bags",
    "answerValue": 36000000,
    "decompositionHint": "Around 7 bags per thousand passengers, across billions of journeys.",
    "strategy": "population-rate",
    "source": "SITA baggage IT insights reports"
  },
  {
    "id": "distance-flown-by-a-jet-in-its-life",
    "prompt": "How many kilometres does an airliner fly over its service life?",
    "unit": "kilometres",
    "answerValue": 100000000,
    "decompositionHint": "Around 3,000 flight hours a year at 800 kilometres an hour, for a couple of decades.",
    "strategy": "rate-time",
    "source": "Aircraft utilisation and retirement data"
  },
  {
    "id": "shipping-fuel-per-year",
    "prompt": "How many million tonnes of fuel does global shipping burn each year?",
    "asOf": 2025,
    "unit": "million tonnes",
    "answerValue": 300,
    "decompositionHint": "Shipping carries most world trade on a few percent of world oil consumption.",
    "strategy": "recall-sanity",
    "source": "IMO greenhouse gas studies"
  },
  {
    "id": "containers-lost-at-sea-per-year",
    "prompt": "How many shipping containers are lost overboard each year?",
    "asOf": 2025,
    "unit": "containers",
    "answerValue": 1500,
    "decompositionHint": "Tiny against the roughly 250 million container movements a year, but each one is a hazard.",
    "strategy": "recall-sanity",
    "source": "World Shipping Council container loss reports"
  },
  {
    "id": "sleepers-in-a-kilometre-of-track",
    "prompt": "How many sleepers are laid under one kilometre of railway track?",
    "unit": "sleepers",
    "answerValue": 1650,
    "decompositionHint": "Spaced about 60 centimetres apart along the line.",
    "strategy": "divide-total",
    "source": "Permanent way engineering standards"
  },
  {
    "id": "escalator-steps-in-a-metro-system",
    "prompt": "How many escalator steps are there in a large city metro system?",
    "unit": "steps",
    "answerValue": 30000,
    "decompositionHint": "A few hundred escalators, each carrying on the order of a hundred steps in its loop.",
    "strategy": "chain-multiply",
    "source": "Metro infrastructure inventories"
  },
  {
    "id": "lifts-in-a-city",
    "prompt": "How many lifts operate in a city of one million people?",
    "unit": "lifts",
    "answerValue": 12000,
    "decompositionHint": "Roughly one lift per 80 people in a developed city with tall buildings.",
    "strategy": "population-rate",
    "source": "Lift industry installed-base estimates"
  },
  {
    "id": "distance-a-lift-travels-per-year",
    "prompt": "How many kilometres does a busy office lift travel in a year?",
    "unit": "kilometres",
    "answerValue": 3500,
    "decompositionHint": "Perhaps 300 trips a day averaging 30 metres, every working day.",
    "strategy": "rate-time",
    "source": "Lift usage engineering estimates"
  },
  {
    "id": "taxi-trips-per-day-worldwide",
    "prompt": "How many taxi and ride-hail trips are taken worldwide each day?",
    "asOf": 2025,
    "unit": "trips",
    "answerValue": 100000000,
    "decompositionHint": "Ride-hailing alone reports tens of millions daily, before traditional taxis.",
    "strategy": "recall-sanity",
    "source": "Ride-hailing platform disclosures"
  },
  {
    "id": "fuel-saved-by-cycling-to-work",
    "prompt": "How many litres of petrol does someone save in a year by cycling 10 kilometres to work instead of driving?",
    "unit": "litres",
    "answerValue": 230,
    "decompositionHint": "Twenty kilometres round trip, 230 working days, at about 7 litres per 100 kilometres.",
    "strategy": "chain-multiply",
    "source": "Derived from commuting distance and vehicle efficiency"
  },
  {
    "id": "potholes-repaired-per-year",
    "prompt": "How many potholes are repaired in a mid-sized country each year?",
    "asOf": 2025,
    "unit": "potholes",
    "answerValue": 2000000,
    "decompositionHint": "Hundreds of thousands of kilometres of road, freezing and thawing every winter.",
    "strategy": "recall-sanity",
    "source": "Highway maintenance reporting"
  },
  {
    "id": "banknotes-in-circulation-worldwide",
    "prompt": "How many banknotes are in circulation worldwide?",
    "asOf": 2025,
    "unit": "banknotes",
    "answerValue": 500000000000,
    "decompositionHint": "Cash use is falling in many countries but the number of physical notes has kept rising.",
    "strategy": "recall-sanity",
    "source": "Central bank currency in circulation reports"
  },
  {
    "id": "lifetime-of-a-banknote",
    "prompt": "How many months does a low denomination banknote stay in circulation before it is destroyed?",
    "unit": "months",
    "answerValue": 18,
    "decompositionHint": "Small notes change hands constantly and wear out fastest. Large notes last years.",
    "strategy": "recall-sanity",
    "source": "Central bank note lifecycle data"
  },
  {
    "id": "atm-cash-dispensed-per-year",
    "prompt": "How many trillion US dollars are withdrawn from ATMs worldwide each year?",
    "asOf": 2025,
    "unit": "trillion US dollars",
    "answerValue": 10,
    "decompositionHint": "Millions of machines, each dispensing tens of thousands of dollars a week.",
    "strategy": "chain-multiply",
    "source": "ATM industry association data"
  },
  {
    "id": "value-of-world-stock-markets",
    "prompt": "How many trillion US dollars are the world's listed companies worth in total?",
    "asOf": 2025,
    "unit": "trillion US dollars",
    "answerValue": 120,
    "decompositionHint": "Roughly one year of world economic output, though the ratio swings widely.",
    "strategy": "anchor-scale",
    "source": "World Federation of Exchanges market capitalisation data"
  },
  {
    "id": "insurance-claims-per-year",
    "prompt": "How many insurance claims are filed worldwide each year?",
    "asOf": 2025,
    "unit": "claims",
    "answerValue": 500000000,
    "decompositionHint": "Motor claims alone run into the hundreds of millions.",
    "strategy": "recall-sanity",
    "source": "Global insurance industry statistics"
  },
  {
    "id": "coins-lost-per-year",
    "prompt": "How many coins are lost or taken out of circulation each year in a large country?",
    "unit": "coins",
    "answerValue": 2000000000,
    "decompositionHint": "Down the back of sofas, in jars, and in car footwells. Mints replace them constantly.",
    "strategy": "stock-flow",
    "source": "Mint production and circulation studies"
  },
  {
    "id": "charitable-giving-worldwide",
    "prompt": "How many billion US dollars are given to charity worldwide each year?",
    "asOf": 2025,
    "unit": "billion US dollars",
    "answerValue": 800,
    "decompositionHint": "Individual giving dominates, well ahead of corporate and foundation grants.",
    "strategy": "recall-sanity",
    "source": "Global philanthropy reports"
  },
  {
    "id": "tax-collected-worldwide",
    "prompt": "How many trillion US dollars in tax do the world's governments collect each year?",
    "asOf": 2025,
    "unit": "trillion US dollars",
    "answerValue": 30,
    "decompositionHint": "Roughly a third of world economic output, though the share varies hugely by country.",
    "strategy": "anchor-scale",
    "source": "IMF government finance statistics"
  },
  {
    "id": "cost-of-raising-a-child",
    "prompt": "How many US dollars does it cost to raise a child to eighteen in a wealthy country?",
    "asOf": 2025,
    "unit": "US dollars",
    "answerValue": 300000,
    "decompositionHint": "Housing, food and childcare dominate. Around 17,000 a year for eighteen years.",
    "strategy": "rate-time",
    "source": "National cost of raising a child studies"
  },
  {
    "id": "counterfeit-notes-per-million",
    "prompt": "How many counterfeit notes are found per million genuine notes in circulation?",
    "asOf": 2025,
    "unit": "notes",
    "answerValue": 15,
    "decompositionHint": "Rare enough that most people never see one, though it varies by currency.",
    "strategy": "recall-sanity",
    "source": "Central bank counterfeit statistics"
  },
  {
    "id": "vending-machines-worldwide",
    "prompt": "How many vending machines are there worldwide?",
    "asOf": 2025,
    "unit": "vending machines",
    "answerValue": 15000000,
    "decompositionHint": "Japan alone has several million, at roughly one per 25 people.",
    "strategy": "recall-sanity",
    "source": "Vending industry association estimates"
  },
  {
    "id": "advertising-impressions-per-person-per-day",
    "prompt": "How many advertisements does an average person encounter in a day?",
    "asOf": 2025,
    "unit": "advertisements",
    "answerValue": 6000,
    "decompositionHint": "Counting every logo, banner and pre-roll, not just the ones anyone notices.",
    "strategy": "recall-sanity",
    "source": "Marketing exposure studies"
  },
  {
    "id": "shopping-trolleys-in-use",
    "prompt": "How many shopping trolleys are in use worldwide?",
    "asOf": 2025,
    "unit": "trolleys",
    "answerValue": 30000000,
    "decompositionHint": "Hundreds of thousands of supermarkets, each with a few hundred.",
    "strategy": "population-rate",
    "source": "Retail equipment industry estimates"
  },
  {
    "id": "barcodes-scanned-per-day",
    "prompt": "How many barcodes are scanned worldwide each day?",
    "asOf": 2025,
    "unit": "scans",
    "answerValue": 10000000000,
    "decompositionHint": "Retail checkouts alone, before counting logistics and warehousing.",
    "strategy": "recall-sanity",
    "source": "GS1 published scanning estimates"
  },
  {
    "id": "receipts-printed-per-year",
    "prompt": "How many till receipts are printed worldwide each year?",
    "asOf": 2025,
    "unit": "receipts",
    "answerValue": 300000000000,
    "decompositionHint": "Roughly one per retail transaction, most discarded within minutes.",
    "strategy": "recall-sanity",
    "source": "Thermal paper industry estimates"
  },
  {
    "id": "hours-worked-per-year-per-person",
    "prompt": "How many hours does an average full-time worker work in a year?",
    "asOf": 2025,
    "unit": "hours",
    "answerValue": 1750,
    "decompositionHint": "Around 38 hours a week for 46 weeks, once holidays are taken out. Varies widely by country.",
    "strategy": "rate-time",
    "source": "OECD average annual hours worked"
  },
  {
    "id": "value-of-unpaid-household-work",
    "prompt": "What percentage of world economic output would unpaid household work be worth if counted?",
    "unit": "percent",
    "answerValue": 40,
    "decompositionHint": "Cooking, cleaning and caring, valued at what it would cost to hire out.",
    "strategy": "recall-sanity",
    "source": "Time-use and satellite account studies"
  },
  {
    "id": "people-paid-in-cash-worldwide",
    "prompt": "How many adults worldwide have no bank account?",
    "asOf": 2025,
    "unit": "adults",
    "answerValue": 1300000000,
    "decompositionHint": "Down sharply over two decades, largely thanks to mobile money.",
    "strategy": "recall-sanity",
    "source": "World Bank Global Findex database"
  },
  {
    "id": "characters-in-a-tweet-worldwide-per-day",
    "prompt": "How many characters are posted to social media worldwide each day?",
    "asOf": 2025,
    "unit": "characters",
    "answerValue": 50000000000000,
    "decompositionHint": "Billions of posts averaging a few dozen words each.",
    "strategy": "population-rate",
    "source": "Derived from platform posting volumes"
  },
  {
    "id": "words-in-the-oxford-english-dictionary",
    "prompt": "How many words are defined in the full Oxford English Dictionary?",
    "asOf": 2025,
    "unit": "words",
    "answerValue": 600000,
    "decompositionHint": "Counting historical and obsolete forms, far more than any speaker knows.",
    "strategy": "recall-sanity",
    "source": "Oxford English Dictionary published figures"
  },
  {
    "id": "letters-in-a-days-writing",
    "prompt": "How many letters does an office worker type in a working day?",
    "unit": "letters",
    "answerValue": 20000,
    "decompositionHint": "Perhaps 4,000 words of email and documents at five letters a word.",
    "strategy": "chain-multiply",
    "source": "Derived from typical daily output"
  },
  {
    "id": "characters-in-the-chinese-writing-system",
    "prompt": "How many distinct characters exist in the Chinese writing system?",
    "unit": "characters",
    "answerValue": 50000,
    "decompositionHint": "Comprehensive dictionaries list tens of thousands, though literacy needs only a few thousand.",
    "strategy": "recall-sanity",
    "source": "Chinese lexicographic references"
  },
  {
    "id": "languages-that-will-disappear",
    "prompt": "How many of the world's languages are expected to disappear this century?",
    "asOf": 2025,
    "unit": "languages",
    "answerValue": 3000,
    "decompositionHint": "Roughly half of some 7,000 living languages, most with only elderly speakers left.",
    "strategy": "recall-sanity",
    "source": "UNESCO endangered languages atlas"
  },
  {
    "id": "books-translated-per-year",
    "prompt": "How many books are translated into another language each year?",
    "asOf": 2025,
    "unit": "books",
    "answerValue": 100000,
    "decompositionHint": "A small fraction of the millions published, and heavily skewed toward a few source languages.",
    "strategy": "recall-sanity",
    "source": "UNESCO Index Translationum"
  },
  {
    "id": "signatures-a-person-writes",
    "prompt": "How many times does a person sign their name in a lifetime?",
    "unit": "signatures",
    "answerValue": 6000,
    "decompositionHint": "A few a week across an adult life, though far fewer now than a generation ago.",
    "strategy": "rate-time",
    "source": "Derived from typical signing frequency"
  },
  {
    "id": "handwriting-speed",
    "prompt": "How many words per minute can an adult write by hand?",
    "unit": "words per minute",
    "answerValue": 20,
    "decompositionHint": "Roughly a third of typing speed, which is why note-taking became typed.",
    "strategy": "recall-sanity",
    "source": "Handwriting speed studies"
  },
  {
    "id": "emoji-sent-per-day",
    "prompt": "How many emoji are sent worldwide each day?",
    "asOf": 2025,
    "unit": "emoji",
    "answerValue": 10000000000,
    "decompositionHint": "Billions of messages, a good share carrying at least one.",
    "strategy": "population-rate",
    "source": "Messaging platform usage reports"
  },
  {
    "id": "spelling-mistakes-in-a-lifetime",
    "prompt": "How many spelling mistakes does a person make in a lifetime of writing?",
    "unit": "mistakes",
    "answerValue": 500000,
    "decompositionHint": "Perhaps one error per 200 words, across tens of millions of words written.",
    "strategy": "chain-multiply",
    "source": "Derived from error rate studies"
  },
  {
    "id": "hours-to-learn-a-language",
    "prompt": "How many hours of study does it take an English speaker to reach fluency in French?",
    "unit": "hours",
    "answerValue": 700,
    "decompositionHint": "A closely related language. Mandarin or Arabic take roughly three times as long.",
    "strategy": "recall-sanity",
    "source": "Foreign Service Institute language difficulty rankings"
  },
  {
    "id": "words-a-toddler-learns-per-day",
    "prompt": "How many new words does a toddler learn each day at peak vocabulary growth?",
    "unit": "words",
    "answerValue": 9,
    "decompositionHint": "Going from a few hundred words at two to several thousand by five.",
    "strategy": "divide-total",
    "source": "Child language acquisition research"
  },
  {
    "id": "sign-language-users-worldwide",
    "prompt": "How many people worldwide use a sign language as their main language?",
    "asOf": 2025,
    "unit": "people",
    "answerValue": 70000000,
    "decompositionHint": "Spread across more than 300 distinct sign languages, which are not mutually intelligible.",
    "strategy": "recall-sanity",
    "source": "World Federation of the Deaf estimates"
  },
  {
    "id": "braille-books-produced",
    "prompt": "How many pages does a novel take when transcribed into braille?",
    "unit": "pages",
    "answerValue": 900,
    "decompositionHint": "Braille cells are large and cannot be shrunk, so a book swells to several volumes.",
    "strategy": "anchor-scale",
    "source": "Braille transcription standards"
  },
  {
    "id": "keyboard-layouts-in-use",
    "prompt": "How many distinct keyboard layouts are in common use worldwide?",
    "asOf": 2025,
    "unit": "layouts",
    "answerValue": 100,
    "decompositionHint": "Most are national variants of QWERTY, but scripts like Arabic and Devanagari need their own.",
    "strategy": "recall-sanity",
    "source": "Unicode and localisation references"
  },
  {
    "id": "unicode-characters-defined",
    "prompt": "How many characters are defined in the Unicode standard?",
    "asOf": 2025,
    "unit": "characters",
    "answerValue": 155000,
    "decompositionHint": "Chinese, Japanese and Korean ideographs make up the majority.",
    "strategy": "recall-sanity",
    "source": "Unicode Consortium published counts"
  },
  {
    "id": "newspapers-still-printed",
    "prompt": "How many daily newspapers are still printed worldwide?",
    "asOf": 2025,
    "unit": "newspapers",
    "answerValue": 7000,
    "decompositionHint": "Down sharply in the West, but still substantial in India and parts of Asia.",
    "strategy": "recall-sanity",
    "source": "World Association of News Publishers data"
  },
  {
    "id": "podcast-episodes-published-per-day",
    "prompt": "How many podcast episodes are published worldwide each day?",
    "asOf": 2025,
    "unit": "episodes",
    "answerValue": 50000,
    "decompositionHint": "Millions of shows, most publishing rarely, a few publishing daily.",
    "strategy": "recall-sanity",
    "source": "Podcast index statistics"
  },
  {
    "id": "letters-in-all-books-ever-printed",
    "prompt": "How many characters are in every book ever printed?",
    "unit": "characters",
    "answerValue": 100000000000000,
    "decompositionHint": "Around 130 million distinct titles at roughly 500,000 characters each, ignoring copies.",
    "strategy": "chain-multiply",
    "source": "Derived from Google Books title estimates"
  },
  {
    "id": "speed-of-speech",
    "prompt": "How many words per minute does a person speak in normal conversation?",
    "unit": "words per minute",
    "answerValue": 140,
    "decompositionHint": "Audiobook narration is deliberately slower, and auctioneers far faster.",
    "strategy": "recall-sanity",
    "source": "Speech rate studies"
  },
  {
    "id": "wind-turbines-worldwide",
    "prompt": "How many wind turbines are operating worldwide?",
    "asOf": 2025,
    "unit": "turbines",
    "answerValue": 400000,
    "decompositionHint": "About a terawatt of capacity at a few megawatts a turbine.",
    "strategy": "divide-total",
    "source": "Global Wind Energy Council statistics"
  },
  {
    "id": "solar-panels-installed-worldwide",
    "prompt": "How many solar panels have been installed worldwide?",
    "asOf": 2025,
    "unit": "panels",
    "answerValue": 5000000000,
    "decompositionHint": "Around two terawatts of capacity, and a panel is a few hundred watts.",
    "strategy": "divide-total",
    "source": "IEA photovoltaic installation data"
  },
  {
    "id": "coal-power-stations-worldwide",
    "prompt": "How many coal-fired power stations are operating worldwide?",
    "asOf": 2025,
    "unit": "power stations",
    "answerValue": 2400,
    "decompositionHint": "China operates roughly half of global capacity.",
    "strategy": "recall-sanity",
    "source": "Global Energy Monitor coal plant tracker"
  },
  {
    "id": "nuclear-reactors-operating",
    "prompt": "How many nuclear power reactors are operating worldwide?",
    "asOf": 2025,
    "unit": "reactors",
    "answerValue": 440,
    "decompositionHint": "Supplying roughly a tenth of world electricity from a surprisingly small number of units.",
    "strategy": "recall-sanity",
    "source": "IAEA Power Reactor Information System"
  },
  {
    "id": "electricity-transmission-line-length",
    "prompt": "How many kilometres of high voltage transmission line exist worldwide?",
    "asOf": 2025,
    "unit": "kilometres",
    "answerValue": 7000000,
    "decompositionHint": "Enough to reach the Moon and back roughly nine times.",
    "strategy": "recall-sanity",
    "source": "IEA electricity networks analysis"
  },
  {
    "id": "electricity-lost-in-transmission",
    "prompt": "What percentage of electricity is lost between power station and socket?",
    "unit": "percent",
    "answerValue": 8,
    "decompositionHint": "Resistance in lines and transformers. Higher voltage means lower loss, which is why grids use it.",
    "strategy": "recall-sanity",
    "source": "World Bank transmission loss statistics"
  },
  {
    "id": "oil-wells-worldwide",
    "prompt": "How many oil wells are producing worldwide?",
    "asOf": 2025,
    "unit": "wells",
    "answerValue": 1000000,
    "decompositionHint": "Most are stripper wells producing only a few barrels a day.",
    "strategy": "recall-sanity",
    "source": "Petroleum industry well counts"
  },
  {
    "id": "gas-flared-per-year",
    "prompt": "How many billion cubic metres of natural gas are flared each year?",
    "asOf": 2025,
    "unit": "billion cubic metres",
    "answerValue": 145,
    "decompositionHint": "Roughly enough to supply the whole of sub-Saharan Africa with electricity, burned off as waste.",
    "strategy": "recall-sanity",
    "source": "World Bank Global Gas Flaring Reduction data"
  },
  {
    "id": "batteries-in-grid-storage",
    "prompt": "How many gigawatt-hours of grid battery storage are installed worldwide?",
    "asOf": 2025,
    "unit": "gigawatt-hours",
    "answerValue": 350,
    "decompositionHint": "Growing several fold in a few years, but still minutes rather than days of world demand.",
    "strategy": "recall-sanity",
    "source": "IEA energy storage tracking"
  },
  {
    "id": "hydropower-share-of-electricity",
    "prompt": "What percentage of world electricity comes from hydropower?",
    "asOf": 2025,
    "unit": "percent",
    "answerValue": 14,
    "decompositionHint": "Still the largest renewable source of electricity, ahead of wind and solar combined until recently.",
    "strategy": "recall-sanity",
    "source": "IEA electricity statistics"
  },
  {
    "id": "energy-to-make-a-tonne-of-steel",
    "prompt": "How many gigajoules of energy does it take to make one tonne of steel?",
    "unit": "gigajoules",
    "answerValue": 20,
    "decompositionHint": "Primary production from ore uses far more than recycling from scrap.",
    "strategy": "energy-balance",
    "source": "World Steel Association energy intensity data"
  },
  {
    "id": "energy-to-make-a-smartphone",
    "prompt": "How many kilowatt-hours of energy go into manufacturing one smartphone?",
    "unit": "kilowatt-hours",
    "answerValue": 250,
    "decompositionHint": "Chip fabrication dominates. Manufacturing far outweighs the energy the phone uses in its life.",
    "strategy": "energy-balance",
    "source": "Product lifecycle assessments"
  },
  {
    "id": "water-to-make-a-t-shirt",
    "prompt": "How many litres of water does it take to make one cotton t-shirt?",
    "unit": "litres",
    "answerValue": 2700,
    "decompositionHint": "Almost all of it is irrigation for the cotton, not the factory.",
    "strategy": "divide-total",
    "source": "Water footprint network assessments"
  },
  {
    "id": "water-to-make-a-car",
    "prompt": "How many litres of water are used to manufacture one car?",
    "unit": "litres",
    "answerValue": 400000,
    "decompositionHint": "Steel, plastics, tyres and paint all carry their own water footprint before assembly.",
    "strategy": "chain-multiply",
    "source": "Automotive lifecycle assessments"
  },
  {
    "id": "electricity-for-a-hot-shower",
    "prompt": "How many kilowatt-hours does an eight minute electric shower use?",
    "unit": "kilowatt-hours",
    "answerValue": 1.2,
    "decompositionHint": "Around a 9 kilowatt heater running for eight minutes.",
    "strategy": "rate-time",
    "source": "Derived from electric shower ratings"
  },
  {
    "id": "gas-to-heat-a-house-per-winter",
    "prompt": "How many kilowatt-hours of gas does a house use for heating over one winter?",
    "unit": "kilowatt-hours",
    "answerValue": 9000,
    "decompositionHint": "Most of a typical home's annual energy, concentrated into a few cold months.",
    "strategy": "recall-sanity",
    "source": "Domestic energy consumption statistics"
  },
  {
    "id": "energy-in-a-days-food",
    "prompt": "How many megajoules of energy does a person eat in a day?",
    "unit": "megajoules",
    "answerValue": 10,
    "decompositionHint": "About 2,400 kilocalories, and a kilocalorie is 4.2 kilojoules.",
    "strategy": "unit-conversion",
    "source": "Derived from dietary energy intake"
  },
  {
    "id": "human-power-output-cycling",
    "prompt": "How many watts can a fit amateur cyclist sustain for an hour?",
    "unit": "watts",
    "answerValue": 250,
    "decompositionHint": "About enough to run a few light bulbs. Tour professionals manage around 400.",
    "strategy": "recall-sanity",
    "source": "Cycling power output measurements"
  },
  {
    "id": "snow-crystals-in-a-snowman",
    "prompt": "How many snow crystals are in an average snowman?",
    "unit": "snow crystals",
    "answerValue": 10000000000000,
    "decompositionHint": "Perhaps 200 litres of packed snow, and a crystal weighs a few micrograms.",
    "strategy": "divide-total",
    "source": "Derived from snow density and crystal mass"
  },
  {
    "id": "hailstones-in-a-storm",
    "prompt": "How many hailstones fall on one square kilometre during a severe hailstorm?",
    "unit": "hailstones",
    "answerValue": 1000000000,
    "decompositionHint": "A centimetre of hail spread over a square kilometre, in stones a couple of centimetres across.",
    "strategy": "divide-total",
    "source": "Derived from hail accumulation measurements"
  },
  {
    "id": "water-in-a-thundercloud",
    "prompt": "How many tonnes of water does a large thundercloud hold?",
    "unit": "tonnes",
    "answerValue": 500000,
    "decompositionHint": "A cubic kilometre of cloud at roughly half a gram of water per cubic metre.",
    "strategy": "area-density",
    "source": "Derived from cloud liquid water content"
  },
  {
    "id": "wind-speed-of-a-hurricane-eye-wall",
    "prompt": "How many kilometres per hour do winds reach in a category five hurricane?",
    "unit": "kilometres per hour",
    "answerValue": 280,
    "decompositionHint": "The threshold for category five is 252 kilometres per hour, and strong ones exceed it comfortably.",
    "strategy": "recall-sanity",
    "source": "Saffir-Simpson hurricane wind scale"
  },
  {
    "id": "rain-in-a-monsoon-season",
    "prompt": "How many millimetres of rain fall in a typical Indian monsoon season?",
    "unit": "millimetres",
    "answerValue": 900,
    "decompositionHint": "About three quarters of India's annual rainfall arrives in four months.",
    "strategy": "recall-sanity",
    "source": "India Meteorological Department records"
  },
  {
    "id": "sunshine-hours-per-year",
    "prompt": "How many hours of sunshine does a temperate European city get in a year?",
    "unit": "hours",
    "answerValue": 1600,
    "decompositionHint": "Out of roughly 4,400 daylight hours, so a good deal of cloud.",
    "strategy": "recall-sanity",
    "source": "National meteorological sunshine records"
  },
  {
    "id": "temperature-range-in-a-desert-day",
    "prompt": "How many degrees Celsius can a desert temperature swing between day and night?",
    "unit": "degrees Celsius",
    "answerValue": 30,
    "decompositionHint": "Dry air holds little heat, so the ground radiates it away quickly after sunset.",
    "strategy": "recall-sanity",
    "source": "Desert climatology records"
  },
  {
    "id": "weather-balloons-launched-per-day",
    "prompt": "How many weather balloons are launched worldwide each day?",
    "asOf": 2025,
    "unit": "balloons",
    "answerValue": 1800,
    "decompositionHint": "Around 900 stations launching twice daily, at synchronised times worldwide.",
    "strategy": "chain-multiply",
    "source": "World Meteorological Organization observing network"
  },
  {
    "id": "lightning-detected-per-second",
    "prompt": "How many lightning flashes occur worldwide every second?",
    "unit": "flashes",
    "answerValue": 45,
    "decompositionHint": "Roughly 1.4 billion a year, divided by the seconds in a year.",
    "strategy": "divide-total",
    "source": "Satellite lightning detection data"
  },
  {
    "id": "clouds-covering-the-earth",
    "prompt": "What percentage of the Earth is covered by cloud at any moment?",
    "unit": "percent",
    "answerValue": 67,
    "decompositionHint": "Rather more than most people guess. Satellite imagery shows the planet is mostly cloudy.",
    "strategy": "recall-sanity",
    "source": "Satellite cloud climatology"
  },
  {
    "id": "tornado-lifetime",
    "prompt": "How many minutes does an average tornado last?",
    "unit": "minutes",
    "answerValue": 10,
    "decompositionHint": "The famous long-track ones run for hours, but they are rare outliers.",
    "strategy": "recall-sanity",
    "source": "Storm Prediction Center tornado statistics"
  },
  {
    "id": "dust-blown-from-the-sahara-per-year",
    "prompt": "How many million tonnes of dust blow off the Sahara each year?",
    "unit": "million tonnes",
    "answerValue": 180,
    "decompositionHint": "Enough to fertilise the Amazon across the Atlantic.",
    "strategy": "recall-sanity",
    "source": "Satellite aerosol transport studies"
  },
  {
    "id": "sea-level-rise-per-year",
    "prompt": "How many millimetres does global sea level rise each year?",
    "asOf": 2025,
    "unit": "millimetres",
    "answerValue": 4.3,
    "decompositionHint": "Thermal expansion and melting ice in roughly equal parts, and the rate is accelerating.",
    "strategy": "recall-sanity",
    "source": "Satellite altimetry records"
  },
  {
    "id": "ozone-layer-thickness",
    "prompt": "How many millimetres thick would the ozone layer be if compressed to sea level pressure?",
    "unit": "millimetres",
    "answerValue": 3,
    "decompositionHint": "The Dobson unit measures exactly this. About 300 Dobson units, each a hundredth of a millimetre.",
    "strategy": "unit-conversion",
    "source": "Atmospheric ozone measurements"
  },
  {
    "id": "air-pressure-drop-per-100m",
    "prompt": "How many hectopascals does air pressure fall for every 100 metres of altitude gained?",
    "unit": "hectopascals",
    "answerValue": 12,
    "decompositionHint": "Near sea level. The rate slows higher up as the air thins.",
    "strategy": "rate-time",
    "source": "Standard atmosphere tables"
  },
  {
    "id": "raindrop-fall-speed",
    "prompt": "How many metres per second does a raindrop fall at terminal velocity?",
    "unit": "metres per second",
    "answerValue": 9,
    "decompositionHint": "Air resistance caps it. A drop from a kilometre up arrives no faster than one from 200 metres.",
    "strategy": "recall-sanity",
    "source": "Atmospheric physics measurements"
  },
  {
    "id": "time-for-a-cloud-droplet-to-become-rain",
    "prompt": "How many times must a cloud droplet grow in volume to become a raindrop?",
    "unit": "times",
    "answerValue": 1000000,
    "decompositionHint": "From about 10 microns to about 1 millimetre in radius, and volume scales with the cube.",
    "strategy": "exponential",
    "source": "Derived from droplet and raindrop sizes"
  },
  {
    "id": "snow-to-water-ratio",
    "prompt": "How many centimetres of fresh snow melt down to one centimetre of water?",
    "unit": "centimetres",
    "answerValue": 10,
    "decompositionHint": "Fresh snow is mostly air. Wet heavy snow can be nearer five to one.",
    "strategy": "recall-sanity",
    "source": "Snow hydrology references"
  },
  {
    "id": "days-of-rain-in-a-rainforest",
    "prompt": "How many days a year does it rain in a tropical rainforest?",
    "unit": "days",
    "answerValue": 240,
    "decompositionHint": "Not quite every day, but close enough that dry spells are the exception.",
    "strategy": "recall-sanity",
    "source": "Tropical climate station records"
  },
  {
    "id": "coastline-length-of-the-world",
    "prompt": "How many kilometres is the total coastline of all the world's land?",
    "unit": "kilometres",
    "answerValue": 1160000,
    "decompositionHint": "The answer depends on the measuring scale, which is the classic coastline paradox.",
    "strategy": "recall-sanity",
    "source": "World Resources Institute coastline data"
  },
  {
    "id": "time-zones-in-the-world",
    "prompt": "How many distinct time zone offsets are in use worldwide?",
    "asOf": 2025,
    "unit": "offsets",
    "answerValue": 38,
    "decompositionHint": "More than 24, because several places use half-hour and quarter-hour offsets.",
    "strategy": "recall-sanity",
    "source": "IANA time zone database"
  },
  {
    "id": "borders-between-countries",
    "prompt": "How many international land borders are there in the world?",
    "asOf": 2025,
    "unit": "borders",
    "answerValue": 320,
    "decompositionHint": "About 200 countries, most sharing borders with two to five neighbours.",
    "strategy": "recall-sanity",
    "source": "CIA World Factbook boundary data"
  },
  {
    "id": "longest-land-border",
    "prompt": "How many kilometres long is the longest land border between two countries?",
    "unit": "kilometres",
    "answerValue": 8890,
    "decompositionHint": "Canada and the United States, including Alaska.",
    "strategy": "recall-sanity",
    "source": "National boundary surveys"
  },
  {
    "id": "cities-over-a-million-people",
    "prompt": "How many cities worldwide have more than a million inhabitants?",
    "asOf": 2025,
    "unit": "cities",
    "answerValue": 550,
    "decompositionHint": "China and India alone account for well over a third of them.",
    "strategy": "recall-sanity",
    "source": "UN World Urbanization Prospects"
  },
  {
    "id": "highest-permanent-settlement",
    "prompt": "How many metres above sea level is the highest permanently inhabited town?",
    "unit": "metres",
    "answerValue": 5100,
    "decompositionHint": "In the Peruvian Andes, where the air holds about half the oxygen of sea level.",
    "strategy": "recall-sanity",
    "source": "High altitude settlement surveys"
  },
  {
    "id": "deepest-mine",
    "prompt": "How many metres below the surface does the deepest mine reach?",
    "unit": "metres",
    "answerValue": 4000,
    "decompositionHint": "Rock temperature rises about 25 degrees per kilometre, which is the practical limit.",
    "strategy": "recall-sanity",
    "source": "Mining industry depth records"
  },
  {
    "id": "national-parks-worldwide",
    "prompt": "How many national parks are there worldwide?",
    "asOf": 2025,
    "unit": "national parks",
    "answerValue": 6500,
    "decompositionHint": "Part of a wider protected area network covering roughly a sixth of the land surface.",
    "strategy": "recall-sanity",
    "source": "World Database on Protected Areas"
  },
  {
    "id": "share-of-land-that-is-habitable",
    "prompt": "What percentage of Earth's land surface is habitable for humans?",
    "unit": "percent",
    "answerValue": 71,
    "decompositionHint": "Excluding glaciers and barren ground. Of what remains, about half is farmed.",
    "strategy": "recall-sanity",
    "source": "FAO land use statistics"
  },
  {
    "id": "elephants-a-century-ago",
    "prompt": "How many African elephants were alive in 1900?",
    "asOf": 1900,
    "unit": "elephants",
    "answerValue": 10000000,
    "decompositionHint": "Roughly twenty times today's population, before a century of ivory hunting and habitat loss.",
    "strategy": "recall-sanity",
    "source": "Historical wildlife population reconstructions"
  },
  {
    "id": "tigers-in-the-wild",
    "prompt": "How many tigers live in the wild worldwide?",
    "asOf": 2025,
    "unit": "tigers",
    "answerValue": 4500,
    "decompositionHint": "Fewer than are kept in captivity in the United States alone, by some counts.",
    "strategy": "recall-sanity",
    "source": "Global Tiger Forum census data"
  },
  {
    "id": "pandas-in-the-wild",
    "prompt": "How many giant pandas live in the wild?",
    "asOf": 2025,
    "unit": "pandas",
    "answerValue": 1900,
    "decompositionHint": "Recovered enough to be downgraded from endangered to vulnerable, but still a small population.",
    "strategy": "recall-sanity",
    "source": "Chinese national panda surveys"
  },
  {
    "id": "domestic-animals-vs-wild-mammals",
    "prompt": "How many times the biomass of all wild land mammals do livestock represent?",
    "unit": "times",
    "answerValue": 15,
    "decompositionHint": "Cattle and pigs vastly outweigh every wild land mammal put together.",
    "strategy": "anchor-scale",
    "source": "Bar-On, Phillips and Milo 2018, PNAS"
  },
  {
    "id": "species-described-per-year",
    "prompt": "How many new species are formally described by scientists each year?",
    "asOf": 2025,
    "unit": "species",
    "answerValue": 18000,
    "decompositionHint": "Mostly insects and other invertebrates, from a backlog that would take centuries to clear.",
    "strategy": "recall-sanity",
    "source": "International Institute for Species Exploration reports"
  },
  {
    "id": "extinctions-per-year",
    "prompt": "How many species are estimated to go extinct each year?",
    "asOf": 2025,
    "unit": "species",
    "answerValue": 20000,
    "decompositionHint": "Mostly undescribed invertebrates, so almost all vanish without ever being catalogued.",
    "strategy": "recall-sanity",
    "source": "IUCN and biodiversity loss assessments"
  },
  {
    "id": "zoos-worldwide",
    "prompt": "How many zoos and aquariums are there worldwide?",
    "asOf": 2025,
    "unit": "zoos",
    "answerValue": 10000,
    "decompositionHint": "Only a few hundred belong to the major accreditation bodies.",
    "strategy": "recall-sanity",
    "source": "World Association of Zoos and Aquariums estimates"
  },
  {
    "id": "honeybee-colonies-worldwide",
    "prompt": "How many managed honeybee colonies are there worldwide?",
    "asOf": 2025,
    "unit": "colonies",
    "answerValue": 100000000,
    "decompositionHint": "Each holding tens of thousands of bees, so the total insect count is astronomical.",
    "strategy": "recall-sanity",
    "source": "FAO livestock statistics"
  },
  {
    "id": "migratory-distance-of-a-humpback",
    "prompt": "How many kilometres does a humpback whale migrate in a year?",
    "unit": "kilometres",
    "answerValue": 16000,
    "decompositionHint": "Polar feeding grounds to tropical breeding grounds and back, twice a year.",
    "strategy": "recall-sanity",
    "source": "Cetacean tracking studies"
  },
  {
    "id": "lifespan-of-a-queen-bee",
    "prompt": "How many times longer does a queen bee live than a worker bee?",
    "unit": "times",
    "answerValue": 30,
    "decompositionHint": "Workers last about six weeks in summer; a queen can last several years on the same genome.",
    "strategy": "anchor-scale",
    "source": "Apiculture references"
  },
  {
    "id": "minutes-in-a-human-lifetime",
    "prompt": "How many minutes does an 80 year life contain?",
    "unit": "minutes",
    "answerValue": 42000000,
    "decompositionHint": "About 29,200 days at 1,440 minutes each.",
    "strategy": "unit-conversion",
    "source": "Derived from life expectancy"
  },
  {
    "id": "heartbeats-per-breath",
    "prompt": "How many heartbeats does a resting adult have per breath?",
    "unit": "heartbeats",
    "answerValue": 5,
    "decompositionHint": "About 70 beats and 14 breaths a minute.",
    "strategy": "divide-total",
    "source": "Derived from resting vital signs"
  },
  {
    "id": "days-until-a-billion-seconds-old",
    "prompt": "At what age in years does a person reach one billion seconds old?",
    "unit": "years",
    "answerValue": 31.7,
    "decompositionHint": "A year is about 31.5 million seconds, so divide a billion by that.",
    "strategy": "unit-conversion",
    "source": "Derived from seconds per year"
  },
  {
    "id": "generations-since-the-romans",
    "prompt": "How many human generations have passed since the height of the Roman Empire?",
    "unit": "generations",
    "answerValue": 65,
    "decompositionHint": "About 1,900 years at roughly 29 years a generation.",
    "strategy": "divide-total",
    "source": "Derived from generation length estimates"
  },
  {
    "id": "generations-since-agriculture",
    "prompt": "How many human generations have passed since farming began?",
    "unit": "generations",
    "answerValue": 400,
    "decompositionHint": "Roughly 12,000 years at about 30 years a generation. Fewer than most people expect.",
    "strategy": "divide-total",
    "source": "Derived from Neolithic dating"
  },
  {
    "id": "ancestors-ten-generations-back",
    "prompt": "How many direct ancestors did you have ten generations ago?",
    "unit": "ancestors",
    "answerValue": 1024,
    "decompositionHint": "The count doubles each generation back, ignoring the overlap that eventually sets in.",
    "strategy": "exponential",
    "source": "Simple genealogical doubling"
  },
  {
    "id": "days-a-year-spent-eating",
    "prompt": "How many days a year does a person spend eating?",
    "unit": "days",
    "answerValue": 32,
    "decompositionHint": "Roughly 75 minutes a day across meals and snacks, totalled over the year.",
    "strategy": "rate-time",
    "source": "Time use survey data"
  },
  {
    "id": "days-a-year-spent-commuting",
    "prompt": "How many days a year does a full-time commuter spend travelling to work?",
    "unit": "days",
    "answerValue": 11,
    "decompositionHint": "About an hour a day round trip, across 230 working days.",
    "strategy": "rate-time",
    "source": "Derived from commuting time surveys"
  },
  {
    "id": "years-spent-looking-at-a-phone",
    "prompt": "How many years of a lifetime does a modern adult spend looking at a phone?",
    "asOf": 2025,
    "unit": "years",
    "answerValue": 9,
    "decompositionHint": "Around three and a half hours a day across 60 adult years.",
    "strategy": "rate-time",
    "source": "Derived from screen time studies"
  },
  {
    "id": "hours-of-meetings-in-a-career",
    "prompt": "How many hours does an office worker spend in meetings over a career?",
    "unit": "hours",
    "answerValue": 12000,
    "decompositionHint": "Perhaps six hours a week across 40 working years.",
    "strategy": "rate-time",
    "source": "Derived from workplace time-use studies"
  },
  {
    "id": "emails-in-a-career",
    "prompt": "How many emails does an office worker send over a career?",
    "unit": "emails",
    "answerValue": 300000,
    "decompositionHint": "About 30 a working day across 40 years.",
    "strategy": "rate-time",
    "source": "Derived from email volume studies"
  },
  {
    "id": "days-of-holiday-in-a-career",
    "prompt": "How many days of paid holiday does a European worker take over a career?",
    "unit": "days",
    "answerValue": 1000,
    "decompositionHint": "Around 25 days a year for 40 years.",
    "strategy": "rate-time",
    "source": "Derived from statutory leave entitlements"
  },
  {
    "id": "school-lessons-attended",
    "prompt": "How many individual lessons does a child attend from age five to eighteen?",
    "unit": "lessons",
    "answerValue": 13000,
    "decompositionHint": "Roughly five lessons a day, 190 days a year, for 13 years.",
    "strategy": "chain-multiply",
    "source": "Derived from school timetables"
  },
  {
    "id": "homework-hours-in-school-years",
    "prompt": "How many hours of homework does a student do across secondary school?",
    "unit": "hours",
    "answerValue": 2000,
    "decompositionHint": "About an hour a night on school nights, for five or six years.",
    "strategy": "rate-time",
    "source": "Derived from homework time surveys"
  },
  {
    "id": "exams-sat-in-a-lifetime",
    "prompt": "How many formal exams does a person sit by the end of university?",
    "unit": "exams",
    "answerValue": 100,
    "decompositionHint": "School qualifications plus several per semester across a degree.",
    "strategy": "recall-sanity",
    "source": "Derived from typical education pathways"
  },
  {
    "id": "words-in-a-phd-thesis",
    "prompt": "How many words are in a typical doctoral thesis?",
    "unit": "words",
    "answerValue": 80000,
    "decompositionHint": "About the length of a novel, though rather less widely read.",
    "strategy": "recall-sanity",
    "source": "University thesis length regulations"
  },
  {
    "id": "citations-of-an-average-paper",
    "prompt": "How many times is an average scientific paper cited?",
    "asOf": 2025,
    "unit": "citations",
    "answerValue": 10,
    "decompositionHint": "Wildly skewed. Most papers are cited a handful of times and a few thousands.",
    "strategy": "recall-sanity",
    "source": "Bibliometric citation distribution studies"
  },
  {
    "id": "papers-never-cited",
    "prompt": "What percentage of scientific papers are never cited by anyone?",
    "asOf": 2025,
    "unit": "percent",
    "answerValue": 20,
    "decompositionHint": "Lower than the often-quoted claims, and it varies enormously by field.",
    "strategy": "recall-sanity",
    "source": "Citation analysis studies"
  },
  {
    "id": "peer-reviews-done-per-year",
    "prompt": "How many peer reviews are carried out worldwide each year?",
    "asOf": 2025,
    "unit": "reviews",
    "answerValue": 10000000,
    "decompositionHint": "A few million submissions, most reviewed by two or three people, plus resubmissions.",
    "strategy": "chain-multiply",
    "source": "Publishing industry peer review estimates"
  },
  {
    "id": "people-needed-for-shared-birthday",
    "prompt": "How many people must be in a room for two to share a birthday with even odds?",
    "unit": "people",
    "answerValue": 23,
    "decompositionHint": "Count the pairs, not the people. Twenty-three people make 253 pairs.",
    "strategy": "combinatorial",
    "source": "Classic birthday problem calculation"
  },
  {
    "id": "shuffles-to-randomise-a-deck",
    "prompt": "How many riffle shuffles are needed to properly randomise a deck of cards?",
    "unit": "shuffles",
    "answerValue": 7,
    "decompositionHint": "Fewer than most people use, and far fewer than the number that feels right.",
    "strategy": "recall-sanity",
    "source": "Bayer and Diaconis 1992"
  },
  {
    "id": "coin-flips-for-ten-heads",
    "prompt": "How many coin flips are needed on average before you see ten heads in a row?",
    "unit": "flips",
    "answerValue": 2046,
    "decompositionHint": "Two to the power of eleven, minus two. Runs are far rarer than intuition suggests.",
    "strategy": "exponential",
    "source": "Expected waiting time for a run"
  },
  {
    "id": "lottery-tickets-to-be-sure",
    "prompt": "How many years of weekly lottery tickets would it take to expect one jackpot?",
    "unit": "years",
    "answerValue": 270000,
    "decompositionHint": "About 14 million to one, played once a week.",
    "strategy": "divide-total",
    "source": "Derived from lottery odds"
  },
  {
    "id": "chance-of-being-struck-by-lightning",
    "prompt": "What is the chance in a million of being struck by lightning in a given year?",
    "unit": "chance in a million",
    "answerValue": 1,
    "decompositionHint": "Roughly one in a million a year in a developed country, so around one in 15,000 over a lifetime.",
    "strategy": "recall-sanity",
    "source": "National weather service statistics"
  },
  {
    "id": "possible-chess-games",
    "prompt": "How many possible chess games are there, to the nearest power of ten?",
    "unit": "power of ten",
    "answerValue": 120,
    "decompositionHint": "The Shannon number. Vastly more than the atoms in the observable universe.",
    "strategy": "combinatorial",
    "source": "Shannon 1950 estimate"
  },
  {
    "id": "ways-to-arrange-a-bookshelf",
    "prompt": "How many ways can 20 books be arranged on a shelf?",
    "unit": "arrangements",
    "answerValue": 2400000000000000000,
    "decompositionHint": "Twenty factorial. Each extra book multiplies the count by the new total.",
    "strategy": "combinatorial",
    "source": "Factorial calculation"
  },
  {
    "id": "handshakes-in-a-room",
    "prompt": "How many handshakes happen if 50 people all shake hands once?",
    "unit": "handshakes",
    "answerValue": 1225,
    "decompositionHint": "Fifty choose two: each pair shakes once, so n times n minus one over two.",
    "strategy": "combinatorial",
    "source": "Combinatorial calculation"
  },
  {
    "id": "possible-phone-numbers",
    "prompt": "How many distinct ten-digit phone numbers are possible?",
    "unit": "numbers",
    "answerValue": 10000000000,
    "decompositionHint": "Ten choices per digit, ten digits, before any reserved prefixes are removed.",
    "strategy": "combinatorial",
    "source": "Numbering plan arithmetic"
  },
  {
    "id": "possible-car-number-plates",
    "prompt": "How many distinct plates does a three letter, three digit format allow?",
    "unit": "plates",
    "answerValue": 17600000,
    "decompositionHint": "Twenty-six cubed times ten cubed.",
    "strategy": "combinatorial",
    "source": "Vehicle registration format arithmetic"
  },
  {
    "id": "monkeys-typing-hamlet",
    "prompt": "How many characters long is the shortest Shakespeare passage a random typist might plausibly produce?",
    "unit": "characters",
    "answerValue": 10,
    "decompositionHint": "Each character is one chance in about 30, so probability collapses by a factor of 30 per character.",
    "strategy": "exponential",
    "source": "Infinite monkey theorem arithmetic"
  },
  {
    "id": "people-in-six-degrees",
    "prompt": "How many people can you reach through six degrees of acquaintance?",
    "unit": "people",
    "answerValue": 1000000000,
    "decompositionHint": "If each person knows 150 others, then 150 to the sixth power, before accounting for overlap.",
    "strategy": "exponential",
    "source": "Derived from Dunbar number and small world theory"
  },
  {
    "id": "grains-of-rice-doubling-on-a-chessboard-total",
    "prompt": "How many tonnes would the rice on the final chessboard square weigh?",
    "unit": "tonnes",
    "answerValue": 460000000000,
    "decompositionHint": "Two to the power of 63 grains at about 0.025 grams each. Far more than all the rice ever grown.",
    "strategy": "exponential",
    "source": "Classic doubling problem"
  },
  {
    "id": "folds-of-paper-to-reach-the-moon",
    "prompt": "How many times must a sheet of paper be folded to reach the Moon?",
    "unit": "folds",
    "answerValue": 42,
    "decompositionHint": "Thickness doubles each fold. Starting at 0.1 millimetres, you need to double past 384,000 kilometres.",
    "strategy": "exponential",
    "source": "Classic exponential doubling calculation"
  },
  {
    "id": "bacteria-from-one-cell-in-a-day",
    "prompt": "How many bacteria would one cell become in 24 hours dividing every 20 minutes?",
    "unit": "bacteria",
    "answerValue": 4.7e+21,
    "decompositionHint": "Seventy-two doublings, which is two to the power of 72.",
    "strategy": "exponential",
    "source": "Derived from bacterial generation time"
  },
  {
    "id": "compound-interest-doubling-time",
    "prompt": "How many years does money take to double at 7 percent annual interest?",
    "unit": "years",
    "answerValue": 10,
    "decompositionHint": "The rule of 72: divide 72 by the interest rate.",
    "strategy": "exponential",
    "source": "Rule of 72 approximation"
  },
  {
    "id": "population-doubling-time",
    "prompt": "How many years would a population growing at 2 percent a year take to double?",
    "unit": "years",
    "answerValue": 35,
    "decompositionHint": "The same rule of 72, applied to people rather than money.",
    "strategy": "exponential",
    "source": "Rule of 72 approximation"
  },
  {
    "id": "half-lives-to-become-safe",
    "prompt": "How many half-lives must pass before a radioactive sample falls to one percent of its starting activity?",
    "unit": "half-lives",
    "answerValue": 7,
    "decompositionHint": "Each half-life halves it, and two to the power of seven is 128.",
    "strategy": "exponential",
    "source": "Radioactive decay arithmetic"
  },
  {
    "id": "dilutions-in-homeopathy",
    "prompt": "How many molecules of the original substance remain in a 30C homeopathic dilution of one mole?",
    "unit": "molecules",
    "answerValue": 1e-37,
    "decompositionHint": "Thirty successive hundred-fold dilutions is a factor of 10^60, against Avogadro's 6x10^23.",
    "strategy": "exponential",
    "source": "Derived from dilution factors and Avogadro's number"
  },
  {
    "id": "pixels-in-a-4k-screen",
    "prompt": "How many pixels are on a 4K television screen?",
    "unit": "pixels",
    "answerValue": 8300000,
    "decompositionHint": "3840 across by 2160 down. The 4K name refers to the horizontal count, not the total.",
    "strategy": "chain-multiply",
    "source": "Display resolution standards"
  },
  {
    "id": "sheep-in-australia",
    "prompt": "How many sheep are there in Australia?",
    "asOf": 2025,
    "unit": "sheep",
    "answerValue": 78000000,
    "decompositionHint": "About three sheep for every person, down from more than ten in the 1970s.",
    "strategy": "recall-sanity",
    "source": "Australian Bureau of Statistics agricultural surveys"
  },
  {
    "id": "pigs-in-china",
    "prompt": "How many pigs are there in China?",
    "asOf": 2025,
    "unit": "pigs",
    "answerValue": 430000000,
    "decompositionHint": "Roughly half the world's pigs, for about a fifth of the world's people.",
    "strategy": "recall-sanity",
    "source": "FAO livestock statistics"
  },
  {
    "id": "beehives-needed-for-an-almond-orchard",
    "prompt": "How many beehives are trucked into California each year to pollinate almonds?",
    "asOf": 2025,
    "unit": "hives",
    "answerValue": 2000000,
    "decompositionHint": "Around 400,000 hectares of almonds at roughly five hives a hectare. The largest managed pollination event on Earth.",
    "strategy": "area-density",
    "source": "Californian almond industry pollination data"
  },
  {
    "id": "tractors-worldwide",
    "prompt": "How many agricultural tractors are in use worldwide?",
    "asOf": 2025,
    "unit": "tractors",
    "answerValue": 50000000,
    "decompositionHint": "Concentrated in wealthy and middle income countries. Much of Africa still farms by hand and ox.",
    "strategy": "recall-sanity",
    "source": "FAO agricultural machinery statistics"
  },
  {
    "id": "irrigated-farmland-area",
    "prompt": "How many million hectares of farmland worldwide are irrigated?",
    "asOf": 2025,
    "unit": "million hectares",
    "answerValue": 340,
    "decompositionHint": "About a fifth of cropland, producing roughly 40 percent of the food.",
    "strategy": "recall-sanity",
    "source": "FAO AQUASTAT"
  },
  {
    "id": "fertiliser-used-per-year",
    "prompt": "How many million tonnes of nitrogen fertiliser are used worldwide each year?",
    "asOf": 2025,
    "unit": "million tonnes",
    "answerValue": 110,
    "decompositionHint": "Roughly half the nitrogen in your body was fixed industrially rather than biologically.",
    "strategy": "recall-sanity",
    "source": "FAO fertiliser statistics"
  },
  {
    "id": "food-wasted-per-year",
    "prompt": "How many million tonnes of food are wasted worldwide each year?",
    "asOf": 2025,
    "unit": "million tonnes",
    "answerValue": 1050,
    "decompositionHint": "Roughly a fifth of all food available, split between households, retail and food service.",
    "strategy": "recall-sanity",
    "source": "UNEP Food Waste Index"
  },
  {
    "id": "calories-produced-per-person-per-day",
    "prompt": "How many kilocalories of food are produced worldwide per person per day?",
    "asOf": 2025,
    "unit": "kilocalories",
    "answerValue": 2900,
    "decompositionHint": "Comfortably more than anyone needs. Hunger is a distribution problem, not a production one.",
    "strategy": "recall-sanity",
    "source": "FAO food balance sheets"
  },
  {
    "id": "land-for-a-vegetarian-vs-meat-diet",
    "prompt": "How many times more land does a meat-heavy diet need than a vegetarian one?",
    "unit": "times",
    "answerValue": 3,
    "decompositionHint": "Livestock eat crops, and the conversion from feed to meat loses most of the calories.",
    "strategy": "anchor-scale",
    "source": "Dietary land footprint studies"
  },
  {
    "id": "greenhouses-area-in-the-netherlands",
    "prompt": "How many hectares of greenhouses are there in the Netherlands?",
    "asOf": 2025,
    "unit": "hectares",
    "answerValue": 10000,
    "decompositionHint": "A tiny country that is nevertheless one of the world's largest food exporters by value.",
    "strategy": "recall-sanity",
    "source": "Dutch agricultural statistics"
  },
  {
    "id": "coffee-plants-for-a-daily-cup",
    "prompt": "How many coffee trees does a daily coffee drinker need to keep them supplied for a year?",
    "unit": "trees",
    "answerValue": 18,
    "decompositionHint": "A tree gives about half a kilogram of roasted coffee a year, and a cup takes 10 grams.",
    "strategy": "divide-total",
    "source": "Derived from coffee yields per tree"
  },
  {
    "id": "bananas-grown-per-year",
    "prompt": "How many bananas are grown worldwide each year?",
    "asOf": 2025,
    "unit": "bananas",
    "answerValue": 1000000000000,
    "decompositionHint": "About 135 million tonnes at roughly 120 grams a banana.",
    "strategy": "divide-total",
    "source": "Derived from FAO production tonnage"
  },
  {
    "id": "seeds-planted-per-hectare-of-wheat",
    "prompt": "How many wheat seeds are sown in one hectare?",
    "unit": "seeds",
    "answerValue": 4000000,
    "decompositionHint": "About 180 kilograms of seed a hectare, and a wheat grain weighs 0.045 grams.",
    "strategy": "divide-total",
    "source": "Agronomy seeding rate guidance"
  },
  {
    "id": "chickens-alive-right-now",
    "prompt": "How many chickens are alive on Earth at this moment?",
    "asOf": 2025,
    "unit": "chickens",
    "answerValue": 26000000000,
    "decompositionHint": "By far the most numerous bird, outnumbering all wild birds put together.",
    "strategy": "recall-sanity",
    "source": "FAO livestock statistics"
  },
  {
    "id": "share-of-crops-lost-to-pests",
    "prompt": "What percentage of world crop production is lost to pests and disease?",
    "unit": "percent",
    "answerValue": 25,
    "decompositionHint": "Even with modern pesticides, a quarter never reaches anyone.",
    "strategy": "recall-sanity",
    "source": "FAO plant protection assessments"
  },
  {
    "id": "seeds-in-a-seed-vault",
    "prompt": "How many seed samples are stored in the Svalbard Global Seed Vault?",
    "asOf": 2025,
    "unit": "samples",
    "answerValue": 1300000,
    "decompositionHint": "Each sample is around 500 seeds of one variety, kept frozen in an Arctic mountain.",
    "strategy": "recall-sanity",
    "source": "Svalbard Global Seed Vault records"
  },
  {
    "id": "cotton-grown-per-year",
    "prompt": "How many million tonnes of cotton are grown worldwide each year?",
    "asOf": 2025,
    "unit": "million tonnes",
    "answerValue": 25,
    "decompositionHint": "Enough for roughly 20 t-shirts per person on Earth, if it all went to t-shirts.",
    "strategy": "recall-sanity",
    "source": "International Cotton Advisory Committee data"
  },
  {
    "id": "people-online-at-once",
    "prompt": "How many people are using the internet at any given moment?",
    "asOf": 2025,
    "unit": "people",
    "answerValue": 1500000000,
    "decompositionHint": "About 5.5 billion users, of whom perhaps a quarter are online at once given time zones and sleep.",
    "strategy": "population-rate",
    "source": "Derived from ITU internet usage statistics"
  },
  {
    "id": "wifi-networks-worldwide",
    "prompt": "How many Wi-Fi access points are there worldwide?",
    "asOf": 2025,
    "unit": "access points",
    "answerValue": 1000000000,
    "decompositionHint": "Roughly one per household with internet, plus offices and public hotspots.",
    "strategy": "population-rate",
    "source": "Wireless industry installed base estimates"
  },
  {
    "id": "mobile-towers-worldwide",
    "prompt": "How many mobile phone masts are there worldwide?",
    "asOf": 2025,
    "unit": "masts",
    "answerValue": 7000000,
    "decompositionHint": "Each serving a cell a few kilometres across in cities, far larger in the countryside.",
    "strategy": "recall-sanity",
    "source": "Telecom infrastructure surveys"
  },
  {
    "id": "text-messages-per-day",
    "prompt": "How many SMS text messages are sent worldwide each day?",
    "asOf": 2025,
    "unit": "messages",
    "answerValue": 20000000000,
    "decompositionHint": "Still enormous despite messaging apps, largely because of alerts and verification codes.",
    "strategy": "recall-sanity",
    "source": "Mobile network traffic reports"
  },
  {
    "id": "phone-calls-per-day-worldwide",
    "prompt": "How many phone calls are made worldwide each day?",
    "asOf": 2025,
    "unit": "calls",
    "answerValue": 8000000000,
    "decompositionHint": "Roughly one per person alive, though usage is heavily skewed by age.",
    "strategy": "population-rate",
    "source": "Telecom traffic statistics"
  },
  {
    "id": "video-calls-per-day",
    "prompt": "How many minutes of video calling take place worldwide each day?",
    "asOf": 2025,
    "unit": "minutes",
    "answerValue": 5000000000,
    "decompositionHint": "Business meetings dominate the total, though personal calls dominate the count.",
    "strategy": "recall-sanity",
    "source": "Conferencing platform disclosures"
  },
  {
    "id": "internet-traffic-per-second",
    "prompt": "How many terabytes of data cross the internet every second?",
    "asOf": 2025,
    "unit": "terabytes",
    "answerValue": 1500,
    "decompositionHint": "Video is the overwhelming majority of the volume.",
    "strategy": "divide-total",
    "source": "Derived from global IP traffic estimates"
  },
  {
    "id": "servers-in-the-world",
    "prompt": "How many servers are running in data centres worldwide?",
    "asOf": 2025,
    "unit": "servers",
    "answerValue": 100000000,
    "decompositionHint": "Hyperscale operators account for a growing majority of them.",
    "strategy": "recall-sanity",
    "source": "Data centre industry analyses"
  },
  {
    "id": "passwords-a-person-has",
    "prompt": "How many separate online accounts does an average internet user have?",
    "asOf": 2025,
    "unit": "accounts",
    "answerValue": 100,
    "decompositionHint": "Password manager audits consistently find around a hundred, most long forgotten.",
    "strategy": "recall-sanity",
    "source": "Password manager usage studies"
  },
  {
    "id": "cyber-attacks-per-day",
    "prompt": "How many cyber attacks are attempted worldwide each day?",
    "asOf": 2025,
    "unit": "attacks",
    "answerValue": 600000000,
    "decompositionHint": "Mostly automated scanning and credential stuffing rather than targeted intrusions.",
    "strategy": "recall-sanity",
    "source": "Security vendor telemetry reports"
  },
  {
    "id": "bots-share-of-web-traffic",
    "prompt": "What percentage of web traffic comes from bots rather than people?",
    "asOf": 2025,
    "unit": "percent",
    "answerValue": 50,
    "decompositionHint": "Search crawlers, scrapers and malicious automation together rival human browsing.",
    "strategy": "recall-sanity",
    "source": "Web traffic analysis reports"
  },
  {
    "id": "software-updates-per-device-per-year",
    "prompt": "How many software updates does an average smartphone receive in a year?",
    "asOf": 2025,
    "unit": "updates",
    "answerValue": 300,
    "decompositionHint": "Counting apps, not just the operating system. A hundred apps updating every few weeks.",
    "strategy": "chain-multiply",
    "source": "App store update frequency data"
  },
  {
    "id": "apps-in-app-stores",
    "prompt": "How many apps are available across the major app stores?",
    "asOf": 2025,
    "unit": "apps",
    "answerValue": 4000000,
    "decompositionHint": "A long tail of abandoned apps, with only a few thousand seeing serious use.",
    "strategy": "recall-sanity",
    "source": "App store statistics"
  },
  {
    "id": "programming-languages-created",
    "prompt": "How many programming languages have ever been created?",
    "asOf": 2025,
    "unit": "languages",
    "answerValue": 9000,
    "decompositionHint": "Only a few dozen see wide use. Most were academic or one-off projects.",
    "strategy": "recall-sanity",
    "source": "Computer language catalogues"
  },
  {
    "id": "open-source-packages-published",
    "prompt": "How many open source packages are published across the major registries?",
    "asOf": 2025,
    "unit": "packages",
    "answerValue": 6000000,
    "decompositionHint": "Millions, dominated by JavaScript, and many are tiny single-purpose modules.",
    "strategy": "recall-sanity",
    "source": "Package registry statistics"
  },
  {
    "id": "bugs-per-thousand-lines-of-code",
    "prompt": "How many bugs are there per thousand lines of released commercial code?",
    "unit": "bugs",
    "answerValue": 15,
    "decompositionHint": "Industry studies land in the range of ten to twenty. Rigorous processes can push it below one.",
    "strategy": "recall-sanity",
    "source": "Software defect density research"
  },
  {
    "id": "time-to-crack-an-eight-character-password",
    "prompt": "How many hours would it take to brute force an eight character lowercase password?",
    "unit": "hours",
    "answerValue": 1,
    "decompositionHint": "Twenty-six to the eighth is about 2x10^11, and modern hardware tries billions a second.",
    "strategy": "combinatorial",
    "source": "Derived from password space and hash rates"
  },
  {
    "id": "certificates-on-the-web",
    "prompt": "How many active TLS certificates secure websites worldwide?",
    "asOf": 2025,
    "unit": "certificates",
    "answerValue": 700000000,
    "decompositionHint": "Free automated issuance changed this completely. Most are short-lived and renewed automatically.",
    "strategy": "recall-sanity",
    "source": "Certificate transparency log statistics"
  },
  {
    "id": "dns-queries-per-day",
    "prompt": "How many DNS queries are made worldwide each day?",
    "asOf": 2025,
    "unit": "queries",
    "answerValue": 10000000000000,
    "decompositionHint": "Every page load triggers several, and caching only cuts so much of it.",
    "strategy": "recall-sanity",
    "source": "DNS resolver operator statistics"
  },
  {
    "id": "operating-system-lines-of-code",
    "prompt": "How many lines of code are in a modern desktop operating system?",
    "asOf": 2025,
    "unit": "lines of code",
    "answerValue": 50000000,
    "decompositionHint": "Drivers and compatibility layers dominate, much as they do in the Linux kernel.",
    "strategy": "anchor-scale",
    "source": "Software size analyses"
  },
  {
    "id": "windows-cleaned-in-a-skyscraper",
    "prompt": "How many windows does a window cleaning team wash on a 60 storey tower in one cycle?",
    "unit": "windows",
    "answerValue": 8000,
    "decompositionHint": "Around 130 panes per floor across 60 floors.",
    "strategy": "chain-multiply",
    "source": "Facade maintenance contracting estimates"
  },
  {
    "id": "doors-in-a-hospital",
    "prompt": "How many doors are there in a large hospital?",
    "unit": "doors",
    "answerValue": 4000,
    "decompositionHint": "Around 800 beds, each room with a door, plus offices, stores, theatres and fire doors.",
    "strategy": "population-rate",
    "source": "Hospital facilities inventories"
  },
  {
    "id": "light-fittings-in-an-office-block",
    "prompt": "How many light fittings are in a 20 storey office block?",
    "unit": "fittings",
    "answerValue": 4000,
    "decompositionHint": "About 20,000 square metres of floor at roughly one fitting per five square metres.",
    "strategy": "area-density",
    "source": "Lighting design standards"
  },
  {
    "id": "square-metres-of-carpet-in-an-office",
    "prompt": "How many square metres of carpet tile does a large office fit-out use?",
    "unit": "square metres",
    "answerValue": 15000,
    "decompositionHint": "Most of the floor plate of a 20 storey building, minus cores and hard-floor areas.",
    "strategy": "area-density",
    "source": "Commercial interiors estimates"
  },
  {
    "id": "toilets-in-a-stadium",
    "prompt": "How many toilets does a 60,000 seat stadium have?",
    "unit": "toilets",
    "answerValue": 1200,
    "decompositionHint": "Building codes set a ratio, typically around one per 50 spectators.",
    "strategy": "population-rate",
    "source": "Stadium design guidance"
  },
  {
    "id": "seats-in-all-the-worlds-cinemas",
    "prompt": "How many cinema seats are there worldwide?",
    "asOf": 2025,
    "unit": "seats",
    "answerValue": 30000000,
    "decompositionHint": "Around 200,000 screens averaging 150 seats each.",
    "strategy": "chain-multiply",
    "source": "Global cinema industry statistics"
  },
  {
    "id": "hotel-rooms-worldwide",
    "prompt": "How many hotel rooms are there worldwide?",
    "asOf": 2025,
    "unit": "rooms",
    "answerValue": 18000000,
    "decompositionHint": "Before counting short-term rentals, which now add several million more.",
    "strategy": "recall-sanity",
    "source": "Hospitality industry supply data"
  },
  {
    "id": "beds-made-in-hotels-per-day",
    "prompt": "How many hotel beds are made worldwide each day?",
    "asOf": 2025,
    "unit": "beds",
    "answerValue": 11000000,
    "decompositionHint": "About 18 million rooms at roughly 65 percent occupancy.",
    "strategy": "population-rate",
    "source": "Derived from hotel supply and occupancy"
  },
  {
    "id": "street-signs-in-a-city",
    "prompt": "How many street signs are there in a city of one million?",
    "unit": "signs",
    "answerValue": 150000,
    "decompositionHint": "Perhaps 5,000 kilometres of street with signs every 30 metres or so at junctions and restrictions.",
    "strategy": "divide-total",
    "source": "Municipal asset inventories"
  },
  {
    "id": "postboxes-in-a-country",
    "prompt": "How many public postboxes are there in a country of 60 million?",
    "unit": "postboxes",
    "answerValue": 110000,
    "decompositionHint": "Historically placed so nobody is more than half a mile from one.",
    "strategy": "recall-sanity",
    "source": "National postal service statistics"
  },
  {
    "id": "benches-in-a-city-park",
    "prompt": "How many benches are there in a large city park?",
    "unit": "benches",
    "answerValue": 800,
    "decompositionHint": "Perhaps 300 hectares with benches along paths every 50 metres or so.",
    "strategy": "divide-total",
    "source": "Parks department inventories"
  },
  {
    "id": "water-pipes-under-a-city",
    "prompt": "How many kilometres of water main lie under a city of one million?",
    "unit": "kilometres",
    "answerValue": 5000,
    "decompositionHint": "Roughly the same order as the road length, since pipes follow streets.",
    "strategy": "anchor-scale",
    "source": "Water utility asset registers"
  },
  {
    "id": "sewage-treated-per-day-in-a-city",
    "prompt": "How many million litres of sewage does a city of one million treat each day?",
    "unit": "million litres",
    "answerValue": 400,
    "decompositionHint": "About 150 litres per person of wastewater, plus infiltration and rainfall.",
    "strategy": "population-rate",
    "source": "Wastewater treatment design figures"
  },
  {
    "id": "rubbish-collected-in-a-city-per-day",
    "prompt": "How many tonnes of household rubbish does a city of one million collect each day?",
    "unit": "tonnes",
    "answerValue": 1200,
    "decompositionHint": "Around 1.2 kilograms per person per day in a developed city.",
    "strategy": "population-rate",
    "source": "Municipal waste statistics"
  },
  {
    "id": "traffic-lights-changing-per-day",
    "prompt": "How many times does a single busy traffic light change in a day?",
    "unit": "changes",
    "answerValue": 900,
    "decompositionHint": "A 90 second cycle running around the clock.",
    "strategy": "divide-total",
    "source": "Traffic signal timing standards"
  },
  {
    "id": "car-parks-in-a-shopping-centre",
    "prompt": "How many parking spaces does a large shopping centre provide?",
    "unit": "spaces",
    "answerValue": 4000,
    "decompositionHint": "Planning rules typically require several spaces per hundred square metres of retail floor.",
    "strategy": "area-density",
    "source": "Retail development planning standards"
  },
  {
    "id": "scientists-alive-today",
    "prompt": "How many working research scientists are alive today?",
    "asOf": 2025,
    "unit": "scientists",
    "answerValue": 9000000,
    "decompositionHint": "It is often said most scientists who ever lived are alive now, because the field grew exponentially.",
    "strategy": "recall-sanity",
    "source": "UNESCO science report researcher counts"
  },
  {
    "id": "nobel-prizes-awarded",
    "prompt": "How many Nobel Prizes have been awarded in total?",
    "asOf": 2025,
    "unit": "prizes",
    "answerValue": 630,
    "decompositionHint": "Six categories, roughly once a year since 1901, with wartime gaps.",
    "strategy": "chain-multiply",
    "source": "Nobel Foundation records"
  },
  {
    "id": "patents-granted-per-year",
    "prompt": "How many patents are granted worldwide each year?",
    "asOf": 2025,
    "unit": "patents",
    "answerValue": 1700000,
    "decompositionHint": "China alone grants close to half of them.",
    "strategy": "recall-sanity",
    "source": "WIPO intellectual property indicators"
  },
  {
    "id": "patents-ever-granted",
    "prompt": "How many patents have ever been granted worldwide?",
    "asOf": 2025,
    "unit": "patents",
    "answerValue": 60000000,
    "decompositionHint": "The great majority in the last few decades, since the rate has climbed steeply.",
    "strategy": "recall-sanity",
    "source": "WIPO historical statistics"
  },
  {
    "id": "elements-synthesised-artificially",
    "prompt": "How many chemical elements have been created artificially rather than found in nature?",
    "unit": "elements",
    "answerValue": 24,
    "decompositionHint": "Everything past uranium, plus a few gaps below it like technetium.",
    "strategy": "recall-sanity",
    "source": "IUPAC element discovery records"
  },
  {
    "id": "known-chemical-compounds",
    "prompt": "How many distinct chemical compounds have been catalogued?",
    "asOf": 2025,
    "unit": "compounds",
    "answerValue": 200000000,
    "decompositionHint": "Overwhelmingly organic, and the registry grows by tens of thousands a day.",
    "strategy": "recall-sanity",
    "source": "CAS Registry statistics"
  },
  {
    "id": "known-exoplanets",
    "prompt": "How many exoplanets have been confirmed?",
    "asOf": 2025,
    "unit": "exoplanets",
    "answerValue": 5900,
    "decompositionHint": "Almost none were known before 1995, and space telescopes found most of them.",
    "strategy": "recall-sanity",
    "source": "NASA Exoplanet Archive"
  },
  {
    "id": "known-species-of-beetle",
    "prompt": "How many beetle species have been formally described?",
    "asOf": 2025,
    "unit": "species",
    "answerValue": 400000,
    "decompositionHint": "About a quarter of all described animal species are beetles.",
    "strategy": "recall-sanity",
    "source": "Entomological catalogues"
  },
  {
    "id": "known-minerals",
    "prompt": "How many distinct minerals have been identified?",
    "asOf": 2025,
    "unit": "minerals",
    "answerValue": 6000,
    "decompositionHint": "New ones are approved at a rate of about a hundred a year.",
    "strategy": "recall-sanity",
    "source": "International Mineralogical Association lists"
  },
  {
    "id": "genomes-sequenced",
    "prompt": "How many human genomes have been fully sequenced?",
    "asOf": 2025,
    "unit": "genomes",
    "answerValue": 30000000,
    "decompositionHint": "The first took over a decade and billions of dollars. It now takes a day and a few hundred.",
    "strategy": "recall-sanity",
    "source": "Genomics industry sequencing estimates"
  },
  {
    "id": "cost-to-sequence-a-genome",
    "prompt": "How many US dollars does it now cost to sequence a human genome?",
    "asOf": 2025,
    "unit": "US dollars",
    "answerValue": 200,
    "decompositionHint": "Down by roughly a factor of a million in twenty years, far faster than Moore's law.",
    "strategy": "recall-sanity",
    "source": "NHGRI sequencing cost tracking"
  },
  {
    "id": "clinical-trials-running",
    "prompt": "How many clinical trials are registered worldwide?",
    "asOf": 2025,
    "unit": "trials",
    "answerValue": 500000,
    "decompositionHint": "Registered on public trial databases, though only a fraction are actively recruiting.",
    "strategy": "recall-sanity",
    "source": "ClinicalTrials.gov and WHO registry data"
  },
  {
    "id": "drugs-approved-per-year",
    "prompt": "How many genuinely new drugs are approved worldwide each year?",
    "asOf": 2025,
    "unit": "drugs",
    "answerValue": 60,
    "decompositionHint": "New molecular entities, not reformulations. A tiny output for the money spent.",
    "strategy": "recall-sanity",
    "source": "Regulatory agency approval statistics"
  },
  {
    "id": "cost-to-develop-a-drug",
    "prompt": "How many billion US dollars does it cost to bring one new drug to market?",
    "asOf": 2025,
    "unit": "billion US dollars",
    "answerValue": 2.3,
    "decompositionHint": "Including the cost of all the failures along the way, which is most of the total.",
    "strategy": "recall-sanity",
    "source": "Pharmaceutical R&D cost studies"
  },
  {
    "id": "telescopes-larger-than-eight-metres",
    "prompt": "How many optical telescopes with mirrors over eight metres across exist?",
    "asOf": 2025,
    "unit": "telescopes",
    "answerValue": 15,
    "decompositionHint": "Each costs hundreds of millions, so they are counted individually rather than in classes.",
    "strategy": "recall-sanity",
    "source": "Observatory facility listings"
  },
  {
    "id": "particle-accelerators-worldwide",
    "prompt": "How many particle accelerators are operating worldwide?",
    "asOf": 2025,
    "unit": "accelerators",
    "answerValue": 30000,
    "decompositionHint": "The vast majority are small medical and industrial machines, not physics research rings.",
    "strategy": "recall-sanity",
    "source": "Accelerator community surveys"
  },
  {
    "id": "antarctic-research-stations",
    "prompt": "How many research stations operate in Antarctica?",
    "asOf": 2025,
    "unit": "stations",
    "answerValue": 70,
    "decompositionHint": "Around 40 are staffed year round, the rest only in the summer season.",
    "strategy": "recall-sanity",
    "source": "Council of Managers of National Antarctic Programs"
  },
  {
    "id": "people-in-antarctica-in-winter",
    "prompt": "How many people overwinter in Antarctica?",
    "asOf": 2025,
    "unit": "people",
    "answerValue": 1100,
    "decompositionHint": "The summer population is several times larger, but almost everyone leaves before the freeze.",
    "strategy": "recall-sanity",
    "source": "National Antarctic programme staffing data"
  },
  {
    "id": "weather-stations-worldwide",
    "prompt": "How many surface weather stations report worldwide?",
    "asOf": 2025,
    "unit": "stations",
    "answerValue": 12000,
    "decompositionHint": "Reporting into the global observing network, though coverage is far patchier in some regions.",
    "strategy": "recall-sanity",
    "source": "World Meteorological Organization network data"
  },
  {
    "id": "seismometers-worldwide",
    "prompt": "How many seismometers monitor earthquakes worldwide?",
    "asOf": 2025,
    "unit": "seismometers",
    "answerValue": 20000,
    "decompositionHint": "Dense national networks in seismic countries, sparse coverage across the oceans.",
    "strategy": "recall-sanity",
    "source": "Global seismographic network inventories"
  },
  {
    "id": "decisions-made-per-day",
    "prompt": "How many conscious decisions does a person make in a day?",
    "unit": "decisions",
    "answerValue": 35000,
    "decompositionHint": "A widely cited figure, dominated by trivial choices rather than considered ones.",
    "strategy": "recall-sanity",
    "source": "Behavioural decision research estimates"
  },
  {
    "id": "people-a-person-meets-in-a-lifetime",
    "prompt": "How many people does a person meet in a lifetime?",
    "unit": "people",
    "answerValue": 80000,
    "decompositionHint": "Roughly three new people a day across 70 years, counting brief encounters.",
    "strategy": "rate-time",
    "source": "Social network research estimates"
  },
  {
    "id": "stable-relationships-a-person-maintains",
    "prompt": "How many stable social relationships can one person maintain?",
    "unit": "relationships",
    "answerValue": 150,
    "decompositionHint": "Dunbar's number, argued from primate neocortex size and observed group sizes.",
    "strategy": "recall-sanity",
    "source": "Dunbar 1992 social brain hypothesis"
  },
  {
    "id": "faces-a-person-can-recognise",
    "prompt": "How many different faces can a person recognise?",
    "unit": "faces",
    "answerValue": 5000,
    "decompositionHint": "Far more than the number you actually know, since it includes celebrities and passing acquaintances.",
    "strategy": "recall-sanity",
    "source": "Jenkins et al. 2018, Proceedings of the Royal Society B"
  },
  {
    "id": "things-held-in-working-memory",
    "prompt": "How many items can a person hold in working memory at once?",
    "unit": "items",
    "answerValue": 4,
    "decompositionHint": "The famous seven plus or minus two has been revised down by later work.",
    "strategy": "recall-sanity",
    "source": "Cowan 2001 working memory capacity research"
  },
  {
    "id": "time-to-form-a-habit",
    "prompt": "How many days does it take on average to form a new habit?",
    "unit": "days",
    "answerValue": 66,
    "decompositionHint": "Not the popularly quoted 21, and it ranges from under three weeks to nearly a year.",
    "strategy": "recall-sanity",
    "source": "Lally et al. 2010, European Journal of Social Psychology"
  },
  {
    "id": "attention-span-before-distraction",
    "prompt": "How many seconds does a person work before switching tasks at a computer?",
    "unit": "seconds",
    "answerValue": 47,
    "decompositionHint": "Measured directly by screen recording, and it has fallen steadily since the 2000s.",
    "strategy": "recall-sanity",
    "source": "Mark et al. attention research"
  },
  {
    "id": "dreams-remembered-per-year",
    "prompt": "How many dreams does a person actually remember in a year?",
    "unit": "dreams",
    "answerValue": 100,
    "decompositionHint": "Out of well over a thousand had, most forgotten within minutes of waking.",
    "strategy": "recall-sanity",
    "source": "Dream recall frequency studies"
  },
  {
    "id": "lies-told-per-day",
    "prompt": "How many lies does an average person tell in a day?",
    "unit": "lies",
    "answerValue": 2,
    "decompositionHint": "Heavily skewed. Most people tell almost none, and a small minority tell many.",
    "strategy": "recall-sanity",
    "source": "Serota and Levine deception frequency research"
  },
  {
    "id": "songs-a-person-recognises",
    "prompt": "How many songs can an average adult recognise from a few seconds?",
    "unit": "songs",
    "answerValue": 1000,
    "decompositionHint": "Accumulated over decades of incidental listening rather than deliberate learning.",
    "strategy": "recall-sanity",
    "source": "Music memory research"
  },
  {
    "id": "smiles-per-day",
    "prompt": "How many times does an adult smile in a day?",
    "unit": "smiles",
    "answerValue": 20,
    "decompositionHint": "Children manage several hundred, which is the more interesting comparison.",
    "strategy": "recall-sanity",
    "source": "Behavioural observation studies"
  },
  {
    "id": "steps-of-separation-on-social-networks",
    "prompt": "How many steps separate any two people on a large social network?",
    "asOf": 2025,
    "unit": "steps",
    "answerValue": 4,
    "decompositionHint": "Measured directly on platform graphs, and shorter than the classic six degrees.",
    "strategy": "recall-sanity",
    "source": "Facebook and LinkedIn network analyses"
  },
  {
    "id": "hours-of-sleep-lost-per-year",
    "prompt": "How many hours of sleep does an average adult lose to insufficient sleep each year?",
    "unit": "hours",
    "answerValue": 300,
    "decompositionHint": "Roughly 50 minutes a night short of the recommended amount.",
    "strategy": "rate-time",
    "source": "Sleep duration survey data"
  },
  {
    "id": "cups-of-tea-in-a-british-lifetime",
    "prompt": "How many cups of tea does a British person drink in a lifetime?",
    "unit": "cups",
    "answerValue": 80000,
    "decompositionHint": "About three a day across 70 years of drinking it.",
    "strategy": "rate-time",
    "source": "Derived from national consumption surveys"
  },
  {
    "id": "queuing-time-in-a-lifetime",
    "prompt": "How many months of a lifetime does a person spend queuing?",
    "unit": "months",
    "answerValue": 6,
    "decompositionHint": "Around 20 minutes a day in shops, traffic and waiting rooms, over 70 years.",
    "strategy": "rate-time",
    "source": "Time use survey estimates"
  },
  {
    "id": "time-spent-searching-for-lost-items",
    "prompt": "How many days of a lifetime does a person spend looking for misplaced things?",
    "unit": "days",
    "answerValue": 150,
    "decompositionHint": "Around ten minutes a day hunting for keys, phones and paperwork.",
    "strategy": "rate-time",
    "source": "Consumer behaviour surveys"
  },
  {
    "id": "photographs-a-person-takes-in-a-lifetime",
    "prompt": "How many photographs does someone born today take in their lifetime?",
    "asOf": 2025,
    "unit": "photographs",
    "answerValue": 200000,
    "decompositionHint": "A few a day for decades, where their grandparents took a few hundred in total.",
    "strategy": "rate-time",
    "source": "Derived from smartphone photo behaviour"
  },
  {
    "id": "possessions-in-a-home",
    "prompt": "How many individual items does an average household own?",
    "unit": "items",
    "answerValue": 30000,
    "decompositionHint": "Counting every book, utensil, screw and sock, not just furniture.",
    "strategy": "recall-sanity",
    "source": "Household inventory studies"
  },
  {
    "id": "clothes-worn-in-a-lifetime",
    "prompt": "How many individual garments does a person wear out in a lifetime?",
    "unit": "garments",
    "answerValue": 4000,
    "decompositionHint": "Perhaps 60 new items a year in a modern wardrobe, across 65 adult years.",
    "strategy": "rate-time",
    "source": "Apparel consumption studies"
  },
  {
    "id": "copper-in-an-electric-car",
    "prompt": "How many kilograms of copper are in an electric car?",
    "asOf": 2025,
    "unit": "kilograms",
    "answerValue": 80,
    "decompositionHint": "About four times a petrol car, mostly in motor windings and battery wiring.",
    "strategy": "anchor-scale",
    "source": "Copper Development Association vehicle data"
  },
  {
    "id": "rare-earths-in-a-wind-turbine",
    "prompt": "How many kilograms of rare earth metals are in a direct drive wind turbine?",
    "unit": "kilograms",
    "answerValue": 600,
    "decompositionHint": "Neodymium magnets in the generator, at a few hundred kilograms per megawatt.",
    "strategy": "chain-multiply",
    "source": "Wind turbine materials studies"
  },
  {
    "id": "silver-in-a-solar-panel",
    "prompt": "How many grams of silver are in one solar panel?",
    "asOf": 2025,
    "unit": "grams",
    "answerValue": 15,
    "decompositionHint": "In the conductive paste. Manufacturers have cut it hard because it is the costliest input.",
    "strategy": "recall-sanity",
    "source": "Photovoltaic materials analyses"
  },
  {
    "id": "sand-used-in-construction-per-year",
    "prompt": "How many billion tonnes of sand does construction use each year?",
    "asOf": 2025,
    "unit": "billion tonnes",
    "answerValue": 50,
    "decompositionHint": "The second most consumed resource after water. Desert sand is useless for concrete.",
    "strategy": "recall-sanity",
    "source": "UNEP sand and sustainability report"
  },
  {
    "id": "recycled-share-of-aluminium",
    "prompt": "What percentage of aluminium ever produced is still in use today?",
    "unit": "percent",
    "answerValue": 75,
    "decompositionHint": "It recycles indefinitely without losing quality, at a twentieth of the energy of smelting.",
    "strategy": "recall-sanity",
    "source": "International Aluminium Institute"
  },
  {
    "id": "plastic-recycled-share",
    "prompt": "What percentage of plastic ever made has been recycled?",
    "asOf": 2025,
    "unit": "percent",
    "answerValue": 9,
    "decompositionHint": "Most has been landfilled or burned. Recycling rates have barely moved in decades.",
    "strategy": "recall-sanity",
    "source": "Geyer, Jambeck and Law 2017, Science Advances"
  },
  {
    "id": "glass-bottles-recycled-share",
    "prompt": "What percentage of glass bottles are recycled in Europe?",
    "asOf": 2025,
    "unit": "percent",
    "answerValue": 76,
    "decompositionHint": "Far higher than plastic, since glass is simple to sort and melt down.",
    "strategy": "recall-sanity",
    "source": "European container glass federation data"
  },
  {
    "id": "steel-recycled-per-year",
    "prompt": "How many million tonnes of steel are recycled worldwide each year?",
    "asOf": 2025,
    "unit": "million tonnes",
    "answerValue": 680,
    "decompositionHint": "The most recycled material on Earth by mass, because it is magnetic and worth money.",
    "strategy": "recall-sanity",
    "source": "World Steel Association recycling data"
  },
  {
    "id": "electronic-waste-per-year",
    "prompt": "How many million tonnes of electronic waste are generated worldwide each year?",
    "asOf": 2025,
    "unit": "million tonnes",
    "answerValue": 62,
    "decompositionHint": "About eight kilograms per person, of which under a quarter is formally collected.",
    "strategy": "population-rate",
    "source": "Global E-waste Monitor"
  },
  {
    "id": "gold-in-a-tonne-of-phones",
    "prompt": "How many grams of gold are in one tonne of discarded mobile phones?",
    "unit": "grams",
    "answerValue": 300,
    "decompositionHint": "Richer than most gold ore, which is why urban mining is a real industry.",
    "strategy": "anchor-scale",
    "source": "E-waste materials recovery studies"
  },
  {
    "id": "timber-harvested-per-year",
    "prompt": "How many billion cubic metres of timber are harvested worldwide each year?",
    "asOf": 2025,
    "unit": "billion cubic metres",
    "answerValue": 4,
    "decompositionHint": "Roughly half is burned as fuel rather than used as material.",
    "strategy": "recall-sanity",
    "source": "FAO forest products statistics"
  },
  {
    "id": "paper-used-per-person-per-year",
    "prompt": "How many kilograms of paper does an average person use each year?",
    "asOf": 2025,
    "unit": "kilograms",
    "answerValue": 55,
    "decompositionHint": "Packaging has grown as printing has shrunk, so the total has held up.",
    "strategy": "recall-sanity",
    "source": "Pulp and paper industry statistics"
  },
  {
    "id": "clothes-thrown-away-per-year",
    "prompt": "How many million tonnes of textiles are discarded worldwide each year?",
    "asOf": 2025,
    "unit": "million tonnes",
    "answerValue": 92,
    "decompositionHint": "Roughly a bin lorry of clothing every second, and under one percent is recycled into new clothes.",
    "strategy": "recall-sanity",
    "source": "Ellen MacArthur Foundation textiles report"
  },
  {
    "id": "rubber-used-per-year",
    "prompt": "How many million tonnes of rubber are consumed worldwide each year?",
    "asOf": 2025,
    "unit": "million tonnes",
    "answerValue": 30,
    "decompositionHint": "Split roughly evenly between natural and synthetic, and dominated by tyres.",
    "strategy": "recall-sanity",
    "source": "International Rubber Study Group"
  },
  {
    "id": "salt-used-on-roads-per-winter",
    "prompt": "How many million tonnes of salt are spread on roads each winter in cold countries?",
    "unit": "million tonnes",
    "answerValue": 25,
    "decompositionHint": "North America alone uses well over half of it, and most ends up in waterways.",
    "strategy": "recall-sanity",
    "source": "Road salt usage surveys"
  },
  {
    "id": "helium-used-per-year",
    "prompt": "How many million cubic metres of helium are consumed worldwide each year?",
    "asOf": 2025,
    "unit": "million cubic metres",
    "answerValue": 160,
    "decompositionHint": "Mostly for MRI cooling and semiconductors, not balloons. It escapes Earth entirely once released.",
    "strategy": "recall-sanity",
    "source": "US Geological Survey mineral commodity summaries"
  },
  {
    "id": "water-used-by-industry-per-year",
    "prompt": "What percentage of global freshwater withdrawal goes to agriculture?",
    "unit": "percent",
    "answerValue": 70,
    "decompositionHint": "Industry and households together account for the remaining third.",
    "strategy": "recall-sanity",
    "source": "FAO AQUASTAT water withdrawal data"
  },
  {
    "id": "footballs-kicked-in-a-world-cup",
    "prompt": "How many times is the ball kicked during an entire World Cup tournament?",
    "unit": "kicks",
    "answerValue": 100000,
    "decompositionHint": "Sixty-four matches at roughly 1,500 touches each.",
    "strategy": "chain-multiply",
    "source": "Derived from match event data"
  },
  {
    "id": "spectators-at-all-football-matches",
    "prompt": "How many people attend professional football matches worldwide each year?",
    "asOf": 2025,
    "unit": "spectators",
    "answerValue": 500000000,
    "decompositionHint": "Hundreds of leagues, thousands of clubs, tens of matches each, tens of thousands per match.",
    "strategy": "chain-multiply",
    "source": "Derived from league attendance statistics"
  },
  {
    "id": "swimming-pool-lengths-by-an-olympian",
    "prompt": "How many pool lengths does an Olympic swimmer cover in training each year?",
    "unit": "lengths",
    "answerValue": 60000,
    "decompositionHint": "Around 60 kilometres a week of swimming, in a 50 metre pool, for most of the year.",
    "strategy": "rate-time",
    "source": "Elite swimming training volume data"
  },
  {
    "id": "shots-in-a-basketball-career",
    "prompt": "How many shots does an NBA player attempt over a full career?",
    "unit": "shots",
    "answerValue": 12000,
    "decompositionHint": "About 15 attempts a game, 70 games a season, for a dozen seasons.",
    "strategy": "chain-multiply",
    "source": "Derived from NBA career statistics"
  },
  {
    "id": "distance-a-tennis-player-runs-in-a-match",
    "prompt": "How many kilometres does a tennis player run during a five set match?",
    "unit": "kilometres",
    "answerValue": 5,
    "decompositionHint": "Short bursts, but hundreds of points across several hours.",
    "strategy": "recall-sanity",
    "source": "Player tracking data from grand slam events"
  },
  {
    "id": "pedal-revolutions-in-the-tour-de-france",
    "prompt": "How many pedal revolutions does a rider make during the Tour de France?",
    "unit": "revolutions",
    "answerValue": 500000,
    "decompositionHint": "About 90 revolutions a minute for roughly 90 hours of racing.",
    "strategy": "rate-time",
    "source": "Derived from cadence and race duration"
  },
  {
    "id": "golf-balls-hit-by-a-pro-in-a-year",
    "prompt": "How many golf balls does a touring professional hit in a year?",
    "unit": "balls",
    "answerValue": 100000,
    "decompositionHint": "Practice dwarfs competition. Several hundred a day on the range.",
    "strategy": "rate-time",
    "source": "Professional golf training estimates"
  },
  {
    "id": "steps-a-referee-takes-in-a-match",
    "prompt": "How many steps does a football referee take during one match?",
    "unit": "steps",
    "answerValue": 14000,
    "decompositionHint": "Referees cover roughly the same distance as the players, at about 1.3 steps per metre.",
    "strategy": "divide-total",
    "source": "Derived from referee tracking data"
  },
  {
    "id": "gym-memberships-worldwide",
    "prompt": "How many gym memberships are there worldwide?",
    "asOf": 2025,
    "unit": "memberships",
    "answerValue": 200000000,
    "decompositionHint": "Around 200,000 clubs averaging a thousand members, and a great many never attend.",
    "strategy": "chain-multiply",
    "source": "Fitness industry association reports"
  },
  {
    "id": "olympic-records-broken-per-games",
    "prompt": "How many Olympic records are broken at a typical summer Games?",
    "unit": "records",
    "answerValue": 40,
    "decompositionHint": "Across 300-odd events, though most records survive several Games.",
    "strategy": "recall-sanity",
    "source": "Olympic results archives"
  },
  {
    "id": "seconds-shaved-off-the-marathon-record",
    "prompt": "How many minutes has the marathon world record improved over the last century?",
    "unit": "minutes",
    "answerValue": 30,
    "decompositionHint": "From around 2:32 in the 1920s to just over two hours today.",
    "strategy": "anchor-scale",
    "source": "World Athletics record progression"
  },
  {
    "id": "chess-moves-in-a-grandmaster-career",
    "prompt": "How many moves does a grandmaster play in tournament games over a career?",
    "unit": "moves",
    "answerValue": 150000,
    "decompositionHint": "Perhaps 80 games a year at 40 moves each, for 40 years.",
    "strategy": "chain-multiply",
    "source": "Derived from tournament playing schedules"
  },
  {
    "id": "darts-thrown-in-a-professional-match",
    "prompt": "How many darts are thrown in a professional darts match?",
    "unit": "darts",
    "answerValue": 300,
    "decompositionHint": "Around 15 to 20 darts per leg, across a match of 20 or so legs, for both players.",
    "strategy": "chain-multiply",
    "source": "Professional darts statistics"
  },
  {
    "id": "horses-racing-worldwide-per-year",
    "prompt": "How many horse races are run worldwide each year?",
    "asOf": 2025,
    "unit": "races",
    "answerValue": 150000,
    "decompositionHint": "Dozens of countries with year-round fixtures, several races per meeting.",
    "strategy": "recall-sanity",
    "source": "International Federation of Horseracing Authorities"
  },
  {
    "id": "cricket-balls-used-in-a-season",
    "prompt": "How many cricket balls does a first-class county get through in a season?",
    "unit": "balls",
    "answerValue": 400,
    "decompositionHint": "A new ball every 80 overs per innings, plus practice, across a full season.",
    "strategy": "chain-multiply",
    "source": "County cricket equipment budgets"
  },
  {
    "id": "seats-in-all-football-stadiums",
    "prompt": "How many stadium seats exist across the top European football leagues?",
    "asOf": 2025,
    "unit": "seats",
    "answerValue": 4000000,
    "decompositionHint": "About 100 clubs in the big five leagues averaging 40,000 seats.",
    "strategy": "chain-multiply",
    "source": "Derived from stadium capacity data"
  },
  {
    "id": "medals-made-for-an-olympics",
    "prompt": "How many medals are manufactured for a summer Olympic Games?",
    "unit": "medals",
    "answerValue": 5000,
    "decompositionHint": "Over 300 events, three medals each, plus team events where every member gets one.",
    "strategy": "chain-multiply",
    "source": "Olympic organising committee production figures"
  },
  {
    "id": "hours-of-sport-broadcast-per-year",
    "prompt": "How many hours of live sport are broadcast worldwide each year?",
    "asOf": 2025,
    "unit": "hours",
    "answerValue": 1000000,
    "decompositionHint": "Thousands of channels, many showing sport around the clock.",
    "strategy": "recall-sanity",
    "source": "Broadcast industry programming analyses"
  },
  {
    "id": "trophies-engraved-per-year",
    "prompt": "How many sports trophies and medals are awarded worldwide each year?",
    "asOf": 2025,
    "unit": "awards",
    "answerValue": 50000000,
    "decompositionHint": "Amateur and school sport dwarfs the professional game in sheer number of participants.",
    "strategy": "recall-sanity",
    "source": "Awards and engraving industry estimates"
  },
  {
    "id": "candles-on-birthday-cakes-per-year",
    "prompt": "How many birthday candles are burned worldwide each year?",
    "asOf": 2025,
    "unit": "candles",
    "answerValue": 300000000000,
    "decompositionHint": "Eight billion birthdays a year, and the candle count is the age.",
    "strategy": "population-rate",
    "source": "Derived from world population and mean age"
  },
  {
    "id": "balloons-inflated-per-year",
    "prompt": "How many party balloons are inflated worldwide each year?",
    "asOf": 2025,
    "unit": "balloons",
    "answerValue": 10000000000,
    "decompositionHint": "Parties, shops and events, at a bit over one per person per year.",
    "strategy": "population-rate",
    "source": "Party goods industry estimates"
  },
  {
    "id": "christmas-trees-sold-per-year",
    "prompt": "How many real Christmas trees are sold worldwide each year?",
    "asOf": 2025,
    "unit": "trees",
    "answerValue": 80000000,
    "decompositionHint": "Grown as a crop over about a decade, then replanted, rather than cut from wild forest.",
    "strategy": "recall-sanity",
    "source": "Christmas tree growers association data"
  },
  {
    "id": "greeting-cards-sent-per-year",
    "prompt": "How many greeting cards are sent worldwide each year?",
    "asOf": 2025,
    "unit": "cards",
    "answerValue": 7000000000,
    "decompositionHint": "Declining steadily as messaging replaces post, but still about one per person.",
    "strategy": "population-rate",
    "source": "Greeting card industry statistics"
  },
  {
    "id": "weddings-per-year-worldwide",
    "prompt": "How many weddings take place worldwide each year?",
    "asOf": 2025,
    "unit": "weddings",
    "answerValue": 40000000,
    "decompositionHint": "Roughly five marriages per thousand people a year.",
    "strategy": "population-rate",
    "source": "UN demographic yearbook marriage statistics"
  },
  {
    "id": "flowers-sold-per-year",
    "prompt": "How many cut flower stems are sold worldwide each year?",
    "asOf": 2025,
    "unit": "stems",
    "answerValue": 50000000000,
    "decompositionHint": "Roses dominate, and a remarkable share are flown from Kenya, Ecuador and the Netherlands.",
    "strategy": "recall-sanity",
    "source": "Floriculture trade statistics"
  },
  {
    "id": "haircuts-worldwide-per-year",
    "prompt": "How many haircuts are given worldwide each year?",
    "asOf": 2025,
    "unit": "haircuts",
    "answerValue": 40000000000,
    "decompositionHint": "Around five a year each for most of eight billion people.",
    "strategy": "population-rate",
    "source": "Derived from grooming frequency surveys"
  },
  {
    "id": "nappies-used-worldwide-per-year",
    "prompt": "How many disposable nappies are used worldwide each year?",
    "asOf": 2025,
    "unit": "nappies",
    "answerValue": 200000000000,
    "decompositionHint": "About 130 million births a year, each child using several thousand over two and a half years.",
    "strategy": "chain-multiply",
    "source": "Derived from birth rates and nappy usage"
  },
  {
    "id": "toothpaste-tubes-per-year",
    "prompt": "How many tubes of toothpaste are used worldwide each year?",
    "asOf": 2025,
    "unit": "tubes",
    "answerValue": 10000000000,
    "decompositionHint": "Perhaps five tubes per person per year among those who use it.",
    "strategy": "population-rate",
    "source": "Oral care market statistics"
  },
  {
    "id": "razor-blades-used-per-year",
    "prompt": "How many razor blades are used worldwide each year?",
    "asOf": 2025,
    "unit": "blades",
    "answerValue": 30000000000,
    "decompositionHint": "Billions of shavers, each getting through a blade every week or two.",
    "strategy": "population-rate",
    "source": "Grooming products market analyses"
  },
  {
    "id": "shoes-manufactured-per-year",
    "prompt": "How many pairs of shoes are manufactured worldwide each year?",
    "asOf": 2025,
    "unit": "pairs",
    "answerValue": 24000000000,
    "decompositionHint": "About three pairs per person alive, most made in a handful of countries.",
    "strategy": "population-rate",
    "source": "World Footwear Yearbook"
  },
  {
    "id": "soap-bars-used-per-year",
    "prompt": "How many bars of soap are used worldwide each year?",
    "asOf": 2025,
    "unit": "bars",
    "answerValue": 30000000000,
    "decompositionHint": "Several per person per year, though liquid soap has taken much of the wealthy market.",
    "strategy": "population-rate",
    "source": "Personal care industry data"
  },
  {
    "id": "mirrors-in-a-house",
    "prompt": "How many mirrors are there in an average home?",
    "unit": "mirrors",
    "answerValue": 6,
    "decompositionHint": "Bathrooms, bedrooms, hallway, plus compacts and wardrobe doors.",
    "strategy": "recall-sanity",
    "source": "Household inventory surveys"
  },
  {
    "id": "photographs-printed-per-year",
    "prompt": "How many photographs are still printed on paper worldwide each year?",
    "asOf": 2025,
    "unit": "prints",
    "answerValue": 30000000000,
    "decompositionHint": "A small fraction of the trillions taken, but far from zero.",
    "strategy": "recall-sanity",
    "source": "Photo printing industry estimates"
  },
  {
    "id": "stamps-issued-per-year",
    "prompt": "How many postage stamps are printed worldwide each year?",
    "asOf": 2025,
    "unit": "stamps",
    "answerValue": 30000000000,
    "decompositionHint": "Falling with letter volumes, but parcels and collectors keep the presses running.",
    "strategy": "recall-sanity",
    "source": "Universal Postal Union statistics"
  },
  {
    "id": "coins-minted-per-year",
    "prompt": "How many coins are minted worldwide each year?",
    "asOf": 2025,
    "unit": "coins",
    "answerValue": 50000000000,
    "decompositionHint": "Replacing losses and wear, even as card payments reduce the need for them.",
    "strategy": "stock-flow",
    "source": "Mint production statistics"
  },
  {
    "id": "matches-struck-per-year",
    "prompt": "How many matches are struck worldwide each year?",
    "asOf": 2025,
    "unit": "matches",
    "answerValue": 500000000000,
    "decompositionHint": "Still enormous in countries where cooking fires and paraffin lamps are common.",
    "strategy": "recall-sanity",
    "source": "Match manufacturing industry estimates"
  },
  {
    "id": "bells-rung-in-a-cathedral-peal",
    "prompt": "How many individual bell strikes are there in a full peal of change ringing?",
    "unit": "strikes",
    "answerValue": 5040,
    "decompositionHint": "Seven factorial on seven bells, which is why a full peal takes about three hours.",
    "strategy": "combinatorial",
    "source": "Change ringing conventions"
  },
  {
    "id": "pipes-in-a-cathedral-organ",
    "prompt": "How many pipes are there in a large cathedral organ?",
    "unit": "pipes",
    "answerValue": 6000,
    "decompositionHint": "Around 80 stops, each with a pipe for every one of about 61 keys.",
    "strategy": "chain-multiply",
    "source": "Organ building specifications"
  },
  {
    "id": "stained-glass-pieces-in-a-window",
    "prompt": "How many pieces of glass are in a large Gothic cathedral window?",
    "unit": "pieces",
    "answerValue": 3000,
    "decompositionHint": "Medieval glass came in small sheets, so a big window is assembled from thousands of fragments.",
    "strategy": "divide-total",
    "source": "Stained glass conservation surveys"
  },
  {
    "id": "tiles-in-a-mosaic-floor",
    "prompt": "How many tesserae are in a large Roman mosaic floor?",
    "unit": "tesserae",
    "answerValue": 1500000,
    "decompositionHint": "About 40 square metres at roughly 10,000 pieces per square metre.",
    "strategy": "area-density",
    "source": "Archaeological mosaic studies"
  },
  {
    "id": "knots-in-a-persian-carpet",
    "prompt": "How many knots are tied in a fine hand-knotted Persian carpet?",
    "unit": "knots",
    "answerValue": 2000000,
    "decompositionHint": "Six square metres at several hundred knots per square inch, which is why they take years.",
    "strategy": "area-density",
    "source": "Carpet weaving density standards"
  }
]

if (typeof module !== "undefined") module.exports = QUESTIONS
