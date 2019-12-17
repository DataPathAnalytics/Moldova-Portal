var createLineChart = function (data, parentWidth) {

    if ($(window).width() < 768) {
        var height = 200;
    }
    else {
        var height = 300;
    }

    //fix for error on lineChart with single data
    if(data.length == 1){
        data.push(data[0]) ;
    }

    var divNode = d3.select("#main-content").node(),
        width = parentWidth;
    var svg = d3.select("#linechart-homepage")
        .append("svg")
        .attr("width", width + 1)
        .attr("height", height)
        .attr("id", "visualization");
    var vis = d3.select("#visualization"),
        margin = {
            top: 20, right: 20, bottom: 20, left: 50
        };

    var xScale = d3.scale.ordinal().rangeRoundBands([0, width - 50], 0);
    var yScale = d3.scale.linear()
        .range([height - margin.top, margin.bottom]);

    var xAxis = d3.svg.axis()
        .orient("bottom")
        .scale(xScale)
        .ticks(2);
    var yAxis = d3.svg.axis()
        .orient("left")
        .scale(yScale)
        .ticks(6);

    //function make_x_axis(){
    //    return d3.svg.axis()
    //            .scale(xScale)
    //            .orient("bottom")
    //            .ticks(5)
    //}
    function make_y_axis() {
        return d3.svg.axis()
            .scale(yScale)
            .orient("left")
            .ticks(5)
    }

    data.forEach(function (d) {
        d.xValue = d.xValue;
        d.chart1 = +d.chart1;
        d.chart2 = +d.chart2;
    });
    var maxValue = d3.max(data, function (d) {
        return (d.chart1 > d.chart2) ? d.chart1 : d.chart2;
    });

    xScale.domain(data.map(function (d) {
        return d.xValue;
    }));
    yScale.domain([0, maxValue]);


    vis.append("svg:g")
        .attr("class", "axis")
        .attr("transform", "translate(" + (margin.left) + "," + (height - margin.bottom) + ")")
        .call(xAxis);

    // vis.append("svg:g")
    // 	.attr("class","grid")
    // 	.attr("transform", "translate(" + (margin.left) + "," + (height - margin.bottom)+ ")")
    // 	.call(make_x_axis()
    // 			.tickSize(-height+margin.top, 0 ,0 )
    // 			.tickFormat("")
    // 		)
    vis.append("svg:g")
        .attr("class", "axis")
        .attr("transform", "translate(" + margin.left + ",0)")
        .call(yAxis);

    vis.append("svg:g")
        .attr("class", "grid")
        .attr("transform", "translate(" + margin.left + ",0)")
        .call(make_y_axis()
            .tickSize(-width, 0, 0)
            .tickFormat("")
        )

    var lineGen1 = d3.svg.line()
        .x(function (d) {
            return xScale(d.xValue);
        })
        .y(function (d) {
            return yScale(d.chart1);
        });
    // .interpolate("basis");
    var linePath1 = vis.append('svg:path')
        .attr('d', lineGen1(data))
        .attr("transform", "translate(" + (((xScale(data[0].xValue) + xScale(data[1].xValue)) / 2) + margin.left) + ",0)")
        .attr("stroke", "#B8E986")
        .attr("stroke-width", 2)
        .attr("fill", "none");

    var totalLength1 = linePath1.node().getTotalLength();

    linePath1
        .attr("stroke-dasharray", totalLength1 + " " + totalLength1)
        .attr("stroke-dashoffset", totalLength1)
        .transition()
        .duration(1000)
        .ease("linear")
        .attr("stroke-dashoffset", 0);

    var lineGen2 = d3.svg.line()
        .x(function (d) {
            return xScale(d.xValue);
        })
        .y(function (d) {
            return yScale(d.chart2);
        });

    var linePath2 = vis.append('svg:path')
        .attr('d', lineGen2(data))
        .attr("transform", "translate(" + (((xScale(data[0].xValue) + xScale(data[1].xValue)) / 2) + margin.left) + ",0)")
        .attr("stroke", "#50E3C2")
        .attr("stroke-width", 2)
        .attr("fill", "none");

    var totalLength2 = linePath2.node().getTotalLength();

    linePath2
        .attr("stroke-dasharray", totalLength2 + " " + totalLength2)
        .attr("stroke-dashoffset", totalLength2)
        .transition()
        .duration(1000)
        .ease("linear")
        .attr("stroke-dashoffset", 0);

    vis.selectAll("dot")
        .data(data)
        .enter()
        .append("circle")
        .filter(function (d) {
            return d.chart1;
        })
        .attr("r", 4)
        .attr("fill", "#B8E986")
        .attr("cx", function (d) {
            return xScale(d.xValue) + (((xScale(data[0].xValue) + xScale(data[1].xValue)) / 2) + margin.left);
        })
        .attr("cy", function (d) {
            return yScale(d.chart1);
        })
        .on("mouseover", function (d) {
            var mousePos = d3.mouse(divNode);
            d3.select("#tooltip-wrap")
                .style("left", mousePos[0] + "px")
                .style("top", mousePos[1] + "px")
                .select("#value")
                .attr("text-anchor", "middle")
                .html(d.chart1);

            d3.select("#tooltip-wrap").classed("hide", false);
        })
        .on("mouseout", function (d) {
            d3.select("#tooltip-wrap").classed("hide", true);
        });

    vis.selectAll("dot")
        .data(data)
        .enter()
        .append("circle")
        .filter(function (d) {
            return d.chart2;
        })
        .attr("r", 4)
        .attr("fill", "#50E3C2")
        .attr("cx", function (d) {
            return xScale(d.xValue) + (((xScale(data[0].xValue) + xScale(data[1].xValue)) / 2) + margin.left);
        })
        .attr("cy", function (d) {
            return yScale(d.chart2);
        })
        .on("mouseover", function (d) {
            var mousePos = d3.mouse(divNode);
            d3.select("#tooltip-wrap")
                .style("left", mousePos[0] + "px")
                .style("top", mousePos[1] + "px")
                .select("#value")
                .attr("text-anchor", "middle")
                .html(d.chart2);

            d3.select("#tooltip-wrap").classed("hide", false);
        })
        .on("mouseout", function (d) {
            d3.select("#tooltip-wrap").classed("hide", true);
        });

};

