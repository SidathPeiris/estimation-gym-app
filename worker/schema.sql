-- One row per (question, band). Counts only; nothing identifies a player.
--
-- Keyed on question_id rather than a day number on purpose: growing the bank
-- reshuffles which question falls on which date, so day-keyed history would
-- eventually attach a distribution to the wrong question.
CREATE TABLE IF NOT EXISTS responses (
  question_id TEXT    NOT NULL,
  band        TEXT    NOT NULL,
  tally       INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (question_id, band)
);

-- Crude per-IP-per-question guard. Not security - it raises the effort of
-- casually stuffing one question's numbers, nothing more. See README.
CREATE TABLE IF NOT EXISTS seen (
  question_id TEXT    NOT NULL,
  client      TEXT    NOT NULL,
  at          INTEGER NOT NULL,
  PRIMARY KEY (question_id, client)
);
