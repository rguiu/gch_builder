This helps me to build projects and run specific task based on TAGS

Needs a .env file.

For example:

    REPO=git@bitbucket.org:rguiu/???????.git
    DIR=repo3
    SOLUTIONS_DIR=solutions
    BUILD="mvn clean install"
    EXEC="java -jar target/2014trial-1.0-SNAPSHOT-jar-with-dependencies.jar"
    SOURCES="target/2014trial-1.0-SNAPSHOT-sources.jar"
    RESULT="target/solution.txt"
    SCORE="target/score.txt"
    TAG_PREFIX="TRIAL2014_"

To use, we need Redis installed. Node, and npm.

Run: 

    npm install
    
And to start:

    nf start
