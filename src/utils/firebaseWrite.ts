// Firebase write utility for equipment reset functionality
export interface ResetResponse {
  success: boolean;
  error?: string;
  data?: any;
}

export interface ResetStatus {
  success: boolean;
  error?: string;
  currentValue?: number;
}

export const resetEquipment = async (resetValue: number = 1): Promise<ResetResponse> => {
  const resetEndpoint = 'https://prueba-labview-default-rtdb.firebaseio.com/BASE_DATOS/PRUEBA/RESETAURI.json';
  
  try {
    const response = await fetch(resetEndpoint, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        RESET: resetValue.toString()
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return {
      success: true,
      data
    };
  } catch (error) {
    console.error('Error resetting equipment:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};

export const queryResetStatus = async (): Promise<ResetStatus> => {
  const resetEndpoint = 'https://prueba-labview-default-rtdb.firebaseio.com/BASE_DATOS/PRUEBA/RESETAURI.json';
  
  try {
    const response = await fetch(resetEndpoint);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    const currentValue = parseInt(data.RESET || '0');
    
    return {
      success: true,
      currentValue
    };
  } catch (error) {
    console.error('Error querying reset status:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};

export const executeReset = async (): Promise<ResetResponse> => {
  return await resetEquipment(1);
};

export const toggleResetValue = async (currentValue: number): Promise<ResetResponse> => {
  const newValue = currentValue === 0 ? 1 : 0;
  return await resetEquipment(newValue);
};