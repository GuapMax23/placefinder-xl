#!/bin/bash

echo "Lancement de PlaceFinder XL..."

# Vérifie si Docker est actif
if ! systemctl is-active --quiet docker; then
  echo "Démarrage de Docker..."
  sudo systemctl start docker
fi

# Lancer le backend
echo "Démarrage du backend..."
sudo docker-compose up --build
