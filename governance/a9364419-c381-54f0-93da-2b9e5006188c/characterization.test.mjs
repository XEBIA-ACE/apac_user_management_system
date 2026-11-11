// Characterisation checks for story a9364419-c381-54f0-93da-2b9e5006188c (S2).
// Run: node --test governance/a9364419-c381-54f0-93da-2b9e5006188c/characterization.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const read = (p) => readFileSync(join(here, p), 'utf8');
const status = JSON.parse(read('status.json'));

const RUN = 'fd869c32-766f-5900-812d-d1e546a3a55b';
const IMPACT_HASH = 'sha256:3cde12d354b52c01f0a0545583f984f45067017a18ed7cfa633a25bb4d4d7580';
const BRANCHES = ['nodejs-sole-target', 'separate-java-service'];
const SPRING_JAVA = /spring\s*boot\s*3|java\s*(17|21)/i;
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

const gatePassed = status.gate.status === 'passed';
const objective = () => read(status.revised_objective.path);

test('obligation IDs and accepted impact hash are preserved verbatim', () => {
  assert.equal(status.accepted_impact_hash, IMPACT_HASH);
  for (const ac of ['S2-AC1', 'S2-AC2', 'S2-AC3', 'S2-AC4', 'S2-AC5', 'S2-AC6']) {
    assert.equal(status.obligation_ids[ac], `${RUN}:test:characterization:${ac}`);
  }
});

// [S2-AC1] fd869c32-766f-5900-812d-d1e546a3a55b:test:characterization:S2-AC1
test('[S2-AC1] S1 outcome is documented as the input basis before any drafting', () => {
  assert.ok(['blocked', 'passed'].includes(status.gate.status));
  const record = read(status.gate.record);
  assert.match(record, /66c13290-8591-5dce-968e-98f706f6a88e/);
  assert.match(record, /810fe751f082b675b4b572e9d05c965676508a6e/);
  assert.match(record, /stack identity/i);
  assert.match(record, /separate Java\/Spring Boot service/i);

  if (gatePassed) {
    assert.equal(status.s1.outcome_available, true);
    assert.ok(status.s1.stack_identity_confirmed, 'confirmed stack identity required');
    assert.equal(typeof status.s1.separate_java_service_exists, 'boolean');
    assert.ok(status.s1.confirmed_by, 'S1 confirmation must be attributable');
    assert.match(status.s1.confirmed_on ?? '', ISO_DATE);
    assert.ok(status.s1.decision_log_ref, 'S1 decision log reference required');
    assert.ok(BRANCHES.includes(status.objective_branch));
    assert.equal(
      status.objective_branch === 'separate-java-service',
      status.s1.separate_java_service_exists,
      'objective branch must follow the S1 answer',
    );
  } else {
    // Gate enforced: nothing downstream may exist while S1 is missing.
    assert.equal(status.s1.outcome_available, false);
    assert.equal(status.objective_branch, null);
    assert.equal(status.revised_objective.path, null);
    assert.equal(status.revised_objective.status, 'not_started');
    assert.match(record, /BLOCKED/);
  }
});

// [S2-AC2] fd869c32-766f-5900-812d-d1e546a3a55b:test:characterization:S2-AC2
test('[S2-AC2] Node.js-sole-target objective names the stack and omits Spring Boot/Java', (t) => {
  if (status.objective_branch !== 'nodejs-sole-target') {
    t.skip(`branch not selected by S1 (objective_branch=${status.objective_branch})`);
    return;
  }
  const text = objective();
  assert.match(text, /Node\.js\/TypeScript/);
  for (const dep of ['Express 4', 'better-sqlite3', 'ioredis', 'yamljs', 'cors']) {
    assert.ok(text.includes(dep), `objective must reference ${dep}`);
  }
  assert.doesNotMatch(text, SPRING_JAVA);
});

// [S2-AC3] fd869c32-766f-5900-812d-d1e546a3a55b:test:characterization:S2-AC3
test('[S2-AC3] separate-Java-service objective names it and scopes Node.js separately', (t) => {
  if (status.objective_branch !== 'separate-java-service') {
    t.skip(`branch not selected by S1 (objective_branch=${status.objective_branch})`);
    return;
  }
  const text = objective();
  assert.match(text, /Spring Boot/);
  assert.match(text, /Java service/i);
  assert.match(text, /User_Management/);
  assert.match(text, /Node\.js\/TypeScript/);
  assert.match(text, /scoped separately|separate scope/i);
});

// [S2-AC4] fd869c32-766f-5900-812d-d1e546a3a55b:test:characterization:S2-AC4
test('[S2-AC4] sign-off is attributable (named approver + date) or explicitly not obtained', () => {
  const s = status.signoff;
  const record = read(s.record);
  assert.ok(['not_obtained', 'approved'].includes(s.status));
  if (s.status === 'approved') {
    assert.ok(status.revised_objective.path, 'cannot approve without a drafted objective');
    assert.ok(s.approver_name?.trim(), 'approver name required');
    assert.ok(s.approver_role?.trim(), 'approver role required');
    assert.match(s.approved_on ?? '', ISO_DATE);
    assert.ok(s.evidence_ref, 'durable written record required');
    assert.ok(record.includes(s.approver_name));
  } else {
    // No fabricated approver while sign-off is outstanding.
    assert.equal(s.approver_name, null);
    assert.equal(s.approved_on, null);
    assert.match(record, /NOT OBTAINED/);
  }
});

// [S2-AC5] fd869c32-766f-5900-812d-d1e546a3a55b:test:characterization:S2-AC5
test('[S2-AC5] three accepted evidence limitations are recorded as open risks', () => {
  const reg = read(status.risk_register.path);
  const row = (id) => reg.split('\n').find((l) => l.startsWith(`| ${id} |`));
  const expected = {
    'R-001': /may be stale/i,
    'R-002': /no commit verification/i,
    'R-003': /no migration evidence/i,
  };
  for (const [id, pattern] of Object.entries(expected)) {
    const r = row(id);
    assert.ok(r, `${id} missing`);
    assert.match(r, pattern);
    assert.match(r, /\| Open \|/, `${id} must be Open`);
  }
  assert.match(reg, /not evidence (that something is absent|of absence)|None of them is evidence/i);
  assert.match(reg, /60b54710194b777d/);
});

// [S2-AC6] fd869c32-766f-5900-812d-d1e546a3a55b:test:characterization:S2-AC6
test('[S2-AC6] approved objective is published and old objective is removed or superseded', (t) => {
  const p = status.publication;
  if (status.signoff.status !== 'approved') {
    assert.equal(p.status, 'not_published', 'cannot publish before sign-off');
    t.skip('sign-off not obtained; publication not yet applicable');
    return;
  }
  assert.equal(p.status, 'published');
  assert.ok(p.authoritative_artefact_ref, 'authoritative artefact reference required');
  assert.ok(['removed', 'superseded'].includes(p.superseded_objective_handling));
  if (existsSync(join(here, 'charter.md'))) {
    const charter = read('charter.md');
    if (p.superseded_objective_handling === 'superseded') {
      assert.match(charter, /SUPERSEDED/);
    } else {
      assert.doesNotMatch(charter, SPRING_JAVA);
    }
  }
});
