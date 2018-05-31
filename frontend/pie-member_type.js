function pieChart(data) {
    var dom = document.getElementById("pieChart");
    var myChart = echarts.init(dom);
    var app = {};
    option = null;
    option = {
        title: {
            text: 'Member Type',
            x: 'center'
        },
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        series: [{
            name: 'Member Type',
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%'],
            data: [{
                    value: _.find(usertypeCount, function(o) { return o.userType === "Subscriber"; }).count,
                    name: 'Subscriber',
                    itemStyle: {
                        color: '#064366'
                    }
                },
                {
                    value: _.find(usertypeCount, function(o) { return o.userType === "Customer"; }).count,
                    name: 'Customer',
                    itemStyle: {
                        color: '#5FADBE'
                    }
                }
            ],
            itemStyle: {
                emphasis: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            }
        }]
    };;
    if (option && typeof option === "object") {
        myChart.setOption(option, true);
    }
}