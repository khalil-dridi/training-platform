pipeline {

    agent any

    stages {

        stage('Checkout') {
            steps {
                echo 'Getting source code...'
                checkout scm
            }
        }


        stage('Build Backend - Spring Boot') {
            steps {
                echo 'Building Spring Boot backend...'

                dir('backend/training-platform') {
                    sh 'mvn clean package -DskipTests'
                }
            }
        }


        stage('Build Frontend - Angular') {
            steps {
                echo 'Building Angular frontend...'

                dir('frontend/training-platform-ui') {
                    sh '''
                    npm install
                    npm run build -- --configuration production
                    '''
                }
            }
        }


        stage('Test MLA - Python') {
            steps {
                echo 'Checking MLA service...'

                dir('mla') {
    sh '''
    python3 -m venv venv
    ./venv/bin/pip install -r requirements.txt
    ./venv/bin/python -m compileall src
    '''
}
            }
        }


        stage('Docker Build') {
            steps {
                echo 'Building Docker images...'

                sh '''
                docker build -t training-platform-backend:ci backend/training-platform
                docker build -t training-platform-frontend:ci frontend/training-platform-ui
                docker build -t training-platform-mla:ci mla
                '''
            }
        }
    }


    post {

        success {
            echo 'CI Pipeline completed successfully!'
        }

        failure {
            echo 'CI Pipeline failed!'
        }
    }
}