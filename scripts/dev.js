import { spawn, spawnSync } from 'child_process';
import { existsSync } from 'fs';
import path from 'path';

const processes = [];
let shuttingDown = false;

// Ajoute node_modules/.bin au PATH pour pouvoir appeler "vite" directement
process.env.PATH =
    path.join(process.cwd(), 'node_modules', '.bin') +
    path.delimiter +
    (process.env.PATH ?? '');

function startProcess(label, command, args = [], options = {}) {
  console.log(`[${label}] Starting: ${command} ${args.join(' ')}`);

  const child = spawn(command, args, {
    stdio: 'inherit',
    ...options,
  });

  processes.push({ label, child });

  child.on('exit', (code, signal) => {
    console.log(
        `\n[${label}] exited with code ${code ?? 'null'}${
            signal ? `, signal ${signal}` : ''
        }`
    );
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

  // Petit délai pour laisser le temps aux enfants de se fermer proprement
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
  const backendDir = path.join(process.cwd(), 'MicroPanelScenes');
  const isWindows = process.platform === 'win32';
  const envCmd = process.env.BACKEND_CMD;

  // 1) Si l'utilisateur a défini BACKEND_CMD, on l'utilise
  if (envCmd) {
    return {
      command: envCmd,
      args: ['spring-boot:run'],
      options: { cwd: backendDir },
    };
  }

  // 2) Sinon, on essaie le wrapper Maven (mvnw/mvnw.cmd) dans MicroPanelScenes
  const wrapperName = isWindows ? 'mvnw.cmd' : 'mvnw';
  const wrapperPath = path.join(backendDir, wrapperName);
  if (existsSync(wrapperPath)) {
    return {
      command: wrapperPath,
      args: ['spring-boot:run'],
      options: { cwd: backendDir },
    };
  }

  // 3) Sinon, on tente le Maven global
  if (isCommandAvailable('mvn')) {
    return {
      command: 'mvn',
      args: ['spring-boot:run'],
      options: { cwd: backendDir },
    };
  }

  // 4) Rien trouvé → message clair
  throw new Error(
      'Maven introuvable.\n' +
      "- Installez Maven et ajoutez-le au PATH, ou\n" +
      "- utilisez le wrapper Maven (mvnw / mvnw.cmd) dans MicroPanelScenes, ou\n" +
      "- définissez BACKEND_CMD vers votre exécutable mvn/mvnw.\n" +
      '  Ex: set BACKEND_CMD="C:\\apache-maven\\bin\\mvn.cmd"\n'
  );
}

console.log('================================');
console.log(' Micro Panel Dev Environment');
console.log('================================\n');

let backendStarted = false;

try {
  const backend = resolveBackendCommand();
  startProcess('backend', backend.command, backend.args, backend.options);
  backendStarted = true;
} catch (error) {
  console.error(`\n[backend] ${error.message}`);
}

startProcess('frontend', 'vite', ['--host']);

console.log(' Micro Panel en cours de démarrage...');
console.log('🟣 Frontend (Vite)       → http://localhost:5173');
if (backendStarted) {
  console.log('🟡 Backend (Spring Boot) → http://localhost:8080');
} else {
  console.log('⚠️ Backend Spring Boot non démarré (Maven introuvable ou erreur).');
}
console.log('\nArrêt : Ctrl + C\n');
