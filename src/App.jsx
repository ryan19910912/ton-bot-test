import { useState, useEffect } from 'react'
import './App.css'

function App() {

  const [params, setParams] = useState({});
  const [responseData, setResponseData] = useState(null);

  useEffect(() => {
    const parseHashAndLogin = async () => {
      // Get the hash and remove the leading '#'
      const hash = window.location.hash.substring(1);

      // Create a URLSearchParams instance from the hash string
      const searchParams = new URLSearchParams(hash);

      // Convert the URLSearchParams to a plain object
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

      callBeDataObject.telegramUserData.queryId = tgWebAppDataObject["query_id"];
      callBeDataObject.telegramUserData.id = tgWebAppDataObject["id"];
      callBeDataObject.telegramUserData.authDate = tgWebAppDataObject["auth_date"];
      callBeDataObject.telegramUserData.hash = tgWebAppDataObject["hash"];
      callBeDataObject.telegramUserData.firstName = tgWebAppDataObject["first_name"];

      callBeDataObject.telegramUserData.lastName = tgWebAppDataObject["last_name"] == undefined ? null : tgWebAppDataObject["last_name"];
      console.log("tgWebAppDataObject[username] = "+ tgWebAppDataObject["username"]);
      callBeDataObject.telegramUserData.userName = tgWebAppDataObject["username"] == undefined ? null : tgWebAppDataObject["username"];
      callBeDataObject.telegramUserData.languageCode = tgWebAppDataObject["language_code"] == undefined ? null : tgWebAppDataObject["language_code"];
      callBeDataObject.telegramUserData.allowsWriteToPm = tgWebAppDataObject["allows_write_to_pm"] == undefined ? null : tgWebAppDataObject["allows_write_to_pm"];
      callBeDataObject.telegramUserData.photoUrl = tgWebAppDataObject["photo_url"] == undefined ? null : tgWebAppDataObject["photo_url"];
      callBeDataObject.telegramUserData.isPremium = tgWebAppDataObject["is_premium"] == undefined ? null : tgWebAppDataObject["is_premium"];
      callBeDataObject.telegramUserData.isBot = tgWebAppDataObject["is_bot"] == undefined ? null : tgWebAppDataObject["is_bot"];
      callBeDataObject.telegramUserData.addedToAttachmentMenu = tgWebAppDataObject["added_to_attachment_menu"] == undefined ? null : tgWebAppDataObject["added_to_attachment_menu"];

      // Update state with parsed parameters
      setParams(tgWebAppDataObject);

      console.log(callBeDataObject);

      // login
      const response = await fetch('http://127.0.0.1:8080/web/v1/user/oauth-login', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'lang': 'tw'
        },
        body: JSON.stringify(callBeDataObject),
      });

      if (!response.ok) {
        console.error('Network response was not ok');
      } else {
        const result = await response.json();
        setResponseData(result);
      }
    };

    // Parse hash and login on component mount
    parseHashAndLogin();

    // Add event listener to handle hash changes
    window.addEventListener('hashchange', parseHashAndLogin);

    // Clean up event listener on component unmount
    return () => {
      window.removeEventListener('hashchange', parseHashAndLogin);
    };
  }, []);

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
