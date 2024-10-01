provider "google" {
  project = var.project_id
  region  = var.region
}

resource "google_container_cluster" "primary" {
  name     = var.cluster_name
  location = var.location

  initial_node_count = 1

  node_config {
    machine_type = "e2-medium"
    oauth_scopes = [
      "https://www.googleapis.com/auth/cloud-platform",
    ]
    service_account = var.service_account

  }

  deletion_protection = false 
}

variable "project_id" {
  description = "The ID of the GCP project"
}

variable "region" {
  description = "The GCP region"
}

variable "location" {
  description = "The GCP zone or location"
}

variable "cluster_name" {
  description = "The name of the GKE cluster"
}

variable "service_account" {
  description = "The service account for the GKE cluster"
}
