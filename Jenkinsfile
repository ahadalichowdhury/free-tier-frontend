pipeline {
    agent any

    tools {
        nodejs 'node20'  // Predefined Node.js tool installation
    }

    environment {
        APP_NAME = "three-tier-frontend"
        RELEASE = "latest"
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

        stage('Build Docker') {
            steps {
                script {
                    sh '''
                    echo 'Building Docker Image'
                    docker build -t ahadalichowdhury/three-tier-frontend:${BUILD_NUMBER} .
                    '''
                }
            }
        }

        stage('Login to Docker Hub') {
            steps {
                script {
                    sh '''
                    echo 'Logging into Docker Hub'
                    echo ${DOCKER_CREDENTIALS_PSW} | docker login -u ${DOCKER_CREDENTIALS_USR} --password-stdin
                    '''
                }
            }
        }

        stage('Push the artifacts') {
            steps {
                script {
                    sh '''
                    echo 'Pushing to Repo'
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
