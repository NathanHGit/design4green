window.onload = () => app();

let screenId = 0;
let activeLi = null;
let activeMenu = null;

function app() {
    const sidebar = document.querySelector('#sidebar');
    const li = document.querySelector('#sidebar').querySelectorAll('li');
    const menu = document.querySelectorAll('.menu');
    const buttons = sidebar.querySelectorAll('button[step]');

    activeLi = document.querySelector('li.active');
    activeMenu = document.querySelector('.menu.active');

    httpRequest('STRATEGIE');

    for (let i = 0; i < buttons.length; i++) {
        buttons[i].onclick = function () {
            this.getAttribute('step') == 'next' ? ++screenId : --screenId;
            activeMenu.classList.remove('active');
            menu[screenId].classList.add('active');
            activeMenu = menu[screenId];

            if (screenId == 0) {
                httpRequest('STRATEGIE');
            } else if (screenId == 1) {
                setFamily({});
            }
        };
    }

    li.forEach((element) => {
        element.onclick = function () {
            activeLi.classList.remove('active');
            element.classList.add('active');
            activeLi = element;
            httpRequest(element.innerHTML.substring(0, activeLi.innerHTML.indexOf('(')));
        };
    });

    document.querySelector('#display').onchange = function () {
        document.documentElement.style.setProperty('--width', this.checked ? 'calc(100% / 3 - 60px)' : '100%');
    };
}

