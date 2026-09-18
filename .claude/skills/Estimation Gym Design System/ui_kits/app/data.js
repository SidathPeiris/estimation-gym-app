/* Fake data for the click-through. Question text, units, hints, sources and
   archetype guidance are taken verbatim from core/questions.js and
   core/Model.js STRATEGIES in the source repo.

   The question system, as the code defines it:
   - The bank is append-only. Day N gets bank[N - SCHEDULE_ORIGIN], so everyone
     on the same calendar date gets the same question and growing the bank
     cannot re-deal a day already played.
   - There is exactly one daily question. Answering is idempotent per day.
   - Practice draws from practicePool(): the bank minus the questions the daily
     is scheduled to use within PRACTICE_RESERVE_DAYS (365), minus the ones you
     have already answered as a daily on this device, minus the ones you have
     already practised. So a practice question is either more than a year away
     in the queue or a past daily you never played.
   - Practice awards no points and touches neither streak, stats nor the shared
     distribution. */
const EG_DATA = {
  today: 'Tue 16 Sep',
  puzzleNumber: 8,
  streak: 6,
  best: 14,
  bankSize: 1000,
  reserveDays: 365,
  practiceAvailable: 621,

  daily: {
    prompt: 'How many bacteria live on an average mobile phone screen?',
    unit: 'bacteria', answerValue: 17000, answerLabel: '17,000', asOf: 2025,
    archetype: 'Area times density',
    guidance: 'Estimate how much area or volume is involved and how densely the thing is packed into it, then multiply. A handful of densities per square metre or per litre are worth memorising; they transfer to a lot of questions.',
    hint: 'About 100 square centimetres, handled constantly and cleaned rarely.',
    source: 'Microbiological swab studies of mobile devices'
  },

  /* Four draws from the pool. `origin` records why each one is practisable —
     the two cases practicePool() allows. */
  practice: [
    {
      id: 'stitches-in-a-pair-of-jeans',
      prompt: 'How many stitches are in a pair of jeans?',
      unit: 'stitches', answerValue: 12000, answerLabel: '12,000',
      archetype: 'Multiply a chain of estimates',
      guidance: 'This is a product of a few independent quantities. Write the chain out in units first and check that they cancel down to the unit you are asked for, then put a rough number on each link.',
      hint: 'Around 30 metres of seam at roughly eight stitches per centimetre.',
      source: 'Garment manufacturing specifications',
      origin: 'A daily from 4 March. You did not play that day.'
    },
    {
      id: 'sleepers-in-a-kilometre-of-track',
      prompt: 'How many sleepers are laid under one kilometre of railway track?',
      unit: 'sleepers', answerValue: 1650, answerLabel: '1,650',
      archetype: 'Divide a total by one unit',
      guidance: 'Estimate a total you can actually picture — a mass, a volume, a length, a budget — then divide by the size of a single unit. The total is often much better known than the count you are being asked for.',
      hint: 'Spaced about 60 centimetres apart along the line.',
      source: 'Permanent way engineering standards',
      origin: 'Due as a daily in 2 years and 4 months.'
    },
    {
      id: 'solar-panel-output-per-year',
      prompt: 'How many kilowatt hours does a single rooftop solar panel produce in a year?',
      unit: 'kilowatt hours', answerValue: 450, answerLabel: '450',
      archetype: 'Energy per unit times units',
      guidance: 'Find the energy per unit — per kilogram, per person, per event — and multiply by how many units there are. Checking the result against something familiar, like a home using about 10 kWh a day, catches most magnitude slips.',
      hint: 'A panel is roughly 400 watts peak, and a temperate site delivers something like 1,100 full-sun-equivalent hours a year.',
      source: 'Typical panel rating and capacity factor',
      origin: 'Due as a daily in 1 year and 8 months.'
    },
    {
      id: 'coastline-length-of-the-world',
      prompt: "How many kilometres is the total coastline of all the world's land?",
      unit: 'kilometres', answerValue: 1160000, answerLabel: '1,160,000',
      archetype: 'Recall, then sanity-check',
      guidance: 'This one leans on a figure you have probably met before. Pull up whatever number you half-remember, then check its magnitude against a related quantity you are confident about before committing to it.',
      hint: 'The answer depends on the measuring scale, which is the classic coastline paradox.',
      source: 'World Resources Institute coastline data',
      origin: 'A daily from 19 January. You did not play that day.'
    }
  ],

  bands: [
    { band: 'Bullseye', tally: 3, fraction: 0.25 },
    { band: 'Close', tally: 6, fraction: 0.50 },
    { band: 'Ballpark', tally: 2, fraction: 0.17 },
    { band: 'Off', tally: 1, fraction: 0.08 }
  ],
  distribution: [
    { band: 'Bullseye', tally: 112, fraction: 0.14 },
    { band: 'Close', tally: 331, fraction: 0.42 },
    { band: 'Ballpark', tally: 244, fraction: 0.31 },
    { band: 'Off', tally: 102, fraction: 0.13 }
  ],
  history: [
    { date: 'Mon 15 Sep', band: 'Bullseye', guess: '1.2e6', actual: '1.16e6', decades: 0.01, comparable: true },    { date: 'Sun 14 Sep', band: 'Close', guess: '35,000', actual: '29,000', decades: 0.08, comparable: true },
    { date: 'Sat 13 Sep', band: 'Ballpark', guess: '900', actual: '29,000', decades: 1.51, assisted: true, comparable: true },
    { date: 'Fri 12 Sep', band: 'Off', guess: '12', actual: '17,000', decades: 3.15, comparable: false },
    { date: 'Thu 11 Sep', band: 'Close', guess: '420', actual: '450', decades: 0.03, comparable: true }
  ],
  /* The seven calendar days behind the share card, oldest first. null is a day
     not played — calendar days, not played days, so a gap reads as a gap. */
  shareRun: ['Bullseye', 'Close', 'Ballpark', null, 'Off', 'Close', 'Close'],
  archetypes: [
    { label: 'People times per-person rate', played: 7, median: 0.42 },
    { label: 'Area times density', played: 5, median: 0.61 },
    { label: 'Stock equals flow times lifetime', played: 4, median: 1.08 },
    { label: 'Count the doublings', played: 1, median: null, thin: true }
  ],
  howToPlay: [
    "Read today's question and estimate the answer. Nobody expects you to know it — work it out from things you do know.",
    'Type your guess and submit. Scientific notation works for big numbers: 3e12 rather than counting zeroes.',
    'You are scored on how close you get in powers of ten, not on being exact.',
    'Come back tomorrow for a new question. Everyone gets the same one on the same day.'
  ]
};

