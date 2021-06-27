import { Accordion, Card, Col, Container, Nav, Row, Tab } from "react-bootstrap";

export function Commands() {
    const CommandsArray: ICommands[] = [
        {
            id: "core",
            name: "Comandos Núcleo",
            commands: [
                {
                    name: "botsuggestion",
                    descriptionShort: "Da una sugerencia para el bot y se envía al canal del servidor oficial.",
                    description:
                        "Si tienes una idea puedes usar este comando, será enviado al canal sugerencias del servidor de soporte para ser votada por la comunidad y calificada por el desarrollador o un Bot Manager. También puedes mandar una imagen junto al comando.",
                    alias: ["botsugerencia", "bsgn", "botsugerir"],
                    use: "<sugerencia>",
                    variables: [{ name: "sugerencias", description: "Un texto detallando la sugerencia o idea.", require: true }]
                },
                {
                    name: "bugreport",
                    descriptionShort:
                        "Reporta cualquier problema o falla al servidor de soporte oficial para arreglar el problema. También puedes mandar una imagen junto al comando.",
                    description:
                        'Cuando encuentres una falla, ya sean sencillas como de gramática, ortografía, apartados que aparezcan como "undefined" o fallas más seberas como que no se ejecuta un comando correctamente, no sale el resultado esperado, no responde nada, etc, usa este comando detallando lo mejor posible y si es necesario mandando una imagen, camptura de pantalla para mayor explicación.',
                    alias: ["botreport", "reportarbug"],
                    use: "<problema|bug>",
                    variables: [{ name: "problema | bug", description: "Un texto detallando el problema", require: true }]
                },
                {
                    name: "donate",
                    descriptionShort: "Ve las opciones que tienes para contribuir en el desarrollo y la sustantividad del bot.",
                    description: "Hay distintas maneras de apoyar, no solamente económicamente, pero es la mejor opción para mantener el bot 24/7.",
                    alias: ["donar"]
                },
                {
                    name: "help",
                    descriptionShort: "Toda la información de los comandos.",
                    description: "",
                    alias: ["ayuda", "comandos", "commands"],
                    use: "[dm] [nombre de comando]",
                    variables: [
                        { name: "dm | md", description: "Coloca esta palabla sola para recibir el mensaje a tu mensajes privados.", require: false },
                        {
                            name: "nombre de commando",
                            description:
                                "Coloca el nombre o alias de un comando para saber tu ayuda detallada como sus variables que espera, alias, descripción, permisos requeridos, cooldown.",
                            require: false
                        }
                    ]
                },
                {
                    name: "invite",
                    descriptionShort: "Invitación para que puedas meter al bot a tu gremio. Además te proporciona links útiles.",
                    description:
                        'Te dará el enlace para invitar el bot a tu servidor que administras, deberás contar con el permiso "Guild Manager" o mayor. También proporciona la invitación del servidor oficial.',
                    alias: ["invitar"]
                },
                {
                    name: "ping",
                    descriptionShort: "Obtén el tiempo de respuesta del bot",
                    description:
                        "Te dice el tiempo en milisegundos que tarda el bot en comunicarse con la API de Discord y el tiempo que tarda el bot en responder a un usuario.",
                    alias: ["silbido"]
                },
                {
                    name: "release",
                    descriptionShort: "Todo acerca de las novedades del bot",
                    description: "Se mostrará todas las novedades, arreglos y cambios que trajo la última actualización del bot.",
                    alias: ["novedades", "upgrade"]
                },
                {
                    name: "stats",
                    descriptionShort: "Obtén las estadísticas y datos técnicos del bot",
                    description:
                        "Muestra datos generales del bot como el total de servidores, usuarios en caché, tiempo encendido, creador, versión del bot, versión de la librería, canales en caché, conexiones a voz, número total de comandos públicos, hora del bot en el servidor y sistema operativo del servidor.",
                    alias: ["estadísticas", "estadisticas"]
                },
                {
                    name: "vote",
                    descriptionShort: "Ve las opciones que tienes para votar en las listas de bots.",
                    description: "Muestra las listas de bots disponibles para votar o donde se encuentra el bot junto con una pequeña descripcción.",
                    alias: ["votar"]
                }
            ]
        },
        {
            id: "config",
            name: "Configuración",
            commands: [
                {
                    name: "addchatexclude",
                    descriptionShort: "Agrega un canal para que no se pueda ganar dinero por escribir en ese canal.",
                    description:
                        "Cuando un canal es agregado con este comando, no ganará dinero por escribir pero puede seguir ocupando comandos del bot en dicho canal.",
                    alias: ["addce"],
                    use: "[#canal|all]",
                    variables: [
                        {
                            name: "#canal",
                            description:
                                "Puedes mencional, colocar su ID o su nombre exacto del canal. Si no colocas este parámetro, se tomará el canal donde usaste el comando",
                            require: false
                        },
                        { name: "all", description: "Coloca esta palabra en vez del canal para añadir todos los canales del servidor.", require: false }
                    ]
                },
                {
                    name: "addmoney",
                    descriptionShort: "Añade dinero del servidor a un usuario.",
                    description: "Con este comando le añadiras dinero a cualquier usuario",
                    alias: ["adddinero"],
                    use: "<@usuario> <cantidad de dinero>",
                    variables: [
                        { name: "@usuario", description: "Mención, ID o nombre exacto del usuario al que desea añadirle dinero", require: true },
                        { name: "cantidad", description: "La cantidad de dinero que se le añadirá al usuario", require: true }
                    ]
                },
                {
                    name: "clearitems",
                    descriptionShort: "Elimine todos los items, o uno en especifico, del inventario de todos los usuarios o de uno en especifico.",
                    description: "",
                    alias: ["clearitem"],
                    use: "<@user|all> <item|all>",
                    variables: [
                        {
                            name: "@user|all",
                            description: "Menciona al usuario, ID o su nombre exacto. Coloca la palabra all para borrar items a todos.",
                            require: true
                        },
                        {
                            name: "item|all",
                            description: "El nombre del item a borrar. Coloca la palabra all para borrar todos.",
                            require: true
                        }
                    ]
                },
                {
                    name: "createitem",
                    descriptionShort: "Añade un nuevo artículo para la tienda del servidor.",
                    description:
                        "Crea items de diferentes tipos para la economía de tu comunidad. Pueden ser items sencillos, con un nombre y no tener más funcionalidad e items que dan roles o canales al comprarse y usarse. Puedes crear items basura par el comando loot.",
                    alias: ["crearitem"],
                    use: "(Se pedirán los datos paso a paso)"
                },
                {
                    name: "deletechatexclude",
                    descriptionShort: "Elimina un canal excluido de la ganancia de dinero por escribir.",
                    description: "",
                    use: "<#cana|all>",
                    variables: [
                        {
                            name: "#canal|all",
                            description:
                                "Coloca el nombre, id o menciona el canal que deseas quitar de canales excluidos. Coloca la palabra all en su lugar para quitar todos.",
                            require: true
                        }
                    ]
                },
                {
                    name: "deleteitem",
                    descriptionShort: "Elimina un artículo de la tienda del servidor.",
                    description:
                        "Elimina un item de la tienda del servidor permanentemente. Si quieres que no esté disponible para su compra, edita la propiedad available del item.",
                    alias: ["eliminaritem"],
                    use: "<nombre>",
                    variables: [
                        {
                            name: "nombre",
                            description: "El nombre del item a eliminar",
                            require: true
                        }
                    ]
                },
                {
                    name: "deletemoney",
                    descriptionShort: "Elimina dinero de un usuario.",
                    description: "Quita dinero a un usuario del servidor, de su cartera o del banco.",
                    alias: ["eliminardinero", "deletecoins"],
                    use: "<@usuario> <cantidad> [banco|cartera]",
                    variables: [
                        {
                            name: "@usuario",
                            description: "Menciona al usuario, ID o su nombre exacto",
                            require: true
                        },
                        {
                            name: "cantidad",
                            description: "Cantidad de dinero que será eliminado",
                            require: true
                        },
                        {
                            name: "banco|cartera",
                            description: "El lugar donde se eliminará el dinero. Si no colocas este parámetro, su valor es cartera.",
                            require: false
                        }
                    ]
                },
                {
                    name: "edititem",
                    descriptionShort: "Edita un artículo de la tienda del servidor.",
                    description:
                        "Edita una de las propiedades de un item de la tienda del servidor. Propiedas: name, price, description, emoji, hide, transferable, trash, singlepurchase, time, stock, get, require, remove, message, event, available.",
                    alias: ["editaritem"],
                    use: "<nombre> <propiedad> <valor>",
                    variables: [
                        {
                            name: "nombre",
                            description: "El nombre del item",
                            require: true
                        },
                        {
                            name: "propiedad",
                            description: "Uno de las propiedades de un item",
                            require: true
                        },
                        {
                            name: "valor",
                            description: "El nuevo valor a asignar que dependerá su tipo de la propiedad colocada",
                            require: true
                        }
                    ]
                },
                {
                    name: "lock",
                    descriptionShort: "Bloquea la economía de un usuario.",
                    description:
                        "Bloquea un usuario su economía general o su inventario para que no pudea usar los comandos respectivos. Util para moderación o sansiones.",
                    alias: ["bloquear"],
                    use: "<@usuario> [--inv]",
                    variables: [
                        {
                            name: "@usuario",
                            description: "Menciona al usuario, su ID o su nombre exacto",
                            require: true
                        },
                        {
                            name: "--inv",
                            description: "Coloca esta palabra para bloquear el inventario del usuario",
                            require: false
                        }
                    ]
                },
                {
                    name: "restareconomy",
                    descriptionShort: "Elimina la economía de todos. Dinero, Banco e inventario",
                    description: "Este comando es irreversible , eliminará la base de datos de todos los perfiles de los usuarios de tu servidor."
                },
                {
                    name: "setcooldown",
                    descriptionShort: "Establece el tiempo para reutilizar los comandos de economía.",
                    description:
                        "Cambia el tiempo predeterminado de los comandos para reutilizar los comandos nuevamente. Comandos disponibles: messages, daily, dice, flipcoin, crime, rob, roulette, slotmachine, trade, work como su tasa de fracaso de obtenerla. Mientras mayor sea la tasa de fracaso, mas probalbe de que resiva la multa.",
                    use: "<comando> <tiempo>",
                    variables: [
                        {
                            name: "comando",
                            description: "Nombre de un comando disponible para modificar",
                            require: true
                        },
                        {
                            name: "tiempo",
                            description: "Tiempo para utilizar el comando con sintaxis: 1m, 30s, 2d",
                            require: true
                        }
                    ]
                },
                {
                    name: "setcurrency",
                    descriptionShort: "Establece la moneda para la economía del servidor.",
                    description: "Coloca un emoji diferente al por defecto para tu servidor, siendo este visible en varios comandos de economía.",
                    alias: ["setmoneda"],
                    use: "<emoji>",
                    variables: [{ name: "emoji", description: "Un emoji normal de Discord o del propio servidor.", require: true }]
                },
                {
                    name: "setfineamount",
                    descriptionShort: "Establece la multa de los comandos de economía.",
                    description:
                        "Cambia la multa predeterminada que será aplicada aleatoriamente entre los dos números como sansión a un usuario en caso de fallar y su tasa de fracaso de obtenerla. Mientras mayor sea la tasa de fracaso, mas probalbe de que reciba la multa. Comandos disponibles: crime, dice, flipcoin, rob, slotmachine o trade.",
                    alias: ["setmulta"],
                    use: "<comando> <Multa Mínima> <Multa Máxima> <Fracaso>",
                    variables: [
                        {
                            name: "comando",
                            description: "Nombre de un comando disponible para modificar",
                            require: true
                        },
                        {
                            name: "multa mínima",
                            description: "Cantidad mínima que se le dará al usuario",
                            require: true
                        },
                        {
                            name: "multa máxima",
                            description: "Cantidad máxima que se le dará al usuario",
                            require: true
                        },
                        {
                            name: "fracaso",
                            description: "Porcentaje de 5 al 95 de probabilidad de obtener la multa",
                            require: true
                        }
                    ]
                },
                {
                    name: "setmoney",
                    descriptionShort: "Establece el dinero de un usuario.",
                    description:
                        "Este comando asignará la cantidad que coloques al usuario borrando cualquier cantidad que tubiera. Si quieres solamente añadir usa addmoney.",
                    alias: ["setcash"],
                    use: "<@usuario> <dinero> [banco]",
                    variables: [
                        {
                            name: "@usuario",
                            description: "Menciona al usuario, su ID o su nombre exacto",
                            require: true
                        },
                        { name: "dinero", description: "Cantidad a establecer", require: true },
                        {
                            name: "banco",
                            description: "Coloca esta palabra si será el apartado del banco el que asignaras. Si no colocas esta opción será su cartera.",
                            require: false
                        }
                    ]
                },
                {
                    name: "setpayout",
                    descriptionShort: "Establece la ganancia de los comandos o por escribir.",
                    description:
                        "Establece la cantidad que ganarán los usuarios que será aleatoria entre dos cantidades. Comandos disponibles: messages, crime, daily, dice, flipcoin, slotmachine, trade, work En el caso de daiy solamente se tomará el primer parámetro para el dinero diario pero se requieren de ambos parámetros para ejecutar el comando.",
                    alias: ["setpago"],
                    use: "<comando> <Paga Mínima> <Paga Máxima>",
                    variables: [
                        {
                            name: "comando",
                            description: "Nombre de un comando disponible para modificar",
                            require: true
                        },
                        {
                            name: "paga mínima",
                            description: "Cantidad mínima que se le dará al usuario",
                            require: true
                        },
                        {
                            name: "paga máxima",
                            description: "Cantidad máxima que se le dará al usuario",
                            require: true
                        }
                    ]
                },
                {
                    name: "unlock",
                    descriptionShort: "Desbloquea la economía de un usuario.",
                    description: "Desbloquea un usuario su economía general o su inventario para poder usar los comandos nuevamente.",
                    alias: ["desbloquear"],
                    use: "<@usuario> [--inv]",
                    variables: [
                        {
                            name: "@usuario",
                            description: "Menciona al usuario, su ID o su nombre exacto",
                            require: true
                        },
                        {
                            name: "--inv",
                            description: "Coloca esta palabra para bloquear el inventario del usuario",
                            require: false
                        }
                    ]
                }
            ]
        },
        //========
        {
            id: "config-bot",
            name: "Configuración Bot",
            commands: [
                {
                    name: "addblacklist",
                    descriptionShort: "Deshabilita comandos o categorías del bot.",
                    description: "",
                    alias: ["addlistanegra", "adddisable"],
                    use: "<Nombre de la categoría o comando> [miembro/rol/canal]",
                    variables: []
                },
                {
                    name: "addwhitelist",
                    descriptionShort: "Habilita comandos o categorías del bot sobre los que estén en la lista negra.",
                    description: "",
                    alias: ["addlistablanca", "addenable"],
                    use: "<Nombre de la categoría o comando> <miembro/rol/canal>",
                    variables: []
                },
                {
                    name: "config",
                    descriptionShort: "Ver la configuración del servidor.",
                    description: "",
                    alias: ["configuracion"],
                    use: "[Nada]",
                    variables: []
                },
                {
                    name: "deleteblacklist",
                    descriptionShort: "Elimine comandos o categorías de la lista negra del servidor.",
                    description: "",
                    alias: ["deletebl"],
                    use: "<Nombre de la categoría o comando> [miembro/rol/canal]",
                    variables: []
                },
                {
                    name: "deletelanguage",
                    descriptionShort: "Elimina el idioma del servidor o de un canal.",
                    description: "",
                    alias: ["eliminaridioma", "deletelang"],
                    use: "[channel] [#channel]",
                    variables: []
                },
                {
                    name: "deleteprefix",
                    descriptionShort: "Elimina el prefijo del bot en este servidor",
                    description: "",
                    alias: ["eliminarprefijo"],
                    use: "[Nada]",
                    variables: []
                },
                {
                    name: "deletewhitelist",
                    descriptionShort: "Elimine comandos o categorías de la lista blanca del servidor.",
                    description: "",
                    alias: ["deletewl"],
                    use: "<Nombre de la categoría o comando> [miembro/rol/canal]",
                    variables: []
                },
                {
                    name: "setlanguage",
                    descriptionShort:
                        "Establece el idioma del bot dentro del servidor o dentro de un canal del mismo. Idiomas disponibles: es-MX - Español México en-ES- Español España en-US - Inglés Estados Unidos pt-BR - Portugués Brasil (10%) Para contribuir en las traducciones puedes ingresar al servidor de Soporte para el idioma que desées.",
                    description: "",
                    alias: ["setlang", "setidioma"],
                    use: "[#canal] <idioma>",
                    variables: []
                },
                {
                    name: "setprefix",
                    descriptionShort: "Establece un prefijo personalizado para el servidor.",
                    description: "",
                    alias: ["setprefijo"],
                    use: "<prefijo>",
                    variables: []
                }
            ]
        },
        {
            id: "economy",
            name: "Economía",
            commands: [
                {
                    name: "bal",
                    descriptionShort: "Consulta su dinero global o del servidor. Si tienen.",
                    description: "",
                    alias: ["monedas", "dinero", "money", "balance"],
                    use: "[@miembro]",
                    variables: []
                },
                {
                    name: "crime",
                    descriptionShort: "Comete un crimen en el servidor. Pero si te atrapa la ley, pagarás las consecuencias.",
                    description: "",
                    alias: ["crimen"],
                    use: "[Nada]",
                    variables: []
                },
                {
                    name: "daily",
                    descriptionShort: "Obten recompensas cada 12 horas.",
                    description: "",
                    alias: ["diario", "dly"],
                    use: "[@mención]",
                    variables: []
                },
                {
                    name: "deposite",
                    descriptionShort: "Guarda y protege tu dinero en tu banco. Así no te lo podrán robar.",
                    description: "",
                    alias: ["dep", "depositar"],
                    use: "<cantidad/all>",
                    variables: []
                },
                {
                    name: "dice",
                    descriptionShort: "Tira un dado y obten el número. Opcionalmente puedes poner del 1 al 6 y ganar algo si adivinas o perder si no lo haces.",
                    description: "",
                    alias: ["dado"],
                    use: "[1/2/.../6] [dinero]",
                    variables: []
                },
                {
                    name: "flipcoin",
                    descriptionShort:
                        "Tira la moneda al aire. Opcionalmente puedes poner 1 (Cara) o 2 (Sello) para ganar algo si adivinas o perder si no lo haces.",
                    description: "",
                    alias: ["caracruz", "carasello"],
                    use: "[1/2] [dinero]",
                    variables: []
                },
                {
                    name: "rob",
                    descriptionShort: "Roba dinero del bolsillo de un miembro del servidor.",
                    description: "",
                    alias: ["robar"],
                    use: "<@miembro>",
                    variables: []
                },
                {
                    name: "top",
                    descriptionShort: "Muestra quien está hasta arriba de todos",
                    description: "",
                    alias: ["ranks"],
                    use: "[cash/bank] [página]",
                    variables: []
                },
                {
                    name: "trade",
                    descriptionShort: "Obten Dinero por... hacer comercios ilegales.",
                    description: "",
                    alias: ["comerciar"],
                    use: "[Nada]",
                    variables: []
                },
                {
                    name: "trans",
                    descriptionShort: "Dale a alguien dinero de tu bolcillo.",
                    description: "",
                    alias: ["transferir", "tns"],
                    use: "<@usuario> <cantidad>.",
                    variables: []
                },
                {
                    name: "withdraw",
                    descriptionShort: "Saca dinero de tu banco a tu bolsillo para que lo puedas ocupar.",
                    description: "",
                    alias: ["with", "retire", "retirar"],
                    use: "<cantidad/all>",
                    variables: []
                },
                {
                    name: "work",
                    descriptionShort: "Obten Dinero por trabajar.",
                    description: "",
                    alias: ["trabajar", "wk"],
                    use: "[@usuario] Para darle el dinero a otro.",
                    variables: []
                }
            ]
        },
        {
            id: "items",
            name: "Artículos",
            commands: [
                {
                    name: "buy",
                    descriptionShort: "Compra articulos de la tienda.",
                    description: "",
                    alias: ["comprar"],
                    use: "<nombre> [cantidad]",
                    variables: []
                },
                {
                    name: "inventory",
                    descriptionShort: "Ve los artículos que has comprado.",
                    description: "",
                    alias: ["inv", "inventario"],
                    use: "[--all] Sólo administradores",
                    variables: []
                },
                {
                    name: "iteminfo",
                    descriptionShort: "Ve la información de un artículos.",
                    description: "",
                    alias: ["item-info", "infoitem"],
                    use: "<nombre/id>",
                    variables: []
                },
                {
                    name: "loot",
                    descriptionShort: "Saquea items aleatorios entre los mensajes del servidor.",
                    description: "",
                    alias: ["pillage", "looting", "saqueo"],
                    use: "[Nada]",
                    variables: []
                },
                {
                    name: "sell",
                    descriptionShort: "Vende articulos de tu inventario.",
                    description: "",
                    alias: ["vender"],
                    use: "<nombre> [cantidad]",
                    variables: []
                },
                {
                    name: "shop",
                    descriptionShort: "Ve la tienda de articulos.",
                    description: "",
                    alias: ["tienda", "store"],
                    use: "[--all] Sólo administradores",
                    variables: []
                },
                {
                    name: "transitem",
                    descriptionShort: "Dale a alguien un artículo de tu inventario.",
                    description: "",
                    alias: ["trans-item", "itemtrans"],
                    use: "<@usuario> <nombre/id> [cantidad]",
                    variables: []
                },
                {
                    name: "use",
                    descriptionShort: "Usa un item comprado en la tienda.",
                    description: "",
                    alias: ["usar"],
                    use: "<nombre>",
                    variables: []
                }
            ]
        }
    ];

    function copyClipboard(e: any) {
        var $temp = $("<input>");
        $("body").append($temp);
        $temp.val(e.target.innerText).select();
        document.execCommand("copy");
        $temp.remove();
    }

    return (
        <Container>
            <Row>
                <Col md={12}>
                    <Card style={{ backgroundColor: "#1F2326" }}>
                        <Card.Body>
                            <Card.Title as="h3">Prefijo del bot</Card.Title>
                            <Card.Text>
                                <p>
                                    El prefijo por defecto es{" "}
                                    <code className="codeCopy" onClick={copyClipboard}>
                                        e!
                                    </code>
                                </p>
                                <p>
                                    Puedes usar{" "}
                                    <code className="codeCopy" onClick={copyClipboard}>
                                        @StarLight Economy#1889 help
                                    </code>{" "}
                                    o{" "}
                                    <code className="codeCopy" onClick={copyClipboard}>
                                        @StarLight Economy#1889 prefix
                                    </code>{" "}
                                    para saber el prefijo en ese servidor.
                                </p>
                                <h3>Sintaxis de uso</h3>
                                <p>
                                    <code>&lt;&gt;</code> - Parámetro obligatorio
                                </p>
                                <p>
                                    <code>[]</code> - Parámetro opcional
                                </p>
                                <p>
                                    <code>&lt;opcion1|opcion2&gt;</code> - Eliga una de las opciones.
                                </p>
                                Recuerda de no poner ninguno de estos simbolos a la hora de ejecutar el comando.
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={12} className="pt-4">
                    <Card style={{ backgroundColor: "#1F2326" }}>
                        <Card.Header className="text-center" as="h4" style={{ backgroundColor: "#34383C" }}>
                            Tabla de Comandos
                        </Card.Header>
                        <Card.Body>
                            <Tab.Container defaultActiveKey="core">
                                <Row>
                                    <Col md={3}>
                                        <Nav variant="pills" className="flex-column">
                                            {CommandsArray.map((dts) => (
                                                <Nav.Item key={dts.name}>
                                                    <Nav.Link eventKey={dts.id}>{dts.name}</Nav.Link>
                                                </Nav.Item>
                                            ))}
                                        </Nav>
                                    </Col>

                                    <Col md={9}>
                                        <Tab.Content>
                                            {CommandsArray.map((dts) => (
                                                <Tab.Pane eventKey={dts.id}>
                                                    <Row>
                                                        <Accordion>
                                                            {dts.commands.map((command) => (
                                                                <Col md={12} className="p-1">
                                                                    <Card style={{ backgroundColor: "#34383C" }}>
                                                                        <Accordion.Toggle
                                                                            eventKey={command.name}
                                                                            as={Card.Header}
                                                                            style={{ backgroundColor: "#34383C", cursor: "pointer" }}
                                                                        >
                                                                            <code className="codeCopy" onClick={copyClipboard}>
                                                                                {command.name}
                                                                            </code>{" "}
                                                                            - {command.descriptionShort}
                                                                        </Accordion.Toggle>
                                                                        <Accordion.Collapse eventKey={command.name}>
                                                                            <Card.Body>
                                                                                <p>
                                                                                    Uso:{" "}
                                                                                    {command.use ? (
                                                                                        <code className="codeCopy" onClick={copyClipboard}>
                                                                                            {command.name} {command.use}
                                                                                        </code>
                                                                                    ) : (
                                                                                        <span className="text-muted">No requiere parámetros</span>
                                                                                    )}
                                                                                </p>
                                                                                <p>{command.description}</p>
                                                                                {command.variables && command.variables.length > 0 ? <h5>Variables</h5> : null}
                                                                                {command.variables
                                                                                    ? command.variables.map((vars) => (
                                                                                          <>
                                                                                              {vars.require ? (
                                                                                                  <span className="text-muted">
                                                                                                      Esta variable es obligatoria
                                                                                                  </span>
                                                                                              ) : null}
                                                                                              <p>
                                                                                                  <code>{vars.name}</code> {vars.description}
                                                                                              </p>
                                                                                          </>
                                                                                      ))
                                                                                    : null}
                                                                                {command.alias ? (
                                                                                    <p>
                                                                                        <h5>Alias</h5>
                                                                                        {command.alias.map((c) => (
                                                                                            <>
                                                                                                <code className="codeCopy" onClick={copyClipboard}>
                                                                                                    {c}
                                                                                                </code>{" "}
                                                                                            </>
                                                                                        ))}
                                                                                    </p>
                                                                                ) : null}
                                                                            </Card.Body>
                                                                        </Accordion.Collapse>
                                                                    </Card>
                                                                </Col>
                                                            ))}
                                                        </Accordion>
                                                    </Row>
                                                </Tab.Pane>
                                            ))}
                                        </Tab.Content>
                                    </Col>
                                </Row>
                            </Tab.Container>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

interface ICommands {
    id: string;
    name: string;
    commands: Command[];
}

interface Command {
    name: string;
    descriptionShort: string;
    description: string;
    alias?: string[];
    use?: string;
    variables?: Variable[];
}

interface Variable {
    name: string;
    description: string;
    require: boolean;
}
