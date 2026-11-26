/**
 * Módulo blog. Colección articulos: contenido y metadatos para el listado
 * paginado por categoría y el detalle de cada artículo.
 */
const { FieldValue, Timestamp } = require("firebase-admin/firestore");

const at = (value) => Timestamp.fromDate(new Date(value));

const articulos = [
  {
    slug: "entender-la-tae",
    titulo: "Cómo entender la TAE de un préstamo",
    categoria: "Préstamos",
    resumen: "Aprende qué incluye la TAE y por qué sirve para comparar el coste de distintas ofertas.",
    imagenUrl: "https://example.com/images/entender-la-tae.jpg",
    autor: "Equipo Credara",
    fechaPublicacion: "2026-11-20T09:00:00Z",
    fechaActualizacion: "2026-11-20T09:00:00Z",
    minutosLectura: 4,
    secciones: [
      { id: "que-es", titulo: "Qué es la TAE", contenidoHtml: "<p>La tasa anual equivalente expresa el coste de un préstamo en términos anuales.</p>" },
      { id: "comparar", titulo: "Cómo comparar ofertas", contenidoHtml: "<p>Compara la TAE junto con el importe total a devolver y el plazo.</p>" }
    ],
    relacionados: ["comisiones-de-un-prestamo"],
    metaTitulo: "Qué es la TAE y cómo comparar préstamos | Credara",
    metaDescripcion: "Descubre qué incluye la TAE y cómo utilizarla para comparar ofertas de préstamos.",
    publicado: true
  },
  {
    slug: "evitar-fraudes-financieros",
    titulo: "Señales para detectar fraudes financieros",
    categoria: "Seguridad",
    resumen: "Reconoce solicitudes sospechosas de pagos anticipados y protege tus datos al buscar financiación.",
    imagenUrl: "https://example.com/images/evitar-fraudes-financieros.jpg",
    autor: "Equipo Credara",
    fechaPublicacion: "2026-11-18T10:00:00Z",
    fechaActualizacion: "2026-11-19T10:00:00Z",
    minutosLectura: 5,
    secciones: [
      { id: "alertas", titulo: "Señales de alerta", contenidoHtml: "<p>Desconfía de quien promete una aprobación garantizada o exige un pago antes de mostrar las condiciones.</p>" }
    ],
    relacionados: ["derechos-del-solicitante"],
    metaTitulo: "Cómo detectar fraudes financieros | Credara",
    metaDescripcion: "Identifica señales de fraude y cuida tus datos cuando compares préstamos online.",
    publicado: true
  },
  {
    slug: "prestamos-y-asnef",
    titulo: "Solicitar un préstamo estando en ASNEF",
    categoria: "ASNEF",
    resumen: "Conoce qué factores pueden revisar las entidades y por qué cada solicitud se evalúa individualmente.",
    imagenUrl: "https://example.com/images/prestamos-y-asnef.jpg",
    autor: "Equipo Credara",
    fechaPublicacion: "2026-11-15T09:00:00Z",
    fechaActualizacion: "2026-11-15T09:00:00Z",
    minutosLectura: 4,
    secciones: [
      { id: "evaluacion", titulo: "Evaluación de la solicitud", contenidoHtml: "<p>Cada entidad decide si acepta solicitudes de personas en ASNEF y determina sus propias condiciones.</p>" }
    ],
    relacionados: ["entender-la-tae"],
    metaTitulo: "Préstamos y ASNEF: qué debes saber | Credara",
    metaDescripcion: "Información general sobre la evaluación de solicitudes de préstamos de personas en ASNEF.",
    publicado: true
  },
  {
    slug: "planificar-un-presupuesto",
    titulo: "Cómo planificar un presupuesto mensual",
    categoria: "Educación financiera",
    resumen: "Organiza ingresos y gastos para valorar cuánto puedes devolver sin comprometer tus necesidades básicas.",
    imagenUrl: "https://example.com/images/planificar-un-presupuesto.jpg",
    autor: "Equipo Credara",
    fechaPublicacion: "2026-11-12T11:00:00Z",
    fechaActualizacion: "2026-11-12T11:00:00Z",
    minutosLectura: 6,
    secciones: [
      { id: "ingresos-gastos", titulo: "Anota ingresos y gastos", contenidoHtml: "<p>Separa los gastos esenciales de los ocasionales y reserva un margen para imprevistos.</p>" }
    ],
    relacionados: ["comisiones-de-un-prestamo"],
    metaTitulo: "Planifica tu presupuesto mensual | Credara",
    metaDescripcion: "Una guía sencilla para organizar gastos y valorar tu capacidad de devolución.",
    publicado: true
  },
  {
    slug: "comisiones-de-un-prestamo",
    titulo: "Qué revisar antes de aceptar un préstamo",
    categoria: "Consejos",
    resumen: "Revisa las comisiones, el importe total y la fecha de devolución antes de elegir una oferta.",
    imagenUrl: "https://example.com/images/comisiones-de-un-prestamo.jpg",
    autor: "Equipo Credara",
    fechaPublicacion: "2026-11-08T09:30:00Z",
    fechaActualizacion: "2026-11-08T09:30:00Z",
    minutosLectura: 3,
    secciones: [
      { id: "costes", titulo: "Comprueba todos los costes", contenidoHtml: "<p>Consulta los intereses, las comisiones y el total a devolver en la oferta final de la entidad.</p>" }
    ],
    relacionados: ["entender-la-tae", "planificar-un-presupuesto"],
    metaTitulo: "Costes que debes revisar en un préstamo | Credara",
    metaDescripcion: "Qué comprobar en intereses, comisiones y plazos antes de aceptar una oferta.",
    publicado: true
  },
  {
    slug: "derechos-del-solicitante",
    titulo: "Información que debes recibir antes de contratar",
    categoria: "Legal",
    resumen: "Repasa la información precontractual que conviene consultar antes de contratar financiación.",
    imagenUrl: "https://example.com/images/derechos-del-solicitante.jpg",
    autor: "Equipo Credara",
    fechaPublicacion: "2026-11-04T08:00:00Z",
    fechaActualizacion: "2026-11-04T08:00:00Z",
    minutosLectura: 5,
    secciones: [
      { id: "informacion", titulo: "Información de la entidad", contenidoHtml: "<p>Lee las condiciones que facilita la entidad y resuelve tus dudas antes de aceptar.</p>" }
    ],
    relacionados: ["evitar-fraudes-financieros"],
    metaTitulo: "Información antes de contratar un préstamo | Credara",
    metaDescripcion: "Conoce qué información conviene revisar antes de contratar un préstamo.",
    publicado: true
  },
  {
    slug: "guia-de-ahorro-en-preparacion",
    titulo: "Guía de ahorro en preparación",
    categoria: "Consejos",
    resumen: "Un borrador de consejos para organizar pequeños objetivos de ahorro.",
    imagenUrl: "https://example.com/images/guia-de-ahorro-en-preparacion.jpg",
    autor: "Equipo Credara",
    fechaPublicacion: "2026-11-25T09:00:00Z",
    fechaActualizacion: "2026-11-25T09:00:00Z",
    minutosLectura: 3,
    secciones: [
      { id: "objetivos", titulo: "Define un objetivo", contenidoHtml: "<p>Elige una cantidad alcanzable y revisa tu progreso periódicamente.</p>" }
    ],
    relacionados: ["planificar-un-presupuesto"],
    metaTitulo: "Guía de ahorro | Credara",
    metaDescripcion: "Consejos para organizar objetivos de ahorro.",
    publicado: false
  }
];

exports.seed = async (db) => {
  const batch = db.batch();
  for (const { slug, fechaPublicacion, fechaActualizacion, ...data } of articulos) {
    batch.set(db.collection("articulos").doc(slug), {
      ...data,
      slug,
      fechaPublicacion: at(fechaPublicacion),
      fechaActualizacion: at(fechaActualizacion),
      createdAt: FieldValue.serverTimestamp()
    });
  }
  await batch.commit();
};
