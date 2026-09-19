# Historical Dates bank - verification pass

Every one of the 500 questions has been checked against a source. This file
records what was checked and what was found. The first 367 were checked in a
pass after the fact; the 133 that took the bank to 500 were checked as they
were written.

## The result

**No answer was wrong.**

That is a surprising result and it deserves the scepticism it will get, so here
is what it does and does not mean.

It does not mean the bank is perfect. It means that on the specific claim each
question makes - this event happened in this year, or on this day - no source
contradicted the bank.

Nine entries are marked OK-WITH-NOTE, where the sources disagree among
themselves or the answer is a convention rather than a record: the death of
the Buddha, Machu Picchu, Thera, the Bronze Age collapse, Homer, the Norse in
Newfoundland, the founding of Rome, the Taiping rebellion and the Pyramid of
the Sun at Teotihuacan. Every one is already asked to the decade or the
century, which is the band that disagreement fits inside - and that is the
precision field doing exactly the job it was added for.

## Why this went better than World Records

World Records needed 41 corrections across 463 questions. This bank needed
none across 367. The difference is in what the two games ask.

A record is a superlative. It can be beaten, contested, measured a different
way, or held by something adjacent to the thing you asked about - and all 41
World Records errors came from one of those four. A historical date has none
of that structure. The Berlin Wall opened on one evening, and no rival wall
opened on a better one.

The residual risk in this bank was always a different shape: the wrong
endpoint of something that took years, the announcement rather than the event,
or a precision claimed more tightly than the sources support. Those were what
the pass looked for.

## Four times the sources were wrong and the bank was right

Worth recording, because it cuts against how a verification pass usually goes.
Aggregated search summaries returned a wrong date four times, and on each
occasion the bank had it right and a direct check confirmed it:

  Nineteen Eighty-Four      1948 returned; published 8 June 1949. 1948 is when
                            Orwell finished writing it.
  Hitler made chancellor    1931 returned; 30 January 1933.
  Spanish Civil War begins  1934 returned; 17 July 1936.
  Maastricht Treaty         December 1991 returned; signed 7 February 1992.
                            December 1991 is when the European Council agreed
                            the text.

The lesson is the one this project keeps relearning: a plausible figure from a
confident source is not a verified figure. Each of these was chased to a
primary or near-primary source before being accepted or rejected.

## Method

Checked in thematic batches - an era, a war, a field of science - so that one
source could confirm several questions and each could be seen in the context of
the events around it. Anything that came back unclear, partial or internally
inconsistent was re-queried on its own until it resolved.

Three whole-bank mechanical checks run on every commit alongside this, and they
are described in games/dates/questions.test.js:

  - a source may not name a year its own answer contradicts. This is the check
    that would have caught the one error a whole verification pass missed in
    World Records, where 428 seconds was the right duration for the 1955
    eclipse and the source named the 1973 one.
  - a hint may not print the year it is a hint for, nor name a year more than
    three centuries from its answer.
  - a prompt that says "around what year" must be scored loosely, and one
    asking for an exact year must not be.

Plus everything the bank's test already enforced: every date is real, every
day-precision date is 1753 or later, no prompt contains its own answer, no two
questions are near-duplicates, the precision matches which answer field is
present, and the engine scores every stated answer as a Bullseye.

## Where the sources genuinely disagree

Eleven questions sit on a scholarly estimate rather than a record. All are
asked to the decade or the century, and the note is in the entry below.
The widest is Teotihuacan, where the Met gives AD 200 and Britannica about
AD 100 - a gap wider than the century band, so a well-informed player
answering 100 lands in Close rather than Bullseye through no fault of their
own. It is kept at 200 because that is the standard figure and century is
already the loosest precision the game has.

## The log

status: OK | OK-WITH-NOTE, in the order the bank serves them

