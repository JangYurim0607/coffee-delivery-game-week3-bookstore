const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const html = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');
const script = html.match(/<script>([\s\S]*?)<\/script>/)[1];
// Load the game's exported rules without mounting a browser canvas.
const core = script.slice(0, script.indexOf('const game=Ttokttak.mount'));
const context = {module: {exports: {}}};
vm.runInNewContext(core, context);
const g = context.module.exports;

const site = (s, id) => g.sites(s.world).all.find(a => a.id === id);
const goTo = (s, id) => { s.pos = site(s, id).door.slice(); };
function run(s, sec, input) { for (let t = 0; t < sec; t += .05) g.step(s, .05, input); }
function checkBoard(s) { goTo(s, 'base'); assert.equal(g.interact(s), true); assert.equal(s.phase, 'board'); run(s, .5); g.interact(s); assert.equal(s.journalSeen, true); }
// Win whichever bet the author proposes.
function winBet(s) {
  run(s, .5); const kind = s.visit.bet; g.interact(s);
  if (kind === 'quiz') g.answer(s, s.quiz.answer);
  else if (kind === 'timing') while (s.phase === 'timing') { s.timing.pos = s.timing.c; s.timing.cool = 0; g.interact(s); run(s, .6); }
  else if (kind === 'memory') { run(s, s.mem.seq.length * .75 + .4); for (const d of [...s.mem.seq]) g.memInput(s, d); }
  else if (kind === 'reaction') { while (!s.react.go) g.step(s, .05); g.interact(s); }
  else if (kind === 'cups') { while (s.cups.stage !== 'pick') g.step(s, .05); g.pickCup(s, s.cups.slot[s.cups.ball]); run(s, 1.4); }
  assert.equal(s.phase, 'betResult'); assert.equal(s.visit.won, true, kind);
  run(s, 2);
}
function collect(s, id) {
  goTo(s, id); s.energy = 100;
  assert.equal(g.interact(s), true); assert.equal(s.phase, 'knock');
  while (s.phase === 'knock' && !s.visit.openT) g.interact(s);
  run(s, 1);
  if (s.phase === 'bet') winBet(s);
  while (s.phase === 'hurry') g.interact(s);
  assert.equal(s.phase, 'got'); assert.ok(s.got.includes(id));
  run(s, 3); assert.equal(s.phase, 'explore');
}

test('ready state does not move or act; start, pause and walking', () => {
  const s = g.newGame(1);
  const initial = JSON.stringify(s.pos);
  g.step(s, .02, {x: 1});
  assert.equal(JSON.stringify(s.pos), initial);
  assert.equal(g.interact(s), false);
  g.start(s); g.step(s, .02);
  assert.equal(s.time, .02); assert.ok(s.clock > 0);
  g.pause(s); g.step(s, .02);
  assert.equal(s.time, .02);
  g.pause(s); assert.equal(s.status, 'playing');
  const e = s.energy; run(s, .5, {x: 1});
  assert.notEqual(JSON.stringify(s.pos), initial); assert.ok(s.energy < e);
});

test('the clock advances in 15-minute steps from 06:00 to midnight', () => {
  assert.equal(g.clockLabel(0), '06:00');
  assert.equal(g.clockLabel(g.DAY_LEN / 72 * .9), '06:00');
  assert.equal(g.clockLabel(g.DAY_LEN / 72 * 1.01), '06:15');
  assert.equal(g.clockLabel(g.DAY_LEN / 2), '15:00');
  assert.equal(g.clockLabel(g.DAY_LEN), '00:00');
});

test('the weekly board must be checked before authors open the door', () => {
  const s = g.newGame(2); g.start(s);
  const id = s.quota[0];
  goTo(s, id);
  assert.equal(g.interact(s), false); assert.equal(s.phase, 'explore');
  s.pos = [-11, 11]; assert.equal(g.interact(s), false);
  checkBoard(s);
  goTo(s, id); assert.equal(g.interact(s), true); assert.equal(s.phase, 'knock');
});

test('knocking opens after the random count; hurrying fills the manuscript and costs energy', () => {
  const s = g.newGame(3); g.start(s); checkBoard(s);
  const id = s.quota[0]; s.work[id].p = .2;
  goTo(s, id); g.interact(s);
  const need = s.visit.need; assert.ok(need >= 3 && need <= 9);
  for (let i = 1; i < need; i++) { g.interact(s); assert.equal(s.visit.openT, 0); }
  g.interact(s); assert.ok(s.visit.openT > 0);
  run(s, 1);
  if (s.phase === 'bet') { s.visit.bet = 'quiz'; run(s, .5); g.interact(s); g.answer(s, (s.quiz.answer + 1) % 3); run(s, 2); }
  assert.equal(s.phase, 'hurry');
  const h = s.hurry; assert.ok(h.need >= 6);
  s.energy = 0; assert.equal(g.interact(s), false); assert.equal(h.count, 0);
  s.energy = 100;
  for (let i = 1; i < h.need; i++) g.interact(s);
  assert.equal(s.phase, 'hurry'); assert.ok(s.work[id].p < 1); assert.ok(s.energy < 100);
  g.interact(s); assert.equal(s.phase, 'got'); assert.deepEqual([...s.got], [id]);
});

