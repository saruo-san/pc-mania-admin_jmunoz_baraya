import { fetchAuthSession } from 'aws-amplify/auth';
import { config } from './config';

export interface Producto {
  id: number;
  nombre: string;
  marca: string;
  categoria: string;
  precio: number;
  stock: number;
}

export interface NuevoProducto {
  nombre: string;
  marca: string;
  categoria: string;
  precio: number;
  stock: number;
}

export async function apiFetch(path: string, options: RequestInit = {}): Promise<Response> {
  const session = await fetchAuthSession();
  const token = session.tokens?.accessToken?.toString();

  return fetch(`${config.apiUrl}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
}

export async function agregarProducto(datos: NuevoProducto): Promise<Producto> {
  const response = await apiFetch('/api/productos', {
    method: 'POST',
    body: JSON.stringify(datos),
  });
  if (!response.ok) {
    const cuerpo = await response.json().catch(() => null);
    throw new Error(cuerpo?.mensaje ?? `El backend respondio ${response.status} al agregar el producto`);
  }
  return response.json();
}

export async function obtenerCatalogo(): Promise<Producto[]> {
  const response = await apiFetch('/api/productos');
  if (!response.ok) {
    throw new Error(`El backend respondio ${response.status} al pedir el inventario`);
  }
  return response.json();
}

export async function eliminarProducto(id: number): Promise<void> {
  const response = await apiFetch(`/api/productos/${id}`, { method: 'DELETE' });
  if (!response.ok) {
    const cuerpo = await response.json().catch(() => null);
    throw new Error(cuerpo?.mensaje ?? `El backend respondio ${response.status} al eliminar el producto`);
  }
}

export async function actualizarProducto(id: number, datos: NuevoProducto): Promise<Producto> {
  const response = await apiFetch(`/api/productos/${id}`, {
    method: 'PUT',
    body: JSON.stringify(datos),
  });
  if (!response.ok) {
    const cuerpo = await response.json().catch(() => null);
    throw new Error(cuerpo?.mensaje ?? `El backend respondio ${response.status} al actualizar el producto`);
  }
  return response.json();
}