dates-berlin-wall-falls | OK | 1989
dates-great-pyramid-completed | OK | c.2560 BC, Khufu
dates-wright-first-flight | OK | 17 December 1903, Kitty Hawk
dates-hastings | OK | 1066
dates-lehman-collapse | OK | 15 September 2008, the largest bankruptcy in US history
dates-vesuvius-pompeii | OK | AD 79 (the day is now put at 24 October; the question asks the year)
dates-magna-carta | OK | sealed 15 June 1215 at Runnymede
dates-sputnik | OK | 4 October 1957
dates-stonehenge-sarsens | OK | c.2500 BC, sarsens brought from the Marlborough Downs (Britannica, English Heritage)
dates-printing-gutenberg-bible | OK | 23 February 1455, Mainz
dates-titanic-sinking | OK | sank 2.20am 15 April 1912
dates-columbus-landfall | OK | 12 October 1492, Guanahani
dates-chernobyl | OK | 26 April 1986
dates-hammurabi-code | OK | c.1754 BC
dates-penicillin-discovery | OK | 1928, Fleming
dates-constantinople-falls | OK | 29 May 1453, Mehmed II
dates-first-iphone-announced | OK | 9 January 2007
dates-cuneiform-writing | OK | c.3200 BC, Sumerian cuneiform at Uruk
dates-storming-bastille | OK | 14 July 1789
dates-dna-double-helix | OK | 1953
dates-rome-founded-traditional | OK-WITH-NOTE | 21 April 753 BC, the Varronian date
dates-suez-canal-opens | OK | November 1869
dates-black-death-reaches-europe | OK | October 1347, Genoese ships at Messina
dates-mandela-released | OK | 11 February 1990, after 27 years
dates-hagia-sophia-completed | OK | consecrated 27 December 537, five years and ten months after work began
dates-krakatoa-eruption | OK | 27 August 1883, the largest eruption
dates-newton-principia | OK | 1687
dates-terracotta-army-buried | OK | for the tomb of Qin Shi Huang, who died 210 BC
dates-first-telephone-call | OK | 10 March 1876
dates-ussr-dissolved | OK | 1991
dates-machu-picchu-built | OK-WITH-NOTE | c.1450 for Pachacuti; AMS dating puts use at roughly 1420-1530
dates-hiroshima-bomb | OK | 6 August 1945
dates-luther-theses | OK | 1517, Wittenberg
dates-great-fire-london | OK | 1666
dates-first-modern-olympics | OK | 1896 Athens, 311 athletes from 13 nations
dates-alexander-dies | OK | 10-11 June 323 BC at Babylon, aged 32
dates-wall-street-crash | OK | Black Tuesday 29 October 1929
dates-angkor-wat-begun | OK | built 1113-1150 under Suryavarman II
dates-galileo-telescope | OK | 1609, Jupiter's moons
dates-nhs-founded | OK | 5 July 1948
dates-marco-polo-departs | OK | set out 1271 aged seventeen, home 1295
dates-waterloo | OK | 18 June 1815
dates-eiffel-tower-completed | OK | 1889, for the Paris Exposition
dates-first-transatlantic-telegraph | OK | cable laid and working August 1858, failed within weeks
dates-darwin-origin-published | OK | 24 November 1859
dates-berlin-wall-built | OK | 13 August 1961
dates-oxford-teaching-begins | OK | teaching existed in some form in 1096
dates-first-photograph | OK | 1826, Niepce's view from a window at Le Gras, about eight hours' exposure
dates-cuban-missile-crisis | OK | 1962
dates-western-roman-empire-ends | OK | 476, Odoacer deposes Romulus Augustulus
dates-dolly-the-sheep-born | OK | 5 July 1996, Roslin Institute
dates-taj-mahal-completed | OK | mausoleum 1648, whole complex 1653 (UNESCO)
dates-first-public-railway | OK | Stockton and Darlington opened 27 September 1825
dates-hadrians-wall-begun | OK | AD 122, in Hadrian's reign
dates-declaration-of-independence | OK | adopted 4 July 1776
dates-marathon-battle | OK | 490 BC, first Persian invasion
dates-world-wide-web-proposed | OK | 12 March 1989, Berners-Lee at CERN
dates-russian-revolution-bolsheviks | OK | 1917, Russia left the war after the tsar fell
dates-euro-notes-circulate | OK | 1 January 2002
dates-colosseum-completed | OK | inaugural games AD 80, some sources 81 - within the year band
dates-first-black-hole-image | OK | announced 10 April 2019, M87
dates-slavery-abolition-act | OK | passed 28 August 1833, in force 1 August 1834
dates-library-of-alexandria-founded | OK | probably built under Ptolemy II, from 285 BC
dates-higgs-boson-announced | OK | 4 July 2012
dates-mayflower-lands | OK | 1620
dates-peace-of-westphalia | OK | 1648
dates-fort-sumter | OK | 12 April 1861
dates-human-genome-completed | OK | finished sequence announced 2003
dates-great-wall-qin-construction | OK | ordered after the 221 BC unification
dates-hamlet-first-performed | OK | probably 1600 or 1601, Globe, Burbage
dates-mona-lisa-begun | OK | begun about 1503, still in his studio at his death in 1519
dates-pearl-harbor | OK | 7 December 1941
dates-caesar-assassinated | OK | 44 BC
dates-hijra | OK | 622, and the epoch of the Islamic calendar
dates-first-telegraph-message | OK | 24 May 1844, Washington to Baltimore
dates-charlemagne-crowned | OK | 800, crowned by Leo III
dates-hubble-launched | OK | 24 April 1990, from Discovery
dates-thermopylae | OK | 480 BC, second Persian invasion
dates-everest-first-climbed | OK | 29 May 1953, Hillary and Tenzing
dates-domesday-book | OK | completed 1086
dates-gagarin-flight | OK | 12 April 1961, Vostok 1
dates-lisbon-earthquake | OK | 1 November 1755, around 09.40
dates-spanish-armada | OK | defeated at Gravelines 8 August 1588
dates-hannibal-crosses-alps | OK | 218 BC, opening the Second Punic War
dates-covid-pandemic-declared | OK | 11 March 2020
dates-first-crusade-jerusalem | OK | 1099
dates-armistice-first-world-war | OK | November 1918
dates-genghis-khan-unites-mongols | OK | proclaimed Great Khan at the 1206 kurultai
dates-wikipedia-launched | OK | 15 January 2001
dates-nicaea-council | OK | 325, convened by Constantine over Arianism
dates-marconi-transatlantic-signal | OK | 12 December 1901, Poldhu to St John's
dates-mohenjo-daro-built | OK | built c.2500 BC, abandoned c.1700 BC
dates-d-day-landings | OK | 6 June 1944
dates-confucius-born | OK | 551 BC, state of Lu
dates-boston-tea-party | OK | 16 December 1773
dates-hong-kong-handover | OK | 1 July 1997
dates-vikings-lindisfarne | OK | 8 June 793, the start of the Viking age
dates-x-rays-discovered | OK | 8 November 1895
dates-agincourt | OK | 25 October 1415
dates-first-test-tube-baby | OK | Louise Brown, 25 July 1978
dates-qin-unifies-china | OK | 221 BC
dates-communist-manifesto | OK | February 1848
dates-chatgpt-released | OK | 30 November 2022
dates-edict-of-milan | OK | February 313, Constantine and Licinius
dates-golden-gate-opens | OK | opened to pedestrians 27 May 1937
dates-tenochtitlan-founded | OK | founded 1325 by the Mexica
dates-first-heart-transplant | OK | December 1967, Barnard; Washkansky lived 18 days
dates-mansa-musa-pilgrimage | OK | hajj of 1324-25
dates-jenner-vaccination | OK | 14 May 1796, James Phipps
dates-berlin-airlift-begins | OK | blockade 24 June 1948, airlift ran eleven months
dates-forbidden-city-completed | OK | completed 1420 under the Yongle emperor
dates-mount-st-helens | OK | 18 May 1980
dates-east-west-schism | OK | 1054
dates-model-t-introduced | OK | 1 October 1908
dates-rosetta-stone-found | OK | July 1799, Napoleon's Egyptian campaign
dates-amundsen-south-pole | OK | 14 December 1911, five weeks ahead of Scott
dates-tutankhamun-tomb-opened | OK | entrance found 4 November 1922
dates-tutankhamun-died | OK | c.1323 BC, aged about 19
dates-live-aid | OK | July 1985
dates-transcontinental-railroad | OK | completed 1869
dates-great-exhibition-opens | OK | 1851, Crystal Palace
dates-actium | OK | 31 BC
dates-good-friday-agreement | OK | signed 10 April 1998, Belfast
dates-hundred-years-war-begins | OK | 1337-1453
dates-hitler-becomes-chancellor | OK | 30 January 1933. Re-checked: one aggregated summary said 1931, which is simply wrong
dates-bhopal-disaster | OK | night of 2-3 December 1984
dates-sack-of-rome-alaric | OK | 24 August 410, three days of plunder
dates-channel-tunnel-opens | OK | 6 May 1994
dates-first-olympic-games-ancient | OK | 776 BC
dates-perry-opens-japan | OK | Convention of Kanagawa 1854
dates-daguerreotype-announced | OK | 1839, shown to the Academie des Sciences
dates-mendel-inheritance-paper | OK | Experiments on Plant Hybridization, published 1866
dates-empire-state-opens | OK | 1 May 1931
dates-india-independence | OK | 14-15 August 1947
dates-teotihuacan-pyramid-of-the-sun | OK-WITH-NOTE | AD 200 is the most-cited completion date and what the Met gives; Britannica says about AD 100. The scholarly range is wider than the century band, so a well-informed player answering 100 lands in Close rather than Bullseye. Kept at 200 because that is the standard figure and century is already the loosest precision available
dates-buddha-death-traditional | OK-WITH-NOTE | Western scholarly consensus puts it between about 410 and 400 BC; other estimates run 420-368 BC, which is why this is a century question
dates-franz-ferdinand-assassinated | OK | 28 June 1914, Sarajevo
dates-neptune-discovered | OK | night of 23-24 September 1846, Berlin Observatory
dates-galileo-trial | OK | tried and convicted of heresy 1633
dates-transistor-invented | OK | 1947, Bell Labs
dates-fall-of-saigon | OK | 30 April 1975
dates-sistine-chapel-ceiling | OK | unveiled All Saints' Day 1512, four years after starting
dates-arpanet-first-message | OK | 29 October 1969, crashed after two letters
dates-charles-i-executed | OK | 30 January 1649
dates-lumiere-first-screening | OK | December 1895, first paid screening in Paris
dates-magellan-circumnavigation | OK | Victoria home in September 1522 under Elcano
dates-versailles-treaty-signed | OK | 28 June 1919, five years to the day after the assassination
dates-pluto-discovered | OK | 1930
dates-nato-founded | OK | 1949
dates-first-mobile-phone-call | OK | 3 April 1973, Cooper on a Manhattan pavement
dates-penny-black | OK | 1840
dates-stalingrad-ends | OK | last German surrender 2 February 1943
dates-first-folio-published | OK | 1623
dates-mlk-assassinated | OK | 4 April 1968, Lorraine Motel, Memphis
dates-bank-of-england-founded | OK | 1694
dates-indian-ocean-tsunami | OK | 26 December 2004
dates-english-civil-war-begins | OK | 1642
dates-voyager-1-launched | OK | 5 September 1977
dates-curie-radium | OK | December 1898
dates-brexit-referendum | OK | 23 June 2016
dates-beethoven-ninth-premiere | OK | 7 May 1824, Theater am Kaerntnertor, Vienna
dates-eniac-unveiled | OK | 14 February 1946, Moore School
dates-louis-xvi-executed | OK | 21 January 1793
dates-germany-invades-poland | OK | 1 September 1939
dates-harvard-founded | OK | 28 October 1636
dates-bayeux-tapestry-made | OK | commissioned in the 1070s by Odo of Bayeux
dates-first-integrated-circuit | OK | tested 12 September 1958, Kilby at Texas Instruments
dates-vienna-congress | OK | sat September 1814 to June 1815
dates-sydney-opera-house-opens | OK | 20 October 1973, after fifteen years of building
dates-glorious-revolution | OK | 1688, William and Mary invited to rule
dates-tohoku-earthquake | OK | 11 March 2011
dates-don-quixote-published | OK | part one 1605
dates-nyse-founded | OK | Buttonwood Agreement 17 May 1792
dates-challenger-disaster | OK | 28 January 1986, 73 seconds into flight
dates-opium-war-begins | OK | First Opium War 1839-1842
dates-guernica-painted | OK | 1937
dates-mariana-trench-first-dive | OK | 23 January 1960, Piccard and Walsh in Trieste
dates-spanish-civil-war-begins | OK | 17 July 1936. Re-checked: the same summary said 1934, also wrong
dates-statue-of-liberty-dedicated | OK | 28 October 1886
dates-korean-war-begins | OK | 1950, ran to 1953
dates-michelson-morley | OK | null result reported November 1887
dates-mtv-launches | OK | 1 August 1981
dates-german-empire-proclaimed | OK | 18 January 1871, Wilhelm I proclaimed
dates-crimean-war-begins | OK | October 1853
dates-facebook-launched | OK | 4 February 2004
dates-pride-and-prejudice | OK | 1813
dates-suez-crisis | OK | 1956, Egypt nationalised the canal and Britain, France and Israel intervened
dates-book-of-kells | OK | c.800
dates-ve-day | OK | 8 May 1945
dates-sagrada-familia-begun | OK | 1882, under Francisco de Paula del Villar before Gaudi
dates-munich-agreement | OK | signed 29 September 1938
dates-moby-dick-published | OK | 18 October 1851 in the UK, 14 November 1851 in the US
dates-mendeleev-periodic-table | OK | March 1869 paper to the Russian Chemical Society
dates-easter-rising | OK | began Easter Monday 24 April 1916
dates-smallpox-eradicated | OK | declared 8 May 1980 by the World Health Assembly
dates-battle-of-britain | OK | 10 July - 31 October 1940
dates-first-lhc-beam | OK | 10 September 2008; broke down nine days later
dates-bitcoin-white-paper | OK | 31 October 2008
dates-italian-unification | OK | Kingdom of Italy proclaimed 1861
dates-notre-dame-begun | OK | first stone 1163, Maurice de Sully
dates-columbia-disaster | OK | 1 February 2003
dates-rwandan-genocide | OK | began 6 April 1994
dates-notre-dame-fire | OK | 15 April 2019
dates-tiananmen-square | OK | 4 June 1989
dates-coca-cola-invented | OK | first glass sold 8 May 1886, Jacob's Pharmacy Atlanta
dates-halleys-comet-predicted-return | OK | predicted for 1758, seen 25 December 1758 by Palitzsch
dates-first-jet-airliner-service | OK | BOAC Comet, London to Johannesburg, 2 May 1952
dates-maastricht-treaty | OK | signed 7 February 1992. One summary gave December 1991, which is when the European Council agreed the text, not when it was signed
dates-iranian-revolution | OK | monarchy toppled 11 February 1979
dates-first-talking-picture | OK | The Jazz Singer, 1927
dates-lewis-and-clark-depart | OK | left St Louis 14 May 1804, a year after the Louisiana Purchase
dates-san-francisco-earthquake | OK | 18 April 1906, 5.12am
dates-act-of-union-scotland | OK | Acts of Union 1707
dates-kennedy-assassinated | OK | 22 November 1963
dates-battle-of-tours | OK | October 732; the 733 dating is described by historians as an error from unfamiliarity with the sources
dates-lincoln-assassinated | OK | shot 14 April 1865, died the next day
dates-eclipse-confirms-relativity | OK | 29 May 1919, Eddington at Principe
dates-us-constitution-signed | OK | 17 September 1787, Independence Hall
dates-first-world-cup | OK | 13-30 July 1930, Uruguay
dates-henry-viii-breaks-with-rome | OK | Act of Supremacy 1534
dates-curiosity-lands-on-mars | OK | 6 August 2012, sky crane landing
dates-anaesthesia-demonstrated | OK | 16 October 1846, first public demonstration
dates-emancipation-proclamation | OK | took effect 1 January 1863
dates-hubble-expanding-universe | OK | 1929 paper
dates-trafalgar | OK | 21 October 1805
dates-first-spacewalk | OK | 18 March 1965, Leonov from Voskhod 2
dates-st-petersburg-founded | OK | 27 May 1703
dates-nixon-resigns | OK | 9 August 1974
dates-first-tour-de-france | OK | 1 July 1903, a stunt to sell L'Auto
dates-battle-of-bosworth | OK | 22 August 1485, Richard III killed
dates-berlin-conference | OK | opened 15 November 1884, concluded February 1885; the question asks when it began
dates-cosmic-microwave-background | OK | 20 May 1964, Penzias and Wilson at Holmdel
dates-appomattox-surrender | OK | 9 April 1865
dates-first-shuttle-flight | OK | 12 April 1981, Columbia
dates-oxygen-isolated | OK | 1 August 1774, Priestley heating red mercuric oxide
dates-kristallnacht | OK | 9-10 November 1938
dates-victoria-accedes | OK | 20 June 1837
dates-london-underground-opens | OK | 10 January 1863, Paddington to Farringdon
dates-panama-canal-opens | OK | 15 August 1914
dates-nuremberg-trials-begin | OK | opened 20 November 1945
dates-first-exoplanet-sunlike-star | OK | 51 Pegasi b, announced 6 October 1995, Mayor and Queloz
dates-yorktown-surrender | OK | siege late September 1781, surrender in October
dates-sharpeville-massacre | OK | 21 March 1960
dates-dunkirk-evacuation | OK | 26 May - 4 June 1940
dates-first-mri-human-scan | OK | 3 July 1977, Damadian's Indomitable; the first scan took nearly five hours, which is what the hint says
dates-meiji-restoration | OK | 3 January 1868
dates-gravitational-waves-detected | OK | 14 September 2015, announced the following February
dates-little-bighorn | OK | 25-26 June 1876
dates-insulin-first-used | OK | Leonard Thompson, 11 January 1922
dates-reunification-of-germany | OK | 3 October 1990
dates-salk-polio-vaccine | OK | announced safe and effective 12 April 1955
dates-chinese-republic-founded | OK | Puyi abdicated 12 February 1912
dates-watergate-break-in | OK | 17 June 1972
dates-wimbledon-first-championship | OK | opened 9 July 1877
dates-arab-spring-begins | OK | began 17 December 2010, Tunisia
dates-hoover-dam-completed | OK | dedicated September 1935 while still unfinished, construction completed 1936; scheduled for 1938, so "two years ahead" in the hint holds
dates-darwin-beagle-sails | OK | 1831
dates-faraday-induction | OK | 1831
dates-first-iss-module | OK | Zarya, 20 November 1998
dates-taiping-rebellion-begins | OK-WITH-NOTE | the Jintian Uprising was 11 January 1851 and armed clashes began late 1850; both datings are used and year precision covers either
dates-gold-rush-california | OK | gold found early 1848
dates-1984-published | OK | 8 June 1949, Secker and Warburg. Re-checked: one aggregated result gave 1948, which is the year Orwell finished writing it, not publication
dates-sydney-harbour-bridge | OK | 19 March 1932
dates-prcs-founded | OK | 1 October 1949, proclaimed by Mao at Tiananmen
dates-six-day-war | OK | June 1967
dates-crispr-gene-editing-paper | OK | Jinek et al., Science, 2012; Nobel 2020
dates-pasteurisation-patented | OK | patent filed 11 April 1865 for preserving wine; applied to wine and beer well before milk, as the hint says
dates-lister-antiseptic-surgery | OK | carbolic acid work from 1865, published 1867
dates-alaska-purchase | OK | 1867
dates-stanley-finds-livingstone | OK | 10 November 1871
dates-mexican-revolution-begins | OK | 20 November 1910
dates-boxer-rebellion | OK | legations besieged from June 1900
dates-second-boer-war-begins | OK | 11 October 1899
dates-russo-japanese-war | OK | began 8 February 1904, attack on Port Arthur
dates-new-york-subway-opens | OK | 27 October 1904, IRT
dates-indian-rebellion-1857 | OK | 1857, suppressed by late 1858, ended Company rule
dates-continental-drift-proposed | OK | 6 January 1912, German Geological Society, Frankfurt
dates-first-nuclear-test | OK | Trinity, 16 July 1945
dates-bretton-woods | OK | July 1944
dates-solidarity-founded | OK | 1980, Walesa; martial law followed
dates-gorbachev-takes-power | OK | 1985, glasnost and perestroika
dates-bannister-four-minute-mile | OK | 6 May 1954, 3:59.4
dates-amritsar-massacre | OK | 13 April 1919, Jallianwala Bagh
dates-salt-march | OK | 1930
dates-long-march-begins | OK | 16 October 1934
dates-warsaw-pact-founded | OK | 1955, answering West Germany joining NATO
dates-prague-spring | OK | 1968, crushed by a Warsaw Pact invasion in August
dates-camp-david-accords | OK | signed 17 September 1978
dates-apollo-13 | OK | April 1970
dates-human-genome-draft | OK | working draft announced 26 June 2000
dates-new-horizons-pluto | OK | 14 July 2015
dates-paris-climate-agreement | OK | 12 December 2015
dates-egypt-unified | OK | c.3100 BC under Narmer
dates-wheel-for-transport | OK | wheeled wagons depicted at Uruk c.3500-3350 BC; oldest wooden wheel c.3200 BC
dates-thera-eruption | OK-WITH-NOTE | circa 1600 BC; radiocarbon and archaeological datings differ by about a century, which is why the question is asked to the century
dates-bronze-age-collapse | OK-WITH-NOTE | clustered around 1200-1150 BC
dates-cyrus-takes-babylon | OK | October 539 BC
dates-socrates-executed | OK | 399 BC, tried for impiety and corrupting the youth
dates-homer-composed | OK-WITH-NOTE | composed around 750 BC, ending the Greek dark age
dates-ashoka-reign-begins | OK | took the throne around 268 BC
dates-roman-conquest-of-britain | OK | AD 43, Aulus Plautius sent by Claudius
dates-constantinople-founded | OK | dedicated 11 May 330
dates-tang-dynasty-founded | OK | 618, Li Yuan (Gaozu)
dates-umayyad-conquest-of-spain | OK | 711, Battle of Guadalete
dates-baghdad-founded | OK | 762, al-Mansur
dates-song-dynasty-founded | OK | 960, Zhao Kuangyin as Emperor Taizu
dates-norse-reach-north-america | OK-WITH-NOTE | precisely dated to 1021 by tree-ring work at L'Anse aux Meadows, well inside the century band
dates-mali-empire-founded | OK | Sundiata's victory at Kirina, 1235
dates-great-zimbabwe | OK | at its peak around 1300
dates-ming-dynasty-founded | OK | January 1368, Zhu Yuanzhang as the Hongwu emperor
dates-cortes-reaches-tenochtitlan | OK | 8 November 1519
dates-pizarro-captures-atahualpa | OK | 16 November 1532, Cajamarca
dates-copernicus-published | OK | 1543, a week apart from Vesalius
dates-vesalius-anatomy | OK | 1543, Basel
dates-ivan-crowned-tsar | OK | crowned 16 January 1547
dates-tokugawa-shogunate-founded | OK | Ieyasu took the title of shogun 1603
dates-jamestown-founded | OK | 1607
dates-qing-take-beijing | OK | 6 June 1644
dates-great-plague-of-london | OK | 1665
dates-siege-of-vienna-1683 | OK | siege 17 July - 12 September 1683, lifted by Sobieski
dates-handel-messiah-premiere | OK | Dublin, 13 April 1742, Music Hall in Fishamble Street
dates-battle-of-plassey | OK | 1757, East India Company victory over Siraj-ud-Daulah
dates-watt-separate-condenser | OK | patent granted 5 January 1769
dates-cook-reaches-australia | OK | charted the east coast through 1770
dates-first-manned-balloon-flight | OK | 21 November 1783, de Rozier and d'Arlandes over Paris
dates-mozart-dies | OK | 5 December 1791, aged 35
dates-haiti-independence | OK | 1 January 1804, Gonaives, Dessalines
dates-greek-independence-war | OK | began 1821, independence recognised 1832
dates-monroe-doctrine | OK | 2 December 1823
dates-thirteenth-amendment | OK | ratification announced 18 December 1865
dates-first-impressionist-exhibition | OK | April 1874, 35 Boulevard des Capucines
dates-nutcracker-premiere | OK | 18 December 1892, Mariinsky
dates-the-scream-painted | OK | 1893
dates-first-ferris-wheel | OK | 1893 Chicago world's fair
dates-starry-night-painted | OK | 1889
dates-demoiselles-davignon | OK | 1907
dates-trans-siberian-completed | OK | 1916, wholly within Russian territory
dates-duchamp-fountain | OK | 1917
dates-ulysses-published | OK | 1922
dates-great-gatsby-published | OK | 1925
dates-snow-white-released | OK | 1937
dates-citizen-kane-released | OK | 1941
dates-fellowship-of-the-ring-published | OK | 1954
dates-elvis-first-record | OK | 5 July 1954, That's All Right at Sun
dates-to-kill-a-mockingbird | OK | 1960
dates-beatles-ed-sullivan | OK | 9 February 1964, seventy million viewers
dates-sgt-pepper-released | OK | 1 June 1967
dates-woodstock | OK | August 1969, Bethel NY
dates-rumble-in-the-jungle | OK | 30 October 1974, Kinshasa
dates-jaws-released | OK | 1975
dates-thriller-released | OK | released 29-30 November 1982
dates-yugoslavia-breaks-up | OK | Slovenia and Croatia declared independence 25 June 1991
dates-gulf-war-begins | OK | air campaign from 17 January 1991, after the 15 January deadline
dates-srebrenica | OK | 11-22 July 1995
dates-toy-story-released | OK | 1995
dates-first-harry-potter-published | OK | 1997
dates-kyoto-protocol | OK | adopted 11 December 1997, in force 2005
dates-burj-khalifa-opens | OK | opened 4 January 2010
dates-persepolis-begun | OK | construction began around 518 BC under Darius
dates-silk-road-opens | OK | Han China opened trade westward about 130 BC; Zhang Qian was sent in 138 BC
dates-boudica-revolt | OK | AD 60-61, Iceni revolt under Suetonius Paulinus
dates-plague-of-justinian | OK | began about 541, reached Constantinople 542
dates-timur-sacks-delhi | OK | 17 December 1398
dates-council-of-trent | OK | opened December 1545, sat on and off for eighteen years
dates-dutch-declare-independence | OK | Act of Abjuration signed 26 July 1581
dates-phoenician-alphabet | OK | by convention from around 1050 BC
dates-euclid-elements | OK | c.300 BC

