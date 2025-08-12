# Dockerfile for GeoServer deployment
FROM openjdk:11-jre-slim

# Install required packages
RUN apt-get update && apt-get install -y \
    wget \
    unzip \
    && rm -rf /var/lib/apt/lists/*

# Set environment variables
ENV GEOSERVER_VERSION=2.22.2
ENV GEOSERVER_HOME=/opt/geoserver
ENV GEOSERVER_DATA_DIR=/opt/geoserver/data_dir

# Download and install GeoServer
RUN wget https://sourceforge.net/projects/geoserver/files/GeoServer/${GEOSERVER_VERSION}/geoserver-${GEOSERVER_VERSION}-bin.zip \
    && unzip geoserver-${GEOSERVER_VERSION}-bin.zip \
    && mv geoserver-${GEOSERVER_VERSION} ${GEOSERVER_HOME} \
    && rm geoserver-${GEOSERVER_VERSION}-bin.zip

# Create data directory
RUN mkdir -p ${GEOSERVER_DATA_DIR}

# Copy your data files (if any)
# COPY ./data/ ${GEOSERVER_DATA_DIR}/

# Expose port
EXPOSE 8080

# Set working directory
WORKDIR ${GEOSERVER_HOME}

# Start GeoServer
CMD ["./bin/startup.sh"]
