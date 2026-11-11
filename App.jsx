import React, { useState, useRef } from 'react';
import {
  Mail,
  MapPin,
  Phone,
  Clock,
  Send,
  CheckCircle2,
  AlertCircle,
  Settings,
  Github,
  FileText,
  ExternalLink,
  Copy,
  Check,
  Download,
  Building2,
  GraduationCap,
  Code2,
  KeyRound,
  Info,
  Navigation,
  Sparkles,
  RefreshCw,
  Eye
} from 'lucide-react';

const SEDES_UPATECO = [
  {
    id: 'salta-capital',
    nombre: 'Sede Central B° Pereyra Rozas (Salta Capital)',
    direccion: 'Ciudad Educativa Av. Constitución Nacional s/n PB, Ingreso B° Pereyra Rozas, A4400 Salta',
    ciudad: 'Salta Capital, Provincia de Salta',
    lat: -24.74354,
    lng: -65.4058,
    telefono: '+(54) 3875-569961',
    telefonoAlt: 'Sede Balcarce: 387-6092728',
    email: 'consultas@upateco.edu.ar',
    horario: 'Lunes a Viernes: 8:00 a 18:00 hs',
    descripcion: 'Edificio de la Ciudad Educativa con aulas presenciales, SUM para 100 personas, sala de informática con 73 puestos y área administrativa.',
    webUrl: 'https://upateco.edu.ar/contacto/',
    sedesUrl: 'https://upateco.edu.ar/sedes/',
    embedQuery: 'UPATECO+Universidad+Provincial+de+Salta+Pereyra+Rozas+Salta',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=-24.74354,-65.4058'
  },
  {
    id: 'sede-tartagal',
    nombre: 'Sede Tartagal – Extensión Universitaria',
    direccion: 'Centro Cultural de los Pueblos Originarios, Centro, Tartagal, Salta',
    ciudad: 'Tartagal, Dpto. Gral. José de San Martín, Salta',
    lat: -22.5194,
    lng: -63.7986,
    telefono: '+(54) 3875-569961',
    telefonoAlt: 'Atención Central UPATECO',
    email: 'consultas@upateco.edu.ar',
    horario: 'Lunes a Viernes: 8:00 a 18:00 hs',
    descripcion: 'Espacio de capacitación en nuevas tecnologías y economía del conocimiento equipado con computadoras de última generación en el Centro Cultural de los Pueblos Originarios.',
    webUrl: 'https://upateco.edu.ar/sede-tartagal/',
    sedesUrl: 'https://upateco.edu.ar/sedes/',
    embedQuery: 'Centro+Cultural+de+los+Pueblos+Originarios+Tartagal+Salta',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=-22.5194,-63.7986'
  }
];

const CARRERAS_INTERES = [
  'Tecnicatura Universitaria en Programación / Desarrollo de Aplicaciones',
  'Tecnicatura Universitaria en Administración y Gestión de PyMEs',
  'Cursos de Tecnologías y Economía del Conocimiento',
  'Cursos de Oficios y Formación Profesional',
  'Consulta Administrativa General'
];

