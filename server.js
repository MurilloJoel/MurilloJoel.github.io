const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');

const PORT = 8080;

// Almacén de eventos en memoria
let events = [];

function buildICS() {
  const header = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//MiWeb//Calendario 1.0//ES',
    'CALSCALE:GREGORIAN',
  ];

  const footer = ['END:VCALENDAR'];

  const eventBlocks = events.map((ev) => {
    return [
      'BEGIN:VEVENT',
      `UID:${ev.uid}@miweb.com`,
      `DTSTAMP:${ev.dtstamp}`,
      `DTSTART:${ev.start}`,
      `DTEND:${ev.end}`,
      `SUMMARY:${ev.title}`,
      `DESCRIPTION:${ev.description}`,
      `LOCATION:${ev.location}`,
      'END:VEVENT',
    ].join('\r\n');
  });

  return [...header, ...eventBlocks, ...footer].join('\r\n');
}

http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);

  // Página principal
  if (parsedUrl.pathname === '/' || parsedUrl.pathname === '/index.html') {
    const filePath = path.join(__dirname, 'public', 'index.html');
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(500);
        res.end('Error cargando index.html');
        return;
      }
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(data);
    });
    return;
  }

  // Exportación de calendario .ics
  if (parsedUrl.pathname === '/calendario.ics') {
    const calendarData = buildICS();
    res.writeHead(200, {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': 'inline; filename=calendario.ics',
      'Cache-Control': 'no-cache',
    });
    res.end(calendarData);
    return;
  }

  // Añadir evento
  if (parsedUrl.pathname === '/add') {
    const q = parsedUrl.query;

    if (!q.title || !q.start || !q.end) {
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      res.end('Faltan parámetros: title, start, end');
      return;
    }

    const newEvent = {
      uid: `evento-${Date.now()}`,
      dtstamp: new Date().toISOString().replace(/[-:.]/g, '').slice(0, 15) + 'Z',
      start: q.start,
      end: q.end,
      title: q.title,
      description: q.desc || '',
      location: q.location || '',
    };

    events.push(newEvent);

    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Evento añadido correctamente');
    return;
  }

  // Ruta no encontrada
  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('Ruta no encontrada');
}).listen(PORT, () => {
  console.log(`Servidor iCal corriendo en http://localhost:${PORT}`);
});