function httpRequest(id) {
    fetch('/family?id=' + id, {
        cache: 'force-cache',
    })
        .then((response) => {
            return response.json();
        })
        .then((results) => {
            //console.log('results', Object.values(results[0]));
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

        let input = document.createElement('input');
        input.type = 'checkbox';
        input.id = 'spec' + i;
        input.name = 'family';
        div.appendChild(input);

        let label = document.createElement('label');
        label.setAttribute('for', 'spec' + i);
        label.innerHTML = i + '. ' + key;
        div.appendChild(label);

        let box = document.createElement('div');
        box.className = 'specs';

        for (let j = 0; j < value.length; j++) {
            let spec = document.createElement('div');
            let txt = document.createElement('p');
            txt.innerHTML = value[j].C;
            spec.appendChild(txt);

            if (!value[j].I) {
                spec.onclick = function () {
                    let val = parseInt(active.innerHTML.match(/\((.*)\)/).pop());

                    if (!spec.classList.contains('border')) {
                        ++val;
                        specs.push(value[j]);
                        spec.classList.add('border');
                    } else {
                        for (let i = 0; i < specs.length; i++) {
                            if (specs[i].ID === value[j].ID) {
                                specs.splice(i, 1);
                                --val;
                                spec.classList.remove('border');
                            }
                        }
                    }
                    active.innerHTML = active.innerHTML.substr(0, active.innerHTML.indexOf('(') + 1) + val + ')';
                };
            } else {
                spec.classList.add('unmissable');
            }
            box.appendChild(spec);
        }
        div.appendChild(box);
        main.appendChild(div);
        i++;
    }
}

let specs = [
    {
        ARCHITECTURE: [
            {
                ID: 11,
                P1: 'A',
                P2: 'B',
                P3: 'A',
                R: "Anticiper l'exploitation des services",
                C: "Est-ce que les environnements autres que production (DEV, QA, ...) sont éteints ou décommissionnés en dehors des plages d'usage (la nuit, en dehors des périodes de tests)?",
                J: "En dehors de la production, qui peut avoir une exigence de disponibilité 24/7, les autres environnements (tests, intégration, recette) sont le plus souvent liés à des opérations humaines soumises à des plages horaires restreintes, voire à des périodes limitées. Lorsque les environnements ne sont pas utilisés, ils ne doivent pas être actifs afin de réduire les consommations énergétiques de ces configurations. Ils doivent être décommissionnés lorsqu'aucune utilisation ultérieure n'est envisagée sur une longue période.",
                E: 2,
                T: 1,
                D: 1,
                I: 1,
            },
            {
                ID: 36,
                P1: 'B',
                P2: 'B',
                P3: 'B',
                R: 'Associer les données, les flux, les applicatifs et la sécurité pour permettre leur identification et leur traçabilité',
                C: 'Chaque composant déployé est-il qualifié du point de vue de sa durée de vie, et les procédures de déprovisonnement sont-elles systématiquement exprimées ?',
                J: "Toutes les ressources d'un composant doivent être gérées et une durée de vie, un processus de retrait doit être mis en place. Ces éléments doivent aussi prendre en compte les traitements récurrents (batch, CRON, ..), les données et les sauvegardes. Le maintien ou l'oubli sur des systèmes en production de composants inactifs est à la fois un gaspillage de ressources, mais aussi une fragilité dans la sécurité.",
                E: 5,
                T: 1,
                D: 1,
                I: 1,
            },
            {
                ID: 53,
                P1: 'B',
                P2: 'B',
                P3: 'B',
                R: 'Définir les objectifs NR du projet et leur adéquation dans le contexte opérationnel',
                C: "L'ensemble des équipements techniques utilisés par le service sont-ils identifiés?",
                J: 'La conception, le développement, les tests, la production, la gestion de disponibilité sont des étapes qui vont utiliser des ressources techniques. Chacune de ces ressources doit être identifiée et ses caractéristiques répertoriées. ',
                E: 1,
                T: 1,
                D: 1,
                I: 1,
            },
        ],
        BACKEND: [
            {
                ID: 63,
                P1: 'A',
                P2: 'C',
                P3: 'A',
                R: "Réduire l'impact des données de leur stockage et accès",
                C: "Est-ce que le nombre de requêtes est minimisé (proscrire l'usage de boucle) ?\n",
                J: "Chaque échange va consommer des ressources sur l'émetteur et le destinataire, consommer des flux d'échange et des données. Il est nécessaire de réduire ces échanges",
                E: 6,
                T: 1,
                D: 1,
                I: 1,
            },
            {
                ID: 89,
                P1: 'B',
                P2: 'B',
                P3: 'B',
                R: 'Utiliser les composants techniques qui améliorent les aspects NR, sécurité et performance',
                C: 'Les fonctionnalités sont-elles documentées pour permettre leur réutilisation ?',
                J: "D'une part dans une organisation les projets présentent beaucoup de similitudes, d'autre part les aspects NR adressés dans les projets sont souvent du même ordre. Afin de capitaliser sur ces éléments et bénéficier des efforts produits, il est nécessaire de s'appuyer sur un socle de connaissances stables. Toutefois la maturité d'une organisation d'un point de vue NR est amenée à progresser, il faut donc que les étapes documentées puissent aussi suivre ces évolutions et participer activement à cet accroissement de maturité. ",
                E: 7,
                T: 1,
                D: 1,
                I: 1,
            },
            {
                ID: 100,
                P1: 'A',
                P2: 'B',
                P3: 'A',
                R: 'Limiter la volumétrie des échanges ',
                C: 'Est-ce que les données échangées sont compressées / minifiées avant transmission ?',
                J: 'Les échanges indispensables doivent permettre de réduire la volumétrie des transferts. La minification des échanges, la compression des données échangées permettent de réduire ces volumes. Toutefois les opérations de compression et décompression nécessitent des exécutions de traitements qui peuvent annuler le bénéfice de la compression des échanges.',
                E: 4,
                T: 1,
                D: 1,
                I: 1,
            },
            {
                ID: 121,
                P1: 'A',
                P2: 'B',
                P3: 'A',
                R: 'Mettre en place une méthodologie qui favorise la prise en compte des aspects NR',
                C: 'Est-ce que la fonctionnalité envisagée est utile ?',
                J: "La sélection des fonctionnalités jugées indispensables peuvent être remises en cause dans leur forme initiale par rapport à leur impact NR. Dans ce cas, les coûts / bénéfices devront prendre en compte ces oppositions et faire l'objet d'adaptation pour faire converger les 2 approches : nécessité fonctionnelle et impact NR.",
                E: 3,
                T: 1,
                D: 1,
                I: 1,
            },
        ],
        CONTENUS: [
            {
                ID: 137,
                P1: 'B',
                P2: 'B',
                P3: 'C',
                R: 'Appliquer une démarche éditoriale pour les contenus',
                C: 'Les balises de mise en forme de texte répondent-elles au besoin de hiérarchisation des informations, et pas à des mises en valeur de présentation ?',
                J: "Les automates et assistants d'accessibilité utilisent les balises pour se repérer et structurer la restitution. L'emploi de balises ne correspondant pas à la structure du contenu, par exemple pour des mises en forme de texte, rendent l'utilisation de ces assistants plus difficiles pour une bonne compréhension du contenu.",
                E: 6,
                T: 1,
                D: 1,
                I: 1,
            },
            {
                ID: 140,
                P1: 'A',
                P2: 'B',
                P3: 'B',
                R: "Réduire l'empreinte des contenus statiques",
                C: 'Est-ce  que les images ont été compressées en amont dans un format adapté pour sa visualisation ?',
                J: "La transmission de données compressées est indispensable pour réduire l'impact des échanges, en revanche les algorithmes de compression sont consommateurs de ressources techniques de traitement, de stockage intermédiaire. Lorsque les compressions sont effectuées à chaque demande d'échange, le bénéfice de la compression peut disparaître ou même augmenter l'impact.",
                E: 6,
                T: 1,
                D: 1,
                I: 1,
            },
            {
                ID: 158,
                P1: 'A',
                P2: 'B',
                P3: 'B',
                R: "Eviter les contenus actifs, conserver les contenus dynamiques sous contrôle de l'utilisateur",
                C: "Est-ce que l'information portée par la vidéo peut être remplacée par une alternative (infographie...)",
                J: 'Les informations apportées par la vidéo sont souvent transposables de manière à être proposées sous forme statique, nettement moins consommatrices de ressources.',
                E: 3,
                T: 1,
                D: 1,
                I: 1,
            },
            {
                ID: 178,
                P1: 'A',
                P2: 'C',
                P3: 'A',
                R: 'Assurer la liaison entre les contenus et usages',
                C: 'Les documents à télécharger sont-ils compressés, optimisés et accessibles ?',
                J: "Les documents disponibles pour l'utilisateur dans le service doivent être compressés pour réduire les impacts liés aux transferts de ces données.",
                E: 4,
                T: 1,
                D: 1,
                I: 1,
            },
        ],
        FRONTEND: [
            {
                ID: 190,
                P1: 'A',
                P2: 'B',
                P3: 'A',
                R: 'Rechercher la mise en oeuvre de comportements sobres',
                C: 'Les objets de cartographie, animations, vidéos sont-ils présentés dans un mode statique ?',
                J: "Les objets de cartographie n'ont pas toujours une pertinence à être présentés sous forme d'objets dynamiques et interactifs. La version statique sous forme d'image des plans peut apporter à l'utilisateur suffisamment d'information sans qu'il n'ait besoin d'interagir avec l'objet. Les objets de cartographie sont complexes et nécessitent des ressources de traitements et l'utilisation de capteurs, ce que les versions images des plans évite. L'utilisateur conserve la possibilité d'interaction en activant la version dynamique mais uniquement à sa demande.",
                E: 6,
                T: 1,
                D: 1,
                I: 1,
            },
            {
                ID: 198,
                P1: 'B',
                P2: 'C',
                P3: 'B',
                R: 'Utiliser les environnements et outils qui permettent de limiter les impacts',
                C: 'Est-ce que les fonctionnalités couvertes par des actions locales (côté client) sont privilégiées plutôt que des échanges API ?',
                J: "Les charges introduites par la sollicitation de ressources distantes via des mécanismes API peuvent être importantes. Certaines fonctionnalités pourraient être couvertes par des actions locales plutôt que distantes ce qui réduit la volumétrie des échanges et le nombre de composants mis en oeuvre, donc réduit l'impact environnemental. En revanche, il ne faut pas que le traitement en local d'une fonctionnalité qui peut nécessiter de nouvelles dépendances techniques, alourdisse la charge sur le front end.",
                E: 6,
                T: 1,
                D: 1,
                I: 1,
            },
            {
                ID: 209,
                P1: 'A',
                P2: 'B',
                P3: 'B',
                R: "Réduire les effets d'obsolescence",
                C: 'La plage de rétro-compatibilité est-elle définie ?',
                J: "Les équipements utilisateurs sont de plus en plus performants. Lorsque les services numériques exploitent toutes les capacités des équipements, cela écarte certains publics qui ne disposent pas des même outils performants. Cela empêche aussi d'aborder la fourniture des fonctionnalités avec des moyens moins gourmands en ressources mais procurant le même résultat.",
                E: 6,
                T: 1,
                D: 1,
                I: 1,
            },
            {
                ID: 213,
                P1: 'A',
                P2: 'A',
                P3: 'A',
                R: 'Implémenter et développer les fonctionnalités pour limiter les impacts',
                C: 'Les fonctionnalités du service ne vont-elles pas au-delà des besoins utilisateurs ?',
                J: "Le nombre de fonctionnalités disponibles dans un service numérique impactent directement la consommation de ressources et l'impact environnemental. En créant des fonctionnalités de peu d'utilité ce sont des sources de création de dettes environnementales totalement inutiles. Les fonctionnalités augmentent aussi le volume du service, qui introduisent des délais de chargements et des espaces de stockage supplémentaires.",
                E: 3,
                T: 1,
                D: 1,
                I: 1,
            },
            {
                ID: 241,
                P1: 'A',
                P2: 'A',
                P3: 'B',
                R: "Implémenter des solutions techniques dont l'impact est le plus faible",
                C: 'Une version épurée est-elle disponible pour les impressions ?',
                J: "Les flux de dématérialisation sont parfois rompus, et imposent la production d'écrits sur papiers. L'utilisateur dans certains cas peut aussi être plus confortable à utiliser des documents imprimés plutôt que 100% électroniques. Les impressions ont un impact environnemental important, que ce soit dans la consommation de papier, de consommables tels que les cartouches et encres d'impression. Les besoins de présentation en électronique ou en impression sont différents, d'autre part la limitation de l'empreinte environnementale doit conduire à réduire la densité et le volume d'informations imprimées.",
                E: 8,
                T: 1,
                D: 1,
                I: 1,
            },
        ],
        SPECIFICATIONS: [
            {
                ID: 320,
                P1: 'A',
                P2: 'A',
                P3: 'B',
                R: 'Organiser les ressources humaines projets pour permettre la prise en compte de la démarche NR',
                C: "Les enjeux NR du projet ont-ils été communiqués à l'équipe dès l'origine ?",
                J: "La démarche NR est mieux prise en compte lorsqu'elle s'insère par un processus systémique et qu'elle est exposée comme direction à suivre pour tous les acteurs.",
                E: 0,
                T: 1,
                D: 1,
                I: 1,
            },
            {
                ID: 322,
                P1: 'B',
                P2: 'A',
                P3: 'B',
                R: 'Organiser les ressources humaines projets pour permettre la prise en compte de la démarche NR',
                C: "Chaque entité de l'équipe Projet dispose-t-elle des compétences NR ?",
                J: 'Chacune des étapes projet requiert des connaissances spécifiques pour les aspects NR, il est important que toutes les étapes soient couvertes afin que les résultats NR soient cohérents tout au long de la vie du service.',
                E: 0,
                T: 1,
                D: 1,
                I: 1,
            },
            {
                ID: 332,
                P1: 'B',
                P2: 'B',
                P3: 'B',
                R: "Organiser la méthodologie projet pour permettre d'appliquer une démarche NR",
                C: 'Quelle proportion des fonctionnalités (User Story) ont une composante NR ? ',
                J: "Certaines fonctionnalités peuvent être conçues avec des impacts NR très différents. En l'absence de clarification, la solution choisie sera le plus souvent pilotée par la facilité ou l'appétence technique, ce qui s'oppose en général à la performance NR. Le seul moyen de guider les décisions est d'introduire des points d'attention sur les aspects NR dans la majorité des User Stories.",
                E: 3,
                T: 1,
                D: 1,
                I: 1,
            },
            {
                ID: 355,
                P1: 'B',
                P2: 'C',
                P3: 'B',
                R: 'Préparer le suivi du cycle de vie du projet et des indicateurs de performance / bénéfice NR',
                C: "Dans le processus d'achat (Appel d'offre) des exigences d'engagement NR sont-elles demandées aux prestataires externes ?",
                J: "Un projet est rarement réalisé avec un périmètre couvert à 100% au sein de l'organisation, nombre de ressources externes sont mobilisées au cours du projet. Les spécifications permettent d'identifier ces ressources nécessaires et leur associer des exigences NR pour permettre de sélectionner les prestataires en fonctions des contraintes techniques, de solvabilité économique et de NR.",
                E: 1,
                T: 1,
                D: 1,
                I: 1,
            },
            {
                ID: 360,
                P1: 'A',
                P2: 'B',
                P3: 'A',
                R: 'Préparer le suivi du cycle de vie du projet et des indicateurs de performance / bénéfice NR',
                C: 'Les données et procédures spécifiées ont-elles toutes une information de fin de vie ?\n',
                J: "Les spécifications font apparaître des collections de données des procédures asynchrones ou des tâches périodiques indispensables au bon fonctionnement du service. Ces éléments sont le plus souvent invisibles et en l'absence de spécifications explicites des processus de retrait ils sont rarement pris en compte dans les fins d'exploitation d'un service. Chacun de ces éléments doit porter sa propre information de fin de vie.",
                E: 5,
                T: 1,
                D: 1,
                I: 1,
            },
        ],
        STRATEGIE: [
            {
                ID: 379,
                P1: 'A',
                P2: 'B',
                P3: 'A',
                R: "Définir et valider les besoins et les enjeux du projet afin d'anticiper les impacts",
                C: 'Le besoin métier est-il exprimé ?',
                J: 'Les incertitudes poussent à extrapoler les besoins souvent au delà des attentes réelles ce qui est nuisible pour les impacts environnementaux',
                E: 3,
                T: 1,
                D: 1,
                I: 1,
            },
            {
                ID: 405,
                P1: 'A',
                P2: 'A',
                P3: 'B',
                R: 'Prévoir, préparer et valider les disponibilités des ressources humaines du Numérique Responsable',
                C: 'Les parties prenantes internes et externes sont-elles sensibilisées, voire formées/certifiées au NR ?',
                J: "Chaque partie prenante à besoin d'une information efficace sur son domaine d'expertise et d'action, seul un plan de formation adapté peut apporter cette efficacité en amont des projets",
                E: 0,
                T: 1,
                D: 1,
                I: 1,
            },
        ],
        'UX/UI': [
            {
                ID: 434,
                P1: 'B',
                P2: 'A',
                P3: 'B',
                R: 'Intégrer le Numérique Responsable dans les objectifs majeurs du projet',
                C: "Dans les méthodes d'idéation, l'ensemble des parties prenantes est-il pris en compte dans toute sa dimension (humaine) ?",
                J: "Mettre l'Utilisateur au centre de la réflexion est la garantie de couvrir les besoins essentiels de vos cibles et d'avancer dans le bon sens. Par Utilisateurs, nous entendons les usagers finaux du service ou du produit mais également les différentes parties prenantes du projet. Considérer vos utilisateurs avec une dimension humaine et empathique permet d'élargir le prisme de votre réflexion et d'aller au-delà des aspects économiques et technologiques du projet.",
                E: 3,
                T: 1,
                D: 3,
                I: 1,
            },
            {
                ID: 435,
                P1: 'A',
                P2: 'B',
                P3: 'B',
                R: 'Intégrer le Numérique Responsable dans les objectifs majeurs du projet',
                C: "La planète est-elle prise en compte dans les méthodes d'idéation pour intégrer la dimension écologique (planet centric design) ?",
                J: "Chaque décision de conception a un impact. Si les problématiques environnementales et écologiques ne sont pas au coeur de l'analyse, aucun objectif de maîtrise ou de réduction des impacts ne sera pris en compte et donc respecté.",
                E: 3,
                T: 1,
                D: 3,
                I: 1,
            },
            {
                ID: 436,
                P1: 'B',
                P2: 'B',
                P3: 'A',
                R: 'Intégrer le Numérique Responsable dans les objectifs majeurs du projet',
                C: 'Les plus-values extra-financières du numérique responsable sont-elles valorisées dans le business model ?',
                J: "Le Numérique Responsable (NR) peut-être considéré comme un réel vecteur de développement économique au sein de votre organisation. Intégrer la dimension NR de façon pérenne à votre business model permettra d'éviter des arbitrages permanents sur sa valorisation et son intégration à vos futurs projets.",
                E: 8,
                T: 1,
                D: 3,
                I: 1,
            },
            {
                ID: 442,
                P1: 'A',
                P2: 'B',
                P3: 'A',
                R: 'Valeur: concevez un Service Numérique éthique, en ligne avec vos valeurs',
                C: 'Le service évite-t-il les Dark Patterns ?',
                J: "Certains services sont pensés pour créer une certaine forme de dépendance à celui-ci. L'utilisateur ne doit pas être soumis et exposé à certaines mécaniques de sur-consommation numérique.",
                E: 3,
                T: 1,
                D: 2,
                I: 1,
            },
            {
                ID: 444,
                P1: 'B',
                P2: 'A',
                P3: 'A',
                R: 'Valeur: concevez un Service Numérique éthique, en ligne avec vos valeurs',
                C: "Des règles en matière de respect de l'utilisateur sont-elles mises en place ?  ",
                J: "Certains services sont pensés pour créer une certaine forme de dépendance à celui-ci. L'utilisateur doit pouvoir rester objectivement juge de sa consommation numérique",
                E: 3,
                T: 1,
                D: 3,
                I: 1,
            },
            {
                ID: 447,
                P1: 'B',
                P2: 'A',
                P3: 'A',
                R: 'Sensibiliser les parties prenantes internes et externes au Numérique Responsable',
                C: 'Les parties prenantes sont-elles sensibilisées au NR ?',
                J: "Pour adhérer, il faut comprendre. Le NR n'est pas une discipline technique. Les principes du NR doivent être mis en oeuvre dans des pratiques métiers et les comportements de chacun des acteurs. Toutes les parties prenantes du projet doivent être sensibilisées au NR pour agir à leur niveau.",
                E: 0,
                T: 1,
                D: 1,
                I: 1,
            },
            {
                ID: 456,
                P1: 'A',
                P2: 'A',
                P3: 'B',
                R: "Rendre disponible et accessible le service numérique au plus grand nombre d'utilisateurs",
                C: 'Une stratégie de compatibilité avec les terminaux et versions logicielles obsolètes est-elle définie ?',
                J: "Les avancées technologiques poussent à augmenter en permanence les exigences matérielles, ce qui réduit le parc de périphériques sur lesquels un service peut s'exécuter. Cet aspect écarte certains utilisateurs et pousse au renouvellement d'équipements encore en état de fonctionner avec l'impact environnemental associé.",
                E: 8,
                T: 1,
                D: 3,
                I: 1,
            },
            {
                ID: 460,
                P1: 'C',
                P2: 'A',
                P3: 'A',
                R: "Permettre aux personnes en situation de handicap ou souffrant de déficiences, d'accéder et d'utiliser efficacement le service numérique",
                C: "Dès la conception, le service répond-t-il aux normes d'accessibilité en vigueur (au minimum) ?",
                J: "Au delà des aspects purement réglementaires, l'anticipation de la prise en compte de l'accessibilité est nécessaire pour assurer une couverture de ce sujet durant toute la durée de vie du service. Anticiper les futurs points de règlements et normes permet de pérenniser le service en limitant les besoins de mises à jour dictées par l'environnement légal. ",
                E: 3,
                T: 1,
                D: 2,
                I: 1,
            },
            {
                ID: 462,
                P1: 'A',
                P2: 'A',
                P3: 'B',
                R: '"Less is More" : Concentrez vous sur les fonctionnalités essentielles et simplifiez votre interface',
                C: "Est-ce que les fonctionnalités sont utilisées par l'utilisateur ?",
                J: "Selon des études (cast software et standish group), 70% des fonctionnalités ne sont jamais ou rarement utilisées. (ref 115 bonnes pratiques)\n\nLe nombre de fonctionnalités disponibles dans un service numérique impactent directement la consommation de ressources et l'impact environnemental, en créant des fonctionnalités de peu d'utilité. Ce sont des sources de création de dettes environnementales totalement inutiles. Les fonctionnalités augmentent aussi le volume du service, qui introduisent des délais de chargements, des espaces de stockage supplémentaires.",
                E: 8,
                T: 1,
                D: 2,
                I: 1,
            },
            {
                ID: 466,
                P1: 'A',
                P2: 'B',
                P3: 'B',
                R: '"Less is More" : Concentrez vous sur les fonctionnalités essentielles et simplifiez votre interface',
                C: "Une sobriété visuelle est-elle mise en place, pour limiter les ressources énergétiques et l'impact sur la dégradation matérielle des composants visuels, sonores et tactiles constitutifs de l'interface ?",
                J: "Des éléments/composants visuels, sonores et tactiles peuvent être mis en avant dans une démarche purement esthétique et/ou marketing mais n'ont que très peu d'intérêt pour l'utilisateur. La simplification de ces éléments apportera une meilleure ergonomie et un usage adapté à chacun ainsi qu'une réduction de l'impact énergétique.",
                E: 6,
                T: 2,
                D: 0,
                I: 1,
            },
            {
                ID: 486,
                P1: 'A',
                P2: 'B',
                P3: 'A',
                R: 'Ingénierie média : alléger au maximum les médias du service numérique ( images, animations, contenu ... )',
                C: 'Une politique de gestion/utilisation des médias afin de réduire leurs impacts est-elle en place, avec des critères de compression et de formats des médias ?\n',
                J: "Le volume de données transférées augmente l'empreinte environnementale du service. Il est nécessaire de proposer les médias nécessaires à l'affichage du service dans la compression idoine afin d'améliorer le service et augmenter sa sobriété. ",
                E: 6,
                T: 1,
                D: 1,
                I: 1,
            },
            {
                ID: 487,
                P1: 'A',
                P2: 'B',
                P3: 'B',
                R: 'Ingénierie média : alléger au maximum les médias du service numérique ( images, animations, contenu ... )',
                C: 'Le nombre de polices de caractères (fonts) et les variantes de polices appelées (graisse, caractères utilisés dans le projet) sont-ils limités ?',
                J: 'Les polices de caractères peuvent être très volumineuses. En réduisant le nombre de polices uniquement à celles utilisées dans le service, la  volumétrie échangée diminue.',
                E: 3,
                T: 1,
                D: 1,
                I: 1,
            },
        ],
    },
];
