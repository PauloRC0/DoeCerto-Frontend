import { api } from "./api";

export async function createDonation(payload: {
  ongId: number;
  donationType: string;
  materialDescription: string;
  materialQuantity: number;
}) {
  const formData = new FormData();
  
  // O @Type(() => Number) no DTO vai converter essas strings
  formData.append('ongId', String(payload.ongId));
  
  // MUDANÇA CRUCIAL: Tente enviar em minúsculo
  formData.append('donationType', 'material'); 
  
  formData.append('materialDescription', String(payload.materialDescription));
  formData.append('materialQuantity', String(payload.materialQuantity));

  return api("/donations", {
    method: "POST",
    body: formData, 
  });
}