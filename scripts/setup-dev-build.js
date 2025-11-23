#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Configurando Development Build...\n');

// Verificar que existe el archivo de Firebase
const firebaseConfigPath = path.join(__dirname, '..', 'credentials_fire.json');
if (!fs.existsSync(firebaseConfigPath)) {
  console.error('❌ Error: No se encontró credentials_fire.json');
  console.error('   Descarga el archivo google-services.json de Firebase Console');
  console.error('   y renómbralo a credentials_fire.json en la raíz del proyecto.\n');
  process.exit(1);
}

console.log('✅ Archivo de Firebase encontrado\n');

// Verificar que EAS CLI está instalado
try {
  execSync('eas --version', { stdio: 'ignore' });
  console.log('✅ EAS CLI instalado\n');
} catch (error) {
  console.error('❌ EAS CLI no está instalado');
  console.error('   Instálalo con: npm install -g eas-cli\n');
  process.exit(1);
}

// Verificar login
try {
  execSync('eas whoami', { stdio: 'ignore' });
  console.log('✅ Sesión de EAS activa\n');
} catch (error) {
  console.error('⚠️  No has iniciado sesión en EAS');
  console.error('   Ejecuta: eas login\n');
  process.exit(1);
}

console.log('📋 Opciones disponibles:\n');
console.log('1. Crear Development Build para Android');
console.log('2. Crear Development Build para iOS');
console.log('3. Crear Development Build para ambas plataformas');
console.log('4. Iniciar servidor de desarrollo\n');

const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

readline.question('Selecciona una opción (1-4): ', (answer) => {
  readline.close();
  
  try {
    switch (answer.trim()) {
      case '1':
        console.log('\n🔨 Creando build para Android...\n');
        execSync('eas build --profile development --platform android', { stdio: 'inherit' });
        break;
      case '2':
        console.log('\n🔨 Creando build para iOS...\n');
        execSync('eas build --profile development --platform ios', { stdio: 'inherit' });
        break;
      case '3':
        console.log('\n🔨 Creando builds para ambas plataformas...\n');
        execSync('eas build --profile development --platform all', { stdio: 'inherit' });
        break;
      case '4':
        console.log('\n🚀 Iniciando servidor de desarrollo...\n');
        console.log('Escanea el QR con tu Development Build (NO con Expo Go)\n');
        execSync('npx expo start --dev-client', { stdio: 'inherit' });
        break;
      default:
        console.error('❌ Opción inválida');
        process.exit(1);
    }
  } catch (error) {
    console.error('\n❌ Error durante la ejecución');
    process.exit(1);
  }
});