var createStackBarChart = function(data, parentWidth){
  console.log('-=data=-', data)
  var chartColors = ['#447314', '#71a839', '#B8E986', '#078266', '#16ab89', '#50E3C2'];
  if ($(window).width() < 768) {
    var height = 200;
  }
  else {
    var height = 300;
  }

  //fix for error on lineChart with single data
  // if(data.length == 1){
  //   data.push(data[0]) ;
  // }

  var
    //prepare initial stuff
    margin = {top: 20, right: 20, bottom: 80, left: 20},
    chart = d3.select('#linechart-homepage'),
    width = +chart.style('width').replace('px', '') - margin.left - margin.right,
    // height = +chart.style('height').replace('px', '') - margin.top - margin.bottom,
    svg = chart
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')'),
    /* stripedPattern = (function(){
      for(var i = 0, ii = data.length; i<ii; i++){
        //implement checker: check for real month
        if(data[i].month==='february'){
          return {monthName: 'february'};
        }
      }
    })(), */

    //d3 scale stuff
    x0 = d3.scale.ordinal().rangeRoundBands([0, width], 0.1),
    x1 = d3.scale.ordinal(),
    y = d3.scale.linear().range([height, 0]),
    yBegin,

    //fetch the column headers
    itemLookup= data[0],
    years = d3.keys(itemLookup.data),
    items = d3.keys(itemLookup.data[years[0]]),
    columnHeaders = [],
    innerColumns = (function(){
      var result = {};
      for(var i = 0, ii = years.length; i<ii; i++){
        var holder = [];
        for(var j = 0, jj = items.length; j<jj; j++){
          columnHeaders.push(items[j]+'-'+years[i]);
          holder.push(items[j]+'-'+years[i]);
          result[years[i]] = holder;
        }
      }
      return result;
    })(),

    //holder for the data obj rebuild
    dataRebuild = [];
var maxValue = 0
  data.forEach(function(d, i){
    var tempData = {},
      curYear;
    tempData.monthName = d.year;
    /* if(d.month === stripedPattern.monthName){
      chart
        .select('svg')
        .append('defs');
    } */
    for(var key in d.data){
      if(curYear != key){
        curYear = key;
        tempData['totalValue-'+curYear] = 0;
      }
      var holder = d.data[key];
      for(var item in holder){
        var holderItem = parseInt(holder[item]);
        tempData[item+'-'+key] = holder[item];
        tempData['totalValue-'+curYear] += holderItem;
        if(maxValue < tempData['totalValue-'+curYear] ) {
          maxValue = tempData['totalValue-'+curYear];
        }
      }
    }
    dataRebuild.splice(i, 0, tempData);
  });

//refactor needed
  dataRebuild.forEach(function(d) {
    var yColumn = new Array();
    d.columnDetails = columnHeaders.map(function(name) {
      for (var ic in innerColumns) {
        if($.inArray(name, innerColumns[ic]) >= 0){
          if (!yColumn[ic]){
            yColumn[ic] = 0;
          }
          yBegin = yColumn[ic];
          yColumn[ic] += +d[name];
          return {
            name: (function(){
              var n = name.indexOf('-');
              return name.substring(0, n != -1 ? n : name.length);
            })(),
            value: +d[name],
            year: ic,
            yBegin: yBegin,
            yEnd: +d[name] + yBegin,
            monthName: d.monthName
          };
        }
      }
    });

    d.total = d3.max(d.columnDetails, function(d) {
      return d.yEnd;
    });

  });

//get month names
  x0.domain(dataRebuild.map(function(d) { return d.monthName; }));
//get something
  x1.domain(d3.keys(innerColumns)).rangeRoundBands([0, x0.rangeBand()],.01,0);
//set y domain, get totals
  y.domain([0, d3.max(dataRebuild, function(d) {
    return d.total;
  })]);

  var yScale = d3.scale.linear()
    .range([height, 0])
    .domain([0,70000]);
  var xScale = d3.scale.ordinal().rangeRoundBands([0, width - 30], 0)
    .domain(dataRebuild.map(function(d) { return d.monthName; }));

  var yAxis = d3.svg.axis()
    .orient("left")
    .scale(yScale)
    .ticks(6);

  var xAxis = d3.svg.axis()
    .orient("bottom")
    .scale(xScale)
    .ticks(2);

  svg.append("svg:g")
    .attr("class", "axis")
    .attr("transform", "translate(" + (margin.left + 10) + "," + height + ")")
    .call(xAxis);

  svg.append("svg:g")
    .attr("class", "axis")
    // .attr("transform", "translate(" + 20 + "," + 0 + ")")
    .attr("transform", "translate(" + (margin.left + 10) + ",0)")
    .call(yAxis);

  var stackedBars = svg.selectAll(".stackedBars")
    .data(dataRebuild)
    .enter().append('g')
    .attr({
      //styling
      'class': function(d){ return 'month-col '+d.monthName; },
      'transform': function(d){ return "translate(" + x0(d.monthName) + ",0)"; }
    });

  var bars = stackedBars.selectAll("rect")
    .data(function(d) { return d.columnDetails; });

  var counter = 1;
  bars
    .enter().append("rect")
    .attr({
      //coords
      'x': function(d, i){
        if(i === 0) {
          ++counter;
        }

        return (x1(d.year) + 33) - ((counter * 2) + 2);
      },
      'y': height,

      //style
      // 'width': Math.min(x1.rangeBand()-8, 100),
      'width': x1.rangeBand()-8,
      // 'width': function(d,i){
      //   console.log('-=ddd=-', d);
      //   return x1.rangeBand()-8;
      // },
      'height': 0,
      'fill': function(d,i){
        return chartColors[i];
      },
      'class': 'item',
      'style': function(d,i){
        return 'fill: ' + chartColors[i];
      },

      //data entry
      'data-name': function(d){ return d.name; },
      'data-value': function(d){ return d.value; },
      'data-year': function(d){return d.year;},
      'data-category': function(d){return d.monthName;}
    });

  bars
    .transition()
    .duration(1000)
    .attr({
      //coords
      'y': function(d){ return y(d.yEnd)},

      //style
      'height': function(d) {
        var barHeight = y(d.yBegin) - y(d.yEnd) - 1

        return barHeight > 0 ? barHeight : 0;
      }
    });

