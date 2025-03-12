import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface RoleSeed {
  name: string;
  description: string;
}

// Lista de roles predefinidos
const defaultRoles: RoleSeed[] = [
  {
    name: 'admin',
    description: 'Administrador con todos los permisos',
  },
  {
    name: 'user',
    description: 'Usuario regular con permisos limitados',
  },
];

async function seedRoles() {
  console.log(`Comenzando a sembrar roles predefinidos...`);

  for (const role of defaultRoles) {
    // Verificar si el rol ya existe
    const existingRole = await prisma.role.findUnique({
      where: { name: role.name },
    });

    if (!existingRole) {
      await prisma.role.create({
        data: role,
      });
      console.log(`Rol creado: ${role.name}`);
    } else {
      console.log(`Rol ya existe: ${role.name}`);
    }
  }

  // Asignar todos los permisos al rol de administrador
  const adminRole = await prisma.role.findUnique({
    where: { name: 'admin' },
  });

  if (adminRole) {
    // Obtener todos los permisos
    const permissions = await prisma.permission.findMany();

    // Para cada permiso, asignar al rol admin si no está ya asignado
    for (const permission of permissions) {
      // Verificar si ya existe la relación
      const existingRelation = await prisma.rolePermission.findUnique({
        where: {
          roleId_permissionId: {
            roleId: adminRole.id,
            permissionId: permission.id,
          },
        },
      });

      if (!existingRelation) {
        await prisma.rolePermission.create({
          data: {
            roleId: adminRole.id,
            permissionId: permission.id,
          },
        });
        console.log(`Permiso ${permission.name} asignado al rol admin`);
      }
    }
  }

  console.log(`Siembra de roles completada.`);
}

// Función principal para ejecutar la semilla
async function main() {
  try {
    await seedRoles();
  } catch (error) {
    console.error('Error durante la siembra de roles:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar la semilla
main();
