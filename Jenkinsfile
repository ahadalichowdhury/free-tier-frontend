pipeline {
    agent any

    tools {
        nodejs 'node20'  // Predefined Node.js tool installation
    }

    environment {
        APP_NAME = "three-tier-frontend"
        RELEASE = "latest"
        DOCKER_USER = "ahadalichowdhury"
        DOCKER_PASS = credentials('dockerhub')
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

        stage('Build Docker'){
            steps{
                script{
                    sh '''
                    echo 'Buid Docker Image'
                    docker build -t ahadalichowdhury/three-tier-frontend:${BUILD_NUMBER} .
                    '''
                }
            }
        }

        stage('Push the artifacts'){
           steps{
                script{
                    sh '''
                    echo 'Push to Repo'
                    docker push ahadalichowdhury/three-tier-frontend:${BUILD_NUMBER}
                    '''
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