export default function App() {
  const [activeTab, setActiveTab] = useState('sitio');
  const [selectedSedeId, setSelectedSedeId] = useState('salta-capital');
  const [zoomLevel, setZoomLevel] = useState(15);

  // Estado de configuración de EmailJS
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [emailJsConfig, setEmailJsConfig] = useState({
    serviceId: 'service_km76mdh',
    templateId: 'template_iec0lmq',
    publicKey: 'UvTrcUogSEi2kAF8O',
    targetEmail: 'tu_correo@ejemplo.com'
  });

  // Estado del formulario de contacto
  const [formData, setFormData] = useState({
    user_name: '',
    user_email: '',
    user_phone: '',
    sede_interes: 'Sede Central B° Pereyra Rozas (Salta Capital)',
    career_interest: CARRERAS_INTERES[0],
    message: ''
  });

  const [formStatus, setFormStatus] = useState({
    sending: false,
    type: null, // 'success' | 'simulated' | 'error'
    text: ''
  });

  const [sentHistory, setSentHistory] = useState([]);

  // Estado para el Generador de Entrega (GitHub + Bloc de Notas)
  const [githubUser, setGithubUser] = useState('tu-usuario-github');
  const [repoName, setRepoName] = useState('tp-react-upateco');
  const [studentName, setStudentName] = useState('');
  const [copiedKey, setCopiedKey] = useState(null);

  const formRef = useRef(null);

  const currentSede = SEDES_UPATECO.find((s) => s.id === selectedSedeId) || SEDES_UPATECO[0];

  const hasRealCredentials =
    emailJsConfig.serviceId.trim() !== '' &&
    emailJsConfig.templateId.trim() !== '' &&
    emailJsConfig.publicKey.trim() !== '';

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSedeChange = (sedeId) => {
    setSelectedSedeId(sedeId);
    const sedeObj = SEDES_UPATECO.find((s) => s.id === sedeId);
    if (sedeObj) {
      setFormData((prev) => ({ ...prev, sede_interes: sedeObj.nombre }));
    }
  };

  const fillDemoData = () => {
    setFormData({
      user_name: 'Juan Ignacio Pérez',
      user_email: 'juan.perez@estudiante.upateco.edu.ar',
      user_phone: '+54 387 512-3456',
      sede_interes: currentSede.nombre,
      career_interest: CARRERAS_INTERES[0],
      message: `Hola, me comunico para solicitar información sobre las inscripciones a la ${CARRERAS_INTERES[0]} en la ${currentSede.nombre}. ¡Muchas gracias!`
    });
    setFormStatus({ sending: false, type: null, text: '' });
  };

  const handleSendEmail = async (e) => {
    e.preventDefault();

    if (!formData.user_name.trim() || !formData.user_email.trim() || !formData.message.trim()) {
      setFormStatus({
        sending: false,
        type: 'error',
        text: 'Por favor, completá los campos obligatorios: Nombre, Correo Electrónico y Mensaje.'
      });
      return;
    }

    setFormStatus({ sending: true, type: null, text: 'Procesando envío con EmailJS...' });

    const timestamp = new Date().toLocaleTimeString('es-AR', {
      hour: '2-digit',
      minute: '2-digit'
    });

    if (hasRealCredentials) {
      try {
        const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            service_id: emailJsConfig.serviceId.trim(),
            template_id: emailJsConfig.templateId.trim(),
            user_id: emailJsConfig.publicKey.trim(),
            template_params: {
              name: formData.user_name,
              user_name: formData.user_name,
              from_name: formData.user_name,
              email: formData.user_email,
              user_email: formData.user_email,
              reply_to: formData.user_email,
              user_phone: formData.user_phone || 'No especificado',
              sede_interes: formData.sede_interes,
              title: formData.career_interest,
              subject: formData.career_interest,
              message: formData.message,
              to_email: emailJsConfig.targetEmail
            }
          })
        });

        if (response.ok) {
          setFormStatus({
            sending: false,
            type: 'success',
            text: '¡Mensaje enviado con éxito a través de EmailJS! Revisá tu bandeja de entrada.'
          });
          setSentHistory((prev) => [
            {
              id: Date.now(),
              ...formData,
              time: timestamp,
              mode: 'Envío Real EmailJS'
            },
            ...prev
          ]);
          setFormData((prev) => ({
            ...prev,
            user_name: '',
            user_email: '',
            user_phone: '',
            message: ''
          }));
        } else {
          const errText = await response.text();
          setFormStatus({
            sending: false,
            type: 'error',
            text: `Error de EmailJS (${response.status}): ${errText || 'Verificá tu Service ID, Template ID y Public Key en el botón Configurar EmailJS.'}`
          });
        }
      } catch (error) {
        setFormStatus({
          sending: false,
          type: 'error',
          text: `No se pudo conectar con el servidor de EmailJS: ${error.message}`
        });
      }
    } else {
      // Simulación interactiva cuando aún no se cargaron las credenciales propias de EmailJS
      setTimeout(() => {
        setFormStatus({
          sending: false,
          type: 'simulated',
          text: '¡Envío de prueba completado! Para que el correo llegue a tu cuenta real, ingresá tu Service ID, Template ID y Public Key en "Configurar EmailJS".'
        });
        setSentHistory((prev) => [
          {
            id: Date.now(),
            ...formData,
            time: timestamp,
            mode: 'Modo Prueba (Configurá tus claves para envío real)'
          },
          ...prev
        ]);
        setFormData((prev) => ({
          ...prev,
          user_name: '',
          user_email: '',
          user_phone: '',
          message: ''
        }));
      }, 900);
    }
  };

  const copyToClipboard = (text, key) => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2200);
    } catch (e) {
      console.error(e);
    }
  };

  const cleanUser = githubUser.trim() || 'tu-usuario-github';
  const cleanRepo = repoName.trim() || 'tp-react-upateco';
  const repoOnlineUrl = `https://github.com/${cleanUser}/${cleanRepo}`;
  const publishedPageUrl = `https://${cleanUser}.github.io/${cleanRepo}/`;

  const notepadContent = `======================================================================
ENTREGA DE TRABAJO PRÁCTICO - DESARROLLO CON REACT
UNIVERSIDAD PROVINCIAL DE ADMINISTRACIÓN, TECNOLOGÍA Y OFICIOS (UPATECO)
======================================================================
${studentName.trim() ? `Estudiante: ${studentName.trim()}\n` : ''}Fecha: ${new Date().toLocaleDateString('es-AR')}

1) DIRECCIÓN URL DEL REPOSITORIO ONLINE (GITHUB):
${repoOnlineUrl}

2) DIRECCIÓN URL DE LA PÁGINA PUBLICADA (GITHUB PAGES):
${publishedPageUrl}

======================================================================
Características implementadas:
- Sitio web desarrollado con la librería React.
- Formulario de contacto funcional integrado con el servicio EmailJS.
- Mapa embebido al lado del formulario con la ubicación oficial de la
  Universidad UPATECO (Sede Central B° Pereyra Rozas y Sede Tartagal).
- Diseño adaptable (responsive) y estilos institucionales.
======================================================================`;

  const downloadNotepadTxt = () => {
    const blob = new Blob([notepadContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'entrega_upateco_urls.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const standaloneReactCode = `// src/App.jsx - Código para tu proyecto local (Vite o Create React App)
// Instalar dependencia antes de correr: npm install @emailjs/browser
import React, { useRef, useState } from 'react';
import emailjs from '@emailjs/browser';
import './App.css';

export default function App() {
  const formRef = useRef();
  const [status, setStatus] = useState('');
  const [sending, setSending] = useState(false);

  // Reemplazá estos 3 valores con los de tu cuenta de https://www.emailjs.com/
  const SERVICE_ID = '${emailJsConfig.serviceId || 'TU_SERVICE_ID'}';
  const TEMPLATE_ID = '${emailJsConfig.templateId || 'TU_TEMPLATE_ID'}';
  const PUBLIC_KEY = '${emailJsConfig.publicKey || 'TU_PUBLIC_KEY'}';

  const sendEmail = (e) => {
    e.preventDefault();
    setSending(true);
    setStatus('Enviando mensaje...');

    emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, formRef.current, {
      publicKey: PUBLIC_KEY,
    })
    .then(() => {
      setStatus('¡Mensaje enviado correctamente a tu correo!');
      setSending(false);
      formRef.current.reset();
    })
    .catch((error) => {
      console.error('Error al enviar:', error);
      setStatus('Hubo un error al enviar el mensaje. Verificá tus credenciales.');
      setSending(false);
    });
  };

  return (
    <div className="page-wrapper">
      <header className="navbar">
        <div className="navbar-brand">
          <span className="badge">UPATECO</span>
          <h1>Universidad Provincial de Administración, Tecnología y Oficios</h1>
        </div>
      </header>

      <main className="main-container">
        <section className="hero-banner">
          <h2>Portal de Contacto y Ubicación Universitaria</h2>
          <p>Comunicate con nosotros a través del formulario o visitanos en nuestra sede.</p>
        </section>

        {/* Contenedor Principal: Formulario + Mapa lado a lado */}
        <div className="contact-map-grid">
          {/* Columna Izquierda: Formulario con EmailJS */}
          <div className="card form-card">
            <h3>Envianos tu Consulta</h3>
            <p className="subtitle">Completá tus datos y te responderemos a la brevedad.</p>

            <form ref={formRef} onSubmit={sendEmail} className="contact-form">
              <div className="form-group">
                <label htmlFor="user_name">Nombre y Apellido *</label>
                <input
                  type="text"
                  id="user_name"
                  name="user_name"
                  placeholder="Ej. María González"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="user_email">Correo Electrónico *</label>
                <input
                  type="email"
                  id="user_email"
                  name="user_email"
                  placeholder="ejemplo@correo.com"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="subject">Asunto / Carrera de Interés</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  placeholder="Tecnicatura en Programación"
                />
              </div>

              <div className="form-group">
                <label htmlFor="message">Mensaje *</label>
                <textarea
                  id="message"
                  name="message"
                  rows="4"
                  placeholder="Escribí tu consulta aquí..."
                  required
                ></textarea>
              </div>

              <button type="submit" className="btn-submit" disabled={sending}>
                {sending ? 'Enviando...' : 'Enviar Mensaje'}
              </button>

              {status && <p className="status-msg">{status}</p>}
            </form>
          </div>

          {/* Columna Derecha: Mapa Embebido de Universidad UPATECO */}
          <div className="card map-card">
            <h3>Ubicación - Universidad UPATECO</h3>
            <p className="subtitle">
              Ciudad Educativa - B° Pereyra Rozas, Av. Constitución Nacional s/n, Salta
            </p>

            <div className="map-frame-container">
              <iframe
                title="Mapa Universidad UPATECO"
                src="https://maps.google.com/maps?q=-24.74354,-65.4058&z=15&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>

            <div className="info-footer">
              <p><strong>Dirección:</strong> B° Pereyra Rozas – Ciudad Educativa Av. Constitución Nacional s/n PB</p>
              <p><strong>Teléfono:</strong> +(54) 3875-569961 | <strong>Email:</strong> consultas@upateco.edu.ar</p>
              <p><strong>Horario:</strong> Lunes a Viernes de 8:00 a 18:00 hs</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}`;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      {/* Barra Superior Institucional + Conmutador de Vistas del Trabajo Práctico */}
      <header className="bg-gradient-to-r from-blue-950 via-blue-900 to-indigo-950 text-white shadow-lg sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between py-3.5 gap-3">
            {/* Logo e Identidad UPATECO */}
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 shadow-inner shrink-0">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold tracking-wider text-lg text-white">
                    UPATECO
                  </span>
                  <span className="text-[11px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                    React + EmailJS
                  </span>
                </div>
                <p className="text-xs text-blue-200 line-clamp-1">
                  Universidad Provincial de Administración, Tecnología y Oficios · Salta
                </p>
              </div>
            </div>

            {/* Pestañas de navegación para cubrir Puntos 1, 2 y 3 del Trabajo Práctico */}
            <div className="flex flex-wrap items-center gap-1.5 bg-blue-950/60 p-1.5 rounded-xl border border-blue-800/70">
              <button
                type="button"
                onClick={() => setActiveTab('sitio')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'sitio'
                    ? 'bg-amber-400 text-slate-950 shadow-sm'
                    : 'text-blue-100 hover:bg-blue-800/60'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>1. Sitio Principal</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('codigo')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'codigo'
                    ? 'bg-amber-400 text-slate-950 shadow-sm'
                    : 'text-blue-100 hover:bg-blue-800/60'
                }`}
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>Código React</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('github-entrega')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'github-entrega'
                    ? 'bg-amber-400 text-slate-950 shadow-sm'
                    : 'text-blue-100 hover:bg-blue-800/60'
                }`}
              >
                <Github className="w-3.5 h-3.5" />
                <span>2 y 3. GitHub + Bloc de Notas</span>
              </button>

              <button
                type="button"
                onClick={() => setShowConfigModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-800/80 hover:bg-blue-700 text-amber-200 border border-blue-600/50 transition-all ml-auto md:ml-1"
                title="Configurar credenciales de EmailJS"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>Configurar EmailJS</span>
                <span
                  className={`w-2 h-2 rounded-full ${
                    hasRealCredentials ? 'bg-emerald-400' : 'bg-amber-400 animate-pulse'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* VISTA 1: SITIO WEB PRINCIPAL (FORMULARIO EMAILJS + MAPA UPATECO AL LADO) */}
      {activeTab === 'sitio' && (
        <main className="flex-1">
          {/* Hero / Encabezado de bienvenida */}
          <section className="bg-gradient-to-b from-blue-900 to-slate-900 text-white py-10 px-4 sm:px-6 lg:px-8 border-b border-blue-800/40">
            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-800/70 border border-blue-600/50 text-blue-200 text-xs font-medium mb-3">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Educación Superior Pública, Tecnológica y de Oficios</span>
                </div>
                <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                  Contacto y Ubicación Institucional{' '}
                  <span className="text-amber-400">UPATECO</span>
                </h1>
                <p className="mt-2.5 text-sm sm:text-base text-slate-300 leading-relaxed">
                  Envianos tu consulta directa por correo electrónico mediante nuestro formulario
                  conectado con <strong>EmailJS</strong> o encontrá cómo llegar a nuestras sedes
                  universitarias en el mapa interactivo.
                </p>
              </div>

              {/* Tarjetas rápidas de contacto oficial */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 shrink-0">
                <div className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-xl p-3.5 flex items-start gap-3">
                  <Phone className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-medium text-blue-200">Atención Telefónica</p>
                    <p className="text-sm font-bold text-white">+(54) 3875-569961</p>
                    <p className="text-[11px] text-slate-300">Sede Balcarce: 387-6092728</p>
                  </div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-xl p-3.5 flex items-start gap-3">
                  <Clock className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-medium text-blue-200">Horario de Atención</p>
                    <p className="text-sm font-bold text-white">Lun a Vie: 8:00 – 18:00 hs</p>
                    <p className="text-[11px] text-slate-300">consultas@upateco.edu.ar</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* SECCIÓN CENTRAL: FORMULARIO DE CONTACTO + MAPA AL LADO */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Banner informativo de estado EmailJS */}
            <div className="mb-6 bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start sm:items-center gap-3">
                <div
                  className={`p-2.5 rounded-xl shrink-0 ${
                    hasRealCredentials
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-sm font-bold text-slate-900">
                      Servicio EmailJS:{' '}
                      {hasRealCredentials
                        ? 'Conectado con tus credenciales'
                        : 'Listo para vincular tus claves'}
                    </h2>
                    <span
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                        hasRealCredentials
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {hasRealCredentials ? 'Envío Real Activo' : 'Modo Interactivo / Prueba'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5">
                    {hasRealCredentials
                      ? `Los mensajes enviados desde el formulario se despachan vía API oficial de EmailJS (Service ID: ${emailJsConfig.serviceId}).`
                      : 'Podés probar el formulario ahora mismo o cargar tu Service ID, Template ID y Public Key de EmailJS para recibir los correos en tu bandeja real.'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={fillDemoData}
                  className="px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Autocompletar Prueba</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowConfigModal(true)}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-blue-900 hover:bg-blue-800 text-white transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  <Settings className="w-3.5 h-3.5" />
                  <span>Credenciales EmailJS</span>
                </button>
              </div>
            </div>

            {/* GRILLA DE 2 COLUMNAS: IZQUIERDA FORMULARIO / DERECHA MAPA UPATECO */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              {/* COLUMNA IZQUIERDA (6 cols): FORMULARIO DE CONTACTO FUNCIONAL */}
              <div className="lg:col-span-6 bg-white rounded-2xl shadow-md border border-slate-200/90 p-6 sm:p-8 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-blue-700">
                        Formulario de Contacto
                      </span>
                      <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-0.5">
                        Envianos tu Consulta
                      </h2>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-700">
                      <Send className="w-5 h-5" />
                    </div>
                  </div>

                  <form ref={formRef} onSubmit={handleSendEmail} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="user_name"
                          className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5"
                        >
                          Nombre y Apellido <span className="text-rose-500">*</span>
                        </label>
                        <input
                          id="user_name"
                          name="user_name"
                          type="text"
                          required
                          value={formData.user_name}
                          onChange={handleInputChange}
                          placeholder="Ej. Valentina López"
                          className="w-full rounded-xl border border-slate-300 bg-slate-50/60 px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 transition-all"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="user_email"
                          className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5"
                        >
                          Tu Correo Electrónico <span className="text-rose-500">*</span>
                        </label>
                        <input
                          id="user_email"
                          name="user_email"
                          type="email"
                          required
                          value={formData.user_email}
                          onChange={handleInputChange}
                          placeholder="nombre@correo.com"
                          className="w-full rounded-xl border border-slate-300 bg-slate-50/60 px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 transition-all"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="user_phone"
                          className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5"
                        >
                          Teléfono / WhatsApp (Opcional)
                        </label>
                        <input
                          id="user_phone"
                          name="user_phone"
                          type="tel"
                          value={formData.user_phone}
                          onChange={handleInputChange}
                          placeholder="Ej. +54 387 500-0000"
                          className="w-full rounded-xl border border-slate-300 bg-slate-50/60 px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 transition-all"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="sede_interes"
                          className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5"
                        >
                          Sede de Consulta
                        </label>
                        <select
                          id="sede_interes"
                          name="sede_interes"
                          value={formData.sede_interes}
                          onChange={(e) => {
                            handleInputChange(e);
                            const found = SEDES_UPATECO.find((s) => s.nombre === e.target.value);
                            if (found) setSelectedSedeId(found.id);
                          }}
                          className="w-full rounded-xl border border-slate-300 bg-slate-50/60 px-3.5 py-2.5 text-sm text-slate-900 focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 transition-all"
                        >
                          {SEDES_UPATECO.map((s) => (
                            <option key={s.id} value={s.nombre}>
                              {s.nombre}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="career_interest"
                        className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5"
                      >
                        Carrera o Área de Interés
                      </label>
                      <select
                        id="career_interest"
                        name="career_interest"
                        value={formData.career_interest}
                        onChange={handleInputChange}
                        className="w-full rounded-xl border border-slate-300 bg-slate-50/60 px-3.5 py-2.5 text-sm text-slate-900 focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 transition-all"
                      >
                        {CARRERAS_INTERES.map((carrera) => (
                          <option key={carrera} value={carrera}>
                            {carrera}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="message"
                        className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5"
                      >
                        Mensaje / Consulta <span className="text-rose-500">*</span>
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows={4}
                        required
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder="Escribí tu mensaje o consulta sobre inscripciones, cursado o requisitos..."
                        className="w-full rounded-xl border border-slate-300 bg-slate-50/60 px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 transition-all resize-y"
                      />
                    </div>

                    {/* Alerta de respuesta del envío */}
                    {formStatus.text && (
                      <div
                        className={`p-3.5 rounded-xl border text-xs leading-relaxed flex items-start gap-2.5 ${
                          formStatus.type === 'success'
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                            : formStatus.type === 'simulated'
                            ? 'bg-blue-50 border-blue-200 text-blue-900'
                            : formStatus.type === 'error'
                            ? 'bg-rose-50 border-rose-200 text-rose-800'
                            : 'bg-slate-100 border-slate-200 text-slate-700'
                        }`}
                      >
                        {formStatus.type === 'error' ? (
                          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
                        ) : (
                          <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
                        )}
                        <div className="flex-1">
                          <p className="font-semibold">{formStatus.text}</p>
                          {formStatus.type === 'simulated' && (
                            <button
                              type="button"
                              onClick={() => setShowConfigModal(true)}
                              className="mt-1.5 inline-flex items-center gap-1 font-bold text-blue-700 underline hover:text-blue-900"
                            >
                              Configurar mis claves de EmailJS ahora →
                            </button>
                          )}
                        </div>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={formStatus.sending}
                      className="w-full py-3 px-5 rounded-xl bg-gradient-to-r from-blue-900 to-indigo-900 hover:from-blue-800 hover:to-indigo-800 disabled:opacity-60 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Send className="w-4 h-4" />
                      <span>
                        {formStatus.sending ? 'Enviando mensaje...' : 'Enviar Mensaje por EmailJS'}
                      </span>
                    </button>
                  </form>
                </div>

                {/* Historial de envíos en la sesión actual */}
                <div className="mt-6 pt-4 border-t border-slate-100">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>Integrado con SDK @emailjs/browser</span>
                    <span>Mensajes enviados en esta sesión: {sentHistory.length}</span>
                  </div>

                  {sentHistory.length > 0 && (
                    <div className="mt-3 space-y-2 max-h-36 overflow-y-auto pr-1">
                      {sentHistory.map((item) => (
                        <div
                          key={item.id}
                          className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80 text-xs flex items-center justify-between gap-2"
                        >
                          <div className="truncate">
                            <span className="font-bold text-slate-800">{item.user_name}</span>{' '}
                            <span className="text-slate-500">({item.user_email})</span>
                            <p className="text-slate-600 truncate">{item.message}</p>
                          </div>
                          <span className="shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                            {item.time}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* COLUMNA DERECHA (6 cols): MAPA EMBEBIDO DE LA UNIVERSIDAD UPATECO */}
              <div className="lg:col-span-6 bg-white rounded-2xl shadow-md border border-slate-200/90 p-6 sm:p-8 flex flex-col justify-between">
                <div>
                  {/* Cabecera y selector de Sede */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4 mb-5">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
                        Geolocalización Institucional
                      </span>
                      <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-0.5">
                        Ubicación Universidad UPATECO
                      </h2>
                    </div>

                    {/* Conmutador entre Sede Central Salta Capital y Sede Tartagal */}
                    <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl self-start">
                      <button
                        type="button"
                        onClick={() => handleSedeChange('salta-capital')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          selectedSedeId === 'salta-capital'
                            ? 'bg-blue-900 text-white shadow-sm'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        Sede Central (Salta)
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSedeChange('sede-tartagal')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          selectedSedeId === 'sede-tartagal'
                            ? 'bg-blue-900 text-white shadow-sm'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        Sede Tartagal
                      </button>
                    </div>
                  </div>

                  {/* Contenedor del Mapa Embebido */}
                  <div className="relative rounded-2xl overflow-hidden border border-slate-300 bg-slate-100 h-80 sm:h-96 shadow-inner">
                    <iframe
                      key={`${currentSede.id}-${zoomLevel}`}
                      title={`Mapa de ${currentSede.nombre}`}
                      src={`https://maps.google.com/maps?q=${currentSede.lat},${currentSede.lng}&z=${zoomLevel}&output=embed`}
                      className="w-full h-full border-0"
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />

                    {/* Controles flotantes de Zoom y Coordenadas */}
                    <div className="absolute bottom-3 left-3 right-3 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
                      <div className="pointer-events-auto bg-slate-900/90 backdrop-blur-md text-white px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-2 shadow-lg border border-white/15">
                        <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span>
                          GPS: {currentSede.lat}, {currentSede.lng}
                        </span>
                      </div>

                      <div className="pointer-events-auto flex items-center gap-1 bg-white/95 backdrop-blur-md p-1 rounded-xl shadow-lg border border-slate-200">
                        <button
                          type="button"
                          onClick={() => setZoomLevel((z) => Math.max(11, z - 1))}
                          className="px-2.5 py-1 text-xs font-bold text-slate-700 hover:bg-slate-100 rounded-lg"
                          title="Alejar mapa"
                        >
                          − Zoom
                        </button>
                        <span className="text-[11px] font-semibold text-slate-500 px-1">
                          {zoomLevel}x
                        </span>
                        <button
                          type="button"
                          onClick={() => setZoomLevel((z) => Math.min(18, z + 1))}
                          className="px-2.5 py-1 text-xs font-bold text-slate-700 hover:bg-slate-100 rounded-lg"
                          title="Acercar mapa"
                        >
                          + Zoom
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Ficha informativa de la sede seleccionada */}
                  <div className="mt-5 bg-slate-50 rounded-xl p-4 border border-slate-200/80 space-y-2.5">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2.5">
                        <Building2 className="w-5 h-5 text-blue-800 shrink-0 mt-0.5" />
                        <div>
                          <h3 className="text-sm font-bold text-slate-900">
                            {currentSede.nombre}
                          </h3>
                          <p className="text-xs text-slate-600 mt-0.5">
                            {currentSede.direccion}
                          </p>
                        </div>
                      </div>
                      <a
                        href={currentSede.googleMapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shrink-0 inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-900 text-xs font-bold transition-colors"
                      >
                        <Navigation className="w-3.5 h-3.5" />
                        <span>Abrir Mapa</span>
                      </a>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed pt-1 border-t border-slate-200/70">
                      {currentSede.descripcion}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs">
                      <div className="flex items-center gap-1.5 text-slate-700">
                        <Phone className="w-3.5 h-3.5 text-blue-700 shrink-0" />
                        <span>
                          <strong>Tel.:</strong> {currentSede.telefono}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-700">
                        <Mail className="w-3.5 h-3.5 text-blue-700 shrink-0" />
                        <span>
                          <strong>Correo:</strong> {currentSede.email}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Enlaces verificados de la Universidad */}
                <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <span className="text-slate-500 font-medium">Fuentes oficiales UPATECO:</span>
                  <div className="flex flex-wrap items-center gap-3">
                    <a
                      href="https://upateco.edu.ar/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-700 hover:underline font-semibold inline-flex items-center gap-1"
                    >
                      <span>upateco.edu.ar</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                    <a
                      href={currentSede.webUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-700 hover:underline font-semibold inline-flex items-center gap-1"
                    >
                      <span>Ver página de sede</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      )}

      {/* VISTA 2: CÓDIGO FUENTE REACT LISTO PARA SUBIR A GITHUB */}
      {activeTab === 'codigo' && (
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-700">
                  Punto 1 del Trabajo Práctico
                </span>
                <h2 className="text-xl font-extrabold text-slate-900 mt-0.5">
                  Código del Componente Principal React (`src/App.jsx`)
                </h2>
                <p className="text-xs text-slate-600 mt-1">
                  Este código utiliza la librería oficial <code className="font-mono bg-slate-100 px-1.5 py-0.5 rounded">@emailjs/browser</code> y coloca el formulario de contacto junto al mapa de la Universidad UPATECO.
                </p>
              </div>
              <button
                type="button"
                onClick={() => copyToClipboard(standaloneReactCode, 'react-code')}
                className="px-4 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-white text-xs font-bold flex items-center gap-2 self-start shrink-0 shadow-sm transition-all cursor-pointer"
              >
                {copiedKey === 'react-code' ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-300" />
                    <span>¡Código Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copiar src/App.jsx</span>
                  </>
                )}
              </button>
            </div>

            <pre className="mt-4 bg-slate-950 text-slate-100 p-4 rounded-xl text-xs font-mono overflow-x-auto leading-relaxed max-h-[460px]">
              <code>{standaloneReactCode}</code>
            </pre>
          </div>
        </main>
      )}

      {/* VISTA 3: PUBLICACIÓN EN GITHUB Y GENERADOR DE BLOC DE NOTAS (PUNTOS 2 Y 3) */}
      {activeTab === 'github-entrega' && (
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Columna Izquierda: Paso a Paso GitHub + GitHub Pages (Punto 2) */}
            <div className="lg:col-span-6 bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-5">
              <div className="border-b border-slate-100 pb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-700">
                  Punto 2 del Trabajo Práctico
                </span>
                <h2 className="text-xl font-extrabold text-slate-900 mt-0.5">
                  Subir a GitHub y Publicar en GitHub Pages
                </h2>
                <p className="text-xs text-slate-600 mt-1">
                  Ingresá tu nombre de usuario de GitHub y el nombre de tu repositorio para personalizar todos los comandos y las URLs de entrega.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Tu Usuario de GitHub
                  </label>
                  <input
                    type="text"
                    value={githubUser}
                    onChange={(e) => setGithubUser(e.target.value)}
                    placeholder="ej. juanperez"
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Nombre del Repositorio
                  </label>
                  <input
                    type="text"
                    value={repoName}
                    onChange={(e) => setRepoName(e.target.value)}
                    placeholder="ej. tp-react-upateco"
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <p className="font-bold text-slate-900 mb-1">
                    Paso 1: Instalar EmailJS y gh-pages en tu proyecto React
                  </p>
                  <code className="block bg-slate-900 text-amber-300 p-2.5 rounded-lg font-mono">
                    npm install @emailjs/browser gh-pages --save-dev
                  </code>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <p className="font-bold text-slate-900 mb-1">
                    Paso 2: Agregar homepage y scripts en tu `package.json`
                  </p>
                  <pre className="bg-slate-900 text-emerald-300 p-2.5 rounded-lg font-mono overflow-x-auto">
{`"homepage": "${publishedPageUrl}",
"scripts": {
  "predeploy": "npm run build",
  "deploy": "gh-pages -d dist"
}`}
                  </pre>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <p className="font-bold text-slate-900 mb-1">
                    Paso 3: Subir el código a tu cuenta de GitHub y publicarlo
                  </p>
                  <pre className="bg-slate-900 text-blue-200 p-2.5 rounded-lg font-mono overflow-x-auto leading-relaxed">
{`git init
git add .
git commit -m "Sitio web React UPATECO con EmailJS y Mapa"
git branch -M main
git remote add origin ${repoOnlineUrl}.git
git push -u origin main
npm run deploy`}
                  </pre>
                </div>
              </div>
            </div>

            {/* Columna Derecha: Generador de Bloc de Notas (.txt) para la Plataforma (Punto 3) */}
            <div className="lg:col-span-6 bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col justify-between space-y-5">
              <div>
                <div className="border-b border-slate-100 pb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
                    Punto 3 del Trabajo Práctico
                  </span>
                  <h2 className="text-xl font-extrabold text-slate-900 mt-0.5">
                    Bloc de Notas para la Plataforma Educativa UPATECO
                  </h2>
                  <p className="text-xs text-slate-600 mt-1">
                    Descargá el archivo <code className="font-mono bg-slate-100 px-1.5 py-0.5 rounded">.txt</code> listo para subir al aula virtual de la universidad con las dos direcciones URL solicitadas.
                  </p>
                </div>

                <div className="mt-4">
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Tu Nombre y Apellido (Opcional para el encabezado del .txt)
                  </label>
                  <input
                    type="text"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    placeholder="Ej. Juan Ignacio Pérez"
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none"
                  />
                </div>

                <div className="mt-4">
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                    Vista Previa del Bloc de Notas (`entrega_upateco_urls.txt`)
                  </label>
                  <pre className="bg-amber-50/70 border border-amber-200 text-slate-800 p-4 rounded-xl text-xs font-mono whitespace-pre-wrap leading-relaxed">
                    {notepadContent}
                  </pre>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={downloadNotepadTxt}
                  className="flex-1 py-3 px-4 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Descargar Bloc de Notas (.txt)</span>
                </button>

                <button
                  type="button"
                  onClick={() => copyToClipboard(notepadContent, 'notepad-txt')}
                  className="py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  {copiedKey === 'notepad-txt' ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>¡Texto Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copiar Texto</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </main>
      )}

      {/* MODAL PARA CONFIGURAR CREDENCIALES REALES DE EMAILJS */}
      {showConfigModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5">
            <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-blue-100 text-blue-800">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    Configurar Credenciales de EmailJS
                  </h3>
                  <p className="text-xs text-slate-500">
                    Ingresá los datos de tu cuenta gratuita de{' '}
                    <a
                      href="https://dashboard.emailjs.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-700 underline font-semibold"
                    >
                      emailjs.com
                    </a>
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowConfigModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold px-2 py-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Service ID (ID del Servicio de Correo)
                </label>
                <input
                  type="text"
                  value={emailJsConfig.serviceId}
                  onChange={(e) =>
                    setEmailJsConfig((p) => ({ ...p, serviceId: e.target.value }))
                  }
                  placeholder="Ej. service_abc1234"
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Template ID (ID de la Plantilla)
                </label>
                <input
                  type="text"
                  value={emailJsConfig.templateId}
                  onChange={(e) =>
                    setEmailJsConfig((p) => ({ ...p, templateId: e.target.value }))
                  }
                  placeholder="Ej. template_xyz5678"
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Public Key (Clave Pública de tu Cuenta)
                </label>
                <input
                  type="text"
                  value={emailJsConfig.publicKey}
                  onChange={(e) =>
                    setEmailJsConfig((p) => ({ ...p, publicKey: e.target.value }))
                  }
                  placeholder="Ej. aBcDeFgHiJkLmNoPq"
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none"
                />
              </div>

              <div className="p-3 rounded-xl bg-blue-50 border border-blue-100 text-blue-900 flex items-start gap-2">
                <Info className="w-4 h-4 shrink-0 mt-0.5 text-blue-700" />
                <p className="leading-relaxed">
                  En tu plantilla de EmailJS usá las variables{' '}
                  <code className="font-mono font-bold">{'{{user_name}}'}</code>,{' '}
                  <code className="font-mono font-bold">{'{{user_email}}'}</code>,{' '}
                  <code className="font-mono font-bold">{'{{subject}}'}</code> y{' '}
                  <code className="font-mono font-bold">{'{{message}}'}</code>.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowConfigModal(false)}
                className="px-4 py-2 rounded-xl bg-blue-900 hover:bg-blue-800 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                Guardar y Volver al Sitio
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pie de Página Institucional */}
      <footer className="bg-slate-900 text-slate-400 text-xs py-5 px-4 sm:px-6 lg:px-8 border-t border-slate-800 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white">UPATECO</span>
            <span>·</span>
            <span>Universidad Provincial de Administración, Tecnología y Oficios (Salta)</span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://upateco.edu.ar/contacto/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              Contacto Oficial
            </a>
            <a
              href="https://upateco.edu.ar/sedes/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              Sedes Universitarias
            </a>
            <a
              href="https://www.emailjs.com/docs/sdk/installation/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              Documentación EmailJS
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}