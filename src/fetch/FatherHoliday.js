import axios from "axios";
import qs from "qs";

export const login = async () => {
  const loginData = qs.stringify({
    action: "login",
    username: "54410",
    password: "***REMOVED***",
    Submit: "++%BDT%A9w++",
  });
  const loginConfig = {
    method: "post",
    url: "https://www.kmb.org.hk/login/Login.php",
    maxRedirects: 0,
    validateStatus: function (status) {
      return status >= 200 && status < 303;
    },
    data: loginData,
  };
  const loginRes = await axios(loginConfig);

  console.log(loginRes);

  // const authCookie = loginRes.headers["set-cookie"][4];
  // const authStr = authCookie.substring(
  //   authCookie.indexOf("=") + 1,
  //   authCookie.lastIndexOf(";")
  // );
  // const phpSessionCookie = loginRes.headers["set-cookie"][2];
  // const phpSessionStr = phpSessionCookie.substring(
  //   phpSessionCookie.indexOf("=") + 1,
  //   phpSessionCookie.lastIndexOf(";")
  // );
  // const autoLoginConfig = {
  //   method: "get",
  //   url: "https://www.kmb.org.hk/kmbhr/autoLogin.php?op=login",
  //   headers: {
  //     Cookie:
  //       "AL_lang=chi; KMBHR_lang=chi; xoops_login=54410; kmb_msg=0; switchmenu=; PHPSESSID=" +
  //       phpSessionStr +
  //       "; auth_xoops_session_id=" +
  //       authStr +
  //       "; counter_png=1",
  //   },
  // };
  // const autoLoginRes = await axios(autoLoginConfig);
  // const dutyConfig = {
  //   method: "get",
  //   url: "https://www.kmb.org.hk/kmbhr/drs/dutyroster.php",
  //   headers: {
  //     Cookie:
  //       "AL_lang=chi; KMBHR_lang=chi; xoops_login=54410; kmb_msg=0; switchmenu=; PHPSESSID=" +
  //       phpSessionStr +
  //       "; auth_xoops_session_id=" +
  //       authStr +
  //       "; counter_png=1",
  //   },
  //   responseType: "arraybuffer",
  //   transformResponse: [
  //     function (data) {
  //       const iconv = require("iconv-lite");
  //       return iconv.decode(Buffer.from(data), "big5");
  //     },
  //   ],
  // };

  // try {
  //   const dutyRes = await axios(dutyConfig);
  //   const $ = cheerio.load(dutyRes.data);
  //   const table = $("table[bgcolor=#C6C6FF][width=1000]");
  //   const $filterText = table.find("font[color=#FF0000]").filter(function () {
  //     return $(this).text().includes("星期");
  //   });

  //   const $dates = $filterText.map(function (index, elem) {
  //     return $(elem).text();
  //   });

  //   const dates = [];

  //   $dates.each(function (i, date) {
  //     dates.push(date);
  //   });

  //   return dates;
  // } catch (error) {
  //   if (error.loginRes) {
  //     console.log(error.loginRes.data);
  //     console.log(error.loginRes.status);
  //     console.log(error.loginRes.headers);
  //   } else if (error.request) {
  //     console.log(error.request);
  //   } else {
  //     console.log("Error", error.message);
  //   }
  //   console.log(error.config);
  // }
};
