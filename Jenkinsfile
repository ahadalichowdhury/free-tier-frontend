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
        stage("Checkout from SCM") {
            steps {
                git branch: 'main', credentialsId: 'github', url: 'https://github.com/ahadalichowdhury/free-tier-frontend'
            }
        }
    stage("SonarQube Analysis") {
    	steps {
        	script {
            		withSonarQubeEnv(credentialsId: 'sonarqube-token') {
                	// Run the sonar-scanner command with the necessary parameters
                	sh '''
               		 sonar-scanner \
                  		-Dsonar.projectKey=frontend \
                  		-Dsonar.sources=. \
                  		-Dsonar.host.url=http://52.3.250.166:9000 \
                 	        -Dsonar.login=squ_a216aba82380c8fad82bd9a1d425ce27ec09ffb6
                	'''
            		}
       		 }
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
                    withCredentials([usernamePassword(credentialsId: 'dockerhub', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                        sh '''
                        echo 'Logging into Docker Hub'
                        echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin
                        '''
                    }
                }
            }
        }

        stage('Push Docker Image to Docker Hub') {
            steps {
                script {
                    sh '''
                    echo 'Pushing to Docker Hub'
                    docker push ahadalichowdhury/three-tier-frontend:${BUILD_NUMBER}
                    '''
                }
            }
        }
        stage("Trivy Scan") {
           steps {
               script {
	            sh ('docker run -v /var/run/docker.sock:/var/run/docker.sock aquasec/trivy image ahadalichowdhury/three-tier-frontend:${BUILD_NUMBER} --no-progress --scanners vuln  --exit-code 0 --severity HIGH,CRITICAL --format table')
               }
           }
       }

        stage('Update Helm Chart and Push to GitHub') {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: 'github', usernameVariable: 'GITHUB_USER', passwordVariable: 'GITHUB_TOKEN')]) {
                        sh """
                            # Update tag in the Helm chart file
                            sed -i 's/tag: .*/tag: ${BUILD_ID}/' helm/react-app-charts/values.yaml
                            
                            # Configure Git with user information
                            git config user.email "smahadalichowdhury@gmail.com"
                            git config user.name "ahadalichowdhury"
                            
                            # Add and commit the changes
                            git add helm/react-app-charts/values.yaml
                            git commit -m "Update tag in Helm chart"
                            
                            # Push to the GitHub repository using the Personal Access Token (PAT)
                            git push https://${GITHUB_USER}:${GITHUB_TOKEN}@github.com/ahadalichowdhury/free-tier-frontend.git main
                        """
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
