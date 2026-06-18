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

  console.clear();
  let cultivoEscogido = await input(
    "\nCULTIVOS DISPONIBLES\n" +
      seleccionCultivos +
      "\n\nSelecciona una opción\n(Presiona enter para cancelar)\n> ",
  );
  if (cultivoEscogido == "") {
    return null;
  }

  cultivoEscogido = parseInt(cultivoEscogido) - 1;

  return cultivos[cultivoEscogido];
}

async function seleccionRegar() {}

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

  console.clear();
  while (run) {
    const opcion = await input(
      "\n~~  LA HUERTA  ~~\n" +
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
          if (cultivoPlantado === null) {
            console.clear();
            break;
          }

          huerta.push(
            new Cultivo(
              proximoId,
              cultivoPlantado.nombre,
              cultivoPlantado.tiempo_regado,
              cultivoPlantado.tiempo_recoleccion,
            ),
          );
          console.clear();
          console.log(
            `\n[ ${cultivoPlantado.nombre} ${proximoId++} se ha plantado ]`,
          );
        } catch (error) {
          console.clear();
          console.log("\n!! La selección no es válida");
        } finally {
          break;
        }

      //regar cultivo
      case "2":
        if (huerta[0] === undefined) {
          console.clear();
          console.log("\n!! No hay cultivos en la huerta");
          break;
        }

        try {
          let cultivosRegables = "";
          for (let cultivo of huerta) {
            if (cultivo.regado == false && cultivo.muerto == false) {
              cultivosRegables += `\n${cultivo.id}. ${cultivo.nombre}`;
            }
          }
          if (cultivosRegables == "") {
            console.clear();
            console.log("\n!! No hay ningún cultivo vivo y seco ahora mismo");
            break;
          }

          console.clear();
          const idRegar = await input(
            "\nCULTIVOS PARA REGAR" +
              cultivosRegables +
              "\n\nIntroduce el número identificador del cultivo\n(Presiona enter para cancelar)\n> ",
          );
          if (idRegar == "") {
            console.clear();
            break;
          }

          const cultivoRegado = getCultivo(idRegar);
          console.clear();
          cultivoRegado.regar();
        } catch (error) {
          console.clear();
          console.log("\n!! El identificador no es válido");
        } finally {
          break;
        }

      //recolectar cultivo
      case "3":
        if (huerta[0] === undefined) {
          console.clear();
          console.log("\n!! No hay cultivos en la huerta");
          break;
        }

        try {
          let cultivosRecolectables = "";
          for (let cultivo of huerta) {
            if (cultivo.maduro == true && cultivo.muerto == false) {
              cultivosRecolectables += `\n${cultivo.id}. ${cultivo.nombre}`;
            }
          }
          if (cultivosRecolectables == "") {
            console.clear();
            console.log(
              "\n!! No hay ningún cultivo que se pueda recolectar ahora mismo",
            );
            break;
          }

          console.clear();
          const idRecolectar = await input(
            "\nCULTIVOS PARA RECOLECTAR" +
              cultivosRecolectables +
              "\n\nIntroduce el número identificador del cultivo\n(Presiona enter para cancelar)\n> ",
          );
          if (idRecolectar == "") {
            console.clear();
            break;
          }

          const cultivoRecolectado = getCultivo(idRecolectar);
          console.clear();
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
          console.clear();
          console.log("\n!! El identificador no es válido");
        } finally {
          break;
        }

      //listar cultivo
      case "4":
        if (huerta[0] === undefined) {
          console.clear();
          console.log("\n!! No hay cultivos en la huerta");
          break;
        }

        function mostrarHuerta() {
          let datosCultivos = [];
          for (let cultivo of huerta) {
            datosCultivos.push(cultivo.mostrar());
          }

          console.clear();
          console.table(datosCultivos);
          console.log("Presiona enter para volver");
        }

        mostrarHuerta();
        let listInterval = setInterval(mostrarHuerta, 1000);
        await input("");
        clearInterval(listInterval);
        console.clear();
        break;

      //eliminar cultivo
      case "5":
        if (huerta[0] === undefined) {
          console.clear();
          console.log("\n!! No hay cultivos en la huerta");
          break;
        }

        try {
          let cultivosEliminables = "";
          for (let cultivo of huerta) {
            cultivosEliminables += `\n${cultivo.id}. ${cultivo.nombre}. Estado: ${cultivo.mostrar().estado}`;
          }

          console.clear();
          const idEliminar = await input(
            "\nCULTIVOS PARA ELIMINAR" +
              cultivosEliminables +
              "\nIntroduce el número identificador del cultivo\n(Presiona enter para cancelar)\n> ",
          );
          if (idEliminar == "") {
            console.clear();
            break;
          }

          const cultivoEliminado = getCultivo(idEliminar);
          huerta = huerta.filter((cultivo) => {
            if (cultivo.id !== cultivoEliminado.id) {
              return true;
            } else {
              return false;
            }
          });

          console.clear();
          console.log(
            `\n[ ${cultivoEliminado.nombre} ${cultivoEliminado.id} se ha eliminado ]`,
          );
        } catch (error) {
          console.clear();
          console.log("\n!! El identificador no es válido");
        } finally {
          break;
        }

      //consultar cultivos recolectados
      case "6":
        if (recolectados[0] === undefined) {
          console.clear();
          console.log("\n!! No hay cultivos recolectados");
          break;
        }

        let datosRecolectados = [];
        for (let cultivo of recolectados) {
          datosRecolectados.push(cultivo.mostrar());
        }

        console.clear();
        console.table(datosRecolectados);
        await input("Presiona enter para volver");
        console.clear();
        break;

      case "7":
        run = false;
        clearInterval(tickInterval);
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
        console.clear();
        console.log("\n!! No es una opción válida");
        break;
    }
  }

  rl.close();
}

await menu();
