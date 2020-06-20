import { EChartOption } from 'echarts';
import { formatMilliseconds, formatTime, deepMerge, pascalToCamel } from '.';
import { isString } from '.';

interface FlatEchartOption extends EChartOption {
  [key: string]: any;
}
/**
 * 使EchartOption扁平化，x、y开头的属性分别映射到xAxis、yAxis中，top、right、bottom、left映射到grid中
 * 注意：扁平属性会覆盖已存在的嵌套属性
 * @param option
 */
export function nestOption(option: FlatEchartOption) {
  const xAxis: Record<string, any> = {};
  const yAxis: Record<string, any> = {};
  const grid: Record<string, any> = {};
  const gridKeys = ['top', 'bottom', 'right', 'left'];
  const reg = /^[xy]/;
  for (const [key, val] of Object.entries(option)) {
    if (key.startsWith('x') && key !== 'xAxis') {
      xAxis[pascalToCamel(key.replace(reg, ''))] = val;
      delete option[key];
    } else if (key.startsWith('y') && key !== 'yAxis') {
      yAxis[pascalToCamel(key.replace(reg, ''))] = val;
      delete option[key];
    } else if (gridKeys.includes(key)) {
      grid[key] = val;
      delete option[key];
    }
  }
  const nested: EChartOption = { ...option };
  const keys = Object.keys;
  if (keys(xAxis).length > 0) {
    nested.xAxis = xAxis;
  }
  if (keys(yAxis).length > 0) {
    nested.yAxis = yAxis;
  }
  if (keys(grid).length > 0) {
    nested.grid = grid;
  }
  return nested;
}

