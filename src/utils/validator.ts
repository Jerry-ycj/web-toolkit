import { Message } from 'element-ui';

export function validateDateRange(range?: Date[]) {
  if (!range || !range[0] || !range[1]) {
    Message.error('请选择时间范围');
    throw new Error('请选择时间范围');
  }
  if (range[1] < range[0]) {
    Message.error('开始时间必须小于结束时间');
    throw new Error('开始时间必须小于结束时间');
  }
}