//legend items
  svg.selectAll(".month-col")
    .data(dataRebuild)
    .append('g')
    .attr({
      'class': 'legend-item',

      'text-anchor': 'middle',
      'transform': function(){
        return 'translate('+svg.select('.item').attr('width')+','+parseInt(height+margin.top)+')';
      }
    })
    // .append('text')
    // .text(function(d){ return d.monthName; });

//totals
  svg.selectAll(".month-col")
    .data(dataRebuild)
    .append('g')
    .attr({
      'class': 'test'
    });

//events
  var tooltip = d3.select('body')
    .append('div')
    .attr('class','stacked-bar-chart-tooltip stacked-bar-chart-tooltip-hidden');

  var
    mouseEventMove = function () {
      var item = d3.select(this);
      return tooltip
        .style({
          'top': (d3.event.pageY) - 10 + 'px',
          'right': (window.innerWidth - d3.event.pageX) + 10 + 'px',

          'border-color': item.attr('fill')
        })
        .classed('stacked-bar-chart-tooltip-hidden', false)
        // .html(item.attr('data-name')+'('+item.attr('data-year')+'): '+item.attr('data-value'));
        .html(item.attr('data-year') + ' source: </br>' + item.attr('data-name') + ': '+ item.attr('data-value'));
    },
    mouseEventOut = function (){
      return tooltip.classed('stacked-bar-chart-tooltip-hidden', true);
    };

  svg.selectAll('.item')
    .on('mousemove', mouseEventMove)
    .on('mouseout', mouseEventOut);

}


// Calling the function that creates the linechart
//createLineChart(data);

var createLineChartRest = function(data,widthParent){
    if($(window).width() < 768){
        var height1 = 200;
    }
    else {
        var height1 = 300;
    }
    var divNode = d3.select("#main-content").node();
    var width1 = widthParent;
    var svg = d3.select("#linechart-rest")
                .append("svg")
                .attr("width", width1 + 1)
                .attr("height", height1)
                .attr("id", "visualization");
    var vis = d3.select("#visualization"),
                margin = {
                    top: 20, right:20, bottom:20, left: 34
                };
    var xScale = d3.scale.ordinal().rangeRoundBands([0,width1-50], 0);
    var xDot = d3.scale.ordinal().rangeRoundBands([0, width1], 1.07);
    var yScale = d3.scale.linear()
                .range([height1 - margin.top, margin.bottom]);
    var xAxis = d3.svg.axis()
                    .orient("bottom")
                    .scale(xScale)
                    .ticks(2);
    var yAxis = d3.svg.axis()
                    .orient("left")
                    .scale(yScale)
                    .ticks(6);

    function make_x_axis(){
        return d3.svg.axis()
                .scale(xScale)
                .orient("bottom")
                .ticks(6)
    }
    function make_y_axis(){
        return d3.svg.axis()
                .scale(yScale)
                .orient("left")
                .ticks(6)
    }
        data.forEach(function (d){
            d.xValue = d.xValue;
            d.chart1 = +d.chart1;
            d.chart2= +d.chart2;
        });
        var maxValue = d3.max(data, function(d){
            return d.chart2; });
        xScale.domain(data.map(function (d) {return d.xValue; }));
        xDot.domain(data.map(function (d) {return d.xValue; }));
        yScale.domain([0,maxValue]);

        vis.append("svg:g")
            .attr("class","axis")
            .attr("transform", "translate(" + (margin.left) + "," + (height1 - margin.bottom)+ ")")
            .call(xAxis);

            // for the vertical grids
            // ==============================================================
         //vis.append("svg:g")
         //	.attr("class","grid")
         //	.attr("transform", "translate(" + (margin.left) + "," + (height1 - margin.bottom)+ ")")
         //	.call(make_x_axis()
         //			.tickSize(-height1, 0 ,0 )
         //			.tickFormat("")
         //		);
        // =====================================================================

        vis.append("svg:g")
            .attr("class","axis")
            .attr("transform", "translate(" + margin.left + ",0)")
            .call(yAxis);

        vis.append("svg:g")
            .attr("class","grid")
            .attr("transform", "translate(" + margin.left + ",0)")
            .call(make_y_axis()
                    .tickSize(-width1,0,0)
                    .tickFormat("")
                );

        var lineGen = d3.svg.line()
                    .x(function (d) {
                        return xScale(d.xValue);
                    })
                    .y(function (d) {
                        return yScale(d.chart2);
                    });
    if(data.length > 1){
        var linePath = vis.append('svg:path')
            .attr('d', lineGen(data))
            .attr("transform", "translate(" + (((xScale(data[0].xValue)+xScale(data[1].xValue))/2) + margin.left) + ",0)")
            .attr("stroke", "#B8E986")
            .attr("stroke-width", 2)
            .attr("fill", "none");

        var totalLength = linePath.node().getTotalLength();

        linePath
            .attr("stroke-dasharray", totalLength + " " + totalLength)
            .attr("stroke-dashoffset", totalLength)
            .transition()
            .duration(1000)
            .ease("linear")
            .attr("stroke-dashoffset", 0);

        vis.selectAll("dot")
            .data(data)
            .enter()
            .append("circle")
            .filter(function (d) {
                return d.chart2;
            })
            .attr("r", 4)
            .attr("fill", "#B8E986")
            .attr("cx", function (d){
                return xScale(d.xValue) + (((xScale(data[0].xValue)+xScale(data[1].xValue))/2) + margin.left);
            })
            .attr("cy", function (d){
                return yScale(d.chart2);
            })
            .on("mouseover", function(d){
                var mousePos = d3.mouse(divNode);
                d3.select("#tooltip-wrap")
                    .style("left",mousePos[0] + "px")
                    .style("top",mousePos[1] + "px")
                    .select("#value")
                    .attr("text-anchor","middle")
                    .html(d.chart2);

                d3.select("#tooltip-wrap").classed("hide", false);
            })
            .on("mouseout",function(d){
                d3.select("#tooltip-wrap").classed("hide", true);
            });
    }
    else if(data.length ===1){
        vis.selectAll("dot")
            .data(data)
            .enter()
            .append("circle")
            .filter(function (d) {
                return d.chart2;
            })
            .attr("r", 4)
            .attr("fill", "#B8E986")
            .attr("cx", function (d){
                return xDot(d.xValue);
            })
            .attr("cy", function (d){
                return yScale(d.chart2);
            })
            .on("mouseover", function(d){
                var mousePos = d3.mouse(divNode);
                d3.select("#tooltip-wrap")
                    .style("left",mousePos[0] + "px")
                    .style("top",mousePos[1] + "px")
                    .select("#value")
                    .attr("text-anchor","middle")
                    .html(d.chart2);

                d3.select("#tooltip-wrap").classed("hide", false);
            })
            .on("mouseout",function(d){
                d3.select("#tooltip-wrap").classed("hide", true);
            });
    }
    else{
        vis.selectAll("dot")
            .data(data)
            .enter()
            .append("circle")
            .filter(function (d) {
                return d.chart2;
            })
            .attr("r", 4)
            .attr("fill", "#B8E986")
            .attr("cx", function (d){
                return xDot(d.xValue);
            })
            .attr("cy", function (d){
                return yScale(d.chart2);
            })
            .on("mouseover", function(d){
                var mousePos = d3.mouse(divNode);
                d3.select("#tooltip-wrap")
                    .style("left",mousePos[0] + "px")
                    .style("top",mousePos[1] + "px")
                    .select("#value")
                    .attr("text-anchor","middle")
                    .html(d.chart2);

                d3.select("#tooltip-wrap").classed("hide", false);
            })
            .on("mouseout",function(d){
                d3.select("#tooltip-wrap").classed("hide", true);
            });
    }
};