## The questions written to reach 500

The bank grew from 367 to 500 in one pass. Every one of the 133 new
questions was checked against a source **before** it was written, not after -
the practice World Records arrived at the hard way and the one the owner asked
for explicitly. Nothing was drafted from memory and then looked up.

The bulk of the checking was done against single-source chronologies that
carry many events at once - Wikipedia's timelines of the Middle Ages, the
17th, 18th, 19th and 20th centuries - and then each answer was written with a
primary or institutional source of its own in the `source` field: Bede for the
Anglo-Saxon church, al-Tabari for the early caliphate, the Codex Justinianus
for Justinian's law, the statute book for British acts, the Smithsonian for
Tambora.

Four candidate questions were dropped during writing rather than corrected,
because the sources would not settle them to the precision the question
needed: the Arab capture of Jerusalem (637 or 638 depending on the account),
the start of the Tower of London, Savery's steam engine (patent and
demonstration a year apart), and the founding of the Hanseatic League, which
different accounts date to the refounding of Lubeck in either of two years.

Where an answer is a convention rather than a record - the founding of the
Ottoman state, the settlement of Iceland, the founding of Bologna - the
question says so in its own words ("conventionally dated", "tradition
dates"), and three more are asked to the decade because the scholarship is
genuinely a spread: The Tale of Genji, the Canon of Medicine, the Templars,
and Eric the Red in Greenland.

### The log

dates-salamis | OK | 480 BC; Herodotus, Histories, Book VIII
dates-peloponnesian-war-begins | OK | 431 BC; Thucydides, History of the Peloponnesian War, Book II
dates-gaugamela | OK | 331 BC; Arrian, Anabasis of Alexander, Book III
dates-carthage-destroyed | OK | 146 BC; Polybius, Histories, Book XXXIX, and Appian, Punica
dates-great-fire-of-rome | OK | 64; Tacitus, Annals, Book XV
dates-antonine-plague-begins | OK | 165; Cassius Dio, Roman History, with Galen's accounts of the epidemic
dates-adrianople | OK | 378; Ammianus Marcellinus, Res Gestae, Book XXXI
dates-edict-of-thessalonica | OK | 380; Codex Theodosianus XVI.1.2
dates-council-of-ephesus | OK | 431; Acts of the Council of Ephesus
dates-vandals-sack-rome | OK | 455; Prosper of Aquitaine, Chronicle
dates-theodoric-kills-odoacer | OK | 493; Anonymus Valesianus, with John of Antioch
dates-justinian-code | OK | 529; Codex Justinianus, constitutio Summa rei publicae
dates-monte-cassino-founded | OK | 529; Gregory the Great, Dialogues, Book II
dates-nika-riots | OK | 532; Procopius, History of the Wars, Book I
dates-lombard-kingdom-founded | OK | 568; Paul the Deacon, History of the Lombards, Book II
dates-sui-dynasty-founded | OK | 581; Book of Sui, Annals of Emperor Wen
dates-augustine-arrives-kent | OK | 597; Bede, Ecclesiastical History of the English People, Book I
dates-grand-canal-completed | OK | 609; Book of Sui, treatise on waterways
dates-battle-of-nineveh | OK | 627; Theophanes the Confessor, Chronographia
dates-muhammad-dies | OK | 632; Ibn Ishaq, Sirat Rasul Allah, as transmitted by Ibn Hisham
dates-battle-of-nahavand | OK | 642; al-Baladhuri, Futuh al-Buldan
dates-synod-of-whitby | OK | 664; Bede, Ecclesiastical History of the English People, Book III
dates-karbala | OK | 680; al-Tabari, History of the Prophets and Kings
dates-first-bulgarian-empire | OK | 681; Theophanes the Confessor, Chronographia
dates-abbasid-caliphate-begins | OK | 750; al-Tabari, History of the Prophets and Kings
dates-battle-of-talas | OK | 751; Book of Tang, with al-Tabari
dates-roncevaux-pass | OK | 778; Einhard, Life of Charlemagne
dates-heian-period-begins | OK | 794; Nihon Kiryaku, and Imperial Household Agency records of the Heian capital
dates-treaty-of-verdun | OK | 843; Annals of St Bertin
dates-diamond-sutra-printed | OK | 868; British Library, Dunhuang collection, colophon of the Diamond Sutra scroll
dates-alfred-the-great-crowned | OK | 871; Anglo-Saxon Chronicle, entry for Alfred's accession
dates-iceland-settled | OK | 874; Landnamabok, the Icelandic Book of Settlements
dates-kievan-rus-established | OK | 882; Primary Chronicle, the Tale of Bygone Years
dates-battle-of-lechfeld | OK | 955; Widukind of Corvey, Deeds of the Saxons
dates-otto-crowned-emperor | OK | 962; Liudprand of Cremona, with the Regesta Imperii
dates-eric-the-red-greenland | OK | 985; Eirik the Red's Saga, with Landnamabok
dates-vladimir-converts | OK | 988; Primary Chronicle, the Tale of Bygone Years
dates-canute-king-of-england | OK | 1016; Anglo-Saxon Chronicle, entry for Cnut's accession
dates-tale-of-genji-completed | OK | 1021; Murasaki Shikibu's diary, with the standard scholarly dating of the Genji monogatari
dates-canon-of-medicine | OK | 1025; Ibn Sina, al-Qanun fi al-Tibb, standard dating of its completion
dates-seljuk-empire-founded | OK | 1037; Ibn al-Athir, The Complete History
dates-manzikert | OK | 1071; Michael Attaleiates, History
dates-henry-iv-canossa | OK | 1077; Lampert of Hersfeld, Annals
dates-university-of-bologna-founded | OK | 1088; University of Bologna, official account of its foundation
dates-council-of-clermont | OK | 1095; Fulcher of Chartres, History of the Expedition to Jerusalem
dates-knights-templar-founded | OK | 1119; William of Tyre, History of Deeds Done Beyond the Sea
dates-concordat-of-worms | OK | 1122; Text of the Concordat of Worms, Monumenta Germaniae Historica
dates-battle-of-dan-no-ura | OK | 1185; The Tale of the Heike, with the Azuma Kagami
dates-saladin-takes-jerusalem | OK | 1187; Baha al-Din ibn Shaddad, The Rare and Excellent History of Saladin
dates-fourth-crusade-sacks-constantinople | OK | 1204; Geoffrey of Villehardouin, The Conquest of Constantinople
dates-cambridge-founded | OK | 1209; University of Cambridge, official account of its foundation
dates-las-navas-de-tolosa | OK | 1212; Rodrigo Jimenez de Rada, De rebus Hispaniae
dates-battle-of-bouvines | OK | 1214; William the Breton, Philippide
dates-siege-of-baghdad | OK | 1258; Rashid al-Din, Jami al-Tawarikh
dates-aquinas-dies | OK | 1274; Acts of the canonisation process of Thomas Aquinas
dates-battle-of-yamen | OK | 1279; History of Song, final annals
dates-sicilian-vespers | OK | 1282; Bartholomew of Neocastro, Historia Sicula
dates-stirling-bridge | OK | 1297; Walter of Guisborough, Chronicle
dates-ottoman-state-founded | OK | 1299; Ottoman dynastic chronicles, conventional dating from Osman I
dates-wallace-executed | OK | 1305; Chronicle of Lanercost
dates-templars-arrested | OK | 1307; Registers of the trial of the Templars, Vatican Apostolic Archive
dates-bannockburn | OK | 1314; John Barbour, The Brus, with the Scotichronicon
dates-battle-of-crecy | OK | 1346; Jean Froissart, Chronicles
dates-peasants-revolt | OK | 1381; Thomas Walsingham, Chronica Maiora, with the Anonimalle Chronicle
dates-battle-of-kosovo | OK | 1389; Constantine the Philosopher, Life of Stefan Lazarevic, with Ottoman accounts
dates-joan-of-arc-burned | OK | 1431; Record of the trial of condemnation of Joan of Arc, Rouen
dates-vasco-da-gama-reaches-india | OK | 1498; Roteiro da primeira viagem de Vasco da Gama a India
dates-diet-of-worms | OK | 1521; Edict of Worms, Deutsche Reichstagsakten
dates-sack-of-rome-1527 | OK | 1527; Luigi Guicciardini, The Sack of Rome
dates-st-bartholomews-day-massacre | OK | 1572; Registers of the Parlement of Paris, with contemporary accounts of the French Wars of Religion
dates-drake-circumnavigation-returns | OK | 1580; The World Encompassed by Sir Francis Drake
dates-mary-queen-of-scots-executed | OK | 1587; Calendar of State Papers, Scotland, warrant and report of the execution at Fotheringhay
dates-giordano-bruno-burned | OK | 1600; Records of the Roman Inquisition, summary of the trial of Giordano Bruno
dates-dutch-east-india-company-founded | OK | 1602; Charter of the Vereenigde Oostindische Compagnie, States-General of the Netherlands
dates-gunpowder-plot | OK | 1605; State Papers Domestic, James I, with the confession of Guy Fawkes
dates-quebec-city-founded | OK | 1608; Samuel de Champlain, Les Voyages
dates-king-james-bible | OK | 1611; Title page of the Authorised Version, Robert Barker, London
dates-napier-logarithms | OK | 1614; John Napier, Mirifici Logarithmorum Canonis Descriptio
dates-defenestration-of-prague | OK | 1618; Contemporary Bohemian accounts of the defenestration, with Imperial Diet records
dates-battle-of-white-mountain | OK | 1620; Imperial war records and contemporary accounts of the Bohemian revolt
dates-new-amsterdam-founded | OK | 1625; Records of the Dutch West India Company, New Netherland
dates-st-peters-basilica-consecrated | OK | 1626; Fabbrica di San Pietro, record of the consecration by Urban VIII
dates-descartes-discourse | OK | 1637; Rene Descartes, Discours de la methode, Leiden
dates-first-opera-house-opens | OK | 1637; Records of the Teatro San Cassiano, Venice
dates-tasman-sights-new-zealand | OK | 1642; Abel Tasman, journal of the voyage of the Heemskerck and Zeehaen
dates-cape-town-founded | OK | 1652; Jan van Riebeeck, journal of the Cape settlement
dates-royal-society-founded | OK | 1660; Journal Book of the Royal Society, record of the founding meeting
dates-micrographia-published | OK | 1665; Robert Hooke, Micrographia, printed for the Royal Society
dates-new-york-renamed | OK | 1664; Articles of Capitulation on the Reduction of New Netherland
dates-leeuwenhoek-first-letter | OK | 1673; Letters of Antonie van Leeuwenhoek, Philosophical Transactions of the Royal Society
dates-greenwich-observatory-founded | OK | 1675; Royal warrant of Charles II founding the Observatory at Greenwich
dates-edict-of-fontainebleau | OK | 1685; Edict of Fontainebleau, revoking the Edict of Nantes
dates-locke-two-treatises | OK | 1689; John Locke, Two Treatises of Government, printed for Awnsham Churchill, London
dates-battle-of-the-boyne | OK | 1690; Contemporary dispatches of the Williamite war in Ireland
dates-salem-witch-trials | OK | 1692; Salem Witchcraft Papers, Essex County court records
dates-treaty-of-karlowitz | OK | 1699; Text of the Treaty of Karlowitz
dates-statute-of-anne | OK | 1710; Statute of Anne, 8 Anne c. 21, Parliament of Great Britain
dates-battle-of-poltava | OK | 1709; Russian and Swedish campaign records of the Great Northern War
dates-treaty-of-utrecht | OK | 1713; Text of the Treaty of Utrecht
dates-new-orleans-founded | OK | 1718; Records of the Company of the Indies, founding of La Nouvelle-Orleans
dates-south-sea-bubble | OK | 1720; Reports of the parliamentary committee of inquiry into the South Sea Company
dates-first-british-prime-minister | OK | 1721; Journals of the House of Commons, Walpole's appointment as First Lord of the Treasury
dates-culloden | OK | 1746; Contemporary dispatches of the Duke of Cumberland's army
dates-plains-of-abraham | OK | 1759; Dispatches of the Quebec campaign, British Army records
dates-treaty-of-paris-1763 | OK | 1763; Text of the Treaty of Paris ending the Seven Years War
dates-stamp-act | OK | 1765; Stamp Act 1765, 5 Geo. III c. 12
dates-boston-massacre | OK | 5 March 1770; Records of the trial of the soldiers, Suffolk County, Massachusetts
dates-arkwright-cromford-mill | OK | 1771; Arkwright partnership records, Cromford Mill, Derbyshire
dates-wealth-of-nations | OK | 1776; Adam Smith, An Inquiry into the Nature and Causes of the Wealth of Nations, London
dates-cook-killed-hawaii | OK | 1779; Journals of the third voyage of Captain James Cook, Admiralty records
dates-critique-of-pure-reason | OK | 1781; Immanuel Kant, Kritik der reinen Vernunft, first edition, Riga
dates-declaration-rights-of-man | OK | 1789; Declaration des droits de l'homme et du citoyen, National Constituent Assembly
dates-washington-inaugurated | OK | 30 April 1789; Journal of the First Congress of the United States, record of the inauguration
dates-us-bill-of-rights-ratified | OK | 1791; National Archives, records of ratification of the Bill of Rights
dates-marie-antoinette-executed | OK | 16 October 1793; Records of the Revolutionary Tribunal, Paris
dates-napoleon-first-consul | OK | 1799; Constitution of the Year VIII, French Republic
dates-louisiana-purchase | OK | 1803; Louisiana Purchase Treaty between the United States and the French Republic
dates-austerlitz | OK | 1805; Bulletins of the Grande Armee, with Austrian and Russian campaign records
dates-holy-roman-empire-dissolved | OK | 1806; Instrument of abdication of Francis II, Imperial archives, Vienna
dates-britain-abolishes-slave-trade | OK | 1807; Slave Trade Act 1807, 47 Geo. III c. 36
dates-tambora-eruption | OK | 1815; Smithsonian Institution Global Volcanism Program, Tambora eruptive history
dates-frankenstein-published | OK | 1818; Frankenstein, or The Modern Prometheus, first edition, Lackington, London
dates-singapore-founded | OK | 1819; Treaty between the East India Company and the Sultan of Johor
dates-peterloo-massacre | OK | 1819; Reports of the Manchester magistrates and the inquest into the deaths at St Peter's Field
dates-napoleon-dies | OK | 1821; Report of the post-mortem examination, British garrison, Saint Helena
dates-erie-canal-opens | OK | 1825; New York State Canal Corporation, record of the opening of the Erie Canal
dates-metropolitan-police-founded | OK | 1829; Metropolitan Police Act 1829, 10 Geo. IV c. 44
dates-liverpool-manchester-railway | OK | 1830; Liverpool and Manchester Railway Company, record of the opening day
dates-great-reform-act | OK | 1832; Representation of the People Act 1832, 2 and 3 Will. IV c. 45
dates-treaty-of-waitangi | OK | 1840; Archives New Zealand, the Treaty of Waitangi sheets
dates-dinosaur-word-coined | OK | 1841; Richard Owen, Report on British Fossil Reptiles, British Association for the Advancement of Science
dates-treaty-of-nanking | OK | 1842; Text of the Treaty of Nanking
dates-seneca-falls-convention | OK | 1848; Report of the Woman's Rights Convention held at Seneca Falls, New York

## What is still not covered

This pass checked that each answer is right. It did not audit whether each
question is a GOOD question - whether it can be triangulated rather than
recalled, which is the bank's own selection rule and the thing no source can
settle. A date can be perfectly correct and still be a free hundred points or
an unguessable coin flip.

That judgement was made when each question was written and has not been
revisited. If a question starts feeling like either, the schedule is
append-only: leave it in place and do not write another like it.
