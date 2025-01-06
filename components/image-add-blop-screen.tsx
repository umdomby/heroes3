"use client";

import React, {useState} from "react";
import imageCompression from "browser-image-compression";

interface ImageAddBlobScreenProps {
    onFormDataReady: (formData: FormData) => void; // Функция передачи FormData
}

const ImageAddBlobScreen: React.FC<ImageAddBlobScreenProps> = ({onFormDataReady}) => {
    const [preview, setPreview] = useState<string | null>(null); // Для превью изображения

    const handlePaste = async (event: React.ClipboardEvent) => {
        const clipboardItems = event.clipboardData.items; // Получаем элементы буфера обмена
        for (const item of clipboardItems) {
            if (item.type.startsWith("image/")) {
                const file = item.getAsFile(); // Извлекаем файл
                if (file) {

                    // Готовим FormData
                    const form = new FormData();

                    if (file.size > 2 * 1000 * 1024) {
                        console.log("yes")
                        const options = {
                            maxSizeMB: 2, // Максимальный размер в мегабайтах
                            maxWidthOrHeight: 1920, // Максимальная ширина или высота
                            useWebWorker: true, // Использовать веб-воркеры для повышения производительности
                        };
                        const compressedFile = await imageCompression(file, options);
                        form.append('image', compressedFile, file.name || "screenshot.png");
                        // Передаём готовый FormData через callback
                        onFormDataReady(form);
                    } else {
                        console.log("no")
                        form.append('image', file, file.name || "screenshot.png");
                        // Передаём готовый FormData через callback
                        onFormDataReady(form);
                    }

                    // Устанавливаем превью
                    const reader = new FileReader();
                    reader.onload = () => {
                        if (typeof reader.result === "string") {
                            setPreview(reader.result); // Отображает превью
                        }
                    };
                    reader.readAsDataURL(file);
                }
            }
        }
    };

    return (
        <div className="m-2">
            <div
                onPaste={handlePaste}
                style={{
                    border: "1px dashed #ccc",
                    padding: "2px",
                    textAlign: "center",
                }}
            >
                <h2>Buffer input Ctrl+V</h2>
                {preview && (
                    <div>
                        {/*<h3>Предпросмотр:</h3>*/}
                        <img src={preview} alt="Preview" style={{maxWidth: "100%"}}/>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ImageAddBlobScreen;