var createBarChartProcuring = function (data, definedId, url, widthParent, type) {
    if($(window).width() < 768){
        var marginBottom = 12,
            barHeight = 37,
            y1 = 21;
    }
    else {

        var marginBottom = 20,
            barHeight = 55,
            y1 = 32;
    }

    console.log("test");
    //var divNode = d3.select("#main-content").node();

    var dataRange = d3.max(data, function (d) {
        return d.value;
    });
    var divId = "#" + definedId;
    var width = widthParent;
    var chart,
        height = barHeight * data.length;
    var x, y;
    var bodyNode = d3.select("#main").node();

    $(divId).html('');
    chart = d3.select(divId)
        .append("svg")
        .attr("class", "chart")
        .attr("width", width)
        .attr("height", height);

    x = d3.scale.linear()
        .domain([0, dataRange])
        .range([0, width - 151]);
    y = d3.scale.ordinal()
        .rangeBands([0, height]);

    chart.selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", 170)
        .attr("y", function (d, i) {
            return i * (height / data.length);
        })
        .attr("class", function(d){
            if(d.name !== null) {
                return "name";
            }
        })
        .attr("height", barHeight - marginBottom)
        .on("click", function (d) {
            if(d.name !== null) {
                return window.location.assign(window.location.origin + "/" + url + "/" + d.name);
            }
        })
        .attr("width",0)
        .transition()
        .duration(900)
        .ease("linear")
        .attr("width", function (d) {
            return x(d.value);
        })
        .attr("x",170);

    chart.selectAll("text.value")
        .data(data)
        .enter()
        .append("text")
        .text(function (d) {
            if(type === 'amount') {
                return d3.format(",")(Math.round(d.value)) + ' MDL';
            }else{
                return d3.format(",")(Math.round(d.value));
            }
        })
        .attr("y", function (d, i) {
            return i * (height / data.length);
        })
        .attr("dx", 173)
        .attr("dy", barHeight - y1)
        .attr("class","value")
        .on("click", function (d) {
            if(d.name !== null) {
                return window.location.assign(window.location.origin + "/" + url + "/" + d.name);
            }
        })
        .attr("id", function (d, i) {
            return d.name;
        });
    chart.selectAll("text.name")
        .data(data)
        .enter()
        .append("text")
        .text(function (d) {
            if ((d.name) != null) {
                if ((d.name).length > 20) {
                    return (String(d.name).slice(0, 19) + "...");
                }
                else {
                    return (String(d.name).slice(0, 19));
                }
            }
            else {
                return ('N/A');
            }
        })
        .attr("y", function (d, i) {
            return i * (height / data.length);
        })
        .attr("dx", 0)
        .attr("dy", barHeight - y1)
        .attr("class", function(d){
            if(d.name !== null) {
                return "name";
            }
        })
        .on("click", function (d) {
            if(d.name !== null) {
                return window.location.assign(window.location.origin + "/" + url + "/" + d.name);
            }
        })
        .attr("id", function (d, i) {
            return d.name;
        });
};




    var createBarChartContract = function (data, definedId, url) {
    if($(window).width() < 768){
        var heightContainer = 200;
    }
    else {
        var heightContainer = 300;
    }

    console.log("test");
    
    var divNode = d3.select("#main-content").node();
    var divId = "#" + definedId;
    var widthOfParent = $(divId).parent().width();
    var margin = {top: 20, right: 20, bottom: 20, left: 100},
        width = widthOfParent - margin.left - margin.right,
        height = heightContainer - margin.top - margin.bottom;

    var x = d3.scale.ordinal().rangeRoundBands([0, width], .35);

    var y = d3.scale.linear().range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .ticks(5);

    var svg = d3.select("#barChart-amount").append("svg")
        .attr("width", width + margin.left + 1)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    data.forEach(function(d) {
        d.name = d.name;
        d.value = +d.value;
    });

    x.domain(data.map(function(d) { return d.name; }));
    y.domain([0, d3.max(data, function(d) { return d.value; })]);

    function make_y_axis(){
        return d3.svg.axis()
            .scale(y)
            .orient("left")
            .ticks(5)
    }

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)

        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "1em")
        .attr("dy", ".75em");

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("y", 6)
        .attr("dy", ".71em");

    svg.append("svg:g")
        .attr("class","grid")
        .attr("transform", "translate(0,0)")
        .call(make_y_axis()
            .tickSize(-width,0,0)
            .tickFormat("")
        )


  /*  // chart title

    svg.selectAll("text.bar")
        .data(data)
        .enter().append("text")
        .attr("class", "verticalBar-value numeric-data")
        .attr("text-anchor", "middle")
        .attr("x", function(d) { return x(d.name) + x.rangeBand()/2; })
        .attr("y", function(d) { return y(d.value) - 5; })
        .html(function(d) { return d.value; });*/

    svg.selectAll("bar")
        .data(data)
        .enter().append("rect")
        .attr("class","bars")
        .attr("x", function(d) {
            return x(d.name); })
        .attr("width", x.rangeBand())
            .attr("y", height)
            .attr("height", 0)
            .transition()
            .duration(900)
            .ease("linear")
        .attr("y", function(d){
            return y(d.value)})
        .attr("height", function(d) {
            if(d.value < 0)
                return height - y(0);
            else
            return height - y(d.value); });

    svg.selectAll("rect")
        .on("mousemove", function(d){
            var mousePos = d3.mouse(divNode);
            d3.select("#tooltip-no-tip")
                .style("left",mousePos[0] + "px")
                .style("top",mousePos[1] + "px")
                .select("#value")
                .attr("text-anchor","middle")
                .html(d.value);

            d3.select("#tooltip-no-tip").classed("hide", false);
        })
        .on("mouseout",function(d){
            d3.select("#tooltip-no-tip").classed("hide", true);
        });

};

