$.getJSON("data/station_share_count.json", function (data) {
  $.getJSON("data/geoCoordmap.json", function (geoCoordMap) {
    map(data, geoCoordMap)
  });
});

var timeSharCount,usertypeCount
$.getJSON("data/time_share_count.json", function (data) {
  timeSharCount = data.sort(function(a,b) {
    if (a.startHour < b.startHour)
      return -1;
    else if (a.startHour > b.startHour)
      return 1;
    else
      return 0
  }).map(x => x.count)
});

$.getJSON("data/usertype_count.json", function (data) {
  usertypeCount = data
});

function map(stationInfo, geoCoordMap) {
  var dom = document.getElementById("container");
  var myChart = echarts.init(dom);
  var app = {};
  option = null;
  var convertData = function (data) {
    var res = [];
    for (var i = 0; i < data.length; i++) {
      var geoCoord = geoCoordMap[data[i].name];
      if (geoCoord) {
        res.push({
          name: data[i].name,
          value: geoCoord.concat(data[i].value)
        });
      }
    }
    return res;
  };

  option = {
    title: {
      text: 'Bay Area Bike Share Data',
      left: 'center'
    },
    tooltip: {
      trigger: 'item'
    },
    bmap: {
      center: [-122.3942, 37.79539],
      zoom: 14,
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
        data: convertData(stationInfo),
        symbolSize: function (val) {
          return val[2] / 1000;
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
        itemStyle: {
          normal: {
            color: '#FFC133'
          }
        }
      },
      {
        name: 'Top 5',
        type: 'effectScatter',
        coordinateSystem: 'bmap',
        data: convertData(stationInfo.sort(function (a, b) {
          return b.value - a.value;
        }).slice(0, 6)),
        symbolSize: function (val) {
          return val[2] / 1000;
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
        itemStyle: {
          normal: {
            color: '#FF9033',
            shadowBlur: 10,
            shadowColor: '#333'
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
      barChart(timeSharCount);
      pieChart(usertypeCount)
      $('#detailModal').modal('show')
    }
  });
}