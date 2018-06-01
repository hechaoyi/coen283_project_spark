## Data Source: [Ford GoBike - System Data](https://www.fordgobike.com/system-data)


```bash
cd idle_time
mvn package
spark-submit --executor-memory 4G --class RunIdleTime target/spark-idle-time-1.0-SNAPSHOT-jar-with-dependencies.jar
```
