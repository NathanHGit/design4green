window.onload = () => app();

let screenId = 0;
let activeLi = null;
let activeMenu = null;
let total = null;
let totalVal = 0;
let li = null;

function app() {
    const sidebar = document.querySelector('#sidebar');
    const menu = document.querySelectorAll('.menu');
    const buttons = sidebar.querySelectorAll('button[step]');
    const icons = document.querySelectorAll('.icon');
    li = Array.from(document.querySelector('#sidebar').querySelectorAll('li'));
    total = sidebar.querySelector('h3');
    totalVal = 35;

    activeLi = document.querySelector('li.active');
    activeMenu = document.querySelector('.menu.active');

    httpRequest('STRATEGIE');

    for (let i = 0; i < buttons.length; i++) {
        buttons[i].onclick = function () {
            this.getAttribute('step') == 'next' ? ++screenId : --screenId;
            activeMenu.style.maxHeight = null;
            menu[screenId].style.maxHeight = menu[screenId].scrollHeight + 'px';
            activeMenu.classList.remove('active');
            menu[screenId].classList.add('active');
            activeMenu = menu[screenId];

            if (screenId == 0) {
                httpRequest('STRATEGIE');
            } else if (screenId == 1) {
                setFamily(JSON.parse(JSON.stringify(specs)));
            } else if (screenId == 2) {
                setFamily({});
            }
        };
    }

    li.forEach((element) => {
        element.onclick = function () {
            activeLi.classList.remove('active');
            element.classList.add('active');
            activeLi = element;
            httpRequest(getTxt(activeLi.innerHTML));
        };
    });

    for (let i = 0; i < icons.length; i++) {
        icons[i].onclick = function () {
            document.documentElement.style.setProperty('--width', i ? 'calc(100% / 4 - 60px)' : '100%');
        };
    }
}

function httpRequest(id) {
    fetch('/family?id=' + id, {
        cache: 'force-cache',
    })
        .then((response) => {
            return response.json();
        })
        .then((results) => {
            for (const [key, value] of Object.entries(results[0])) {
                if (specs[getTxt(activeLi.innerHTML)][0][key] != null) {
                    for (let i = 0; i < specs[getTxt(activeLi.innerHTML)][0][key].length; i++) {
                        value.unshift(specs[getTxt(activeLi.innerHTML)][0][key][i]);
                    }
                }
            }
            console.log(results[0]["Définir et valider les besoins et les enjeux du projet afin d'anticiper les impacts"]);
            setFamily(results[0]);
        })
        .catch((error) => {
            console.log('error', error);
        });
}

function setFamily(data) {
    main.innerHTML = '';
    let div = null;
    let i = 1;
    for (const [key, value] of Object.entries(data)) {
        div = document.createElement('div');
        div.className = 'family';

        let box = document.createElement('div');
        box.className = 'specs';

        let title = document.createElement('h3');
        title.innerHTML = i + '. ' + key;
        title.onclick = () => (box.style.maxHeight = box.style.maxHeight ? null : box.scrollHeight + 'px');
        div.appendChild(title);

        for (let j = 0; j < value.length; j++) {
            let spec = document.createElement('div');

            let tag = document.createElement('i');
            tag.classList.add('tag');
            tag.innerHTML = value[j].T;
            spec.appendChild(tag);

            let txt = document.createElement('p');
            txt.innerHTML = value[j].C;
            spec.appendChild(txt);

            if (!value[j].I) {
                let val = 0;
                if (screenId == 0) {
                    spec.classList.add('clickable');
                    spec.onclick = function () {
                        val = getValue(activeLi.innerHTML);
                        if (!spec.classList.contains('border')) {
                            ++val;
                            ++totalVal;
                            specs[getTxt(activeLi.innerHTML)].push(value[j]);
                            spec.classList.add('border');
                        } else {
                            for (let i = 0; i < specs[getTxt(activeLi.innerHTML)].length; i++) {
                                if (specs[getTxt(activeLi.innerHTML)][i].ID === value[j].ID) {
                                    specs[getTxt(activeLi.innerHTML)].splice(i, 1);
                                    --val;
                                    --totalVal;
                                    spec.classList.remove('border');
                                    break;
                                }
                            }
                        }
                        setTxt(activeLi, '(', val, ')');
                        setTxt(total, ':', ' ' + totalVal);
                    };
                } else if (screenId == 1) {
                    let span = document.createElement('span');

                    span.onclick = function () {
                        let col = this.parentNode.parentNode.parentNode.querySelector('h3').innerHTML.substring(3);
                        val = getValue(activeLi.innerHTML);
                        for (let i = 0; i < specs[col].length; i++) {
                            if (specs[col][i].ID === value[j].ID) {
                                specs[col].splice(i, 1);
                                this.parentNode.remove();
                                --val;
                                --totalVal;
                            }
                        }
                        setTxt(activeLi, '(', val, ')');
                        setTxt(total, ': ', ' ' + totalVal);
                    };

                    spec.appendChild(span);
                }
            } else {
                spec.classList.add('unmissable');
            }
            box.appendChild(spec);
        }

        div.appendChild(box);
        main.appendChild(div);

        if (screenId == 1) {
            box.style.maxHeight = box.scrollHeight + 'px';
        }
        i++;
    }
}

