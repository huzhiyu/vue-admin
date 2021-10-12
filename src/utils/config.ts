/**
 * 项目配置模块
 */
const config = (() => {
  const _env = process.env.NODE_ENV === "development" ? "dev" : "prod";
  const url = {
    dev: "http://wthrcdn.etouch.cn", // `http://${location.host}`,
    prod: "http://wthrcdn.etouch.cn"
  };
  return {
    /** 请求超时毫秒 */
    get requestOvertime() {
      return 8000;
    },
    /** `api`请求域名 */
    get apiUrl() {
      return url[_env];
    },
    /** 当前环境模式 */
    get env() {
      return _env;
    }
  };
})();

export default config;
