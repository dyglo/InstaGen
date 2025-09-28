
import { GoogleGenAI, Modality } from "@google/genai";

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = error => reject(error);
  });
};

export const generateImage = async (prompt: string): Promise<{ base64Image: string }> => {
  try {
    const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: prompt,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/jpeg',
          aspectRatio: '1:1',
        },
    });

    if (!response.generatedImages || response.generatedImages.length === 0) {
      throw new Error("API did not return an image.");
    }
    
    const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
    return { base64Image: base64ImageBytes };

  } catch (error) {
    console.error("Error generating image with Gemini:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to generate image: ${error.message}`);
    }
    throw new Error("An unknown error occurred while generating the image.");
  }
};


export const editImage = async (
  base64ImageData: string,
  mimeType: string,
  prompt: string
): Promise<{ base64Image: string, textResponse: string }> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image-preview',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64ImageData,
              mimeType: mimeType,
            },
          },
          {
            text: prompt,
          },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
    });

    let newBase64Image: string | null = null;
    let textResponse = "Image generated successfully.";

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        newBase64Image = part.inlineData.data;
      } else if (part.text) {
        textResponse = part.text;
      }
    }

    if (!newBase64Image) {
      throw new Error("API did not return an image. It might have refused the request.");
    }

    return { base64Image: newBase64Image, textResponse };

  } catch (error) {
    console.error("Error editing image with Gemini:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to generate image: ${error.message}`);
    }
    throw new Error("An unknown error occurred while generating the image.");
  }
};

export const generateVideo = async (prompt: string, aspectRatio: string, onProgress: (message: string) => void): Promise<{ videoUrl: string }> => {
  try {
    onProgress('Starting video generation...');
    let operation = await ai.models.generateVideos({
      model: 'veo-2.0-generate-001',
      prompt: prompt,
      config: {
        numberOfVideos: 1,
        aspectRatio: aspectRatio,
      }
    });

    onProgress('Your request is being processed. This can take a few minutes...');
    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 10000));
      onProgress('Checking status...');
      operation = await ai.operations.getVideosOperation({ operation: operation });
    }
    onProgress('Generation complete! Fetching video...');
    
    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (!downloadLink) {
        throw new Error("Video generation completed, but no video URI was provided.");
    }

    const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
    if (!response.ok) {
        throw new Error(`Failed to download video: ${response.statusText}`);
    }
    const blob = await response.blob();
    
    const videoDataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
            if (reader.result) {
                resolve(reader.result as string);
            } else {
                reject(new Error("Failed to read video blob."));
            }
        };
        reader.onerror = (error) => {
            reject(new Error(`Failed to convert video blob to base64: ${error}`));
        };
    });
    
    onProgress('Done!');
    return { videoUrl: videoDataUrl };

  } catch (error) {
    console.error("Error generating video with Gemini:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to generate video: ${error.message}`);
    }
    throw new Error("An unknown error occurred while generating the video.");
  }
};
