// lib/api.ts
// export async function apiFetch<T>(url: string): Promise<T> {
//   const response = await fetch(url);
//   if (!response.ok) {
//     // Bisa tangani error sesuai dengan ProblemDetails
//     const errorData = await response.json();
//     throw new Error(errorData.detail || "API request failed");
//   }
//   return response.json();
// }
