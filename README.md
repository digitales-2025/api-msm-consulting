<p align="center">
  <h1 align="center">API de Gestión de Proyectos - MSM Consulting</h1>
</p>

<p align="center">
  Sistema de gestión de proyectos desarrollado con NestJS para optimizar el seguimiento, asignación y control de proyectos empresariales.
</p>

## Descripción

Esta API proporciona una solución completa para la gestión de proyectos empresariales, permitiendo el seguimiento de tareas, asignación de recursos, control de tiempos y generación de reportes. Desarrollada con [Nest](https://github.com/nestjs/nest), un framework progresivo de Node.js.

## Características principales

- Gestión administrativa de clientes y clínicas
- Gestión de proyectos y servicios
- Administración de registros médicos
- Generación de reportes y estadísticas
- Gestión de usuarios y permisos
- Módulo de certificados

## Configuración del proyecto

```bash
$ pnpm install
```

## Ejecución del proyecto

```bash
# desarrollo
$ pnpm run start

# modo de desarrollo con recarga automática
$ pnpm run start:dev

# producción
$ pnpm run start:prod
```

## Pruebas

```bash
# pruebas unitarias
$ pnpm run test

# pruebas e2e
$ pnpm run test:e2e

# cobertura de pruebas
$ pnpm run test:cov
```

## Documentación de la API

La documentación detallada de la API está disponible en la ruta `/api/docs` una vez que el servidor está en ejecución. Utiliza Swagger para proporcionar una interfaz interactiva donde puedes explorar y probar todos los endpoints.

## Base de datos

El sistema utiliza una base de datos relacional para almacenar información de proyectos, tareas, usuarios y registros de tiempo. Las migraciones y seeds están incluidos para facilitar la configuración inicial.

## Requisitos del sistema

- Node.js (v14 o superior)
- PostgreSQL (recomendado) u otra base de datos compatible
- Navegador web moderno para acceder a la documentación

## Despliegue

Para desplegar en producción, recomendamos seguir estas prácticas:

1. Configurar variables de entorno adecuadas
2. Utilizar PM2 o Docker para la gestión de procesos
3. Implementar un balanceador de carga para alta disponibilidad
4. Configurar backups automáticos de la base de datos

## Licencia

Este proyecto está licenciado bajo [Licencia MIT](LICENSE).
