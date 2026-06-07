const res = await fetch('http://127.0.0.1:8787/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'admin@splashfood.tn', password: 'splashfood2026' }),
});
const data = await res.json();
console.log('Status:', res.status);
console.log(JSON.stringify(data, null, 2));
