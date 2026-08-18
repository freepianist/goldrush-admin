import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const child = spawn(
	process.execPath,
	['node_modules/next/dist/bin/next', 'dev', '--webpack'],
	{
		cwd: root,
		detached: true,
		stdio: 'ignore',
		windowsHide: false
	}
);

child.unref();
console.log(`WinPeak admin started (pid ${child.pid})`);
