class Cultivo {
  constructor(nombre, tiempo_regado, tiempo_recoleccion) {
    this.nombre = nombre;
    this.duracion_regado = tiempo_regado;
    this.regado = false;
    this.regado_restante = 0;
    this.tiempo_sin_regar = 0;
    this.total_regado = 0;
    this.tiempo_recoleccion = tiempo_recoleccion;
    this.maduro = false;
    this.muerto = false;
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

export default Cultivo;
