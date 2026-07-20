import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Inicializar el SDK de Gemini en el backend
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
} else {
  console.warn("ADVERTENCIA: GEMINI_API_KEY no encontrada en las variables de entorno.");
}

// Ruta de API: Chat con Asistente Psicopedagógico
app.post('/api/chat', async (req, res) => {
  const { messages, selectedInstruments } = req.body;

  if (!ai) {
    return res.status(500).json({ 
      error: "La clave API de Gemini no está configurada en los Secretos. Configure GEMINI_API_KEY en Panel de Control > Secrets." 
    });
  }

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "El cuerpo de la solicitud debe incluir un array de 'messages'." });
  }

  try {
    // Construir la instrucción del sistema
    const systemInstruction = `Eres el "Asistente Inteligente de Selección de Instrumentos de Evaluación Psicopedagógica", un asesor experto de IA diseñado para apoyar a psicopedagogos, psicólogos educacionales y profesionales de la educación. 

Tu rol principal es resolver consultas, guiar y recomendar instrumentos de evaluación adecuados basados en el motivo de consulta, edad, curso, dificultades observadas y áreas que el profesional desea evaluar.

Directrices cruciales:
1. Habla siempre en español con tono profesional, empático, claro y estructurado.
2. Aclara SIEMPRE al final de tus respuestas (con una nota sutil) que tus sugerencias son de carácter orientativo, consultivo y técnico, y que la decisión final, la interpretación clínica y la responsabilidad del diagnóstico corresponden única y exclusivamente al criterio del profesional.
3. Si el usuario te pregunta por instrumentos concretos, menciona sus autores, edades de aplicación o subtest si los recuerdas.
4. El usuario te proporcionará un contexto de los instrumentos que tiene actualmente cargados o seleccionados como favoritos si están disponibles: ${JSON.stringify(selectedInstruments || [])}.
5. Si te piden comparar instrumentos, haz un contraste claro de: edad, área, tiempo, modalidad, nivel de evidencia y adaptación chilena.
6. Cuando se hable de dificultades como Dislexia, Discalculia, TEL, TDAH, TEA, etc., fundamenta tus recomendaciones sobre las bases teóricas de la conciencia fonológica, funciones ejecutivas, memoria, o habilidades lógico-matemáticas según corresponda.`;

    // Preparar el formato de contenidos para el SDK @google/genai
    // Mapeamos los mensajes pasados por el frontend
    const contents = messages.map((msg: any) => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    }));

    // Realizar la solicitud a gemini-3.5-flash
    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: contents,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      }
    });

    const text = response.text || "No se pudo obtener respuesta del modelo de inteligencia artificial.";
    res.json({ text });

  } catch (error: any) {
    console.error("Error en la llamada a Gemini API:", error);
    res.status(500).json({ 
      error: `Error al procesar la solicitud de IA: ${error.message || error}` 
    });
  }
});

// Ruta de API: Recomendar instrumentos con IA basados en un área o dificultad personalizada
app.post('/api/recommend-instruments', async (req, res) => {
  const { motive, edad, curso, customQuery, availableInstruments, sessionsCount } = req.body;

  if (!ai) {
    return res.status(500).json({ 
      error: "La clave API de Gemini no está configurada en los Secretos. Configure GEMINI_API_KEY en Panel de Control > Secrets." 
    });
  }

  if (!availableInstruments || !Array.isArray(availableInstruments)) {
    return res.status(400).json({ error: "El cuerpo de la solicitud debe incluir un array 'availableInstruments'." });
  }

  try {
    const systemInstruction = `Eres un psicopedagogo clínico experto de IA en selección de instrumentos de evaluación diagnóstica.
Tu misión es seleccionar de forma muy inteligente los mejores instrumentos de evaluación de entre la lista proporcionada por el usuario, adaptándolos a:
- Edad del paciente: ${edad} años.
- Curso/nivel escolar: ${curso || 'No especificado'}.
- Motivo de sospecha clínica: ${motive || 'No especificado'}.
- Área o Dificultad específica que el profesional quiere evaluar: "${customQuery || 'No especificada'}".

Directrices para la selección:
1. Analiza el campo "que_evalua", "edad_aplicacion", "curso_recomendado", "area" y "subarea" de cada instrumento.
2. Selecciona únicamente instrumentos que sean compatibles con la edad de ${edad} años (por ejemplo, si el instrumento es para 12-18 años y el niño tiene 6 años, NO lo selecciones).
3. Selecciona entre 2 y 6 instrumentos del catálogo proporcionado que MEJOR se adapten a las dificultades y áreas descritas.
4. Distribuye de forma secuencial y equilibrada los instrumentos elegidos en las sesiones disponibles (sesiones del 1 al ${sessionsCount || 3}).
5. Escribe una justificación clínica profesional y detallada (en el campo "reason") en español explicando específicamente por qué ese test es ideal para evaluar la dificultad mencionada por el usuario en este paciente de ${edad} años. Evita respuestas genéricas.`;

    const userPrompt = `Recomienda los mejores instrumentos de evaluación del siguiente catálogo:
${JSON.stringify(availableInstruments.map(ins => ({ id: ins.id, nombre: ins.nombre, area: ins.area, subarea: ins.subarea, edad_aplicacion: ins.edad_aplicacion, que_evalua: ins.que_evalua, adaptacion_chilena: ins.adaptacion_chilena })))}

Paciente edad: ${edad} años.
Curso: ${curso}.
Sospecha: ${motive}.
Dificultad o Área específica a evaluar: ${customQuery}.
Número máximo de sesiones: ${sessionsCount || 3}.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: userPrompt,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.3,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            recommendations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  instrumentId: { 
                    type: Type.STRING,
                    description: "El ID exacto del instrumento recomendado de la lista provista"
                  },
                  reason: { 
                    type: Type.STRING,
                    description: "Justificación clínica detallada de por qué este test es el adecuado para evaluar la dificultad del paciente"
                  },
                  session: { 
                    type: Type.INTEGER,
                    description: "Número de sesión recomendada para su aplicación (del 1 al total de sesiones)"
                  }
                },
                required: ["instrumentId", "reason", "session"]
              }
            }
          },
          required: ["recommendations"]
        }
      }
    });

    const text = response.text || "{}";
    const data = JSON.parse(text);
    res.json(data);

  } catch (error: any) {
    console.error("Error en recomendación con Gemini API:", error);
    res.status(500).json({ 
      error: `Error al procesar la recomendación de IA: ${error.message || error}` 
    });
  }
});

// Endpoint de salud
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString(), hasGeminiKey: !!apiKey });
});

// Configuración de Vite como Middleware o servir archivos estáticos
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Servidor Full-Stack] Iniciado en http://localhost:${PORT}`);
    console.log(`[Modo] ${process.env.NODE_ENV === 'production' ? 'Producción' : 'Desarrollo'}`);
  });
}

startServer();
