pipeline {
    agent any

    tools {
        nodejs 'node20'  // Predefined Node.js tool installation
    }

    environment {
        APP_NAME = "three-tier-frontend"
        RELEASE = "latest"
        DOCKER_USER = "ahadalichowdhury"
        OCKER_PASS = 'dockerhub'
        IMAGE_NAME = "${DOCKER_USER}/${APP_NAME}"
        IMAGE_TAG = "${RELEASE}-${BUILD_NUMBER}"
    }



    stages {
        stage("Checkout from SCM"){
                steps {
                    git branch: 'main', credentialsId: 'github', url: 'https://github.com/ahadalichowdhury/free-tier-frontend'
                }
        }

        stage('Install Node.js Dependencies') {
            steps {
                script {
                    // Install Node.js dependencies
                    sh 'npm install'
                }
            }
        }

        stage("Build & Push Docker Image") {
            steps {
                script {
                    docker.withRegistry('',DOCKER_PASS) {
                        docker_image = docker.build "${IMAGE_NAME}"
                    }

                    docker.withRegistry('',DOCKER_PASS) {
                        docker_image.push("${IMAGE_TAG}")
                        docker_image.push('latest')
                    }
                }
            }

       }

    }

    post {
        always {
            cleanWs()
        }
    }
}
