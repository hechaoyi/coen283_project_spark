object RunIdleTime {
  def main(args: Array[String]) {
    val spark = org.apache.spark.sql.SparkSession.builder
      .master("local[*]").appName("Idle Time").getOrCreate
    import spark.implicits._
    val data = spark.read.option("header", "true").csv("data")

    val clean = data.map(Trip.parse).filter(t => t.endTime > t.startTime)

	val sessions = clean.repartition($"bikeId").sortWithinPartitions($"bikeId", $"startTime")
	val idle = sessions.mapPartitions(trips => {
	  trips.sliding(2)
	    .filter { case a::b::Nil => a.bikeId == b.bikeId && a.endStationId == b.startStationId }
	    .map { case a::b::Nil => (a.endStationId, (b.startTime-a.endTime)/1000) }
	}).toDF("station", "seconds").createOrReplaceTempView("idle")

	/*spark sql """
select station,
  percentile_approx(seconds,0.01) p1,
  percentile_approx(seconds,0.02) p2,
  percentile_approx(seconds,0.03) p3, -- ^_^
  percentile_approx(seconds,0.04) p4,
  percentile_approx(seconds,0.05) p5,
  percentile_approx(seconds,0.06) p6,
  percentile_approx(seconds,0.07) p7,
  percentile_approx(seconds,0.08) p8,
  percentile_approx(seconds,0.09) p9,
  percentile_approx(seconds,0.1) p10
from idle group by station
"""*/

	spark.sql("select station, percentile_approx(seconds,0.03) p3 from idle group by station").show

    spark.stop
  }
}