interface ITimelineConfigTimes {
  status: string | {
    color: string;
    arrName: string;
  };
  dt: string;
  duration: number;
}
export function timelineConfig(times: ITimelineConfigTimes[], statusMap: any, param: {
  left?: string | number;
  top?: number;
  height?: number
  dataZoom?: boolean;
  dataZoomTop?: number;
  showTime?: boolean;
  fontSize?: number;
  confine?: boolean;
}) {
  const top = param.top || 10;
  const left = param.left || 20;
  const height = param.height || 50;
  const data2 = times.map((x) => ({
    name: isString(x.status) ? statusMap(x.status).arrName : x.status.arrName,
    value: [
      new Date(x.dt).getTime(),
      new Date(x.dt).getTime() + x.duration,
      x.duration,
    ],
    itemStyle: {
      normal: {
        color: isString(x.status) ? statusMap(x.status).color : x.status.color,
      },
    },
  }));
  const option: any = {
    tooltip: {
      formatter(params: any) {
        let dt = new Date(params.value[0]);
        const from = (dt.getMonth() + 1) + '-' + dt.getDate() + ' ' + formatTime(dt);
        dt = new Date(params.value[1]);
        const to = (dt.getMonth() + 1) + '-' + dt.getDate() + ' ' + formatTime(dt);
        return params.marker + params.name + '<br />'
          + 'from: ' + from + '<br/>'
          + 'to: ' + to + '<br/>'
          + formatMilliseconds(parseInt((params.value[2])));
      },
      extraCssText: 'text-align:left',
      confine: param.confine,
    },
    grid: {
      height,
      top, bottom: top,
      left, right: left,
    },
    xAxis: {
      show: true,
      type: 'time',
      axisLine: {
        lineStyle: {
          color: getColor(),
        },
      },
      axisLabel: {
        formatter(params: any) {
          const dt = new Date(params);
          let h = dt.getHours().toString();
          if (parseInt(h) < 10) { h = '0' + h; }
          let m = dt.getMinutes().toString();
          if (parseInt(m) < 10) { m = '0' + m; }
          return h + ':' + m;
        },
      },
    },
    yAxis: {
      show: false,
    },
    dataZoom: [{
      type: 'slider',
      filterMode: 'weakFilter',
      showDataShadow: false,
      top: param.dataZoomTop ? param.dataZoomTop : (top + 70),
      height: 8,
      borderColor: 'transparent',
      backgroundColor: '#e2e2e2',
      handleIcon: 'M10.7,11.9H9.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4h1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7v-1.2h6.6z M13.3,22H6.7v-1.2h6.6z M13.3,19.6H6.7v-1.2h6.6z', // jshint ignore:line
      handleSize: 20,
      handleStyle: {
        shadowBlur: 6,
        shadowOffsetX: 1,
        shadowOffsetY: 2,
        shadowColor: '#aaa',
      },
      labelFormatter: '',
    }, {
      type: 'inside',
      filterMode: 'weakFilter',
    }],
    series: [{
      type: 'custom',
      renderItem(params: any, api: any) {
        return {
          type: 'rect',
          shape: {
            x: api.coord([api.value(0)])[0],
            y: top + 5,
            width: api.size([api.value(2)])[0],
            height: height / 10 * 8,
          },
          style: api.style(),
        };
      },
      encode: {
        x: [0, 1],
        y: 2,
        tooltip: [0, 1, 2],
        itemName: 3,
      },
      data: data2,
    }],
  };
  if (!param.dataZoom) {
    option.dataZoom = undefined;
  }
  if (!param.showTime) {
    (option.xAxis as EChartOption.XAxis).show = false;
  }
  if (param.fontSize) {
    option.xAxis.axisLabel.fontSize = param.fontSize;
  }
  return option;
}
export function timesPieConfig(summaryTime: any, param: any, statusMap: any) {
  const times = Object.keys(summaryTime).filter((status) => summaryTime[status] !== 0);
  const selected = ['working', 'run_gap', 'debug'];
  const data = times.map((status) => ({
    value: summaryTime[status],
    name: statusMap(status) ? statusMap(status).arrName : '',
    itemStyle: { normal: { color: statusMap(status) ? statusMap(status).color : '' } },
    selected: selected.includes(status),
  }));
  const option: EChartOption = {
    tooltip: {
      trigger: 'item',
      formatter(params) {
        const { name, value, percent } = params as EChartOption.Tooltip.Format;
        const val = value as number;
        return name + '<br />'
          + formatMilliseconds(val) + ' (' + percent + '%) ';
      },
    },
    grid: {
      height: 80,
      top: 0, bottom: 0,
      left: '10%', right: '10%',
    },
    series: [
      {
        type: 'pie',
        radius: [0, '50%'],
        center: ['50%', '50%'],
        data,

        itemStyle: {
          emphasis: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
      },
    ],
  };
  if (param) {
    // @ts-ignore
    if (param.top) { option.grid.top = param.top; }
    // @ts-ignore
    if (param.height) { option.grid.height = param.height; }
  }
  return option;
}
export function lineChartConfig(param: any[]) {
  const t: any[] = [], x: any[] = [];
  param.forEach((p) => {
    t.push(p.type);
    x.push(p.x);
  });
  const arr: any[] = [];
  t.forEach(function(e, i, t) {
    if (t.indexOf(e) === i) {
      arr.push(e);
    }
  });

  const list2: any[] = [];
  arr.forEach((a) => {
    list2.push({type: a, data: []});
  });
  param.forEach((p) => {
    list2.forEach((l) => {
      if (p.type === l.type) {
        l.data.push([p.x, p.y]);
      }
    });
  });

  const option: any = {
    tooltip: {
      trigger: 'axis',
    },
    color: getColors(),
    legend: {
      data: arr,
      right: 100,
      top: 30,
      textStyle: {
        color: getColor(),
        fontSize: 16,
      },
    },
    toolbox: {
      feature: {
        saveAsImage: {},
      },
    },
    calculable: true,
    xAxis: {
      type: 'category',
      name: '日期',
      data: x,
      nameGap: 2,
      nameTextStyle: {
        color: getColor(),
        fontSize: 14,
      },
      splitLine: {
        show: false,
      },
      axisLine: {
        lineStyle: {
          color: getColor(),
        },
      },
    },
    yAxis: {
      type: 'value',
      name: '个',
      nameTextStyle: {
        color: getColor(),
        fontSize: 16,
      },
      axisLine: {
        lineStyle: {
          color: getColor(),
        },
      },
      splitLine: {
        show: false,
      },
    },
    series: [],
  };
  list2.forEach((l) => {
    const base: any = {
      name: '',
      type: 'line',
      stack: '总量',
      symbolSize: 8,
      smooth: true,
      lineStyle: {
        width: 4,
      },
      data: [],
    };
    base.name = l.type;
    const p: any[] = [];
    l.data.forEach((d: any) => p.push(d));
    base.data = p;
    option.series.push(base);
  });
  // chart.setOption(option,true);
  return option;
}

interface ILineConfigData {
  x: string[];
  y: Array<EChartOption.SeriesLine | EChartOption.SeriesBar | EChartOption.SeriesPie>;
}
/**
 * 折线图：x:[], y:[ {name:xx,data:[]} ]
 * y 代表多条曲线，每条曲线参数值data
 * 参数表param：
 *  type：图形类型 默认line，bar
 *
 */
export function lineConfig(data: ILineConfigData, param: FlatEchartOption = {}) {
  const type = param && param.series && param.series[0].type || 'line';
  param = nestOption(param);
  const option: any = {
    tooltip : {
      trigger: 'axis',
      axisPointer : {            // 坐标轴指示器，坐标轴触发有效
        type : type === 'bar' ? 'shadow' : 'line', // 默认为直线，可选为：'line' | 'shadow'
      },
    },
    color: getColors(),
    grid: {
      top: param && param.legend ? '7%' : '15%',
      left: '3%',
      right: '3%',
      bottom: '5%',
      containLabel: true,
    },
    yAxis: {
      nameGap: 8,
      type: 'value',
      axisLine: {
        lineStyle: {
          color: getColor(),
        },
      },
      max(value: any) {
        if (value.max === 0) { return 5; }
        return value.max;
        // return value.max - 20;
      },
    },
    xAxis: {
      nameGap: 8,
      type: 'category',
      data: data.x,
      axisLine: {
        lineStyle: {
          color: getColor(),
        },
      },
      axisLabel: {
        interval: 0, // 横轴信息全部显示
        rotate: 0, // -30度角倾斜显示
      },
      axisTick: {
        alignWithLabel: true,
      },
    },
    series: [],
  };
  const names: any[] = [];
  data.y.forEach((serie: EChartOption.SeriesLine | EChartOption.SeriesBar) => {
    names.push(serie.name);
    const obj: any = {
      type,
      ...serie,
    };
    // 设置最大柱宽
    if (type === 'bar') {
      obj.barMaxWidth = '55';
    }
    option.series.push(obj);
  });
  if (data.y.length > 1) {
    option.legend = {
      data: names,
      textStyle: {
        color: getColor('legend'),
      },
    };
  }
  deepMerge(option, param);
  return option;
}

interface ILineConfigOfTimeParams {
  color?: string[];
  formatter?: string | ((params: any, ticket?: string, cb?: (ticket: string, html: string) => any) => string);
  left?: string | number;
  legend?: boolean;
  top?: string | number;
  t_formatter?: string | ((params: any, ticket?: string, cb?: (ticket: string, html: string) => any) => string);
  timeMin?: number | string;
  timeMax?: number | string;
  yname?: string;
  y_formatter?: string | ((value: string | number, index: number) => string);
  y_minInterval?: number;
  y_max?: number | string;
  y_axisLabel?: object;
}
/** data: {name, y:[[],[]]} */
export function lineConfigOfTime(
  data: {
    name: string[];
    y: Array<Array<number | number[]>>;
  },
  param: ILineConfigOfTimeParams = {}) {
  const option: any = {
    tooltip : {
      trigger: 'axis',
      axisPointer : {            // 坐标轴指示器，坐标轴触发有效
        type : 'line',        // 默认为直线，可选为：'line' | 'shadow'
      },
    },
    toolbox: {
      feature: {
        restore: {
          title: '还原',
          iconStyle: {
            borderColor: getColor(),
          },
        },
        // dataZoom: {
        //   iconStyle: {
        //     borderColor: getColor(),
        //   },
        //   title: {
        //     zoom: '缩放',
        //     back: '还原',
        //   },
        // },
        // saveAsImage: {
        //   name: param.nameFull,
        //   backgroundColor:getColor(saveImg'),
        //   iconStyle:{
        //     borderColor:getColor()
        //   }
        // },
      },
    },
    dataZoom: [
      {
        type: 'inside',
        filterMode: 'weakFilter',
      },
    ],
    color: getColors(),
    grid: {
      top: '15%',
      left: '3%',
      right: '3%',
      bottom: '5%',
      containLabel: true,
    },
    yAxis:  {
      type: 'value',
      axisLine: {
        lineStyle: {
          color: getColor(),
        },
      },
      // max: function(value) {
      //   if (value.max===0) return 5;
      //   return value.max;
      //   // return value.max - 20;
      // }
    },
    xAxis: {
      min: param.timeMin,
      max: param.timeMax,
      type: 'time',
      name: '时间',
      nameGap: 2,
      nameTextStyle: {
        color: getColor(),
        fontSize: 14,
      },
      splitLine: {
        show: false,
      },
      axisLine: {
        lineStyle: {
          color: getColor(),
        },
      },
    },
    series: [ ],
  };
  for (const [index, name] of data.name.entries()) {
    option.series.push({
      name,
      type: 'line',
      data: data.y[index],
    });
  }
  if (data.y.length > 1) {
    option.legend = {
      data: data.name,
      textStyle: {
        color: getColor('legend'),
      },
    };
  }
  if (!option.legend) {
    option.grid.top = '7%';
  }
  if (param.legend === false) {
    option.legend = undefined;
  }
  if (param.formatter) {
    option.tooltip.formatter = param.formatter;
  }
  if (param.color) {
    option.color = param.color;
  }
  if (param.top) {
    option.grid.top = param.top;
  }
  if (param.left) {
    option.grid.left = param.left;
  }
  if (param.y_formatter) {
    option.yAxis.axisLabel = {
      formatter: param.y_formatter,
    };
  }
  if (param.t_formatter) {
    option.tooltip.formatter = param.t_formatter;
  }
  if (param.y_minInterval) {
    option.yAxis.minInterval = param.y_minInterval;
  }
  if (param.y_max) {
    option.yAxis.max = param.y_max;
  }
  if (param.yname) {
    option.yAxis.name = param.yname;
    option.yAxis.nameGap = 8;
  }
  if (param.y_axisLabel) {
    option.yAxis.axisLabel = Object.assign(option.yAxis.axisLabel || {}, param.y_axisLabel);
  }
  return option;
}

export function getColors() {
  if (process.env.VUE_APP_APP_THEME === 'theme_light') {
    return[
      '#0085dd',
      '#dd5757',
      '#00aa1f',
      '#fea249',
      '#4a9cdd',
      '#505bdd',
      '#9c58dd',
      '#c7568d',
      '#817f84',
    ];
  } else {
    return [
      '#5add2f',
      '#f1e92e',
      '#dd5757',
      '#fea249',
      '#4dddd3',
      '#4a9cdd',
      '#505bdd',
      '#9c58dd',
      '#c7568d',
      '#817f84',
    ];
  }
}

export function getColor(type?: string) {
  if (process.env.VUE_APP_APP_THEME === 'theme_light') {
    if (type === 'saveImg') {
      return 'white';
    }
    return '#262626';
  } else {
    if (type === 'saveImg') {
      return '#0a1931';
    } else if (type === 'legend') {
      return 'yellow';
    }
    return 'white';
  }
}

// 根据数据集计算上下限，比如用于y轴显示
export function calcMaxAndMin(yDateSet: number[]): number[] {
  if (!yDateSet || yDateSet.length === 0) { return [0, 1]; }
  if (isNaN(yDateSet[0])) {
    // throw Error('calcMaxAndMin的参数必须是number array');
    return [0, 1];
  }
  let ret = [];
  let max: null|number = null;
  let min: null|number = null;
  for (const e of yDateSet) {
    if (max === null || max < e) {
      max = e;
    }
    if (min === null || min > e) { min = e; }
  }
  if (max === min) { ret = [(max as number) + 1, (min as number) - 1]; } else {
    ret = [(min as number), (max as number)];
  }
  return ret;
}
