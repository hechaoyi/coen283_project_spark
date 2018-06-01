$.getJSON("data/stations.json", function (stationInfo) {
  map(stationInfo);
});

var detailInfoData;
$.getJSON("data/userType.json", function (data) {
  detailInfoData = data;
});

function map(stationInfo) {
  var dom = document.getElementById("container");
  var myChart = echarts.init(dom);
  var app = {};
  //  option = null;

  var option = {
    title: {
      text: 'Bay Area Bike Share Data',
      left: 'center'
    },
    tooltip: {
      trigger: 'item'
    },
    bmap: {
      center: [-122.34, 37.81],
      zoom: 13,
      roam: true,
      mapStyle: {
        styleJson: [{
          'featureType': 'water',
          'elementType': 'all',
          'stylers': {
            'color': '#C2DFFF'
          }
        }, {
          'featureType': 'land',
          'elementType': 'all',
          'stylers': {
            'color': '#f3f3f3'
          }
        }, {
          'featureType': 'railway',
          'elementType': 'all',
          'stylers': {
            'visibility': 'on'
          }
        }, {
          'featureType': 'highway',
          'elementType': 'all',
          'stylers': {
            'color': '#fdfdfd'
          }
        }, {
          'featureType': 'highway',
          'elementType': 'labels',
          'stylers': {
            'visibility': 'off'
          }
        }, {
          'featureType': 'arterial',
          'elementType': 'geometry',
          'stylers': {
            'color': '#fefefe'
          }
        }, {
          'featureType': 'arterial',
          'elementType': 'geometry.fill',
          'stylers': {
            'color': '#fefefe'
          }
        }, {
          'featureType': 'poi',
          'elementType': 'all',
          'stylers': {
            'visibility': 'off'
          }
        }, {
          'featureType': 'green',
          'elementType': 'all',
          'stylers': {
            'visibility': 'on'
          }
        }, {
          'featureType': 'subway',
          'elementType': 'all',
          'stylers': {
            'visibility': 'on'
          }
        }, {
          'featureType': 'manmade',
          'elementType': 'all',
          'stylers': {
            'color': '#d1d1d1'
          }
        }, {
          'featureType': 'local',
          'elementType': 'all',
          'stylers': {
            'color': '#d1d1d1'
          }
        }, {
          'featureType': 'arterial',
          'elementType': 'labels',
          'stylers': {
            'visibility': 'on'
          }
        }, {
          'featureType': 'boundary',
          'elementType': 'all',
          'stylers': {
            'color': '#fefefe'
          }
        }, {
          'featureType': 'building',
          'elementType': 'all',
          'stylers': {
            'color': '#d1d1d1'
          }
        }, {
          'featureType': 'label',
          'elementType': 'labels.text.fill',
          'stylers': {
            'color': '#999999',
            'visibility': 'on'
          }
        }]
      }
    },
    series: [{
        name: 'count',
        type: 'scatter',
        coordinateSystem: 'bmap',
        data: stationInfo.sort(function (a, b) {
          return a.value[2] - b.value[2];
        }).slice(5),
        symbolSize: function (val) {
          return 2500.0 / val[2];
        },
        label: {
          normal: {
            formatter: '{b}',
            position: 'right',
            show: false
          },
          emphasis: {
            show: true
          }
        },
        tooltip: {
          formatter: function (params) {
            return params.name + ": " + params.value[2];
          }
        },
        itemStyle: {
          normal: {
            color: '#FF9033'
          }
        }
      },
      {
        name: 'Top 5',
        type: 'effectScatter',
        coordinateSystem: 'bmap',
        data: stationInfo.sort(function (a, b) {
          return a.value[2] - b.value[2];
        }).slice(0, 5),
        symbolSize: function (val) {
          return 1500.0 / val[2];
        },
        showEffectOn: 'render',
        rippleEffect: {
          brushType: 'stroke'
        },
        hoverAnimation: true,
        label: {
          normal: {
            formatter: '{b}',
            position: 'right',
            show: true
          }
        },
        tooltip: {
          formatter: function (params) {
            return params.name + ": " + params.value[2];
          }
        },
        itemStyle: {
          normal: {
            color: '#FF6033'
          }
        },
        zlevel: 1
      }
    ]
  };;
  if (option && typeof option === "object") {
    myChart.setOption(option, true);
  }

  myChart.on('click', function (params) {
    if (params.seriesType === 'effectScatter') {
      barChart(_.range(24).map(function(hour) {
        var value = _.find(params.data.periods, function(o) { return o[0] == hour }) || [hour, 0];
        return 60.0 / value[1];
    }));;
      pieChart(detailInfoData[params.data.name].userTypeCount)
      $('#detailModal').modal('show')
    }
  });
}