import { NextRequest } from 'next/server';
import { google } from 'googleapis';
import { Readable } from 'stream';
import { supabaseServer } from '@/lib/supabaseServer';

// 使用 Node.js runtime，确保 Buffer、stream 等可用
export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const bucket: string = body.bucket || 'videos';
    const path: string | undefined = body.path;
    const title: string | undefined = body.title;
    const description: string | undefined = body.description;

    if (!path) {
      return new Response(JSON.stringify({ error: 'path is required' }), {
        status: 400,
      });
    }

    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;

    if (!clientId || !clientSecret || !refreshToken) {
      return new Response(
        JSON.stringify({ error: 'Missing Google OAuth env vars' }),
        { status: 500 }
      );
    }

    // 从 Supabase Storage 生成临时下载链接
    const { data: signed, error: signedError } = await supabaseServer
      .storage
      .from(bucket)
      .createSignedUrl(path, 60 * 30);

    if (signedError || !signed?.signedUrl) {
      console.error('createSignedUrl error:', signedError);
      return new Response(
        JSON.stringify({ error: 'Failed to create signed URL' }),
        { status: 500 }
      );
    }

    const fileRes = await fetch(signed.signedUrl);
    if (!fileRes.ok) {
      console.error('fetch file error:', fileRes.status, await fileRes.text());
      return new Response(
        JSON.stringify({ error: 'Failed to download file from Supabase' }),
        { status: 500 }
      );
    }

    const arrayBuffer = await fileRes.arrayBuffer();
    const fileBuffer = Buffer.from(arrayBuffer);
    const fileStream = Readable.from(fileBuffer);

    // 配置 YouTube OAuth 客户端
    const oauth2Client = new google.auth.OAuth2(clientId, clientSecret);
    oauth2Client.setCredentials({ refresh_token: refreshToken });

    const youtube = google.youtube({ version: 'v3', auth: oauth2Client });

    const uploadResponse = await youtube.videos.insert({
      part: ['snippet', 'status'],
      requestBody: {
        snippet: {
          title: title || 'Supabase video upload',
          description: description || 'Uploaded from Supabase Storage',
        },
        status: {
          privacyStatus: 'unlisted',
        },
      },
      media: {
        // googleapis 推荐使用 Readable 流进行媒体上传
        body: fileStream,
      },
    });

    const videoId = uploadResponse.data.id;

    return new Response(
      JSON.stringify({
        id: videoId,
        url: videoId ? `https://www.youtube.com/watch?v=${videoId}` : null,
      }),
      { status: 200 }
    );
  } catch (error: any) {
    const details = {
      message: error?.message,
      responseData: error?.response?.data,
      errors: error?.errors,
    };
    console.error('YouTube upload error:', details);

    // 在响应中返回更详细的信息，方便前端调试
    return new Response(
      JSON.stringify({
        error: 'YouTube upload failed',
        details,
      }),
      { status: 500 }
    );
  }
}
