//  这样写代码会在页面加载完成后加载
$(function () {
    //加载实时数据
    $.ajax({
        //访问地址
        url: 'http://tianqiapi.com/api?version=epidemic&appid=24723339&appsecret=EvRxn40F',
        //设置返回数据类型，默认为text
        dataType: "json",
        success: function (data) {
            //success是请求成功后悔执行的方法
            //data对应返回的数据
            // console.log(data);
            //调用show_map方法 展示图标
            show_map(data);

            show_zxt(data);
        }
    });
})

let province_data = ['北京', '天津', '上海', '重庆', '河北', '河南', '云南', '辽宁', '黑龙江', '湖南', '安徽', '山东', '新疆', '江苏', '浙江', '江西', '湖北', '广西', '甘肃', '山西', '内蒙古', '陕西', '吉林', '福建', '贵州', '广东', '青海', '西藏', '四川', '宁夏', '海南', '台湾', '香港', '澳门']

//按照特定的格式存储省份数据   {name:省份名称，selected：false，value：下标志}
let p_data = [];

// 按照特定的格式存储省份数据 {label:省份名称,start:下标值,end:下标值, color:在地图中的背景色}
let s_data = [];


//初始化p_data
for (let i = 0; i < province_data.length; i++) {
    let d = {
        "name": province_data[i],
        "selected": false,
        "value": i + 1
    }
    p_data.push(d);

    let sd = {
        start: i + 1,
        end: i + 1,
        label: province_data[i],
        color: "#dfb5b5"
    }
    s_data.push(sd);
}


//地图展示方法
function show_map(data) {

    // 基于准备好的dom，初始化echarts实例
    let myChart = echarts.init(document.getElementById('main'));

    //定义颜色分别对应人数 个 十 百 千 万
    let colors = ["#f3c7c7", "#e68181", "#e43e3e", "#b23232", "#7b0000"];
    //确定每个省份的人数及对应的颜色

    let act_data = data.data.list;
    // console.log(act_data);

    //存放省份和对应人数
    let colorMap = {};

    //获取省份 和 人数
    for (let i = 0; i < act_data.length; i++) {
        let act_item = act_data[i]; // "湖北 确诊 27100 例，治愈 1440 例，死亡 780 例"
        let ret = act_item.split(",")[0]; //湖北 确诊 27100 例
        let pr = ret.split(" ")[0]; //湖北
        let nu = ret.split(" ")[2]; //27100
        // console.log(pr,nu);
        colorMap[pr] = nu;
    }

    for (let i = 0; i < province_data.length; i++) {

        let colorIndex = colorMap[province_data[i]].length - 1;
        if (colorIndex > 4) {
            colorIndex = 4;
        }

        let sd = {
            start: i + 1,
            end: i + 1,
            label: province_data[i],
            // 根据对应的省份的人数计算对应的颜色的下标
            //  规则是 : 人数的长度-1 作为下标值使用, 如果 下标值 超出了 3 , 那么 默认使用最后一种颜色
            /*
                1. 通过省份找到人数  
                    province_data[i]s_data 省份
                    colorMap ： 省份-->人数
                    所以： colorMap[province_data[i]] --> 人数

                2. 计算人数的长度
                    colorMap[province_data[i]].length
                3. 计算颜色的下标
                    colorMap[province_data[i]].length - 1
                4. 根据下标找到对应的颜色
                    colors[ colorMap[province_data[i]].length - 1 ]
            */
            color: colors[colorIndex]
        }
        s_data.push(sd);
    }


    // 指定图表的配置项和数据
    let option = {

        title: {
            text: '全国新冠肺炎疫情实时地图'
        },

        toolbox: {
            feature: {
                saveAsImage: {
                    pixelRatio: 2
                }
            }
        },

        tooltip: {
            show: true,
            formatter: function (d) {
                return "省份：" + d.name + "<br/>" + "人数：" + colorMap[d.name];
            }
        },


        series: [{
            type: 'map',
            map: 'china',
            label: {
                //普通样式
                normal: {
                    show: true,
                    textStyle: {
                        color: "black"
                    }
                },
                emphasis: {
                    show: false,
                    textStyle: {
                        color: "#800080"
                    }
                }
            },
            //每个模块的样式
            itemStyle: {
                //普通样式
                normal: {
                    borderWidth: 0.5,
                    borderColor: "#009fe8",
                    areaColor: "#ffefd5"
                },
                //鼠标经过样式
                emphasis: {
                    borderWidth: 0.5,
                    borderColor: "#333333",
                    areaColor: "#ffdead"
                }
            },
            data: p_data,
        }],
        dataRange: {
            x: "0 px",
            y: "0 px",
            splitList: s_data
        }
    };

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
}


// function show_zxt(data) {
//     // 基于准备好的dom，初始化echarts实例
//     let myChart = echarts.init(document.getElementById('zxt'));

//     let act_data = data.data.history;
    
//     let date = [];
//     for(let i=0; i<7;i++){
//         date[i] = act_data[i].date;
//     }
    

//     option = {
//         title: {
//             text: '变化数据'
//         },
//         tooltip: {
//             trigger: 'axis'
//         },
//         legend: {
//             data: ['邮件营销', '联盟广告', '视频广告', '直接访问', '搜索引擎']
//         },
//         grid: {
//             left: '3%',
//             right: '4%',
//             bottom: '3%',
//             containLabel: true
//         },
//         toolbox: {
//             feature: {
//                 saveAsImage: {}
//             }
//         },
//         xAxis: {
//             type: 'category',
//             boundaryGap: false,
//             data: [date[6], date[5], date[4], date[3],date[2], date[1],date[0]]
//         },
//         yAxis: {
//             type: 'value'
//         },
//         series: [{
//                 name: '邮件营销',
//                 type: 'line',
//                 stack: '总量',
//                 data: [120, 132, 101, 134, 90, 230, 210]
//             },
//             {
//                 name: '联盟广告',
//                 type: 'line',
//                 stack: '总量',
//                 data: [220, 182, 191, 234, 290, 330, 310]
//             },
//             {
//                 name: '视频广告',
//                 type: 'line',
//                 stack: '总量',
//                 data: [150, 232, 201, 154, 190, 330, 410]
//             },
//             {
//                 name: '直接访问',
//                 type: 'line',
//                 stack: '总量',
//                 data: [320, 332, 301, 334, 390, 330, 320]
//             },
//             {
//                 name: '搜索引擎',
//                 type: 'line',
//                 stack: '总量',
//                 data: [820, 932, 901, 934, 1290, 1330, 1320]
//             }
//         ]
//     };


//     // 使用刚指定的配置项和数据显示图表。
//     myChart.setOption(option);
// }