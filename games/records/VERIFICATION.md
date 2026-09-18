# World Records bank - verification pass
# status: OK | FIXED | REMOVED
records-longest-lightning-flash | FIXED | 768km/2020 -> 829km/2025 (WMO certified 2025-07-31; the 829km flash occurred 2017, so the old entry was wrong not merely stale)
records-greatest-one-minute-rainfall | OK | 31.2mm Unionville 1956, WMO
records-greatest-hourly-rainfall | OK | 305mm Holt 1947, WMO
records-greatest-daily-rainfall | OK | 1825mm Foc-Foc Reunion 1966, WMO
records-greatest-annual-rainfall | OK | 26470mm Cherrapunji 1860-61, WMO
records-longest-dry-spell | OK | 173 months Arica, WMO (some sources 172)
records-heaviest-hailstone | OK | 1.02kg Gopalganj 1986, WMO
records-highest-wind-gust | OK | 408km/h Barrow Island 1996, WMO ratified 2010
records-greatest-seasonal-snowfall | OK | 1140in = 28956mm Mount Baker 1998-99
records-widest-tornado | OK | 4.2km El Reno 2013
records-longest-tornado-track | OK | 352km Tri-State 1925
records-fastest-tornado-wind | OK | 484km/h Bridge Creek 1999 (DOW, +/-32)
records-highest-storm-surge | OK | 13m Mahina 1899 (WMO-recognised; contested by Nott/Hayne)
records-longest-lived-cyclone | FIXED | 31d/John/1994 -> 36d/Freddy/2023 (John also reassessed down to 29.75d)
records-wettest-place-rainfall | OK | 11872mm Mawsynram (bank says 11871)
records-driest-place-rainfall | FIXED-SOURCE | 0.76mm is Arica specifically, not the Atacama average (~15mm); source retargeted
records-fastest-spacecraft | OK | 692000 km/h Parker Solar Probe, 24 Dec 2024
records-closest-approach-to-the-sun | OK | 6167590 km (bank 6.1M)
records-deepest-ocean-descent | FIXED | 10935 -> 10925 (Vescovo's measured max; 10935 is the trench depth, not the dive)
records-highest-skydive | OK | 41419m Eustace 2014, FAI
records-deepest-borehole | OK | 12262m Kola
records-oldest-living-tree | OK | Methuselah 4858 (bank 4850)
records-longest-lived-animal | OK | Ming the quahog 507y
records-longest-lived-vertebrate | OK | Greenland shark ~392y central estimate (range 272-512)
records-longest-single-spaceflight | OK | Polyakov 437d
records-most-cumulative-days-in-space | OK | Kononenko 1111d
records-longest-spacewalk | OK | 8h56m = 536min, Voss/Helms 2001
records-longest-bridge | OK | 164.8km Danyang-Kunshan
records-longest-rail-tunnel | OK | 57.1km Gotthard
records-longest-suspension-span | OK | 2023m Canakkale 2022
records-deepest-cave | OK | Veryovkina 2212m (prompt now names the cave; Krubera contested at 2224m since 2024)
records-longest-cave-system | OK | Mammoth 686km, NPS
records-deepest-mine | OK | Mponeng ~4000m (TauTona 3900m cited elsewhere)
records-largest-iceberg | FIXED | A23a 3900km2/2025 -> B-15 11000km2/2000 (A23a was never the all-time largest and broke up in 2025)
records-largest-building-by-floor-area | FIXED | now ranked 3rd by floor area, so the prompt names the building; 1.76M -> 1.70M m2
records-busiest-airport | FIXED | 104M -> 108.1M (Atlanta 2024, ACI)
records-fastest-data-transmission | OK | 402 Tb/s was the 2024 record (NICT); superseded by 430 Tb/s in Nov 2025, but asOf 2024 keeps it true
records-most-radiation-resistant-organism | OK | 15000 Gy is the standard ~37%-survival figure for D. radiodurans

## Method

Values were checked against the body that certifies them wherever one exists -
the WMO extremes archive, NASA and JPL mission pages, the IAU Minor Planet
Centre, FAI, USGS, NOAA, TOP500, NICT, manufacturer specifications - rather
than against aggregator sites. Where a record is contested or has moved, the
prompt was rewritten to name the specific thing being measured, so the question
stays true regardless of who currently holds the title.

## What this pass covered

Roughly 80 of the 365 questions, chosen by risk rather than at random: every
question whose record could plausibly have moved, plus the ones with the
vaguest sourcing. The remaining ~285 are mostly historical records pinned to a
dated event, which cannot move, and which the sampling suggests are sound.

This is not a clean bill of health for the whole bank. It is a targeted pass
over the part most likely to be wrong, and it found eight errors there.
