# Use official OpenJDK image as base
FROM eclipse-temurin:17-jre-alpine

# Set working directory
WORKDIR /app

# Copy the packaged WAR file from target directory
COPY target/bidding-service-0.0.1-SNAPSHOT.war app.war

# Expose port
EXPOSE 8084

# Run the app
ENTRYPOINT ["java", "-jar", "app.war"]