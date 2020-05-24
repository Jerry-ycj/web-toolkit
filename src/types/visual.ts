import { isNumber, isArray, generateID } from '../utils';

export interface VisualConfiguration {
  id: string;
  width: number;
  height: number;
  cells: VisualCell[];
  background?: string;
}
export interface IVisualCell {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  data: any;
}
export type Coordinate = [number, number];
export class VisualCell implements IVisualCell {
  static fromJSON(json: IVisualCell) {
    const cell = new VisualCell().setData(json.data).setSize(json.width, json.height).setCoord([json.x, json.y]);
    cell.id = json.id;
    return cell;
  }
  id!: string;
  x: number = 30;
  y: number = 30;
  width: number = 0;
  height: number = 0;
  data: any;
  constructor(coord?: Coordinate)
  constructor(x: number, y: number)
  constructor(x?: number | Coordinate, y?: number) {
    if (isNumber(x) && isNumber(y)) {
      this.x = x;
      this.y = y;
    } else if (isCoordinate(x)) {
      this.x = x[0];
      this.y = x[1];
    }
    this.id = generateID();
  }
  setCoord(coord: Coordinate) {
    this.x = coord[0];
    this.y = coord[1];
    return this;
  }
  setData(data: any) {
    this.data = data;
    return this;
  }
  setSize(width: number, height: number) {
    this.width = width;
    this.height = height;
    return this;
  }
}
function isCoordinate(coord: any): coord is Coordinate {
  return isArray(coord) && isNumber(coord[0]) && isNumber(coord[1]) && coord.length === 2;
}
