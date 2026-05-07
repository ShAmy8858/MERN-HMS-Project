pipeline {
    agent any

    environment {
        APP_URL = "http://3.121.29.68:3000"
        DOCKER_IMAGE_TEST = "selenium-test-runner"
    }

    stages {
        stage('Clone Repository') {
            steps {
                echo 'Fetching latest code from GitHub...'
                git branch: 'main', url: 'https://github.com/ShAmy8858/MERN-HMS-Project.git'
            }
        }

        stage('Build & Deploy App') {
            steps {
                echo 'Stopping any existing CI containers...'
                sh 'docker-compose -f docker-compose.dev.yml down || true'
                echo 'Starting containerized build with volume-mounted code...'
                sh 'docker-compose -f docker-compose.dev.yml up -d'
                echo 'Waiting for services to be ready...'
                sleep 10
            }
        }

        stage('Run Automated Tests') {
            steps {
                echo 'Building Test Docker Image...'
                sh 'docker build -t ${DOCKER_IMAGE_TEST} -f tests/Dockerfile.test tests/'
                
                echo 'Running Selenium Tests...'
                # Run test container on the same network to access the app
                sh "docker run --rm --network PulseCare-MERN-App_ci-network -e APP_URL=http://frontend-ci:3000 ${DOCKER_IMAGE_TEST}"
            }
        }
    }

    post {
        always {
            echo 'Archiving test results...'
            // In a real setup, we would copy report from container to host first
            // But for simplicity, we focus on the email notification
        }
        success {
            echo 'Pipeline successful! App is live and tests passed.'
            emailext (
                subject: "SUCCESS: Build #${env.BUILD_NUMBER} - ${env.JOB_NAME}",
                body: "Congratulations! The build and tests for ${env.JOB_NAME} #${env.BUILD_NUMBER} passed successfully.\n\nView results: ${env.BUILD_URL}",
                to: "qasimalik@gmail.com, shamy8858@gmail.com",
                from: "jenkins-ci@example.com"
            )
        }
        failure {
            echo 'Pipeline failed. Check the logs above.'
            emailext (
                subject: "FAILURE: Build #${env.BUILD_NUMBER} - ${env.JOB_NAME}",
                body: "Alert! The build or tests for ${env.JOB_NAME} #${env.BUILD_NUMBER} failed. Please investigate the logs.\n\nLogs: ${env.BUILD_URL}console",
                to: "qasimalik@gmail.com, shamy8858@gmail.com",
                from: "jenkins-ci@example.com"
            )
        }
    }
}
