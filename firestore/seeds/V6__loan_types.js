/**
 * Módulo loan-types: contenido de los nueve tipos de préstamo.
 * Los criterios se evalúan contra la colección compartida lenders, cargada en V1.
 */
const { FieldValue } = require("firebase-admin/firestore");

const loanTypes = [
  {
    id: "rapidos",
    title: "Préstamos rápidos",
    icon: "⚡",
    summary: "Compara entidades con una respuesta estimada en pocos minutos.",
    subtitle: "Consulta las condiciones antes de solicitar financiación rápida.",
    tags: ["Solicitud online", "Respuesta estimada rápida"],
    criterion: "todas",
    requirements: ["Tener entre 18 y 100 años, sujeto a los límites de cada entidad.", "Facilitar datos de contacto y la información solicitada por la entidad."],
    advantages: ["Puedes comparar distintas entidades en un mismo lugar.", "La solicitud a través de Credara es gratuita."],
    disadvantages: ["La aprobación depende del análisis de cada entidad.", "El coste puede aumentar con el plazo elegido."],
    questions: [{ question: "¿Credara concede el préstamo?", answer: "No. Credara compara ofertas; cada entidad decide si aprueba la solicitud." }],
    related: ["online", "urgentes"],
    metaTitle: "Préstamos rápidos online | Credara",
    metaDescription: "Compara entidades de préstamos rápidos, revisa sus condiciones y solicita ofertas sin coste a través de Credara.",
    order: 1,
    active: true
  },
  {
    id: "online",
    title: "Préstamos online",
    icon: "💻",
    summary: "Explora préstamos que puedes solicitar por internet.",
    subtitle: "Compara importes, plazos y requisitos desde un mismo sitio.",
    tags: ["100 % online", "Compara condiciones"],
    criterion: "todas",
    requirements: ["Tener la edad admitida por la entidad.", "Proporcionar información veraz para que la entidad estudie la solicitud."],
    advantages: ["Puedes revisar varias opciones sin desplazarte.", "Credara no cobra al solicitante."],
    disadvantages: ["La entidad puede pedir documentación adicional.", "Las condiciones finales pueden variar tras el análisis."],
    questions: [{ question: "¿Puedo comparar sin registrarme?", answer: "Sí. Puedes consultar los tipos y las entidades sin crear una cuenta." }],
    related: ["rapidos", "sin-nomina"],
    metaTitle: "Préstamos online: compara entidades | Credara",
    metaDescription: "Descubre opciones de préstamos online y compara los requisitos y condiciones publicados por las entidades.",
    order: 2,
    active: true
  },
  {
    id: "sin-nomina",
    title: "Préstamos sin nómina",
    icon: "📄",
    summary: "Consulta entidades que admiten solicitudes sin nómina.",
    subtitle: "No disponer de nómina no elimina la evaluación de solvencia.",
    tags: ["Sin nómina", "Sujeto a evaluación"],
    criterion: "sinNomina",
    requirements: ["Cumplir la edad y las condiciones particulares de la entidad.", "Aportar la información económica que la entidad solicite."],
    advantages: ["Permite identificar entidades que no exigen nómina.", "Puedes comparar importes y plazos disponibles."],
    disadvantages: ["No se garantiza la aprobación.", "La entidad puede exigir otras pruebas de ingresos."],
    questions: [{ question: "¿Sin nómina significa sin requisitos?", answer: "No. Cada entidad verifica el perfil y puede solicitar documentación adicional." }],
    related: ["online", "con-asnef"],
    metaTitle: "Préstamos sin nómina: compara opciones | Credara",
    metaDescription: "Consulta entidades que permiten solicitar préstamos sin nómina y conoce sus requisitos antes de decidir.",
    order: 3,
    active: true
  },
  {
    id: "con-asnef",
    title: "Préstamos con ASNEF",
    icon: "🔎",
    summary: "Encuentra entidades que estudian solicitudes de personas en ASNEF.",
    subtitle: "Estar en ASNEF no implica una aprobación automática.",
    tags: ["Aceptan ASNEF", "Evaluación individual"],
    criterion: "aceptaAsnef",
    requirements: ["Cumplir la edad y el importe admitidos por la entidad.", "Declarar la situación económica para su evaluación."],
    advantages: ["Puedes localizar entidades que consideran perfiles en ASNEF.", "Comparar es gratuito para el visitante."],
    disadvantages: ["Cada entidad decide si acepta la solicitud.", "Es importante revisar el coste total antes de continuar."],
    questions: [{ question: "¿Me aprobarán si figuro en ASNEF?", answer: "No podemos garantizarlo. La entidad decide según su análisis de riesgo." }],
    related: ["sin-nomina", "rapidos"],
    metaTitle: "Préstamos con ASNEF: compara entidades | Credara",
    metaDescription: "Compara entidades que estudian solicitudes de personas en ASNEF y revisa las condiciones aplicables.",
    order: 4,
    active: true
  },
  {
    id: "urgentes",
    title: "Préstamos urgentes",
    icon: "⏱️",
    summary: "Compara entidades con respuesta estimada de hasta 30 minutos.",
    subtitle: "El tiempo indicado es orientativo y no garantiza la concesión.",
    tags: ["Respuesta estimada", "Hasta 30 minutos"],
    criterion: "respuestaMax30",
    requirements: ["Cumplir los requisitos de edad de la entidad.", "Completar la información necesaria para estudiar la solicitud."],
    advantages: ["Identifica entidades con tiempos de respuesta estimados breves.", "Puedes revisar las condiciones antes de elegir."],
    disadvantages: ["La respuesta puede tardar más de lo estimado.", "La urgencia no sustituye la revisión del coste total."],
    questions: [{ question: "¿Recibiré el dinero en 30 minutos?", answer: "No necesariamente. El plazo mostrado es una estimación de respuesta, no de desembolso." }],
    related: ["rapidos", "online"],
    metaTitle: "Préstamos urgentes: compara opciones | Credara",
    metaDescription: "Consulta entidades con respuesta estimada de hasta 30 minutos y compara sus requisitos y condiciones.",
    order: 5,
    active: true
  },
  {
    id: "sin-intereses",
    title: "Préstamos sin intereses",
    icon: "✨",
    summary: "Descubre entidades con promociones para el primer préstamo.",
    subtitle: "Comprueba los requisitos y la vigencia de cada promoción.",
    tags: ["Primer préstamo", "Sujeto a condiciones"],
    criterion: "primerPrestamoGratis",
    requirements: ["Cumplir los requisitos de la promoción de cada entidad.", "Confirmar el coste final antes de aceptar una oferta."],
    advantages: ["Permite encontrar promociones para nuevos clientes.", "Puedes contrastar los plazos y los importes admitidos."],
    disadvantages: ["La promoción puede no aplicarse a todos los importes o plazos.", "Los retrasos en el pago pueden generar costes adicionales."],
    questions: [{ question: "¿Todos los préstamos de estas entidades son gratuitos?", answer: "No. La promoción depende de las condiciones de cada entidad y de tu solicitud." }],
    related: ["300-euros", "500-euros"],
    metaTitle: "Préstamos sin intereses para nuevos clientes | Credara",
    metaDescription: "Compara entidades con promociones para el primer préstamo y comprueba sus condiciones antes de solicitarlo.",
    order: 6,
    active: true
  },
  {
    id: "300-euros",
    title: "Préstamos de 300 €",
    icon: "💶",
    summary: "Consulta entidades que admiten solicitudes de 300 €.",
    subtitle: "Compara el coste total según el plazo que necesites.",
    tags: ["300 €", "Importe concreto"],
    criterion: "importe:300",
    requirements: ["Cumplir los requisitos de edad de la entidad.", "Elegir un plazo dentro de los límites que ofrece."],
    advantages: ["Puedes identificar entidades que admiten este importe.", "El simulador te ayuda a estimar el coste."],
    disadvantages: ["El total a devolver depende del plazo y de la oferta final.", "La entidad puede rechazar la solicitud tras evaluarla."],
    questions: [{ question: "¿El importe de 300 € está garantizado?", answer: "No. Cada entidad decide el importe y las condiciones finales tras estudiar la solicitud." }],
    related: ["500-euros", "sin-intereses"],
    metaTitle: "Préstamos de 300 €: compara entidades | Credara",
    metaDescription: "Consulta entidades que ofrecen préstamos de 300 € y compara sus plazos y requisitos.",
    order: 7,
    active: true
  },
  {
    id: "500-euros",
    title: "Préstamos de 500 €",
    icon: "💶",
    summary: "Encuentra entidades que admiten solicitudes de 500 €.",
    subtitle: "Revisa los requisitos y el total estimado antes de solicitarlo.",
    tags: ["500 €", "Compara plazos"],
    criterion: "importe:500",
    requirements: ["Tener una edad aceptada por la entidad.", "Facilitar los datos necesarios para el análisis de la solicitud."],
    advantages: ["Filtra las entidades compatibles con el importe.", "Puedes comparar opciones sin pagar a Credara."],
    disadvantages: ["Un plazo mayor puede aumentar el coste.", "La aprobación no está garantizada."],
    questions: [{ question: "¿Puedo elegir cualquier plazo?", answer: "No. Cada entidad establece un plazo mínimo y uno máximo para sus préstamos." }],
    related: ["300-euros", "1000-euros"],
    metaTitle: "Préstamos de 500 €: compara opciones | Credara",
    metaDescription: "Compara entidades que admiten préstamos de 500 € y revisa los plazos y las condiciones de cada una.",
    order: 8,
    active: true
  },
  {
    id: "1000-euros",
    title: "Préstamos de 1.000 €",
    icon: "💶",
    summary: "Compara entidades que admiten solicitudes de 1.000 €.",
    subtitle: "Evalúa el importe total y las condiciones antes de decidir.",
    tags: ["1.000 €", "Condiciones claras"],
    criterion: "importe:1000",
    requirements: ["Cumplir los límites de edad y plazo de la entidad.", "Proporcionar la información económica que se solicite."],
    advantages: ["Puedes consultar las entidades compatibles con este importe.", "Comparar opciones en Credara es gratuito."],
    disadvantages: ["El coste total varía según el plazo y las condiciones finales.", "La entidad puede solicitar documentación adicional."],
    questions: [{ question: "¿Credara fija el coste final?", answer: "No. El coste y la aprobación finales los determina cada entidad." }],
    related: ["500-euros", "online"],
    metaTitle: "Préstamos de 1.000 €: compara entidades | Credara",
    metaDescription: "Descubre entidades que admiten préstamos de 1.000 € y compara sus requisitos, plazos y condiciones.",
    order: 9,
    active: true
  }
];

exports.seed = async (db) => {
  const batch = db.batch();
  for (const { id, ...data } of loanTypes) {
    batch.set(db.collection("loanTypes").doc(id), {
      ...data,
      slug: id,
      createdAt: FieldValue.serverTimestamp()
    });
  }
  await batch.commit();
};
