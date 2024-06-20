import { Injectable } from '@angular/core';
import { ListResult, Storage, getDownloadURL, listAll, ref, uploadBytes } from '@angular/fire/storage';

@Injectable({
	providedIn: 'root'
})
export class StorageService {
	constructor(private storage: Storage) { }

  /**
   * Sube un archivo a `Firebase Storage` y retorna su link de descarga.
   * 
   * @param archivo - El archivo a subir.
   * @param ruta - El conjunto de carpetas y el nombre del archivo (dir1/dir2/archivo).
   * @returns El link de descarga del archivo.
   */
	async subirArchivo(archivo: File, ruta: string): Promise<string> {
		const refArchivo = ref(this.storage, ruta);
		try {
      await uploadBytes(refArchivo, archivo);

			return await getDownloadURL(refArchivo);
		} catch (error) {
			throw Error('Hubo un problema al subir el archivo.');
		}
	}

  /**
   * Consigue el link de descarga del archivo guardado en `Firebase Storage`.
   * 
   * @async
   * @param ruta - El conjunto de carpetas y el nombre del archivo (dir1/dir2/archivo).
   * @returns El link de descarga del archivo.
   */
  async linkDeDescarga(ruta: string): Promise<string> {
    const refArchivo = ref(this.storage, ruta);
    return await getDownloadURL(refArchivo);
  }

  /**
   * Trae una lista con los archivos guardados en `Firebase Storage`.
   * 
   * @param ruta - El conjunto de carpetas donde se encuentran los archivos.
   * @returns Un objeto de tipo `ListResult`.
   */
  async traerTodosLosArchivos(ruta: string): Promise<ListResult> {
    const refLista = ref(this.storage, ruta);
    return await listAll(refLista)
  }
}