function barChart(data) {
    var dom = document.getElementById("barChart");
    var myChart = echarts.init(dom);
    var app = {};
    option = null;
    option = {
        title: {
            text: 'Share Count by Hour',
            x: 'center'
        },
        xAxis: {
            type: 'category',
            data: ['06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00',
                '18:00', '19:00', '20:00', '21:00'
            ]
        },
        yAxis: {
            type: 'value'
        },
        series: [{
            data: data,
            type: 'bar',
            itemStyle: {
                color: '#13B287'
            }
        }]
    };;
    if (option && typeof option === "object") {
        myChart.setOption(option, true);
    }
}