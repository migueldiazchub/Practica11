import { DateTime as dt } from "luxon";

export class Cultivo {
  //estado seco o húmedo
  regado = false;
  //ticks restantes para dejar de estar húmedo
  regado_restante = 0;
  //ticks que ha pasado seco
  tiempo_sin_regar = 0;
  //ticks totales que ha pasado húmedo
  total_regado = 0;
  //maduro es true si el total regado llega al tiempo de recoleccion
  maduro = false;
  //ticks que ha pasado maduro
  total_maduro = 0;
  //muerto es true si el tiempo sin regar llega al doble del tiempo de regado
  // o si los ticks que ha pasado maduro llegan al doble del tiempo de recolección
  muerto = false;
  //recogido es true si se ha recogido tras volverse maduro
  recogido = false;

  constructor(nombre, tiempo_regado, tiempo_recoleccion) {
    this.nombre = nombre;
    this.duracion_regado = tiempo_regado;
    this.tiempo_recoleccion = tiempo_recoleccion;
  }

  regar() {
    this.regado = true;
    this.regado_restante = this.tiempo_regado;
    this.tiempo_sin_regar = 0;
  }
}

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
