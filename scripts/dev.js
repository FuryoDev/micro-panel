import { spawn, spawnSync } from 'child_process';
import { existsSync } from 'fs';
import path from 'path';

const processes = [];
let shuttingDown = false;

function startProcess(label, command, args = [], options = {}) {
  const child = spawn(command, args, {
    stdio: 'inherit',
    ...options,
  });

  processes.push({ label, child });

  child.on('exit', (code, signal) => {
    console.log(`\n[${label}] exited with code ${code ?? 'null'}${signal ? `, signal ${signal}` : ''}`);
    if (!shuttingDown) {
      shutdown(code ?? 0);
    }
  });

  child.on('error', (err) => {
    console.error(`[${label}] failed to start:`, err);
    if (!shuttingDown) {
      shutdown(1);
    }
  });
}

function killChild(child) {
  if (!child || child.killed) return;

  try {
    if (process.platform === 'win32') {
      child.kill();
    } else {
      child.kill('SIGTERM');
    }
  } catch (error) {
    console.warn('Unable to terminate child process:', error);
  }
}

function shutdown(exitCode = 0) {
  if (shuttingDown) return;
  shuttingDown = true;

  console.log('\nShutting down dev servers...');
  processes.forEach(({ child }) => killChild(child));

  // Give children a moment to exit before forcing the main process to end.
  setTimeout(() => {
    process.exit(exitCode);
  }, 500);
}

['SIGINT', 'SIGTERM', 'SIGHUP'].forEach((signal) => {
  process.on(signal, () => {
    if (!shuttingDown) {
      console.log(`\nReceived ${signal}.`);
      shutdown(0);
    }
  });
});

function isCommandAvailable(command) {
  const check = process.platform === 'win32' ? `where ${command}` : `command -v ${command}`;
  const result = spawnSync(check, { shell: true, stdio: 'ignore' });
  return result.status === 0;
}

function resolveBackendCommand() {
  const backendDir = path.join(process.cwd(), 'backend');
  const isWindows = process.platform === 'win32';
  const envCmd = process.env.BACKEND_CMD;

  if (envCmd) {
    return { command: envCmd, args: ['spring-boot:run'], options: { cwd: backendDir } };
  }

  const wrapperName = isWindows ? 'mvnw.cmd' : 'mvnw';
  const wrapperPath = path.join(backendDir, wrapperName);
  if (existsSync(wrapperPath)) {
    return { command: wrapperPath, args: ['spring-boot:run'], options: { cwd: backendDir } };
  }

  if (isCommandAvailable('mvn')) {
    return { command: 'mvn', args: ['spring-boot:run'], options: { cwd: backendDir } };
  }

  throw new Error(
    'Maven introuvable. Installez Maven et ajoutez-le au PATH ou définissez BACKEND_CMD vers votre exécutable mvn/mvnw.'
  );
}

try {
  const backend = resolveBackendCommand();
  startProcess('backend', backend.command, backend.args, backend.options);
} catch (error) {
  console.error(`\n[backend] ${error.message}`);
  shutdown(1);
}

startProcess('frontend', 'vite', ['--host']);
