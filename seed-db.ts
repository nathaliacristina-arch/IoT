import { drizzle } from "drizzle-orm/mysql2";
import { iotDevices, sensorReadings, alertConfigs, users } from "./drizzle/schema";
import { nanoid } from "nanoid";

const db = drizzle(process.env.DATABASE_URL!);

async function seedDatabase() {
  console.log("🌱 Iniciando seed do banco de dados...");

  try {
    // Get or create a test user
    const testUser = await db
      .select()
      .from(users)
      .where((u) => u.openId === "demo-user")
      .limit(1);

    let userId = testUser[0]?.id;

    if (!userId) {
      console.log("📝 Criando usuário de demonstração...");
      const result = await db.insert(users).values({
        openId: "demo-user",
        name: "Demo User",
        email: "demo@example.com",
        loginMethod: "demo",
        role: "user",
      });
      userId = result.insertId;
    }

    console.log(`✅ Usuário ID: ${userId}`);

    // Create demo devices
    console.log("🔧 Criando dispositivos de demonstração...");

    const devices = [
      {
        userId,
        name: "Sensor Temperatura - Sala",
        description: "Sensor de temperatura da sala principal",
        location: "Sala de Estar",
        deviceToken: nanoid(32),
        isActive: 1,
      },
      {
        userId,
        name: "Sensor Umidade - Cozinha",
        description: "Sensor de umidade da cozinha",
        location: "Cozinha",
        deviceToken: nanoid(32),
        isActive: 1,
      },
      {
        userId,
        name: "Sensor Pressão - Exterior",
        description: "Sensor de pressão atmosférica",
        location: "Exterior",
        deviceToken: nanoid(32),
        isActive: 1,
      },
    ];

    const deviceIds: number[] = [];
    for (const device of devices) {
      const result = await db.insert(iotDevices).values(device);
      deviceIds.push(result.insertId);
      console.log(`  ✓ ${device.name} (Token: ${device.deviceToken.substring(0, 16)}...)`);
    }

    // Create sample sensor readings
    console.log("📊 Criando leituras de sensores...");

    const now = new Date();

    // Temperature readings for device 1
    for (let i = 0; i < 24; i++) {
      const temp = 20 + Math.sin(i / 4) * 8 + Math.random() * 2;
      await db.insert(sensorReadings).values({
        deviceId: deviceIds[0],
        sensorType: "temperature",
        value: temp.toFixed(2),
        unit: "°C",
        timestamp: new Date(now.getTime() - (24 - i) * 3600000),
      });
    }

    // Humidity readings for device 2
    for (let i = 0; i < 24; i++) {
      const humidity = 50 + Math.sin(i / 4) * 15 + Math.random() * 5;
      await db.insert(sensorReadings).values({
        deviceId: deviceIds[1],
        sensorType: "humidity",
        value: humidity.toFixed(2),
        unit: "%",
        timestamp: new Date(now.getTime() - (24 - i) * 3600000),
      });
    }

    // Pressure readings for device 3
    for (let i = 0; i < 24; i++) {
      const pressure = 1013 + Math.sin(i / 6) * 5 + Math.random() * 2;
      await db.insert(sensorReadings).values({
        deviceId: deviceIds[2],
        sensorType: "pressure",
        value: pressure.toFixed(2),
        unit: "hPa",
        timestamp: new Date(now.getTime() - (24 - i) * 3600000),
      });
    }
    console.log(`  ✓ 72 leituras criadas`);

    // Create alert configurations
    console.log("🚨 Criando configurações de alertas...");

    const alerts = [
      {
        userId,
        deviceId: deviceIds[0],
        sensorType: "temperature",
        alertName: "Temperatura Alta",
        description: "Alerta quando temperatura ultrapassa 30°C",
        conditionType: "above" as const,
        maxValue: "30",
        isActive: 1,
        notifyEmail: 1,
      },
      {
        userId,
        deviceId: deviceIds[0],
        sensorType: "temperature",
        alertName: "Temperatura Baixa",
        description: "Alerta quando temperatura cai abaixo de 15°C",
        conditionType: "below" as const,
        minValue: "15",
        isActive: 1,
        notifyEmail: 1,
      },
      {
        userId,
        deviceId: deviceIds[1],
        sensorType: "humidity",
        alertName: "Umidade Muito Alta",
        description: "Alerta quando umidade ultrapassa 80%",
        conditionType: "above" as const,
        maxValue: "80",
        isActive: 1,
        notifyEmail: 1,
      },
      {
        userId,
        deviceId: deviceIds[2],
        sensorType: "pressure",
        alertName: "Pressão Anormal",
        description: "Alerta quando pressão sai do intervalo normal",
        conditionType: "between" as const,
        minValue: "1008",
        maxValue: "1018",
        isActive: 1,
        notifyEmail: 1,
      },
    ];

    for (const alert of alerts) {
      await db.insert(alertConfigs).values(alert);
      console.log(`  ✓ ${alert.alertName}`);
    }

    console.log("\n✨ Seed concluído com sucesso!");
    console.log("\n📋 Dados de Demonstração Criados:");
    console.log(`   - Usuário: demo@example.com`);
    console.log(`   - Dispositivos: ${deviceIds.length}`);
    console.log(`   - Leituras: ${readings.length}`);
    console.log(`   - Alertas: ${alerts.length}`);
    console.log("\n💡 Use os tokens dos dispositivos para enviar dados via API:");
    for (let i = 0; i < devices.length; i++) {
      console.log(`   Device ${i + 1}: ${devices[i].deviceToken}`);
    }
  } catch (error) {
    console.error("❌ Erro ao fazer seed:", error);
    process.exit(1);
  }
}

seedDatabase();
