document.addEventListener('DOMContentLoaded', () => {
    const interactiveSections = document.querySelectorAll('.interactive-section');
    const tooltipBox = document.getElementById('tooltip-box');
    
    // 1. Contenido de los Tooltips (¡Imágenes de resultados eliminadas para evitar repetición!)
    const tooltipContent = {
        
        // --- TOOLTIPS CONCEPTUALES (SÍ mantienen imagen, ya que la interacción es directa) ---
        'concepto_embarazo': {
            title: 'El Embarazo',
            text: 'El embarazo es el espacio de tiempo que comprende desde la concepción y el parto, durante esta etapa el feto dentro del útero materno crece y se desarrolla en un lapso de 280 días.',
        },
        'concepto_habitos': {
            title: 'Hábitos Nutricionales',
            text: 'Hábitos alimenticios son el conjunto de patrones y costumbres que determinan la selección, preparación y consumo de alimentos, procurando obtener el sustento nutricional.',
        },
        'concepto_nutricional': {
            title: 'Estado Nutricional',
            text: 'El estado nutricional es la condición de salud de cada persona como consecuencia de las carencias, los excesos y los desequilibrios de la ingesta alimentaria y calórica de cada persona y su estilo de vida.',
        },
        
        // --- TOOLTIPS DE RESULTADOS (IMAGEN ELIMINADA) ---
        'introduccion': {
            title: 'Importancia de la Nutrición Materna',
            text: 'El cuidado materno y fetal es crucial. La nutrición es un factor determinante en la salud de la madre y el desarrollo del bebé. Un mal estado nutricional puede generar complicaciones que se pueden prevenir.',
        },
        'metodologia': {
            title: 'Diseño del Estudio',
            text: 'El estudio fue cuantitativo, no experimental y transversal. Se aplicó un cuestionario validado a 116 mujeres de Tula y Atilquillo, Hgo., con alta fiabilidad (α de 0.704).',
        },
        'habitos': {
            title: 'Hábitos Inadecuados: ¡Riesgo!',
            text: '¡El 36.2% de las mujeres tienen hábitos alimentarios inadecuados! Este alto porcentaje subraya la necesidad urgente de intervención nutricional en la población para mejorar el pronóstico del embarazo.',
        },
        'imc': {
            title: 'Riesgo por Exceso de Peso',
            text: 'El 34.5% presentaba sobrepeso y el 17.2% obesidad. Esto suma más del 50% de la muestra con riesgo de complicaciones por peso pregestacional (antes del embarazo).',
        },
        'correlacion': {
            title: 'Correlación Significativa (r=0.700)',
            text: 'Se encontró una relación fuerte y positiva entre los hábitos alimentarios y la ganancia de peso. Esto significa que a mejores hábitos, existe un mejor control de peso durante la gestación.',
        },
        'conclusion': {
            title: 'Enfoque Integral para la Gestación',
            text: 'El manejo nutricional debe ser visto desde una perspectiva integral. Los factores socioeconómicos, la educación y el acceso a servicios de salud influyen tanto como la ingesta de alimentos.',
        }
    };
    
    /**

     * @param {string} key - Clave del contenido en tooltipContent
     * @param {MouseEvent} event - Evento del mouse (mouseover)
     */
    function showTooltip(key, event) {
        const content = tooltipContent[key];
        if (!content) return;


        tooltipBox.innerHTML = `
            ${content.image ? `<img src="${content.image}" alt="${content.title}" class="tooltip-image" />` : ''}
            <div class="tooltip-title">${content.title}</div>
            <p>${content.text}</p>
        `;

        // 2. Posicionamiento (se mantiene igual)
        const x = event.clientX;
        const y = event.clientY;
        const boxWidth = tooltipBox.offsetWidth;
        const boxHeight = tooltipBox.offsetHeight;
        
        let left = x + 15;
        let top = y + 15;

        if (left + boxWidth > window.innerWidth) {
            left = x - boxWidth - 15;
        }
        if (top + boxHeight > window.innerHeight && y > boxHeight) {
             top = y - boxHeight - 15;
        }

        tooltipBox.style.left = `${left}px`;
        tooltipBox.style.top = `${top}px`;

        // 3. Animación de Entrada (se mantiene igual)
        tooltipBox.style.opacity = '1';
        tooltipBox.style.visibility = 'visible';
        tooltipBox.style.transform = 'translateY(0)';
    }

    /** Oculta el tooltip con animación de salida (se mantiene igual) */
    function hideTooltip() {
        tooltipBox.style.opacity = '0';
        tooltipBox.style.transform = 'translateY(10px)';
        
        setTimeout(() => {
            tooltipBox.style.visibility = 'hidden';
            tooltipBox.innerHTML = ''; 
        }, 300); 
    }

    // 2. Asignar Event Listeners (se mantiene igual)
    interactiveSections.forEach(section => {
        const key = section.getAttribute('data-tooltip-key');
        
        section.addEventListener('mousemove', (e) => showTooltip(key, e));
        section.addEventListener('mouseleave', hideTooltip);

        section.addEventListener('focus', (e) => {
            const rect = section.getBoundingClientRect();
            const mockEvent = { clientX: rect.right, clientY: rect.top + (rect.height / 2) };
            showTooltip(key, mockEvent);
        });
        section.addEventListener('blur', hideTooltip);

        section.addEventListener('touchstart', (e) => {
            e.preventDefault();
            
            if (tooltipBox.style.opacity === '1' && section.classList.contains('active-touch')) {
                hideTooltip();
                section.classList.remove('active-touch');
                return;
            }

            document.querySelectorAll('.active-touch').forEach(active => active.classList.remove('active-touch'));
            
            const touch = e.touches[0];
            const mockEvent = { clientX: touch.clientX, clientY: touch.clientY };
            showTooltip(key, mockEvent);
            section.classList.add('active-touch');
        });
    });

    document.addEventListener('touchstart', (e) => {
        if (!e.target.closest('.interactive-section') && tooltipBox.style.opacity === '1') {
            hideTooltip();
            document.querySelectorAll('.active-touch').forEach(active => active.classList.remove('active-touch'));
        }
    });

});