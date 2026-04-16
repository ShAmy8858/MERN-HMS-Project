pipeline {
    agent any

    stages {
        stage('Clone Repository') {
            steps {
                echo 'Fetching latest code from GitHub...'
                git branch: 'main', url: 'https://github.com/ShAmy8858/MERN-HMS-Project.git'
            }
        }

        stage('Build & Deploy with Docker') {
            steps {
                echo 'Stopping any existing CI containers...'
                sh 'docker-compose -f docker-compose.dev.yml down || true'
                echo 'Starting containerized build with volume-mounted code...'
                sh 'docker-compose -f docker-compose.dev.yml up -d'
            }
        }
    }

    post {
        success {
            echo 'Pipeline successful! App is live on port 3000.'
        }
        failure {
            echo 'Pipeline failed. Check the logs above.'
        }
    }
}
