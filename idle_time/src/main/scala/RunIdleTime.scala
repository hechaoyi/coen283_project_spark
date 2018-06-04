object RunIdleTime {
  def main(args: Array[String]) {
    val master = if (args.length > 0) args(0) else "local[*]"
    // val master = "spark://hechy-macbook:7077"
    val spark = org.apache.spark.sql.SparkSession.builder
      .master(master).appName("Idle Time").getOrCreate
    import spark.implicits._
    val data = spark.read.option("header", "true").csv("data")

    val clean = data.map(Trip.parse).filter(t => t.endTime > t.startTime).cache

    val popular = clean.flatMap(trip => Array(
      (trip.startStationId, trip.startHour),
      (trip.endStationId, trip.endHour)
    )).toDF("station", "period").cache

    val stationPopular = popular.groupBy("station").count  // 298
    val stationPeriodPopular = popular.groupBy("station", "period").count.
      groupByKey(row => row.getInt(0)).mapGroups {
        case (station, rows) => (station, rows.map(row => Seq(row.getInt(1), row.getLong(2).toInt)).toSeq.sortBy(_(0)))
      }.toDF("station", "periods")
    val stationPopularJoined = stationPopular.join(stationPeriodPopular,
      stationPopular.col("station") === stationPeriodPopular.col("station"))

    val sessions = clean.repartition($"bikeId").sortWithinPartitions($"bikeId", $"startTime")
    val idle = sessions.mapPartitions(trips => {
      trips.sliding(2)
        .filter { case a::b::Nil =>
          a.bikeId == b.bikeId && a.endStationId == b.startStationId }
        .map { case a::b::Nil => (a.endStationId, a.endHour, ((b.startTime-a.endTime)/1000).toInt) }
    }).toDF("station", "period", "seconds").cache
    idle.createOrReplaceTempView("idle")

/*
    spark sql """
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
"""
    spark sql """
select period,
  percentile_approx(seconds,0.1) p10
from idle group by period
"""
*/

    val stationIdle = spark.sql(
      "select station, percentile_approx(seconds,0.03) p3 from idle group by station")  // 298
    val stationPeriodIdle = spark.sql(
      "select station, period, percentile_approx(seconds,0.03) p3 from idle group by station, period").
      groupByKey(row => row.getInt(0)).mapGroups {
        case (station, rows) => (station, rows.map(row => Seq(row.getInt(1), row.getInt(2))).toSeq.sortBy(_(0)))
      }.toDF("station", "periods")
    val stationIdleJoined = stationIdle.join(stationPeriodIdle,
      stationIdle.col("station") === stationPeriodIdle.col("station"))

    val stationInfo = data.select(
      $"start_station_id" as "id",
      $"start_station_name" as "name",
      $"start_station_latitude" as "lat",
      $"start_station_longitude" as "long").distinct.union(
      data.select("end_station_id", "end_station_name",
        "end_station_latitude", "end_station_longitude").distinct
    ).distinct.filter("name not like '%Coming Soon'").cache  // 298

    val result1 = stationIdleJoined.join(stationInfo, stationIdle.col("station") === stationInfo.col("id"))
    val json1 = result1.map(row =>
      (row.getAs[String]("name"), Seq(
        row.getAs[String]("long").toDouble,
        row.getAs[String]("lat").toDouble,
        row.getAs[Int]("p3")), row.getAs[Seq[Seq[Int]]]("periods"))
    ).toDF("name", "value", "periods")
    json1.coalesce(1).write.json("out1")

    val result2 = stationPopularJoined.join(stationInfo, stationPopular.col("station") === stationInfo.col("id"))
    val json2 = result2.map(row =>
      (row.getAs[String]("name"), Seq(
        row.getAs[String]("long").toDouble,
        row.getAs[String]("lat").toDouble,
        row.getAs[Long]("count")), row.getAs[Seq[Seq[Int]]]("periods"))
    ).toDF("name", "value", "periods")
    json2.coalesce(1).write.json("out2")

    spark.stop
  }
}
