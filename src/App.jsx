import { useState, useEffect } from 'react'
import './App.css'

function App() {

  const [params, setParams] = useState({});
  const [responseData, setResponseData] = useState(null);

  useEffect(() => {
    const parseHashAndLogin = async () => {

      console.log(window.location.search);
      console.log(window.location.hash);

      // Get the hash and remove the leading '#'
      const hash = window.location.hash.substring(1);

      const searchParams = new URLSearchParams(hash);

      const paramsObject = {};
      searchParams.forEach((value, key) => {
        paramsObject[key] = decodeURIComponent(decodeURIComponent(value));
      });

      const tgWebAppData = paramsObject["tgWebAppData"];
      const tgWebAppDataObject = {};

      const searchTgWebAppDataParams = new URLSearchParams(tgWebAppData);

      searchTgWebAppDataParams.forEach((value, key) => {
        try {
          // Attempt to parse JSON strings
          tgWebAppDataObject[key] = JSON.parse(value);
        } catch (e) {
          // If not JSON, just use the string value
          tgWebAppDataObject[key] = value;
        }
      });

      console.log(tgWebAppDataObject);

      const callBeDataObject = {};

      callBeDataObject.serviceProvider = 4;
      callBeDataObject.telegramUserData = {};

      callBeDataObject.telegramUserData.queryId = tgWebAppDataObject.query_id;
      callBeDataObject.telegramUserData.authDate = tgWebAppDataObject.auth_date;
      callBeDataObject.telegramUserData.hash = tgWebAppDataObject.hash;
      callBeDataObject.telegramUserData.id = tgWebAppDataObject.user.id;
      callBeDataObject.telegramUserData.firstName = tgWebAppDataObject.user.first_name;

      callBeDataObject.telegramUserData.lastName = tgWebAppDataObject.user.last_name == undefined ? null : tgWebAppDataObject.user.last_name;
      callBeDataObject.telegramUserData.userName = tgWebAppDataObject.user.username == undefined ? null : tgWebAppDataObject.user.username;
      callBeDataObject.telegramUserData.languageCode = tgWebAppDataObject.user.language_code == undefined ? null : tgWebAppDataObject.user.language_code;
      callBeDataObject.telegramUserData.allowsWriteToPm = tgWebAppDataObject.user.allows_write_to_pm == undefined ? null : tgWebAppDataObject.user.allows_write_to_pm;
      callBeDataObject.telegramUserData.photoUrl = tgWebAppDataObject.user.photo_url == undefined ? null : tgWebAppDataObject.user.photo_url;
      callBeDataObject.telegramUserData.isPremium = tgWebAppDataObject.user.is_premium == undefined ? null : tgWebAppDataObject.user.is_premium;
      callBeDataObject.telegramUserData.isBot = tgWebAppDataObject.user.is_bot == undefined ? null : tgWebAppDataObject.user.is_bot;
      callBeDataObject.telegramUserData.addedToAttachmentMenu = tgWebAppDataObject.user.added_to_attachment_menu == undefined ? null : tgWebAppDataObject.user.added_to_attachment_menu;

      setParams(tgWebAppDataObject);

      console.log(callBeDataObject);

      // login
      // const response = await fetch('http://127.0.0.1:8080/web/v1/user/oauth-login', {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'lang': 'tw'
      //   },
      //   body: JSON.stringify(callBeDataObject),
      // });

      // if (!response.ok) {
      //   console.error('Network response was not ok');
      // } else {
      //   const result = await response.json();
      //   setResponseData(result);
      // }

    };

    parseHashAndLogin();

    window.addEventListener('hashchange', parseHashAndLogin);

    return () => {
      window.removeEventListener('hashchange', parseHashAndLogin);
    };
  }, []);

  Telegram.WebApp.onReady(() => {
    // 设置后退按钮可见
    Telegram.WebApp.setBackButton({
      isVisible: true, // 设置后退按钮为可见
      text: "返回", // 按钮文本
      onClick: () => {
        console.log("后退按钮被点击");
        Telegram.WebApp.close(); // 关闭应用或返回上一步
      },
    });
  });

  return (
    <>
      <div>
        <h1>Hash Parameters:</h1>
        <pre>{JSON.stringify(params, null, 2)}</pre>
      </div>
      <div>
        <h1>Login Response:</h1>
        <pre>{JSON.stringify(responseData, null, 2)}</pre>
      </div>
    </>
  );
}

export default App
