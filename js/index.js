// var cityData = null;

// var CountyData = null;

function goBackChinaMap(){
    $('#china_map').css('display','block');
    $('#city_map').css('display','none');
    $('#proe_map').css('display','none');
}
function goBackProeMap(){
    $('#china_map').css('display','none');
    $('#city_map').css('display','none');
    $('#proe_map').css('display','block');
}
// function go(){
//     $.ajax({
//         type:"POST",
//         url:map.html,//你的请求程序页面随便啦
//         async:false,//同步：意思是当有返回值以后才会进行后面的js程序。
//         data:null,//请求需要发送的处理数据
//         success:function(msg){
//             if (msg) {//根据返回值进行跳转
//                 window.location.href = 'post.html';
//             }
//         }
//     })
// }
$().ready(function(){
    /*echarts*/
          $.get('json/china.json', function (mapJson) {
                 echarts.registerMap('china', mapJson);
                 var chart = echarts.init(document.getElementById('china_map'));//在id为mainMap的dom元素中显示地图
                 chart.setOption({
                   tooltip: {
                       trigger: 'item',
                       formatter: function (result){//回调函数，参数params具体格式参加官方API
                        var test = null; 
                        var jd = null;      
                        if(result.value<1){
                            test = '五颗星';
                            jd = result.name
                        }else if(result.value>1&result.value<=10){
                            test = '四颗星';
                        }else if(result.value>10&result.value<100){
                            test = "三颗星";
                        }else {
                            test = "不推荐";
                        }
                        return  result.name + '<br />数据:' + result.value +'<br />旅游指数:'+test;
                       } 
                   },
                   dataRange:{
                          min:0,  
                          max:100,  
                          splitNumber:0,
                          text:['高','低'],  
                          realtime:true,
                          calculable:true,
                          selectedMode:true,
                          realtime:true,
                          show:true,
                          itemWidth:20,
                          itemHeight:100,
                          color:['lightskyblue','#f2f2f2']
                   }, 
                   title:{
                       text:'国内旅游推荐地图',
                       //subtext:'',
                       x:'center',
                       y:'top',
                       textAlign:'left'
                   },
                   series: [{
                       type: 'map',
                       map: 'china',//要和echarts.registerMap（）中第一个参数一致
                       scaleLimit: { min: 0.8, max: 1.9 },//缩放
                        mapLocation:{  
                           y:60
                       },  
                       itemSytle:{  
                           emphasis:{label:{show:true}}  
                       }, 
                       label: {
                           normal: {
                               show: true
                           },
                           emphasis: {
                               show: true
                           }
                       },
                       data : [
                           {name:'新疆',value:'5'},  
                           {name:'北京',value:'20'},  
                           {name:'内蒙古',value:'10'},  
                           {name:'贵州',value:'30'},  
                           {name:'福建',value:'50'},  
                           {name:'甘肃',value:'15'},
                           {name:'广东',value:'1500'},
                           {name:'云南',value:'33'},
                           {name:'山西',value:'30'},  
                           {name:'青海',value:'50'},  
                           {name:'江西',value:'15'},
                           {name:'广西',value:'15'},
                           {name:'湖南',value:'33'},
                           {name:'山东',value:'33'},
                           {name:'台湾',value:'55'},
                           {name: '南海诸岛',value: '100',itemStyle:{ normal:{opacity:0,label:{show:false}}} }
                       ]//dataParam//人口数据：例如[{name:'济南',value:'100万'},{name:'菏泽'，value:'100万'}......]
                   }]
               }),
              
               chart.on('click', function (result) {//回调函数，点击时触发，参数params格式参加官方API
                       
                       setTimeout(function () {
                                   $('#china_map').css('display','none');
                                   $('#city_map').css('display','none');
                                      $('#proe_map').css('display','block');
                              }, 500);
                       //选择省的单击事件
                      var selectProe = result.name;
                      //    调取后台数据
                   $.get('json/'+selectProe+'/'+selectProe+'.json', function (Citymap) {
                             echarts.registerMap(selectProe, Citymap);
                             var myChartProe = echarts.init(document.getElementById('proe_map'));
                             myChartProe.setOption({
                               tooltip: {
                                   trigger: 'item',
                                   formatter: function loadData(result){//回调函数，参数params具体格式参加官方API
                                    var test = null; 
                                    var jd = null;      
                                    if(result.value<1){
                                        test = '五颗星';
                                        jd = result.name
                                    }else if(result.value>1&result.value<=10){
                                        test = '四颗星';
                                    }else if(result.value>10&result.value<100){
                                        test = "三颗星";
                                    }else {
                                        test = "不推荐";
                                    }
                                    return  result.name + '<br />数据:' + result.value +'<br />旅游指数:'+test;
                                   } 
                               }, 
                                dataRange:{
                                    min:0,  
                                    max:50,  
                                    splitNumber:0,
                                    text:['高','低'],  
                                    realtime:true,
                                    calculable:true,
                                    selectedMode:true,
                                    realtime:true,
                                    show:true,
                                    itemWidth:20,
                                    itemHeight:100,
                                    color:['lightskyblue','#f2f2f2']
                             }, 
                               title:{
                                   text:selectProe+'数据总览',
                                   //subtext:'',
                                   x:'center',
                                   y:'top',
                                   textAlign:'left'
                               },
                               series: [{
                                   type: 'map',
                                   map: selectProe ,//要和echarts.registerMap（）中第一个参数一致
                                   scaleLimit: { min: 0.8, max: 1.9 },//缩放
                                    mapLocation:{  
                                       y:60  
                                   },  
                                   itemSytle:{  
                                       emphasis:{label:{show:false}}  
                                   }, 
                                   label: {
                                       normal: {
                                           show: true
                                       },
                                       emphasis: {
                                           show: true
                                       }
                                   },
                                   data : [
                                       {name:'三明市',value:'10'},  
                                       {name:'泉州市',value:'50'},  
                                       {name:'莆田市',value:'20'},  
                                       {name:'厦门市',value:'10'},  
                                       {name:'福州市',value:'235'},  
                                       {name:'龙岩市',value:'25'},
                                       {name:'南平市',value:'125'},  
                                       {name:'宁德市',value:'235'},  
                                       {name:'漳州市',value:'100'}
                                   ]//dataParam//人口数据：例如[{name:'济南',value:'100万'},{name:'菏泽'，value:'100万'}......]
                               }]
                           })
                             myChartProe.on('click',function(rel){
                                     setTimeout(function () { 
                                         function contains(arr, obj) {  
                                   var i = arr.length;  
                                   while (i--) {  
                                       if (arr[i] === obj) {  
                                           return true;  
                                       }  
                                   }  
                                   return false;  
                               }
                               //设置直辖市
                               var arr = new Array('北京','上海','天津','台湾','重庆');
                                   if(contains(arr,selectProe)==false){
                                       $('#china_map').css('display','none');
                                       $('#proe_map').css('display','none');
                                          $('#city_map').css('display','block');
                                   }
                                   else{
                                       $('#china_map').css('display','none');
                                       $('#proe_map').css('display','block');
                                          $('#city_map').css('display','none');
                                   }
                                       
                                  }, 500);
                                  //选择市的单击事件
                                  var selectCity = rel.name;
                                  
                               //    调取后台数据
                               $.get('json/'+selectProe+'/'+selectCity+'.json', function (Citymap) {
                                         echarts.registerMap(selectCity, Citymap);
                                         var myChartCity = echarts.init(document.getElementById('city_map'));
                                         
                                         myChartCity.setOption({
                                            
                                           tooltip: {
                                               type:'axis',
                                               trigger: 'item',
                                               
                                               formatter: function loadData(result){//回调函数，参数params具体格式参加官方API
                                                var test = null; 
                                                var jd = null;      
                                                if(result.value<1){
                                                    test = '五颗星';
                                                    jd = result.name
                                                }else if(result.value>1&result.value<=10){
                                                    test = '四颗星';
                                                }else if(result.value>10&result.value<100){
                                                    test = "三颗星";
                                                }else {
                                                    test = "不推荐";
                                                }
                                                return  result.name + '<br />数据:' + result.value +'<br />旅游指数:'+test;
                                               }
                                            // text:'lee',
                                            // triggerOn = 'mousemove',
                                            
                                           },
                                           dataRange:{
                                            min:0,  
                                            max:100,  
                                            splitNumber:0,
                                            text:['高','低'],  
                                            realtime:true,
                                            calculable:true,
                                            selectedMode:true,
                                            realtime:true,
                                            show:true,
                                            itemWidth:20,
                                            itemHeight:100,
                                            color:['lightskyblue','#f2f2f2']
                                     }, 
                                           title:{
                                               text:selectCity+'数据总览',
                                               //subtext:'',
                                               x:'center',
                                               y:'top',
                                               textAlign:'left'
                                           },
                                           series: [{
                                               type: 'map',
                                               map: selectCity ,//要和echarts.registerMap（）中第一个参数一致
                                               scaleLimit: { min: 0.8, max: 1.9 },//缩放
                                                mapLocation:{  
                                                   y:60  
                                               },  
                                               itemSytle:{  
                                                   emphasis:{label:{show:false}}  
                                               }, 
                                               label: {
                                                   normal: {
                                                       show: true
                                                   },
                                                   emphasis: {
                                                       show: true
                                                   }
                                               },
                                               data : [
                                                   {name:'三元区',value:"5"},
                                                   {name:'将乐县',value:'100'},
                                                   {name:'永安市',value:'10'},
                                                   {name:'大田县',value:'30'},
                                                   {name:'沙县',value:'0'},
                                                   {name:'梅列区',value:'0'},
                                                   {name:'明溪县',value:'100'},
                                                   {name:'宁化县',value:'0'},
                                                   {name:'建宁县',value:'50'},
                                                   {name:'泰宁县',value:'15'},
                                                   {name:'尤溪县',value:'15'},  
                                                   {name:'清流县',value:'100'}
                                                ]//dataParam//人口数据：例如[{name:'济南',value:'100万'},{name:'菏泽'，value:'100万'}......]
                                           }]
                                       })
                                         myChartCity.on('click',function(rel){
                                             setTimeout(function () { 
                                                  $('#cont_pro_map').css('display','block');
                                                  $('#cont_city_map').css('display','none');
                                           }, 500);
                                             
                                         })
                                     });
                                   
                           })
                         });
                   });
               });
           });