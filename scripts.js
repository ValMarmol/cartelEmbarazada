document.addEventListener('DOMContentLoaded', () => {
    // SELECCIONAMOS SOLO LOS ELEMENTOS DONDE EL TOOLTIP DEBE ACTIVARSE
    const interactiveElements = document.querySelectorAll('.interactive-section');
    const tooltipBox = document.getElementById('tooltip-box');
    
    // 1. Contenido de los Tooltips (Contenido de Tablas reinsertado)
    const tooltipContent = {
        
        // --- TOOLTIPS CONCEPTUALES (Mantienen imagen) ---
        'concepto_embarazo': {
            title: 'Definición: El Embarazo',
            text: 'El embarazo es el espacio de tiempo que comprende desde la concepción y el parto, durante esta etapa el feto dentro del útero materno crece y se desarrolla en un lapso de 280 días. ',
            image: 'img/embarazo.svg' 
        },
        'concepto_habitos': {
            title: 'Definición: Hábitos Nutricionales',
            text: 'Hábitos alimenticios son el conjunto de patrones y costumbres que determinan la selección, preparación y consumo de alimentos, procurando obtener el sustento nutricional.',
            image: 'img/habitos_nutricionales.svg' 
        },
        'concepto_nutricional': {
            title: 'Definición: Estado Nutricional',
            text: 'El estado nutricional es la condición de salud de cada persona como consecuencia de las carencias, los excesos y los desequilibrios de la ingesta alimentaria y calórica de cada persona y su estilo de vida.',
            image: 'img/estado_nutricional.svg'
        },
        
        // --- TOOLTIPS DE RESULTADOS (SIN IMAGEN) ---
        'habitos': {
            title: 'Hábitos Inadecuados: ¡Riesgo!',
            text: '¡El 36.2% de las mujeres tienen hábitos alimentarios inadecuados! Este alto porcentaje subraya la necesidad urgente de intervención nutricional en la población.',
        },
        'imc': {
            title: 'Riesgo por Exceso de Peso',
            text: 'El 34.5% presentaba sobrepeso y el 17.2% obesidad. Esto suma más del 50% de la muestra con riesgo de complicaciones por peso pregestacional (antes del embarazo).',
        },
        'correlacion': {
            title: 'Correlación Significativa (r=0.700)',
            text: 'Se encontró una relación fuerte y positiva entre los hábitos alimentarios y la ganancia de peso. Esto significa que a mejores hábitos, existe un mejor control de peso durante la gestación.',
        },
    };
    
    /**
     * Muestra el tooltip con el contenido y posición correctos
     * @param {string} key - Clave del contenido en tooltipContent
     * @param {MouseEvent} event - Evento del mouse (mouseover/touch)
     */
    function showTooltip(key, event) {
        const content = tooltipContent[key];
        if (!content) return; // Si la clave no está, no hace nada

        // 1. Inyectar Contenido en el Tooltip
        tooltipBox.innerHTML = `
            ${content.image ? `<img src="${content.image}" alt="${content.title}" class="tooltip-image" />` : ''}
            <div class="tooltip-title">${content.title}</div>
            <p>${content.text}</p>
        `;

        // 2. Posicionamiento 
        const x = event.clientX;
        const y = event.clientY;
        const boxWidth = tooltipBox.offsetWidth;
        const boxHeight = tooltipBox.offsetHeight;
        
        let left = x + 15;
        let top = y + 15;

        // Ajuste para evitar que el tooltip se salga de la pantalla
        if (left + boxWidth > window.innerWidth) {
            left = x - boxWidth - 15;
        }
        if (top + boxHeight > window.innerHeight && y > boxHeight) {
            top = y - boxHeight - 15;
        }

        tooltipBox.style.left = `${left}px`;
        tooltipBox.style.top = `${top}px`;

        // 3. Animación de Entrada
        tooltipBox.style.opacity = '1';
        tooltipBox.style.visibility = 'visible';
        tooltipBox.style.transform = 'translateY(0)';
    }

    /** Oculta el tooltip con animación de salida */
    function hideTooltip() {
        tooltipBox.style.opacity = '0';
        tooltipBox.style.transform = 'translateY(10px)';
        
        setTimeout(() => {
            tooltipBox.style.visibility = 'hidden';
            tooltipBox.innerHTML = ''; 
        }, 300); 
    }

    // 2. Asignar Event Listeners (USANDO LA VARIABLE CORRECTA: interactiveElements)
    interactiveElements.forEach(element => { // <-- CORREGIDO: Usamos interactiveElements
        const key = element.getAttribute('data-tooltip-key');
        
        // --- Eventos de Escritorio (Mouse) ---
        element.addEventListener('mousemove', (e) => showTooltip(key, e));
        element.addEventListener('mouseleave', hideTooltip);

        // --- Eventos de Accesibilidad (Teclado) ---
        element.addEventListener('focus', (e) => {
            const rect = element.getBoundingClientRect();
            const mockEvent = { clientX: rect.right, clientY: rect.top + (rect.height / 2) };
            showTooltip(key, mockEvent);
        });
        element.addEventListener('blur', hideTooltip);

        // --- Eventos Táctiles (Móviles) - Lógica Corregida para Touch ---
        element.addEventListener('touchstart', (e) => {
            e.preventDefault(); // Detiene el zoom y el comportamiento por defecto
            
            // 1. Si el mismo elemento es tocado de nuevo, ocultamos.
            if (tooltipBox.style.opacity === '1' && element.classList.contains('active-touch')) {
                hideTooltip();
                element.classList.remove('active-touch');
                return;
            }

            // 2. Si tocamos otro elemento, limpiamos la clase de todos los anteriores
            document.querySelectorAll('.active-touch').forEach(active => active.classList.remove('active-touch'));
            
            // 3. Mostramos el nuevo tooltip
            const touch = e.touches[0];
            const mockEvent = { clientX: touch.clientX, clientY: touch.clientY };
            showTooltip(key, mockEvent);
            element.classList.add('active-touch');
        }, { passive: false }); // Usamos passive: false para asegurar que preventDefault funcione
    });

    // Ocultar el tooltip si el usuario toca/cliquea FUERA del mismo en touch devices
    document.addEventListener('touchstart', (e) => {
        // Si el toque no está en un elemento interactivo y el tooltip está visible
        if (!e.target.closest('.interactive-section') && tooltipBox.style.opacity === '1') {
            hideTooltip();
            // Limpiamos la clase 'active-touch' de todos los elementos
            document.querySelectorAll('.active-touch').forEach(active => active.classList.remove('active-touch'));
        }
    }, { passive: true });
});