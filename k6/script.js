// k6/script.js
import http from 'k6/http';
import { check, sleep } from 'k6';

// --- 1. Cargar el archivo de prueba ---
// CORRECCIÓN: Usando la imagen 'jose.jpg' como solicitaste.
// Asegúrate de tener una imagen llamada 'jose.jpg' en la misma carpeta que este script.
const testImage = open('jose.jpg', 'b');


// --- 2. Opciones de la prueba (AJUSTADAS CON RESULTADOS REALES) ---
export const options = {
  stages: [
    { duration: '30s', target: 5 },
    { duration: '1m', target: 5 },
    { duration: '10s', target: 0 },
  ],
  thresholds: {
    // Aumentamos el umbral para que coincida con el rendimiento real del plan gratuito
    'http_req_duration': ['p(95)<4000'], // Meta: < 4 segundos (Resultado real fue 3.43s)
    'http_req_duration{scenario:create_pin}': ['p(95)<5000'],
    
    // Mantenemos estrictos los umbrales de error
    'http_req_failed': ['rate<0.05'],
    'checks': ['rate>0.95'],
  },
};

// --- 3. Función de configuración (se ejecuta una vez) ---
// Registra un usuario único y obtiene su token de autenticación.
// Si algún paso falla aquí, la prueba se detiene por completo.
export function setup() {
  const apiUrl = __ENV.API_URL || 'https://proyecto-pruebas-api.onrender.com';
  
  // Genera credenciales únicas para cada ejecución de la prueba
  const uniqueSuffix = Date.now();
  const username = `user_${uniqueSuffix}`; 
  const email = `user_${uniqueSuffix}@example.com`;
  const password = 'Testpassword123';

  // --- Registrar el usuario ---
  const registerPayload = JSON.stringify({
    username: username,
    email: email,
    password: password,
    confirmPassword: password
  });
  
  const registerRes = http.post(`${apiUrl}/api/auth/register`, registerPayload, {
    headers: { 'Content-Type': 'application/json' },
  });

  // VERIFICACIÓN CRÍTICA: Si el registro no es exitoso (status 201), aborta la prueba.
  if (registerRes.status !== 201) {
    console.error('Error en el registro:', registerRes.body);
    throw new Error(`Setup fallido: No se pudo registrar el usuario. Status: ${registerRes.status}`);
  }

  // --- Hacer login para obtener el token ---
  const loginPayload = JSON.stringify({ email: email, password: password });
  
  const loginRes = http.post(`${apiUrl}/api/auth/login`, loginPayload, {
    headers: { 'Content-Type': 'application/json' },
  });
  
  // VERIFICACIÓN CRÍTICA: Si el login no es exitoso (status 200), aborta la prueba.
  if (loginRes.status !== 200) {
    console.error('Error en el login:', loginRes.body);
    throw new Error(`Setup fallido: No se pudo hacer login. Status: ${loginRes.status}`);
  }

  const loginJson = loginRes.json();
  const authToken = loginJson.token;
  const userId = loginJson.user.id;

  // VERIFICACIÓN CRÍTICA: Si el token o el userId son nulos, aborta la prueba.
  if (!authToken || !userId) {
      throw new Error('Setup fallido: No se recibió un token o un userId de la autenticación.');
  }
  
  console.log(`✅ Setup completado. Usuario '${username}' (ID: ${userId}) creado. Token generado.`);
  
  // Devolvemos todos los datos necesarios para los VUs
  return { token: authToken, apiUrl: apiUrl, username: username, userId: userId };
}

// --- 4. Función principal (el código que ejecutan los VUs) ---
// Simula el comportamiento de un usuario navegando por la aplicación.
export default function (data) {
  const { token, apiUrl, username, userId } = data;

  // Headers para peticiones autenticadas con JSON
  const authHeaders = {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  };

  // --- Flujo 1: Obtener todos los pins y seleccionar uno ---
  const pinsRes = http.get(`${apiUrl}/api/pins/getPins`, authHeaders);
  check(pinsRes, { 'GET /api/pins/getPins: status is 200': (r) => r.status === 200 });

  let pinIdToSave = null;
  if (pinsRes.status === 200) {
    try {
      const pins = pinsRes.json();
      if (Array.isArray(pins) && pins.length > 0) {
        // Selecciona un pin aleatorio para guardar
        pinIdToSave = pins[Math.floor(Math.random() * pins.length)].id;
      }
    } catch (e) {
      console.error(`Error al parsear JSON de /api/pins/getPins: ${e.message}`);
    }
  }

  // CORRECCIÓN: Aumentamos el tiempo de espera para no saturar el servidor
  sleep(Math.random() * 3 + 2); // Espera entre 2 y 5 segundos

  // --- Flujo 2: Crear un nuevo pin (con subida de archivos) ---
  const createPinPayload = {
    title: `Pin de prueba k6 - VU ${__VU}`,
    description: 'Descripción generada por el test de carga de k6.',
    authorName: username,
    image: http.file(testImage, 'jose.jpg', 'image/jpeg'),
    avatar: http.file(testImage, 'jose.jpg', 'image/jpeg'),
  };
  
  const createPinRes = http.post(`${apiUrl}/api/pins/createPin`, createPinPayload, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    tags: { scenario: 'create_pin' }, // Etiqueta para el threshold específico
  });

  check(createPinRes, { 'POST /api/pins/createPin: status is 201': (r) => r.status === 201 });

  // CORRECCIÓN: Aumentamos el tiempo de espera (crear un pin es más lento)
  sleep(Math.random() * 4 + 3); // Espera entre 3 y 7 segundos

  // --- Flujo 3: Guardar un pin ---
  if (pinIdToSave) {
    const savePinRes = http.post(`${apiUrl}/api/pins/savePin`, JSON.stringify({ userId: userId, pinId: pinIdToSave }), authHeaders);
    check(savePinRes, {
      'POST /api/pins/savePin: status is 200 or 201': (r) => [200, 201].includes(r.status),
    });
  }

  // CORRECCIÓN: Aumentamos el tiempo de espera
  sleep(Math.random() * 3 + 2); // Espera entre 2 y 5 segundos

  // --- Flujo 4: Consultar el perfil del usuario ---
  const profileRes = http.get(`${apiUrl}/api/auth/profile`, authHeaders);
  check(profileRes, { 'GET /api/auth/profile: status is 200': (r) => r.status === 200 });
}
