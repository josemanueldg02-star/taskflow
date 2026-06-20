# ===== Etapa 1: Construcción =====
FROM eclipse-temurin:25-jdk AS build
WORKDIR /app

# Archivos de Maven
COPY .mvn/ .mvn/
COPY mvnw pom.xml ./

# Normalizaciónde saltos de línea del wrapper.
RUN sed -i 's/\r$//' mvnw && chmod +x mvnw

# Descargamos las dependencias
RUN ./mvnw dependency:go-offline -B

# Copiamos código fuente y empaquetamos .jar
COPY src/ src/
RUN ./mvnw clean package -DskipTests -B

# ==== Etapa 2: Ejecución ====
FROM eclipse-temurin:25-jre AS runtime
WORKDIR /app

# Copiamos únicamente el .jar generado.
COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]