var createLineChartONHeader = function(data,widthParent,typeColor){
    console.log(typeColor);
    if($(window).width() < 768){
        var height1 = 200;
    }
    else {
        var height1 = 250;
    }
    var divNode = d3.select("#main-content").node();
    var width1 = widthParent;
    var svg = d3.select("#header-linechart")
        .append("svg")
        .attr("width", width1 + 1)
        .attr("height", height1)
        .attr("id", "visualization");
    var vis = d3.select("#visualization"),
        margin = {
            top: 20, right:20, bottom:20, left: 40
        };


    var xScale = d3.scale.ordinal().rangeRoundBands([0,width1-50], 0);
    var yScale = d3.scale.linear()
        .range([height1 - margin.top, margin.bottom]);
    var xAxis = d3.svg.axis()
        .orient("bottom")
        .scale(xScale)
        .ticks(2);
    var yAxis = d3.svg.axis()
        .orient("left")
        .scale(yScale)
        .ticks(6);

    function make_x_axis(){
        return d3.svg.axis()
            .scale(xScale)
            .orient("bottom")
            .ticks(6)
    }
    function make_y_axis(){
        return d3.svg.axis()
            .scale(yScale)
            .orient("left")
            .ticks(6)
    }
    data.forEach(function (d){
        d.xValue = d.xValue;
        d.chart1 = +d.chart1;
        d.chart2= +d.chart2;
    });
    var maxValue = d3.max(data, function(d){ return d.chart2; });
    xScale.domain(data.map(function (d) {return d.xValue; }));
    yScale.domain([0,maxValue]);

    vis.append("svg:g")
        .attr("class","axis")
        .attr("transform", "translate(" + (margin.left) + "," + (height1 - margin.bottom)+ ")")
        .call(xAxis);

    // for the vertical grids
    // ==============================================================
    // vis.append("svg:g")
    // 	.attr("class","grid")
    // 	.attr("transform", "translate(" + (margin.left) + "," + (height1 - margin.bottom)+ ")")
    // 	.call(make_x_axis()
    // 			.tickSize(-height1, 0 ,0 )
    // 			.tickFormat("")
    // 		)
    // =====================================================================

    vis.append("svg:g")
        .attr("class","axis")
        .attr("transform", "translate(" + margin.left + ",0)")
        .call(yAxis);

    vis.append("svg:g")
        .attr("class","grid")
        .attr("transform", "translate(" + margin.left + ",0)")
        .call(make_y_axis()
            .tickSize(-width1,0,0)
            .tickFormat("")
        )

    var lineGen = d3.svg.line()
        .x(function (d) {
            return xScale(d.xValue);
        })
        .y(function (d) {
            return yScale(d.chart2);
        });

    var linePath = vis.append('svg:path')
        .attr('d', lineGen(data))
        .attr("transform", "translate(" + (((xScale(data[0].xValue)+xScale(data[1].xValue))/2) + margin.left) + ",0)")
        .attr("stroke", typeColor)
        .attr("stroke-width", 2)
        .attr("fill", "none");

    var totalLength = linePath.node().getTotalLength();

    linePath
        .attr("stroke-dasharray", totalLength + " " + totalLength)
        .attr("stroke-dashoffset", totalLength)
        .transition()
        .duration(1000)
        .ease("linear")
        .attr("stroke-dashoffset", 0);

    vis.selectAll("dot")
        .data(data)
        .enter()
        .append("circle")
        .filter(function (d) {
            return d.chart2;
        })
        .attr("r", 4)
        .attr("fill", typeColor)
        // .attr("transform", "translate(" + (((xScale(data[0].xValue)+xScale(data[1].xValue))/2) + margin.left) + ",0)")
        .attr("cx", function (d){
            return xScale(d.xValue) + (((xScale(data[0].xValue)+xScale(data[1].xValue))/2) + margin.left);
        })
        .attr("cy", function (d){
            return yScale(d.chart2);
        })
        .on("mouseover", function(d){
            var mousePos = d3.mouse(divNode);
            d3.select("#tooltip-wrap")
                .style("left",mousePos[0] + "px")
                .style("top",mousePos[1] + "px")
                .select("#value")
                .attr("text-anchor","middle")
                .html(d.chart2);

            d3.select("#tooltip-wrap").classed("hide", false);
        })
        .on("mouseout",function(d){
            d3.select("#tooltip-wrap").classed("hide", true);
        });

};

