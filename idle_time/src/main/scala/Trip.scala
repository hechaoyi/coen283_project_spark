case class Trip(
  startTime: Long,
  endTime: Long,
  startStationId: Int,
  endStationId: Int,
  bikeId: Int)

object Trip {
  def parse(row: org.apache.spark.sql.Row) = {
    def get(field: String) = Option(row.getAs[String](field))
    val formatter = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss")
    Trip(
      get("start_time").map(formatter.parse(_).getTime).get,
      get("end_time").map(formatter.parse(_).getTime).get,
      get("start_station_id").map(_.toInt).get,
      get("end_station_id").map(_.toInt).get,
      get("bike_id").map(_.toInt).get
    )
  }
}