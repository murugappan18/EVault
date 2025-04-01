export const pinFileToIPFS = async (file) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    formData.append("network", "public");

    const response = await fetch("https://uploads.pinata.cloud/v3/files", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.REACT_APP_PINATA_JWT}`, // Replace with your JWT token
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Pinata API error: ${response.statusText}`);
    }

    return await response.json();
  } 
  catch (error) {
    throw error;
  }
};