import { Injectable } from '@angular/core';
import { Firestore, collection, doc, getDocs, setDoc, deleteDoc, updateDoc, onSnapshot, query, QuerySnapshot, orderBy, Query, limit, DocumentSnapshot, getDoc, FieldPath, where, WhereFilterOp } from '@angular/fire/firestore';
import { Persona } from '../utils/classes/usuarios/persona';
import { ErrorCodes, Exception } from '../utils/classes/exception';
import { Observable } from 'rxjs';

export enum Colecciones {
  Usuarios = 'users',
  Mesas = 'mesas',
  Productos = 'productos',
  EncuestasCliente = 'encuestas-clientes',
  EncuestasEmpleado = 'encuestas-empleado',
  EncuestasSupervisor = 'encuestas-supervisor',
  ListaDeEspera = 'lista-de-espera',
  Pedidos = "pedidos",
  Mensajes = "mensajes",
}

declare type Constraint = { campo: string | FieldPath, operacion: WhereFilterOp, valor: unknown };
@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  constructor(private firestore: Firestore) { }

  /**
   * Trae un Array de objetos guardados en la colección especificada de `Firestore`.
   *
   * @async
   * @param coleccion - El nombre de la colección en `Firestore`.
   * @param ordenarPorCampo - El campo (propiedad del objeto) por el cual ordenar el array.
   * @returns Una promesa con los datos pedidos.
   *
   * Nota: Asegurarse que el campo existe en el objeto y en todas sus instancias de la colección,
   *  si no existe, el doc se omitirá del array final.
   */
  async traerColeccion<T>(coleccion: string, ordenarPorCampo?: string): Promise<Array<T>> {
    const col = collection(this.firestore, coleccion);

    let q: Query;
    if (ordenarPorCampo)
      q = query(col, orderBy(ordenarPorCampo));
    else
      q = query(col)

    const querySnapshot = await getDocs(q);
    const arrAux: Array<T> = [];

    querySnapshot.forEach((doc) => {
      arrAux.push(doc.data() as T);
    });

    return arrAux;
  }

  /**
   * Trae un único objeto guardado en el documento especificado de la colección de `Firestore`.
   *
   * @async
   * @param coleccion - El nombre de la colección en `Firestore`.
   * @param docId - El ID del documento a traer en la colección en `Firestore`.
   * @returns Una promesa con el dato pedido.
   */
  async traerDoc<T>(coleccion: string, docId: string): Promise<T> {
    const docRef = doc(this.firestore, coleccion, docId);

    const data = (await getDoc(docRef)).data();
    return data as T;
  }

  /**
   * Trae un Array de objetos que cumplan con la condición `constraint` guardados en
   *  la colección especificada de `Firestore`.
   *
   * @async
   * @param coleccion - El nombre de la colección en `Firestore`.
   * @param constraint - Objeto que contiene los tre parámetros de búsqueda.
   * @returns Una promesa con los datos pedidos.
   */
  async traerCoincidencias<T>(coleccion: string, constraint: Constraint): Promise<Array<T>> {
    const col = collection(this.firestore, coleccion);
    const q = query(col, where(constraint.campo, constraint.operacion, constraint.valor));

    const querySnapshot = (await getDocs(q));
    const arrAux: Array<T> = [];

    querySnapshot.forEach((doc) => {
      arrAux.push(doc.data() as T);
    });

    return arrAux;
  }

  /**
   * Sube un objeto a la colección de `Firestore` y asigna el ID del documento al campo ID del objeto (si se indica).
   *
   * @async
   * @param coleccion - El nombre de la colección en `Firestore`.
   * @param data - El objeto o dato a subir.
   * @param docIdAutom - Indica si la función debe o no asignar el ID del documento al objeto .
   * @returns El ID del documento en `Firestore`.
   *
   * @throws y elimina el documento si se encuentra con algún error a la hora de subir.
   */
  async subirDoc(coleccion: string, data: any, docIdAutom: boolean = true): Promise<string> {
    const col = collection(this.firestore, coleccion);
    const nuevoDoc = doc(col);
    if (docIdAutom)
      data.id = nuevoDoc.id;

    try {
      await setDoc(nuevoDoc, { ...data });
    } catch (error) {
      deleteDoc(nuevoDoc);
      console.error(error);
      throw new Exception(ErrorCodes.ActualizarDocError, 'Hubo un problema al subir los datos.');
    }

    return nuevoDoc.id;
  }

  /**
   * Actualiza un doc en la colección de `Firestore`.
   *
   * @param coleccion - El nombre de la colección en `Firestore`.
   * @param docId - El ID del documento a traer en la colección en `Firestore`.
   * @param data - Los datos a actualizar (puede ser un campo solo).
   * @returns Una promesa que se resuelve cuando el dato es actualizado correctamente.
   */
  actualizarDoc(coleccion: string, docId: string, data: any) {
    const docRef = doc(this.firestore, coleccion, docId);

    return updateDoc(docRef, { ...data });
  }

  /**
   * Escucha los cambios en una colección en `Firestore` y guarda los datos en un Array que
   *  recibe por parámetro y que funcionará como referencia para mantenerse actualizado.
   *
   * Los casos que verifica esta función son:
   * - Se *agrega* un documento a la colección y filtroFunc aprueba:
   *  Se suma al array.
   * - Se *agrega* un documento a la colección y filtroFunc no aprueba:
   *  No se suma al array.
   * - Se *modifica* un documento de la colección no existente en el array y filtroFunc aprueba:
   *  Se suma al array.
   * - Se *modifica* un documento de la colección no existente en el array y filtroFunc no aprueba:
   *  No se suma al array.
   * - Se *modifica* un documento de la colección ya existente en el array y filtroFunc aprueba:
   *  Se modifica el objeto en el array.
   * - Se *modifica* un documento de la colección ya existente en el array y filtroFunc no aprueba:
   *  Se borra el objeto del array.
   * - Se *borra* un documento de la colección ya existente en el array:
   *  Se borra el objeto del array.
   * - Se *borra* un documento de la colección no existente en el array:
   *  No hace nada.
   *
   * @param coleccion - El nombre de la colección en `Firestore`.
   * @param arrayRef - El Array que guardará los objetos.
   * @param filtroFunc - Función que se encarga de filtrar los datos cada vez que se actualizan.
   * @param ordenFunc - Función que se encarga de ordenar los datos cada vez que se actualizan.
   * @param transformar - Función que se encarga de transformar los datos cada vez que se actualizan.
   *
   * Nota: El tipo de dato u objeto debe tener un campo `id: string`.
   */
  escucharColeccion<T extends { id: string }>(
    coleccion: string,
    arrayRef: Array<T>,
    filtroFunc?: (item: T) => boolean,
    ordenFunc?: (a: any, b: any) => number,
    transformar?: (item: T) => Promise<T>
  ) {
    const col = collection(this.firestore, coleccion);
    const q = query(col);

    onSnapshot(q, async (addSnap: QuerySnapshot) => {
      for (const cambio of addSnap.docChanges()) {
        const data = cambio.doc.data();
        const newData = transformar ? await transformar(data as T) : data as T;
        const pasaFiltro = (!filtroFunc || filtroFunc(newData));

        if (cambio.type === 'added') {
          if (pasaFiltro) arrayRef.push(newData);
        } else {
          const index = arrayRef.findIndex(t => t.id === newData.id);
          if (index === -1) {
            if (pasaFiltro) arrayRef.push(newData);
          } else {
            if (cambio.type === 'modified' && pasaFiltro) {
              arrayRef[index] = newData;
            } else
              arrayRef.splice(index, 1);
          }
        }
      }

      if (ordenFunc)
        arrayRef.sort(ordenFunc);
    });
  }

  /**
   * Escucha los cambios en un documento en `Firestore` y devuelve un Observable que
   * emite los datos del documento cada vez que se actualizan.
   * 
   * @param coleccion - El nombre de la colección en `Firestore`.
   * @param docId - El ID del documento en `Firestore`.
   * @returns Un Observable que emite los datos del documento.
   */
  escucharDocumento<T>(coleccion: string, docId: string): Observable<T> {
    return new Observable<T>((obs) => {
      const docRef = doc(this.firestore, `${coleccion}/${docId}`);

      const unsubscribe = onSnapshot(docRef, async (docSnap: DocumentSnapshot) => {
        if (docSnap.exists()) {
          let data = docSnap.data() as T;
          obs.next(data);
        } else {
          obs.error('El documento no existe.');
        }
      });

      return () => unsubscribe();
    });
  }

  borrarDoc(coleccion: string, docId: string) {
    const docRef = doc(this.firestore, coleccion, docId);

    return deleteDoc(docRef);
  }

  /**
   * Busca el usuario que tenga registrado su correo con el parámetro de búsqueda.
   * Por predeterminado busca en la colección `users`.
   *
   * @async
   * @param correo - Correo a buscar.
   * @returns Si lo encuentra, el usuario con el correo indicado.
   *
   * @throws Si no se encuentra el correo.
   */
  async buscarUsuarioPorCorreo(correo: string): Promise<Persona> {
    const usuarios = await this.traerColeccion<Persona>(Colecciones.Usuarios);
    const index = usuarios.findIndex(u => u.correo === correo);
    if (index === -1) throw new Exception(ErrorCodes.CorreoNoRegistrado, 'Esta dirección de correo no está registrada.');

    return usuarios[index];
  }

  /**
   * Busca el usuario que tenga registrado su DNI con el parámetro de búsqueda.
   * Por predeterminado busca en la colección `users`.
   *
   * @async
   * @param dni - DNI a buscar.
   * @returns Si lo encuentra, el usuario con el DNI indicado.
   *
   * @throws Si no se encuentra el DNI.
   */
  async buscarUsuarioPorDni(dni: number): Promise<Persona> {
    const usuarios = await this.traerColeccion<Persona>(Colecciones.Usuarios);
    const index = usuarios.findIndex(u => u.dni === dni);
    if (index === -1) throw new Exception(ErrorCodes.DniNoRegistrado, 'Este DNI no está registrado.');

    return usuarios[index];
  }
}
