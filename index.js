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
  try {
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
  } catch (error) {
    return null;
  }
}

async function menu() {
  let run = true;

  //gestión de ticks
  let tick = 0;
  let tickInterval = setInterval(() => {
    if (huerta[0] !== undefined) {
      for (let cultivo of huerta) {
        cultivo.gestionarTick();
      }
    }
    tick++;
  }, 250);

  //gestión de huerta
  let huerta = [];
  let recolectados = [];
  let proximoId = 1;

  function getCultivo(id) {
    for (let cultivo of huerta) {
      if (cultivo.id == id) {
        return cultivo;
      }
    }
    return null;
  }

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
        try {
          const cultivoPlantado = await seleccionCultivo();
          huerta.push(
            new Cultivo(
              proximoId++,
              cultivoPlantado.nombre,
              cultivoPlantado.tiempo_regado,
              cultivoPlantado.tiempo_recoleccion,
            ),
          );
        } catch (error) {
          console.log("\n!! La selección no es válida");
        } finally {
          break;
        }

      //regar cultivo
      case "2":
        if (huerta[0] === undefined) {
          console.log("\n!! No hay cultivos en la huerta");
          break;
        }

        try {
          const idRegar = await input(
            "\nIntroduce el número identificador del cultivo\n> ",
          );
          const cultivoRegado = getCultivo(idRegar);
          cultivoRegado.regar();
        } catch (error) {
          console.log("\n!! El identificador no es válido");
        } finally {
          break;
        }

      //recolectar cultivo
      case "3":
        if (huerta[0] === undefined) {
          console.log("\n!! No hay cultivos en la huerta");
          break;
        }

        try {
          const idRecolectar = await input(
            "\nIntroduce el número identificador del cultivo\n> ",
          );
          const cultivoRecolectado = getCultivo(idRecolectar);
          if (cultivoRecolectado.recoger()) {
            huerta = huerta.filter((cultivo) => {
              if (cultivo.id !== cultivoRecolectado.id) {
                return true;
              } else {
                return false;
              }
            });
            recolectados.push(cultivoRecolectado);
          }
        } catch (error) {
          console.log("\n!! El identificador no es válido");
        } finally {
          break;
        }

      //listar cultivo
      case "4":
        if (huerta[0] === undefined) {
          console.log("\n!! No hay cultivos en la huerta");
          break;
        }

        let datosCultivos = [];
        for (let cultivo of huerta) {
          datosCultivos.push(cultivo.mostrar());
        }
        console.table(datosCultivos);
        break;

      //eliminar cultivo
      case "5":
        if (huerta[0] === undefined) {
          console.log("\n!! No hay cultivos en la huerta");
          break;
        }

        const idEliminar = await input(
          "\nIntroduce el número identificador del cultivo\n> ",
        );
        const cultivoEliminado = getCultivo(idEliminar);
        huerta = huerta.filter((cultivo) => {
          if (cultivo.id !== cultivoEliminado.id) {
            return true;
          } else {
            return false;
          }
        });
        console.log(
          `\n[ ${cultivoEliminado.nombre} ${cultivoEliminado.id} se ha eliminado ]`,
        );
        break;

      //consultar cultivos recolectados
      case "6":
        if (recolectados[0] === undefined) {
          console.log("\n!! No hay cultivos recolectados");
          break;
        }

        let datosRecolectados = [];
        for (let cultivo of recolectados) {
          datosRecolectados.push(cultivo.mostrar());
        }
        console.table(datosRecolectados);
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
