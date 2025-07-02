const { execSync } = require('child_process');
const path = require('path');

try {
  const calendarioPath = path.join(__dirname, 'calendario.ics');

  // Asegúrate de que el archivo .ics existe
  if (!require('fs').existsSync(calendarioPath)) {
    throw new Error('El archivo calendario.ics no existe.');
  }

  // Añadir y hacer commit en el repo actual (ya estás en MurilloJoel.github.io)
  execSync('git add calendario.ics');
  execSync('git commit -m "Actualizar calendario ICS automáticamente"', { stdio: 'inherit' });
  execSync('git push', { stdio: 'inherit' });

  console.log('✅ calendario.ics subido correctamente a GitHub Pages');
} catch (err) {
  console.error('❌ Error al subir calendario:', err.message);
}
