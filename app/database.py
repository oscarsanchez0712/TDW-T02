import mysql.connector
from app.config import Config
def obtener_conexion():
    return mysql.connector.connect(
        host=Config.DB_HOST,
        port=Config.DB_PORT,
        user=Config.DB_USER,
        password=Config.DB_PASSWORD,
        database=Config.DB_NAME,
        connect_timeout=10
    )

def guardar_contacto(nombre, email, telefono, producto, tipo_comprador, mensaje):
    conn = obtener_conexion()
    cursor = conn.cursor()

    query = """
        INSERT INTO CONTACT_LEAD (name, email, phone, product_interest, buyer_type, message, created_at)
        VALUES (%s, %s, %s, %s, %s, %s, NOW())
    """

    valores = (nombre, email, telefono, producto, tipo_comprador, mensaje)

    cursor.execute(query, valores)
    conn.commit()

    cursor.close()
    conn.close()
