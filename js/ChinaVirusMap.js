 // 国外数据
var foreignData = null;
// 国内数据
var chinaData = null;
//国内历史数据
var chinaHistory = null;
$.when($.ajax({
    url: "https://view.inews.qq.com/g2/getOnsInfo?name=disease_foreign",
    dataType: "jsonp",
    success: function (data) {
        foreignData = JSON.parse(data.data);
        console.log(JSON.parse(data.data));
    }
}), $.ajax({
    url: "https://view.inews.qq.com/g2/getOnsInfo?name=disease_h5",
    dataType: "jsonp",
    success: function (data) {
        chinaData = JSON.parse(data.data);
        chanatree = JSON.parse(data.data);
        console.log(JSON.parse(data.data));
        // console.log(chinaData.lastUpdateTime);
    }
}), $.ajax({
        url: "https://interface.sina.cn/news/wap/fymap2020_data.d.json?_=15808982522427",
        dataType: "jsonp",
        success: function (data) {
            chinaHistory = data.data.historylist;
            // console.log(chinaHistory);
            test = data.data.jwsrTop;
            test1 = data.data;
            console.log(test);
            console.log(test1);
            // let list = data.data.list.map(item=>({name:item.name,value:item.value}))
            // chinaHistory = JSON.parse(data.data);;
            // option.series[0].data = list;
            // chinaData = JSON.parse(data.data);
            // chanatree = JSON.parse(data.data);
            // console.log(JSON.parse(data.data));
            // console.log(chinaData.lastUpdateTime);
        }
    })).then(function () {
     // 更新标题  
     title();
     // 注入总览数据
     brief();
     // 中国疫情地图
     map();
     // 疫情趋势
     tendency();
     // 昨日新增确诊省份Top10
     top10();
})
// 标题
function title() {
      $(".brief .brief_header p").text("更新时间 - " + chinaData.lastUpdateTime)
}
 // 注入总览数据
function brief() {
     // 拼接字符串
     var htmlStr = `
            <li class="allConfirm">
                <div class="number">${chinaData.chinaTotal.confirm}</div>
                <div class="item">累计确诊</div>
                <div class="change"><span>昨日</span><b>+${chinaData.chinaAdd.confirm}</b></div>
            </li>
            <li class="nowConfirm">
                <div class="number">${chinaData.chinaTotal.nowConfirm}</div>
                <div class="item">现有确诊</div>
                <div class="change"><span>昨日</span><b>${chinaData.chinaAdd.nowConfirm}</b></div>
            </li>
            <li class="deadNum">
                <div class="number">${chinaData.chinaTotal.dead}</div>
                <div class="item">死亡人数</div>
                <div class="change"><span>昨日</span><b>+${chinaData.chinaAdd.dead}</b></div>
            </li>
            <li class="cureNum">
                <div class="number">${chinaData.chinaTotal.heal}</div>
                <div class="item">治愈人数</div>
                <div class="czhange"><span>昨日</span><b>+${chinaData.chinaAdd.heal}</b></div>
            </li>
        `;
    // 设置字符串为HTML内容
    $(".brief_body").html(htmlStr);
}
// 中国疫情地图
function map() {
    // 创建变量保存目标数据
    var virusDatas = [];
    // 遍历数据，获取目标信息
    $.each(chinaData.areaTree[0].children, function (i, v) {
        virusDatas[i] = {};
        virusDatas[i].name = v.name;
        virusDatas[i].value = v.total.confirm;
    })
    // 加入中国数据插入到最后位置
    virusDatas.push({
        name: "中国",
        value: chinaData.chinaTotal.confirm
    });
    // 绘制图表
    // 1、初始化echarts实例
    var myChart = echarts.init(document.querySelector(".brief .map_info"));
    // 2、设置配置项
    var option = {
        //设置提示信息
        tooltip: {
            // 设置提示信息触发源
            trigger: 'item',
            // 设置提示信息格式
            formatter: function (params) {
                return params.name + " : " + (params.value ? params.value : 0);
            }
        },
        //视觉映射组件
        visualMap: {
            // 设置映射类型：piecewise分段型、continuous连续性
            type: 'piecewise',
            pieces: [
                { max: 0, label: '0', color: '#eee' },
                { min: 1, max: 99, label: '1-499', color: '#fff7ba' },
                { min: 100, max: 499, label: '500-4999', color: '#ffc24b' },
                { min: 500, max: 999, label: '5000-9999', color: '#ff7c20' },
                { min: 1000, max: 1999, label: '1万-10万', color: '#fe5e3b' },
                { min: 2000, max: 4999, label: '10万-50万', color: '#e2482b' },
                { min: 5000, label: '1万以上', color: '#b93e26' },
            ],
            itemHeight: 10,
            itemWidth: 10,
            inverse: true,

        },
        //系统列表
            series:[{
            //设置数据
            data:virusDatas,
            //数据名称
            name:'',
            //绘制图标类型
            type:'map',
            //指定地图名称
            mapType:'china',
            //地区名称映射
            // nameMap:nameMap,
            itemStyle:{
                emphasis:{
                    areaColor:'#c9fffff',
                    lable:{
                     show:false
                    }
                }
            },
            //设置位置，保持地图高宽比的情况下把地图放在容器的正中间
            layoutCenter:['center','center'],
            //地图缩放
            layoutSize:"130%",
        }]
    };
        myChart.setOption(option);
        $(".brief .map_tab span").eq(0).click(function () { fn("confirm") });
        $(".brief .map_tab span").eq(1).click(function () { fn("nowConfirm") });
        function fn(valueName) {
            $.each(chinaData.areaTree[0].children, function (i, v) {
                virusDatas[i].value = v.total[valueName];
            })
            virusDatas[virusDatas.length - 1].value = chinaData.chinaTotal[valueName];
            option.series[0].data = virusDatas;
            myChart.setOption(option);
        }
        $(".map_tab span").click(function () {
            $(this).addClass("cur").siblings().removeClass("cur");
        })
    }    
