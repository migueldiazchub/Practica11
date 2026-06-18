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

    //fechas
    this.fecha_plantado = dt.now();
    this.fecha_cambio_humedad = dt.now();
  }

  mostrar() {
    /* campos, si está recogido solo muestra los dos primeros
        id
        cultivo
        estados: seco, creciendo, maduro, muerto
        regado: sí o no
        segundos para secarse
        segundos para madurar
      */

    let datos = {
      id: this.id,
      cultivo: this.nombre,
    };
    if (!this.recogido) {
      if (this.muerto) {
        datos.estado = "muerto";
      } else {
        if (this.maduro) {
          datos.estado = "maduro";
        } else {
          if (this.regado) {
            datos.estado = "creciendo";
          } else {
            datos.estado = "seco";
          }
        }
      }

      if (this.regado) {
        datos.regado = "sí";
      } else {
        datos.regado = "no";
      }

      datos["tiempo hasta secarse"] = this.conversionTiempo(
        Math.floor(this.regado_restante / 4),
      );

      datos["tiempo hasta morirse"] = this.conversionTiempo(
        Math.floor(
          (this.duracion_regado * 2) / 4 -
            this.tiempo_sin_regar / 4 +
            this.regado_restante / 4,
        ),
      );

      if (this.maduro) {
        datos["tiempo hasta madurar"] = "0 segundos";
      } else {
        datos["tiempo hasta madurar"] = this.conversionTiempo(
          Math.floor((this.tiempo_recoleccion - this.total_regado) / 4),
        );
      }
    } else {
      datos["fecha de plantación"] = dt
        .fromISO(this.fecha_plantado)
        .toLocaleString(dt.DATETIME_SHORT);
      datos["fecha de recogida"] = dt
        .fromISO(this.fecha_recogida)
        .toLocaleString(dt.DATETIME_SHORT);
    }

    return datos;
  }

  conversionTiempo(segundos) {
    let minutos = Math.floor(segundos / 60);
    if (minutos == 0) {
      return `${segundos} segundos`;
    } else {
      segundos -= minutos * 60;
      let horas = Math.floor(minutos / 60);
      if (horas == 0) {
        return `${minutos}:${segundos}`;
      } else {
        minutos -= horas * 60;
        return `${horas}:${minutos}:${segundos}`;
      }
    }
  }

  actualizarContadores() {
    if (!this.muerto) {
      let ticksOcurridos = Math.floor(
        (dt.now().toMillis() -
          dt.fromISO(this.fecha_cambio_humedad).toMillis()) /
          250,
      );
      let contarTicksSeco = true;

      if (this.regado) {
        this.regado_restante -= ticksOcurridos;
        if (this.regado_restante < 0) {
          this.regado_restante = 0;
          this.secar();
        } else {
          contarTicksSeco = false;
        }

        this.total_regado += ticksOcurridos;

        if (this.total_maduro >= this.tiempo_recoleccion * 2 && !this.muerto) {
          this.morir();
        }

        if (
          this.total_regado >= this.tiempo_recoleccion &&
          !this.maduro &&
          !this.muerto
        ) {
          this.madurar();
        }
      }

      if (contarTicksSeco) {
        this.tiempo_sin_regar += ticksOcurridos;

        if (this.tiempo_sin_regar >= this.duracion_regado * 2 && !this.muerto) {
          this.morir();
        }
      }
    }
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

    if (
      this.total_regado >= this.tiempo_recoleccion &&
      !this.maduro &&
      !this.muerto
    ) {
      this.madurar();
    }
  }

  //cambios de estado automáticos
  secar() {
    this.regado = false;
    this.fecha_cambio_humedad = dt.now();
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
        this.fecha_cambio_humedad = dt.now();
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
        this.fecha_recogida = dt.now();
        console.log(`\n[ ${this.nombre} ${this.id} se ha recolectado]`);
        return true;
      }
    }
  }
}
