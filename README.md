# Generador de Horarios Universitarios

Esta es una aplicación web de una sola página diseñada para ayudar a estudiantes universitarios a generar horarios personalizados según sus materias, grupos y prioridades. Todo se gestiona en el navegador, sin necesidad de instalar nada ni crear cuentas.

## ¿Para qué sirve?
- Permite agregar materias y grupos disponibles.
- Organiza las prioridades de materias y profesores mediante listas de arrastrar y soltar.
- Genera automáticamente todos los horarios posibles, considerando las prioridades y la opción de incluir o no un descanso para almorzar.
- Guarda todos los datos en el navegador usando `localStorage`, por lo que puedes cerrar y volver a abrir la página sin perder tu información.

## ¿Cómo se usa?
1. **Agregar materias y grupos:**
   - Ve a la pestaña "Materias" y usa el botón "Agregar materia" para añadir nuevas materias y sus grupos.
   - Puedes editar o eliminar materias y grupos usando los botones correspondientes.
2. **Configurar prioridades:**
   - En la pestaña "Prioridades", organiza el orden de materias y profesores arrastrando los elementos en las listas.
   - Los cambios se guardan automáticamente.
3. **Generar horarios:**
   - Ve a la pestaña "Generador de horarios" y usa los botones para generar horarios normales o con descanso para almorzar.
   - Los resultados se muestran en tablas debajo de los botones.
4. **Temas claro/oscuro:**
   - Cambia entre modo claro y oscuro usando el botón en la parte superior derecha. La preferencia se guarda automáticamente.
5. **Gestión de datos:**
   - Usa el botón "Eliminar todos los datos" para reiniciar la aplicación.
   - Usa el botón "Cargar datos de prueba" para probar la app rápidamente con datos de ejemplo.

## Requisitos y detalles técnicos
- No requiere instalación ni registro.
- Funciona en cualquier navegador moderno.
- Todo el código y la lógica están en los archivos `index.html`, `app.js` y `styles.css`.
- No utiliza frameworks ni dependencias externas.
- La interfaz está en español.

## Créditos
Desarrollado por its-camilo. Código abierto para uso educativo y personal.
