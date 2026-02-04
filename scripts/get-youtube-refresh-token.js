const { google } = require('googleapis');
const dotenv = require('dotenv');
const readline = require('readline');

// 从 .env.local 读取 GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET
dotenv.config({ path: '.env.local' });

const clientId = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

if (!clientId || !clientSecret) {
  console.error('请先在 .env.local 中配置 GOOGLE_CLIENT_ID 和 GOOGLE_CLIENT_SECRET');
  process.exit(1);
}

async function main() {
  // Desktop 应用可以使用 out-of-band 重定向方式，手动输入 code
  const oauth2Client = new google.auth.OAuth2(
    clientId,
    clientSecret,
    'urn:ietf:wg:oauth:2.0:oob'
  );

  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/youtube.upload'],
    prompt: 'consent',
  });

  console.log('\n1. 在浏览器中打开下面这个链接，登录你的 YouTube 账号并点击允许：\n');
  console.log(authUrl);

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question('\n2. 授权完成后，Google 会给你一个 code，把它复制粘贴到这里回车：\ncode: ', async (code) => {
    rl.close();
    try {
      const { tokens } = await oauth2Client.getToken(code.trim());
      console.log('\n获取到的 tokens:\n');
      console.log(JSON.stringify(tokens, null, 2));

      if (tokens.refresh_token) {
        console.log('\n请把下面这一行复制到 .env.local 中的 GOOGLE_REFRESH_TOKEN= 后面：\n');
        console.log(tokens.refresh_token);
      } else {
        console.log('\n没有拿到 refresh_token，请确认你在授权时勾选了相关权限，并且 access_type=offline。');
      }
    } catch (err) {
      console.error('获取 tokens 失败:', err.response?.data || err.message);
    }
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
