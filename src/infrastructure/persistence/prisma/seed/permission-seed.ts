import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface PermissionSeed {
  name: string;
  description: string;
  resource: string;
  action: string;
}

// Lista de permisos predefinidos
const defaultPermissions: PermissionSeed[] = [
  // Permisos para usuarios
  {
    name: 'users:create',
    description: 'Crear usuarios',
    resource: 'users',
    action: 'create',
  },
  {
    name: 'users:read',
    description: 'Ver usuarios',
    resource: 'users',
    action: 'read',
  },
  {
    name: 'users:update',
    description: 'Actualizar usuarios',
    resource: 'users',
    action: 'update',
  },
  {
    name: 'users:delete',
    description: 'Eliminar usuarios',
    resource: 'users',
    action: 'delete',
  },

  // Permisos para roles
  {
    name: 'roles:create',
    description: 'Crear roles',
    resource: 'roles',
    action: 'create',
  },
  {
    name: 'roles:read',
    description: 'Ver roles',
    resource: 'roles',
    action: 'read',
  },
  {
    name: 'roles:update',
    description: 'Actualizar roles',
    resource: 'roles',
    action: 'update',
  },
  {
    name: 'roles:delete',
    description: 'Eliminar roles',
    resource: 'roles',
    action: 'delete',
  },
  {
    name: 'roles:assign',
    description: 'Asignar roles a usuarios',
    resource: 'roles',
    action: 'assign',
  },

  // Permisos para permisos
  {
    name: 'permissions:create',
    description: 'Crear permisos',
    resource: 'permissions',
    action: 'create',
  },
  {
    name: 'permissions:read',
    description: 'Ver permisos',
    resource: 'permissions',
    action: 'read',
  },
];

async function seedPermissions() {
  console.log(`Comenzando a sembrar permisos predefinidos...`);

  for (const permission of defaultPermissions) {
    // Verificar si el permiso ya existe
    const existingPermission = await prisma.permission.findFirst({
      where: {
        OR: [
          { name: permission.name },
          {
            AND: [
              { resource: permission.resource },
              { action: permission.action },
            ],
          },
        ],
      },
    });

    if (!existingPermission) {
      await prisma.permission.create({
        data: permission,
      });
      console.log(`Permiso creado: ${permission.name}`);
    } else {
      console.log(`Permiso ya existe: ${permission.name}`);
    }
  }

  console.log(`Siembra de permisos completada.`);
}

// Función principal para ejecutar la semilla
async function main() {
  try {
    await seedPermissions();
  } catch (error) {
    console.error('Error durante la siembra de permisos:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar la semilla
main();
