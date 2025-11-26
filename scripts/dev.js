import { spawn, spawnSync } from 'child_process';
import { existsSync } from 'fs';
import path from 'path';

// Ajoute node_modules/.bin au PATH pour pouvoir appeler "vite" directement
process.env.PATH =
  path.join(process.cwd(), 'node_modules', '.bin') +
  path.delimiter +
  (process.env.PATH ?? '');

const processes = [];
let shuttingDown = false;

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

  console.log('\nShutting down dev server...');
  processes.forEach(({ child }) => killChild(child));

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

  if (envCmd) {
    return {
      command: envCmd,
      args: ['spring-boot:run'],
      options: { cwd: backendDir },
    };
  }

  const wrapperName = isWindows ? 'mvnw.cmd' : 'mvnw';
  const wrapperPath = path.join(backendDir, wrapperName);
  if (existsSync(wrapperPath)) {
    return {
      command: wrapperPath,
      args: ['spring-boot:run'],
      options: { cwd: backendDir },
    };
  }

  if (isCommandAvailable('mvn')) {
    return {
      command: 'mvn',
      args: ['spring-boot:run'],
      options: { cwd: backendDir },
    };
  }

  throw new Error(
    'Maven introuvable.\n' +
      "- Installez Maven et ajoutez-le au PATH, ou\n" +
      "- utilisez le wrapper Maven (mvnw / mvnw.cmd) dans MicroPanelScenes, ou\n" +
      "- définissez BACKEND_CMD vers votre exécutable mvn/mvnw.\n" +
      '  Ex: set BACKEND_CMD="C:\\apache-maven\\bin\\mvn.cmd"\n'
  );
}

function ensureFrontendTools() {
  if (!isCommandAvailable('vite')) {
    console.error(
      '\n[Vite] Commande introuvable. Assurez-vous que les dépendances Node sont installées (npm install) ou utilisez npx vite.'
    );
    process.exit(1);
  }
}

function startFrontend() {
  console.log('================================');
  console.log(' Micro Panel Frontend');
  console.log('================================\n');

  ensureFrontendTools();
  startProcess('frontend', 'vite', ['--host']);

  console.log(' Micro Panel frontend en cours de démarrage...');
  console.log('🟣 Frontend (Vite) → http://localhost:5173');
  console.log('\nArrêt : Ctrl + C\n');
}

function startBackend() {
  console.log('================================');
  console.log(' Micro Panel Backend');
  console.log('================================\n');

  try {
    const backend = resolveBackendCommand();
    startProcess('backend', backend.command, backend.args, backend.options);

    console.log(' Micro Panel backend en cours de démarrage...');
    console.log('🟡 Backend (Spring Boot) → http://localhost:8080');
    console.log('\nArrêt : Ctrl + C\n');
  } catch (error) {
    console.error(`\n[backend] ${error.message}`);
    shutdown(1);
  }
}

const target = process.argv[2] ?? 'frontend';

if (target === 'frontend') {
  startFrontend();
} else if (target === 'backend') {
  startBackend();
} else {
  console.error(`Cible inconnue : ${target}. Utilisez "frontend" ou "backend".`);
  process.exit(1);
}
