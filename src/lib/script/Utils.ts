export function areDictionariesEqual(dict1: { [x: string]: any; }, dict2: { [x: string]: any; }) {
    const keys1 = Object.keys(dict1);
    const keys2 = Object.keys(dict2);
  
    if (keys1.length !== keys2.length) {
      return false;
    }
  
    for (const key of keys1) {
      if (dict1[key] !== dict2[key]) {
        return false;
      }
    }
  
    return true;
  }
  