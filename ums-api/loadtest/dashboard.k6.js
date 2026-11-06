// US-001-ac-7 load-test gate: GET /api/v1/dashboard at 500 concurrent virtual users.
// k6 exits non-zero when a threshold fails, so a CI step running this script gates merge.
//   BASE_URL  API origin (default http://localhost:3000)
//   TOKEN     valid JWT for a seeded ACTIVE user (see loadtest/sign-token.mjs)
import http from 'k6/http';
import { check } from 'k6';
import { Trend } from 'k6/metrics';

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';
const TOKEN = __ENV.TOKEN;
const authDuration = new Trend('auth_validation_duration', true);

export const options = {
  scenarios: {
    dashboard: {
      executor: 'constant-vus',
      vus: Number(__ENV.VUS || 500),
      duration: __ENV.DURATION || '30s',
    },
  },
  thresholds: {
    // AuthMiddleware session validation and server time-to-first-byte must never exceed 1 s;
    // full request duration (incl. TCP connect from the load generator) is gated at p99.
    http_req_waiting: ['max<1000'],
    http_req_duration: ['p(99)<1000'],
    auth_validation_duration: ['max<1000'],
    http_req_failed: ['rate==0'],
    checks: ['rate==1'],
  },
};

export function setup() {
  if (!TOKEN) throw new Error('TOKEN env var is required');
}

export default function () {
  const res = http.get(`${BASE_URL}/api/v1/dashboard`, {
    headers: { Authorization: `Bearer ${TOKEN}` },
  });
  const timing = /auth;dur=([\d.]+)/.exec(res.headers['Server-Timing'] || '');
  if (timing) authDuration.add(Number(timing[1]));
  check(res, {
    'status is 200': (r) => r.status === 200,
    'delete_account_visible is true': (r) => r.json('features.delete_account_visible') === true,
  });
}