var createSlider = function (route, type, widthOfParent, definedId, url, element) {
    var formatDate = d3.time.format("%Y");
    var customFormat = d3.time.format("%Y%m");
    var cValue = 0;
    var flag = 0;
    var insetValue1, insetValue2;
// parameters
    var margin = {
            top: 20,
            right: 20,
            bottom: 20,
            left: 20
        },
        width = widthOfParent - margin.left - margin.right,
        height = 70 - margin.bottom - margin.top;

// scale function
    var timeScale = d3.time.scale()
        //.domain([new Date('2012-01-01 '), new Date('2017-12-30')])
	.domain([new Date('2012-01-01 '), new Date(new Date().getFullYear() + '-12-30')])
        .range([0, width])
        .clamp(true);
    var axistimeScale = d3.time.scale()
//        .domain([new Date('2011-01-01'), new Date('2017-01-01')])
	.domain([new Date('2011-01-01'), new Date(new Date().getFullYear() + '-01-01')])
        .range([0, width])
        .clamp(true);


// initial value
// var startValue = timeScale(new Date('2014-01-10'));
    //var startingValue1 = new Date('2017-01-01');
    var startingValue1 = new Date(new Date().getFullYear() + '-01-01')
    //var startingValue2 = new Date('2017-12-30');
    var startingValue2 = new Date(new Date().getFullYear() + '-12-30');

// defines brush
    var brush = d3.svg.brush()
        .x(timeScale)
        // .extent([startingValue1, startingValue2])
        .on("brush", brushed)
        .on("brushend", brushend);

    var svg = d3.select(element).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height / 2 + ")")
        .call(d3.svg.axis()
            .scale(axistimeScale)
            .orient("bottom")
            .tickFormat(function (d) {
                return formatDate(d);
            })
            .tickSize(10)
            .tickPadding(0)
        )
        .selectAll("text")
        .attr("x", -width / 12)

    var slider = svg.append("g")
        .attr("transform", "translate(0,10)")
        .attr("class", "slider")
        .call(brush)

    slider.selectAll(".extent,.resize").remove();

// call(brush) generates <rect class="background"> on slider. (see DOM in inspect element)
// slider pointer (crosshair)
    slider.select(".background")
        .attr("height", height / 2)
        .style("fill", "white")
    // .style("visibility","visible");

// slider white line
    d3.select(element + " .slider")
        .insert("line", "rect.background")
        .attr("x1", "0")
        .attr("x2", width)
        .attr("class", "main-line")

    var handle1 = slider.append("g")
        .attr("transform", "translate(0," + (height / 2) + ")")
        .attr("class", "handle1")
    var handle2 = slider.append("g")
        .attr("transform", "translate(0," + (height / 2) + ")")
        .attr("class", "handle2")

    handle1.append("circle")
        .attr("r", "6")
        .attr("class", "slider-circle")

    handle2.append("circle")
        .attr("r", "6")
        .attr("class", "slider-circle")

    var value1 = startingValue1;
    var value2 = startingValue2;

    handle1.attr("transform", "translate(" + timeScale(value1) + ",0)");
    handle2.attr("transform", "translate(" + timeScale(value2) + ",0)");

    slider.call(brush.event)


    function brushed() {

        var calculate = (+customFormat(value1) + +customFormat(value2)) / 2;
        var mouseValue = timeScale.invert(d3.mouse(this)[0]);
        if (customFormat(mouseValue) < calculate) {
            value1 = mouseValue;
            handle1.attr("transform", "translate(" + timeScale(value1) + ",0)");
            handle1.select('text').text(formatDate(value1));
            flag = 1;
        }
        if (customFormat(mouseValue) > calculate) {
            value2 = mouseValue;
            handle2.attr("transform", "translate(" + timeScale(value2) + ",0)");
            handle2.select('text').text(formatDate(value2));
            flag = 2;
        }

        insetValue1 = timeScale(value1);
        insetValue2 = timeScale(value2);

        d3.select(element + " .slider-inset").remove();
        // Initial slider inset
        d3.select(element + " .slider")
            .insert("line", "rect.background")
            .attr("x1", insetValue1)
            .attr("x2", insetValue2)
            .attr("class", "slider-inset")

    }

