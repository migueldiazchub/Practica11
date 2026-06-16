import readline from "readline";
import { DateTime as dt } from "luxon";
import { readFile, writeFile } from "fs/promises";
import { Cultivo } from "./cultivo.js";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function input(query) {
  return new Promise((resolve) => {
    rl.question(query, resolve);
  });
}

async function getFile(nombre) {
  try {
    const path = nombre + ".json";
    const datos = await readFile(path);
    return JSON.parse(datos);
  } catch (error) {
    console.log(error);
  }
}

async function seleccionCultivo() {
  const cultivos = await getFile("cultivos");
  let seleccionCultivos = "";
  for (let i = 0; i < cultivos.length; i++) {
    seleccionCultivos += `\n${i + 1}. ${cultivos[i].nombre}`;
  }
  let cultivoEscogido = await input(
    seleccionCultivos + "\n\nSelecciona una opción\n> ",
  );
  cultivoEscogido = parseInt(cultivoEscogido) - 1;
  return cultivos[cultivoEscogido];
}

async function menu() {
  let run = true;

  //gestión de ticks
  let tick = 0;
  let tickInterval = setInterval(() => {
    tick++;
  }, 250);

  //gestión de huerta
  let huerta = [];

  while (run) {
    const opcion = await input(
      "\nHUERTA" +
        "\n1. Plantar cultivo" +
        "\n2. Regar cultivo" +
        "\n3. Recolectar cultivo" +
        "\n4. Listar cultivos" +
        "\n5. Eliminar cultivo" +
        "\n6. Consultar cultivos recolectados" +
        "\n7. Cerrar" +
        "\n\nSelecciona una opción\n> ",
    );

    switch (opcion) {
      //plantar cultivo
      case "1":
        const cultivoPlantado = await seleccionCultivo();
        console.log(cultivoPlantado);
        break;

      //regar cultivo
      case "2":
        break;

      //recolectar cultivo
      case "3":
        break;

      //listar cultivo
      case "4":
        break;

      //eliminar cultivo
      case "5":
        break;

      //consultar cultivos recolectados
      case "6":
        break;

      case "7":
        run = false;
        break;

      case "t":
        console.log("ticks: " + tick);
        break;

      case "s":
        console.log("segundos: " + tick / 4);
        break;

      case "q":
        run = false;
        clearInterval(tickInterval);
        console.log(
          "Ejecución terminada en el tick " +
            tick +
            "\nHan pasado " +
            tick / 4 +
            " segundos",
        );
        break;

      default:
        break;
    }
  }

  rl.close();
}

await menu();
