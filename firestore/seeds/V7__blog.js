const { FieldValue, Timestamp } = require("firebase-admin/firestore");

const at = (value) => Timestamp.fromDate(new Date(value));

const articles = [
  {
    slug: "como-comparar-prestamos-rapidos",
    title: "Cómo comparar préstamos rápidos sin sorpresas",
    category: "Préstamos",
    summary: "Aprende a revisar el coste total, la TAE y el plazo antes de elegir una oferta de préstamo.",
    imageUrl: "https://example.com/images/comparar-prestamos.jpg",
    author: "Equipo Credara",
    publishedAt: "2026-10-20T09:00:00Z",
    updatedAt: "2026-10-22T09:00:00Z",
    readingMinutes: 4,
    sections: [
      { id: "coste-total", title: "Mira el coste total", contentHtml: "<p>Compara cuánto devolverás en total, incluidos intereses y comisiones. Una cuota pequeña no siempre significa un préstamo más barato.</p>" },
      { id: "tae-y-plazo", title: "Revisa la TAE y el plazo", contentHtml: "<p>La TAE ayuda a comparar ofertas con distintos costes. Comprueba también la fecha de devolución y las condiciones finales de cada entidad.</p>" },
    ],
    relatedSlugs: ["entender-la-tae", "evitar-fraudes-en-prestamos"],
    metaTitle: "Cómo comparar préstamos rápidos | Credara",
    metaDescription: "Consulta qué costes, plazos y condiciones debes revisar antes de elegir un préstamo rápido.",
    published: true,
  },
  {
    slug: "evitar-fraudes-en-prestamos",
    title: "Señales para evitar fraudes al pedir un préstamo",
    category: "Seguridad",
    summary: "Identifica solicitudes de pago anticipado y comprueba a quién entregas tus datos.",
    imageUrl: "https://example.com/images/seguridad-prestamos.jpg",
    author: "Equipo Credara",
    publishedAt: "2026-10-17T09:00:00Z",
    updatedAt: "2026-10-17T09:00:00Z",
    readingMinutes: 3,
    sections: [
      { id: "pagos-anticipados", title: "Desconfía de los pagos anticipados", contentHtml: "<p>Revisa las condiciones antes de compartir datos o aceptar una oferta. Desconfía de quien prometa aprobación garantizada a cambio de un pago previo.</p>" },
      { id: "verificar-entidad", title: "Verifica la entidad", contentHtml: "<p>Comprueba sus datos de contacto y lee las condiciones en su sitio oficial antes de continuar.</p>" },
    ],
    relatedSlugs: ["como-comparar-prestamos-rapidos"],
    metaTitle: "Cómo evitar fraudes con préstamos | Credara",
    metaDescription: "Reconoce señales de alerta y protege tus datos al solicitar un préstamo online.",
    published: true,
  },
  {
    slug: "pedir-un-prestamo-estando-en-asnef",
    title: "¿Se puede pedir un préstamo estando en ASNEF?",
    category: "ASNEF",
    summary: "Descubre por qué cada entidad evalúa el riesgo de manera distinta y qué conviene revisar.",
    imageUrl: "https://example.com/images/prestamos-asnef.jpg",
    author: "Equipo Credara",
    publishedAt: "2026-10-14T09:00:00Z",
    updatedAt: "2026-10-14T09:00:00Z",
    readingMinutes: 4,
    sections: [
      { id: "evaluacion", title: "Cada entidad decide", contentHtml: "<p>Figurar en ASNEF no garantiza ni impide por sí solo recibir una oferta. Cada entidad aplica sus propios criterios.</p>" },
      { id: "antes-de-solicitar", title: "Antes de solicitar", contentHtml: "<p>Comprueba tu capacidad de devolución y compara el coste completo. No solicites dinero que no puedas devolver a tiempo.</p>" },
    ],
    relatedSlugs: ["como-comparar-prestamos-rapidos", "presupuesto-antes-de-pedir-prestado"],
    metaTitle: "Préstamos y ASNEF: qué debes saber | Credara",
    metaDescription: "Información para comparar ofertas si figuras en ASNEF, sin promesas de aprobación.",
    published: true,
  },
  {
    slug: "entender-la-tae",
    title: "Qué es la TAE y cómo interpretar el coste",
    category: "Educación financiera",
    summary: "Una explicación sencilla de la TAE y de las diferencias entre intereses, comisiones y total a devolver.",
    imageUrl: "https://example.com/images/entender-tae.jpg",
    author: "Equipo Credara",
    publishedAt: "2026-10-11T09:00:00Z",
    updatedAt: "2026-10-11T09:00:00Z",
    readingMinutes: 5,
    sections: [
      { id: "que-es", title: "Qué expresa la TAE", contentHtml: "<p>La tasa anual equivalente expresa el coste anualizado de una operación. En préstamos de pocos días puede parecer elevada aunque el importe en euros sea menor.</p>" },
      { id: "comparar", title: "Cómo comparar ofertas", contentHtml: "<p>Revisa la TAE junto al importe, las comisiones, el plazo y el total a devolver. La aprobación y las condiciones finales corresponden a la entidad.</p>" },
    ],
    relatedSlugs: ["como-comparar-prestamos-rapidos"],
    metaTitle: "Qué es la TAE de un préstamo | Credara",
    metaDescription: "Entiende cómo interpretar la TAE y el coste total de un préstamo de corta duración.",
    published: true,
  },
  {
    slug: "presupuesto-antes-de-pedir-prestado",
    title: "Prepara tu presupuesto antes de pedir prestado",
    category: "Consejos",
    summary: "Tres comprobaciones para decidir si podrás devolver el préstamo en la fecha prevista.",
    imageUrl: "https://example.com/images/presupuesto-prestamo.jpg",
    author: "Equipo Credara",
    publishedAt: "2026-10-08T09:00:00Z",
    updatedAt: "2026-10-08T09:00:00Z",
    readingMinutes: 3,
    sections: [
      { id: "ingresos-y-gastos", title: "Anota ingresos y gastos", contentHtml: "<p>Calcula cuánto dinero te quedará después de cubrir vivienda, alimentación y otros gastos imprescindibles.</p>" },
      { id: "fecha-de-devolucion", title: "Comprueba la fecha de devolución", contentHtml: "<p>Antes de solicitar, asegúrate de que podrás devolver el total en la fecha acordada sin depender de otro préstamo.</p>" },
    ],
    relatedSlugs: ["entender-la-tae", "pedir-un-prestamo-estando-en-asnef"],
    metaTitle: "Presupuesto antes de pedir un préstamo | Credara",
    metaDescription: "Organiza tus gastos y comprueba tu capacidad de devolución antes de solicitar dinero.",
    published: true,
  },
  {
    slug: "tus-datos-al-comparar-ofertas",
    title: "Qué ocurre con tus datos al comparar ofertas",
    category: "Legal",
    summary: "Conoce qué información se solicita y por qué debes leer la política de privacidad antes de enviarla.",
    imageUrl: "https://example.com/images/privacidad-ofertas.jpg",
    author: "Equipo Credara",
    publishedAt: "2026-10-05T09:00:00Z",
    updatedAt: "2026-10-05T09:00:00Z",
    readingMinutes: 3,
    sections: [
      { id: "datos-solicitados", title: "Datos necesarios para una solicitud", contentHtml: "<p>La información que facilitas permite evaluar qué entidades pueden estudiar tu solicitud. Consulta la política de privacidad para conocer el tratamiento aplicable.</p>" },
      { id: "consentimiento", title: "Lee antes de aceptar", contentHtml: "<p>Comprueba quién recibirá tus datos y con qué finalidad. Credara compara ofertas, pero no concede préstamos.</p>" },
    ],
    relatedSlugs: ["evitar-fraudes-en-prestamos"],
    metaTitle: "Datos personales al comparar préstamos | Credara",
    metaDescription: "Infórmate sobre el uso de tus datos cuando solicitas ofertas de préstamos.",
    published: true,
  },
];

exports.seed = async (db) => {
  const batch = db.batch();
  for (const { slug, publishedAt, updatedAt, ...data } of articles) {
    batch.set(db.collection("articles").doc(slug), {
      slug,
      ...data,
      publishedAt: at(publishedAt),
      updatedAt: at(updatedAt),
      createdAt: FieldValue.serverTimestamp(),
    });
  }
  await batch.commit();
};
