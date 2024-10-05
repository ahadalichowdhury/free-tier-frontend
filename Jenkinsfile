pipeline {
    agent any
    
    tools {
        nodejs 'node20'
    }
    
    environment {
        APP_NAME = "three-tier-frontend"
        RELEASE = "latest"
        DOCKER_USER = "ahadalichowdhury"
        // DOCKER_PASS = credentials('dockerhub')
        IMAGE_NAME = "${DOCKER_USER}/${APP_NAME}"
        IMAGE_TAG = "${RELEASE}-${BUILD_NUMBER}"
    }
    
    stages {
        stage('Checkout') {
            steps {
                // Checkout the code from version control
                git 'https://github.com/ahadalichowdhury/free-tier-frontend'
            }
        }

        stage('Build') {
            steps {
                sh 'npm install'
                sh 'npm run build'
            }
        }

        stage("Build & Push Docker Image") {
            steps {
                script {
                    // Build the Docker image
                    sh "docker build -t ${IMAGE_NAME}:${IMAGE_TAG} ."

                    // Use credentials to login and push the image
                    withCredentials([usernamePassword(credentialsId: 'dockerhub', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                        // Login to DockerHub
                        sh "echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin"

                        // Push the Docker image
                        sh "docker push ${IMAGE_NAME}:${IMAGE_TAG}"
                    }

                    // Clean up local image to save space
                    sh "docker rmi ${IMAGE_NAME}:${IMAGE_TAG}"
                }
            }
        }
    }

    post {
        success {
            echo "Build and Docker push completed successfully."
        }
        failure {
            mail to: 'smahadalichowdhury@gmail.com',
                 subject: "Build Failed: ${currentBuild.fullDisplayName}",
                 body: "Check Jenkins build log at ${env.BUILD_URL}"
        }
    }
}
