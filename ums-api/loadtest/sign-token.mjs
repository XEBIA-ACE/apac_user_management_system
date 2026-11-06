// Prints a JWT for the load test: node loadtest/sign-token.mjs <userId> <email>
// Reads JWT_SECRET and JWT_EXPIRES_IN from the environment (same values as the API).
import jwt from 'jsonwebtoken';

const [sub, email] = process.argv.slice(2);
if (!sub || !email || !process.env.JWT_SECRET) {
  console.error('usage: JWT_SECRET=... node loadtest/sign-token.mjs <userId> <email>');
  process.exit(1);
}
const expiresIn = Number(process.env.JWT_EXPIRES_IN || 900);
process.stdout.write(
  jwt.sign({ sub, email }, process.env.JWT_SECRET, { algorithm: 'HS256', expiresIn }),
);
