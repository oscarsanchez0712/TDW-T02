import re
from flask import render_template, request, jsonify
from app.database import guardar_contacto

PRODUCTOS_VALIDOS = {
    "Queso Paria", "Queso Andino", "Queso Gouda",
    "Mantequilla", "Yogurt", "Crema de Leche", "Varios"
}
COMPRADORES_VALIDOS = {
    "Comerciante Mayorista", "Distribuidor", "Programa Social",
    "Gourmet / Exportación", "Consumidor Final"
}

RE_NOMBRE = re.compile(r"^(?=.*[A-Za-zÁÉÍÓÚáéíóúÑñÜü])[A-Za-zÁÉÍÓÚáéíóúÑñÜü0-9\s.,&'’\-]{3,100}$")
RE_CORREO = re.compile(r"^[^\s@]+@[^\s@]+\.[^\s@]+$")
RE_TELEFONO = re.compile(r"^9\d{8}$")


def validar_contacto(data):
    """Valida en el servidor (el JS del navegador se puede saltar).
    Devuelve (datos_limpios, mensaje_de_error)."""
    nombre = str(data.get('nombre') or '').strip()
    correo = str(data.get('correo') or '').strip()
    telefono = re.sub(r'[\s-]', '', str(data.get('telefono') or ''))
    producto = str(data.get('producto') or '').strip()
    comprador = str(data.get('comprador') or '').strip()
    mensaje = str(data.get('mensaje') or '').strip()

    if not RE_NOMBRE.match(nombre):
        return None, "Nombre no válido."
    if len(correo) > 120 or not RE_CORREO.match(correo):
        return None, "Correo electrónico no válido."
    if not RE_TELEFONO.match(telefono):
        return None, "Teléfono no válido."
    if producto not in PRODUCTOS_VALIDOS:
        return None, "Producto no válido."
    if comprador not in COMPRADORES_VALIDOS:
        return None, "Tipo de comprador no válido."
    if not (10 <= len(mensaje) <= 500):
        return None, "El mensaje debe tener entre 10 y 500 caracteres."
    if data.get('consentimiento') is not True:
        return None, "Debes aceptar el uso de tus datos para enviar la consulta."

    return (nombre, correo, telefono, producto, comprador, mensaje), None


def register_routes(app):

    @app.route('/')
    def inicio():
        return render_template('inicio/index.html')

    @app.route('/contacto', methods=['GET', 'POST'])
    def contacto():
        if request.method == 'POST':
            data = request.get_json(silent=True) or {}

            # Honeypot anti-spam: un humano nunca llena este campo oculto
            if data.get('web'):
                return jsonify({"status": "success", "message": "Consulta registrada correctamente"}), 200

            valores, error = validar_contacto(data)
            if error:
                return jsonify({"status": "error", "message": error}), 400

            try:
                guardar_contacto(*valores)
                return jsonify({"status": "success", "message": "Consulta registrada correctamente"}), 200
            except Exception as e:
                print(f"Error al guardar registro: {e}")
                return jsonify({"status": "error", "message": "Ocurrió un error al registrar los datos"}), 500

        return render_template('contacto/contacto.html')
