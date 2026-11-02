from app import create_app
from werkzeug.middleware.proxy_fix import ProxyFix
import os

app = create_app()

app.wsgi_app = ProxyFix(app.wsgi_app, x_for=1, x_proto=1, x_host=1, x_prefix=1)


port = int(os.environ.get("PORT", 5000))

if __name__ == "__main__":
    app.run(
        host = "0.0.0.0",
        port = port,
        debug = False
    )