//
    function brushend() {
        value = timeScale.invert(d3.mouse(this)[0]);
        cValue = customFormat(value);
        // 2012
        if (cValue > 2011 && cValue < 201206) {
            value = new Date('2011-12-30');
            handle1.attr("transform", "translate(" + timeScale(value) + ",0)");
            flag = "handle1";
        }
        else if (cValue >= 201206 && cValue < 201212) {
            value = new Date('2012-12-30');
            handle1.attr("transform", "translate(" + timeScale(value) + ",0)");
            flag = "handle1";

        }
// 2013
        else if (cValue > 2013 && cValue < 201306) {
            value = new Date('2012-12-30');
            if (flag == 1) {
                handle1.attr("transform", "translate(" + timeScale(value) + ",0)");
                handle1.select('text').text(formatDate(value));
                flag = "handle1";
            }
            if (flag == 2) {
                handle2.attr("transform", "translate(" + timeScale(value) + ",0)");
                handle2.select('text').text(formatDate(value));
                flag = "handle2";
            }
        }
        else if (cValue >= 201306 && cValue <= 201312) {
            value = new Date('2013-12-30');
            if (flag == 1) {
                handle1.attr("transform", "translate(" + timeScale(value) + ",0)");
                flag = "handle1";
            }
            if (flag == 2) {
                handle2.attr("transform", "translate(" + timeScale(value) + ",0)");
                flag = "handle2";
            }
        }

// 2014
        else if (cValue > 201312 && cValue < 201406) {
            value = new Date('2013-12-30');
            if (flag == 1) {
                handle1.attr("transform", "translate(" + timeScale(value) + ",0)");
                flag = "handle1";
            }
            if (flag == 2) {
                handle2.attr("transform", "translate(" + timeScale(value) + ",0)");
                flag = "handle2";
            }
        }
        else if (cValue >= 201406 && cValue <= 201412) {
            value = new Date('2014-12-30');
            if (flag == 1) {
                handle1.attr("transform", "translate(" + timeScale(value) + ",0)");
                flag = "handle1";
            }
            if (flag == 2) {
                handle2.attr("transform", "translate(" + timeScale(value) + ",0)");
                flag = "handle2";
            }
        }

// 2015
        else if (cValue > 201412 && cValue < 201506) {
            value = new Date('2014-12-30');
            if (flag == 1) {
                handle1.attr("transform", "translate(" + timeScale(value) + ",0)");
                flag = "handle1";
            }
            if (flag == 2) {
                handle2.attr("transform", "translate(" + timeScale(value) + ",0)");
                flag = "handle2";
            }
        }
        else if (cValue >= 201506 && cValue <= 201512) {
            value = new Date('2015-12-30');
            if (flag == 1) {
                handle1.attr("transform", "translate(" + timeScale(value) + ",0)");
                flag = "handle1";
            }
            if (flag == 2) {
                handle2.attr("transform", "translate(" + timeScale(value) + ",0)");
                flag = "handle2";
            }
        }

// 2016
        else if (cValue > 201512 && cValue < 201606) {
            value = new Date('2015-12-30');
            if (flag == 1) {
                handle1.attr("transform", "translate(" + timeScale(value) + ",0)");
                flag = "handle1";
            }
            if (flag == 2) {
                handle2.attr("transform", "translate(" + timeScale(value) + ",0)");
                flag = "handle2";
            }
        }
        else if (cValue >= 201606 && cValue <= 201612) {
            value = new Date('2016-12-30');
            if (flag == 1) {
                handle1.attr("transform", "translate(" + timeScale(value) + ",0)");
                flag = "handle1";
            }
            if (flag == 2) {
                handle2.attr("transform", "translate(" + timeScale(value) + ",0)");
                flag = "handle2";
            }
        }

// 2017
        else if (cValue > 201612 && cValue < 201706) {
            value = new Date('2016-12-30');
            if (flag == 2) {
                handle2.attr("transform", "translate(" + timeScale(value) + ",0)");
                flag = "handle2";
            }
        }
        else if (cValue >= 201706 && cValue <= 201712) {
            value = new Date('2017-12-30');
            if (flag == 2) {
                handle2.attr("transform", "translate(" + timeScale(value) + ",0)");
                flag = "handle2";
            }
        }
        // slider inset
        if (flag === "handle1") {
            value1 = value;
            d3.select(element + " .slider-inset").remove();
            d3.select(element + " .slider")
                .insert("line", "rect.background")
                .attr("x1", timeScale(value))
                .attr("x2", insetValue2)
                .attr("class", "slider-inset")
        }
        if (flag === "handle2") {
            value2 = value;
            d3.select(element + " .slider-inset").remove();
            d3.select(element + " .slider")
                .insert("line", "rect.background")
                .attr("x1", insetValue1)
                .attr("x2", timeScale(value))
                .attr("class", "slider-inset")
        }
        var startVal = formatDate(value1);

        if (cValue != '0NaNNaN') {
            startVal = (startVal == 2011) ? 2012 : parseInt(startVal) + 1;
        }

        $("#select-year-" + type).attr('from', startVal);
        $("#select-year-" + type).attr('to', formatDate(value2));

        console.log(startVal+" : "+ formatDate(value2));

        getTrendData(route, type, widthOfParent, definedId, url);
        flag = 0;
    }


};

var only_slider = function (widthOfParent, element) {
    var formatDate = d3.time.format("%Y");
    var customFormat = d3.time.format("%Y%m");
    var cValue = 0;
    var flag = 0;
    var insetValue1, insetValue2;
// parameters
    var margin = {
            top: 20,
            right: 20,
            bottom: 20,
            left: 20
        },
        width = widthOfParent - margin.left - margin.right,
        height = 70 - margin.bottom - margin.top;

// scale function
    var timeScale = d3.time.scale()
//        .domain([new Date('2012-01-01 '), new Date('2017-12-30')])
	.domain([new Date('2012-01-01'), new Date(new Date().getFullYear() + '-12-30')])
        .range([0, width])
        .clamp(true);
    var axistimeScale = d3.time.scale()
        //.domain([new Date('2011-01-01'), new Date('2017-01-01')])
	.domain([new Date('2011-01-01'), new Date(new Date().getFullYear() + '-01-01')])
        .range([0, width])
        .clamp(true);


// initial value
// var startValue = timeScale(new Date('2014-01-10'));
    var startingValue1 = new Date('2012-01-01');
//    var startingValue2 = new Date('2017-12-30');
    var startingValue2 = new Date(new Date().getFullYear() + '-12-30');

// defines brush
    var brush = d3.svg.brush()
        .x(timeScale)
        // .extent([startingValue1, startingValue2])
        .on("brush", brushed)
        .on("brushend", brushend);

    var svg = d3.select(element).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height / 2 + ")")
        .call(d3.svg.axis()
            .scale(axistimeScale)
            .orient("bottom")
            .tickFormat(function (d) {
                return formatDate(d);
            })
            .tickSize(10)
            .tickPadding(0)
        )
        .selectAll("text")
        .attr("x", -width / 12);

    var slider = svg.append("g")
        .attr("transform", "translate(0,10)")
        .attr("class", "slider")
        .call(brush);

    slider.selectAll(".extent,.resize").remove();

// call(brush) generates <rect class="background"> on slider. (see DOM in inspect element)
// slider pointer (crosshair)
    slider.select(".background")
        .attr("height", height / 2)
        .style("fill", "white");
    // .style("visibility","visible");

// slider white line
    d3.select(element + " .slider")
        .insert("line", "rect.background")
        .attr("x1", "0")
        .attr("x2", width)
        .attr("class", "main-line");

    var handle1 = slider.append("g")
        .attr("transform", "translate(0," + (height / 2) + ")")
        .attr("class", "handle1");
    var handle2 = slider.append("g")
        .attr("transform", "translate(0," + (height / 2) + ")")
        .attr("class", "handle2");

    handle1.append("circle")
        .attr("r", "6")
        .attr("class", "slider-circle");

    handle2.append("circle")
        .attr("r", "6")
        .attr("class", "slider-circle");

    var value1 = startingValue1;
    var value2 = startingValue2;

    handle1.attr("transform", "translate(" + timeScale(value1) + ",0)");
    handle2.attr("transform", "translate(" + timeScale(value2) + ",0)");

    slider.call(brush.event);


    function brushed() {

        var calculate = (+customFormat(value1) + +customFormat(value2)) / 2;
        var mouseValue = timeScale.invert(d3.mouse(this)[0]);
        if (customFormat(mouseValue) < calculate) {
            value1 = mouseValue;
            handle1.attr("transform", "translate(" + timeScale(value1) + ",0)");
            handle1.select('text').text(formatDate(value1));
            flag = 1;
        }
        if (customFormat(mouseValue) > calculate) {
            value2 = mouseValue;
            handle2.attr("transform", "translate(" + timeScale(value2) + ",0)");
            handle2.select('text').text(formatDate(value2));
            flag = 2;
        }

        insetValue1 = timeScale(value1);
        insetValue2 = timeScale(value2);

        d3.select(element + " .slider-inset").remove();
        // Initial slider inset
        d3.select(element + " .slider")
            .insert("line", "rect.background")
            .attr("x1", insetValue1)
            .attr("x2", insetValue2)
            .attr("class", "slider-inset")

    }

