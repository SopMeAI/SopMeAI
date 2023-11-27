export async function sendImageToApi(images: File[], apiUrl: string): Promise<Response> {
    const formData = new FormData();

    images.forEach((image) => {
        formData.append('images', image);
    }
    )
    const response = await fetch(apiUrl, {
        method: 'POST',
        mode: 'cors',
        body: formData,
    });

    return response;
}

export async function SendPromptToGpt(prompt: string, apiUrl: string): Promise<Response> {
    const response = await fetch(apiUrl, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
    });

    return response;
}