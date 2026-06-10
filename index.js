import readline from "readline";
import { DateTime as dt } from "luxon";
import { readFile, writeFile } from "fs/promises";

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

async function menu() {
  let run = true;
  const cultivos = await getFile("cultivos");
  console.log(cultivos);

  while (run) {
    const opcion = await input("> ");

    switch (opcion) {
      //plantar cultivo
      case "1":
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

      case "q":
        run = false;
        break;

      default:
        break;
    }
  }

  rl.close();
}

await menu();
