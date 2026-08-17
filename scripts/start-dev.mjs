import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const child = spawn(
	process.execPath,
	['node_modules/next/dist/bin/next', 'dev', '--port', '3001', '--hostname', '127.0.0.1', '--webpack'],
	{
		cwd: root,
		detached: true,
		stdio: 'ignore',
		windowsHide: false
	}
);

child.unref();
console.log(`Goldrush admin started (pid ${child.pid}) at http://127.0.0.1:3001`);
