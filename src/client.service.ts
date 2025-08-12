import { Injectable, Req, Res } from '@nestjs/common';
import { join } from 'path';
const fs = require('fs');
const path = require('path');

@Injectable()
export class ReactAppService {
  constructor() {}

  async getLatestResource() {
    const buildFolder = path.join(__dirname, '..', 'client', 'assets');

    const files = fs.readdirSync(buildFolder);
    const jsFile = files.find((file) => file.endsWith('.js'));
    const cssFile = files.find((file) => file.endsWith('.css'));
    return { jsFile, cssFile };
  }

  async serveSpa(@Req() req, @Res() res) {
    const url = req.url;

    const { jsFile, cssFile } = await this.getLatestResource();

    if (url.match(/^\/(assets|ico|images)\//)) {
      return res.sendFile(join(__dirname, '..', 'client', url));
    }

    await res.setHeader('Content-Type', 'text/html');
    await res.setHeader(
      'Cache-Control',
      'no-store, no-cache, must-revalidate, proxy-revalidate',
    );
    await res.setHeader('Pragma', 'no-cache');
    await res.setHeader('Expires', '0');
    await res.setHeader('Surrogate-Control', 'no-store');

    const html = `
    <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>RGT HWSS System</title>
          <script type="module" crossorigin src="/assets/${jsFile}"></script>
          <link rel="stylesheet" crossorigin href="/assets/${cssFile}">
        </head>
        <body>
          <div id="root"></div>
        </body>
      </html>
    `;

    res.send(html);
  }
}
