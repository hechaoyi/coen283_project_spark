function barChart(data) {
    var chart = echarts.init(document.getElementById("barChart"));
    var option = {
        title: {
            text: 'Busy Time by Hour',
            x: 'center'
        },
        xAxis: {
            type: 'category',
            data: [
                '00:00', '01:00', '02:00', '03:00', '04:00', '05:00',
                '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
                '12:00', '13:00', '14:00', '15:00', '16:00', '17:00',
                '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'
            ]
        },
        yAxis: {
            type: 'value',
            axisLabel: {
                show: false
            }
        },
        series: [{
            data: data,
            type: 'bar',
            itemStyle: {
                color: '#13B287'
            }
        }]
    };
    chart.setOption(option);
}

// function barChart(data) {
//     var dom = document.getElementById("barChart");
//     var myChart = echarts.init(dom);
//     var app = {};
//     option = null;
//     option = {
//         title: {
//             text: 'Share Count by Hour',
//             x: 'center'
//         },
//         xAxis: {
//             type: 'category',
//             data: [
//                 '06:00', '07:00', '08:00', '09:00', '10:00',
//                 '11:00', '12:00', '13:00', '14:00', '15:00',
//                 '16:00', '17:00', '18:00', '19:00', '20:00', 
//                 '21:00'
//             ]
//         },
//         yAxis: {
//             type: 'value'
//         },
//         series: [{
//             data: [
//                 data['06:00'], data['07:00'], data['08:00'], data['09:00'], data['10:00'],
//                 data['11:00'], data['12:00'], data['13:00'], data['14:00'], data['15:00'],
//                 data['16:00'], data['17:00'], data['19:00'], data['20:00'], data['21:00']
//             ],
//             type: 'bar',
//             itemStyle: {
//                 color: '#13B287'
//             }
//         }]
//     };;
//     if (option && typeof option === "object") {
//         myChart.setOption(option, true);
//     }
// }