//
    function brushend() {
        value = timeScale.invert(d3.mouse(this)[0]);
        cValue = customFormat(value);
        // 2012
        if (cValue > 2011 && cValue < 201206) {
            value = new Date('2011-12-30');
            handle1.attr("transform", "translate(" + timeScale(value) + ",0)");
            flag = "handle1";
        }
        else if (cValue >= 201206 && cValue < 201212) {
            value = new Date('2012-12-30');
            handle1.attr("transform", "translate(" + timeScale(value) + ",0)");
            flag = "handle1";

        }
// 2013
        else if (cValue > 2013 && cValue < 201306) {
            value = new Date('2012-12-30');
            if (flag === 1) {
                handle1.attr("transform", "translate(" + timeScale(value) + ",0)");
                handle1.select('text').text(formatDate(value));
                flag = "handle1";
            }
            if (flag === 2) {
                handle2.attr("transform", "translate(" + timeScale(value) + ",0)");
                handle2.select('text').text(formatDate(value));
                flag = "handle2";
            }
        }
        else if (cValue >= 201306 && cValue <= 201312) {
            value = new Date('2013-12-30');
            if (flag === 1) {
                handle1.attr("transform", "translate(" + timeScale(value) + ",0)");
                flag = "handle1";
            }
            if (flag === 2) {
                handle2.attr("transform", "translate(" + timeScale(value) + ",0)");
                flag = "handle2";
            }
        }

// 2014
        else if (cValue > 201312 && cValue < 201406) {
            value = new Date('2013-12-30');
            if (flag === 1) {
                handle1.attr("transform", "translate(" + timeScale(value) + ",0)");
                flag = "handle1";
            }
            if (flag === 2) {
                handle2.attr("transform", "translate(" + timeScale(value) + ",0)");
                flag = "handle2";
            }
        }
        else if (cValue >= 201406 && cValue <= 201412) {
            value = new Date('2014-12-30');
            if (flag === 1) {
                handle1.attr("transform", "translate(" + timeScale(value) + ",0)");
                flag = "handle1";
            }
            if (flag === 2) {
                handle2.attr("transform", "translate(" + timeScale(value) + ",0)");
                flag = "handle2";
            }
        }

// 2015
        else if (cValue > 201412 && cValue < 201506) {
            value = new Date('2014-12-30');
            if (flag === 1) {
                handle1.attr("transform", "translate(" + timeScale(value) + ",0)");
                flag = "handle1";
            }
            if (flag === 2) {
                handle2.attr("transform", "translate(" + timeScale(value) + ",0)");
                flag = "handle2";
            }
        }
        else if (cValue >= 201506 && cValue <= 201512) {
            value = new Date('2015-12-30');
            if (flag === 1) {
                handle1.attr("transform", "translate(" + timeScale(value) + ",0)");
                flag = "handle1";
            }
            if (flag === 2) {
                handle2.attr("transform", "translate(" + timeScale(value) + ",0)");
                flag = "handle2";
            }
        }

// 2016
        else if (cValue > 201512 && cValue < 201606) {
            value = new Date('2015-12-30');
            if (flag === 1) {
                handle1.attr("transform", "translate(" + timeScale(value) + ",0)");
                flag = "handle1";
            }
            if (flag === 2) {
                handle2.attr("transform", "translate(" + timeScale(value) + ",0)");
                flag = "handle2";
            }
        }
        else if (cValue >= 201606 && cValue <= 201612) {
            value = new Date('2016-12-30');
            if (flag === 1) {
                handle1.attr("transform", "translate(" + timeScale(value) + ",0)");
                flag = "handle1";
            }
            if (flag === 2) {
                handle2.attr("transform", "translate(" + timeScale(value) + ",0)");
                flag = "handle2";
            }
        }

// 2017
        else if (cValue > 201612 && cValue < 201706) {
            value = new Date('2016-12-30');
            if (flag === 2) {
                handle2.attr("transform", "translate(" + timeScale(value) + ",0)");
                flag = "handle2";
            }
        }
        else if (cValue >= 201706 && cValue <= 201712) {
            value = new Date('2017-12-30');
            if (flag === 2) {
                handle2.attr("transform", "translate(" + timeScale(value) + ",0)");
                flag = "handle2";
            }
        }
        // slider inset
        if (flag === "handle1") {
            value1 = value;
            d3.select(element + " .slider-inset").remove();
            d3.select(element + " .slider")
                .insert("line", "rect.background")
                .attr("x1", timeScale(value))
                .attr("x2", insetValue2)
                .attr("class", "slider-inset")
        }
        if (flag === "handle2") {
            value2 = value;
            d3.select(element + " .slider-inset").remove();
            d3.select(element + " .slider")
                .insert("line", "rect.background")
                .attr("x1", insetValue1)
                .attr("x2", timeScale(value))
                .attr("class", "slider-inset")
        }
        var startVal = formatDate(value1);

        if (cValue !== '0NaNNaN') {
            startVal = (startVal === 2011) ? 2012 : parseInt(startVal) + 1;
        }

       // $("#select-year-" + type).attr('from', startVal);
       // $("#select-year-" + type).attr('to', formatDate(value2));

        console.log("Start Value "+startVal+", End value "+ formatDate(value2));
        $("#startDate").val(startVal);
        $("#endDate").val(formatDate(value2));

        flag = 0;
    }


};
//# sourceMappingURL=customChart.js.map
