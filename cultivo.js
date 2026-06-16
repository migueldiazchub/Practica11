import { DateTime as dt } from "luxon";

/*
    id: number
    nombre: string
    duracion_regado: number
    regado: boolean
    regado_restante: number
    tiempo_sin_regar: number
    total_regado: number
    tiempo_recoleccion: number
    maduro: boolean
    muerto: boolean
*/

export class Cultivo {
  //contadores de ticks
  //ticks restantes para dejar de estar húmedo
  regado_restante = 0;
  //ticks que ha pasado seco
  tiempo_sin_regar = 0;
  //ticks totales que ha pasado húmedo
  total_regado = 0;
  //ticks que ha pasado maduro
  total_maduro = 0;

  //estados
  //estado seco o húmedo
  regado = false;
  //maduro es true si el total regado llega al tiempo de recoleccion
  maduro = false;
  //muerto es true si el tiempo sin regar llega al doble del tiempo de regado
  // o si los ticks que ha pasado maduro llegan al doble del tiempo de recolección
  muerto = false;
  //recogido es true si se ha recogido tras volverse maduro
  recogido = false;

  constructor(id, nombre, tiempo_regado, tiempo_recoleccion) {
    this.id = id;
    this.nombre = nombre;
    this.duracion_regado = tiempo_regado;
    this.tiempo_recoleccion = tiempo_recoleccion;
  }

  gestionarTick() {
    //contadores de ticks, solo se gestionan si el cultivo está vivo
    if (!this.muerto) {
      if (this.regado) {
        this.regado_restante--;
        this.total_regado++;
      } else {
        this.tiempo_sin_regar++;
      }
      if (this.maduro) {
        this.total_maduro++;
      }
    }

    //cambios de estado
    if (this.regado_restante <= 0 && this.regado) {
      this.secar();
    }

    if (this.tiempo_sin_regar >= this.duracion_regado * 2 && !this.muerto) {
      this.morir();
    }

    if (this.total_maduro >= this.tiempo_recoleccion * 2 && !this.muerto) {
      this.morir();
    }

    //no quiero que pueda morirse y madurar en el mismo tick
    if (!this.muerto) {
      if (this.total_regado >= this.tiempo_recoleccion && !this.maduro) {
        this.madurar();
      }
    }
  }

  //cambios de estado automáticos
  secar() {
    this.regado = false;
    console.log(`\n[ ${this.nombre} ${this.id} se ha secado ]`);
  }

  madurar() {
    this.maduro = true;
    console.log(
      `\n[ ${this.nombre} ${this.id} ha madurado y puede recolectarse ]`,
    );
  }

  morir() {
    this.muerto = true;
    console.log(`\n[ ${this.nombre} ${this.id} ha muerto... ]`);
  }

  //cambios de estado manuales; los activa el usuario
  regar() {
    if (this.muerto) {
      console.log(
        "\n!! Este cultivo no se puede regar porque está muerto; solo puede ser eliminado",
      );
    } else {
      if (this.regado) {
        console.log("\n!! Este cultivo todavía está húmedo");
      } else {
        this.regado = true;
        this.regado_restante = this.duracion_regado;
        this.tiempo_sin_regar = 0;
        console.log(`\n[ ${this.nombre} ${this.id} se ha regado ]`);
      }
    }
  }

  recoger() {
    if (this.muerto) {
      console.log(
        "\n!! Este cultivo no se puede recoger porque está muerto; solo puede ser eliminado",
      );
      return false;
    } else {
      if (!this.maduro) {
        console.log(
          "\n!! Este cultivo no se puede recolectar porque no está maduro todavía",
        );
      } else {
        this.recogido = true;
        console.log(`\n[ ${this.nombre} ${this.id} se ha recolectado]`);
        return true;
      }
    }
  }
}
