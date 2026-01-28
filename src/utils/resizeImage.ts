export function resizeImageToBanner(
  file: File,
  targetWidth = 1200,
  targetHeight = 400,
  quality = 0.85
): Promise<File> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();

    reader.onload = e => {
      img.src = e.target?.result as string;
    };

    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = targetWidth;
      canvas.height = targetHeight;

      const ctx = canvas.getContext("2d");
      if (!ctx) return reject("Canvas não suportado");

      // Cálculo para "cover" sem distorcer
      const scale = Math.max(
        targetWidth / img.width,
        targetHeight / img.height
      );

      const x = (targetWidth - img.width * scale) / 2;
      const y = (targetHeight - img.height * scale) / 2;

      ctx.drawImage(
        img,
        x,
        y,
        img.width * scale,
        img.height * scale
      );

      canvas.toBlob(
        blob => {
          if (!blob) return reject("Erro ao gerar imagem");

          const resizedFile = new File([blob], file.name, {
            type: "image/jpeg",
            lastModified: Date.now(),
          });

          resolve(resizedFile);
        },
        "image/jpeg",
        quality
      );
    };

    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
