function update_dom(){
  let spans = document.getElementsByClassName('mySpan');
  spans[0].innerHTML = a;
  spans[1].innerHTML = b;
  spans[2].innerHTML = cal_alpha_d_a();
  spans[3].innerHTML = cal_alpha_d_b();
  spans[4].innerHTML = cal_d();
  spans[5].innerHTML = k;
}
function handle_button(){
  let buttons = document.getElementsByTagName('button');
  buttons[0].onclick = function(){
    console.log(1);
    sgd_iteration();
  }
  buttons[1].onclick = function(){
    for(var i=0;i<10;i++){
      sgd_iteration();
    }
  }
  buttons[2].onclick = (function (){
    var interval;
    var doing = false;
    return function(){
      if(doing){
        clearInterval(interval);
        doing = false;
        this.innerHTML = "定时执行梯度下降"
      }else{
        doing = true;
        this.innerHTML = '暂停定时执行';
        interval = setInterval(sgd_iteration, 1000);
      }
    }
  })();
  buttons[3].onclick = function(){
    for(var i=0;i<100;i++){
      sgd_iteration();
    }
  }

  document.getElementById('show').onclick = function showResult() {
    threeD.setOption(option);
  }
}
handle_button();

// 散点echarts数据
let series_scatter = {
  type: 'scatter',
  data: [
    {
      value: [3,1],
      label: {
        formatter: '(3,1)',
        show: true,
        position:[-10,-18],
        fontSize: 16,
      }
    },
    {
      value: [4,10],
      label: {
        formatter: '(4,10)',
        show: true,
        position:[-10,-18],
        fontSize: 16,
      }
    },
    {
      value: [7,8],
      label: {
        formatter: '(7,8)',
        show: true,
        position:[-10,-18],
        fontSize: 16,
      }
    },
    {
      value: [12,22],
      label: {
        formatter: '(12,22)',
        show: true,
        position:[-10,-18],
        fontSize: 16,
      }
    },
    {
      value: [18,5],
      label: {
        formatter: '(18,5)',
        show: true,
        position:[-10,-18],
        fontSize: 16,
      }
    },
    {
      value: [20,25],
      label: {
        formatter: '(20,25)',
        show: true,
        position:[-10,-18],
        fontSize: 16,
      }
    },
  ]
};
let a = 2;
let b = 10;

function linear_func(x, a=2,b=3){
  return a*x+b;
}
let data = [];
for(let i=0;i<6;i++){
  data.push([i*5,linear_func(i*5,a,b)]);
}

let series_linear = {
  type: 'line',
  data,
  showSymbol: false,
}

let linear = echarts.init(document.getElementById("linear"));

let opt = {
  title: {
    text: "梯度下降，线性回归-演示"
  },
  legend: {
    animation: false,
  },
  xAxis: {
    type: 'value',
    min: 0,
    max: 25,
    name: 'x',
  },
  yAxis: {
    type: 'value',
    name: 'y',
    min: 0,
    max: 30,
  },
  series: [
    series_linear,
    series_scatter
  ],
}
linear.setOption(opt);



// y=a*x+b
let sumy = 0;
let sumx = 0;
let sumxy = 0;
let sumx2 = 0;

let point = [[3,1],[4,10],[7,8],[12,22],[18,5],[20,25]];

for(let i = 0;i<point.length;i++){
  sumy+=point[i][1];
  sumx+=point[i][0];
  sumxy+=point[i][0]*point[i][1];
  sumx2+=point[i][0]*point[i][0];
}


function cal_d(){
  let sum=0;
  for(let i=0;i<point.length;i++){
    sum+=(point[i][1]-(a*point[i][0]+b))*(point[i][1]-(a*point[i][0]+b));
  }
  return sum;
}

function cal_alpha_d_a(){
  return -2*(sumxy-a*sumx2-b*sumx);
}

function cal_alpha_d_b(){
  return -2*(sumy-6*b-a*sumx);
}
let k=0;
function sgd_iteration(){
  let study = 0.001;
  if(k===0 || k===100 || k===500 || k===1000 || k===10 || k===2000){
    console.log(k);
    console.log("d",cal_d());
    console.log("alpha_d_a",cal_alpha_d_a());
    console.log("alpha_d_b",cal_alpha_d_b());
    console.log("a",a);
    console.log("b",b);
  }
  let temp_a,temp_b;
  temp_a=a-study*cal_alpha_d_a();
  temp_b=b-study*cal_alpha_d_b();
  a = temp_a;
  b = temp_b;
  data = [];
  for(let i=0;i<6;i++){
    data.push([i*5,linear_func(i*5,a,b)]);
  }
  series_linear.data = data;
  opt.series.series_linear = series_linear;
  linear.setOption(opt);
  update_dom();
  k++;
}
update_dom();
// setInterval(sgd_iteration, 1000)


let result_a;
function cal_a(){
  let sum=0;
  for(let i=0;i<point.length;i++){
    sum+=(point[i][1]-sumy/6)*(point[i][0]-sumx/6);
  }
  let sum2=0;
  for(let i=0;i<point.length;i++){
    sum2+=(point[i][0]-sumx/6)*(point[i][0]-sumx/6);
  }
  result_a = sum/sum2;
  return sum/sum2;
}
let result_b
function cal_b(){
  result_b=sumy/6-result_a*sumx/6;
  return result_b;
}


let option = {
  tooltip: {},
  backgroundColor: '#fff',
  visualMap: {
      show: false,
      dimension: 2,
      min: 300,
      max: 30000,
      inRange: {
          color: ['#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026']
      }
  },
  xAxis3D: {
      type: 'value',
      name: 'a',
  },
  yAxis3D: {
      type: 'value',
      name: 'b',
  },
  zAxis3D: {
      type: 'value',
      name: 'D',
      // min: 300,
      // max: 2000,
  },
  grid3D: {
      viewControl: {
          // projection: 'orthographic'
      }
  },
  series: [{
      type: 'surface',
      wireframe: {
          // show: false
      },
      equation: {
          x: {
              step: 0.05,
              min: -5,
              max: 5,
          },
          y: {
              step: 0.5,
              min: -5,
              max: 30,
          },
          z: function (a, b) {
            let sum=0;
            for(let i=0;i<point.length;i++){
              sum+=(point[i][1]-(a*point[i][0]+b))*(point[i][1]-(a*point[i][0]+b));
            }
            return sum;
          }
      }
  }]
}
let threeD = echarts.init(document.getElementById("threeD"));