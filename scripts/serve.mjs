import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, extname, join, sep, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const production=process.argv.includes('--dist');
const base=production?join(root,'dist'):root;
const port=Number(process.env.PORT||5173);
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.webp':'image/webp','.png':'image/png','.jpg':'image/jpeg','.json':'application/json; charset=utf-8'};
const server=createServer(async (req,res)=>{
 try {
  let pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
  if(pathname==='/')pathname='/index.html';
  const publicAsset=!production&&pathname.startsWith('/art/');
  const baseDir=publicAsset?join(root,'public'):base;
  const filepath=resolve(baseDir,'.'+pathname);
  if(!filepath.startsWith(baseDir+sep)&&filepath!==baseDir){res.writeHead(403);res.end('Acesso negado');return;}
  if((await stat(filepath)).isDirectory()){res.writeHead(403);res.end();return;}
  const data=await readFile(filepath);
  res.writeHead(200,{'content-type':mime[extname(filepath)]||'application/octet-stream','cache-control':'no-cache','x-content-type-options':'nosniff'});
  res.end(data);
 }catch{res.writeHead(404,{'content-type':'text/plain; charset=utf-8'});res.end('Arquivo não encontrado');}
});
server.listen(port,()=>console.log(`Midnight Café aberto em http://localhost:${port} (${production?'publicação':'desenvolvimento'})`));