function getTxt(txt) {
    return txt
        .substring(0, txt.indexOf(' ('))
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
}

function getValue(txt) {
    return parseInt(txt.match(/\((.*)\)/).pop());
}

function setTxt(txt, start, val, end = '') {
    txt.innerHTML = txt.innerHTML.substr(0, txt.innerHTML.indexOf(start) + 1) + val + end;
}

const specs = {
    STRATEGIE: [
        {
            "Définir et valider les besoins et les enjeux du projet afin d'anticiper les impacts": [
                {
                    1: 'B',
                    2: 'B',
                    3: 'A',
                    ID: 6,
                    T: 'Cadrage projet',
                    C: 'Le besoin métier est-il exprimé ?',
                    D: 1,
                    I: 1,
                    P: 3,
                    X: 'Expression rédigée et validée = 100 ; Expression formalisée = 75 ; Tacite = 30 ; Non = 0 / 100',
                    Z: 'High',
                },
            ],
            'Prévoir, préparer et valider les disponibilités des ressources humaines du Numérique Responsable': [
                {
                    1: 'A',
                    2: 'A',
                    3: 'B',
                    ID: 30,
                    T: 'Emergence',
                    C: 'Les parties prenantes internes et externes sont-elles sensibilisées, voire formées/certifiées au NR ?',
                    D: 1,
                    I: 1,
                    P: 0,
                    X: 'Sensibilisations NR / Membre équipe',
                    Z: 'High',
                },
            ],
        },
    ],
    SPECIFICATIONS: [
        {
            'Organiser les ressources humaines projets pour permettre la prise en compte de la démarche NR': [
                {
                    1: 'A',
                    2: 'A',
                    3: 'B',
                    ID: 59,
                    T: 'Equipe projet',
                    C: "Les enjeux NR du projet ont-ils été communiqués à l'équipe dès l'origine ?",
                    D: 1,
                    I: 1,
                    P: 0,
                    X: 'Enjeux NR communiqués / Membre équipe',
                    Z: 'High',
                },
                {
                    1: 'B',
                    2: 'A',
                    3: 'B',
                    ID: 62,
                    T: 'Equipe projet',
                    C: "Chaque entité de l'équipe Projet dispose-t-elle des compétences NR ?",
                    D: 1,
                    I: 1,
                    P: 0,
                    X: 'Plan de formation NR = 100 ; Mise à dispo de ressources NR = 50 ; Non = 0 / 100',
                    Z: 'High',
                },
            ],
            "Organiser la méthodologie projet pour permettre d'appliquer une démarche NR": [
                {
                    1: 'B',
                    2: 'B',
                    3: 'B',
                    ID: 72,
                    T: 'Méthodologie projet',
                    C: 'Quelle proportion des fonctionnalités (User Story) ont une composante NR ? ',
                    D: 1,
                    I: 1,
                    P: 3,
                    X: 'Nombre US avec info NR / Nombre US',
                    Z: 'High',
                },
            ],
            'Préparer le suivi du cycle de vie du projet et des indicateurs de performance / bénéfice NR': [
                {
                    1: 'B',
                    2: 'C',
                    3: 'B',
                    ID: 94,
                    T: 'Processus économique',
                    C: "Dans le processus d'achat (Appel d'offre) des exigences d'engagement NR sont-elles demandées aux prestataires externes ?",
                    D: 1,
                    I: 1,
                    P: 1,
                    X: "Exigences NR dans AO / Appel d'offres",
                    Z: 'High',
                },
                {
                    1: 'A',
                    2: 'B',
                    3: 'A',
                    ID: 99,
                    T: 'Gestion du cycle de vie',
                    C: 'Les données et procédures spécifiées ont-elles toutes une information de fin de vie ?\n',
                    D: 1,
                    I: 1,
                    P: 5,
                    X: 'Formalisés = 100 ; prévus = 75 ; Identifiés = 50 ; Non = 0 / 100',
                    Z: 'Medium',
                },
            ],
        },
    ],
    'UX/UI': [
        {
            'Intégrer le Numérique Responsable dans les objectifs majeurs du projet': [
                {
                    1: 'B',
                    2: 'A',
                    3: 'B',
                    ID: 115,
                    T: 'Méthodologie',
                    C: "Dans les méthodes d'idéation, l'ensemble des parties prenantes est-il pris en compte dans toute sa dimension (humaine) ?",
                    D: 3,
                    I: 1,
                    P: 3,
                    X: 'Formalisés = 100 ; prévus = 75 ; Identifiés = 50 ; Non = 0 / 100',
                    Z: 'High',
                },
                {
                    1: 'A',
                    2: 'B',
                    3: 'B',
                    ID: 116,
                    T: 'Méthodologie',
                    C: "La planète est-elle prise en compte dans les méthodes d'idéation pour intégrer la dimension écologique (planet centric design) ?",
                    D: 3,
                    I: 1,
                    P: 3,
                    X: 'Formalisés = 100 ; prévus = 75 ; Identifiés = 50 ; Non = 0 / 100',
                    Z: 'High',
                },
                {
                    1: 'B',
                    2: 'B',
                    3: 'A',
                    ID: 117,
                    T: 'Méthodologie',
                    C: 'Les plus-values extra-financières du numérique responsable sont-elles valorisées dans le business model ?',
                    D: 3,
                    I: 1,
                    P: 8,
                    X: 'Formalisés = 100 ; prévus = 75 ; Identifiés = 50 ; Non = 0 / 100',
                    Z: 'High',
                },
            ],
            'Sensibiliser les parties prenantes internes et externes au Numérique Responsable': [
                {
                    1: 'B',
                    2: 'A',
                    3: 'A',
                    ID: 123,
                    T: 'Ressources Projet ',
                    C: 'Les parties prenantes sont-elles sensibilisées au NR ?',
                    D: 1,
                    I: 1,
                    P: 0,
                    X: 'Sensibilisations NR / Membre équipe',
                    Z: 'High',
                },
            ],
            "Rendre disponible et accessible le service numérique au plus grand nombre d'utilisateurs": [
                {
                    1: 'A',
                    2: 'A',
                    3: 'B',
                    ID: 134,
                    T: 'Méthodologie',
                    C: 'Une stratégie de compatibilité avec les terminaux et versions logicielles obsolètes est-elle définie ?',
                    D: 3,
                    I: 1,
                    P: 8,
                    X: 'Formalisés = 100 ; prévus = 75 ; Identifiés = 50 ; Non = 0 / 100',
                    Z: 'High',
                },
            ],
            "Permettre aux personnes en situation de handicap ou porteur de déficiences, d'accéder et d'utiliser efficacement le service numérique": [
                {
                    1: 'C',
                    2: 'A',
                    3: 'A',
                    ID: 136,
                    T: 'Méthodologie',
                    C: "Dès la conception, le service répond-t-il aux normes d'accessibilité en vigueur (au minimum) ?",
                    D: 2,
                    I: 1,
                    P: 3,
                    X: 'Formalisés = 100 ; prévus = 75 ; Identifiés = 50 ; Non = 0 / 100',
                    Z: 'High',
                },
            ],
            '"Less is More" : Concentrez vous sur les fonctionnalités essentielles et simplifiez votre interface': [
                {
                    1: 'A',
                    2: 'B',
                    3: 'B',
                    ID: 138,
                    T: 'UI',
                    C: "Une sobriété visuelle est-elle mise en place, pour limiter les ressources énergétiques et l'impact sur la dégradation matérielle des composants visuels, sonores et tactiles constitutifs de l'interface ?",
                    D: 0,
                    I: 1,
                    P: 6,
                    X: 'Formalisés = 100 ; prévus = 75 ; Identifiés = 50 ; Non = 0 / 100',
                    Z: 'High',
                },
                {
                    1: 'A',
                    2: 'A',
                    3: 'B',
                    ID: 139,
                    T: 'Méthodologie',
                    C: "Est-ce que les fonctionnalités sont utilisées par l'utilisateur ?",
                    D: 2,
                    I: 1,
                    P: 8,
                    X: "Validations d'utilisation / Fonctionnalités",
                    Z: 'High',
                },
            ],
            'Ingénierie média : alléger au maximum les médias du service numérique ( images, animations, contenu ... )': [
                {
                    1: 'A',
                    2: 'B',
                    3: 'A',
                    ID: 163,
                    T: 'UI',
                    C: 'Une politique de gestion/utilisation des médias afin de réduire leurs impacts est-elle en place, avec des critères de compression et de formats des médias ?\n',
                    D: 1,
                    I: 1,
                    P: 6,
                    X: 'Media compressés / Supports media',
                    Z: 'High',
                },
                {
                    1: 'A',
                    2: 'B',
                    3: 'B',
                    ID: 164,
                    T: 'UI',
                    C: 'Le nombre de polices de caractères (fonts) et les variantes de polices appelées (graisse, caractères utilisés dans le projet) sont-ils limités ?',
                    D: 1,
                    I: 1,
                    P: 3,
                    X: 'Moins de 3 polices = 100 ; 3-5 polices = 50 ; Plus de 5 = 0 / 100',
                    Z: 'High',
                },
            ],
            'Valeur: concevez un Service Numérique éthique, en ligne avec vos valeurs': [
                {
                    1: 'A',
                    2: 'B',
                    3: 'A',
                    ID: 174,
                    T: 'Méthodologie',
                    C: 'Le service évite-t-il les Dark Patterns ?',
                    D: 2,
                    I: 1,
                    P: 3,
                    X: 'Formalisés = 100 ; prévus = 75 ; Identifiés = 50 ; Non = 0 / 100',
                    Z: 'High',
                },
                {
                    1: 'B',
                    2: 'A',
                    3: 'A',
                    ID: 176,
                    T: 'Usage',
                    C: "Des règles en matière de respect de l'utilisateur sont-elles mises en place ?  ",
                    D: 3,
                    I: 1,
                    P: 3,
                    X: 'Formalisés = 100 ; prévus = 75 ; Identifiés = 50 ; Non = 0 / 100',
                    Z: 'Medium',
                },
            ],
        },
    ],
    CONTENUS: [
        {
            'Appliquer une démarche éditoriale pour les contenus': [
                {
                    1: 'B',
                    2: 'B',
                    3: 'C',
                    ID: 183,
                    T: '',
                    C: 'Les balises de mise en forme de texte répondent-elles au besoin de hiérarchisation des informations, et pas à des mises en valeur de présentation ?',
                    D: 1,
                    I: 1,
                    P: 6,
                    X: 'Tags analysés / Tags Hx',
                    Z: 'Medium',
                },
            ],
            "Réduire l'empreinte des contenus statiques": [
                {
                    1: 'A',
                    2: 'B',
                    3: 'B',
                    ID: 184,
                    T: 'Images',
                    C: 'Est-ce  que les images ont été compressées en amont dans un format adapté pour sa visualisation ?',
                    D: 1,
                    I: 1,
                    P: 6,
                    X: 'Images compressées / Images',
                    Z: 'High',
                },
            ],
            "Eviter les contenus actifs, conserver les contenus dynamiques sous contrôle de l'utilisateur": [
                {
                    1: 'A',
                    2: 'B',
                    3: 'B',
                    ID: 205,
                    T: 'Vidéos',
                    C: "Est-ce que l'information portée par la vidéo peut être remplacée par une alternative (infographie...)",
                    D: 1,
                    I: 1,
                    P: 3,
                    X: 'Vidéos analysées / Vidéos',
                    Z: 'High',
                },
            ],
            'Assurer la liaison entre les contenus et usages': [
                {
                    1: 'A',
                    2: 'C',
                    3: 'A',
                    ID: 225,
                    T: 'Téléchargements',
                    C: 'Les documents à télécharger sont-ils compressés, optimisés et accessibles ?',
                    D: 1,
                    I: 1,
                    P: 4,
                    X: 'Documents compressés / Documents disponibles',
                    Z: 'High',
                },
            ],
        },
    ],
    FRONTEND: [
        {
            'Utiliser les environnements et outils qui permettent de limiter les impacts': [
                {
                    1: 'B',
                    2: 'C',
                    3: 'B',
                    ID: 239,
                    T: 'API',
                    C: 'Est-ce que les fonctionnalités couvertes par des actions locales (côté client) sont privilégiées plutôt que des échanges API ?',
                    D: 1,
                    I: 1,
                    P: 6,
                    X: 'Fonctionnalités analysées / Fonctionnalités elligibles',
                    Z: 'High',
                },
            ],
            "Réduire les effets d'obsolescence": [
                {
                    1: 'A',
                    2: 'B',
                    3: 'B',
                    ID: 250,
                    T: 'User expérience ',
                    C: 'La plage de rétro-compatibilité est-elle définie ?',
                    D: 1,
                    I: 1,
                    P: 6,
                    X: 'Formalisés = 100 ; prévus = 75 ; Identifiés = 50 ; Non = 0 / 100',
                    Z: 'High',
                },
            ],
            'Implémenter et développer les fonctionnalités pour limiter les impacts': [
                {
                    1: 'A',
                    2: 'A',
                    3: 'A',
                    ID: 254,
                    T: 'Standards de développement',
                    C: 'Les fonctionnalités du service ne vont-elles pas au-delà des besoins utilisateurs ?',
                    D: 1,
                    I: 1,
                    P: 3,
                    X: 'Fonctionnalités utilisées / Fonctionnalités déployées',
                    Z: 'High',
                },
            ],
            "Implémenter des solutions techniques dont l'impact est le plus faible": [
                {
                    1: 'A',
                    2: 'A',
                    3: 'B',
                    ID: 287,
                    T: 'UI',
                    C: 'Une version épurée est-elle disponible pour les impressions ?',
                    D: 1,
                    I: 1,
                    P: 8,
                    X: 'Formalisés = 100 ; prévus = 75 ; Identifiés = 50 ; Non = 0 / 100',
                    Z: 'High',
                },
            ],
            'Rechercher la mise en oeuvre de comportements sobres': [
                {
                    1: 'A',
                    2: 'B',
                    3: 'A',
                    ID: 298,
                    T: 'UI',
                    C: 'Les objets de cartographie, animations, vidéos sont-ils présentés dans un mode statique ?',
                    D: 1,
                    I: 1,
                    P: 6,
                    X: 'Objets analysés / Objets dynamiques',
                    Z: 'High',
                },
            ],
        },
    ],
    ARCHITECTURE: [
        {
            "Anticiper l'exploitation des services": [
                {
                    1: 'A',
                    2: 'B',
                    3: 'A',
                    ID: 307,
                    T: 'Cycle de vie',
                    C: "Est-ce que les environnements autres que production (DEV, QA, ...) sont éteints ou décommissionnés en dehors des plages d'usage (la nuit, en dehors des périodes de tests)?",
                    D: 1,
                    I: 1,
                    P: 2,
                    X: 'Formalisés = 100 ; prévus = 75 ; Identifiés = 50 ; Non = 0 / 100',
                    Z: 'Low',
                },
            ],
            'Associer les données, les flux, les applicatifs et la sécurité pour permettre leur identification et leur traçabilité': [
                {
                    1: 'B',
                    2: 'B',
                    3: 'B',
                    ID: 333,
                    T: 'Cycle de vie',
                    C: 'Chaque composant déployé est-il qualifié du point de vue de sa durée de vie, et les procédures de déprovisonnement sont-elles systématiquement exprimées ?',
                    D: 1,
                    I: 1,
                    P: 5,
                    X: 'Formalisés = 100 ; prévus = 75 ; Identifiés = 50 ; Non = 0 / 100',
                    Z: 'Medium',
                },
            ],
            'Définir les objectifs NR du projet et leur adéquation dans le contexte opérationnel': [
                {
                    1: 'B',
                    2: 'B',
                    3: 'B',
                    ID: 351,
                    T: 'Design Logiciel',
                    C: "L'ensemble des équipements techniques utilisés par le service sont-ils identifiés?",
                    D: 1,
                    I: 1,
                    P: 1,
                    X: 'Formalisés = 100 ; prévus = 75 ; Identifiés = 50 ; Non = 0 / 100',
                    Z: 'High',
                },
            ],
        },
    ],
    BACKEND: [
        {
            "Réduire l'impact des données de leur stockage et accès": [
                {
                    1: 'A',
                    2: 'C',
                    3: 'A',
                    ID: 364,
                    T: 'Données',
                    C: "Est-ce que le nombre de requêtes est minimisé (proscrire l'usage de boucle) ?\n",
                    D: 1,
                    I: 1,
                    P: 6,
                    X: 'Formalisés = 100 ; prévus = 75 ; Identifiés = 50 ; Non = 0 / 100',
                    Z: 'High',
                },
            ],
            'Utiliser les composants techniques qui améliorent les aspects NR, sécurité et performance': [
                {
                    1: 'B',
                    2: 'B',
                    3: 'B',
                    ID: 400,
                    T: 'Qualité',
                    C: 'Les fonctionnalités sont-elles documentées pour permettre leur réutilisation ?',
                    D: 1,
                    I: 1,
                    P: 7,
                    X: 'Formalisés = 100 ; prévus = 75 ; Identifiés = 50 ; Non = 0 / 100',
                    Z: 'Low',
                },
            ],
            'Limiter la volumétrie des échanges ': [
                {
                    1: 'A',
                    2: 'B',
                    3: 'A',
                    ID: 401,
                    T: 'Flux',
                    C: 'Est-ce que les données échangées sont compressées / minifiées avant transmission ?',
                    D: 1,
                    I: 1,
                    P: 4,
                    X: 'Volume compressé / Volume de transfert',
                    Z: 'High',
                },
            ],
            'Mettre en place une méthodologie qui favorise la prise en compte des aspects NR': [
                {
                    1: 'A',
                    2: 'B',
                    3: 'A',
                    ID: 425,
                    T: 'Cycle de vie',
                    C: 'Est-ce que la fonctionnalité envisagée est utile ?',
                    D: 1,
                    I: 1,
                    P: 3,
                    X: 'Fonctionnalités utilisées / Fonctionnalités déployées',
                    Z: 'High',
                },
            ],
        },
    ],
};
