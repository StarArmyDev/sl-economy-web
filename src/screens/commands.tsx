import { Category, OptionType, SubCommandData, SubGroupData, NumericOptionData, CommandOptionData, ChoicesData } from "types/Command";
import { Accordion, Card, Col, Container, Nav, Row, Tab } from "react-bootstrap";
import { ConvertString, FirstCapitalLetter } from "libs";
import Snackbar from "@mui/material/Snackbar";
import { Alert } from "components";
import Helmet from "react-helmet";
import { useState } from "react";

export function Commands() {
    const CommandsArray: Category[] = [
        {
            id: "core",
            name: "Comandos Núcleo",
            commands: [
                {
                    name: "botinfo",
                    descriptionShort: "Obtén las estadísticas, novedades e información del creador del bot",
                    description: "",
                    options: [
                        {
                            type: OptionType.Subcommand,
                            name: "stats",
                            description: "Información estadística del bot, como el tiempo encendido, servidores en los que está, versión. etc"
                        },
                        {
                            type: OptionType.Subcommand,
                            name: "release",
                            description: "Las últimas notas de las novedades del bot"
                        },
                        {
                            type: OptionType.Subcommand,
                            name: "creator",
                            description: "Conocel al creador de este bot."
                        }
                    ]
                },
                {
                    name: "botsuggestion",
                    descriptionShort: "Da una sugerencia para el bot y se envía al canal del servidor oficial.",
                    description:
                        "Si tienes una idea puedes usar este comando, será enviado al canal sugerencias del servidor de soporte para ser votada por la comunidad y calificada por el desarrollador o un Bot Manager. También puedes mandar una imagen junto al comando.",
                    options: [
                        {
                            type: OptionType.String,
                            name: "suggestion",
                            description: "Sugerencia o idea a dar de manera detallada",
                            required: true
                        },
                        {
                            type: OptionType.String,
                            name: "url",
                            description: "Enlace de una imagen de evidencia"
                        }
                    ]
                },
                {
                    name: "bugreport",
                    descriptionShort:
                        "Reporta cualquier problema o falla al servidor de soporte oficial para arreglar el problema. También puedes mandar una imagen junto al comando.",
                    description:
                        'Cuando encuentres una falla, ya sean sencillas como de gramática, ortografía, apartados que aparezcan como "undefined" o fallas más seberas como que no se ejecuta un comando correctamente, no sale el resultado esperado, no responde nada, etc, usa este comando detallando lo mejor posible y si es necesario mandando una imagen, camptura de pantalla para mayor explicación.',
                    options: [
                        {
                            type: OptionType.String,
                            name: "report",
                            description: "Problema o bug explicado de la manera más detallada posible",
                            required: true
                        },
                        {
                            type: OptionType.String,
                            name: "url",
                            description: "Enlace de una imagen de evidencia"
                        }
                    ]
                },
                {
                    name: "config",
                    descriptionShort: "Maneja la configuración del bot",
                    description: "Como alternativa al dashboard, puedes usar este comando para configurar el bot dentro del mismo Discord.",
                    options: [
                        {
                            type: OptionType.Subcommand,
                            name: "import",
                            description: "Importar la configuración a aplicar",
                            options: [
                                {
                                    type: OptionType.Attachment,
                                    name: "file",
                                    description: "Archivo yml para aplicar la configuración",
                                    required: true
                                }
                            ]
                        },
                        {
                            type: OptionType.Subcommand,
                            name: "export",
                            description: "Exportar la configuración actual",
                            options: [
                                {
                                    type: OptionType.String,
                                    name: "template",
                                    description: "Exportar la plantilla de configuración con comentarios de guía",
                                    choices: [
                                        { name: "Básica", value: "basic" },
                                        { name: "Completa", value: "full" }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    name: "help",
                    descriptionShort: "Toda la información de los comandos.",
                    description: "Un menú de ayuda para obtener información sobre los comandos disponibles por categoría, además de enlaces útiles.",
                    options: [
                        {
                            type: OptionType.String,
                            name: "command",
                            description: "Ve la ayuda detallada de un commando."
                        },
                        {
                            type: OptionType.Boolean,
                            name: "direct_menssage",
                            description: "Manda el comando como mensaje directo."
                        }
                    ]
                },
                {
                    name: "invite",
                    descriptionShort: "Invitación para que puedas meter al bot a tu servidor. Además te proporciona links útiles.",
                    description:
                        'Te dará el enlace para invitar el bot a tu servidor que administras, deberás contar con el permiso "Guild Manager" o mayor. También proporciona la invitación del servidor oficial.'
                },
                {
                    name: "item",
                    descriptionShort: "Gestiona los items del servidor para crear una tienda.",
                    description: "Se acabó el tiempo largo para crear una tienda, puedes usar este comando para crear items muy similar al comando Config.",
                    options: [
                        {
                            type: OptionType.Subcommand,
                            name: "import",
                            description: "Crea o edite un artículo a partir de un archivo de item",
                            options: [
                                {
                                    type: OptionType.Attachment,
                                    name: "file",
                                    description: "Archivo yml",
                                    required: true
                                }
                            ]
                        },
                        {
                            type: OptionType.Subcommand,
                            name: "export",
                            description: "Exporta una plantilla de item o un item para editarlo",
                            options: [
                                {
                                    type: OptionType.String,
                                    name: "template",
                                    description: "Exportar la plantilla con comentarios de guía",
                                    choices: [
                                        { name: "Básica", value: "basic" },
                                        { name: "Completa", value: "full" }
                                    ]
                                },
                                {
                                    type: OptionType.String,
                                    name: "name_id",
                                    description: "Nombre exacto o ID del artículo"
                                }
                            ]
                        },
                        {
                            type: OptionType.Subcommand,
                            name: "remove",
                            description: "Elimina un artículo. Se recomienda editar 'hide' a true para ocultarlo de la tienda.",
                            options: [
                                {
                                    type: OptionType.String,
                                    name: "name_id",
                                    description: "Nombre exacto o ID del artículo",
                                    required: true
                                }
                            ]
                        }
                    ]
                },
                {
                    name: "ping",
                    descriptionShort: "Obtén el tiempo de respuesta del bot",
                    description:
                        "Te dice el tiempo en milisegundos que tarda el bot en comunicarse con la API de Discord y el tiempo que tarda el bot en responder a un usuario."
                },
                {
                    name: "vote",
                    descriptionShort: "Ve las opciones que tienes para votar en las listas de bots.",
                    description: "Muestra las listas de bots disponibles para votar o donde se encuentra el bot junto con una pequeña descripcción."
                }
            ]
        },
        {
            id: "economy",
            name: "Economía",
            commands: [
                {
                    name: "adminuser",
                    descriptionShort: "Administra distintas opciones de la economía de un usuario.",
                    description:
                        "Si quieres añadir dinero, quitar, resetear, bloquear o desbloquear las ganancias de dinero, quitar items o reiniciar al economía de todos, este el el comando para todo ello.",
                    options: [
                        {
                            type: OptionType.SubcommandGroup,
                            name: "money",
                            description: "Administra dinero de un usuario.",
                            options: [
                                {
                                    type: OptionType.Subcommand,
                                    name: "add",
                                    description: "Añade dinero a un usuario.",
                                    options: [
                                        {
                                            type: OptionType.Number,
                                            name: "amount",
                                            description: "Cantidad de dinero a añadir.",
                                            required: true
                                        },
                                        {
                                            type: OptionType.String,
                                            name: "mode",
                                            description: "Si el dinero se añadirá al banco o al bolsillo.",
                                            choices: [
                                                {
                                                    name: "bank",
                                                    value: "bank"
                                                },
                                                {
                                                    name: "pocket",
                                                    value: "money"
                                                }
                                            ]
                                        },
                                        {
                                            type: OptionType.User,
                                            name: "user",
                                            description: "Usuario al que se le añadirá dinero."
                                        },
                                        {
                                            type: OptionType.Boolean,
                                            name: "all",
                                            description: "Añade dinero a todos los usuarios."
                                        }
                                    ]
                                },
                                {
                                    type: OptionType.Subcommand,
                                    name: "remove",
                                    description: "Quita dinero a usuarios.",
                                    options: [
                                        {
                                            type: OptionType.Number,
                                            name: "amount",
                                            description: "Cantidad de dinero a quitar.",
                                            required: true
                                        },
                                        {
                                            type: OptionType.String,
                                            name: "mode",
                                            description: "Si el dinero se quitará al banco o al bolsillo.",
                                            choices: [
                                                {
                                                    name: "bank",
                                                    value: "bank"
                                                },
                                                {
                                                    name: "pocket",
                                                    value: "money"
                                                }
                                            ]
                                        },
                                        {
                                            type: OptionType.User,
                                            name: "user",
                                            description: "Usuario al que se le quitará dinero."
                                        },
                                        {
                                            type: OptionType.Boolean,
                                            name: "all",
                                            description: "Quita dinero a todos los usuarios."
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            type: OptionType.Subcommand,
                            name: "lock",
                            description: "Bloquea la economía de un usuario.",
                            options: [
                                {
                                    type: OptionType.Boolean,
                                    name: "inv",
                                    description: "Bloquea su inventario."
                                },
                                {
                                    type: OptionType.User,
                                    name: "user",
                                    description: "Usuario al que se le bloqueará la economía."
                                }
                            ]
                        },
                        {
                            type: OptionType.Subcommand,
                            name: "unlock",
                            description: "Desbloquea la economía de un usuario.",
                            options: [
                                {
                                    type: OptionType.Boolean,
                                    name: "inv",
                                    description: "Desbloquea su inventario."
                                },
                                {
                                    type: OptionType.User,
                                    name: "user",
                                    description: "Usuario al que se le bloqueará la economía."
                                }
                            ]
                        },
                        {
                            type: OptionType.Subcommand,
                            name: "clearitems",
                            description: "Elimina todos los items, o uno en especifico, del inventario de usuarios",
                            options: [
                                {
                                    type: OptionType.User,
                                    name: "user",
                                    description: "Usuario al que se le eliminarán los items."
                                },
                                {
                                    type: OptionType.String,
                                    name: "item",
                                    description: "Item a eliminar."
                                }
                            ]
                        },
                        {
                            type: OptionType.Subcommand,
                            name: "restarteconomy",
                            description: "Elimina la economía de todos. Dinero, Banco e inventario",
                            options: [
                                {
                                    type: OptionType.Boolean,
                                    name: "all",
                                    description: "Reinicia la economía de todos los usuarios."
                                }
                            ]
                        }
                    ]
                },
                {
                    name: "balance",
                    descriptionShort: "Consulta su dinero del servidor.",
                    description:
                        "Ve el dinero que tiene en el banco y en el bolsillo de ti mismo o de otro usuario. Si aparece dinero negativo, significa que quedaste debiendo en algún comando con castigo.",
                    options: [
                        {
                            type: OptionType.User,
                            name: "user",
                            description: "Usuario al que ver su dinero"
                        }
                    ]
                },
                {
                    name: "crime",
                    descriptionShort: "Comete un crimen en el servidor. Pero si te atrapa la ley, pagarás las consecuencias.",
                    description:
                        "Da un golpe al servidor, roba un banco o lo que tu imaginación dicte al usar este comando, pero como en la realidad, te pueden atrabar a la primera y tendrás consecuencias."
                },
                {
                    name: "daily",
                    descriptionShort: "Obten recompensas cada cierto tiempo al día.",
                    description:
                        "Obtén tu paga diaria cada 12 horas por defecto, pero un adminsitrador puede cambiar esto y la cantidad de dinero que recibes.",
                    options: [
                        {
                            type: OptionType.User,
                            name: "user",
                            description: "Usuario al que ver su dinero"
                        }
                    ]
                },
                {
                    name: "deposite",
                    descriptionShort: "Guarda y protege tu dinero en tu banco. Así no te lo podrán robar.",
                    description: "Puedes guardar tu dinero en el banco para que no te lo puedan robar con el comando Rob.",
                    options: [
                        {
                            type: OptionType.Number,
                            name: "amount",
                            description: "Cantidad a depositar.No poner nada, mete todo el dinero al banco",
                            min_value: 1
                        }
                    ]
                },
                {
                    name: "dice",
                    descriptionShort: "Tira un dado y obtén el número. Puedes poner del 1 al 6 y ganar o perder dinero si adivinas o si no.",
                    description:
                        "Realiza una tirada de dado. Puedes poner del 1 al 6 y ganar el doble de dinero si adivinas o perder el dinero si no lo haces.",
                    options: [
                        {
                            type: OptionType.Number,
                            name: "face",
                            description: "Si colocas un número de cara del dado, se apostará",
                            choices: [
                                { name: "Face 1", value: 1 },
                                { name: "Face 2", value: 2 },
                                { name: "Face 3", value: 3 },
                                { name: "Face 4", value: 4 },
                                { name: "Face 5", value: 5 },
                                { name: "Face 6", value: 6 }
                            ]
                        },
                        {
                            type: OptionType.Number,
                            name: "amount",
                            description: "Si colocas una cantidad, se apostará",
                            min_value: 1
                        }
                    ]
                },
                {
                    name: "flipcoin",
                    descriptionShort: "Tira la moneda al aire. Opcionalmente puedes poner 1 (Cara) o 2 (Sello) para adivinar.",
                    description:
                        "Realiza una tirada de moneda. Puedes poner 1 (Cara) o 2 (Sello) para ganar el 1.5 del dinero si adivinas o perderlo si no lo haces.",
                    options: [
                        {
                            type: OptionType.Number,
                            name: "face",
                            description: "Si colocas un número de cara del dado, se apostará",
                            choices: [
                                { name: "Face Cara", value: 1 },
                                { name: "Face Sello", value: 2 }
                            ]
                        },
                        {
                            type: OptionType.Number,
                            name: "amount",
                            description: "Si colocas una cantidad, se apostará",
                            min_value: 1
                        }
                    ]
                },
                {
                    name: "rob",
                    descriptionShort: "Roba dinero del bolsillo de un miembro del servidor.",
                    description:
                        "Roba a otros usuarios que tengan dinero en su bolsillo, no podrás robar a quien no tiene y la posibilidad de fallar depende de los administradores del servidor.",
                    options: [
                        {
                            type: OptionType.User,
                            name: "user",
                            description: "Usuario al que robar dinero",
                            required: true
                        }
                    ]
                },
                {
                    name: "slotmachine",
                    descriptionShort: "Gira la tragamonedas y sé de esos pocos afortunados.",
                    description:
                        "Has una tirada de suerte para ganar dinero o perder dinero. Tiene 6 diferentes fichas, o frutas por defecto, y dos cantidades de dinero por ganar si caen dos fichas alineadas o las tres fichas alineadas."
                },
                {
                    name: "top",
                    descriptionShort: "Muestra la lista de pocisiones del servidor",
                    description:
                        "Averigua el ranking de los usuarios del servidor o puedes visitar la página de ranking aquí en la web, inicia sesión para ver tu posición.",
                    options: [
                        {
                            type: OptionType.String,
                            name: "mode",
                            description: "Modo de ordenamiento",
                            choices: [
                                {
                                    name: "pocket",
                                    value: "cash"
                                },
                                {
                                    name: "bank",
                                    value: "bank"
                                }
                            ]
                        },
                        {
                            type: OptionType.Number,
                            name: "page",
                            description: "Página a mostrar",
                            min_value: 1
                        },
                        {
                            type: OptionType.User,
                            name: "user",
                            description: "Usuario a buscar"
                        }
                    ]
                },
                {
                    name: "trade",
                    descriptionShort: "Obten Dinero por... hacer comercios ilegales.",
                    description:
                        "Similar a crime, obtén ganancias por hacer trabajos ilegales pero con sus riesgos de que te atrapen al hacerlos y te quiten dinero."
                },
                {
                    name: "transfer",
                    descriptionShort: "Dale a alguien dinero de tu bolcillo.",
                    description: "Comparte dinero con otro usuario que no tenga o lo necesite. Los motivos pueden variar.",
                    options: [
                        {
                            type: OptionType.User,
                            name: "user",
                            description: "Usuario a darle dinero",
                            required: true
                        },
                        {
                            type: OptionType.Number,
                            name: "amount",
                            description: "Cantidad de dinero a darle. Si no se especifica, se dará lo que tengas en tu bolcillo.",
                            min_value: 1
                        }
                    ]
                },
                {
                    name: "withdraw",
                    descriptionShort: "Saca dinero de tu banco a tu bolsillo para que lo puedas ocupar.",
                    description: "Por seguridad, no puedes hacer movimientos de compra/venta sin antes sacarlo del banco.",
                    options: [
                        {
                            type: OptionType.Number,
                            name: "amount",
                            description: "Cantidad de dinero que quieres sacar. No poner nada, sacar todo el dinero del banco",
                            min_value: 1
                        }
                    ]
                },
                {
                    name: "work",
                    descriptionShort: "Obten Dinero por trabajar.",
                    description:
                        "Realiza un trabajo pequeño o grande y recibe una cantidad de dinero por tu esfuerzo. Si quieres ser generoso, puedes mensionar a alguien para darle el dinero que ganes directamente.",
                    options: [
                        {
                            type: OptionType.User,
                            name: "user",
                            description: "Usuario a darle el dinero"
                        }
                    ]
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
                    description: "Viste algo en la tienda y decides comprarlo, puedes comprarlo por una cantidad especifica o solo uno si no lo especificas.",
                    options: [
                        {
                            type: OptionType.String,
                            name: "item_name",
                            description: "El nombre exacto del item en la tienda de este servidor.",
                            required: true
                        },
                        {
                            type: OptionType.Number,
                            name: "quantity",
                            description: "Cantidad de items a comprar.",
                            min_value: 1
                        }
                    ]
                },
                {
                    name: "inventory",
                    descriptionShort: "Ve los artículos que has comprado.",
                    description: "Hecha un vistaso rápido a tus cosas, ya sean ganadas, recibidas en una transferencia de items o compradas.",
                    options: [
                        {
                            type: OptionType.User,
                            name: "member",
                            description: "Un usuario del servidor."
                        },
                        {
                            type: OptionType.Boolean,
                            name: "all",
                            description: "Sólo administradores."
                        }
                    ]
                },
                {
                    name: "iteminfo",
                    descriptionShort: "Ve la información de un artículos.",
                    description:
                        "Si no te parece suficiente sólo saber el nombre de un item visto en la tienda, échale un vistazo a la información con más detalle.",
                    options: [
                        {
                            type: OptionType.String,
                            name: "item_name",
                            description: "El nombre exacto del item en la tienda de este servidor.",
                            required: true
                        }
                    ]
                },
                {
                    name: "loot",
                    descriptionShort: "Saquea items aleatorios entre los mensajes del servidor.",
                    description:
                        'Si los administradores han agregados items "basura" a la tienda, puedes sacarlos con este comando aleatoriamente, con valores de venta especificados.'
                },
                {
                    name: "sell",
                    descriptionShort: "Vende articulos de tu inventario.",
                    description:
                        "Si algo no te gustó o simplemente quieres vender items, puedes hacerlo con este comando pero cuidado, que puede tener un valor diferente al que lo compraste.",
                    options: [
                        {
                            type: OptionType.String,
                            name: "item_name",
                            description: "El nombre exacto del item en la tienda de este servidor.",
                            required: true
                        },
                        {
                            type: OptionType.Number,
                            name: "quantity",
                            description: "Cantidad de items a vender."
                        }
                    ]
                },
                {
                    name: "shop",
                    descriptionShort: "Ve la tienda de articulos.",
                    description:
                        "Revisa la tienda de articulos y ve lo que puedes comprar o vender. Puede habe cosas muy geniales y algunas te pueden dar beneficios como roles, otros items, un canal privado de texto o voz o los tres al mismo tiempo.",
                    options: [
                        {
                            type: OptionType.Boolean,
                            name: "all",
                            description: "Si eres administrador del servidor, Puedes ver todos los items registrados aunque estén ocultos."
                        }
                    ]
                },
                {
                    name: "transitem",
                    descriptionShort: "Dale a alguien un artículo de tu inventario.",
                    description: "Mientras el item lo permita, puedes pasarle un item a otro usuario.",
                    options: [
                        {
                            type: OptionType.User,
                            name: "member",
                            description: "Un usuario del servidor.",
                            required: true
                        },
                        {
                            type: OptionType.String,
                            name: "item_name",
                            description: "El nombre exacto del item en la tienda de este servidor.",
                            required: true
                        },
                        {
                            type: OptionType.Number,
                            name: "quantity",
                            description: "Cantidad de items a vender."
                        },
                        {
                            type: OptionType.Boolean,
                            name: "all",
                            description: "Si quiere trasferir todos los items que tengas en tu inventario."
                        }
                    ]
                },
                {
                    name: "use",
                    descriptionShort: "Usa un item comprado en la tienda.",
                    description:
                        "Al comprar un item, no se usa directamente, ya que puedes querer guardarlo para usarlo en un futuro o pasarselo a otro usuario, mientras el item lo permita.",
                    options: [
                        {
                            type: OptionType.String,
                            name: "item_name",
                            description: "El nombre exacto del item en la tienda de este servidor.",
                            required: true
                        }
                    ]
                }
            ]
        }
    ];
    const [open, setOpen] = useState(false);

    function copyClipboard(e: any, pretext?: string) {
        let text = "/";
        if (pretext) text += `${pretext}${e.target.innerText}`;
        else text += e.target.innerText;

        navigator.clipboard
            .writeText(text)
            .then(() => setOpen(true))
            .catch(() => null);
    }

    const handleClose = (_: any, reason?: string) => {
        if (reason === "clickaway") {
            return;
        }

        setOpen(false);
    };

    return (
        <Container>
            <Helmet>
                <title>SL-Economy | Comandos</title>
            </Helmet>
            <Snackbar autoHideDuration={1000} anchorOrigin={{ vertical: "bottom", horizontal: "center" }} open={open} onClose={handleClose}>
                <Alert onClose={handleClose} severity="success" sx={{ width: "100%" }}>
                    Copiado al portapapeles
                </Alert>
            </Snackbar>
            <Row>
                <Col md={12}>
                    <Card>
                        <Card.Body>
                            <Card.Title as="h3">Prefijo del bot</Card.Title>
                            <Card.Text>
                                <p>
                                    Ya no hay prefijo en el bot, ahora se usa con{" "}
                                    <code className="codeCopy" onClick={copyClipboard}>
                                        /
                                    </code>{" "}
                                    en el comienzo de cada comando, al igual que otros bots.
                                </p>
                                <p>
                                    Para evitar fraudes, revisa que el bot esté verificado por Discord y su nombre de usuario sea:{" "}
                                    <code className="codeCopy" onClick={copyClipboard}>
                                        @StarLight Economy#1889
                                    </code>{" "}
                                    ya que es el único oficial.
                                </p>
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={12} className="pt-4">
                    <Card>
                        <Card.Header className="text-center" as="h4">
                            Tabla de Comandos
                        </Card.Header>
                        <Card.Body>
                            <Tab.Container defaultActiveKey="core">
                                <Row>
                                    <Col md={3}>
                                        <Nav variant="pills" className="flex-column">
                                            {CommandsArray.map((dts) => (
                                                <Nav.Item key={dts.name} style={{ cursor: "pointer" }}>
                                                    <Nav.Link eventKey={dts.id}>{dts.name}</Nav.Link>
                                                </Nav.Item>
                                            ))}
                                        </Nav>
                                    </Col>

                                    <Col md={9}>
                                        <Tab.Content>
                                            {CommandsArray.map((dts) => (
                                                <Tab.Pane key={dts.id} eventKey={dts.id}>
                                                    <Row>
                                                        {dts.commands.map((command) => (
                                                            <>
                                                                <Accordion>
                                                                    <Accordion.Item eventKey={command.name}>
                                                                        <Accordion.Header>
                                                                            <code
                                                                                className="codeCopy"
                                                                                onClick={copyClipboard}
                                                                                style={{ margin: "0px 15px 0px 0px" }}
                                                                            >
                                                                                {FirstCapitalLetter(command.name)}
                                                                            </code>
                                                                            {command.descriptionShort}
                                                                        </Accordion.Header>
                                                                        <Accordion.Body>
                                                                            <p>{command.description}</p>
                                                                            {command.options &&
                                                                            command.options.filter(
                                                                                (option) =>
                                                                                    option.type === OptionType.Subcommand ||
                                                                                    option.type === OptionType.SubcommandGroup
                                                                            ).length > 0 ? (
                                                                                <h4>SubComandos</h4>
                                                                            ) : null}
                                                                            {command.options
                                                                                ? (
                                                                                      command.options.filter(
                                                                                          (option) =>
                                                                                              option.type === OptionType.Subcommand ||
                                                                                              option.type === OptionType.SubcommandGroup
                                                                                      ) as SubGroupData[] | SubCommandData[]
                                                                                  ).map((option) => (
                                                                                      <>
                                                                                          <p>
                                                                                              {/* Si es un Grupo de subcomandos */}
                                                                                              {option.type === OptionType.SubcommandGroup ? (
                                                                                                  <>
                                                                                                      <strong style={{ fontSize: 18 }}>
                                                                                                          Grupo {option.name}
                                                                                                      </strong>
                                                                                                      <p>{option.description}</p>
                                                                                                      {/* Opciones del comando */}
                                                                                                      {option.options
                                                                                                          ? option.options.map((op) => {
                                                                                                                return (
                                                                                                                    <div key={op.name} className="ps-1">
                                                                                                                        <span className="translate-middle border border-light" />
                                                                                                                        <span className="translate-middle border border-light" />
                                                                                                                        <code
                                                                                                                            className="codeCopy"
                                                                                                                            onClick={(e) =>
                                                                                                                                copyClipboard(
                                                                                                                                    e,
                                                                                                                                    `${command.name} `
                                                                                                                                )
                                                                                                                            }
                                                                                                                            style={{
                                                                                                                                margin: "0px 15px 0px 0px"
                                                                                                                            }}
                                                                                                                        >
                                                                                                                            {option.name} {op.name}
                                                                                                                        </code>{" "}
                                                                                                                        {op.description}
                                                                                                                        {/* Opciones del comando */}
                                                                                                                        {op.options ? (
                                                                                                                            <>
                                                                                                                                <h6>Opciones</h6>
                                                                                                                                <div
                                                                                                                                    key={op.name}
                                                                                                                                    className="ps-3"
                                                                                                                                >
                                                                                                                                    {op.options.map((op) =>
                                                                                                                                        OptionsComponent(
                                                                                                                                            command.name,
                                                                                                                                            op,
                                                                                                                                            copyClipboard
                                                                                                                                        )
                                                                                                                                    )}
                                                                                                                                </div>
                                                                                                                            </>
                                                                                                                        ) : null}
                                                                                                                    </div>
                                                                                                                );
                                                                                                            })
                                                                                                          : null}
                                                                                                  </>
                                                                                              ) : (
                                                                                                  <>
                                                                                                      {/* Si es subcomando */}
                                                                                                      <span className="translate-middle border border-light" />
                                                                                                      <span className="translate-middle border border-light" />
                                                                                                      <code
                                                                                                          className="codeCopy"
                                                                                                          onClick={(e) => copyClipboard(e, `${command.name} `)}
                                                                                                          style={{ margin: "0px 15px 0px 0px" }}
                                                                                                      >
                                                                                                          {option.name}
                                                                                                      </code>{" "}
                                                                                                      {option.description}
                                                                                                      {/* Opciones del comando */}
                                                                                                      {option.type === OptionType.Subcommand &&
                                                                                                      option.options ? (
                                                                                                          <>
                                                                                                              <h6>Opciones</h6>
                                                                                                              <div className="ps-3">
                                                                                                                  {option.options.map((op) =>
                                                                                                                      OptionsComponent(
                                                                                                                          command.name,
                                                                                                                          op,
                                                                                                                          copyClipboard
                                                                                                                      )
                                                                                                                  )}
                                                                                                              </div>
                                                                                                          </>
                                                                                                      ) : null}
                                                                                                  </>
                                                                                              )}
                                                                                          </p>
                                                                                      </>
                                                                                  ))
                                                                                : null}
                                                                            {/* Opciones del comando */}
                                                                            {command.options &&
                                                                            command.options.filter(
                                                                                (option) =>
                                                                                    option.type !== OptionType.Subcommand &&
                                                                                    option.type !== OptionType.SubcommandGroup
                                                                            ).length > 0 ? (
                                                                                <>
                                                                                    <h6>Opciones</h6>
                                                                                    {command.options
                                                                                        .filter(
                                                                                            (option) =>
                                                                                                option.type !== OptionType.Subcommand &&
                                                                                                option.type !== OptionType.SubcommandGroup
                                                                                        )
                                                                                        .map((option) => OptionsComponent(command.name, option, copyClipboard))}
                                                                                </>
                                                                            ) : null}
                                                                        </Accordion.Body>
                                                                    </Accordion.Item>
                                                                </Accordion>
                                                                <p></p>
                                                            </>
                                                        ))}
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

const OptionsComponent = (commandName: string, option: CommandOptionData, copyClipboard: Function) => {
    return (
        <>
            {option.required ? <span className="text-muted">Esta opción es obligatoria</span> : null}
            <p>
                <code>{option.name}</code> <span className="fw-light">({TypeSpanish[option.type]})</span> {option.description}
            </p>
            <p>
                {(option as ChoicesData).choices && (option as ChoicesData).choices!.length > 0 ? (
                    <>
                        <span className="ps-1 text-muted">Elecciones:</span>
                        <div className="ps-3">
                            {(option as ChoicesData).choices!.map((choice) => (
                                <code
                                    key={choice.value}
                                    className="codeCopy"
                                    onClick={(e) => copyClipboard(e, `${commandName} ${option.name}:`)}
                                    style={{ margin: "0px 15px 0px 0px" }}
                                >
                                    {choice.name}
                                </code>
                            ))}
                        </div>
                    </>
                ) : null}
            </p>
            <p className="ps-4 text-muted">
                {option.type === OptionType.Number &&
                (option as NumericOptionData).min_value != null &&
                (option as NumericOptionData).min_value !== undefined ? (
                    <>
                        <span className="fw-semibold">Valor Mínimo: </span>
                        {ConvertString((option as NumericOptionData).min_value!)}
                        <br />
                    </>
                ) : null}
                {option.type === OptionType.Number &&
                (option as NumericOptionData).max_value != null &&
                (option as NumericOptionData).max_value !== undefined ? (
                    <>
                        <span className="fw-semibold">Valor Máximo: </span>
                        {ConvertString((option as NumericOptionData).max_value!)}
                    </>
                ) : null}
            </p>
        </>
    );
};

const TypeSpanish = {
    [OptionType.Subcommand]: "SubComando",
    [OptionType.SubcommandGroup]: "Grupo de SubComandos",
    [OptionType.String]: "Texto",
    [OptionType.Integer]: "Número",
    [OptionType.Boolean]: "Verdadero/Falso",
    [OptionType.User]: "Usuario",
    [OptionType.Channel]: "Canal",
    [OptionType.Role]: "Rol",
    [OptionType.Mentionable]: "Mencionable",
    [OptionType.Number]: "Número",
    [OptionType.Attachment]: "Archivo/Imagen"
};
