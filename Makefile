# Nombre de la imagen
IMAGE_NAME = api-memorial-maria
# Puerto en el que se ejecutará la aplicación
PORT = 4000

# Declarar objetivos como PHONY para que siempre se ejecuten
.PHONY: build run clean all

# Construir la imagen Docker
build:
	docker build -t $(IMAGE_NAME) .

# Ejecutar el contenedor
run:
#docker run -p $(PORT):4000 $(IMAGE_NAME)
	docker run -d -p 4000:4000 -e MONGODB_URI=mongodb://host.docker.internal:27017 $(IMAGE_NAME)


# Limpiar la imagen y los contenedores (opcional)
clean:
	docker rm -f $(IMAGE_NAME) || true
	docker rmi $(IMAGE_NAME) || true

# Construir la imagen y ejecutar el contenedor
all: build run
