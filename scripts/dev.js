import { spawn } from 'child_process';

const processes = [];
let shuttingDown = false;

function startProcess(label, command) {
  const child = spawn(command, {
    shell: true,
    stdio: 'inherit',
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

startProcess('backend', 'cd backend && mvn spring-boot:run');
startProcess('frontend', 'vite --host');