test('cafés sell apple < pomegranate < starfruit for seeds', () => {
  const s = g.newGame(4); g.start(s);
  const cafe = g.sites('forest').cafes[0];
  s.pos = cafe.door.slice(); assert.equal(g.interact(s), true); assert.equal(s.phase, 'cafe');
  assert.ok(g.DRINKS[0].energy < g.DRINKS[1].energy && g.DRINKS[1].energy < g.DRINKS[2].energy);
  s.energy = 0; s.seeds = 30;
  assert.equal(g.buy(s, 1), true); assert.equal(s.energy, 50); assert.equal(s.seeds, 18);
  assert.equal(g.buy(s, 2), false); assert.equal(s.seeds, 18);
  s.seeds = 30; assert.equal(g.buy(s, 2), true); assert.equal(s.energy, 100); assert.equal(s.seeds, 10);
  s.seeds = 3; s.energy = 10; assert.equal(g.buy(s, 0), false); assert.equal(s.energy, 10);
  run(s, .5); g.interact(s); assert.equal(s.phase, 'explore');
});

test('every minigame can be won, and the cup bet pays double', () => {
  for (const kind of Object.keys(g.GAMES)) {
    const s = g.newGame(10); g.start(s); checkBoard(s);
    const id = s.quota[0]; s.work[id].p = .1; goTo(s, id); g.interact(s);
    while (!s.visit.openT) g.interact(s);
    run(s, .95);
    if (s.phase !== 'bet') { s.visit.bet = kind; s.phase = 'bet'; s.phaseT = 0; }
    s.visit.bet = kind; s.seeds = 40;
    winBet(s);
    if (kind === 'cups') assert.equal(s.seeds, 45);
    assert.equal(s.phase, 'got', kind);
  }
});

test('an early press loses the reaction duel; a wrong arrow loses the memory game', () => {
  let s = g.newGame(11); g.start(s); checkBoard(s);
  goTo(s, s.quota[0]); g.interact(s); while (!s.visit.openT) g.interact(s); run(s, .95);
  s.phase = 'bet'; s.phaseT = 1; s.visit.bet = 'reaction'; g.interact(s); g.interact(s);
  assert.equal(s.phase, 'betResult'); assert.equal(s.visit.won, false);
  s = g.newGame(12); g.start(s); checkBoard(s);
  goTo(s, s.quota[0]); g.interact(s); while (!s.visit.openT) g.interact(s); run(s, .95);
  s.phase = 'bet'; s.phaseT = 1; s.visit.bet = 'memory'; g.interact(s); run(s, 6);
  g.memInput(s, (s.mem.seq[0] + 1) % 4); assert.equal(s.visit.won, false);
});

test('a day ends at midnight and Friday night closes the week', () => {
  const s = g.newGame(4); g.start(s);
  run(s, g.DAY_LEN + 1); assert.equal(s.phase, 'dayEnd');
  s.energy = 10; run(s, 1); g.interact(s); assert.equal(s.phase, 'explore'); assert.equal(s.day, 1); assert.equal(s.clock, 0); assert.equal(s.energy, 70);
  for (let d = 1; d < 4; d++) { run(s, g.DAY_LEN + 1); run(s, 1); g.interact(s); }
  run(s, g.DAY_LEN + 1); assert.equal(s.phase, 'weekEnd'); assert.equal(s.lastResult.got, 0); assert.ok(s.rep < 3);
});

test('three forest weeks, a sea week with a dive, then a monthly publication', () => {
  const s = g.newGame(5); g.start(s);
  for (let w = 1; w <= 4; w++) {
    assert.equal(s.world, w === 4 ? 'sea' : 'forest');
    if (w === 4) {
      assert.ok(g.sites('sea').authors.some(a => a.under));
      s.events.length = 0; s.pos = [4, 0]; run(s, .2, {x: 1});
      assert.equal(s.under, true); assert.ok(s.events.some(e => e.t === 'dive'));
    }
    checkBoard(s);
    for (const id of [...s.quota]) collect(s, id);
    goTo(s, 'base'); assert.equal(g.interact(s), true); assert.equal(s.phase, 'weekEnd');
    run(s, 1); g.interact(s);
    if (w === 3) { assert.equal(s.phase, 'travel'); run(s, 1); g.interact(s); }
  }
  assert.equal(s.phase, 'monthEnd'); assert.equal(s.monthResult.books, 9); assert.equal(s.totalBooks, 9); assert.equal(s.level, 2);
  assert.ok(s.monthResult.seedGain > 0);
  run(s, 1); g.interact(s);
  assert.equal(s.month, 2); assert.equal(s.world, 'forest'); assert.equal(s.quota.length, 4);
});

test('doors, starts and path waypoints are reachable (not inside obstacles)', () => {
  for (const world of ['forest', 'sea']) {
    const w = g.sites(world), s = g.newGame(); s.world = world;
    for (const p of [w.start, ...w.all.map(x => x.door)]) assert.equal(g.blocked(s, p[0], p[1]), false, world + ' ' + p);
    for (const p of g.paths(world)) for (let i = 1; i < p.length; i++) for (let t = 0; t <= 1; t += .02)
      assert.equal(g.blocked(s, p[i - 1][0] + (p[i][0] - p[i - 1][0]) * t, p[i - 1][1] + (p[i][1] - p[i - 1][1]) * t), false, world + ' path');
  }
});