//中国疫情趋势
    function tendency() {
        // 获取历史数据
       var chinaDialyHistory =chinaHistory;
       console.log(chinaDialyHistory);
       // 设置容器分别保存日期、疫情数值数据
       var num = [], date = [];
       chinaDialyHistory;
       chinaDialyHistory.shift();
    //    console.log(chinaHistory.);
        $.each(chinaDialyHistory, function (i, v) {
           // 保证数据数量为27，获取间隔3天的数据记录
           if (num.length < 27 && i % 3 == 0) {
               num.push(v.cn_conadd);
               date.push(v.date);
           }
       })
    //    console.log(num);
    //    console.log(date);
    // 1、初始化echarts实例
    var myChart = echarts.init(document.querySelector(".tendency .map_info"));
    // 2、设置配置项
    var option = {
        // 设置标题
        title: {
            text: "中国新增确诊趋势"
        },
        // 图例组件
        legend: {
            // 图例组件前图标类型
            icon: "rect",
            // 设置图例大小
            itemWidth: 12,
            itemHeight: 12,
            right: 20,
            top: 20,
            // 设置图例展示方式：horizontal水平
            orient: 'horizontal',
            // 设置图例文字样式
            textStyle: {
                padding: [3, 0, 0, 0]
            }
        },
        // 设置X轴配置
        xAxis: {
            // 设置X轴类型：category类目轴
            type: 'category',
            data: date.reverse(),
            // 坐标轴刻度标签的相关设置
            axisLabel: {
                rotate: 45,
                interval: 0,
                color: "#ccc",
                fontSize: 10
            },
            // 坐标轴刻度相关设置
            axisTick: {
                length: 0
            }
        },
        // 设置X轴配置
        yAxis: {
            type: 'value',
            min: 0,
            max: 1000,
            axisLabel: {
                formatter: function (param) {
                    return param.toString();
                }
            },
            // 坐标轴刻度相关设置
            axisTick: {
                length: 0
            },
            // 坐标轴轴线相关设置
            axisLine: {
                show: false
            }
        },
        series: [{
            name: "新增确诊",
            type: 'line',
            data: num.reverse(),
            // 是否平滑曲线显示
            smooth: true,
            // 线条样式
            lineStyle: {
                color: "#ff3d18"
            }
        }],
        tooltip: {
            trigger: "item",
            formatter: function (param) {
                return param.seriesName + "<br>" + param.marker + " " + param.name + " - " + param.value;
            }
        }
    };
    $(".tendency .map_tab span").eq(0).click(function () {
        // 重新过滤数据：
        var num = [];
        var date = [];
        $.each(chinaDialyHistory, function (i, v) {
            if (num.length < 27 && i % 3 == 0) {
                num.push(v.cn_conadd);
                date.push(v.date);
            }
        })
        // 根据新数据修改option配置项
        option.series = [{
            name: "新增确诊",
            data: num.reverse(),
            type: 'line',
            smooth: true,
            lineStyle: {
                color: "#ff3d18"
            }
        }]
        option.yAxis.max = 1000;
        option.yAxis.splitNumber = 7;
        option.yAxis.axisLabel.formatter = function (value, index) {
            return value.toString();
        }
        // 重新绘制图表
        myChart.clear();
        myChart.setOption(option, true);
    })
    $(".tendency .map_tab span").eq(1).click(function () {
        // 重新过滤数据
        // 累计确诊 = 现有确诊 + 治愈人数 + 死亡人数
        var num1 = [];
        // 现有确诊 = confirm
        var num2 = [];
        var date = [];
        $.each(chinaDialyHistory, function (i, v) {
            if (num1.length < 27 && i % 3 == 0) {
                num1.push(v.cn_conNum);
                num2.push(v.cn_econNum);
                date.push(v.date);
            }
        })
        option.series = [
            {
                name: "累计确诊",
                type: 'line',
                data: num1.reverse(),
                smooth: true,
                lineStyle: {
                    color: "#c1021b"
                }
            },
            {
                name: "现有确诊",
                type: 'line',
                data: num2.reverse(),
                smooth: true,
                lineStyle: {
                    color: "#264654"
                }
            },
        ]
        option.yAxis.max = 150000;
        option.yAxis.splitNumber = 8;
        option.yAxis.axisLabel.formatter = function (value) {
            return value.toString();
        }
        // 清除图表
        myChart.clear();
        // 重新渲染图表
        myChart.setOption(option)
    })
    $(".tendency .map_tab span").eq(2).click(function () {
        var num1 = [];
        var num2 = [];
        var date = [];
        $.each(chinaDialyHistory, function (i, v) {
            if (num1.length < 27 && i % 3 == 0) {
                num1.push(v.cn_deathNum);
                num2.push(v.cn_cureNum);
                date.push(v.date);
            }
        })
        option.series = [
            {
                name: "死亡数",
                type: 'line',
                data: num1.reverse(),
                smooth: true,
                lineStyle: {
                    color: "#ff3d18"
                }
            },
            {
                name: "治愈数",
                type: 'line',
                data: num2.reverse(),
                smooth: true,
                lineStyle: {
                    color: "#264654"
                }
            },
        ]
        option.yAxis.max = 100000;
        option.yAxis.splitNumber = 8;
        option.yAxis.axisLabel.formatter = function (value) {
            return value.toString();
        }
        // 清除图表
        myChart.clear();
        // 重新渲染图表
        myChart.setOption(option)
    })
    $(".tendency .map_tab span").eq(3).click(function () {
        var num1 = [];
        var num2 = [];
        var date = [];
        $.each(chinaDialyHistory, function (i, v) {
            if (num1.length < 27 && i % 3 == 0) {
                num1.push(v.cn_deathRate);
                num2.push(v.cn_cureRate);
                date.push(v.date);
            }
        })
        option.series = [
            {
                name: "病死率",
                type: 'line',
                data: num1.reverse(),
                smooth: true,
                lineStyle: {
                    color: "#ff3d18"
                }
            },
            {
                name: "治愈率",
                type: 'line',
                data: num2.reverse(),
                smooth: true,
                lineStyle: {
                    color: "#264654"
                }
            },
        ]
        option.yAxis.max = 100;
        option.yAxis.splitNumber = 7;
        // 设置Y轴刻度文本是百分比
        option.yAxis.axisLabel.formatter = function (value) {
            return value + "%";
        }
        // 清除图表
        myChart.clear();
        // 重新渲染图表
        myChart.setOption(option)
    })
    myChart.setOption(option);
}
//境外输入确诊省市Top10
function top10() {
    var num = [];
    var nation = [];
    $.each(test, function (i, v) {
        num.push(v.jwsrNum);
        nation.push(v.name);
    })
    // 1、初始化echarts实例
    var myChart = echarts.init(document.querySelector(".addTop10 .map_info"));
    // 2、设置配置项
    var option = {
        title: {
            text: "确诊人数"
        },
        xAxis: {
            type: 'category',
            data: nation,
            axisLabel: {
                interval: 0,
                rotate: 45,
                color: "#333",
                fontSize: 10
            },
            axisTick: {
                length: 0
            }
        },
        yAxis: {
            type: 'value',
            axisLabel: {
                formatter: function (value) {
                    return value.toString();
                }
            }
        },
        series: [{
            // 柱状图
            type: 'bar',
            data: num,
            barWidth: 18,
            itemStyle: {
                // 鼠标经过时样式
                emphasis: {
                    color: "#ffe04d"
                }
            }
        }],
    };
    myChart.setOption(option);
}