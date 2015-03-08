This helps me to build projects and run specific task based on TAGS

Needs a .env file.

For example:

    REPO=git@github.com:rguiu/hashcode2014trial.git
    DIR=repo
    SOLUTIONS_DIR=solutions
    BUILD="mvn clean install"
    EXEC="java -jar target/2014trial-1.0-SNAPSHOT-jar-with-dependencies.jar"
    SOURCES="2014trial-1.0-SNAPSHOT-sources.jar"
    RESULT="solution.txt"
    TAG_PREFIX="TRIAL2014_"
    BUILD_DIR="target"
    SCORE="score.txt"


To use, we need Redis installed. Node, and npm.

Run: 

    npm install
    
And to start:

    nf start
