# Don Lorenzo - Sitio web

Sitio web de la **Asociación de Productores Agropecuarios Don Lorenzo** (Samán, Azángaro - Puno), productora de quesos, mantequilla y otros derivados lácteos de altura.

Proyecto del curso **ASE261S2_T05_wp** (Análisis de Sistemas).

## Páginas

- **Inicio:** presentación de la asociación, carrusel, productos destacados y cobertura de despacho.
- **Contacto:** datos de la asociación, mapa y formulario para solicitar cotizaciones.

## Características

- Formulario de contacto con validación en el navegador y en el servidor.
- Las consultas se guardan en una base de datos MySQL.
- Sitio en español e inglés.
- Modo claro y oscuro.
- Diseño adaptable a celular, tablet y computadora.

## Tecnologías

- Python y Flask
- MySQL
- HTML, JavaScript y Tailwind CSS

## Requisitos

- Python 3.10 o superior
- Un servidor MySQL con la tabla `CONTACT_LEAD`

## Instalación

```bash
git clone https://github.com/oscarsanchez0712/TDW-T02.git
cd TDW-T02
pip install -r requirements.txt
```

Configurar la conexión a la base de datos en `app/config.py` y ejecutar:

```bash
python app.py
```

Abrir `http://127.0.0.1:5000` en el navegador.

## Estructura

```
app.py                  punto de entrada
app/
├── config.py           conexión a MySQL
├── database.py         guarda las consultas
├── routes/main.py      rutas y validación del formulario
├── templates/          páginas HTML (inicio y contacto)
└── static/             CSS, JavaScript e imágenes
sitemap.xml
```

## Autor

Oscar Heyton Sanchez Arias
