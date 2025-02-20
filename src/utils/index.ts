import { JavaScriptTypes, NumberSymbols } from "@/types";

/**
 * 检测类型
 * @param target 检测的目标
 */
export const checkType = (target: any) => {
  const value: string = Object.prototype.toString.call(target);
  const result = (value.match(/\[object (\S*)\]/) as RegExpMatchArray)[1];
  return result.toLocaleLowerCase() as JavaScriptTypes;
};

/**
 * 修改属性值-只修改之前存在的值
 * @param target 修改的目标
 * @param value 修改的内容
 */
export const modifyData = <T>(target: T, value: T) => {
  for (const key in value) {
    if (Object.prototype.hasOwnProperty.call(target, key)) {
      // target[key] = value[key];
      // 需要的话，深层逐个赋值
      if (checkType(target[key]) === "object") {
        modifyData(target[key], value[key]);
      } else {
        target[key] = value[key];
      }
    }
  }
};

/**
 * 设置属性值-之前不存在的值也根据传入的`value`值去设置
 * @param target 设置的目标
 * @param value 设置的内容
 */
export const setData = <T>(target: T, value: T) => {
  for (const key in value) {
    target[key] = value[key];
  }
};

/**
 * 格式化日期
 * @param value 指定日期
 * @param format 格式化的规则
 * @example
 * ```js
 * formatDate();
 * formatDate(1603264465956);
 * formatDate(1603264465956, "h:m:s");
 * formatDate(1603264465956, "Y年M月D日");
 * ```
 */
export const formatDate = (value: string | number | Date = Date.now(), format = "Y-M-D h:m:s") => {
  const formatNumber = (n: number) => `0${n}`.slice(-2);
  const date = new Date(value);
  const formatList = ["Y", "M", "D", "h", "m", "s"];
  const resultList = [];
  resultList.push(date.getFullYear().toString());
  resultList.push(formatNumber(date.getMonth() + 1));
  resultList.push(formatNumber(date.getDate()));
  resultList.push(formatNumber(date.getHours()));
  resultList.push(formatNumber(date.getMinutes()));
  resultList.push(formatNumber(date.getSeconds()));
  for (let i = 0; i < resultList.length; i++) {
    format = format.replace(formatList[i], resultList[i]);
  }
  return format;
};

/**
 * 点击复制
 * @param text 复制的内容
 * @param success 成功回调
 * @param fail 出错回调
 */
export const copyText = (text: string, success?: () => void, fail?: (res: string) => void) => {
  text = text.replace(/(^\s*)|(\s*$)/g, "");
  if (!text) {
    fail && fail("复制的内容不能为空！");
    return;
  }
  const id = "the-clipboard";
  let clipboard = (document.getElementById(id) as HTMLTextAreaElement);
  if (!clipboard) {
    clipboard = document.createElement("textarea");
    clipboard.id = id;
    clipboard.readOnly = true;
    clipboard.style.cssText = "font-size: 15px; position: fixed; top: -1000%; left: -1000%;";
    document.body.appendChild(clipboard);
  }
  clipboard.value = text;
  clipboard.select();
  clipboard.setSelectionRange(0, clipboard.value.length);
  const state = document.execCommand("copy");
  if (state) {
    success && success();
  } else {
    fail && fail("复制失败");
  }
};

/**
 * 输入只能是数字
 * @param value
 * @param decimal 是否要保留小数
 * @param negative 是否可以为负数
 */
export const inputOnlyNumber = (value: string | number, decimal?: boolean, negative?: boolean) => {
  let result = value.toString().trim();
  if (result.length === 0) return "";
  const minus = (negative && result[0] == "-") ? "-" : "";
  if (decimal) {
    result = result.replace(/[^0-9.]+/ig, "");
    let array = result.split(".");
    if (array.length > 1) {
      result = array[0] + "." + array[1];
    }
  } else {
    result = result.replace(/[^0-9]+/ig, "");
  }
  return minus + result;
};

/**
 * `JSON`转`FormData`
 * @param params `JSON`对象
 * @example
 * ```js
 * const info = { name: "hjs", id: 123 };
 * const val = jsonToFormData(info);
 * console.log(val); // "name=hjs&id=123"
 * ```
 */
export const jsonToFormData = (params: { [key: string]: number | string | boolean }) => {
  let result = "";
  for (const key in params) {
    result += `&${key}=${params[key]}`;
  }
  return result.slice(1);
};

/**
 * 数字运算（主要用于小数点精度问题）
 * [see](https://juejin.im/post/6844904066418491406#heading-12)
 * @param a 前面的值
 * @param type 计算方式
 * @param b 后面的值
 * @example
 * ```js
 * // 可链式调用
 * const res = computeNumber(1.3, "-", 1.2).next("+", 1.5).next("*", 2.3).next("/", 0.2).result;
 * console.log(res);
 * ```
 */
export const computeNumber = (a: number, type: NumberSymbols, b: number) => {
  /**
   * 获取数字小数点的长度
   * @param n 数字
   */
  const getDecimalLength = (n: number) => {
    const decimal = n.toString().split(".")[1];
    return decimal ? decimal.length : 0;
  };

  /**
   * 修正小数点
   * @description 防止出现 `33.33333*100000 = 3333332.9999999995` && `33.33*10 = 333.29999999999995` 这类情况做的处理
   * @param n 数字
   * @param precision
   */
  const amend = (n: number, precision = 15) => parseFloat(Number(n).toPrecision(precision));
  const power = Math.pow(10, Math.max(getDecimalLength(a), getDecimalLength(b)));
  let result = 0;
  a = amend(a * power);
  b = amend(b * power);
  switch (type) {
    case "+":
      result = (a + b) / power;
      break;
    case "-":
      result = (a - b) / power;
      break;
    case "*":
      result = (a * b) / (power * power);
      break;
    case "/":
      result = a / b;
      break;
  }
  result = amend(result);
  return {
    /** 计算结果 */
    result,
    /**
     * 继续计算
     * @param nextType 继续计算方式
     * @param nextValue 继续计算的值
     */
    next(nextType: NumberSymbols, nextValue: number) {
      return computeNumber(result, nextType, nextValue);
    }
  };
};

/**
 * 判断是否外部链接
 * @param path 路径
 */
export const isExternal = (path: string) => {
  return /^(https?:|mailto:|tel:)/.test(path);
};
