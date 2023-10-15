async function sendImageToApi(image: File, apiUrl: string): Promise<Response> {
    const formData = new FormData();
    formData.append('image', image);

    const response = await fetch(apiUrl, {
        method: 'POST',
        body: formData,
    });

    return response;
}

export default sendImageToApi