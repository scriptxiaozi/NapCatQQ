import express from 'express';
import { NextFunction, Request, Response } from 'express';
import { AuthHelper } from './src/helper/SignToken';
import { resolve } from 'node:path';
import { ALLRouter } from './src/router';
import { WebUiConfig } from './src/helper/config';
const app = express();
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { log } from '@/common/utils/log';


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * 初始化并启动WebUI服务。
 * 该函数配置了Express服务器以支持JSON解析和静态文件服务，并监听6099端口。
 * 无需参数。
 * @returns {Promise<void>} 无返回值。
 */
export async function InitWebUi() {
  const config = await WebUiConfig.GetWebUIConfig();
  if (config.port == 0) {
    log('[NapCat] [WebUi] Current WebUi is not run.');
    return;
  }
  app.use(express.json());
  // 初始服务
  // WebUI只在config.prefix所示路径上提供服务，可配合Nginx挂载到子目录中
  app.all(config.prefix + '/', (_req, res) => {
    res.json({
      msg: 'NapCat WebAPI is now running!',
    });
  });
  // 配置静态文件服务，提供./static目录下的文件服务，访问路径为/webui
  app.use(config.prefix + '/webui', express.static(resolve(__dirname, './static')));
  //挂载API接口
  app.use(config.prefix + '/api', ALLRouter);
  app.listen(config.port, config.host, async () => {
    log(`[NapCat] [WebUi] Current WebUi is running at http://${config.host}:${config.port}${config.prefix}`);
    log(`[NapCat] [WebUi] Login URL is http://${config.host}:${config.port}${config.prefix}/webui`);
    log(`[NapCat] [WebUi] Login Token is ${config.token}`);
  });
}
