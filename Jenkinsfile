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

        stage('Docker Build and Push') {
            steps {
                script {
                    // Docker login and build/push commands
                    sh '''
                        echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin
                        docker build -t $IMAGE_NAME:$IMAGE_TAG .
                        docker push $IMAGE_NAME:$IMAGE_TAG
                    '''
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
