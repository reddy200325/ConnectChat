export const requestLocation = () => {
  if (!navigator.geolocation) {
    return Promise.reject(new Error("Geolocation is not supported by your browser."));
  }

  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position) => resolve({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      }),
      (error) => reject(error)
    );
  });
};

export const requestCamera = async () => {
  try {
    if (!navigator.mediaDevices?.getUserMedia) {
      throw new Error("Media devices interface is not supported by your browser.");
    }
    return await navigator.mediaDevices.getUserMedia({ video: true });
  } catch (error) {
    throw error;
  }
};