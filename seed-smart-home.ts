import { drizzle } from "drizzle-orm/mysql2";
import { users, rooms, deviceTypes, smartDevices } from "./drizzle/schema";

const db = drizzle(process.env.DATABASE_URL!);

async function seedSmartHome() {
  console.log("🏠 Iniciando seed do Smart Home...");

  try {
    // Get or create user
    const existingUser = await db.select().from(users).where((u) => u.openId === "demo-user").limit(1);
    let userId = existingUser[0]?.id;

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

    // Create device types
    console.log("🔧 Criando tipos de dispositivos...");

    const deviceTypesData = [
      { id: 1, name: "Luz", icon: "💡", controlType: "slider" as const },
      { id: 2, name: "Ar Condicionado", icon: "❄️", controlType: "temperature" as const },
      { id: 3, name: "Cortina", icon: "🪟", controlType: "position" as const },
    ];

    for (const type of deviceTypesData) {
      try {
        await db.insert(deviceTypes).values(type);
        console.log(`  ✓ ${type.name}`);
      } catch (e: any) {
        if (e.code !== "ER_DUP_ENTRY") throw e;
      }
    }

    // Create rooms
    console.log("🛋️ Criando cômodos...");

    const roomsData = [
      { userId, name: "Sala de Estar", icon: "🛋️", color: "#f3f4f6", order: 1 },
      { userId, name: "Quarto", icon: "🛏️", color: "#f3f4f6", order: 2 },
      { userId, name: "Cozinha", icon: "🍳", color: "#f3f4f6", order: 3 },
      { userId, name: "Banheiro", icon: "🚿", color: "#f3f4f6", order: 4 },
    ];

    const roomIds: number[] = [];
    for (const room of roomsData) {
      const result = await db.insert(rooms).values(room);
      roomIds.push(result.insertId);
      console.log(`  ✓ ${room.name}`);
    }

    // Create devices
    console.log("💡 Criando dispositivos...");

    const devicesData = [
      // Sala de Estar
      { userId, roomId: roomIds[0], deviceTypeId: 1, name: "Luz Principal", description: "Luz principal da sala", isOn: 1, brightness: 80 },
      { userId, roomId: roomIds[0], deviceTypeId: 1, name: "Luz Lateral", description: "Abajur lateral", isOn: 0, brightness: 50 },
      { userId, roomId: roomIds[0], deviceTypeId: 2, name: "Ar Condicionado", description: "AC da sala", isOn: 1, temperature: "22", acMode: "cool" as const },
      { userId, roomId: roomIds[0], deviceTypeId: 3, name: "Cortina", description: "Cortina da janela", isOn: 1, curtainPosition: 50 },

      // Quarto
      { userId, roomId: roomIds[1], deviceTypeId: 1, name: "Luz Principal", description: "Luz do quarto", isOn: 0, brightness: 100 },
      { userId, roomId: roomIds[1], deviceTypeId: 2, name: "Ar Condicionado", description: "AC do quarto", isOn: 0, temperature: "20", acMode: "cool" as const },
      { userId, roomId: roomIds[1], deviceTypeId: 3, name: "Cortina", description: "Cortina do quarto", isOn: 1, curtainPosition: 0 },

      // Cozinha
      { userId, roomId: roomIds[2], deviceTypeId: 1, name: "Luz Principal", description: "Luz da cozinha", isOn: 1, brightness: 100 },
      { userId, roomId: roomIds[2], deviceTypeId: 1, name: "Luz Bancada", description: "Luz da bancada", isOn: 1, brightness: 90 },

      // Banheiro
      { userId, roomId: roomIds[3], deviceTypeId: 1, name: "Luz Principal", description: "Luz do banheiro", isOn: 0, brightness: 100 },
      { userId, roomId: roomIds[3], deviceTypeId: 1, name: "Luz Espelho", description: "Luz do espelho", isOn: 0, brightness: 100 },
    ];

    for (const device of devicesData) {
      await db.insert(smartDevices).values(device);
    }
    console.log(`  ✓ ${devicesData.length} dispositivos criados`);

    console.log("\n✨ Seed concluído com sucesso!");
    console.log("\n📋 Dados de Demonstração Criados:");
    console.log(`   - Usuário: demo@example.com`);
    console.log(`   - Cômodos: ${roomIds.length}`);
    console.log(`   - Dispositivos: ${devicesData.length}`);
    console.log("\n🎉 Você pode fazer login e testar os controles!");
  } catch (error) {
    console.error("❌ Erro ao fazer seed:", error);
    process.exit(1);
  }
}

seedSmartHome();
