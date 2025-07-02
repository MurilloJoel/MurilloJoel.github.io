const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

try {
  const icsPath = path.join(__dirname, 'calendario.ics');

  if (!fs.existsSync(icsPath)) {
    throw new Error('El archivo calendario.ics no existe.');
  }

  execSync('git add calendario.ics');
  execSync('git commit -m "Actualizar calendario ICS automáticamente"', { stdio: 'inherit' });
  execSync('git push', { stdio: 'inherit' });

  console.log('✅ calendario.ics subido correctamente a GitHub Pages');
} catch (err) {
  console.error('❌ Error al subir calendario:', err.message);
}