/* The scoring the Model does: thresholds 0.3 / 1 / 2 decades. */
EG_DATA.score = function (raw, answerValue, assisted) {
  const guess = Number(raw);
  if (String(raw).trim() === '' || !isFinite(guess) || guess <= 0) return null;
  const decades = Math.abs(Math.log10(guess) - Math.log10(answerValue));
  const band = decades <= 0.3 ? 'Bullseye' : decades <= 1 ? 'Close' : decades <= 2 ? 'Ballpark' : 'Off';
  const base = { Bullseye: 100, Close: 70, Ballpark: 40, Off: 10 }[band];
  return {
    band, decades, assisted: !!assisted,
    points: assisted ? Math.round(base * 0.5) : base,
    guessLabel: guess.toLocaleString('en-GB')
  };
};
window.EG_DATA = EG_DATA;
/* Practice draws at random from whatever is left in the pool, as
   Model.pickPractice() does. `practised` is the list of ids already drawn on
   this device; a question never comes round again. Returns null once the pool
   is empty, which the screen presents as having worked through everything. */
EG_DATA.drawPractice = function (practised) {
  const taken = practised || [];
  const pool = EG_DATA.practice.filter((q) => taken.indexOf(q.id) < 0);
  if (!pool.length) return null;
  return pool[Math.floor(Math.random() * pool.length)];
};
