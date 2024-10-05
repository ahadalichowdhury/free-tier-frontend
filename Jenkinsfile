pipeline {
	agent any
    tools {
        nodejs 'node20'
    }
    environment {
	    APP_NAME = "three-tier-frontend"
            RELEASE = "latest"
            DOCKER_USER = "ahadalichowdhury"
            DOCKER_PASS = 'dockerhub'
            IMAGE_NAME = "${DOCKER_USER}" + "/" + "${APP_NAME}"
            IMAGE_TAG = "${RELEASE}-${BUILD_NUMBER}"
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
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
            docker.withRegistry('', DOCKER_PASS) {
                docker_image = docker.build "${IMAGE_NAME}"
            }

            docker.withRegistry('', DOCKER_PASS) {
                docker_image.push("${IMAGE_TAG}")
                docker_image.push('latest')
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
